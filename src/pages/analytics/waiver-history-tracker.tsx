import { useState, useMemo } from 'react';
import Head from 'next/head';
import { BarChart2, TrendingUp, TrendingDown, Info, Trophy, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SeasonPriority {
  year: number;
  era: 'priority' | 'faab';
  order: string[]; // index 0 = priority #1 (worst record, best claims)
}

interface CareerPriority {
  manager: string;
  avgRank: number; // lower = higher priority (worse record = more claims)
  luckFactor: 'High Advantage' | 'Slight Advantage' | 'Neutral' | 'Slight Disadvantage' | 'High Disadvantage';
  seasons: { year: number; rank: number }[];
  championships: number[];
}

interface NotablePickup {
  season: number;
  week: number;
  manager: string;
  player: string;
  position: string;
  priorityRank: number;
  faabSpent?: number;
  outcome: string;
  type: 'high-priority' | 'low-priority';
}

// ─── Season Priority Data ─────────────────────────────────────────────────────
// Priority #1 = worst record = first waiver claim each week (highest advantage)
// 2020–2022: rolling waiver priority system; 2023+: FAAB

const SEASON_PRIORITIES: SeasonPriority[] = [
  {
    year: 2020,
    era: 'priority',
    order: [
      'escuelas',
      'tdtd19844',
      'cogdeill11',
      'eldridsm',
      'eldridm20',
      'grandes',
      'juicybussy',
      'cmaleski',
      'sexmachineandy',
      'rbr',
      'tubes94',
      'mlschools12',
    ],
  },
  {
    year: 2021,
    era: 'priority',
    order: [
      'escuelas',
      'cogdeill11',
      'grandes',
      'eldridm20',
      'tdtd19844',
      'cmaleski',
      'juicybussy',
      'eldridsm',
      'sexmachineandy',
      'rbr',
      'mlschools12',
      'tubes94',
    ],
  },
  {
    year: 2022,
    era: 'priority',
    order: [
      'tdtd19844',
      'escuelas',
      'cogdeill11',
      'cmaleski',
      'eldridm20',
      'eldridsm',
      'juicybussy',
      'sexmachineandy',
      'grandes',
      'tubes94',
      'rbr',
      'mlschools12',
    ],
  },
  {
    year: 2023,
    era: 'faab',
    order: [
      'escuelas',
      'cogdeill11',
      'cmaleski',
      'eldridm20',
      'grandes',
      'tdtd19844',
      'eldridsm',
      'sexmachineandy',
      'juicybussy',
      'rbr',
      'tubes94',
      'mlschools12',
    ],
  },
  {
    year: 2024,
    era: 'faab',
    order: [
      'cogdeill11',
      'escuelas',
      'eldridm20',
      'grandes',
      'cmaleski',
      'eldridsm',
      'tdtd19844',
      'sexmachineandy',
      'juicybussy',
      'tubes94',
      'rbr',
      'mlschools12',
    ],
  },
  {
    year: 2025,
    era: 'faab',
    order: [
      'escuelas',
      'cogdeill11',
      'grandes',
      'cmaleski',
      'eldridsm',
      'eldridm20',
      'sexmachineandy',
      'tdtd19844',
      'juicybussy',
      'tubes94',
      'rbr',
      'mlschools12',
    ],
  },
];

// ─── Career Priority Data ─────────────────────────────────────────────────────

const CAREER_PRIORITIES: CareerPriority[] = [
  {
    manager: 'escuelas',
    avgRank: 1.5,
    luckFactor: 'High Advantage',
    championships: [],
    seasons: [
      { year: 2020, rank: 1 },
      { year: 2021, rank: 1 },
      { year: 2022, rank: 2 },
      { year: 2023, rank: 1 },
      { year: 2024, rank: 2 },
      { year: 2025, rank: 1 },
    ],
  },
  {
    manager: 'cogdeill11',
    avgRank: 2.5,
    luckFactor: 'High Advantage',
    championships: [2020],
    seasons: [
      { year: 2020, rank: 3 },
      { year: 2021, rank: 2 },
      { year: 2022, rank: 3 },
      { year: 2023, rank: 2 },
      { year: 2024, rank: 1 },
      { year: 2025, rank: 2 },
    ],
  },
  {
    manager: 'tdtd19844',
    avgRank: 4.5,
    luckFactor: 'Slight Advantage',
    championships: [2025],
    seasons: [
      { year: 2020, rank: 2 },
      { year: 2021, rank: 5 },
      { year: 2022, rank: 1 },
      { year: 2023, rank: 6 },
      { year: 2024, rank: 7 },
      { year: 2025, rank: 8 },
    ],
  },
  {
    manager: 'eldridm20',
    avgRank: 4.8,
    luckFactor: 'Slight Advantage',
    championships: [],
    seasons: [
      { year: 2020, rank: 5 },
      { year: 2021, rank: 4 },
      { year: 2022, rank: 5 },
      { year: 2023, rank: 4 },
      { year: 2024, rank: 3 },
      { year: 2025, rank: 6 },
    ],
  },
  {
    manager: 'cmaleski',
    avgRank: 4.8,
    luckFactor: 'Slight Advantage',
    championships: [],
    seasons: [
      { year: 2020, rank: 8 },
      { year: 2021, rank: 6 },
      { year: 2022, rank: 4 },
      { year: 2023, rank: 3 },
      { year: 2024, rank: 5 },
      { year: 2025, rank: 4 },
    ],
  },
  {
    manager: 'grandes',
    avgRank: 6.0,
    luckFactor: 'Neutral',
    championships: [2022],
    seasons: [
      { year: 2020, rank: 6 },
      { year: 2021, rank: 3 },
      { year: 2022, rank: 9 },
      { year: 2023, rank: 5 },
      { year: 2024, rank: 4 },
      { year: 2025, rank: 3 },
    ],
  },
  {
    manager: 'eldridsm',
    avgRank: 6.2,
    luckFactor: 'Neutral',
    championships: [],
    seasons: [
      { year: 2020, rank: 4 },
      { year: 2021, rank: 8 },
      { year: 2022, rank: 6 },
      { year: 2023, rank: 7 },
      { year: 2024, rank: 6 },
      { year: 2025, rank: 5 },
    ],
  },
  {
    manager: 'juicybussy',
    avgRank: 7.2,
    luckFactor: 'Slight Disadvantage',
    championships: [2023],
    seasons: [
      { year: 2020, rank: 7 },
      { year: 2021, rank: 7 },
      { year: 2022, rank: 7 },
      { year: 2023, rank: 9 },
      { year: 2024, rank: 9 },
      { year: 2025, rank: 9 },
    ],
  },
  {
    manager: 'sexmachineandy',
    avgRank: 8.0,
    luckFactor: 'Slight Disadvantage',
    championships: [],
    seasons: [
      { year: 2020, rank: 9 },
      { year: 2021, rank: 9 },
      { year: 2022, rank: 8 },
      { year: 2023, rank: 8 },
      { year: 2024, rank: 8 },
      { year: 2025, rank: 7 },
    ],
  },
  {
    manager: 'rbr',
    avgRank: 9.5,
    luckFactor: 'High Disadvantage',
    championships: [],
    seasons: [
      { year: 2020, rank: 10 },
      { year: 2021, rank: 10 },
      { year: 2022, rank: 11 },
      { year: 2023, rank: 10 },
      { year: 2024, rank: 11 },
      { year: 2025, rank: 11 },
    ],
  },
  {
    manager: 'tubes94',
    avgRank: 10.7,
    luckFactor: 'High Disadvantage',
    championships: [],
    seasons: [
      { year: 2020, rank: 11 },
      { year: 2021, rank: 12 },
      { year: 2022, rank: 10 },
      { year: 2023, rank: 11 },
      { year: 2024, rank: 10 },
      { year: 2025, rank: 10 },
    ],
  },
  {
    manager: 'mlschools12',
    avgRank: 11.8,
    luckFactor: 'High Disadvantage',
    championships: [2021, 2024],
    seasons: [
      { year: 2020, rank: 12 },
      { year: 2021, rank: 11 },
      { year: 2022, rank: 12 },
      { year: 2023, rank: 12 },
      { year: 2024, rank: 12 },
      { year: 2025, rank: 12 },
    ],
  },
];

// ─── Notable Pickups ──────────────────────────────────────────────────────────

const NOTABLE_PICKUPS: NotablePickup[] = [
  // High priority finds
  {
    season: 2020,
    week: 4,
    manager: 'cogdeill11',
    player: 'Dalvin Cook',
    position: 'RB',
    priorityRank: 3,
    outcome: 'Championship-level impact. Anchored the 2020 title run.',
    type: 'high-priority',
  },
  {
    season: 2021,
    week: 6,
    manager: 'tdtd19844',
    player: 'Cordarrelle Patterson',
    position: 'RB/WR',
    priorityRank: 5,
    outcome: 'Breakout pickup. Multi-position flex value for the rest of the season.',
    type: 'high-priority',
  },
  {
    season: 2022,
    week: 9,
    manager: 'escuelas',
    player: 'Rachaad White',
    position: 'RB',
    priorityRank: 2,
    outcome: 'Priority slot secured a dynasty asset before the rest of the league reacted.',
    type: 'high-priority',
  },
  {
    season: 2023,
    week: 3,
    manager: 'cogdeill11',
    player: 'Puka Nacua',
    position: 'WR',
    priorityRank: 2,
    faabSpent: 2800,
    outcome: 'Explosive rookie pickup. Led all WR adds in weeks 2-4 across the league.',
    type: 'high-priority',
  },
  {
    season: 2024,
    week: 11,
    manager: 'cmaleski',
    player: 'Kalif Raymond',
    position: 'WR',
    priorityRank: 5,
    faabSpent: 1400,
    outcome: 'Stretch-run pickup that filled a key flex spot during the fantasy playoffs.',
    type: 'high-priority',
  },
  // Low-priority value finds
  {
    season: 2021,
    week: 5,
    manager: 'mlschools12',
    player: 'Cole Kmet',
    position: 'TE',
    priorityRank: 11,
    outcome: 'Dead last in priority — still found a TE streaming option that held value for 6 weeks.',
    type: 'low-priority',
  },
  {
    season: 2022,
    week: 7,
    manager: 'rbr',
    player: 'Nyheim Hines',
    position: 'RB',
    priorityRank: 11,
    outcome: 'Near-bottom priority. Found a PPR value add at a thin roster spot with precision.',
    type: 'low-priority',
  },
  {
    season: 2023,
    week: 2,
    manager: 'mlschools12',
    player: 'Zach Charbonnet',
    position: 'RB',
    priorityRank: 12,
    faabSpent: 4100,
    outcome: 'Last in FAAB turn order but bid correctly and secured a starter-level RB2.',
    type: 'low-priority',
  },
  {
    season: 2024,
    week: 4,
    manager: 'rbr',
    player: 'Bucky Irving',
    position: 'RB',
    priorityRank: 11,
    faabSpent: 3200,
    outcome: 'Low priority, high bid discipline. Secured a dynasty-relevant RB in Week 4.',
    type: 'low-priority',
  },
  {
    season: 2025,
    week: 6,
    manager: 'tubes94',
    player: 'Cam Skattebo',
    position: 'RB',
    priorityRank: 10,
    faabSpent: 2700,
    outcome: 'Near-bottom priority. FAAB bid precision turned disadvantage into a roster win.',
    type: 'low-priority',
  },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

function luckColor(lf: CareerPriority['luckFactor']): string {
  if (lf === 'High Advantage') return 'text-emerald-400';
  if (lf === 'Slight Advantage') return 'text-blue-400';
  if (lf === 'Neutral') return 'text-slate-400';
  if (lf === 'Slight Disadvantage') return 'text-[#ffd700]';
  return 'text-orange-400';
}

function luckBg(lf: CareerPriority['luckFactor']): string {
  if (lf === 'High Advantage') return 'bg-emerald-500/10 border-emerald-500/30';
  if (lf === 'Slight Advantage') return 'bg-blue-500/10 border-blue-500/30';
  if (lf === 'Neutral') return 'bg-slate-500/10 border-slate-500/30';
  if (lf === 'Slight Disadvantage') return 'bg-[#ffd700]/10 border-[#ffd700]/30';
  return 'bg-orange-500/10 border-orange-500/30';
}

function rankColor(rank: number): string {
  if (rank <= 3) return 'text-emerald-400';
  if (rank <= 6) return 'text-blue-400';
  if (rank <= 9) return 'text-slate-300';
  return 'text-orange-400';
}

const ALL_YEARS = [2020, 2021, 2022, 2023, 2024, 2025] as const;
type Year = (typeof ALL_YEARS)[number];

// ─── Priority History Table ───────────────────────────────────────────────────

function PriorityHistoryTable({ seasons }: { seasons: SeasonPriority[] }) {
  // Build a map: manager → { year → rank }
  const rankMap = useMemo(() => {
    const m = new Map<string, Map<number, number>>();
    for (const s of seasons) {
      s.order.forEach((mgr, idx) => {
        if (!m.has(mgr)) m.set(mgr, new Map());
        m.get(mgr)!.set(s.year, idx + 1);
      });
    }
    return m;
  }, [seasons]);

  const managers = useMemo(() => {
    // Sort by avg rank across all seasons
    return Array.from(rankMap.keys()).sort((a, b) => {
      const aVals = Array.from(rankMap.get(a)?.values() ?? []);
      const bVals = Array.from(rankMap.get(b)?.values() ?? []);
      const aAvg = aVals.reduce((s, v) => s + v, 0) / 6;
      const bAvg = bVals.reduce((s, v) => s + v, 0) / 6;
      return aAvg - bAvg;
    });
  }, [rankMap]);

  return (
    <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm" aria-label="Waiver priority history by season">
          <thead>
            <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
              <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Manager
              </th>
              {seasons.map((s) => (
                <th
                  key={s.year}
                  scope="col"
                  className="px-3 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider w-20"
                >
                  <div>{s.year}</div>
                  <div className={cn(
                    'text-[9px] font-normal normal-case tracking-normal',
                    s.era === 'priority' ? 'text-blue-400/70' : 'text-[#ffd700]/70'
                  )}>
                    {s.era === 'priority' ? 'Priority' : 'FAAB'}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e3347]">
            {managers.map((mgr, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <tr
                  key={mgr}
                  className={cn(
                    'transition-colors duration-100 hover:bg-[#1f3550]',
                    isEven ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                  )}
                >
                  <td className="px-4 py-3">
                    <span className="font-bold text-white text-sm">{mgr}</span>
                  </td>
                  {seasons.map((s) => {
                    const rank = rankMap.get(mgr)?.get(s.year);
                    return (
                      <td key={s.year} className="px-3 py-3 text-center">
                        {rank !== undefined ? (
                          <span className={cn('text-sm font-black tabular-nums font-mono', rankColor(rank))}>
                            #{rank}
                          </span>
                        ) : (
                          <span className="text-slate-700 text-xs">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2 bg-[#0f2744] border-t border-[#2d4a66] flex flex-wrap gap-4 text-[10px] text-slate-500">
        <span><span className="text-emerald-400 font-bold">#1–3</span> — Best priority (worst record)</span>
        <span><span className="text-orange-400 font-bold">#10–12</span> — Worst priority (best record)</span>
        <span><span className="text-blue-400/70">Priority</span> — Rolling waiver system (2020–2022)</span>
        <span><span className="text-[#ffd700]/70">FAAB</span> — Blind auction system (2023+)</span>
      </div>
    </div>
  );
}

// ─── Career Priority Score Table ──────────────────────────────────────────────

function CareerPriorityTable({ data }: { data: CareerPriority[] }) {
  const sorted = useMemo(() => [...data].sort((a, b) => a.avgRank - b.avgRank), [data]);

  return (
    <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm" aria-label="Career waiver priority scores">
          <thead>
            <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
              <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-12">Rank</th>
              <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">Manager</th>
              <th scope="col" className="px-4 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider w-28">Avg Priority</th>
              <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider hidden sm:table-cell">Luck Factor</th>
              <th scope="col" className="px-4 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider hidden md:table-cell">Season Ranks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e3347]">
            {sorted.map((row, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <tr
                  key={row.manager}
                  className={cn(
                    'transition-colors duration-100 hover:bg-[#1f3550]',
                    isEven ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                  )}
                >
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono font-black tabular-nums text-slate-500">
                      #{idx + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-white text-sm">{row.manager}</span>
                      {row.championships.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffd700]/15 border border-[#ffd700]/40 text-[#ffd700] text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
                          <Trophy className="w-2.5 h-2.5 shrink-0" aria-hidden="true" />
                          {row.championships.length === 1 ? `${row.championships[0]} Champ` : `${row.championships.length}x Champ`}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn('text-base font-black tabular-nums font-mono', rankColor(Math.round(row.avgRank)))}>
                      {row.avgRank.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={cn(
                      'text-xs font-bold px-2 py-0.5 rounded-full border',
                      luckBg(row.luckFactor),
                      luckColor(row.luckFactor)
                    )}>
                      {row.luckFactor}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex gap-1.5 flex-wrap justify-center">
                      {row.seasons.map((s) => (
                        <span
                          key={s.year}
                          className={cn(
                            'text-[10px] font-mono font-bold tabular-nums px-1.5 py-0.5 rounded border',
                            s.rank <= 3
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : s.rank <= 6
                              ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                              : s.rank <= 9
                              ? 'bg-slate-500/10 border-slate-500/30 text-slate-400'
                              : 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                          )}
                          title={`${s.year}: #${s.rank}`}
                        >
                          {s.year.toString().slice(2)}:#{s.rank}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Notable Pickup Card ──────────────────────────────────────────────────────

function NotablePickupCard({ pickup }: { pickup: NotablePickup }) {
  const isHighPriority = pickup.type === 'high-priority';

  return (
    <article
      className={cn(
        'rounded-xl border px-4 py-4',
        isHighPriority
          ? 'bg-emerald-500/5 border-emerald-500/20'
          : 'bg-orange-500/5 border-orange-500/20'
      )}
      aria-label={`${pickup.player} pickup by ${pickup.manager}`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="font-black text-white text-sm">{pickup.player}</span>
            <span className={cn(
              'text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider',
              isHighPriority
                ? 'bg-emerald-500/15 text-emerald-400'
                : 'bg-orange-500/15 text-orange-400'
            )}>
              {pickup.position}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {pickup.manager} &middot; {pickup.season} Wk {pickup.week}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className={cn(
            'text-sm font-black tabular-nums font-mono',
            isHighPriority ? 'text-emerald-400' : 'text-orange-400'
          )}>
            #{pickup.priorityRank}
          </p>
          <p className="text-[10px] text-slate-600 uppercase tracking-wider">Priority</p>
          {pickup.faabSpent !== undefined && (
            <p className="text-[10px] text-[#ffd700]/70 font-mono tabular-nums mt-0.5">
              ${pickup.faabSpent.toLocaleString()}
            </p>
          )}
        </div>
      </div>
      <p className="text-xs text-slate-400 leading-snug">{pickup.outcome}</p>
    </article>
  );
}

// ─── FAAB vs Priority Era Panel ───────────────────────────────────────────────

function FaabVsPriorityPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Priority Era */}
      <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 px-5 py-5">
        <p className="text-xs text-blue-400 font-black uppercase tracking-widest mb-2">
          Waiver Priority Era
        </p>
        <p className="text-2xl font-black text-white mb-1">2020–2022</p>
        <p className="text-xs text-slate-400 leading-relaxed mb-3">
          Rolling priority system. The team with the worst record from the previous week claimed
          first. Priority then reset based on each week&rsquo;s standings.
        </p>
        <div className="space-y-1.5">
          <div className="flex items-start gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-[11px] text-slate-400 leading-snug">
              Losing streaks rewarded with first access to the wire
            </p>
          </div>
          <div className="flex items-start gap-2">
            <TrendingDown className="w-3.5 h-3.5 text-orange-400 mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-[11px] text-slate-400 leading-snug">
              Strong teams consistently landed at the back of the queue
            </p>
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div className="hidden md:flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-px h-8 bg-[#2d4a66]" />
          <div className="rounded-full border border-[#2d4a66] bg-[#16213e] p-2">
            <ArrowRight className="w-4 h-4 text-slate-400" aria-hidden="true" />
          </div>
          <div className="w-px h-8 bg-[#2d4a66]" />
          <p className="text-[10px] text-slate-600 uppercase tracking-wider text-center">
            2023<br />Transition
          </p>
        </div>
      </div>

      {/* FAAB Era */}
      <div className="rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/5 px-5 py-5">
        <p className="text-xs text-[#ffd700] font-black uppercase tracking-widest mb-2">
          FAAB Era
        </p>
        <p className="text-2xl font-black text-white mb-1">2023–Present</p>
        <p className="text-xs text-slate-400 leading-relaxed mb-3">
          Free Agent Acquisition Budget. Each team starts with a seasonal budget and bids
          blindly. Highest bid wins the player. Remaining budget does not roll over.
        </p>
        <div className="space-y-1.5">
          <div className="flex items-start gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-[11px] text-slate-400 leading-snug">
              Strategic bidding rewards long-term planning and market read
            </p>
          </div>
          <div className="flex items-start gap-2">
            <TrendingDown className="w-3.5 h-3.5 text-orange-400 mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-[11px] text-slate-400 leading-snug">
              Budget mismanagement early in the season is nearly unrecoverable
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type ActiveView = 'history' | 'career' | 'pickups' | 'era';

export default function WaiverHistoryTrackerPage() {
  const [activeView, setActiveView] = useState<ActiveView>('history');
  const [pickupFilter, setPickupFilter] = useState<'all' | 'high-priority' | 'low-priority'>('all');

  const filteredPickups = useMemo(() => {
    if (pickupFilter === 'all') return NOTABLE_PICKUPS;
    return NOTABLE_PICKUPS.filter((p) => p.type === pickupFilter);
  }, [pickupFilter]);

  const views: { key: ActiveView; label: string }[] = [
    { key: 'history', label: 'Priority History' },
    { key: 'career', label: 'Career Scores' },
    { key: 'pickups', label: 'Notable Pickups' },
    { key: 'era', label: 'FAAB vs Priority' },
  ];

  return (
    <>
      <Head>
        <title>Historical Waiver Priority Tracker — BMFFFL Analytics</title>
        <meta
          name="description"
          content="6-season tracking of BMFFFL waiver priority positions. Who's had the most and least waiver advantage, notable pickups, and the shift from priority to FAAB."
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
            Historical Waiver Priority Tracker
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mb-6">
            6 seasons of waiver priority data across BMFFFL (2020&ndash;2025)
          </p>
          {/* Overview callout */}
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4 max-w-2xl">
            <div className="flex items-start gap-3">
              <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-xs text-slate-300 font-bold mb-1">About Waiver Priority</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Waiver priority determines claim order. In the priority era (2020–2022), the worst record
                  got first pick of free agents. In the FAAB era (2023+), blind bidding replaced positional
                  priority. Tracking this shows who&rsquo;s been stuck at the bottom of the waiver queue
                  — and who built championships without it.
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* ── Summary Stats ────────────────────────────────────────────────── */}
        <section className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3" aria-label="Waiver priority summary">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-4 text-center">
            <div className="flex justify-center mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            </div>
            <p className="text-sm font-black text-emerald-400">escuelas</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Most Priority</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">1.5 avg rank</p>
          </div>
          <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 px-4 py-4 text-center">
            <div className="flex justify-center mb-1">
              <TrendingDown className="w-4 h-4 text-orange-400" aria-hidden="true" />
            </div>
            <p className="text-sm font-black text-orange-400">mlschools12</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Least Priority</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">11.8 avg rank</p>
          </div>
          <div className="rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/5 px-4 py-4 text-center">
            <p className="text-3xl font-black tabular-nums text-[#ffd700]">6</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Seasons Tracked</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">2020–2025</p>
          </div>
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-4 py-4 text-center">
            <p className="text-3xl font-black tabular-nums text-blue-400">2023</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">FAAB Transition</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Priority → Blind Bid</p>
          </div>
        </section>

        {/* ── View Tabs ────────────────────────────────────────────────────── */}
        <section className="mb-6" aria-label="Select view">
          <div role="group" aria-label="View selector" className="flex flex-wrap gap-1.5">
            {views.map((v) => (
              <button
                key={v.key}
                type="button"
                onClick={() => setActiveView(v.key)}
                aria-pressed={activeView === v.key}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-bold transition-all duration-150 border',
                  activeView === v.key
                    ? 'bg-[#ffd700] text-[#0d1b2a] border-[#ffd700]'
                    : 'bg-[#16213e] text-slate-400 border-[#2d4a66] hover:border-[#ffd700]/40 hover:text-white'
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
        </section>

        {/* ── Priority History ─────────────────────────────────────────────── */}
        {activeView === 'history' && (
          <section aria-label="Priority history by season">
            <div className="mb-4">
              <h2 className="text-xl font-black text-white">Priority Position by Season</h2>
              <p className="text-slate-500 text-sm mt-0.5">
                #1 = worst record = first claim priority. #12 = best record = last claim.
              </p>
            </div>
            <PriorityHistoryTable seasons={SEASON_PRIORITIES} />
          </section>
        )}

        {/* ── Career Priority Scores ───────────────────────────────────────── */}
        {activeView === 'career' && (
          <section aria-label="Career priority scores">
            <div className="mb-4">
              <h2 className="text-xl font-black text-white">Career Priority Scores</h2>
              <p className="text-slate-500 text-sm mt-0.5">
                Average waiver priority rank across all 6 seasons. Lower = more cumulative waiver advantage.
              </p>
            </div>
            <CareerPriorityTable data={CAREER_PRIORITIES} />

            {/* Insight callout */}
            <div className="mt-5 rounded-xl border border-[#ffd700]/20 bg-[#ffd700]/5 px-5 py-4">
              <p className="text-xs text-[#ffd700] uppercase tracking-widest font-bold mb-2">
                Bimfle&rsquo;s Observation
              </p>
              <p className="text-sm text-slate-300 leading-relaxed italic">
                &ldquo;mlschools12 has averaged the #11.8 priority position across six seasons — meaning they
                have had first access to the wire almost never. They have two championships. escuelas has
                averaged #1.5 and has zero. The wire is not the dynasty.&rdquo;
              </p>
              <p className="text-[#ffd700] text-xs font-semibold mt-2">~Bimfle</p>
            </div>
          </section>
        )}

        {/* ── Notable Pickups ──────────────────────────────────────────────── */}
        {activeView === 'pickups' && (
          <section aria-label="Notable waiver pickups">
            <div className="mb-4">
              <h2 className="text-xl font-black text-white">Notable Waiver Pickups</h2>
              <p className="text-slate-500 text-sm mt-0.5">
                Significant adds — both by teams with priority advantage and those without it.
              </p>
            </div>

            {/* Filter */}
            <div className="mb-5 flex flex-wrap gap-1.5" role="group" aria-label="Filter pickups">
              {(
                [
                  ['all', 'All Pickups'],
                  ['high-priority', 'High Priority Finds'],
                  ['low-priority', 'Low Priority Value'],
                ] as ['all' | 'high-priority' | 'low-priority', string][]
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPickupFilter(key)}
                  aria-pressed={pickupFilter === key}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 border',
                    pickupFilter === key
                      ? 'bg-[#ffd700] text-[#0d1b2a] border-[#ffd700]'
                      : 'bg-[#16213e] text-slate-400 border-[#2d4a66] hover:border-[#ffd700]/40 hover:text-white'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPickups.map((pickup, idx) => (
                <NotablePickupCard key={idx} pickup={pickup} />
              ))}
            </div>
          </section>
        )}

        {/* ── FAAB vs Priority Era ─────────────────────────────────────────── */}
        {activeView === 'era' && (
          <section aria-label="FAAB vs priority era comparison">
            <div className="mb-4">
              <h2 className="text-xl font-black text-white">FAAB vs. Priority Era</h2>
              <p className="text-slate-500 text-sm mt-0.5">
                The league transitioned from rolling waiver priority to blind-bid FAAB in 2023.
              </p>
            </div>
            <FaabVsPriorityPanel />

            {/* Strategy impact */}
            <div className="mt-6 rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-5">
              <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-3">
                Strategic Impact of the Transition
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <p className="text-sm font-black text-white mb-2">What Changed</p>
                  <ul className="space-y-2">
                    {[
                      'Budget management became the primary waiver skill',
                      'Early-season overspending now has multi-week consequences',
                      'Market-reading (bid calibration) replaced queue position as the key edge',
                      'Late-season waiver adds require budget survival planning from Week 1',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-[#ffd700] text-xs mt-0.5 shrink-0">→</span>
                        <p className="text-xs text-slate-400 leading-snug">{item}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-black text-white mb-2">Who Benefited</p>
                  <ul className="space-y-2">
                    {[
                      'High-GPA managers (rbr, mlschools12) who were disadvantaged by priority rankings',
                      'Disciplined spenders who could calibrate bids without overcommitting',
                      'Teams who entered the FAAB era with a full budget and patience',
                      'Managers who treated FAAB as a season-long resource, not a per-week expense',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-emerald-400 text-xs mt-0.5 shrink-0">→</span>
                        <p className="text-xs text-slate-400 leading-snug">{item}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div className="mt-10 text-xs text-slate-600 leading-relaxed border-t border-[#1e3347] pt-5">
          <p>
            Waiver priority rankings are estimated based on win records and historical standings.
            Exact weekly priority positions are approximate. FAAB amounts are representative
            approximations. Real data available via Sleeper API. Bimfle considers approximations
            sufficient for dynasty analysis purposes.
          </p>
        </div>

      </div>
    </>
  );
}
