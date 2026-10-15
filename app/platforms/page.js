'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Apple, Play, BarChart3, ShieldCheck, LineChart, Clock, FileBarChart, Wallet, ChevronRight } from 'lucide-react';
import {
  AuroraBackground, GridGlow, NoiseOverlay, WaveRibbon, Reveal, Stagger, Parallax,
} from '@/components/motion';
import { Section, SectionIntro } from '@/components/layout/PageLayout';

const STORE_LINKS = [
  {
    href: 'https://aibaxys.kenyaonlinetrading.com/ActiveTrader/#!/login/',
    icon: BarChart3,
    small: 'Access the',
    label: 'Online Trading Portal',
  },
  {
    href: 'https://apps.apple.com/ke/app/aib-digitrader/id1481199787',
    icon: Apple,
    small: 'Download on the',
    label: 'App Store',
  },
  {
    href: 'https://play.google.com/store/apps/details?id=com.AibCapital.AibCapitalOnline',
    icon: Play,
    small: 'Download on the',
    label: 'Google Play',
  },
];

// Capabilities described in the Online Share Trading Platform text below.
const CAPABILITIES = [
  { icon: ShieldCheck, label: 'Secure e-transactions' },
  { icon: LineChart, label: 'Real time market prices' },
  { icon: BarChart3, label: 'Order placement' },
  { icon: Clock, label: '24-hour access to the account' },
  { icon: FileBarChart, label: 'Portfolio valuations & statements' },
  { icon: Wallet, label: 'Fund accounts & receive payments' },
];

export default function PlatformsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="mx-hero mx-hero-home mx-page-hero">
        <AuroraBackground />
        <GridGlow />
        <NoiseOverlay />
        <WaveRibbon variant="header" className="bottom-0 opacity-40" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <Reveal variant="fade">
                <nav aria-label="Breadcrumb" className="mb-8">
                  <ol className="flex items-center gap-1.5 mx-mono text-[11px] uppercase tracking-[0.16em] text-[#9AA6EF]">
                    <li><Link href="/" className="mx-link hover:text-white">Home</Link></li>
                    <li className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 opacity-60" /><span className="text-white/90">Platforms</span></li>
                  </ol>
                </nav>
              </Reveal>
              <Reveal variant="blur">
                <h1>
                  <span className="sr-only">DigiTrader</span>
                  <Image
                    src="/digitrader-logo-dark.png"
                    alt=""
                    width={1400}
                    height={350}
                    className="w-full max-w-md h-auto mx-no-float"
                    priority
                  />
                </h1>
              </Reveal>
              <Reveal variant="fade" delay={150}>
                <p className="mx-eyebrow !text-[#9AA6EF] mt-8">Trading Platforms</p>
              </Reveal>

              {/* Download Buttons */}
              <Stagger className="grid sm:grid-cols-3 gap-3 mt-6 max-w-xl">
                {STORE_LINKS.map(({ href, icon: Icon, small, label }) => (
                  <Link key={label} href={href} target="_blank" rel="noopener noreferrer" className="mx-store">
                    <Icon className={`w-6 h-6 shrink-0 ${label === 'Google Play' ? 'fill-current' : ''}`} />
                    <span className="text-left leading-tight">
                      <span className="block text-[10px] opacity-75">{small}</span>
                      <span className="block text-sm font-bold">{label}</span>
                    </span>
                  </Link>
                ))}
              </Stagger>
            </div>

            {/* Phone Mockup */}
            <div className="relative w-full max-w-lg mx-auto">
              <div className="mx-phone-glow" aria-hidden="true" />
              <Parallax speed={0.5}>
                <Reveal variant="scale" className="mx-phone-stage">
                  <Image
                    src="/app-mockup-hero.webp"
                    alt="Digitrader Mobile App"
                    width={1100}
                    height={1154}
                    className="mx-phone w-full max-w-[420px] mx-auto h-auto"
                    priority
                  />
                </Reveal>
              </Parallax>
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      <Section tone="white">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20">
          <div className="lg:sticky lg:top-28 self-start">
            <SectionIntro eyebrow="OST" title="Online Share Trading Platform" className="!mb-0" />
          </div>
          <div>
            <Stagger className="space-y-6">
              <p className="mx-lead text-lg md:text-xl">
                Our Online Share Trading Platform (OST) is built to increase accessibility and proximity to stock brokerage services as it allows for secure e-transactions, real time market prices and order placement and most importantly, a 24-hour access to the account.
              </p>
              <p className="text-lg text-foreground/80 leading-relaxed">
                Through the OST, investors are able to access various reports such as portfolio valuations, transaction statements and stock holding reports via their mobile phones and web portal. Through this platform, clients are able to fund their trading accounts, receive payments and get market data from their mobile devices.
              </p>
            </Stagger>
            <Stagger className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-10">
              {CAPABILITIES.map(({ icon: Icon, label }) => (
                <div key={label} className="mx-stat-tile flex flex-col gap-3">
                  <Icon className="w-5 h-5 text-[#0017bf] dark:text-[#9AA6EF]" />
                  <span className="text-sm font-semibold text-foreground">{label}</span>
                </div>
              ))}
            </Stagger>
          </div>
        </div>
      </Section>
    </div>
  );
}
