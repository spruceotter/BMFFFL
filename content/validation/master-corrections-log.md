# BMFFFL Website — Master Corrections and Validation Log

*Compiled: 2026-03-15 | Sources: corrections-applied.md, trade-history-check.md, 2025-standings-check.md, prospect-fact-check.md, player-stats-check.md, free-agency-check.md, rosters-2026-check.md*

---

## 1. Executive Summary

| Category | Count |
|----------|-------|
| Validation files reviewed | 7 |
| Total distinct issues found | 33 |
| Critical corrections applied (confirmed in corrections-applied.md) | 3 |
| Issues flagged for correction (prospect data) | 6 |
| Issues flagged for correction (player stats) | 11 |
| Issues flagged for correction (free agency terms) | 3 |
| Issues flagged for correction (roster data) | 1 |
| Items verified accurate with no change needed | 9 |
| External Sleeper API verifications performed | 3 separate league checks |

### Corrections Applied to Published Files

Three corrections were confirmed as applied to `content/articles/bmfffl-league-rules.mdx`:

1. FAAB budget: `$100` corrected to `$10,000`
2. Trade deadline: `~Week 10` corrected to `Week 14`
3. Taxi squad eligibility: `"first 2 years (confirm)"` corrected to `3-year eligibility`

All remaining issues documented below are findings from validation checks. It is not confirmed which, if any, of the prospect/stats/free-agency corrections have been applied to published articles yet.

---

## 2. Critical Corrections Applied

### 2a. `content/articles/bmfffl-league-rules.mdx`

Source: `corrections-applied.md` (task-577)

| # | Field | Incorrect Value | Correct Value | Verified Via |
|---|-------|-----------------|---------------|-------------|
| 1 | Annual FAAB budget | $100 | **$10,000** | Sleeper API, league_id 1312123497203376128 |
| 2 | Trade deadline | ~Week 10 of regular season | **Week 14 of regular season** | Sleeper API verified configuration |
| 3 | Taxi squad eligibility window | "first 2 years (confirm)" | **3-year eligibility** | Sleeper API, taxi_years=3 |

All three corrections were applied on 2026-03-15 per task-577. No other structural errors were found in the league rules article.

---

### 2b. Prospect Data — `content/articles/` (2026 NFL Draft content)

Source: `prospect-fact-check.md` (2026-03-15)

Seven of ten prospects checked contained errors. The corrections needed, in priority order:

| Priority | Prospect | Field | Incorrect Value | Correct Value |
|----------|----------|-------|-----------------|---------------|
| 1 — CRITICAL | Makai Lemon (USC, WR) | Drop rate | 21.3% | ~2.5% (2025 season; 2 drops on 108 targets per PFF) |
| 2 — CRITICAL | Eli Stowers (Vanderbilt, TE) | Vertical jump record scope | "record for any position" | TE position record only; all-position record is 46" (Gerald Sensabaugh, 2005) |
| 3 | Carnell Tate (Ohio State, WR) | Weight | 195 lbs | 192 lbs (official 2026 combine measurement) |
| 4 | Germie Bernard (Alabama, WR) | Height | 6'0" | 6'1" (official 2026 combine measurement) |
| 4 | Germie Bernard (Alabama, WR) | Weight | 202 lbs | 206 lbs (official 2026 combine measurement) |
| 5 | Jordyn Tyson (Arizona State, WR) | Weight | 200 lbs | 203 lbs (official 2026 combine measurement) |
| 5 | Jordyn Tyson (Arizona State, WR) | Injury history framing | "3 consecutive years" | Injuries span 4 seasons (2022–2025); not a clean 3-consecutive-year streak |
| 6 | Kenyon Sadiq (Oregon, TE) | Height | 6'4" | Multiple combine sources list 6'3" — requires final verification |

Additional context items (not hard errors but needing precision):
- **Carnell Tate** — the "zero drops in tight coverage" claim is defensible for the 2025 season only; career drop rate is ~4.0%. The claim should be scoped to "2025 season."
- **Emmett Johnson** — "led all RBs in receptions" should specify "led all Big Ten RBs" to be accurate; the 46-reception figure itself is confirmed.
- **Germie Bernard** — listing only "Alabama" as his college is accurate as his draft school but omits Michigan State (2022) and Washington (2023) in his transfer history.

