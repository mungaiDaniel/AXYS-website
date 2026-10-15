// File: components/motion/Marquee.js
'use client';

import { usePauseOffscreen } from './useInView';

/**
 * Infinite horizontal strip (e.g. existing partner/platform logos).
 * Pauses on hover/focus and off-screen; wraps statically with reduced motion.
 * The duplicate copy is aria-hidden so content is announced once.
 */
export default function Marquee({ duration = 30, gap = '3rem', className = '', children }) {
  const ref = usePauseOffscreen();

  return (
    <div
      ref={ref}
      className={`mx-marquee ${className}`}
      style={{ '--mx-marquee-duration': `${duration}s`, '--mx-marquee-gap': gap }}
    >
      <div className="mx-marquee-track">
        <div className="mx-marquee-group">{children}</div>
        <div className="mx-marquee-group" aria-hidden="true" inert>
          {children}
        </div>
      </div>
    </div>
  );
}
