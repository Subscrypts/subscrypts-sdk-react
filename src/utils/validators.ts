/**
 * Input validation utilities
 */

import { isAddress, getAddress } from 'ethers';
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
 * Validate merchant ID
 */
export function validateMerchantId(merchantId: string): void {
  if (!merchantId || merchantId.trim() === '') {
    throw new ValidationError('merchantId', 'Merchant ID is required');
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
