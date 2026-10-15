// File: components/motion/PageHeader.js
'use client';

import { useInView } from './useInView';
import { AuroraBackground, WaveRibbon } from './effects';

/**
 * Compact animated page header. Drop-in replacement for the
 * <ScrollReveal className="text-center mb-16"> block that wraps each page's
 * existing <h1> + subtitle: children are rendered unchanged; the h1 gets a
 * blur-to-sharp line reveal (safe with .gradient-text), following elements
 * fade up in sequence, and a soft aurora + wave sits behind.
 */
export default function PageHeader({ as: Tag = 'div', className = '', children }) {
  const [ref, inView] = useInView({ threshold: 0 });

  return (
    <Tag
      ref={ref}
      data-mx-header=""
      data-revealed={inView ? '' : undefined}
      className={`relative isolate ${className}`}
    >
      <div className="mx-header-backdrop" aria-hidden="true">
        <AuroraBackground variant="header" />
        <WaveRibbon variant="header" className="bottom-0 opacity-40" />
      </div>
      {children}
    </Tag>
  );
}
