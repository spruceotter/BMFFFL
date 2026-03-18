# Development Workflow

## Local Setup
npm install
npm run dev      # http://localhost:3000
npm run build    # builds to /out (static export)
npm run lint     # TypeScript + ESLint

## Adding Content
- New articles: add .mdx file to content/articles/
- Update owner data: edit src/lib/owner-tokens.ts
- New analytics page: create src/pages/analytics/[name].tsx, add to Navigation.tsx

## Data Updates
All data is hardcoded in page files. To update:
1. Edit the data array in the relevant page file
2. Run npm run build to verify
3. Push to GitHub — Vercel auto-deploys

## Environment Variables
Create .env.local (gitignored):
NEXT_PUBLIC_SLEEPER_LEAGUE_ID=910140889474326528
NEXT_PUBLIC_SITE_URL=https://bmfffl.vercel.app
