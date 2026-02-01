/**
 * Custom error classes for Subscrypts SDK
 */

/**
 * Base error class for Subscrypts SDK
 */
export class SubscryptsError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'SubscryptsError';
    Object.setPrototypeOf(this, SubscryptsError.prototype);
  }
}

/**
 * Wallet connection errors
 */
export class WalletError extends SubscryptsError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('WALLET_ERROR', message, details);
    this.name = 'WalletError';
  }
}

/**
 * Network errors
 */
export class NetworkError extends SubscryptsError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('NETWORK_ERROR', message, details);
    this.name = 'NetworkError';
  }
}

/**
 * Contract interaction errors
 */
export class ContractError extends SubscryptsError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('CONTRACT_ERROR', message, details);
    this.name = 'ContractError';
  }
}

/**
 * Insufficient balance errors
 */
export class InsufficientBalanceError extends SubscryptsError {
  constructor(
    public required: bigint,
    public available: bigint,
    public token: 'SUBS' | 'USDC'
  ) {
    super(
      'INSUFFICIENT_BALANCE',
      `Insufficient ${token} balance. Required: ${required}, Available: ${available}`,
      { required: required.toString(), available: available.toString(), token }
    );
    this.name = 'InsufficientBalanceError';
  }
}

/**
 * Transaction errors
 */
export class TransactionError extends SubscryptsError {
  constructor(message: string, public txHash?: string, details?: Record<string, unknown>) {
    super('TRANSACTION_ERROR', message, { ...details, txHash });
    this.name = 'TransactionError';
  }
}

/**
 * Validation errors
 */
export class ValidationError extends SubscryptsError {
  constructor(field: string, message: string) {
    super('VALIDATION_ERROR', message, { field });
    this.name = 'ValidationError';
  }
}

/**
 * Sanctions errors - thrown when address is sanctioned
 */
export class SanctionsError extends SubscryptsError {
  public readonly address: string;
  public readonly isMerchant: boolean;

  constructor(address: string, isMerchant: boolean, details?: Record<string, unknown>) {
    super(
      'SANCTIONS_ERROR',
      `Address ${address} is sanctioned and cannot ${isMerchant ? 'receive payments' : 'create subscriptions'}`,
      details
    );
    this.name = 'SanctionsError';
    this.address = address;
    this.isMerchant = isMerchant;
  }
}
