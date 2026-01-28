# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-01-27

### Added
- **Better Error Recovery (F6)** - Human-readable blockchain error messages with retry capabilities:
  - `ErrorDisplay` component - Context-aware error display with compact/full modes
  - `NetworkSwitchPrompt` component - One-click switch to Arbitrum when on wrong network
  - `SubscryptsErrorBoundary` component - React error boundary for SDK components
  - `getErrorMessage()` / `getErrorCode()` utilities - Map ethers.js v6 error codes to user-friendly messages
  - `ERROR_CODE_MAP` - Covers ACTION_REJECTED, INSUFFICIENT_FUNDS, CALL_EXCEPTION, NETWORK_ERROR, TIMEOUT, and more
  - `TransactionStep` checkout component now uses `ErrorDisplay` for better error UX
- **Subscription Status Resolver** - Pure function for normalizing subscription states:
  - `resolveSubscriptionStatus()` - Returns state (active/expired/expiring-soon/cancelled/not-found) with computed fields
  - Usable in React components, Node.js scripts, AI agents, and automation
- **Multi-Plan SubscriptionGuard** - Gate content by multiple subscription plans:
  - `planIds` prop - Check multiple plans at once
  - `requireAll` prop - Control any-of (default) vs all-of access logic
  - Full backward compatibility with existing `planId` prop
- **Wallet Connector Architecture (F1/F4)** - Pluggable wallet provider system:
  - `WalletConnector` interface - Implement to create custom connectors (Privy, WalletConnect, Web3Auth, etc.)
  - `InjectedConnector` - Built-in connector for MetaMask and browser wallets
  - `ExternalConnector` - Wraps externally-managed providers (Wagmi/RainbowKit)
  - `ConnectWalletModal` component - Lists available connectors with connection UI
  - `connectWith(connectorId)` - Connect with a specific connector programmatically
  - `connectors` and `activeConnector` exposed via `useWallet()` hook
  - Three usage patterns fully supported:
    1. `enableWalletManagement={true}` (unchanged - auto-creates InjectedConnector)
    2. `externalProvider={...}` (unchanged - auto-creates ExternalConnector)
    3. `connectors={[...]}` (new - explicit connector list)
- **Session Persistence (F5)** - Remember wallet connections across page reloads:
  - `persistSession` prop on `SubscryptsProvider` (default: true)
  - Auto-reconnects silently on page load (no popup) via `connector.reconnect()`
  - 7-day session expiry with stale detection
  - Clears session on explicit disconnect
  - `saveSession()`, `loadSession()`, `clearSession()`, `isSessionStale()` utilities

### Changed
- `SubscriptsProvider` refactored to support connector architecture while maintaining full backward compatibility
- `SubscryptsContextValue` extended with `connectors`, `activeConnector`, `connectWith`
- `UseWalletReturn` extended with `connectors`, `activeConnector`, `connectWith`
- `SubscriptionGuardProps.planId` is now optional (was required)
- Version bumped to 1.1.0

## [1.0.11] - 2025-01-27

### Added
- **Plan Hooks** - New React hooks for fetching subscription plans from smart contract:
  - `usePlan(planId)` - Fetch single plan with loading/error states
  - `usePlans(planIds)` - Fetch multiple plans in parallel
- **Pricing Components** - New UI components for displaying subscription plans:
  - `PlanCard` - Configurable plan display card with `showFields` prop for customization
  - `PricingTable` - Grid layout for multiple plans with built-in checkout integration
- **Wallet Event Callbacks** - New provider props for wallet state changes:
  - `onAccountChange(newAddress, oldAddress)` - Called when user switches wallet accounts
  - `onChainChange(newChainId, oldChainId)` - Called when user switches networks
- **Arbiscan Transaction Links** - Transaction hash links in checkout success step
- **Expanded ABI library** - Added 4 new Uniswap V3 contract ABIs for future DEX integration:
  - `dexFactoryABI` - Uniswap V3 Factory contract
  - `dexPairABI` - Uniswap V3 Pool contract
  - `dexRouterABI` - Uniswap V3 SwapRouter contract
  - `dexPositionManagerABI` - Uniswap V3 NonfungiblePositionManager contract
- Added `transferFrom` method to `dexUSDCABI` for ERC20 operations
- Centralized all 80+ Subscrypts smart contract methods in `src/contract/methods.ts`

