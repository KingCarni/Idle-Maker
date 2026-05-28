/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'static.prod-images.emergentagent.com' },
      { protocol: 'https', hostname: '**.emergentagent.com' },
    ],
  },
  env: {
    // Single source of truth: the protected REACT_APP_BACKEND_URL from frontend/.env.
    // Exposed to the browser as NEXT_PUBLIC_BACKEND_URL so client-side fetch() can read it.
    NEXT_PUBLIC_BACKEND_URL:
      process.env.REACT_APP_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL,
  },
  // Allow any preview host for HMR/dev
  experimental: {
    serverActions: { allowedOrigins: ['*'] },
  },
};

module.exports = nextConfig;
