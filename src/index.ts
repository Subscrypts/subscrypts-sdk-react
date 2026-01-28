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
  usePlans,
  // v1.2.0
  useSUBSPrice,
  usePlanPrice,
  useManageSubscription,
  usePlansByMerchant,
  // v1.3.0
  useMySubscriptions,
  useSubscryptsEvents
} from './hooks';
export type {
  UseSubscriptionStatusReturn,
  UseSubscribeReturn,
  SubscribeParams,
  UseTokenBalanceReturn,
  TokenType,
  UseWalletReturn,
  UsePlanReturn,
  UsePlansReturn,
  // v1.2.0
  UseSUBSPriceReturn,
  UsePlanPriceReturn,
  PlanPriceInfo,
  UseManageSubscriptionReturn,
  UsePlansByMerchantReturn,
  // v1.3.0
  UseMySubscriptionsReturn,
  SubscryptsEventCallbacks,
  UseSubscryptsEventsReturn
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
  ConnectWalletModal,
  // v1.2.0
  ManageSubscriptionModal,
  ConfirmDialog,
  // v1.3.0
  SubscriptionCard,
  SubscriptionDashboard
} from './components';
export type {
  PlanCardProps,
  PlanField,
  PricingTableProps,
  PlanConfig,
  ErrorDisplayProps,
  NetworkSwitchPromptProps,
  SubscryptsErrorBoundaryProps,
  ConnectWalletModalProps,
  // v1.2.0
  ManageSubscriptionModalProps,
  ConfirmDialogProps,
  // v1.3.0
  SubscriptionCardProps,
  SubscriptionDashboardProps
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
  resolveSubscriptionStatus,

  // Fiat price formatter (v1.2.0)
  formatFiatPrice,

  // Decision helpers (v1.2.0)
  canAccess,
  isPaymentDue,
  shouldRenew,
  getSubscriptionHealth
} from './utils';
export type {
  ErrorMessageConfig,
  SubscriptionState,
  ResolvedStatus,
  ResolveStatusInput,
  // v1.2.0
  SubscriptionHealth
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
export const VERSION = '1.3.0';
