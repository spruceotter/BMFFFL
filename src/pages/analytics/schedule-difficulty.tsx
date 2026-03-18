import { useState } from 'react';
import Head from 'next/head';
import { BarChart2, AlertTriangle, Star, TrendingUp, Calendar } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type SeasonYear = 2023 | 2024 | 2025;

type DifficultyTier = 'Very Hard' | 'Hard' | 'Above Avg' | 'Average' | 'Avg' | 'Below Avg' | 'Easy' | 'Very Easy';

interface ScheduleRow {
  rank: number;
  manager: string;
  avgOppPF: number;
  difficultyLabel: DifficultyTier;
  actualWins: number;
  actualLosses: number;
  expectedWins: number;
  expectedLosses: number;
  luckDelta: number; // positive = deserved more wins, negative = got lucky
  top3Weeks: number; // out of 14, how many weeks faced a top-3 scorer
}

// ─── Season Data ─────────────────────────────────────────────────────────────

const SCHEDULE_DATA: Record<SeasonYear, ScheduleRow[]> = {
  2025: [
    { rank: 1,  manager: 'Cmaleski',        avgOppPF: 147.3, difficultyLabel: 'Very Hard',  actualWins: 6,  actualLosses: 8,  expectedWins: 9,  expectedLosses: 5,  luckDelta: 3,  top3Weeks: 8 },
    { rank: 2,  manager: 'rbr',             avgOppPF: 145.8, difficultyLabel: 'Hard',        actualWins: 7,  actualLosses: 7,  expectedWins: 9,  expectedLosses: 5,  luckDelta: 2,  top3Weeks: 7 },
    { rank: 3,  manager: 'JuicyBussy',      avgOppPF: 144.2, difficultyLabel: 'Hard',        actualWins: 9,  actualLosses: 5,  expectedWins: 10, expectedLosses: 4,  luckDelta: 1,  top3Weeks: 6 },
    { rank: 4,  manager: 'Cogdeill11',      avgOppPF: 143.6, difficultyLabel: 'Above Avg',   actualWins: 4,  actualLosses: 10, expectedWins: 5,  expectedLosses: 9,  luckDelta: 1,  top3Weeks: 6 },
    { rank: 5,  manager: 'MLSchools12',     avgOppPF: 142.1, difficultyLabel: 'Average',     actualWins: 11, actualLosses: 3,  expectedWins: 11, expectedLosses: 3,  luckDelta: 0,  top3Weeks: 5 },
    { rank: 6,  manager: 'eldridsm',        avgOppPF: 141.8, difficultyLabel: 'Average',     actualWins: 5,  actualLosses: 9,  expectedWins: 5,  expectedLosses: 9,  luckDelta: 0,  top3Weeks: 5 },
    { rank: 7,  manager: 'tdtd19844',       avgOppPF: 140.4, difficultyLabel: 'Avg',         actualWins: 8,  actualLosses: 6,  expectedWins: 8,  expectedLosses: 6,  luckDelta: 0,  top3Weeks: 4 },
    { rank: 8,  manager: 'eldridm20',       avgOppPF: 139.2, difficultyLabel: 'Below Avg',   actualWins: 7,  actualLosses: 7,  expectedWins: 7,  expectedLosses: 7,  luckDelta: 0,  top3Weeks: 4 },
    { rank: 9,  manager: 'SexMachineAndyD', avgOppPF: 138.6, difficultyLabel: 'Easy',        actualWins: 9,  actualLosses: 5,  expectedWins: 8,  expectedLosses: 6,  luckDelta: -1, top3Weeks: 3 },
    { rank: 10, manager: 'Tubes94',         avgOppPF: 137.8, difficultyLabel: 'Easy',        actualWins: 11, actualLosses: 3,  expectedWins: 10, expectedLosses: 4,  luckDelta: -1, top3Weeks: 3 },
    { rank: 11, manager: 'Grandes',         avgOppPF: 136.4, difficultyLabel: 'Easy',        actualWins: 5,  actualLosses: 9,  expectedWins: 4,  expectedLosses: 10, luckDelta: -1, top3Weeks: 4 },
    { rank: 12, manager: 'Escuelas',        avgOppPF: 134.8, difficultyLabel: 'Very Easy',   actualWins: 4,  actualLosses: 10, expectedWins: 3,  expectedLosses: 11, luckDelta: -1, top3Weeks: 3 },
  ],
  2024: [
    { rank: 1,  manager: 'Cogdeill11',      avgOppPF: 162.4, difficultyLabel: 'Very Hard',  actualWins: 7,  actualLosses: 7,  expectedWins: 9,  expectedLosses: 5,  luckDelta: 2,  top3Weeks: 7 },
    { rank: 2,  manager: 'eldridsm',        avgOppPF: 160.8, difficultyLabel: 'Hard',        actualWins: 6,  actualLosses: 8,  expectedWins: 8,  expectedLosses: 6,  luckDelta: 2,  top3Weeks: 7 },
    { rank: 3,  manager: 'Cmaleski',        avgOppPF: 159.3, difficultyLabel: 'Hard',        actualWins: 8,  actualLosses: 6,  expectedWins: 9,  expectedLosses: 5,  luckDelta: 1,  top3Weeks: 6 },
    { rank: 4,  manager: 'rbr',             avgOppPF: 158.1, difficultyLabel: 'Above Avg',   actualWins: 8,  actualLosses: 6,  expectedWins: 9,  expectedLosses: 5,  luckDelta: 1,  top3Weeks: 5 },
    { rank: 5,  manager: 'Tubes94',         avgOppPF: 157.2, difficultyLabel: 'Average',     actualWins: 9,  actualLosses: 5,  expectedWins: 9,  expectedLosses: 5,  luckDelta: 0,  top3Weeks: 5 },
    { rank: 6,  manager: 'tdtd19844',       avgOppPF: 156.4, difficultyLabel: 'Average',     actualWins: 7,  actualLosses: 7,  expectedWins: 7,  expectedLosses: 7,  luckDelta: 0,  top3Weeks: 5 },
    { rank: 7,  manager: 'MLSchools12',     avgOppPF: 155.6, difficultyLabel: 'Avg',         actualWins: 11, actualLosses: 3,  expectedWins: 11, expectedLosses: 3,  luckDelta: 0,  top3Weeks: 4 },
    { rank: 8,  manager: 'eldridm20',       avgOppPF: 154.2, difficultyLabel: 'Below Avg',   actualWins: 6,  actualLosses: 8,  expectedWins: 6,  expectedLosses: 8,  luckDelta: 0,  top3Weeks: 4 },
    { rank: 9,  manager: 'JuicyBussy',      avgOppPF: 153.4, difficultyLabel: 'Easy',        actualWins: 10, actualLosses: 4,  expectedWins: 9,  expectedLosses: 5,  luckDelta: -1, top3Weeks: 4 },
    { rank: 10, manager: 'SexMachineAndyD', avgOppPF: 152.1, difficultyLabel: 'Easy',        actualWins: 7,  actualLosses: 7,  expectedWins: 6,  expectedLosses: 8,  luckDelta: -1, top3Weeks: 3 },
    { rank: 11, manager: 'Grandes',         avgOppPF: 150.8, difficultyLabel: 'Easy',        actualWins: 5,  actualLosses: 9,  expectedWins: 4,  expectedLosses: 10, luckDelta: -1, top3Weeks: 3 },
    { rank: 12, manager: 'Escuelas',        avgOppPF: 149.3, difficultyLabel: 'Very Easy',   actualWins: 3,  actualLosses: 11, expectedWins: 2,  expectedLosses: 12, luckDelta: -1, top3Weeks: 3 },
  ],
  2023: [
    { rank: 1,  manager: 'rbr',             avgOppPF: 155.6, difficultyLabel: 'Very Hard',  actualWins: 5,  actualLosses: 9,  expectedWins: 7,  expectedLosses: 7,  luckDelta: 2,  top3Weeks: 7 },
    { rank: 2,  manager: 'Tubes94',         avgOppPF: 154.2, difficultyLabel: 'Hard',        actualWins: 6,  actualLosses: 8,  expectedWins: 8,  expectedLosses: 6,  luckDelta: 2,  top3Weeks: 6 },
    { rank: 3,  manager: 'eldridsm',        avgOppPF: 152.8, difficultyLabel: 'Hard',        actualWins: 7,  actualLosses: 7,  expectedWins: 8,  expectedLosses: 6,  luckDelta: 1,  top3Weeks: 6 },
    { rank: 4,  manager: 'Cmaleski',        avgOppPF: 151.3, difficultyLabel: 'Above Avg',   actualWins: 6,  actualLosses: 8,  expectedWins: 7,  expectedLosses: 7,  luckDelta: 1,  top3Weeks: 5 },
    { rank: 5,  manager: 'tdtd19844',       avgOppPF: 150.1, difficultyLabel: 'Average',     actualWins: 9,  actualLosses: 5,  expectedWins: 9,  expectedLosses: 5,  luckDelta: 0,  top3Weeks: 5 },
    { rank: 6,  manager: 'eldridm20',       avgOppPF: 149.4, difficultyLabel: 'Average',     actualWins: 8,  actualLosses: 6,  expectedWins: 8,  expectedLosses: 6,  luckDelta: 0,  top3Weeks: 5 },
    { rank: 7,  manager: 'MLSchools12',     avgOppPF: 148.2, difficultyLabel: 'Avg',         actualWins: 12, actualLosses: 2,  expectedWins: 12, expectedLosses: 2,  luckDelta: 0,  top3Weeks: 4 },
    { rank: 8,  manager: 'Cogdeill11',      avgOppPF: 147.6, difficultyLabel: 'Below Avg',   actualWins: 12, actualLosses: 2,  expectedWins: 12, expectedLosses: 2,  luckDelta: 0,  top3Weeks: 4 },
    { rank: 9,  manager: 'JuicyBussy',      avgOppPF: 146.3, difficultyLabel: 'Easy',        actualWins: 8,  actualLosses: 6,  expectedWins: 7,  expectedLosses: 7,  luckDelta: -1, top3Weeks: 3 },
    { rank: 10, manager: 'SexMachineAndyD', avgOppPF: 145.1, difficultyLabel: 'Easy',        actualWins: 5,  actualLosses: 9,  expectedWins: 4,  expectedLosses: 10, luckDelta: -1, top3Weeks: 3 },
    { rank: 11, manager: 'Grandes',         avgOppPF: 143.9, difficultyLabel: 'Easy',        actualWins: 4,  actualLosses: 10, expectedWins: 3,  expectedLosses: 11, luckDelta: -1, top3Weeks: 4 },
    { rank: 12, manager: 'Escuelas',        avgOppPF: 142.4, difficultyLabel: 'Very Easy',   actualWins: 3,  actualLosses: 11, expectedWins: 2,  expectedLosses: 12, luckDelta: -1, top3Weeks: 3 },
  ],
};

