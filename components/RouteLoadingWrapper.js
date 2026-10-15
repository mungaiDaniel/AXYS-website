'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import LoadingPage from './LoadingPage';

const RouteLoadingWrapper = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Show loading when route changes
    setLoading(true);

    // Wait for content to actually load
    const checkContentLoaded = () => {
      // Check if document is fully loaded
      if (document.readyState === 'complete') {
        // Additional check: ensure images are loaded
        const images = document.querySelectorAll('img');
        const allImagesLoaded = Array.from(images).every(img => img.complete);
        
        if (allImagesLoaded) {
          setLoading(false);
        } else {
          // Wait for images to load
          Promise.all(
            Array.from(images).map(img => {
              if (img.complete) return Promise.resolve();
              return new Promise(resolve => {
                img.addEventListener('load', resolve);
                img.addEventListener('error', resolve); // Continue even if image fails
              });
            })
          ).then(() => {
            setLoading(false);
          });
        }
      } else {
        // Wait for DOM to be ready
        const handleLoad = () => {
          setLoading(false);
        };
        window.addEventListener('load', handleLoad);
        return () => window.removeEventListener('load', handleLoad);
      }
    };

    // Start checking immediately
    const timer = setTimeout(checkContentLoaded, 100);

    // Maximum timeout: force hide after 3 seconds to prevent indefinite loading
    const maxTimer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(maxTimer);
    };
  }, [pathname]);

  return (
    <>
      {loading && <LoadingPage />}
      <div style={{ visibility: loading ? 'hidden' : 'visible' }}>
        {children}
      </div>
    </>
  );
};

export default RouteLoadingWrapper;
