'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Hook for scroll-triggered fade-in animations
 * Elements fade in smoothly when they come into the viewport
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Intersection observer threshold (0-1)
 * @param {string} options.margin - Root margin for intersection observer
 * @param {string} options.animation - Animation type: 'fadeUp', 'fadeIn', 'slideRight'
 * @returns {Object} { ref, isVisible }
 */
export function useScrollFadeIn(options = {}) {
  const {
    threshold = 0.1,
    margin = '0px 0px -100px 0px',
    animation = 'fadeUp'
  } = options;

  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Unobserve after animation starts to save resources
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin: margin,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, margin]);

  return { ref, isVisible };
}

/**
 * Hook for staggered animations on multiple child elements
 * @param {Object} options - Configuration options
 * @param {number} options.staggerDelay - Delay between each element animation in ms
 * @returns {Object} { containerRef, visibleIndices }
 */
export function useStaggeredFadeIn(options = {}) {
  const {
    threshold = 0.1,
    margin = '0px 0px -100px 0px',
    staggerDelay = 100,
  } = options;

  const containerRef = useRef(null);
  const [visibleIndices, setVisibleIndices] = useState(new Set());

  useEffect(() => {
    const children = containerRef.current?.children || [];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(children).indexOf(entry.target);
            setVisibleIndices((prev) => new Set(prev).add(index));
          }
        });
      },
      {
        threshold,
        rootMargin: margin,
      }
    );

    Array.from(children).forEach((child) => {
      observer.observe(child);
    });

    return () => {
      Array.from(children).forEach((child) => {
        observer.unobserve(child);
      });
    };
  }, [staggerDelay]);

  return { containerRef, visibleIndices };
}
