/**
 * Wallet Connector Types
 *
 * Defines the WalletConnector interface that allows plugging in
 * any wallet provider (MetaMask, WalletConnect, Privy, etc.)
 */

import { BrowserProvider, Signer } from 'ethers';

/**
 * Connector identifier type.
 * Built-in: 'injected' (MetaMask/browser), 'external' (Wagmi/RainbowKit).
 * Custom connectors can use any string.
 */
export type ConnectorId = 'injected' | 'external' | (string & {});

/**
 * Result of a successful wallet connection
 */
export interface ConnectResult {
  provider: BrowserProvider;
  signer: Signer;
  address: string;
  chainId: number;
}

/**
 * Wallet Connector Interface
 *
 * Implement this interface to create a custom wallet connector
 * for use with the Subscrypts SDK.
 *
 * @example
 * ```typescript
 * import { WalletConnector, ConnectResult } from '@subscrypts/subscrypts-sdk-react';
 *
 * class PrivyConnector implements WalletConnector {
 *   readonly id = 'privy';
 *   readonly name = 'Email/Social Login';
 *   isAvailable() { return true; }
 *   async connect(): Promise<ConnectResult> {
 *     // Use Privy SDK to login and get ethers provider/signer
 *   }
 *   async disconnect() { /* privy logout *\/ }
 * }
 * ```
 */
export interface WalletConnector {
  /** Unique connector identifier */
  readonly id: ConnectorId;
  /** Human-readable connector name (e.g. 'MetaMask', 'WalletConnect') */
  readonly name: string;
  /** Optional icon URL or data URI */
  readonly icon?: string;

  /** Check if this connector is available (e.g. MetaMask installed?) */
  isAvailable(): boolean;

  /** Connect the wallet. Shows popup/modal as needed. */
  connect(): Promise<ConnectResult>;

  /** Disconnect the wallet */
  disconnect(): Promise<void>;

  /**
   * Silent reconnect without popup (for session persistence).
   * Returns null if reconnection is not possible.
   */
  reconnect?(): Promise<ConnectResult | null>;

  /** Listen to account changes */
  onAccountsChanged?(callback: (accounts: string[]) => void): void;

  /** Listen to chain/network changes */
  onChainChanged?(callback: (chainId: number) => void): void;

  /** Remove all event listeners */
  removeListeners?(): void;

  /** Switch to a specific network */
  switchNetwork?(chainId: number): Promise<void>;
}
