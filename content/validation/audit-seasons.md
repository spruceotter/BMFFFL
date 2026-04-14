# BMFFFL Audit — Season Archive Articles (2020-2025)

*task-a004 | Audited: 2026-04-08 by FLINT-B369*

---

## Files Reviewed

- `content/seasons/2020.mdx` through `content/seasons/2025.mdx` (6 files)
- Cross-referenced against:
  - `content/data/champions-verified.json`
  - `content/data/standings-history.json`
  - `content/data/owners.json`

---

## Champion Consistency (All 6 Seasons)

All champion and runner-up owners verified against champions-verified.json. All match.

| Season | Champion (Article) | Champion (Ref) | Runner-Up (Article) | Runner-Up (Ref) | Status |
|--------|-------------------|----------------|---------------------|-----------------|--------|
| 2020 | Cogdeill11 | Cogdeill11 | eldridsm | eldridsm | ✓ |
| 2021 | MLSchools12 | MLSchools12 | rbr | rbr | ✓ |
| 2022 | Grandes | Grandes | rbr | rbr | ✓ |
| 2023 | JuicyBussy | JuicyBussy | eldridm20 | eldridm20 | ✓ |
| 2024 | MLSchools12 | MLSchools12 | SexMachineAndyD | SexMachineAndyD | ✓ |
| 2025 | tdtd19844 | tdtd19844 | Tubes94 | Tubes94 | ✓ |

---

## Championship Scores

| Season | Article Score | Reference Score | Status |
|--------|---------------|-----------------|--------|
| 2020 | 203.10 - 198.34 (margin: 4.76) | 203.10 - 198.34 | ✓ Match |
| 2021 | 150.90 - 103.38 (margin: 47.52) | null (not in ref) | New data |
| 2022 | 137.82 - 115.08 (margin: 22.74) | null | New data |
| 2023 | 179.40 - 149.62 (margin: 29.78) | null | New data |
| 2024 | 168.40 - 146.86 (margin: 21.54) | null | New data |
| 2025 | 152.92 - 135.08 (margin: 17.84) | null | New data |

Seasons 2021-2025 provide championship scores that the verified file doesn't have. These are additions from the articles, not contradictions. All scores are in plausible ranges for a 10-starter PPR superflex format (typical championship range: 120-220 pts).

**Score plausibility check**:
- 2021 blowout (150.90-103.38, 47-pt margin): plausible but notable — the largest margin in the data. Not impossible, especially if one team had injuries.
- 2020 was the tightest (4.76 pts), 2025 second-tightest (17.84 pts). Distribution is plausible.

---

## Playoff Seeding Verification

**2023 playoff bracket** (most complex — both lower seeds advanced): Verified against standings-history.json.

Reference seeds: 1. MLSchools12, 2. Grandes, 3. eldridsm, 4. Cmaleski, 5. eldridm20, 6. JuicyBussy

Article seeds: "1. MLSchools12 (bye), 2. Grandes (bye), 3. eldridsm, 4. Cmaleski, 5. eldridm20, 6. JuicyBussy" ✓ Match.

Wild card results: eldridm20 def. Cmaleski, JuicyBussy def. eldridsm. Both upsets — consistent with owners.json season outcomes.

Semifinal results: eldridm20 def. MLSchools12 (154.30-145.48, 8.82-pt margin — matches owners.json note "Lost semis (8.82 pts)"). JuicyBussy 201.80 def. Grandes 143.04. ✓

**2025 Moodie Bowl**: Article says Grandes won the Moodie Bowl. standings-history.json confirms: `"moodieBowl": "Grandes"`. ✓

---

## Notable Player Claims

Selected spot-checks:

- **2020**: "Alvin Kamara 6 TDs on Christmas Day" — attributed to Cogdeill11 (champion). This is a well-documented historical NFL fact (Christmas 2020). Attributing it to the champion is plausible since anyone who had Kamara that week won. ✓ Plausible.
- **2021**: "Christian McCaffrey trade from 2020 was foundational" for MLSchools12. Cannot verify without trade history data, but consistent with the dynasty narrative throughout the records.
- **2023**: "JuicyBussy 201.80 is the highest postseason score in the available BMFFFL archive" — matches owners.json profileNote: "top postseason score (201.80, 2023 semis)". ✓

---

## Corrections Made

None required. All champion, runner-up, and seed data matches reference files. Championship scores for 2021-2025 are new data from article sources, not contradictions.

---

## Captain Confirmation Needed

None required for this audit.

---

## Summary

- 6 season archives reviewed
- Champion/runner-up: 6/6 verified ✓
- Playoff seedings: verified for 2023 (most complex) ✓
- Championship scores: 2020 verified; 2021-2025 are article-sourced (not contradicted by reference)
- Notable player claims: spot-checked, plausible
- No corrections applied
