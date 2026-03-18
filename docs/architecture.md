# BMFFFL Website — Architecture Document

> *Generated: 2026-03-15 | tasks 529, 535, 540*
> *Valid as of: March 2026 pre-NFL Draft*

---

## Project Overview

The BMFFFL (Best Managers Fantasy Football League) website is a custom dynasty fantasy football league portal built on Sleeper API data. It serves 12 league members with:
- Full league history (2020–present)
- Season archives with standings, rosters, drafts, trades
- Owner profiles and career statistics
- Analytics dashboards for dynasty strategy
- Articles and analysis content (converted from Flint corpus)
- NFL Draft tracker and rookie dashboard
- 2026 season calendar

**Key dates driving the launch timeline:**
- NFL Draft: ~April 24-26, 2026
- BMFFFL Owners Meeting: May 2026
- BMFFFL Rookie Draft: First Friday of June 2026 (June 5, 2026)

---

## Tech Stack Decision (task-524)

**Chosen stack: Next.js 14 + Tailwind CSS + Recharts**

### Rationale

| Requirement | Solution | Why |
|---|---|---|
| Static-first (fast loads) | Next.js `output: 'export'` | Zero server, deploys anywhere |
| Sleeper API data | Next.js API routes + ISR | Server-side fetch, client cache |
| Charts/viz | Recharts | React-native, TypeScript, no D3 learning curve |
| Styling | Tailwind CSS | Utility-first, dark mode, tables are easy |
| Type safety | TypeScript strict | Schema defined in `src/data/schema.ts` |
| Markdown articles | `next-mdx-remote` | Render Flint corpus directly |

### Alternatives Considered
- **SvelteKit**: Excellent DX but smaller ecosystem, harder to find components for sports tables
- **Plain HTML + HTMX**: Simpler but no component reuse, harder to maintain
- **Astro**: Good for content sites but React interactivity more complex to add

### Deployment
- **Vercel** (primary): Free tier supports Next.js static export, automatic git deploys, custom domain, edge CDN. Note: `rewrites()` in `next.config.js` may not work with `output: 'export'` — API proxying handled via Vercel Functions instead.
- **Fallback: Cloudflare Pages**: Also free, excellent performance, Workers for API proxying.

---

## Sitemap and Information Architecture (task-529)

```
/                          → Home: hero, latest articles, standings snapshot, upcoming events
/history                   → All-time records, championship history, founder stories
/seasons/                  → Season index (list all years)
/seasons/[year]/           → Season detail: champion, standings, weekly results
/seasons/[year]/draft      → Rookie draft recap for that year
/seasons/[year]/trades     → Trade log for that year
/owners/                   → Owner roster (12 cards)
/owners/[slug]/            → Owner profile: career stats, championship history, current roster
/rosters/                  → Current season rosters (2026 offseason)
/drafts/                   → Draft history index
/drafts/rookie/[year]/     → Rookie draft detail with pick-by-pick log
/drafts/startup/           → Startup draft history (2020)
/analytics/                → Analytics dashboard hub
/analytics/trade-analyzer  → Trade calculator (Sleeper data)
/analytics/standings        → Historical standings explorer
/analytics/scoring          → Scoring trends and distributions
/nfl-draft/                → 2026 NFL Draft tracker
/articles/                 → Article index (all published)
/articles/[slug]/          → Individual article
/rules/                    → Current league rules and scoring settings
/calendar/                 → 2026 season calendar with key dates
/about/                    → League history, commissioner note, how to join
```

### Dynamic vs Static

| Pattern | Strategy |
|---|---|
| `/seasons/[year]/` | Static generation (known years: 2020-2025) |
| `/owners/[slug]/` | Static generation (12 known owners) |
| `/articles/[slug]/` | Static generation (Flint corpus MDX files) |
| `/analytics/*` | Client-side (interactive, Sleeper API calls) |
| `/nfl-draft/` | ISR (updates during draft period) |

---

## URL Routing (task-535)

Clean URL conventions:
- Seasons: `/seasons/2025` (not `/season/2025-26`)
- Owners: `/owners/chris` (lowercase slug, not user_id)
- Articles: `/articles/dynasty-rb-rankings-march-2026`
- Drafts: `/drafts/rookie/2025`

Slug generation: `owner.displayName.toLowerCase().replace(/\s+/g, '-')`

---

## Component Library Plan (task-531)

### Core Components

