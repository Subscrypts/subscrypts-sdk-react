/**
 * Smart contract addresses
 */

/**
 * Subscrypts contract addresses by network
 */
export const SUBSCRYPTS_CONTRACT_ADDRESSES: Record<number, string> = {
  // Arbitrum One
  42161: '0xE2E5409C4B4Be5b67C69Cc2C6507B0598D069Eac',
  // Arbitrum Sepolia (update with actual testnet address)
  421614: '0xE2E5409C4B4Be5b67C69Cc2C6507B0598D069Eac' // TODO: Update with testnet address
};

/**
 * Get Subscrypts contract address for a specific chain
 */
export function getSubscryptsContractAddress(chainId: number): string {
  const address = SUBSCRYPTS_CONTRACT_ADDRESSES[chainId];
  if (!address) {
    throw new Error(`Subscrypts contract not deployed on chain ${chainId}`);
  }
  return address;
}
