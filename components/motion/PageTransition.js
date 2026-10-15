// File: components/motion/PageTransition.js
'use client';

import { usePathname } from 'next/navigation';
import { useMotion } from './MotionProvider';

/**
 * Enter-only route transition: a short fade + slight rise, plus an optional
 * navy wipe (MOTION_FEATURES.pageWipe). It never delays navigation: the new
 * page is mounted immediately and the overlay ignores pointer events.
 * Intended for app/template.js. `replayKey` lets the demo re-trigger it.
 */
export default function PageTransition({ children, replayKey }) {
  const pathname = usePathname();
  const { features, reduced } = useMotion();
  const key = `${pathname}-${replayKey ?? ''}`;

  return (
    <>
      {features.pageWipe && !reduced && <div key={`wipe-${key}`} className="mx-wipe" aria-hidden="true" />}
      <div key={key} className="mx-page">
        {children}
      </div>
    </>
  );
}
