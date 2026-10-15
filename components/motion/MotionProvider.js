// File: components/motion/MotionProvider.js
'use client';

import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import {
  MOTION_ENABLED,
  MOTION_INTENSITY,
  MOTION_FEATURES,
  clamp01,
} from '@/lib/motion';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const MotionContext = createContext({
  enabled: MOTION_ENABLED,
  intensity: MOTION_INTENSITY,
  reduced: false,
  features: MOTION_FEATURES,
});

export const useMotion = () => useContext(MotionContext);

/**
 * Provides motion settings to every primitive and keeps <html> classes in sync.
 * Mounted once in components/ClientLayout.js. Defaults come from lib/motion.js;
 * props exist so settings can be overridden for testing.
 */
export default function MotionProvider({
  children,
  enabled = MOTION_ENABLED,
  intensity = MOTION_INTENSITY,
  reducedOverride = null, // true/false forces reduced motion; null follows the OS
  features: featureOverrides,
}) {
  const [systemReduced, setSystemReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setSystemReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const reduced = reducedOverride ?? systemReduced;
  const level = clamp01(intensity);

  useIsoLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.add('mx-js', 'mx-ready');
    root.classList.toggle('mx-off', !enabled);
    root.classList.toggle('mx-reduced', enabled && reduced);
    root.style.setProperty('--mx-intensity', String(level));
  }, [enabled, reduced, level]);

  useEffect(() => {
    const root = document.documentElement;
    return () => {
      root.classList.remove('mx-js', 'mx-ready', 'mx-off', 'mx-reduced', 'mx-failsafe');
      root.style.removeProperty('--mx-intensity');
    };
  }, []);

  // Smooth colour change when the existing theme toggle flips html.dark.
  useEffect(() => {
    const root = document.documentElement;
    let wasDark = root.classList.contains('dark');
    let timer;
    const observer = new MutationObserver(() => {
      const isDark = root.classList.contains('dark');
      if (isDark === wasDark) return;
      wasDark = isDark;
      root.classList.add('mx-theme-transition');
      clearTimeout(timer);
      timer = setTimeout(() => root.classList.remove('mx-theme-transition'), 450);
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => {
      observer.disconnect();
      clearTimeout(timer);
      root.classList.remove('mx-theme-transition');
    };
  }, []);

  const value = useMemo(
    () => ({
      enabled,
      intensity: enabled ? (reduced ? 0 : level) : 0,
      reduced: !enabled || reduced,
      features: { ...MOTION_FEATURES, ...featureOverrides },
    }),
    [enabled, reduced, level, featureOverrides]
  );

  return (
    <MotionContext.Provider value={value}>
      <MotionConfig reducedMotion={value.reduced ? 'always' : 'never'}>{children}</MotionConfig>
    </MotionContext.Provider>
  );
}
