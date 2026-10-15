git # MASTER PROMPT: AXYS Investment Bank — Site-Wide Motion & Animation System

You are restyling the existing website **https://aib-axysafrica.com/** (AXYS Investment Bank, "A Leading Kenyan Broker"). Build a reusable, site-wide MOTION SYSTEM so every page shares one cinematic, premium, trustworthy feel.

## 0. NON-NEGOTIABLE: APPEARANCE ONLY
- Do NOT change any content, wording, headings, numbers, links, pages, routes, navigation structure, forms, form fields, calculators, downloads, or functionality. Every page, menu item (Home, About, Platforms, Services, Fund Account, Research, Downloads, IPO, FAQ, Contact), dropdown, button and form must work exactly as it does today.
- Do NOT rename, remove or reorder elements, and do not add new copy. Where I ask for an eyebrow label or breadcrumb, reuse the page's existing title/section name only; if none exists, skip it.
- RETAIN THE COLOR THEME. Extract the exact brand colors from the live site's CSS (the deep navy of the "AXYS" wordmark, the royal blue of the logo mark and "Fund Account" button, white, and the soft lavender/grey-blue tints). Define them once as CSS custom properties and reuse them. Do not introduce new brand hues. Glows, gradients and shadows must be tints/shades of these same colors.
- Keep the existing light and dark mode toggle working. Every effect must look correct in both modes (define separate dark-mode tokens).
- Keep the existing logo, layout grid, and information hierarchy. You are adding motion, depth, polish and imagery treatment, not redesigning the layout.
- Before changing anything: inspect the current codebase/HTML, identify the stack (plain HTML/CSS/JS, WordPress, React, etc.), and work within it. Add the system as new files plus minimal attribute/class hooks on existing markup. Make changes reversible (everything can be switched off by one flag).

## 0.5 TYPOGRAPHY: USE THE FONTS FROM THE REFERENCE SCREENSHOT
I am attaching a screenshot of a dark "FUND PERFORMANCE" card. Use its typography as the site's type system, applied consistently on every page:
- **Monospace (data and labels):** the small uppercase letter-spaced eyebrow labels (e.g. "FUND PERFORMANCE"), fund names and descriptors, large figures and prices (e.g. "$936,897.32"), and change badges (e.g. "+0.65%") use a clean technical monospace that matches **JetBrains Mono**. Use JetBrains Mono (self-hosted or Google Fonts with `font-display: swap`) with tabular numerals (`font-variant-numeric: tabular-nums`) so numbers never jitter during CountUp animations.
- **Display headline:** the very bold, tightly set, heavy sans-serif headline style (as in the large white heading on the left of the screenshot) is used for H1 and hero headlines: extra-bold/black weight, tight tracking, tight line-height. Match it as closely as possible. Before choosing, inspect the live site's CSS (`font-family` on headings) and reuse the font already loaded there if it matches; otherwise choose the closest heavy sans from Google Fonts.
- **Body text and UI:** keep the site's existing body font unless it clashes; pair it with the two styles above.
- Eyebrow labels: uppercase, wide letter-spacing (~0.12em to 0.2em), small size, muted blue-lavender colour taken from the brand palette.
- Limit to at most 2 to 3 font families and 4 weights in total. Preload the critical fonts, avoid layout shift (size-adjust or matching fallbacks), and keep text readable in both light and dark mode.
- Define font families, sizes, weights and tracking as tokens in the same tokens file as the motion tokens. No hardcoded fonts elsewhere.
- Typography only changes how existing text looks. Do not change any wording.

## 1. Design principle
Premium private-bank confidence: calm, precise, smooth. The hero and key banners are the most cinematic (deep navy, soft 3D depth, subtle glow). Inner content sections stay light (white and lavender) so text, tables, forms, fees, IPO details and downloads remain highly readable. Motion language is shared everywhere: same easing, durations, glow and depth. Elegant and purposeful, never gimmicky, never at the cost of readability, trust or speed. This is a financial institution: no bouncy, playful or flashy effects.

## 2. Motion tokens (single source of truth)
Create ONE tokens file (`motion.config.js` / `lib/motion.ts` plus matching CSS variables):
- Easing curves (standard, entrance, exit, spring-like), durations (fast ~200ms / base ~500ms / slow ~900ms), stagger delays, spring presets, viewport trigger settings (threshold, root margin, once).
- A global **`MOTION_INTENSITY`** constant (0 to 1, default 0.6) that scales distances, durations, parallax strength, tilt angle, glow opacity and blur. 0 = near-static (fades only), 1 = most energetic. Document how to change it in one line.
- Every component and stylesheet reads from here. No hardcoded numbers elsewhere.

## 3. Reusable primitives (components or data-attribute modules)
If the site is plain HTML, implement as vanilla JS modules driven by data attributes (e.g. `data-reveal="up"`) plus one `motion.css` and one `motion.js`, so I can add motion to any pasted HTML by adding attributes. If it is React/Next, implement as components and hooks. Same behavior either way.

- **Reveal**: fade + slide (variants: up, left, right, scale, blur-in), triggered once on scroll.
- **Stagger**: staggers children (cards, lists, service items, steps, FAQ items).
- **SplitText**: headline word-by-word / line-by-line reveal with blur-to-sharp. The text content must stay intact in the DOM (accessible, selectable, indexable).
- **CountUp**: animated counters, ONLY for numbers that already exist on the site. Never invent figures.
- **Parallax**: slow depth movement for images and decorative shapes.
- **Magnetic**: primary buttons (e.g. Fund Account) subtly follow the cursor on desktop.
- **TiltCard**: cards tilt in 3D on hover with a soft moving highlight (service, platform, IPO and download cards).
- **Marquee**: infinite scrolling strip, pauses on hover (use for existing partner/platform/market logos if present).
- **DrawLine**: SVG line that draws itself on scroll (for any step/process sections).
- **PageTransition**: smooth route change (fade + slight slide with a navy overlay wipe). Must never block navigation or break links, back button or anchors.
- **ScrollProgress**: thin lavender/royal-blue progress bar at top of the page.
- **CustomCursor** (desktop only, optional, subtle): soft ring that grows over links and buttons. Must be disable-able with one flag.

