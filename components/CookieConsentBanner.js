'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const CONSENT_KEY = 'aib-cookie-consent-v1';

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = window.localStorage.getItem(CONSENT_KEY);
      if (stored === 'accepted' || stored === 'declined') {
        return;
      }
    } catch {
      // Ignore storage errors and show banner
    }

    setIsVisible(true);
  }, []);

  const handleAccept = () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(CONSENT_KEY, 'accepted');
      }
    } catch {
      // Ignore storage errors
    }
    setIsVisible(false);
  };

  const handleDecline = () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(CONSENT_KEY, 'declined');
      }
    } catch {
      // Ignore storage errors
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4">
      <div className="max-w-5xl mx-auto rounded-lg bg-white/95 dark:bg-[#0a0a0f]/95 border border-gray-200/40 dark:border-white/15 shadow-lg p-4 md:flex md:items-center md:justify-between gap-4 text-sm">
        <p className="text-gray-700 dark:text-gray-300">
          We use cookies for secure admin login and basic preferences to improve your experience.
          You can choose to accept or decline these cookies. For more details, see our{' '}
          <Link href="/privacy" className="underline text-[#0017bf] dark:text-cyan-400">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="mt-3 md:mt-0 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleDecline}
            className="px-5 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:border-white/30 dark:text-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="px-5 py-2 rounded-lg bg-[#0017bf] dark:bg-[#00005b] text-white text-sm font-semibold hover:bg-[#0017bf]/90 dark:hover:bg-[#00005b]/90 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

