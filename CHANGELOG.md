# Changelog

All notable changes to this project will be documented in this file.

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
