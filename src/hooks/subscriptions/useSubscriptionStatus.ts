/**
 * useSubscriptionStatus Hook
 *
 * Core hook for checking if a wallet has an active subscription to a plan.
 * This is the primary hook for access control and gating features.
 */

import { useState, useEffect, useCallback } from 'react';
import { useSubscrypts } from '../../context/SubscryptsContext';
import { SubscriptionStatus, ContractSubscription } from '../../types';
import { getPlanSubscription, getSubscription } from '../../contract';
import { validatePlanId } from '../../utils/validators';

/**
 * Hook return type
 */
export interface UseSubscriptionStatusReturn {
  /** Subscription status (null if not found) */
  status: SubscriptionStatus | null;
  /** Loading state */
  isLoading: boolean;
  /** Error if any */
  error: Error | null;
  /** Manually refresh subscription status */
  refetch: () => Promise<void>;
}

/**
 * Check subscription status for a specific plan
 *
 * @param planId - Plan ID to check
 * @param subscriber - Optional subscriber address (defaults to connected wallet)
 *
 * @example
 * ```tsx
 * const { status, isLoading, error } = useSubscriptionStatus('1');
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <Error message={error.message} />;
 * if (!status?.isActive) return <Subscribe />;
 *
 * return <PremiumContent />;
 * ```
 */
export function useSubscriptionStatus(
  planId: string,
  subscriber?: string
): UseSubscriptionStatusReturn {
  const { subscryptsContract, wallet, cacheManager } = useSubscrypts();

  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Determine which address to check
  const addressToCheck = subscriber || wallet.address;

  /**
   * Fetch subscription status from contract
   */
  const fetchStatus = useCallback(async () => {
    // Validation
    try {
      validatePlanId(planId);
    } catch (validationError) {
      setError(validationError as Error);
      setIsLoading(false);
      return;
    }

    if (!subscryptsContract) {
      setError(new Error('Subscrypts contract not initialized'));
      setIsLoading(false);
      return;
    }

    if (!addressToCheck) {
      setError(new Error('No wallet address available'));
      setIsLoading(false);
      return;
    }

    if (!cacheManager) {
      setError(new Error('Cache manager not initialized'));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use contract.runner for read operations (supports both provider and signer with provider)
      const runner = subscryptsContract.runner;
      if (!runner) {
        throw new Error('Contract runner not available');
      }

      const cacheKey = `subscription-status:${planId}:${addressToCheck}`;

      // Calculate smart TTL based on subscription expiration
      const getSmartTTL = (subscription: ContractSubscription | null): number => {
        if (!subscription || !subscription.nextPaymentDate) return 30_000; // Default 30s

        const now = Math.floor(Date.now() / 1000);
        const expiresIn = Number(subscription.nextPaymentDate) - now;

        if (expiresIn < 300) return 10_000; // Expires soon: 10s TTL
        if (expiresIn < 3600) return 30_000; // Expires in <1hr: 30s TTL
        return 60_000; // Expires later: 60s TTL
      };

      // Fetch subscription data with caching
      const result = await cacheManager.get(
        cacheKey,
        async () => {
          // STEP 1: Get subscriptionId from plan/subscriber mapping
          const planSub = await getPlanSubscription(runner, BigInt(planId), addressToCheck);
          if (!planSub || planSub.id === 0n) return null;

          // STEP 2: Get FULL subscription data with authoritative nextPaymentDate
          return await getSubscription(runner, planSub.id);
        },
        undefined // Use default TTL initially, will be updated below
      );

      // Update cache with smart TTL based on the result
      if (result) {
        cacheManager.set(cacheKey, result, getSmartTTL(result as ContractSubscription));
      }

      const subscription = result as ContractSubscription | null;

      // Extract subscriptionId
      const subscriptionId = subscription?.id ?? 0n;

      if (subscriptionId === 0n || !subscription) {
        setStatus({
          isActive: false,
          expirationDate: null,
          isAutoRenewing: false,
          remainingCycles: 0,
          subscriptionId: null
        });
        setIsLoading(false);
        return;
      }

      // Check if subscription is active using REAL nextPaymentDate
      const now = Math.floor(Date.now() / 1000);
      const nextPaymentDate = subscription.nextPaymentDate ?? 0n;
      const isActive = Number(nextPaymentDate) > now;

      setStatus({
        isActive,
        expirationDate: new Date(Number(nextPaymentDate) * 1000),
        isAutoRenewing: subscription.isRecurring,
        remainingCycles: Number(subscription.remainingCycles),
        subscriptionId: subscriptionId.toString()
      });

      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      setStatus(null);
    }
  }, [subscryptsContract, planId, addressToCheck, cacheManager]);

  /**
   * Fetch on mount and when dependencies change
   */
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  /**
   * Refetch function for manual refresh
   */
  const refetch = useCallback(async () => {
    await fetchStatus();
  }, [fetchStatus]);

  return {
    status,
    isLoading,
    error,
    refetch
  };
}
