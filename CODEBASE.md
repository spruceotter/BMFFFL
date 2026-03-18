# BMFFFL Website — Codebase Documentation

**Project**: BMFFFL Dynasty Fantasy Football Website
**Framework**: Next.js 14 (Pages Router, Static Export)
**Last Updated**: March 2026

---

## Architecture Overview

This is a **fully static Next.js 14 site** using the Pages Router with `output: 'export'`. All pages are pre-rendered at build time to the `/out` directory. No Node.js runtime is required at serve time — the site deploys as static files.

### Key Architectural Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Router | Pages Router (not App Router) | Full static export compatibility |
| Output | `output: 'export'` | Vercel/CDN deployment without serverless runtime |
| Styling | Tailwind CSS | Utility-first, consistent design system |
| Articles | MDX via `gray-matter` + `next-mdx-remote` | Rich content with frontmatter metadata |
| Data | Static JSON files + Sleeper API pipeline | Fresh data at build time |

---

## Directory Structure

```
bmfffl-website/
├── src/
│   ├── pages/          # All Next.js pages (Pages Router)
│   │   ├── index.tsx   # Homepage
│   │   ├── _app.tsx    # App wrapper (Navigation + Layout)
│   │   ├── analytics/  # 20+ analytics tool pages
│   │   ├── history/    # Season archives (dynamic [year] routes)
│   │   ├── season/     # Current season hub
│   │   ├── articles/   # Article listing + MDX rendering
│   │   ├── owners/     # Owner profiles (dynamic [slug] routes)
│   │   └── ...
│   ├── components/
│   │   ├── layout/     # Navigation, Footer, Layout wrapper
│   │   └── ui/         # Reusable UI components
│   └── lib/
│       ├── cn.ts           # className utility (clsx + tailwind-merge)
│       ├── mdx.ts          # MDX loading utilities
│       ├── sleeper.ts      # Sleeper API client
│       ├── data-fetcher.ts # Static JSON data loaders
│       ├── seo.ts          # SEO utilities
│       └── schema.ts       # TypeScript type definitions
├── content/
│   ├── articles/       # 36 MDX article files
│   └── data/           # Static JSON data files
│       ├── owner-stats-verified.json   # Authoritative owner records
│       ├── champions-verified.json     # 6 season champions
│       ├── current-rosters.json        # Dynasty rosters
│       ├── pick-inventory.json         # Draft pick holdings
│       └── ...
├── scripts/
│   ├── fetch-sleeper-snapshot.ts   # Pulls live data from Sleeper API
│   └── generate-data-index.ts      # Builds data index files
├── public/             # Static assets
├── next.config.js      # Next.js config (output: 'export')
├── vercel.json         # Vercel deployment config
└── .env.example        # Required environment variables
```

---

## Pages Router Rules

**Critical**: This project uses Pages Router. Never use App Router patterns.

✅ Correct patterns:
```tsx
import { useRouter } from 'next/router';           // Pages Router
import Link from 'next/link';
import Head from 'next/head';
export async function getStaticProps() { ... }      // SSG
export async function getStaticPaths() { ... }      // Dynamic routes
```

❌ Forbidden patterns:
```tsx
import { usePathname } from 'next/navigation';     // App Router ONLY
import { useSearchParams } from 'next/navigation'; // App Router ONLY
'use client';                                       // App Router ONLY
export default function Layout({ children }) { ... } // App Router layout
```

---

## Design System

### Colors
```css
--bg-base:    #0d1b2a   /* Page background */
--bg-card:    #16213e   /* Card background */
--bg-border:  #2d4a66   /* Border color */
--gold:       #ffd700   /* Primary accent (BMFFFL gold) */
--red:        #e94560   /* Secondary accent (danger/sell) */
--text-light: slate-300 /* Body text */
--text-muted: slate-500 /* Secondary text */
```

### Common Patterns
```tsx
// Card
<div className="bg-[#16213e] rounded-xl p-4 border border-[#2d4a66]">

// Section container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

// Gold accent text
<span className="text-[#ffd700]">

// Filter button (active)
<button className="bg-[#ffd700] text-[#1a1a2e] px-3 py-1 rounded-full text-xs font-semibold">

// Filter button (inactive)
<button className="bg-[#16213e] text-slate-400 hover:text-white border border-[#2d4a66] px-3 py-1 rounded-full text-xs font-semibold">
```

---

## Data Layer

### Authoritative Data Files

All factual BMFFFL data lives in `content/data/`. Always cross-reference these before writing any stats.

#### `owner-stats-verified.json`
```json
{
  "MLSchools12": { "wins": 68, "losses": 15, "winPct": 0.819, "championships": 2, "playoffAppearances": 6 },
  "SexMachineAndyD": { "wins": 50, "losses": 33, "winPct": 0.602 },
  "JuicyBussy": { "wins": 46, "losses": 37, "winPct": 0.554, "championships": 1 },
  ...
}
```

