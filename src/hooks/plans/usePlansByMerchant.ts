/**
 * usePlansByMerchant Hook
 *
 * Fetch all plans created by a specific merchant address.
 */

import { useState, useEffect, useCallback } from 'react';
import { useSubscrypts } from '../../context/SubscryptsContext';
import { getPlans, planAutoIncrement } from '../../contract';
import { validateAddress } from '../../utils/validators';
import type { Plan } from '../../types';

/**
 * Hook return type
 */
export interface UsePlansByMerchantReturn {
  /** Plans created by the merchant */
  plans: Plan[];
  /** Total matching plans */
  total: number;
  /** Loading state */
  isLoading: boolean;
  /** Error if any */
  error: Error | null;
  /** Manually refresh data */
  refetch: () => Promise<void>;
}

/**
 * Fetch all plans created by a specific merchant address.
 *
 * Fetches all plans from the contract and filters client-side by merchantAddress.
 *
 * @param merchantAddress - Ethereum address of the merchant
 *
 * @example
 * ```tsx
 * const { plans, total, isLoading } = usePlansByMerchant('0x1234...');
 *
 * plans.forEach(plan => {
 *   console.log(plan.description, plan.subscriberCount);
 * });
 * ```
 */
export function usePlansByMerchant(merchantAddress: string): UsePlansByMerchantReturn {
  const { provider } = useSubscrypts();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPlans = useCallback(async () => {
    try {
      validateAddress(merchantAddress);
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
      // Get total plan count
      const totalPlans = await planAutoIncrement(provider);
      const count = Number(totalPlans);

      if (count === 0) {
        setPlans([]);
        setTotal(0);
        setIsLoading(false);
        return;
      }

      // Fetch all plans (1-indexed)
      const [allPlans] = await getPlans(provider, 1n, BigInt(count));

      // Filter by merchant address (case-insensitive comparison)
      const merchantPlans = (allPlans as Plan[]).filter(
        (p) => p.merchantAddress.toLowerCase() === merchantAddress.toLowerCase()
      );

      setPlans(merchantPlans);
      setTotal(merchantPlans.length);
      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      setPlans([]);
    }
  }, [provider, merchantAddress]);

  useEffect(() => {
    if (merchantAddress) {
      fetchPlans();
    }
  }, [fetchPlans, merchantAddress]);

  const refetch = useCallback(async () => {
    await fetchPlans();
  }, [fetchPlans]);

  return {
    plans,
    total,
    isLoading,
    error,
    refetch
  };
}
