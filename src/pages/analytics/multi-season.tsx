import { useState } from 'react';
import Head from 'next/head';
import { BarChart2, TrendingUp, Trophy, Star, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type SeasonYear = 2020 | 2021 | 2022 | 2023 | 2024 | 2025;

interface SeasonRecord {
  wins: number;
  losses: number;
  champion?: boolean;
  runnerUp?: boolean;
}

interface ManagerRow {
  manager: string;
  seasons: Partial<Record<SeasonYear, SeasonRecord>>;
  totalWins: number;
  totalLosses: number;
  careerWinPct: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ALL_SEASONS: SeasonYear[] = [2020, 2021, 2022, 2023, 2024, 2025];

const MANAGER_DATA: ManagerRow[] = [
  {
    manager: 'mlschools12',
    seasons: {
      2020: { wins: 10, losses: 4 },
      2021: { wins: 12, losses: 2, champion: true },
      2022: { wins: 11, losses: 3 },
      2023: { wins: 12, losses: 2 },
      2024: { wins: 11, losses: 3, champion: true },
      2025: { wins: 13, losses: 1, champion: true },
    },
    totalWins: 69,
    totalLosses: 15,
    careerWinPct: 82.1,
  },
  {
    manager: 'rbr',
    seasons: {
      2020: { wins: 8, losses: 6 },
      2021: { wins: 9, losses: 5, runnerUp: true },
      2022: { wins: 8, losses: 6, runnerUp: true },
      2023: { wins: 7, losses: 7 },
      2024: { wins: 8, losses: 6 },
      2025: { wins: 7, losses: 7 },
    },
    totalWins: 47,
    totalLosses: 37,
    careerWinPct: 55.9,
  },
  {
    manager: 'SexMachineAndyD',
    seasons: {
      2020: { wins: 9, losses: 5 },
      2021: { wins: 8, losses: 6 },
      2022: { wins: 9, losses: 5 },
      2023: { wins: 7, losses: 7 },
      2024: { wins: 8, losses: 6 },
      2025: { wins: 9, losses: 5 },
    },
    totalWins: 50,
    totalLosses: 34,
    careerWinPct: 59.5,
  },
  {
    manager: 'juicybussy',
    seasons: {
      2020: { wins: 7, losses: 7 },
      2021: { wins: 8, losses: 6 },
      2022: { wins: 9, losses: 5 },
      2023: { wins: 10, losses: 4, champion: true },
      2024: { wins: 10, losses: 4 },
      2025: { wins: 9, losses: 5 },
    },
    totalWins: 53,
    totalLosses: 31,
    careerWinPct: 63.1,
  },
  {
    manager: 'cogdeill11',
    seasons: {
      2020: { wins: 10, losses: 3, champion: true },
      2021: { wins: 9, losses: 5 },
      2022: { wins: 8, losses: 6 },
      2023: { wins: 12, losses: 2 },
      2024: { wins: 7, losses: 7 },
      2025: { wins: 6, losses: 7 },
    },
    totalWins: 52,
    totalLosses: 30,
    careerWinPct: 63.4,
  },
  {
    manager: 'tdtd19844',
    seasons: {
      2020: { wins: 7, losses: 7 },
      2021: { wins: 7, losses: 7 },
      2022: { wins: 8, losses: 6 },
      2023: { wins: 9, losses: 5 },
      2024: { wins: 7, losses: 7 },
      2025: { wins: 8, losses: 6 },
    },
    totalWins: 46,
    totalLosses: 38,
    careerWinPct: 54.8,
  },
  {
    manager: 'eldridsm',
    seasons: {
      2020: { wins: 9, losses: 5, runnerUp: true },
      2021: { wins: 7, losses: 7 },
      2022: { wins: 8, losses: 6 },
      2023: { wins: 7, losses: 7 },
      2024: { wins: 6, losses: 8 },
      2025: { wins: 5, losses: 9 },
    },
    totalWins: 42,
    totalLosses: 42,
    careerWinPct: 50.0,
  },
  {
    manager: 'eldridm20',
    seasons: {
      2020: { wins: 6, losses: 8 },
      2021: { wins: 8, losses: 6 },
      2022: { wins: 9, losses: 5 },
      2023: { wins: 8, losses: 6, runnerUp: true },
      2024: { wins: 6, losses: 8 },
      2025: { wins: 7, losses: 7 },
    },
    totalWins: 44,
    totalLosses: 40,
    careerWinPct: 52.4,
  },
  {
    manager: 'tubes94',
    seasons: {
      2021: { wins: 7, losses: 7 },
      2022: { wins: 7, losses: 7 },
      2023: { wins: 6, losses: 8 },
      2024: { wins: 9, losses: 5 },
      2025: { wins: 11, losses: 3, runnerUp: true },
    },
    totalWins: 40,
    totalLosses: 30,
    careerWinPct: 57.1,
  },
  {
    manager: 'grandes',
    seasons: {
      2020: { wins: 6, losses: 8 },
      2021: { wins: 7, losses: 7 },
      2022: { wins: 9, losses: 5, champion: true },
      2023: { wins: 5, losses: 9 },
      2024: { wins: 5, losses: 9 },
      2025: { wins: 5, losses: 9 },
    },
    totalWins: 37,
    totalLosses: 47,
    careerWinPct: 44.0,
  },
  {
    manager: 'cmaleski',
    seasons: {
      2020: { wins: 5, losses: 9 },
      2021: { wins: 6, losses: 8 },
      2022: { wins: 7, losses: 7 },
      2023: { wins: 6, losses: 8 },
      2024: { wins: 8, losses: 6 },
      2025: { wins: 6, losses: 8 },
    },
    totalWins: 38,
    totalLosses: 46,
    careerWinPct: 45.2,
  },
  {
    manager: 'escuelas',
    seasons: {
      2020: { wins: 3, losses: 11 },
      2021: { wins: 4, losses: 10 },
      2022: { wins: 5, losses: 9 },
      2023: { wins: 3, losses: 11 },
      2024: { wins: 3, losses: 11 },
      2025: { wins: 4, losses: 10 },
    },
    totalWins: 22,
    totalLosses: 62,
    careerWinPct: 26.2,
  },
];

// ─── Trend data for Win% Chart ─────────────────────────────────────────────────

interface TrendManager {
  manager: string;
  color: string;
  winPcts: Partial<Record<SeasonYear, number>>;
  note: string;
}

const TREND_MANAGERS: TrendManager[] = [
  {
    manager: 'mlschools12',
    color: '#ffd700',
    winPcts: { 2020: 71.4, 2021: 85.7, 2022: 78.6, 2023: 85.7, 2024: 78.6, 2025: 92.9 },
    note: 'Consistently elite — never below 71%',
  },
  {
    manager: 'tubes94',
    color: '#22d3ee',
    winPcts: { 2021: 50.0, 2022: 50.0, 2023: 42.9, 2024: 64.3, 2025: 78.6 },
    note: 'Rapidly rising — revenge arc in motion',
  },
  {
    manager: 'escuelas',
    color: '#f87171',
    winPcts: { 2020: 21.4, 2021: 28.6, 2022: 35.7, 2023: 21.4, 2024: 21.4, 2025: 28.6 },
    note: 'Persistently near basement — brave soul',
  },
  {
    manager: 'cogdeill11',
    color: '#fb923c',
    winPcts: { 2020: 76.9, 2021: 64.3, 2022: 57.1, 2023: 85.7, 2024: 50.0, 2025: 46.2 },
    note: 'Boom/bust trajectory — two elite seasons, recent decline',
  },
  {
    manager: 'rbr',
    color: '#a78bfa',
    winPcts: { 2020: 57.1, 2021: 64.3, 2022: 57.1, 2023: 50.0, 2024: 57.1, 2025: 50.0 },
    note: 'Never below 7 wins — relentless consistency',
  },
];

// ─── Era Dominance ─────────────────────────────────────────────────────────────

interface EraRecord {
  era: string;
  years: string;
  dominant: string;
  record: string;
  note: string;
  color: string;
}

const ERA_DATA: EraRecord[] = [
  {
    era: 'Founding Era',
    years: '2020–2021',
    dominant: 'mlschools12',
    record: '22-6',
    note: 'Championship in 2021 — set the standard on day one.',
    color: '#ffd700',
  },
  {
    era: 'Competitive Middle',
    years: '2022–2023',
    dominant: 'cogdeill11',
    record: '20-8',
    note: 'Co-dominant with mlschools12 — both went 12-2 in 2023.',
    color: '#fb923c',
  },
  {
    era: 'Dynasty Consolidation',
    years: '2024–2025',
    dominant: 'mlschools12',
    record: '24-4',
    note: 'Two more championships — nobody else close.',
    color: '#ffd700',
  },
  {
    era: 'Rising Threat',
    years: '2024–2025',
    dominant: 'tubes94',
    record: '20-8',
    note: 'Runner-up 2025, top-5 both years — the heir apparent.',
    color: '#22d3ee',
  },
];

// ─── Summary stat cards ────────────────────────────────────────────────────────

interface SummaryCard {
  label: string;
  value: string;
  detail: string;
  color: string;
}

const SUMMARY_CARDS: SummaryCard[] = [
  {
    label: 'Highest Single-Season Win%',
    value: 'mlschools12 2025',
    detail: '13-1 · 92.9% — best regular season in BMFFFL history',
    color: '#ffd700',
  },
  {
    label: 'Most Consistent Manager',
    value: 'rbr',
    detail: 'Never below 7 wins in any season — six years of reliability',
    color: '#a78bfa',
  },
  {
    label: 'Biggest Improvement',
    value: 'tubes94',
    detail: '7-7 in 2021 → 11-3 in 2025 — a four-win swing and rising',
    color: '#22d3ee',
  },
  {
    label: 'Biggest Decline',
    value: 'cogdeill11',
    detail: '10-3 champion in 2020 → 6-7 in 2025 — the long fade',
    color: '#fb923c',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function winPct(wins: number, losses: number): number {
  const total = wins + losses;
  return total === 0 ? 0 : (wins / total) * 100;
}

function recordColor(wins: number, losses: number): string {
  const pct = winPct(wins, losses);
  if (pct >= 78) return 'text-[#ffd700] font-black';
  if (pct >= 64) return 'text-emerald-400 font-bold';
  if (pct >= 50) return 'text-slate-200 font-semibold';
  if (pct >= 36) return 'text-orange-400 font-semibold';
  return 'text-red-400 font-semibold';
}

// ─── Win% Bar ─────────────────────────────────────────────────────────────────

function WinPctBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-5 w-full rounded bg-[#0d1b2a] overflow-hidden relative">
      <div
        className="h-full rounded transition-all duration-300"
        style={{ width: `${pct}%`, backgroundColor: color, opacity: 0.85 }}
        aria-label={`${pct.toFixed(1)}%`}
      />
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow">
        {pct.toFixed(0)}%
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MultiSeasonPage() {
  const [selectedSeasons, setSelectedSeasons] = useState<Set<SeasonYear>>(
    new Set(ALL_SEASONS)
  );
  const [sortKey, setSortKey] = useState<'careerWinPct' | 'totalWins' | 'manager'>('careerWinPct');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  function toggleSeason(year: SeasonYear) {
    setSelectedSeasons((prev) => {
      const next = new Set(prev);
      if (next.has(year)) {
        if (next.size > 1) next.delete(year);
      } else {
        next.add(year);
      }
      return next;
    });
  }

  const activeSeasonsArr = ALL_SEASONS.filter((y) => selectedSeasons.has(y));

  function computedRow(row: ManagerRow) {
    let w = 0;
    let l = 0;
    activeSeasonsArr.forEach((y) => {
      const s = row.seasons[y];
      if (s) { w += s.wins; l += s.losses; }
    });
    return { ...row, filteredWins: w, filteredLosses: l, filteredPct: winPct(w, l) };
  }

  const displayRows = MANAGER_DATA
    .map(computedRow)
    .sort((a, b) => {
      let av: number | string;
      let bv: number | string;
      if (sortKey === 'careerWinPct') { av = a.filteredPct; bv = b.filteredPct; }
      else if (sortKey === 'totalWins') { av = a.filteredWins; bv = b.filteredWins; }
      else { av = a.manager.toLowerCase(); bv = b.manager.toLowerCase(); }
      if (av < bv) return sortDir === 'desc' ? 1 : -1;
      if (av > bv) return sortDir === 'desc' ? -1 : 1;
      return 0;
    });

  function handleSort(key: typeof sortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  function SortIcon({ col }: { col: typeof sortKey }) {
    if (col !== sortKey) return <span className="w-3 h-3 inline-block opacity-20"><ChevronDown className="w-3 h-3" /></span>;
    return sortDir === 'desc'
      ? <ChevronDown className="w-3 h-3 text-[#ffd700]" />
      : <ChevronUp className="w-3 h-3 text-[#ffd700]" />;
  }

  return (
    <>
      <Head>
        <title>Multi-Season Standings Overlay — BMFFFL Analytics</title>
        <meta
          name="description"
          content="Compare BMFFFL manager performance across all seasons in a single view. Win-loss records, career trends, era dominance."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <BarChart2 className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            Multi-Season Standings Overlay
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Every manager. Every season. One view. Compare records across the full BMFFFL history.
          </p>
        </header>

        {/* ── Season Multi-Select ──────────────────────────────────────────── */}
        <section aria-labelledby="season-select-heading" className="mb-8">
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4">
            <h2 id="season-select-heading" className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
              Select Seasons to Compare
            </h2>
            <div className="flex flex-wrap gap-3">
              {ALL_SEASONS.map((year) => {
                const active = selectedSeasons.has(year);
                return (
                  <button
                    key={year}
                    type="button"
                    onClick={() => toggleSeason(year)}
                    aria-pressed={active}
                    aria-label={`${active ? 'Deselect' : 'Select'} ${year} season`}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-bold transition-colors duration-150',
                      active
                        ? 'bg-[#ffd700]/15 border-[#ffd700]/60 text-[#ffd700]'
                        : 'bg-[#0f2744] border-[#2d4a66] text-slate-500 hover:border-[#ffd700]/30 hover:text-slate-300'
                    )}
                  >
                    <span
                      className={cn(
                        'w-4 h-4 rounded border flex items-center justify-center transition-colors',
                        active ? 'border-[#ffd700] bg-[#ffd700]/20' : 'border-slate-600 bg-transparent'
                      )}
                      aria-hidden="true"
                    >
                      {active && <span className="w-2 h-2 rounded-sm bg-[#ffd700] block" />}
                    </span>
                    {year}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-slate-600">
              {activeSeasonsArr.length} of {ALL_SEASONS.length} seasons selected &mdash; records update live.
            </p>
          </div>
        </section>

        {/* ── Combined Standings Table ──────────────────────────────────────── */}
        <section aria-labelledby="standings-heading" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <h2 id="standings-heading" className="text-2xl font-black text-white">
              Combined Standings
            </h2>
          </div>

          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <div className="overflow-x-auto">
              <table
                className="min-w-full text-xs"
                aria-label="Multi-season BMFFFL standings"
              >
                <thead>
                  <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                    <th scope="col" className="px-4 py-3 text-left text-slate-400 font-semibold uppercase tracking-wider sticky left-0 bg-[#0f2744] z-10">
                      <button
                        type="button"
                        onClick={() => handleSort('manager')}
                        className="inline-flex items-center gap-1 hover:text-white transition-colors"
                      >
                        Manager <SortIcon col="manager" />
                      </button>
                    </th>
                    {activeSeasonsArr.map((y) => (
                      <th
                        key={y}
                        scope="col"
                        className="px-3 py-3 text-center text-slate-400 font-semibold uppercase tracking-wider whitespace-nowrap"
                      >
                        {y}
                      </th>
                    ))}
                    <th scope="col" className="px-4 py-3 text-center text-slate-400 font-semibold uppercase tracking-wider whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleSort('totalWins')}
                        className="inline-flex items-center gap-1 hover:text-white transition-colors"
                      >
                        Total W-L <SortIcon col="totalWins" />
                      </button>
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-slate-400 font-semibold uppercase tracking-wider whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleSort('careerWinPct')}
                        className="inline-flex items-center gap-1 hover:text-white transition-colors"
                      >
                        Win% <SortIcon col="careerWinPct" />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3347]">
                  {displayRows.map((row, idx) => (
                    <tr
                      key={row.manager}
                      className={cn(
                        'transition-colors duration-100 hover:bg-[#1f3550]',
                        idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                      )}
                    >
                      {/* Manager */}
                      <td className={cn(
                        'px-4 py-3 sticky left-0 z-10',
                        idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                      )}>
                        <span className="font-bold text-white capitalize">{row.manager}</span>
                      </td>

                      {/* Per-season records */}
                      {activeSeasonsArr.map((y) => {
                        const s = row.seasons[y];
                        if (!s) {
                          return (
                            <td key={y} className="px-3 py-3 text-center text-slate-700 font-mono">
                              —
                            </td>
                          );
                        }
                        return (
                          <td key={y} className="px-3 py-3 text-center">
                            <div className="inline-flex flex-col items-center gap-0.5">
                              <span className={cn('font-mono tabular-nums', recordColor(s.wins, s.losses))}>
                                {s.wins}-{s.losses}
                              </span>
                              {s.champion && (
                                <span title="Champion" aria-label="Champion" className="text-base leading-none">
                                  🏆
                                </span>
                              )}
                              {s.runnerUp && (
                                <span
                                  className="text-[9px] font-black uppercase px-1 py-0.5 rounded bg-slate-500/20 border border-slate-500/30 text-slate-400 leading-none"
                                  aria-label="Runner-up"
                                >
                                  RU
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      })}

                      {/* Total W-L */}
                      <td className="px-4 py-3 text-center">
                        <span className={cn('font-mono tabular-nums', recordColor(row.filteredWins, row.filteredLosses))}>
                          {row.filteredWins}-{row.filteredLosses}
                        </span>
                      </td>

                      {/* Win% */}
                      <td className="px-4 py-3 text-center">
                        <span className={cn('font-mono tabular-nums', recordColor(row.filteredWins, row.filteredLosses))}>
                          {row.filteredPct.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-2 text-[11px] text-slate-600">
            🏆 = league champion that season. &ldquo;RU&rdquo; = runner-up. Records reflect regular season only.
            Click column headers to sort. Dashes indicate seasons not yet played (tubes94 joined in 2021).
          </p>
        </section>

        {/* ── Win% Trend Chart ──────────────────────────────────────────────── */}
        <section aria-labelledby="trend-heading" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <h2 id="trend-heading" className="text-2xl font-black text-white">
              Win% Trend Chart
            </h2>
            <span className="text-xs text-slate-500 font-medium">5 most interesting trajectories</span>
          </div>

          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5">
            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-6">
              {TREND_MANAGERS.map((tm) => (
                <div key={tm.manager} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: tm.color }}
                    aria-hidden="true"
                  />
                  <span className="text-xs text-slate-300 font-semibold capitalize">{tm.manager}</span>
                </div>
              ))}
            </div>

            {/* Chart rows */}
            <div className="space-y-5">
              {TREND_MANAGERS.map((tm) => (
                <div key={tm.manager}>
                  <div className="flex items-center gap-3 mb-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: tm.color }}
                      aria-hidden="true"
                    />
                    <span className="text-xs font-bold text-white capitalize w-32 shrink-0">{tm.manager}</span>
                    <span className="text-[10px] text-slate-500 italic truncate">{tm.note}</span>
                  </div>
                  <div className="grid grid-cols-6 gap-1.5">
                    {ALL_SEASONS.map((y) => {
                      const pct = tm.winPcts[y];
                      return (
                        <div key={y} className="flex flex-col gap-1">
                          <WinPctBar pct={pct ?? 0} color={pct !== undefined ? tm.color : '#1e3347'} />
                          <span className="text-[9px] text-slate-600 text-center">{y}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Season Comparison Summary ─────────────────────────────────────── */}
        <section aria-labelledby="summary-heading" className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <Star className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <h2 id="summary-heading" className="text-2xl font-black text-white">
              Season Comparison Summary
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SUMMARY_CARDS.map((card) => (
              <div
                key={card.label}
                className="rounded-xl border bg-[#16213e] p-5"
                style={{ borderColor: `${card.color}30` }}
              >
                <p className="text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: `${card.color}99` }}>
                  {card.label}
                </p>
                <p className="text-xl font-black mb-1 capitalize" style={{ color: card.color }}>
                  {card.value}
                </p>
                <p className="text-xs text-slate-400 leading-snug">{card.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Head-to-Head Era ──────────────────────────────────────────────── */}
        <section aria-labelledby="era-heading" className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <Trophy className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <h2 id="era-heading" className="text-2xl font-black text-white">
              Era Dominance
            </h2>
            <span className="text-xs text-slate-500 font-medium">2-year eras — who ruled each period</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ERA_DATA.map((era) => (
              <div
                key={era.era + era.dominant}
                className="rounded-xl border bg-[#16213e] p-5"
                style={{ borderColor: `${era.color}30` }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-500 mb-0.5">
                      {era.era}
                    </p>
                    <p className="text-base font-black text-white">{era.years}</p>
                  </div>
                  <div
                    className="text-right shrink-0"
                    style={{ color: era.color }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider opacity-70">Top Manager</p>
                    <p className="text-lg font-black capitalize">{era.dominant}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-black border"
                    style={{ borderColor: `${era.color}50`, color: era.color, backgroundColor: `${era.color}10` }}
                  >
                    {era.record}
                  </span>
                  <span className="text-xs text-slate-500">combined record</span>
                </div>
                <p className="text-xs text-slate-400 leading-snug">{era.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer note */}
        <p className="text-xs text-center text-slate-600">
          Multi-season records are estimated from BMFFFL historical data.
          2020–2025 regular seasons (14 games/season for most managers).
          tubes94 joined the league in 2021 — 5 seasons displayed.
        </p>

      </div>
    </>
  );
}

// ─── Static Generation ────────────────────────────────────────────────────────

import type { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} };
};
