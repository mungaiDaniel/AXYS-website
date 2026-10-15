'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, DollarSign, Globe, FileText, Users, BarChart3, X, ArrowRight, CheckCircle } from 'lucide-react';
import { Reveal, Stagger, TiltCard } from '@/components/motion';
import { PageHero, Section, SectionIntro, FactCard } from '@/components/layout/PageLayout';

// ─── Inline Service Modal (no originRef needed — expands from center) ──────────
function ServiceDetailModal({ isOpen, onClose, service }) {
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Sync open/close
  if (isOpen && !isVisible && !isClosing) setIsVisible(true);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setIsVisible(false);
      onClose();
    }, 400);
  };

  if (!isVisible || !service) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        onClick={handleClose}
        style={{
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          background: 'rgba(0,0,0,0.35)',
        }}
      />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-4xl max-h-[90dvh] overflow-y-auto sm:overflow-visible sm:max-h-none rounded-2xl border border-white/30 dark:border-white/10 shadow-2xl"
        style={{
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          background: 'rgba(255,255,255,0.85)',
          animation: isClosing
            ? 'modal-card-shrink 0.4s cubic-bezier(0.6,0,0.84,0) forwards'
            : 'modal-card-expand 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards',
        }}
      >
        {/* Dark mode overlay — fully opaque */}
        <div className="absolute inset-0 rounded-2xl hidden dark:block pointer-events-none"
          style={{ background: 'rgba(15, 20, 35, 0.97)' }} />

        <div
          className="relative z-10 p-5 sm:p-10"
          style={{
            animation: isClosing
              ? 'modal-content-fade-out 0.25s ease-out forwards'
              : 'modal-content-fade-in 0.55s ease-out 0.15s forwards',
            opacity: 0,
          }}
        >
          {/* Close */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div>
              <div className="transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" style={{ color: service.color }}>{service.bigIcon}</div>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-2">
            {service.title}
          </h3>
          <div className="w-16 h-1 rounded-full mx-auto mb-6 transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" style={{ background: service.color }} />

          {/* Description */}
          <p className="text-foreground/80 leading-relaxed text-sm sm:text-base mb-6 text-center">
            {service.description}
          </p>

          {/* Separator */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-black/10 dark:bg-white/10" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Key Features</span>
            <div className="flex-1 h-px bg-black/10 dark:bg-white/10" />
          </div>

          {/* Feature Checklist */}
          <div className="border border-black/10 dark:border-white/10 rounded-xl p-4 sm:p-5 mb-6 sm:mb-8">

            <ul className="space-y-2">
              {service.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" style={{ color: service.color }} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="flex justify-center">
            <Link href="/contact" onClick={handleClose}>
              <button
                data-analytics-label="service_modal_contact_us"
                data-analytics-event="button_click"
                className="group inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg text-white"
                style={{ backgroundColor: service.color }}
              >
                <span>Get Started</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────
export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const services = [
    {
      id: 'local-stocks',
      color: '#1477bb',
      icon: <TrendingUp className="w-10 h-10 transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      bigIcon: <TrendingUp className="w-12 h-12 transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      title: 'Local Stocks',
      description: 'Access to buy and sell shares of companies listed on the Nairobi Securities Exchange. Our experienced Equities dealers act with integrity, professionalism, and in your best interest to facilitate informed and timely investment decisions.',
      features: [
        'Trade on Nairobi Securities Exchange',
        'Experienced equity dealers',
        'DigiTrader – Kenya\'s first fully automated trading platform',
        'Open CDSC accounts and trade from home',
        'Precise and timely order execution',
      ],
    },
    {
      id: 'bonds-trading',
      color: '#0017BF',
      icon: <DollarSign className="w-10 h-10 transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      bigIcon: <DollarSign className="w-12 h-12 transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      title: 'Bonds Trading',
      description: 'The Bonds Dealing Desk offers investors access to Fixed Income securities including T-bills, Euro bonds, T-bonds, and Corporate bonds. Our bond dealers have over 20 years of combined experience in the Kenyan market.',
      features: [
        'Access to T-bills, Euro bonds, T-bonds, and Corporate bonds',
        'Primary and secondary market access',
        'Expert dealers with 20+ years experience',
        'Regular insights on interest rate movements',
        'First-class trade execution',
      ],
    },
    {
      id: 'global-markets',
      color: '#0017BF',
      icon: <Globe className="w-10 h-10 transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      bigIcon: <Globe className="w-12 h-12 transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      title: 'Global Markets Execution',
      description: 'Access over 1,000 international physical securities from prestigious global exchanges including NYSE, NASDAQ, LSE, and HKEX. Diversify your portfolio with global assets across multiple industries and geographies.',
      features: [
        '1,000+ international securities',
        'NYSE, NASDAQ, LSE, HKEX access',
        'Global equities, bonds, and ETFs',
        'Portfolio diversification opportunities',
        'Access to top-performing global companies',
      ],
    },
    {
      id: 'offshore-funds',
      color: '#0017BF',
      icon: <BarChart3 className="w-10 h-10 transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      bigIcon: <BarChart3 className="w-12 h-12 transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      title: 'Offshore Funds Access',
      description: 'Seamless access to world-class offshore investment opportunities designed for long-term value creation, transparency, and investor confidence.',
      features: [
        'Axiom Africa Equity Fund',
        'Dynamic Global Equity Feeder Fund',
        'Global Sharia Funds – Sukuk and Halal Equities',
        'Global Fixed Income Funds',
        'Global Multi-Asset / Special Funds',
        'Global Index / Money Market Funds',
        'Global Exchange Traded Funds (ETFs)',
      ],
    },
    {
      id: 'market-insights',
      color: '#0017BF',
      icon: <FileText className="w-10 h-10 transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      bigIcon: <FileText className="w-12 h-12 transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      title: 'Market Insights',
      description: 'Independent, data-driven research with comprehensive, in-depth market analysis leveraging our deep expertise in the Kenyan Capital Markets and insights from world-class partners.',
      features: [
        'Independent, data-driven research',
        'Comprehensive market analysis',
        'Partners: Tellimer, S&P Global, AlphaSense',
        'Bloomberg and LSEG insights',
        'Actionable recommendations',
      ],
    },
    {
      id: 'wealth-management',
      color: '#0017BF',
      icon: <Users className="w-10 h-10 transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      bigIcon: <Users className="w-12 h-12 transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      title: 'Wealth Management',
      description: 'Expert guidance for High Net Worth Individuals, Corporates, and Institutional investors. We construct and design investment portfolios tailored to your specific needs and risk profiles.',
      features: [
        'Tailored portfolio construction',
        'Dedicated wealth / relationship managers',
        'Asset allocation guidance',
        'Diversification strategies',
        'Growth-focused portfolio building',
      ],
    },
  ];

  const handleOpen = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <PageHero
        crumbs={[{ label: 'Services' }]}
        eyebrow="What we offer"
        title="Our Services"
        subtitle={
          <>
            Comprehensive investment solutions tailored to your financial goals.
            Click any service to explore the details.
          </>
        }
        actions={
          <Link href="/contact" className="mx-btn mx-btn-primary" data-analytics-label="services_hero_contact" data-analytics-event="button_click">
            Contact Us Today <ArrowRight className="mx-arrow w-4 h-4" />
          </Link>
        }
        aside={
          <FactCard
            eyebrow="Our desks"
            icon={BarChart3}
            facts={[
              ['Global securities', '1,000+'],
              ['Bond desk experience', '20+ years'],
              ['Exchanges', 'NYSE · LSE'],
              ['Platform', 'DigiTrader'],
            ]}
          />
        }
      />

      <Section tone="white">
        <SectionIntro eyebrow="Services" title="Investment solutions" text="Tap any service to see its key features." />

        {/* Bento: feature card + four cards + full-width banner */}
        <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const featured = index === 0;
            const banner = index === services.length - 1;
            return (
              <button
                key={service.id}
                data-analytics-label={`service_card_${service.id}`}
                data-analytics-event="button_click"
                onClick={() => handleOpen(service)}
                className={`group text-left w-full rounded-2xl ${featured ? 'md:col-span-2 lg:row-span-2' : ''} ${banner ? 'md:col-span-2 lg:col-span-4' : ''}`}
              >
                <TiltCard className="h-full rounded-2xl">
                  {featured ? (
                    <div className="mx-fund-card h-full flex flex-col !p-9">
                      <div className="flex items-start justify-between">
                        <span className="mx-service-icon !bg-white/10 !border-white/15 [&_svg]:!text-white">{service.icon}</span>
                        <span className="mx-num !text-[#9AA6EF]">01</span>
                      </div>
                      <h3 className="text-3xl font-black text-white mt-10 mb-3">{service.title}</h3>
                      <p className="text-[#C9CFF5] leading-relaxed mb-6">{service.description.split('.')[0]}.</p>
                      <ul className="space-y-2.5 mt-auto">
                        {service.features.slice(0, 4).map((f) => (
                          <li key={f} className="flex items-start gap-2.5 text-sm text-white/85">
                            <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#3ddc9c]" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                        Tap to explore <ArrowRight className="mx-arrow w-4 h-4" />
                      </span>
                    </div>
                  ) : (
                    <div className={`about-member-card h-full !p-7 ${banner ? 'md:flex md:items-center md:gap-10' : 'flex flex-col'}`}>
                      <div className="about-member-glow" />
                      <div className={`relative z-10 flex items-start justify-between ${banner ? 'md:flex-col md:gap-4 md:justify-start' : 'mb-8'}`}>
                        <span className="mx-service-icon">{service.icon}</span>
                        <span className="mx-num">{String(index + 1).padStart(2, '0')}</span>
                      </div>
                      <div className="relative z-10 flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2">{service.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{service.description.split('.')[0]}.</p>
                      </div>
                      <span className="relative z-10 mt-6 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0017BF] dark:text-[#9AA6EF] shrink-0">
                        Tap to explore <ArrowRight className="mx-arrow w-4 h-4" />
                      </span>
                    </div>
                  )}
                </TiltCard>
              </button>
            );
          })}
        </Stagger>
      </Section>

      {/* CTA: navy split band */}
      <Section tone="navy">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <SectionIntro
            eyebrow="Get started"
            title="Ready to Get Started?"
            text="Let our experienced team help you navigate the markets and achieve your investment goals."
            light
            className="!mb-0"
          />
          <Reveal className="lg:justify-self-end">
            <Link href="/contact">
              <button data-analytics-label="services_contact_us_today" data-analytics-event="button_click" className="mx-btn px-8 py-4 bg-white text-[#00005B] rounded-lg font-semibold">
                Contact Us Today <ArrowRight className="mx-arrow w-4 h-4" />
              </button>
            </Link>
          </Reveal>
        </div>
      </Section>

      {/* Detail Modal */}
      <ServiceDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedService}
      />
    </div>
  );
}
