/**
 * useWallet Hook
 *
 * Access wallet connection state, actions, and connector information.
 */

import { useSubscrypts } from '../../context/SubscryptsContext';
import { WalletState } from '../../types';
import type { WalletConnector, ConnectorId } from '../../wallet/types';

/**
 * Hook return type
 */
export interface UseWalletReturn extends WalletState {
  /** Connect wallet (only available if wallet management is enabled) */
  connect?: () => Promise<void>;
  /** Disconnect wallet (only available if wallet management is enabled) */
  disconnect?: () => Promise<void>;
  /** Switch network */
  switchNetwork: (chainId: number) => Promise<void>;
  /** Available wallet connectors */
  connectors: WalletConnector[];
  /** Currently active connector (null if not connected) */
  activeConnector: WalletConnector | null;
  /** Connect with a specific connector by ID */
  connectWith: (connectorId: ConnectorId) => Promise<void>;
}

/**
 * Hook to access wallet state and connector info
 *
 * @example
 * ```tsx
 * const { address, isConnected, connect, disconnect, connectors, connectWith } = useWallet();
 *
 * if (!isConnected) {
 *   return <button onClick={connect}>Connect Wallet</button>;
 * }
 *
 * return (
 *   <button onClick={disconnect}>
 *     {address?.slice(0, 6)}...{address?.slice(-4)}
 *   </button>
 * );
 * ```
 */
export function useWallet(): UseWalletReturn {
  const { wallet, connect, disconnect, switchNetwork, connectors, activeConnector, connectWith } = useSubscrypts();

  return {
    ...wallet,
    connect,
    disconnect,
    switchNetwork,
    connectors,
    activeConnector,
    connectWith
  };
}
