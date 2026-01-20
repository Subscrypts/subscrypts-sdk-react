/**
 * SubscriptionGuard Component
 *
 * Protect routes and components based on subscription status.
 * Automatically checks if the connected wallet has an active subscription.
 */

import { useEffect } from 'react';
import { useSubscriptionStatus } from '../../hooks/subscriptions/useSubscriptionStatus';
import { SubscriptionGuardProps } from '../../types';
import { LoadingSpinner } from '../shared/LoadingSpinner';

/**
 * Subscription Guard Component
 *
 * @example
 * ```tsx
 * // Basic usage with redirect
 * <SubscriptionGuard
 *   merchantId="merchant-123"
 *   planId="1"
 *   fallbackUrl="/subscribe"
 * >
 *   <PremiumContent />
 * </SubscriptionGuard>
 *
 * // With custom loading UI
 * <SubscriptionGuard
 *   merchantId="merchant-123"
 *   planId="1"
 *   loadingComponent={<CustomSpinner />}
 *   onAccessDenied={() => analytics.track('access_denied')}
 * >
 *   <PremiumContent />
 * </SubscriptionGuard>
 * ```
 */
export function SubscriptionGuard({
  merchantId,
  planId,
  fallbackUrl,
  loadingComponent,
  children,
  onAccessDenied
}: SubscriptionGuardProps) {
  const { status, isLoading } = useSubscriptionStatus(merchantId, planId);

  /**
   * Handle access denial
   */
  useEffect(() => {
    if (!isLoading && !status?.isActive) {
      // Call access denied callback
      if (onAccessDenied) {
        onAccessDenied();
      }

      // Redirect if URL provided
      if (fallbackUrl) {
        // Use window.location for full page redirect
        window.location.href = fallbackUrl;
      }
    }
  }, [isLoading, status, fallbackUrl, onAccessDenied]);

  // Show loading state
  if (isLoading) {
    return <>{loadingComponent || <LoadingSpinner />}</>;
  }

  // Block access if subscription is not active
  if (!status?.isActive) {
    return null;
  }

  // Render protected content
  return <>{children}</>;
}
