'use client';

import { useState } from 'react';
import { Target, Eye, Award, Users, Landmark, ShieldCheck, Building2 } from 'lucide-react';
import { Reveal, Stagger, CountUp, TiltCard } from '@/components/motion';
import { PageHero, Section, SectionIntro, FactCard } from '@/components/layout/PageLayout';
import content from '@/config/content.json';

const initials = (name) =>
  name
    .split(/\s+/)
    .filter((w) => /^[A-Za-zÀ-ÿ]/.test(w) && !w.endsWith('.'))
    .slice(0, 2)
    .map((w) => w[0])
    .join('');

function PersonCard({ member }) {
  return (
    <div className="about-member-card group flex items-center gap-4 !p-5 text-left">
      <div className="about-member-glow" />
      <span className="mx-avatar relative z-10" aria-hidden="true">{initials(member.name)}</span>
      <div className="relative z-10 min-w-0">
        <h4 className="text-base font-bold text-foreground leading-snug">{member.name}</h4>
        <p className="text-sm font-medium text-[#0017bf] dark:text-[#9AA6EF] leading-snug mt-0.5">{member.role}</p>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const values = [
    {
      icon: <Target className="w-8 h-8 text-brand-blue transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      title: 'Our Mission',
      description:
        'To empower clients with tailored financial solutions by combining capital markets expertise and fiduciary services, protecting their interests and helping their wealth grow with confidence.',
    },
    {
      icon: <Eye className="w-8 h-8 text-brand-blue transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      title: 'Our Vision',
      description:
        'To be the trusted partner clients turn to for unlocking opportunities, creating meaningful value, and enabling long-term success.',
    },
    {
      icon: <Award className="w-8 h-8 text-brand-blue transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />,
      title: 'Our Values',
      description:
        'Independence, innovation, and shared intelligence guide every decision we make. We are client-centric, agile, and committed to delivering above-market performance.',
    },
  ];

  const boardMembers = [
    { name: 'Charles M. Omanga', role: 'Managing Director' },
    { name: 'Derek A. Waruhiu', role: 'Chairman, Non-executive Director' },
    { name: 'Michel Guy Rivalland', role: 'Non-executive Director' },
    { name: 'Yasser Doobory', role: 'Non-executive Director & Alternate to Michel Guy Rivalland' },
    { name: 'Ian Sababady', role: 'Non-executive Director' },
    { name: 'Cédric Béguier', role: 'Non-executive Director & Alternate to Ian Sababady' },
    { name: 'Khilan G. Shah', role: 'Non-executive & Independent Director' },
  ];

  const management = [
    { name: 'Bansri Pattni', role: 'Director, Trading & Operations' },
    { name: 'Mary Maloba', role: 'Head of Compliance' },
    { name: 'Stella Wambugu', role: 'Director, Wealth Management' },
    { name: 'Lemek Oltele', role: 'Head of Business Development' },
    { name: 'Nina Goswami', role: 'Head of Trading' },
    { name: 'Priscilla Gichuhi', role: 'Head of Finance, HR & Administration' },
    { name: 'Veronica Wambua', role: 'Head of Customer Service' },
    { name: 'Joseph Muriithi', role: 'Senior Research Analyst' },
  ];

  const team = [
    { name: 'Ngige Jeff Wanjao', role: 'Wealth Management' },
    { name: 'Maureen Wanjiku', role: 'Wealth Management' },
    { name: 'Ian Mudiri', role: 'Wealth Management' },
    { name: 'Peter Chege', role: 'IT, Products and Innovation' },
    { name: 'Sam Kinuthia', role: 'Project Support Lead' },
  ];

  const groups = [
    {
      id: 'board',
      label: 'Board of Directors',
      text: 'Our board brings together experienced leaders with deep expertise in capital markets, banking, and international finance.',
      people: boardMembers,
    },
    { id: 'management', label: 'Management', text: 'Our leadership team driving operational excellence', people: management },
    { id: 'team', label: 'Team', text: 'Our dedicated professionals delivering excellence', people: team },
  ];
  const [activeGroup, setActiveGroup] = useState('board');
  const current = groups.find((g) => g.id === activeGroup);

  return (
    <div className="min-h-screen">
      <PageHero
        crumbs={[{ label: 'About Us' }]}
        eyebrow="About us"
        title="About AXYS Investment Bank"
        subtitle="A Distinguished Member of AXYS Group"
        aside={
          <FactCard
            eyebrow="At a glance"
            icon={Landmark}
            facts={[
              ['Market expertise', `${content.stats.yearsInMarket}+ years`],
              ['Clients served', `${content.stats.clientsServed.toLocaleString('en-US')}+`],
              ['Regulators', 'CMA · CBK'],
              ['Member of', 'NSE · CDSC'],
            ]}
          />
        }
      />

      {/* Story: sticky heading left, narrative right */}
      <Section tone="white">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20">
          <div className="lg:sticky lg:top-28 self-start">
            <SectionIntro eyebrow="Who we are" title="Our Story" className="!mb-8" />
            <Stagger className="grid grid-cols-2 gap-4 max-w-sm">
              <div className="mx-stat-tile">
                <CountUp className="mx-mono text-3xl font-bold text-brand-blue" value={content.stats.yearsInMarket} suffix="+" />
                <p className="mx-eyebrow mt-2">Years in Market</p>
              </div>
              <div className="mx-stat-tile">
                <CountUp className="mx-mono text-3xl font-bold text-brand-blue" value={content.stats.clientsServed} suffix="+" />
                <p className="mx-eyebrow mt-2">Clients Served</p>
              </div>
            </Stagger>
          </div>
          <Stagger className="space-y-6 text-lg md:text-xl leading-relaxed text-foreground/80">
            <p className="mx-lead">
              AXYS Investment Bank is a distinguished member of AXYS Group, a fully integrated investment house
              born from the union of two long-established institutions: AIB Capital Limited and Apex Africa Capital Limited.
              Building on over 30 years of market expertise, we are a fully accredited brokerage firm
              at the Nairobi Securities Exchange (NSE).
            </p>
            <p>
              We serve both retail and institutional investors, as well as High Net Worth Individuals (HNWIs),
              providing comprehensive investment solutions including local equities and bonds, global market execution,
              offshore funds access, research &amp; advisory, and wealth management services.
            </p>
            <p>
              As part of the wider AXYS Group, AXYS Investment Bank combines local market expertise with
              global reach to deliver exceptional value to our clients.
            </p>
          </Stagger>
        </div>
      </Section>

      {/* Mission / Vision / Values: bento */}
      <Section tone="tint">
        <SectionIntro eyebrow="What drives us" title="Mission, Vision & Values" />
        <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-6">
          {values.map((value, index) => (
            <TiltCard
              key={value.title}
              className={`rounded-2xl ${index === 0 ? 'lg:row-span-2 lg:col-span-1 md:col-span-2' : ''} ${index === 2 ? 'lg:col-span-2' : ''}`}
            >
              {index === 0 ? (
                <div className="mx-fund-card h-full flex flex-col justify-between !p-9">
                  <div>
                    <span className="mx-service-icon !bg-white/10 !border-white/15 [&_svg]:!text-white">{value.icon}</span>
                    <h3 className="text-3xl font-black text-white mt-10 mb-4">{value.title}</h3>
                  </div>
                  <p className="text-[#C9CFF5] text-lg leading-relaxed">{value.description}</p>
                </div>
              ) : (
                <div className="about-member-card group h-full !p-8">
                  <div className="about-member-glow" />
                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-start gap-6">
                    <span className="mx-service-icon shrink-0">{value.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </TiltCard>
          ))}
        </Stagger>
      </Section>

      {/* People: tabs + compact person cards */}
      <Section tone="white">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <SectionIntro eyebrow="Leadership" title="Our People" className="!mb-0" />
          <div role="tablist" aria-label="Leadership groups" className="mx-tabs">
            {groups.map((g) => (
              <button
                key={g.id}
                role="tab"
                aria-selected={activeGroup === g.id}
                aria-controls={`panel-${g.id}`}
                onClick={() => setActiveGroup(g.id)}
                className="mx-tab"
                data-active={activeGroup === g.id ? '' : undefined}
              >
                {g.id === 'board' && <Users className="w-4 h-4" aria-hidden="true" />}
                {g.label}
                <span className="mx-mono text-xs opacity-60">{g.people.length}</span>
              </button>
            ))}
          </div>
        </div>
        <div id={`panel-${current.id}`} role="tabpanel" key={current.id} className="mx-result-in">
          <h3 className="text-2xl font-bold text-foreground mb-2">{current.label}</h3>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mb-8">{current.text}</p>
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {current.people.map((member) => (
              <PersonCard key={member.name} member={member} />
            ))}
          </Stagger>
        </div>
      </Section>

      {/* Regulatory: navy band */}
      <Section tone="navy">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 items-center">
          <SectionIntro eyebrow="Licensed & regulated" title="Regulatory Status" light className="!mb-0" />
          <Reveal variant="blur">
            <div className="flex items-start gap-5">
              <span className="mx-service-icon !bg-white/10 !border-white/15 shrink-0">
                <ShieldCheck className="text-white" />
              </span>
              <p className="text-lg text-[#C9CFF5] leading-relaxed">
                AXYS Investment Bank is licensed and regulated by the Capital Markets Authority (CMA) and Central Bank of Kenya (CBK).
                It is also a member of Nairobi Securities Exchange (NSE) and Central Depository and Settlement Corporation (CDSC).
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-8 pl-0 sm:pl-[4.75rem]">
              {['CMA', 'CBK', 'NSE', 'CDSC'].map((c) => (
                <span key={c} className="mx-chip"><Building2 className="w-3.5 h-3.5" aria-hidden="true" />{c}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
