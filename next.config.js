const path = require('path');

const nextConfig = {
  output: 'standalone',
  // NOTE: Using standard build mode for Emergent deployment
  // Standalone mode documentation kept in /app/scripts/ for reference
  poweredByHeader: false, // Hide X-Powered-By: Next.js header
  images: {
    unoptimized: true,
  },
  // External packages for server components (Next.js 15+)
  serverExternalPackages: ['mongodb', 'mongoose'],
  // Add empty turbopack config to silence Next.js 16 warning
  turbopack: {
    root: path.resolve(__dirname),
  },
  webpack(config, { dev }) {
    if (dev) {
      // Reduce CPU/memory from file watching
      config.watchOptions = {
        poll: 2000, // check every 2 seconds
        aggregateTimeout: 300, // wait before rebuilding
        ignored: ['**/node_modules'],
      };
    }
    return config;
  },
  onDemandEntries: {
    maxInactiveAge: 10000,
    pagesBufferLength: 2,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Security Headers - Production Hardened
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload"
          },
          { 
            key: "X-Frame-Options", 
            value: "SAMEORIGIN"
          },
          { 
            key: "X-Content-Type-Options", 
            value: "nosniff" 
          },
          { 
            key: "X-XSS-Protection", 
            value: "1; mode=block" 
          },
          { 
            key: "Referrer-Policy", 
            value: "strict-origin-when-cross-origin" 
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()"
          },
          { 
            key: "Content-Security-Policy", 
            value: "frame-ancestors 'self'; base-uri 'self'; form-action 'self';"
          },
          // CORS Headers - Configurable via environment
          { 
            key: "Access-Control-Allow-Origin", 
            value: process.env.CORS_ORIGINS || "*" 
          },
          { 
            key: "Access-Control-Allow-Methods", 
            value: "GET, POST, PUT, DELETE, PATCH, OPTIONS" 
          },
          { 
            key: "Access-Control-Allow-Headers", 
            value: "Content-Type, Authorization" 
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true"
          },
          // Additional Security
          {
            key: "X-DNS-Prefetch-Control",
            value: "on"
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
