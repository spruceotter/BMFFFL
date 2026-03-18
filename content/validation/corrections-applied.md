# BMFFFL Website Content Corrections Log

*Applied: 2026-03-15 | Source: bmfffl-fact-check-2026-03.md (task-411)*

---

## Summary

Review of the bmfffl-fact-check-2026-03.md document found **no major structural errors** in the BMFFFL corpus. The Sleeper API live data confirmed all core claims about league format, division names, scoring settings, and owner attributions were accurate.

However, three specific numerical values in the bmfffl-league-rules.mdx article required correction based on verified Sleeper API data.

---

## Corrections Applied

### 1. FAAB Budget — `content/articles/bmfffl-league-rules.mdx`

| Field | Incorrect Value | Correct Value | Source |
|-------|-----------------|---------------|--------|
| Annual FAAB budget | $100 | **$10,000** | Sleeper API, league_id 1312123497203376128 |

**Fix applied**: Changed `$100` → `$10,000` in two locations within the FAAB section.

**Note**: The $100 figure may have come from a different league or a scaled assumption. Sleeper uses full dollar amounts ($10,000) rather than a condensed scale.

---

### 2. Trade Deadline — `content/articles/bmfffl-league-rules.mdx`

| Field | Incorrect Value | Correct Value | Source |
|-------|-----------------|---------------|--------|
| Trade deadline | ~Week 10 | **Week 14** | Sleeper API verified configuration |

**Fix applied**: Changed `~Week 10 of regular season` → `Week 14 of regular season`.

**Note**: The Week 10 figure may have been a generic dynasty league assumption. BMFFFL's trade deadline is Week 14, aligning with the end of the regular season before playoffs start in Week 15.

---

### 3. Taxi Squad Eligibility — `content/articles/bmfffl-league-rules.mdx`

| Field | Incorrect Value | Correct Value | Source |
|-------|-----------------|---------------|--------|
| Taxi squad eligibility | "first 2 years (confirm)" | **3-year eligibility** | Sleeper API, taxi_years=3 |

**Fix applied**: Updated taxi squad rules to reflect the confirmed 3-year eligibility window.

---

## No Correction Required

The following items were verified as accurate per the fact-check and required no changes:

- League format: Dynasty Superflex PPR ✓
- Division names: Group of Death, Moodie's Wives, Pig Bottoms ✓
- Roster format: QB, RB×2, WR×3, TE, FLEX×2, SUPER_FLEX, 16 bench, 5 taxi ✓
- Scoring: Full PPR (1.0/rec), Pass TD = 4pts, Rush/Rec TD = 6pts, INT = -3pts, Fumble = -2pts ✓
- Draft type: Linear (non-snake), 4 rounds ✓
- Pick trading: Enabled, current + 1 year forward ✓
- FAAB: Resets each season ✓
- Playoff structure: 6 teams, Week 15-17 ✓
- All Sleeper League IDs (2020-2026) ✓
- Owner usernames and team names ✓
- Grandes as league commissioner ✓
- No kicker or D/ST slots ✓

---

## Potential Future Discrepancies to Monitor

Per the fact-check document, the following items may change and should be re-verified before launch:

1. **Team names**: `eldridsm` and `Bimfle` had no team names set as of 2026-03-14 — may update
2. **Scoring format sensitivity**: 4pt passing TD (not 6pt) affects QB dynasty value calculations; any imported value rankings assuming 6pt TDs will be inflated ~15-20% for QBs
3. **Traded picks**: 20 traded picks were in the system as of 2026-03-14; this number will change as free agency and pre-draft trading continues

---

*Corrections applied 2026-03-15 | task-577 complete*