Prospects confirmed accurate with no corrections needed:
- Elijah Sarratt (Indiana) — all data confirmed
- Jeremiyah Love (Notre Dame) — all data confirmed (minor weight source variation: 212 vs. 214 lbs depending on source)
- Nicholas Singleton (Penn State) — injury description and combine absence confirmed

---

### 2c. 2025 NFL Player Stats — Dynasty articles referencing 2025 season actuals

Source: `player-stats-check.md` (2026-03-15)

11 of 12 player stat claims contained significant errors. The verified correct figures are:

| Player | Team | Claimed Stats | Correct Stats | Severity |
|--------|------|---------------|---------------|----------|
| Shedeur Sanders (QB) | CLE | 4,100+ pass yds, 26 TDs, 12 INTs, 68% completion | **1,400 pass yds, 7 TDs, 10 INTs, 56.6%** in 8 games (5th-round pick, lost starting job early) | SEVERE |
| Jonathan Taylor (RB) | IND | 950 rush yds, 7 TDs, 4.0 YPC | **1,585 rush yds, 18 rush TDs (20 total), 4.9 YPC** — MVP-caliber season | SEVERE |
| Javonte Williams (RB) | DEN | 720 rush yds, 4 TDs, Denver | **1,201 rush yds, 11 rush TDs, 35 rec/137 yds, Dallas Cowboys** — wrong team and drastically understated | SEVERE |
| Zay Flowers (WR) | BAL | 62 rec, 710 yds, 4 TDs | **86 rec, 1,211 yds, 6 TDs** — career year, all figures understated | HIGH |
| Omarion Hampton (RB) | LAC | 1,200+ rush yds, 8 TDs, 52 rec | **545 rush yds, 4 rush TDs, 32 rec** in 9 games (hamstring IR) | HIGH |
| Elic Ayomanor (WR) | TEN | 72 rec, 950 yds, 6 TDs | **41 rec, 515 yds, 4 TDs** — rotational piece, not featured | HIGH |
| Anthony Richardson (QB) | IND | Missed 8 games, shoulder injury | **Missed essentially the entire season** (appeared in 2 games); injury was fractured orbital bone, not shoulder | HIGH |
| Ashton Jeanty (RB) | LV | 1,350 rush yds, 9 TDs, 5.3 YPC | **975 rush yds, 9 total TDs (5 rush + 4 rec), 3.7 YPC** — TD total is correct | MODERATE |
| Drake London (WR) | ATL | 72 rec, 840 yds, 5 TDs | **68 rec, 919 yds, 7 TDs** in 12 games (missed 4+ games) — receptions slightly low, yards and TDs understated | MODERATE |
| Sam LaPorta (TE) | DET | 52 rec, 560 yds; 2024 baseline: 86/889 | **40 rec, 489 yds, 3 TDs** in 9 games (back surgery); the 86/889 baseline cited belongs to his 2023 rookie season, not 2024 | MODERATE |
| Tetairoa McMillan (WR) | CAR | 85+ rec, 1,100+ yds, 7 TDs | **70 rec, 1,014 yds, 7 TDs** — thresholds not cleared; TDs correct; did win OROY | LOW |
| Colston Loveland (TE) | CHI | 68 rec, 780 yds, 5 TDs | **58 rec, 713 yds, 6 TDs** — directionally correct, numbers somewhat off | LOW (APPROXIMATE) |

---

### 2d. 2026 NFL Free Agency — Dynasty articles referencing off-season moves

Source: `free-agency-check.md` (2026-03-15)

10 of 13 moves confirmed correct. Three had inaccurate terms:

| # | Player | Issue | Correct Information |
|---|--------|-------|---------------------|
| 1 | Kenneth Walker III (KC) | Claimed "$45M deal" — this is the max value | Base contract is $43.05M (3yr, AAV $14.35M); guaranteed amount of $28.7M is correct. Precise description: "3yr/$43.05M (max $45M)" |
| 2 | DJ Moore (BUF trade from CHI) | Claimed "Bears received a 2nd-round pick" — understates the terms | Bears sent Moore + their own 2026 5th-round pick (No. 165) to Bills; Bills sent their 2026 2nd-round pick (No. 60) to Bears. Chicago also gave up a 5th-rounder in the deal. |
| 3 | Geno Smith (NYJ) | Described as a free agency signing | This was a **trade from the Las Vegas Raiders**. Jets sent a 2026 6th-round pick; Raiders sent Smith + a 7th-rounder. Raiders are paying the bulk of his salary; Jets owe ~$3M. |

