/**
 * Main Subscrypts Provider Component
 *
 * Supports three usage patterns:
 * 1. enableWalletManagement=true (default) → auto-creates InjectedConnector
 * 2. externalProvider → auto-creates ExternalConnector
 * 3. connectors=[...] → uses provided connectors directly
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
import { SUBSCRYPTS_ABI } from '../contract';
import { WalletError } from '../utils/errors';
import { logger } from '../utils/logger';
import { VERSION } from '../index';
import { WalletConnector, ConnectorId } from '../wallet/types';
import { InjectedConnector } from '../wallet/InjectedConnector';
import { ExternalConnector } from '../wallet/ExternalConnector';
import { saveSession, loadSession, clearSession, isSessionStale } from '../wallet/sessionStore';

/**
 * Subscrypts Provider Component
 *
 * @example
 * ```tsx
 * // Pattern 1: Internal wallet management (unchanged)
 * <SubscryptsProvider enableWalletManagement={true}>
 *   <App />
 * </SubscryptsProvider>
 *
 * // Pattern 2: External wallet / Wagmi (unchanged)
 * <SubscryptsProvider
 *   enableWalletManagement={false}
 *   externalProvider={{ provider, signer, address }}
 * >
 *   <App />
 * </SubscryptsProvider>
 *
 * // Pattern 3: Connector-based (new)
 * <SubscryptsProvider connectors={[new InjectedConnector(), myPrivyConnector]}>
 *   <App />
 * </SubscryptsProvider>
 * ```
 */
