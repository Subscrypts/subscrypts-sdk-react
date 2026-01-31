# Changelog

All notable changes to this project will be documented in this file.

## [1.5.1] - 2026-01-31

### Fixed
- **CRITICAL: Contract runner error preventing all read operations**
  - Fixed "contract runner does not support calling" error in all subscription hooks
  - **Root Cause**: Contract initialization used signer without ensuring provider support for read operations
  - **Impact**: All read hooks (`useSubscriptionStatus`, `useMySubscriptions`, `SubscriptionGuard`) failed in v1.5.0
  - **Symptoms**:
    - `useSubscriptionStatus` returned `{error: "contract runner does not support calling"}`
    - `useMySubscriptions` returned empty results
    - Pure ethers.js calls worked, but SDK hooks failed
  - **Fix**:
    - Updated hooks to use `contract.runner` instead of casting contract as runner
    - Updated `SubscryptsProvider` to initialize contracts with `provider || signer` (prioritizes provider)
    - Added provider dependency to contract initialization useEffect
  - **Changed Files**:
    - `src/context/SubscryptsProvider.tsx` - Initialize contracts with provider for read support
    - `src/hooks/subscriptions/useSubscriptionStatus.ts` - Use contract.runner for reads
    - `src/components/guards/SubscriptionGuard.tsx` - Use contract.runner for reads

### Technical Context

**What Went Wrong in v1.5.0**: When v1.5.0 removed ContractService, contract instances were initialized with `signer` only. Ethers.js v6 requires a provider that supports `call` operations for view functions. Signers without providers fail read operations with "contract runner does not support calling".

**v1.5.1 Fix**:
1. Hooks use `contract.runner` to get the actual runner (provider or signer with provider)
2. SubscryptsProvider initializes contracts with `provider || signer` to ensure provider is available
3. Provider added to useEffect dependencies for contract initialization

**Why This Works**: Provider is set before/with signer in all connection flows and supports all read operations.

## [1.5.0] - 2026-01-31

### Changed
- **BREAKING (Minor): Removed ContractService - Architectural Consolidation**
  - **Migration Path**: All ContractService usage has been migrated to use `methods.ts` directly
  - **Impact**: No public API changes - ContractService was internal, hooks and components work identically
  - **Why**: Eliminated architectural duplication that caused v1.4.4 data transformation bug
  - **Benefit**: Single source of truth for all contract calls, prevents future regressions
  - **Files Removed**:
    - `src/services/contract.service.ts` - Deleted entirely
    - `src/services/index.ts` - Removed ContractService export
  - **Files Modified**:
    - `src/hooks/subscriptions/useSubscribe.ts` - Now uses `createSubscriptionVerified()` and `paySubscriptionWithUsdcVerified()`
    - `src/hooks/subscriptions/useSubscriptionStatus.ts` - Now uses `getPlanSubscription()` and `getSubscription()` from methods.ts
    - `src/components/guards/SubscriptionGuard.tsx` - Now uses methods.ts functions directly
  - **Technical Details**: ContractService was a wrapper layer that duplicated logic from methods.ts. In v1.4.4, it bypassed `cleanSub()` helpers, causing React hooks to receive Proxy arrays instead of clean objects. Removing this layer enforces the single correct path: hooks → methods.ts → contract → cleanSub/cleanPlan → React state.

### Added
- **Verified Transaction Wrappers in methods.ts**
  - Added `createSubscriptionVerified()` - High-level wrapper for SUBS subscription creation with event parsing and fallback verification
  - Added `paySubscriptionWithUsdcVerified()` - High-level wrapper for USDC subscription creation with verification
  - **Why**: Extract verification logic from ContractService before removal, maintain reliability
  - **Features**:
    - Captures subscription state before transaction
    - Parses transaction events to extract subscriptionId
    - Falls back to state verification if event parsing fails (common for multi-contract USDC transactions)
    - Returns structured result with guaranteed subscriptionId
    - Throws clear errors if verification fails
  - **Usage**: Hooks now call these wrappers instead of raw contract methods

