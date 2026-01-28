/**
 * NetworkSwitchPrompt Component
 *
 * Displayed when the user is connected to the wrong network.
 * Provides a one-click switch to Arbitrum One.
 */

import { ARBITRUM_ONE } from '../../constants';

export interface NetworkSwitchPromptProps {
  /** Current chain ID the user is connected to */
  currentChainId: number | null;
  /** Callback to trigger network switch */
  onSwitch: () => void;
  /** Optional callback to dismiss the prompt */
  onDismiss?: () => void;
  /** Additional CSS class name */
  className?: string;
}

/**
 * NetworkSwitchPrompt Component
 *
 * @example
 * ```tsx
 * const { walletState, switchNetwork } = useWallet();
 *
 * {walletState.chainId && walletState.chainId !== 42161 && (
 *   <NetworkSwitchPrompt
 *     currentChainId={walletState.chainId}
 *     onSwitch={() => switchNetwork(42161)}
 *   />
 * )}
 * ```
 */
export function NetworkSwitchPrompt({
  currentChainId,
  onSwitch,
  onDismiss,
  className = ''
}: NetworkSwitchPromptProps) {
  return (
    <div className={`subscrypts-network-prompt ${className}`}>
      <div className="subscrypts-network-prompt-icon">⚠</div>
      <div className="subscrypts-network-prompt-content">
        <h3 className="subscrypts-network-prompt-title">Wrong Network</h3>
        <p className="subscrypts-network-prompt-message">
          You are connected to chain {currentChainId || 'unknown'}.
          Please switch to {ARBITRUM_ONE.name} to continue.
        </p>
      </div>
      <div className="subscrypts-network-prompt-actions">
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="subscrypts-btn subscrypts-btn-outline subscrypts-btn-sm"
          >
            Dismiss
          </button>
        )}
        <button
          onClick={onSwitch}
          className="subscrypts-btn subscrypts-btn-primary subscrypts-btn-sm"
        >
          Switch to Arbitrum
        </button>
      </div>
    </div>
  );
}
