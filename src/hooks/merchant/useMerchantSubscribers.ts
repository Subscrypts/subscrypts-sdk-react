/**
 * useMerchantSubscribers Hook
 *
 * Fetch paginated subscribers for a specific plan.
 */

import { useState, useEffect, useCallback } from 'react';
import { useSubscrypts } from '../../context/SubscryptsContext';
import { Subscription } from '../../types';
import { getSubscriptionsByPlan } from '../../contract';
import { resolveSubscriptionStatus } from '../../utils/subscriptionStatus';

/**
 * Hook return type
 */
export interface UseMerchantSubscribersReturn {
  /** Array of subscriptions for current page */
  subscribers: Subscription[];
  /** Total number of subscriptions */
  total: number;
  /** Number of active subscriptions */
  activeCount: number;
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
 * Fetch paginated subscribers for a specific plan
 *
 * @param planId - Plan ID to fetch subscribers for
 * @param pageSize - Number of subscriptions per page (default: 10)
 *
 * @example
 * ```tsx
 * const { subscribers, activeCount, total, page, hasMore, nextPage, prevPage, isLoading }
 *   = useMerchantSubscribers('1');
 *
 * return (
 *   <div>
 *     <h3>{activeCount} active out of {total} total subscribers</h3>
 *     {subscribers.map(sub => (
 *       <SubscriptionCard key={sub.id} subscription={sub} />
 *     ))}
 *     <button onClick={prevPage} disabled={page === 1}>Previous</button>
 *     <button onClick={nextPage} disabled={!hasMore}>Next</button>
 *   </div>
 * );
 * ```
 */
export function useMerchantSubscribers(
  planId: string,
  pageSize: number = 10
): UseMerchantSubscribersReturn {
  const { provider } = useSubscrypts();

  const [subscribers, setSubscribers] = useState<Subscription[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [activeCount, setActiveCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch subscriptions for current page from contract
   */
  const fetchSubscribers = useCallback(async () => {
    if (!planId) {
      setError(new Error('Plan ID is required'));
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

      // getSubscriptionsByPlan returns [subs[], startIdx, endIdx, totalLength]
      const result = await getSubscriptionsByPlan(provider, BigInt(planId), start, end);
      const [subs, , , totalLength] = result;

      setSubscribers(subs as Subscription[]);
      setTotal(Number(totalLength));

      // Calculate active count from current page
      // Note: This is a subset count, not total active. For total active,
      // we'd need to fetch all subscriptions, but that's expensive.
      const currentPageActive = (subs as Subscription[]).filter(sub => {
        const status = resolveSubscriptionStatus({ subscription: sub });
        return status.isActive;
      }).length;

      setActiveCount(currentPageActive);
      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      setSubscribers([]);
      setTotal(0);
      setActiveCount(0);
    }
  }, [provider, planId, page, pageSize]);

  /**
   * Fetch on mount and when dependencies change
   */
  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

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
    await fetchSubscribers();
  }, [fetchSubscribers]);

  return {
    subscribers,
    total,
    activeCount,
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
