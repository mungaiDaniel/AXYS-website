'use client';

import { Smartphone, Building2, Mail, WalletCards } from 'lucide-react';
import { Reveal } from '@/components/motion';
import { PageHero, Section, QuickLinks } from '@/components/layout/PageLayout';
import { FundingNav, DetailTile, MethodBlock, Notice, CopyButton } from '@/components/layout/Funding';

export default function LocalStocksPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        crumbs={[{ label: 'Fund Account' }, { label: 'KSH' }]}
        eyebrow="Fund Account"
        title="Funding KSH"
        subtitle="Fund your account to trade local stocks on the Nairobi Securities Exchange"
        aside={
          <QuickLinks
            eyebrow="Ways to fund"
            icon={WalletCards}
            links={[
              { label: 'A) Via M-Pesa', href: '#mpesa' },
              { label: 'B) Via Bank', href: '#bank' },
              { label: 'After Deposit - Notify Us', href: '#notify' },
            ]}
          />
        }
      />
      <FundingNav />

      <Section tone="white">
        <div className="grid lg:grid-cols-[1fr_22rem] gap-12 lg:gap-16 items-start">
          <div className="min-w-0">
            {/* M-Pesa */}
            <MethodBlock id="mpesa" num="01" icon={Smartphone} title="A) Via M-Pesa">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailTile label="Paybill Number" value="548800" tone="success" copy />
                <DetailTile
                  label="Account Number"
                  value="[Your CDSC Account No.]"
                  note="Do not include the initial zeros"
                  tone="warning"
                />
              </div>
            </MethodBlock>

            {/* Bank */}
            <MethodBlock id="bank" num="02" icon={Building2} title="B) Via Bank">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-[#0017bf] dark:text-[#9AA6EF]">i) Equity Bank</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DetailTile label="Bank Name" value="Equity Bank" />
                  <DetailTile label="Account Name" value="AIB-AXYS Africa Limited - Client Account" />
                  <DetailTile label="Account Number" value="0180290140655" tone="accent" copy />
                </div>
                <div className="mt-4">
                  <Notice>
                    Your CDSC Account Number or AXYS Investment Bank Client Code must be included to facilitate the allocation of funds.
                  </Notice>
                </div>
              </div>

              <div className="pt-6">
                <h3 className="text-lg font-semibold mb-4 text-[#0017bf] dark:text-[#9AA6EF]">ii) Stanbic Bank</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DetailTile label="Bank Name" value="Stanbic Bank" />
                  <DetailTile label="Account Name" value="AXYS Investment Bank Limited -Client Account" />
                  <DetailTile label="Account Number" value="0100000733363" tone="accent" copy />
                </div>
                <div className="mt-4">
                  <Notice>
                    Your CDSC Account Number or AXYS Investment Bank Client Code must be included along with specific instructions to facilitate the allocation of funds.
                  </Notice>
                </div>
              </div>
            </MethodBlock>
          </div>

          {/* Email Notification (sticky) */}
          <Reveal className="lg:sticky lg:top-40" id="notify">
            <div className="mx-fund-card scroll-mt-40">
              <p className="mx-eyebrow !text-[#9AA6EF] inline-flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> Step 03
              </p>
              <h2 className="text-2xl font-black text-white mt-3 mb-3">After Deposit - Notify Us</h2>
              <p className="text-sm text-[#C9CFF5] leading-relaxed">
                Once you&apos;ve deposited, please notify us immediately for swift allocation by sending a copy of the transaction confirmation slip via email.
              </p>
              <div className="mt-6 pt-5 border-t border-white/10 space-y-4 text-sm">
                <p className="mx-mono text-[10px] uppercase tracking-[0.16em] text-[#9AA6EF]/70">Email Format</p>
                <div>
                  <span className="text-[#9AA6EF]">To:</span>{' '}
                  <span className="mx-mono text-white break-all">info@axysinvestmentbank.com</span>
                  <div className="mt-2"><CopyButton value="info@axysinvestmentbank.com" /></div>
                </div>
                <div>
                  <span className="text-[#9AA6EF]">Subject:</span>{' '}
                  <span className="mx-mono text-white bg-white/10 px-2 py-0.5 rounded">Local Stocks Deposit: [Your Full Name]</span>
                </div>
                <div>
                  <span className="text-[#9AA6EF]">Attach:</span> <span className="text-white">Transaction confirmation slip</span>
                </div>
              </div>
              <div className="mx-fund-line" aria-hidden="true" />
            </div>
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
