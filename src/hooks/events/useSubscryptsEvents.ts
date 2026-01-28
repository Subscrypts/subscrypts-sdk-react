/**
 * useSubscryptsEvents Hook
 *
 * Subscribe to real-time Subscrypts protocol events.
 * Uses ethers.js contract.on() under the hood with automatic cleanup.
 */

import { useEffect, useState } from 'react';
import { useSubscrypts } from '../../context/SubscryptsContext';

/**
 * Event callback types
 */
export interface SubscryptsEventCallbacks {
  /** Called when a new subscription is created */
  onSubscriptionCreated?: (event: {
    subscriptionId: bigint;
    planId: bigint;
    subscriber: string;
    referral: string;
  }) => void;

  /** Called when a subscription payment is made */
  onSubscriptionPaid?: (event: {
    subscriptionId: bigint;
    payer: string;
    amount: bigint;
  }) => void;

  /** Called when a subscription is stopped/cancelled */
  onSubscriptionStopped?: (event: {
    subscriptionId: bigint;
    subscriber: string;
    enabled: boolean;
  }) => void;
}

/**
 * Hook return type
 */
export interface UseSubscryptsEventsReturn {
  /** Whether event listeners are active */
  isListening: boolean;
  /** Error if any */
  error: Error | null;
}

/**
 * Subscribe to real-time Subscrypts protocol events.
 * Automatically cleans up listeners on unmount.
 *
 * @param callbacks - Event handlers
 *
 * @example
 * ```tsx
 * const { isListening } = useSubscryptsEvents({
 *   onSubscriptionCreated: (event) => {
 *     console.log('New subscription:', event.subscriptionId);
 *     refetchDashboard();
 *   },
 *   onSubscriptionPaid: (event) => {
 *     console.log('Payment made:', event.amount);
 *   },
 *   onSubscriptionStopped: (event) => {
 *     console.log('Subscription stopped:', event.subscriptionId);
 *   }
 * });
 * ```
 */
export function useSubscryptsEvents(
  callbacks: SubscryptsEventCallbacks
): UseSubscryptsEventsReturn {
  const { subscryptsContract } = useSubscrypts();

  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Stable callback refs
  const { onSubscriptionCreated, onSubscriptionPaid, onSubscriptionStopped } = callbacks;

  /**
   * Set up event listeners
   */
  useEffect(() => {
    if (!subscryptsContract) {
      setIsListening(false);
      return;
    }

    try {
      // _subscriptionCreate event
      if (onSubscriptionCreated) {
        const handleCreate = (
          subscriptionId: bigint,
          planId: bigint,
          subscriber: string,
          referral: string
        ) => {
          onSubscriptionCreated({
            subscriptionId,
            planId,
            subscriber,
            referral
          });
        };

        subscryptsContract.on('_subscriptionCreate', handleCreate);
      }

      // _subscriptionPay event
      if (onSubscriptionPaid) {
        const handlePay = (
          subscriptionId: bigint,
          payer: string,
          amount: bigint
        ) => {
          onSubscriptionPaid({
            subscriptionId,
            payer,
            amount
          });
        };

        subscryptsContract.on('_subscriptionPay', handlePay);
      }

      // _subscriptionRecurring event (used for stop/cancel)
      if (onSubscriptionStopped) {
        const handleRecurring = (
          subscriptionId: bigint,
          subscriber: string,
          enabled: boolean
        ) => {
          onSubscriptionStopped({
            subscriptionId,
            subscriber,
            enabled
          });
        };

        subscryptsContract.on('_subscriptionRecurring', handleRecurring);
      }

      setIsListening(true);
      setError(null);
    } catch (err) {
      setError(err as Error);
      setIsListening(false);
    }

    /**
     * Cleanup: remove all listeners
     */
    return () => {
      if (subscryptsContract) {
        subscryptsContract.removeAllListeners('_subscriptionCreate');
        subscryptsContract.removeAllListeners('_subscriptionPay');
        subscryptsContract.removeAllListeners('_subscriptionRecurring');
      }
      setIsListening(false);
    };
  }, [subscryptsContract, onSubscriptionCreated, onSubscriptionPaid, onSubscriptionStopped]);

  return {
    isListening,
    error
  };
}
