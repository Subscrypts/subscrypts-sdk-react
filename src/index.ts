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
  useWallet,
  usePlan,
  usePlans
} from './hooks';
export type {
  UseSubscriptionStatusReturn,
  UseSubscribeReturn,
  SubscribeParams,
  UseTokenBalanceReturn,
  TokenType,
  UseWalletReturn,
  UsePlanReturn,
  UsePlansReturn
} from './hooks';

// Components
export {
  SubscriptionGuard,
  CheckoutWizard,
  SubscryptsButton,
  LoadingSpinner,
  Modal,
  PlanCard,
  PricingTable,
  ErrorDisplay,
  NetworkSwitchPrompt,
  SubscryptsErrorBoundary,
  ConnectWalletModal
} from './components';
export type {
  PlanCardProps,
  PlanField,
  PricingTableProps,
  PlanConfig,
  ErrorDisplayProps,
  NetworkSwitchPromptProps,
  SubscryptsErrorBoundaryProps,
  ConnectWalletModalProps
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
  DEX_QUOTER_ADDRESS,
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
  ValidationError,

  // Error messages (v1.1.0)
  getErrorMessage,
  getErrorCode,
  ERROR_CODE_MAP,

  // Subscription status resolver (v1.1.0)
  resolveSubscriptionStatus
} from './utils';
export type {
  ErrorMessageConfig,
  SubscriptionState,
  ResolvedStatus,
  ResolveStatusInput
} from './utils';

// PERMIT2 utilities
export {
  generatePermit2Signature,
  PERMIT2_DOMAIN,
  PERMIT2_TYPES
} from './utils/permit.utils';

// ABIs
export { DEX_QUOTER_ABI } from './contract';

// Wallet connectors (v1.1.0)
export type { WalletConnector, ConnectorId, ConnectResult } from './wallet';
export { InjectedConnector } from './wallet';
export type { WalletSession } from './wallet';

// Logger
export { logger, type LogLevel, type LoggerConfig } from './utils/logger';

// Version
export const VERSION = '1.1.0';
