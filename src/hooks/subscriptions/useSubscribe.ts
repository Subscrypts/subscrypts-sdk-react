/**
 * useSubscribe Hook
 *
 * Execute subscription creation with SUBS or USDC payment
 */

import { useState, useCallback } from 'react';
import { useSubscrypts } from '../../context/SubscryptsContext';
import { PaymentMethod } from '../../types';
import { ContractService, TokenService } from '../../services';
import { getSubscryptsContractAddress, TOKEN_DECIMALS, DEFAULTS, PERMIT2_ADDRESS, DEX_QUOTER_ADDRESS } from '../../constants';
import { validatePlanId, validateCycleLimit } from '../../utils/validators';
import { TransactionError, InsufficientBalanceError, ContractError } from '../../utils/errors';
import { generatePermit2Signature } from '../../utils/permit.utils';
import { DEX_QUOTER_ABI } from '../../utils/abi';
import { ZeroAddress, Contract } from 'ethers';

/**
 * Subscription parameters
 */
export interface SubscribeParams {
  /** Plan ID to subscribe to */
  planId: string;
  /** Number of payment cycles */
  cycleLimit: number;
  /** Enable auto-renewal */
  autoRenew: boolean;
  /** Payment method: SUBS or USDC */
  paymentMethod: PaymentMethod;
  /** Referral address (optional) */
  referralAddress?: string;
}

/**
 * Hook return type
 */
export interface UseSubscribeReturn {
  /** Execute subscription */
  subscribe: (params: SubscribeParams) => Promise<string>;
  /** Transaction is in progress */
  isSubscribing: boolean;
  /** Current transaction state */
  txState: 'idle' | 'approving' | 'waiting_approval' | 'subscribing' | 'waiting_subscribe' | 'success' | 'error';
  /** Error if any */
  error: Error | null;
  /** Transaction hash */
  txHash: string | null;
  /** Subscription ID (available after success) */
  subscriptionId: string | null;
}

/**
 * Hook to execute subscription transactions
 *
 * @example
 * ```tsx
 * const { subscribe, isSubscribing, txState, error } = useSubscribe();
 *
 * const handleSubscribe = async () => {
 *   try {
 *     const subId = await subscribe({
 *       planId: '1',
 *       cycleLimit: 12,
 *       autoRenew: true,
 *       paymentMethod: 'SUBS'
 *     });
 *     console.log('Subscription ID:', subId);
 *   } catch (error) {
 *     console.error('Failed:', error);
 *   }
 * };
 * ```
 */
