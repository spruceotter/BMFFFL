# BMFFFL Audit — Internal Consistency Across Articles

*task-a005 | Audited: 2026-04-08 by FLINT-B369*

---

## Scope

Check for inconsistencies across editorial articles, season archives, and content pages regarding:
1. Owner name consistency
2. Historical facts (records, champions, scores)
3. Outdated information

---

## Owner Name Consistency

Owner usernames used in editorial articles are consistent with the canonical usernames in `owners.json`. Where articles use team names instead of usernames (e.g., "The Murder Boners" instead of "MLSchools12"), these are historically correct for the relevant season.

Notable name mapping used consistently:
- MLSchools12 ↔ "The Murder Boners" (2020-2023), "Schoolcraft Football Team" (2024-2025)
- JuicyBussy ↔ "Juicy Bussy" (display name with space)
- Tubes94 ↔ "Nacua Matata" (2024), "Whale Tails" (2025)
- Grandes ↔ "El Rioux Grandes"

No inconsistencies found across the 6 season archives or major editorial articles reviewed.

---

## Historical Claim Spot-Checks

Selected claims verified across multiple articles:

| Claim | Articles Making Claim | Status |
|-------|----------------------|--------|
| MLSchools12 went 13-1 in 2023 and lost in semis | 2023 season archive, state-of-the-league, year-in-review-2025 | ✓ Consistent |
| JuicyBussy won 2023 as 6th seed | 2023 archive, champion-timeline | ✓ Consistent |
| tdtd19844 went 3-11 in 2022 before winning 2025 | 2025 archive, multiple retrospectives | ✓ Consistent |
| Cogdeill11 won 2020 championship 203.10-198.34 | 2020 archive, champion-timeline | ✓ Consistent |
| Tubes94 went 2-12 in inaugural 2021 season | Tubes94 owner profile, 2021 archive | ✓ Consistent |

---

## Outdated Information Found

### navigation-structure.json — Stale Gaps Entry

`navigation-structure.json` contains this gap entry:
> "Seasons 2021, 2023 articles not yet written (2020, 2022, 2024, 2025 done)"

This is **outdated**. All 6 season archive articles now exist in `content/seasons/`:
- 2020.mdx ✓
- 2021.mdx ✓
- 2022.mdx ✓
- 2023.mdx ✓
- 2024.mdx ✓
- 2025.mdx ✓

**Correction**: Updated the gaps entry in navigation-structure.json.

---

## Summary

- No owner name inconsistencies across editorial articles
- Historical claims consistent across cross-referenced articles
- One stale gap entry in navigation-structure.json corrected
- No captain confirmation required
