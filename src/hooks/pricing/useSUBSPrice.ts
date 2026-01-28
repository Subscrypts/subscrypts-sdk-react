/**
 * useSUBSPrice Hook
 *
 * Fetch the current SUBS token price in USD from the on-chain oracle.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSubscrypts } from '../../context/SubscryptsContext';
import { convertTokenToOtherCurrency } from '../../contract';
import { DECIMALS } from '../../contract/config';

/**
 * Hook return type
 */
export interface UseSUBSPriceReturn {
  /** Price of 1 SUBS in USD (null if not loaded) */
  priceUsd: number | null;
  /** Raw price from contract (null if not loaded) */
  rawPrice: bigint | null;
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
 * Fetch the current SUBS/USD price from the on-chain oracle.
 *
 * Uses `convertTokenToOtherCurrency(1e18)` to get the USD value of 1 SUBS.
 * Auto-refreshes every 60 seconds.
 *
 * @param refreshInterval - Refresh interval in ms (default: 60000)
 *
 * @example
 * ```tsx
 * const { priceUsd, isLoading } = useSUBSPrice();
 *
 * if (priceUsd) {
 *   console.log(`1 SUBS = $${priceUsd.toFixed(4)}`);
 * }
 * ```
 */
export function useSUBSPrice(refreshInterval: number = DEFAULT_REFRESH_INTERVAL): UseSUBSPriceReturn {
  const { provider } = useSubscrypts();

  const [priceUsd, setPriceUsd] = useState<number | null>(null);
  const [rawPrice, setRawPrice] = useState<bigint | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchPrice = useCallback(async () => {
    if (!provider) {
      setError(new Error('Provider not initialized'));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // convertTokenToOtherCurrency returns the USD value for the given SUBS amount
      // The result has 18 decimals
      const result = await convertTokenToOtherCurrency(provider, ONE_SUBS);
      const raw = BigInt(result.toString());
      setRawPrice(raw);

      // Convert 18-decimal bigint to number
      const usdValue = Number(raw) / Number(ONE_SUBS);
      setPriceUsd(usdValue);
      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
    }
  }, [provider]);

  // Fetch on mount and set up refresh interval
  useEffect(() => {
    fetchPrice();

    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchPrice, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchPrice, refreshInterval]);

  const refetch = useCallback(async () => {
    await fetchPrice();
  }, [fetchPrice]);

  return {
    priceUsd,
    rawPrice,
    isLoading,
    error,
    refetch
  };
}
