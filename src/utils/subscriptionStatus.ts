/**
 * Subscription Status Resolver
 *
 * Pure function for normalizing subscription states.
 * Usable by hooks, components, non-React code, and AI agents.
 */

import type { Subscription } from '../types';

/**
 * Normalized subscription states
 */
export type SubscriptionState =
  | 'active'
  | 'expired'
  | 'expiring-soon'
  | 'cancelled'
  | 'not-found';

/**
 * Input for resolving subscription status
 */
export interface ResolveStatusInput {
  /** The subscription to evaluate (null if none exists) */
  subscription: Subscription | null;
  /** Reference time for comparison (defaults to now) */
  now?: Date;
}

/**
 * Resolved subscription status with computed fields
 */
export interface ResolvedStatus {
  /** Normalized subscription state */
  state: SubscriptionState;
  /** Whether the subscription grants active access */
  isActive: boolean;
  /** Days until expiry (null if expired or not found) */
  daysUntilExpiry: number | null;
  /** Next payment date (null if not found) */
  nextPaymentDate: Date | null;
  /** Whether auto-renewal is enabled */
  isAutoRenewing: boolean;
  /** Remaining payment cycles */
  remainingCycles: number;
}

/** Threshold for "expiring soon" warning (3 days in milliseconds) */
const EXPIRING_SOON_THRESHOLD_MS = 3 * 24 * 60 * 60 * 1000;

/**
 * Resolve the normalized status of a subscription.
 *
 * This is a pure function with no side effects or blockchain calls.
 * It can be used in React components, Node.js scripts, AI agents, etc.
 *
 * @example
 * ```typescript
 * const status = resolveSubscriptionStatus({ subscription });
 * if (status.state === 'expiring-soon') {
 *   showRenewalReminder();
 * }
 * ```
 */
export function resolveSubscriptionStatus(input: ResolveStatusInput): ResolvedStatus {
  const { subscription, now = new Date() } = input;

  // No subscription found
  if (!subscription) {
    return {
      state: 'not-found',
      isActive: false,
      daysUntilExpiry: null,
      nextPaymentDate: null,
      isAutoRenewing: false,
      remainingCycles: 0
    };
  }

  const { nextPaymentDate, isAutoRenewing, remainingCycles } = subscription;

  // Subscription expired
  if (nextPaymentDate <= now) {
    return {
      state: 'expired',
      isActive: false,
      daysUntilExpiry: 0,
      nextPaymentDate,
      isAutoRenewing,
      remainingCycles
    };
  }

  // Cancelled (not auto-renewing and no remaining cycles)
  if (!isAutoRenewing && remainingCycles === 0) {
    const msUntilExpiry = nextPaymentDate.getTime() - now.getTime();
    const daysUntilExpiry = Math.ceil(msUntilExpiry / (24 * 60 * 60 * 1000));

    return {
      state: 'cancelled',
      isActive: true, // Still active until expiry
      daysUntilExpiry,
      nextPaymentDate,
      isAutoRenewing,
      remainingCycles
    };
  }

  // Calculate time until expiry
  const msUntilExpiry = nextPaymentDate.getTime() - now.getTime();
  const daysUntilExpiry = Math.ceil(msUntilExpiry / (24 * 60 * 60 * 1000));

  // Expiring soon (within 3 days)
  if (msUntilExpiry < EXPIRING_SOON_THRESHOLD_MS) {
    return {
      state: 'expiring-soon',
      isActive: true,
      daysUntilExpiry,
      nextPaymentDate,
      isAutoRenewing,
      remainingCycles
    };
  }

  // Active
  return {
    state: 'active',
    isActive: true,
    daysUntilExpiry,
    nextPaymentDate,
    isAutoRenewing,
    remainingCycles
  };
}
