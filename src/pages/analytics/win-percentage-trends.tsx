import { useState, useMemo } from 'react';
import Head from 'next/head';
import { TrendingUp, Trophy, Info } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SeasonRecord {
  wins: number;
  losses: number;
  champion?: boolean;
  runnerUp?: boolean;
  missedPlayoffs?: boolean;
  note?: string;
}

interface OwnerTrend {
  name: string;
  color: string;           // Tailwind text color
  bgColor: string;         // highlight bg for selected
  borderColor: string;     // highlight border for selected
  firstSeason: number;     // year they joined
  narrative: string;
  seasons: Record<number, SeasonRecord | null>;
}

// ─── Season-by-season data ───────────────────────────────────────────────────
// Seasons: 2020, 2021, 2022, 2023, 2024, 2025
// null = owner not yet in the league that season

const OWNER_TRENDS: OwnerTrend[] = [
  {
    name: 'MLSchools12',
    color: 'text-[#ffd700]',
    bgColor: 'bg-[#ffd700]/8',
    borderColor: 'border-[#ffd700]/50',
    firstSeason: 2020,
    narrative: 'Three-time all-time champion (2019, 2021, 2024). Two Sleeper titles. Best record in league history at 13-1 twice.',
    seasons: {
      2020: { wins: 11, losses: 2 },
      2021: { wins: 11, losses: 3, champion: true },
      2022: { wins: 10, losses: 4 },
      2023: { wins: 13, losses: 1 },
      2024: { wins: 10, losses: 4, champion: true },
      2025: { wins: 13, losses: 1 },
    },
  },
  {
    name: 'SexMachineAndyD',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/8',
    borderColor: 'border-blue-400/50',
    firstSeason: 2020,
    narrative: '2018 ESPN champion. 11-3 in 2024 (runner-up). Strong contender across both eras.',
    seasons: {
      2020: { wins: 9,  losses: 4 },
      2021: { wins: 10, losses: 4 },
      2022: { wins: 6,  losses: 8, missedPlayoffs: true },
      2023: { wins: 5,  losses: 9, missedPlayoffs: true },
      2024: { wins: 11, losses: 3, runnerUp: true },
      2025: { wins: 9,  losses: 5 },
    },
  },
  {
    name: 'JuicyBussy',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/8',
    borderColor: 'border-emerald-400/50',
    firstSeason: 2020,
    narrative: '2023 Cinderella champion — won from the 4-seed despite 8-6 regular season record.',
    seasons: {
      2020: { wins: 5,  losses: 8, missedPlayoffs: true },
      2021: { wins: 8,  losses: 6 },
      2022: { wins: 10, losses: 4 },
      2023: { wins: 8,  losses: 6, champion: true },
      2024: { wins: 8,  losses: 6 },
      2025: { wins: 7,  losses: 7 },
    },
  },
  {
    name: 'Grandes',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/8',
    borderColor: 'border-purple-400/50',
    firstSeason: 2020,
    narrative: '2022 Grandes champion. 10-4 in 2021 showed early promise; sharp decline by 2025.',
    seasons: {
      2020: { wins: 4,  losses: 9, missedPlayoffs: true },
      2021: { wins: 10, losses: 4 },
      2022: { wins: 8,  losses: 6, champion: true },
      2023: { wins: 9,  losses: 5 },
      2024: { wins: 7,  losses: 7 },
      2025: { wins: 4,  losses: 10, missedPlayoffs: true },
    },
  },
  {
    name: 'rbr',
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/8',
    borderColor: 'border-orange-400/50',
    firstSeason: 2020,
    narrative: '2022 runner-up (lost to Grandes in finals). Reached the 2021 semis. Led the league at 10-4 in 2022 but couldn\'t close.',
    seasons: {
      2020: { wins: 6,  losses: 7 },
      2021: { wins: 9,  losses: 5 },
      2022: { wins: 10, losses: 4, runnerUp: true },
      2023: { wins: 6,  losses: 8, missedPlayoffs: true },
      2024: { wins: 8,  losses: 6 },
      2025: { wins: 5,  losses: 9, missedPlayoffs: true },
    },
  },
  {
    name: 'eldridsm',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-400/8',
    borderColor: 'border-cyan-400/50',
    firstSeason: 2020,
    narrative: 'Runner-up in inaugural 2020 season. 9-5 in 2023 showed a resurgence before fading in 2024-25.',
    seasons: {
      2020: { wins: 8,  losses: 5, runnerUp: true },
      2021: { wins: 7,  losses: 7 },
      2022: { wins: 8,  losses: 6 },
      2023: { wins: 9,  losses: 5 },
      2024: { wins: 4,  losses: 10, missedPlayoffs: true },
      2025: { wins: 5,  losses: 9, missedPlayoffs: true },
    },
  },
  {
    name: 'Tubes94',
    color: 'text-rose-400',
    bgColor: 'bg-rose-400/8',
    borderColor: 'border-rose-400/50',
    firstSeason: 2021,
    narrative: 'Joined 2021 with a tough 2-12 debut. Built to 11-3 in 2024 and reached the 2025 championship game.',
    seasons: {
      2020: null,
      2021: { wins: 2,  losses: 12, missedPlayoffs: true },
      2022: { wins: 4,  losses: 10, missedPlayoffs: true },
      2023: { wins: 7,  losses: 7 },
      2024: { wins: 11, losses: 3 },
      2025: { wins: 10, losses: 4, runnerUp: true },
    },
  },
  {
    name: 'eldridm20',
    color: 'text-lime-400',
    bgColor: 'bg-lime-400/8',
    borderColor: 'border-lime-400/50',
    firstSeason: 2020,
    narrative: '2023 runner-up. Josh Allen and Ja\'Marr Chase anchor a playoff-caliber core.',
    seasons: {
      2020: { wins: 4,  losses: 9, missedPlayoffs: true },
      2021: { wins: 8,  losses: 6 },
      2022: { wins: 7,  losses: 7 },
      2023: { wins: 8,  losses: 6, runnerUp: true },
      2024: { wins: 6,  losses: 8, missedPlayoffs: true },
      2025: { wins: 6,  losses: 8, missedPlayoffs: true },
    },
  },
  {
    name: 'Cogdeill11',
    color: 'text-[#e94560]',
    bgColor: 'bg-[#e94560]/8',
    borderColor: 'border-[#e94560]/50',
    firstSeason: 2020,
    narrative: 'Three-time champion (2016 & 2017 ESPN, 2020 Sleeper). Dramatic decline — 9-5 champion to consistent rebuilder.',
    seasons: {
      2020: { wins: 10, losses: 3, champion: true },
      2021: { wins: 9,  losses: 5, missedPlayoffs: true, note: 'Missed playoffs despite 9 wins — deep field' },
      2022: { wins: 7,  losses: 7 },
      2023: { wins: 3,  losses: 11, missedPlayoffs: true },
      2024: { wins: 4,  losses: 10, missedPlayoffs: true },
      2025: { wins: 5,  losses: 9, missedPlayoffs: true },
    },
  },
  {
    name: 'tdtd19844',
    color: 'text-amber-400',
    bgColor: 'bg-amber-400/8',
    borderColor: 'border-amber-400/50',
    firstSeason: 2020,
    narrative: '2025 champion. Worst record in 2022 (3-11), rebuilt through the draft, peaked at the right time.',
    seasons: {
      2020: { wins: 6,  losses: 7 },
      2021: { wins: 6,  losses: 8, missedPlayoffs: true },
      2022: { wins: 3,  losses: 11, missedPlayoffs: true, note: 'League-worst record' },
      2023: { wins: 5,  losses: 9, missedPlayoffs: true },
      2024: { wins: 8,  losses: 6 },
      2025: { wins: 8,  losses: 6, champion: true },
    },
  },
  {
    name: 'Cmaleski',
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-400/8',
    borderColor: 'border-indigo-400/50',
    firstSeason: 2020,
    narrative: 'Tyler Warren and Drake London as the core. 9-5 in 2023 proved they can contend.',
    seasons: {
      2020: { wins: 5,  losses: 8, missedPlayoffs: true },
      2021: { wins: 6,  losses: 8, missedPlayoffs: true },
      2022: { wins: 7,  losses: 7 },
      2023: { wins: 9,  losses: 5 },
      2024: { wins: 9,  losses: 5 },
      2025: { wins: 6,  losses: 8 },
    },
  },
  {
    name: 'Escuelas',
    color: 'text-slate-400',
    bgColor: 'bg-slate-400/8',
    borderColor: 'border-slate-400/50',
    firstSeason: 2022,
    narrative: 'Joined 2022. Struggled early but showed improvement heading into 2025.',
    seasons: {
      2020: null,
      2021: null,
      2022: { wins: 4,  losses: 10, missedPlayoffs: true },
      2023: { wins: 2,  losses: 12, missedPlayoffs: true, note: 'Worst single-season record in BMFFFL history' },
      2024: { wins: 3,  losses: 11, missedPlayoffs: true },
      2025: { wins: 6,  losses: 8 },
    },
  },
];

