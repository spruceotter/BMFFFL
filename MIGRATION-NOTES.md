# BMFFFL Site Migration Notes: SvelteKit → Next.js

## What Was Preserved

The core pages and content from the original SvelteKit site carried over intact:
- Home page layout and branding
- Rules page (`/rules`)
- Trades page (`/trades`)
- About page (`/about`)
- Owner profile pages (`/owners/:id`)
- Draft history pages (`/drafts`)
- Season and standings history (`/seasons`, `/history`)

All league data (6 seasons of matchup results, standings, trade history, draft picks, and head-to-head records) was preserved and is now embedded statically in the new build.

## Major Improvements

1. **Full static export (no server required)** — The Next.js build outputs a fully static site via `next export`. Every page is pre-rendered at build time, which means faster load times and zero cold-start latency on Vercel.

2. **149 new pages** — The new site adds extensive coverage that didn't exist before: analytics tools, an articles section, a magazine section, a dynasty resources hub, a league calendar, and deep per-season breakdowns.

3. **SEO infrastructure** — Every page now has structured Open Graph and Twitter Card metadata generated from a shared `seo.ts` utility. The canonical base URL is controlled by the `NEXT_PUBLIC_SITE_URL` environment variable (defaulting to `https://bmfffl.vercel.app`).

4. **Analytics tools** — New dedicated pages for dynasty-specific analysis: free agency tracker, dynasty rankings, RB aging curve, injury risk, coaching changes tracker, and a news feed. These did not exist in the SvelteKit version.

5. **Data export** — A new `/analytics/data-export` page lets users download the league's historical data (standings, champions, H2H records, trade history, draft pick inventory) as JSON or CSV files directly from the browser.

## What Was Added (149 New Pages)

The new site includes page categories that had no equivalent in the old SvelteKit build:

- `/articles` — Editorial articles and league history writeups
- `/magazine` — Long-form featured pieces
- `/resources` — Curated dynasty research links (KTC, Dynasty Process, etc.) plus a direct link to the Sleeper league page
- `/calendar` — FAAB deadlines, waiver windows, and key league dates
- `/analytics/free-agency` — NFL free agency tracker with BMFFFL roster relevance flags
- `/analytics/dynasty-rankings` — Dynasty value rankings
- `/analytics/rb-aging-curve` — RB aging curve visualization
- `/analytics/injury-risk` — Player injury risk dashboard with BMFFFL owner attribution
- `/analytics/coaching-changes` — Coaching change tracker
- `/analytics/news-feed` — Dynasty news aggregation
- `/analytics/data-export` — Raw data downloads
- `/season/matchups` — Detailed matchup viewer (replaces old `/matchups`)

## What Was Intentionally Removed

- **Any server-side rendering** — The old SvelteKit site used SSR for some routes. The new site is 100% statically generated (`output: 'export'` in `next.config.js`). This means no real-time Sleeper API calls at request time; all data is baked in at build time.
- **Dynamic API routes** — No Next.js API routes are used. Any data fetching happens at build time or client-side only.

## Notable Design Changes

- Dark theme carried forward from the SvelteKit version with the BMFFFL gold (`#ffd700`) accent color preserved throughout.
- Navigation restructured to accommodate the expanded page count; analytics tools are grouped under `/analytics/*`.
- URL for matchups changed from `/matchups` to `/season/matchups` — a 301 redirect is in place in `vercel.json`.
- `/transactions` (old route) now permanently redirects to `/trades`.
- `/records` redirects to `/analytics/all-time-records`.
- `/standings` redirects to `/history/standings`.

## Hardcoded URL Audit Notes

The audit of `src/**/*.ts` and `src/**/*.tsx` found the following absolute URLs:

- `src/lib/seo.ts` — Contains `https://bmfffl.vercel.app` as a fallback for `NEXT_PUBLIC_SITE_URL`. This is intentional; the env var overrides it in production.
- `src/pages/resources.tsx` — Contains `https://sleeper.com/leagues/1312123497203376128` (direct link to the BMFFFL Sleeper league) and external tool links (keeptradecut.com, dynastyprocess.com, etc.). All are intentional external links, not internal routing issues.
- All other `bmfffl` matches in `src/` are identifier strings (slugs, localStorage keys, data field names) — not URLs. No changes needed.
