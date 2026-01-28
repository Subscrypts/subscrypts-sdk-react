/**
 * useManageSubscription Hook
 *
 * Manage an existing subscription: cancel, toggle auto-renewal, update cycles, change attributes.
 */

import { useState, useCallback } from 'react';
import { useSubscrypts } from '../../context/SubscryptsContext';
import { subscriptionRecurringCHG, subscriptionAttributeCHG } from '../../contract';
import { TransactionError } from '../../utils/errors';
import { logger } from '../../utils/logger';
import type { TransactionState } from '../../types';

/**
 * Hook return type
 */
export interface UseManageSubscriptionReturn {
  /** Cancel subscription (disables auto-renew and sets 0 remaining cycles) */
  cancelSubscription: () => Promise<void>;
  /** Toggle auto-renewal on/off */
  toggleAutoRenew: (enabled: boolean) => Promise<void>;
  /** Update remaining payment cycles */
  updateCycles: (cycles: number) => Promise<void>;
  /** Update subscription custom attributes */
  updateAttributes: (attributes: string) => Promise<void>;
  /** Current transaction state */
  txState: TransactionState;
  /** Error if any */
  error: Error | null;
  /** Whether a transaction is in progress */
  isProcessing: boolean;
}

/**
 * Manage an existing subscription.
 *
 * @param subscriptionId - The subscription ID to manage
 *
 * @example
 * ```tsx
 * const { cancelSubscription, toggleAutoRenew, isProcessing } = useManageSubscription('42');
 *
 * // Cancel subscription
 * await cancelSubscription();
 *
 * // Toggle auto-renewal
 * await toggleAutoRenew(false);
 * ```
 */
export function useManageSubscription(subscriptionId: string): UseManageSubscriptionReturn {
  const { signer } = useSubscrypts();

  const [txState, setTxState] = useState<TransactionState>('idle');
  const [error, setError] = useState<Error | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const subId = BigInt(subscriptionId);

  const cancelSubscription = useCallback(async () => {
    if (!signer) {
      throw new Error('Wallet not connected');
    }

    logger.info(`Cancelling subscription ${subscriptionId}`);
    setIsProcessing(true);
    setTxState('subscribing');
    setError(null);

    try {
      const tx = await subscriptionRecurringCHG(signer, subId, false, 0n);
      await tx.wait();
      setTxState('success');
      logger.info(`Subscription ${subscriptionId} cancelled`);
    } catch (err) {
      const txError = new TransactionError(
        'Failed to cancel subscription',
        undefined,
        { error: err }
      );
      setError(txError);
      setTxState('error');
      throw txError;
    } finally {
      setIsProcessing(false);
    }
  }, [signer, subId, subscriptionId]);

  const toggleAutoRenew = useCallback(async (enabled: boolean) => {
    if (!signer) {
      throw new Error('Wallet not connected');
    }

    logger.info(`Setting auto-renew=${enabled} for subscription ${subscriptionId}`);
    setIsProcessing(true);
    setTxState('subscribing');
    setError(null);

    try {
      // When toggling auto-renew, keep current cycles (pass 0 to not change)
      const tx = await subscriptionRecurringCHG(signer, subId, enabled, 0n);
      await tx.wait();
      setTxState('success');
      logger.info(`Subscription ${subscriptionId} auto-renew set to ${enabled}`);
    } catch (err) {
      const txError = new TransactionError(
        'Failed to update auto-renewal',
        undefined,
        { error: err }
      );
      setError(txError);
      setTxState('error');
      throw txError;
    } finally {
      setIsProcessing(false);
    }
  }, [signer, subId, subscriptionId]);

  const updateCycles = useCallback(async (cycles: number) => {
    if (!signer) {
      throw new Error('Wallet not connected');
    }

    logger.info(`Updating cycles to ${cycles} for subscription ${subscriptionId}`);
    setIsProcessing(true);
    setTxState('subscribing');
    setError(null);

    try {
      const tx = await subscriptionRecurringCHG(signer, subId, true, BigInt(cycles));
      await tx.wait();
      setTxState('success');
      logger.info(`Subscription ${subscriptionId} cycles updated to ${cycles}`);
    } catch (err) {
      const txError = new TransactionError(
        'Failed to update payment cycles',
        undefined,
        { error: err }
      );
      setError(txError);
      setTxState('error');
      throw txError;
    } finally {
      setIsProcessing(false);
    }
  }, [signer, subId, subscriptionId]);

  const updateAttributes = useCallback(async (attributes: string) => {
    if (!signer) {
      throw new Error('Wallet not connected');
    }

    logger.info(`Updating attributes for subscription ${subscriptionId}`);
    setIsProcessing(true);
    setTxState('subscribing');
    setError(null);

    try {
      const tx = await subscriptionAttributeCHG(signer, subId, attributes);
      await tx.wait();
      setTxState('success');
      logger.info(`Subscription ${subscriptionId} attributes updated`);
    } catch (err) {
      const txError = new TransactionError(
        'Failed to update subscription attributes',
        undefined,
        { error: err }
      );
      setError(txError);
      setTxState('error');
      throw txError;
    } finally {
      setIsProcessing(false);
    }
  }, [signer, subId, subscriptionId]);

  return {
    cancelSubscription,
    toggleAutoRenew,
    updateCycles,
    updateAttributes,
    txState,
    error,
    isProcessing
  };
}
