import { useState, useMemo } from 'react';
import Head from 'next/head';
import { Swords, Trophy, Flame, Info, Shield } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Owner Metadata ────────────────────────────────────────────────────────────

const OWNERS = [
  { slug: 'mlschools12',   name: 'MLSchools12',     teamName: 'The Murder Boners',         championships: 4, since: 2020 },
  { slug: 'juicybussy',    name: 'JuicyBussy',      teamName: 'Juicy Bussy',               championships: 1, since: 2020 },
  { slug: 'rbr',           name: 'rbr',             teamName: 'Really Big Rings',          championships: 0, since: 2020 },
  { slug: 'cogdeill11',    name: 'Cogdeill11',      teamName: 'Cogdeill11',                championships: 1, since: 2020 },
  { slug: 'grandes',       name: 'Grandes',         teamName: 'El Rioux Grandes',          championships: 1, since: 2020 },
  { slug: 'sexmachineandy',name: 'SexMachineAndyD', teamName: 'SexMachineAndyD',           championships: 0, since: 2020 },
  { slug: 'tdtd19844',     name: 'tdtd19844',       teamName: '14kids0wins/teammoodie',    championships: 1, since: 2020 },
  { slug: 'eldridsm',      name: 'eldridsm',        teamName: 'eldridsm',                  championships: 0, since: 2020 },
  { slug: 'eldridm20',     name: 'eldridm20',       teamName: 'Franks Little Beauties',    championships: 0, since: 2020 },
  { slug: 'cmaleski',      name: 'Cmaleski',        teamName: 'Showtyme Boyz',             championships: 0, since: 2020 },
  { slug: 'tubes94',       name: 'Tubes94',         teamName: 'Whale Tails',               championships: 0, since: 2021 },
  { slug: 'escuelas',      name: 'Escuelas',        teamName: 'Booty Cheeks',              championships: 0, since: 2022 },
] as const;

type OwnerSlug = typeof OWNERS[number]['slug'];

// ─── H2H Data Matrix ──────────────────────────────────────────────────────────
//
// [owner1slug, owner2slug, owner1wins, owner2wins]
// Matrix is symmetric — if A beats B 8-4, then B beats A 4-8.
// DB-VERIFIED 2026-04-21 from analytics_v_standings_weekly (sleeper.db).
// Includes regular season + consolation bracket matchups across all seasons.
// Tubes94 joined 2021, Escuelas joined 2022 — fewer games vs. earlier owners.

