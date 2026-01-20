/**
 * Wallet service for managing wallet connections
 */

import { BrowserProvider, Eip1193Provider } from 'ethers';
import { WalletError, NetworkError } from '../utils/errors';
import { NetworkConfig } from '../types';

/**
 * Service class for wallet connection and management
 */
export class WalletService {
  private provider: BrowserProvider | null = null;

  /**
   * Connect to browser wallet (MetaMask, etc.)
   */
  async connect(): Promise<{
    provider: BrowserProvider;
    address: string;
    chainId: number;
  }> {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new WalletError(
        'No Ethereum wallet found. Please install MetaMask or another Web3 wallet.'
      );
    }

    try {
      const ethereumProvider = window.ethereum as Eip1193Provider;
      this.provider = new BrowserProvider(ethereumProvider);

      // Request account access
      const accounts = await this.provider.send('eth_requestAccounts', []);

      if (!accounts || accounts.length === 0) {
        throw new WalletError('No accounts found. Please unlock your wallet.');
      }

      const network = await this.provider.getNetwork();
      const chainId = Number(network.chainId);

      return {
        provider: this.provider,
        address: accounts[0],
        chainId
      };
    } catch (error) {
      if (error instanceof WalletError) {
        throw error;
      }
      throw new WalletError('Failed to connect wallet', { error });
    }
  }

  /**
   * Switch to a specific network
   */
  async switchNetwork(targetNetwork: NetworkConfig): Promise<void> {
    if (!window.ethereum) {
      throw new WalletError('No Ethereum wallet found');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetNetwork.chainId.toString(16)}` }]
      });
    } catch (error: any) {
      // If chain not added, try to add it
      if (error.code === 4902) {
        await this.addNetwork(targetNetwork);
      } else {
        throw new NetworkError(
          `Failed to switch to ${targetNetwork.name}`,
          { chainId: targetNetwork.chainId, error }
        );
      }
    }
  }

  /**
   * Add a network to the wallet
   */
  async addNetwork(network: NetworkConfig): Promise<void> {
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

  /**
   * Get current provider
   */
  getProvider(): BrowserProvider | null {
    return this.provider;
  }

  /**
   * Listen to account changes
   */
  onAccountsChanged(callback: (...args: unknown[]) => void): void {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', callback);
    }
  }

  /**
   * Listen to network changes
   */
  onChainChanged(callback: (...args: unknown[]) => void): void {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', callback);
    }
  }

  /**
   * Remove account change listener
   */
  removeAccountsChangedListener(callback: (...args: unknown[]) => void): void {
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', callback);
    }
  }

  /**
   * Remove network change listener
   */
  removeChainChangedListener(callback: (...args: unknown[]) => void): void {
    if (window.ethereum) {
      window.ethereum.removeListener('chainChanged', callback);
    }
  }
}
