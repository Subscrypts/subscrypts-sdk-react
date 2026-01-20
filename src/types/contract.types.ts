/**
 * Smart contract types based on Subscrypts ABI
 */

/**
 * Parameters for creating a subscription with SUBS tokens
 */
export interface SubscriptionCreateParams {
  planId: bigint;
  subscriber: string;
  recurring: boolean;
  remainingCycles: bigint;
  referral: string;
  onlyCreate: boolean;
  deductFrom: string;
}

/**
 * Parameters for creating a subscription with USDC (includes Uniswap swap)
 */
export interface PayWithUsdcParams {
  planId: bigint;
  recurring: boolean;
  remainingCycles: bigint;
  referral: string;
  feeTier: number; // Uniswap pool fee tier (e.g., 3000 for 0.3%)
  deadline: bigint; // Unix timestamp
  nonce: bigint; // For permit signature (optional)
  permitDeadline: bigint;
  signature: string; // EIP-2612 permit signature (or '0x' if not used)
  maxUsdcIn6Cap: bigint; // Max USDC to spend (6 decimals)
}

/**
 * Result from subscription creation
 */
export interface SubscriptionCreateResult {
  subscriptionId: bigint;
  alreadyExist: boolean;
}

/**
 * Result from USDC subscription payment
 */
export interface PayWithUsdcResult {
  subId: bigint;
  subExist: boolean;
  subsPaid18: bigint; // SUBS amount (18 decimals)
  usdcSpent6: bigint; // USDC spent (6 decimals)
}

/**
 * Subscription data structure from contract
 */
export interface ContractSubscription {
  planId: bigint;
  subscriber: string;
  merchant: string;
  currencyCode: string;
  amount: bigint;
  frequency: bigint; // Subscription duration in seconds
  recurring: boolean;
  remainingCycles: bigint;
  expiration: bigint; // Unix timestamp
  attribute: string; // Custom metadata
  lastPaymentDate: bigint;
  nextPaymentDate: bigint;
}

/**
 * Plan data structure from contract
 */
export interface ContractPlan {
  id: bigint;
  merchantId: string;
  title: string;
  cost: bigint;
  duration: bigint; // Seconds
  isActive: boolean;
}
