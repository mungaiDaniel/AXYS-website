// File: components/motion/CountUp.js
'use client';

import { useEffect, useRef, useState } from 'react';
import { DURATION, scaleDuration } from '@/lib/motion';
import { useMotion } from './MotionProvider';
import { useInView } from './useInView';

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/**
 * Counts up to `value` when scrolled into view, then tweens smoothly whenever
 * `value` changes (e.g. calculator results). Only for numbers that already
 * exist on the site. The real value is always rendered on the server and is
 * what screen readers hear; the tween is display-only.
 */
export default function CountUp({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1.8, // seconds, first count
  updateDuration = DURATION.base, // seconds, later value changes
  locale = 'en-US',
  className = '',
  ...rest
}) {
  const { reduced: motionReduced, intensity } = useMotion();
  const reduced = motionReduced || intensity === 0;
  const [ref, inView] = useInView();
  const [display, setDisplay] = useState(value);
  const shown = useRef(value);
  const started = useRef(false);
  const frame = useRef(0);

  const format = (n) =>
    `${prefix}${Number(n).toLocaleString(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;

  // Before the first count, park below-the-fold numbers at 0.
  useEffect(() => {
    if (reduced || started.current) return;
    shown.current = 0;
    setDisplay(0);
  }, [reduced]);

  useEffect(() => {
    if (!inView) return;
    cancelAnimationFrame(frame.current);

    const first = !started.current;
    started.current = true;

    if (reduced) {
      shown.current = value;
      setDisplay(value);
      return;
    }

    const from = shown.current;
    const total = scaleDuration(first ? duration : updateDuration, intensity) * 1000;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - start) / total);
      const current = from + (value - from) * easeOutCubic(t);
      shown.current = current;
      setDisplay(current);
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [inView, value, reduced, duration, updateDuration, intensity]);

  const finalText = format(value);

  return (
    <span
      ref={ref}
      className={className}
      style={{ fontVariantNumeric: 'tabular-nums', display: 'inline-block', minWidth: `${finalText.length}ch` }}
      {...rest}
    >
      <span aria-hidden="true">{format(display)}</span>
      <span className="sr-only">{finalText}</span>
    </span>
  );
}
