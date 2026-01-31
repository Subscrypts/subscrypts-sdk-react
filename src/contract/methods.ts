/**
 * Subscrypts Contract Method Wrappers
 *
 * Direct contract method calls using ethers.js
 * These are utility functions for direct contract interaction
 */

import { ethers } from 'ethers';
import { SUBSCRYPTS_ABI } from './abis';
import { SUBSCRYPTS_ADDRESS } from './config';

// ==========================================
//               HELPERS
// ==========================================

export const getContract = (runner: ethers.ContractRunner) => {
  return new ethers.Contract(SUBSCRYPTS_ADDRESS, SUBSCRYPTS_ABI, runner);
};

export const bytes32Encode = (str: string): string => {
  try {
    if (!str) return ethers.ZeroHash;
    return ethers.encodeBytes32String(str);
  } catch (e) {
    console.error("Error encoding bytes32:", e);
    return ethers.ZeroHash;
  }
};

export const bytes32Decode = (hex: string): string => {
  try {
    return ethers.decodeBytes32String(hex).replace(/\0/g, '');
  } catch (e) {
    return hex; // Return raw if decode fails
  }
};

// ==========================================
//           ERC20 / BASIC TOKEN
// ==========================================

export const approve = async (signer: ethers.Signer, spender: string, amount: bigint) => {
  const contract = getContract(signer);
  return await contract.approve(spender, amount);
};

export const burn = async (signer: ethers.Signer, amount: bigint) => {
  const contract = getContract(signer);
  return await contract.burn(amount);
};

export const burnFrom = async (signer: ethers.Signer, account: string, amount: bigint) => {
  const contract = getContract(signer);
  return await contract.burnFrom(account, amount);
};

export const transfer = async (signer: ethers.Signer, to: string, amount: bigint) => {
  const contract = getContract(signer);
  return await contract.transfer(to, amount);
};

export const transferFrom = async (signer: ethers.Signer, from: string, to: string, amount: bigint) => {
  const contract = getContract(signer);
  return await contract.transferFrom(from, to, amount);
};

// ==========================================
//           ADMIN & GOVERNANCE
// ==========================================

export const contractFreezeAccount = async (signer: ethers.Signer, account: string, freeze: boolean) => {
  const contract = getContract(signer);
  return await contract.contractFreezeAccount(account, freeze);
};

export const contractFundAddressCHG = async (signer: ethers.Signer, newAddress: string) => {
  const contract = getContract(signer);
  return await contract.contractFundAddressCHG(newAddress);
};

export const contractSanctionsContractCHG = async (signer: ethers.Signer, enabled: boolean, newContract: string) => {
  const contract = getContract(signer);
  return await contract.contractSanctionsContractCHG(enabled, newContract);
};

export const contractServiceAccountsCHG = async (signer: ethers.Signer, add: boolean, del: boolean, account: string) => {
  const contract = getContract(signer);
  return await contract.contractServiceAccountsCHG(add, del, account);
};

export const dexGovernanceCHG = async (signer: ethers.Signer, factory: string, router: string, pair: string, posMgr: string, quoter: string, usdc: string) => {
  const contract = getContract(signer);
  return await contract.dexGovernanceCHG(factory, router, pair, posMgr, quoter, usdc);
};

export const mintByAdmin = async (signer: ethers.Signer, to: string, amount: bigint) => {
  const contract = getContract(signer);
  return await contract.mintByAdmin(to, amount);
};

export const burnByAdmin = async (signer: ethers.Signer, wallet: string, amount: bigint) => {
  const contract = getContract(signer);
  return await contract.burnByAdmin(wallet, amount);
};

export const planGoveranceCHG = async (signer: ethers.Signer, creationCost: bigint, verifCost: bigint, commission: bigint) => {
  const contract = getContract(signer);
  return await contract.planGoveranceCHG(creationCost, verifCost, commission);
};

export const setHaltStates = async (signer: ethers.Signer, noTransfer: boolean, noPlan: boolean, noSub: boolean, noPay: boolean, noUSD: boolean) => {
  const contract = getContract(signer);
  return await contract.setHaltStates(noTransfer, noPlan, noSub, noPay, noUSD);
};

export const renounceOwnership = async (signer: ethers.Signer) => {
  const contract = getContract(signer);
  return await contract.renounceOwnership();
};

