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
 * Arbitrum Sepolia (Testnet) configuration
 */
export const ARBITRUM_SEPOLIA: NetworkConfig = {
  chainId: 421614,
  name: 'Arbitrum Sepolia',
  rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
  blockExplorer: 'https://sepolia.arbiscan.io',
  nativeCurrency: {
    name: 'Sepolia Ether',
    symbol: 'ETH',
    decimals: 18
  }
};

/**
 * Get network config by name
 */
export function getNetworkConfig(network: 'arbitrum' | 'arbitrum-sepolia'): NetworkConfig {
  return network === 'arbitrum' ? ARBITRUM_ONE : ARBITRUM_SEPOLIA;
}

/**
 * Check if a chain ID is Arbitrum
 */
export function isArbitrumNetwork(chainId: number): boolean {
  return chainId === ARBITRUM_ONE.chainId || chainId === ARBITRUM_SEPOLIA.chainId;
}
