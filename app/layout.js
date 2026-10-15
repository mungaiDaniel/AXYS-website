import { Inter, JetBrains_Mono, Noto_Sans } from 'next/font/google';
import './globals.css';
import '@/styles/motion.css';
import ClientLayout from '@/components/ClientLayout';
import { MOTION_BOOT_SCRIPT } from '@/lib/motion';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Prevent invisible text during font load
  preload: true,
  fallback: ['system-ui', 'arial']
});

// Heavy display face for H1/H2 (closest match to the reference headline)
const display = Noto_Sans({
  subsets: ['latin'],
  weight: ['800', '900'],
  variable: '--font-display',
  display: 'swap',
  fallback: ['system-ui', 'arial'],
});

// Monospace for labels, figures and badges (motion/type system, see MOTION.md)
const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  fallback: ['ui-monospace', 'Menlo', 'monospace'],
});

export const metadata = {
  title: 'AXYS Investment Bank - Leading Stock Trading in Kenya',
  description: 'IPOs, Leverage & Global Funds - Your trusted partner in African financial markets',
};

// Inline script to set theme immediately before React hydrates
const themeScript = `
  (function() {
    var theme = localStorage.getItem('aib-theme');
    if (theme === 'dark') {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  })();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT_SCRIPT }} />
      </head>
      <body className={`${inter.className} ${mono.variable} ${display.variable} bg-white dark:bg-[#121929]`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
