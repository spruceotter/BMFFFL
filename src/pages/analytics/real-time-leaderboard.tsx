import Head from 'next/head';
import { Activity, Zap, Info, Clock, Wifi } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type ScoreChange = 'up' | 'down' | 'same';

interface LeaderboardEntry {
  rank: number;
  manager: string;
  currentScore: number;
  projectedFinal: number;
  change: ScoreChange;
  changePts: number;
  playersRemaining: number;
}

interface MatchupPair {
  id: number;
  homeManager: string;
  homeScore: number;
  awayManager: string;
  awayScore: number;
}

// ─── Hardcoded Week 14 in-progress data ───────────────────────────────────────

const LEADERBOARD: LeaderboardEntry[] = [
  { rank:  1, manager: 'mlschools12',       currentScore: 112.6, projectedFinal: 138.4, change: 'up',   changePts: 8.2,  playersRemaining: 2 },
  { rank:  2, manager: 'sexmachineandy',    currentScore: 104.8, projectedFinal: 129.6, change: 'up',   changePts: 6.4,  playersRemaining: 1 },
  { rank:  3, manager: 'jimmyeatwurld',     currentScore: 102.4, projectedFinal: 124.6, change: 'down', changePts: 3.8,  playersRemaining: 1 },
  { rank:  4, manager: 'grandes',           currentScore:  98.6, projectedFinal: 122.4, change: 'up',   changePts: 4.2,  playersRemaining: 2 },
  { rank:  5, manager: 'cogdeill11',        currentScore:  96.2, projectedFinal: 118.8, change: 'up',   changePts: 5.6,  playersRemaining: 2 },
  { rank:  6, manager: 'bro_set',           currentScore:  93.4, projectedFinal: 116.8, change: 'same', changePts: 0.0,  playersRemaining: 2 },
  { rank:  7, manager: 'juicybussy',        currentScore:  91.8, projectedFinal: 114.6, change: 'down', changePts: 2.4,  playersRemaining: 3 },
  { rank:  8, manager: 'rbr',               currentScore:  89.2, projectedFinal: 112.6, change: 'up',   changePts: 3.2,  playersRemaining: 2 },
  { rank:  9, manager: 'tubes94',           currentScore:  87.4, projectedFinal: 108.2, change: 'down', changePts: 4.8,  playersRemaining: 3 },
  { rank: 10, manager: 'eldridm20',         currentScore:  84.6, projectedFinal: 107.8, change: 'up',   changePts: 1.6,  playersRemaining: 2 },
  { rank: 11, manager: 'tdtd19844',         currentScore:  78.4, projectedFinal: 101.2, change: 'down', changePts: 6.2,  playersRemaining: 3 },
  { rank: 12, manager: 'cheeseandcrackers', currentScore:  76.8, projectedFinal:  98.4, change: 'down', changePts: 5.4,  playersRemaining: 4 },
];

// All 6 matchups — Week 14
const MATCHUPS: MatchupPair[] = [
  { id: 1, homeManager: 'mlschools12',    homeScore: 112.6, awayManager: 'tubes94',          awayScore:  87.4 },
  { id: 2, homeManager: 'sexmachineandy', homeScore: 104.8, awayManager: 'cogdeill11',        awayScore:  96.2 },
  { id: 3, homeManager: 'grandes',        homeScore:  98.6, awayManager: 'juicybussy',        awayScore:  91.8 },
  { id: 4, homeManager: 'tdtd19844',      homeScore:  78.4, awayManager: 'eldridm20',         awayScore:  84.6 },
  { id: 5, homeManager: 'rbr',            homeScore:  89.2, awayManager: 'bro_set',           awayScore:  93.4 },
  { id: 6, homeManager: 'cheeseandcrackers', homeScore: 76.8, awayManager: 'jimmyeatwurld',   awayScore: 102.4 },
];

// Max score for chart scaling
const MAX_SCORE = 115;

// ─── Derived: closest matchups (diff <= 10) and blowouts (diff > 20) ─────────

interface AnalyzedMatchup extends MatchupPair {
  diff: number;
  leader: string;
  trailer: string;
  leaderScore: number;
  trailerScore: number;
}

