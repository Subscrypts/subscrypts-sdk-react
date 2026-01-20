/**
 * useTokenBalance Hook
 *
 * Get token balance for SUBS or USDC
 */

import { useSubscrypts } from '../../context/SubscryptsContext';
import { formatSubs, formatUsdc } from '../../utils/formatters';

/**
 * Token type
 */
export type TokenType = 'SUBS' | 'USDC';

/**
 * Hook return type
 */
export interface UseTokenBalanceReturn {
  /** Raw balance (bigint) */
  balance: bigint | null;
  /** Formatted balance (string) */
  formatted: string;
  /** Loading state */
  isLoading: boolean;
  /** Manually refresh balance */
  refetch: () => Promise<void>;
}

/**
 * Hook to get token balance
 *
 * @param token - Token to get balance for ('SUBS' or 'USDC')
 *
 * @example
 * ```tsx
 * const { balance, formatted, isLoading } = useTokenBalance('SUBS');
 *
 * return <div>Balance: {formatted} SUBS</div>;
 * ```
 */
export function useTokenBalance(token: TokenType): UseTokenBalanceReturn {
  const { subsBalance, usdcBalance, refreshBalances, wallet } = useSubscrypts();

  const balance = token === 'SUBS' ? subsBalance : usdcBalance;
  const isLoading = wallet.isConnected && balance === null;

  const formatted = balance !== null
    ? (token === 'SUBS' ? formatSubs(balance) : formatUsdc(balance))
    : '0.00';

  return {
    balance,
    formatted,
    isLoading,
    refetch: refreshBalances
  };
}
