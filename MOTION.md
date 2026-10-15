# AXYS Motion & Type System

One shared motion language for every public page. Admin pages (`/admin`) are not affected.

## Quick controls (`lib/motion.js`)

| Constant | Effect |
| --- | --- |
| `MOTION_INTENSITY = 0.6` | `0` = fades only, `1` = most energetic. Scales travel distance, blur, tilt, parallax, glow, durations. **Change this one number to make the site calmer or livelier.** |
| `MOTION_ENABLED = true` | `false` switches all motion off; content renders static. |
| `MOTION_FEATURES` | Per-feature switches: `customCursor` (off), `pageWipe` (off), `gridGlow`, `magnetic`, `tilt`, `smoothScroll` (Lenis — not installed). |
| `REVEAL_FAILSAFE_MS` | If the page hasn't hydrated by then, all hidden content is shown. |

CSS mirrors the tokens in `styles/motion.css` (`--mx-*` variables, light + `.dark` sets).

## Files

- `lib/motion.js`: tokens, flags, palette, boot script
- `styles/motion.css`: all motion/effect/typography CSS (`mx-` prefix)
- `components/motion/*`: primitives and effects (import from `@/components/motion`)
- Wired in: `app/layout.js` (fonts, CSS, boot script), `components/ClientLayout.js` (provider, scroll progress, cursor, page transition)

## Typography

- **Display (H1/H2):** Noto Sans 800/900 (`--font-display`), tight tracking. Applied to every `h1`/`h2` on public pages.
- **Mono (labels, figures, badges):** JetBrains Mono (`--font-mono`), tabular numerals. Classes: `mx-eyebrow`, `mx-mono`, `mx-figure`, `mx-badge`.
- **Body:** Inter (unchanged).

## Primitives

| Component | Props | Notes |
| --- | --- | --- |
| `Reveal` | `variant` (`up`·`left`·`right`·`scale`·`blur`·`fade`), `delay` ms, `as` | Once, on scroll. |
| `Stagger` | `as`, `className` | Reveals direct children in sequence; no wrapper elements. |
| `SplitText` | string children, `as` | Word-by-word blur-in; text stays intact in the DOM. |
| `CountUp` | `value`, `decimals`, `prefix`, `suffix`, `locale`, `duration` | Counts on view, tweens on change. Screen readers get the final value. Only for real numbers. |
| `Parallax` | `speed` | Off for reduced motion, halved on mobile. |
| `Magnetic` | `strength` | Wrap a button/link; desktop only. |
| `TiltCard` | `as`, `className` | 3D tilt + moving highlight; desktop only. |
| `Marquee` | `duration`, `gap` | Pauses on hover/focus/off-screen. |
| `DrawLine` | `d`, `viewBox` | SVG line drawn by scroll progress. |
| `PageHeader` | `as`, `className` | Wraps a page's existing h1 + subtitle: line reveal + aurora/wave. |
| `PageTransition` | — | Enter-only fade on route change (in ClientLayout). |
| `ScrollProgress`, `CustomCursor` | — | Global, in ClientLayout. |

Legacy `ScrollReveal` / `ScrollRevealGroup` keep their props and now run on this system.

## Effects

`AuroraBackground` (`variant` hero|header), `GridGlow` (`tone` dark|light|auto), `NoiseOverlay`, `WaveRibbon` (`variant` hero|header), `FloatingShapes` (`items`), `RevealImage`. CSS-only helpers: `mx-glass`, `mx-fund-card`, `mx-btn`, `mx-btn-primary`, `mx-btn-ghost`, `mx-arrow`, `mx-link`, `mx-collapse`, `mx-chevron`, `mx-hero`, `mx-cta`.

## Floating, phones and site-wide polish

- **Floating:** images, icon tiles and cards in grids on public pages bob gently (CSS `translate`, so hover/tilt still work). Add `mx-float-slow` to float anything else; add `mx-no-float` to an image to opt out. Card floating is off on phones; nothing floats inside buttons, links, forms or tables.
- **Phones:** `mx-phone` (3D sway + float) with `mx-phone-glow` behind, inside `mx-phone-stage`. Used in the home hero and on /platforms with the optimised `public/app-mockup-hero.webp` (85 KB instead of the 2 MB PNG).
- **Polish of existing classes:** `.glass`/GlassCard, `.about-member-card`, `.gradient-text` (brand blues only), `bg-primary` buttons, icon tiles and page backgrounds are restyled in `styles/motion.css` so every page shares one look.
- **Admin** (`main[data-mx-admin]`, sidebar `[data-mx-admin-sidebar]`): display headings, mono figures, staggered card entrances, hover lift, focus glow, table row fade, page transitions. No constant floating.

## Page layouts

Inner pages share one structure (`components/layout/`):

| Component | Use |
| --- | --- |
| `PageHero` | Navy hero band: `crumbs`, `eyebrow`, `title`, `subtitle`, `actions`, `aside` (fact card / quick links), `children`. |
| `Section` | Page band, `tone` = `white` · `tint` · `navy`. Uses `overflow-x: clip` so sticky sidebars work. |
| `SectionIntro` | Eyebrow + heading + intro (`align`, `light`). |
| `FactCard`, `QuickLinks` | Navy cards for hero asides. |
| `Funding.js` | `FundingNav` (sticky tabs), `MethodBlock`, `DetailTile` (with copy button), `NotifyCard`, `Notice`, `CopyButton`. |
| `Legal.js` | `LegalBody`: auto table of contents from `h2`s with active-section highlight. |

CSS helpers: `mx-tabs`/`mx-tab`, `mx-vtabs`, `mx-row`, `mx-offer`, `mx-faq-item`, `mx-search`, `mx-chip`, `mx-avatar`, `mx-stat-tile`, `mx-lead`, `mx-divided`, `mx-toolbar`, `mx-store`, `mx-office`, `mx-contact-sheet`, `mx-code`.

## Rules built in

- Content is visible by default; it's only hidden once JS runs (`html.mx-js`), with a failsafe.
- `prefers-reduced-motion`: no parallax, tilt, marquee, cursor, wipes, loops; reveals become fades.
- Only `transform`/`opacity` (plus brief `filter`/`clip-path`) are animated; loops pause off-screen.
- Touch devices get no hover/cursor effects.

## Rollback

The original files are in `../AIB-AXYS-backup-before-motion-2026-10-14/`.
