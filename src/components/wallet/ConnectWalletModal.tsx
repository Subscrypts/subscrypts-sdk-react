/**
 * ConnectWalletModal Component
 *
 * Lists available wallet connectors and handles connection.
 * Uses the Modal component for presentation.
 */

import { useState } from 'react';
import { WalletConnector } from '../../wallet/types';
import { Modal } from '../shared/Modal';
import { ErrorDisplay } from '../shared/ErrorDisplay';

export interface ConnectWalletModalProps {
  /** Modal open state */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Available wallet connectors */
  connectors: WalletConnector[];
  /** Callback when connection succeeds */
  onConnect: (connectorId: string) => Promise<void>;
  /** Additional CSS class name */
  className?: string;
}

/**
 * Connect Wallet Modal
 *
 * @example
 * ```tsx
 * <ConnectWalletModal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   connectors={connectors}
 *   onConnect={(id) => connectWith(id)}
 * />
 * ```
 */
export function ConnectWalletModal({
  isOpen,
  onClose,
  connectors,
  onConnect,
  className = ''
}: ConnectWalletModalProps) {
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const availableConnectors = connectors.filter((c) => c.isAvailable());

  const handleConnect = async (connectorId: string) => {
    setConnectingId(connectorId);
    setError(null);

    try {
      await onConnect(connectorId);
      onClose();
    } catch (err) {
      setError(err as Error);
    } finally {
      setConnectingId(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Connect Wallet" size="sm">
      <div className={`subscrypts-connect-wallet ${className}`}>
        {error && (
          <ErrorDisplay
            error={error}
            compact
            onDismiss={() => setError(null)}
          />
        )}

        {availableConnectors.length === 0 ? (
          <div className="subscrypts-connect-wallet-empty">
            <p>No wallets detected.</p>
            <p>Please install MetaMask or another Web3 wallet to continue.</p>
          </div>
        ) : (
          <div className="subscrypts-connect-wallet-list">
            {availableConnectors.map((connector) => (
              <button
                key={connector.id}
                onClick={() => handleConnect(connector.id)}
                disabled={connectingId !== null}
                className={`subscrypts-connect-wallet-option ${
                  connectingId === connector.id ? 'subscrypts-connect-wallet-option-loading' : ''
                }`}
              >
                {connector.icon && (
                  <img
                    src={connector.icon}
                    alt={connector.name}
                    className="subscrypts-connect-wallet-icon"
                  />
                )}
                <span className="subscrypts-connect-wallet-name">
                  {connector.name}
                </span>
                {connectingId === connector.id && (
                  <span className="subscrypts-connect-wallet-spinner" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
