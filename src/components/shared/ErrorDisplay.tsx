/**
 * ErrorDisplay Component
 *
 * Context-aware error display with human-readable messages
 * and optional retry/dismiss actions.
 */

import { getErrorMessage } from '../../utils/errorMessages';

export interface ErrorDisplayProps {
  /** The error to display */
  error: Error | null;
  /** Callback for retry action (only shown if error is retryable) */
  onRetry?: () => void;
  /** Callback for dismiss action */
  onDismiss?: () => void;
  /** Compact mode for inline display */
  compact?: boolean;
  /** Additional CSS class name */
  className?: string;
}

/**
 * ErrorDisplay Component
 *
 * Automatically maps blockchain errors to user-friendly messages.
 *
 * @example
 * ```tsx
 * <ErrorDisplay
 *   error={error}
 *   onRetry={() => subscribe(params)}
 *   onDismiss={() => setError(null)}
 * />
 * ```
 */
export function ErrorDisplay({
  error,
  onRetry,
  onDismiss,
  compact = false,
  className = ''
}: ErrorDisplayProps) {
  if (!error) return null;

  const { title, message, suggestion, isRetryable } = getErrorMessage(error);

  if (compact) {
    return (
      <div className={`subscrypts-error-display subscrypts-error-display-compact ${className}`}>
        <div className="subscrypts-error-display-content">
          <p className="subscrypts-error-display-message">
            <strong>{title}:</strong> {message}
          </p>
          {isRetryable && onRetry && (
            <button
              onClick={onRetry}
              className="subscrypts-btn subscrypts-btn-outline subscrypts-btn-sm"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`subscrypts-error-display ${className}`}>
      <div className="subscrypts-error-display-icon">✕</div>
      <h3 className="subscrypts-error-display-title">{title}</h3>
      <p className="subscrypts-error-display-message">{message}</p>
      <p className="subscrypts-error-display-suggestion">{suggestion}</p>

      <div className="subscrypts-error-display-actions">
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="subscrypts-btn subscrypts-btn-outline subscrypts-btn-sm"
          >
            Dismiss
          </button>
        )}
        {isRetryable && onRetry && (
          <button
            onClick={onRetry}
            className="subscrypts-btn subscrypts-btn-primary subscrypts-btn-sm"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
