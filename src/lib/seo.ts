/**
 * BMFFFL Website — SEO Utilities
 * Shared meta tag helpers for consistent SEO across all pages.
 * task-699
 */

export const SITE_NAME = 'BMFFFL';
export const SITE_DESCRIPTION =
  'Best MFing Fantasy Football League — 12-team dynasty Full PPR fantasy football on Sleeper. 6 seasons of championship history, analytics, and league coverage.';
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bmfffl.vercel.app';

export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-default.png`;

// ─── Meta builder ────────────────────────────────────────────────────────────

export interface SeoMeta {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
}

/**
 * Build a full page title with site name suffix.
 * e.g. "2025 Season Recap | BMFFFL"
 */
export function buildTitle(pageTitle: string): string {
  if (pageTitle === SITE_NAME) return `${SITE_NAME} — Best MFing Fantasy Football League`;
  return `${pageTitle} | ${SITE_NAME}`;
}

/**
 * Returns a structured set of meta values for a page.
 * Use with Next.js <Head> — spread the result or destructure.
 */
export function buildSeoMeta({
  title,
  description = SITE_DESCRIPTION,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  noIndex = false,
}: SeoMeta) {
  return {
    title: buildTitle(title),
    description,
    canonical: canonical ?? `${SITE_URL}`,
    ogImage,
    noIndex,
  };
}

// ─── Standard route titles ────────────────────────────────────────────────────

export const PAGE_TITLES: Record<string, string> = {
  '/':             'BMFFFL — Best MFing Fantasy Football League',
  '/history':      'League History',
  '/season':       '2026 Season',
  '/owners':       'Owner Profiles',
  '/analytics':    'Analytics',
  '/records':      'All-Time Records',
  '/articles':     'Articles',
  '/trades':       'Trade History',
  '/drafts':       'Draft History',
  '/nfl-draft':    '2026 NFL Draft',
  '/about':        'About BMFFFL',
  '/rules':        'League Rules',
  '/calendar':     'League Calendar',
};