## 4. Shared visual effects
- **AuroraBackground**: slow blurred navy/blue/lavender gradient blobs (for hero and banner sections).
- **GridGlow**: faint grid with a glow that follows the cursor (desktop only).
- **NoiseOverlay**: very subtle grain for depth.
- **WaveRibbon**: flowing ribbon/line art in brand colors, big on the home hero, smaller and calmer for page headers.
- **Floating decorative elements**: subtle abstract shapes (glass spheres, coins, chart-line fragments, the logo's angular mark) used sparingly at section edges with slow parallax to tie pages to the hero. Fewer on mobile.
- **Glass cards**: fine borders, soft shadows, hover glow in the brand blue, working in light and dark mode.
- **Smooth scrolling** via Lenis site-wide (disabled for reduced-motion, and must not break anchor links, dropdowns, modals or form scrolling).
- **Imagery treatment**: gentle image reveal (clip/scale), slow zoom on hover, soft overlays. Use only existing images; if I supply new ones later, apply the same treatment. Lazy-load all non-hero images with proper width/height to avoid layout shift.

## 5. Apply it page by page (styling only)
- **Every page**: compact animated page header (smaller aurora/wave style than the home hero) using the page's existing title with a split-text reveal. Breadcrumb only if it can be derived from existing navigation.
- **Navbar**: keep the existing menu and dropdowns exactly. Add a glass/blur treatment that shrinks slightly and gains a soft shadow on scroll, animated dropdown open/close, animated underline on hover, and on mobile an animated full-screen menu overlay with staggered links. Keep the dark-mode toggle working with a smooth theme transition.
- **Home**: cinematic hero (existing headline "A Leading Kenyan Broker", subtext and buttons unchanged) with aurora, wave ribbon, subtle parallax and a staggered entrance; product/service blocks as tilt cards; process or steps sections with the DrawLine timeline; "why choose us"/feature items as staggered cards with hover glow; any existing statistics with CountUp; final call-to-action band with a slowly moving gradient.
- **About**: story sections with parallax images, values/features as staggered reveals, mission/vision text with large split-text reveal.
- **Platforms, Services, Fund Account, Research, Downloads**: staggered card grids, tilt/glow hover, smooth expanding accordions/tabs, download items with a clear hover lift and arrow slide. Tables and data stay perfectly readable (only a gentle row fade-in).
- **IPO pages and calculators**: calm treatment. Inputs enter gently in sequence, focus states glow, results update with a smooth number transition, and nothing slows down or delays calculation or submission.
- **FAQ**: smooth height-animated accordion, rotating chevron, staggered entrance.
- **Contact**: animated contact cards, form entrance, focus glow, smooth validation messages, and a fade-in map/location block; success state with a short, tasteful confirmation animation.
- **Footer**: gradient top edge, staggered link columns, subtle animated background.
- **Buttons and links everywhere**: consistent hover/press states (lift, glow, arrow slide, underline draw), visible keyboard focus rings.

## 6. Rules (performance, accessibility, safety)
- Respect `prefers-reduced-motion` everywhere: disable parallax, tilt, marquee, custom cursor, Lenis and page wipes, and replace reveals with simple fades.
- Animate only `transform` and `opacity` wherever possible. No layout-shifting animations; reserve space for everything.
- Reveals run once per element and must NEVER hide content if JavaScript is slow or fails: content is visible by default (progressive enhancement, e.g. a `.js` class gates the hidden initial state with a timeout fallback), readable by search engines, and screen-reader friendly.
- Lazy-load heavy effects (WebGL/canvas, large images); pause off-screen animations (IntersectionObserver); use `will-change` sparingly. Target Lighthouse performance 90+ on a mid-range Android phone on 4G. Core Web Vitals (LCP, CLS, INP) must not get worse than today. Compare before and after.
- Mobile gets lighter versions: fewer floating objects, no cursor effects, no hover-dependent features, simpler parallax.
- Maintain WCAG AA contrast, visible focus states and full keyboard navigation. Do not trap focus except in the mobile menu overlay (with Escape to close).
- Do not break existing scripts, trackers, chat widgets, third-party embeds, cookie banners or form submissions. Test them after every phase.
- Keep each component small and documented. Write a short **MOTION.md** describing every primitive, its props/attributes, and how to adjust intensity globally.

## 7. Deliverables and process
1. **Audit**: summarise the current stack, colors, fonts, pages and scripts (no changes yet).
2. **Build the motion system** (tokens, primitives, effects) in isolation.
3. **Temporary `/motion-demo` page** showing every primitive in action, with a live control for `MOTION_INTENSITY` and a reduced-motion toggle, in both light and dark mode, for my review. STOP here and wait for my approval.
4. After approval, **apply it page by page** (Home first, then each page as I paste its HTML), confirming after each page that content, wording and function are identical to the original.
5. Remove or hide `/motion-demo` before launch.
6. Final report: what each effect does, which files were added or touched, before/after performance numbers, and how to make the whole site calmer or more energetic by changing one constant (`MOTION_INTENSITY`), or switch everything off with one flag.
