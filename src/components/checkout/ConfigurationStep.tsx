/**
 * Configuration Step Component
 */

import { PaymentMethod } from '../../types';
import { useTokenBalance } from '../../hooks/tokens/useTokenBalance';

interface ConfigurationStepProps {
  cycleLimit: number;
  onCycleLimitChange: (value: number) => void;
  autoRenew: boolean;
  onAutoRenewChange: (value: boolean) => void;
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (value: PaymentMethod) => void;
  onNext: () => void;
  onCancel: () => void;
}

export function ConfigurationStep({
  cycleLimit,
  onCycleLimitChange,
  autoRenew,
  onAutoRenewChange,
  paymentMethod,
  onPaymentMethodChange,
  onNext,
  onCancel
}: ConfigurationStepProps) {
  const { formatted: subsBalance } = useTokenBalance('SUBS');
  const { formatted: usdcBalance } = useTokenBalance('USDC');

  const cycleLimitOptions = [12, 24, 36];

  return (
    <div className="subscrypts-config-step">
      {/* Cycle Limit Selector */}
      <div className="subscrypts-form-group">
        <label className="subscrypts-label">Cycle Limit</label>
        <div className="subscrypts-cycle-options">
          {cycleLimitOptions.map((option) => (
            <button
              key={option}
              onClick={() => onCycleLimitChange(option)}
              className={`subscrypts-cycle-option ${
                cycleLimit === option ? 'subscrypts-cycle-option-active' : ''
              }`}
            >
              {option} cycles
            </button>
          ))}
        </div>
        <input
          type="number"
          value={cycleLimit}
          onChange={(e) => onCycleLimitChange(Number(e.target.value))}
          min={1}
          max={1000}
          className="subscrypts-input subscrypts-mt-2"
          placeholder="Custom cycles"
        />
      </div>

      {/* Auto-Renewal Toggle */}
      <div className="subscrypts-form-group">
        <label className="subscrypts-label subscrypts-flex subscrypts-items-center">
          <input
            type="checkbox"
            checked={autoRenew}
            onChange={(e) => onAutoRenewChange(e.target.checked)}
            className="subscrypts-checkbox"
          />
          <span className="subscrypts-ml-2">Enable Auto-Renewal</span>
        </label>
        <p className="subscrypts-text-sm subscrypts-text-secondary">
          Automatically renew subscription when it expires
        </p>
      </div>

      {/* Payment Method Selection */}
      <div className="subscrypts-form-group">
        <label className="subscrypts-label">Payment Method</label>
        <div className="subscrypts-payment-methods">
          <button
            onClick={() => onPaymentMethodChange('SUBS')}
            className={`subscrypts-payment-card ${
              paymentMethod === 'SUBS' ? 'subscrypts-payment-card-active' : ''
            }`}
          >
            <div className="subscrypts-payment-card-header">
              <span className="subscrypts-payment-card-title">Pay with SUBS</span>
            </div>
            <div className="subscrypts-payment-card-balance">
              Balance: {subsBalance} SUBS
            </div>
          </button>

          <button
            onClick={() => onPaymentMethodChange('USDC')}
            className={`subscrypts-payment-card ${
              paymentMethod === 'USDC' ? 'subscrypts-payment-card-active' : ''
            }`}
          >
            <div className="subscrypts-payment-card-header">
              <span className="subscrypts-payment-card-title">Pay with USDC</span>
              <span className="subscrypts-badge">Auto-Swap</span>
            </div>
            <div className="subscrypts-payment-card-balance">
              Balance: {usdcBalance} USDC
            </div>
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="subscrypts-form-actions">
        <button
          onClick={onCancel}
          className="subscrypts-btn subscrypts-btn-outline subscrypts-btn-md"
        >
          Cancel
        </button>
        <button
          onClick={onNext}
          className="subscrypts-btn subscrypts-btn-primary subscrypts-btn-md"
        >
          Next
        </button>
      </div>
    </div>
  );
}
