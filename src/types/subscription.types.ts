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
  merchantAddress: string; // From blockchain
  planId: string;
  subscriber: string;
  currencyCode: bigint;
  subscriptionAmount: bigint;
  paymentFrequency: bigint;
  isAutoRenewing: boolean;
  remainingCycles: number;
  customAttributes: string;
  lastPaymentDate: Date;
  nextPaymentDate: Date;
}

/**
 * Subscription plan information
 */
export interface Plan {
  id: bigint;
  merchantAddress: string; // From blockchain
  currencyCode: bigint;
  subscriptionAmount: bigint;
  paymentFrequency: bigint;
  referralBonus: bigint;
  commission: bigint;
  description: string;
  defaultAttributes: string;
  verificationExpiryDate: bigint;
  subscriberCount: bigint;
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