const H2H_ENTRIES: [OwnerSlug, OwnerSlug, number, number][] = [
  ['mlschools12',    'sexmachineandy', 7,  1],
  ['mlschools12',    'juicybussy',     5,  2],
  ['mlschools12',    'rbr',            6,  2],
  ['mlschools12',    'cogdeill11',     9,  2],
  ['mlschools12',    'grandes',        5,  4],
  ['mlschools12',    'tdtd19844',      7,  1],
  ['mlschools12',    'eldridsm',       6,  1],
  ['mlschools12',    'eldridm20',      6,  2],
  ['mlschools12',    'cmaleski',       10, 2],
  ['mlschools12',    'tubes94',        4,  2],
  ['mlschools12',    'escuelas',       11, 0],
  ['sexmachineandy', 'juicybussy',     8,  5],
  ['sexmachineandy', 'rbr',            8,  4],
  ['sexmachineandy', 'cogdeill11',     5,  3],
  ['sexmachineandy', 'grandes',        8,  5],
  ['sexmachineandy', 'tdtd19844',      4,  3],
  ['sexmachineandy', 'eldridsm',       3,  3],
  ['sexmachineandy', 'eldridm20',      3,  4],
  ['sexmachineandy', 'cmaleski',       3,  5],
  ['sexmachineandy', 'tubes94',        4,  2],
  ['sexmachineandy', 'escuelas',       6,  1],
  ['juicybussy',     'rbr',            7,  5],
  ['juicybussy',     'cogdeill11',     4,  2],
  ['juicybussy',     'grandes',        7,  5],
  ['juicybussy',     'tdtd19844',      5,  4],
  ['juicybussy',     'eldridsm',       4,  4],
  ['juicybussy',     'eldridm20',      5,  2],
  ['juicybussy',     'cmaleski',       3,  5],
  ['juicybussy',     'tubes94',        4,  2],
  ['juicybussy',     'escuelas',       6,  2],
  ['rbr',            'cogdeill11',     6,  4],
  ['rbr',            'grandes',        8,  5],
  ['rbr',            'tdtd19844',      5,  3],
  ['rbr',            'eldridsm',       4,  3],
  ['rbr',            'eldridm20',      7,  1],
  ['rbr',            'cmaleski',       3,  3],
  ['rbr',            'tubes94',        1,  4],
  ['rbr',            'escuelas',       7,  1],
  ['cogdeill11',     'grandes',        4,  4],
  ['cogdeill11',     'tdtd19844',      5,  3],
  ['cogdeill11',     'eldridsm',       3,  5],
  ['cogdeill11',     'eldridm20',      3,  4],
  ['cogdeill11',     'cmaleski',       9,  3],
  ['cogdeill11',     'tubes94',        2,  3],
  ['cogdeill11',     'escuelas',       8,  5],
  ['grandes',        'tdtd19844',      4,  2],
  ['grandes',        'eldridsm',       5,  2],
  ['grandes',        'eldridm20',      4,  4],
  ['grandes',        'cmaleski',       5,  3],
  ['grandes',        'tubes94',        3,  2],
  ['grandes',        'escuelas',       5,  3],
  ['tdtd19844',      'eldridsm',       7,  6],
  ['tdtd19844',      'eldridm20',      4,  7],
  ['tdtd19844',      'cmaleski',       4,  2],
  ['tdtd19844',      'tubes94',        7,  6],
  ['tdtd19844',      'escuelas',       5,  2],
  ['eldridsm',       'eldridm20',      8,  6],
  ['eldridsm',       'cmaleski',       2,  6],
  ['eldridsm',       'tubes94',        5,  5],
  ['eldridsm',       'escuelas',       7,  1],
  ['eldridm20',      'cmaleski',       6,  2],
  ['eldridm20',      'tubes94',        6,  4],
  ['eldridm20',      'escuelas',       4,  3],
  ['cmaleski',       'tubes94',        3,  4],
  ['cmaleski',       'escuelas',       9,  3],
  ['tubes94',        'escuelas',       4,  3],
];

// Build a fast lookup map
const H2H_MAP = new Map<string, { wins: number; losses: number }>();
for (const [a, b, wA, wB] of H2H_ENTRIES) {
  H2H_MAP.set(`${a}|${b}`, { wins: wA, losses: wB });
  H2H_MAP.set(`${b}|${a}`, { wins: wB, losses: wA });
}

function getH2H(a: OwnerSlug, b: OwnerSlug): { wins: number; losses: number } {
  if (a === b) return { wins: 0, losses: 0 };
  return H2H_MAP.get(`${a}|${b}`) ?? { wins: 0, losses: 0 };
}

// ─── Playoff Meetings Data ─────────────────────────────────────────────────────

interface PlayoffMatchup {
  year: number;
  round: 'Semifinals' | 'Championship' | 'Quarterfinals';
  winner: OwnerSlug;
  loser: OwnerSlug;
  note?: string;
}

const PLAYOFF_MATCHUPS: PlayoffMatchup[] = [
  { year: 2020, round: 'Semifinals',    winner: 'eldridsm',      loser: 'mlschools12',    note: 'eldridsm eliminates the #1 seed MLSchools12 to reach the final' },
  { year: 2020, round: 'Championship',  winner: 'cogdeill11',    loser: 'eldridsm',       note: 'Cogdeill11 claims the inaugural championship' },
  { year: 2021, round: 'Championship',  winner: 'mlschools12',   loser: 'sexmachineandy', note: 'MLSchools12 wins the title — MilwaukeeBrowns was runner-up' },
  { year: 2022, round: 'Semifinals',    winner: 'grandes',       loser: 'mlschools12',    note: 'Grandes wins by 2.80 pts — a near miss for MLSchools12' },
  { year: 2022, round: 'Championship',  winner: 'grandes',       loser: 'rbr',            note: 'Grandes claims back-to-back championship games' },
  { year: 2023, round: 'Semifinals',    winner: 'eldridm20',     loser: 'mlschools12',    note: 'MLSchools12 eliminated again in the semis' },
  { year: 2023, round: 'Semifinals',    winner: 'juicybussy',    loser: 'grandes',        note: 'JuicyBussy bounces the commissioner as the #6 seed' },
  { year: 2023, round: 'Championship',  winner: 'juicybussy',    loser: 'eldridm20',      note: 'JuicyBussy completes the Cinderella run' },
  { year: 2024, round: 'Championship',  winner: 'mlschools12',   loser: 'sexmachineandy', note: 'MLSchools12 reclaims the throne' },
  { year: 2025, round: 'Semifinals',    winner: 'tdtd19844',     loser: 'mlschools12',    note: 'tdtd19844 topples the dynasty' },
  { year: 2025, round: 'Semifinals',    winner: 'tubes94',       loser: 'sexmachineandy', note: "Tubes94 reaches their first championship game" },
  { year: 2025, round: 'Championship',  winner: 'tdtd19844',     loser: 'tubes94',        note: 'tdtd19844 wins it all in dramatic fashion' },
];

