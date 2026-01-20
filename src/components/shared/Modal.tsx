/**
 * Modal Component
 */

import { useEffect } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'subscrypts-max-w-md',
    md: 'subscrypts-max-w-lg',
    lg: 'subscrypts-max-w-2xl'
  };

  return (
    <div className="subscrypts-modal-overlay" onClick={onClose}>
      <div
        className={`subscrypts-modal-content ${sizeClasses[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="subscrypts-modal-header">
            <h2 className="subscrypts-modal-title">{title}</h2>
            <button
              onClick={onClose}
              className="subscrypts-modal-close"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        )}
        <div className="subscrypts-modal-body">{children}</div>
      </div>
    </div>
  );
}
