# BMFFFL Audit — League Rules Article

*task-a003 | Audited: 2026-04-08 by FLINT-B368*

---

## Files Reviewed

- `content/articles/bmfffl-league-rules.mdx`
- `content/data/league-identity.json`

---

## Known Corrections Verification

Task specified three corrections previously applied. Verified all three are present:

| Correction | Status in Rules Article |
|------------|------------------------|
| FAAB = $10,000 | ✓ Present: "Annual budget: $10,000 (resets each season)" |
| Trade deadline = Week 14 | ✓ Present: "Trade deadline: Week 14 of regular season" |
| Taxi squad = 3-year eligibility | ✓ Present: "Restricted to players within their first 3 years" |

---

## Discrepancies Found

### 1. Division Names — "Cleveland" vs "Moodie's Wives"

**Rules article**: "3 Divisions: Group of Death, Moodie's Wives, Pig Bottoms"

**league-identity.json**: `"divisions": ["Group of Death", "Cleveland", "Pig Bottoms"]`

**Resolution**: Cannot verify from internal files. **Captain confirmation required.**

> **Question for captain**: Is the second division currently named "Moodie's Wives" or "Cleveland"?

---

### 2. Bench Roster Size — 14 vs 16

**Rules article**: "Bench: 16"

**league-identity.json**: `"bench": 14`

**Resolution**: league-identity.json was sourced from the old site (2019-era data); the rules article may reflect current settings. Cannot verify which is correct without Sleeper API access. **Captain confirmation required.**

> **Question for captain**: Is the current bench size 14 or 16 roster spots?

---

### 3. IR Slots — Unlimited vs 4

**Rules article**: "Injured Reserve: Unlimited"

**league-identity.json**: `"ir": 4`

**Resolution**: Same source-date issue as bench. Cannot verify from internal data. **Captain confirmation required.**

> **Question for captain**: Is the IR currently 4 slots or unlimited?

---

### 4. Sleeper Since Date — 2019 vs 2020

**Rules article**: "The BMFFFL has been on Sleeper since the 2020 season"

**league-identity.json**: `"sleeperSince": 2019`

**Observation**: The historical league IDs listed in the rules article start at season 2020 (ID: 515286181558452224). If Sleeper was used in 2019, there should be a 2019 league ID not in the current list. **Captain confirmation required.**

> **Question for captain**: Did BMFFFL start using Sleeper in 2019 or 2020?

---

### 5. Passing TD Scoring

**Rules article**: "Passing TD: 4 pts"

**league-identity.json**: `"passingTDs": 4`

**Status**: MATCH — no discrepancy.

---

## No Changes Made

The discrepancies above cannot be resolved from internal data alone. Changes deferred pending captain confirmation. The rules article otherwise appears internally consistent.

---

## Summary

- Known corrections: ✓ All 3 verified present
- Discrepancies requiring captain input: 4 (division name, bench size, IR slots, Sleeper start year)
- Corrections applied: 0 (insufficient internal data to resolve)
- Captain questions queued: See above — one at a time per the Q&A channel protocol
