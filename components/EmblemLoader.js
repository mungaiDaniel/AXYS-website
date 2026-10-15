// File: components/EmblemLoader.js
'use client';

import { useTheme } from '../contexts/ThemeContext';
import { useEffect, useState } from 'react';

export default function EmblemLoader() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-[#0a0a0f] z-50">
        <div className="animate-pulse">
          <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-[#0a0a0f] z-50">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 1092 1092" className="w-full h-full emblem-loader" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="emblemGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className="stop-start" />
              <stop offset="100%" className="stop-end" />
            </linearGradient>
          </defs>
          <path d="M38,1054c0,21,17,38,38,38H1016c21,0,38-17,38-38V76c0-21-17-38-38-38H588L244,382v-306c0-21-17-38-38-38H76c-21,0-38,17-38,38V1054z" className="emblem-path" />
        </svg>
        <style jsx>{`
          .emblem-loader { animation: rotate 2s linear infinite; }
          .emblem-path {
            fill: none;
            stroke: ${theme === 'dark' ? '#ffffff' : '#0017bf'};
            stroke-width: 40;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: 3000;
            stroke-dashoffset: 3000;
            animation: drawStroke 2s ease-in-out infinite;
          }
          @keyframes drawStroke {
            0% { stroke-dashoffset: 3000; }
            50% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -3000; }
          }
          @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .stop-start { stop-color: ${theme === 'dark' ? '#ffffff' : '#0017bf'}; }
          .stop-end { stop-color: ${theme === 'dark' ? '#8888ff' : '#0055ff'}; }
        `}</style>
      </div>
    </div>
  );
}