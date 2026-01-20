/**
 * CheckoutWizard Component
 *
 * Multi-step subscription checkout flow
 */

import { useState } from 'react';
import { CheckoutWizardProps, PaymentMethod } from '../../types';
import { Modal } from '../shared/Modal';
import { ConfigurationStep } from './ConfigurationStep';
import { TransactionStep } from './TransactionStep';
import { useSubscribe } from '../../hooks/subscriptions/useSubscribe';

/**
 * Checkout Wizard Component
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <CheckoutWizard
 *   planId="1"
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onSuccess={(subId) => {
 *     console.log('Subscribed!', subId);
 *     setIsOpen(false);
 *   }}
 * />
 * ```
 */
export function CheckoutWizard({
  planId,
  isOpen,
  onClose,
  referralAddress,
  onSuccess,
  onError
}: CheckoutWizardProps) {
  const [currentStep, setCurrentStep] = useState<'configuration' | 'transaction' | 'success'>('configuration');

  // Configuration state
  const [cycleLimit, setCycleLimit] = useState(12);
  const [autoRenew, setAutoRenew] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('SUBS');

  const { subscribe, txState, error, subscriptionId } = useSubscribe();

  const handleConfigure = () => {
    setCurrentStep('transaction');
  };

  const handleSubscribe = async () => {
    try {
      const subId = await subscribe({
        planId,
        cycleLimit,
        autoRenew,
        paymentMethod,
        referralAddress
      });

      setCurrentStep('success');

      if (onSuccess) {
        onSuccess(subId);
      }
    } catch (err) {
      if (onError) {
        onError(err as Error);
      }
    }
  };

  const handleClose = () => {
    // Reset state when closing
    setCurrentStep('configuration');
    setCycleLimit(12);
    setAutoRenew(false);
    setPaymentMethod('SUBS');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Subscribe to Plan ${planId}`}
      size="md"
    >
      {currentStep === 'configuration' && (
        <ConfigurationStep
          cycleLimit={cycleLimit}
          onCycleLimitChange={setCycleLimit}
          autoRenew={autoRenew}
          onAutoRenewChange={setAutoRenew}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
          onNext={handleConfigure}
          onCancel={handleClose}
        />
      )}

      {currentStep === 'transaction' && (
        <TransactionStep
          paymentMethod={paymentMethod}
          txState={txState}
          error={error}
          subscriptionId={subscriptionId}
          onExecute={handleSubscribe}
          onClose={handleClose}
          onBack={() => setCurrentStep('configuration')}
        />
      )}

      {currentStep === 'success' && (
        <div className="subscrypts-checkout-success">
          <div className="subscrypts-success-icon">✓</div>
          <h3 className="subscrypts-success-title">Subscription Created!</h3>
          <p className="subscrypts-success-message">
            Your subscription has been successfully created.
          </p>
          {subscriptionId && (
            <p className="subscrypts-success-id">
              Subscription ID: {subscriptionId}
            </p>
          )}
          <button
            onClick={handleClose}
            className="subscrypts-btn subscrypts-btn-primary subscrypts-btn-md"
          >
            Close
          </button>
        </div>
      )}
    </Modal>
  );
}