### Changed
- **Standardized ABI exports** - Renamed exports to use camelCase naming convention:
  - `SubscryptsABI` → `subscryptsABI`
  - All new ABIs use camelCase (e.g., `dexQuoterABI`, `dexRouterABI`)
- Added `as const` assertion to all ABIs for better TypeScript type inference
- Backwards compatibility aliases maintained: `SUBSCRYPTS_ABI`, `ERC20_ABI`, `DEX_QUOTER_ABI`
- `CheckoutWizard` and `TransactionStep` now display Arbiscan link on success

### Removed
- Old ABI files replaced by new standardized versions:
  - `subscrypts.abi.ts` → `Subscrypts.ts`
  - `erc20.abi.ts` → `dexUSDCABI.ts`
  - `quoter.abi.ts` → `dexQuoterABI.ts`

## [1.0.10] - 2025-01-26

### Changed
- **Centralized contract files** - Reorganized smart contract interaction files into `src/contract/` directory
  - `src/contract/config.ts` - Network configuration, addresses, decimals (from `src/constants/blockchain.ts`)
  - `src/contract/methods.ts` - Contract method wrappers (from `src/contractMethods.ts`)
  - `src/contract/abis/` - Contract ABIs split into separate files:
    - `subscrypts.abi.ts` - Main Subscrypts Diamond contract ABI
    - `erc20.abi.ts` - Standard ERC20 token interface
    - `quoter.abi.ts` - Uniswap V3 QuoterV2 ABI
  - `src/contract/index.ts` - Barrel exports for all contract-related code
- Removed old scattered files: `src/constants/blockchain.ts`, `src/utils/subscryptsABI.ts`, `src/contractMethods.ts`
- Added `.claude/CLAUDE.md` with project instructions

## [1.0.9] - 2025-01-23

### Fixed
- **Missing `getSubscription` function in ABI** - Added the `getSubscription(uint256 subscriptionId)` function to the contract ABI
  - Root cause: v1.0.8's two-step lookup called `getSubscription()` but the function wasn't in the ABI
  - Error was: `TypeError: this.contract.getSubscription is not a function`
- **Fixed field name access** - Changed from `subscriptionId` to `id` (correct struct field name)
- **Fixed array index** - `nextPaymentDate` is at index 11, not index 10
- Added additional debug logging for `getPlanSubscription` result inspection

## [1.0.8] - 2025-01-23

### Fixed
- **Subscription state lookup bug** - Fixed critical bug where `getSubscriptionState()` and `verifySubscriptionPayment()` returned `nextPaymentDate: 0` even after successful transactions
  - Root cause: `getPlanSubscription()` doesn't return real `nextPaymentDate` values
  - Solution: Implemented two-step lookup - first get `subscriptionId` from `getPlanSubscription()`, then call `getSubscription(subscriptionId)` to get the actual `nextPaymentDate`
- Transactions that succeeded on-chain but showed "Transaction failed" error now correctly report success

## [1.0.7] - 2025-01-23

### Added
- **Configurable debug logging system** with three levels:
  - `silent`: No console output (production)
  - `info`: User-friendly transaction status and errors (default)
  - `debug`: Full developer debugging with all data
- New `debug` prop on `SubscryptsProvider` component
- Exported `logger` utility for consumer customization
- Comprehensive logging throughout:
  - SDK initialization with version
  - Wallet connection events
  - Transaction lifecycle (send, confirm, verify)
  - USDC quote calculations from Uniswap
  - PERMIT2 signature generation
  - Event parsing and fallback verification

### Usage
```tsx
<SubscryptsProvider debug="debug">
  <App />
</SubscryptsProvider>
```

## [1.0.6] - 2025-01-22

### Fixed
- Added before/after verification using `getPlanSubscription()` to confirm subscription state changes
- Fallback verification when event parsing fails for multi-contract transactions

## [1.0.5] - 2025-01-22

### Fixed
- Fixed USDC quoting using Uniswap QuoterV2 `quoteExactOutputSingle`
- Corrected parameter passing to `paySubscriptionWithUsdc` contract method
- Added 0.5% slippage buffer for price protection

## [1.0.4] - 2025-01-21

### Fixed
- PERMIT2 signature generation for USDC payments
- EIP-712 typed data signing with correct domain

## [1.0.0] - 2025-01-20

### Added
- Initial release of Subscrypts React SDK
- `SubscryptsProvider` for wallet and contract management
- `useSubscribe` hook for subscription payments
- Support for SUBS and USDC payment methods
- Internal and external wallet management modes
- TypeScript support with full type definitions
