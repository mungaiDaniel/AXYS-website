'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { X } from 'lucide-react';

export default function GlassModal({ isOpen, onClose, originRef, children }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [origin, setOrigin] = useState('center center');

  // Calculate transform-origin from the trigger button's viewport position
  useEffect(() => {
    if (isOpen && originRef?.current) {
      const rect = originRef.current.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;
      setOrigin(`${btnCenterX}px ${btnCenterY}px`);
    }
  }, [isOpen, originRef]);

  // Sync visibility with isOpen
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
    }
  }, [isOpen]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  // Close handler with animation
  const handleClose = useCallback(() => {
    // Recalculate origin for closing (button may have scrolled)
    if (originRef?.current) {
      const rect = originRef.current.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;
      setOrigin(`${btnCenterX}px ${btnCenterY}px`);
    }

    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setIsVisible(false);
      onClose();
    }, 450);
  }, [onClose, originRef]);

  if (!isVisible) return null;

  return (
    /*
      The ENTIRE overlay (backdrop + card) scales from/to the button position.
      Since this div is `fixed inset-0` (covers the full viewport),
      the viewport-based button coordinates map 1:1 to this element's coordinate system.
    */
    <div
      className="fixed inset-0 z-[100]"
      style={{
        transformOrigin: origin,
        animation: isClosing
          ? 'modal-shrink 0.45s cubic-bezier(0.4, 0, 1, 1) forwards'
          : 'modal-expand 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
    >
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 glass-modal-backdrop"
        onClick={handleClose}
        aria-hidden="true"
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      />

      {/* Modal Card — centered on screen */}
      <div className="fixed inset-0 z-10 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-8 sm:p-10 border border-white/60 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.18)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] glass-modal-card"
          style={{
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            animation: isClosing
              ? 'modal-card-shrink 0.4s cubic-bezier(0.6, 0, 0.84, 0) forwards'
              : 'modal-card-expand 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          }}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-30 p-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Content */}
          <div 
            className="text-foreground relative z-20"
            style={{
              animation: isClosing 
                ? 'modal-content-fade-out 0.3s ease-out forwards'
                : 'modal-content-fade-in 0.6s ease-out 0.2s forwards',
              opacity: 0,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
