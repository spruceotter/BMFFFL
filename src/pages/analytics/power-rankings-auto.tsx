import Head from 'next/head';
import { Bot, Info, TrendingUp, TrendingDown, Minus, Zap, Clock, RefreshCw, Trophy } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface FormulaComponent {
  label: string;
  weight: number;
  color: string;
  description: string;
}

interface PreseasonRanking {
  rank: number;
  team: string;
  powerScore: number;
  rosterQuality: number;   // 0–100 (30% of score from pts-for analog)
  draftCapital: number;    // 0–100 (10% SOS analog)
  recentForm: number;      // 0–100
  winPct: number;          // 0–100 (wins component)
  badge?: string;
  bimfleNote: string;
}

interface WeekSnapshot {
  week: number;
  label: string;
  rankings: { rank: number; team: string; score: number; movement: number }[];
  insight: string;
}

// ─── Formula Components ────────────────────────────────────────────────────────

const FORMULA: FormulaComponent[] = [
  {
    label: 'Wins',
    weight: 40,
    color: 'bg-[#ffd700]',
    description: 'Win/loss record normalized across all 12 teams. Winning is the primary signal — schedule-adjusted.',
  },
  {
    label: 'Points For',
    weight: 30,
    color: 'bg-emerald-400',
    description: 'Total points scored season-to-date, normalized. Raw scoring output cuts through lucky wins and unlucky losses.',
  },
  {
    label: 'Recent Form',
    weight: 20,
    color: 'bg-blue-400',
    description: 'Last 3 weeks W/L/PPG weighted equally. Hot streaks matter — a team catching fire gets rewarded.',
  },
  {
    label: 'Strength of Schedule',
    weight: 10,
    color: 'bg-purple-400',
    description: "Average opponent PPG faced. Winning against strong opponents inflates your score; padding against weak ones is discounted.",
  },
];

// ─── Pre-Season Power Rankings (Season 7 Preview) ────────────────────────────

const PRESEASON_RANKINGS: PreseasonRanking[] = [
  {
    rank: 1,
    team: 'MLSchools12',
    powerScore: 94,
    rosterQuality: 96,
    draftCapital: 78,
    recentForm: 91,
    winPct: 95,
    badge: '2x Champion',
    bimfleNote: 'The historical record speaks. Extra 2027 first in hand.',
  },
  {
    rank: 2,
    team: 'Tubes94',
    powerScore: 88,
    rosterQuality: 85,
    draftCapital: 92,
    recentForm: 89,
    winPct: 82,
    badge: '2025 Runner-Up',
    bimfleNote: 'Capital-rich. The ascent from 2-12 in 2021 is a dynasty case study.',
  },
  {
    rank: 3,
    team: 'tdtd19844',
    powerScore: 85,
    rosterQuality: 88,
    draftCapital: 72,
    recentForm: 84,
    winPct: 80,
    badge: '2025 Champion',
    bimfleNote: 'Reigning champ. Repeat window is real.',
  },
  {
    rank: 4,
    team: 'SexMachineAndyD',
    powerScore: 80,
    rosterQuality: 82,
    draftCapital: 65,
    recentForm: 76,
    winPct: 78,
    bimfleNote: 'Perennially competitive. The championship drought remains the only asterisk.',
  },
  {
    rank: 5,
    team: 'JuicyBussy',
    powerScore: 76,
    rosterQuality: 79,
    draftCapital: 88,
    recentForm: 70,
    winPct: 72,
    badge: '1x Champion',
    bimfleNote: 'High ceiling roster. Holds 2027 1st from eldridsm.',
  },
  {
    rank: 6,
    team: 'rbr',
    powerScore: 68,
    rosterQuality: 71,
    draftCapital: 61,
    recentForm: 60,
    winPct: 66,
    bimfleNote: 'Two runner-ups. Roster is aging. Window may be narrowing.',
  },
  {
    rank: 7,
    team: 'Cogdeill11',
    powerScore: 62,
    rosterQuality: 64,
    draftCapital: 66,
    recentForm: 55,
    winPct: 58,
    badge: 'Founding Champion',
    bimfleNote: 'Playoff drought active. Capital stack offers a rebuild path.',
  },
  {
    rank: 8,
    team: 'Grandes',
    powerScore: 58,
    rosterQuality: 62,
    draftCapital: 64,
    recentForm: 48,
    winPct: 55,
    badge: '2025 Moodie Bowl',
    bimfleNote: 'The Moodie Bowl result has been duly noted in the official record.',
  },
  {
    rank: 9,
    team: 'eldridm20',
    powerScore: 54,
    rosterQuality: 58,
    draftCapital: 55,
    recentForm: 50,
    winPct: 50,
    bimfleNote: 'Inconsistent but dangerous. Three playoff appearances suggest the upside.',
  },
  {
    rank: 10,
    team: 'eldridsm',
    powerScore: 48,
    rosterQuality: 50,
    draftCapital: 42,
    recentForm: 44,
    winPct: 46,
    bimfleNote: '2020 runner-up. Recent form has been less distinguished. Lost 2027 1st.',
  },
  {
    rank: 11,
    team: 'Cmaleski',
    powerScore: 44,
    rosterQuality: 52,
    draftCapital: 60,
    recentForm: 42,
    winPct: 38,
    bimfleNote: '1,990 points in 2025 with a 6-8 record. The roster has more talent than the standings suggest.',
  },
  {
    rank: 12,
    team: 'Escuelas',
    powerScore: 28,
    rosterQuality: 30,
    draftCapital: 72,
    recentForm: 26,
    winPct: 22,
    bimfleNote: 'Progress is being made. The 1.01 pick is a franchise-altering asset.',
  },
];

