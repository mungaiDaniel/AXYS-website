// File: components/motion/Parallax.js
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MAGNITUDE, isSmallScreen } from '@/lib/motion';
import { useMotion } from './MotionProvider';

/**
 * Slow vertical depth movement while the element crosses the viewport.
 * speed: 1 = default depth, negative moves the opposite way.
 * Off for reduced motion; halved on small screens.
 */
export default function Parallax({ speed = 1, className = '', style, children, ...rest }) {
  const ref = useRef(null);
  const { intensity, reduced } = useMotion();
  const [small, setSmall] = useState(false);

  useEffect(() => setSmall(isSmallScreen()), []);

  const range = reduced ? 0 : 100 * MAGNITUDE.parallax * intensity * speed * (small ? 0.5 : 1) * 4;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [range, -range]);

  return (
    <motion.div ref={ref} className={className} style={{ ...style, y }} {...rest}>
      {children}
    </motion.div>
  );
}
