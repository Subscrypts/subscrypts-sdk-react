/**
 * Token addresses for SUBS and USDC on Arbitrum One
 *
 * Note: Subscrypts uses a UUPS Diamond Facet architecture where the SUBS token
 * and Subscrypts contract share the same proxy address. All token functionality
 * is accessible through the main proxy contract.
 */

/**
 * SUBS token address on Arbitrum One
 * Uses the same proxy address as Subscrypts contract (UUPS Diamond Facet pattern)
 */
export const SUBS_TOKEN_ADDRESS = '0xE2E5409C4B4Be5b67C69Cc2C6507B0598D069Eac';

/**
 * USDC token address on Arbitrum One
 */
export const USDC_TOKEN_ADDRESS = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831';

/**
 * PERMIT2 universal router address (Uniswap)
 * Used for safe, gas-efficient token approvals via EIP-712 signatures
 */
export const PERMIT2_ADDRESS = '0x000000000022D473030F116dDEE9F6B43aC78BA3';

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
