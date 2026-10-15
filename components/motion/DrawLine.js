// File: components/motion/DrawLine.js
'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useMotion } from './MotionProvider';

/**
 * SVG line that draws itself as its container scrolls through the viewport.
 * Default is a vertical timeline line; pass `d` + `viewBox` for custom paths.
 * Decorative only (aria-hidden).
 */
export default function DrawLine({
  d = 'M1 0 V100',
  viewBox = '0 0 2 100',
  strokeWidth = 2,
  className = '',
}) {
  const ref = useRef(null);
  const { reduced } = useMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 55%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <svg
      ref={ref}
      className={`mx-drawline ${className}`}
      viewBox={viewBox}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path className="mx-drawline-track" d={d} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
      <motion.path
        d={d}
        strokeWidth={strokeWidth}
        vectorEffect="non-scaling-stroke"
        style={{ pathLength: reduced ? 1 : progress }}
      />
    </svg>
  );
}
