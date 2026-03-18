# BMFFFL Website — Design Decisions

> *2026-03-15 | tasks 526, 538*

---

## CSS Framework Decision (task-526)

**Chosen: Tailwind CSS (base) + ShadcnUI (select components)**

### Evaluation

| Framework | Verdict | Notes |
|---|---|---|
| Tailwind CSS | ✅ **Primary** | Utility-first, dark mode via `class`, excellent for stat tables with precise control |
| ShadcnUI | ✅ **Supplement** | Copy-paste components (not a dep), uses Tailwind under the hood. Best for: Dialog, DropdownMenu, Select, Tabs |
| DaisyUI | ⛔ Pass | Semantic class names are convenient but lose the fine-grained control needed for dense stat tables |
| MUI | ⛔ Pass | React Material Design is too heavy, not sports-appropriate |
| Custom CSS | ⛔ Pass | Too much maintenance burden; Tailwind covers 95% of needs |

### Why Tailwind for Sports Data

Sports data sites (538, The Ringer, Rotoviz) use:
- Dense tables with precise padding (Tailwind `px-2 py-1`, not semantic classes)
- Dark mode as default — Tailwind `dark:` prefix is the cleanest implementation
- Tabular number alignment — Tailwind `font-mono` + `tabular-nums`
- Color-coded cells (win/loss, above/below average) — Tailwind JIT arbitrary values

**Sports-specific patterns to use:**
```html
<!-- Stat cell: right-aligned, monospaced, tabular -->
<td class="text-right font-mono tabular-nums text-sm px-3 py-2">127.4</td>

<!-- Win/loss coloring -->
<span class="text-win">W</span>  <!-- green-500 -->
<span class="text-loss">L</span> <!-- red-500 -->

<!-- Dark card -->
<div class="bg-brand-navy-l rounded-lg border border-white/10 p-4">
```

---

## Color Palette and Branding (task-538)

**BMFFFL Brand Identity: Deep Navy + Championship Gold**

### Color Palette

```css
/* Primary */
--navy:     #0d1b2a;  /* Deep background — serious, premium feel */
--navy-l:   #1a2d42;  /* Card backgrounds, elevated surfaces */
--gold:     #f0a500;  /* Primary accent — championship, prestige */
--gold-l:   #f7c948;  /* Hover states, secondary accents */

/* Text */
--slate:    #6b7f96;  /* Secondary text, labels */
--muted:    #4a5568;  /* Disabled, placeholder */
--cream:    #f5f0e8;  /* Light mode primary text */

/* Semantic */
--win:      #22c55e;  /* green-500 */
--loss:     #ef4444;  /* red-500 */
--tie:      #94a3b8;  /* slate-400 */
```

### Rationale
- **Navy**: The dominant dark sports palette (NFL Network, ESPN dark mode, Bleacher Report). Works as default dark background without being pure black (which feels heavy).
- **Gold**: Championship connotations. Used sparingly — highlights, active states, "champion" badges. Not overused (would look like a Steelers site).
- **Slate/cream text**: Readable without full white-on-black harshness.

### Typography
- **Body/UI**: Inter (variable font, excellent at small sizes for stats)
- **Stats/Numbers**: Roboto Mono with `font-variant-numeric: tabular-nums` — numbers align in tables without janky spacing
- **Headlines**: Inter Bold — no need for a display font for sports data; clarity beats flair

### Logo / Badge Concept
- Wordmark: "BMFFFL" in Inter Bold, all caps, letter-spaced
- Championship badge: circular seal with year + "CHAMPION" in gold on navy
- Owner profile badges: initials in colored circles (no league-wide avatars needed)

### Dark Mode Default
Dark mode is the default. 95% of fantasy sports usage is evenings and mobile. Light mode available via toggle (stored in localStorage) but dark is the designed state.

---

## Google Sheets + Sleeper Integration (task-527)

**Assessment:** Google Sheets integration is a **nice-to-have, Phase G+** feature, not core to the website build.

### What's Available
- Sleeper does not have an official Sheets integration
- Community approaches use:
  1. **Apps Script + Fetch**: `UrlFetchApp.fetch('https://api.sleeper.app/v1/...')` — works but requires setup per user
  2. **Zapier/Make**: Connect Sleeper webhooks → Sheets, but requires paid tier for meaningful automation
  3. **Manual export**: Copy standings to Sheets manually — what most leagues do

### BMFFFL Decision
The website supersedes the Sheets use case. Sheets integration useful for:
- Commissioner keeping backup records
- Members who prefer spreadsheet format for analysis

**Recommendation:** Build a "Download CSV" button on standings and roster pages. This is 20 lines of code and covers the Sheets use case without maintaining a separate integration.

```typescript
// CSV download helper
function downloadCSV(data: Record<string, unknown>[], filename: string) {
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => Object.values(row).join(','));
  const csv = [headers, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}
```

**Phase G task**: Add CSV download to Standings, Roster, and Draft pages. No Apps Script required.
