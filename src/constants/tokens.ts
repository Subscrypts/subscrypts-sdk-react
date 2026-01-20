/**
 * Token addresses for SUBS and USDC
 */

/**
 * SUBS token addresses by network
 */
export const SUBS_TOKEN_ADDRESSES: Record<number, string> = {
  // Arbitrum One - SUBS is the native token on the Subscrypts contract
  42161: '0x0000000000000000000000000000000000000000', // TODO: Update with actual SUBS token address
  // Arbitrum Sepolia
  421614: '0x0000000000000000000000000000000000000000' // TODO: Update with testnet address
};

/**
 * USDC token addresses by network
 */
export const USDC_TOKEN_ADDRESSES: Record<number, string> = {
  // Arbitrum One - Official USDC
  42161: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  // Arbitrum Sepolia - USDC testnet
  421614: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d' // TODO: Verify testnet USDC address
};

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
  const address = SUBS_TOKEN_ADDRESSES[chainId];
  if (!address || address === '0x0000000000000000000000000000000000000000') {
    throw new Error(`SUBS token address not configured for chain ${chainId}`);
  }
  return address;
}

/**
 * Get USDC token address for a specific chain
 */
export function getUsdcTokenAddress(chainId: number): string {
  const address = USDC_TOKEN_ADDRESSES[chainId];
  if (!address) {
    throw new Error(`USDC token not available on chain ${chainId}`);
  }
  return address;
}
