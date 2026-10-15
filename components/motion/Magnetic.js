// File: components/motion/Magnetic.js
'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { MAGNITUDE, SPRING, isFinePointer } from '@/lib/motion';
import { useMotion } from './MotionProvider';

/**
 * Wrap a primary button/link so it subtly follows the cursor on desktop.
 * The wrapper is an inline-block span; the child keeps its own markup,
 * href and click handlers untouched.
 */
export default function Magnetic({ strength = 1, className = '', children }) {
  const { intensity, reduced, features } = useMotion();
  const [fine, setFine] = useState(false);
  const x = useSpring(useMotionValue(0), SPRING.pointer);
  const y = useSpring(useMotionValue(0), SPRING.pointer);

  useEffect(() => setFine(isFinePointer()), []);

  const active = fine && features.magnetic && !reduced && intensity > 0;
  const max = MAGNITUDE.magnetic * intensity * strength;

  const onMove = (e) => {
    if (!active) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    x.set(Math.max(-1, Math.min(1, dx)) * max);
    y.set(Math.max(-1, Math.min(1, dy)) * max * 0.6);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      className={`inline-block ${className}`}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  );
}
