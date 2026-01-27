/**
 * usePlans Hook
 *
 * Fetch multiple subscription plans from the smart contract.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSubscrypts } from '../../context/SubscryptsContext';
import { Plan } from '../../types';
import { getPlan } from '../../contract';
import { validatePlanId } from '../../utils/validators';

/**
 * Hook return type
 */
export interface UsePlansReturn {
  /** Array of plans (empty if loading or error) */
  plans: Plan[];
  /** Loading state */
  isLoading: boolean;
  /** Error if any */
  error: Error | null;
  /** Manually refresh all plans */
  refetch: () => Promise<void>;
}

/**
 * Fetch multiple plans by IDs
 *
 * @param planIds - Array of plan IDs to fetch
 *
 * @example
 * ```tsx
 * const { plans, isLoading, error } = usePlans(['1', '2', '3']);
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <Error message={error.message} />;
 *
 * return (
 *   <div className="grid">
 *     {plans.map(plan => <PlanCard key={plan.id.toString()} plan={plan} />)}
 *   </div>
 * );
 * ```
 */
export function usePlans(planIds: string[]): UsePlansReturn {
  const { provider } = useSubscrypts();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Memoize planIds to prevent unnecessary re-fetches
  const planIdsKey = useMemo(() => planIds.join(','), [planIds]);

  /**
   * Fetch all plans from contract in parallel
   */
  const fetchPlans = useCallback(async () => {
    if (!planIds || planIds.length === 0) {
      setPlans([]);
      setIsLoading(false);
      return;
    }

    // Validate all plan IDs
    try {
      planIds.forEach(id => validatePlanId(id));
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
      // Fetch all plans in parallel
      const planPromises = planIds.map(id =>
        getPlan(provider, BigInt(id))
      );

      const results = await Promise.all(planPromises);
      setPlans(results as Plan[]);
      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      setPlans([]);
    }
  }, [provider, planIdsKey]);

  /**
   * Fetch on mount and when dependencies change
   */
  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  /**
   * Refetch function for manual refresh
   */
  const refetch = useCallback(async () => {
    await fetchPlans();
  }, [fetchPlans]);

  return {
    plans,
    isLoading,
    error,
    refetch
  };
}
