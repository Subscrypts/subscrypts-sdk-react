/**
 * SubscryptsErrorBoundary Component
 *
 * React error boundary wrapper for Subscrypts SDK components.
 * Catches rendering errors and displays a fallback UI.
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';

export interface SubscryptsErrorBoundaryProps {
  /** Child components to wrap */
  children: ReactNode;
  /** Custom fallback UI or render function */
  fallback?: ReactNode | ((error: Error, resetError: () => void) => ReactNode);
  /** Callback when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary for Subscrypts SDK components.
 *
 * @example
 * ```tsx
 * <SubscryptsErrorBoundary
 *   fallback={(error, reset) => (
 *     <div>
 *       <p>Something went wrong: {error.message}</p>
 *       <button onClick={reset}>Try Again</button>
 *     </div>
 *   )}
 *   onError={(error) => analytics.trackError(error)}
 * >
 *   <SubscriptionDashboard />
 * </SubscryptsErrorBoundary>
 * ```
 */
export class SubscryptsErrorBoundary extends Component<
  SubscryptsErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: SubscryptsErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      const { fallback } = this.props;

      if (typeof fallback === 'function') {
        return fallback(this.state.error, this.resetError);
      }

      if (fallback) {
        return fallback;
      }

      // Default fallback UI
      return (
        <div className="subscrypts-error-boundary-fallback">
          <div className="subscrypts-error-boundary-icon">⚠</div>
          <h3 className="subscrypts-error-boundary-title">Something went wrong</h3>
          <p className="subscrypts-error-boundary-message">
            {this.state.error.message}
          </p>
          <button
            onClick={this.resetError}
            className="subscrypts-btn subscrypts-btn-primary subscrypts-btn-sm"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
