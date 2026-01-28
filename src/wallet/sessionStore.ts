/**
 * Wallet Session Persistence
 *
 * Saves/loads wallet session info to localStorage so users
 * can auto-reconnect on page reload without a popup.
 */

import { ConnectorId } from './types';

const STORAGE_KEY = 'subscrypts_wallet_session';
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Stored wallet session data
 */
export interface WalletSession {
  connectorId: ConnectorId;
  address: string;
  timestamp: number;
}

/**
 * Save a wallet session to localStorage
 */
export function saveSession(connectorId: ConnectorId, address: string): void {
  try {
    const session: WalletSession = {
      connectorId,
      address,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // localStorage may be unavailable (SSR, private browsing, etc.)
  }
}

/**
 * Load a wallet session from localStorage
 * Returns null if no session exists or session is invalid
 */
export function loadSession(): WalletSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const session: WalletSession = JSON.parse(raw);

    // Validate shape
    if (!session.connectorId || !session.address || !session.timestamp) {
      clearSession();
      return null;
    }

    return session;
  } catch {
    clearSession();
    return null;
  }
}

/**
 * Clear the stored wallet session
 */
export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

/**
 * Check if a session is stale (older than max age)
 */
export function isSessionStale(session: WalletSession): boolean {
  return Date.now() - session.timestamp > SESSION_MAX_AGE_MS;
}