export const transferOwnership = async (signer: ethers.Signer, newOwner: string) => {
  const contract = getContract(signer);
  return await contract.transferOwnership(newOwner);
};

// ==========================================
//           SUBSCRIPTION & PLANS
// ==========================================

/**
 * Change plan parameters
 *
 * ⚠️ **WARNING - DESTRUCTIVE OPERATION**: Changing `amount` or `frequency` will
 * automatically disable recurring payment configuration to ALL existing subscriptions
 * to this plan. Subscribers will need to manually re-configure the recurring payments
 * with the new parameters.
 *
 * **Why This Design**: Prevents subscribers from being charged unexpected amounts
 * without explicit consent. Protects both merchant (can change pricing) and
 * subscriber (won't be auto-charged new amount).
 *
 * **Contract behavior**: facetSubscription.sol lines 352-355
 *
 * @param signer - Wallet signer (must be plan owner)
 * @param planId - Plan ID to modify
 * @param merchant - Merchant address (must match plan owner)
 * @param amount - New subscription amount (⚠️ changing this disables all subscriptions)
 * @param frequency - New payment frequency (⚠️ changing this disables all subscriptions)
 * @param referralBonus - Referral reward amount
 * @param commission - Protocol commission
 * @param description - Plan description (bytes32)
 * @param setAttribute - Default attributes (bytes32)
 * @param verifExpDate - Verification expiry timestamp
 * @param active - Plan active status
 *
 * @example
 * ```typescript
 * // WARNING: This will disable isRecurring and reset remainingCycles
 * // for ALL existing subscriptions
 * await planChange(
 *   signer,
 *   1n,                    // planId
 *   merchantAddress,
 *   parseEther('10'),     // NEW amount (was 5 SUBS)
 *   2592000n,             // frequency (30 days)
 *   parseEther('1'),      // referralBonus
 *   500n,                 // 5% commission
 *   'Premium Plan',
 *   '',
 *   0n,
 *   true
 * );
 * // All subscribers must now re-enable recurring payments
 * ```
 *
 * @see planChangeSubscriptionsBulk for non-destructive bulk updates
 */
export const planChange = async (signer: ethers.Signer, planId: bigint, merchant: string, amount: bigint, frequency: bigint, referralBonus: bigint, commission: bigint, description: string, setAttribute: string, verifExpDate: bigint, active: boolean) => {
  const contract = getContract(signer);
  const descBytes = bytes32Encode(description);
  const attrBytes = bytes32Encode(setAttribute);
  return await contract.planChange(planId, merchant, amount, frequency, referralBonus, commission, descBytes, attrBytes, verifExpDate, active);
};

export const planChangeSubscriptionsBulk = async (signer: ethers.Signer, start: bigint, end: bigint, planId: bigint, amount: bigint, frequency: bigint, attribute: string, overrideRecurring: boolean) => {
  const contract = getContract(signer);
  const attrBytes = bytes32Encode(attribute);
  return await contract.planChangeSubscriptionsBulk(start, end, planId, amount, frequency, attrBytes, overrideRecurring);
};

export const planCreate = async (signer: ethers.Signer, currency: bigint, amount: bigint, frequency: bigint, description: string, setAttribute: string, referralBonus: bigint, value: bigint = 0n) => {
  const contract = getContract(signer);
  const descBytes = bytes32Encode(description);
  const attrBytes = bytes32Encode(setAttribute);
  return await contract.planCreate(currency, amount, frequency, descBytes, attrBytes, referralBonus, { value });
};

export const paySubscriptionWithUsdc = async (signer: ethers.Signer, planId: bigint, recurring: boolean, remainingCycles: bigint, referral: string, feeTier: bigint, deadline: bigint, nonce: bigint, permitDeadline: bigint, signature: string, maxUsdc: bigint) => {
  const contract = getContract(signer);
  const referralAddr = referral || ethers.ZeroAddress;
  return await contract.paySubscriptionWithUsdc(planId, recurring, remainingCycles, referralAddr, feeTier, deadline, nonce, permitDeadline, signature, maxUsdc);
};

export const subscriptionAttributeCHG = async (signer: ethers.Signer, subId: bigint, newAttribute: string) => {
  const contract = getContract(signer);
  const attrBytes = bytes32Encode(newAttribute);
  return await contract.subscriptionAttributeCHG(subId, attrBytes);
};

