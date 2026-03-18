# BMFFFL — Dynasty Fantasy Football League

> The official analytics hub for BMFFFL, a 12-team dynasty fantasy football league since 2020.

## What This Is

A complete 190+ page Next.js static site covering every aspect of BMFFFL:
- Full analytics suite (60+ pages)
- Owner profiles for all 12 managers
- 6 seasons of history documented
- Dynasty tools: Trade Evaluator, Team Builder, Keeper Calculator, Playoff Simulator, and more
- Deploy-ready with vercel.json, .env.example, robots.txt, sitemap.xml

## Quick Start

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # builds to /out
```

## Deploy

See [DEPLOY.md](./DEPLOY.md) for full instructions.

**TL;DR**: Connect to Vercel → set `NEXT_PUBLIC_SLEEPER_LEAGUE_ID=910140889474326528` → auto-deploy.

## Tech Stack

- **Framework**: Next.js 14 (Pages Router, static export)
- **Styling**: Tailwind CSS
- **Language**: TypeScript (strict mode, 0 errors)
- **Data**: Static/hardcoded + Sleeper API ready
- **Deploy**: Vercel (configured)

## League

- **Platform**: Sleeper
- **League ID**: 910140889474326528
- **Seasons**: 6 (2020-2025)
- **Teams**: 12
- **Commissioner**: Grandes ⚖️

## Status

Build: 190+ pages | TypeScript: 0 errors | Deploy: Ready