- **CLAUDE.md: Critical Development Patterns Section**
  - Documented 7 essential patterns learned from v1.4.x bugs and v1.5.0 refactoring
  - Pattern 1: Always use methods.ts for contract calls
  - Pattern 2: Always transform contract data with cleanSub() and cleanPlan()
  - Pattern 3: Use verified transaction wrappers for subscriptions
  - Pattern 4: Type conversions at boundaries
  - Pattern 5: Two-step pattern for subscription status (mandatory)
  - Pattern 6: ContractRunner vs Contract type casting
  - Pattern 7: Architectural lessons from v1.4.x → v1.5.0
  - Quick reference table with file locations
  - **Purpose**: Prevent regressions, enforce single source of truth

### Fixed
- **Type Conversion Bug in useSubscribe.ts**
  - Fixed `DEFAULTS.UNISWAP_FEE_TIER` type mismatch (number → bigint)
  - Changed: `feeTier: BigInt(DEFAULTS.UNISWAP_FEE_TIER)`

### Improved
- **Package Size Reduction**: Bundle reduced from 193.78 kB → 188.01 kB (3% smaller)
- **Architecture Simplification**: Single path for all contract calls
- **Enforced Data Transformation**: Can't bypass cleanSub/cleanPlan anymore

### Technical Context

**Why This Release Exists**: The v1.4.x series revealed a critical architectural flaw - two separate code paths for contract interaction (methods.ts and ContractService) led to inconsistent data transformation. In v1.4.4, ContractService bypassed `cleanSub()` helpers, returning raw Proxy arrays that broke when stored in React state. v1.5.0 removes ContractService entirely, enforcing a single correct path and preventing future duplication.

**Flow After v1.5.0**:
```
User → Hook → methods.ts → contract → cleanSub/cleanPlan → React state
```

**Benefits**:
1. Single Source of Truth: Only methods.ts touches contracts
2. Enforced Transformation: Can't bypass cleanSub/cleanPlan anymore
3. Simpler Codebase: One less abstraction layer
4. Better Maintainability: Changes only needed in one place
5. Smaller Bundle: 3% size reduction

**Migration for Integrators**: No migration needed! ContractService was internal. All public hooks and components work identically. If you were directly importing ContractService (not recommended), switch to methods.ts functions.

**Lessons Learned**:
- Architectural duplication is a bug waiting to happen
- Data transformation MUST be centralized and enforced
- Abstract only when necessary, not preemptively
- Simpler code is better code

## [1.4.4] - 2026-01-31

### Fixed
- **CRITICAL: SDK hooks returning incorrect subscription data**
  - Fixed data transformation bug in ContractService methods
  - **Root Cause**: ContractService was returning raw ethers.js Proxy arrays instead of clean JavaScript objects with named properties
  - **Impact**: `useSubscriptionStatus` returned `{isActive: false}` for valid subscriptions, `useMySubscriptions` showed 0 subscriptions
  - **Symptoms**: Direct contract queries worked, but React hooks failed to process data correctly
  - **Fix**: Export and use existing `cleanSub()` helper from methods.ts in ContractService
  - **Changed Files**:
    - [src/contract/methods.ts](src/contract/methods.ts) - Exported `cleanSub()` and `cleanPlan()` helper functions
    - [src/services/contract.service.ts](src/services/contract.service.ts) - Import and use cleanSub in `getPlanSubscription()` and `getSubscription()`
  - **Technical Details**: ethers.js returns struct data as Proxy objects with indexed properties. When these flow through React state, the Proxy behavior can be lost, causing property access to fail. The `cleanSub()` helper transforms Proxy arrays to proper JavaScript objects with named properties.

### Technical Context
This bug was introduced when ContractService was created without using the data transformation helpers that already existed in methods.ts. The `cleanSub()` helper has been used successfully by all methods.ts functions since the beginning, but ContractService bypassed it by calling the contract directly.

- **Why It Worked in methods.ts**: All view functions use `cleanSub()` to transform contract responses
- **Why It Failed in ContractService**: ContractService returned raw Proxy arrays without transformation
- **Why It Matters**: React hooks depend on stable object properties, Proxy behavior is not guaranteed across state updates

## [1.4.3] - 2026-01-31

