// File: components/motion/effects.js
// Shared decorative effects. All are aria-hidden, pointer-events: none, and
// sit behind content (z-index 0) — give the section `relative overflow-hidden`
// and the content `relative z-10`.
'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { isFinePointer } from '@/lib/motion';
import { useMotion } from './MotionProvider';
import { useInView, usePauseOffscreen } from './useInView';
import Parallax from './Parallax';

/** Slow blurred navy/blue/lavender blobs. variant: 'hero' | 'header'. */
export function AuroraBackground({ variant = 'hero', className = '' }) {
  const ref = usePauseOffscreen();
  return (
    <div ref={ref} className={`mx-aurora ${className}`} data-variant={variant} aria-hidden="true">
      <span className="mx-aurora-blob" />
      <span className="mx-aurora-blob" />
      <span className="mx-aurora-blob" />
    </div>
  );
}

/** Faint grid with a glow that follows the cursor (desktop only). tone: 'dark' | 'light'. */
export function GridGlow({ tone = 'dark', className = '' }) {
  const ref = useRef(null);
  const { features, reduced } = useMotion();

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!host || !features.gridGlow || reduced || !isFinePointer()) return;
    let frame = 0;
    const onMove = (e) => {
      const rect = host.getBoundingClientRect();
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty('--mx-gx', `${e.clientX - rect.left}px`);
        el.style.setProperty('--mx-gy', `${e.clientY - rect.top}px`);
      });
    };
    host.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      host.removeEventListener('pointermove', onMove);
    };
  }, [features.gridGlow, reduced]);

  return <div ref={ref} className={`mx-grid ${className}`} data-tone={tone} aria-hidden="true" />;
}

/** Very subtle film grain. */
export function NoiseOverlay({ className = '' }) {
  return <div className={`mx-noise ${className}`} aria-hidden="true" />;
}

// One period of each line spans 1200 units; the SVG is 2400 wide and the
// track slides by -50%, so the loop is seamless.
function wavePath(amp, phase, mid, freq = 1) {
  let d = '';
  for (let x = 0; x <= 2400; x += 30) {
    const y = mid + amp * Math.sin((x / 1200) * Math.PI * 2 * freq + phase);
    d += `${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)} `;
  }
  return d.trim();
}

const WAVE_LINES = [
  { amp: 46, phase: 0, mid: 150, width: 1.6, opacity: 0.9 },
  { amp: 38, phase: 0.6, mid: 160, width: 1.2, opacity: 0.7 },
  { amp: 52, phase: 1.3, mid: 145, width: 1, opacity: 0.5 },
  { amp: 30, phase: 2.1, mid: 170, width: 0.9, opacity: 0.45 },
  { amp: 60, phase: 2.8, mid: 140, width: 0.8, opacity: 0.35 },
];

/** Flowing ribbon line art. variant: 'hero' (large) | 'header' (small, calmer). */
export function WaveRibbon({ variant = 'hero', className = '', style }) {
  const ref = usePauseOffscreen();
  const id = useId().replace(/:/g, '');
  const lines = variant === 'hero' ? WAVE_LINES : WAVE_LINES.slice(0, 3);
  const height = variant === 'hero' ? 320 : 160;

  const svg = (offset) => (
    <svg viewBox="0 0 2400 300" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`${id}-s${offset}`} x1="0" x2="1">
          <stop offset="0" stopColor="#CCD1F2" stopOpacity="0.2" />
          <stop offset="0.35" stopColor="#4169E1" />
          <stop offset="0.65" stopColor="#0017BF" />
          <stop offset="1" stopColor="#CCD1F2" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id={`${id}-f${offset}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4169E1" stopOpacity="0.22" />
          <stop offset="1" stopColor="#0017BF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${wavePath(46, offset, 150)} L2400 300 L0 300 Z`} fill={`url(#${id}-f${offset})`} />
      {lines.map((l, i) => (
        <path
          key={i}
          d={wavePath(l.amp, l.phase + offset, l.mid)}
          fill="none"
          stroke={`url(#${id}-s${offset})`}
          strokeWidth={l.width}
          strokeOpacity={l.opacity}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );

  return (
    <div ref={ref} className={`mx-wave ${className}`} style={{ height, ...style }} aria-hidden="true">
      <div className="mx-wave-track">{svg(0)}</div>
      {variant === 'hero' && <div className="mx-wave-track">{svg(Math.PI / 2)}</div>}
    </div>
  );
}

// The angular mark from the AXYS emblem (public/emblem-logo-light.svg).
const EMBLEM_PATH =
  'M850.84,40.69L39.36,852.01c-2.11,2.11-3.29,4.98-3.29,7.95v171.4c0,6.2,5.04,11.24,11.25,11.24h658.5c6.2,0,11.25-5.04,11.25-11.24l-56.26-213.71c0-8.54-9.17-13.97-16.68-9.85l-386.08,125.15c-11.4,6.29-22.58-8.6-13.38-17.8L834.9,325.01c7.09-7.09,19.2-2.08,19.2,7.95v698.4c0,6.2,5.04,11.24,11.25,11.24h167.34c6.2,0,11.25-5.04,11.25-11.24V48.64c0-6.2-5.05-11.24-11.25-11.24h-173.93c-3,0-5.85,1.19-7.95,3.29h.03Z';

function Shape({ type, size }) {
  if (type === 'sphere') return <div className="mx-sphere" style={{ width: size, height: size }} />;
  if (type === 'coin') return <div className="mx-coin" style={{ width: size, height: size }} />;
  if (type === 'chart')
    return (
      <svg width={size} height={size * 0.5} viewBox="0 0 120 60" fill="none">
        <polyline
          points="2,52 22,40 38,46 58,24 76,30 96,10 118,16"
          stroke="#4169E1"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />
        <circle cx="96" cy="10" r="3.5" fill="#CCD1F2" />
      </svg>
    );
  if (type === 'mark')
    return (
      <svg width={size} height={size} viewBox="0 0 1080 1080">
        <path d={EMBLEM_PATH} fill="#0017BF" opacity="0.18" />
      </svg>
    );
  return null;
}

const DEFAULT_SHAPES = [
  { type: 'sphere', size: 88, top: '12%', left: '6%', speed: 1.2 },
  { type: 'coin', size: 54, top: '64%', left: '12%', speed: 0.7, desktopOnly: true },
  { type: 'chart', size: 140, top: '20%', right: '8%', speed: 0.9, desktopOnly: true },
  { type: 'mark', size: 120, bottom: '8%', right: '14%', speed: 1.5 },
];

/** Sparse decorative shapes with slow parallax. Fewer on mobile. */
export function FloatingShapes({ items = DEFAULT_SHAPES, className = '' }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden="true">
      {items.map(({ type, size, speed = 1, desktopOnly, ...pos }, i) => (
        <div key={i} className="mx-float" style={pos} data-desktop-only={desktopOnly ? '' : undefined}>
          <Parallax speed={speed}>
            <div className="mx-float-inner" style={{ animationDelay: `${i * -2.3}s` }}>
              <Shape type={type} size={size} />
            </div>
          </Parallax>
        </div>
      ))}
    </div>
  );
}

/**
 * Gentle clip/scale reveal + slow hover zoom for an existing image.
 * Wrap the existing <img>/<Image>; keep its width/height for zero CLS.
 */
export function RevealImage({ className = '', children }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`mx-image ${className}`}
      data-reveal="image"
      data-revealed={inView ? '' : undefined}
    >
      {children}
    </div>
  );
}

/** Hook: true when the viewport is phone-sized (for trimming effects). */
export function useIsSmall() {
  const [small, setSmall] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setSmall(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return small;
}
