/**
 * SubscriptionCard Component
 *
 * Display subscription info with status badge, amount, frequency, and manage button.
 */

import { useState } from 'react';
import { ManageSubscriptionModal } from './ManageSubscriptionModal';
import { resolveSubscriptionStatus } from '../../utils/subscriptionStatus';
import { formatSubs, formatDate } from '../../utils/formatters';
import type { Subscription } from '../../types';

/**
 * SubscriptionCard props
 */
export interface SubscriptionCardProps {
  /** Subscription to display */
  subscription: Subscription;
  /** Show manage button (default: true) */
  showManageButton?: boolean;
  /** Show fiat price (default: false) */
  showFiatPrice?: boolean;
  /** Custom manage handler (overrides default modal) */
  onManage?: (subscriptionId: string) => void;
  /** Called when subscription is cancelled */
  onCancelled?: () => void;
  /** Called when subscription is updated */
  onUpdated?: () => void;
  /** Additional CSS class */
  className?: string;
}

/**
 * Card displaying subscription details with status badge.
 *
 * @example
 * ```tsx
 * <SubscriptionCard
 *   subscription={subscription}
 *   showManageButton={true}
 *   onCancelled={() => refetch()}
 * />
 * ```
 */
export function SubscriptionCard({
  subscription,
  showManageButton = true,
  showFiatPrice: _showFiatPrice = false,
  onManage,
  onCancelled,
  onUpdated,
  className = ''
}: SubscriptionCardProps) {
  const [showManageModal, setShowManageModal] = useState(false);

  // Resolve subscription status
  const status = resolveSubscriptionStatus({ subscription });

  // Determine badge variant based on state
  const getBadgeVariant = (): 'active' | 'expired' | 'expiring' | 'cancelled' => {
    switch (status.state) {
      case 'active':
        return 'active';
      case 'expiring-soon':
        return 'expiring';
      case 'expired':
        return 'expired';
      case 'cancelled':
        return 'cancelled';
      default:
        return 'expired';
    }
  };

  // Get badge label
  const getBadgeLabel = (): string => {
    switch (status.state) {
      case 'active':
        return 'Active';
      case 'expiring-soon':
        return 'Expiring Soon';
      case 'expired':
        return 'Expired';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  // Format frequency
  const getFrequencyLabel = (): string => {
    const seconds = Number(subscription.paymentFrequency);
    const days = seconds / 86400;

    if (days === 1) return 'Daily';
    if (days === 7) return 'Weekly';
    if (days === 30 || days === 31) return 'Monthly';
    if (days === 365) return 'Yearly';
    return `Every ${days} days`;
  };

  const handleManageClick = () => {
    if (onManage) {
      onManage(subscription.id);
    } else {
      setShowManageModal(true);
    }
  };

  const handleCancelled = () => {
    setShowManageModal(false);
    onCancelled?.();
  };

  const handleUpdated = () => {
    setShowManageModal(false);
    onUpdated?.();
  };

  return (
    <>
      <div className={`subscrypts-subscription-card ${className}`}>
        {/* Header: Status Badge */}
        <div className="subscrypts-subscription-card__header">
          <span className={`subscrypts-subscription-card__badge subscrypts-subscription-card__badge--${getBadgeVariant()}`}>
            {getBadgeLabel()}
          </span>
        </div>

        {/* Content: Amount & Frequency */}
        <div className="subscrypts-subscription-card__content">
          <div className="subscrypts-subscription-card__amount">
            {formatSubs(subscription.subscriptionAmount)} SUBS
          </div>
          <div className="subscrypts-subscription-card__frequency">
            {getFrequencyLabel()}
          </div>
        </div>

        {/* Details Grid */}
        <div className="subscrypts-subscription-card__details">
          <div className="subscrypts-subscription-card__detail-row">
            <span className="subscrypts-subscription-card__detail-label">Next Payment</span>
            <span className="subscrypts-subscription-card__detail-value">
              {formatDate(subscription.nextPaymentDate)}
            </span>
          </div>

          <div className="subscrypts-subscription-card__detail-row">
            <span className="subscrypts-subscription-card__detail-label">Auto-Renewal</span>
            <span className="subscrypts-subscription-card__detail-value">
              {subscription.isAutoRenewing ? 'Enabled' : 'Disabled'}
            </span>
          </div>

          <div className="subscrypts-subscription-card__detail-row">
            <span className="subscrypts-subscription-card__detail-label">Remaining Cycles</span>
            <span className="subscrypts-subscription-card__detail-value">
              {subscription.remainingCycles === 0 ? 'Unlimited' : subscription.remainingCycles}
            </span>
          </div>

          {status.daysUntilExpiry !== null && (
            <div className="subscrypts-subscription-card__detail-row">
              <span className="subscrypts-subscription-card__detail-label">Days Until Expiry</span>
              <span className="subscrypts-subscription-card__detail-value">
                {status.daysUntilExpiry}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        {showManageButton && (
          <div className="subscrypts-subscription-card__actions">
            <button
              className="subscrypts-btn subscrypts-btn-secondary"
              onClick={handleManageClick}
            >
              Manage
            </button>
          </div>
        )}
      </div>

      {/* Manage Modal */}
      {!onManage && (
        <ManageSubscriptionModal
          isOpen={showManageModal}
          onClose={() => setShowManageModal(false)}
          subscriptionId={subscription.id}
          subscription={subscription}
          onCancelled={handleCancelled}
          onUpdated={handleUpdated}
        />
      )}
    </>
  );
}
