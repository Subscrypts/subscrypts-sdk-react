/**
 * ExternalConnector
 *
 * Wraps an externally-managed wallet provider (Wagmi, RainbowKit, etc.)
 * into the WalletConnector interface. The external app manages connection
 * lifecycle; this connector just exposes the provider/signer.
 */

import { WalletConnector, ConnectResult } from './types';
import { ExternalWalletConfig } from '../types';

export class ExternalConnector implements WalletConnector {
  readonly id = 'external' as const;
  readonly name = 'External Provider';
  readonly icon?: string;

  private config: ExternalWalletConfig;
  private chainId: number;

  constructor(config: ExternalWalletConfig, chainId: number) {
    this.config = config;
    this.chainId = chainId;
  }

  /**
   * External providers are always available (they're passed in by the app)
   */
  isAvailable(): boolean {
    return true;
  }

  /**
   * Return the external provider/signer directly
   */
  async connect(): Promise<ConnectResult> {
    return {
      provider: this.config.provider,
      signer: this.config.signer,
      address: this.config.address,
      chainId: this.chainId
    };
  }

  /**
   * External disconnect is a no-op (managed by the parent app)
   */
  async disconnect(): Promise<void> {
    // No-op: external app manages disconnect
  }

  /**
   * External providers can always reconnect (already connected)
   */
  async reconnect(): Promise<ConnectResult | null> {
    return this.connect();
  }

  /**
   * Update the external config (called when externalProvider prop changes)
   */
  updateConfig(config: ExternalWalletConfig, chainId: number): void {
    this.config = config;
    this.chainId = chainId;
  }
}
