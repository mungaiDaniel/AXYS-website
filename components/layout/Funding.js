// File: components/layout/Funding.js
// Shared building blocks for the /fund-account/* pages.
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Copy, Check, AlertCircle, Mail } from 'lucide-react';
import { Reveal, Stagger } from '@/components/motion';

const FUNDING_PAGES = [
  { href: '/fund-account/local-stocks', label: 'KSH' },
  { href: '/fund-account/multi-currency', label: 'USD & GBP' },
  { href: '/fund-account/international-equities', label: 'International Equities & ETFs' },
  { href: '/fund-account/offshore-funds', label: 'Offshore Funds' },
];

/** Sticky sub-navigation between the funding pages. */
export function FundingNav() {
  const pathname = usePathname();
  return (
    <div className="mx-subnav">
      <div className="container mx-auto px-4 flex items-center gap-4 overflow-x-auto">
        <span className="mx-eyebrow shrink-0 hidden md:inline">Fund Account</span>
        <nav aria-label="Funding options" className="mx-tabs !bg-transparent !border-0 !p-0 flex-nowrap">
          {FUNDING_PAGES.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="mx-tab whitespace-nowrap"
              data-active={pathname === p.href ? '' : undefined}
              aria-current={pathname === p.href ? 'page' : undefined}
            >
              {p.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

/** Copy a value to the clipboard with brief confirmation. */
export function CopyButton({ value, label = 'Copy' }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setDone(true);
      setTimeout(() => setDone(false), 1600);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };
  return (
    <button type="button" onClick={copy} className="mx-copy" aria-label={`${label} ${value}`}>
      {done ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      <span>{done ? 'Copied' : label}</span>
    </button>
  );
}

/**
 * A label/value tile. tone: 'default' | 'accent' | 'success' | 'warning'.
 * copy: true shows a copy button for the value.
 */
export function DetailTile({ label, value, note, tone = 'default', copy = false, className = '' }) {
  return (
    <div className={`mx-detail ${className}`} data-tone={tone}>
      <div className="flex items-start justify-between gap-3">
        <div className="mx-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
        {copy && <CopyButton value={String(value)} />}
      </div>
      <div className="mx-detail-value mt-2">{value}</div>
      {note && <div className="text-xs mt-1.5 font-semibold mx-detail-note">{note}</div>}
    </div>
  );
}

/** Numbered funding method block. */
export function MethodBlock({ num, icon: Icon, title, intro, children, id }) {
  return (
    <section id={id} className="mx-method scroll-mt-32">
      <Reveal className="flex items-center gap-4 mb-6">
        <span className="mx-service-icon shrink-0">{Icon && <Icon />}</span>
        <div>
          {num && <p className="mx-num">{num}</p>}
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        </div>
      </Reveal>
      {intro && <p className="text-muted-foreground leading-relaxed mb-6 max-w-3xl">{intro}</p>}
      <Stagger className="space-y-4">{children}</Stagger>
    </section>
  );
}

/**
 * Navy "After Deposit - Notify Us" card with the email format.
 * subject: the exact subject line text; step: optional step label.
 */
export function NotifyCard({
  subject,
  step,
  title = 'After Deposit - Notify Us',
  text = 'Once you’ve deposited, please notify us immediately for swift allocation by sending a copy of the transaction confirmation slip via email.',
  label = 'Email Format',
  attach = 'Transaction confirmation slip',
  email = 'info@axysinvestmentbank.com',
  children,
}) {
  return (
    <div className="mx-fund-card">
      <p className="mx-eyebrow !text-[#9AA6EF] inline-flex items-center gap-2">
        <Mail className="w-3.5 h-3.5" /> {step || 'Notify us'}
      </p>
      <h2 className="text-2xl font-black text-white mt-3 mb-3">{title}</h2>
      {text && <p className="text-sm text-[#C9CFF5] leading-relaxed">{text}</p>}
      <div className="mt-6 pt-5 border-t border-white/10 space-y-4 text-sm">
        <p className="mx-mono text-[10px] uppercase tracking-[0.16em] text-[#9AA6EF]/70">{label}</p>
        <div>
          <span className="text-[#9AA6EF]">To:</span>{' '}
          <span className="mx-mono text-white break-all">{email}</span>
          <div className="mt-2"><CopyButton value={email} /></div>
        </div>
        {subject && (
          <div>
            <span className="text-[#9AA6EF]">Subject:</span>{' '}
            <span className="mx-mono text-white bg-white/10 px-2 py-0.5 rounded">{subject}</span>
          </div>
        )}
        {attach && (
          <div>
            <span className="text-[#9AA6EF]">Attach:</span> <span className="text-white">{attach}</span>
          </div>
        )}
        {children}
      </div>
      <div className="mx-fund-line" aria-hidden="true" />
    </div>
  );
}

/** Red "Important" notice. */
export function Notice({ title = 'Important', children, tone = 'danger' }) {
  return (
    <div className="mx-notice" data-tone={tone}>
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div>
        <div className="font-bold mb-1">{title}</div>
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
