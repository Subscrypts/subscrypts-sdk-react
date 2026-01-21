/**
 * Main Subscrypts Provider Component
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Contract, Signer } from 'ethers';
import { SubscryptsContext, SubscryptsContextValue } from './SubscryptsContext';
import { SubscryptsProviderProps, WalletState } from '../types';
import { WalletService } from '../services';
import {
  getNetworkConfig,
  getSubscryptsContractAddress,
  getSubsTokenAddress,
  getUsdcTokenAddress,
  DEFAULTS
} from '../constants';
import { SUBSCRYPTS_ABI } from '../utils/abi';
import { WalletError } from '../utils/errors';

/**
 * Subscrypts Provider Component
 *
 * @example
 * ```tsx
 * // Internal wallet management
 * <SubscryptsProvider enableWalletManagement={true}>
 *   <App />
 * </SubscryptsProvider>
 *
 * // External wallet (Wagmi)
 * <SubscryptsProvider
 *   enableWalletManagement={false}
 *   externalProvider={{ provider, signer, address }}
 * >
 *   <App />
 * </SubscryptsProvider>
 * ```
 */
export function SubscryptsProvider({
  children,
  enableWalletManagement = true,
  externalProvider,
  network: networkName = DEFAULTS.NETWORK,
  balanceRefreshInterval = DEFAULTS.BALANCE_REFRESH_INTERVAL
}: SubscryptsProviderProps) {
  const network = getNetworkConfig(networkName);

  // Wallet state
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
    error: null
  });

  // Provider and signer
  const [signer, setSigner] = useState<Signer | null>(null);
  const [provider, setProvider] = useState<any>(null);

  // Contracts
  const [subscryptsContract, setSubscryptsContract] = useState<Contract | null>(null);
  const [subsTokenContract, setSubsTokenContract] = useState<Contract | null>(null);
  const [usdcTokenContract, setUsdcTokenContract] = useState<Contract | null>(null);

  // Balances
  const [subsBalance, setSubsBalance] = useState<bigint | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<bigint | null>(null);

  // Services
  const walletService = useMemo(() => new WalletService(), []);

  /**
   * Initialize contracts when signer changes
   */
  useEffect(() => {
    if (!signer || !walletState.chainId) {
      setSubscryptsContract(null);
      setSubsTokenContract(null);
      setUsdcTokenContract(null);
      return;
    }

    try {
      const subscryptsAddress = getSubscryptsContractAddress(walletState.chainId);
      const subsAddress = getSubsTokenAddress(walletState.chainId);
      const usdcAddress = getUsdcTokenAddress(walletState.chainId);

      setSubscryptsContract(
        new Contract(subscryptsAddress, SUBSCRYPTS_ABI, signer)
      );

      setSubsTokenContract(
        new Contract(subsAddress, ['function balanceOf(address) view returns (uint256)', 'function allowance(address,address) view returns (uint256)', 'function approve(address,uint256) returns (bool)'], signer)
      );

      setUsdcTokenContract(
        new Contract(usdcAddress, ['function balanceOf(address) view returns (uint256)', 'function allowance(address,address) view returns (uint256)', 'function approve(address,uint256) returns (bool)'], signer)
      );
    } catch (error) {
      console.error('Failed to initialize contracts:', error);
    }
  }, [signer, walletState.chainId]);

  /**
   * Fetch token balances
   */
  const refreshBalances = useCallback(async () => {
    if (!walletState.address || !subsTokenContract || !usdcTokenContract) {
      return;
    }

    try {
      const [subs, usdc] = await Promise.all([
        subsTokenContract.balanceOf(walletState.address),
        usdcTokenContract.balanceOf(walletState.address)
      ]);

      setSubsBalance(subs);
      setUsdcBalance(usdc);
    } catch (error) {
      console.error('Failed to fetch balances:', error);
    }
  }, [walletState.address, subsTokenContract, usdcTokenContract]);

  /**
   * Balance refresh interval
   */
  useEffect(() => {
    if (!walletState.isConnected) {
      return;
    }

    refreshBalances();

    const interval = setInterval(refreshBalances, balanceRefreshInterval);

    return () => clearInterval(interval);
  }, [walletState.isConnected, refreshBalances, balanceRefreshInterval]);

  /**
   * Internal wallet connection handler
   */
  const connect = useCallback(async () => {
    if (!enableWalletManagement) {
      throw new WalletError('Internal wallet management is disabled');
    }

    setWalletState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const result = await walletService.connect();

      // Check if we're on the correct network
      if (result.chainId !== network.chainId) {
        await walletService.switchNetwork(network);
        // Refresh after network switch
        const refreshedResult = await walletService.connect();
        result.chainId = refreshedResult.chainId;
      }

      const providerSigner = await result.provider.getSigner();

      setProvider(result.provider);
      setSigner(providerSigner);
      setWalletState({
        address: result.address,
        chainId: result.chainId,
        isConnected: true,
        isConnecting: false,
        error: null
      });
    } catch (error) {
      setWalletState(prev => ({
        ...prev,
        isConnecting: false,
        error: error as Error
      }));
      throw error;
    }
  }, [enableWalletManagement, walletService, network]);

  /**
   * Disconnect wallet
   */
  const disconnect = useCallback(async () => {
    setSigner(null);
    setProvider(null);
    setWalletState({
      address: null,
      chainId: null,
      isConnected: false,
      isConnecting: false,
      error: null
    });
    setSubsBalance(null);
    setUsdcBalance(null);
  }, []);

  /**
   * Switch network
   */
  const switchNetwork = useCallback(
    async (chainId: number) => {
      if (chainId !== 42161) {
        throw new Error('Only Arbitrum One (chain ID 42161) is supported');
      }
      const targetNetwork = getNetworkConfig('arbitrum');

      await walletService.switchNetwork(targetNetwork);

      // Refresh wallet state
      if (enableWalletManagement) {
        await connect();
      }
    },
    [walletService, enableWalletManagement, connect]
  );

  /**
   * Setup external provider (Wagmi/RainbowKit)
   */
  useEffect(() => {
    if (!enableWalletManagement && externalProvider) {
      setProvider(externalProvider.provider);
      setSigner(externalProvider.signer);
      setWalletState({
        address: externalProvider.address,
        chainId: network.chainId,
        isConnected: true,
        isConnecting: false,
        error: null
      });
    }
  }, [enableWalletManagement, externalProvider, network.chainId]);

  /**
   * Listen to wallet events (only for internal wallet management)
   */
  useEffect(() => {
    if (!enableWalletManagement) {
      return;
    }

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      if (accounts.length === 0) {
        disconnect();
      } else if (accounts[0] !== walletState.address) {
        setWalletState(prev => ({ ...prev, address: accounts[0] }));
      }
    };

    const handleChainChanged = (...args: unknown[]) => {
      const chainIdHex = args[0] as string;
      const newChainId = parseInt(chainIdHex, 16);
      setWalletState(prev => ({ ...prev, chainId: newChainId }));

      // Auto-switch to correct network if wrong network
      if (newChainId !== network.chainId) {
        switchNetwork(network.chainId).catch(console.error);
      }
    };

    walletService.onAccountsChanged(handleAccountsChanged);
    walletService.onChainChanged(handleChainChanged);

    return () => {
      walletService.removeAccountsChangedListener(handleAccountsChanged);
      walletService.removeChainChangedListener(handleChainChanged);
    };
  }, [enableWalletManagement, walletService, disconnect, walletState.address, network.chainId, switchNetwork]);

  /**
   * Context value
   */
  const contextValue: SubscryptsContextValue = useMemo(
    () => ({
      wallet: walletState,
      signer,
      provider,
      network,
      switchNetwork,
      subscryptsContract,
      subsTokenContract,
      usdcTokenContract,
      subsBalance,
      usdcBalance,
      refreshBalances,
      ...(enableWalletManagement ? { connect, disconnect } : {})
    }),
    [
      walletState,
      signer,
      provider,
      network,
      switchNetwork,
      subscryptsContract,
      subsTokenContract,
      usdcTokenContract,
      subsBalance,
      usdcBalance,
      refreshBalances,
      enableWalletManagement,
      connect,
      disconnect
    ]
  );

  return (
    <SubscryptsContext.Provider value={contextValue}>
      {children}
    </SubscryptsContext.Provider>
  );
}
