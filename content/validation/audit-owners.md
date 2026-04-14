# BMFFFL Audit — Owner/Manager Data Integrity

*task-a001 | Audited: 2026-04-08 by FLINT-B368*

---

## Files Reviewed

- `content/data/owners.json`
- `content/data/owner-stats-verified.json`
- `content/data/league-identity.json` (structure check only)

## Methodology

1. Cross-checked all-time win/loss records between `owners.json` and `owner-stats-verified.json`
2. Verified season-by-season records sum to declared all-time records (12 owners, 6 seasons each)
3. Compared playoff appearance counts across both files
4. Checked championship counts for consistency

---

## Record Sum Verification (Season Totals vs. Declared All-Time Records)

All 12 owners: **PASS** — season records sum exactly to declared all-time records.

| Owner | Season Sum | Declared | Status |
|-------|------------|----------|--------|
| mlschools12 | 68-15 | 68-15 | ✓ |
| sexmachineandy | 50-33 | 50-33 | ✓ |
| juicybussy | 46-37 | 46-37 | ✓ |
| grandes | 42-41 | 42-41 | ✓ |
| rbr | 44-39 | 44-39 | ✓ |
| tdtd19844 | 36-47 | 36-47 | ✓ |
| eldridsm | 41-42 | 41-42 | ✓ |
| eldridm20 | 39-44 | 39-44 | ✓ |
| cogdeill11 | 38-45 | 38-45 | ✓ |
| cmaleski | 36-47 | 36-47 | ✓ |
| tubes94 | 34-36 | 34-36 | ✓ |
| escuelas | 15-41 | 15-41 | ✓ |

---

## Discrepancies Found and Corrected

### 1. Grandes — Playoff Appearances Over-counted in owner-stats-verified.json

**Issue**: `owner-stats-verified.json` listed `playoffAppearances: 4` and `playoffRate: 0.667` for Grandes. Season-by-season data in `owners.json` shows only 3 seasons with playoff participation: 2021 (Lost round 1), 2022 (CHAMPION), 2023 (Lost semis). 2020, 2024, and 2025 were all missed playoffs.

**Correction applied**: `owner-stats-verified.json` updated: `playoffAppearances: 3`, `playoffRate: 0.500`.

**Evidence**: Season data in owners.json is internally consistent with 3 appearances.

---

### 2. eldridm20 — 2021 Consolation Bracket Incorrectly Listed as Playoff Appearance

**Issue**: `owners.json` listed `playoffAppearances: [2021, 2022, 2023]` for eldridm20. However, the 2021 season data shows the result as "Consolation bracket" — which is not the main playoff bracket. This was not a playoff appearance. `owner-stats-verified.json` correctly had `playoffAppearances: 2` (2022, 2023).

**Correction applied**: `owners.json` updated: `playoffAppearances: [2022, 2023]`, `playoffRate: 0.333` (2 of 6 seasons).

**Evidence**: eldridm20's 2021 season was 8-6 with result "Consolation bracket" — the consolation/toilet bracket is separate from the main playoff bracket. Only 2022 (Lost wild card) and 2023 (Runner-up) count as true playoff appearances.

---

## Championship Consistency

All champion/runner-up data consistent across both files. No discrepancies.

| Champion | Year | owners.json | verified.json | Status |
|----------|------|-------------|---------------|--------|
| Cogdeill11 | 2020 | ✓ | ✓ | Match |
| mlschools12 | 2021 | ✓ | ✓ | Match |
| Grandes | 2022 | ✓ | ✓ | Match |
| JuicyBussy | 2023 | ✓ | ✓ | Match |
| mlschools12 | 2024 | ✓ | ✓ | Match |
| tdtd19844 | 2025 | ✓ | ✓ | Match |

---

## Team Name History

Team names appear complete and internally plausible. Notable entries:

- **mlschools12**: "The Murder Boners" (2020-2023) → "Schoolcraft Football Team" (2024-2025)
- **tubes94**: "Swamp Donkey's" (2021) → "Burn it all" (2022-2023) → "Nacua Matata" (2024) → "Whale Tails" (2025)
- **escuelas**: Multiple names since joining 2022 ("Grindin Gere's" → "Loud and Stroud!" → "The Young Guns + backups" → "Booty Cheeks")

No captain confirmation needed — names are plausible, no obvious errors.

---

## Summary

**Corrections made**: 2
**Files corrected**: `owner-stats-verified.json` (Grandes playoff count), `owners.json` (eldridm20 playoff list)
**No captain action required**: all corrections determinable from internal data
**Season game totals**: 2020 had 13-game regular seasons; 2021-2025 had 14-game regular seasons — consistent across all owners.
