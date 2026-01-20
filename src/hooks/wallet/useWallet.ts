/**
 * useWallet Hook
 *
 * Access wallet connection state and actions
 */

import { useSubscrypts } from '../../context/SubscryptsContext';
import { WalletState } from '../../types';

/**
 * Hook return type
 */
export interface UseWalletReturn extends WalletState {
  /** Connect wallet (only available if internal wallet management is enabled) */
  connect?: () => Promise<void>;
  /** Disconnect wallet (only available if internal wallet management is enabled) */
  disconnect?: () => Promise<void>;
  /** Switch network */
  switchNetwork: (chainId: number) => Promise<void>;
}

/**
 * Hook to access wallet state
 *
 * @example
 * ```tsx
 * const { address, isConnected, connect, disconnect } = useWallet();
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
  const { wallet, connect, disconnect, switchNetwork } = useSubscrypts();

  return {
    ...wallet,
    connect,
    disconnect,
    switchNetwork
  };
}
