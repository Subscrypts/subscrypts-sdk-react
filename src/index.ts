/**
 * @subscrypts/react-sdk
 *
 * Official React SDK for Subscrypts - Decentralized subscriptions on Arbitrum
 *
 * @example
 * ```tsx
 * import { SubscryptsProvider, SubscriptionGuard } from '@subscrypts/react-sdk';
 * import '@subscrypts/react-sdk/styles';
 *
 * function App() {
 *   return (
 *     <SubscryptsProvider enableWalletManagement={true}>
 *       <SubscriptionGuard
 *         planId="1"
 *         fallbackUrl="/subscribe"
 *       >
 *         <PremiumContent />
 *       </SubscriptionGuard>
 *     </SubscryptsProvider>
 *   );
 * }
 * ```
 */

// Context & Provider
export { SubscryptsProvider, useSubscrypts } from './context';
export type { SubscryptsContextValue } from './context';

// Hooks (Headless API)
export {
  useSubscriptionStatus,
  useSubscribe,
  useTokenBalance,
  useWallet
} from './hooks';
export type {
  UseSubscriptionStatusReturn,
  UseSubscribeReturn,
  SubscribeParams,
  UseTokenBalanceReturn,
  TokenType,
  UseWalletReturn
} from './hooks';

// Components
export {
  SubscriptionGuard,
  CheckoutWizard,
  SubscryptsButton,
  LoadingSpinner,
  Modal
} from './components';

// Types
export type {
  // Subscription types
  SubscriptionStatus,
  Subscription,
  Plan,
  PaymentMethod,
  TransactionState,
  CheckoutStep,

  // Contract types
  SubscriptionCreateParams,
  PayWithUsdcParams,
  SubscriptionCreateResult,
  PayWithUsdcResult,
  ContractSubscription,

  // Wallet types
  NetworkConfig,
  WalletState,
  ExternalWalletConfig,

  // Component prop types
  SubscryptsProviderProps,
  SubscriptionGuardProps
} from './types';

// Constants
export {
  ARBITRUM_ONE,
  getNetworkConfig,
  isArbitrumNetwork,
  getSubscryptsContractAddress,
  getSubsTokenAddress,
  getUsdcTokenAddress,
  PERMIT2_ADDRESS,
  TOKEN_DECIMALS,
  DEFAULTS
} from './constants';

// Utilities
export {
  // Formatters
  formatTokenAmount,
  parseTokenAmount,
  formatSubs,
  formatUsdc,
  formatDate,
  formatDateTime,
  formatDuration,
  shortenAddress,
  formatPercentage,

  // Validators
  validateAddress,
  validatePositiveNumber,
  validatePositiveBigInt,
  validatePlanId,
  validateCycleLimit,

  // Errors
  SubscryptsError,
  WalletError,
  NetworkError,
  ContractError,
  InsufficientBalanceError,
  TransactionError,
  ValidationError
} from './utils';

// PERMIT2 utilities
export {
  generatePermit2Signature,
  PERMIT2_DOMAIN,
  PERMIT2_TYPES
} from './utils/permit.utils';

// Version
export const VERSION = '1.0.3';