export const subscriptionCollect = async (signer: ethers.Signer, start: bigint, end: bigint, maxCollect: bigint) => {
  const contract = getContract(signer);
  return await contract.subscriptionCollect(start, end, maxCollect);
};

export const subscriptionCollectByAddress = async (signer: ethers.Signer, subscriber: string, start: bigint, end: bigint, maxCollect: bigint) => {
  const contract = getContract(signer);
  return await contract.subscriptionCollectByAddress(subscriber, start, end, maxCollect);
};

export const subscriptionCollectByPlan = async (signer: ethers.Signer, planId: bigint, start: bigint, end: bigint, maxCollect: bigint) => {
  const contract = getContract(signer);
  return await contract.subscriptionCollectByPlan(planId, start, end, maxCollect);
};

export const subscriptionCollectPassive = async (signer: ethers.Signer, from: string, to: string) => {
  const contract = getContract(signer);
  return await contract.subscriptionCollectPassive(from, to);
};

export const subscriptionCollectPassiveCHG = async (signer: ethers.Signer, enable: boolean, newMax: bigint) => {
  const contract = getContract(signer);
  return await contract.subscriptionCollectPassiveCHG(enable, newMax);
};

export const subscriptionCreate = async (signer: ethers.Signer, planId: bigint, subscriber: string, recurring: boolean, remainingCycles: bigint, referral: string, onlyCreate: boolean, deductFrom: string) => {
  const contract = getContract(signer);
  const referralAddr = referral || ethers.ZeroAddress;
  return await contract.subscriptionCreate(planId, subscriber, recurring, remainingCycles, referralAddr, onlyCreate, deductFrom);
};

export const subscriptionGift = async (signer: ethers.Signer, planId: bigint, subscriber: string, referral: string, giveaway: boolean, deductFrom: string, timeBonus: bigint) => {
  const contract = getContract(signer);
  return await contract.subscriptionGift(planId, subscriber, referral, giveaway, deductFrom, timeBonus);
};

export const subscriptionRecurringCHG = async (signer: ethers.Signer, subId: bigint, enabled: boolean, cycles: bigint) => {
  const contract = getContract(signer);
  return await contract.subscriptionRecurringCHG(subId, enabled, cycles);
};

export const subInternalBurn = async (signer: ethers.Signer, from: string, amount: bigint) => {
  const contract = getContract(signer);
  return await contract.subInternalBurn(from, amount);
};

export const subInternalMint = async (signer: ethers.Signer, to: string, amount: bigint) => {
  const contract = getContract(signer);
  return await contract.subInternalMint(to, amount);
};

export const subTxIncrement = async (signer: ethers.Signer) => {
  const contract = getContract(signer);
  return await contract.subTxIncrement();
};

// ==========================================
//           PROXY & DIAMOND FACETS
// ==========================================

export const initialize = async (signer: ethers.Signer) => {
  const contract = getContract(signer);
  return await contract.initialize();
};

export const registerFacetSelector = async (signer: ethers.Signer, selector: string, facet: string) => {
  const contract = getContract(signer);
  return await contract.registerFacetSelector(selector, facet);
};

export const unregisterFacetSelector = async (signer: ethers.Signer, selector: string) => {
  const contract = getContract(signer);
  return await contract.unregisterFacetSelector(selector);
};

export const setFacetAdmin = async (signer: ethers.Signer, module: string) => {
  const contract = getContract(signer);
  return await contract.setFacetAdmin(module);
};

export const setFacetPaymentUsdc = async (signer: ethers.Signer, module: string) => {
  const contract = getContract(signer);
  return await contract.setFacetPaymentUsdc(module);
};

export const setFacetSubscription = async (signer: ethers.Signer, module: string) => {
  const contract = getContract(signer);
  return await contract.setFacetSubscription(module);
};

export const setFacetView = async (signer: ethers.Signer, module: string) => {
  const contract = getContract(signer);
  return await contract.setFacetView(module);
};

export const setProxyLogicAddress = async (signer: ethers.Signer, module: string) => {
  const contract = getContract(signer);
  return await contract.setProxyLogicAddress(module);
};

