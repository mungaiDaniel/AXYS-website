// File: components/motion/Stagger.js
'use client';

import { useEffect } from 'react';
import { useInView } from './useInView';

/**
 * Reveals its direct children one after another. Does not wrap children in
 * extra elements, so existing grid/flex layouts are untouched.
 */
export default function Stagger({ as: Tag = 'div', className = '', children, ...rest }) {
  const [ref, inView] = useInView();

  // Give every direct child its index for the CSS transition delay.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    Array.from(el.children).forEach((child, i) => child.style.setProperty('--mx-i', String(i)));
  });

  return (
    <Tag
      ref={ref}
      data-stagger=""
      data-revealed={inView ? '' : undefined}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
}
