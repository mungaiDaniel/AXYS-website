'use client';

import { Shield, Lock, FileText, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { PageHero, Section } from '@/components/layout/PageLayout';
import { LegalBody } from '@/components/layout/Legal';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        crumbs={[{ label: 'Privacy Policy' }]}
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="Last Updated: January 19, 2026"
        aside={
          <div className="mx-fund-card">
            <p className="mx-eyebrow !text-[#9AA6EF] inline-flex items-center gap-2">
              <Shield className="w-3.5 h-3.5" /> Your Privacy Rights
            </p>
            <ul className="mt-5 space-y-4">
              {[
                { icon: FileText, title: 'Access Your Data', text: 'Request a copy of your data' },
                { icon: Lock, title: 'Delete Your Data', text: 'Right to be forgotten' },
                { icon: AlertCircle, title: 'Update Your Data', text: 'Correct your information' },
              ].map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 mt-1 text-[#9AA6EF] shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm text-white">{title}</h3>
                    <p className="text-xs text-[#C9CFF5]">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="text-xs text-[#C9CFF5] mt-6 pt-5 border-t border-white/10">
              To exercise your rights, email: <strong className="mx-mono text-white">info@axysinvestmentbank.com</strong>
            </p>
            <div className="mx-fund-line" aria-hidden="true" />
          </div>
        }
      />

      <Section tone="white">
        <LegalBody>
          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              AXYS Investment Bank is committed to protecting your privacy and personal data. 
              This Privacy Policy explains how we collect, use, store, and protect your information in compliance with:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground ml-4">
              <li>Kenya Data Protection Act, 2019</li>
              <li>GDPR (for EU residents)</li>
              <li>Capital Markets Authority (CMA) regulations</li>
            </ul>
          </section>

          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">2. Data We Collect</h2>
            <h3 className="font-semibold mb-2">Information You Provide:</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
              <li><strong>Contact Forms</strong>: Name, email, phone number, CDSC number (optional), messages</li>
              <li><strong>Research Downloads</strong>: Download tracking</li>
            </ul>
            <h3 className="font-semibold mb-2">Automatically Collected:</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong>Technical Data</strong>: IP address, browser type, device information</li>
              <li><strong>Cookies</strong>: Session cookies for admin authentication, theme preferences</li>
            </ul>
          </section>

          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">3. Your GDPR Rights</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1">✅ Right to Access</h3>
                <p className="text-sm text-muted-foreground">Request a copy of all personal data we hold about you.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">🗑️ Right to Erasure ("Right to be Forgotten")</h3>
                <p className="text-sm text-muted-foreground">Request deletion of your personal data.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">✏️ Right to Rectification</h3>
                <p className="text-sm text-muted-foreground">Correct inaccurate or incomplete data.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">📦 Right to Data Portability</h3>
                <p className="text-sm text-muted-foreground">Receive your data in a machine-readable format.</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-foreground">
                <strong>Exercise Your Rights:</strong> Email <a href="mailto:info@axysinvestmentbank.com" className="text-brand-blue underline">info@axysinvestmentbank.com</a> with:
              </p>
              <ul className="text-sm text-muted-foreground mt-2 ml-4 list-disc list-inside">
                <li>Subject: "Data Access Request" (to receive your data)</li>
                <li>Subject: "Data Deletion Request" (to delete your data)</li>
                <li>Subject: "Data Correction Request" (to update your data)</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-2">We will respond within 30 days.</p>
            </div>
          </section>

          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">4. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to protect your personal data:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Encrypted data transmission (HTTPS/TLS)</li>
              <li>Password hashing (bcrypt)</li>
              <li>Access control and role-based permissions</li>
              <li>Regular security audits</li>
              <li>Secure admin authentication (JWT tokens)</li>
              <li>Rate limiting to prevent abuse</li>
              <li>Input sanitization to prevent attacks</li>
            </ul>
          </section>

          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">5. Regulatory Compliance</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              AXYS Investment Bank is a licensed Stockbroker regulated by the Capital Markets Authority (CMA).
              We comply with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Kenya Data Protection Act, 2019</li>
              <li>GDPR (EU General Data Protection Regulation)</li>
              <li>Capital Markets Authority regulations</li>
              <li>Nairobi Securities Exchange rules</li>
            </ul>
          </section>

          <section className="mx-legal-section">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">6. Contact & Data Protection Officer</h2>
            <div className="space-y-3 text-muted-foreground">
              <p><strong>For Privacy Inquiries:</strong></p>
              <p>Email: <a href="mailto:privacy@aib-axysafrica.com" className="text-brand-blue underline">privacy@aib-axysafrica.com</a></p>
              <p>Phone: +254 711 047000</p>
              <p>Address: 5th floor, The Promenade, General Mathenge Road, Nairobi, Kenya</p>
            </div>
          </section>

          <div className="text-center mt-8">
            <Link href="/contact">
              <button data-analytics-label="privacy_contact_us_about_privacy" data-analytics-event="button_click" className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:scale-105">
                Contact Us About Privacy
              </button>
            </Link>
          </div>
        </LegalBody>
      </Section>
    </div>
  );
}
