'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useCountdown } from '@/hooks/useCountdown';
import GlassCard from '@/components/GlassCard';
import ScrollReveal from '@/components/ScrollReveal';
import ScrollRevealGroup from '@/components/ScrollRevealGroup';
import content from '@/config/content.json';
import { Calendar, CheckCircle, Clock, Building2, DollarSign, TrendingUp, MapPin, ArrowRight, Download, ChevronDown, ChevronUp } from 'lucide-react';
import GlassModal from '@/components/GlassModal';
import { trackButtonClick, trackDownload } from '@/lib/analytics';
import { useTheme } from '@/contexts/ThemeContext';
import { PageHero, Section } from '@/components/layout/PageLayout';

export default function IPOPage() {
  const [ipoSettings, setIpoSettings] = useState(null);
  const countdown = useCountdown(ipoSettings?.targetDate || content.ipoDate);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  // Video URL sourced from admin config or defaults to the uploaded MP4
  const videoUrl = ipoSettings?.videoUrl || '/newlogos/IMG_3454.mp4';
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const learnMoreRef = useRef(null);
  const mainVideoRef = useRef(null);
  const ambientVideoRef = useRef(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        const res = await fetch('/api/admin/ipo-settings?ipo=dangote', { cache: 'no-store' });
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

  // Theme-aware party logos — fall back to their light variants until mounted.
  const axysLogoSrc = mounted && theme === 'dark'
    ? '/axys-logo-dark.png'
    : '/axys-logo-light.png';
  const dangoteLogoSrc = mounted && theme === 'dark'
    ? '/newlogos/dangote-logo-dark-mode.png'
    : '/newlogos/dangote-logo-light-mode.png';
  const ngxLogoSrc = mounted && theme === 'dark'
    ? '/newlogos/ngx-logo-dark-mode.png'
    : '/newlogos/ngx-logo-light-mode.png';
  const ipoName = ipoSettings?.name || 'Dangote Petroleum Refinery IPO';
  const applicationFormUrl = ipoSettings?.applicationFormLink || ipoSettings?.applyNowLink || 'https://aib-axysafrica.com/documents/1790075537485-DANGOTE_IPO_CLIENT_OPT-IN_FORM_VF1_.pdf';
  const applyNowLink = ipoSettings?.applyNowLink || applicationFormUrl;

  const offerDetails = [
    {
      icon: <DollarSign className="w-5 h-5 text-brand-blue transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      title: 'Offer Price',
      value: '₦525.00 per Ordinary Share',
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-brand-blue transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      title: 'Shares on Offer',
      value: 'Up to 4,100,000,000 Ordinary Shares of US$0.000013 each',
    },
    {
      icon: <Building2 className="w-5 h-5 text-brand-blue transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      title: 'Gross Offer Proceeds',
      value: '₦2,152,500,000,000.00',
    },
    {
      icon: <MapPin className="w-5 h-5 text-brand-blue transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      title: 'Listing Venue',
      value: 'Nigerian Exchange Limited (NGX) — Main Board',
    },
    {
      icon: <DollarSign className="w-5 h-5 text-brand-blue transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      title: 'Minimum Subscription',
      value: 'Minimum USD 2,000.00 investment via AXYS Investment Bank, 2% entry fee and transaction cost',
    },
    {
      icon: <Clock className="w-5 h-5 text-brand-blue transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      title: 'Application List Closes',
      value: '7th October 2026 for AXYS clients (allows consolidation of funds and remittance to Nigeria; official NGX close: 13th October 2026)',
    },
    {
      icon: <MapPin className="w-5 h-5 text-brand-blue transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      title: 'Application Channel',
      value: 'Via AXYS Investment Bank — download and complete the Client Application Form to participate',
      link: applicationFormUrl,
      linkLabel: 'Download Application Form',
      hasVideo: true,
    },
  ];

  const dangoteFaqs = [
    {
      q: 'What is the Dangote Petroleum Refinery & Petrochemicals IPO?',
      a: 'Dangote Petroleum Refinery and Petrochemicals FZE ("DPRP") is offering up to 4,100,000,000 Ordinary Shares of US$0.000013 each for subscription at ₦525.00 per share, by way of an Offer for Subscription. DPRP owns and operates a 700,000 bpd integrated refining and petrochemical complex in the Dangote Industries Free Zone, Lagos, Nigeria, and is applying for admission to the Main Board of the Nigerian Exchange Limited (NGX).',
    },
    {
      q: 'What are the key dates for the Offer?',
      a: 'Indicative timetable:\n• Application List Opens: 14 September 2026\n• Application List Closes: 13 October 2026\n• Collation of Returns: 27 October 2026\n• SEC No-Objection to Basis of Allotment: 11 November 2026\n• Allotment Announcement: Allotment Date + 1 Business Day\n• NGX Listing / Commencement of Trading: Allotment Date + 15 Business Days\n\nDates are indicative and subject to regulatory approval.',
    },
    {
      q: 'What is the Offer Price and minimum subscription?',
      a: 'The Offer Price is ₦525.00 per Ordinary Share (US$0.385 at ₦1,364/US$1 as at 5 August 2026), payable in full on application. Via AXYS Investment Bank, the minimum investment is USD 2,000.00, subject to a 2% entry fee and transaction costs.',
    },
    {
      q: 'When does the Offer open and close?',
      a: 'The Offer opens at 8:00am WAT on 14 September 2026 and closes at 11:59pm WAT on 13 October 2026 via electronic channels. AXYS Investment Bank clients must submit their applications by 7 October 2026 to allow sufficient time to consolidate and transfer funds to Nigeria.',
    },
    {
      q: 'How do I participate from Kenya?',
      a: 'AXYS Investment Bank is facilitating client participation in the Offer via an omnibus account. To participate, download the Client Application Form, complete it, and return it to our team along with your funding instructions by 7 October 2026. The minimum investment is USD 2,000.00 and a 2% entry fee plus transaction costs apply. Both KES and USD deposits are accepted, though USD deposits are encouraged. Allotments are not guaranteed and are subject to the Basis of Allotment approved by the Nigerian SEC.',
      formLink: applicationFormUrl,
      hasVideo: true,
    },
    {
      q: 'What currency risk applies to this investment?',
      a: 'The Offer Shares are priced and settled in Nigerian Naira (₦). Amounts invested via AXYS Investment Bank in KES or USD are converted for the purposes of the application, and the final allocation value is subject to the applicable exchange rate at the date of allotment. The value of the investment and any returns, when measured in KES, may rise or fall with movements in the USD/NGN/KES exchange rates.',
    },
    {
      q: 'What is the purpose of the Offer?',
      a: 'Net Offer proceeds of approximately ₦2,111,007,217,311.09 (after estimated Offer costs of ₦41,492,782,688.91) will be applied to DPRP\'s refinery expansion programme — increasing refining capacity by a further approximately 700,000 bpd. The Offer is also intended to broaden DPRP\'s public ownership and shareholder base ahead of listing on the NGX Main Board.',
    },
  ];

  return (
    <div className="min-h-screen relative">
      <PageHero
        crumbs={[{ label: 'IPO', href: '/ipo' }, { label: 'Dangote Petroleum Refinery IPO' }]}
        eyebrow="IPO Applications"
        title={ipoName}
        subtitle={<>Offer for Subscription of up to 4,100,000,000 Ordinary Shares at ₦525.00 per share — listing on the NGX Main Board</>}
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
                      The Dangote Petroleum Refinery IPO offer period has ended. Contact us for allocation updates.
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
          <a href="/ipo/dangote/share-calculator" className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#0017bf] px-6 py-3 font-semibold text-white transition hover:bg-[#1477bb]">
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
                {content.ipoTimeline.map((item, index) => (
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
                              onClick={() => trackDownload('download_application_form', window.location.pathname, { document: 'Client Application Form' })}
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

              {/* Issuer */}
              <div className="flex flex-col items-center gap-3 w-full text-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <span className="transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]">Issuer</span>
                </span>
                <div className="relative w-full max-w-[220px] h-16 md:h-20 transition-transform hover:scale-105 duration-300">
                  <Image src={dangoteLogoSrc} alt="Dangote Petroleum Refinery & Petrochemicals FZE" fill className="object-contain" />
                </div>
                <span className="text-sm font-bold text-foreground">Dangote Petroleum Refinery &amp; Petrochemicals FZE</span>
              </div>

              {/* Listing Venue */}
              <div className="flex flex-col items-center gap-3 w-full text-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <span className="transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]">Listing Venue</span>
                </span>
                <div className="relative w-full max-w-[220px] h-16 md:h-20 transition-transform hover:scale-105 duration-300">
                  <Image src={ngxLogoSrc} alt="Nigerian Exchange Limited" fill className="object-contain" />
                </div>
                <span className="text-sm font-bold text-foreground">Nigerian Exchange Limited (NGX)</span>
              </div>

              {/* Facilitating Broker */}
              <div className="flex flex-col items-center gap-3 w-full text-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <span className="transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]">Facilitating Broker</span>
                </span>
                <div className="relative w-full max-w-[220px] h-16 md:h-20 transition-transform hover:scale-105 duration-300">
                  <Image
                    src={axysLogoSrc}
                    alt="AXYS Investment Bank - Facilitating Broker"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-sm font-bold text-foreground">AXYS Investment Bank</span>
              </div>

            </div>
            <p className="text-xs text-muted-foreground text-center mt-6">
              AXYS Investment Bank is not a registered Issuing House or Receiving Agent for this Offer.
              We facilitate client participation via an omnibus account, subject to the terms on the Client Application Form below.
            </p>
          </GlassCard>
        </ScrollReveal>

      </Section>

      <Section tone="white">
        {/* Dangote IPO FAQ Section */}
        <ScrollReveal type="fadeUp" className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            <span className="gradient-text">Frequently Asked Questions</span>
          </h2>
          <GlassCard className="p-0 overflow-hidden">
            {dangoteFaqs.map((faq, index) => {
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
                            onClick={() => trackDownload('download_application_form_faq', window.location.pathname, { document: 'Client Application Form' })}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0017bf] dark:text-[#1477bb] hover:underline"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download Client Application Form
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
              About the Dangote Petroleum Refinery IPO
            </h3>
            <div className="w-20 h-1 bg-brand-blue rounded-full" />
          </div>

          <div className="space-y-5 text-foreground leading-relaxed font-medium text-sm sm:text-base">
            <p>
              Dangote Petroleum Refinery and Petrochemicals FZE (&quot;DPRP&quot;) is offering up to 4,100,000,000
              Ordinary Shares of US$0.000013 each at ₦525.00 per share, by way of an Offer for Subscription, with
              application to list on the Main Board of the Nigerian Exchange Limited (NGX).
            </p>
            <p>
              Net proceeds are earmarked for DPRP&apos;s refinery expansion programme, increasing capacity by a
              further approximately 700,000 bpd from the current 700,000 bpd nameplate capacity.
            </p>

            {/* Anchor Asset Card */}
            <div className="p-5 mt-6 bg-muted/50 dark:bg-muted/30 border border-border rounded-2xl shadow-sm">
              <h4 className="font-bold text-brand-blue mb-2 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-brand-blue" />
                The Refinery
              </h4>
              <p className="text-sm text-muted-foreground font-medium">
                A 700,000 bpd integrated refining and petrochemical complex within the Dangote Industries Free
                Zone, Lagos, Nigeria — one of the largest single-train refineries in the world.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 pb-2">
            <a
              href="/api/download/dangote-prospectus"
              download="Dangote-Petroleum-Refinery-Prospectus.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackDownload('download_im', window.location.pathname, { document: 'Dangote Petroleum Refinery Prospectus' })}
              className="group inline-flex items-center justify-center w-full sm:w-auto px-6 py-4 border-2 border-border dark:border-white/20 text-foreground rounded-lg font-semibold hover:bg-muted/50 dark:hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Download className="mr-2 w-5 h-5" />
              <span>Download Prospectus</span>
            </a>
            <a
              href="/api/download/dangote-brief"
              download="Dangote-Brief-Presentation.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackDownload('download_axys_brief', window.location.pathname, { document: 'AXYS Dangote Research Brief' })}
              className="group inline-flex items-center justify-center w-full sm:w-auto px-6 py-4 border-2 border-[#0017bf] dark:border-[#1477bb] text-[#0017bf] dark:text-[#1477bb] rounded-lg font-semibold hover:bg-[#0017bf]/10 dark:hover:bg-[#1477bb]/10 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Download className="mr-2 w-5 h-5" />
              <span>Download AXYS Prospectus</span>
            </a>
            <a
              href={applicationFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackDownload('download_application_form_modal', window.location.pathname, { document: 'Client Application Form' })}
              className="group inline-flex items-center justify-center w-full sm:w-auto px-6 py-4 border-2 border-green-600 dark:border-green-500 text-green-700 dark:text-green-400 rounded-lg font-semibold hover:bg-green-600/10 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Download className="mr-2 w-5 h-5" />
              <span>Download Application Form</span>
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
            Download the Application Form, complete it and return it to our team. &quot;Apply Now&quot; downloads the pre-filled AXYS client opt-in form.
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
              <span className="font-semibold text-sm">Dangote Petroleum Refinery & Petrochemicals IPO Video Guide</span>
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
