'use client';

import { Building2, TrendingUp, ClipboardList } from 'lucide-react';
import { Reveal } from '@/components/motion';
import { PageHero, Section, QuickLinks } from '@/components/layout/PageLayout';
import { FundingNav, DetailTile, MethodBlock, Notice, NotifyCard, CopyButton } from '@/components/layout/Funding';

export default function InternationalEquitiesPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        crumbs={[{ label: 'Fund Account' }, { label: 'International Equities & ETFs' }]}
        eyebrow="Fund Account"
        title="Funding International Equities & ETFs"
        subtitle="Access global markets with AXYS Investment Bank"
        aside={
          <QuickLinks
            eyebrow="On this page"
            icon={TrendingUp}
            links={[
              { label: 'USD Account Details', href: '#usd' },
              { label: 'After Deposit - Notify Us', href: '#notify' },
              { label: 'Placing Orders', href: '#orders' },
            ]}
          />
        }
      />
      <FundingNav />

      <Section tone="white">
        <div className="grid lg:grid-cols-[1fr_22rem] gap-12 lg:gap-16 items-start">
          <div className="min-w-0">
            {/* Bank Details */}
            <MethodBlock id="usd" num="01" icon={Building2} title="USD Account Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailTile label="Bank Name" value="Bank of Africa" />
                <DetailTile label="Account Name" value="AIB-AXYS Africa Limited - Client Account" />
                <DetailTile label="Account Number" value="03104860017" tone="accent" copy />
                <DetailTile label="SWIFT Code" value="AFRIKENXXXX" tone="accent" copy />
              </div>
              <Notice>
                Your CDSC Account Number or AXYS Investment Bank Client Code must be included along with specific instructions to facilitate the allocation of funds.
              </Notice>
            </MethodBlock>

            {/* Order Placement */}
            <MethodBlock
              id="orders"
              num="03"
              icon={ClipboardList}
              title="Placing Orders"
              intro="When you'd like to purchase international equities or ETFs, send your order instructions via email with the following details:"
            >
              <div className="mx-detail">
                <div className="mx-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-4">Order Details Required</div>
                <ol className="grid sm:grid-cols-2 gap-3 text-sm text-foreground/80">
                  {[
                    'Security/stock name and ticker symbol',
                    "Maximum price you're willing to pay",
                    'Total amount to spend (in USD)',
                    'Your CDSC Account Number or AXYS Investment Bank Client Code',
                  ].map((item, i) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mx-num shrink-0 pt-0.5">{String(i + 1).padStart(2, '0')}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mx-detail">
                <div className="mx-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-3">Email Format for Orders</div>
                <div className="space-y-2 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">To:</span>
                    <span className="mx-mono text-[#0017bf] dark:text-[#9AA6EF]">info@axysinvestmentbank.com</span>
                    <CopyButton value="info@axysinvestmentbank.com" />
                  </div>
                  <div>
                    <span className="font-semibold">Subject:</span>{' '}
                    <span className="mx-mono bg-[#F5F6FD] dark:bg-white/5 px-2 py-1 rounded">International Equities Order: [Your Full Name]</span>
                  </div>
                  <pre className="mx-code mt-4">{`Security: [e.g., Apple Inc. (AAPL)]
Max Price: [e.g., $180 per share]
Total Amount: [e.g., $5,000 USD]
CDSC/Client Code: [Your Code]`}</pre>
                </div>
              </div>

              <Notice tone="info" title="Order confirmation">
                We shall revert when the relevant market opens to verify success of the order.
              </Notice>
            </MethodBlock>
          </div>

          {/* Deposit Notification */}
          <Reveal className="lg:sticky lg:top-40 scroll-mt-40" id="notify">
            <NotifyCard step="Step 02" subject="International Equities Deposit: [Your Full Name]" />
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
