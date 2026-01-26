/**
 * Blockchain Configuration for Subscrypts SDK
 *
 * Central file for all blockchain-related constants:
 * - Network configuration (chain ID, RPC, explorer)
 * - Smart contract addresses
 * - Token addresses and decimals
 * - DEX/Uniswap addresses
 * - PERMIT2 configuration
 */

import { NetworkConfig } from '../types';

// ============================================
//              NETWORK CONFIG
// ============================================

export const CHAIN_ID = 42161;
export const CHAIN_NAME = 'Arbitrum One';

export const RPC_URLS = [
  'https://arb1.arbitrum.io/rpc',
  'https://rpc.ankr.com/arbitrum',
  'https://arbitrum.llamarpc.com'
];

export const DEFAULT_RPC_URL = RPC_URLS[0];
export const BLOCK_EXPLORER = 'https://arbiscan.io';

export const NETWORK_CONFIG: NetworkConfig = {
  chainId: CHAIN_ID,
  name: CHAIN_NAME,
  rpcUrl: DEFAULT_RPC_URL,
  blockExplorer: BLOCK_EXPLORER,
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  }
};

// ============================================
//           SUBSCRYPTS CONTRACT
// ============================================

/**
 * Subscrypts proxy contract address
 * UUPS Diamond Facet pattern - handles both subscriptions and SUBS token
 */
export const SUBSCRYPTS_ADDRESS = '0xE2E5409C4B4Be5b67C69Cc2C6507B0598D069Eac';

// Alias for clarity (same address due to Diamond Facet)
export const SUBS_TOKEN_ADDRESS = SUBSCRYPTS_ADDRESS;

// ============================================
//              TOKEN ADDRESSES
// ============================================

export const USDC_ADDRESS = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831';

// ============================================
//              TOKEN DECIMALS
// ============================================

export const DECIMALS = {
  SUBS: 18,
  USDC: 6,
  ETH: 18
} as const;

// ============================================
//           UNISWAP / DEX CONFIG
// ============================================

export const DEX_FACTORY_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
export const DEX_QUOTER_ADDRESS = '0x61fFE014bA17989E743c5F6cB21bF9697530B21e';
export const DEX_ROUTER_ADDRESS = '0xa51afafe0263b40edaef0df8781ea9aa03e381a3';
export const DEX_POSITION_MANAGER_ADDRESS = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88';
export const DEX_PAIR_ADDRESS = '0xa8C221C5110FA82b0B90A6bA78227C2EE8061f48';

export const UNISWAP_FEE_TIER = 3000; // 0.3%

// ============================================
//              PERMIT2 CONFIG
// ============================================

export const PERMIT2_ADDRESS = '0x000000000022D473030F116dDEE9F6B43aC78BA3';

// ============================================
//              SDK DEFAULTS
// ============================================

export const DEFAULTS = {
  NETWORK: 'arbitrum' as const,        // Default network
  BALANCE_REFRESH_INTERVAL: 30000,     // 30 seconds
  SUBSCRIPTION_CACHE_TIME: 30000,      // 30 seconds
  DEFAULT_CYCLE_LIMIT: 12,
  TRANSACTION_DEADLINE_SECONDS: 300,   // 5 minutes
  PERMIT_DEADLINE_SECONDS: 1800,       // 30 minutes
  SLIPPAGE_BUFFER_BPS: 50,             // 0.5% (50 basis points)
  UNISWAP_FEE_TIER: UNISWAP_FEE_TIER   // Re-export for convenience
} as const;

// ============================================
//           HELPER FUNCTIONS
// ============================================

export function isArbitrumNetwork(chainId: number): boolean {
  return chainId === CHAIN_ID;
}

export function getSubscryptsAddress(chainId: number): string {
  if (chainId !== CHAIN_ID) {
    throw new Error(`Subscrypts only deployed on Arbitrum One (chain ${CHAIN_ID})`);
  }
  return SUBSCRYPTS_ADDRESS;
}
