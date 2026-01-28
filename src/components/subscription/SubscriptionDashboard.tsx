/**
 * SubscriptionDashboard Component
 *
 * Full subscription management dashboard with pagination, empty/loading states.
 */

import { SubscriptionCard } from './SubscriptionCard';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { ErrorDisplay } from '../shared/ErrorDisplay';
import { useMySubscriptions } from '../../hooks/subscriptions/useMySubscriptions';

/**
 * SubscriptionDashboard props
 */
export interface SubscriptionDashboardProps {
  /** Address to fetch subscriptions for (defaults to connected wallet) */
  address?: string;
  /** Number of subscriptions per page (default: 10) */
  pageSize?: number;
  /** Show fiat prices on cards (default: false) */
  showFiatPrices?: boolean;
  /** Custom empty state component */
  emptyComponent?: React.ReactNode;
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
  /** Additional CSS class */
  className?: string;
  /** Called when a subscription is cancelled */
  onSubscriptionCancelled?: (subscriptionId: string) => void;
  /** Called when a subscription is updated */
  onSubscriptionUpdated?: (subscriptionId: string) => void;
}

/**
 * Dashboard for viewing and managing user subscriptions.
 *
 * @example
 * ```tsx
 * <SubscriptionDashboard
 *   pageSize={10}
 *   showFiatPrices={true}
 *   onSubscriptionCancelled={() => console.log('Subscription cancelled')}
 * />
 * ```
 */
export function SubscriptionDashboard({
  address,
  pageSize = 10,
  showFiatPrices = false,
  emptyComponent,
  loadingComponent,
  className = '',
  onSubscriptionCancelled,
  onSubscriptionUpdated
}: SubscriptionDashboardProps) {
  const {
    subscriptions,
    total,
    page,
    hasMore,
    isLoading,
    error,
    nextPage,
    prevPage,
    refetch
  } = useMySubscriptions(address, pageSize);

  // Loading state
  if (isLoading && subscriptions.length === 0) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }
    return (
      <div className="subscrypts-subscription-dashboard__loading">
        <LoadingSpinner />
        <p>Loading subscriptions...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="subscrypts-subscription-dashboard__error">
        <ErrorDisplay error={error} onRetry={refetch} />
      </div>
    );
  }

  // Empty state
  if (subscriptions.length === 0 && !isLoading) {
    if (emptyComponent) {
      return <>{emptyComponent}</>;
    }
    return (
      <div className="subscrypts-subscription-dashboard__empty">
        <p className="subscrypts-subscription-dashboard__empty-text">
          No subscriptions found
        </p>
        <p className="subscrypts-subscription-dashboard__empty-subtext">
          Subscribe to a plan to get started
        </p>
      </div>
    );
  }

  const handleCancelled = (subscriptionId: string) => {
    refetch();
    onSubscriptionCancelled?.(subscriptionId);
  };

  const handleUpdated = (subscriptionId: string) => {
    refetch();
    onSubscriptionUpdated?.(subscriptionId);
  };

  return (
    <div className={`subscrypts-subscription-dashboard ${className}`}>
      {/* Header */}
      <div className="subscrypts-subscription-dashboard__header">
        <h2 className="subscrypts-subscription-dashboard__title">
          My Subscriptions
        </h2>
        <p className="subscrypts-subscription-dashboard__subtitle">
          {total} {total === 1 ? 'subscription' : 'subscriptions'}
        </p>
      </div>

      {/* Subscription Grid */}
      <div className="subscrypts-subscription-dashboard__grid">
        {subscriptions.map((subscription) => (
          <SubscriptionCard
            key={subscription.id}
            subscription={subscription}
            showFiatPrice={showFiatPrices}
            onCancelled={() => handleCancelled(subscription.id)}
            onUpdated={() => handleUpdated(subscription.id)}
          />
        ))}
      </div>

      {/* Pagination */}
      {total > pageSize && (
        <div className="subscrypts-subscription-dashboard__pagination">
          <button
            className="subscrypts-btn subscrypts-btn-secondary subscrypts-subscription-dashboard__pagination-btn"
            onClick={prevPage}
            disabled={page === 1 || isLoading}
          >
            Previous
          </button>

          <span className="subscrypts-subscription-dashboard__pagination-info">
            Page {page} of {Math.ceil(total / pageSize)}
          </span>

          <button
            className="subscrypts-btn subscrypts-btn-secondary subscrypts-subscription-dashboard__pagination-btn"
            onClick={nextPage}
            disabled={!hasMore || isLoading}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
