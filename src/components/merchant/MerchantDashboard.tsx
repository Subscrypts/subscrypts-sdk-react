/**
 * MerchantDashboard Component
 *
 * Complete merchant overview with revenue metrics, plan list, and subscriber stats.
 */

import { useState } from 'react';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { ErrorDisplay } from '../shared/ErrorDisplay';
import { useMerchantRevenue } from '../../hooks/merchant/useMerchantRevenue';
import { useMerchantPlans } from '../../hooks/merchant/useMerchantPlans';
import { useMerchantSubscribers } from '../../hooks/merchant/useMerchantSubscribers';
import { formatFiatPrice } from '../../utils/formatters';

/**
 * MerchantDashboard props
 */
export interface MerchantDashboardProps {
  /** Merchant address (defaults to connected wallet) */
  merchantAddress?: string;
  /** Additional CSS class */
  className?: string;
}

/**
 * Complete merchant dashboard showing revenue, plans, and subscribers.
 *
 * @example
 * ```tsx
 * <MerchantDashboard />
 * ```
 */
export function MerchantDashboard({
  merchantAddress: _merchantAddress,
  className = ''
}: MerchantDashboardProps) {
  const { revenue, isLoading: revenueLoading, error: revenueError } = useMerchantRevenue();
  const { plans, isLoading: plansLoading, error: plansError } = useMerchantPlans();

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  // Load subscribers for selected plan
  const {
    subscribers,
    total: subscriberTotal,
    activeCount,
    isLoading: subscribersLoading
  } = useMerchantSubscribers(
    selectedPlanId || '0',
    10
  );

  // Combined loading state
  const isLoading = revenueLoading || plansLoading;

  // Combined error state
  const error = revenueError || plansError;

  // Loading state
  if (isLoading) {
    return (
      <div className="subscrypts-merchant-dashboard__loading">
        <LoadingSpinner />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="subscrypts-merchant-dashboard__error">
        <ErrorDisplay error={error} />
      </div>
    );
  }

  // Empty state (no plans)
  if (!plans || plans.length === 0) {
    return (
      <div className={`subscrypts-merchant-dashboard ${className}`}>
        <div className="subscrypts-merchant-dashboard__empty">
          <h2 className="subscrypts-merchant-dashboard__empty-title">
            No Plans Yet
          </h2>
          <p className="subscrypts-merchant-dashboard__empty-text">
            Create your first subscription plan to start earning revenue
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`subscrypts-merchant-dashboard ${className}`}>
      {/* Header */}
      <div className="subscrypts-merchant-dashboard__header">
        <h1 className="subscrypts-merchant-dashboard__title">
          Merchant Dashboard
        </h1>
      </div>

      {/* Revenue Summary Card */}
      <div className="subscrypts-merchant-dashboard__revenue-card">
        <h2 className="subscrypts-merchant-dashboard__section-title">
          Revenue Overview
        </h2>

        {revenue && (
          <div className="subscrypts-merchant-dashboard__metrics">
            <div className="subscrypts-merchant-dashboard__metric">
              <div className="subscrypts-merchant-dashboard__metric-label">
                Monthly Recurring Revenue
              </div>
              <div className="subscrypts-merchant-dashboard__metric-value subscrypts-merchant-dashboard__metric-value--primary">
                {revenue.mrrFormatted} SUBS
              </div>
              {revenue.mrrUsdEstimate !== null && (
                <div className="subscrypts-merchant-dashboard__metric-subvalue">
                  ≈ {formatFiatPrice(revenue.mrrUsdEstimate)}
                </div>
              )}
            </div>

            <div className="subscrypts-merchant-dashboard__metric">
              <div className="subscrypts-merchant-dashboard__metric-label">
                Active Subscribers
              </div>
              <div className="subscrypts-merchant-dashboard__metric-value">
                {revenue.activeSubscribers}
              </div>
              <div className="subscrypts-merchant-dashboard__metric-subvalue">
                of {revenue.totalSubscribers} total
              </div>
            </div>

            <div className="subscrypts-merchant-dashboard__metric">
              <div className="subscrypts-merchant-dashboard__metric-label">
                Active Plans
              </div>
              <div className="subscrypts-merchant-dashboard__metric-value">
                {plans.filter(p => p.isActive).length}
              </div>
              <div className="subscrypts-merchant-dashboard__metric-subvalue">
                of {plans.length} total
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Plans Section */}
      <div className="subscrypts-merchant-dashboard__section">
        <h2 className="subscrypts-merchant-dashboard__section-title">
          Your Plans
        </h2>

        <div className="subscrypts-merchant-dashboard__plans-grid">
          {plans.map((plan) => (
            <div
              key={plan.id.toString()}
              className={`subscrypts-merchant-dashboard__plan-card ${
                selectedPlanId === plan.id.toString()
                  ? 'subscrypts-merchant-dashboard__plan-card--selected'
                  : ''
              }`}
              onClick={() => setSelectedPlanId(plan.id.toString())}
            >
              <div className="subscrypts-merchant-dashboard__plan-header">
                <h3 className="subscrypts-merchant-dashboard__plan-name">
                  Plan #{plan.id.toString()}
                </h3>
                {plan.isActive && (
                  <span className="subscrypts-merchant-dashboard__plan-badge">
                    Active
                  </span>
                )}
              </div>

              <div className="subscrypts-merchant-dashboard__plan-description">
                {plan.description || 'No description'}
              </div>

              <div className="subscrypts-merchant-dashboard__plan-stats">
                <div className="subscrypts-merchant-dashboard__plan-stat">
                  <span className="subscrypts-merchant-dashboard__plan-stat-label">
                    Subscribers:
                  </span>
                  <span className="subscrypts-merchant-dashboard__plan-stat-value">
                    {plan.subscriberCount.toString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscribers Section (for selected plan) */}
      {selectedPlanId && (
        <div className="subscrypts-merchant-dashboard__section">
          <h2 className="subscrypts-merchant-dashboard__section-title">
            Subscribers for Plan #{selectedPlanId}
          </h2>

          {subscribersLoading ? (
            <div className="subscrypts-merchant-dashboard__subscribers-loading">
              <LoadingSpinner />
              <p>Loading subscribers...</p>
            </div>
          ) : subscribers.length === 0 ? (
            <div className="subscrypts-merchant-dashboard__subscribers-empty">
              <p>No subscribers yet for this plan</p>
            </div>
          ) : (
            <>
              <div className="subscrypts-merchant-dashboard__subscribers-summary">
                <p>
                  {activeCount} active out of {subscriberTotal} total subscribers
                </p>
              </div>

              <div className="subscrypts-merchant-dashboard__subscribers-list">
                {subscribers.map((sub) => (
                  <div
                    key={sub.id}
                    className="subscrypts-merchant-dashboard__subscriber-item"
                  >
                    <div className="subscrypts-merchant-dashboard__subscriber-address">
                      {sub.subscriber.slice(0, 6)}...{sub.subscriber.slice(-4)}
                    </div>
                    <div className="subscrypts-merchant-dashboard__subscriber-status">
                      {sub.isAutoRenewing ? 'Auto-renewing' : 'Manual'}
                    </div>
                    <div className="subscrypts-merchant-dashboard__subscriber-cycles">
                      {sub.remainingCycles === 0 ? 'Unlimited' : `${sub.remainingCycles} cycles`}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