### Fixed
- **ContractService.getPlanSubscription() null check** ([contract.service.ts:44-46](src/services/contract.service.ts#L44-L46))
  - Fixed misleading comment and logic for subscription existence check
  - Now correctly checks `subscription.id === 0n` instead of `nextPaymentDate === 0n`
  - Impact: LOW - dead code path, but improves code correctness and prevents future copy-paste errors
  - Contract behavior: `getPlanSubscription()` returns partial data with default values per smart contract design

### Added
- **Passive collection documentation** (README.md)
  - Documented automatic subscription renewal on SUBS transfers
  - Added gas estimation guidance: 20-30% buffer recommended for SUBS transfers
  - Explains why transfers may trigger unrelated subscription renewals
  - New "Gas Optimization & Passive Collection" section in README
  - Technical details: contract processes up to `subscriptionCollectPassiveMax` renewals per transfer

- **Plan change warnings** (methods.ts)
  - Added comprehensive JSDoc warning to `planChange()` about subscription disablement
  - Documented that changing plan amount/frequency disables isRecurring and resets remainingCycles for ALL existing subscriptions
  - Explained rationale: prevents subscribers from being charged unexpected amounts without consent
  - Provided workaround using `planChangeSubscriptionsBulk()` for non-destructive updates
  - Merchant integration guide for destructive vs non-destructive plan changes

- **Referral validation** (validators.ts, useSubscribe.ts)
  - Added `isValidReferral()` helper to validate referral addresses (src/utils/validators.ts)
  - Referral must be existing subscriber to same plan per smart contract design
  - `useSubscribe()` now logs warning if referral is invalid (contract silently ignores)
  - Updated documentation with referral requirements and validation examples
  - Client-side validation prevents user confusion about missing bonuses

### Documentation
- **Added gas optimization guidance to README.md**
  - Best practices for SUBS transfer gas estimation
  - Explanation of passive collection feature and why it exists
  - Variable gas cost documentation with code examples

- **Improved merchant integration guidance**
  - Plan change best practices and warnings
  - Referral validation patterns with examples
  - Gas estimation recommendations with buffer calculations

### Technical Details
This release focuses on documentation and validation improvements based on comprehensive smart contract compatibility analysis (2026-01-31). All changes trace back to specific contract behaviors.

**Compatibility Status**: SDK is contract-compatible and sound by design. This release documents behaviors that are correct but potentially unexpected for integrators.

## [1.4.2] - 2026-01-30

### Fixed
- **README.md documentation fixes** - Corrected invalid planId examples and added missing type documentation
  - **Issue**: README contained kebab-case string examples (`'premium-plan'`, `'basic-plan'`) that would fail at runtime due to `BigInt()` conversion errors
  - **Root Cause**: SDK uses string→bigint conversion at service layer, but validation only checks non-empty strings. Non-numeric strings pass validation but crash during conversion
  - **Fixed Examples**:
    - Line 72: `'plan-id'` → `'1'` (Headless Hooks API section)
    - Line 237: `'premium-plan'` → `'2'` (Subscribe Button section)
    - Line 351: `'premium-articles'` → `'1'` (Simple Paywall example)
    - Lines 512-529: `'basic-plan'`, `'premium-plan'`, `'enterprise-plan'` → `'1'`, `'2'`, `'3'` (Multi-Tier Pricing example)
    - Line 641: `'premium-plan'` → `'2'` (SubscryptsButton API reference)
    - Line 674: `'premium-plan'` → `'2'` (CheckoutWizard API reference)
    - Line 1054: `'premium-plan'` → `'2'` (useSubscribe hook example)
  - **Added Documentation**:
    - Plan struct definition in Types section with all 12 fields and inline comments
    - Subscription struct definition in Types section with all 12 fields and relationship explanation
    - planId format guidance explaining numeric strings requirement after "Where do I get planId?" section
    - Examples showing correct (`planId="1"`, `planId="42"`) vs incorrect (`planId="premium-plan"`) usage
  - **Impact**: All README examples now correctly demonstrate numeric string plan IDs, preventing developer confusion and runtime errors

## [1.4.1] - 2026-01-30

### Fixed
- **CRITICAL: Subscription verification bug** - Fixed incorrect subscription status checking in `useSubscriptionStatus` hook and `SubscriptionGuard` component
  - **Root Cause**: Hooks were only calling `getPlanSubscription()` which returns PARTIAL data (id, merchantAddress, planId, subscriberAddress only). All other fields including `nextPaymentDate` are returned as defaults (0, false).
  - **Impact**: Valid subscribers were being denied access because the hook used incomplete/default `nextPaymentDate` values instead of authoritative on-chain state
  - **Fix**: Implemented correct two-step verification pattern:
    1. Call `getPlanSubscription(planId, subscriber)` to get subscriptionId
    2. Call `getSubscription(subscriptionId)` to get FULL subscription data with real `nextPaymentDate`
  - **Changes**:
    - `useSubscriptionStatus` hook now calls both `getPlanSubscription()` and `getSubscription()` for accurate status checking
    - `SubscriptionGuard` multi-plan mode now implements the same two-step pattern
    - Added public `getSubscription(subscriptionId)` method to `ContractService` for accessing full subscription data
    - Fixed wrong `subscriptionId` assignment in status object (was using `planId` instead of `id`)
  - **Technical Details**: The smart contract's `getPlanSubscription()` is designed as a lookup/index resolver, not a full subscription reader. The `getSubscription()` call is required to retrieve the authoritative `nextPaymentDate`, `lastPaymentDate`, `isRecurring`, and `remainingCycles` fields that determine subscription status.

## [1.4.0] - 2026-01-28

### Added
- **Merchant Toolkit (F8)** - Everything a merchant needs to manage their subscription business:
  - `useMerchantPlans()` hook - Fetch all plans owned by connected wallet (merchant)
  - `useMerchantSubscribers(planId, pageSize?)` hook - Paginated subscribers list for a specific plan with active count
  - `useMerchantRevenue(planIds?)` hook - Calculate Monthly Recurring Revenue (MRR) from active subscriptions, normalized to monthly amounts, with USD conversion
  - `MerchantDashboard` component - Complete merchant overview with revenue metrics (MRR, active subscribers, total subscribers), plan list with subscriber counts, and subscriber details for selected plans
  - CSS styles for merchant dashboard, revenue cards, plan cards, subscriber lists, and metrics display

## [1.3.0] - 2026-01-28

### Added
- **Subscriber Dashboard (F3)** - Full subscription management UI for end users:
  - `useMySubscriptions(address?, pageSize?)` hook - Paginated subscriptions list with next/prev navigation
  - `SubscriptionCard` component - Display subscription with status badge (Active/Expired/Expiring Soon/Cancelled), amount, frequency, next payment date, auto-renewal status, remaining cycles, and manage button
  - `SubscriptionDashboard` component - Complete dashboard with grid layout, pagination, empty/loading/error states, and ManageSubscriptionModal integration
  - CSS styles for subscription cards, dashboard, pagination, and colored status badges
- **Event Subscriptions** - Real-time protocol event listeners for live updates:
  - `useSubscryptsEvents(callbacks)` hook - Subscribe to subscription creation, payment, and stop/cancel events
  - Uses ethers.js `contract.on()` under the hood with automatic cleanup on unmount
  - Enables live dashboard updates without a backend

## [1.2.0] - 2026-01-28

### Added
- **Fiat Price Display (F2)** - Show USD-equivalent prices using on-chain oracle:
  - `useSUBSPrice()` hook - Fetch current SUBS/USD price with auto-refresh (60s interval)
  - `usePlanPrice(planId)` hook - Comprehensive price info: SUBS amount, USDC equivalent (via Uniswap), USD value, frequency label
  - Handles both SUBS-denominated (currencyCode=0) and USD-denominated (currencyCode=1) plans
  - `formatFiatPrice()` utility - Format USD amounts with locale support
- **Plan Management (F7)** - Manage existing subscriptions:
  - `useManageSubscription(subscriptionId)` hook - Cancel, toggle auto-renewal, update cycles, change attributes
  - `ManageSubscriptionModal` component - Full management UI with subscription details
  - `ConfirmDialog` component - Reusable confirmation dialog with danger variant
  - CSS styles for manage modal, confirm dialog, and danger button
- **Merchant Plan Query** - Fetch plans filtered by merchant address:
  - `usePlansByMerchant(merchantAddress)` hook - Returns all plans created by a specific merchant
- **Decision Helpers** - Pure utility functions for subscription decisions:
  - `canAccess(subscription)` - Check if subscription grants active access
  - `isPaymentDue(subscription)` - Check if payment is past due
  - `shouldRenew(subscription)` - Check if subscription should be renewed (due + auto-renewing + cycles remaining)
  - `getSubscriptionHealth(subscription)` - Comprehensive health summary combining all checks

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
