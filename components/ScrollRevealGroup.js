'use client';

import React from 'react';
import { useInView } from '@/components/motion';

/**
 * ScrollRevealGroup Component
 * Applies staggered fade-in animations to child elements.
 * Each child is still wrapped in a <div> (as before) so existing grid/flex
 * layouts are unchanged; timing comes from the motion system.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child elements to animate
 * @param {number} props.staggerDelay - Delay between each child animation (in ms)
 * @param {number} props.threshold - Intersection observer threshold
 * @param {string} props.margin - Root margin for when animation triggers
 * @param {string} props.className - Additional CSS classes for the container
 * @param {string} props.tag - HTML tag to use (default: 'div')
 */
export default function ScrollRevealGroup({
  children,
  staggerDelay = 100,
  threshold = 0.1,
  margin = '0px 0px -100px 0px',
  className = '',
  tag = 'div'
}) {
  const [ref, inView] = useInView({ threshold, rootMargin: margin });
  const Tag = tag;

  return (
    <Tag
      ref={ref}
      data-stagger=""
      data-revealed={inView ? '' : undefined}
      className={className}
      style={{ '--mx-stagger': `${staggerDelay}ms` }}
    >
      {React.Children.toArray(children).map((child, index) => (
        <div key={index} style={{ '--mx-i': index }}>
          {child}
        </div>
      ))}
    </Tag>
  );
}