| Component | Props | Data Source |
|---|---|---|
| `PlayerCard` | playerId, showValue?, compact? | Sleeper player API |
| `OwnerProfile` | ownerId, size: 'sm'/'lg' | Computed from Sleeper rosters |
| `SeasonSummaryCard` | year, champion, stats | Season archive data |
| `StandingsTable` | season, interactive? | Sleeper matchups |
| `DraftPickBadge` | round, slot, year, owner | Draft data |
| `ArticleCard` | slug, title, date, tags, featured? | MDX frontmatter |
| `ChampionBadge` | year, ownerName | Season data |
| `StatBar` | value, max, label, color? | Computed stats |
| `TrendArrow` | direction: 'up'/'down'/'flat', delta | Computed trends |
| `TeamRoster` | rosterId, season | Sleeper roster API |
| `TradeCard` | tradeId, compact? | Sleeper transaction API |
| `MatchupCard` | week, rosterId1, rosterId2 | Sleeper matchup API |
| `PositionBadge` | position | Static |
| `NFLTeamBadge` | nflTeam | Static (color map) |

### Layout Components
- `PageHeader` — title + subtitle + optional action
- `SectionDivider` — thematic break between content sections
- `DataTable` — sortable, filterable, responsive table base
- `Sidebar` — right rail for contextual info
- `ArticleLayout` — MDX article wrapper with TOC

---

## Data Layer (task-537 complement)

Schema defined in `src/data/schema.ts`.

### Sleeper API Integration Points

```
GET /user/{username}                    → Lookup user by username
GET /user/{user_id}/leagues/nfl/{year}  → All leagues for user+year
GET /league/{league_id}                 → League settings
GET /league/{league_id}/rosters         → Current rosters
GET /league/{league_id}/users           → Owner info
GET /league/{league_id}/matchups/{week} → Matchup results
GET /league/{league_id}/transactions/{week} → Trades + waivers
GET /league/{league_id}/drafts          → Draft IDs
GET /draft/{draft_id}/picks             → Draft picks
GET /players/nfl                        → All NFL players (large, cache locally)
GET /stats/nfl/{year}/{week}            → Weekly stats
```

All data fetched server-side in Next.js `getStaticProps` / Route Handlers, cached in `/src/data/cache/` JSON files for build-time use. Player database refreshed weekly.

---

## Homepage Content Plan (task-539)

### Above the Fold
- **Hero**: Large "BMFFFL" wordmark, tagline ("Dynasty. Since 2020."), animated current season status badge ("2026 Offseason — Rookie Draft: June 5")
- **Current Champion banner**: 2025 champion name + team, year count if multi-time

### Section 1: League Pulse
- 3-stat row: Current season leader (dynasty rankings), Most recent champion, Next event countdown
- Upcoming events timeline: NFL Draft (Apr 24), Owners Meeting (May), Rookie Draft (Jun 5)

### Section 2: Latest Articles
- 3 featured article cards with cover image, title, date, tags
- "View all articles" link → `/articles`

### Section 3: Owner Cards (compact)
- 12 mini owner cards: avatar, team name, 2025 record, dynasty rank
- Links to `/owners/[slug]`

### Section 4: League History Snapshot
- Championship banner: list of all champions by year (2020-2025)
- "Full history" → `/history`

### Footer
- Quick links, current season, league rules, about

---

## Phase Roadmap

| Phase | Tasks | Output |
|---|---|---|
| A: Research + Design | 521-540 | Architecture doc, component plan, sitemap ✅ |
| B: Content Conversion | 541-570 | MDX articles from Flint corpus |
| C: Data Validation | 571-600 | Sleeper data verified, schemas populated |
| D: Core Build | 601-640 | Pages: home, history, seasons, owners, rosters |
| E: Analytics Apps | 641-670 | Trade analyzer, standings explorer, scoring viz |
| F: Magazine Content | 671-690 | Articles, rankings, strategy content |
| G: Integrations | 691-710 | Sleeper API live, player search, NFL Draft tracker |
| H: QA + Launch | 711-720 | Tests, build, deploy to Vercel |

---

## Key Constraints

1. **Sleeper data starts 2020**: No Sleeper data for 2019 (ESPN transition year). 2017-2019 ESPN data requires separate retrieval if captain provides access.
2. **No paid APIs**: All data sources must be free or included in Sleeper.
3. **Static-first**: Most pages built at compile time; analytics pages client-side only.
4. **Mobile-first**: 12 league members check on phones. Tables must be scrollable, not truncated.
5. **Temporal accuracy**: All content has `valid-as-of` metadata. Pre-draft content clearly labeled.