export const upgradeToAndCall = async (signer: ethers.Signer, newImpl: string, data: string) => {
  const contract = getContract(signer);
  return await contract.upgradeToAndCall(newImpl, data);
};

// ==========================================
//               VIEW FUNCTIONS
// ==========================================

// Helper for cleaning Plan structs (decoding bytes32)
export const cleanPlan = (p: any) => {
  return {
    id: p.id,
    merchantAddress: p.merchantAddress,
    currencyCode: p.currencyCode,
    subscriptionAmount: p.subscriptionAmount,
    paymentFrequency: p.paymentFrequency,
    referralBonus: p.referralBonus,
    commission: p.commission,
    description: bytes32Decode(p.description),
    defaultAttributes: bytes32Decode(p.defaultAttributes),
    verificationExpiryDate: p.verificationExpiryDate,
    subscriberCount: p.subscriberCount,
    isActive: p.isActive
  };
};

// Helper for cleaning Subscription structs
export const cleanSub = (s: any) => {
  return {
    id: s.id,
    merchantAddress: s.merchantAddress,
    planId: s.planId,
    subscriberAddress: s.subscriberAddress,
    currencyCode: s.currencyCode,
    subscriptionAmount: s.subscriptionAmount,
    paymentFrequency: s.paymentFrequency,
    isRecurring: s.isRecurring,
    remainingCycles: s.remainingCycles,
    customAttributes: bytes32Decode(s.customAttributes),
    lastPaymentDate: s.lastPaymentDate,
    nextPaymentDate: s.nextPaymentDate
  };
};

export const planAutoIncrement = async (runner: ethers.ContractRunner) => {
  return await getContract(runner)._planAutoIncrement();
};

export const subscriptionAutoIncrement = async (runner: ethers.ContractRunner) => {
  return await getContract(runner)._subscriptionAutoIncrement();
};

export const allowance = async (runner: ethers.ContractRunner, owner: string, spender: string) => {
  return await getContract(runner).allowance(owner, spender);
};

export const balanceOf = async (runner: ethers.ContractRunner, account: string) => {
  return await getContract(runner).balanceOf(account);
};

export const contractAddress = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).contractAddress();
};

export const contractFundAddress = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).contractFundAddress();
};

export const contractHaltCurrencyUSD = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).contractHaltCurrencyUSD();
};

export const contractHaltNonServiceTransfers = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).contractHaltNonServiceTransfers();
};

export const contractHaltPlanCreation = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).contractHaltPlanCreation();
};

export const contractHaltSubcriptions = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).contractHaltSubcriptions();
};

export const contractHaltSubscriptionPayments = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).contractHaltSubscriptionPayments();
};

export const convertOtherCurrencyToToken = async (runner: ethers.ContractRunner, amount: bigint) => {
  return await getContract(runner).convertOtherCurrencyToToken(amount);
};

export const convertTokenToOtherCurrency = async (runner: ethers.ContractRunner, amount: bigint) => {
  return await getContract(runner).convertTokenToOtherCurrency(amount);
};

export const decimals = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).decimals();
};

export const dexFactory = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).dexFactory();
};

export const dexPair = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).dexPair();
};

export const dexPositionManager = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).dexPositionManager();
};

export const dexQuoter = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).dexQuoter();
};

export const dexRouter = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).dexRouter();
};

export const dexUSDC = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).dexUSDC();
};

export const getContractDetails = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).getContractDetails();
};

export const getContractHaltStates = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).getContractHaltStates();
};

export const getPlan = async (runner: ethers.ContractRunner, planId: bigint) => {
  const result = await getContract(runner).getPlan(planId);
  return cleanPlan(result);
};

export const getPlans = async (runner: ethers.ContractRunner, start: bigint, end: bigint) => {
  const result = await getContract(runner).getPlans(start, end);
  const plans = result[0].map(cleanPlan);
  return [plans, result[1], result[2], result[3]]; // Plans, Start, End, Length
};

export const getPlanSubscription = async (runner: ethers.ContractRunner, planId: bigint, subscriber: string) => {
  const result = await getContract(runner).getPlanSubscription(planId, subscriber);
  return cleanSub(result);
};

export const getSubscription = async (runner: ethers.ContractRunner, subId: bigint) => {
  const result = await getContract(runner).getSubscription(subId);
  return cleanSub(result);
};

