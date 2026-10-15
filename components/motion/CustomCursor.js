// File: components/motion/CustomCursor.js
'use client';

import { useEffect, useRef, useState } from 'react';
import { isFinePointer } from '@/lib/motion';
import { useMotion } from './MotionProvider';

const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label, summary, [data-cursor]';

/**
 * Soft ring that trails the pointer and grows over interactive elements.
 * Desktop only; the native cursor stays visible. Off unless
 * MOTION_FEATURES.customCursor is true.
 */
export default function CustomCursor() {
  const ref = useRef(null);
  const { features, reduced } = useMotion();
  const [fine, setFine] = useState(false);

  useEffect(() => setFine(isFinePointer()), []);

  const active = fine && features.customCursor && !reduced;

  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    const target = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let frame = 0;

    const loop = () => {
      pos.x += (target.x - pos.x) * 0.22;
      pos.y += (target.y - pos.y) * 0.22;
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      frame = requestAnimationFrame(loop);
    };

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      el.style.opacity = '1';
      if (e.target.closest?.(INTERACTIVE)) el.setAttribute('data-hover', '');
      else el.removeAttribute('data-hover');
    };
    const onLeave = () => {
      el.style.opacity = '0';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [active]);

  if (!active) return null;
  return <div ref={ref} className="mx-cursor" style={{ opacity: 0 }} aria-hidden="true" />;
}
