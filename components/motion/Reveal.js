// File: components/motion/Reveal.js
'use client';

import { useInView } from './useInView';

/**
 * Fade + slide in once when scrolled into view.
 * variant: 'up' | 'left' | 'right' | 'scale' | 'blur' | 'fade'
 * Content stays visible if JS never runs (see styles/motion.css).
 */
export default function Reveal({
  as: Tag = 'div',
  variant = 'up',
  delay = 0,
  className = '',
  style,
  children,
  ...rest
}) {
  const [ref, inView] = useInView();

  return (
    <Tag
      ref={ref}
      data-reveal={variant}
      data-revealed={inView ? '' : undefined}
      className={className}
      style={delay ? { ...style, '--mx-delay': `${delay}ms` } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