Note: The Kyle Pitts franchise tag value was listed as "$14.3M" in some content — this is the RB franchise tag (Breece Hall's number). The TE franchise tag value is ~$16.319M. The fact that Atlanta tagged Pitts is confirmed; the dollar figure cited is incorrect.

---

### 2e. 2026 Roster Data — `rosters-2026-check.md`

Source: `rosters-2026-check.md` (2026-03-15, Sleeper API league_id 1312123497203376128)

| # | Issue | Detail |
|---|-------|--------|
| 1 | Josh Allen (QB, BUF) roster assignment | Expected on MLSchools12 (Roster 5); actual owner is **eldridm20 (Roster 7)**, where Allen is an active starting QB. MLSchools12 owns Lamar Jackson as their QB1. The expected assignment appears to be a documentation error or reflects a past roster state before a trade. |

All other 12 of 13 expected key player assignments were confirmed exactly as specified via live API data.

---

## 3. Verified No-Change Items

The following items were verified as accurate against live Sleeper API data or via internal cross-reference and required no corrections.

### League Rules and Configuration (Sleeper API, league_id 1312123497203376128)

- League format: Dynasty Superflex PPR — VERIFIED
- Division names: Group of Death, Moodie's Wives, Pig Bottoms — VERIFIED
- Roster slots: QB, RB×2, WR×3, TE, FLEX×2, SUPER_FLEX, 16 bench, 5 taxi — VERIFIED
- Scoring: Full PPR (1.0/rec), Pass TD = 4 pts, Rush/Rec TD = 6 pts, INT = -3 pts, Fumble = -2 pts — VERIFIED
- Draft type: Linear (non-snake), 4 rounds — VERIFIED
- Pick trading: Enabled, current + 1 year forward — VERIFIED
- FAAB: Resets each season — VERIFIED
- Playoff structure: 6 teams, Weeks 15–17 — VERIFIED
- All Sleeper League IDs for seasons 2020–2026 — VERIFIED
- Owner usernames and team names — VERIFIED
- Grandes as league commissioner — VERIFIED
- No kicker or D/ST slots — VERIFIED

### 2025 Season Final Standings (Sleeper API, league_id 1180109269263917056)

All five core claims verified against live API data with bracket confirmation:

| Claim | Status |
|-------|--------|
| 2025 Champion: tdtd19844 (THE Shameful Saggy sack) | VERIFIED — `latest_league_winner_roster_id` = 11 |
| 2025 Runner-up: Tubes94 (Whale Tails) | VERIFIED — championship game loser |
| 2025 3rd place: MLSchools12 (Schoolcraft Football Team) | VERIFIED — 3rd place bracket match winner |
| MLSchools12 regular season record: 13-1 | VERIFIED — wins: 13, losses: 1, record string confirmed |
| Moodie Bowl winner (last place): Grandes (El Rioux Grandes), 4-10 | VERIFIED — losers bracket winner, `trophy_loser_banner_text` = "MOODIE BOWL WINNER" |

### Trade History Cross-Reference (Internal, task-585)

All 6 notable trades in the trade history corpus were found consistent across all documents that reference them:

| Trade | Sources Checked | Status |
|-------|-----------------|--------|
| CMC acquisition (eldridsm → MLSchools12, Week 1, 2020) | 3 sources | CONSISTENT |
| Mahomes acquisition (mmoodie12 → Grandes, Week 6, 2020) | 3 sources | CONSISTENT |
| Jonathan Taylor sale (Tubes94 → tdtd19844, Week 1, 2022) | 2 sources | CONSISTENT |
| Puka Nacua acquisition (Cogdeill11 → Tubes94, Week 5, 2023) | 3 sources | CONSISTENT |
| Bucky Irving trade (Cmaleski → MLSchools12, Week 1, 2025) | 2 sources + pick-inventory | CONSISTENT |
| DK Metcalf for 2026 1st (eldridm20 → tdtd19844, 2024-25 window) | pick-inventory-2026.json | CONSISTENT |

Zero discrepancies found across the full trade history corpus. An apparent ambiguity involving two separate DK Metcalf transactions (2022 and 2024-25) was confirmed as two distinct trades, not a single conflated claim.

### 2026 Roster Data (Sleeper API, league_id 1312123497203376128)

- All 12 rosters returned and confirmed (total player counts per roster documented)
- All 12 users successfully mapped to roster IDs
- 12 of 13 key player assignments confirmed exactly as expected (see Section 2e for the one discrepancy)
- All player IDs resolved successfully via the full players endpoint

---

## 4. External Verification Status (Sleeper API Checks)

Three separate Sleeper API league checks were performed:

| Check | League ID | Purpose | Date | Result |
|-------|-----------|---------|------|--------|
| League rules configuration | 1312123497203376128 | Verify FAAB, trade deadline, taxi eligibility, scoring, roster settings | 2026-03-15 | 3 corrections applied; all other settings confirmed |
| 2025 season standings and bracket | 1180109269263917056 | Verify champion, runner-up, 3rd place, regular season record, Moodie Bowl | 2026-03-15 | All 5 claims verified; no corrections needed |
| 2026 active rosters and user mapping | 1312123497203376128 | Verify key player assignments to expected owners | 2026-03-15 | 12/13 confirmed; Josh Allen assignment discrepancy found |

All three checks used live Sleeper API data. No API authentication errors or missing data were reported.

The prospect fact-check (Section 2b), player stats check (Section 2c), and free agency check (Section 2d) were verified against external public sources (ESPN, NFL.com, CBS Sports, PFF, Pro Football Reference, Bleacher Report, Spotrac, The Athletic) but did not use the Sleeper API.

---

## 5. Remaining Uncertainty / Future Verification Needed

### High Priority

1. **Josh Allen roster assignment** — The live API confirms Josh Allen is on eldridm20's roster, not MLSchools12's. The underlying article or data file that attributed him to MLSchools12 needs to be identified and corrected. It is unclear whether this was a documentation error or reflects a trade that occurred after the article was written.

2. **Kenyon Sadiq height** — Multiple combine measurement sources list him at 6'3", not 6'4". Official NFL Combine profile should be checked as the authoritative source before publishing. This was flagged as "verify before publishing" in the prospect check.

3. **All prospect and stats corrections** — It is not confirmed whether the corrections documented in Sections 2b and 2c have been applied to the published articles. These sections describe findings, not confirmed applied fixes (unlike Section 2a, which has an explicit "corrections applied" record). Each article citing these figures should be reviewed and updated.

### Medium Priority

4. **2026 NFL Draft date** — The prospect check notes the draft is April 24–26, 2026, but flags that "multiple sources cite April 23–25." The official NFL date should be confirmed before any article references it.

5. **Carnell Tate drop claim context** — The "zero drops in tight coverage" claim needs to be scoped explicitly to the 2025 season in any article that uses it. As a career characterization it is misleading (career drop rate ~4.0%).

6. **Emmett Johnson "led all RBs" qualifier** — Any article using this claim should specify "led all Big Ten RBs in receptions" rather than implying FBS-wide or NFL-wide.

### Low Priority / Monitor for Change

7. **Team names for Bimfle and eldridsm** — As of 2026-03-15, neither owner has a team name set in Sleeper. These may be populated before the 2026 season; any content referencing their team names should be treated as provisional.

8. **Traded picks inventory** — 20 traded picks were in the system as of 2026-03-14. This number will change continuously through the pre-draft period. Any content citing specific pick-trade counts should be marked as of a specific date.

9. **Scoring format QB value warning** — The league uses 4-point passing TDs (not 6-point). Any imported dynasty value rankings that assume 6-point passing TDs will overvalue QBs by approximately 15–20%. This does not require a content correction but is a calibration note for any rankings content.

10. **Kenneth Walker III contract precision** — If any article cites his deal as "$45M," this should be updated to "$43.05M base (max $45M)" for accuracy.

---

*Master log compiled 2026-03-15 from 7 validation source files. Corrections in Section 2a are confirmed applied. All other sections document findings requiring follow-up action.*
