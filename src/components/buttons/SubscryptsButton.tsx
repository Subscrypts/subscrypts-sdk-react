/**
 * SubscryptsButton Component
 *
 * Simple subscribe button with built-in checkout modal
 */

import { useState } from 'react';
import { SubscryptsButtonProps } from '../../types';
import { useWallet } from '../../hooks/wallet/useWallet';
import { CheckoutWizard } from '../checkout/CheckoutWizard';

/**
 * Subscrypts Button Component
 *
 * @example
 * ```tsx
 * <SubscryptsButton
 *   planId="1"
 *   variant="primary"
 *   size="lg"
 *   onSuccess={(subId) => navigate('/dashboard')}
 * >
 *   Subscribe Now
 * </SubscryptsButton>
 * ```
 */
export function SubscryptsButton({
  planId,
  variant = 'primary',
  size = 'md',
  children,
  referralAddress,
  onSuccess
}: SubscryptsButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isConnected, connect } = useWallet();

  const handleClick = () => {
    if (!isConnected && connect) {
      connect();
    } else {
      setIsModalOpen(true);
    }
  };

  const handleSuccess = (subscriptionId: string) => {
    setIsModalOpen(false);
    if (onSuccess) {
      onSuccess(subscriptionId);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`subscrypts-btn subscrypts-btn-${variant} subscrypts-btn-${size}`}
      >
        {children || 'Subscribe'}
      </button>

      <CheckoutWizard
        planId={planId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        referralAddress={referralAddress}
        onSuccess={handleSuccess}
      />
    </>
  );
}
