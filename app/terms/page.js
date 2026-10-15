'use client';

import { Download } from 'lucide-react';
import { PageHero, Section } from '@/components/layout/PageLayout';
import { LegalBody } from '@/components/layout/Legal';

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        crumbs={[{ label: 'Terms & Conditions' }]}
        eyebrow="Legal"
        title="Terms & Conditions"
        subtitle="AXYS Investment Bank"
        actions={
          <a
            href="/terms-and-conditions.pdf"
            download
            className="mx-btn px-6 py-3 bg-white text-[#00005B] rounded-lg font-semibold"
          >
            <Download className="w-5 h-5" />
            <span>Download PDF</span>
          </a>
        }
      />

      <Section tone="white">
        <LegalBody>
          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">1. INTRODUCTION</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                AXYS Investment Bank is a market intermediary regulated under the rules, regulations and guidelines of the NSE, the Capital Markets Act, and applicable laws in Kenya.
              </p>
              <p>
                Subject to any other agreement made in writing between AXYS Investment Bank and you as a client whose application has been accepted and engages AXYS Investment Bank to receive its services (the Client), the relationship between AXYS Investment Bank and the Client shall be governed by the following standard terms and conditions (the Terms and Conditions)
              </p>
              <p>
                These Terms and Conditions are subject to any supplementary agreement entered into with a client and:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>applicable Kenyan, foreign, and international laws including Anti-money laundering (AML) laws and requirements;</li>
                <li>regulatory authorities' rules and directives;</li>
                <li>applicable stock exchange and clearing institution bylaws; and</li>
                <li>established market customs and practices.</li>
              </ul>
              <p>(together referred to as the Trading Rules).</p>
            </div>
          </section>

          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">2. APPOINTMENT OF AXYS INVESTMENT BANK</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                The Client appoints AXYS Investment Bank as its duly authorized agent to purchase sell and otherwise deal in all types of Securities (such term as defined in the Capital Markets Act) for and on behalf of the Client and in accordance with the instructions issued by the Client to AXYS Investment Bank from time to time.
              </p>
              <p>
                AXYS Investment Bank may open a dedicated book of account for the Client in its records; which will be utilized to record and monitor transactions undertaken on behalf of the Client the (Brokerage Account). The Client shall be entitled to receive a statement of account for their Brokerage Account upon request and within a reasonable time from receipt of a formal request.
              </p>
              <p>
                Each of the parties acknowledges and confirms that they shall at all times comply with the Trading Rules as may be in force from time to time.
              </p>
            </div>
          </section>

          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">3. AXYS INVESTMENT BANK'S OBLIGATIONS</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                AXYS Investment Bank shall perform the activities it is licensed to perform in accordance with the applicable Trading Rules and in particular shall endeavour to:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>to abide by these Terms and Conditions; and</li>
                <li>to inform the Client of any matters that may reasonably affect the service being provided.</li>
              </ul>
              <p>
                AXYS Investment Bank shall undertake its functions with appropriate standards of professionalism and due regard to the needs of the Clients.
              </p>
            </div>
          </section>

          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">4. CLIENT RIGHTS</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>The Client has the right:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>to receive title for any securities purchased;</li>
                <li>to receive a statement of all proceeds received and all fees and charges incurred in connection with the Client's Brokerage Account;</li>
                <li>to benefit from all rights available to Clients generally where not contrary to the provisions of these Terms and Conditions (to the extent applicable);</li>
                <li>to receive payment for securities sold within a specified period;</li>
                <li>to access these terms and conditions and applicable policies maintained by AXYS Investment Bank in relation to their customer services;</li>
              </ul>
            </div>
          </section>

          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">5. INSTRUCTIONS & NOTICES</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
              <p>
                Instructions from Clients must be issued to the appropriate representative of AXYS Investment Bank in writing and delivered via hand, registered post, telephone, or email. Electronic communications must be confirmed as received by AXYS Investment Bank to be considered validly instructed. Clients accept the risk of misunderstandings or errors in transmission of instructions and will notify AXYS Investment Bank in a timely manner.
              </p>
              <p>
                Notwithstanding any provision in these Terms and Conditions, acting on instructions by AXYS Investment Bank shall be sufficient evidence of receipt of instructions notwithstanding that AXYS Investment Bank did not respond to any such communication.
              </p>
              <p>
                AXYS Investment Bank shall not be liable for errors or to compensate the Client by mere fact that an error occurred. AXYS Investment Bank will undertake reasonable efforts to verify oral instructions and reserves the right to request such verification and to refuse to act on unclear or impractical instructions or instructions not provided through the proper channels.
              </p>
              <p>
                Phone conversations may be recorded for compliance and evidence subject to internal privacy and data protection policies. Clients must verify transaction details upon receipt and notify AXYS Investment Bank of any discrepancies within 48 hours.
              </p>
              <p>
                Instructions received after normal trading hours will be treated as received on the next day on which the NSE is open for trading.
              </p>
            </div>
          </section>

          {/* Continue with remaining sections... */}
          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">6. EXECUTION OF TRANSACTIONS</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
              <p>
                AXYS Investment Bank aims to secure the best execution prices in the market but may aggregate client orders with others to the extent permitted by law. Where there is a limited supply or market for a security, AXYS Investment Bank makes no assurance for equality among all client accounts, but will use its best efforts to fairly allocate opportunities among all accounts
              </p>
              <p>
                The Client acknowledges that the systems used in the market by the NSE and AXYS Investment Bank are vulnerable to disruption or malfunction which may result in instructions not being executed or being delayed due to unforeseeable circumstances. The Client releases AXYS Investment Bank from liability for any loss, damage or liability suffered by reason of or in connection with such disruption or system. All transactions are subject to regulatory compliance.
              </p>
            </div>
          </section>

          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">7. CONFIDENTIALITY</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              AXYS Investment Bank will keep Client information confidential unless required by law or regulators. However, it may share information with affiliates or advisors as necessary to enable it perform its functions under these terms and conditions. Clients must also maintain confidentiality regarding any proprietary information received.
            </p>
          </section>

          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">8. FUNDS AND PAYMENTS</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
              <p>
                Client funds, including deposits, dividends, and proceeds from disposals, will be credited to the designated client bank account in the Client's name and specified in the account opening form or to such alternate bank account in the Client's name as may be directed by the Client through prior written instructions properly given to AXYS Investment Bank.
              </p>
              <p>
                If a client instructs payment to be made to different bank accounts, then such client assumes all risks in relation to such payment and shall not hold AXYS Investment Bank liable for any claims arising from such third-party payment instructions.
              </p>
              <p>
                All payments on account of a client must be supported by a purchase transaction. All requests for remittance of unutilized funds received or held by AXYS Investment Bank shall be subjected to AML checks & internal approvals.
              </p>
              <p>
                AXYS Investment Bank reserves the right to delay such payments until satisfaction of applicable AML checks and internal approvals.
              </p>
              <p>
                Clients must ensure payments are made directly to AXYS Investment Bank's accounts and not through intermediaries, staff or other third parties. AXYS Investment Bank will not be able to monitor or verify such transactions and is not responsible for losses from such third-party transactions. Accordingly, the Client indemnifies AXYS Investment Bank in relation to any such related loss in accordance with the provisions of clause 16.
              </p>
            </div>
          </section>

          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">9. ACCESS TO THE AXYS INVESTMENT BANK APP AND ONLINE TRADING PLATFORMS</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
              <p>
                Access to the AIB Platforms shall be granted on a limited, non-exclusive, revocable, non-transferable and personal license and through the creation of an online account for the personal use of the Client (the Online Client Account).
              </p>
              <p>The Client shall:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>be responsible for keeping its access credentials to the Online Client Account strictly confidential;</li>
                <li>notify AXYS Investment Bank immediately of any loss, theft or unauthorized use of the Login ID or the Password;</li>
                <li>not use the Online Client Account to train or service third parties or in a manner that would overburden AXYS Investment Bank's servers;</li>
                <li>not use any communication feature of the Online Client Account for any purpose that is unlawful, libelous, defamatory, obscene, threatening or otherwise abusive;</li>
              </ul>
              <p>
                The Client hereby expressly authorizes AXYS Investment Bank to rely and act on any instruction issued through the Online Client Account that AXYS Investment Bank believes has been properly issued by the Client.
              </p>
            </div>
          </section>

          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">10. RISK ACKNOWLEDGEMENT</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
              <p>
                The Client understands that there are risks inherent to any investment and confirms that the Client is solely responsible for determining the suitability of an investment based on their financial situation, objectives, and risk tolerance. AXYS Investment Bank does not act as an advisor or fiduciary unless expressly agreed upon.
              </p>
              <p>
                The Client agrees that all investment decisions are based on the Client's own evaluation of each transaction. This extends to any decision made by the Client on the basis of any information that may be made available by AXYS Investment Bank to the Client or the general public whether on its website or through any other media.
              </p>
              <p>
                In all matters in these terms and conditions the Client agrees that AXYS Investment Bank will not be liable to the client for any loss suffered as a result of good faith actions exercised by AXYS Investment Bank with due care, diligence and skill expected of a reasonably prudent stockbroker.
              </p>
            </div>
          </section>

          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">11. FEES & COMMISSIONS</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
              <p>
                The Client agrees to pay all fees, commissions, levies and charges associated with the brokerage services as outlined in AXYS Investment Bank's fee schedule (the Fees). Where applicable fees shall be subject to VAT and other taxes.
              </p>
              <p>
                AXYS Investment Bank is authorized to immediately debit, set off and/or deduct the Fees (at applicable rates not exceeding the maximum allowable by law) from funds held by it. Such rates may vary for different investments.
              </p>
              <p>
                AXYS Investment Bank reserves the right to update its Fee structure at any time, with prior notice to the Client (the Fee Schedule). The Fee Schedule shall be available upon request and on the website of AXYS Investment Bank.
              </p>
              <p>
                Where AXYS Investment Bank enters fee-sharing arrangements with affiliated brokers to carry out Client's instructions, fees for such services (as outlined in the Fee Schedule) may be deducted from Client accounts. The Client remains liable to settle all outstanding fees on termination of this appointment.
              </p>
            </div>
          </section>

          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">12. FOREIGN INVESTMENTS</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Foreign investments (where applicable) will be subject to applicable regulations. Such transactions may involve overseas intermediaries, and the clients accept the associated risks, including market volatility and currency fluctuations.
            </p>
          </section>

          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">13. UNDERFUNDED CLIENT ACCOUNTS ON PURCHASE OF SECURITIES</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
              <p>
                AXYS Investment Bank is under no obligation to place any purchase order unless it holds clear funds in the Client's Brokerage Account sufficient to settle the order and applicable Fees.
              </p>
              <p>
                In the event that the Brokerage Account does not have sufficient funds to satisfy a purchase order then AXYS Investment Bank is authorized to (i) reduce the size of the order to match the cleared funds in the Client's brokerage account or (ii) settle the additional amount required (the Debit Balance) and to charge compound interest on the Debit Balance at the rate of 1.5% per month.
              </p>
            </div>
          </section>

          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">14. UNUTILISED CREDIT BALANCES</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
              <p>
                The Client shall make a written request to AXYS Investment Bank to receive proceeds from sale transactions and any unutilized credit balances held in the Brokerage Account in the event they require their funds. AXYS Investment Bank will make reasonable efforts to remit the funds within agreed timelines.
              </p>
              <p>
                To receive payment for Securities sold within a specified period, funds shall be available for payment 4 days from the date of completion of the sale (T+4). Once available, funds will generally be paid one (1) day after a payment request has been properly made and received by AXYS Investment Bank.
              </p>
            </div>
          </section>

          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">15. JOINT CLIENT ACCOUNTS & TRUSTEES</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
              <p>
                Where a Brokerage Account or CDS Account is held jointly or by trustees, the person who signs on as the client will remain the principal contact and authorized person to provide instructions. This will apply where the Client acts on behalf of a third-party and despite any disclosure of such arrangement to AXYS Investment Bank.
              </p>
            </div>
          </section>

          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">16. LIABILITY & INDEMNITY</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
              <p>
                AXYS Investment Bank is liable only for losses due to willful misconduct, fraud, or gross negligence of AXYS Investment Bank or its officers and staff.
              </p>
              <p>
                The Client hereby agrees to indemnify and hold AXYS Investment Bank and its respective officers, directors, shareholders, employees, affiliates, agents and other representatives harmless from and against any and all direct or indirect losses arising due to market fluctuations, external third-party failures, or other similar indirect causes.
              </p>
            </div>
          </section>

          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">17. CLOSING TRANSACTIONS</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              If a Client fails to meet its obligations, AXYS Investment Bank may cancel transactions, sell Client assets within its custody, or take necessary, reasonable measures to mitigate losses without prior notice.
            </p>
          </section>

          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">18. TERMINATION</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
              <p>
                Either party may terminate this appointment without penalty. Termination does not affect obligations which become due prior to termination.
              </p>
              <p>
                If AXYS Investment Bank ceases to be an NSE member, the appointment terminates automatically in accordance with its license conditions and is subject to any applicable regulator directions.
              </p>
            </div>
          </section>

          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">19. FORCE MAJEURE</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
              <p>
                AXYS Investment Bank is not liable for failure or delay in fulfilling obligations due to unforeseen circumstances beyond its control, including without limitation: acts of God, war, sabotage, riots, strikes, judicial actions, government actions, pandemics, natural disasters, and system failures.
              </p>
            </div>
          </section>

          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">20. CLIENT WARRANTIES</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Clients affirm that they are legally authorized to enter into this agreement, that they are not subject to any international sanctions and funds provided are not proceeds of crime, that all KYC and financial information provided is accurate, and that investments are free from liens or encumbrances.
            </p>
          </section>

          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">21. GOVERNING LAW & JURISDICTION</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              This agreement is governed by Kenyan law. Clients submit to Kenyan courts for dispute resolution but acknowledge AXYS Investment Bank's right to pursue legal action in other jurisdictions if necessary.
            </p>
          </section>

          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">22. DATA PRIVACY AND PROTECTION</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
              <p>
                AXYS Investment Bank may collect and process personal information from our customers to provide and improve our services. We value privacy and are committed to maintaining confidentiality and security of data in adherence to data protection laws in Kenya.
              </p>
              <p>
                Information may be shared with specific third parties solely for processing and enhancing services. We do not resell customer data. By agreeing to these Terms, customers consent to data collection and sharing as described.
              </p>
            </div>
          </section>

          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">23. AML/CFT RISK-BASED APPROACH</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              AXYS Investment Bank is a reporting institution under the Proceeds of Crime and Anti-Money Laundering Regulations, 2023 of Kenya (POCAMLR). Client funds may only be deposited for trading and settling payments. AXYS Investment Bank restricts and will not approve deposits and withdrawals unrelated to trading activity per its AML and CFT policies.
            </p>
          </section>

          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">24. SEVERABILITY</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              The invalidity or unenforceability of any provision of these Terms and Conditions shall not affect the validity or enforceability of any other provision of these Terms and Conditions.
            </p>
          </section>

          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">25. AMENDMENTS TO TERMS AND CONDITIONS</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              AXYS Investment Bank reserves the right to amend, modify, or update these Terms and Conditions at any time. Clients will be notified of any material changes, and continued use after such notification constitutes acceptance of the revised terms.
            </p>
          </section>

          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">26. CONTACT INFORMATION</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              For inquiries or concerns regarding these Terms and Conditions, please contact us by email at feedback@aib-axysafrica.com or through official firm contacts. Complaints will be handled through our complaints procedure available to clients on request.
            </p>
          </section>

          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">27. NOTICES</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
              <p>
                Any notices shall be in writing and deemed delivered on the date personally delivered or mailed.
              </p>
              <p>All correspondence to AXYS Investment Bank shall be addressed to:</p>
              <div className="bg-muted/30 p-4 rounded-lg mt-2">
                <p className="font-medium">AXYS Investment Bank</p>
                <p>5th Floor, The Promenade</p>
                <p>General Mathenge Drive, Westlands</p>
                <p>Nairobi</p>
                <p>P.O. Box 43676 00100 Nairobi</p>
                <p>Email: info@axysinvestmentbank.com</p>
              </div>
            </div>
          </section>

          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">28. ACKNOWLEDGEMENT BY THE CLIENT</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              By continuing to engage with AXYS Investment Bank, the Client acknowledges and confirms that the Client has read and agrees to be bound by the provisions of these Terms and Conditions. Where an account is held by more than one person, each person comprising the Client has read and agrees to be bound by these Terms and Conditions.
            </p>
          </section>

          {/* Footer CTA */}
          <div className="text-center pt-8">
            <p className="text-muted-foreground mb-4">
              Questions about these terms? Contact us at{' '}
              <a href="mailto:info@axysinvestmentbank.com" className="text-brand-blue underline">
                info@axysinvestmentbank.com
              </a>
            </p>
          </div>
        </LegalBody>
      </Section>
    </div>
  );
}
