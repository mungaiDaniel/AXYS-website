'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  TrendingUp, Shield, Globe, ArrowRight, DollarSign, WalletCards, ChevronDown, ArrowUpRight,
  Smartphone, Landmark, Rocket, BadgeCheck, CalendarClock, LineChart,
} from 'lucide-react';
import ServiceModal from '@/components/ServiceModal';
import content from '@/config/content.json';
import { QUICKMART_IPO } from '@/lib/quickmart-ipo';
import { IPO_DEFAULTS } from '@/lib/ipo-registry';
import {
  AuroraBackground, GridGlow, NoiseOverlay, WaveRibbon, FloatingShapes, SplitText, CountUp,
  Magnetic, TiltCard, Reveal, Stagger, DrawLine, Marquee, Parallax,
} from '@/components/motion';

// Decorative shapes kept to the hero edges, clear of the copy and cards.
const HERO_SHAPES = [
  { type: 'sphere', size: 56, top: '12%', left: '2%', speed: 1.2 },
  { type: 'mark', size: 420, top: '6%', right: '-4%', speed: 0.6, desktopOnly: true },
];

// Everything below is taken from content that already exists on the site
// (footer regulatory notice, FAQ answers, IPO data, platform links).
const CREDENTIALS = [
  'Licensed by the Capital Markets Authority',
  'Regulated by the Central Bank of Kenya',
  'Member of the Nairobi Securities Exchange',
  'Member of the CDSC',
  'Local Stocks & Bonds',
  'International Equities',
  'ETFs',
  'Offshore Funds',
];

const STEPS = [
  {
    icon: Smartphone,
    title: 'Open your account online',
    text: 'Download the DigiTrader App from Google Play, App Store, or Windows Store. No document uploads required — you’ll receive your CDS number.',
    link: { href: '/platforms', label: 'Trading Platforms' },
  },
  {
    icon: WalletCards,
    title: 'Fund your account',
    text: 'Fund in KSH to trade local stocks on the NSE, or in USD & GBP for International Equities, ETFs and Offshore Funds.',
    link: { href: '/fund-account/local-stocks', label: 'Fund Account' },
  },
  {
    icon: Rocket,
    title: 'Start investing',
    text: 'Minimum initial investment capital: KES 3,000. There is no minimum for future deposits — and you can buy as little as 1 share.',
    link: { href: '/faq', label: 'FAQ' },
  },
];

const FAQ_TEASER = [
  {
    q: 'What is a CDS Account?',
    a: 'A CDS (Central Depository System) account is where your shares are held electronically after buying or selling on the Nairobi Securities Exchange (NSE). To trade shares, you must open a CDS account through a Capital Markets Authority (CMA)-licensed stockbroker such as AXYS Investment Bank.',
  },
  {
    q: 'What are the charges for buying and selling shares?',
    a: 'Via DigiTrader:\n• Annual account maintenance fee: KES 200\n• Commission: 1.64%\n\nPaper-based Accounts:\n• Annual account maintenance fee: KES 1,000\n• Commission: 2.1% for trades below KES 100,000, 1.8% for trades above KES 100,000 (Stamp duty excluded)',
  },
  {
    q: 'What is the minimum amount I need to start investing?',
    a: 'Minimum initial investment capital: KES 3,000. This is not a fee, but your investment capital. There is no minimum for future deposits.',
  },
];

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const IPOS = [
  {
    slug: 'quickmart',
    name: IPO_DEFAULTS.quickmart.name,
    closes: QUICKMART_IPO.closeDate,
    facts: [
      ['Offer price', `KES ${QUICKMART_IPO.pricePerShareKes.toFixed(2)}`],
      ['Minimum', `${QUICKMART_IPO.minShares} shares`],
    ],
    href: '/ipo/quickmart',
  },
  {
    slug: 'dangote',
    name: IPO_DEFAULTS.dangote.name,
    closes: IPO_DEFAULTS.dangote.targetDate,
    facts: [],
    href: '/ipo/dangote',
  },
];

function Eyebrow({ icon: Icon = LineChart, children, light = false }) {
  return (
    <p className={`mx-eyebrow inline-flex items-center gap-2 ${light ? '!text-[#9AA6EF]' : ''}`}>
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      {children}
    </p>
  );
}

