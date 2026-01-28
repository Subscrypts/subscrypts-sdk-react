/**
 * usePlanPrice Hook
 *
 * Comprehensive price information for a subscription plan,
 * including SUBS, USDC, and USD-equivalent prices.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSubscrypts } from '../../context/SubscryptsContext';
import { getPlan, convertTokenToOtherCurrency, convertOtherCurrencyToToken } from '../../contract';
import { DECIMALS, DEX_QUOTER_ADDRESS, USDC_ADDRESS, DEFAULTS } from '../../contract/config';
import { DEX_QUOTER_ABI } from '../../contract/abis';
import { getSubscryptsContractAddress } from '../../constants';
import { formatSubs, formatUsdc } from '../../utils/formatters';
import { validatePlanId } from '../../utils/validators';
import { Contract } from 'ethers';

/**
 * Comprehensive price information for a plan
 */
export interface PlanPriceInfo {
  /** Price in SUBS (18 decimals) */
  subsAmount: bigint;
  /** Formatted SUBS amount */
  subsFormatted: string;
  /** USDC equivalent (6 decimals), null if quote unavailable */
  usdcAmount: bigint | null;
  /** Formatted USDC amount, null if quote unavailable */
  usdcFormatted: string | null;
  /** USD display value, null if price unavailable */
  usdValue: number | null;
  /** Payment frequency label */
  frequency: string;
  /** Whether the plan is USD-denominated (currencyCode=1) */
  isUsdDenominated: boolean;
}

/**
 * Hook return type
 */
export interface UsePlanPriceReturn {
  /** Price information (null if not loaded) */
  price: PlanPriceInfo | null;
  /** Loading state */
  isLoading: boolean;
  /** Error if any */
  error: Error | null;
  /** Manually refresh price */
  refetch: () => Promise<void>;
}

/** 1 SUBS in 18-decimal format */
const ONE_SUBS = 10n ** BigInt(DECIMALS.SUBS);

/** Default refresh interval: 60 seconds */
const DEFAULT_REFRESH_INTERVAL = 60_000;

/**
 * Convert payment frequency (seconds) to human-readable label
 */
function frequencyLabel(seconds: bigint): string {
  const secs = Number(seconds);
  if (secs <= 0) return 'One-time';
  if (secs <= 86400) return 'Daily';
  if (secs <= 604800) return 'Weekly';
  if (secs <= 1209600) return 'Bi-weekly';
  if (secs <= 2678400) return 'Monthly'; // ~31 days
  if (secs <= 7948800) return 'Quarterly'; // ~92 days
  if (secs <= 15897600) return 'Semi-annually'; // ~184 days
  if (secs <= 31536000) return 'Annually';
  return `Every ${Math.round(secs / 86400)} days`;
}

/**
 * Fetch comprehensive price information for a subscription plan.
 *
 * Resolves SUBS amount, USDC equivalent (via Uniswap), and USD value
 * for both SUBS-denominated and USD-denominated plans.
 *
 * @param planId - Plan ID to fetch pricing for
 * @param refreshInterval - Refresh interval in ms (default: 60000)
 *
 * @example
 * ```tsx
 * const { price, isLoading } = usePlanPrice('1');
 *
 * if (price) {
 *   console.log(`${price.subsFormatted} SUBS / ${price.frequency}`);
 *   if (price.usdValue) console.log(`≈ $${price.usdValue.toFixed(2)}`);
 * }
 * ```
 */
export function usePlanPrice(
  planId: string,
  refreshInterval: number = DEFAULT_REFRESH_INTERVAL
): UsePlanPriceReturn {
  const { provider, wallet } = useSubscrypts();

  const [price, setPrice] = useState<PlanPriceInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchPrice = useCallback(async () => {
    try {
      validatePlanId(planId);
    } catch (validationError) {
      setError(validationError as Error);
      setIsLoading(false);
      return;
    }

    if (!provider) {
      setError(new Error('Provider not initialized'));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch plan data
      const plan = await getPlan(provider, BigInt(planId));
      const isUsdDenominated = Number(plan.currencyCode) === 1;
      const frequency = frequencyLabel(plan.paymentFrequency);

      let subsAmount: bigint;
      let usdValue: number | null = null;

      if (isUsdDenominated) {
        // USD-denominated plan: amount is in USD (18 decimals), convert to SUBS
        const conversion = await convertOtherCurrencyToToken(provider, plan.subscriptionAmount);
        subsAmount = BigInt(conversion.outputSUBS18?.toString() ?? conversion.toString());

        // USD value is the plan amount directly
        usdValue = Number(plan.subscriptionAmount) / Number(ONE_SUBS);
      } else {
        // SUBS-denominated plan: amount is in SUBS, convert to USD
        subsAmount = plan.subscriptionAmount;

        try {
          const usdRaw = await convertTokenToOtherCurrency(provider, subsAmount);
          usdValue = Number(BigInt(usdRaw.toString())) / Number(ONE_SUBS);
        } catch {
          // USD price unavailable - not critical
          usdValue = null;
        }
      }

      // Get USDC quote via Uniswap
      let usdcAmount: bigint | null = null;
      let usdcFormatted: string | null = null;

      try {
        const subscryptsAddress = getSubscryptsContractAddress(wallet.chainId ?? 42161);
        const quoter = new Contract(DEX_QUOTER_ADDRESS, DEX_QUOTER_ABI, provider);
        const quoteResult = await quoter.quoteExactOutputSingle.staticCall({
          tokenIn: USDC_ADDRESS,
          tokenOut: subscryptsAddress,
          amount: subsAmount,
          fee: DEFAULTS.UNISWAP_FEE_TIER,
          sqrtPriceLimitX96: 0n
        });
        const quotedUsdc: bigint = quoteResult[0];
        usdcAmount = quotedUsdc;
        usdcFormatted = formatUsdc(quotedUsdc);
      } catch {
        // USDC quote unavailable - not critical
      }

      setPrice({
        subsAmount,
        subsFormatted: formatSubs(subsAmount),
        usdcAmount,
        usdcFormatted,
        usdValue,
        frequency,
        isUsdDenominated
      });
      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      setPrice(null);
    }
  }, [provider, wallet.chainId, planId]);

  // Fetch on mount and set up refresh interval
  useEffect(() => {
    if (planId) {
      fetchPrice();

      if (refreshInterval > 0) {
        intervalRef.current = setInterval(fetchPrice, refreshInterval);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchPrice, planId, refreshInterval]);

  const refetch = useCallback(async () => {
    await fetchPrice();
  }, [fetchPrice]);

  return {
    price,
    isLoading,
    error,
    refetch
  };
}
