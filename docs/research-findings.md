# BMFFFL Website — Research Findings

> *tasks 521-523, 525, 528, 533, 536 | 2026-03-15 | via research subagent*

---

## Fantasy Football Website Design Patterns (task-521)

**MFL** is the dynasty standard — extreme customization, historical records (all-time H2H, season high scores, margin-of-victory), custom scoring, contracts, salaries. UI is dated desktop-only.

**Sleeper** is mobile-first, visual-first. Player photos prominent. Social/chat integrated. Desktop lags app experience.

**nmelhado/league-page** (SvelteKit community template) defines the modern pattern: hero banner, tab nav (Home, History, Managers, Matchups, Drafts, Awards), manager profile cards, historical records page, traded-pick draft boards, rivalry tracking.

### What Works for Dynasty Communities
- Historical data surfaces prominently — all-time records, champion banners above the fold
- Manager identity cards: avatar, W-L record, team name, career stats
- Dark mode default with team-color accents
- Draft boards with traded picks visualized
- Awards pages surfacing weekly/season achievements Sleeper buries
- Mobile-responsive grids for matchup scores and standings
- Flat icon-led navigation over nested dropdowns
- Color-coded stat cells (green/red for above/below average)

---

## Open Source Sleeper API Projects (task-522)

**Official docs**: `https://docs.sleeper.com/` — read-only, no auth required, rate limit ~1,000 calls/min

### Best Libraries

| Project | Language | Status | Notes |
|---|---|---|---|
| `dtsong/sleeper-api-wrapper` | Python | Active | PyPI: `sleeper-api-wrapper`; MIT; recommended |
| `joeyagreco/sleeper` | Python | Active | PyPI: `pip install sleeper`; example folder |
| `rsromanowski/sleeper-api` | JavaScript | Active | Also documents undocumented GraphQL API |
| `nmelhado/league-page` | SvelteKit | Active | Full website template; 1-file config |
| `lum8rjack/sleeper-go` | Go | Active | Go language client |

**nmelhado/league-page** is the most useful reference — a complete website with the data patterns we want. Configure with one JS file (league ID). Community forks include `pmann8/soup-hat-dynasty`.

---

## Sleeper REST API Endpoint Inventory (task-523)

**Base URL:** `https://api.sleeper.app/v1`
No authentication. Read-only. Rate limit: stay under 1,000 calls/minute.

### User
```
GET /user/<username>                        → User by username
GET /user/<user_id>                         → User by ID
GET /user/<user_id>/leagues/nfl/<season>    → All leagues for user+year
GET /user/<user_id>/drafts/nfl/<season>     → All drafts for user
```

### League
```
GET /league/<league_id>                     → Metadata: name, settings, scoring, positions
GET /league/<league_id>/users               → All users: display_name, avatar, team_name
GET /league/<league_id>/rosters             → All rosters: players, starters, owner_id, record
GET /league/<league_id>/matchups/<week>     → Matchup data: roster_id, points, starters
GET /league/<league_id>/winners_bracket     → Playoff bracket
GET /league/<league_id>/losers_bracket      → Consolation bracket
GET /league/<league_id>/transactions/<round>→ Trades, waiver claims, adds/drops
GET /league/<league_id>/traded_picks        → Future draft picks traded
GET /league/<league_id>/drafts              → Draft IDs for the league
```

### Draft
```
GET /draft/<draft_id>                       → Draft metadata: type, season, status
GET /draft/<draft_id>/picks                 → All picks: pick_no, round, player_id, roster_id
GET /draft/<draft_id>/traded_picks          → Pre-draft traded picks
```

### Players
```
GET /players/nfl                            → Full DB (~5MB); cache locally, max once/day
GET /players/nfl/trending/add?lookback_hours=24&limit=25
GET /players/nfl/trending/drop?lookback_hours=24&limit=25
GET /state/nfl                              → Current week, season type
```

### CDN Assets
```
Player headshot (full):  https://sleepercdn.com/content/nfl/players/<player_id>.jpg
Player headshot (thumb): https://sleepercdn.com/content/nfl/players/thumb/<player_id>.jpg
User avatar:             https://sleepercdn.com/avatars/<avatar_id>
```

---

## Data Visualization Libraries (task-525)

**Recommendation: Recharts (primary) + Nivo (showcase pages)**

| Library | Rendering | TS Support | Ease | Best For |
|---|---|---|---|---|
| **Recharts** | SVG | Excellent (native TS) | Very High | Standings, matchup scores, weekly trends |
| **Nivo** | SVG/Canvas/HTML | Good | Medium | Styled storytelling, SSR, season recaps |
| Chart.js | Canvas | Good | High | Radar charts, real-time updates |
| Visx (Airbnb) | SVG/Canvas | Excellent | Low | Custom bespoke visuals (D3 required) |

Recharts is the default pick for React sports dashboards: declarative component API, native TypeScript, excellent docs. Nivo for showcase pages with richer defaults and SSR support.

---

## Hosting Decision (task-528)

**Recommendation: Cloudflare Pages (production) + Vercel (development)**

| Platform | Bandwidth | Next.js | Serverless | Best For |
|---|---|---|---|---|
| **Cloudflare Pages** | **Unlimited free** | Good (OpenNext) | Workers ($5/mo for 10M req) | Production: no surprise bills |
| Vercel | 100GB free | Best-in-class | 100K invocations | Development DX |
| Netlify | 100GB free | Full (OpenNext) | 125K invocations | Commercial use on free tier |
| GitHub Pages | Limited | Static only | None | Fully static only — not suitable |

Cloudflare's unlimited bandwidth is the key differentiator for a public league site. Workers handle Sleeper API proxying without the 100K Vercel limit.

---

## Community Dynasty Sites (task-533)

**nmelhado/league-page** is the community standard template. Content priorities it defines:
1. Champion archive (year/team/owner banner display above the fold)
2. Career W-L standings table — cumulative, sortable
3. Manager profile cards (avatar, record, mode tag: Win Now/Dynasty/Rebuild, rivalry)
4. Draft history with traded-pick visualization
5. Weekly awards page (surfaces Sleeper data that's buried in app)
6. Head-to-head matrix
7. Transaction log with timestamps

**League Legacy** ($36/yr SaaS): season-to-season timeline, all-time records, auto newsletters — confirms what dynasty communities pay for.

**MFLHistory.com**: surfaces single-game, season, career, postseason, milestone records. Confirms: career statistics are what communities want most.

**Key insight**: All community sites default to dark mode. The champion wall is always above the fold. Career stats (not just season stats) are the most requested historical views.

---

## Free NFL Data APIs (task-536)

**Recommended stack:**

1. **Sleeper API** — primary (league, rosters, matchups, players, drafts)
2. **Sleeper CDN** — player headshots, user avatars (built in)
3. **ESPN Unofficial API** (no key) — injury status, live scores, news
4. **Cache aggressively** — Cloudflare KV or Next.js ISR (5-min revalidation)

### ESPN Unofficial API (No Auth Required)
```
Scoreboard:  https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard
News:        https://site.api.espn.com/apis/site/v2/sports/football/nfl/news
Teams:       https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams
Injuries:    https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/teams/<id>/injuries
```
370+ v2 endpoints. No SLA — implement error handling + caching.

### Other Options
- **BallDontLie** (free tier, key required): NFL stats, rosters, injuries; JS + Python SDKs
- **MySportsFeeds** (free personal use): schedules, boxscores, play-by-play, DFS
- **nflfastR** (R/Python): play-by-play back to 1999 from ESPN — best historical bulk data
