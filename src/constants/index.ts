/**
 * Constants for @subscrypts/react-sdk
 */

// Network configurations
export {
  ARBITRUM_ONE,
  ARBITRUM_SEPOLIA,
  getNetworkConfig,
  isArbitrumNetwork
} from './networks';

// Contract addresses
export {
  SUBSCRYPTS_CONTRACT_ADDRESSES,
  getSubscryptsContractAddress
} from './contracts';

// Token addresses and decimals
export {
  SUBS_TOKEN_ADDRESSES,
  USDC_TOKEN_ADDRESSES,
  TOKEN_DECIMALS,
  getSubsTokenAddress,
  getUsdcTokenAddress
} from './tokens';

/**
 * Default configuration values
 */
export const DEFAULTS = {
  NETWORK: 'arbitrum' as const,
  BALANCE_REFRESH_INTERVAL: 30000, // 30 seconds
  SUBSCRIPTION_STATUS_CACHE_TIME: 30000, // 30 seconds
  DEFAULT_CYCLE_LIMIT: 12,
  UNISWAP_FEE_TIER: 3000, // 0.3%
  TRANSACTION_DEADLINE_SECONDS: 300 // 5 minutes
} as const;
