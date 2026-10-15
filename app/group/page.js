'use client';

import { useTheme } from '../../contexts/ThemeContext';
import { Building2, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal, Stagger, TiltCard } from '@/components/motion';
import { PageHero, Section, SectionIntro, FactCard } from '@/components/layout/PageLayout';

export default function GroupPage() {
  const { theme } = useTheme();

  const stats = [
    ['Employees', '170+'],
    ['Countries', '85+'],
    ['Continents', '6'],
    ['Client Assets', 'USD 14B+'],
  ];

  const entities = [
    {
      name: 'AXYS',
      tagline: 'Capital markets and investment solutions',
      logo: theme === 'dark' ? '/axys-logo-dark.png' : '/axys-logo.png',
      description:
        'Advanced capital markets solutions including brokerage services, global market execution, research & advisory, and investment solutions. AXYS delivers above-market risk-adjusted performance with industry-competitive fees.',
    },
    {
      name: 'NWT',
      tagline: 'Fiduciary and corporate services',
      logo: theme === 'dark' ? '/nwt-logo-light.png' : '/nwt-logo.png',
      description:
        'Professional fiduciary services, corporate administration, and wealth structuring. NWT provides expert management of trusts, foundations, and corporate structures with meticulous attention to regulatory compliance and client confidentiality.',
    },
  ];

  const offices = [
    { flag: '🇲🇺', country: 'Mauritius', city: 'Headquarters' },
    { flag: '🇰🇪', country: 'Kenya', city: 'Nairobi' },
    { flag: '🇬🇧', country: 'United Kingdom', city: 'London' },
    { flag: '🇨🇭', country: 'Switzerland', city: 'Geneva' },
    { flag: '🇦🇪', country: 'UAE', city: 'Dubai' },
  ];

  return (
    <div className="min-h-screen">
      <PageHero
        crumbs={[{ label: 'About Us', href: '/about' }, { label: 'AXYS Group' }]}
        eyebrow="A Fully Integrated Investment House"
        title={
          <a
            href="https://axys-group.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block hover:opacity-90 transition-opacity"
          >
            <span className="sr-only">AXYS Group</span>
            <Image src="/axys-logo-dark.png" alt="" width={300} height={100} className="h-20 md:h-24 w-auto mx-no-float" priority />
          </a>
        }
        subtitle="AXYS Group combines local market expertise with global reach."
        aside={<FactCard eyebrow="AXYS Group" icon={Building2} facts={stats} />}
      />

      {/* Introduction */}
      <Section tone="white">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20">
          <SectionIntro eyebrow="Who we are" title="About AXYS Group" className="!mb-0" />
          <Reveal>
            <p className="mx-lead text-lg md:text-xl">
              AXYS Group is a fully integrated investment house providing a comprehensive range of financial services
              to institutional, corporate, and private clients. Headquartered in Mauritius with operations spanning
              Africa, Europe, and beyond, AXYS Group combines local market expertise with global reach.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Group Structure + entities */}
      <Section tone="tint">
        <SectionIntro
          eyebrow="Two business lines"
          title="Group Structure"
          text="AXYS Group operates through two principal business lines, each serving distinct client needs:"
        />
        <Stagger className="grid md:grid-cols-2 gap-6">
          {entities.map((entity, i) => (
            <TiltCard key={entity.name} className="rounded-2xl">
              <div className="about-member-card h-full !p-9">
                <div className="about-member-glow" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-10">
                    <Image src={entity.logo} alt={entity.name} width={180} height={60} className="h-12 w-auto mx-no-float" />
                    <span className="mx-num">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="font-bold text-foreground text-xl mb-1">{entity.name}</h3>
                  <p className="text-sm font-semibold text-[#0017bf] dark:text-[#9AA6EF] mb-5">{entity.tagline}</p>
                  <p className="text-muted-foreground leading-relaxed">{entity.description}</p>
                </div>
              </div>
            </TiltCard>
          ))}
        </Stagger>
      </Section>

      {/* Global reach + offices */}
      <Section tone="navy">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
          <div>
            <SectionIntro
              eyebrow="Offices Around the World"
              title="Global Reach, Local Expertise"
              text="AXYS Group serves clients across 85 countries and six continents with comprehensive multi-jurisdictional capabilities."
              light
              className="!mb-8"
            />
            <Reveal>
              <Link href="https://axys-group.com/" target="_blank" rel="noopener noreferrer">
                <button className="mx-btn px-8 py-4 bg-white text-[#00005B] rounded-lg font-semibold">
                  Learn more <ArrowUpRight className="mx-arrow w-4 h-4" />
                </button>
              </Link>
            </Reveal>
          </div>
          <Stagger className="grid sm:grid-cols-2 gap-3">
            {offices.map((office, i) => (
              <div key={office.country} className={`mx-office ${i === 0 ? 'sm:col-span-2' : ''}`}>
                <span className="text-3xl" aria-hidden="true">{office.flag}</span>
                <div>
                  <h3 className="font-bold text-white">{office.country}</h3>
                  <p className="text-sm text-[#C9CFF5]">{office.city}</p>
                </div>
              </div>
            ))}
          </Stagger>
        </div>
      </Section>
    </div>
  );
}
