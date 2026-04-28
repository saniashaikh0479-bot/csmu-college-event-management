import React, { useEffect, useRef } from 'react';
import Button from './Button';
import Card from './Card';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}) => {
  const dialogRef = useRef(null);
  const confirmButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Focus confirm button when dialog opens
      confirmButtonRef.current?.focus();
      
      // Trap focus within dialog
      const handleTab = (e) => {
        if (e.key === 'Tab') {
          const focusableElements = dialogRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) || [];
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];
          
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement?.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement?.focus();
            }
          }
        }
      };

      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleTab);
      document.addEventListener('keydown', handleEscape);
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('keydown', handleTab);
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-message"
    >
      <Card className="max-w-md w-full mx-4" ref={dialogRef}>
        <Card.Header>
          <h3 id="dialog-title" className="text-lg font-semibold text-gray-900">{title}</h3>
        </Card.Header>
        <Card.Body>
          <p id="dialog-message" className="text-gray-700 mb-6">{message}</p>
          <div className="flex justify-end space-x-4">
            <Button variant="secondary" onClick={onClose}>
              {cancelText}
            </Button>
            <Button 
              variant={variant} 
              onClick={onConfirm}
              ref={confirmButtonRef}
            >
              {confirmText}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ConfirmDialog;
