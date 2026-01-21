/**
 * Smart contract addresses
 *
 * Architecture: Subscrypts uses a UUPS Diamond Facet pattern
 * The proxy address (0xE2E5409C4B4Be5b67C69Cc2C6507B0598D069Eac) provides:
 * - Subscription management functions
 * - SUBS token (ERC20) functions
 * - All other protocol functionality
 */

/**
 * Subscrypts proxy contract address on Arbitrum One
 * This address handles both subscription logic and SUBS token functionality
 */
export const SUBSCRYPTS_CONTRACT_ADDRESS = '0xE2E5409C4B4Be5b67C69Cc2C6507B0598D069Eac';

/**
 * Arbitrum One chain ID
 */
export const ARBITRUM_ONE_CHAIN_ID = 42161;

/**
 * Get Subscrypts contract address for a specific chain
 */
export function getSubscryptsContractAddress(chainId: number): string {
  if (chainId !== ARBITRUM_ONE_CHAIN_ID) {
    throw new Error(`Subscrypts contract only deployed on Arbitrum One (chain ${ARBITRUM_ONE_CHAIN_ID})`);
  }
  return SUBSCRYPTS_CONTRACT_ADDRESS;
}
