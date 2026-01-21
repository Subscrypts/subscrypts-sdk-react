/**
 * Token addresses for SUBS and USDC on Arbitrum One
 */

/**
 * SUBS token address on Arbitrum One
 */
export const SUBS_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000'; // TODO: Update with actual SUBS token address

/**
 * USDC token address on Arbitrum One
 */
export const USDC_TOKEN_ADDRESS = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831';

/**
 * Arbitrum One chain ID
 */
const ARBITRUM_ONE_CHAIN_ID = 42161;

/**
 * Token decimals
 */
export const TOKEN_DECIMALS = {
  SUBS: 18,
  USDC: 6
} as const;

/**
 * Get SUBS token address for a specific chain
 */
export function getSubsTokenAddress(chainId: number): string {
  if (chainId !== ARBITRUM_ONE_CHAIN_ID) {
    throw new Error(`SUBS token only available on Arbitrum One (chain ${ARBITRUM_ONE_CHAIN_ID})`);
  }
  if (SUBS_TOKEN_ADDRESS === '0x0000000000000000000000000000000000000000') {
    throw new Error(`SUBS token address not configured`);
  }
  return SUBS_TOKEN_ADDRESS;
}

/**
 * Get USDC token address for a specific chain
 */
export function getUsdcTokenAddress(chainId: number): string {
  if (chainId !== ARBITRUM_ONE_CHAIN_ID) {
    throw new Error(`USDC token only available on Arbitrum One (chain ${ARBITRUM_ONE_CHAIN_ID})`);
  }
  return USDC_TOKEN_ADDRESS;
}
