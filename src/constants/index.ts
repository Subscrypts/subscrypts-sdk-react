/**
 * Constants for @subscrypts/react-sdk
 *
 * Re-exports from centralized src/contract/ directory
 */

// Re-export everything from central contract config
export {
  // Network
  CHAIN_ID,
  CHAIN_NAME,
  RPC_URLS,
  DEFAULT_RPC_URL,
  BLOCK_EXPLORER,
  NETWORK_CONFIG,

  // Subscrypts
  SUBSCRYPTS_ADDRESS,
  SUBS_TOKEN_ADDRESS,

  // Tokens
  USDC_ADDRESS,
  DECIMALS,

  // DEX / Uniswap
  DEX_FACTORY_ADDRESS,
  DEX_QUOTER_ADDRESS,
  DEX_ROUTER_ADDRESS,
  DEX_POSITION_MANAGER_ADDRESS,
  DEX_PAIR_ADDRESS,
  UNISWAP_FEE_TIER,

  // PERMIT2
  PERMIT2_ADDRESS,

  // Defaults
  DEFAULTS,

  // Helpers
  isArbitrumNetwork,
  getSubscryptsAddress
} from '../contract';

// Legacy aliases for backwards compatibility
export { NETWORK_CONFIG as ARBITRUM_ONE } from '../contract';
export { SUBSCRYPTS_ADDRESS as SUBSCRYPTS_CONTRACT_ADDRESS } from '../contract';
export { CHAIN_ID as ARBITRUM_ONE_CHAIN_ID } from '../contract';
export { DECIMALS as TOKEN_DECIMALS } from '../contract';

// Legacy helper functions
import { NETWORK_CONFIG, CHAIN_ID, SUBS_TOKEN_ADDRESS, USDC_ADDRESS, getSubscryptsAddress } from '../contract';

export const getNetworkConfig = (_network?: 'arbitrum') => NETWORK_CONFIG;
export const getSubscryptsContractAddress = getSubscryptsAddress;
export const getSubsTokenAddress = (chainId: number): string => {
  if (chainId !== CHAIN_ID) throw new Error(`Only Arbitrum One (chain ${CHAIN_ID}) supported`);
  return SUBS_TOKEN_ADDRESS;
};
export const getUsdcTokenAddress = (chainId: number): string => {
  if (chainId !== CHAIN_ID) throw new Error(`Only Arbitrum One (chain ${CHAIN_ID}) supported`);
  return USDC_ADDRESS;
};
