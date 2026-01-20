/**
 * Subscrypts SDK Context
 */

import { createContext, useContext } from 'react';
import { BrowserProvider, Signer, Contract } from 'ethers';
import { NetworkConfig, WalletState } from '../types';

/**
 * Context value type
 */
export interface SubscryptsContextValue {
  // Wallet state
  wallet: WalletState;
  signer: Signer | null;
  provider: BrowserProvider | null;

  // Network
  network: NetworkConfig;
  switchNetwork: (chainId: number) => Promise<void>;

  // Contracts
  subscryptsContract: Contract | null;
  subsTokenContract: Contract | null;
  usdcTokenContract: Contract | null;

  // Balances
  subsBalance: bigint | null;
  usdcBalance: bigint | null;
  refreshBalances: () => Promise<void>;

  // Actions (only available if internal wallet management is enabled)
  connect?: () => Promise<void>;
  disconnect?: () => Promise<void>;
}

/**
 * Create context with undefined default
 */
export const SubscryptsContext = createContext<SubscryptsContextValue | undefined>(undefined);

/**
 * Hook to access Subscrypts context
 */
export function useSubscrypts(): SubscryptsContextValue {
  const context = useContext(SubscryptsContext);

  if (!context) {
    throw new Error(
      'useSubscrypts must be used within a SubscryptsProvider'
    );
  }

  return context;
}
