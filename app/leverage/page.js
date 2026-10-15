'use client';

import { TrendingUp, Shield, Zap, CheckCircle, FileText, Wallet, Send, ArrowRightLeft, ArrowRight } from 'lucide-react';
import { Reveal, Stagger, DrawLine } from '@/components/motion';
import { PageHero, Section, SectionIntro } from '@/components/layout/PageLayout';

export default function LeveragePage() {
  const features = [
    {
      icon: <TrendingUp className="w-8 h-8 text-[#0017bf] dark:text-[#9AA6EF]" />,
      title: 'Competitive Rates',
      description: 'Access leverage up to 5x (1:4) with competitive interest rates',
    },
    {
      icon: <Shield className="w-8 h-8 text-[#0017bf] dark:text-[#9AA6EF]" />,
      title: 'Bank-Led Security',
      description: 'Client funds are deposited directly into their settlement account held at our partnering bank, with all withdrawals and refunds returning to the same account',
    },
    {
      icon: <Zap className="w-8 h-8 text-[#0017bf] dark:text-[#9AA6EF]" />,
      title: 'Seamless Execution',
      description: 'Smooth trade execution with comprehensive market monitoring',
    },
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Simple Onboarding',
      icon: <FileText className="w-6 h-6" />,
      description: 'Express your interest and sign a single Master Document Pack. If you don\'t have a CDSC account, visit our offices or download DigiTrader to open one.',
    },
    {
      step: 2,
      title: 'Account & Funding',
      icon: <Wallet className="w-6 h-6" />,
      description: 'Once approved, a dedicated transaction account is opened. You simply deposit your Cash Cover, and we top up the rest to create your 100% funding pool.',
    },
    {
      step: 3,
      title: 'IPO Application Made Easy',
      icon: <Send className="w-6 h-6" />,
      description: 'We handle the administration. Your IPO application is processed and linked directly to your financing facility.',
    },
    {
      step: 4,
      title: 'Flexible Exit & Refunds',
      icon: <ArrowRightLeft className="w-6 h-6" />,
      description: 'IPO refunds are credited back to your account automatically. When you are ready to sell, or if an exit trigger occurs, settlement is handled directly through the bank.',
    },
  ];

  const benefits = [
    'Amplify your trading potential',
    '5x leverage for qualified investors',
    'Unified Document Signing – One upfront sign-off for all processes',
    'Automatic Refund Processing – Oversubscription refunds go straight to your principal',
    'Dedicated support team',
    'Risk monitoring',
  ];

  return (
    <div className="min-h-screen">
      <PageHero
        crumbs={[{ label: 'Services', href: '/services' }, { label: 'Leverage' }]}
        eyebrow="IPO financing"
        title="Leverage Your IPO Investment"
        subtitle="Maximize your IPO investment potential with 5x leverage"
        actions={
          <a href="/contact?subject=leverage">
            <button className="mx-btn px-8 py-4 bg-white text-[#00005B] rounded-lg font-semibold">
              Apply for Leverage <ArrowRight className="mx-arrow w-4 h-4" />
            </button>
          </a>
        }
        aside={
          <div className="mx-fund-card">
            <p className="mx-eyebrow !text-[#9AA6EF] inline-flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" /> Leverage Offering
            </p>
            <div className="flex items-end justify-between mt-5">
              <h2 className="text-2xl font-black text-white">5x Leverage</h2>
              <span className="mx-mono text-5xl font-bold text-white leading-none">1:4</span>
            </div>
            <p className="text-sm text-[#C9CFF5] mt-4">
              Multiply your IPO investment power by 5 with our professional financing facility
            </p>
            <ul className="mt-5 grid grid-cols-1 gap-2 text-sm text-white/85">
              {['Suitable for experienced investors', 'Bank-secured account structure', 'Competitive interest rates', 'Automatic refund processing'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#3ddc9c] shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <div className="mx-fund-line" aria-hidden="true" />
          </div>
        }
      />

      {/* Features: three numbered columns divided by rules */}
      <Section tone="white">
        <Stagger className="grid md:grid-cols-3 mx-divided">
          {features.map((feature, index) => (
            <div key={feature.title} className="p-8 md:p-10">
              <div className="flex items-center justify-between mb-8">
                <span className="mx-service-icon">{feature.icon}</span>
                <span className="mx-num">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </Stagger>
      </Section>

      {/* How It Works: sticky intro + drawn timeline */}
      <Section tone="tint">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20">
          <div className="lg:sticky lg:top-28 self-start">
            <SectionIntro eyebrow="Process" title="How It Works" className="!mb-0" />
          </div>
          <div className="relative pl-16">
            <DrawLine className="absolute left-[1.4rem] top-4 w-1 h-[calc(100%-2rem)]" />
            <Stagger className="space-y-8">
              {processSteps.map((step) => (
                <div key={step.step} className="relative">
                  <span className="absolute -left-16 top-1 w-12 h-12 rounded-full grid place-items-center bg-white dark:bg-[#121929] border border-[rgba(0,23,191,0.2)] dark:border-white/15 text-[#0017bf] dark:text-[#9AA6EF] shadow-[0_0_0_6px_rgba(0,23,191,0.06)]">
                    {step.icon}
                  </span>
                  <div className="mx-faq-item p-7">
                    <p className="mx-num mb-2">Step {String(step.step).padStart(2, '0')}</p>
                    <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </Stagger>
          </div>
        </div>
      </Section>

      {/* Benefits checklist */}
      <Section tone="white">
        <SectionIntro eyebrow="Why leverage with AXYS" title="Key Benefits" />
        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map((benefit) => (
            <div key={benefit} className="mx-row !items-start">
              <CheckCircle className="w-5 h-5 text-[#0017bf] dark:text-[#9AA6EF] mt-0.5 flex-shrink-0" />
              <span className="text-foreground/80">{benefit}</span>
            </div>
          ))}
        </Stagger>
      </Section>

      {/* CTA */}
      <Section tone="navy">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <div>
            <SectionIntro
              eyebrow="Get started"
              title="Ready to Get Started?"
              text="Contact our team to discuss IPO financing options and requirements"
              light
              className="!mb-4"
            />
            <p className="text-xs text-[#9AA6EF] italic">
              *Terms and conditions apply. Subject to approval and eligibility requirements.
            </p>
          </div>
          <Reveal className="lg:justify-self-end">
            <a href="/contact?subject=leverage">
              <button className="mx-btn px-8 py-4 bg-white text-[#00005B] rounded-lg font-semibold">
                Get Started <ArrowRight className="mx-arrow w-4 h-4" />
              </button>
            </a>
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
