// File: lib/motion.js
// Single source of truth for the AXYS motion system.
// CSS mirrors these values as custom properties in styles/motion.css.
// See MOTION.md for usage.

// ── Global switches ─────────────────────────────────────────────────────────
// MOTION_ENABLED = false turns every animation off (content renders static).
export const MOTION_ENABLED = true;

// 0 = near-static (fades only) · 1 = most energetic. Change this one number
// to make the whole site calmer or livelier.
export const MOTION_INTENSITY = 0.6;

// Optional features, each switchable on its own.
export const MOTION_FEATURES = {
  customCursor: false, // soft ring cursor (desktop only)
  pageWipe: false, // navy overlay wipe on route change (enter-only fade always on)
  gridGlow: true, // cursor-following grid glow (desktop only)
  magnetic: true, // primary buttons follow cursor (desktop only)
  tilt: true, // 3D tilt cards (desktop only)
  smoothScroll: false, // Lenis — not installed yet; see MOTION.md
};

// ── Brand palette (extracted from the live site + logo SVG) ─────────────────
export const BRAND = {
  navy: '#00005B', // "AXYS" wordmark
  royal: '#0017BF', // logo mark, primary buttons
  royalDark: '#0014A8', // hover/pressed shade of royal
  blue: '#1477BB', // secondary blue (dark-mode icons)
  blueBright: '#4169E1', // dark-mode accent
  lavender: '#E6E8F9', // 10% tint of royal
  lavenderDeep: '#CCD1F2', // 20% tint of royal
  ink: '#121929', // dark-mode page background
  inkDeep: '#0A0A0F', // dark-mode main background
  white: '#FFFFFF',
};

// ── Easing (cubic-bezier arrays usable by framer-motion and CSS) ────────────
export const EASE = {
  standard: [0.4, 0, 0.2, 1],
  entrance: [0.16, 1, 0.3, 1],
  exit: [0.7, 0, 0.84, 0],
  springLike: [0.34, 1.2, 0.64, 1], // very slight settle, never bouncy
};

// ── Durations (seconds) ─────────────────────────────────────────────────────
export const DURATION = {
  fast: 0.2,
  base: 0.5,
  slow: 0.9,
};

export const STAGGER = {
  children: 0.08,
  words: 0.045,
};

export const SPRING = {
  soft: { type: 'spring', stiffness: 120, damping: 20, mass: 0.8 },
  firm: { type: 'spring', stiffness: 260, damping: 30 },
  pointer: { type: 'spring', stiffness: 180, damping: 18, mass: 0.4 },
};

export const VIEWPORT = {
  threshold: 0.15,
  rootMargin: '0px 0px -10% 0px',
  once: true,
};

// Base magnitudes at intensity = 1. Multiply by intensity via scale().
export const MAGNITUDE = {
  distance: 40, // px, reveal travel
  blur: 12, // px, blur-in start
  scale: 0.08, // reveal scale-from offset (1 - x)
  parallax: 0.25, // fraction of scroll offset
  tilt: 10, // deg, max card tilt
  magnetic: 14, // px, max button offset
  glow: 0.55, // max glow opacity
};

// Reveals keep their hidden state for at most this long if JS stalls.
export const REVEAL_FAILSAFE_MS = 3500;

// ── Typography tokens ───────────────────────────────────────────────────────
export const TYPE = {
  families: {
    display: 'inherit', // existing Inter, at heavy weight
    body: 'inherit', // existing Inter
    mono: "var(--font-mono, 'JetBrains Mono'), ui-monospace, SFMono-Regular, Menlo, monospace",
  },
  weights: { regular: 400, medium: 500, semibold: 600, black: 800 },
  tracking: { display: '-0.035em', eyebrow: '0.16em' },
};

// ── Helpers ─────────────────────────────────────────────────────────────────
export const clamp01 = (n) => Math.min(1, Math.max(0, Number(n) || 0));

// Scale a base magnitude by intensity.
export const scale = (base, intensity = MOTION_INTENSITY) => base * clamp01(intensity);

// Durations shrink a little at low intensity and stretch a little at high.
export const scaleDuration = (seconds, intensity = MOTION_INTENSITY) =>
  seconds * (0.7 + 0.6 * clamp01(intensity));

export const isFinePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export const isSmallScreen = () =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;

// Inline <head> script (app/layout.js). Runs before first paint: hides reveal
// targets only when JS is actually running, and un-hides everything if
// hydration has not finished within REVEAL_FAILSAFE_MS.
export const MOTION_BOOT_SCRIPT = `(function(){try{var d=document.documentElement;${
  MOTION_ENABLED ? '' : "d.classList.add('mx-off');return;"
}d.classList.add('mx-js');if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('mx-reduced');setTimeout(function(){if(!d.classList.contains('mx-ready'))d.classList.add('mx-failsafe')},${REVEAL_FAILSAFE_MS})}catch(e){}})();`;
