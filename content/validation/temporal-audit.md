# BMFFFL Website Temporal Audit

*Performed: 2026-03-15 | task-590*

---

## Purpose

Verify all website content reflects the correct temporal context:
- **Current date**: March 15, 2026
- **2025 NFL season**: Complete (champion: tdtd19844)
- **2026 NFL season**: Not yet started; free agency open (March 12, 2026)
- **2026 NFL Draft**: April 24-26, 2026 (not yet occurred)
- **2026 BMFFFL rookie draft**: June 2026 (not yet occurred)
- **2025 NFL Draft class**: Already played one NFL season (nfl_active, Year 2 players in 2026)
- **2026 NFL Draft class**: Incoming prospects (status=incoming)

---

## Issues Found and Corrected

### CRITICAL — Corrected in this session

#### 1. `2025-season-breakouts.mdx`
**Issue**: Article described 2025 rookies with wildly inflated stats, treating projections as actuals. Sanders framed as a starter/breakout when he was a 5th-round backup. Jeanty stats 1,350/9/5.3 YPC vs. actual 975/9/3.7 YPC. Hampton 1,200+/8/52 vs. actual 545/4/32 (9 games). McMillan 85+/1,100+/7 vs. actual 70/1,014/7. Ayomanor 72/950/6 vs. actual 41/515/4. Loveland 68/780/5 vs. actual 58/713/6.

**Fix**: All stats corrected to 2025 actual figures. Sanders reframed as speculative buy-low (not confirmed breakout). Hampton reframed as HOLD at injury discount. Ayomanor reframed as development year, not breakout. Loveland stats updated.

#### 2. `2025-season-busts.mdx` (retitled to sell-candidates)
**Issue**: Wrong stats throughout. Most severe: Taylor framed as declining (950 yd/7 TD) but actually had MVP season (1,585 yd/18 TD). Williams listed on DEN, actually played for DAL (1,201 yd/11 TD). Flowers framed as regression (62/710/4) but had career year (86/1,211/6). Richardson injury labeled "shoulder" — actually fractured orbital bone, missed essentially entire season.

**Fix**: All stats corrected. Article retitled from "busts" to "sell candidates." Taylor and Williams reframed as sell-high off peak performance. Flowers reframed as peak-value sell for contenders.

---

## No Temporal Issues Found

### Content Correctly Temporally Positioned

| Article | Temporal Status | Notes |
|---------|----------------|-------|
| `state-of-the-league-march-2026.mdx` | ✅ Correct | Written as March 2026 retrospective |
| `2026-offseason-outlook.mdx` | ✅ Correct | Future-looking from March 2026 |
| `2026-offseason-primer.mdx` | ✅ Correct | Current-state for each owner |
| `buyers-sellers-2026.mdx` | ✅ Correct (after Taylor fix) | March 2026 context |
| `2026-free-agency-dynasty-impact.mdx` | ✅ Correct | FA window open March 12, 2026 |
| `2026-rookie-draft-strategy-guide.mdx` | ✅ Correct | References June 2026 draft as future |
| `2026-draft-rb-class.mdx` | ✅ Correct | April 2026 draft as future event |
| `2026-draft-wr-class.mdx` | ✅ Correct | April 2026 draft as future event |
| `2026-draft-te-class.mdx` | ✅ Correct | April 2026 draft as future event |
| `champion-timeline-2020-2025.mdx` | ✅ Correct | Historical 2020-2025 |
| `bmfffl-all-time-records.mdx` | ✅ Correct | Historical through 2025 |
| `bmfffl-league-rules.mdx` | ✅ Correct | Timeless rules doc |

### Data Files

| File | Temporal Status | Notes |
|------|----------------|-------|
| `prospects-2026.json` | ✅ Correct | `status` field distinguishes `nfl_active` (2025 class) vs `incoming` (2026 class) |
| `champions-verified.json` | ✅ Correct | 2020-2025, all complete |
| `owner-stats-verified.json` | ✅ Correct | Through 2025 season |
| `league-stats-master.json` | ✅ Correct | Through 2025 season |
| `standings-history.json` | ✅ Correct | 2020-2025 |
| `pick-inventory-2026.json` | ✅ Correct | 2026 picks as current assets |
| `rosters-2026.json` | ✅ Correct | Verified via Sleeper API March 2026 |

---

## Temporal Conventions Used Correctly Throughout

1. **"Already in NFL"** — used correctly for 2025 draft class (Sanders, Ward, Jeanty, McMillan, etc.)
2. **"Incoming"** — used correctly for 2026 draft class (Love, Tate, Lemon, Tyson, Sadiq, etc.)
3. **"Pre-draft notice"** warnings on all 2026 prospect articles — correct
4. **validAsOf** frontmatter field — present on all time-sensitive articles
5. **"2026 NFL Draft (April 24-26)"** referenced as future event in all articles — correct

---

## Summary

**2 temporal/factual issues found** in the breakouts and sell-candidates articles. Both corrected. All other content correctly anchored to March 2026 with appropriate `validAsOf` caveats on time-sensitive material.

The primary temporal error type was treating projected stats as historical facts for the 2025 season, particularly for the 2025 rookie class. This has been corrected across both affected articles and in `prospects-2026.json`.

---

*Temporal audit complete | task-590 | 2026-03-15*