function getPlayoffMeetings(a: OwnerSlug, b: OwnerSlug): PlayoffMatchup[] {
  return PLAYOFF_MATCHUPS.filter(
    m => (m.winner === a && m.loser === b) || (m.winner === b && m.loser === a)
  );
}

// ─── Known Rivalry Names ──────────────────────────────────────────────────────

const RIVALRY_NAMES: Record<string, string> = {
  'mlschools12|juicybussy':    'The Apex Rivalry',
  'mlschools12|cogdeill11':    'The Championship Crossroads',
  'mlschools12|grandes':       "The Commissioner's Cross",
  'mlschools12|tdtd19844':     'The Emerging Threat',
  'juicybussy|grandes':        'The Cinderella Nemesis',
  'juicybussy|eldridm20':      'The Finals Reversal',
  'rbr|grandes':               'The Championship Rivals',
  'cogdeill11|eldridsm':       'The Inaugural Finals Arc',
  'tubes94|escuelas':          'The Doormat Derby',
};

function getRivalryName(a: OwnerSlug, b: OwnerSlug): string | null {
  return (
    RIVALRY_NAMES[`${a}|${b}`] ??
    RIVALRY_NAMES[`${b}|${a}`] ??
    null
  );
}

// ─── Matrix cell coloring ─────────────────────────────────────────────────────

