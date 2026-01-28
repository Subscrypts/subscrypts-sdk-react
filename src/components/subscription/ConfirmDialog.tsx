/**
 * ConfirmDialog Component
 *
 * Reusable confirmation dialog for destructive or important actions.
 */

import { Modal } from '../shared/Modal';

/**
 * ConfirmDialog props
 */
export interface ConfirmDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Dialog title */
  title: string;
  /** Dialog message */
  message: string;
  /** Confirm button label */
  confirmLabel?: string;
  /** Cancel button label */
  cancelLabel?: string;
  /** Visual variant */
  variant?: 'danger' | 'default';
  /** Called when user confirms */
  onConfirm: () => void;
  /** Called when user cancels */
  onCancel: () => void;
}

/**
 * Confirmation dialog for important actions.
 *
 * @example
 * ```tsx
 * <ConfirmDialog
 *   isOpen={showConfirm}
 *   title="Cancel Subscription?"
 *   message="Your subscription will remain active until the end of the current period."
 *   variant="danger"
 *   confirmLabel="Cancel Subscription"
 *   onConfirm={handleCancel}
 *   onCancel={() => setShowConfirm(false)}
 * />
 * ```
 */
export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <div className="subscrypts-confirm-dialog">
        <p className="subscrypts-confirm-dialog__message">{message}</p>
        <div className="subscrypts-confirm-dialog__actions">
          <button
            className="subscrypts-btn subscrypts-btn-secondary"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className={`subscrypts-btn ${variant === 'danger' ? 'subscrypts-btn-danger' : 'subscrypts-btn-primary'}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
