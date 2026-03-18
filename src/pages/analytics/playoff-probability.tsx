import { useState, useMemo } from 'react';
import Head from 'next/head';
import { Trophy, TrendingUp, Info, Calendar, Target } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface OwnerRecord {
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  careerWins: number;
  careerLosses: number;
  careerWinPct: number;
  seasons: number;           // total seasons in league
  playoffAppearances: number;
  playoffRate: number;       // appearances / seasons
  championships: number;
  runnerUps: number;
  projectedStrength: number; // 1-10 scale for 2026
  strengthNote: string;
  // 2025 final standing
  standing2025: number;
  record2025: string;
  playoff2025: boolean;
  playoff2025Note?: string;
  // draft capital for 2026
  draftCapital2026?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const OWNERS: OwnerRecord[] = [
  {
    name: 'MLSchools12',
    color: 'text-[#ffd700]',
    bgColor: 'bg-[#ffd700]/8',
    borderColor: 'border-[#ffd700]/50',
    careerWins: 68,
    careerLosses: 15,
    careerWinPct: 0.819,
    seasons: 6,
    playoffAppearances: 6,
    playoffRate: 1.000,
    championships: 2,
    runnerUps: 0,
    projectedStrength: 9,
    strengthNote: 'Lamar Jackson + CeeDee Lamb + deep roster. Finished 13-1 in 2025. Clear dynasty favorite.',
    standing2025: 1,
    record2025: '13-1',
    playoff2025: true,
    playoff2025Note: 'Regular season champion',
    draftCapital2026: 'Mid-round picks only',
  },
  {
    name: 'Tubes94',
    color: 'text-rose-400',
    bgColor: 'bg-rose-400/8',
    borderColor: 'border-rose-400/50',
    careerWins: 34,
    careerLosses: 36,
    careerWinPct: 0.486,
    seasons: 6,
    playoffAppearances: 2,
    playoffRate: 0.333,
    championships: 0,
    runnerUps: 1,
    projectedStrength: 9,
    strengthNote: 'Bijan Robinson + Breece Hall + Trevor Lawrence. Dynasty Rank #2. Young elite core — peak window arriving now.',
    standing2025: 2,
    record2025: '10-4',
    playoff2025: true,
    playoff2025Note: '2025 Runner-Up (runner-up from 6-8 reg season)',
    draftCapital2026: 'Mid picks',
  },
  {
    name: 'tdtd19844',
    color: 'text-amber-400',
    bgColor: 'bg-amber-400/8',
    borderColor: 'border-amber-400/50',
    careerWins: 36,
    careerLosses: 47,
    careerWinPct: 0.434,
    seasons: 6,
    playoffAppearances: 3,
    playoffRate: 0.500,
    championships: 1,
    runnerUps: 0,
    projectedStrength: 8,
    strengthNote: 'Tetairoa McMillan + Brian Thomas Jr. + Sam LaPorta. 2025 Champion — momentum and youth on their side.',
    standing2025: 3,
    record2025: '8-6',
    playoff2025: true,
    playoff2025Note: '2025 Champion (4th seed)',
    draftCapital2026: 'Mid picks',
  },
  {
    name: 'JuicyBussy',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/8',
    borderColor: 'border-emerald-400/50',
    careerWins: 46,
    careerLosses: 37,
    careerWinPct: 0.554,
    seasons: 6,
    playoffAppearances: 5,
    playoffRate: 0.833,
    championships: 1,
    runnerUps: 0,
    projectedStrength: 8,
    strengthNote: 'Joe Burrow + Ja\'Marr Chase + Malik Nabers + Harold Fannin Jr. Elite QB-WR stack. Perennial contender.',
    standing2025: 4,
    record2025: '7-7',
    playoff2025: true,
    draftCapital2026: 'Mid picks',
  },
  {
    name: 'SexMachineAndyD',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/8',
    borderColor: 'border-blue-400/50',
    careerWins: 50,
    careerLosses: 33,
    careerWinPct: 0.602,
    seasons: 6,
    playoffAppearances: 4,
    playoffRate: 0.667,
    championships: 0,
    runnerUps: 0,
    projectedStrength: 7,
    strengthNote: 'Tyler Warren is a top dynasty TE. Jonathan Taylor sell-high window. Solid floor, needs a championship closer.',
    standing2025: 5,
    record2025: '8-6',
    playoff2025: true,
    draftCapital2026: 'Mid picks',
  },
  {
    name: 'rbr',
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/8',
    borderColor: 'border-orange-400/50',
    careerWins: 44,
    careerLosses: 39,
    careerWinPct: 0.530,
    seasons: 6,
    playoffAppearances: 4,
    playoffRate: 0.667,
    championships: 0,
    runnerUps: 2,
    projectedStrength: 7,
    strengthNote: 'Patrick Mahomes + Quinshon Judkins (young RB) + Elic Ayomanor. Two runner-up finishes — ready to convert.',
    standing2025: 6,
    record2025: '6-8',
    playoff2025: true,
    draftCapital2026: 'Mid picks',
  },
  {
    name: 'Grandes',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/8',
    borderColor: 'border-purple-400/50',
    careerWins: 42,
    careerLosses: 41,
    careerWinPct: 0.506,
    seasons: 6,
    playoffAppearances: 4,
    playoffRate: 0.667,
    championships: 1,
    runnerUps: 0,
    projectedStrength: 7,
    strengthNote: 'Ashton Jeanty (elite RB) + Rashee Rice. 2022 champion. Inconsistent regular season but dangerous in bracket.',
    standing2025: 7,
    record2025: '6-8',
    playoff2025: false,
    draftCapital2026: 'Mid picks',
  },
  {
    name: 'eldridsm',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-400/8',
    borderColor: 'border-cyan-400/50',
    careerWins: 41,
    careerLosses: 42,
    careerWinPct: 0.494,
    seasons: 6,
    playoffAppearances: 3,
    playoffRate: 0.500,
    championships: 0,
    runnerUps: 1,
    projectedStrength: 5,
    strengthNote: '2020 runner-up. Missed playoffs last two seasons. Needs roster overhaul to climb back into contention.',
    standing2025: 8,
    record2025: '6-8',
    playoff2025: false,
    draftCapital2026: 'Mid picks',
  },
  {
    name: 'eldridm20',
    color: 'text-lime-400',
    bgColor: 'bg-lime-400/8',
    borderColor: 'border-lime-400/50',
    careerWins: 39,
    careerLosses: 44,
    careerWinPct: 0.470,
    seasons: 6,
    playoffAppearances: 2,
    playoffRate: 0.333,
    championships: 0,
    runnerUps: 1,
    projectedStrength: 6,
    strengthNote: 'Josh Allen (elite QB) + Luther Burden III + James Cook. Anchored by Allen — can surge with health and luck.',
    standing2025: 9,
    record2025: '5-9',
    playoff2025: false,
    draftCapital2026: 'Mid picks',
  },
  {
    name: 'Cmaleski',
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-400/8',
    borderColor: 'border-indigo-400/50',
    careerWins: 36,
    careerLosses: 47,
    careerWinPct: 0.434,
    seasons: 6,
    playoffAppearances: 2,
    playoffRate: 0.333,
    championships: 0,
    runnerUps: 0,
    projectedStrength: 6,
    strengthNote: 'Holds the 1.01 pick in 2026 draft — massive upside. Marvin Harrison Jr. cornerstone. Rebuild pivot point.',
    standing2025: 10,
    record2025: '3-11',
    playoff2025: false,
    draftCapital2026: '1.01 pick (best pick in 2026 draft)',
  },
  {
    name: 'Cogdeill11',
    color: 'text-[#e94560]',
    bgColor: 'bg-[#e94560]/8',
    borderColor: 'border-[#e94560]/50',
    careerWins: 38,
    careerLosses: 45,
    careerWinPct: 0.458,
    seasons: 6,
    playoffAppearances: 2,
    playoffRate: 0.333,
    championships: 1,
    runnerUps: 0,
    projectedStrength: 5,
    strengthNote: 'Omarion Hampton (elite RB) + Ja\'Marr Chase (elite WR) are dynasty cornerstones — but no playoff berth since 2020.',
    standing2025: 11,
    record2025: '4-10',
    playoff2025: false,
    draftCapital2026: 'High picks',
  },
  {
    name: 'Escuelas',
    color: 'text-slate-400',
    bgColor: 'bg-slate-400/8',
    borderColor: 'border-slate-400/50',
    careerWins: 15,
    careerLosses: 41,
    careerWinPct: 0.268,
    seasons: 4,
    playoffAppearances: 0,
    playoffRate: 0.000,
    championships: 0,
    runnerUps: 0,
    projectedStrength: 3,
    strengthNote: 'Joined 2022. Zero playoff appearances. 2025 showed improvement (6-8) but still below the cut line. Long rebuild ahead.',
    standing2025: 12,
    record2025: '6-8',
    playoff2025: false,
    draftCapital2026: 'High picks',
  },
];

// ─── 2025 Playoff Bracket Summary ─────────────────────────────────────────────

const PLAYOFF_2025 = [
  { seed: 1, name: 'MLSchools12', record: '13-1', result: 'Regular Season #1 — lost in semis' },
  { seed: 2, name: 'Tubes94',     record: '10-4', result: 'Runner-Up' },
  { seed: 3, name: 'SexMachineAndyD', record: '8-6', result: 'Eliminated in semis' },
  { seed: 4, name: 'tdtd19844',   record: '8-6', result: 'Champion' },
  { seed: 5, name: 'JuicyBussy',  record: '7-7', result: 'First round exit' },
  { seed: 6, name: 'rbr',         record: '6-8', result: 'First round exit' },
];

// ─── Strength scale helper ─────────────────────────────────────────────────────

function strengthColor(val: number): string {
  if (val >= 8) return 'text-[#ffd700]';
  if (val >= 6) return 'text-emerald-400';
  if (val >= 4) return 'text-amber-400';
  return 'text-[#e94560]';
}

function strengthBg(val: number): string {
  if (val >= 8) return 'bg-[#ffd700]/15 border-[#ffd700]/30';
  if (val >= 6) return 'bg-emerald-500/15 border-emerald-500/30';
  if (val >= 4) return 'bg-amber-500/15 border-amber-500/30';
  return 'bg-[#e94560]/15 border-[#e94560]/30';
}

function playoffRateColor(rate: number): string {
  if (rate >= 0.600) return 'text-emerald-400';
  if (rate >= 0.400) return 'text-amber-400';
  return 'text-[#e94560]';
}

function playoffRateBg(rate: number): string {
  if (rate >= 0.600) return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300';
  if (rate >= 0.400) return 'bg-amber-500/15 border-amber-500/30 text-amber-300';
  return 'bg-[#e94560]/15 border-[#e94560]/30 text-red-300';
}

// ─── Strength bar visual ───────────────────────────────────────────────────────

function StrengthBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Projected strength: ${value} out of 10`}>
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }).map((_, i) => {
          const filled = i < value;
          return (
            <div
              key={i}
              className={cn(
                'w-2.5 h-2.5 rounded-sm transition-colors',
                filled
                  ? value >= 8
                    ? 'bg-[#ffd700]'
                    : value >= 6
                    ? 'bg-emerald-500'
                    : value >= 4
                    ? 'bg-amber-500'
                    : 'bg-[#e94560]'
                  : 'bg-[#2d4a66]/50'
              )}
            />
          );
        })}
      </div>
      <span className={cn('text-xs font-bold tabular-nums', strengthColor(value))}>
        {value}/10
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PlayoffProbabilityPage() {
  const [sortBy, setSortBy] = useState<'standing' | 'playoffRate' | 'strength' | 'careerWinPct'>('standing');
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null);

  const sorted = useMemo(() => {
    const arr = [...OWNERS];
    if (sortBy === 'standing')      return arr.sort((a, b) => a.standing2025 - b.standing2025);
    if (sortBy === 'playoffRate')   return arr.sort((a, b) => b.playoffRate - a.playoffRate);
    if (sortBy === 'strength')      return arr.sort((a, b) => b.projectedStrength - a.projectedStrength);
    if (sortBy === 'careerWinPct')  return arr.sort((a, b) => b.careerWinPct - a.careerWinPct);
    return arr;
  }, [sortBy]);

  const selectedData = selectedOwner ? OWNERS.find(o => o.name === selectedOwner) : null;

  return (
    <>
      <Head>
        <title>Playoff Probability — BMFFFL Analytics</title>
        <meta
          name="description"
          content="2026 BMFFFL playoff probability analysis — historical playoff rates, projected team strength, 2025 final standings, and playoff field predictor."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Header */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <Target className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            Playoff Probability
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            2026 pre-season outlook — historical playoff rates, roster strength projections, and 2025 final standings for all 12 BMFFFL teams.
          </p>
        </header>

        {/* 2025 Final Standings */}
        <section className="mb-10" aria-labelledby="standings-2025-heading">
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#2d4a66] flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#1a1a2e] border border-[#2d4a66] shrink-0">
                <Trophy className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
              </div>
              <div>
                <h2 id="standings-2025-heading" className="text-base font-bold text-white leading-tight">
                  2025 Final Standings &amp; Playoff Results
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Top 6 seeds qualified for playoffs &mdash; tdtd19844 won championship as 4th seed
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
              {/* Playoff seeds */}
              <div className="border-b sm:border-b-0 sm:border-r border-[#2d4a66]">
                <p className="px-5 pt-4 pb-2 text-xs text-slate-500 uppercase tracking-wider font-semibold">Playoff Teams (Seeds 1–6)</p>
                <div className="divide-y divide-[#1e3347]">
                  {PLAYOFF_2025.map(team => {
                    const isChamp = team.result.includes('Champion');
                    const isRunnerUp = team.result.includes('Runner-Up');
                    const owner = OWNERS.find(o => o.name === team.name);
                    return (
                      <div
                        key={team.name}
                        className={cn(
                          'flex items-center gap-3 px-5 py-3',
                          isChamp ? 'bg-[#ffd700]/8' : isRunnerUp ? 'bg-slate-400/5' : ''
                        )}
                      >
                        <span className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0',
                          team.seed === 1 ? 'bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/30' :
                          'bg-[#2d4a66]/50 text-slate-400 border border-[#2d4a66]'
                        )}>
                          {team.seed}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={cn('text-sm font-bold', owner?.color ?? 'text-white')}>
                              {team.name}
                            </span>
                            {isChamp && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#ffd700]/20 text-[#ffd700] font-bold uppercase tracking-wider border border-[#ffd700]/30">
                                Champion
                              </span>
                            )}
                            {isRunnerUp && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-400/15 text-slate-300 font-bold uppercase tracking-wider border border-slate-400/20">
                                Runner-Up
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-mono text-slate-400 tabular-nums">{team.record}</span>
                            <span className="text-xs text-slate-600">&mdash; {team.result}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Missed playoffs */}
              <div>
                <p className="px-5 pt-4 pb-2 text-xs text-slate-500 uppercase tracking-wider font-semibold">Missed Playoffs (7th–12th)</p>
                <div className="divide-y divide-[#1e3347]">
                  {OWNERS.filter(o => !o.playoff2025).sort((a, b) => a.standing2025 - b.standing2025).map(owner => (
                    <div key={owner.name} className="flex items-center gap-3 px-5 py-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 bg-[#2d4a66]/30 text-slate-600 border border-[#2d4a66]/50">
                        {owner.standing2025}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className={cn('text-sm font-bold', owner.color)}>{owner.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-mono text-slate-500 tabular-nums">{owner.record2025}</span>
                          <span className="text-xs text-[#e94560]/70">Missed playoffs</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Controls */}
        <section className="mb-5 flex flex-col sm:flex-row gap-4 sm:items-end sm:justify-between" aria-label="Controls">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Sort table by</p>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Sort options">
              {([
                ['standing',    '2025 Standing'],
                ['playoffRate', 'Playoff Rate'],
                ['strength',    '2026 Strength'],
                ['careerWinPct','Career Win %'],
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSortBy(key)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150',
                    sortBy === key
                      ? 'bg-[#ffd700] text-[#0d1b2a] border-[#ffd700]'
                      : 'bg-[#16213e] text-slate-400 border-[#2d4a66] hover:border-[#ffd700]/40 hover:text-white'
                  )}
                  aria-pressed={sortBy === key}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 items-center text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-500/20 border border-emerald-500/30 shrink-0" />
              Rate ≥ .600
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-amber-500/20 border border-amber-500/30 shrink-0" />
              Rate .400–.599
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#e94560]/20 border border-[#e94560]/30 shrink-0" />
              Rate &lt; .400
            </span>
          </div>
        </section>

        {/* Main data table */}
        <section aria-labelledby="main-table-heading">
          <h2 id="main-table-heading" className="sr-only">Playoff probability and strength table</h2>
          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm" aria-label="Team playoff probability and strength ratings">
                <thead>
                  <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider sticky left-0 bg-[#0f2744] z-10 w-40">
                      Team
                    </th>
                    <th scope="col" className="px-3 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider whitespace-nowrap">
                      Career Record
                    </th>
                    <th scope="col" className="px-3 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider whitespace-nowrap">
                      Win %
                    </th>
                    <th scope="col" className="px-3 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider whitespace-nowrap">
                      Playoff Rate
                    </th>
                    <th scope="col" className="px-3 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider whitespace-nowrap">
                      Appearances
                    </th>
                    <th scope="col" className="px-3 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider whitespace-nowrap">
                      Titles
                    </th>
                    <th scope="col" className="px-3 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider w-52">
                      2026 Strength
                    </th>
                    <th scope="col" className="px-3 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">
                      2025 Record
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3347]">
                  {sorted.map((owner, idx) => {
                    const isSelected = selectedOwner === owner.name;
                    const isDimmed = selectedOwner !== null && !isSelected;
                    const isEven = idx % 2 === 0;

                    return (
                      <tr
                        key={owner.name}
                        className={cn(
                          'transition-all duration-150 cursor-pointer',
                          isDimmed ? 'opacity-30' : '',
                          isSelected
                            ? `${owner.bgColor} ring-1 ring-inset ${owner.borderColor}`
                            : isEven ? 'bg-[#1a2d42] hover:bg-[#1f3550]' : 'bg-[#162638] hover:bg-[#1f3550]'
                        )}
                        onClick={() => setSelectedOwner(selectedOwner === owner.name ? null : owner.name)}
                        role="button"
                        tabIndex={0}
                        aria-label={`Toggle details for ${owner.name}`}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setSelectedOwner(selectedOwner === owner.name ? null : owner.name);
                          }
                        }}
                      >
                        {/* Team name */}
                        <td className={cn(
                          'px-4 py-3 sticky left-0 z-10',
                          isSelected ? owner.bgColor : isEven ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                        )}>
                          <span className={cn('text-sm font-bold leading-tight', owner.color)}>
                            {owner.name}
                          </span>
                          {owner.championships > 0 && (
                            <span className="ml-1.5 text-[10px] text-[#ffd700] opacity-70">
                              {'★'.repeat(owner.championships)}
                            </span>
                          )}
                          {owner.seasons < 6 && (
                            <div className="text-[10px] text-slate-600 font-medium">
                              {owner.seasons} seasons
                            </div>
                          )}
                        </td>

                        {/* Career record */}
                        <td className="px-3 py-3 text-center">
                          <span className="text-xs font-mono tabular-nums text-slate-300">
                            {owner.careerWins}-{owner.careerLosses}
                          </span>
                        </td>

                        {/* Career win % */}
                        <td className="px-3 py-3 text-center">
                          <span className={cn(
                            'text-xs font-bold tabular-nums',
                            owner.careerWinPct >= 0.600 ? 'text-[#ffd700]' :
                            owner.careerWinPct >= 0.500 ? 'text-emerald-400' : 'text-[#e94560]'
                          )}>
                            {owner.careerWinPct.toFixed(3).replace(/^0/, '')}
                          </span>
                        </td>

                        {/* Playoff rate */}
                        <td className="px-3 py-3 text-center">
                          <span className={cn(
                            'inline-flex items-center justify-center px-2 py-1 rounded text-[11px] font-bold border tabular-nums',
                            playoffRateBg(owner.playoffRate)
                          )}>
                            {owner.playoffRate.toFixed(3).replace(/^0/, '')}
                          </span>
                        </td>

                        {/* Appearances */}
                        <td className="px-3 py-3 text-center">
                          <span className="text-xs font-semibold text-slate-300 tabular-nums">
                            {owner.playoffAppearances}/{owner.seasons}
                          </span>
                        </td>

                        {/* Championships */}
                        <td className="px-3 py-3 text-center">
                          {owner.championships > 0 ? (
                            <span className="text-xs font-bold text-[#ffd700] tabular-nums">
                              {owner.championships}
                            </span>
                          ) : owner.runnerUps > 0 ? (
                            <span className="text-xs font-semibold text-slate-400 tabular-nums">
                              {owner.runnerUps} RU
                            </span>
                          ) : (
                            <span className="text-xs text-slate-600">—</span>
                          )}
                        </td>

                        {/* 2026 Strength */}
                        <td className="px-3 py-3">
                          <StrengthBar value={owner.projectedStrength} />
                        </td>

                        {/* 2025 record */}
                        <td className="px-3 py-3 text-center hidden lg:table-cell">
                          <div className="flex flex-col items-center gap-0.5">
                            <span className={cn(
                              'text-[11px] font-bold font-mono tabular-nums',
                              owner.playoff2025 ? 'text-emerald-400' : 'text-slate-500'
                            )}>
                              {owner.record2025}
                            </span>
                            <span className={cn(
                              'text-[10px]',
                              owner.playoff2025 ? 'text-emerald-600' : 'text-slate-700'
                            )}>
                              {owner.playoff2025 ? 'Playoff' : 'Missed'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Selected team detail panel */}
        {selectedData && (
          <section
            className={cn('mt-5 rounded-xl border p-5', selectedData.borderColor, selectedData.bgColor)}
            aria-label={`${selectedData.name} detailed breakdown`}
          >
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h2 className={cn('text-base font-bold', selectedData.color)}>{selectedData.name}</h2>
                  <StrengthBar value={selectedData.projectedStrength} />
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-3">{selectedData.strengthNote}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Career', value: `${selectedData.careerWins}-${selectedData.careerLosses}` },
                    { label: 'Win %', value: selectedData.careerWinPct.toFixed(3).replace(/^0/, '') },
                    { label: 'Playoff Rate', value: selectedData.playoffRate.toFixed(3).replace(/^0/, '') },
                    { label: 'Titles', value: selectedData.championships === 0 ? '0' : `${selectedData.championships}` },
                  ].map(stat => (
                    <div key={stat.label} className="bg-[#0d1b2a]/50 rounded-lg px-3 py-2 text-center border border-[#2d4a66]/50">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">{stat.label}</div>
                      <div className={cn('text-sm font-bold tabular-nums', selectedData.color)}>{stat.value}</div>
                    </div>
                  ))}
                </div>
                {selectedData.draftCapital2026 && (
                  <p className="mt-3 text-xs text-slate-500">
                    <span className="text-slate-400 font-semibold">2026 Draft Capital:</span>{' '}
                    {selectedData.draftCapital2026}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 2026 Playoff Field Predictor */}
        <section className="mt-10" aria-labelledby="predictor-heading">
          <h2 id="predictor-heading" className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            2026 Playoff Field Predictor
          </h2>
          <p className="text-sm text-slate-500 mb-5 max-w-2xl">
            Based on projected 2026 strength ratings, historical playoff rates, and roster construction — these are the projected 6 playoff teams entering the 2026 season.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Projected In */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
                Projected In (6 Teams)
              </p>
              <div className="space-y-2">
                {[
                  { name: 'MLSchools12',    strength: 9,  note: 'Perennial #1 seed',           color: 'text-[#ffd700]' },
                  { name: 'Tubes94',        strength: 9,  note: 'Dynasty Rank #2 ascending',    color: 'text-rose-400' },
                  { name: 'JuicyBussy',     strength: 8,  note: 'Elite QB-WR stack',            color: 'text-emerald-400' },
                  { name: 'tdtd19844',      strength: 8,  note: 'Reigning champion momentum',   color: 'text-amber-400' },
                  { name: 'SexMachineAndyD',strength: 7,  note: 'Consistent floor every year',  color: 'text-blue-400' },
                  { name: 'rbr',            strength: 7,  note: 'Mahomes + hungry after 2 RU',  color: 'text-orange-400' },
                ].map((t, i) => (
                  <div key={t.name} className="flex items-center gap-3 py-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[10px] font-black text-emerald-400 shrink-0">
                      {i + 1}
                    </span>
                    <span className={cn('text-sm font-bold min-w-0 flex-1', t.color)}>{t.name}</span>
                    <span className={cn('text-xs font-bold tabular-nums shrink-0', strengthColor(t.strength))}>
                      {t.strength}/10
                    </span>
                    <span className="text-[11px] text-slate-500 hidden sm:block min-w-0 truncate max-w-[140px]">{t.note}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Projected Out / On the Bubble */}
            <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2d4a66] shrink-0" aria-hidden="true" />
                Bubble Teams &amp; Longshots
              </p>
              <div className="space-y-2">
                {[
                  { name: 'Grandes',    strength: 7,  note: 'Wild card — won champ as bubble team before',  color: 'text-purple-400',  bubble: true },
                  { name: 'eldridm20',  strength: 6,  note: 'Josh Allen carries — needs depth to hold',      color: 'text-lime-400',    bubble: true },
                  { name: 'Cmaleski',   strength: 6,  note: '1.01 pick changes everything if hit',           color: 'text-indigo-400',  bubble: false },
                  { name: 'eldridsm',   strength: 5,  note: 'Two straight misses — needs roster surgery',    color: 'text-cyan-400',    bubble: false },
                  { name: 'Cogdeill11', strength: 5,  note: 'Elite assets, zero playoffs since 2020',        color: 'text-[#e94560]',   bubble: false },
                  { name: 'Escuelas',   strength: 3,  note: 'Zero career playoff appearances — long rebuild', color: 'text-slate-400',   bubble: false },
                ].map((t, i) => (
                  <div key={t.name} className="flex items-center gap-3 py-1">
                    <span className={cn(
                      'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0',
                      t.bubble
                        ? 'bg-amber-500/20 border border-amber-500/30 text-amber-400'
                        : 'bg-[#2d4a66]/50 border border-[#2d4a66] text-slate-600'
                    )}>
                      {i + 7}
                    </span>
                    <span className={cn('text-sm font-bold min-w-0 flex-1', t.color)}>{t.name}</span>
                    <span className={cn('text-xs font-bold tabular-nums shrink-0', strengthColor(t.strength))}>
                      {t.strength}/10
                    </span>
                    <span className="text-[11px] text-slate-500 hidden sm:block min-w-0 truncate max-w-[140px]">{t.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Historical notes */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                title: 'Always In',
                desc: 'MLSchools12 (6/6), JuicyBussy (5/6), and SexMachineAndyD (4/6) have the highest historical appearance rates.',
                color: 'border-[#ffd700]/20 bg-[#ffd700]/5',
                textColor: 'text-[#ffd700]',
              },
              {
                title: 'Wild Card Watch',
                desc: 'Cmaleski holds the 1.01 pick. A hit on that selection could instantly change their 2026 trajectory.',
                color: 'border-amber-500/20 bg-amber-500/5',
                textColor: 'text-amber-400',
              },
              {
                title: 'Surprise Threat',
                desc: 'Cogdeill11 owns Omarion Hampton + Ja\'Marr Chase — two top-15 dynasty assets. A hot streak could end the drought.',
                color: 'border-[#e94560]/20 bg-[#e94560]/5',
                textColor: 'text-[#e94560]',
              },
            ].map(card => (
              <div key={card.title} className={cn('rounded-xl border p-4', card.color)}>
                <p className={cn('text-xs font-bold uppercase tracking-widest mb-2', card.textColor)}>{card.title}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Season calendar context */}
        <section className="mt-10" aria-labelledby="calendar-heading">
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5">
            <h2 id="calendar-heading" className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" aria-hidden="true" />
              2026 Season Calendar
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { phase: 'Now',          label: 'Free Agency / Offseason', note: 'March 2026 — dynasty market active', active: true },
                { phase: 'April',        label: '2026 NFL Draft',          note: 'Cmaleski picks 1.01 — huge value swing', active: false },
                { phase: 'May–Aug',      label: 'BMFFFL Rookie Draft',     note: 'Dynasty rookie picks in', active: false },
                { phase: 'Sep',          label: 'Season Kickoff',          note: 'Week 1 — all projections go out the window', active: false },
              ].map(item => (
                <div key={item.phase} className={cn(
                  'rounded-lg border p-3',
                  item.active ? 'border-[#ffd700]/30 bg-[#ffd700]/8' : 'border-[#2d4a66]/60 bg-[#0d1b2a]/50'
                )}>
                  <div className={cn('text-[10px] font-bold uppercase tracking-widest mb-1', item.active ? 'text-[#ffd700]' : 'text-slate-600')}>
                    {item.phase}
                  </div>
                  <div className={cn('text-xs font-semibold mb-1', item.active ? 'text-white' : 'text-slate-400')}>
                    {item.label}
                  </div>
                  <div className="text-[11px] text-slate-600 leading-snug">{item.note}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="mt-8 rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="text-slate-400 font-semibold">Disclaimer:</span>{' '}
            Projections based on historical patterns and 2026 roster data. Actual outcomes determined on the field.
            Strength ratings are qualitative estimates based on dynasty rankings, draft capital, and roster age profiles — not algorithmic outputs.
            Click any row in the table above to see a detailed breakdown for that team.
          </p>
        </div>

      </div>
    </>
  );
}