export function useSubscribe(): UseSubscribeReturn {
  const { subscryptsContract, subsTokenContract, usdcTokenContract, wallet, signer } = useSubscrypts();

  const [isSubscribing, setIsSubscribing] = useState(false);
  const [txState, setTxState] = useState<UseSubscribeReturn['txState']>('idle');
  const [error, setError] = useState<Error | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);

  const subscribe = useCallback(
    async (params: SubscribeParams): Promise<string> => {
      // Validation
      try {
        validatePlanId(params.planId);
        validateCycleLimit(params.cycleLimit);
      } catch (validationError) {
        setError(validationError as Error);
        throw validationError;
      }

      if (!subscryptsContract || !wallet.address || !signer) {
        const err = new Error('Wallet not connected or contract not initialized');
        setError(err);
        throw err;
      }

      if (!subsTokenContract || !usdcTokenContract) {
        const err = new Error('Token contracts not initialized');
        setError(err);
        throw err;
      }

      setIsSubscribing(true);
      setError(null);
      setTxState('idle');
      setTxHash(null);
      setSubscriptionId(null);

      try {
        const contractService = new ContractService(subscryptsContract);
        const subscryptsAddress = getSubscryptsContractAddress(wallet.chainId!);

        if (params.paymentMethod === 'SUBS') {
          // SUBS payment flow
          const subsService = new TokenService(
            subsTokenContract.target as string,
            signer,
            TOKEN_DECIMALS.SUBS,
            'SUBS'
          );

          // Get plan cost (this would normally come from contract)
          // For now, we'll let the contract handle it

          setTxState('approving');

          // Ensure allowance (this will check balance and approve if needed)
          // We use a large approval amount since the exact cost needs to be fetched from contract
          const largeApproval = BigInt('1000000000000000000000'); // 1000 SUBS

          try {
            await subsService.ensureAllowance(
              wallet.address,
              subscryptsAddress,
              largeApproval
            );
          } catch (err) {
            if (err instanceof InsufficientBalanceError) {
              setError(err);
              setIsSubscribing(false);
              setTxState('error');
              throw err;
            }
            // If it's just an approval issue, continue
          }

          setTxState('subscribing');

          // Create subscription
          const result = await contractService.createSubscription({
            planId: BigInt(params.planId),
            subscriber: wallet.address,
            recurring: params.autoRenew,
            remainingCycles: BigInt(params.cycleLimit),
            referral: params.referralAddress || ZeroAddress,
            onlyCreate: false,
            deductFrom: wallet.address
          });

          const subId = result.subscriptionId.toString();
          setSubscriptionId(subId);
          setTxState('success');
          setIsSubscribing(false);

          return subId;

        } else {
          // USDC payment flow with calculated amount
          const usdcService = new TokenService(
            usdcTokenContract.target as string,
            signer,
            TOKEN_DECIMALS.USDC,
            'USDC'
          );

          // Step 1: Calculate actual USDC needed via Uniswap Quoter
          setTxState('approving');

          const provider = signer.provider;
          if (!provider) {
            throw new ContractError('Provider not available');
          }

          // Fetch plan from contract to get required SUBS amount
          const plan = await subscryptsContract.getplan(BigInt(params.planId));

          // Calculate required SUBS (handle both SUBS and USD-denominated plans)
          let requiredSubs18 = plan.subscriptionAmount;

          if (Number(plan.currencyCode) === 1) {
            // USD-denominated plan: convert to SUBS at current price
            const conversion = await subscryptsContract.convertOtherCurrencyToToken(
              plan.subscriptionAmount
            );
            requiredSubs18 = conversion.outputSUBS18;
          }

          // Quote USDC needed from Uniswap Quoter
          const quoter = new Contract(DEX_QUOTER_ADDRESS, DEX_QUOTER_ABI, provider);
          const usdcNeeded = await quoter.quoteExactOutputSingle.staticCall(
            usdcTokenContract.target as string, // USDC address (tokenIn)
            subscryptsAddress,                  // SUBS address (tokenOut)
            DEFAULTS.UNISWAP_FEE_TIER,         // 3000 (0.3%)
            requiredSubs18,                     // Exact SUBS output we need
            0                                   // No price limit
          );

          // Add 0.5% buffer for price slippage
          const maxUsdcIn = (usdcNeeded * 10050n) / 10000n;

          // Step 2: Approve PERMIT2 for calculated USDC amount
          try {
            await usdcService.ensureAllowance(
              wallet.address,
              PERMIT2_ADDRESS,
              maxUsdcIn
            );
          } catch (err) {
            if (err instanceof InsufficientBalanceError) {
              setError(err);
              setIsSubscribing(false);
              setTxState('error');
              throw err;
            }
          }

          // Step 3: Generate deadline for permit (30 minutes from now)
          const deadline = BigInt(Math.floor(Date.now() / 1000) + 1800);

          // Step 4: Generate PERMIT2 signature with calculated amount
          setTxState('approving');

          const { signature, nonce } = await generatePermit2Signature(
            signer,
            usdcTokenContract.target as string,
            maxUsdcIn,
            subscryptsAddress,
            deadline
          );

          // Step 5: Call contract with valid signature and calculated amount
          setTxState('subscribing');

          const result = await contractService.paySubscriptionWithUsdc({
            planId: BigInt(params.planId),
            recurring: params.autoRenew,
            remainingCycles: BigInt(params.cycleLimit),
            referral: params.referralAddress || ZeroAddress,
            feeTier: DEFAULTS.UNISWAP_FEE_TIER,
            deadline: deadline,
            nonce: BigInt(nonce),
            permitDeadline: deadline,
            signature: signature,
            maxUsdcIn6Cap: maxUsdcIn
          });

          const subId = result.subId.toString();
          setSubscriptionId(subId);
          setTxState('success');
          setIsSubscribing(false);

          return subId;
        }
      } catch (err) {
        const txError = new TransactionError(
          'Failed to create subscription',
          undefined,
          { error: err }
        );
        setError(txError);
        setTxState('error');
        setIsSubscribing(false);
        throw txError;
      }
    },
    [subscryptsContract, subsTokenContract, usdcTokenContract, wallet, signer]
  );

  return {
    subscribe,
    isSubscribing,
    txState,
    error,
    txHash,
    subscriptionId
  };
}
