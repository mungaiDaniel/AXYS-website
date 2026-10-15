// File: components/Footer.js
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Mail, Phone, MapPin, Clock, Twitter, Facebook, Instagram, Music, Linkedin, MessageCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { AuroraBackground } from '@/components/motion';
import ScrollRevealGroup from '@/components/ScrollRevealGroup';

const Footer = () => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [pageVisibility, setPageVisibility] = useState({});
  
  // Hide footer on admin pages
  if (pathname.startsWith('/admin')) return null;

  useEffect(() => {
    fetchPageVisibility();
  }, []);

  const fetchPageVisibility = async () => {
    try {
      const response = await fetch('/api/page-visibility');
      if (!response.ok) {
        console.error('Failed to fetch page visibility:', response.status);
        return;
      }
      const data = await response.json();
      setPageVisibility(data.settings || {});
    } catch (error) {
      console.error('Error fetching or parsing page visibility:', error.message);
    }
  };

  // Helper to check if a page should be shown
  const shouldShowPage = (pageName) => {
    const visibility = pageVisibility[pageName];
    return !visibility || visibility.showInNav !== false;
  };

  const socialMedia = [
    { name: 'Twitter', icon: Twitter, url: 'https://x.com/AIB_AXYSAfrica' },
    { name: 'Facebook', icon: Facebook, url: 'https://www.facebook.com/people/Aib-Axys-Africa/100091789801325/' },
    { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/aib_axys_africa/' },
    { name: 'TikTok', icon: Music, url: 'https://www.tiktok.com/@aib_axysafrica?is_from_webapp=1&sender_device=pc' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/company/aib-capital-limited/' },
    { name: 'WhatsApp', icon: MessageCircle, url: 'https://chat.whatsapp.com/H4tQJf1CymG345gZ9WrEO6?mode=hq2tcla' },
  ];

  return (
    <footer className="mx-footer bg-gray-50 dark:bg-[#0d1320] mt-20 py-12 border-t border-gray-200 dark:border-[#1e2a3d]">
      <AuroraBackground variant="header" />
      <div className="container mx-auto px-4">
        <ScrollRevealGroup className="grid grid-cols-1 md:grid-cols-5 gap-8" staggerDelay={80} margin="0px">
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image src={theme === 'dark' ? '/axys-logo-dark.png' : '/axys-logo-light.png'} alt="AXYS Investment Bank logo" width={300} height={100} className="h-10 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground">Leading Brokerage Firm in Kenya, specializing in Local Stocks and Bonds, International Equities, ETFs and Offshore Funds.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {shouldShowPage('about') && <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>}
              {shouldShowPage('group') && <li><Link href="/group" className="text-sm text-muted-foreground hover:text-primary transition-colors">AXYS Group</Link></li>}
              {shouldShowPage('platforms') && <li><Link href="/platforms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Trading Platforms</Link></li>}
              {shouldShowPage('faq') && <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>}
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms & Conditions</Link></li>
              {shouldShowPage('contact') && <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Services</h3>
            <ul className="space-y-2">
              {shouldShowPage('ipo') && <li><Link href="/ipo" className="text-sm text-muted-foreground hover:text-primary transition-colors">IPO Applications</Link></li>}
              {shouldShowPage('leverage') && <li><Link href="/leverage" className="text-sm text-muted-foreground hover:text-primary transition-colors">IPO Financing</Link></li>}
              {shouldShowPage('services') && <li><Link href="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors">Services</Link></li>}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Follow Us</h3>
            <ul className="space-y-2">
              {socialMedia.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {social.icon && <social.icon className="w-4 h-4 transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />}
                    <span>{social.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-sm text-muted-foreground"><MapPin className="w-4 h-4 text-brand-blue" /><span>Nairobi, Kenya</span></li>
              <li className="flex items-center space-x-2 text-sm text-muted-foreground"><Phone className="w-4 h-4 text-brand-blue" /><span>+254 711 047000</span></li>
              <li className="flex items-center space-x-2 text-sm text-muted-foreground"><Mail className="w-4 h-4 text-brand-blue" /><span>info@axysinvestmentbank.com</span></li>
              <li className="flex items-center space-x-2 text-sm text-muted-foreground"><Clock className="w-4 h-4 text-brand-blue" /><span>Mon - Fri: 9:00 AM - 5:00 PM</span></li>
            </ul>
          </div>
        </ScrollRevealGroup>
        <div className="border-t border-gray-200 dark:border-[#1e2a3d] mt-8 pt-8">
          <div className="space-y-4 text-xs text-muted-foreground leading-relaxed">
            <p><strong>Risk Disclaimer:</strong> Investing in the Nairobi Securities Exchange (NSE) and global capital markets involves risk. The value of stocks and fixed income instruments can fluctuate, and you may receive back less than your original investment. Past performance is not indicative of future returns. Please ensure you fully understand the risks involved or seek independent financial advice before trading.</p>
            <p><strong>Regulatory Status:</strong> AXYS Investment Bank is licensed and regulated by the Capital Markets Authority (CMA) and Central Bank of Kenya (CBK). Member of the Nairobi Securities Exchange (NSE) and the Central Depository and Settlement Corporation (CDSC).</p>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-[#1e2a3d] mt-6 pt-6 text-center">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} AXYS Investment Bank. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
