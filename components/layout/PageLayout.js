// File: components/layout/PageLayout.js
// Shared page structure for inner pages: navy hero band, tonal sections,
// section intros and fact cards. See MOTION.md ("Page layouts").
'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import {
  AuroraBackground, GridGlow, NoiseOverlay, WaveRibbon, SplitText, Reveal, Stagger,
} from '@/components/motion';

/**
 * Full-width navy hero for inner pages.
 * crumbs: [{ label, href? }] — the last crumb is the current page.
 * aside: optional right-hand content (fact card, quick links, image).
 */
export function PageHero({ eyebrow, title, subtitle, crumbs = [], actions, aside, children }) {
  return (
    <section className="mx-hero mx-hero-home mx-page-hero">
      <AuroraBackground variant="header" />
      <GridGlow />
      <NoiseOverlay />
      <WaveRibbon variant="header" className="bottom-0 opacity-40" />
      <div className="container mx-auto px-4 relative z-10">
        <div className={`grid gap-12 items-center ${aside ? 'lg:grid-cols-[1.25fr_1fr]' : ''}`}>
          <div className="max-w-3xl">
            {crumbs.length > 0 && (
              <Reveal variant="fade">
                <nav aria-label="Breadcrumb" className="mb-6">
                  <ol className="flex flex-wrap items-center gap-1.5 mx-mono text-[11px] uppercase tracking-[0.16em] text-[#9AA6EF]">
                    <li><Link href="/" className="mx-link hover:text-white">Home</Link></li>
                    {crumbs.map((c, i) => (
                      <li key={c.label} className="flex items-center gap-1.5">
                        <ChevronRight className="w-3 h-3 opacity-60" aria-hidden="true" />
                        {c.href && i < crumbs.length - 1 ? (
                          <Link href={c.href} className="mx-link hover:text-white">{c.label}</Link>
                        ) : (
                          <span aria-current={i === crumbs.length - 1 ? 'page' : undefined} className="text-white/90">{c.label}</span>
                        )}
                      </li>
                    ))}
                  </ol>
                </nav>
              </Reveal>
            )}
            {eyebrow && (
              <Reveal variant="fade" delay={80}>
                <p className="mx-eyebrow !text-[#9AA6EF] mb-4">{eyebrow}</p>
              </Reveal>
            )}
            {typeof title === 'string' ? (
              <SplitText className="mx-display mx-page-title text-white mb-6">{title}</SplitText>
            ) : (
              <h1 className="mx-display mx-page-title text-white mb-6">{title}</h1>
            )}
            {subtitle && (
              <Reveal variant="blur" delay={250}>
                <div className="text-lg md:text-xl text-[#C9CFF5] leading-relaxed max-w-2xl">{subtitle}</div>
              </Reveal>
            )}
            {actions && (
              <Reveal delay={350}>
                <div className="flex flex-wrap gap-3 mt-9">{actions}</div>
              </Reveal>
            )}
            {children}
          </div>
          {aside && (
            <Reveal variant="scale" delay={200} className="w-full max-w-md lg:ml-auto">
              <div className="mx-float-slow">{aside}</div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

const TONES = {
  white: 'bg-white dark:bg-[#121929]',
  tint: 'bg-[#F5F6FD] dark:bg-[#0F1423]',
  navy: 'mx-hero',
};

/** Page band with consistent vertical rhythm. tone: 'white' | 'tint' | 'navy'. */
export function Section({ tone = 'white', id, className = '', containerClassName = '', children }) {
  return (
    <section id={id} className={`relative overflow-x-clip py-20 md:py-24 ${TONES[tone]} ${className}`}>
      {tone === 'navy' && (
        <>
          <AuroraBackground variant="header" />
          <NoiseOverlay />
        </>
      )}
      <div className={`container mx-auto px-4 relative z-10 ${containerClassName}`}>{children}</div>
    </section>
  );
}

/** Eyebrow + heading + intro text. align: 'left' | 'center'. light: on navy. */
export function SectionIntro({ eyebrow, title, text, align = 'left', light = false, className = '', as: Tag = 'h2' }) {
  return (
    <Reveal className={`${align === 'center' ? 'text-center mx-auto' : ''} max-w-2xl mb-12 ${className}`}>
      {eyebrow && <p className={`mx-eyebrow mb-3 ${light ? '!text-[#9AA6EF]' : ''}`}>{eyebrow}</p>}
      {title && <Tag className={`mx-h1 ${light ? 'text-white' : 'text-foreground'}`}>{title}</Tag>}
      {text && <p className={`mt-4 text-lg leading-relaxed ${light ? 'text-[#C9CFF5]' : 'text-muted-foreground'}`}>{text}</p>}
    </Reveal>
  );
}

/** Navy data card listing label/value facts (reference "Fund Performance" style). */
export function FactCard({ eyebrow, icon: Icon, facts = [], footer }) {
  return (
    <div className="mx-fund-card">
      {eyebrow && (
        <p className="mx-eyebrow !text-[#9AA6EF] inline-flex items-center gap-2">
          {Icon && <Icon className="w-3.5 h-3.5" aria-hidden="true" />}
          {eyebrow}
        </p>
      )}
      <Stagger as="dl" className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5">
        {facts.map(([label, value]) => (
          <div key={label}>
            <dt className="mx-mono text-[10px] uppercase tracking-[0.16em] text-[#9AA6EF]/70">{label}</dt>
            <dd className="mx-mono text-lg font-bold text-white mt-1">{value}</dd>
          </div>
        ))}
      </Stagger>
      {footer && <div className="mt-6 pt-5 border-t border-white/10 text-sm">{footer}</div>}
      <div className="mx-fund-line" aria-hidden="true" />
    </div>
  );
}

/** Quick links list for hero asides. links: [{ label, href, external? }] */
export function QuickLinks({ eyebrow = 'Quick links', icon: Icon, links = [] }) {
  return (
    <div className="mx-fund-card">
      <p className="mx-eyebrow !text-[#9AA6EF] inline-flex items-center gap-2">
        {Icon && <Icon className="w-3.5 h-3.5" aria-hidden="true" />}
        {eyebrow}
      </p>
      <ul className="mt-4 divide-y divide-white/10">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="group flex items-center justify-between py-3 text-white/90 hover:text-white"
            >
              <span className="text-sm font-medium">{l.label}</span>
              <ChevronRight className="w-4 h-4 text-[#9AA6EF] transition-transform duration-500 group-hover:translate-x-1" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