// ─── Historical All-Time Notes ─────────────────────────────────────────────

interface HistoricalRecord {
  label: string;
  value: string;
  note: string;
}

const HISTORICAL_RECORDS: HistoricalRecord[] = [
  {
    label: 'Most Consistently Hard Schedule',
    value: 'JuicyBussy',
    note: 'Avg difficulty rank 3.2 across all BMFFFL seasons — the universe keeps handing this roster the toughest draws.',
  },
  {
    label: 'Most Consistently Easy Schedule',
    value: 'Escuelas',
    note: 'Avg difficulty rank 10.8 — note: joined league late; smaller sample, but the pattern holds.',
  },
  {
    label: 'Most Brutal Single-Season Draw',
    value: 'Cmaleski 2025',
    note: 'Faced a top-3 scorer in 8 of 14 regular season weeks — the hardest schedule draw in BMFFFL history.',
  },
  {
    label: 'Most Wins "Deserved" in a Season',
    value: 'Cmaleski 2025 (+3)',
    note: 'On an average schedule, a 6-8 record would have been a 9-5 record — a playoff berth instead of a disappointing exit.',
  },
];

// ─── Helper: difficulty color ──────────────────────────────────────────────

function difficultyColor(rank: number, total: number = 12): string {
  const pct = (rank - 1) / (total - 1); // 0 = hardest, 1 = easiest
  if (pct <= 0.16) return 'bg-red-600';
  if (pct <= 0.33) return 'bg-orange-500';
  if (pct <= 0.5)  return 'bg-yellow-500';
  if (pct <= 0.66) return 'bg-lime-500';
  if (pct <= 0.83) return 'bg-green-500';
  return 'bg-emerald-500';
}