const ANALYZED_MATCHUPS: AnalyzedMatchup[] = MATCHUPS.map((m) => {
  const diff = Math.abs(m.homeScore - m.awayScore);
  const homeLeading = m.homeScore >= m.awayScore;
  return {
    ...m,
    diff,
    leader:      homeLeading ? m.homeManager  : m.awayManager,
    trailer:     homeLeading ? m.awayManager  : m.homeManager,
    leaderScore: homeLeading ? m.homeScore     : m.awayScore,
    trailerScore: homeLeading ? m.awayScore    : m.homeScore,
  };
});

const CLOSE_MATCHUPS  = ANALYZED_MATCHUPS.filter((m) => m.diff <= 10);
const BLOWOUT_MATCHUPS = ANALYZED_MATCHUPS.filter((m) => m.diff > 20);

// ─── Sub-components ────────────────────────────────────────────────────────────

function ChangeArrow({ change, pts }: { change: ScoreChange; pts: number }) {
  if (change === 'up') {
    return (
      <span className="inline-flex items-center gap-0.5 text-green-400 text-xs font-bold">
        ↑ <span className="tabular-nums">+{pts.toFixed(1)}</span>
      </span>
    );
  }
  if (change === 'down') {
    return (
      <span className="inline-flex items-center gap-0.5 text-red-400 text-xs font-bold">
        ↓ <span className="tabular-nums">-{pts.toFixed(1)}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-slate-500 text-xs font-bold">
      — <span className="tabular-nums">0.0</span>
    </span>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const gold   = rank === 1;
  const silver = rank === 2;
  const bronze = rank === 3;
  return (
    <span
      className={cn(
        'w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0',
        gold   && 'bg-[#ffd700] text-[#0d1b2a]',
        silver && 'bg-slate-400 text-[#0d1b2a]',
        bronze && 'bg-amber-700 text-white',
        !gold && !silver && !bronze && 'bg-[#1a2d42] text-slate-400'
      )}
    >
      {rank}
    </span>
  );
}

function ScoreBar({ score, isTop3 }: { score: number; isTop3: boolean }) {
  const pct = Math.min((score / MAX_SCORE) * 100, 100);
  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <div className="flex-1 h-4 bg-[#0d1b2a] rounded overflow-hidden border border-[#2d4a66]">
        <div
          className={cn(
            'h-full rounded transition-all duration-500',
            isTop3 ? 'bg-gradient-to-r from-[#ffd700] to-[#ffc107]' : 'bg-gradient-to-r from-[#1a6b9a] to-[#2d8fc4]'
          )}
          style={{ width: `${pct}%` }}
          aria-label={`${score.toFixed(1)} points`}
        />
      </div>
      <span className="text-xs font-black text-[#ffd700] tabular-nums w-12 text-right shrink-0">
        {score.toFixed(1)}
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RealTimeLeaderboardPage() {
  return (
    <>
      <Head>
        <title>Real-Time Leaderboard — Week 14 | BMFFFL</title>
        <meta
          name="description"
          content="BMFFFL live scoring leaderboard for Week 14. All 12 managers ranked by current score with projections and matchup analysis."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ── Page header ───────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <Activity className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#ffd700]">Analytics</span>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Real-Time Leaderboard</span>
          </div>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-black text-white">Live Scoring Leaderboard</h1>
                {/* Pulsing LIVE badge */}
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                  </span>
                  <span className="text-sm font-bold text-red-400 uppercase tracking-wider">LIVE</span>
                </span>
              </div>
              <p className="text-slate-400 text-sm">
                Week 14 &bull; Sunday afternoon &bull; 4 PM games in progress
              </p>
            </div>

            {/* Update timer mockup */}
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#16213e] border border-[#2d4a66] text-sm">
              <Clock className="w-4 h-4 text-[#ffd700] shrink-0" aria-hidden="true" />
              <span className="text-slate-300">
                Updates every{' '}
                <span className="text-[#ffd700] font-bold">60s</span>{' '}
                during game windows
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Connection status banner ────────────────────────────────────────── */}
      <div className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3 bg-blue-500/5 border border-blue-500/20 rounded-lg px-4 py-3">
            <Wifi className="w-4 h-4 text-blue-400 shrink-0" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-blue-300">
                <span className="font-bold text-blue-200">Design Preview</span>
                {' '}— All scores are hardcoded for the Week 14 mock window.{' '}
                <span className="font-bold text-white">Connect Sleeper API for live data</span>{' '}
                with real-time score polling every 60 seconds.
              </p>
            </div>
            <a
              href="/resources/api-docs"
              className="shrink-0 text-xs font-bold text-[#ffd700] hover:text-[#ffd700]/80 transition-colors underline"
            >
              Setup guide →
            </a>
          </div>
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div className="bg-[#0d1b2a] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

          {/* ── Section 1: Live Ranking Table ──────────────────────────────── */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
              <h2 className="text-lg font-black text-white">Live Rankings — All 12 Managers</h2>
              <span className="text-xs text-slate-500 font-medium">Sorted by current score</span>
            </div>

            <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
              {/* Table header */}
              <div className="bg-[#0a1520] px-4 py-3 border-b border-[#2d4a66] grid grid-cols-12 gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <span className="col-span-1 text-center">Rank</span>
                <span className="col-span-3">Manager</span>
                <span className="col-span-2 text-right">Score</span>
                <span className="col-span-2 text-right">Projected</span>
                <span className="col-span-2 text-center">Change</span>
                <span className="col-span-2 text-center">Remaining</span>
              </div>

              <div className="divide-y divide-[#1a2d42]">
                {LEADERBOARD.map((entry) => {
                  const isTop3    = entry.rank <= 3;
                  const isBottom3 = entry.rank >= 10;
                  return (
                    <div
                      key={entry.manager}
                      className={cn(
                        'px-4 py-3 grid grid-cols-12 gap-2 items-center transition-colors duration-100',
                        'hover:bg-[#16213e]',
                        isTop3 && 'bg-[#ffd700]/3',
                        !isTop3 && !isBottom3 && 'bg-[#111d2b]',
                        isBottom3 && 'bg-[#0d1b2a]',
                      )}
                    >
                      {/* Rank */}
                      <div className="col-span-1 flex justify-center">
                        <RankBadge rank={entry.rank} />
                      </div>

                      {/* Manager name */}
                      <div className="col-span-3 min-w-0">
                        <span
                          className={cn(
                            'text-sm font-bold truncate block',
                            isTop3 ? 'text-white' : 'text-slate-300'
                          )}
                        >
                          {entry.manager}
                        </span>
                      </div>

                      {/* Current score */}
                      <div className="col-span-2 text-right">
                        <span
                          className={cn(
                            'text-base font-black tabular-nums',
                            isTop3 ? 'text-[#ffd700]' : 'text-slate-200'
                          )}
                        >
                          {entry.currentScore.toFixed(1)}
                        </span>
                      </div>

                      {/* Projected final */}
                      <div className="col-span-2 text-right">
                        <span className="text-sm text-slate-400 tabular-nums">
                          {entry.projectedFinal.toFixed(1)}
                        </span>
                      </div>

                      {/* Change */}
                      <div className="col-span-2 flex justify-center">
                        <ChangeArrow change={entry.change} pts={entry.changePts} />
                      </div>

                      {/* Players remaining */}
                      <div className="col-span-2 flex justify-center">
                        <span
                          className={cn(
                            'text-xs font-bold px-2 py-0.5 rounded-full',
                            entry.playersRemaining > 0
                              ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                              : 'bg-slate-800 border border-slate-700 text-slate-500'
                          )}
                        >
                          {entry.playersRemaining > 0 ? `${entry.playersRemaining} left` : 'Done'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── Section 2: Score Spread Chart ──────────────────────────────── */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
              <h2 className="text-lg font-black text-white">Score Spread — Current Scores</h2>
              <span className="text-xs text-slate-500 font-medium">CSS bar chart</span>
            </div>

            <div className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-5">
              {/* Y-axis labels + bars */}
              <div className="space-y-2.5">
                {LEADERBOARD.map((entry) => {
                  const isTop3 = entry.rank <= 3;
                  return (
                    <div key={entry.manager} className="flex items-center gap-3">
                      {/* Manager label — fixed width */}
                      <span className="text-xs text-slate-400 w-36 shrink-0 truncate text-right font-medium">
                        {entry.manager}
                      </span>
                      {/* Bar track */}
                      <ScoreBar score={entry.currentScore} isTop3={isTop3} />
                    </div>
                  );
                })}
              </div>

              {/* X-axis tick labels */}
              <div className="flex justify-between mt-3 ml-[10rem] text-xs text-slate-600 font-mono">
                <span>0</span>
                <span>29</span>
                <span>57</span>
                <span>86</span>
                <span>115</span>
              </div>
              <div className="text-right mt-1 text-xs text-slate-600">points</div>
            </div>
          </section>

          {/* ── Sections 3 & 4 in a two-column grid on wide screens ──────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ── Section 3: Closest Matchups ──────────────────────────────── */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">🔥</span>
                <h2 className="text-lg font-black text-white">Closest Matchups</h2>
                <span className="text-xs text-slate-500 font-medium">Within 10 pts</span>
              </div>

              {CLOSE_MATCHUPS.length === 0 ? (
                <div className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-6 text-center text-slate-500 text-sm">
                  No close matchups right now.
                </div>
              ) : (
                <div className="space-y-3">
                  {CLOSE_MATCHUPS.map((m) => (
                    <div
                      key={m.id}
                      className="bg-[#16213e] border border-yellow-500/30 rounded-xl px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
                          Matchup {m.id} — {m.diff.toFixed(1)} pt gap
                        </span>
                        <span className="text-xs bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full font-bold shrink-0">
                          Nail-biter
                        </span>
                      </div>

                      {/* Leader bar */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-32 shrink-0 text-xs font-bold text-white truncate">{m.leader}</span>
                          <div className="flex-1 h-3 bg-[#0d1b2a] rounded overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded"
                              style={{ width: `${(m.leaderScore / MAX_SCORE) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-black text-green-400 tabular-nums w-12 text-right shrink-0">
                            {m.leaderScore.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-32 shrink-0 text-xs font-bold text-slate-400 truncate">{m.trailer}</span>
                          <div className="flex-1 h-3 bg-[#0d1b2a] rounded overflow-hidden">
                            <div
                              className="h-full bg-red-500/70 rounded"
                              style={{ width: `${(m.trailerScore / MAX_SCORE) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-black text-red-400 tabular-nums w-12 text-right shrink-0">
                            {m.trailerScore.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ── Section 4: Blowouts ──────────────────────────────────────── */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">💨</span>
                <h2 className="text-lg font-black text-white">Blowouts</h2>
                <span className="text-xs text-slate-500 font-medium">Gap &gt; 20 pts — already decided</span>
              </div>

              {BLOWOUT_MATCHUPS.length === 0 ? (
                <div className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-6 text-center text-slate-500 text-sm">
                  No blowouts yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {BLOWOUT_MATCHUPS.map((m) => (
                    <div
                      key={m.id}
                      className="bg-[#16213e] border border-slate-600 rounded-xl px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Matchup {m.id} — {m.diff.toFixed(1)} pt gap
                        </span>
                        <span className="text-xs bg-slate-700 border border-slate-600 text-slate-400 px-2 py-0.5 rounded-full font-bold shrink-0">
                          Decided
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-white truncate">{m.leader}</p>
                          <p className="text-2xl font-black text-[#ffd700] tabular-nums">{m.leaderScore.toFixed(1)}</p>
                        </div>
                        <div className="text-slate-600 font-bold text-lg shrink-0">vs</div>
                        <div className="flex-1 min-w-0 text-right">
                          <p className="text-sm font-bold text-slate-500 truncate">{m.trailer}</p>
                          <p className="text-2xl font-black text-slate-500 tabular-nums">{m.trailerScore.toFixed(1)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* ── Section 5 & 6: Update timer + footer info ────────────────── */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Update timer mockup */}
            <div className="bg-[#16213e] border border-[#2d4a66] rounded-xl px-5 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-black text-white mb-0.5">Auto-Refresh</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Updates every <span className="text-[#ffd700] font-bold">60 seconds</span> during active NFL game windows
                  (1 PM, 4 PM, SNF, MNF). Pauses when no games are in progress.
                </p>
              </div>
            </div>

            {/* Connection status detail */}
            <div className="bg-[#16213e] border border-blue-500/20 rounded-xl px-5 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <Info className="w-5 h-5 text-blue-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-black text-white mb-0.5">Design Preview</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  <span className="text-blue-300 font-semibold">Connect Sleeper API</span> to replace hardcoded scores
                  with real-time data. See{' '}
                  <a href="/resources/api-docs" className="text-[#ffd700] underline hover:text-[#ffd700]/80 transition-colors">
                    /resources/api-docs
                  </a>{' '}
                  for setup.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
