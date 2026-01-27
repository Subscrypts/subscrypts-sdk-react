/**
 * PlanCard Component
 *
 * Displays a subscription plan with configurable fields and subscribe button.
 */

import { Plan } from '../../types';
import { DECIMALS } from '../../contract';

/**
 * Available fields that can be displayed on the plan card
 */
export type PlanField =
  | 'description'
  | 'amount'
  | 'frequency'
  | 'subscribers'
  | 'merchant'
  | 'referralBonus'
  | 'attributes';

/**
 * PlanCard props
 */
export interface PlanCardProps {
  /** Plan data from smart contract */
  plan: Plan;
  /** Currency to display prices in (default: 'SUBS') */
  currency?: 'SUBS' | 'USDC';
  /** Fields to display on the card (default: description, amount, frequency) */
  showFields?: PlanField[];
  /** Callback when subscribe button is clicked */
  onSubscribe?: (planId: string) => void;
  /** Custom label for subscribe button */
  subscribeLabel?: string;
  /** Additional CSS class name */
  className?: string;
  /** Whether to show the subscribe button (default: true) */
  showSubscribeButton?: boolean;
  /** Whether the plan card is highlighted/featured */
  featured?: boolean;
  /** Custom header/title for the card */
  title?: string;
}

/**
 * Format payment frequency in human-readable text
 */
function formatFrequency(frequency: bigint): string {
  const seconds = Number(frequency);
  const days = seconds / 86400;

  if (days === 1) return 'Daily';
  if (days === 7) return 'Weekly';
  if (days === 14) return 'Bi-weekly';
  if (days >= 28 && days <= 31) return 'Monthly';
  if (days >= 89 && days <= 92) return 'Quarterly';
  if (days >= 365 && days <= 366) return 'Yearly';

  return `Every ${days} days`;
}

/**
 * Format amount with proper decimals
 */
function formatAmount(amount: bigint, decimals: number): string {
  const divisor = BigInt(10 ** decimals);
  const whole = amount / divisor;
  const fraction = amount % divisor;

  if (fraction === 0n) {
    return whole.toString();
  }

  const fractionStr = fraction.toString().padStart(decimals, '0').replace(/0+$/, '');
  return `${whole}.${fractionStr}`;
}

/**
 * PlanCard Component
 *
 * @example
 * ```tsx
 * <PlanCard
 *   plan={plan}
 *   currency="SUBS"
 *   showFields={['description', 'amount', 'frequency', 'subscribers']}
 *   onSubscribe={(planId) => openCheckout(planId)}
 *   subscribeLabel="Get Started"
 * />
 * ```
 */
export function PlanCard({
  plan,
  currency = 'SUBS',
  showFields = ['description', 'amount', 'frequency'],
  onSubscribe,
  subscribeLabel = 'Subscribe',
  className = '',
  showSubscribeButton = true,
  featured = false,
  title
}: PlanCardProps) {
  const decimals = currency === 'SUBS' ? DECIMALS.SUBS : DECIMALS.USDC;
  const formattedAmount = formatAmount(plan.subscriptionAmount, decimals);
  const formattedFrequency = formatFrequency(plan.paymentFrequency);

  const handleSubscribe = () => {
    if (onSubscribe) {
      onSubscribe(plan.id.toString());
    }
  };

  const cardClasses = [
    'subscrypts-plan-card',
    featured ? 'subscrypts-plan-card-featured' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses}>
      {/* Header */}
      <div className="subscrypts-plan-card-header">
        {title && <h3 className="subscrypts-plan-card-title">{title}</h3>}
        {!title && plan.description && (
          <h3 className="subscrypts-plan-card-title">{plan.description}</h3>
        )}
        {featured && <span className="subscrypts-plan-card-badge">Featured</span>}
      </div>

      {/* Price */}
      {showFields.includes('amount') && (
        <div className="subscrypts-plan-card-price">
          <span className="subscrypts-plan-card-amount">{formattedAmount}</span>
          <span className="subscrypts-plan-card-currency">{currency}</span>
          {showFields.includes('frequency') && (
            <span className="subscrypts-plan-card-frequency">/ {formattedFrequency}</span>
          )}
        </div>
      )}

      {/* Details */}
      <div className="subscrypts-plan-card-details">
        {showFields.includes('description') && plan.description && !title && (
          <p className="subscrypts-plan-card-description">{plan.description}</p>
        )}

        {showFields.includes('subscribers') && (
          <p className="subscrypts-plan-card-subscribers">
            {plan.subscriberCount.toString()} subscribers
          </p>
        )}

        {showFields.includes('merchant') && (
          <p className="subscrypts-plan-card-merchant">
            Merchant: {plan.merchantAddress.slice(0, 6)}...{plan.merchantAddress.slice(-4)}
          </p>
        )}

        {showFields.includes('referralBonus') && plan.referralBonus > 0n && (
          <p className="subscrypts-plan-card-referral">
            Referral Bonus: {formatAmount(plan.referralBonus, decimals)} {currency}
          </p>
        )}

        {showFields.includes('attributes') && plan.defaultAttributes && (
          <p className="subscrypts-plan-card-attributes">{plan.defaultAttributes}</p>
        )}
      </div>

      {/* Subscribe Button */}
      {showSubscribeButton && (
        <div className="subscrypts-plan-card-actions">
          <button
            onClick={handleSubscribe}
            className="subscrypts-btn subscrypts-btn-primary subscrypts-btn-md subscrypts-w-full"
            disabled={!plan.isActive}
          >
            {plan.isActive ? subscribeLabel : 'Unavailable'}
          </button>
        </div>
      )}
    </div>
  );
}
