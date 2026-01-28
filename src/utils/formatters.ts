/**
 * Formatting utilities for numbers, dates, and addresses
 */

import { formatUnits, parseUnits } from 'ethers';

/**
 * Format bigint token amount to human-readable string
 */
export function formatTokenAmount(amount: bigint, decimals: number, maxDecimals: number = 4): string {
  const formatted = formatUnits(amount, decimals);
  const parts = formatted.split('.');

  if (parts.length === 1) return parts[0];

  // Limit decimal places
  const decimalPart = parts[1].slice(0, maxDecimals);
  return `${parts[0]}.${decimalPart}`;
}

/**
 * Parse token amount from string to bigint
 */
export function parseTokenAmount(amount: string, decimals: number): bigint {
  return parseUnits(amount, decimals);
}

/**
 * Format SUBS token amount (18 decimals)
 */
export function formatSubs(amount: bigint): string {
  return formatTokenAmount(amount, 18, 4);
}

/**
 * Format USDC token amount (6 decimals)
 */
export function formatUsdc(amount: bigint): string {
  return formatTokenAmount(amount, 6, 2);
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

/**
 * Format date with time
 */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Format duration in seconds to human-readable string
 */
export function formatDuration(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}`;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  return `${seconds} second${seconds > 1 ? 's' : ''}`;
}

/**
 * Shorten address for display (0x1234...5678)
 */
export function shortenAddress(address: string, startChars: number = 6, endChars: number = 4): string {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;

  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a fiat (USD) price for display
 */
export function formatFiatPrice(amount: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}
