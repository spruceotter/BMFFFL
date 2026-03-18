import { Html, Head, Main, NextScript } from 'next/document';

/**
 * Custom _document.tsx — adds PWA manifest, theme color, and Apple Touch meta tags.
 * This file is rendered server-side (at static export time) only.
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Theme color — matches bg-[#0d1b2a] */}
        <meta name="theme-color" content="#0d1b2a" />
        <meta name="msapplication-TileColor" content="#0d1b2a" />

        {/* iOS PWA support */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BMFFFL" />

        {/* Fallback icon links — point to the same files referenced in manifest */}
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192.png" />

        {/* Open Graph defaults (per-page <Head> can override) */}
        <meta property="og:site_name" content="BMFFFL Dynasty" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
