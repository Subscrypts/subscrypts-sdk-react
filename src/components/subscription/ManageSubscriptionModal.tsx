/**
 * ManageSubscriptionModal Component
 *
 * Modal for managing an existing subscription: cancel, toggle auto-renewal, update cycles.
 */

import { useState } from 'react';
import { Modal } from '../shared/Modal';
import { ConfirmDialog } from './ConfirmDialog';
import { ErrorDisplay } from '../shared/ErrorDisplay';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { useManageSubscription } from '../../hooks/subscriptions/useManageSubscription';
import { formatDate } from '../../utils/formatters';
import type { Subscription } from '../../types';

/**
 * ManageSubscriptionModal props
 */
export interface ManageSubscriptionModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Subscription ID to manage */
  subscriptionId: string;
  /** Pre-loaded subscription data (to skip additional fetch) */
  subscription?: Subscription;
  /** Called when subscription is cancelled */
  onCancelled?: () => void;
  /** Called when subscription is updated */
  onUpdated?: () => void;
}

/**
 * Modal for managing a subscription with cancel, auto-renew toggle, and cycle updates.
 *
 * @example
 * ```tsx
 * <ManageSubscriptionModal
 *   isOpen={showManage}
 *   onClose={() => setShowManage(false)}
 *   subscriptionId="42"
 *   subscription={subscriptionData}
 *   onCancelled={() => refetchSubscriptions()}
 * />
 * ```
 */
export function ManageSubscriptionModal({
  isOpen,
  onClose,
  subscriptionId,
  subscription,
  onCancelled,
  onUpdated
}: ManageSubscriptionModalProps) {
  const {
    cancelSubscription,
    toggleAutoRenew,
    updateCycles,
    txState,
    error,
    isProcessing
  } = useManageSubscription(subscriptionId);

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleCancel = async () => {
    setShowCancelConfirm(false);
    try {
      await cancelSubscription();
      onCancelled?.();
    } catch {
      // Error is set in hook state
    }
  };

  const handleToggleAutoRenew = async () => {
    if (!subscription) return;
    try {
      await toggleAutoRenew(!subscription.isAutoRenewing);
      onUpdated?.();
    } catch {
      // Error is set in hook state
    }
  };

  const handleUpdateCycles = async (cycles: number) => {
    try {
      await updateCycles(cycles);
      onUpdated?.();
    } catch {
      // Error is set in hook state
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Manage Subscription">
        <div className="subscrypts-manage-modal">
          {subscription && (
            <div className="subscrypts-manage-modal__info">
              <div className="subscrypts-manage-modal__row">
                <span className="subscrypts-manage-modal__label">Subscription ID</span>
                <span className="subscrypts-manage-modal__value">#{subscriptionId}</span>
              </div>
              <div className="subscrypts-manage-modal__row">
                <span className="subscrypts-manage-modal__label">Next Payment</span>
                <span className="subscrypts-manage-modal__value">
                  {formatDate(subscription.nextPaymentDate)}
                </span>
              </div>
              <div className="subscrypts-manage-modal__row">
                <span className="subscrypts-manage-modal__label">Auto-Renewal</span>
                <span className="subscrypts-manage-modal__value">
                  {subscription.isAutoRenewing ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="subscrypts-manage-modal__row">
                <span className="subscrypts-manage-modal__label">Remaining Cycles</span>
                <span className="subscrypts-manage-modal__value">
                  {subscription.remainingCycles}
                </span>
              </div>
            </div>
          )}

          <ErrorDisplay error={error} compact />

          {isProcessing && (
            <div className="subscrypts-manage-modal__processing">
              <LoadingSpinner />
              <span>Processing transaction...</span>
            </div>
          )}

          {txState === 'success' && (
            <div className="subscrypts-manage-modal__success">
              Subscription updated successfully.
            </div>
          )}

          <div className="subscrypts-manage-modal__actions">
            <button
              className="subscrypts-btn subscrypts-btn-secondary"
              onClick={handleToggleAutoRenew}
              disabled={isProcessing || !subscription}
            >
              {subscription?.isAutoRenewing ? 'Disable' : 'Enable'} Auto-Renewal
            </button>

            <button
              className="subscrypts-btn subscrypts-btn-secondary"
              onClick={() => handleUpdateCycles(12)}
              disabled={isProcessing}
            >
              Set 12 Cycles
            </button>

            <button
              className="subscrypts-btn subscrypts-btn-danger"
              onClick={() => setShowCancelConfirm(true)}
              disabled={isProcessing}
            >
              Cancel Subscription
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={showCancelConfirm}
        title="Cancel Subscription?"
        message="Your subscription will remain active until the end of the current billing period. After that, access will be revoked and auto-renewal will be disabled."
        variant="danger"
        confirmLabel="Cancel Subscription"
        onConfirm={handleCancel}
        onCancel={() => setShowCancelConfirm(false)}
      />
    </>
  );
}
