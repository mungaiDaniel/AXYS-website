// File: components/motion/TiltCard.js
'use client';

import { useEffect, useRef, useState } from 'react';
import { MAGNITUDE, isFinePointer } from '@/lib/motion';
import { useMotion } from './MotionProvider';

/**
 * Card that tilts in 3D toward the cursor with a soft moving highlight.
 * Desktop only; a plain card on touch devices and with reduced motion.
 * Combine with `mx-glass` for the standard glass look.
 */
export default function TiltCard({ as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useRef(null);
  const frame = useRef(0);
  const { intensity, reduced, features } = useMotion();
  const [fine, setFine] = useState(false);

  useEffect(() => setFine(isFinePointer()), []);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const active = fine && features.tilt && !reduced && intensity > 0;
  const max = MAGNITUDE.tilt * intensity;

  const onMove = (e) => {
    if (!active) return;
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty('--mx-ry', `${(px - 0.5) * 2 * max}deg`);
      el.style.setProperty('--mx-rx', `${(0.5 - py) * 2 * max}deg`);
      el.style.setProperty('--mx-mx', `${px * 100}%`);
      el.style.setProperty('--mx-my', `${py * 100}%`);
      el.setAttribute('data-active', '');
    });
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.setProperty('--mx-rx', '0deg');
    el.style.setProperty('--mx-ry', '0deg');
    el.removeAttribute('data-active');
  };

  return (
    <Tag
      ref={ref}
      className={`mx-tilt ${className}`}
      onPointerMove={onMove}
      onPointerLeave={reset}
      {...rest}
    >
      {children}
      <span className="mx-tilt-highlight" aria-hidden="true" />
    </Tag>
  );
}
