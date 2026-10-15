// File: components/motion/useInView.js
'use client';

import { useEffect, useRef, useState } from 'react';
import { VIEWPORT } from '@/lib/motion';
import { useMotion } from './MotionProvider';

/**
 * IntersectionObserver hook shared by every scroll-triggered primitive.
 * Returns [ref, inView]. With `once` (default) it stops observing after the
 * first hit. When motion is switched off it reports true immediately.
 */
export function useInView({
  threshold = VIEWPORT.threshold,
  rootMargin = VIEWPORT.rootMargin,
  once = VIEWPORT.once,
} = {}) {
  const ref = useRef(null);
  const { enabled } = useMotion();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!enabled || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        // Use the latest entry, but count any intersection in the batch so a
        // quick scroll past still reveals. Anything already scrolled past
        // (fast scroll, anchor jump) is revealed too, never left hidden above.
        const entry = entries[entries.length - 1];
        const hit = entries.some((e) => e.isIntersecting);
        const passed = entry.boundingClientRect.bottom < 0;
        if (hit || (once && passed)) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, threshold, rootMargin, once]);

  return [ref, inView];
}

/** Sets data-paused on the element while it is off-screen (pauses CSS loops). */
export function usePauseOffscreen() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.removeAttribute('data-paused');
      else el.setAttribute('data-paused', '');
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}
