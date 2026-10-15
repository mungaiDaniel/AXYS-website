'use client';

import { useState, useEffect, useRef } from 'react';
import { useCountdown } from '@/hooks/useCountdown';
import GlassCard from '@/components/GlassCard';
import ScrollReveal from '@/components/ScrollReveal';
import ScrollRevealGroup from '@/components/ScrollRevealGroup';
import { Calendar, CheckCircle, Clock, Building2, DollarSign, TrendingUp, MapPin, ArrowRight, Download, ChevronDown, ChevronUp } from 'lucide-react';
import GlassModal from '@/components/GlassModal';
import { trackButtonClick, trackDownload } from '@/lib/analytics';
import Image from 'next/image';
import { useTheme } from '@/contexts/ThemeContext';
import { QUICKMART_IPO, quickmartIpoFaqs, quickmartIpoTimeline } from '@/lib/quickmart-ipo';
import { PageHero, Section } from '@/components/layout/PageLayout';

export default function IPOPage() {
  const [ipoSettings, setIpoSettings] = useState(null);
  const countdown = useCountdown(ipoSettings?.targetDate || QUICKMART_IPO.closeDate);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  // Video guide is optional — only shown when a URL is set in the admin IPO settings
  const videoUrl = ipoSettings?.videoUrl || '';
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const learnMoreRef = useRef(null);
  const mainVideoRef = useRef(null);
  const ambientVideoRef = useRef(null);
  // Keep the muted ambient copy on the same frame as the controlled video.
  const syncAmbientVideo = () => {
    const mainVideo = mainVideoRef.current;
    const ambientVideo = ambientVideoRef.current;
    if (!mainVideo || !ambientVideo) return;

    if (Math.abs(ambientVideo.currentTime - mainVideo.currentTime) > 0.15) {
      ambientVideo.currentTime = mainVideo.currentTime;
    }
    ambientVideo.playbackRate = mainVideo.playbackRate;
    if (mainVideo.paused) {
      ambientVideo.pause();
    } else {
      ambientVideo.play().catch(() => {});
    }
  };

  // Fetch IPO settings from admin API and poll periodically so public page reflects admin changes
  useEffect(() => {
    let mountedFlag = true;
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/ipo-settings?ipo=quickmart', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (mountedFlag) setIpoSettings(data.settings || null);
      } catch (err) {
        console.error('Failed to fetch IPO settings', err);
      }
    };

    fetchSettings();
    const interval = setInterval(fetchSettings, 10000); // poll every 10s
    return () => { mountedFlag = false; clearInterval(interval); };
  }, []);

  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Theme-aware logos — fall back to the light variants until mounted.
  const isDark = mounted && theme === 'dark';
  const quickmartLogoSrc = isDark ? '/newlogos/quickmart-logo-dark-mode.webp' : '/newlogos/quickmart-logo-light-mode.webp';
  const axysLogoSrc = isDark ? '/axys-logo-dark.png' : '/axys-logo-light.png';

  const ipoName = ipoSettings?.name || QUICKMART_IPO.name;
  const applicationFormUrl = ipoSettings?.applicationFormLink || ipoSettings?.applyNowLink || QUICKMART_IPO.applyPortalUrl;
  const applyNowLink = ipoSettings?.applyNowLink || applicationFormUrl;

  const offerDetails = [
    {
      icon: <DollarSign className="w-5 h-5 text-brand-blue transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      title: 'Offer Price',
      value: 'KES 7.50 per Ordinary Share (fixed price)',
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-brand-blue transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      title: 'Shares on Offer',
      value: '2,000,000,000 Ordinary Shares of KES 0.20 each (50% of the issued share capital), offered for sale by Sokoni Retail Kenya Limited',
    },
    {
      icon: <Building2 className="w-5 h-5 text-brand-blue transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      title: 'Gross Offer Proceeds',
      value: 'KES 15,000,000,000 — implied market capitalisation of KES 30 billion',
    },
    {
      icon: <MapPin className="w-5 h-5 text-brand-blue transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      title: 'Listing Venue',
      value: 'Nairobi Securities Exchange (NSE) — Main Investment Market Segment',
    },
    {
      icon: <DollarSign className="w-5 h-5 text-brand-blue transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      title: 'Minimum Application',
      value: '500 shares (KES 3,750), then in multiples of 100 shares. No maximum. A valid CDS account is required.',
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-brand-blue transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      title: 'Projected FY2026 Dividend',
      value: 'KES 0.50 per share — implied dividend yield of 6.7% at the Offer Price',
    },
    {
      icon: <Clock className="w-5 h-5 text-brand-blue transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      title: 'Offer Closes',
      value: '30 October 2026 at 5:00pm EAT (last day of payment for retail investors)',
    },
    {
      icon: <MapPin className="w-5 h-5 text-brand-blue transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      title: 'How to Apply',
      value: `Apply online on the official IPO portal, dial ${QUICKMART_IPO.ussdCode} (up to KES 250,000), or submit an Application Form through AXYS Investment Bank, an Authorised Placing Agent.`,
      link: applicationFormUrl,
      linkLabel: 'Apply on the IPO Portal',
      hasVideo: true,
    },
  ];

  return (
    <div className="min-h-screen relative">
      <PageHero
        crumbs={[{ label: 'IPO', href: '/ipo' }, { label: 'Quick Mart PLC IPO' }]}
        eyebrow="IPO Applications"
        title={ipoName}
        subtitle={<>Offer for Sale of 2,000,000,000 shares in Kenya&apos;s second-largest supermarket chain at KES 7.50 per share — listing on the NSE Main Investment Market Segment</>}
        aside={
          <div className="mx-fund-card">
            {(() => {
              const showCountdown = ipoSettings ? ipoSettings.isActive !== false : true;
              if (!showCountdown) return null;

              if (countdown.isExpired) {
                return (
                  <div>
                    <p className="mx-eyebrow !text-[#9AA6EF] inline-flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5" /> Status
                    </p>
                    <h2 className="text-2xl font-black text-white mt-4 mb-2">Offer Period Closed</h2>
                    <p className="text-sm text-[#C9CFF5]">
                      The Quick Mart PLC IPO offer period has ended. Contact us for allocation updates.
                    </p>
                  </div>
                );
              }

              return (
                <div>
                  <p className="mx-eyebrow !text-[#9AA6EF] inline-flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> Offer Closes In:
                  </p>
                  <div className="grid grid-cols-4 gap-2 mt-5 text-center">
                    {[
                      { value: countdown.days, label: 'Days' },
                      { value: countdown.hours, label: 'Hours' },
                      { value: countdown.minutes, label: 'Minutes' },
                      { value: countdown.seconds, label: 'Seconds' },
                    ].map(({ value, label }) => (
                      <div key={label} className="rounded-xl bg-white/5 border border-white/10 py-3">
                        <div className="mx-mono text-3xl font-bold text-white tabular-nums">{value}</div>
                        <div className="mx-mono text-[10px] uppercase tracking-[0.14em] text-[#9AA6EF] mt-1">{label}</div>
                      </div>
                    ))}
                  </div>
                  <button
                    ref={learnMoreRef}
                    onClick={() => setIsModalOpen(true)}
                    className="mx-btn w-full justify-center mt-6 px-8 py-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-500"
                  >
                    Apply Now & Learn More <ArrowRight className="mx-arrow w-4 h-4" />
                  </button>
                </div>
              );
            })()}
            <div className="mx-fund-line" aria-hidden="true" />
          </div>
        }
      >
        {/* Share calculator disabled until we get the go-ahead — uncomment to re-enable
          <a href="/ipo/quickmart/share-calculator" className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#0017bf] px-6 py-3 font-semibold text-white transition hover:bg-[#1477bb]">
            Calculate your shares
          </a>
          */}
      </PageHero>

      <Section tone="white">
        {/* Offer Details — heading + two-column layout */}
        <ScrollReveal type="fadeUp" className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
            <span className="gradient-text">Offer Details</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Left Column — IPO Timeline */}
            <div className="relative">
              {/* Vertical gradient line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#0017BF] dark:from-[#0017bf] to-[#00BCD4]" />

              <div className="space-y-6">
                {quickmartIpoTimeline.map((item, index) => (
                  <div key={index} className="relative flex items-start">
                    {/* Timeline dot */}
                    <div className="absolute left-6 w-5 h-5 rounded-full bg-primary border-4 border-background z-10" />
                    <div className="ml-14 sm:ml-20 w-full">
                      <GlassCard hover3d className="p-5">
                        <div className="flex items-center space-x-3 mb-1">
                          <Calendar className="w-5 h-5 text-brand-blue transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />
                          <h3 className="text-lg font-bold text-foreground">{item.phase}</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">{item.date}</p>
                      </GlassCard>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile-only separator */}
            <div className="lg:hidden flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                Offer Details
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            {/* Right Column — Offer Detail Items */}
            <div className="relative">
              {/* Vertical gradient line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#00BCD4] to-[#0017BF] dark:to-[#0017bf]" />

              <div className="space-y-6">
                {offerDetails.map((detail, index) => (
                  <div key={index} className="relative flex items-start">
                    <div className="ml-14 sm:ml-20 w-full">
                      <GlassCard hover3d className="p-5">
                        <div className="flex items-center space-x-3 mb-1">
                          {detail.icon}
                          <h3 className="text-lg font-bold text-foreground">{detail.title}</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">{detail.value}</p>
                        {detail.link && (
                          <div className="flex flex-wrap items-center gap-4 mt-3">
                            <a
                              href={detail.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => trackButtonClick('apply_portal', window.location.pathname, { destination: detail.link })}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0017bf] dark:text-[#1477bb] hover:underline"
                            >
                              <Download className="w-3.5 h-3.5" />
                              {detail.linkLabel}
                            </a>
                            {detail.hasVideo && videoUrl && (
                              <button
                                type="button"
                                onClick={() => setIsVideoOpen(true)}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                              >
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                Watch Video Guide
                              </button>
                            )}
                          </div>
                        )}
                      </GlassCard>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </ScrollReveal>

      </Section>

      <Section tone="tint">
        {/* Key Partners */}
        <ScrollReveal type="fadeUp" className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            <span className="gradient-text">Key Parties to the Offer</span>
          </h2>
          <GlassCard className="p-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 items-start justify-items-center">

              {[
                { role: 'Issuer', name: 'Quick Mart PLC', detail: '72 stores across 16 counties', logo: quickmartLogoSrc },
                // The NSE logo has dark text, so it sits on a white tile in dark mode.
                { role: 'Listing Venue', name: 'Nairobi Securities Exchange (NSE)', detail: 'Main Investment Market Segment', logo: '/newlogos/nse-logo.png', tile: true },
                { role: 'Authorised Placing Agent', name: 'AXYS Investment Bank', detail: 'Apply through us', logo: axysLogoSrc },
              ].map((party) => (
                <div key={party.role} className="flex flex-col items-center gap-3 w-full text-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#0017bf] dark:text-[#1477bb]">
                    {party.role}
                  </span>
                  <div className={`relative w-full max-w-[220px] h-16 md:h-20 transition-transform hover:scale-105 duration-300 ${party.tile ? 'dark:bg-white dark:rounded-lg' : ''}`}>
                    <Image src={party.logo} alt={party.name} fill className={`object-contain ${party.tile ? 'dark:p-2' : ''}`} />
                  </div>
                  <span className="text-sm font-bold text-foreground">{party.name}</span>
                  <span className="text-sm text-muted-foreground">{party.detail}</span>
                </div>
              ))}

            </div>
            <p className="text-xs text-muted-foreground text-center mt-6">
              Lead Transaction Advisors: SBG Securities Limited and Stanbic Bank Kenya Limited. Receiving Bank: Stanbic Bank Kenya Limited.
              AXYS Investment Bank is an Authorised Placing Agent for the Offer.
            </p>
          </GlassCard>
        </ScrollReveal>

      </Section>

      <Section tone="white">
        {/* IPO FAQ Section */}
        <ScrollReveal type="fadeUp" className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            <span className="gradient-text">Frequently Asked Questions</span>
          </h2>
          <GlassCard className="p-0 overflow-hidden">
            {quickmartIpoFaqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className="border-b border-border last:border-b-0">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-primary/5 transition-colors duration-200"
                  >
                    <span className="font-semibold text-foreground pr-4">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {faq.a}
                      {faq.formLink && (
                        <div className="flex flex-wrap items-center gap-4 mt-3">
                          <a
                            href={faq.formLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackButtonClick('apply_portal_faq', window.location.pathname, { destination: faq.formLink })}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0017bf] dark:text-[#1477bb] hover:underline"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Apply on the IPO Portal
                          </a>
                          {faq.hasVideo && videoUrl && (
                            <button
                              type="button"
                              onClick={() => setIsVideoOpen(true)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                            >
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                              Watch Video Guide
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </GlassCard>
        </ScrollReveal>

      </Section>

      {/* Learn More Modal */}
      <GlassModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} originRef={learnMoreRef}>
        <div className="flex flex-col h-full">
          <div className="pt-4 mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#00005b] dark:text-white mb-3">
              About the Quick Mart PLC IPO
            </h3>
            <div className="w-20 h-1 bg-brand-blue rounded-full" />
          </div>

          <div className="space-y-5 text-foreground leading-relaxed font-medium text-sm sm:text-base">
            <p>
              Sokoni Retail Kenya Limited is offering 2,000,000,000 existing ordinary shares in Quick Mart PLC
              (50% of the Company) at a fixed price of KES 7.50 per share by way of an Offer for Sale, with
              listing on the Main Investment Market Segment of the Nairobi Securities Exchange on 12 November 2026.
            </p>
            <p>
              The Offer is open from 5 October to 30 October 2026. The minimum application is 500 shares, and a
              valid CDS account is required. The International Finance Corporation (IFC) has conditionally agreed
              to participate as a cornerstone investor.
            </p>

            {/* Business Card */}
            <div className="p-5 mt-6 bg-muted/50 dark:bg-muted/30 border border-border rounded-2xl shadow-sm">
              <h4 className="font-bold text-brand-blue mb-2 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-brand-blue" />
                The Business
              </h4>
              <p className="text-sm text-muted-foreground font-medium">
                Kenya&apos;s second-largest supermarket chain with about 15% of the modern grocery market — 72 stores
                across 16 counties, FY2025 revenue of KES 50.4 billion (18.4% CAGR since FY2021) and about 2.5 million
                Q-Points loyalty members.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 pb-2">
            <a
              href="/api/download/ipo-prospectus"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackDownload('download_im', window.location.pathname, { document: 'Quick Mart PLC Information Memorandum' })}
              className="group inline-flex items-center justify-center w-full sm:w-auto px-6 py-4 border-2 border-border dark:border-white/20 text-foreground rounded-lg font-semibold hover:bg-muted/50 dark:hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Download className="mr-2 w-5 h-5" />
              <span>Information Memorandum</span>
            </a>
            <a
              href={applicationFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackButtonClick('apply_portal_modal', window.location.pathname, { destination: applicationFormUrl })}
              className="group inline-flex items-center justify-center w-full sm:w-auto px-6 py-4 border-2 border-green-600 dark:border-green-500 text-green-700 dark:text-green-400 rounded-lg font-semibold hover:bg-green-600/10 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Download className="mr-2 w-5 h-5" />
              <span>Application Portal</span>
            </a>
            {videoUrl ? (
              <button
                onClick={() => setIsVideoOpen(true)}
                className="group inline-flex items-center justify-center w-full sm:w-auto px-6 py-4 bg-gray-800 dark:bg-white/10 text-white rounded-lg font-semibold hover:bg-gray-700 dark:hover:bg-white/20 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <svg className="mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                <span>Watch Video</span>
              </button>
            ) : (
              <button
                disabled
                title="Video coming soon"
                className="group inline-flex items-center justify-center w-full sm:w-auto px-6 py-4 bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-white/40 rounded-lg font-semibold cursor-not-allowed opacity-60"
              >
                <svg className="mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                <span>Watch Video</span>
              </button>
            )}
            <a
              href={applyNowLink}
              onClick={() => trackButtonClick('apply_now', window.location.pathname, { destination: applyNowLink })}
              className="group inline-flex items-center justify-center w-full sm:w-auto px-6 py-4 bg-red-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-red-600/40 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span>Apply Now</span>
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Apply online at the official IPO portal, dial {QUICKMART_IPO.ussdCode}, or contact our team to apply through AXYS Investment Bank. Applications close 30 October 2026 at 5:00pm EAT.
          </p>
        </div>
      </GlassModal>

      {/* Global Video Modal */}
      {isVideoOpen && videoUrl && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6"
          onClick={() => setIsVideoOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800 text-white">
              <span className="font-semibold text-sm">Quick Mart PLC IPO Video Guide</span>
              <button
                onClick={() => setIsVideoOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition cursor-pointer"
                aria-label="Close video"
              >
                ✕
              </button>
            </div>
            <div className="relative h-[70vh] min-h-[360px] max-h-[720px] overflow-hidden bg-[#211923]">
              {/* A muted, mirrored copy fills the landscape player behind the portrait guide. */}
              <video
                ref={ambientVideoRef}
                aria-hidden="true"
                muted
                playsInline
                preload="metadata"
                className="pointer-events-none absolute inset-0 h-full w-full scale-[1.15] -scale-x-100 object-cover opacity-70 blur-[42px] brightness-[0.6] saturate-[1.3]"
              >
                <source src={encodeURI(decodeURI(videoUrl))} type="video/mp4" />
              </video>
              <div className="pointer-events-none absolute inset-0 bg-black/20" />
              <video
                ref={mainVideoRef}
                controls
                autoPlay
                playsInline
                preload="metadata"
                className="relative z-10 mx-auto h-full max-w-full bg-transparent object-contain shadow-2xl"
                onLoadedMetadata={syncAmbientVideo}
                onPlay={syncAmbientVideo}
                onPause={syncAmbientVideo}
                onSeeking={syncAmbientVideo}
                onSeeked={syncAmbientVideo}
                onTimeUpdate={syncAmbientVideo}
                onRateChange={syncAmbientVideo}
              >
                <source src={encodeURI(decodeURI(videoUrl))} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
