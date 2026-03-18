# BMFFFL Website — Deployment Guide

**Status**: 149 pages, all static, TypeScript clean, ready to deploy.

---

## Prerequisites

- Node.js 18+ (Node 20 recommended)
- npm 9+

---

## Local Development

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`.

---

## Build

```bash
npm run build
```

Outputs a fully static site to `/out`. All 149 pages are pre-rendered as HTML at build time. No server runtime required.

---

## Environment Variables

Create `.env.local` in the project root:

```bash
cp .env.example .env.local
```

Required variable:

```
NEXT_PUBLIC_SLEEPER_LEAGUE_ID=910140889474326528
```

Optional:

```
NEXT_PUBLIC_SITE_URL=https://bmfffl.vercel.app
```

---

## Deploy to Vercel

### Project Settings

| Setting | Value |
|---------|-------|
| Framework | Next.js |
| Build command | `npm run build` |
| Output directory | `out` |
| Root directory | `./` |
| Node.js version | 18.x or 20.x |

These are also configured in `vercel.json`.

### Environment Variables (Vercel dashboard)

Add in Vercel project settings → Environment Variables:

```
NEXT_PUBLIC_SLEEPER_LEAGUE_ID = 910140889474326528
```

### Deploy Steps

1. Push repo to GitHub
2. Connect repo to Vercel (vercel.com → New Project → Import)
3. Confirm project settings above
4. Add environment variable
5. Deploy

---

## Keeping Data Fresh

The site uses static JSON files in `content/data/`. To pull current Sleeper data and rebuild:

```bash
npm run fetch-data   # pulls from Sleeper API → content/data/
npm run build        # rebuilds with fresh data
```

Then push to GitHub to trigger a Vercel redeploy.

---

## Current Status

- **Pages**: 149 (all static HTML)
- **TypeScript**: Zero errors
- **Build**: Clean — `npm run build` exits 0
- **Live API features**: Not included (static-only build)
