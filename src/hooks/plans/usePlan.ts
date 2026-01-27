/**
 * usePlan Hook
 *
 * Fetch a single subscription plan from the smart contract.
 */

import { useState, useEffect, useCallback } from 'react';
import { useSubscrypts } from '../../context/SubscryptsContext';
import { Plan } from '../../types';
import { getPlan } from '../../contract';
import { validatePlanId } from '../../utils/validators';

/**
 * Hook return type
 */
export interface UsePlanReturn {
  /** Plan data (null if not found or loading) */
  plan: Plan | null;
  /** Loading state */
  isLoading: boolean;
  /** Error if any */
  error: Error | null;
  /** Manually refresh plan data */
  refetch: () => Promise<void>;
}

/**
 * Fetch a single plan by ID
 *
 * @param planId - Plan ID to fetch
 *
 * @example
 * ```tsx
 * const { plan, isLoading, error } = usePlan('1');
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <Error message={error.message} />;
 * if (!plan) return <NotFound />;
 *
 * return <PlanDetails plan={plan} />;
 * ```
 */
export function usePlan(planId: string): UsePlanReturn {
  const { provider } = useSubscrypts();

  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch plan from contract
   */
  const fetchPlan = useCallback(async () => {
    // Validation
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
      const result = await getPlan(provider, BigInt(planId));
      setPlan(result as Plan);
      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      setPlan(null);
    }
  }, [provider, planId]);

  /**
   * Fetch on mount and when dependencies change
   */
  useEffect(() => {
    if (planId) {
      fetchPlan();
    }
  }, [fetchPlan, planId]);

  /**
   * Refetch function for manual refresh
   */
  const refetch = useCallback(async () => {
    await fetchPlan();
  }, [fetchPlan]);

  return {
    plan,
    isLoading,
    error,
    refetch
  };
}
