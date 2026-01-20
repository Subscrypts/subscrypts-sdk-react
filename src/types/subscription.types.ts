/**
 * Domain types for subscriptions
 */

/**
 * Subscription status information
 */
export interface SubscriptionStatus {
  /** Whether the subscription is currently active */
  isActive: boolean;
  /** Expiration date (null if no subscription) */
  expirationDate: Date | null;
  /** Whether auto-renewal is enabled */
  isAutoRenewing: boolean;
  /** Number of remaining payment cycles */
  remainingCycles: number;
  /** Subscription ID (null if no subscription exists) */
  subscriptionId: string | null;
}

/**
 * Full subscription details
 */
export interface Subscription {
  id: string;
  planId: string;
  subscriber: string;
  merchantId: string;
  isActive: boolean;
  expirationDate: Date;
  isAutoRenewing: boolean;
  remainingCycles: number;
  attribute: string;
  amount: bigint;
  frequency: number; // Duration in seconds
  lastPaymentDate: Date;
  nextPaymentDate: Date;
  createdAt: Date;
}

/**
 * Subscription plan information
 */
export interface Plan {
  id: string;
  merchantId: string;
  title: string;
  description?: string;
  cost: bigint;
  costType: 'FIXED' | 'FLEX';
  duration: number; // Seconds
  role: string;
  isActive: boolean;
}

/**
 * Payment method types
 */
export type PaymentMethod = 'SUBS' | 'USDC';

/**
 * Transaction states during subscription flow
 */
export type TransactionState =
  | 'idle'
  | 'approving'
  | 'waiting_approval'
  | 'subscribing'
  | 'waiting_subscribe'
  | 'success'
  | 'error';

/**
 * Checkout step in wizard
 */
export type CheckoutStep = 'configuration' | 'transaction' | 'success';
