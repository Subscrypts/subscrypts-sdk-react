/**
 * Input validation utilities
 */

import { isAddress, getAddress, Contract } from 'ethers';
import { ValidationError } from './errors';

/**
 * Validate Ethereum address
 */
export function validateAddress(address: string, fieldName: string = 'Address'): string {
  if (!address || address.trim() === '') {
    throw new ValidationError(fieldName, `${fieldName} is required`);
  }

  if (!isAddress(address)) {
    throw new ValidationError(fieldName, `Invalid ${fieldName.toLowerCase()}: ${address}`);
  }

  // Return checksummed address
  return getAddress(address);
}

/**
 * Validate positive number
 */
export function validatePositiveNumber(value: number, fieldName: string = 'Value'): void {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new ValidationError(fieldName, `${fieldName} must be a number`);
  }

  if (value <= 0) {
    throw new ValidationError(fieldName, `${fieldName} must be positive`);
  }
}

/**
 * Validate positive bigint
 */
export function validatePositiveBigInt(value: bigint, fieldName: string = 'Value'): void {
  if (typeof value !== 'bigint') {
    throw new ValidationError(fieldName, `${fieldName} must be a bigint`);
  }

  if (value <= 0n) {
    throw new ValidationError(fieldName, `${fieldName} must be positive`);
  }
}

/**
 * Validate plan ID
 */
export function validatePlanId(planId: string): void {
  if (!planId || planId.trim() === '') {
    throw new ValidationError('planId', 'Plan ID is required');
  }
}

/**
 * Validate cycle limit
 */
export function validateCycleLimit(cycles: number): void {
  validatePositiveNumber(cycles, 'Cycle limit');

  if (!Number.isInteger(cycles)) {
    throw new ValidationError('cycleLimit', 'Cycle limit must be an integer');
  }

  if (cycles > 1000) {
    throw new ValidationError('cycleLimit', 'Cycle limit cannot exceed 1000');
  }
}

/**
 * Validate referral address for a plan
 *
 * Referral addresses must be existing subscribers to the same plan to receive
 * referral bonuses. Invalid referrals are silently ignored by the contract
 * (no error, no bonus applied).
 *
 * Contract requirement: facetSubscription.sol lines 196-198
 *
 * @param contract - Subscrypts contract instance
 * @param planId - Plan ID to check
 * @param referralAddress - Referral address to validate
 * @returns true if referral is valid (subscribed to plan), false otherwise
 *
 * @example
 * ```typescript
 * const isValid = await isValidReferral(contract, '1', '0x123...');
 * if (!isValid) {
 *   console.warn('Referral address is not subscribed to this plan');
 * }
 * ```
 */
export async function isValidReferral(
  contract: Contract,
  planId: string | bigint,
  referralAddress: string
): Promise<boolean> {
  try {
    const planIdBigInt = typeof planId === 'string' ? BigInt(planId) : planId;

    // Check if referral is subscribed to this plan
    const subscription = await contract.getPlanSubscription(
      planIdBigInt,
      referralAddress
    );

    // Valid if subscription exists (id > 0)
    return subscription && subscription.id > 0n;
  } catch {
    return false;
  }
}

/**
 * Check if an address is sanctioned
 *
 * Pre-flight check before subscription creation to prevent wasted gas.
 * Uses contract's subCheckSanctions method which queries Chainalysis oracle.
 *
 * **Fail-open pattern**: If the check fails (contract error, oracle unavailable),
 * returns false for both addresses to allow the transaction. This prevents breaking
 * existing integrations where sanctions checking might not be enabled.
 *
 * @param contract - Subscrypts contract instance
 * @param merchantAddress - Merchant address to check
 * @param subscriberAddress - Subscriber address to check
 * @returns Promise<{ merchantSanctioned: boolean, subscriberSanctioned: boolean }>
 *
 * @example
 * ```typescript
 * const result = await checkSanctions(contract, merchantAddr, subscriberAddr);
 * if (result.merchantSanctioned) {
 *   throw new SanctionsError(merchantAddr, true);
 * }
 * if (result.subscriberSanctioned) {
 *   throw new SanctionsError(subscriberAddr, false);
 * }
 * ```
 */
export async function checkSanctions(
  contract: Contract,
  merchantAddress: string,
  subscriberAddress: string
): Promise<{ merchantSanctioned: boolean; subscriberSanctioned: boolean }> {
  try {
    const [merchantSanctioned, subscriberSanctioned] = await contract.subCheckSanctions(
      merchantAddress,
      subscriberAddress
    );
    return { merchantSanctioned, subscriberSanctioned };
  } catch (error) {
    // If sanctions check fails (contract not enabled), allow transaction
    // This prevents breaking existing contracts that don't have sanctions enabled
    console.warn('Sanctions check failed, allowing transaction:', error);
    return { merchantSanctioned: false, subscriberSanctioned: false };
  }
}
