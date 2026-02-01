/**
 * Component prop types
 */

import { ReactNode } from 'react';
import { ExternalWalletConfig } from './wallet.types';
import { Plan } from './subscription.types';
import type { WalletConnector } from '../wallet/types';

/**
 * SubscryptsProvider props
 */
export interface SubscryptsProviderProps {
  children: ReactNode;
  /** Enable internal wallet management (default: true) */
  enableWalletManagement?: boolean;
  /** External wallet configuration (required if enableWalletManagement is false) */
  externalProvider?: ExternalWalletConfig;
  /** Network to use: 'arbitrum' (default: 'arbitrum') */
  network?: 'arbitrum';
  /** Custom RPC URL (optional) */
  rpcUrl?: string;
  /** Balance refresh interval in milliseconds (default: 30000) */
  balanceRefreshInterval?: number;
  /**
   * Debug mode for SDK logging
   * - 'silent': No console output
   * - 'info': User-friendly transaction status and errors (default)
   * - 'debug': Full developer debugging with all data
   * @default 'info'
   */
  debug?: 'silent' | 'info' | 'debug';
  /**
   * Callback when wallet account changes
   * Useful for refreshing page state when user switches accounts
   * @param newAddress - The new wallet address
   * @param oldAddress - The previous wallet address
   */
  onAccountChange?: (newAddress: string, oldAddress: string) => void;
  /**
   * Callback when network/chain changes
   * @param newChainId - The new chain ID
   * @param oldChainId - The previous chain ID
   */
  onChainChange?: (newChainId: number, oldChainId: number) => void;
  /**
   * Custom wallet connectors.
   * When provided, the SDK uses the connector architecture instead of
   * the internal WalletService. Overrides enableWalletManagement.
   *
   * @example
   * ```tsx
   * <SubscryptsProvider connectors={[new InjectedConnector(), myPrivyConnector]}>
   * ```
   */
  connectors?: WalletConnector[];
  /**
   * Persist wallet session across page reloads using localStorage.
   * When true, auto-reconnects silently on page load.
   * @default true
   */
  persistSession?: boolean;
  /**
   * Cache configuration for query results.
   * Reduces RPC calls by caching plan data, subscription status, etc.
   *
   * **Zero-config defaults work for 90% of users.**
   *
   * @default { enabled: true, defaultTTL: 60000, maxEntries: 500 }
   *
   * @example
   * ```tsx
   * // Default (recommended)
   * <SubscryptsProvider>
   *
   * // Custom configuration
   * <SubscryptsProvider caching={{ enabled: true, defaultTTL: 30000, maxEntries: 1000 }}>
   *
   * // Disable caching
   * <SubscryptsProvider caching={{ enabled: false }}>
   * ```
   */
  caching?: {
    /** Enable caching (default: true) */
    enabled?: boolean;
    /** Default time-to-live in milliseconds (default: 60000 = 60 seconds) */
    defaultTTL?: number;
    /** Maximum cache entries before LRU eviction (default: 500) */
    maxEntries?: number;
  };
}

/**
 * SubscriptionGuard props
 *
 * Supports single-plan gating (planId) and multi-plan gating (planIds).
 * When using planIds, set requireAll to control any-of vs all-of behavior.
 */
export interface SubscriptionGuardProps {
  /** Single plan ID to check (backward compatible) */
  planId?: string;
  /** Multiple plan IDs to check */
  planIds?: string[];
  /**
   * When true, user must be subscribed to ALL plans in planIds.
   * When false (default), user needs ANY one of the plans.
   * Only applies when planIds is provided.
   * @default false
   */
  requireAll?: boolean;
  /** URL to redirect to if subscription is inactive */
  fallbackUrl?: string;
  /** Custom loading component */
  loadingComponent?: ReactNode;
  /** Protected content */
  children: ReactNode;
  /** Callback when access is denied */
  onAccessDenied?: () => void;
}

/**
 * SubscriptionCatalog props
 */
export interface SubscriptionCatalogProps {
  /** Optional custom plans array (fetched from contract if not provided) */
  plans?: Plan[];
  /** Show referral input field (default: false) */
  showReferralInput?: boolean;
  /** Callback when subscribe button is clicked */
  onSubscribeClick?: (planId: string) => void;
  /** Custom CSS class */
  className?: string;
}

/**
 * CheckoutWizard props
 */
export interface CheckoutWizardProps {
  planId: string;
  /** Modal open state */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Referrer wallet address (optional) */
  referralAddress?: string;
  /** Success callback with subscription ID */
  onSuccess?: (subscriptionId: string) => void;
  /** Error callback */
  onError?: (error: Error) => void;
}

/**
 * SubscryptsButton props
 */
export interface SubscryptsButtonProps {
  planId: string;
  /** Button style variant */
  variant?: 'primary' | 'secondary' | 'outline';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Button text content */
  children?: ReactNode;
  /** Referrer wallet address (optional) */
  referralAddress?: string;
  /** Success callback with subscription ID */
  onSuccess?: (subscriptionId: string) => void;
}

/**
 * PlanCard props
 */
export interface PlanCardProps {
  plan: Plan;
  /** Selected currency for display */
  currency: 'SUBS' | 'USDC';
  /** Conversion rate (SUBS/USDC) */
  conversionRate: number;
  /** Click handler */
  onSubscribe: () => void;
}

/**
 * CurrencyToggle props
 */
export interface CurrencyToggleProps {
  /** Currently selected currency */
  selected: 'SUBS' | 'USDC';
  /** Change handler */
  onChange: (currency: 'SUBS' | 'USDC') => void;
}

/**
 * ReferralInput props
 */
export interface ReferralInputProps {
  /** Current referral address */
  value: string;
  /** Change handler */
  onChange: (address: string) => void;
  /** Validation error message */
  error?: string;
}
