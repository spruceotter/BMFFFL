# BMFFFL Site Audit — 2026-04-14

**Purpose:** Identify all hardcoded TypeScript data and placeholder pages for Convex wiring.
**Requested by:** Commissioner (Chris)
**Authored by:** Flint B644

---

## 1. HARDCODED DATA FILES — Must Wire to Convex

These files have static TypeScript data that belongs in Convex (or Sleeper API) instead.

### Critical (wrong data, already causing issues)

| File | Data Inside | Status |
|------|-------------|--------|
| `src/lib/seasons.ts` | Champion history 2020–2025, championship scores | ✅ CORRECTED B643 — still hardcoded TS, wire next |
| `src/pages/history/[year].tsx` | ALL season standings, playoff brackets, narratives for 2020–2025 (651 lines of invented data) | ❌ ALL FAKE |
| `src/pages/managers/index.tsx` | MANAGERS array: championship years, W/L records, dynasty ranks, taglines | ❌ WRONG DATA |
| `src/pages/analytics/owners.tsx` | OWNERS_DATA: ring counts, career W/L, dynasty ranks per owner | ❌ WRONG DATA |
| `src/pages/history/standings.tsx` | AllTimeOwner: career records, championship lists per owner | ❌ WRONG DATA |

### Secondary (configuration data, lower urgency)

| File | Data Inside | Notes |
|------|-------------|-------|
| `src/data/manager-colors.ts` | Per-manager color palettes | Static config, OK for now |
| `src/lib/owner-tokens.ts` | Per-owner emoji/personality tokens | Static config, OK for now |
| `src/lib/sleeper.ts` | `LEAGUE_ID` constant hardcoded | Should come from env/Convex |

---

## 2. PAGES WITH HARDCODED OWNER/LEAGUE ARRAYS

These pages have inline `const OWNERS = [...]` or `const TEAMS = [...]` arrays that should become Convex queries. They render real-looking data that is mostly invented.

### History Section (all pages hardcoded)
- `history/[year].tsx` — SEASONS_DATA object with all seasons' standings + brackets + narratives
- `history/standings.tsx` — all-time standings per owner
- `history/awards.tsx` — awards data
- `history/awards-ceremony.tsx` — ceremony content
- `history/playoff-brackets.tsx` — bracket data
- `history/team-names.tsx` — historical team name changes per owner per season
- `history/shame-board.tsx` — loser bracket history
- `history/veto-log.tsx` — trade veto history
- `history/encyclopedia.tsx` — league lore facts
- `history/season-recap.tsx` — narrative recaps per season

### Managers/Owners Section
- `managers/index.tsx` — MANAGERS array with wrong championship data
- `managers/[slug].tsx` — per-manager detail pages (1170 lines, heavy hardcoding)
- `owners/index.tsx` — owner list
- `owners/[slug].tsx` — per-owner detail pages

### Analytics Pages with Hardcoded Owner Lists (real-looking but invented stats)
Approximately 40+ analytics pages use inline owner/team arrays. Key ones:
- `analytics/owners.tsx` — OWNERS_DATA (rings, W/L all wrong)
- `analytics/dynasty-power-index.tsx` — dynasty index scores
- `analytics/dynasty-rankings.tsx` — dynasty rankings
- `analytics/bracket-predictor.tsx` — teams/seeds
- `analytics/playoff-probability.tsx` — per-team probability data
- `analytics/h2h-records.tsx` — head-to-head matrix (831 lines)
- `analytics/champion-retrospective.tsx` — champion data
- `analytics/faab-tracker.tsx` — FAAB history
- `analytics/waiver-history-tracker.tsx` — waiver data
- `analytics/manager-efficiency.tsx` — efficiency metrics
- `analytics/trade-ledger.tsx` — trade history
- `analytics/biggest-trades.tsx` — trade values
- `analytics/waiver-history.tsx` — waiver records

---

## 3. PLACEHOLDER / STUB PAGES — Not Yet Built

These pages have minimal content, TODO markers, or "Coming Soon" text. They should either be built out or hidden from navigation.

### Analytics Stubs (16 pages)
- `analytics/championship-window.tsx` — stub
- `analytics/contract-sim.tsx` — stub
- `analytics/devy-tracker.tsx` — stub
- `analytics/faab-history.tsx` — stub
- `analytics/index.tsx` — analytics hub (TODO content)
- `analytics/manager-trends.tsx` — stub
- `analytics/mock-draft.tsx` — stub
- `analytics/multi-season.tsx` — stub
- `analytics/price-check.tsx` — stub
- `analytics/rb-aging-curve.tsx` — stub
- `analytics/sleeper-oauth.tsx` — auth flow placeholder
- `analytics/team-builder.tsx` — stub
- `analytics/trade-analyzer.tsx` — stub (v1)
- `analytics/trade-analyzer-v2.tsx` — stub (v2)
- `analytics/trade-value-chart.tsx` — stub
- `analytics/transaction-browser.tsx` — stub
- `analytics/win-percentage-trends.tsx` — stub

### Season Stubs
- `season/index.tsx` — current season hub (TODO)
- `season/rookie-draft-2026.tsx` — stub

### Resources Stubs
- `resources/live-chat.tsx` — stub
- `resources/voting.tsx` — stub
- `resources/error-handling.tsx` — mostly placeholder

---

## 4. PAGES THAT APPEAR FUNCTIONAL

These pages seem real and don't have obvious hardcoding issues. Lower priority for Convex wiring.

- `index.tsx` — homepage
- `about.tsx` — about page
- `constitution.tsx` — league rules (static content, fine)
- `rules/index.tsx` + `rules/explainer.tsx` — rules pages
- `404.tsx` — error page
- `bimfle.tsx` — Bimfle widget page
- `search.tsx` — search (may have stubs)
- `season/offseason-hub.tsx` — offseason content
- `season/owners-meeting-2026.tsx` — meeting notes
- `season/preview-2026.tsx` — season preview
- `admin/commissioner-toolkit.tsx` — commissioner tools
- `articles/` — article system (uses MDX, real)

---

## 5. RECOMMENDED CONVEX WIRING ORDER

Priority order for wiring real data:

1. **Owner career records** — replace `managers/index.tsx` MANAGERS array → `getCareersStats()` query
2. **Season standings** — replace `history/[year].tsx` SEASONS_DATA → `getSeasonStandings(year)` query
3. **Champion history** — `seasons.ts` already correct, wire to `getChampionHistory()` query
4. **All-time H2H records** — `analytics/h2h-records.tsx` → `getH2HMatrix()` query
5. **FAAB/trade/waiver history** — Bimfle has this data in Sleeper DB

---

## 6. QUICK STATS

- Total pages: ~155
- Pages with hardcoded data arrays: ~60
- Stub/placeholder pages: ~19
- Core working pages (minimal hardcoding): ~30
- Analytics pages with invented stats: ~40+

**Bottom line:** The site is heavily hardcoded. Most "data" is invented mock values that look real.
Champion history (`seasons.ts`) was corrected 2026-04-14. Everything else still needs Convex wiring.
