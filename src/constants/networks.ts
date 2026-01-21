/**
 * Network configurations for Arbitrum
 */

import { NetworkConfig } from '../types';

/**
 * Arbitrum One (Mainnet) configuration
 */
export const ARBITRUM_ONE: NetworkConfig = {
  chainId: 42161,
  name: 'Arbitrum One',
  rpcUrl: 'https://arb1.arbitrum.io/rpc',
  blockExplorer: 'https://arbiscan.io',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  }
};

/**
 * Get network config by name
 */
export function getNetworkConfig(_network: 'arbitrum'): NetworkConfig {
  return ARBITRUM_ONE;
}

/**
 * Check if a chain ID is Arbitrum
 */
export function isArbitrumNetwork(chainId: number): boolean {
  return chainId === ARBITRUM_ONE.chainId;
}