export const getSubscriptionAndPlanDetails = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).getSubscriptionAndPlanDetails();
};

export const getSubscriptions = async (runner: ethers.ContractRunner, start: bigint, end: bigint) => {
  const result = await getContract(runner).getSubscriptions(start, end);
  const subs = result[0].map(cleanSub);
  return [subs, result[1], result[2], result[3]];
};

export const getSubscriptionsByAddress = async (runner: ethers.ContractRunner, subscriber: string, start: bigint, end: bigint) => {
  const result = await getContract(runner).getSubscriptionsByAddress(subscriber, start, end);
  const subs = result[0].map(cleanSub);
  return [subs, result[1], result[2], result[3]];
};

export const getSubscriptionsByPlan = async (runner: ethers.ContractRunner, planId: bigint, start: bigint, end: bigint) => {
  const result = await getContract(runner).getSubscriptionsByPlan(planId, start, end);
  const subs = result[0].map(cleanSub);
  return [subs, result[1], result[2], result[3]];
};

export const name = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).name();
};

export const owner = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).owner();
};

export const planCreationCost = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).planCreationCost();
};

export const planDefaultCommission = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).planDefaultCommission();
};

export const sanctionsCheckEnabled = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).sanctionsCheckEnabled();
};

export const sanctionsContract = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).sanctionsContract();
};

export const subCheckSanctions = async (runner: ethers.ContractRunner, from: string, to: string) => {
  return await getContract(runner).subCheckSanctions(from, to);
};

export const subscriptionCollectPassiveEnabled = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).subscriptionCollectPassiveEnabled();
};

export const subscriptionCollectPassiveIndex = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).subscriptionCollectPassiveIndex();
};

export const subscriptionCollectPassiveMax = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).subscriptionCollectPassiveMax();
};

export const symbol = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).symbol();
};

export const tokenHolders = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).tokenHolders();
};

export const tokenTransactions = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).tokenTransactions();
};

export const totalSubscriptionsActive = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).totalSubscriptionsActive();
};

export const totalSupply = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).totalSupply();
};

export const UPGRADE_INTERFACE_VERSION = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).UPGRADE_INTERFACE_VERSION();
};

export const facetAdmin = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).facetAdmin();
};

export const facetSubscription = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).facetSubscription();
};

export const facetView = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).facetView();
};

export const proxyLogic = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).proxyLogic();
};

export const facetPaymentUsdc = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).facetPaymentUsdc();
};

export const getFacetSelector = async (runner: ethers.ContractRunner, selector: string) => {
  return await getContract(runner).getFacetSelector(selector);
};

export const listFacetSelectors = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).listFacetSelectors();
};

export const registeredSelectors = async (runner: ethers.ContractRunner, index: bigint) => {
  return await getContract(runner).registeredSelectors(index);
};

export const planVerificationCost = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).planVerificationCost();
};

export const proxiableUUID = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).proxiableUUID();
};

export const quoteUsdcForSubs = async (runner: ethers.ContractRunner, subsOut: bigint, feeTier: bigint) => {
  return await getContract(runner).quoteUsdcForSubs(subsOut, feeTier);
};

// ==========================================
//    VERIFIED TRANSACTION WRAPPERS
// ==========================================

/**
 * Parse _subscriptionCreate event from transaction receipt
 * @private
 */
const parseSubscriptionCreatedEvent = (receipt: ethers.TransactionReceipt, contractInterface: ethers.Interface): bigint => {
  for (const log of receipt.logs) {
    try {
      const parsed = contractInterface.parseLog({
        topics: [...log.topics] as string[],
        data: log.data
      });

      if (parsed && parsed.name === '_subscriptionCreate') {
        return parsed.args.subscriptionId;
      }
    } catch {
      // Continue to next log if parsing fails
      continue;
    }
  }

  throw new Error(`Subscription ID not found in transaction logs: ${receipt.hash}`);
};

/**
 * Parse subscriptionPaidWithUsdc event from transaction receipt
 * @private
 */
