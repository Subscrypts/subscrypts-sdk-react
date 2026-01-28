/**
 * Wallet module exports
 */

// Types
export type { WalletConnector, ConnectorId, ConnectResult } from './types';

// Connectors
export { InjectedConnector } from './InjectedConnector';
export { ExternalConnector } from './ExternalConnector';

// Session persistence
export {
  saveSession,
  loadSession,
  clearSession,
  isSessionStale
} from './sessionStore';
export type { WalletSession } from './sessionStore';