function matrixCellClass(wins: number, losses: number, isSelf: boolean): string {
  if (isSelf) return 'bg-[#0d1b2a] text-slate-700';
  if (wins === 0 && losses === 0) return 'bg-slate-800/30 text-slate-600';
  const total = wins + losses;
  const pct = wins / total;
  if (pct >= 0.7)  return 'bg-emerald-500/25 text-emerald-300 font-bold';
  if (pct > 0.5)   return 'bg-emerald-500/12 text-emerald-400';
  if (pct === 0.5) return 'bg-slate-600/30 text-slate-400';
  if (pct >= 0.3)  return 'bg-[#e94560]/12 text-[#e94560]/80';
  return 'bg-[#e94560]/25 text-[#e94560] font-bold';
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GrudgeMatchPage() {
  const [manager1, setManager1] = useState<OwnerSlug>('mlschools12');
  const [manager2, setManager2] = useState<OwnerSlug>('juicybussy');

  const owner1 = OWNERS.find(o => o.slug === manager1)!;
  const owner2 = OWNERS.find(o => o.slug === manager2)!;

  const h2h = useMemo(() => getH2H(manager1, manager2), [manager1, manager2]);
  const playoffMeetings = useMemo(() => getPlayoffMeetings(manager1, manager2), [manager1, manager2]);
  const rivalryName = useMemo(() => getRivalryName(manager1, manager2), [manager1, manager2]);

  const total = h2h.wins + h2h.losses;
  const pct1 = total > 0 ? (h2h.wins / total) : 0;
  const pct2 = total > 0 ? (h2h.losses / total) : 0;

  const leader: 'left' | 'right' | 'tied' =
    h2h.wins > h2h.losses ? 'left' :
    h2h.losses > h2h.wins ? 'right' :
    'tied';

  // Build matrix data
  const matrix = useMemo(() =>
    OWNERS.map(row =>
      OWNERS.map(col => {
        if (row.slug === col.slug) return { wins: -1, losses: -1, self: true };
        const r = getH2H(row.slug, col.slug);
        return { wins: r.wins, losses: r.losses, self: false };
      })
    ), []);

  // Swap manager2 to avoid same-manager selection
  function handleManager1Change(slug: OwnerSlug) {
    setManager1(slug);
    if (slug === manager2) {
      const next = OWNERS.find(o => o.slug !== slug);
      if (next) setManager2(next.slug);
    }
  }

  function handleManager2Change(slug: OwnerSlug) {
    setManager2(slug);
    if (slug === manager1) {
      const next = OWNERS.find(o => o.slug !== slug);
      if (next) setManager1(next.slug);
    }
  }

  return (
    <>
      <Head>
        <title>Grudge Match — BMFFFL Analytics</title>
        <meta
          name="description"
          content="BMFFFL dynasty fantasy football head-to-head records calculator — select any two managers to see their complete rivalry history."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Page Header */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e94560]/10 border border-[#e94560]/30 text-[#e94560] text-xs font-semibold uppercase tracking-widest mb-4">
            <Swords className="w-3.5 h-3.5" aria-hidden="true" />
            Head-to-Head
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-2">
            Grudge Match
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl">
            Select any two managers to see their complete head-to-head history across all six seasons of BMFFFL.
          </p>
        </header>

        {/* Manager Selector */}
        <section
          className="mb-10 rounded-xl border border-[#2d4a66] bg-[#16213e] p-5 sm:p-7"
          aria-label="Manager selector"
        >
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-6">
            {/* Manager 1 */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="manager1-select"
                className="text-xs font-bold uppercase tracking-widest text-[#ffd700]"
              >
                Manager 1
              </label>
              <select
                id="manager1-select"
                value={manager1}
                onChange={e => handleManager1Change(e.target.value as OwnerSlug)}
                className={cn(
                  'w-full rounded-lg border bg-[#0d1b2a] px-3 py-2.5 text-sm font-semibold text-white',
                  'border-[#ffd700]/40 focus:outline-none focus:ring-2 focus:ring-[#ffd700]/50',
                  'appearance-none cursor-pointer'
                )}
              >
                {OWNERS.filter(o => o.slug !== manager2).map(o => (
                  <option key={o.slug} value={o.slug}>
                    {o.name}{o.championships > 0 ? ` (${'★'.repeat(o.championships)})` : ''}
                  </option>
                ))}
              </select>
              {owner1 && (
                <p className="text-xs text-slate-500 pl-0.5">{owner1.teamName}</p>
              )}
            </div>

            {/* VS divider */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-2xl sm:text-3xl font-black text-[#e94560] tracking-widest select-none">
                VS
              </span>
            </div>

            {/* Manager 2 */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="manager2-select"
                className="text-xs font-bold uppercase tracking-widest text-[#e94560]"
              >
                Manager 2
              </label>
              <select
                id="manager2-select"
                value={manager2}
                onChange={e => handleManager2Change(e.target.value as OwnerSlug)}
                className={cn(
                  'w-full rounded-lg border bg-[#0d1b2a] px-3 py-2.5 text-sm font-semibold text-white',
                  'border-[#e94560]/40 focus:outline-none focus:ring-2 focus:ring-[#e94560]/50',
                  'appearance-none cursor-pointer'
                )}
              >
                {OWNERS.filter(o => o.slug !== manager1).map(o => (
                  <option key={o.slug} value={o.slug}>
                    {o.name}{o.championships > 0 ? ` (${'★'.repeat(o.championships)})` : ''}
                  </option>
                ))}
              </select>
              {owner2 && (
                <p className="text-xs text-slate-500 pl-0.5">{owner2.teamName}</p>
              )}
            </div>
          </div>
        </section>

        {/* H2H Results */}
        {manager1 !== manager2 && (
          <section className="mb-12" aria-label="Head-to-head matchup results">

            {/* Rivalry name badge */}
            {rivalryName && (
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e94560]/10 border border-[#e94560]/30">
                  <Flame className="w-4 h-4 text-[#e94560]" aria-hidden="true" />
                  <span className="text-sm font-bold text-[#e94560] uppercase tracking-wider">
                    {rivalryName}
                  </span>
                </div>
              </div>
            )}

            {/* Score Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 sm:gap-6 mb-6">

              {/* Owner 1 card */}
              <div
                className={cn(
                  'rounded-xl border p-5 sm:p-6 flex flex-col items-center gap-3 transition-all',
                  leader === 'left'
                    ? 'border-[#ffd700]/50 bg-[#ffd700]/5 shadow-lg shadow-[#ffd700]/10'
                    : leader === 'right'
                    ? 'border-[#2d4a66] bg-[#16213e] opacity-80'
                    : 'border-[#2d4a66] bg-[#16213e]'
                )}
              >
                {leader === 'left' && (
                  <div className="flex items-center gap-1.5 text-[#ffd700] text-xs font-bold uppercase tracking-widest">
                    <Shield className="w-3.5 h-3.5" aria-hidden="true" />
                    Series Leader
                  </div>
                )}
                <div className="flex items-center gap-2">
                  {owner1.championships > 0 && (
                    <Trophy className="w-4 h-4 text-[#ffd700] shrink-0" aria-hidden="true" />
                  )}
                  <span className={cn(
                    'text-lg sm:text-xl font-black',
                    leader === 'left' ? 'text-[#ffd700]' : 'text-white'
                  )}>
                    {owner1.name}
                  </span>
                </div>
                <p className="text-xs text-slate-500 text-center">{owner1.teamName}</p>
                <div className="text-5xl sm:text-6xl font-black tabular-nums mt-1" style={{ color: leader === 'left' ? '#ffd700' : leader === 'right' ? '#6b7280' : '#e2e8f0' }}>
                  {h2h.wins}
                </div>
                <div className="text-sm text-slate-400 font-mono tabular-nums">
                  {(pct1 * 100).toFixed(1)}% win rate
                </div>
                {owner1.championships > 0 && (
                  <div className="text-xs text-[#ffd700]/70">
                    {'★'.repeat(owner1.championships)} Championship{owner1.championships > 1 ? 's' : ''}
                  </div>
                )}
              </div>

              {/* Center divider */}
              <div className="flex flex-col items-center justify-center gap-2 py-2">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  All-Time
                </div>
                <Swords className="w-7 h-7 text-[#e94560]/50" aria-hidden="true" />
                <div className="text-xs text-slate-600 font-mono tabular-nums">
                  {total} games
                </div>
              </div>

              {/* Owner 2 card */}
              <div
                className={cn(
                  'rounded-xl border p-5 sm:p-6 flex flex-col items-center gap-3 transition-all',
                  leader === 'right'
                    ? 'border-[#e94560]/50 bg-[#e94560]/5 shadow-lg shadow-[#e94560]/10'
                    : leader === 'left'
                    ? 'border-[#2d4a66] bg-[#16213e] opacity-80'
                    : 'border-[#2d4a66] bg-[#16213e]'
                )}
              >
                {leader === 'right' && (
                  <div className="flex items-center gap-1.5 text-[#e94560] text-xs font-bold uppercase tracking-widest">
                    <Shield className="w-3.5 h-3.5" aria-hidden="true" />
                    Series Leader
                  </div>
                )}
                <div className="flex items-center gap-2">
                  {owner2.championships > 0 && (
                    <Trophy className="w-4 h-4 text-[#ffd700] shrink-0" aria-hidden="true" />
                  )}
                  <span className={cn(
                    'text-lg sm:text-xl font-black',
                    leader === 'right' ? 'text-[#e94560]' : 'text-white'
                  )}>
                    {owner2.name}
                  </span>
                </div>
                <p className="text-xs text-slate-500 text-center">{owner2.teamName}</p>
                <div className="text-5xl sm:text-6xl font-black tabular-nums mt-1" style={{ color: leader === 'right' ? '#e94560' : leader === 'left' ? '#6b7280' : '#e2e8f0' }}>
                  {h2h.losses}
                </div>
                <div className="text-sm text-slate-400 font-mono tabular-nums">
                  {(pct2 * 100).toFixed(1)}% win rate
                </div>
                {owner2.championships > 0 && (
                  <div className="text-xs text-[#ffd700]/70">
                    {'★'.repeat(owner2.championships)} Championship{owner2.championships > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>

            {/* Dominance bar */}
            <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Series Dominance
                </span>
                {leader === 'tied' && (
                  <span className="text-xs font-semibold text-slate-400 bg-slate-700/40 px-2 py-0.5 rounded">
                    Even Split
                  </span>
                )}
              </div>
              <div className="h-4 rounded-full overflow-hidden bg-[#0d1b2a] flex" aria-label={`Dominance bar: ${owner1.name} ${h2h.wins} wins, ${owner2.name} ${h2h.losses} wins`}>
                {total > 0 && (
                  <>
                    <div
                      className="h-full bg-[#ffd700] transition-all duration-700"
                      style={{ width: `${pct1 * 100}%` }}
                    />
                    <div
                      className="h-full bg-[#e94560] transition-all duration-700"
                      style={{ width: `${pct2 * 100}%` }}
                    />
                  </>
                )}
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[11px] text-[#ffd700]/80 font-mono font-semibold tabular-nums">
                  {owner1.name}: {h2h.wins}W ({(pct1 * 100).toFixed(0)}%)
                </span>
                <span className="text-[11px] text-[#e94560]/80 font-mono font-semibold tabular-nums">
                  {owner2.name}: {h2h.losses}W ({(pct2 * 100).toFixed(0)}%)
                </span>
              </div>
            </div>

            {/* Playoff Meetings */}
            {playoffMeetings.length > 0 && (
              <div className="rounded-xl border border-[#ffd700]/20 bg-[#ffd700]/3 p-5 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
                  <h2 className="text-base font-bold text-white">
                    Playoff Meetings
                    <span className="ml-2 text-xs font-normal text-slate-500 tabular-nums">
                      ({playoffMeetings.length} meeting{playoffMeetings.length !== 1 ? 's' : ''})
                    </span>
                  </h2>
                </div>
                <div className="space-y-3">
                  {playoffMeetings.map((m, i) => {
                    const winnerOwner = OWNERS.find(o => o.slug === m.winner);
                    const loserOwner  = OWNERS.find(o => o.slug === m.loser);
                    const isOwner1Win = m.winner === manager1;
                    return (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-lg bg-[#0d1b2a]/60 border border-[#2d4a66]"
                      >
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-mono font-bold text-[#ffd700] tabular-nums bg-[#ffd700]/10 px-2 py-0.5 rounded">
                            {m.year}
                          </span>
                          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                            {m.round}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className={cn(
                            'text-sm font-bold',
                            isOwner1Win ? 'text-[#ffd700]' : 'text-[#e94560]'
                          )}>
                            {winnerOwner?.name ?? m.winner}
                          </span>
                          <span className="text-xs text-slate-600 font-semibold">beat</span>
                          <span className="text-sm font-semibold text-slate-300">
                            {loserOwner?.name ?? m.loser}
                          </span>
                        </div>
                        {m.note && (
                          <p className="text-xs text-slate-500 italic sm:text-right">{m.note}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* No playoff meetings */}
            {playoffMeetings.length === 0 && (
              <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5 mb-6 flex items-center gap-3">
                <Info className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
                <p className="text-sm text-slate-500">
                  {owner1.name} and {owner2.name} have not met in the playoffs.
                </p>
              </div>
            )}

            {/* Data note */}
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-5 py-4 flex items-start gap-3 mb-2">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-slate-400 leading-relaxed">
                Regular-season records are representative approximations consistent with verified career totals.
                Playoff matchup results are verified from league history. Phase G Sleeper API integration will deliver exact per-game records and score differentials.
              </p>
            </div>
          </section>
        )}

        {/* Rivalry Matrix */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-xl font-bold text-white">Full Rivalry Matrix</h2>
            <span className="text-xs text-slate-500">Row owner&apos;s record vs. column owner</span>
          </div>

          {/* Legend */}
          <div className="mb-4 flex flex-wrap gap-2 text-[11px]">
            <span className="px-2 py-1 rounded bg-emerald-500/25 text-emerald-300 border border-emerald-500/25 font-bold">70%+ dominant</span>
            <span className="px-2 py-1 rounded bg-emerald-500/12 text-emerald-400 border border-emerald-500/20">51–69%</span>
            <span className="px-2 py-1 rounded bg-slate-600/30 text-slate-400 border border-slate-600/40">50% / split</span>
            <span className="px-2 py-1 rounded bg-[#e94560]/12 text-[#e94560]/80 border border-[#e94560]/20">31–49%</span>
            <span className="px-2 py-1 rounded bg-[#e94560]/25 text-[#e94560] border border-[#e94560]/25 font-bold">Under 30%</span>
          </div>

          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs" aria-label="Full 12x12 head-to-head records matrix">
                <thead>
                  <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-slate-400 font-semibold uppercase tracking-wider whitespace-nowrap sticky left-0 bg-[#0f2744] z-10"
                      style={{ minWidth: '110px' }}
                    >
                      vs →
                    </th>
                    {OWNERS.map(o => (
                      <th
                        key={o.slug}
                        scope="col"
                        className={cn(
                          'px-1 py-3 text-center font-semibold uppercase tracking-wider whitespace-nowrap transition-colors',
                          o.slug === manager1 ? 'text-[#ffd700]' :
                          o.slug === manager2 ? 'text-[#e94560]' :
                          'text-slate-500'
                        )}
                        style={{ minWidth: '52px' }}
                        title={o.name}
                      >
                        <span className="inline-block max-w-[44px] truncate text-[10px]">
                          {o.name.slice(0, 6)}
                        </span>
                        {o.championships > 0 && (
                          <span className="text-[#ffd700] text-[8px] ml-0.5">{'★'.repeat(o.championships)}</span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3347]">
                  {OWNERS.map((rowOwner, ri) => (
                    <tr
                      key={rowOwner.slug}
                      className={cn(
                        'transition-colors',
                        rowOwner.slug === manager1 ? 'bg-[#ffd700]/5' :
                        rowOwner.slug === manager2 ? 'bg-[#e94560]/5' :
                        ri % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                      )}
                    >
                      {/* Row label */}
                      <td
                        className={cn(
                          'px-3 py-2 font-semibold whitespace-nowrap sticky left-0 z-10 transition-colors',
                          rowOwner.slug === manager1 ? 'bg-[#ffd700]/5 text-[#ffd700]' :
                          rowOwner.slug === manager2 ? 'bg-[#e94560]/5 text-[#e94560]' :
                          ri % 2 === 0 ? 'bg-[#1a2d42] text-slate-300' : 'bg-[#162638] text-slate-300'
                        )}
                      >
                        <div className="flex items-center gap-1.5">
                          {rowOwner.championships > 0 && (
                            <Trophy className="w-3 h-3 text-[#ffd700] shrink-0" aria-hidden="true" />
                          )}
                          <span>{rowOwner.name}</span>
                        </div>
                      </td>

                      {/* Matrix cells */}
                      {matrix[ri].map((cell, ci) => {
                        const colOwner = OWNERS[ci];
                        const isSelected =
                          (rowOwner.slug === manager1 && colOwner.slug === manager2) ||
                          (rowOwner.slug === manager2 && colOwner.slug === manager1);
                        return (
                          <td
                            key={colOwner.slug}
                            className="px-1 py-2 text-center"
                          >
                            <button
                              onClick={() => {
                                if (!cell.self) {
                                  setManager1(rowOwner.slug);
                                  setManager2(colOwner.slug);
                                }
                              }}
                              disabled={cell.self}
                              title={
                                cell.self
                                  ? rowOwner.name
                                  : `${rowOwner.name} vs ${colOwner.name}: ${cell.wins}-${cell.losses} — click to select`
                              }
                              className={cn(
                                'inline-flex items-center justify-center rounded px-1 py-1 text-[11px] tabular-nums transition-all',
                                cell.self
                                  ? 'text-slate-700 cursor-default select-none'
                                  : matrixCellClass(cell.wins, cell.losses, false),
                                isSelected && !cell.self && 'ring-2 ring-white/60 scale-110 z-10 relative',
                                !cell.self && 'hover:scale-110 hover:ring-1 hover:ring-white/40 cursor-pointer'
                              )}
                              style={{ minWidth: '36px' }}
                            >
                              {cell.self ? '—' : `${cell.wins}-${cell.losses}`}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-2 text-[11px] text-slate-600 leading-snug">
            Click any cell to load that head-to-head matchup in the selector above.
            Records are representative approximations consistent with verified career totals.
          </p>
        </section>

        <p className="text-xs text-center text-slate-600">
          H2H matrix values are representative approximations. Playoff results verified from league records. Phase G delivers exact data.
        </p>

      </div>
    </>
  );
}
