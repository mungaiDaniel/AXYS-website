'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { trackFormSubmit } from '@/lib/analytics';
import { Mail, Phone, MapPin, Send, Twitter, Facebook, Instagram, Music, Linkedin, MessageCircle } from 'lucide-react';
import { Reveal, Stagger, NoiseOverlay } from '@/components/motion';
import { PageHero, Section } from '@/components/layout/PageLayout';

export default function ContactPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    hasCDSC: '',
    cdscNumber: '',
  });

  // Pre-select subject from URL parameter
  useEffect(() => {
    const subjectParam = searchParams.get('subject');
    if (subjectParam) {
      setFormData(prev => ({ ...prev, subject: subjectParam }));
    }
  }, [searchParams]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const subjectOptions = [
    { value: 'account-opening', label: 'Account Opening' },
    { value: 'ipo', label: 'Quickmart IPO Application' },
    { value: 'dangote-ipo', label: 'Dangote Petroleum Refinery IPO Application' },
    { value: 'funding-issues', label: 'Funding issues' },
    { value: 'password-reset', label: 'Password reset or Forgot password' },
    { value: 'dormant-account', label: 'Dormant account activation' },
    { value: 'general', label: 'General Inquiries' },
    { value: 'offshore', label: 'Offshore Services' },
  ];

  const needsCDSC = formData.subject === 'ipo' || formData.subject === 'dangote-ipo' || formData.subject === 'general' || formData.subject === 'dormant-account' || formData.subject === 'funding-issues' || formData.subject === 'password-reset' || formData.subject === 'offshore';
  const isGeneral = formData.subject === 'general';
  const isAccountOpening = formData.subject === 'account-opening';

  // Label adapts: General Inquiries asks for CDSC or ID number
  const cdscFieldLabel = isGeneral ? 'CDSC Number / ID Number *' : 'CDSC Number *';
  const cdscFieldPlaceholder = isGeneral ? 'Enter your CDSC number or ID number' : 'Enter your CDSC number';
  const hasCDSCLabel = isGeneral
    ? 'Do you have a CDSC number or National ID?'
    : 'Do you have a CDSC number?';

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.subject) {
      newErrors.subject = 'Please select a subject';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    if (needsCDSC && !formData.hasCDSC) {
      newErrors.hasCDSC = 'Please select an option';
    }

    if (needsCDSC && formData.hasCDSC === 'yes' && !formData.cdscNumber.trim()) {
      newErrors.cdscNumber = isGeneral ? 'CDSC Number or ID Number is required' : 'CDSC number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccessMessage('');

    if (typeof window !== 'undefined') {
      trackFormSubmit('contact_form', window.location.pathname + window.location.search, {
        subject: formData.subject,
        hasCDSC: formData.hasCDSC,
      });
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Thank you! Your message has been sent successfully.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          hasCDSC: '',
          cdscNumber: '',
        });
        setErrors({});
      } else {
        alert(data.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const channels = [
    {
      icon: MapPin,
      title: 'Office Address',
      lines: ['5th floor, The Promenade', 'General Mathenge Road', 'Nairobi, Kenya'],
    },
    { icon: Phone, title: 'Phone', lines: ['+254 711 047000', 'Mon-Fri, 9AM-5PM EAT'] },
    { icon: Mail, title: 'Email', lines: ['info@axysinvestmentbank.com', 'www.aib-axysafrica.com'] },
  ];

  const socials = [
    { name: 'Twitter/X', icon: Twitter, url: 'https://x.com/AIB_AXYSAfrica' },
    { name: 'Facebook', icon: Facebook, url: 'https://www.facebook.com/people/Aib-Axys-Africa/100091789801325/' },
    { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/aib_axys_africa/' },
    { name: 'TikTok', icon: Music, url: 'https://www.tiktok.com/@aib_axysafrica?is_from_webapp=1&sender_device=pc' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/company/aib-capital-limited/' },
    { name: 'WhatsApp', icon: MessageCircle, url: 'https://chat.whatsapp.com/H4tQJf1CymG345gZ9WrEO6?mode=hq2tcla' },
  ];

  return (
    <div className="min-h-screen">
      <PageHero
        crumbs={[{ label: 'Contact' }]}
        eyebrow="Talk to us"
        title="Contact Us"
        subtitle="Get in touch with our team for any inquiries or support"
        aside={
          <div className="mx-fund-card">
            <p className="mx-eyebrow !text-[#9AA6EF] inline-flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" aria-hidden="true" /> Reach us
            </p>
            <ul className="mt-5 space-y-4">
              {channels.map(({ icon: Icon, title, lines }) => (
                <li key={title} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 mt-1 text-[#9AA6EF] shrink-0" aria-hidden="true" />
                  <div>
                    <p className="mx-mono text-[10px] uppercase tracking-[0.16em] text-[#9AA6EF]/70">{title}</p>
                    <p className="mx-mono text-sm text-white">{lines[0]}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        }
      />

      <Section tone="tint">
        <Reveal>
          <div className="mx-contact-sheet grid lg:grid-cols-[0.85fr_1.4fr] overflow-hidden rounded-3xl">
            {/* Info panel */}
            <aside className="mx-hero relative p-8 md:p-10 flex flex-col">
              <NoiseOverlay />
              <div className="relative z-10">
                <p className="mx-eyebrow !text-[#9AA6EF] mb-3">Contact details</p>
                <h2 className="mx-h1 text-white !text-3xl mb-8">We&apos;re here to help</h2>
                <Stagger className="space-y-6">
                  {channels.map(({ icon: Icon, title, lines }) => (
                    <div key={title} className="flex items-start gap-4">
                      <span className="mx-service-icon !w-11 !h-11 !bg-white/10 !border-white/15 shrink-0">
                        <Icon className="text-white" />
                      </span>
                      <div>
                        <h3 className="font-bold text-white mb-1">{title}</h3>
                        {lines.map((line) => (
                          <p key={line} className="text-sm text-[#C9CFF5]">{line}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </Stagger>
              </div>

              {/* Social Media */}
              <div className="relative z-10 mt-12 pt-8 border-t border-white/10">
                <h2 className="text-lg font-bold text-white mb-1">Connect With Us</h2>
                <p className="text-sm text-[#C9CFF5] mb-5">
                  Follow our social media channels for market updates, investment tips, and company news
                </p>
                <div className="flex flex-wrap gap-2">
                  {socials.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={social.name}
                      aria-label={social.name}
                      className="mx-social"
                    >
                      <social.icon className="w-4 h-4" />
                      <span className="text-xs font-semibold">{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </aside>

            {/* Contact Form */}
            <div className="bg-white dark:bg-[#121929] p-8 md:p-10">
              <p className="mx-eyebrow mb-3">Message</p>
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

              {successMessage && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-600 dark:text-green-400">
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 glass rounded-lg bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                    placeholder="Your full name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 glass rounded-lg bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 glass rounded-lg bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                    placeholder="+254 ..."
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 glass rounded-lg bg-background/50 dark:bg-[#0a0a0f]/60 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-white dark:bg-[#0a0a0f] text-foreground dark:text-white">Select a subject</option>
                    {subjectOptions.map((option) => (
                      <option key={option.value} value={option.value} className="bg-white dark:bg-[#0a0a0f] text-foreground dark:text-white">
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                </div>

                {/* CDSC Number Section */}
                {needsCDSC && (
                  <div className="space-y-4 p-4 bg-muted/20 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {hasCDSCLabel} *
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="hasCDSC"
                            value="yes"
                            checked={formData.hasCDSC === 'yes'}
                            onChange={handleChange}
                            className="w-4 h-4 text-primary focus:ring-primary"
                          />
                          <span className="text-sm">Yes</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="hasCDSC"
                            value="no"
                            checked={formData.hasCDSC === 'no'}
                            onChange={handleChange}
                            className="w-4 h-4 text-primary focus:ring-primary"
                          />
                          <span className="text-sm">No</span>
                        </label>
                      </div>
                      {errors.hasCDSC && <p className="text-red-500 text-sm mt-1">{errors.hasCDSC}</p>}
                    </div>

                    {formData.hasCDSC === 'yes' && (
                      <div>
                        <label htmlFor="cdscNumber" className="block text-sm font-medium mb-2">
                          {cdscFieldLabel}
                        </label>
                        <input
                          type="text"
                          id="cdscNumber"
                          name="cdscNumber"
                          value={formData.cdscNumber}
                          onChange={handleChange}
                          className="w-full px-4 py-3 glass rounded-lg bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                          placeholder={cdscFieldPlaceholder}
                        />
                        {errors.cdscNumber && (
                          <p className="text-red-500 text-sm mt-1">{errors.cdscNumber}</p>
                        )}
                      </div>
                    )}

                    {/* {formData.hasCDSC === 'no' && (
                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                          {isGeneral
                            ? 'No problem — please describe your inquiry in the message field below and our team will assist you.'
                            : 'Please create an account first. Download our DigiTrader app or visit our office to open a CDSC account before applying.'}
                        </p>
                      </div>
                    )} */}
                  </div>
                )}

                {/* Account Opening Message - shown for Account Opening subject OR when no CDSC */}
                {(isAccountOpening || (needsCDSC && formData.hasCDSC === 'no')) && (
                  <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                    <p className="text-sm mb-4">
                      To open an account, please download our DigiTrader app or use our online platform for account creation.
                    </p>
                    <div className="flex gap-4 flex-wrap">
                      <button
                        type="button"
                        data-analytics-label="download_digitrader_app"
                        data-analytics-event="button_click"
                        onClick={() => router.push('/platforms')}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:scale-105 transition-all duration-300"
                      >
                        Download DigiTrader App
                      </button>
                      <button
                        type="button"
                        data-analytics-label="open_account_online"
                        data-analytics-event="button_click"
                        onClick={() => router.push('https://aibaxys.kenyaonlinetrading.com/ActiveTrader/#!/new-trading-account')}
                        className="px-6 py-2 bg-white border border-[#0017bf] text-[#0017bf] rounded-lg font-semibold hover:bg-[#e6f0ff] hover:scale-105  transition-all duration-300"
                      >
                        Open Account Online
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 glass rounded-lg bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 resize-none"
                    placeholder="Your message..."
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  data-analytics-label="contact_form_submit"
                  data-analytics-event="button_click"
                  disabled={loading}
                  className="w-full px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:scale-105 active:scale-98 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                  <span>{loading ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            </div>
          </div>
        </Reveal>
      </Section>
    </div>
  );
}