#### `champions-verified.json`
```json
[
  { "year": 2020, "champion": "Cogdeill11", "teamName": "Cogdeill's Squad" },
  { "year": 2021, "champion": "MLSchools12", "teamName": "Schoolcraft Football Team" },
  { "year": 2022, "champion": "Grandes" },
  { "year": 2023, "champion": "JuicyBussy", "teamName": "Juicy Bussy", "seed": 6 },
  { "year": 2024, "champion": "MLSchools12", "teamName": "Schoolcraft Football Team" },
  { "year": 2025, "champion": "tdtd19844" }
]
```

### Critical Facts
- **League format**: Full PPR (1.0/rec), **NOT Half-PPR**
- **Scoring**: 4pt passing TDs, Superflex
- **FAAB**: $10,000 budget (not $100)
- **Trade deadline**: Week 14 (not Week 10)
- **Seasons**: 2020-2025 (6 seasons)
- **Champions**: 5 unique (MLSchools12 won twice: 2021 + 2024)
- **Top record**: MLSchools12 68-15 (.819)
- **Sleeper League ID**: `1312123497203376128`

---

## Adding New Pages

### Standard Analytics Page Template
```tsx
import Head from 'next/head';
import { useState } from 'react';
import { cn } from '@/lib/cn';

export default function MyAnalyticsPage() {
  return (
    <>
      <Head>
        <title>Page Title | BMFFFL Analytics</title>
        <meta name="description" content="..." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Header section */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-black text-white mb-1">Title</h1>
          <p className="text-slate-400 text-sm">Subtitle</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-[#0d1b2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* ... */}
        </div>
      </section>
    </>
  );
}
```

### After Adding a Page
1. Add it to the Navigation dropdown in `src/components/layout/Navigation.tsx`
2. Add it to the Analytics hub in `src/pages/analytics/index.tsx`
3. Run `npm run build` to verify it compiles

---

## Adding New Articles

1. Create `content/articles/your-slug.mdx` with frontmatter:
```yaml
---
title: "Article Title"
subtitle: "Optional subtitle"
author: "Flint"
publishedAt: "2026-03-16"
tags: ["analysis", "dynasty"]
category: "analysis"
featured: false
validAsOf: "March 2026"
status: "published"
---
```

2. Add the article to `src/pages/articles/index.tsx` ARTICLES array:
```tsx
{
  slug: 'your-slug',
  title: 'Article Title',
  subtitle: 'Optional subtitle',
  date: '2026-03-16',
  author: 'Flint',
  tags: ['analysis'],
  category: 'analysis',
  featured: false,
}
```

3. The article will be auto-routed to `/articles/your-slug` via `getStaticPaths`

---

## Data Pipeline

### Fetching Fresh Sleeper Data
```bash
npm run fetch-data   # → npx tsx scripts/fetch-sleeper-snapshot.ts
```

This writes to `content/data/`:
- `league-info.json` — league settings
- `users.json` — owner info
- `rosters.json` — current rosters
- `matchups-wk{1-14}.json` — weekly matchup data
- `transactions.json` — all trades + waivers

### Build Pipeline
```bash
npm install    # First time: installs all dependencies
npm run build  # Generates /out static export
```

---

## Key Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| next | 14.x | Framework |
| react | 18.x | UI |
| tailwindcss | 3.x | Styling |
| gray-matter | 4.x | MDX frontmatter parsing |
| next-mdx-remote | 4.x | MDX rendering |
| remark-gfm | 3.x | GitHub-flavored markdown |
| lucide-react | latest | Icons |
| clsx | 2.x | Class utilities |
| tailwind-merge | 2.x | Tailwind class merging |

---

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repo in Vercel → New Project
3. Framework: Next.js (auto-detected)
4. Build command: `npm run build` (auto-detected)
5. Output directory: `out` (from vercel.json)
6. Environment variables:
   - `NEXT_PUBLIC_SLEEPER_LEAGUE_ID=1312123497203376128`
   - `NEXT_PUBLIC_SITE_URL=https://bmfffl.vercel.app`

### Alternative: GitHub Pages
```bash
npm run build
# Copy /out to your GitHub Pages branch
```

---

## Known Issues / Notes

- MDX TypeScript declarations show errors before `npm install` — they resolve after install
- `DataFreshnessIndicator` uses `'use client'` — this is a display-only component, acceptable in Pages Router when isolated to a leaf component
- Analytics pages with `useState` do not need `'use client'` in Pages Router — that's App Router only
- `interface WinLossRecord` (not `interface Record` — avoids TypeScript collision with built-in)