const parseUsdcPaymentEvent = (receipt: ethers.TransactionReceipt, contractInterface: ethers.Interface): {
  subsAmount18: bigint;
  usdcSpent6: bigint;
} | null => {
  for (const log of receipt.logs) {
    try {
      const parsed = contractInterface.parseLog({
        topics: [...log.topics] as string[],
        data: log.data
      });

      if (parsed && parsed.name === 'subscriptionPaidWithUsdc') {
        return {
          subsAmount18: parsed.args.subsAmount18,
          usdcSpent6: parsed.args.usdcSpent6
        };
      }
    } catch {
      continue;
    }
  }

  return null;
};

/**
 * Get current subscription state for verification
 * Uses two-step lookup: getPlanSubscription → getSubscription
 * @private
 */
const getSubscriptionState = async (
  runner: ethers.ContractRunner | ethers.Contract,
  planId: bigint,
  subscriber: string
): Promise<{ subscriptionId: bigint; nextPaymentDate: bigint }> => {
  try {
    const contract = runner instanceof ethers.Contract ? runner : getContract(runner);

    // Step 1: Get subscriptionId from plan/subscriber mapping
    const planSubscription = await contract.getPlanSubscription(planId, subscriber);
    const subscriptionId = planSubscription?.id ?? planSubscription?.[0] ?? 0n;

    if (subscriptionId === 0n) {
      return { subscriptionId: 0n, nextPaymentDate: 0n };
    }

    // Step 2: Get full subscription record with real nextPaymentDate
    const subscription = await contract.getSubscription(subscriptionId);
    const nextPaymentDate = subscription?.nextPaymentDate ?? subscription?.[11] ?? 0n;

    return { subscriptionId, nextPaymentDate };
  } catch {
    return { subscriptionId: 0n, nextPaymentDate: 0n };
  }
};

/**
 * Verify subscription payment by checking nextPaymentDate change
 * @private
 */
