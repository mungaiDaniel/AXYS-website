'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { X, ArrowRight } from 'lucide-react';

export default function ServiceModal({ isOpen, onClose, service, originRef }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [origin, setOrigin] = useState('center center');

  useEffect(() => {
    if (isOpen && originRef?.current) {
      const rect = originRef.current.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;
      setOrigin(`${btnCenterX}px ${btnCenterY}px`);
    }
  }, [isOpen, originRef]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
    }
  }, [isOpen]);

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

  const handleClose = useCallback(() => {
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

  if (!isVisible || !service) return null;

  return (
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
            {/* Service Icon */}
            <div className="flex items-center justify-center mb-6">
              <div>
                <div className="w-12 h-12 text-brand-blue">
                  {service.icon}
                </div>
              </div>
            </div>

            {/* Service Title */}
            <h3 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-foreground">
              {service.title}
            </h3>

            {/* Divider */}
            <div className="w-16 h-1 bg-brand-blue rounded-full mx-auto mb-6"></div>

            {/* Service Description */}
            <div className="space-y-5 text-foreground leading-relaxed font-medium text-sm sm:text-base">
              <p>{service.description}</p>

              {service.details && (
                <div className="p-5 mt-6 bg-muted/50 dark:bg-muted/30 border border-border rounded-2xl shadow-sm">
                  <h4 className="font-bold text-brand-blue mb-3">Key Features:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {service.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-brand-blue mt-1">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <div className="mt-10 flex items-center justify-center">
              <Link href="/services">
                <button
                  onClick={handleClose}
                  className="group inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg bg-[#0017bf] dark:bg-[#00005b] text-white"
                >
                  <span>Explore Services</span>
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
