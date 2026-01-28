/**
 * SubscriptionGuard Component
 *
 * Protect routes and components based on subscription status.
 * Supports single-plan (planId) and multi-plan (planIds) gating.
 */

import { useEffect, useState, useCallback } from 'react';
import { useSubscriptionStatus } from '../../hooks/subscriptions/useSubscriptionStatus';
import { useSubscrypts } from '../../context/SubscryptsContext';
import { SubscriptionGuardProps } from '../../types';
import { ContractService } from '../../services';
import { LoadingSpinner } from '../shared/LoadingSpinner';

/**
 * Internal hook for multi-plan subscription checking.
 * Checks multiple plans and returns aggregate access state.
 */
function useMultiPlanStatus(
  planIds: string[],
  requireAll: boolean
) {
  const { subscryptsContract, wallet } = useSubscrypts();
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkPlans = useCallback(async () => {
    if (!subscryptsContract || !wallet.address || planIds.length === 0) {
      setIsActive(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const contractService = new ContractService(subscryptsContract);
      const now = Math.floor(Date.now() / 1000);

      const results = await Promise.all(
        planIds.map(async (planId) => {
          try {
            const subscription = await contractService.getPlanSubscription(
              planId,
              wallet.address!
            );
            if (!subscription) return false;
            return Number(subscription.nextPaymentDate) > now;
          } catch {
            return false;
          }
        })
      );

      const hasAccess = requireAll
        ? results.every((active) => active)
        : results.some((active) => active);

      setIsActive(hasAccess);
    } catch {
      setIsActive(false);
    } finally {
      setIsLoading(false);
    }
  }, [subscryptsContract, wallet.address, planIds, requireAll]);

  useEffect(() => {
    checkPlans();
  }, [checkPlans]);

  return { isActive, isLoading };
}

/**
 * Subscription Guard Component
 *
 * @example
 * ```tsx
 * // Single plan (backward compatible)
 * <SubscriptionGuard planId="1" fallbackUrl="/subscribe">
 *   <PremiumContent />
 * </SubscriptionGuard>
 *
 * // Multi-plan: any of these plans grants access
 * <SubscriptionGuard planIds={['1', '2', '3']}>
 *   <PremiumContent />
 * </SubscriptionGuard>
 *
 * // Multi-plan: require ALL plans
 * <SubscriptionGuard planIds={['1', '2']} requireAll>
 *   <BundleContent />
 * </SubscriptionGuard>
 * ```
 */
export function SubscriptionGuard({
  planId,
  planIds,
  requireAll = false,
  fallbackUrl,
  loadingComponent,
  children,
  onAccessDenied
}: SubscriptionGuardProps) {
  // Determine which mode: single plan or multi-plan
  const effectivePlanIds = planIds || (planId ? [planId] : []);
  const isSinglePlan = !planIds && !!planId;

  // Single plan mode: use the existing hook for backward compatibility
  const singlePlan = useSubscriptionStatus(isSinglePlan ? planId! : '0');

  // Multi-plan mode: use internal multi-plan hook
  const multiPlan = useMultiPlanStatus(
    isSinglePlan ? [] : effectivePlanIds,
    requireAll
  );

  // Resolve loading and access state based on mode
  const isLoading = isSinglePlan ? singlePlan.isLoading : multiPlan.isLoading;
  const hasAccess = isSinglePlan
    ? !!singlePlan.status?.isActive
    : multiPlan.isActive;

  /**
   * Handle access denial
   */
  useEffect(() => {
    if (!isLoading && !hasAccess) {
      if (onAccessDenied) {
        onAccessDenied();
      }

      if (fallbackUrl) {
        window.location.href = fallbackUrl;
      }
    }
  }, [isLoading, hasAccess, fallbackUrl, onAccessDenied]);

  // Show loading state
  if (isLoading) {
    return <>{loadingComponent || <LoadingSpinner />}</>;
  }

  // Block access if subscription is not active
  if (!hasAccess) {
    return null;
  }

  // Render protected content
  return <>{children}</>;
}
