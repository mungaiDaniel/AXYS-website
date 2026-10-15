'use client';

import { useInView } from '@/components/motion';

// Legacy type names → motion-system reveal variants.
const VARIANTS = {
  fadeUp: 'up',
  slideUp: 'up',
  fadeOnly: 'fade',
  slideRight: 'left', // enters from the left, moving right
  slideLeft: 'right', // enters from the right, moving left
  scale: 'scale',
  blur: 'blur',
};

/**
 * ScrollReveal Component
 * Wraps content to add scroll-triggered fade-in animations.
 * Now powered by the motion system (lib/motion.js, styles/motion.css):
 * shared easing/durations, MOTION_INTENSITY, reduced-motion support, and
 * content stays visible if JavaScript fails.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to animate
 * @param {string} props.type - 'fadeUp' (default), 'fadeOnly', 'slideRight', 'slideLeft', 'scale', 'blur'
 * @param {number} props.threshold - Intersection observer threshold
 * @param {string} props.margin - Root margin for when animation triggers
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.delay - Animation delay (e.g. '100ms')
 */
export default function ScrollReveal({
  children,
  type = 'fadeUp',
  threshold = 0.1,
  margin = '0px 0px -100px 0px',
  className = '',
  delay = '0ms',
  tag = 'div',
  id,
}) {
  const [ref, inView] = useInView({ threshold, rootMargin: margin });
  const Tag = tag;

  return (
    <Tag
      ref={ref}
      id={id}
      data-reveal={VARIANTS[type] || 'up'}
      data-revealed={inView ? '' : undefined}
      className={className}
      style={{ '--mx-delay': delay }}
    >
      {children}
    </Tag>
  );
}
