// File: components/motion/ScrollProgress.js
'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { useMotion } from './MotionProvider';

/** Thin lavender → royal-blue bar at the top of the page showing scroll depth. */
export default function ScrollProgress({ className = '', style }) {
  const { reduced } = useMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className={`mx-progress ${className}`}
      style={{ ...style, scaleX: reduced ? scrollYProgress : smooth }}
      aria-hidden="true"
    />
  );
}
