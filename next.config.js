/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',          // static export for Vercel/GitHub Pages
  trailingSlash: true,
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
