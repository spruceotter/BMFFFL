import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';
import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import NotificationBanner from '@/components/ui/NotificationBanner';
import KeyboardShortcuts from '@/components/ui/KeyboardShortcuts';
import '@/styles/globals.css';

// Per-page layout opt-out: set `Component.getLayout` to return the bare page
// without the BMFFFL navigation shell (e.g. for the draft game live view).
export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bmfffl.com';

/**
 * Thin gold progress bar rendered at the very top of the viewport during
 * page transitions. Animates from 0 → ~80% on routeChangeStart, then
 * jumps to 100% and fades out on routeChangeComplete (or routeChangeError).
 */
function PageProgressBar({ loading }: { loading: boolean }) {
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (loading) {
      // Reset, make visible, then animate to ~80%
      setFading(false);
      setWidth(0);
      setVisible(true);
      // Small delay so the browser registers the width:0 state before animating
      const t = setTimeout(() => setWidth(80), 20);
      return () => clearTimeout(t);
    } else {
      // Jump to 100%, then fade out
      setWidth(100);
      const fadeTimer = setTimeout(() => setFading(true), 200);
      const hideTimer = setTimeout(() => {
        setVisible(false);
        setWidth(0);
        setFading(false);
      }, 600);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [loading]);

  if (!visible) return null;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={width}
      aria-label="Page loading"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '3px',
        width: `${width}%`,
        backgroundColor: '#ffd700',
        zIndex: 9999,
        transition: loading
          ? 'width 0.4s cubic-bezier(0.1, 0.05, 0.0, 1.0)'
          : 'width 0.15s ease-in',
        opacity: fading ? 0 : 1,
        transitionProperty: fading ? 'opacity, width' : 'width',
        transitionDuration: fading ? '0.4s, 0.15s' : '0.4s',
        boxShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
        pointerEvents: 'none',
      }}
    />
  );
}

/**
 * Custom Next.js App component.
 * Wraps every page with the shared Layout (Navigation + Footer)
 * and imports global CSS / Tailwind base styles.
 *
 * The useEffect here applies the saved theme class to <html> as early as
 * possible after hydration, preventing a flash of the wrong theme.
 * ThemeToggle also does this on mount — whichever runs first wins, and
 * both write the same value so there is no conflict.
 *
 * PageProgressBar listens to Next.js router events to show a thin gold
 * progress bar at the top of the viewport during page transitions.
 */
type AppPropsWithLayout = AppProps & { Component: NextPageWithLayout };

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();
  const [navLoading, setNavLoading] = useState(false);

  // Theme restoration
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (saved === 'dark' || prefersDark || saved === null) {
      // Default to dark — matches the site's existing dark navy design
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Router event subscriptions for the progress bar
  useEffect(() => {
    const handleStart = () => setNavLoading(true);
    const handleStop = () => setNavLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router.events]);

  // Pages can define `getLayout` to opt out of the default nav/footer shell.
  // Used by standalone experiences like the draft game live view.
  const getLayout = Component.getLayout;

  const pageContent = <Component {...pageProps} />;

  const shell = getLayout ? (
    getLayout(pageContent)
  ) : (
    <>
      <NotificationBanner
        message="🏈 Season 7 starts September 2026 — 2026 Rookie Draft coming soon!"
        type="info"
        href="/season/preview-2026"
      />
      <Layout>{pageContent}</Layout>
      <KeyboardShortcuts />
    </>
  );

  return (
    <>
      <PageProgressBar loading={navLoading} />
      <Head>
        {/* Default title — individual pages override via their own <Head> */}
        <title>BMFFFL — Dynasty Fantasy Football League</title>
        <meta
          name="description"
          content="The official analytics hub for BMFFFL, a 12-team dynasty fantasy football league since 2020."
        />
        {/* OG defaults — per-page <Head> tags take precedence */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content="BMFFFL — Dynasty Fantasy Football League" />
        <meta
          property="og:description"
          content="The official analytics hub for BMFFFL, a 12-team dynasty fantasy football league since 2020."
        />
      </Head>
      {shell}
    </>
  );
}
