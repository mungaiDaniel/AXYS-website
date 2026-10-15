'use client';

import { useState } from 'react';
import { ChevronDown, Search, ArrowRight } from 'lucide-react';
import { quickmartIpoFaqs } from '@/lib/quickmart-ipo';
import { Reveal, Stagger } from '@/components/motion';
import { PageHero, Section, SectionIntro } from '@/components/layout/PageLayout';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const [query, setQuery] = useState('');

  const faqs = [
    {
      category: 'Account & Trading Basics',
      questions: [
        {
          q: 'What is a CDS Account?',
          a: 'A CDS (Central Depository System) account is where your shares are held electronically after buying or selling on the Nairobi Securities Exchange (NSE). To trade shares, you must open a CDS account through a Capital Markets Authority (CMA)-licensed stockbroker such as AXYS Investment Bank.',
        },
        {
          q: 'How do I open a CDS / Share Trading Account?',
          a: 'You can open an account in two ways:\n\nOnline (Recommended):\n• Download the DigiTrader App from Google Play, App Store, or Windows Store\n• Or visit www.aib-axysafrica.com and click Open New Trading Account\n• No document uploads required\n• You\'ll receive your CDS number\n\nIn-Person:\nVisit our offices with:\n• Copy of National ID\n• Copy of KRA PIN\n• Two passport photos\n• Bank details (statement or ATM card)',
        },
        {
          q: 'What are the charges for buying and selling shares?',
          a: 'Via DigiTrader:\n• Annual account maintenance fee: KES 200\n• Commission: 1.64%\n\nPaper-based Accounts:\n• Annual account maintenance fee: KES 1,000\n• Commission: 2.1% for trades below KES 100,000, 1.8% for trades above KES 100,000 (Stamp duty excluded)',
        },
        {
          q: 'What is the minimum amount I need to start investing?',
          a: 'Minimum initial investment capital: KES 3,000. This is not a fee, but your investment capital. There is no minimum for future deposits.',
        },
        {
          q: 'What is the minimum number of shares I can buy?',
          a: 'You can buy as little as 1 share.',
        },
      ],
    },
    {
      category: 'Deposits & Withdrawals',
      questions: [
        {
          q: 'How do I deposit money into my trading account?',
          a: 'MPESA:\n• Paybill: 548800\n• Account Number: Your CDSC number (omit leading zeros)\n\nBank Deposit:\n• Deposit into our bank account\n• Email proof of payment to info@axysinvestmentbank.com\n\nYou can also fund your account directly through the DigiTrader platform.',
        },
        {
          q: 'How soon can I withdraw money after selling shares?',
          a: 'NSE settlement period is T+3 working days. You can withdraw funds on the 4th day. Unused funds cannot be withdrawn due to AML regulations.',
        },
        {
          q: 'Can I invest using Bonga Points?',
          a: 'Yes!\nSteps:\n1. Dial *126#\n2. Select Lipa na Bonga\n3. Enter Paybill 548800\n4. Use your CDSC number (omit zeros)\n5. Confirm amount\n\nConversion rate: 5 Bonga Points = KES 1',
        },
      ],
    },
    {
      category: 'Trading & Investments',
      questions: [
        {
          q: 'How do I choose which shares to invest in?',
          a: 'We provide:\n• Weekly stock recommendations by our Research Team (Value & Speculative)\n• Available on our website under Research → Stock Recommendations\n• WhatsApp & Telegram investor communities\n• Free Friday investor trainings\n• Simplified investment videos on our YouTube Channel',
        },
        {
          q: 'Can I buy and sell shares on the same day?',
          a: 'Yes. This is called Intraday Trading. If the order doesn\'t execute within the trading session, it automatically converts to T+3 settlement.',
        },
        {
          q: 'How do dividends work?',
          a: 'You qualify for dividends when a company declares a dividend and you are a shareholder by book closure date of that financial year.',
        },
        {
          q: 'How long before my account becomes dormant?',
          a: 'Your account is considered dormant after 12 months with no trading activity.',
        },
      ],
    },
    {
      category: 'Share Transfers & Special Services',
      questions: [
        {
          q: 'How do I transfer shares from another broker?',
          a: 'For transfer of shares from one broker to another, request duly executed form CDS 4A/4B from your current broker and submit the same to AXYS Investment Bank.',
        },
        {
          q: 'What is share immobilization?',
          a: 'Immobilization is the process of converting physical share certificates into electronic form.\n\nRequired documents:\n• Original share certificate\n• CDS2 form\n• Copy of ID\n• Bank statement\n• Dividend notice\n• Police Abstract',
        },
        {
          q: 'What is share transmission?',
          a: 'Transmission is the transfer of shares from a deceased shareholder to their beneficiaries. Requirements include:\n• Death certificate\n• Share certificate\n• IDs of beneficiaries\n• Letter of Administration\n\nThe process may take up to 6 months.',
        },
        {
          q: 'Can I get a loan using my shares?',
          a: 'Yes. This is known as a lien.\n• Shares are frozen as collateral\n• Processing fee: KES 1,000\n• Loan value depends on the worth of your shares',
        },
      ],
    },
    {
      category: 'Quick Mart PLC IPO',
      questions: quickmartIpoFaqs,
    },
    {
      category: 'Dangote Petroleum Refinery IPO',
      questions: [
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
          a: 'The Offer Price is ₦525.00 per Ordinary Share, payable in full on application. The minimum subscription is 10 Offer Shares and multiples of 10 thereafter. Applications submitted via the Investor Application Form (for Qualified Investors) require a minimum of 50,000 Offer Shares.',
        },
        {
          q: 'How do I participate from Kenya?',
          a: 'AXYS Investment Bank is facilitating client expressions of interest in the Offer through a Client Application (opt-in) form, processed via the AXYS Investment Bank omnibus account. Download the form on the IPO page, complete it, and return it to our team along with your funding instructions. Participation is subject to the terms, risks and conditions set out on the form and in the Prospectus, including a 2% application fee and exposure to USD/NGN/KES exchange-rate movements. Allotments are not guaranteed and are subject to the Basis of Allotment approved by the Nigerian SEC.',
        },
        {
          q: 'What currency risk applies to this investment?',
          a: 'The Offer Shares are priced and settled in Nigerian Naira (₦). Amounts invested via AXYS Investment Bank in KES or USD are converted for the purposes of the application, and the final allocation value is subject to the applicable exchange rate at the date of allotment. The value of the investment and any returns, when measured in KES, may rise or fall with movements in the USD/NGN/KES exchange rates.',
        },
        {
          q: 'What is the purpose of the Offer?',
          a: 'Net Offer proceeds of approximately ₦2,111,007,217,311.09 (after estimated Offer costs of ₦41,492,782,688.91) will be applied to DPRP\'s refinery expansion programme — increasing refining capacity by a further approximately 700,000 bpd. The Offer is also intended to broaden DPRP\'s public ownership and shareholder base ahead of listing on the NGX Main Board.',
        },
      ],
    },
  ];

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const term = query.trim().toLowerCase();
  const filtered = faqs
    .map((category, categoryIndex) => ({
      ...category,
      categoryIndex,
      items: category.questions
        .map((faq, questionIndex) => ({ ...faq, questionIndex }))
        .filter((faq) => !term || faq.q.toLowerCase().includes(term) || faq.a.toLowerCase().includes(term)),
    }))
    .filter((category) => category.items.length > 0);
  const total = faqs.reduce((n, c) => n + c.questions.length, 0);

  return (
    <div className="min-h-screen">
      <PageHero
        crumbs={[{ label: 'FAQ' }]}
        eyebrow="Help centre"
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about our services"
      >
        <Reveal delay={400}>
          <label className="mx-search mt-9">
            <Search className="w-5 h-5 text-[#9AA6EF] shrink-0" aria-hidden="true" />
            <span className="sr-only">Search questions</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${total} questions`}
              className="bg-transparent outline-none w-full text-white placeholder:text-[#9AA6EF]/70"
            />
          </label>
        </Reveal>
      </PageHero>

      <Section tone="white">
        <div className="grid lg:grid-cols-[18rem_1fr] gap-10 lg:gap-16">
          {/* Category navigation */}
          <nav aria-label="FAQ categories" className="lg:sticky lg:top-28 self-start">
            <p className="mx-eyebrow mb-4">Categories</p>
            <div className="mx-vtabs">
              {filtered.map((category) => (
                <a key={category.category} href={`#${slug(category.category)}`} className="mx-tab">
                  <span>{category.category}</span>
                  <span className="mx-mono text-xs opacity-60">{category.items.length}</span>
                </a>
              ))}
            </div>
          </nav>

          {/* FAQ Sections */}
          <div className="space-y-14 min-w-0">
            {filtered.length === 0 && (
              <p className="text-muted-foreground">No questions match “{query}”.</p>
            )}
            {filtered.map((category) => (
              <section key={category.category} id={slug(category.category)} className="scroll-mt-28">
                <Reveal className="flex items-baseline justify-between gap-4 mb-5">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">{category.category}</h2>
                  <span className="mx-num shrink-0">{String(category.items.length).padStart(2, '0')} Q</span>
                </Reveal>
                <Stagger className="space-y-3">
                  {category.items.map((faq) => {
                    const { categoryIndex } = category;
                    const { questionIndex } = faq;
                    const isOpen = openIndex === `${categoryIndex}-${questionIndex}`;
                    return (
                      <div key={questionIndex} className="mx-faq-item" data-open={isOpen ? '' : undefined}>
                        <button
                          onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                          aria-expanded={isOpen}
                          data-state={isOpen ? 'open' : 'closed'}
                          className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left"
                        >
                          <span className="font-semibold text-foreground">{faq.q}</span>
                          <ChevronDown className="mx-chevron w-5 h-5 flex-shrink-0 text-[#0017bf] dark:text-[#9AA6EF]" />
                        </button>
                        <div className="mx-collapse" data-open={isOpen ? '' : undefined} inert={!isOpen}>
                          <div>
                            <div className="px-6 pb-6 text-muted-foreground leading-relaxed whitespace-pre-line">
                              {faq.a}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Stagger>
              </section>
            ))}
          </div>
        </div>
      </Section>

      {/* Contact CTA */}
      <Section tone="navy">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <SectionIntro
            eyebrow="Need more help?"
            title="Still Have Questions?"
            text="Our team is here to help. Contact us for personalized assistance."
            light
            className="!mb-0"
          />
          <Reveal className="lg:justify-self-end">
            <a href="/contact">
              <button data-analytics-label="faq_contact_us" data-analytics-event="button_click" className="mx-btn px-8 py-4 bg-white text-[#00005B] rounded-lg font-semibold">
                Contact Us <ArrowRight className="mx-arrow w-4 h-4" />
              </button>
            </a>
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
