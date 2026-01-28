/**
 * Transaction Step Component
 */

import { PaymentMethod } from '../../types';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { ErrorDisplay } from '../shared/ErrorDisplay';

interface TransactionStepProps {
  paymentMethod: PaymentMethod;
  txState: 'idle' | 'approving' | 'waiting_approval' | 'subscribing' | 'waiting_subscribe' | 'success' | 'error';
  error: Error | null;
  subscriptionId: string | null;
  txHash: string | null;
  onExecute: () => void;
  onClose: () => void;
  onBack: () => void;
}

export function TransactionStep({
  paymentMethod,
  txState,
  error,
  subscriptionId,
  txHash,
  onExecute,
  onClose,
  onBack
}: TransactionStepProps) {
  const getStateMessage = () => {
    switch (txState) {
      case 'idle':
        return 'Ready to subscribe';
      case 'approving':
        return `Approving ${paymentMethod}...`;
      case 'waiting_approval':
        return 'Waiting for wallet confirmation...';
      case 'subscribing':
        return 'Creating subscription...';
      case 'waiting_subscribe':
        return 'Waiting for wallet confirmation...';
      case 'success':
        return 'Subscription created successfully!';
      case 'error':
        return 'Transaction failed';
      default:
        return 'Processing...';
    }
  };

  const isProcessing = ['approving', 'waiting_approval', 'subscribing', 'waiting_subscribe'].includes(txState);
  const isSuccess = txState === 'success';
  const isError = txState === 'error';

  return (
    <div className="subscrypts-transaction-step">
      {/* Status Display */}
      <div className="subscrypts-transaction-status">
        {isProcessing && <LoadingSpinner />}

        {isSuccess && (
          <div className="subscrypts-success-icon">✓</div>
        )}

        {isError && (
          <div className="subscrypts-error-icon">✕</div>
        )}

        <p className="subscrypts-transaction-message">{getStateMessage()}</p>

        {error && (
          <ErrorDisplay
            error={error}
            compact={true}
            onRetry={isError ? onExecute : undefined}
          />
        )}

        {subscriptionId && (
          <div className="subscrypts-info-box">
            <p className="subscrypts-info-label">Subscription ID</p>
            <p className="subscrypts-info-value">{subscriptionId}</p>
          </div>
        )}

        {txHash && (
          <a
            href={`https://arbiscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="subscrypts-link subscrypts-arbiscan-link"
          >
            View on Arbiscan →
          </a>
        )}
      </div>

      {/* Actions */}
      <div className="subscrypts-form-actions">
        {txState === 'idle' && (
          <>
            <button
              onClick={onBack}
              className="subscrypts-btn subscrypts-btn-outline subscrypts-btn-md"
            >
              Back
            </button>
            <button
              onClick={onExecute}
              className="subscrypts-btn subscrypts-btn-primary subscrypts-btn-md"
            >
              Subscribe
            </button>
          </>
        )}

        {isError && (
          <>
            <button
              onClick={onBack}
              className="subscrypts-btn subscrypts-btn-outline subscrypts-btn-md"
            >
              Back
            </button>
            <button
              onClick={onExecute}
              className="subscrypts-btn subscrypts-btn-primary subscrypts-btn-md"
            >
              Retry
            </button>
          </>
        )}

        {isSuccess && (
          <button
            onClick={onClose}
            className="subscrypts-btn subscrypts-btn-primary subscrypts-btn-md subscrypts-w-full"
          >
            Close
          </button>
        )}

        {isProcessing && (
          <p className="subscrypts-text-sm subscrypts-text-secondary subscrypts-text-center">
            Please confirm the transaction in your wallet
          </p>
        )}
      </div>
    </div>
  );
}
