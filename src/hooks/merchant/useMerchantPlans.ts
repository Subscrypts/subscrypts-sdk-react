/**
 * useMerchantPlans Hook
 *
 * Fetch all plans owned by the connected wallet (merchant).
 */

import { useSubscrypts } from '../../context/SubscryptsContext';
import { usePlansByMerchant, UsePlansByMerchantReturn } from '../plans/usePlansByMerchant';

/**
 * Hook return type (re-exported from usePlansByMerchant)
 */
export type UseMerchantPlansReturn = UsePlansByMerchantReturn;

/**
 * Fetch all plans owned by the connected wallet.
 *
 * This is a convenience wrapper around usePlansByMerchant that uses
 * the connected wallet address automatically.
 *
 * @example
 * ```tsx
 * const { plans, total, isLoading } = useMerchantPlans();
 *
 * return (
 *   <div>
 *     <h2>My Plans ({total})</h2>
 *     {plans.map(plan => (
 *       <div key={plan.id.toString()}>
 *         {plan.description} - {plan.subscriberCount.toString()} subscribers
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useMerchantPlans(): UseMerchantPlansReturn {
  const { wallet } = useSubscrypts();

  // Use wallet address or fallback to empty string (will error appropriately)
  const merchantAddress = wallet?.address || '';

  return usePlansByMerchant(merchantAddress);
}
