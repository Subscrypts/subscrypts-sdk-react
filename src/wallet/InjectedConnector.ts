/**
 * InjectedConnector
 *
 * Connects to browser-injected wallets (MetaMask, Coinbase Wallet, etc.)
 * via window.ethereum. Wraps the existing WalletService logic.
 */

import { BrowserProvider, Eip1193Provider } from 'ethers';
import { WalletConnector, ConnectResult } from './types';
import { WalletError, NetworkError } from '../utils/errors';
import { NetworkConfig } from '../types';
import { getNetworkConfig } from '../constants';

export class InjectedConnector implements WalletConnector {
  readonly id = 'injected' as const;
  readonly name: string;
  readonly icon?: string;

  private provider: BrowserProvider | null = null;
  private accountsHandler: ((...args: unknown[]) => void) | null = null;
  private chainHandler: ((...args: unknown[]) => void) | null = null;

  constructor(options?: { name?: string; icon?: string }) {
    this.name = options?.name || this.detectWalletName();
    this.icon = options?.icon;
  }

  /**
   * Detect the installed wallet name from window.ethereum
   */
  private detectWalletName(): string {
    if (typeof window === 'undefined' || !window.ethereum) return 'Browser Wallet';
    if (window.ethereum.isMetaMask) return 'MetaMask';
    if (window.ethereum.isCoinbaseWallet) return 'Coinbase Wallet';
    return 'Browser Wallet';
  }

  /**
   * Check if a browser wallet is available
   */
  isAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.ethereum;
  }

  /**
   * Connect to the browser wallet
   */
  async connect(): Promise<ConnectResult> {
    if (!this.isAvailable()) {
      throw new WalletError(
        'No Ethereum wallet found. Please install MetaMask or another Web3 wallet.'
      );
    }

    try {
      const ethereumProvider = window.ethereum as unknown as Eip1193Provider;
      this.provider = new BrowserProvider(ethereumProvider);

      const accounts = await this.provider.send('eth_requestAccounts', []);

      if (!accounts || accounts.length === 0) {
        throw new WalletError('No accounts found. Please unlock your wallet.');
      }

      const network = await this.provider.getNetwork();
      const chainId = Number(network.chainId);
      const signer = await this.provider.getSigner();

      return {
        provider: this.provider,
        signer,
        address: accounts[0],
        chainId
      };
    } catch (error) {
      if (error instanceof WalletError) throw error;
      throw new WalletError('Failed to connect wallet', { error });
    }
  }

  /**
   * Disconnect (reset internal state)
   */
  async disconnect(): Promise<void> {
    this.removeListeners();
    this.provider = null;
  }

  /**
   * Silent reconnect: check if already authorized without popup
   */
  async reconnect(): Promise<ConnectResult | null> {
    if (!this.isAvailable()) return null;

    try {
      const ethereumProvider = window.ethereum as unknown as Eip1193Provider;
      this.provider = new BrowserProvider(ethereumProvider);

      // eth_accounts doesn't trigger a popup (unlike eth_requestAccounts)
      const accounts = await this.provider.send('eth_accounts', []);

      if (!accounts || accounts.length === 0) return null;

      const network = await this.provider.getNetwork();
      const chainId = Number(network.chainId);
      const signer = await this.provider.getSigner();

      return {
        provider: this.provider,
        signer,
        address: accounts[0],
        chainId
      };
    } catch {
      return null;
    }
  }

  /**
   * Listen to account changes
   */
  onAccountsChanged(callback: (accounts: string[]) => void): void {
    if (!window.ethereum) return;

    this.accountsHandler = (...args: unknown[]) => {
      callback(args[0] as string[]);
    };
    window.ethereum.on('accountsChanged', this.accountsHandler);
  }

  /**
   * Listen to chain changes
   */
  onChainChanged(callback: (chainId: number) => void): void {
    if (!window.ethereum) return;

    this.chainHandler = (...args: unknown[]) => {
      const chainIdHex = args[0] as string;
      callback(parseInt(chainIdHex, 16));
    };
    window.ethereum.on('chainChanged', this.chainHandler);
  }

  /**
   * Remove all event listeners
   */
  removeListeners(): void {
    if (!window.ethereum) return;

    if (this.accountsHandler) {
      window.ethereum.removeListener('accountsChanged', this.accountsHandler);
      this.accountsHandler = null;
    }
    if (this.chainHandler) {
      window.ethereum.removeListener('chainChanged', this.chainHandler);
      this.chainHandler = null;
    }
  }

  /**
   * Switch to a specific network
   */
  async switchNetwork(chainId: number): Promise<void> {
    if (!window.ethereum) {
      throw new WalletError('No Ethereum wallet found');
    }

    const targetNetwork = getNetworkConfig('arbitrum');

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      });
    } catch (error: any) {
      if (error.code === 4902) {
        await this.addNetwork(targetNetwork);
      } else {
        throw new NetworkError(
          `Failed to switch to chain ${chainId}`,
          { chainId, error }
        );
      }
    }
  }

  /**
   * Add a network to the wallet
   */
  private async addNetwork(network: NetworkConfig): Promise<void> {
    if (!window.ethereum) {
      throw new WalletError('No Ethereum wallet found');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${network.chainId.toString(16)}`,
            chainName: network.name,
            nativeCurrency: network.nativeCurrency,
            rpcUrls: [network.rpcUrl],
            blockExplorerUrls: [network.blockExplorer]
          }
        ]
      });
    } catch (error) {
      throw new NetworkError(
        `Failed to add ${network.name} network`,
        { network, error }
      );
    }
  }
}