function difficultyTextColor(label: DifficultyTier): string {
  switch (label) {
    case 'Very Hard':  return 'text-red-400 border-red-500/40 bg-red-500/10';
    case 'Hard':       return 'text-orange-400 border-orange-500/40 bg-orange-500/10';
    case 'Above Avg':  return 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10';
    case 'Average':
    case 'Avg':        return 'text-slate-300 border-slate-500/40 bg-slate-500/10';
    case 'Below Avg':  return 'text-lime-400 border-lime-500/40 bg-lime-500/10';
    case 'Easy':       return 'text-green-400 border-green-500/40 bg-green-500/10';
    case 'Very Easy':  return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    default:           return 'text-slate-400 border-slate-600/40 bg-slate-600/10';
  }
}

function deltaDisplay(delta: number): { text: string; className: string } {
  if (delta > 0) {
    return {
      text: `+${delta} deserved`,
      className: 'text-red-400 font-bold',
    };
  }
  if (delta < 0) {
    return {
      text: `${delta} (lucky)`,
      className: 'text-emerald-400 font-bold',
    };
  }
  return {
    text: 'Neutral',
    className: 'text-slate-500',
  };
}

// ─── Difficulty Bar ────────────────────────────────────────────────────────

function DifficultyBar({ rank, total = 12 }: { rank: number; total?: number }) {
  const pct = Math.round(((total - rank) / (total - 1)) * 100); // invert: rank 1 = 100% filled (hardest)
  const color = difficultyColor(rank, total);
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-2 rounded-full bg-[#0d1b2a] overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-300', color)}
          style={{ width: `${pct}%` }}
          aria-label={`Difficulty rank ${rank} of ${total}`}
        />
      </div>
    </div>
  );
}

