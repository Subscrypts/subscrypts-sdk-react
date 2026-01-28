/**
 * useMerchantRevenue Hook
 *
 * Calculate Monthly Recurring Revenue (MRR) from active subscriptions.
 */

import { useState, useEffect, useCallback } from 'react';
import { useSubscrypts } from '../../context/SubscryptsContext';
import { useMerchantPlans } from './useMerchantPlans';
import { useSUBSPrice } from '../pricing/useSUBSPrice';
import { getSubscriptionsByPlan } from '../../contract';
import { resolveSubscriptionStatus } from '../../utils/subscriptionStatus';
import { formatSubs } from '../../utils/formatters';
import type { Subscription } from '../../types';

/**
 * Merchant revenue data
 */
export interface MerchantRevenueData {
  /** Total number of subscribers across all plans */
  totalSubscribers: number;
  /** Number of active subscribers */
  activeSubscribers: number;
  /** Monthly Recurring Revenue in SUBS (18 decimals) */
  monthlyRecurringRevenue: bigint;
  /** MRR formatted as SUBS string */
  mrrFormatted: string;
  /** MRR in USD (estimated using current SUBS price) */
  mrrUsdEstimate: number | null;
}

/**
 * Hook return type
 */
export interface UseMerchantRevenueReturn {
  /** Revenue data (null if loading or error) */
  revenue: MerchantRevenueData | null;
  /** Loading state */
  isLoading: boolean;
  /** Error if any */
  error: Error | null;
  /** Manually refresh revenue */
  refetch: () => Promise<void>;
}

/**
 * Calculate Monthly Recurring Revenue from active subscriptions.
 *
 * Fetches all subscriptions for the merchant's plans, filters for active ones,
 * and calculates MRR by normalizing all subscriptions to monthly amounts.
 *
 * @param planIds - Optional array of plan IDs to calculate revenue for (defaults to all merchant plans)
 *
 * @example
 * ```tsx
 * const { revenue, isLoading } = useMerchantRevenue();
 *
 * if (revenue) {
 *   return (
 *     <div>
 *       <h2>Revenue Dashboard</h2>
 *       <p>MRR: {revenue.mrrFormatted} SUBS</p>
 *       <p>≈ ${revenue.mrrUsdEstimate?.toFixed(2)}</p>
 *       <p>{revenue.activeSubscribers} / {revenue.totalSubscribers} active</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useMerchantRevenue(planIds?: string[]): UseMerchantRevenueReturn {
  const { provider } = useSubscrypts();
  const { plans, isLoading: plansLoading, error: plansError } = useMerchantPlans();
  const { priceUsd } = useSUBSPrice();

  const [revenue, setRevenue] = useState<MerchantRevenueData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Calculate MRR from subscriptions
   */
  const calculateRevenue = useCallback(async () => {
    if (plansError) {
      setError(plansError);
      setIsLoading(false);
      return;
    }

    if (plansLoading) {
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
      // Determine which plans to calculate revenue for
      const targetPlans = planIds
        ? plans.filter(p => planIds.includes(p.id.toString()))
        : plans;

      if (targetPlans.length === 0) {
        setRevenue({
          totalSubscribers: 0,
          activeSubscribers: 0,
          monthlyRecurringRevenue: 0n,
          mrrFormatted: '0.0000',
          mrrUsdEstimate: 0
        });
        setIsLoading(false);
        return;
      }

      // Fetch all subscriptions for all plans
      const allSubscriptionsPromises = targetPlans.map(async (plan) => {
        const planSubscriberCount = Number(plan.subscriberCount);
        if (planSubscriberCount === 0) {
          return [];
        }

        // Fetch all subscriptions for this plan (1-indexed)
        const [subs] = await getSubscriptionsByPlan(
          provider,
          plan.id,
          1n,
          BigInt(planSubscriberCount)
        );
        return subs as Subscription[];
      });

      const subscriptionArrays = await Promise.all(allSubscriptionsPromises);
      const allSubscriptions = subscriptionArrays.flat();

      // Filter for active subscriptions
      const activeSubscriptions = allSubscriptions.filter(sub => {
        const status = resolveSubscriptionStatus({ subscription: sub });
        return status.isActive;
      });

      // Calculate MRR by normalizing all subscriptions to monthly amounts
      // Formula: (subscriptionAmount / paymentFrequency) * SECONDS_PER_MONTH
      const SECONDS_PER_MONTH = 2_592_000n; // 30 days

      let totalMrr = 0n;
      for (const sub of activeSubscriptions) {
        const amountPerSecond = sub.subscriptionAmount / sub.paymentFrequency;
        const monthlyAmount = amountPerSecond * SECONDS_PER_MONTH;
        totalMrr += monthlyAmount;
      }

      // Convert to USD if price available
      const mrrUsd = priceUsd
        ? Number(totalMrr) / 1e18 * priceUsd
        : null;

      setRevenue({
        totalSubscribers: allSubscriptions.length,
        activeSubscribers: activeSubscriptions.length,
        monthlyRecurringRevenue: totalMrr,
        mrrFormatted: formatSubs(totalMrr),
        mrrUsdEstimate: mrrUsd
      });

      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      setRevenue(null);
    }
  }, [provider, plans, planIds, plansLoading, plansError, priceUsd]);

  /**
   * Calculate on mount and when dependencies change
   */
  useEffect(() => {
    calculateRevenue();
  }, [calculateRevenue]);

  /**
   * Refetch function for manual refresh
   */
  const refetch = useCallback(async () => {
    await calculateRevenue();
  }, [calculateRevenue]);

  return {
    revenue,
    isLoading,
    error,
    refetch
  };
}