const verifySubscriptionPayment = async (
  runner: ethers.ContractRunner | ethers.Contract,
  planId: bigint,
  subscriber: string,
  previousNextPaymentDate: bigint
): Promise<bigint | null> => {
  try {
    const contract = runner instanceof ethers.Contract ? runner : getContract(runner);

    // Step 1: Get subscriptionId
    const planSubscription = await contract.getPlanSubscription(planId, subscriber);
    const subscriptionId = planSubscription?.id ?? planSubscription?.[0] ?? 0n;

    if (subscriptionId === 0n) {
      return null;
    }

    // Step 2: Get full subscription with real nextPaymentDate
    const subscription = await contract.getSubscription(subscriptionId);
    const nextPaymentDate = subscription?.nextPaymentDate ?? subscription?.[11] ?? 0n;

    // Subscription exists and nextPaymentDate has changed (increased)
    if (nextPaymentDate > 0n && nextPaymentDate > previousNextPaymentDate) {
      return subscriptionId;
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Create a subscription with SUBS tokens (with verification)
 *
 * This is a high-level wrapper that:
 * - Captures state before transaction
 * - Executes the transaction
 * - Parses events to extract subscriptionId
 * - Falls back to state verification if event parsing fails
 *
 * @param signer - Ethers signer
 * @param params - Subscription creation parameters
 * @returns subscriptionId and alreadyExist flag
 *
 * @example
 * ```typescript
 * const result = await createSubscriptionVerified(signer, {
 *   planId: 1n,
 *   subscriber: '0x...',
 *   recurring: true,
 *   remainingCycles: 12n,
 *   referral: ethers.ZeroAddress,
 *   onlyCreate: false,
 *   deductFrom: '0x...'
 * });
 * console.log('Subscription ID:', result.subscriptionId);
 * ```
 */
export const createSubscriptionVerified = async (
  signer: ethers.Signer,
  params: {
    planId: bigint;
    subscriber: string;
    recurring: boolean;
    remainingCycles: bigint;
    referral: string;
    onlyCreate: boolean;
    deductFrom: string;
  }
): Promise<{
  subscriptionId: bigint;
  alreadyExist: boolean;
}> => {
  const contract = getContract(signer);
  const contractInterface = new ethers.Interface(SUBSCRYPTS_ABI);

  // Capture state before transaction
  const stateBefore = await getSubscriptionState(contract, params.planId, params.subscriber);
  const previousNextPaymentDate = stateBefore.nextPaymentDate;

  // Execute transaction
  const tx = await subscriptionCreate(
    signer,
    params.planId,
    params.subscriber,
    params.recurring,
    params.remainingCycles,
    params.referral,
    params.onlyCreate,
    params.deductFrom
  );

  const receipt = await tx.wait();

  if (!receipt) {
    throw new Error('Transaction receipt not available');
  }

  // Try event parsing first
  let subscriptionId: bigint | null = null;
  try {
    subscriptionId = parseSubscriptionCreatedEvent(receipt, contractInterface);
  } catch {
    // Event parsing failed, will use fallback
  }

  // Fallback: verify via contract state
  if (subscriptionId === null) {
    subscriptionId = await verifySubscriptionPayment(
      contract,
      params.planId,
      params.subscriber,
      previousNextPaymentDate
    );

    if (subscriptionId === null) {
      throw new Error(
        `Subscription verification failed: nextPaymentDate did not change. Transaction: ${receipt.hash}`
      );
    }
  }

  return {
    subscriptionId,
    alreadyExist: previousNextPaymentDate > 0n
  };
};

/**
 * Create a subscription with USDC (with verification)
 *
 * This is a high-level wrapper that:
 * - Captures state before transaction
 * - Executes the USDC payment transaction
 * - Parses events to extract subscriptionId and payment data
 * - Falls back to state verification if event parsing fails
 *
 * @param signer - Ethers signer
 * @param params - USDC payment parameters
 * @param subscriber - Subscriber address (for verification)
 * @returns subscriptionId, existence flag, and payment amounts
 *
 * @example
 * ```typescript
 * const result = await paySubscriptionWithUsdcVerified(signer, {
 *   planId: 1n,
 *   recurring: true,
 *   remainingCycles: 12n,
 *   referral: ethers.ZeroAddress,
 *   feeTier: 3000n,
 *   deadline: BigInt(Date.now() / 1000 + 1800),
 *   nonce: 0n,
 *   permitDeadline: BigInt(Date.now() / 1000 + 1800),
 *   signature: '0x...',
 *   maxUsdcIn6Cap: 10000000n
 * }, '0xSubscriber...');
 * ```
 */
export const paySubscriptionWithUsdcVerified = async (
  signer: ethers.Signer,
  params: {
    planId: bigint;
    recurring: boolean;
    remainingCycles: bigint;
    referral: string;
    feeTier: bigint;
    deadline: bigint;
    nonce: bigint;
    permitDeadline: bigint;
    signature: string;
    maxUsdcIn6Cap: bigint;
  },
  subscriber: string
): Promise<{
  subId: bigint;
  subExist: boolean;
  subsPaid18: bigint;
  usdcSpent6: bigint;
}> => {
  const contract = getContract(signer);
  const contractInterface = new ethers.Interface(SUBSCRYPTS_ABI);

  // Capture state before transaction
  const stateBefore = await getSubscriptionState(contract, params.planId, subscriber);
  const previousNextPaymentDate = stateBefore.nextPaymentDate;

  // Execute transaction
  const tx = await paySubscriptionWithUsdc(
    signer,
    params.planId,
    params.recurring,
    params.remainingCycles,
    params.referral,
    params.feeTier,
    params.deadline,
    params.nonce,
    params.permitDeadline,
    params.signature,
    params.maxUsdcIn6Cap
  );

  const receipt = await tx.wait();

  if (!receipt) {
    throw new Error('Transaction receipt not available');
  }

  // Try event parsing first
  let subscriptionId: bigint | null = null;
  let paymentData: { subsAmount18: bigint; usdcSpent6: bigint } | null = null;

  try {
    subscriptionId = parseSubscriptionCreatedEvent(receipt, contractInterface);
    paymentData = parseUsdcPaymentEvent(receipt, contractInterface);
  } catch {
    // Event parsing failed, will use fallback
  }

  // Fallback: verify via contract state
  if (subscriptionId === null) {
    subscriptionId = await verifySubscriptionPayment(
      contract,
      params.planId,
      subscriber,
      previousNextPaymentDate
    );

    if (subscriptionId === null) {
      throw new Error(
        `Subscription verification failed: nextPaymentDate did not change. Transaction: ${receipt.hash}`
      );
    }
  }

  return {
    subId: subscriptionId,
    subExist: previousNextPaymentDate > 0n,
    subsPaid18: paymentData?.subsAmount18 || 0n,
    usdcSpent6: paymentData?.usdcSpent6 || 0n
  };
};
