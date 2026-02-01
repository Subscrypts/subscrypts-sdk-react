/**
 * Error message mapping for human-readable blockchain errors.
 *
 * Maps ethers.js error codes and common blockchain errors
 * to user-friendly messages with actionable suggestions.
 */

/**
 * Configuration for a user-facing error message
 */
export interface ErrorMessageConfig {
  /** Short error title */
  title: string;
  /** User-friendly error description */
  message: string;
  /** Actionable suggestion for the user */
  suggestion: string;
  /** Whether the user can retry this operation */
  isRetryable: boolean;
}

/**
 * Map of known error codes to user-friendly messages.
 * Covers ethers.js v6 error codes and common contract revert reasons.
 */
export const ERROR_CODE_MAP: Record<string, ErrorMessageConfig> = {
  // ethers.js v6 error codes
  ACTION_REJECTED: {
    title: 'Transaction Rejected',
    message: 'You rejected the transaction in your wallet.',
    suggestion: 'Click retry if you would like to try again.',
    isRetryable: true
  },
  INSUFFICIENT_FUNDS: {
    title: 'Insufficient Gas',
    message: 'You do not have enough ETH to pay for network fees.',
    suggestion: 'Add ETH to your wallet on Arbitrum to cover gas fees.',
    isRetryable: false
  },
  CALL_EXCEPTION: {
    title: 'Contract Error',
    message: 'The smart contract returned an error.',
    suggestion: 'The plan may no longer be available, or your subscription may already exist.',
    isRetryable: true
  },
  NETWORK_ERROR: {
    title: 'Network Error',
    message: 'Could not connect to the Arbitrum network.',
    suggestion: 'Check your internet connection and try again.',
    isRetryable: true
  },
  TIMEOUT: {
    title: 'Request Timeout',
    message: 'The request took too long to complete.',
    suggestion: 'The network may be congested. Please try again.',
    isRetryable: true
  },
  UNPREDICTABLE_GAS_LIMIT: {
    title: 'Transaction Would Fail',
    message: 'This transaction would likely fail if submitted.',
    suggestion: 'Check that you have sufficient token balance and allowance.',
    isRetryable: false
  },
  NONCE_EXPIRED: {
    title: 'Transaction Outdated',
    message: 'The transaction nonce has expired.',
    suggestion: 'Please try the transaction again.',
    isRetryable: true
  },
  REPLACEMENT_UNDERPRICED: {
    title: 'Gas Price Too Low',
    message: 'The replacement transaction gas price is too low.',
    suggestion: 'Wait for the pending transaction to complete, then try again.',
    isRetryable: true
  },
  SERVER_ERROR: {
    title: 'Server Error',
    message: 'The RPC server returned an error.',
    suggestion: 'The network may be experiencing issues. Please try again later.',
    isRetryable: true
  },

  // SDK-specific error codes
  WALLET_ERROR: {
    title: 'Wallet Error',
    message: 'There was a problem with your wallet connection.',
    suggestion: 'Try disconnecting and reconnecting your wallet.',
    isRetryable: true
  },
  NETWORK_MISMATCH: {
    title: 'Wrong Network',
    message: 'Your wallet is connected to the wrong network.',
    suggestion: 'Please switch to Arbitrum One in your wallet.',
    isRetryable: true
  },
  INSUFFICIENT_BALANCE: {
    title: 'Insufficient Balance',
    message: 'You do not have enough tokens to complete this transaction.',
    suggestion: 'Add more tokens to your wallet before trying again.',
    isRetryable: false
  },
  TRANSACTION_ERROR: {
    title: 'Transaction Failed',
    message: 'The transaction failed to execute.',
    suggestion: 'Please try again. If the issue persists, the contract conditions may have changed.',
    isRetryable: true
  },
  VALIDATION_ERROR: {
    title: 'Invalid Input',
    message: 'The provided input is invalid.',
    suggestion: 'Please check your input values and try again.',
    isRetryable: false
  },
  SANCTIONS_ERROR: {
    title: 'Address Sanctioned',
    message: 'This wallet address is sanctioned and cannot be used for subscriptions.',
    suggestion: 'This address has been flagged by compliance systems. Contact support if you believe this is an error.',
    isRetryable: false
  }
};

/** Default error message for unknown errors */
const DEFAULT_ERROR: ErrorMessageConfig = {
  title: 'Something Went Wrong',
  message: 'An unexpected error occurred.',
  suggestion: 'Please try again. If the issue persists, check your wallet and network connection.',
  isRetryable: true
};

/**
 * Extract the error code from an unknown error object.
 * Handles ethers.js errors, SubscryptsError, and generic errors.
 */
export function getErrorCode(error: unknown): string {
  if (!error) return 'UNKNOWN';

  // ethers.js v6 errors have a `code` property
  if (typeof error === 'object' && error !== null) {
    const err = error as Record<string, unknown>;

    // Direct code property (ethers.js, SubscryptsError)
    if (typeof err.code === 'string') {
      return err.code;
    }

    // Check nested error info (ethers.js v6 wraps errors)
    if (err.info && typeof err.info === 'object') {
      const info = err.info as Record<string, unknown>;
      if (info.error && typeof info.error === 'object') {
        const innerError = info.error as Record<string, unknown>;
        if (typeof innerError.code === 'string') {
          return innerError.code;
        }
      }
    }

    // Check error message for known patterns
    const message = typeof err.message === 'string' ? err.message.toLowerCase() : '';
    if (message.includes('user rejected') || message.includes('user denied')) {
      return 'ACTION_REJECTED';
    }
    if (message.includes('insufficient funds')) {
      return 'INSUFFICIENT_FUNDS';
    }
    if (message.includes('network') || message.includes('could not detect')) {
      return 'NETWORK_ERROR';
    }
    if (message.includes('timeout') || message.includes('timed out')) {
      return 'TIMEOUT';
    }
    if (message.includes('nonce')) {
      return 'NONCE_EXPIRED';
    }
  }

  return 'UNKNOWN';
}

/**
 * Get a user-friendly error message for any error.
 *
 * @example
 * ```typescript
 * try {
 *   await subscribe({ planId: '1', ... });
 * } catch (err) {
 *   const { title, message, suggestion, isRetryable } = getErrorMessage(err);
 *   // Display to user
 * }
 * ```
 */
export function getErrorMessage(error: unknown): ErrorMessageConfig {
  const code = getErrorCode(error);
  return ERROR_CODE_MAP[code] || DEFAULT_ERROR;
}
