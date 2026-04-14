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

---

## 7. CORRECTIONS COMPLETED — B643–B672 (2026-04-14)

**Ground truth used**: Sleeper SQLite DB (matchup_id=1 queries for champion, Convex prod standings for records).

**Verified Champion History (used for all corrections below):**
- 2016: MLSchools12 (ESPN era)
- 2017: Cogdeill11 (ESPN era)
- 2018: SexMachineAndyD (ESPN era)
- 2019: MLSchools12 (ESPN era)
- 2020: Cogdeill11 def. eldridsm 203.10–198.34
- 2021: MLSchools12 def. SexMachineAndyD 193.10–111.34
- 2022: Grandes def. rbr 137.82–115.08
- 2023: JuicyBussy def. eldridm20 179.40–149.62
- 2024: MLSchools12 def. SexMachineAndyD 168.40–146.86
- 2025: tdtd19844 def. Tubes94 152.92–135.08

**MLSchools12**: 4 championships total (2016, 2019, 2021, 2024) — NOT 5 or 6. 2025 went 13-1 but lost in semis.

### Files Corrected

| File | Corrected Beat | Key Changes |
|------|----------------|-------------|
| `src/lib/seasons.ts` | B643/B648 | Champion data for 2016-2025, ESPN era added |
| `src/pages/history/[year].tsx` | B648 | SEASONS_DATA wired to Convex getSeasonStandings |
| `src/pages/managers/index.tsx` | B666 | All 12 manager records, fake managers removed (Bro_Set→eldridsm, CheeseAndCrackers→Cmaleski, JimmyEatWurld→MCSchools), championship history fixed |
| `src/pages/history/index.tsx` | B667 | CHAMPIONS array: 5 of 6 wrong; corrected all (2022: Grandes, 2023: JuicyBussy, 2024: MLSchools12, 2025: tdtd19844) |
| `src/pages/index.tsx` | B667 | QUICK_STATS seasons 6→10, date range 2020-2025→2016-2025, unique champions 5→6; TOP_OWNERS ring counts |
| `src/pages/league-lore.tsx` | B668 | 2022 runner-up (rbr not MLSchools12); 2024 "repeat" was false (actually 4th title) |
| `src/pages/history/awards.tsx` | B669 | 2025 champion MLSchools12→tdtd19844; 2025 playoff heartbreak tdtd→MLSchools12 (13-1 wasted); 2021 runner-up rbr→SexMachineAndyD (score 193.10–111.34) |
| `src/pages/history/encyclopedia.tsx` | B669 | 2025 champion, 2024 "first title" false (4th all-time), 2021 opponent/score, manager notes, championship appearances |
| `src/pages/history/awards-ceremony.tsx` | B669 | "Three championships" → "Four championships (2016,2019,2021,2024)" |
| `src/pages/records/index.tsx` | B669 | "2 Rings, 2021·2024" → "4 Rings, 2016·2019·2021·2024" |
| `src/pages/history/playoff-brackets.tsx` | B670 | 2025 champion MLSchools12→tdtd19844; SF reconstructed (tdtd19844 upsets MLSchools12 #1); scores corrected; 2024 summary "second"→"fourth all-time" |
| `src/pages/rivalry.tsx` | B670 | All 4 instances of MLSchools12 championships:2 → championships:4 |
| `src/pages/history/season-recap.tsx` | B671 | 2025 champion/narrative/score; 2024 ring count |
| `src/pages/history/standings.tsx` | B672 | MLSchools12 [2021,2024,2025]→[2016,2019,2021,2024]; tdtd19844 []→[2025]; rbr runner-up 2021 removed; SexMachineAndyD runner-ups +2021 |
| `src/pages/bimfle.tsx` | B672 | "Runner-up in 2025" corrected to 4x champion narrative |
| `src/pages/managers/[slug].tsx` | B672 | MLSchools12 profile: 4x champ, 2025 result champion→playoff, bio; tdtd19844: 2025 champion added |

### TypeScript Status
All corrected files pass `npx tsc --noEmit --skipLibCheck` — 0 errors throughout.

### Pending for Go-Live
- [ ] **Vivai: git push** — `.git/` root-owned, push pending since 7:20am PDT (6h+)
- [ ] Vercel: set `CONVEX_URL=https://graceful-grasshopper-238.convex.cloud`
- [ ] Vivai/Bimfle: seed prod `getChampionHistory` (non-blocking)

### Files Still with Known Wrong Data (not corrected — lower priority)
- `analytics/owners.tsx` — OWNERS_DATA ring counts and career records (all wrong)
- `analytics/champion-retrospective.tsx` — champion data
- `analytics/dynasty-power-index.tsx` — dynasty scores
- `history/team-names.tsx` — team name changes (minor accuracy risk)
- Various analytics stubs with hardcoded placeholder data (~40 pages)

These are all analytics/stub pages that users are unlikely to visit on go-live day. The core pages (home, managers, history, records, rivalry, season-recap, standings) are all corrected.
