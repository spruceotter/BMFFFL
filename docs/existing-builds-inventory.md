# Existing Builds Inventory for Website Integration

> *task-534 | 2026-03-15*
> *Audit of experience/builds/ for reusable components in BMFFFL website*

---

## High-Priority Integrations (direct port to web)

### `sleeper-tools/` — **Core data layer**
**Contents:** 18 Python scripts + `sleeper_api_utils.py`
**Reusable functionality:**
- `sleeper_api_utils.py` → port to `src/lib/sleeper.ts` (TypeScript API client)
- `full-league-report.py` → powers `/seasons/[year]` standings page
- `season-summary.py` → powers season archive data
- `roster-age-index.py` → owner roster health metric
- `league-health-dashboard.py` → analytics dashboard component
- `matchup-preview.py` → weekly matchup data
- `draft-recap.py` → `/drafts/rookie/[year]` page
- `owner-efficiency.py` → owner profile stats
- `faab-efficiency.py` → transaction analytics

**Port strategy:** Convert Python Sleeper API calls to TypeScript fetch in `src/lib/sleeper.ts`. Logic for stat computations stays the same, just typed.

### `dynasty-trade-analyzer/` — **Analytics app (Phase E)**
**Contents:** `trade-calc.py`, `value-model.py`, `startup-draft.py`, `startup-draft-ranker.py`
**Reusable functionality:**
- Trade calculator core logic → `/analytics/trade-analyzer`
- Value model → powers dynasty rankings display
- Startup draft ranker → `/drafts/startup/` historical view

**Port strategy:** Convert trade calculator to a React component with Sleeper API integration. Value model becomes a JSON data file with player dynasty values.

### `nfl-draft-prospect-db/` — **Phase G integration**
**Contents:** Prospect database with ranking, grades, position analysis
**Reusable functionality:**
- Prospect profiles → `/nfl-draft` 2026 tracker
- Position analysis → dynasty value projections

**Port strategy:** Convert to static JSON data file. Build React UI over it for the NFL Draft tracker page.

### `waiver-wire-ranker/` — **Phase E analytics**
**Contents:** FAAB prioritization, adds/drops recommendations
**Reusable functionality:**
- Weekly waiver recommendations display
- FAAB efficiency tracking

### `rb-aging-curve/` — **Analytics content**
**Contents:** RB aging curve analysis, career trajectory modeling
**Reusable functionality:**
- Aging curve chart → Recharts line chart component
- Career stage classifications → player value overlays

### `target-share-tracker/` — **WR analytics**
**Contents:** Target share tracking, trend analysis
**Reusable functionality:**
- Target share trends → dynasty sell/hold signal charts
- Weekly trend data → player profile overlays

---

## Medium-Priority (content source, not direct port)

### `playoff-schedule-optimizer/`
Playoff schedule analysis → article content, `/analytics/standings` schedule strength display

### `injury-impact-analyzer/`
Injury impact on dynasty value → article content, player profile injury history

### `qb-situational/`
QB situational performance → QB ranking support data

### `rb-aging-curve/`, `rb-aging-curve` (two versions)
Both versions provide aging curve analysis. Port chart to Recharts for `/analytics`.

---

## Low-Priority / Research Context Only

These builds produced research content but don't have direct web UI applications:

| Build | Contents | Website Role |
|---|---|---|
| `agent-eval-toolkit` | Agent evaluation framework | No direct web role |
| `claude-code-skills` | Slash command library | No direct web role |
| `cma-generator` | CMA analysis tools | No direct web role |
| `cognitive-load` | Cognitive load research | Article content only |
| `complex-failures` | Failure mode analysis | Article content only |
| `decision-fatigue` | Decision fatigue research | Article content only |
| `feedback-loops` | Feedback loop analysis | Background context |
| `memory-consolidation` | Memory research | Background context |
| `microbiome` | Microbiome research | No web role |
| `moral-uncertainty` | Ethics research | No web role |
| `nfl-analytics-intro` | NFL analytics primer | Article content |
| `observability` | Observability patterns | No web role |
| `prediction-markets` | Prediction market analysis | Could power pick'em |
| `prompt-playbook` | Prompt engineering | No web role |
| `skill-library` | Skill library tools | No web role |
| `weather-impact` | Weather impact analysis | Situational analytics |

---

## Integration Priority Summary

```
Phase D (Core Build):
  sleeper-tools → src/lib/sleeper.ts
  sleeper-tools scripts → getStaticProps data fetchers

Phase E (Analytics):
  dynasty-trade-analyzer → /analytics/trade-analyzer
  waiver-wire-ranker → /analytics/waiver
  rb-aging-curve → /analytics/aging-curves

Phase G (Integrations):
  nfl-draft-prospect-db → /nfl-draft

Content Sources (Phase B/F):
  injury-impact-analyzer, qb-situational, target-share-tracker
  → Article content and data files
```