// ─── Historical Week Snapshots (2025 Season) ──────────────────────────────────

const WEEK_SNAPSHOTS: WeekSnapshot[] = [
  {
    week: 1,
    label: 'Week 1 — Season Opener',
    rankings: [
      { rank: 1, team: 'MLSchools12',    score: 92, movement: 0 },
      { rank: 2, team: 'SexMachineAndyD', score: 84, movement: 0 },
      { rank: 3, team: 'JuicyBussy',     score: 80, movement: 0 },
      { rank: 4, team: 'rbr',            score: 76, movement: 0 },
      { rank: 5, team: 'tdtd19844',      score: 72, movement: 0 },
      { rank: 6, team: 'Grandes',        score: 68, movement: 0 },
      { rank: 7, team: 'Cogdeill11',     score: 62, movement: 0 },
      { rank: 8, team: 'eldridm20',      score: 58, movement: 0 },
      { rank: 9, team: 'eldridsm',       score: 54, movement: 0 },
      { rank: 10, team: 'Cmaleski',      score: 50, movement: 0 },
      { rank: 11, team: 'Tubes94',       score: 44, movement: 0 },
      { rank: 12, team: 'Escuelas',      score: 28, movement: 0 },
    ],
    insight: 'Pre-season consensus held at Week 1. MLSchools12 opened as the clear favourite based on roster construction.',
  },
  {
    week: 6,
    label: 'Week 6 — Midseason Shakeup',
    rankings: [
      { rank: 1, team: 'MLSchools12',    score: 91, movement: 0 },
      { rank: 2, team: 'Tubes94',        score: 85, movement: 9 },
      { rank: 3, team: 'tdtd19844',      score: 82, movement: 2 },
      { rank: 4, team: 'JuicyBussy',     score: 78, movement: -1 },
      { rank: 5, team: 'SexMachineAndyD', score: 74, movement: -3 },
      { rank: 6, team: 'Cmaleski',       score: 66, movement: 4 },
      { rank: 7, team: 'rbr',            score: 62, movement: -3 },
      { rank: 8, team: 'eldridm20',      score: 57, movement: 0 },
      { rank: 9, team: 'Grandes',        score: 52, movement: -3 },
      { rank: 10, team: 'Cogdeill11',    score: 46, movement: -3 },
      { rank: 11, team: 'eldridsm',      score: 40, movement: -2 },
      { rank: 12, team: 'Escuelas',      score: 25, movement: 0 },
    ],
    insight: 'Tubes94 surged from #11 to #2 — the most dramatic midseason rise in BMFFFL history. Cmaleski quietly climbed with elite scoring.',
  },
  {
    week: 10,
    label: 'Week 10 — Playoff Picture Forming',
    rankings: [
      { rank: 1, team: 'tdtd19844',      score: 90, movement: 2 },
      { rank: 2, team: 'MLSchools12',    score: 88, movement: -1 },
      { rank: 3, team: 'Tubes94',        score: 87, movement: 0 },
      { rank: 4, team: 'JuicyBussy',     score: 76, movement: 0 },
      { rank: 5, team: 'Cmaleski',       score: 70, movement: 1 },
      { rank: 6, team: 'SexMachineAndyD', score: 68, movement: -2 },
      { rank: 7, team: 'eldridm20',      score: 62, movement: 1 },
      { rank: 8, team: 'rbr',            score: 58, movement: -1 },
      { rank: 9, team: 'Grandes',        score: 52, movement: 0 },
      { rank: 10, team: 'Cogdeill11',    score: 44, movement: 0 },
      { rank: 11, team: 'eldridsm',      score: 38, movement: 0 },
      { rank: 12, team: 'Escuelas',      score: 24, movement: 0 },
    ],
    insight: 'tdtd19844 took the #1 spot for the first time. The three-way race at the top signalled an exceptionally competitive playoff run ahead.',
  },
  {
    week: 14,
    label: 'Week 14 — Final Regular Season',
    rankings: [
      { rank: 1, team: 'MLSchools12',    score: 94, movement: 1 },
      { rank: 2, team: 'tdtd19844',      score: 89, movement: -1 },
      { rank: 3, team: 'Tubes94',        score: 88, movement: 0 },
      { rank: 4, team: 'JuicyBussy',     score: 74, movement: 0 },
      { rank: 5, team: 'SexMachineAndyD', score: 70, movement: 1 },
      { rank: 6, team: 'Cmaleski',       score: 66, movement: -1 },
      { rank: 7, team: 'eldridm20',      score: 60, movement: 0 },
      { rank: 8, team: 'Grandes',        score: 55, movement: 1 },
      { rank: 9, team: 'rbr',            score: 54, movement: -1 },
      { rank: 10, team: 'Cogdeill11',    score: 42, movement: 0 },
      { rank: 11, team: 'eldridsm',      score: 36, movement: 0 },
      { rank: 12, team: 'Escuelas',      score: 22, movement: 0 },
    ],
    insight: 'MLSchools12 closed as power ranking leader. The eventual champion tdtd19844 entered playoffs ranked #2. Power rankings nailed the playoff bracket — the title game was exactly the #1 vs #2 matchup.',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ScoreBar({ score, color = 'bg-[#ffd700]' }: { score: number; color?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-[#0d1b2a] overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', color)}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-[10px] font-mono text-slate-500 tabular-nums w-6 text-right">{score}</span>
    </div>
  );
}

function MovementBadge({ movement }: { movement: number }) {
  if (movement > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-400">
        <TrendingUp className="w-2.5 h-2.5" aria-hidden="true" />
        +{movement}
      </span>
    );
  }
  if (movement < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#e94560]">
        <TrendingDown className="w-2.5 h-2.5" aria-hidden="true" />
        {movement}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-slate-600">
      <Minus className="w-2.5 h-2.5" aria-hidden="true" />
    </span>
  );
}

function rankMedalClass(rank: number): string {
  if (rank === 1) return 'text-[#ffd700] font-black';
  if (rank === 2) return 'text-slate-300 font-black';
  if (rank === 3) return 'text-amber-600 font-black';
  return 'text-slate-500 font-semibold';
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function PowerRankingsAutoPage() {
  return (
    <>
      <Head>
        <title>Power Rankings Automation — BMFFFL Analytics</title>
        <meta
          name="description"
          content="BMFFFL Season 7 automated power rankings system. Formula breakdown, pre-season rankings, 2025 historical snapshots, and automation design."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Header ── */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <Bot className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            Power Rankings Automation
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mb-4">
            Season 7 Preview &mdash; Stat-based weekly power rankings system
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            Manual mode &mdash; data updated at season start
          </div>
        </header>

        {/* ── Section 1: How It Works ── */}
        <section className="mb-14" aria-labelledby="formula-heading">
          <h2 id="formula-heading" className="text-xl font-black text-white mb-1">
            How It Works
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Four components are normalized 0&ndash;100 for each team, then blended using the weights below.
            Final Power Score = weighted average, scaled to 0&ndash;100.
          </p>

          {/* Formula weight bars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {FORMULA.map((f) => (
              <div
                key={f.label}
                className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-black text-white">{f.label}</h3>
                  <span className="text-2xl font-black text-[#ffd700] tabular-nums">{f.weight}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#0d1b2a] overflow-hidden mb-3">
                  <div
                    className={cn('h-full rounded-full', f.color)}
                    style={{ width: `${f.weight * 2.5}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>

          {/* Formula display */}
          <div className="rounded-xl border border-[#ffd700]/20 bg-[#ffd700]/5 p-5">
            <div className="flex items-start gap-3">
              <Info className="w-4 h-4 text-[#ffd700] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-black text-white mb-1">The Formula</p>
                <p className="text-xs text-slate-300 font-mono leading-relaxed">
                  Power Score = (Wins &times; 0.40) + (Points For &times; 0.30) + (Recent Form &times; 0.20) + (SOS &times; 0.10)
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Each component is normalized 0&ndash;100 before weighting. Raw values are
                  pulled from Sleeper each Monday morning during the season.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 2: Pre-Season Power Rankings ── */}
        <section className="mb-14" aria-labelledby="preseason-heading">
          <h2 id="preseason-heading" className="text-xl font-black text-white mb-1">
            Pre-Season Power Rankings
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Based on roster evaluation, draft capital position, and historical performance. Composite Power Score (0&ndash;100).
            No wins data yet &mdash; wins weight redistributed to roster quality and draft capital.
          </p>

          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <table className="min-w-full text-xs" aria-label="Pre-season power rankings">
              <thead>
                <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                  <th scope="col" className="px-3 py-3 text-left text-slate-400 font-semibold uppercase tracking-wider w-10">#</th>
                  <th scope="col" className="px-3 py-3 text-left text-slate-400 font-semibold uppercase tracking-wider">Team</th>
                  <th scope="col" className="px-3 py-3 text-right text-slate-400 font-semibold uppercase tracking-wider w-20">Score</th>
                  <th scope="col" className="px-3 py-3 text-left text-slate-400 font-semibold uppercase tracking-wider hidden md:table-cell">Roster</th>
                  <th scope="col" className="px-3 py-3 text-left text-slate-400 font-semibold uppercase tracking-wider hidden md:table-cell">Form</th>
                  <th scope="col" className="px-3 py-3 text-left text-slate-400 font-semibold uppercase tracking-wider hidden lg:table-cell">Capital</th>
                  <th scope="col" className="px-3 py-3 text-left text-slate-400 font-semibold uppercase tracking-wider hidden lg:table-cell">Win%</th>
                  <th scope="col" className="px-3 py-3 text-left text-slate-400 font-semibold uppercase tracking-wider hidden xl:table-cell">Bimfle Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e3347]">
                {PRESEASON_RANKINGS.map((r, idx) => (
                  <tr
                    key={r.team}
                    className={cn(
                      'transition-colors hover:bg-[#1f3550]',
                      idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                    )}
                  >
                    <td className={cn('px-3 py-3 text-sm tabular-nums', rankMedalClass(r.rank))}>
                      {r.rank}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-black text-white text-sm">{r.team}</span>
                        {r.badge && (
                          <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-[#ffd700]/10 text-[#ffd700] border border-[#ffd700]/30">
                            {r.badge}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className="text-lg font-black text-[#ffd700] tabular-nums">{r.powerScore}</span>
                    </td>
                    <td className="px-3 py-3 hidden md:table-cell w-28">
                      <ScoreBar score={r.rosterQuality} color="bg-emerald-400" />
                    </td>
                    <td className="px-3 py-3 hidden md:table-cell w-28">
                      <ScoreBar score={r.recentForm} color="bg-blue-400" />
                    </td>
                    <td className="px-3 py-3 hidden lg:table-cell w-28">
                      <ScoreBar score={r.draftCapital} color="bg-purple-400" />
                    </td>
                    <td className="px-3 py-3 hidden lg:table-cell w-28">
                      <ScoreBar score={r.winPct} color="bg-[#ffd700]" />
                    </td>
                    <td className="px-3 py-3 hidden xl:table-cell text-slate-400 text-xs italic max-w-xs">
                      {r.bimfleNote}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-[10px] text-slate-500">
            <span><span className="inline-block w-2.5 h-2.5 rounded-sm bg-emerald-400 mr-1.5 align-middle" />Roster Quality (30%)</span>
            <span><span className="inline-block w-2.5 h-2.5 rounded-sm bg-blue-400 mr-1.5 align-middle" />Recent Form (20%)</span>
            <span><span className="inline-block w-2.5 h-2.5 rounded-sm bg-purple-400 mr-1.5 align-middle" />Draft Capital (10%)</span>
            <span><span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#ffd700] mr-1.5 align-middle" />Historical Win% (40%)</span>
          </div>
        </section>

        {/* ── Section 3: Historical Power Rankings — 2025 Snapshots ── */}
        <section className="mb-14" aria-labelledby="historical-heading">
          <h2 id="historical-heading" className="text-xl font-black text-white mb-1">
            Historical Power Rankings
          </h2>
          <p className="text-xs text-slate-500 mb-2">
            Four snapshots from the 2025 season: Weeks 1, 6, 10, and 14.
          </p>

          {/* Power Leader vs Champion callout */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 mb-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Trophy className="w-5 h-5 text-[#ffd700] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-black text-white">Power Rankings Leader at Week 6: MLSchools12</p>
                <p className="text-xs text-slate-400 mt-0.5">Actual 2025 Champion: <span className="text-[#ffd700] font-bold">tdtd19844</span></p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Power leader won title?</p>
              <p className="text-sm font-black text-amber-400">Not this year</p>
              <p className="text-[10px] text-slate-600 mt-0.5">#2 power ranking entering playoffs won it all</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {WEEK_SNAPSHOTS.map((snap) => (
              <div
                key={snap.week}
                className="rounded-xl border border-[#2d4a66] bg-[#16213e] overflow-hidden"
              >
                <div className="px-4 py-3 bg-[#0f2744] border-b border-[#2d4a66] flex items-center justify-between">
                  <h3 className="text-sm font-black text-white">{snap.label}</h3>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">2025 Season</span>
                </div>

                <div className="divide-y divide-[#1e3347]">
                  {snap.rankings.map((row) => (
                    <div
                      key={row.team}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-[#1f3550] transition-colors"
                    >
                      <span className={cn('text-xs tabular-nums w-5 shrink-0', rankMedalClass(row.rank))}>
                        {row.rank}
                      </span>
                      <span className="text-xs font-bold text-white flex-1 truncate">{row.team}</span>
                      <MovementBadge movement={row.movement} />
                      <div className="flex items-center gap-1.5 w-24 shrink-0">
                        <div className="flex-1 h-1 rounded-full bg-[#0d1b2a] overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              row.rank === 1 ? 'bg-[#ffd700]' : row.rank <= 3 ? 'bg-emerald-400' : row.rank <= 6 ? 'bg-blue-400' : 'bg-slate-600'
                            )}
                            style={{ width: `${row.score}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 tabular-nums">{row.score}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-4 py-3 border-t border-[#2d4a66] bg-[#0d1b2a]/40">
                  <p className="text-[11px] text-slate-400 italic leading-relaxed">{snap.insight}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 4: Automation Design ── */}
        <section className="mb-10" aria-labelledby="automation-heading">
          <h2 id="automation-heading" className="text-xl font-black text-white mb-1">
            Automation Design
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            What the auto-generator would look like in production during the season.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

            {/* Pipeline Steps */}
            <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-6">
              <div className="flex items-center gap-2 mb-4">
                <RefreshCw className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
                <h3 className="text-sm font-black text-white">Weekly Pipeline</h3>
              </div>
              <ol className="space-y-3">
                {[
                  { step: '01', label: 'Pull Sleeper Scores', desc: 'Every Monday 12:00 PM — fetch final scores for all matchups via Sleeper API.' },
                  { step: '02', label: 'Recalculate Components', desc: 'Normalize wins, points for, last-3-weeks form, and SOS faced for all 12 teams.' },
                  { step: '03', label: 'Compute Power Scores', desc: 'Apply the weighted formula. Flag any movement of 3+ spots from prior week.' },
                  { step: '04', label: 'Generate Insights', desc: "Auto-produce Bimfle's Commentary for major movers, streaks, and collapse alerts." },
                  { step: '05', label: 'Publish to Page', desc: 'Update this page with new rankings, movement indicators, and insight callouts.' },
                ].map((item) => (
                  <li key={item.step} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ffd700]/15 border border-[#ffd700]/30 text-[#ffd700] text-[10px] font-black flex items-center justify-center">
                      {item.step}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-white">{item.label}</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* System Specs */}
            <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
                <h3 className="text-sm font-black text-white">System Specs</h3>
              </div>
              <dl className="space-y-3">
                {[
                  { label: 'Data Source', value: 'Sleeper REST API v1' },
                  { label: 'Update Cadence', value: 'Weekly — Monday 12:00 PM ET' },
                  { label: 'League ID', value: 'BMFFFL Season 7 (to be assigned)' },
                  { label: 'Formula Version', value: 'v1.0 — 40/30/20/10 split' },
                  { label: 'History Kept', value: 'All weeks, current season + prior' },
                  { label: 'Ties Handled', value: 'Points For as tiebreaker' },
                  { label: 'Current Status', value: 'Manual mode' },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between gap-4">
                    <dt className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">{row.label}</dt>
                    <dd className={cn(
                      'text-[11px] font-bold text-right',
                      row.label === 'Current Status' ? 'text-amber-400' : 'text-slate-300'
                    )}>
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-5 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                <div className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-[11px] text-amber-300 leading-relaxed">
                    <span className="font-bold">Manual mode</span> &mdash; data updated at season start.
                    Automation goes live Week 1 of Season 7 (September 2026) when the Sleeper league ID
                    is assigned and scoring data begins to populate.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Future Enhancements */}
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5">
            <h3 className="text-sm font-black text-white mb-3">Future Enhancements (v2)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { title: 'Roster Value Integration', desc: 'Pull live dynasty values from KTC/DLF and weight into the formula as a 5th component.' },
                { title: 'Predictive Playoff Odds', desc: 'Monte Carlo simulation to project playoff probability from current power ranking and remaining schedule.' },
                { title: 'Bimfle Alert System', desc: 'Auto-push Slack/SMS alerts when a team falls 4+ spots in a single week. Decline detected.' },
              ].map((item) => (
                <div key={item.title} className="rounded-lg bg-[#0d1b2a] border border-[#2d4a66] p-3">
                  <p className="text-xs font-bold text-white mb-1">{item.title}</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bimfle Note ── */}
        <div className="rounded-xl border border-[#ffd700]/20 bg-[#ffd700]/5 p-6 text-center">
          <p className="text-sm text-slate-300 leading-relaxed italic max-w-2xl mx-auto">
            &ldquo;Power rankings are not predictions. They are verdicts. The formula does not
            care about your narrative &mdash; only your production.&rdquo;
          </p>
          <p className="text-xs text-[#ffd700] font-bold mt-2 uppercase tracking-widest">
            &mdash; Love, Bimfle
          </p>
        </div>

        <p className="mt-8 text-xs text-center text-slate-600">
          Pre-season scores based on roster evaluation and historical data (March 2026).
          Historical 2025 rankings are reconstructed approximations. Automation activates Season 7 Week 1.
        </p>

      </div>
    </>
  );
}