function FundCard({ fund }) {
  const [main, ...rest] = fund.performanceBoxes || [];
  return (
    <div className="mx-fund-card">
      <Eyebrow light>Fund Performance</Eyebrow>
      <p className="mx-mono text-xs text-[#9AA6EF]/80 mt-4 leading-relaxed">
        {fund.fundName}{fund.shortName ? ` / ${fund.shortName}` : ''}
      </p>
      <div className="flex items-end justify-between gap-4 mt-1">
        <div>
          {main && <p className="mx-mono text-[10px] uppercase tracking-[0.16em] text-[#9AA6EF]/70">{main.label}</p>}
          <p className="mx-mono text-2xl sm:text-3xl font-bold text-white whitespace-nowrap">{main ? main.value : '—'}</p>
        </div>
        <div className="flex flex-wrap justify-end gap-1.5">
          {rest.slice(0, 2).map((b) => (
            <span key={b.label} className="mx-badge mx-badge-up">{b.label} {b.value}</span>
          ))}
        </div>
      </div>
      <div className="mx-fund-line" aria-hidden="true" />
    </div>
  );
}

function IpoCard() {
  const open = Date.now() < new Date(QUICKMART_IPO.closeDate).getTime();
  return (
    <div className="mx-fund-card">
      <Eyebrow light icon={Rocket}>IPO {open ? '· Open now' : '· Closed'}</Eyebrow>
      <p className="mx-mono text-xs text-[#9AA6EF]/80 mt-4">{QUICKMART_IPO.name.toUpperCase()}</p>
      <div className="flex items-end justify-between gap-4 mt-1">
        <div>
          <p className="mx-mono text-[10px] uppercase tracking-[0.16em] text-[#9AA6EF]/70">Offer price per share</p>
          <p className="mx-mono text-2xl sm:text-3xl font-bold text-white whitespace-nowrap">KES {QUICKMART_IPO.pricePerShareKes.toFixed(2)}</p>
        </div>
        <span className="mx-badge mx-badge-up">Min {QUICKMART_IPO.minShares} shares</span>
      </div>
      <div className="flex items-center justify-between mt-5 text-xs mx-mono text-[#9AA6EF]/80">
        <span>Closes {formatDate(QUICKMART_IPO.closeDate)}</span>
        <Link href="/ipo/quickmart" className="mx-link inline-flex items-center gap-1 text-white">
          View offer <ArrowRight className="mx-arrow w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

function MarketsCard() {
  return (
    <div className="mx-fund-card">
      <Eyebrow light icon={Globe}>Market Access</Eyebrow>
      <ul className="mt-4 grid grid-cols-2 gap-2">
        {['Local Stocks', 'Bonds', 'International Equities', 'ETFs', 'Offshore Funds', 'IPOs'].map((m) => (
          <li key={m} className="mx-mono text-xs text-white/90 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4169E1]" aria-hidden="true" />
            {m}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FaqItem({ q, a, open, onToggle }) {
  return (
    <div className="mx-glass overflow-hidden">
      <button
        onClick={onToggle}
        aria-expanded={open}
        data-state={open ? 'open' : 'closed'}
        className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left font-semibold text-foreground"
      >
        {q}
        <ChevronDown className="mx-chevron w-5 h-5 shrink-0 text-[#0017BF] dark:text-[#9AA6EF]" />
      </button>
      <div className="mx-collapse" data-open={open ? '' : undefined} inert={!open}>
        <div>
          <p className="px-6 pb-5 text-muted-foreground leading-relaxed whitespace-pre-line">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [selectedService, setSelectedService] = useState(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [funds, setFunds] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const serviceRefs = useRef({});

  // Live offshore fund data (same source as /global-markets). Nothing is shown if empty.
  useEffect(() => {
    fetch('/api/global-funds', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { funds: [] }))
      .then((d) => setFunds((d.funds || []).filter((f) => f.performanceBoxes?.length)))
      .catch(() => setFunds([]));
  }, []);

  const services = [
    {
      id: 'local-trading',
      title: 'Local Trading',
      icon: <TrendingUp className="w-10 h-10 transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      color: '#0017BF',
      description: 'Trade Kenyan stocks and bonds on the NSE with real-time execution and expert support. Access market-leading tools and research to make informed investment decisions.',
      details: [
        'Real-time market quotes and execution',
        'Access to NSE-listed securities',
        'Expert trading support and guidance',
        'Advanced charting and technical analysis tools',
      ],
    },
    {
      id: 'global-markets',
      title: 'Global Markets Trading',
      icon: <Globe className="w-10 h-10 transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      color: '#0017BF',
      description: 'Access international equities and ETFs across major global exchanges worldwide. Diversify your portfolio with exposure to global markets and top international companies.',
      details: [
        'Access to US, European, and Asian markets',
        'Thousands of stocks and ETFs',
        'Multi-currency trading support',
        'Global market research and insights',
      ],
    },
    {
      id: 'offshore-funds',
      title: 'Offshore Funds Access',
      icon: <DollarSign className="w-10 h-10 transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      color: '#0017BF',
      description: 'Invest in diversified offshore funds with professional fund selection and management. Access curated offshore investment opportunities backed by expert analysis.',
      details: [
        'Professionally managed offshore funds',
        'Exposure to international markets',
        'Tax-efficient investment structures',
        'Dedicated offshore investing support',
      ],
    },
    {
      id: 'wealth-management',
      title: 'Wealth Management',
      icon: <Shield className="w-10 h-10 transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      color: '#0017BF',
      description: 'Personalized portfolio management and strategic wealth planning for long-term growth. Our experts help you build and protect your wealth with tailored strategies.',
      details: [
        'Customized portfolio management',
        'Financial planning and advisory',
        'Risk management strategies',
        'Long-term wealth building guidance',
      ],
    },
  ];

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setIsServiceModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#121929]">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="mx-hero mx-hero-home -mt-8 pt-8 min-h-[100svh] flex items-center">
        <AuroraBackground />
        <GridGlow />
        <NoiseOverlay />
        <WaveRibbon className="-bottom-10 opacity-50" style={{ height: 260 }} />
        <FloatingShapes items={HERO_SHAPES} />

        <div className="container mx-auto px-4 relative z-10 py-24">
          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-14 items-center">
            {/* Copy */}
            <div className="text-center lg:text-left">
              <Reveal variant="fade">
                <a
                  href="https://axys-group.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mb-10 hover:opacity-90 transition-opacity"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/axys-logo-dark.png" alt="AXYS Investment Bank" width={7892} height={2517} className="h-14 sm:h-16 w-auto mx-auto lg:mx-0 lg:-ml-9" />
                </a>
              </Reveal>
              <Reveal variant="fade" delay={100}>
                <Eyebrow light icon={BadgeCheck}>AXYS Investment Bank · Licensed by CMA &amp; CBK</Eyebrow>
              </Reveal>
              <SplitText className="mx-display text-white mt-5 mb-6">Invest in Africa. Access the World.</SplitText>
              <Reveal variant="blur" delay={350}>
                <p className="text-lg md:text-xl text-[#C9CFF5] max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Local Stocks and Bonds, International Equities, ETFs and Offshore Funds
                </p>
              </Reveal>

              <Stagger className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start items-center pt-10">
                <div className="w-full sm:w-auto">
                  <Link href="/platforms" className="block">
                    <button data-analytics-label="home_trading_platforms" data-analytics-event="button_click" className="mx-btn w-full sm:w-auto justify-center px-8 py-4 rounded-lg font-semibold text-white border border-white/20 bg-white/5 backdrop-blur hover:bg-white/10">
                      Trading Platforms
                    </button>
                  </Link>
                </div>
                <div className="group relative w-full sm:w-auto">
                  <Magnetic className="w-full sm:w-auto">
                    <button
                      type="button"
                      data-analytics-label="home_fund_account_menu"
                      data-analytics-event="button_click"
                      className="mx-btn relative w-full sm:w-auto overflow-hidden px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold shadow-lg shadow-primary/40 flex items-center justify-center gap-3"
                      aria-haspopup="true"
                    >
                      <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                      <WalletCards className="relative w-5 h-5" />
                      <span className="relative">Fund Account</span>
                      <ChevronDown className="relative w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                    </button>
                  </Magnetic>
                  <div className="invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 absolute left-0 right-0 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:group-hover:-translate-x-1/2 sm:group-focus-within:-translate-x-1/2 top-full mt-3 z-20 w-full sm:w-72 overflow-hidden rounded-lg border border-white/30 dark:border-white/10 bg-white/95 dark:bg-[#0a0a0f]/95 backdrop-blur-xl shadow-2xl transition-all duration-200">
                    <Link
                      href="/fund-account/local-stocks"
                      data-analytics-label="home_fund_account_ksh"
                      data-analytics-event="button_click"
                      className="flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-primary/10 dark:hover:bg-white/10 transition-colors"
                    >
                      <span>
                        <span className="block text-sm font-bold text-foreground dark:text-white">KSH</span>
                        <span className="block text-xs text-muted-foreground">Local stocks account</span>
                      </span>
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </Link>
                    <Link
                      href="/fund-account/offshore-funds"
                      data-analytics-label="home_fund_account_usd"
                      data-analytics-event="button_click"
                      className="flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-primary/10 dark:hover:bg-white/10 transition-colors"
                    >
                      <span>
                        <span className="block text-sm font-bold text-foreground dark:text-white">USD</span>
                        <span className="block text-xs text-muted-foreground">Offshore funds account</span>
                      </span>
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </Link>
                  </div>
                </div>
              </Stagger>
            </div>

            {/* Phones (3D sway) with floating data cards: fund data when published, otherwise the live IPO offer */}
            <div className="relative w-full max-w-xl mx-auto lg:ml-auto">
              <div className="mx-phone-glow" aria-hidden="true" />
              <Parallax speed={0.5}>
                <Reveal variant="scale" className="mx-phone-stage">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/app-mockup-hero.webp"
                    alt="DigiTrader app"
                    width={1100}
                    height={1154}
                    className="mx-phone w-full max-w-[400px] mx-auto h-auto"
                    fetchPriority="high"
                  />
                </Reveal>
              </Parallax>
              <Stagger className="relative lg:static mt-6 space-y-4 lg:mt-0 lg:space-y-0">
                <div className="lg:absolute lg:-left-10 lg:top-4 lg:w-[330px]">
                  <TiltCard className="rounded-2xl mx-float-slow">
                    {funds[0] ? <FundCard fund={funds[0]} /> : <IpoCard />}
                  </TiltCard>
                </div>
                <div className="lg:absolute lg:-right-4 lg:bottom-0 lg:w-[330px]">
                  <TiltCard className="rounded-2xl mx-float-slow mx-float-alt">
                    {funds[1] ? <FundCard fund={funds[1]} /> : funds[0] ? <IpoCard /> : <MarketsCard />}
                  </TiltCard>
                </div>
              </Stagger>
            </div>
          </div>
        </div>
      </section>

      {/* ── Credentials marquee ─────────────────────────────────────────── */}
      <section className="border-y border-[rgba(0,23,191,0.08)] dark:border-white/5 bg-[#F5F6FD] dark:bg-[#0F1423] py-5">
        <Marquee duration={40} gap="3.5rem">
          {CREDENTIALS.map((c) => (
            <span key={c} className="mx-mono text-xs uppercase tracking-[0.16em] text-[#4D5BB8] dark:text-[#9AA6EF] whitespace-nowrap inline-flex items-center gap-3">
              <span className="w-1.5 h-1.5 rotate-45 bg-[#0017BF] dark:bg-[#4169E1]" aria-hidden="true" />
              {c}
            </span>
          ))}
        </Marquee>
      </section>

      {/* ── Stats ───────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-[#121929]">
        <div className="container mx-auto px-4">
          <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden bg-[rgba(0,23,191,0.08)] dark:bg-white/5 max-w-6xl mx-auto">
            {[
              { value: content.stats.yearsInMarket, suffix: '+', label: 'Years in Market' },
              { value: content.stats.clientsServed, suffix: '+', label: 'Clients Served' },
              { value: 1.64, decimals: 2, suffix: '%', label: 'DigiTrader commission' },
              { value: 3000, prefix: 'KES ', label: 'Minimum to start' },
            ].map((s) => (
              <div key={s.label} className="bg-white dark:bg-[#121929] p-6 md:p-8 text-center lg:text-left">
                <p className="mx-eyebrow mb-4">{s.label}</p>
                <CountUp
                  className="mx-mono text-3xl md:text-4xl font-bold text-brand-blue whitespace-nowrap"
                  value={s.value}
                  decimals={s.decimals || 0}
                  prefix={s.prefix || ''}
                  suffix={s.suffix || ''}
                />
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Services ────────────────────────────────────────────────────── */}
      <section className="relative py-24 bg-[#F5F6FD] dark:bg-[#0F1423] overflow-hidden">
        <AuroraBackground variant="header" />
        <div className="container mx-auto px-4 relative z-10">
          <Reveal className="text-center mb-16">
            <Eyebrow icon={Landmark}>What we offer</Eyebrow>
            <h2 className="mx-h1 text-foreground mt-4 mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Click any service to learn more and explore what we offer.
            </p>
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {services.map((service, i) => (
              <button
                key={service.id}
                ref={(el) => { serviceRefs.current[service.id] = el; }}
                onClick={() => handleServiceClick(service)}
                className="group relative text-left w-full rounded-2xl"
                aria-label={`Learn more about ${service.title}`}
              >
                <TiltCard className="mx-glass h-full p-7 rounded-2xl">
                  <div className="flex items-start justify-between mb-8">
                    <span className="mx-service-icon">{service.icon}</span>
                    <span className="mx-mono text-xs text-[#4D5BB8] dark:text-[#9AA6EF]">0{i + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {service.description.split('.')[0]}.
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0017BF] dark:text-[#9AA6EF]">
                    Learn more <ArrowRight className="mx-arrow w-4 h-4" />
                  </span>
                </TiltCard>
              </button>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Steps (from the FAQ) ────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-[#121929]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-14">
            <Reveal className="lg:sticky lg:top-32 self-start">
              <Eyebrow icon={CalendarClock}>Getting started</Eyebrow>
              <h2 className="mx-h1 text-foreground mt-4 mb-5">Start investing in three steps</h2>
              <p className="text-muted-foreground leading-relaxed max-w-md">
                Open a CDS / Share Trading Account online, fund it, and buy your first shares on the Nairobi Securities Exchange.
              </p>
            </Reveal>
            <div className="relative pl-14">
              <DrawLine className="absolute left-[1.15rem] top-3 w-1 h-[calc(100%-1.5rem)]" />
              <Stagger className="space-y-10">
                {STEPS.map(({ icon: Icon, title, text, link }, i) => (
                  <div key={title} className="relative">
                    <span className="absolute -left-14 top-0 w-10 h-10 rounded-full grid place-items-center bg-white dark:bg-[#121929] border border-[rgba(0,23,191,0.2)] dark:border-white/15 text-[#0017BF] dark:text-[#9AA6EF] shadow-[0_0_0_6px_rgba(0,23,191,0.05)]">
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <div className="mx-glass p-6 rounded-2xl">
                      <p className="mx-eyebrow mb-2">Step 0{i + 1}</p>
                      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{text}</p>
                      <Link href={link.href} className="mx-link mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0017BF] dark:text-[#9AA6EF]">
                        {link.label} <ArrowRight className="mx-arrow w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </Stagger>
            </div>
          </div>
        </div>
      </section>

      {/* ── IPO spotlight ───────────────────────────────────────────────── */}
      <section className="mx-hero py-24">
        <AuroraBackground variant="header" />
        <GridGlow />
        <NoiseOverlay />
        <div className="container mx-auto px-4 relative z-10 max-w-6xl">
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <Eyebrow light icon={Rocket}>IPO Applications</Eyebrow>
              <h2 className="mx-h1 text-white mt-4">Apply for IPOs through AXYS</h2>
            </div>
            <Link href="/ipo" className="mx-link inline-flex items-center gap-1.5 text-sm font-semibold text-white">
              All IPOs <ArrowRight className="mx-arrow w-4 h-4" />
            </Link>
          </Reveal>
          <Stagger className="grid md:grid-cols-2 gap-6">
            {IPOS.map((ipo) => {
              const open = Date.now() < new Date(ipo.closes).getTime();
              return (
                <Link key={ipo.slug} href={ipo.href} className="block group">
                  <TiltCard className="mx-fund-card h-full">
                    <div className="flex items-center justify-between">
                      <Eyebrow light icon={TrendingUp}>{open ? 'Open now' : 'Offer closed'}</Eyebrow>
                      <ArrowUpRight className="w-5 h-5 text-white/60 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mt-6 mb-6">{ipo.name}</h3>
                    <dl className="grid grid-cols-2 gap-4">
                      {ipo.facts.map(([k, v]) => (
                        <div key={k}>
                          <dt className="mx-mono text-[10px] uppercase tracking-[0.16em] text-[#9AA6EF]/70">{k}</dt>
                          <dd className="mx-mono text-lg font-bold text-white">{v}</dd>
                        </div>
                      ))}
                      <div>
                        <dt className="mx-mono text-[10px] uppercase tracking-[0.16em] text-[#9AA6EF]/70">{open ? 'Closes' : 'Closed'}</dt>
                        <dd className="mx-mono text-lg font-bold text-white">{formatDate(ipo.closes)}</dd>
                      </div>
                    </dl>
                    <div className="mx-fund-line" aria-hidden="true" />
                  </TiltCard>
                </Link>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* ── Platform ────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-[#121929] overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <Reveal variant="left">
              <Eyebrow icon={Smartphone}>Trading Platforms</Eyebrow>
              <h2 className="mx-h1 text-foreground mt-4 mb-5">Trade on the go with DigiTrader</h2>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-md">
                Open your account online with no document uploads, then buy and sell shares from your phone or the Online Trading Portal.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="https://apps.apple.com/ke/app/aib-digitrader/id1481199787" target="_blank" rel="noopener noreferrer" className="mx-btn mx-btn-primary">
                  App Store <ArrowUpRight className="mx-arrow w-4 h-4" />
                </a>
                <a href="https://play.google.com/store/apps/details?id=com.AibCapital.AibCapitalOnline" target="_blank" rel="noopener noreferrer" className="mx-btn mx-btn-ghost">
                  Google Play <ArrowUpRight className="mx-arrow w-4 h-4" />
                </a>
                <a href="https://aibaxys.kenyaonlinetrading.com/ActiveTrader/#!/login/" target="_blank" rel="noopener noreferrer" className="mx-btn mx-btn-ghost">
                  Online Trading Portal <ArrowUpRight className="mx-arrow w-4 h-4" />
                </a>
              </div>
            </Reveal>
            <div className="relative">
              <div className="absolute inset-8 rounded-full bg-[radial-gradient(circle,rgba(0,23,191,0.25),transparent_65%)] blur-2xl" aria-hidden="true" />
              <Parallax speed={0.8}>
                <Reveal variant="scale" className="relative max-w-md mx-auto py-10">
                  <div className="mx-glass mx-float-slow rounded-3xl p-10 grid place-items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/digitrader-logo-light.png" alt="DigiTrader" width={7892} height={2517} loading="lazy" className="dark:hidden w-full max-w-[280px] h-auto" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/digitrader-logo-dark.png" alt="" aria-hidden="true" loading="lazy" className="hidden dark:block w-full max-w-[280px] h-auto" />
                  </div>
                  {[
                    { Icon: Smartphone, cls: '-top-2 left-4' },
                    { Icon: LineChart, cls: 'top-1/3 -right-6' },
                    { Icon: Shield, cls: '-bottom-2 left-1/4' },
                  ].map(({ Icon, cls }, i) => (
                    <span key={i} className={`mx-service-icon mx-float-slow absolute bg-white dark:bg-[#121929] shadow-lg ${cls}`} style={{ animationDelay: `${i * -1.7}s` }} aria-hidden="true">
                      <Icon className="text-[#0017BF] dark:text-[#9AA6EF]" />
                    </span>
                  ))}
                </Reveal>
              </Parallax>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ teaser ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#F5F6FD] dark:bg-[#0F1423]">
        <div className="container mx-auto px-4 max-w-3xl">
          <Reveal className="text-center mb-12">
            <Eyebrow icon={Shield}>FAQ</Eyebrow>
            <h2 className="mx-h1 text-foreground mt-4">Frequently Asked Questions</h2>
          </Reveal>
          <Stagger className="space-y-3">
            {FAQ_TEASER.map((f, i) => (
              <FaqItem key={f.q} {...f} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
            ))}
          </Stagger>
          <Reveal className="text-center mt-10">
            <Link href="/faq" className="mx-link inline-flex items-center gap-1.5 font-semibold text-[#0017BF] dark:text-[#9AA6EF]">
              FAQ <ArrowRight className="mx-arrow w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="mx-cta py-28 text-center">
        <NoiseOverlay />
        <WaveRibbon variant="header" className="bottom-0 opacity-40" />
        <div className="container mx-auto px-4 relative z-10 max-w-3xl">
          <SplitText as="h2" className="mx-display !text-[clamp(2.25rem,5vw,4rem)] mb-6">Ready to Start Trading?</SplitText>
          <Reveal variant="blur" delay={200}>
            <p className="text-lg text-white/80 mb-10 leading-relaxed">
              Join thousands of investors who trust AXYS Investment Bank for their trading needs.
            </p>
          </Reveal>
          <Reveal delay={350}>
            <Magnetic>
              <Link href="/contact">
                <button className="mx-btn px-10 py-5 bg-white text-[#00005B] rounded-lg font-semibold text-lg">
                  Get Started Today <ArrowRight className="mx-arrow w-5 h-5" />
                </button>
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>

      {/* Service Modal — expands from the clicked card */}
      <ServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        service={selectedService}
        originRef={{ current: selectedService ? serviceRefs.current[selectedService.id] : null }}
      />
    </div>
  );
}
