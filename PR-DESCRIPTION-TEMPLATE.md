# PR Description Template

Use this when creating the pull request from `nextjs-rebuild` → `main`.

---

## Title
feat: Complete Next.js 14 rebuild — BMFFFL Dynasty Platform v2.0

## Body

## Summary

This PR replaces the existing SvelteKit site with a complete Next.js 14 rebuild featuring:

- **157 static pages** (0 TypeScript errors, 0 build errors)
- **Full analytics suite**: 60+ analytics pages including Dynasty Power Index, Trade Evaluator, Playoff Simulator, Team Builder, Keeper Calculator, and more
- **Owner profiles**: Individual pages for all 12 managers with career stats
- **History section**: All 6 seasons documented with playoff brackets and awards
- **Tools**: Interactive trade evaluator, team builder, auction draft simulator, mock draft board
- **Deploy-ready**: vercel.json configured, .env.example provided, robots.txt + sitemap.xml included

## What Changed
- Framework: SvelteKit → Next.js 14 (Pages Router, static export)
- Pages: ~15 → 157
- Analytics: None → 60+ pages
- TypeScript: Strict mode, 0 errors

## Redirects Configured
- /matchups → /season/matchups
- /transactions → /trades
- /records → /analytics/all-time-records
- /standings → /history/standings

## Deploy Notes
1. Set env var: `NEXT_PUBLIC_SLEEPER_LEAGUE_ID=910140889474326528`
2. Build command: `npm run build`
3. Output directory: `out`

## Test Plan
- [ ] Home page loads
- [ ] Navigation dropdowns work
- [ ] /analytics/dynasty-power-index renders
- [ ] /owners shows all 12 managers
- [ ] Dark mode toggle persists
- [ ] sitemap.xml accessible
