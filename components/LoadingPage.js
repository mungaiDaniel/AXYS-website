// File: components/LoadingPage.js
'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const LoadingPage = () => {
  const [theme, setTheme] = useState(null);
  const [forceHide, setForceHide] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('aib-theme') || 'dark';
    setTheme(storedTheme);

    // CRITICAL: Hard timeout failsafe - never freeze in production
    // If loading takes more than 3 seconds, force hide the loader
    const failsafeTimeout = setTimeout(() => {
      console.warn('LoadingPage: 3s timeout reached, forcing hide');
      setForceHide(true);
    }, 3000);

    return () => clearTimeout(failsafeTimeout);
  }, []);

  // If failsafe triggered, don't render
  if (forceHide) {
    return null;
  }

  // Render immediately with a default while theme loads
  const logoSrc = theme === 'dark'
    ? '/axys-logo-dark.png'
    : '/axys-logo-light.png';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-[#0a0a0f]">
      <div className="relative w-32 h-32 md:w-40 md:h-40 animate-breathe">
        <Image
          src={logoSrc}
          alt="AXYS Investment Bank"
          fill
          className="object-contain"
          priority
          unoptimized
        />
      </div>
    </div>
  );
};
export default LoadingPage;
