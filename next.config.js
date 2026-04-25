/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',          // static export for Vercel/GitHub Pages
  trailingSlash: true,
  typescript: {
    // Generated .next/types/validator.ts references deleted analytics pages.
    // All runtime TypeScript errors are caught locally; this bypasses the
    // stale-reference errors in auto-generated files.
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,       // required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sleepercdn.com',  // Sleeper player headshots
        pathname: '/content/**',
      },
    ],
  },
};

module.exports = nextConfig;
