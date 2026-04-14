# BMFFFL Audit — Champions and Historical Records

*task-a002 | Audited: 2026-04-08 by FLINT-B368*

---

## Files Reviewed

- `content/data/champions-verified.json`
- `content/data/standings-history.json`
- `content/data/owners.json` (cross-reference)

---

## Champion Consistency (champions-verified.json vs. owners.json)

All 6 seasons match exactly across both files.

| Year | Champion | Runner-Up | champions-verified | owners.json | Status |
|------|----------|-----------|-------------------|-------------|--------|
| 2020 | Cogdeill11 | eldridsm | ✓ | ✓ | Match |
| 2021 | MLSchools12 | rbr | ✓ | ✓ | Match |
| 2022 | Grandes | rbr | ✓ | ✓ | Match |
| 2023 | JuicyBussy | eldridm20 | ✓ | ✓ | Match |
| 2024 | MLSchools12 | SexMachineAndyD | ✓ | ✓ | Match |
| 2025 | tdtd19844 | Tubes94 | ✓ | ✓ | Match |

---

## Standings Internal Consistency (standings-history.json)

All seasons verified: total wins = total losses (zero-sum check).

| Year | Teams | Total W | Total L | Balance |
|------|-------|---------|---------|---------|
| 2020 | 12 | 78 | 78 | ✓ |
| 2021 | 12 | 84 | 84 | ✓ |
| 2022 | 12 | 84 | 84 | ✓ |
| 2023 | 12 | 84 | 84 | ✓ |
| 2024 | 12 | 84 | 84 | ✓ |
| 2025 | 12 | 84 | 84 | ✓ |

Note: 2020 = 78 games total (13-game regular season × 12 teams ÷ 2 = 78 matchups — consistent). 2021-2025 = 84 games (14-game seasons). The format change from 13→14 regular season weeks is consistent across all owners.

---

## Championship Scores

Only 2020 has both scores recorded (203.10 vs. 198.34, margin 4.76 pts). Seasons 2021-2025 show `null` for championship scores — this is a known data gap, not an error. The 2020 score is plausible (realistic range for a 12-player fantasy lineup).

---

## Discrepancies Found

None. All champion/runner-up/standings data is internally consistent.

---

## No Captain Confirmation Required

All data verifiable from internal cross-reference. No external facts needed.