export function SubscryptsProvider({
  children,
  enableWalletManagement = true,
  externalProvider,
  network: networkName = DEFAULTS.NETWORK,
  balanceRefreshInterval = DEFAULTS.BALANCE_REFRESH_INTERVAL,
  debug = 'info',
  onAccountChange,
  onChainChange,
  connectors: connectorsProp,
  persistSession: persistSessionProp = true
}: SubscryptsProviderProps) {
  const network = getNetworkConfig(networkName);

  // Configure logger on mount
  useEffect(() => {
    logger.configure({ level: debug });

    if (debug !== 'silent') {
      logger.info(`SDK v${VERSION} initialized`);
    }

    if (debug === 'debug') {
      logger.debug('Configuration:', {
        enableWalletManagement,
        network: networkName,
        balanceRefreshInterval,
        debugLevel: debug,
        hasConnectors: !!connectorsProp,
        persistSession: persistSessionProp
      });
    }
  }, [debug, enableWalletManagement, networkName, balanceRefreshInterval, connectorsProp, persistSessionProp]);

  // --- Determine connector mode ---
  // If connectors prop is provided, use it directly.
  // If enableWalletManagement=true (no connectors), auto-create InjectedConnector.
  // If externalProvider is set, auto-create ExternalConnector.
  const resolvedConnectors = useMemo<WalletConnector[]>(() => {
    if (connectorsProp) return connectorsProp;
    if (!enableWalletManagement && externalProvider) {
      return [new ExternalConnector(externalProvider, network.chainId)];
    }
    if (enableWalletManagement) {
      return [new InjectedConnector()];
    }
    return [];
  }, [connectorsProp, enableWalletManagement, externalProvider, network.chainId]);

  const useConnectorMode = !!connectorsProp;

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

  // Active connector
  const [activeConnector, setActiveConnector] = useState<WalletConnector | null>(null);

  // Legacy wallet service (for non-connector mode)
  const walletService = useMemo(() => new WalletService(), []);

  // Track whether session reconnect has been attempted
  const sessionReconnectAttempted = useRef(false);

  /**
   * Initialize contracts when signer or provider changes
   *
   * CRITICAL: Use provider for contract initialization to support read operations.
   * Ethers.js v6 requires a provider that supports 'call' operations for view functions.
   * For write operations, hooks will use signer by connecting it to the contract.
   */
  useEffect(() => {
    // Need either provider or signer with provider for reads
    const contractRunner = provider || signer;

    if (!contractRunner || !walletState.chainId) {
      setSubscryptsContract(null);
      setSubsTokenContract(null);
      setUsdcTokenContract(null);
      return;
    }

    try {
      const subscryptsAddress = getSubscryptsContractAddress(walletState.chainId);
      const subsAddress = getSubsTokenAddress(walletState.chainId);
      const usdcAddress = getUsdcTokenAddress(walletState.chainId);

      // Initialize with provider (or signer with provider) for read operations
      setSubscryptsContract(
        new Contract(subscryptsAddress, SUBSCRYPTS_ABI, contractRunner)
      );

      setSubsTokenContract(
        new Contract(subsAddress, ['function balanceOf(address) view returns (uint256)', 'function allowance(address,address) view returns (uint256)', 'function approve(address,uint256) returns (bool)'], contractRunner)
      );

      setUsdcTokenContract(
        new Contract(usdcAddress, ['function balanceOf(address) view returns (uint256)', 'function allowance(address,address) view returns (uint256)', 'function approve(address,uint256) returns (bool)'], contractRunner)
      );
    } catch (error) {
      console.error('Failed to initialize contracts:', error);
    }
  }, [provider, signer, walletState.chainId]);

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
   * Apply a ConnectResult to provider state
   */
  const applyConnectResult = useCallback((
    connector: WalletConnector,
    result: { provider: any; signer: Signer; address: string; chainId: number }
  ) => {
    setProvider(result.provider);
    setSigner(result.signer);
    setActiveConnector(connector);
    setWalletState({
      address: result.address,
      chainId: result.chainId,
      isConnected: true,
      isConnecting: false,
      error: null
    });

    if (persistSessionProp) {
      saveSession(connector.id, result.address);
    }

    logger.info(`Wallet connected via ${connector.name}: ${result.address.slice(0, 6)}...${result.address.slice(-4)}`);
    logger.debug('Wallet details:', { connector: connector.id, address: result.address, chainId: result.chainId });
  }, [persistSessionProp]);

  /**
   * Reset wallet state (shared disconnect logic)
   */
  const resetWalletState = useCallback(() => {
    setSigner(null);
    setProvider(null);
    setActiveConnector(null);
    setWalletState({
      address: null,
      chainId: null,
      isConnected: false,
      isConnecting: false,
      error: null
    });
    setSubsBalance(null);
    setUsdcBalance(null);
    clearSession();
  }, []);

  // ============================================================
  // Connector-based methods
  // ============================================================

  /**
   * Connect with a specific connector by ID
   */
  const connectWith = useCallback(async (connectorId: ConnectorId) => {
    const connector = resolvedConnectors.find(c => c.id === connectorId);
    if (!connector) {
      throw new WalletError(`Connector "${connectorId}" not found`);
    }

    if (!connector.isAvailable()) {
      throw new WalletError(`Connector "${connector.name}" is not available`);
    }

    setWalletState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const result = await connector.connect();

      // Auto-switch to Arbitrum if on wrong network
      if (result.chainId !== network.chainId && connector.switchNetwork) {
        await connector.switchNetwork(network.chainId);
        // Re-connect to get updated chain
        const refreshed = await connector.connect();
        applyConnectResult(connector, refreshed);
      } else {
        applyConnectResult(connector, result);
      }
    } catch (error) {
      logger.error(`Connection via ${connector.name} failed:`, error);
      setWalletState(prev => ({
        ...prev,
        isConnecting: false,
        error: error as Error
      }));
      throw error;
    }
  }, [resolvedConnectors, network.chainId, applyConnectResult]);

  // ============================================================
  // Legacy methods (backward compatibility)
  // ============================================================

  /**
   * Internal wallet connection handler (legacy)
   */
  const connect = useCallback(async () => {
    // If in connector mode, connect with first available connector
    if (useConnectorMode) {
      const available = resolvedConnectors.find(c => c.isAvailable());
      if (available) {
        await connectWith(available.id);
        return;
      }
      throw new WalletError('No available wallet connectors');
    }

    if (!enableWalletManagement) {
      throw new WalletError('Internal wallet management is disabled');
    }

    setWalletState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const result = await walletService.connect();

      // Check if we're on the correct network
      if (result.chainId !== network.chainId) {
        await walletService.switchNetwork(network);
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

      if (persistSessionProp) {
        saveSession('injected', result.address);
      }

      logger.info(`Wallet connected: ${result.address.slice(0, 6)}...${result.address.slice(-4)}`);
      logger.debug('Wallet details:', { address: result.address, chainId: result.chainId });
    } catch (error) {
      logger.error('Wallet connection failed:', error);
      setWalletState(prev => ({
        ...prev,
        isConnecting: false,
        error: error as Error
      }));
      throw error;
    }
  }, [useConnectorMode, resolvedConnectors, connectWith, enableWalletManagement, walletService, network, persistSessionProp]);

  /**
   * Disconnect wallet
   */
  const disconnect = useCallback(async () => {
    logger.info('Wallet disconnected');

    // Disconnect active connector if any
    if (activeConnector) {
      try {
        activeConnector.removeListeners?.();
        await activeConnector.disconnect();
      } catch {
        // Ignore disconnect errors
      }
    }

    resetWalletState();
  }, [activeConnector, resetWalletState]);

  /**
   * Switch network
   */
  const switchNetwork = useCallback(
    async (chainId: number) => {
      if (chainId !== 42161) {
        throw new Error('Only Arbitrum One (chain ID 42161) is supported');
      }

      // Try connector's switchNetwork first
      if (activeConnector?.switchNetwork) {
        await activeConnector.switchNetwork(chainId);
        // Reconnect to refresh state
        const result = await activeConnector.connect();
        applyConnectResult(activeConnector, result);
        return;
      }

      // Legacy fallback
      const targetNetwork = getNetworkConfig('arbitrum');
      await walletService.switchNetwork(targetNetwork);

      if (enableWalletManagement) {
        await connect();
      }
    },
    [activeConnector, applyConnectResult, walletService, enableWalletManagement, connect]
  );

  // ============================================================
  // Session persistence: auto-reconnect on mount
  // ============================================================

  useEffect(() => {
    if (sessionReconnectAttempted.current) return;
    sessionReconnectAttempted.current = true;

    if (!persistSessionProp) return;

    const session = loadSession();
    if (!session || isSessionStale(session)) {
      clearSession();
      return;
    }

    // Find the connector for this session
    const connector = resolvedConnectors.find(c => c.id === session.connectorId);
    if (!connector || !connector.isAvailable()) {
      clearSession();
      return;
    }

    // Silent reconnect (no popup)
    if (connector.reconnect) {
      connector.reconnect().then(result => {
        if (result) {
          applyConnectResult(connector, result);
          logger.debug('Session restored via', connector.name);
        } else {
          clearSession();
        }
      }).catch(() => {
        clearSession();
      });
    }
  }, [persistSessionProp, resolvedConnectors, applyConnectResult]);

  // ============================================================
  // Connector event listeners
  // ============================================================

  useEffect(() => {
    if (!activeConnector) return;

    // Listen to account changes via connector
    if (activeConnector.onAccountsChanged) {
      activeConnector.onAccountsChanged((accounts) => {
        if (accounts.length === 0) {
          disconnect();
        } else if (accounts[0] !== walletState.address) {
          const oldAddress = walletState.address;
          setWalletState(prev => ({ ...prev, address: accounts[0] }));

          if (persistSessionProp) {
            saveSession(activeConnector.id, accounts[0]);
          }

          if (onAccountChange && oldAddress) {
            onAccountChange(accounts[0], oldAddress);
          }
        }
      });
    }

    // Listen to chain changes via connector
    if (activeConnector.onChainChanged) {
      activeConnector.onChainChanged((newChainId) => {
        const oldChainId = walletState.chainId;
        setWalletState(prev => ({ ...prev, chainId: newChainId }));

        if (onChainChange && oldChainId) {
          onChainChange(newChainId, oldChainId);
        }

        if (newChainId !== network.chainId) {
          switchNetwork(network.chainId).catch(console.error);
        }
      });
    }

    return () => {
      activeConnector.removeListeners?.();
    };
  }, [activeConnector, disconnect, walletState.address, walletState.chainId, network.chainId, switchNetwork, onAccountChange, onChainChange, persistSessionProp]);

  // ============================================================
  // Legacy: external provider setup (non-connector mode)
  // ============================================================

  useEffect(() => {
    if (useConnectorMode) return;

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
  }, [useConnectorMode, enableWalletManagement, externalProvider, network.chainId]);

  // ============================================================
  // Legacy: wallet event listeners (non-connector mode)
  // ============================================================

  useEffect(() => {
    if (useConnectorMode || !enableWalletManagement || activeConnector) {
      return;
    }

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      if (accounts.length === 0) {
        disconnect();
      } else if (accounts[0] !== walletState.address) {
        const oldAddress = walletState.address;
        setWalletState(prev => ({ ...prev, address: accounts[0] }));
        if (onAccountChange && oldAddress) {
          onAccountChange(accounts[0], oldAddress);
        }
      }
    };

    const handleChainChanged = (...args: unknown[]) => {
      const chainIdHex = args[0] as string;
      const newChainId = parseInt(chainIdHex, 16);
      const oldChainId = walletState.chainId;
      setWalletState(prev => ({ ...prev, chainId: newChainId }));

      if (onChainChange && oldChainId) {
        onChainChange(newChainId, oldChainId);
      }

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
  }, [useConnectorMode, enableWalletManagement, activeConnector, walletService, disconnect, walletState.address, walletState.chainId, network.chainId, switchNetwork, onAccountChange, onChainChange]);

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
      connectors: resolvedConnectors,
      activeConnector,
      connectWith,
      ...(enableWalletManagement || useConnectorMode ? { connect, disconnect } : {})
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
      resolvedConnectors,
      activeConnector,
      connectWith,
      enableWalletManagement,
      useConnectorMode,
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
