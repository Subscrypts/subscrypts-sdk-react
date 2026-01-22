/**
 * Constants for @subscrypts/react-sdk
 *
 * All critical addresses are pre-configured and hardcoded for Arbitrum One.
 * Developers don't need to configure:
 * - SUBS token address (uses Diamond Facet proxy)
 * - USDC token address
 * - Subscrypts contract address
 * - Default RPC URL (https://arb1.arbitrum.io/rpc)
 *
 * Everything works out of the box - just wrap your app with SubscryptsProvider!
 */

// Network configurations
export {
  ARBITRUM_ONE,
  getNetworkConfig,
  isArbitrumNetwork
} from './networks';

// Contract addresses
export {
  SUBSCRYPTS_CONTRACT_ADDRESS,
  ARBITRUM_ONE_CHAIN_ID,
  DEX_QUOTER_ADDRESS,
  getSubscryptsContractAddress
} from './contracts';

// Token addresses and decimals
export {
  SUBS_TOKEN_ADDRESS,
  USDC_TOKEN_ADDRESS,
  PERMIT2_ADDRESS,
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
