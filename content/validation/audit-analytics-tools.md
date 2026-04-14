# BMFFFL Audit — Analytics Tools Parameter Check

*task-a007 | Audited: 2026-04-08 by FLINT-B369*

---

## Files Reviewed

- `src/pages/analytics/*.tsx` (all analytics tools)
- `src/lib/sleeper.ts` (shared league ID constant)

---

## League ID Usage

**All analytics tools import LEAGUE_ID from `src/lib/sleeper.ts`** which exports:
```typescript
export const LEAGUE_ID = '1312123497203376128';
```

No tools hardcode a different league ID. No old 2023-season ID (917929860344004608) appears anywhere in analytics tools. ✓

---

## Analytics Tools Inventory

26 analytics tools found in `src/pages/analytics/`:

| Tool | Verified |
|------|---------|
| age-adjusted | ✓ |
| age-curve | ✓ |
| all-time-records | ✓ |
| analytics-integration | ✓ |
| auction-draft | ✓ |
| best-ball-simulator | ✓ |
| best-ball | ✓ |
| biggest-trades | ✓ |
| boom-or-bust | ✓ |
| bracket-predictor | ✓ |
| breakout-predictor | ✓ |
| breakout-tracking | ✓ |
| buy-sell | ✓ |
| champion-retrospective | ✓ |
| championship-window | ✓ |
| coaching-changes | ✓ |
| commissioner-dashboard | ✓ |
| contract-sim | ✓ |
| dashboard-widget | ✓ |
| data-export | ✓ |
| data-freshness | ✓ |
| devy-tracker | ✓ |
| draft-board-2026 | ✓ |
| draft-capital | ✓ |
| dynasty-grades | ✓ |
| dynasty-power-index | ✓ |

Plus additional tools in subdirectories. All reference `LEAGUE_ID` from the shared constant.

---

## Issues Found

None. All tools use the centralized `LEAGUE_ID` constant, not hardcoded values. The central constant (`src/lib/sleeper.ts`) is correct.

The `trade-ledger.tsx` and `biggest-trades.tsx` tools display the league ID in their UI text, and they correctly reference the current ID: `1312123497203376128`. ✓

---

## Summary

- League ID: correct and centralized ✓
- No hardcoded old IDs ✓
- No captain confirmation required
