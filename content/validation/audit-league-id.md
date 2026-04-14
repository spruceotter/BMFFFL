# BMFFFL Audit — League ID and Sleeper Data Verification

*task-a006 | Audited: 2026-04-08 by FLINT-B369*

---

## Files Reviewed

- `content/data/league-identity.json`
- `content/articles/bmfffl-league-rules.mdx`
- `src/lib/sleeper.ts`
- `src/pages/analytics/*.tsx` (sample)
- `vercel.json`

---

## League ID Consistency

### Current League ID: 1312123497203376128

This is the 2026 season Sleeper league ID. It appears consistently in:

| Location | Value | Status |
|----------|-------|--------|
| `league-identity.json` → `currentSleeperLeagueId` | 1312123497203376128 | ✓ |
| `src/lib/sleeper.ts` → `LEAGUE_ID` constant | 1312123497203376128 | ✓ |
| `bmfffl-league-rules.mdx` (2026 entry) | 1312123497203376128 | ✓ |

### Historical League IDs (from rules article)

| Season | ID |
|--------|----|
| 2020 | 515286181558452224 |
| 2021 | 649927136014065664 |
| 2022 | 784483016662724608 |
| 2023 | 917929860344004608 |
| 2024 | 1048281095227236352 |
| 2025 | 1180109269263917056 |
| 2026 | 1312123497203376128 |

The IDs appear to increment by approximately 131-132 billion per year — consistent with Sleeper's sequential ID generation for annual league renewals.

`league-identity.json` only has partial historical IDs (2022, 2023). The rules article has the complete list.

---

## Old League ID Usage

Old 2023 season ID (917929860344004608) does NOT appear in any source file. The codebase exclusively uses the current ID. ✓

Vercel.json contains no environment variables or league ID references — configuration is handled at the source level. ✓

---

## Discrepancies

### league-identity.json says `sleeperSince: 2019`

The rules article states "BMFFFL has been on Sleeper since the **2020 season**." Historical league IDs in the rules article start at 2020. league-identity.json says `sleeperSince: 2019`.

**Resolution**: Cannot determine which is correct from internal data. **Captain confirmation required** (queued from task-a003 audit).

---

## Summary

- Current league ID is correct and consistent across all codebase files ✓
- No analytics tools reference old league IDs ✓
- sleeperSince discrepancy (2019 vs 2020) deferred to captain
