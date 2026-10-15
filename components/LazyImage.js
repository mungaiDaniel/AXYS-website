'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

/**
 * LazyImage Component
 * Implements lazy loading with Intersection Observer
 * Falls back to Next.js Image with loading="lazy" for better performance
 */
export default function LazyImage({ src, alt, className, width, height, priority = false, ...props }) {
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [priority]);

  return (
    <div ref={imgRef} className={className}>
      {isInView ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          {...props}
        />
      ) : (
        <div
          className="bg-muted animate-pulse"
          style={{ width: width || '100%', height: height || 'auto', aspectRatio: width && height ? `${width}/${height}` : 'auto' }}
        />
      )}
    </div>
  );
}
