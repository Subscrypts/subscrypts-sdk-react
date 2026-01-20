/**
 * Component prop types
 */

import { ReactNode } from 'react';
import { ExternalWalletConfig } from './wallet.types';
import { Plan } from './subscription.types';

/**
 * SubscryptsProvider props
 */
export interface SubscryptsProviderProps {
  children: ReactNode;
  /** Enable internal wallet management (default: true) */
  enableWalletManagement?: boolean;
  /** External wallet configuration (required if enableWalletManagement is false) */
  externalProvider?: ExternalWalletConfig;
  /** Network to use: 'arbitrum' or 'arbitrum-sepolia' (default: 'arbitrum') */
  network?: 'arbitrum' | 'arbitrum-sepolia';
  /** Custom RPC URL (optional) */
  rpcUrl?: string;
  /** Balance refresh interval in milliseconds (default: 30000) */
  balanceRefreshInterval?: number;
}

/**
 * SubscriptionGuard props
 */
export interface SubscriptionGuardProps {
  merchantId: string;
  planId: string;
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
  merchantId: string;
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
