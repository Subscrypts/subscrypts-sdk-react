/**
 * PricingTable Component
 *
 * Display multiple subscription plans in a responsive grid layout.
 */

import { useState } from 'react';
import { usePlans } from '../../hooks/plans';
import { PlanCard, PlanField } from './PlanCard';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { CheckoutWizard } from '../checkout/CheckoutWizard';

/**
 * Configuration for individual plan display
 */
export interface PlanConfig {
  /** Plan ID */
  planId: string;
  /** Custom title for this plan */
  title?: string;
  /** Whether this plan is featured/highlighted */
  featured?: boolean;
  /** Custom subscribe button label */
  subscribeLabel?: string;
}

/**
 * PricingTable props
 */
export interface PricingTableProps {
  /** Array of plan IDs or plan configurations to display */
  plans: (string | PlanConfig)[];
  /** Currency to display prices in (default: 'SUBS') */
  currency?: 'SUBS' | 'USDC';
  /** Fields to display on each plan card */
  showFields?: PlanField[];
  /** Number of columns in the grid (1-4, default: auto based on count) */
  columns?: 1 | 2 | 3 | 4;
  /** Custom callback when subscribe is clicked (overrides built-in checkout) */
  onSubscribe?: (planId: string) => void;
  /** Default subscribe button label (can be overridden per-plan) */
  subscribeLabel?: string;
  /** Additional CSS class name */
  className?: string;
  /** Callback when subscription is successful */
  onSubscriptionSuccess?: (subscriptionId: string, planId: string) => void;
  /** Callback when subscription fails */
  onSubscriptionError?: (error: Error, planId: string) => void;
  /** Referral address for subscriptions */
  referralAddress?: string;
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
  /** Custom error component */
  errorComponent?: React.ReactNode;
}

/**
 * PricingTable Component
 *
 * @example
 * ```tsx
 * // Simple usage with plan IDs
 * <PricingTable
 *   plans={['1', '2', '3']}
 *   currency="SUBS"
 *   showFields={['description', 'amount', 'frequency', 'subscribers']}
 * />
 *
 * // With custom configuration per plan
 * <PricingTable
 *   plans={[
 *     { planId: '1', title: 'Basic', subscribeLabel: 'Start Free' },
 *     { planId: '2', title: 'Pro', featured: true, subscribeLabel: 'Go Pro' },
 *     { planId: '3', title: 'Enterprise', subscribeLabel: 'Contact Us' }
 *   ]}
 * />
 * ```
 */
export function PricingTable({
  plans,
  currency = 'SUBS',
  showFields = ['description', 'amount', 'frequency'],
  columns,
  onSubscribe: customOnSubscribe,
  subscribeLabel = 'Subscribe',
  className = '',
  onSubscriptionSuccess,
  onSubscriptionError,
  referralAddress,
  loadingComponent,
  errorComponent
}: PricingTableProps) {
  // Extract plan IDs and configs
  const planConfigs = plans.map(p =>
    typeof p === 'string' ? { planId: p } : p
  );
  const planIds = planConfigs.map(c => c.planId);

  // Fetch plans from contract
  const { plans: fetchedPlans, isLoading, error } = usePlans(planIds);

  // Checkout state
  const [checkoutPlanId, setCheckoutPlanId] = useState<string | null>(null);

  // Determine columns
  const gridColumns = columns || Math.min(planConfigs.length, 3);

  const handleSubscribe = (planId: string) => {
    if (customOnSubscribe) {
      customOnSubscribe(planId);
    } else {
      setCheckoutPlanId(planId);
    }
  };

  const handleCheckoutClose = () => {
    setCheckoutPlanId(null);
  };

  const handleCheckoutSuccess = (subscriptionId: string) => {
    if (onSubscriptionSuccess && checkoutPlanId) {
      onSubscriptionSuccess(subscriptionId, checkoutPlanId);
    }
    setCheckoutPlanId(null);
  };

  const handleCheckoutError = (err: Error) => {
    if (onSubscriptionError && checkoutPlanId) {
      onSubscriptionError(err, checkoutPlanId);
    }
  };

  // Loading state
  if (isLoading) {
    return loadingComponent || (
      <div className="subscrypts-pricing-table-loading">
        <LoadingSpinner />
        <p>Loading plans...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return errorComponent || (
      <div className="subscrypts-pricing-table-error">
        <p>Failed to load plans: {error.message}</p>
      </div>
    );
  }

  // Empty state
  if (fetchedPlans.length === 0) {
    return (
      <div className="subscrypts-pricing-table-empty">
        <p>No plans available</p>
      </div>
    );
  }

  const gridClass = `subscrypts-pricing-table subscrypts-pricing-table-cols-${gridColumns} ${className}`;

  return (
    <>
      <div className={gridClass}>
        {fetchedPlans.map((plan, index) => {
          const config = planConfigs[index];
          return (
            <PlanCard
              key={plan.id.toString()}
              plan={plan}
              currency={currency}
              showFields={showFields}
              onSubscribe={handleSubscribe}
              subscribeLabel={config.subscribeLabel || subscribeLabel}
              featured={config.featured}
              title={config.title}
            />
          );
        })}
      </div>

      {/* Built-in Checkout Wizard */}
      {checkoutPlanId && (
        <CheckoutWizard
          planId={checkoutPlanId}
          isOpen={true}
          onClose={handleCheckoutClose}
          onSuccess={handleCheckoutSuccess}
          onError={handleCheckoutError}
          referralAddress={referralAddress}
        />
      )}
    </>
  );
}
