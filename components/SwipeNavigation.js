'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const SwipeNavigation = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [showIndicators, setShowIndicators] = useState(true);
  const hideTimerRef = useRef(null);
  const [accessiblePages, setAccessiblePages] = useState([]);

  // Fetch page visibility settings
  useEffect(() => {
    const fetchPageSettings = async () => {
      try {
        const response = await fetch('/api/page-visibility');
        if (!response.ok) {
          console.error('Failed to fetch page visibility:', response.status);
          throw new Error('Failed to fetch visibility settings');
        }
        const data = await response.json();
        
        // Define all possible pages in order
        const allPages = [
          '/',
          '/about',
          '/group',
          '/platforms',
          '/services',
          '/leverage',
          '/global-markets',
          '/fund-account/local-stocks',
          '/fund-account/multi-currency',
          '/fund-account/international-equities',
          '/fund-account/offshore-funds',
          '/research',
          '/downloads',
          '/ipo',
          '/faq',
          '/contact',
        ];

        // Filter pages based on accessibility
        const filtered = allPages.filter(page => {
          // Home page is always accessible
          if (page === '/') return true;
          
          // Get pageName from path
          const pageNameMap = {
            '/about': 'about',
            '/group': 'group',
            '/platforms': 'platforms',
            '/services': 'services',
            '/leverage': 'leverage',
            '/global-markets': 'global-markets',
            '/fund-account/local-stocks': 'fund-local-stocks',
            '/fund-account/multi-currency': 'fund-multi-currency',
            '/fund-account/international-equities': 'fund-international',
            '/fund-account/offshore-funds': 'fund-offshore',
            '/research': 'research',
            '/downloads': 'downloads',
            '/ipo': 'ipo',
            '/faq': 'faq',
            '/contact': 'contact',
          };
          
          const pageName = pageNameMap[page];
          const pageSetting = data.settings?.[pageName];
          
          // If no setting found, allow the page (default behavior)
          if (!pageSetting) return true;
          
          // Check if page is accessible
          return pageSetting.isAccessible !== false;
        });

        setAccessiblePages(filtered);
      } catch (error) {
        console.error('Error fetching page settings:', error.message);
        // Fallback to all pages if fetch fails
        setAccessiblePages([
          '/',
          '/about',
          '/group',
          '/platforms',
          '/services',
          '/leverage',
          '/global-markets',
          '/fund-account/local-stocks',
          '/fund-account/multi-currency',
          '/fund-account/international-equities',
          '/fund-account/offshore-funds',
          '/research',
          '/downloads',
          '/ipo',
          '/faq',
          '/contact',
        ]);
      }
    };

    fetchPageSettings();
  }, []);

  // Auto-hide indicators after 4 seconds of inactivity
  useEffect(() => {
    const resetHideTimer = () => {
      setShowIndicators(true);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
      hideTimerRef.current = setTimeout(() => {
        setShowIndicators(false);
      }, 4000);
    };

    resetHideTimer();

    // Reset timer on any user interaction
    const handleInteraction = () => resetHideTimer();
    
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('touchmove', handleInteraction);
    window.addEventListener('click', handleInteraction);

    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('touchmove', handleInteraction);
      window.removeEventListener('click', handleInteraction);
    };
  }, [pathname]);


  // Swipe configuration
  const MIN_SWIPE_DISTANCE = 100; // Minimum distance to trigger navigation
  const MAX_SWIPE_TIME = 500; // Maximum time for swipe gesture (ms)
  const VERTICAL_THRESHOLD = 75; // If vertical movement exceeds this, cancel horizontal swipe
  const RESISTANCE_FACTOR = 0.3; // Visual resistance during swipe

  const getCurrentPageIndex = () => {
    return accessiblePages.indexOf(pathname);
  };

  const getNextPage = () => {
    const currentIndex = getCurrentPageIndex();
    if (currentIndex < accessiblePages.length - 1) {
      return accessiblePages[currentIndex + 1];
    }
    return null;
  };

  const getPrevPage = () => {
    const currentIndex = getCurrentPageIndex();
    if (currentIndex > 0) {
      return accessiblePages[currentIndex - 1];
    }
    return null;
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
    setIsSwiping(true);
    setSwipeProgress(0);
    setSwipeDirection(null);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping) return;

    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;

    const deltaX = touchEndX.current - touchStartX.current;
    const deltaY = touchEndY.current - touchStartY.current;

    // If vertical movement is too large, cancel horizontal swipe
    if (Math.abs(deltaY) > VERTICAL_THRESHOLD) {
      setIsSwiping(false);
      setSwipeProgress(0);
      setSwipeDirection(null);
      return;
    }

    // Calculate swipe progress with resistance
    const progress = Math.min(Math.abs(deltaX) * RESISTANCE_FACTOR, 50);
    setSwipeProgress(progress);
    setSwipeDirection(deltaX > 0 ? 'right' : 'left');
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;

    const deltaX = touchEndX.current - touchStartX.current;
    const deltaY = touchEndY.current - touchStartY.current;

    // Reset visual feedback
    setIsSwiping(false);
    setSwipeProgress(0);
    setSwipeDirection(null);

    // Check if vertical movement was too large
    if (Math.abs(deltaY) > VERTICAL_THRESHOLD) {
      return;
    }

    // Check if swipe distance meets threshold
    if (Math.abs(deltaX) < MIN_SWIPE_DISTANCE) {
      return;
    }

    // Navigate based on swipe direction
    if (deltaX > 0) {
      // Swiped right - go to previous page
      const prevPage = getPrevPage();
      if (prevPage) {
        router.push(prevPage);
      }
    } else {
      // Swiped left - go to next page
      const nextPage = getNextPage();
      if (nextPage) {
        router.push(nextPage);
      }
    }
  };

  const handleTouchCancel = () => {
    setIsSwiping(false);
    setSwipeProgress(0);
    setSwipeDirection(null);
  };

  // Get visual transform for swipe feedback
  const getSwipeStyle = () => {
    if (!isSwiping || swipeProgress === 0) return {};
    
    const translateX = swipeDirection === 'right' ? swipeProgress : -swipeProgress;
    return {
      transform: `translateX(${translateX}px)`,
      transition: 'none',
    };
  };

  // Page indicators
  const currentIndex = getCurrentPageIndex();
  const showLeftIndicator = isSwiping && swipeDirection === 'right' && currentIndex > 0;
  const showRightIndicator = isSwiping && swipeDirection === 'left' && currentIndex < accessiblePages.length - 1;

  return (
    <div
      className="relative min-h-screen"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      {/* Left edge indicator */}
      <div
        className={`fixed left-0 top-1/2 -translate-y-1/2 z-50 transition-all duration-200 ${
          showLeftIndicator ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div 
          className="w-2 h-24 bg-gradient-to-r from-primary to-transparent rounded-r-full"
          style={{ 
            transform: `scaleX(${Math.min(swipeProgress / 20, 2.5)})`,
            transformOrigin: 'left'
          }}
        />
      </div>

      {/* Right edge indicator */}
      <div
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-50 transition-all duration-200 ${
          showRightIndicator ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div 
          className="w-2 h-24 bg-gradient-to-l from-primary to-transparent rounded-l-full"
          style={{ 
            transform: `scaleX(${Math.min(swipeProgress / 20, 2.5)})`,
            transformOrigin: 'right'
          }}
        />
      </div>

      {/* Page dots indicator - clickable - auto-hides after 4s */}
      <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex space-x-2 md:hidden transition-opacity duration-500 ${
        showIndicators ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        {accessiblePages.map((page, index) => (
          <button
            key={page}
            onClick={() => router.push(page)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-primary dark:bg-white w-4'
                : 'bg-transparent border border-primary dark:border-white w-2 hover:bg-primary/30 dark:hover:bg-white/30'
            }`}
            aria-label={`Go to ${page === '/' ? 'Home' : page.slice(1)}`}
          />
        ))}
      </div>

      {/* Main content with swipe transform */}
      <div style={getSwipeStyle()}>
        {children}
      </div>
    </div>
  );
};

export default SwipeNavigation;
