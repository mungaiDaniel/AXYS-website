'use client';

import { ThemeProvider } from '../contexts/ThemeContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SwipeNavigation from '@/components/SwipeNavigation';
import RouteGuard from '@/components/RouteGuard';
import PageAccessGuard from '@/components/PageAccessGuard';
import { trackPageView, trackSessionStart, trackSessionEnd, trackScrollDepth, trackButtonClick, trackLinkClick } from '@/lib/analytics';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import LoadingPage from '@/components/LoadingPage';
import { MotionProvider, PageTransition, ScrollProgress, CustomCursor } from '@/components/motion';

export default function ClientLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [prevPathname, setPrevPathname] = useState('');
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  // Handle initial page load
  useEffect(() => {
    // Page is mounted, turn off loading
    setIsLoading(false);
  }, []);

  // Handle route transitions
  useEffect(() => {
    if (prevPathname && prevPathname !== pathname) {
      // Route is changing, show loading
      setIsLoading(true);
    }
    setPrevPathname(pathname);
  }, [pathname]);

  const scrollDepthRef = useRef(new Set());
  const sessionStartedRef = useRef(false);

  // Track page views on initial load and client-side navigation
  useEffect(() => {
    if (typeof window !== 'undefined' && pathname && !pathname.startsWith('/admin')) {
      trackPageView(window.location.pathname + window.location.search);
    }
  }, [pathname]);

  // Session lifecycle tracking
  useEffect(() => {
    if (typeof window === 'undefined' || !pathname || pathname.startsWith('/admin')) return;

    if (!sessionStartedRef.current) {
      sessionStartedRef.current = true;
      trackSessionStart(window.location.pathname + window.location.search);
    }

    const handleSessionEnd = () => {
      trackSessionEnd(window.location.pathname + window.location.search);
    };

    window.addEventListener('beforeunload', handleSessionEnd);
    window.addEventListener('pagehide', handleSessionEnd);

    return () => {
      window.removeEventListener('beforeunload', handleSessionEnd);
      window.removeEventListener('pagehide', handleSessionEnd);
    };
  }, [pathname]);

  // Scroll depth tracking
  useEffect(() => {
    if (typeof window === 'undefined' || pathname?.startsWith('/admin')) return;

    const thresholds = [25, 50, 75, 100];
    const handleScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset;
      const docHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
      const winHeight = window.innerHeight;
      const progress = Math.min(100, Math.round(((scrollTop + winHeight) / docHeight) * 100));

      thresholds.forEach((threshold) => {
        if (progress >= threshold && !scrollDepthRef.current.has(threshold)) {
          scrollDepthRef.current.add(threshold);
          trackScrollDepth(threshold, window.location.pathname + window.location.search);
        }
      });
    };

    const throttledScroll = () => {
      window.requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      scrollDepthRef.current.clear();
    };
  }, [pathname]);

  // CTA / link click tracking for marked elements
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleClick = (event) => {
      if (window.location.pathname.startsWith('/admin')) return;
      const target = event.target.closest('[data-analytics-label]');
      if (!target) return;

      const analyticsLabel = target.dataset.analyticsLabel;
      const analyticsEvent = target.dataset.analyticsEvent || (target.tagName === 'A' ? 'link_click' : 'button_click');
      const pageUrl = window.location.pathname + window.location.search;
      const metadata = {
        text: target.innerText?.trim().slice(0, 120) || '',
        href: target.tagName === 'A' ? target.href : '',
      };

      if (analyticsEvent === 'link_click') {
        trackLinkClick(analyticsLabel, pageUrl, metadata);
      } else {
        trackButtonClick(analyticsLabel, pageUrl, metadata);
      }
    };

    window.addEventListener('click', handleClick, true);

    return () => {
      window.removeEventListener('click', handleClick, true);
    };
  }, []);

  // Turn off loading when children are ready
  useEffect(() => {
    if (isLoading && children) {
      setIsLoading(false);
    }
  }, [children, isLoading]);

  return (
    <ThemeProvider>
      <MotionProvider>
        {isLoading && <LoadingPage />}
        {!isAdmin && <ScrollProgress />}
        {!isAdmin && <CustomCursor />}
        <RouteGuard>
          <SwipeNavigation>
            <Navbar />
            <main className="pt-16 bg-white dark:bg-[#0a0a0f]" data-mx-site={isAdmin ? undefined : ''}>
              <PageAccessGuard>
                {isAdmin ? children : <PageTransition>{children}</PageTransition>}
              </PageAccessGuard>
            </main>

            <Footer />
          </SwipeNavigation>
        </RouteGuard>
      </MotionProvider>
    </ThemeProvider>
  );
}
