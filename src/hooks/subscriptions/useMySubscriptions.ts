/**
 * useMySubscriptions Hook
 *
 * Fetch paginated subscriptions for the connected wallet address.
 */

import { useState, useEffect, useCallback } from 'react';
import { useSubscrypts } from '../../context/SubscryptsContext';
import { Subscription } from '../../types';
import { getSubscriptionsByAddress } from '../../contract';

/**
 * Hook return type
 */
export interface UseMySubscriptionsReturn {
  /** Array of subscriptions for current page */
  subscriptions: Subscription[];
  /** Total number of subscriptions */
  total: number;
  /** Current page (1-indexed) */
  page: number;
  /** Number of subscriptions per page */
  pageSize: number;
  /** Whether there are more pages */
  hasMore: boolean;
  /** Loading state */
  isLoading: boolean;
  /** Error if any */
  error: Error | null;
  /** Go to next page */
  nextPage: () => void;
  /** Go to previous page */
  prevPage: () => void;
  /** Manually refresh subscriptions */
  refetch: () => Promise<void>;
}

/**
 * Fetch paginated subscriptions for a wallet address
 *
 * @param address - Optional address to fetch subscriptions for (defaults to connected wallet)
 * @param pageSize - Number of subscriptions per page (default: 10)
 *
 * @example
 * ```tsx
 * const { subscriptions, page, hasMore, nextPage, prevPage, isLoading } = useMySubscriptions();
 *
 * if (isLoading) return <Spinner />;
 *
 * return (
 *   <div>
 *     {subscriptions.map(sub => <SubscriptionCard key={sub.id} subscription={sub} />)}
 *     <button onClick={prevPage} disabled={page === 1}>Previous</button>
 *     <button onClick={nextPage} disabled={!hasMore}>Next</button>
 *   </div>
 * );
 * ```
 */
export function useMySubscriptions(
  address?: string,
  pageSize: number = 10
): UseMySubscriptionsReturn {
  const { provider, wallet } = useSubscrypts();

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Determine which address to use
  const targetAddress = address || wallet?.address;

  /**
   * Fetch subscriptions for current page from contract
   */
  const fetchSubscriptions = useCallback(async () => {
    if (!targetAddress) {
      setError(new Error('No wallet address provided'));
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
      // Calculate 1-indexed start/end for contract call
      const start = BigInt((page - 1) * pageSize + 1);
      const end = BigInt(page * pageSize);

      // getSubscriptionsByAddress returns [subs[], startIdx, endIdx, totalLength]
      const result = await getSubscriptionsByAddress(provider, targetAddress, start, end);
      const [subs, , , totalLength] = result;

      setSubscriptions(subs as Subscription[]);
      setTotal(Number(totalLength));
      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      setSubscriptions([]);
      setTotal(0);
    }
  }, [provider, targetAddress, page, pageSize]);

  /**
   * Fetch on mount and when dependencies change
   */
  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  /**
   * Navigate to next page
   */
  const nextPage = useCallback(() => {
    if (page * pageSize < total) {
      setPage(prev => prev + 1);
    }
  }, [page, pageSize, total]);

  /**
   * Navigate to previous page
   */
  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  }, [page]);

  /**
   * Check if there are more pages
   */
  const hasMore = page * pageSize < total;

  /**
   * Refetch function for manual refresh
   */
  const refetch = useCallback(async () => {
    await fetchSubscriptions();
  }, [fetchSubscriptions]);

  return {
    subscriptions,
    total,
    page,
    pageSize,
    hasMore,
    isLoading,
    error,
    nextPage,
    prevPage,
    refetch
  };
}