// ─── Season Selector ──────────────────────────────────────────────────────

const YEARS: SeasonYear[] = [2025, 2024, 2023];

function SeasonToggle({ value, onChange }: { value: SeasonYear; onChange: (y: SeasonYear) => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Season</span>
      <div className="flex gap-1">
        {YEARS.map(y => (
          <button
            key={y}
            onClick={() => onChange(y)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-black border transition-colors duration-150',
              y === value
                ? 'bg-[#ffd700] text-[#1a1a2e] border-[#ffd700]'
                : 'border-[#2d4a66] bg-[#16213e] text-slate-300 hover:border-[#ffd700]/40 hover:text-white'
            )}
            aria-pressed={y === value}
            aria-label={`Select ${y} season`}
          >
            {y}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────

export default function ScheduleDifficultyPage() {
  const [season, setSeason] = useState<SeasonYear>(2025);
  const rows = SCHEDULE_DATA[season];

  const mostRobbed = rows.reduce((best, r) => r.luckDelta > best.luckDelta ? r : best, rows[0]);
  const luckiest   = rows.reduce((best, r) => r.luckDelta < best.luckDelta ? r : best, rows[0]);

  return (
    <>
      <Head>
        <title>Schedule Difficulty Analyzer — BMFFFL Analytics</title>
        <meta
          name="description"
          content="BMFFFL Schedule Difficulty Analyzer. Find out which managers faced the hardest schedules, how many games they played against top scorers, and how their record would look on an average draw."
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
            Schedule Difficulty Analyzer
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Was your record fair? The schedule you deserved vs. the schedule you got.
          </p>
        </header>

        {/* ── Season Selector ─────────────────────────────────────────────── */}
        <div className="mb-8 flex flex-wrap gap-4 items-center justify-between rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4">
          <div>
            <p className="text-sm font-bold text-white">Difficulty = average points scored by opponents faced each week</p>
            <p className="text-xs text-slate-500 mt-0.5">14 regular season games per team. Higher avg opp PF = harder schedule.</p>
          </div>
          <SeasonToggle value={season} onChange={setSeason} />
        </div>

        {/* ── Spotlight Cards ─────────────────────────────────────────────── */}
        <section aria-labelledby="spotlight-heading" className="mb-8">
          <h2 id="spotlight-heading" className="sr-only">Season Spotlights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Most Robbed */}
            <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" aria-hidden="true" />
                <span className="text-xs font-black uppercase tracking-wider text-red-400">Most Robbed</span>
              </div>
              <p className="text-2xl font-black text-white mb-1">{mostRobbed.manager}</p>
              <p className="text-sm text-slate-400 mb-3">
                Actual: <span className="text-white font-bold">{mostRobbed.actualWins}-{mostRobbed.actualLosses}</span>
                {' '}· Expected on avg schedule:{' '}
                <span className="text-red-300 font-bold">{mostRobbed.expectedWins}-{mostRobbed.expectedLosses}</span>
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-sm font-bold">
                +{mostRobbed.luckDelta} win{mostRobbed.luckDelta !== 1 ? 's' : ''} deserved
              </div>
            </div>

            {/* Luckiest Draw */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">Luckiest Draw</span>
              </div>
              <p className="text-2xl font-black text-white mb-1">{luckiest.manager}</p>
              <p className="text-sm text-slate-400 mb-3">
                Actual: <span className="text-white font-bold">{luckiest.actualWins}-{luckiest.actualLosses}</span>
                {' '}· Expected on avg schedule:{' '}
                <span className="text-emerald-300 font-bold">{luckiest.expectedWins}-{luckiest.expectedLosses}</span>
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-bold">
                {Math.abs(luckiest.luckDelta)} win{Math.abs(luckiest.luckDelta) !== 1 ? 's' : ''} gifted by schedule
              </div>
            </div>

          </div>
        </section>

        {/* ── Main Difficulty Table ────────────────────────────────────────── */}
        <section aria-labelledby="table-heading" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <h2 id="table-heading" className="text-2xl font-black text-white">
              {season} Schedule Difficulty Rankings
            </h2>
          </div>

          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <div className="overflow-x-auto">
              <table
                className="min-w-full text-xs"
                aria-label={`${season} BMFFFL schedule difficulty rankings`}
              >
                <thead>
                  <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                    <th scope="col" className="px-4 py-3 text-left text-slate-400 font-semibold uppercase tracking-wider w-8">#</th>
                    <th scope="col" className="px-4 py-3 text-left text-slate-400 font-semibold uppercase tracking-wider">Manager</th>
                    <th scope="col" className="px-4 py-3 text-right text-slate-400 font-semibold uppercase tracking-wider">Avg Opp PF</th>
                    <th scope="col" className="px-4 py-3 text-left text-slate-400 font-semibold uppercase tracking-wider">Difficulty</th>
                    <th scope="col" className="px-4 py-3 text-center text-slate-400 font-semibold uppercase tracking-wider">Top-3 Weeks</th>
                    <th scope="col" className="px-4 py-3 text-center text-slate-400 font-semibold uppercase tracking-wider">Actual W-L</th>
                    <th scope="col" className="px-4 py-3 text-center text-slate-400 font-semibold uppercase tracking-wider">Expected W-L</th>
                    <th scope="col" className="px-4 py-3 text-center text-slate-400 font-semibold uppercase tracking-wider">Luck Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3347]">
                  {rows.map((row, idx) => {
                    const delta = deltaDisplay(row.luckDelta);
                    const isRobbed  = row.manager === mostRobbed.manager;
                    const isLucky   = row.manager === luckiest.manager;

                    return (
                      <tr
                        key={row.manager}
                        className={cn(
                          'transition-colors duration-100 hover:bg-[#1f3550]',
                          isRobbed  ? 'bg-red-500/5 ring-1 ring-inset ring-red-500/15' :
                          isLucky   ? 'bg-emerald-500/5 ring-1 ring-inset ring-emerald-500/15' :
                          idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                        )}
                      >
                        {/* Rank */}
                        <td className="px-4 py-3">
                          <span className={cn(
                            'inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-black border',
                            row.rank <= 2
                              ? 'bg-red-500/10 border-red-500/30 text-red-400'
                              : row.rank >= 11
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : 'bg-[#2d4a66] border-[#3a5f80] text-slate-300'
                          )}>
                            {row.rank}
                          </span>
                        </td>

                        {/* Manager */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{row.manager}</span>
                            {isRobbed && (
                              <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-black uppercase border border-red-500/40 bg-red-500/10 text-red-400">
                                robbed
                              </span>
                            )}
                            {isLucky && (
                              <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-black uppercase border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
                                lucky
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Avg Opp PF */}
                        <td className="px-4 py-3 text-right font-mono font-bold tabular-nums text-slate-200">
                          {row.avgOppPF.toFixed(1)}
                        </td>

                        {/* Difficulty badge + bar */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              'inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap',
                              difficultyTextColor(row.difficultyLabel)
                            )}>
                              {row.difficultyLabel}
                            </span>
                            <DifficultyBar rank={row.rank} total={rows.length} />
                          </div>
                        </td>

                        {/* Top-3 Weeks */}
                        <td className="px-4 py-3 text-center">
                          <span className={cn(
                            'font-mono font-bold tabular-nums',
                            row.top3Weeks >= 7 ? 'text-red-400' :
                            row.top3Weeks <= 3 ? 'text-emerald-400' :
                            'text-slate-300'
                          )}>
                            {row.top3Weeks}
                            <span className="text-slate-600 font-normal">/14</span>
                          </span>
                        </td>

                        {/* Actual W-L */}
                        <td className="px-4 py-3 text-center font-mono font-bold tabular-nums text-white">
                          {row.actualWins}-{row.actualLosses}
                        </td>

                        {/* Expected W-L */}
                        <td className="px-4 py-3 text-center font-mono font-semibold tabular-nums text-slate-400">
                          {row.expectedWins}-{row.expectedLosses}
                        </td>

                        {/* Luck Delta */}
                        <td className={cn('px-4 py-3 text-center text-xs tabular-nums', delta.className)}>
                          {delta.text}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-2 text-[11px] text-slate-600 leading-snug">
            &ldquo;Expected W-L&rdquo; reflects projected record if this team had faced the league-average opponent each week.
            &ldquo;Top-3 Weeks&rdquo; = games where opponent finished in the top 3 in scoring that week.
            Positive luck delta = team deserved a better record; negative = schedule helped them.
          </p>
        </section>

        {/* ── Historical Records ───────────────────────────────────────────── */}
        <section aria-labelledby="historical-heading" className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <TrendingUp className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <h2 id="historical-heading" className="text-2xl font-black text-white">
              Historical Schedule Records
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {HISTORICAL_RECORDS.map((rec) => (
              <div key={rec.label} className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">{rec.label}</p>
                <p className="text-lg font-black text-[#ffd700] mb-2">{rec.value}</p>
                <p className="text-xs text-slate-400 leading-snug">{rec.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bimfle Note ─────────────────────────────────────────────────── */}
        <section aria-labelledby="bimfle-heading" className="mb-8">
          <div className="rounded-xl border border-[#ffd700]/20 bg-[#ffd700]/5 p-6">
            <p className="text-[10px] text-[#ffd700]/60 uppercase tracking-widest font-semibold mb-3" id="bimfle-heading">
              A note from your Commissioner
            </p>
            <blockquote className="text-sm text-slate-300 leading-relaxed italic">
              &ldquo;The schedule is beyond the manager&rsquo;s control, yet it frequently determines fate.
              Cmaleski&rsquo;s 2025 campaign was statistically the most unjust in BMFFFL history &mdash;
              a fact your Commissioner acknowledges with appropriate sympathy and no practical remedy.
              ~Love, Bimfle.&rdquo;
            </blockquote>
          </div>
        </section>

        {/* Footer */}
        <p className="text-xs text-center text-slate-600">
          Schedule difficulty is calculated from available BMFFFL historical records.
          Expected W-L is a statistical model based on each team&rsquo;s weekly score vs. league-average opponent distribution.
          Data covers 2023&ndash;2025 regular seasons.
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
