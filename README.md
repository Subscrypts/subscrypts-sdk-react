# @subscrypts/react-sdk

<div align="center">

**Official React SDK for Subscrypts**

Decentralized subscription payments on Arbitrum - Built for developers of all skill levels

[![npm version](https://img.shields.io/npm/v/@subscrypts/react-sdk.svg)](https://www.npmjs.com/package/@subscrypts/react-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

[Documentation](#documentation) • [Quick Start](#quick-start-guide) • [Examples](#complete-examples) • [API Reference](#api-reference)

</div>

---

## 📖 Table of Contents

- [What is Subscrypts?](#-what-is-subscrypts)
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Quick Start Guide](#-quick-start-guide)
  - [1. Basic Setup (5 minutes)](#1-basic-setup-5-minutes)
  - [2. Protect Content with Subscriptions](#2-protect-content-with-subscriptions)
  - [3. Add a Subscribe Button](#3-add-a-subscribe-button)
- [Core Concepts](#-core-concepts)
- [Complete Examples](#-complete-examples)
- [API Reference](#-api-reference)
  - [Components](#components)
  - [Hooks](#hooks)
  - [Types](#types)
- [Advanced Usage](#-advanced-usage)
- [Styling & Customization](#-styling--customization)
- [Troubleshooting](#-troubleshooting)
- [FAQ](#-faq)
- [Support](#-support)

---

## 🚀 What is Subscrypts?

Subscrypts is a **decentralized subscription protocol** built on Arbitrum that enables Web3 applications to accept recurring payments in cryptocurrency. Think "Stripe for Web3" - but fully decentralized, with no intermediaries.

This React SDK makes it incredibly easy to:
- ✅ Add subscription-based access control to your app
- ✅ Accept payments in SUBS tokens or USDC
- ✅ Manage user subscriptions on the blockchain
- ✅ Build custom subscription UIs with headless hooks

**Perfect for:** Premium content sites, SaaS platforms, membership communities, paywalled APIs, and any application requiring recurring payments.

---

## ✨ Features

### 🎨 **Pre-built UI Components**
Drop-in React components that work out of the box - no blockchain expertise required.

```tsx
<SubscriptionGuard planId="123">
  <YourPremiumContent />
</SubscriptionGuard>
```

### 🎯 **Headless Hooks API**
Complete control over UI with powerful, composable hooks.

```tsx
const { status, isActive } = useSubscriptionStatus('1');
```

### 🔐 **Built-in Access Control**
Automatically protect routes and components based on subscription status.

### 💳 **Dual Payment Support**
Accept payments in both SUBS tokens (native) and USDC (with auto-swap).

### 🎭 **Three Wallet Modes**
- **Internal Mode**: Built-in wallet connection (MetaMask, browser wallets)
- **External Mode**: Integrate with existing Wagmi/RainbowKit setups
- **Connector Mode**: Pluggable wallet architecture for custom providers (Privy, Web3Auth, etc.)

### 🔄 **Session Persistence**
Wallet connections are remembered across page reloads - no popup on return visits.

### 🛡️ **Error Recovery**
Human-readable error messages with retry actions for blockchain errors.

### 📱 **Mobile Responsive**
All components work perfectly on desktop and mobile devices.

### 🌳 **Tree-Shakeable**
Import only what you need - optimized bundle sizes.

### 📘 **TypeScript First**
Full type safety with comprehensive TypeScript definitions.

---

## 📋 Prerequisites

Before you start, make sure you have:

1. **Node.js 16+** installed ([Download here](https://nodejs.org/))
2. **A React app** (React 18+ or React 19+)
3. **Basic understanding of React** (hooks, components, props)
4. **A MetaMask wallet** (for testing) ([Install here](https://metamask.io/))

**Don't have a React app yet?** Create one:

```bash
# Using Create React App
npx create-react-app my-subscription-app
cd my-subscription-app

# Or using Vite (recommended)
npm create vite@latest my-subscription-app -- --template react-ts
cd my-subscription-app
npm install
```

---

## 📦 Installation

### Step 1: Install the SDK

```bash
npm install @subscrypts/react-sdk ethers
```

**Why ethers?** It's the library we use to interact with the blockchain. Don't worry - you won't need to use it directly!

### Step 2: That's it!

You're ready to add subscriptions to your app. Let's go! 🎉

---

## 🎓 Quick Start Guide

### 1. Basic Setup (5 minutes)

First, wrap your app with the `SubscryptsProvider`. This gives all components access to wallet and subscription data.

**src/App.tsx** or **src/App.jsx**

```tsx
import { SubscryptsProvider } from '@subscrypts/react-sdk';
import '@subscrypts/react-sdk/styles'; // Import default styles

function App() {
  return (
    <SubscryptsProvider
      enableWalletManagement={true}
      defaultNetwork={42161} // Arbitrum One mainnet
    >
      <YourAppContent />
    </SubscryptsProvider>
  );
}

export default App;
```

**What did we just do?**
- `SubscryptsProvider`: Makes subscription features available throughout your app
- `enableWalletManagement={true}`: Enables built-in wallet connection (MetaMask, etc.)
- Import styles: Loads the pre-built CSS for all components

---

### 2. Protect Content with Subscriptions

Use `SubscriptionGuard` to protect any content. Only users with active subscriptions can see what's inside.

```tsx
import { SubscriptionGuard } from '@subscrypts/react-sdk';

function MyApp() {
  return (
    <div>
      <h1>Welcome to My Premium Site</h1>

      {/* Anyone can see this */}
      <p>This is free content everyone can see!</p>

      {/* Only subscribers can see this */}
      <SubscriptionGuard
        planId="1"
        fallbackUrl="/subscribe"
      >
        <div className="premium-content">
          <h2>Premium Content 🔒</h2>
          <p>This exclusive content is only visible to subscribers!</p>
          <video src="/premium-video.mp4" controls />
        </div>
      </SubscriptionGuard>
    </div>
  );
}
```

**What's happening here?**
- Users **without** a subscription see nothing (or get redirected to `/subscribe`)
- Users **with** an active subscription see the premium content
- The SDK automatically checks the blockchain for subscription status

**Where do I get `planId`?**
You'll receive the plan ID when you create a subscription plan on the Subscrypts contract. This is the unique identifier for your subscription plan on the blockchain.

**Important:** Plan IDs must be numeric strings representing the on-chain plan ID. The smart contract auto-increments plan IDs starting from 1. Use numeric strings like `"1"`, `"2"`, `"42"` - NOT descriptive names like `"premium-plan"`.

Examples:
- ✅ Correct: `planId="1"`, `planId="42"`
- ❌ Wrong: `planId="premium-plan"`, `planId="basic"`

---

### 3. Add a Subscribe Button

Let users subscribe with a single button click! The checkout flow is handled automatically.

```tsx
import { SubscryptsButton } from '@subscrypts/react-sdk';

function SubscribePage() {
  const handleSuccess = (subscriptionId) => {
    console.log('Subscribed! ID:', subscriptionId);
    // Redirect to premium content or show success message
    window.location.href = '/dashboard';
  };

  return (
    <div className="subscribe-page">
      <h1>Subscribe to Premium</h1>
      <p>Get access to exclusive content for only 10 SUBS/month!</p>

      <SubscryptsButton
        planId="2"
        variant="primary"
        size="lg"
        onSuccess={handleSuccess}
      >
        Subscribe Now - 10 SUBS/month
      </SubscryptsButton>
    </div>
  );
}
```

**What happens when users click the button?**
1. If wallet isn't connected → Connect wallet prompt appears
2. If wallet is connected → Checkout modal opens
3. User selects payment method (SUBS or USDC)
4. User chooses subscription duration (12, 24, 36 months, or custom)
5. User approves transactions in their wallet
6. `onSuccess` callback fires with the subscription ID
7. User now has access to premium content! 🎉

---

## 🧠 Core Concepts

### Merchants and Plans

- **Merchant**: Your business/project on Subscrypts (you!)
- **Plan**: A subscription tier you offer (e.g., "Basic", "Premium", "Enterprise")
- Each plan has a unique `planId` and cost in SUBS tokens

### Subscription Status

Subscriptions can be:
- **Active**: User has paid and can access content
- **Expired**: Subscription period ended
- **Auto-renewing**: Subscription automatically renews each cycle
- **Manual**: User must manually renew

### Payment Methods

1. **SUBS Tokens** (native):
   - Direct payment with SUBS tokens
   - Lower gas fees
   - Preferred method

2. **USDC** (with auto-swap):
   - Pay with USDC stablecoin
   - Automatically swapped to SUBS via Uniswap
   - Great for users who prefer stablecoins

### Wallet Modes

**Internal Mode** (Easiest):
```tsx
<SubscryptsProvider enableWalletManagement={true}>
```
SDK handles wallet connection for you using browser extensions (MetaMask, etc.)

**External Mode** (Wagmi/RainbowKit):
```tsx
<SubscryptsProvider
  enableWalletManagement={false}
  externalProvider={yourWagmiSigner}
>
```
Use when you already have wallet management (Wagmi, RainbowKit, etc.)

**Connector Mode** (Custom Providers):
```tsx
import { InjectedConnector } from '@subscrypts/react-sdk';

<SubscryptsProvider connectors={[new InjectedConnector(), myPrivyConnector]}>
```
Pluggable architecture - implement the `WalletConnector` interface for any provider.

---

## 📚 Complete Examples

### Example 1: Simple Paywall

Protect a single page or component:

```tsx
import { SubscriptionGuard, SubscryptsButton } from '@subscrypts/react-sdk';

function PremiumArticle() {
  return (
    <article>
      <h1>The Future of Web3 Subscriptions</h1>

      {/* Free preview */}
      <p>
        Decentralized subscriptions are revolutionizing how we think about
        recurring payments in Web3...
      </p>

      {/* Premium content */}
      <SubscriptionGuard
        planId="1"
        fallbackUrl="/subscribe"
      >
        <div className="premium-section">
          <h2>Deep Dive Analysis</h2>
          <p>
            [Full article content only visible to subscribers...]
          </p>
        </div>
      </SubscriptionGuard>

      {/* Subscribe CTA */}
      <div className="subscribe-cta">
        <h3>Want to read more?</h3>
        <SubscryptsButton planId="1">
          Subscribe for $5/month
        </SubscryptsButton>
      </div>
    </article>
  );
}
```

---

### Example 2: Subscription Status Badge

Show users their current subscription status:

```tsx
import { useSubscriptionStatus } from '@subscrypts/react-sdk';

function SubscriptionBadge() {
  const { status, isLoading } = useSubscriptionStatus('1');

  if (isLoading) {
    return <div>Checking subscription...</div>;
  }

  if (!status || !status.isActive) {
    return (
      <div className="badge free">
        <span>Free Tier</span>
        <a href="/subscribe">Upgrade to Premium</a>
      </div>
    );
  }

  return (
    <div className="badge premium">
      <span>✓ Premium Member</span>
      <p>
        {status.isAutoRenewing
          ? `Renews ${status.expirationDate.toLocaleDateString()}`
          : `Expires ${status.expirationDate.toLocaleDateString()}`
        }
      </p>
    </div>
  );
}
```

---

### Example 3: Custom Checkout Flow

Build your own checkout UI using hooks:

```tsx
import { useState } from 'react';
import { useSubscribe, useWallet, useTokenBalance } from '@subscrypts/react-sdk';

function CustomCheckout({ planId }) {
  const [cycles, setCycles] = useState(12);
  const [autoRenew, setAutoRenew] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('SUBS');

  const { isConnected, connect } = useWallet();
  const { subscribe, txState, error } = useSubscribe();
  const { formatted: subsBalance } = useTokenBalance('SUBS');
  const { formatted: usdcBalance } = useTokenBalance('USDC');

  const handleSubscribe = async () => {
    try {
      const subscriptionId = await subscribe({
        planId,
        cycleLimit: cycles,
        autoRenew,
        paymentMethod
      });

      alert(`Success! Subscription ID: ${subscriptionId}`);
    } catch (err) {
      console.error('Subscription failed:', err);
    }
  };

  if (!isConnected) {
    return <button onClick={connect}>Connect Wallet</button>;
  }

  return (
    <div className="custom-checkout">
      <h2>Subscribe to Premium</h2>

      {/* Duration selector */}
      <div>
        <label>Subscription Length:</label>
        <select value={cycles} onChange={(e) => setCycles(Number(e.target.value))}>
          <option value={12}>12 months</option>
          <option value={24}>24 months</option>
          <option value={36}>36 months</option>
        </select>
      </div>

      {/* Auto-renewal toggle */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={autoRenew}
            onChange={(e) => setAutoRenew(e.target.checked)}
          />
          Auto-renew subscription
        </label>
      </div>

      {/* Payment method */}
      <div>
        <label>Payment Method:</label>
        <div>
          <button
            onClick={() => setPaymentMethod('SUBS')}
            className={paymentMethod === 'SUBS' ? 'active' : ''}
          >
            SUBS (Balance: {subsBalance})
          </button>
          <button
            onClick={() => setPaymentMethod('USDC')}
            className={paymentMethod === 'USDC' ? 'active' : ''}
          >
            USDC (Balance: {usdcBalance})
          </button>
        </div>
      </div>

      {/* Subscribe button */}
      <button
        onClick={handleSubscribe}
        disabled={txState !== 'idle'}
      >
        {txState === 'idle' && 'Subscribe Now'}
        {txState === 'approving' && 'Approving...'}
        {txState === 'subscribing' && 'Processing...'}
        {txState === 'success' && 'Success!'}
      </button>

      {error && <div className="error">{error.message}</div>}
    </div>
  );
}
```

---

### Example 4: Multi-Tier Pricing

Offer multiple subscription tiers:

```tsx
import { SubscryptsButton } from '@subscrypts/react-sdk';

function PricingPage() {
  const plans = [
    {
      id: '1',
      name: 'Basic',
      price: '5 SUBS',
      features: ['Access to articles', 'Email support']
    },
    {
      id: '2',
      name: 'Premium',
      price: '10 SUBS',
      features: ['Everything in Basic', 'Video content', 'Priority support']
    },
    {
      id: '3',
      name: 'Enterprise',
      price: '20 SUBS',
      features: ['Everything in Premium', 'API access', 'Custom integrations']
    }
  ];

  return (
    <div className="pricing-grid">
      {plans.map((plan) => (
        <div key={plan.id} className="pricing-card">
          <h3>{plan.name}</h3>
          <div className="price">{plan.price}/month</div>
          <ul>
            {plan.features.map((feature) => (
              <li key={feature}>✓ {feature}</li>
            ))}
          </ul>
          <SubscryptsButton
            planId={plan.id}
            variant="primary"
            onSuccess={(id) => {
              console.log(`Subscribed to ${plan.name}:`, id);
              window.location.href = '/dashboard';
            }}
          >
            Choose {plan.name}
          </SubscryptsButton>
        </div>
      ))}
    </div>
  );
}
```

---

## 📖 API Reference

### Components

#### `<SubscryptsProvider>`

**Required wrapper** for all Subscrypts components and hooks.

```tsx
<SubscryptsProvider
  enableWalletManagement={true}
  defaultNetwork={42161}
  externalProvider={yourProvider} // Optional
>
  <YourApp />
</SubscryptsProvider>
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `enableWalletManagement` | `boolean` | No | `true` | Enable built-in wallet connection |
| `externalProvider` | `ExternalWalletConfig` | No | - | Use external wallet (Wagmi/RainbowKit) |
| `connectors` | `WalletConnector[]` | No | - | Custom wallet connectors (overrides enableWalletManagement) |
| `persistSession` | `boolean` | No | `true` | Remember wallet across page reloads |
| `onAccountChange` | `(newAddr, oldAddr) => void` | No | - | Callback when wallet account changes |
| `onChainChange` | `(newChainId, oldChainId) => void` | No | - | Callback when network changes |
| `debug` | `'silent' \| 'info' \| 'debug'` | No | `'info'` | Logging level |
| `children` | `ReactNode` | Yes | - | Your app components |

---

#### `<SubscriptionGuard>`

**Protect content** based on subscription status.

```tsx
// Single plan
<SubscriptionGuard planId="1" fallbackUrl="/subscribe">
  <PremiumContent />
</SubscriptionGuard>

// Multi-plan: any of these grants access
<SubscriptionGuard planIds={['1', '2', '3']}>
  <PremiumContent />
</SubscriptionGuard>

// Multi-plan: require ALL plans
<SubscriptionGuard planIds={['1', '2']} requireAll>
  <BundleContent />
</SubscriptionGuard>
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `planId` | `string` | No | - | Single plan ID to check |
| `planIds` | `string[]` | No | - | Multiple plan IDs to check |
| `requireAll` | `boolean` | No | `false` | Require ALL plans (true) or ANY plan (false) |
| `fallbackUrl` | `string` | No | - | Redirect URL when subscription is inactive |
| `loadingComponent` | `ReactNode` | No | - | Custom loading indicator |
| `onAccessDenied` | `() => void` | No | - | Callback when access is denied |
| `children` | `ReactNode` | Yes | - | Content to protect |

---

#### `<SubscryptsButton>`

**One-click subscribe button** with built-in checkout flow.

```tsx
<SubscryptsButton
  planId="2"
  variant="primary"
  size="lg"
  referralAddress="0x..."
  onSuccess={(id) => console.log('Subscribed:', id)}
  onError={(err) => console.error(err)}
>
  Subscribe Now
</SubscryptsButton>
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `planId` | `string` | Yes | - | The plan ID to subscribe to |
| `variant` | `'primary'` \| `'secondary'` \| `'outline'` | No | `'primary'` | Button style variant |
| `size` | `'sm'` \| `'md'` \| `'lg'` | No | `'md'` | Button size |
| `referralAddress` | `string` | No | - | Ethereum address for referral rewards |
| `onSuccess` | `(id: string) => void` | No | - | Callback when subscription succeeds |
| `onError` | `(error: Error) => void` | No | - | Callback when subscription fails |
| `children` | `ReactNode` | No | `'Subscribe'` | Button text |

---

#### `<CheckoutWizard>`

**Full checkout modal** with multi-step flow. Usually used via `SubscryptsButton`, but can be used standalone.

```tsx
const [isOpen, setIsOpen] = useState(false);

<CheckoutWizard
  planId="2"
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSuccess={(id) => alert('Success!')}
/>
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `planId` | `string` | Yes | The plan ID to subscribe to |
| `isOpen` | `boolean` | Yes | Modal open state |
| `onClose` | `() => void` | Yes | Close modal callback |
| `referralAddress` | `string` | No | Referral address |
| `onSuccess` | `(id: string) => void` | No | Success callback |
| `onError` | `(error: Error) => void` | No | Error callback |

---

#### `<PricingTable>`

**Display multiple subscription plans** in a responsive grid with built-in checkout.

```tsx
<PricingTable
  plans={[
    { planId: '1', title: 'Basic', subscribeLabel: 'Start Free' },
    { planId: '2', title: 'Pro', featured: true, subscribeLabel: 'Go Pro' },
    { planId: '3', title: 'Enterprise', subscribeLabel: 'Contact Us' }
  ]}
  currency="SUBS"
  showFields={['description', 'amount', 'frequency', 'subscribers']}
  columns={3}
/>
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `plans` | `(string \| PlanConfig)[]` | Yes | - | Array of plan IDs or configurations |
| `currency` | `'SUBS' \| 'USDC'` | No | `'SUBS'` | Currency for prices |
| `showFields` | `PlanField[]` | No | `['description', 'amount', 'frequency']` | Fields to display |
| `columns` | `1 \| 2 \| 3 \| 4` | No | auto | Grid columns |
| `onSubscribe` | `(planId: string) => void` | No | - | Custom subscribe handler |
| `referralAddress` | `string` | No | - | Referral for all subscriptions |

---

#### `<PlanCard>`

**Single plan display card** with configurable fields.

```tsx
<PlanCard
  plan={plan}
  currency="SUBS"
  showFields={['description', 'amount', 'frequency']}
  onSubscribe={(id) => openCheckout(id)}
  featured={true}
  title="Premium Plan"
/>
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `plan` | `Plan` | Yes | - | Plan data from smart contract |
| `currency` | `'SUBS' \| 'USDC'` | No | `'SUBS'` | Currency for price display |
| `showFields` | `PlanField[]` | No | `['description', 'amount', 'frequency']` | Fields to show |
| `onSubscribe` | `(planId: string) => void` | No | - | Subscribe click handler |
| `featured` | `boolean` | No | `false` | Highlight this plan |
| `title` | `string` | No | - | Custom title (overrides description) |

**Available `PlanField` values:** `'description'`, `'amount'`, `'frequency'`, `'subscribers'`, `'merchant'`, `'referralBonus'`, `'attributes'`

---

#### `<ErrorDisplay>`

**Human-readable error messages** for blockchain errors with retry support.

```tsx
import { ErrorDisplay } from '@subscrypts/react-sdk';

<ErrorDisplay
  error={transactionError}
  onRetry={() => retryTransaction()}
  onDismiss={() => clearError()}
/>

// Compact variant for inline use
<ErrorDisplay error={error} compact />
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `error` | `Error \| null` | Yes | - | Error to display (renders nothing if null) |
| `onRetry` | `() => void` | No | - | Retry callback (shows retry button if provided) |
| `onDismiss` | `() => void` | No | - | Dismiss callback (shows dismiss button if provided) |
| `compact` | `boolean` | No | `false` | Compact inline display |
| `className` | `string` | No | - | Additional CSS class |

---

#### `<NetworkSwitchPrompt>`

**Prompt users to switch** to Arbitrum One when on the wrong network.

```tsx
import { NetworkSwitchPrompt } from '@subscrypts/react-sdk';

<NetworkSwitchPrompt
  currentChainId={chainId}
  onSwitch={() => switchToArbitrum()}
/>
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `currentChainId` | `number \| null` | Yes | - | User's current chain ID |
| `onSwitch` | `() => void` | Yes | - | Callback to trigger network switch |
| `onDismiss` | `() => void` | No | - | Dismiss callback |
| `className` | `string` | No | - | Additional CSS class |

---

#### `<SubscryptsErrorBoundary>`

**Catch and display React errors** with reset capability.

```tsx
import { SubscryptsErrorBoundary } from '@subscrypts/react-sdk';

<SubscryptsErrorBoundary
  onError={(error) => logToService(error)}
  fallback={(error, reset) => (
    <div>
      <p>Something went wrong: {error.message}</p>
      <button onClick={reset}>Try Again</button>
    </div>
  )}
>
  <YourComponents />
</SubscryptsErrorBoundary>
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | Yes | - | Components to protect |
| `fallback` | `ReactNode \| (error, reset) => ReactNode` | No | Default error UI | Custom error display |
| `onError` | `(error: Error) => void` | No | - | Error logging callback |

---

#### `<ConnectWalletModal>`

**Wallet selection modal** that lists available connectors.

```tsx
import { ConnectWalletModal } from '@subscrypts/react-sdk';

<ConnectWalletModal
  isOpen={showWalletModal}
  onClose={() => setShowWalletModal(false)}
  connectors={connectors}
  onConnect={connectWith}
/>
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `isOpen` | `boolean` | Yes | - | Modal visibility |
| `onClose` | `() => void` | Yes | - | Close callback |
| `connectors` | `WalletConnector[]` | Yes | - | Available wallet connectors |
| `onConnect` | `(connectorId: string) => Promise<void>` | Yes | - | Connect handler |
| `className` | `string` | No | - | Additional CSS class |

---

#### `<ManageSubscriptionModal>`

**Manage an existing subscription** with cancel, auto-renewal toggle, and cycle updates.

```tsx
import { ManageSubscriptionModal } from '@subscrypts/react-sdk';

<ManageSubscriptionModal
  isOpen={showManage}
  onClose={() => setShowManage(false)}
  subscriptionId="42"
  subscription={subscriptionData}
  onCancelled={() => refetchSubscriptions()}
  onUpdated={() => refetchSubscriptions()}
/>
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `isOpen` | `boolean` | Yes | - | Modal visibility |
| `onClose` | `() => void` | Yes | - | Close callback |
| `subscriptionId` | `string` | Yes | - | Subscription ID to manage |
| `subscription` | `Subscription` | No | - | Pre-loaded subscription data |
| `onCancelled` | `() => void` | No | - | Called after successful cancellation |
| `onUpdated` | `() => void` | No | - | Called after successful update |

---

#### `<ConfirmDialog>`

**Reusable confirmation dialog** for destructive or important actions.

```tsx
import { ConfirmDialog } from '@subscrypts/react-sdk';

<ConfirmDialog
  isOpen={showConfirm}
  title="Cancel Subscription?"
  message="Your subscription will remain active until the end of the current period."
  variant="danger"
  confirmLabel="Cancel Subscription"
  onConfirm={handleCancel}
  onCancel={() => setShowConfirm(false)}
/>
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `isOpen` | `boolean` | Yes | - | Dialog visibility |
| `title` | `string` | Yes | - | Dialog title |
| `message` | `string` | Yes | - | Dialog message |
| `confirmLabel` | `string` | No | `'Confirm'` | Confirm button text |
| `cancelLabel` | `string` | No | `'Cancel'` | Cancel button text |
| `variant` | `'danger' \| 'default'` | No | `'default'` | Visual variant (danger = red button) |
| `onConfirm` | `() => void` | Yes | - | Confirm callback |
| `onCancel` | `() => void` | Yes | - | Cancel callback |

---

#### `<SubscriptionCard>`

**Display subscription details** with status badge and manage button.

```tsx
import { SubscriptionCard } from '@subscrypts/react-sdk';

<SubscriptionCard
  subscription={subscription}
  showManageButton={true}
  onCancelled={() => refetchSubscriptions()}
/>
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `subscription` | `Subscription` | Yes | - | Subscription to display |
| `showManageButton` | `boolean` | No | `true` | Show manage button |
| `showFiatPrice` | `boolean` | No | `false` | Show fiat price |
| `onManage` | `(id: string) => void` | No | - | Custom manage handler |
| `onCancelled` | `() => void` | No | - | Called after cancellation |
| `onUpdated` | `() => void` | No | - | Called after update |
| `className` | `string` | No | - | Additional CSS class |

---

#### `<SubscriptionDashboard>`

**Complete subscription management dashboard** with pagination.

```tsx
import { SubscriptionDashboard } from '@subscrypts/react-sdk';

<SubscriptionDashboard
  pageSize={10}
  showFiatPrices={true}
  onSubscriptionCancelled={(id) => console.log('Cancelled:', id)}
/>
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `address` | `string` | No | Connected wallet | Address to fetch subscriptions for |
| `pageSize` | `number` | No | `10` | Subscriptions per page |
| `showFiatPrices` | `boolean` | No | `false` | Show fiat prices on cards |
| `emptyComponent` | `React.ReactNode` | No | Default message | Custom empty state |
| `loadingComponent` | `React.ReactNode` | No | Spinner | Custom loading state |
| `className` | `string` | No | - | Additional CSS class |
| `onSubscriptionCancelled` | `(id: string) => void` | No | - | Called after cancellation |
| `onSubscriptionUpdated` | `(id: string) => void` | No | - | Called after update |

---

#### `<MerchantDashboard>`

**Complete merchant dashboard** with revenue, plans, and subscribers.

```tsx
import { MerchantDashboard } from '@subscrypts/react-sdk';

<MerchantDashboard />
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `merchantAddress` | `string` | No | Connected wallet | Merchant address |
| `className` | `string` | No | - | Additional CSS class |

**Features:**
- Revenue overview card (MRR in SUBS/USD, active vs total subscribers)
- Grid of merchant's plans with subscriber counts
- Click plan to view subscriber details
- Empty state for new merchants

---

### Hooks

#### `useSubscriptionStatus`

**Check if user has an active subscription.** This is your primary access control hook.

```tsx
const { status, isLoading, error, refetch } = useSubscriptionStatus(
  '1',      // Plan ID
  '0x...'   // Optional: check different address
);

if (status?.isActive) {
  // User has active subscription
}
```

**Returns:**

```typescript
{
  status: {
    isActive: boolean;              // Whether subscription is active
    expirationDate: Date | null;    // When subscription expires
    isAutoRenewing: boolean;        // Auto-renewal enabled
    remainingCycles: number;        // Cycles remaining
    subscriptionId: string | null;  // Blockchain subscription ID
  } | null;
  isLoading: boolean;               // Loading state
  error: Error | null;              // Error if any
  refetch: () => Promise<void>;     // Manually refresh status
}
```

---

#### `useSubscribe`

**Execute subscription transactions.** Creates new subscriptions with SUBS or USDC.

```tsx
const { subscribe, isSubscribing, txState, error, subscriptionId } = useSubscribe();

const handleSubscribe = async () => {
  const subId = await subscribe({
    planId: '2',
    cycleLimit: 12,
    autoRenew: true,
    paymentMethod: 'SUBS'
  });

  console.log('Subscription ID:', subId);
};
```

**Returns:**

```typescript
{
  subscribe: (params: SubscribeParams) => Promise<string>;
  isSubscribing: boolean;           // Transaction in progress
  txState: 'idle' | 'approving' | 'subscribing' | 'success' | 'error';
  error: Error | null;              // Error if any
  txHash: string | null;            // Transaction hash
  subscriptionId: string | null;    // Created subscription ID
}
```

**Subscribe Params:**

```typescript
{
  planId: string;                   // Plan to subscribe to
  cycleLimit: number;               // Number of payment cycles
  autoRenew: boolean;               // Enable auto-renewal
  paymentMethod: 'SUBS' | 'USDC';   // Payment token
  referralAddress?: string;         // Optional referral
}
```

---

#### `useWallet`

**Access wallet connection state, actions, and connector information.**

```tsx
const {
  isConnected,
  address,
  chainId,
  connect,
  disconnect,
  connectors,
  activeConnector,
  connectWith
} = useWallet();

if (!isConnected) {
  return <button onClick={connect}>Connect Wallet</button>;
}
```

**Returns:**

```typescript
{
  isConnected: boolean;                      // Wallet connected
  address: string | null;                    // User's wallet address
  chainId: number | null;                    // Connected network ID
  connect?: () => Promise<void>;             // Connect wallet
  disconnect?: () => Promise<void>;          // Disconnect wallet
  switchNetwork: (chainId: number) => Promise<void>; // Switch network
  connectors: WalletConnector[];             // Available wallet connectors
  activeConnector: WalletConnector | null;   // Currently active connector
  connectWith: (connectorId: string) => Promise<void>; // Connect with specific connector
}
```

---

#### `useTokenBalance`

**Get SUBS or USDC balance** for connected wallet.

```tsx
const { balance, formatted, isLoading, refetch } = useTokenBalance('SUBS');

console.log(`Balance: ${formatted} SUBS`); // "Balance: 100.50 SUBS"
```

**Returns:**

```typescript
{
  balance: bigint | null;           // Raw balance (wei)
  formatted: string;                // Human-readable balance
  isLoading: boolean;               // Loading state
  refetch: () => Promise<void>;     // Refresh balance
}
```

---

#### `usePlan`

**Fetch a single plan** from the smart contract.

```tsx
const { plan, isLoading, error, refetch } = usePlan('1');

if (plan) {
  console.log(`Plan: ${plan.description}, Amount: ${plan.subscriptionAmount}`);
}
```

**Returns:**

```typescript
{
  plan: Plan | null;                // Plan data
  isLoading: boolean;               // Loading state
  error: Error | null;              // Error if any
  refetch: () => Promise<void>;     // Refresh plan
}
```

---

#### `usePlans`

**Fetch multiple plans** in parallel from the smart contract.

```tsx
const { plans, isLoading, error, refetch } = usePlans(['1', '2', '3']);

plans.forEach(plan => {
  console.log(plan.description);
});
```

**Returns:**

```typescript
{
  plans: Plan[];                    // Array of plans
  isLoading: boolean;               // Loading state
  error: Error | null;              // Error if any
  refetch: () => Promise<void>;     // Refresh all plans
}
```

---

#### `useSUBSPrice`

**Fetch the current SUBS/USD price** from the on-chain oracle.

```tsx
const { priceUsd, isLoading, refetch } = useSUBSPrice();

if (priceUsd) {
  console.log(`1 SUBS = $${priceUsd.toFixed(4)}`);
}
```

**Returns:**

```typescript
{
  priceUsd: number | null;       // 1 SUBS = X USD
  rawPrice: bigint | null;       // Raw 18-decimal value
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

---

#### `usePlanPrice`

**Get comprehensive price info** for a plan (SUBS, USDC, USD).

```tsx
const { price, isLoading } = usePlanPrice('1');

if (price) {
  console.log(`${price.subsFormatted} SUBS / ${price.frequency}`);
  if (price.usdValue) console.log(`≈ ${formatFiatPrice(price.usdValue)}`);
}
```

**Returns:**

```typescript
{
  price: {
    subsAmount: bigint;           // Price in SUBS (18 decimals)
    subsFormatted: string;        // e.g. "10.5000"
    usdcAmount: bigint | null;    // USDC equivalent (6 decimals)
    usdcFormatted: string | null; // e.g. "5.25"
    usdValue: number | null;      // USD display value
    frequency: string;            // "Monthly", "Weekly", etc.
    isUsdDenominated: boolean;
  } | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

---

#### `useManageSubscription`

**Manage an existing subscription**: cancel, toggle auto-renewal, update cycles.

```tsx
const {
  cancelSubscription,
  toggleAutoRenew,
  updateCycles,
  isProcessing,
  txState
} = useManageSubscription('42');

// Cancel
await cancelSubscription();

// Toggle auto-renewal
await toggleAutoRenew(false);

// Set remaining cycles
await updateCycles(12);
```

**Returns:**

```typescript
{
  cancelSubscription: () => Promise<void>;
  toggleAutoRenew: (enabled: boolean) => Promise<void>;
  updateCycles: (cycles: number) => Promise<void>;
  updateAttributes: (attributes: string) => Promise<void>;
  txState: TransactionState;
  error: Error | null;
  isProcessing: boolean;
}
```

---

#### `usePlansByMerchant`

**Fetch all plans** created by a specific merchant address.

```tsx
const { plans, total, isLoading } = usePlansByMerchant('0x1234...');

plans.forEach(plan => {
  console.log(plan.description, plan.subscriberCount.toString());
});
```

**Returns:**

```typescript
{
  plans: Plan[];
  total: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

---

#### `useMySubscriptions`

**Fetch paginated subscriptions** for the connected wallet.

```tsx
const {
  subscriptions,
  page,
  hasMore,
  nextPage,
  prevPage,
  isLoading
} = useMySubscriptions();

return (
  <div>
    {subscriptions.map(sub => (
      <SubscriptionCard key={sub.id} subscription={sub} />
    ))}
    <button onClick={prevPage} disabled={page === 1}>Previous</button>
    <button onClick={nextPage} disabled={!hasMore}>Next</button>
  </div>
);
```

**Returns:**

```typescript
{
  subscriptions: Subscription[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  isLoading: boolean;
  error: Error | null;
  nextPage: () => void;
  prevPage: () => void;
  refetch: () => Promise<void>;
}
```

---

#### `useSubscryptsEvents`

**Subscribe to real-time protocol events** for live updates.

```tsx
useSubscryptsEvents({
  onSubscriptionCreated: (event) => {
    console.log('New subscription:', event.subscriptionId);
    refetchDashboard();
  },
  onSubscriptionPaid: (event) => {
    console.log('Payment made:', event.amount);
  },
  onSubscriptionStopped: (event) => {
    console.log('Subscription stopped:', event.subscriptionId);
  }
});
```

**Returns:**

```typescript
{
  isListening: boolean;
  error: Error | null;
}
```

---

#### `useMerchantPlans`

**Fetch all plans** owned by the connected wallet (merchant).

```tsx
const { plans, total, isLoading } = useMerchantPlans();

plans.forEach(plan => {
  console.log(`${plan.description}: ${plan.subscriberCount.toString()} subscribers`);
});
```

**Returns:** Same as `usePlansByMerchant` - wrapper using connected wallet address.

---

#### `useMerchantSubscribers`

**Fetch paginated subscribers** for a specific plan.

```tsx
const {
  subscribers,
  total,
  activeCount,
  page,
  hasMore,
  nextPage,
  prevPage,
  isLoading
} = useMerchantSubscribers('1');

console.log(`${activeCount} active out of ${total} subscribers`);
```

**Returns:**

```typescript
{
  subscribers: Subscription[];
  total: number;
  activeCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  isLoading: boolean;
  error: Error | null;
  nextPage: () => void;
  prevPage: () => void;
  refetch: () => Promise<void>;
}
```

---

#### `useMerchantRevenue`

**Calculate Monthly Recurring Revenue (MRR)** from active subscriptions.

```tsx
const { revenue, isLoading } = useMerchantRevenue();

if (revenue) {
  console.log(`MRR: ${revenue.mrrFormatted} SUBS`);
  console.log(`≈ $${revenue.mrrUsdEstimate?.toFixed(2)}`);
  console.log(`${revenue.activeSubscribers} / ${revenue.totalSubscribers} active`);
}
```

**Returns:**

```typescript
{
  revenue: {
    totalSubscribers: number;
    activeSubscribers: number;
    monthlyRecurringRevenue: bigint;
    mrrFormatted: string;
    mrrUsdEstimate: number | null;
  } | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

---

#### `useSubscrypts`

**Access full SDK context.** Advanced use cases only.

```tsx
const {
  wallet,
  signer,
  provider,
  subscryptsContract,
  subsTokenContract,
  usdcTokenContract,
  subsBalance,
  usdcBalance,
  refreshBalances,
  network
} = useSubscrypts();
```

---

### Types

#### `Plan`

The Plan type represents a subscription plan created by a merchant on the Subscrypts smart contract.

```typescript
interface Plan {
  id: bigint;                      // Plan ID (auto-incremented by contract)
  merchantAddress: string;          // Creator's wallet address
  currencyCode: bigint;             // 0 = SUBS, 1 = USD
  subscriptionAmount: bigint;       // Price (18 decimals for SUBS)
  paymentFrequency: bigint;         // Seconds between payments
  referralBonus: bigint;            // Referral reward amount
  commission: bigint;               // Protocol commission
  description: string;              // Plan name/description (bytes32)
  defaultAttributes: string;        // Default subscription attributes
  verificationExpiryDate: bigint;   // Expiry timestamp
  subscriberCount: bigint;          // Total subscriber count
  isActive: boolean;                // Whether plan accepts subscriptions
}
```

**Note:** When passing planId to components and hooks, use numeric strings (e.g., `"1"`, `"42"`). These are automatically converted to bigint for blockchain calls.

---

#### `Subscription`

The Subscription type represents an active or past subscription from a wallet to a specific plan. This is the **full subscription data** returned by `useMySubscriptions()`, `useMerchantSubscribers()`, and used by `SubscriptionCard`.

```typescript
interface Subscription {
  id: bigint;                      // Subscription ID (auto-incremented by contract)
  merchantAddress: string;          // Plan owner's wallet address
  planId: bigint;                   // Associated plan ID
  subscriberAddress: string;        // Subscriber's wallet address
  currencyCode: bigint;             // 0 = SUBS, 1 = USD
  subscriptionAmount: bigint;       // Subscription price (copied from plan)
  paymentFrequency: bigint;         // Payment interval in seconds
  isRecurring: boolean;             // Auto-renewal enabled
  remainingCycles: number;          // Cycles left before expiration
  customAttributes: string;         // Custom metadata (bytes32)
  lastPaymentDate: bigint;          // Timestamp of last payment
  nextPaymentDate: bigint;          // Timestamp when next payment is due
}
```

**Important:** `useSubscriptionStatus()` returns a simplified `SubscriptionStatus` object (see below) rather than the full `Subscription` struct. The `SubscriptionStatus` is derived from the full subscription data for easier access control decisions.

---

#### `SubscriptionStatus`

```typescript
interface SubscriptionStatus {
  isActive: boolean;
  expirationDate: Date | null;
  isAutoRenewing: boolean;
  remainingCycles: number;
  subscriptionId: string | null;
}
```

#### `PaymentMethod`

```typescript
type PaymentMethod = 'SUBS' | 'USDC';
```

#### `TransactionState`

```typescript
type TransactionState =
  | 'idle'
  | 'approving'
  | 'waiting_approval'
  | 'subscribing'
  | 'waiting_subscribe'
  | 'success'
  | 'error';
```

#### `PlanPriceInfo`

```typescript
interface PlanPriceInfo {
  subsAmount: bigint;           // Price in SUBS (18 decimals)
  subsFormatted: string;        // e.g. "10.5000"
  usdcAmount: bigint | null;    // USDC equivalent (6 decimals)
  usdcFormatted: string | null; // e.g. "5.25"
  usdValue: number | null;      // USD display value
  frequency: string;            // "Monthly", "Weekly", etc.
  isUsdDenominated: boolean;    // Whether plan is USD-denominated
}
```

#### `SubscriptionHealth`

```typescript
interface SubscriptionHealth {
  state: SubscriptionState;      // 'active' | 'expired' | 'expiring-soon' | ...
  isPaymentDue: boolean;
  shouldRenew: boolean;
  daysUntilExpiry: number | null;
  cyclesRemaining: number;
}
```

---

## 🔧 Advanced Usage

### Using with Wagmi / RainbowKit

If you already have wallet management with Wagmi:

```tsx
import { SubscryptsProvider } from '@subscrypts/react-sdk';
import { useWalletClient } from 'wagmi';

function App() {
  const { data: walletClient } = useWalletClient();

  return (
    <SubscryptsProvider
      enableWalletManagement={false}
      externalProvider={walletClient}
    >
      <YourApp />
    </SubscryptsProvider>
  );
}
```

---

### Referral Program Integration

Earn rewards by referring users:

```tsx
<SubscryptsButton
  planId="premium"
  referralAddress="0x1234..." // Your referral address
  onSuccess={(id) => console.log('Referral subscription:', id)}
>
  Subscribe with My Referral
</SubscryptsButton>
```

---

### Custom Transaction Handling

Monitor transaction states:

```tsx
const { subscribe, txState, txHash } = useSubscribe();

useEffect(() => {
  if (txState === 'approving') {
    console.log('User is approving token spend...');
  } else if (txState === 'subscribing') {
    console.log('Creating subscription...');
  } else if (txState === 'success') {
    console.log('Success! Transaction:', txHash);
  }
}, [txState, txHash]);
```

---

### Error Handling

**Option 1: Use `getErrorMessage` for user-friendly error strings:**

```tsx
import { getErrorMessage } from '@subscrypts/react-sdk';

try {
  await subscribe({ /* ... */ });
} catch (error) {
  const errorInfo = getErrorMessage(error);
  // errorInfo.title:      "Transaction Rejected"
  // errorInfo.message:    "You rejected the transaction in your wallet."
  // errorInfo.suggestion: "Please try again and confirm the transaction."
  // errorInfo.isRetryable: true
}
```

**Option 2: Use `ErrorDisplay` component for automatic error rendering:**

```tsx
import { ErrorDisplay } from '@subscrypts/react-sdk';

<ErrorDisplay error={txError} onRetry={retryTransaction} />
```

**Option 3: Catch specific error classes:**

```tsx
import {
  InsufficientBalanceError,
  NetworkError,
  TransactionError
} from '@subscrypts/react-sdk';

try {
  await subscribe({ /* ... */ });
} catch (error) {
  if (error instanceof InsufficientBalanceError) {
    alert('Insufficient balance! Please add funds.');
  } else if (error instanceof NetworkError) {
    alert('Wrong network! Please switch to Arbitrum.');
  } else if (error instanceof TransactionError) {
    alert('Transaction failed: ' + error.message);
  }
}
```

### Subscription Status Resolver

A pure function for normalizing subscription states. Works in React components, Node.js scripts, AI agents, and anywhere else:

```tsx
import { resolveSubscriptionStatus } from '@subscrypts/react-sdk';

const status = resolveSubscriptionStatus({ subscription });

console.log(status.state);          // 'active' | 'expired' | 'expiring-soon' | 'cancelled' | 'not-found'
console.log(status.isActive);       // true/false
console.log(status.daysUntilExpiry); // number | null

if (status.state === 'expiring-soon') {
  showRenewalReminder();
}
```

---

### Decision Helpers

Pure utility functions for subscription decisions. No blockchain calls - operate on existing data. Usable in React components, Node.js scripts, AI agents, cron jobs, and automation:

```tsx
import {
  canAccess,
  isPaymentDue,
  shouldRenew,
  getSubscriptionHealth
} from '@subscrypts/react-sdk';

// Check if subscription grants access
if (canAccess(subscription)) {
  showPremiumContent();
}

// Check if payment is past due
if (isPaymentDue(subscription)) {
  triggerPaymentCollection();
}

// Check if subscription should auto-renew (due + auto-renewing + cycles remaining)
if (shouldRenew(subscription)) {
  processRenewalPayment();
}

// Get comprehensive health summary
const health = getSubscriptionHealth(subscription);
console.log(health.state);           // 'active' | 'expired' | 'expiring-soon' | ...
console.log(health.isPaymentDue);    // false
console.log(health.shouldRenew);     // false
console.log(health.daysUntilExpiry); // 25
console.log(health.cyclesRemaining); // 11
```

---

## 🎨 Styling & Customization

### Using Default Styles

Import the pre-built stylesheet:

```tsx
import '@subscrypts/react-sdk/styles';
```

This includes styles for all components with the `subscrypts-` prefix to avoid conflicts.

---

### Customizing Colors

Override CSS variables in your own stylesheet:

```css
:root {
  /* Primary colors */
  --subscrypts-color-primary: #3B82F6;      /* Blue */
  --subscrypts-color-secondary: #10B981;    /* Green */
  --subscrypts-color-error: #EF4444;        /* Red */
  --subscrypts-color-success: #10B981;      /* Green */

  /* Background colors */
  --subscrypts-bg-primary: #FFFFFF;
  --subscrypts-bg-secondary: #F3F4F6;
  --subscrypts-bg-overlay: rgba(0, 0, 0, 0.5);

  /* Text colors */
  --subscrypts-text-primary: #1F2937;
  --subscrypts-text-secondary: #6B7280;
  --subscrypts-text-inverse: #FFFFFF;

  /* Borders and spacing */
  --subscrypts-border-radius: 0.5rem;
  --subscrypts-spacing-unit: 0.25rem;
}
```

---

### Custom Button Styles

Target specific component classes:

```css
/* Customize primary button */
.subscrypts-btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.subscrypts-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}
```

---

### Building Custom Components

Use hooks to build completely custom UIs:

```tsx
import { useSubscriptionStatus, useSubscribe } from '@subscrypts/react-sdk';

function MyCustomSubscriptionUI() {
  const { status } = useSubscriptionStatus('merchant', 'plan');
  const { subscribe } = useSubscribe();

  // Your custom UI with your own styles
  return (
    <div className="my-custom-design">
      {/* ... */}
    </div>
  );
}
```

---

## 🐛 Troubleshooting

### "Wallet not connected" error

**Problem:** Hooks return null or components don't work.

**Solution:** Make sure you've wrapped your app with `<SubscryptsProvider>`:

```tsx
// ✅ Correct
<SubscryptsProvider enableWalletManagement={true}>
  <App />
</SubscryptsProvider>

// ❌ Wrong - missing provider
<App />
```

---

### "Cannot read property 'isActive' of null"

**Problem:** Subscription status is null.

**Solution:** Always check loading state and handle null:

```tsx
const { status, isLoading } = useSubscriptionStatus('merchant', 'plan');

if (isLoading) return <div>Loading...</div>;
if (!status) return <div>No subscription found</div>;
if (status.isActive) return <div>Active!</div>;
```

---

### Styles not appearing

**Problem:** Components have no styling.

**Solution:** Import the stylesheet:

```tsx
import '@subscrypts/react-sdk/styles';
```

---

### "Wrong network" error

**Problem:** User is on wrong blockchain network.

**Solution:** SDK will auto-prompt to switch networks. Or manually check:

```tsx
const { chainId } = useWallet();

if (chainId !== 42161) {
  return <div>Please switch to Arbitrum One</div>;
}
```

---

### TypeScript errors

**Problem:** Type errors in your IDE.

**Solution:** Make sure you have `@types` installed:

```bash
npm install --save-dev @types/react @types/react-dom
```

And enable `esModuleInterop` in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "esModuleInterop": true
  }
}
```

---

## ❓ FAQ

### Q: Do I need to know blockchain development?

**A:** No! The SDK handles all blockchain interactions for you. If you know React, you can build with Subscrypts.

---

### Q: What tokens can users pay with?

**A:** Users can pay with:
- **SUBS tokens** (native Subscrypts token)
- **USDC** (automatically swapped to SUBS)

---

### Q: How much does it cost to use Subscrypts?

**A:** The SDK is free to use. You pay only blockchain gas fees (very low on Arbitrum - typically under $0.01) and Subscrypts protocol fees (small percentage of subscription revenue).

---

### Q: Can I use this with Next.js?

**A:** Yes! Subscrypts works with:
- Create React App
- Next.js (App Router and Pages Router)
- Vite
- Remix
- Any React framework

For Next.js, make sure to mark components as client-side:

```tsx
'use client'; // Add this at the top

import { SubscryptsButton } from '@subscrypts/react-sdk';
```

---

### Q: Can users pay with credit cards?

**A:** Not directly. Subscrypts is a blockchain-native protocol requiring cryptocurrency payments. However, users can buy crypto with credit cards through exchanges and then subscribe.

---

### Q: How do I get SUBS tokens?

**A:**
1. SUBS tokens are available on Arbitrum One
2. You can acquire SUBS through decentralized exchanges
3. Contact Subscrypts support for more information about acquiring SUBS tokens

---

### Q: Is this production-ready?

**A:** Yes! The SDK is fully tested and used in production applications on Arbitrum One. Make sure to:
- Test thoroughly before deploying
- Audit your smart contract integrations
- Have error handling in place
- Monitor your subscriptions

---

### Q: Can I customize the checkout flow?

**A:** Absolutely! You have three options:
1. Use `<SubscryptsButton>` with default checkout (easiest)
2. Use `<CheckoutWizard>` directly for more control
3. Use hooks (`useSubscribe`) to build completely custom UI

---

### Q: What happens if a subscription expires?

**A:**
- `useSubscriptionStatus` returns `isActive: false`
- `<SubscriptionGuard>` hides protected content
- User is redirected to `fallbackUrl` (if provided)
- No automatic charges (unless auto-renewal is enabled)

---

### Q: Can I offer free trials?

**A:** Yes! Create a plan with 0 cost for the first cycle, then normal cost for subsequent cycles. Configure this in your Subscrypts merchant dashboard.

---

### Q: How do refunds work?

**A:** Subscrypts is blockchain-based, so refunds must be handled manually by sending tokens back to users. We recommend having clear refund policies and managing them through customer support.

---

## 🆘 Support

### Documentation

- **Full Docs**: [docs.subscrypts.com](https://docs.subscrypts.com)
- **Video Tutorials**: [youtube.com/@subscrypts](https://youtube.com/@subscrypts)

### Community

- **Discord**: [discord.gg/subscrypts](https://discord.gg/subscrypts)
- **Twitter**: [@Subscrypts](https://twitter.com/subscrypts)
- **GitHub**: [github.com/subscrypts](https://github.com/subscrypts)

### Issues & Bug Reports

Found a bug? [Open an issue on GitHub](https://github.com/subscrypts/react-sdk/issues)

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with:
- [React](https://react.dev/)
- [Ethers.js](https://docs.ethers.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)

Powered by [Arbitrum](https://arbitrum.io/)

---

<div align="center">

**Made with ❤️ by the Subscrypts team**

[Website](https://subscrypts.com) • [Documentation](https://docs.subscrypts.com) • [Discord](https://discord.gg/subscrypts)

</div>
