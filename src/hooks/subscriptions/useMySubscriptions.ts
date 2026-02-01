/**
 * useMySubscriptions Hook
 *
 * Fetch paginated subscriptions for the connected wallet address.
 *
 * STRATEGY:
 * 1. PRIMARY: Calls getSubscriptionsByAddress(0, 100) for all subscriptions (1 RPC call - efficient)
 * 2. FILTER: If planIds specified, filters results to only include those plans
 * 3. FALLBACK: If empty results + planIds provided, loops through plans using getPlanSubscription (reliable but slower)
 *
 * This optimizes for the best case (contract working = 1 call) while handling the broken case.
 */

import { useState, useEffect, useCallback } from 'react';
import { useSubscrypts } from '../../context/SubscryptsContext';
import { Subscription, ContractSubscription } from '../../types';
import { getSubscriptionsByAddress, getPlanSubscription, getSubscription } from '../../contract';

/**
 * Transform contract subscription data to SDK Subscription type
 */
function transformContractSubscription(contractSub: ContractSubscription): Subscription {
  return {
    id: contractSub.id.toString(),
    merchantAddress: contractSub.merchantAddress,
    planId: contractSub.planId.toString(),
    subscriber: contractSub.subscriberAddress,
    currencyCode: contractSub.currencyCode,
    subscriptionAmount: contractSub.subscriptionAmount,
    paymentFrequency: contractSub.paymentFrequency,
    isAutoRenewing: contractSub.isRecurring,
    remainingCycles: Number(contractSub.remainingCycles),
    customAttributes: contractSub.customAttributes,
    lastPaymentDate: new Date(Number(contractSub.lastPaymentDate) * 1000),
    nextPaymentDate: new Date(Number(contractSub.nextPaymentDate) * 1000)
  };
}

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
 * @param planIds - Optional array of plan IDs to check (recommended for reliability)
 *
 * @example
 * ```tsx
 * // Get all subscriptions (tries getSubscriptionsByAddress, up to 100 subs)
 * const { subscriptions, isLoading } = useMySubscriptions();
 *
 * // Filter to specific plans + fallback if getSubscriptionsByAddress fails
 * const { subscriptions, isLoading } = useMySubscriptions(undefined, 10, ['1', '2', '3']);
 *
 * if (isLoading) return <Spinner />;
 *
 * return (
 *   <div>
 *     {subscriptions.map(sub => <SubscriptionCard key={sub.id} subscription={sub} />)}
 *   </div>
 * );
 * ```
 */
export function useMySubscriptions(
  address?: string,
  pageSize: number = 10,
  planIds?: string[]
): UseMySubscriptionsReturn {
  const { provider, wallet, cacheManager } = useSubscrypts();

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

    if (!provider || !cacheManager) {
      setError(new Error('Provider not initialized'));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const cacheKey = `my-subscriptions:${targetAddress}`;

      // PRIMARY METHOD: Try getSubscriptionsByAddress first (most efficient - 1 RPC call)
      // Fetch up to 100 subscriptions with 2-minute cache
      let allSubs = await cacheManager.get(
        cacheKey,
        async () => {
          const result = await getSubscriptionsByAddress(provider, targetAddress, 0n, 100n);
          const [subs] = result;
          return (subs as ContractSubscription[]).map(transformContractSubscription);
        },
        120_000 // 2-minute TTL
      );

      // FALLBACK: If getSubscriptionsByAddress returns empty but we have planIds to check
      // This handles the case where contract's subscriberSubscriptions mapping isn't populated
      if (allSubs.length === 0 && planIds && planIds.length > 0) {
        console.warn('getSubscriptionsByAddress returned empty, falling back to plan loop method');

        // Check each plan individually (slower but reliable)
        for (const planId of planIds) {
          try {
            const planSub = await getPlanSubscription(provider, BigInt(planId), targetAddress);

            if (planSub && planSub.id && planSub.id !== 0n) {
              // Get full subscription data
              const fullSub = await getSubscription(provider, planSub.id);

              if (fullSub) {
                allSubs.push(transformContractSubscription(fullSub as ContractSubscription));
              }
            }
          } catch (planErr) {
            // Skip plans that error (might not exist)
            console.warn(`Failed to fetch subscription for plan ${planId}:`, planErr);
          }
        }
      }

      // FILTER: If planIds specified, filter results to only include those plans
      if (planIds && planIds.length > 0 && allSubs.length > 0) {
        allSubs = allSubs.filter(sub => planIds.includes(sub.planId));
      }

      // Apply pagination to results
      const startIdx = (page - 1) * pageSize;
      const endIdx = page * pageSize;
      const paginatedSubs = allSubs.slice(startIdx, endIdx);

      setSubscriptions(paginatedSubs);
      setTotal(allSubs.length);
      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      setSubscriptions([]);
      setTotal(0);
    }
  }, [provider, targetAddress, page, pageSize, planIds, cacheManager]);

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