const ALL_SEASONS = [2020, 2021, 2022, 2023, 2024, 2025] as const;
type Season = typeof ALL_SEASONS[number];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function winPct(rec: SeasonRecord): number {
  const total = rec.wins + rec.losses;
  return total === 0 ? 0 : rec.wins / total;
}

function pctLabel(rec: SeasonRecord): string {
  return winPct(rec).toFixed(3).replace(/^0/, '');
}

function cellBg(rec: SeasonRecord): string {
  if (rec.champion) return 'bg-[#ffd700]/20 text-[#ffd700]';
  if (rec.runnerUp) return 'bg-slate-400/15 text-slate-300';
  const pct = winPct(rec);
  if (pct >= 0.700) return 'bg-emerald-500/25 text-emerald-300';
  if (pct >= 0.500) return 'bg-emerald-500/12 text-emerald-400';
  if (pct >= 0.350) return 'bg-[#e94560]/12 text-red-400';
  return 'bg-[#e94560]/25 text-[#e94560]';
}

// ─── Sparkline-style Win % trend ──────────────────────────────────────────────

function TrendBars({ owner }: { owner: OwnerTrend }) {
  const validSeasons = ALL_SEASONS.filter(s => owner.seasons[s] !== null);
  const maxPct = 1.0;

  return (
    <div className="flex items-end gap-0.5 h-8" aria-label={`${owner.name} win % trend`}>
      {ALL_SEASONS.map(season => {
        const rec = owner.seasons[season];
        if (!rec) {
          return (
            <div key={season} className="w-4 flex-1 bg-transparent" title={`${season}: N/A`} />
          );
        }
        const pct = winPct(rec);
        const heightPct = Math.round((pct / maxPct) * 100);
        const isChamp = rec.champion;
        const isRunnerUp = rec.runnerUp;
        const barColor = isChamp
          ? 'bg-[#ffd700]'
          : isRunnerUp
          ? 'bg-slate-400'
          : pct >= 0.5
          ? 'bg-emerald-500'
          : 'bg-[#e94560]';

        return (
          <div
            key={season}
            className="flex-1 flex items-end"
            title={`${season}: ${rec.wins}-${rec.losses} (${pctLabel(rec)})${isChamp ? ' 🏆' : ''}`}
          >
            <div
              className={cn('w-full rounded-sm transition-all', barColor)}
              style={{ height: `${Math.max(heightPct, 6)}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}

// ─── Legend ───────────────────────────────────────────────────────────────────

function Legend() {
  const items = [
    { label: 'Champion', cls: 'bg-[#ffd700]/20 border border-[#ffd700]/40' },
    { label: 'Runner-Up', cls: 'bg-slate-400/15 border border-slate-400/30' },
    { label: '≥ .700', cls: 'bg-emerald-500/25 border border-emerald-500/30' },
    { label: '.500 – .699', cls: 'bg-emerald-500/12 border border-emerald-500/20' },
    { label: '.350 – .499', cls: 'bg-[#e94560]/12 border border-[#e94560]/20' },
    { label: '< .350', cls: 'bg-[#e94560]/25 border border-[#e94560]/30' },
    { label: 'Not in league', cls: 'bg-[#2d4a66]/30 border border-[#2d4a66]' },
  ];
  return (
    <div className="flex flex-wrap gap-2 items-center" aria-label="Color legend">
      {items.map(item => (
        <div key={item.label} className="flex items-center gap-1.5">
          <div className={cn('w-4 h-4 rounded-sm shrink-0', item.cls)} aria-hidden="true" />
          <span className="text-[11px] text-slate-400">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WinPercentageTrendsPage() {
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'career' | 'improvement' | 'name'>('career');

  const sorted = useMemo(() => {
    const arr = [...OWNER_TRENDS];
    if (sortBy === 'career') {
      return arr.sort((a, b) => {
        const calcPct = (o: OwnerTrend) => {
          let w = 0, l = 0;
          ALL_SEASONS.forEach(s => { const r = o.seasons[s]; if (r) { w += r.wins; l += r.losses; } });
          return w + l > 0 ? w / (w + l) : 0;
        };
        return calcPct(b) - calcPct(a);
      });
    }
    if (sortBy === 'improvement') {
      // Sort by change from first 2 seasons avg to last 2 seasons avg
      return arr.sort((a, b) => {
        const delta = (o: OwnerTrend) => {
          const early = ALL_SEASONS.filter(s => o.seasons[s]).slice(0, 2).map(s => winPct(o.seasons[s]!));
          const late = ALL_SEASONS.filter(s => o.seasons[s]).slice(-2).map(s => winPct(o.seasons[s]!));
          const avgEarly = early.length ? early.reduce((a, b) => a + b, 0) / early.length : 0;
          const avgLate  = late.length  ? late.reduce((a, b) => a + b, 0)  / late.length  : 0;
          return avgLate - avgEarly;
        };
        return delta(b) - delta(a);
      });
    }
    return arr.sort((a, b) => a.name.localeCompare(b.name));
  }, [sortBy]);

  const careerTotals = useMemo(() => {
    const map: Record<string, { wins: number; losses: number }> = {};
    OWNER_TRENDS.forEach(o => {
      let w = 0, l = 0;
      ALL_SEASONS.forEach(s => { const r = o.seasons[s]; if (r) { w += r.wins; l += r.losses; } });
      map[o.name] = { wins: w, losses: l };
    });
    return map;
  }, []);

  return (
    <>
      <Head>
        <title>Win % Trends — BMFFFL Analytics</title>
        <meta
          name="description"
          content="Season-by-season win percentage trends for all BMFFFL dynasty owners. Track rise arcs, decline arcs, and championship seasons."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Header */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            Win % Trends
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Season-by-season win percentage for every BMFFFL owner &mdash; track rise arcs, decline arcs, and championship peaks.
          </p>
        </header>

        {/* Controls */}
        <section className="mb-6 flex flex-col sm:flex-row gap-4 sm:items-end sm:justify-between" aria-label="Controls">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Sort by</p>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Sort options">
              {(['career', 'improvement', 'name'] as const).map(opt => (
                <button
                  key={opt}
                  onClick={() => setSortBy(opt)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150',
                    sortBy === opt
                      ? 'bg-[#ffd700] text-[#0d1b2a] border-[#ffd700]'
                      : 'bg-[#16213e] text-slate-400 border-[#2d4a66] hover:border-[#ffd700]/40 hover:text-white'
                  )}
                  aria-pressed={sortBy === opt}
                >
                  {opt === 'career' ? 'Career Win %' : opt === 'improvement' ? 'Most Improved' : 'Alphabetical'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Highlight owner</p>
            <select
              value={highlighted ?? ''}
              onChange={e => setHighlighted(e.target.value || null)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#2d4a66] bg-[#16213e] text-slate-300 focus:outline-none focus:border-[#ffd700]/40 focus:ring-1 focus:ring-[#ffd700]/30"
              aria-label="Highlight owner"
            >
              <option value="">All owners</option>
              {OWNER_TRENDS.map(o => (
                <option key={o.name} value={o.name}>{o.name}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Legend */}
        <div className="mb-5 rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-3">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Cell color guide</p>
          <Legend />
        </div>

        {/* Main trends table */}
        <section aria-label="Win percentage trends by season">
          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm" aria-label="Win percentage by season">
                <thead>
                  <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-36 sticky left-0 bg-[#0f2744] z-10">
                      Owner
                    </th>
                    {ALL_SEASONS.map(s => (
                      <th key={s} scope="col" className="px-3 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider w-20">
                        {s}
                      </th>
                    ))}
                    <th scope="col" className="px-3 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider w-20">
                      Career
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-24 hidden sm:table-cell">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3347]">
                  {sorted.map((owner, idx) => {
                    const isHighlighted = highlighted === owner.name;
                    const isDimmed = highlighted !== null && !isHighlighted;
                    const ct = careerTotals[owner.name];
                    const careerPct = ct.wins + ct.losses > 0 ? ct.wins / (ct.wins + ct.losses) : 0;
                    const isEven = idx % 2 === 0;

                    return (
                      <tr
                        key={owner.name}
                        className={cn(
                          'transition-all duration-150 cursor-pointer',
                          isDimmed ? 'opacity-30' : '',
                          isHighlighted ? `${owner.bgColor} ring-1 ring-inset ${owner.borderColor}` :
                            isEven ? 'bg-[#1a2d42] hover:bg-[#1f3550]' : 'bg-[#162638] hover:bg-[#1f3550]'
                        )}
                        onClick={() => setHighlighted(highlighted === owner.name ? null : owner.name)}
                        role="button"
                        aria-label={`Toggle highlight for ${owner.name}`}
                        tabIndex={0}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setHighlighted(highlighted === owner.name ? null : owner.name); }}
                      >
                        {/* Owner name */}
                        <td className={cn(
                          'px-4 py-3 sticky left-0 z-10',
                          isHighlighted ? owner.bgColor : isEven ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                        )}>
                          <div className="flex items-center gap-2">
                            <span className={cn('text-sm font-bold leading-tight', owner.color)}>{owner.name}</span>
                          </div>
                          {owner.firstSeason > 2020 && (
                            <span className="text-[10px] text-slate-600 font-medium">Joined {owner.firstSeason}</span>
                          )}
                        </td>

                        {/* Season cells */}
                        {ALL_SEASONS.map(season => {
                          const rec = owner.seasons[season];
                          if (!rec) {
                            return (
                              <td key={season} className="px-3 py-3 text-center">
                                <span className="inline-block px-2 py-1 rounded text-[10px] bg-[#2d4a66]/30 text-slate-600 font-medium w-16">
                                  —
                                </span>
                              </td>
                            );
                          }
                          return (
                            <td key={season} className="px-3 py-3 text-center">
                              <div className="flex flex-col items-center gap-0.5">
                                <span
                                  className={cn(
                                    'inline-flex items-center justify-center px-2 py-1 rounded text-[10px] font-bold w-16 leading-none',
                                    cellBg(rec)
                                  )}
                                  title={rec.note}
                                >
                                  {rec.wins}-{rec.losses}
                                  {rec.champion && ' 🏆'}
                                  {rec.runnerUp && ' 🥈'}
                                </span>
                                <span className="text-[10px] text-slate-600 font-mono tabular-nums">
                                  {pctLabel(rec)}
                                </span>
                              </div>
                            </td>
                          );
                        })}

                        {/* Career totals */}
                        <td className="px-3 py-3 text-center">
                          <div className="flex flex-col items-center gap-0.5">
                            <span className={cn(
                              'text-xs font-bold tabular-nums',
                              careerPct >= 0.6 ? 'text-[#ffd700]' :
                              careerPct >= 0.5 ? 'text-emerald-400' :
                              'text-[#e94560]'
                            )}>
                              {ct.wins}-{ct.losses}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono tabular-nums">
                              {careerPct.toFixed(3).replace(/^0/, '')}
                            </span>
                          </div>
                        </td>

                        {/* Sparkline trend bars */}
                        <td className="px-3 py-3 hidden sm:table-cell w-24">
                          <TrendBars owner={owner} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Narrative cards for highlighted owner */}
        {highlighted && (() => {
          const owner = OWNER_TRENDS.find(o => o.name === highlighted);
          if (!owner) return null;
          const ct = careerTotals[highlighted];
          const careerPct = ct.wins + ct.losses > 0 ? ct.wins / (ct.wins + ct.losses) : 0;
          return (
            <section
              className={cn('mt-6 rounded-xl border p-5', owner.borderColor, owner.bgColor)}
              aria-label={`${highlighted} details`}
            >
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h2 className={cn('text-base font-bold mb-1', owner.color)}>{owner.name}</h2>
                  <p className="text-sm text-slate-300 leading-relaxed">{owner.narrative}</p>
                  <p className="text-xs text-slate-500 mt-2 font-mono">
                    Career: {ct.wins}-{ct.losses} &bull; {careerPct.toFixed(3).replace(/^0/, '')} win pct &bull; Active since {owner.firstSeason}
                  </p>
                </div>
              </div>
            </section>
          );
        })()}

        {/* Story arcs section */}
        <section className="mt-10" aria-labelledby="story-arcs-heading">
          <h2 id="story-arcs-heading" className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            Notable Trend Stories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'The Dynasty',
                owner: 'MLSchools12',
                color: 'text-[#ffd700]',
                border: 'border-[#ffd700]/30',
                bg: 'bg-[#ffd700]/5',
                summary: 'Never had a losing season. 3x all-time champion (2019, 2021, 2024). Two 13-1 regular seasons (2023, 2025) — neither converted to a ring.',
              },
              {
                title: 'The Rise',
                owner: 'tdtd19844',
                color: 'text-amber-400',
                border: 'border-amber-400/30',
                bg: 'bg-amber-400/5',
                summary: 'From a 3-11 basement season in 2022 to 2025 champion. Most dramatic improvement arc in league history.',
              },
              {
                title: 'The Fall',
                owner: 'Cogdeill11',
                color: 'text-[#e94560]',
                border: 'border-[#e94560]/30',
                bg: 'bg-[#e94560]/5',
                summary: 'Won in 2020, then missed playoffs 5 straight years. From champion to league\'s longest drought.',
              },
              {
                title: 'The Contender',
                owner: 'SexMachineAndyD',
                color: 'text-blue-400',
                border: 'border-blue-400/30',
                bg: 'bg-blue-400/5',
                summary: 'Above .500 every season. Consistent playoff threat but the championship has proven elusive.',
              },
              {
                title: 'The Cinderella',
                owner: 'JuicyBussy',
                color: 'text-emerald-400',
                border: 'border-emerald-400/30',
                bg: 'bg-emerald-400/5',
                summary: 'Won the 2023 championship as the #6 seed. Steady winning record without elite regular season peaks.',
              },
              {
                title: 'The Emerging',
                owner: 'Tubes94',
                color: 'text-rose-400',
                border: 'border-rose-400/30',
                bg: 'bg-rose-400/5',
                summary: 'Missed playoffs three straight years before erupting with an 11-3 season in 2024. Dynasty Rank #2 entering 2026.',
              },
            ].map(story => (
              <div
                key={story.title}
                className={cn('rounded-xl border p-4', story.border, story.bg)}
              >
                <p className={cn('text-xs font-bold uppercase tracking-widest mb-1', story.color)}>{story.title}</p>
                <p className="text-sm font-semibold text-white mb-2">{story.owner}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{story.summary}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="mt-8 rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="text-slate-400 font-semibold">Data note:</span> Season-by-season records are approximations derived from verified career totals and league narrative.
            Exact week-by-week records require full Sleeper API integration (Phase G).
            Click any row in the table to highlight that owner&apos;s trend.
          </p>
        </div>

      </div>
    </>
  );
}
