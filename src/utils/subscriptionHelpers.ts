/**
 * Subscription Decision Helpers
 *
 * Pure utility functions for subscription decisions.
 * Usable by React code, AI agents, cron jobs, and automation scripts.
 * No blockchain calls - operates on existing data only.
 */

import type { Subscription } from '../types';
import { resolveSubscriptionStatus } from './subscriptionStatus';
import type { SubscriptionState } from './subscriptionStatus';

/**
 * Check if a subscription grants active access.
 * Pure function - no blockchain calls.
 *
 * @example
 * ```typescript
 * if (canAccess(subscription)) {
 *   showPremiumContent();
 * }
 * ```
 */
export function canAccess(subscription: Subscription | null): boolean {
  if (!subscription) return false;
  const status = resolveSubscriptionStatus({ subscription });
  return status.isActive;
}

/**
 * Check if a subscription payment is due (past nextPaymentDate).
 *
 * @example
 * ```typescript
 * if (isPaymentDue(subscription)) {
 *   triggerPaymentCollection();
 * }
 * ```
 */
export function isPaymentDue(subscription: Subscription, now: Date = new Date()): boolean {
  return subscription.nextPaymentDate <= now;
}

/**
 * Check if a subscription should be renewed.
 * True when: payment is due AND auto-renewing AND has remaining cycles.
 *
 * @example
 * ```typescript
 * if (shouldRenew(subscription)) {
 *   processRenewalPayment();
 * }
 * ```
 */
export function shouldRenew(subscription: Subscription, now: Date = new Date()): boolean {
  return (
    isPaymentDue(subscription, now) &&
    subscription.isAutoRenewing &&
    subscription.remainingCycles > 0
  );
}

/**
 * Subscription health summary
 */
export interface SubscriptionHealth {
  /** Normalized subscription state */
  state: SubscriptionState;
  /** Whether a payment is currently due */
  isPaymentDue: boolean;
  /** Whether the subscription should be renewed */
  shouldRenew: boolean;
  /** Days until expiry (null if expired or not found) */
  daysUntilExpiry: number | null;
  /** Remaining payment cycles */
  cyclesRemaining: number;
}

/**
 * Get comprehensive subscription health summary.
 * Combines status resolution with decision helpers.
 *
 * @example
 * ```typescript
 * const health = getSubscriptionHealth(subscription);
 * console.log(health.state);          // 'active'
 * console.log(health.isPaymentDue);   // false
 * console.log(health.daysUntilExpiry); // 25
 * ```
 */
export function getSubscriptionHealth(
  subscription: Subscription | null,
  now: Date = new Date()
): SubscriptionHealth {
  const status = resolveSubscriptionStatus({ subscription, now });

  return {
    state: status.state,
    isPaymentDue: subscription ? isPaymentDue(subscription, now) : false,
    shouldRenew: subscription ? shouldRenew(subscription, now) : false,
    daysUntilExpiry: status.daysUntilExpiry,
    cyclesRemaining: status.remainingCycles
  };
}
