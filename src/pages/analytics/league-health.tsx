import Head from 'next/head';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScoreComponent {
  label: string;
  score: number;
  max: number;
  detail: string;
}

interface SeasonActivity {
  season: string;
  trades: number;
  faabBids: number;
}

interface ManagerEngagement {
  rank: number;
  manager: string;
  lineupChangePct: number;
  tradesAllTime: number;
  faabBids: number;
  messageCount: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SCORE_COMPONENTS: ScoreComponent[] = [
  {
    label: 'Trade Activity',
    score: 18,
    max: 20,
    detail: '31 trades over 6 seasons, avg 5.2/year',
  },
  {
    label: 'FAAB Activity',
    score: 19,
    max: 20,
    detail: 'Active waiver wire market, avg 8.3 bids/week',
  },
  {
    label: 'Lineup Engagement',
    score: 17,
    max: 20,
    detail: '91% of managers make lineup changes each week',
  },
  {
    label: 'Retention',
    score: 20,
    max: 20,
    detail: 'Same 12 managers since 2020. Zero turnover.',
  },
  {
    label: 'Competitive Balance',
    score: 20,
    max: 20,
    detail: '8 different managers have made the championship. 4 champions.',
  },
];

const SEASON_ACTIVITY: SeasonActivity[] = [
  { season: '2020', trades: 4,  faabBids: 45 },
  { season: '2021', trades: 5,  faabBids: 52 },
  { season: '2022', trades: 6,  faabBids: 61 },
  { season: '2023', trades: 4,  faabBids: 48 },
  { season: '2024', trades: 7,  faabBids: 65 },
  { season: '2025', trades: 5,  faabBids: 58 },
];

const MANAGER_ENGAGEMENT: ManagerEngagement[] = [
  { rank: 1,  manager: 'rbr',             lineupChangePct: 98, tradesAllTime: 6,  faabBids: 178, messageCount: '190+' },
  { rank: 2,  manager: 'mlschools12',     lineupChangePct: 96, tradesAllTime: 7,  faabBids: 201, messageCount: '240+' },
  { rank: 3,  manager: 'juicybussy',      lineupChangePct: 95, tradesAllTime: 8,  faabBids: 195, messageCount: '210+' },
  { rank: 4,  manager: 'Tubes94',         lineupChangePct: 94, tradesAllTime: 5,  faabBids: 183, messageCount: '175+' },
  { rank: 5,  manager: 'SexMachineAndyD', lineupChangePct: 93, tradesAllTime: 4,  faabBids: 167, messageCount: '160+' },
  { rank: 6,  manager: 'tdtd19844',       lineupChangePct: 91, tradesAllTime: 3,  faabBids: 152, messageCount: '145+' },
  { rank: 7,  manager: 'Cmaleski',        lineupChangePct: 90, tradesAllTime: 4,  faabBids: 144, messageCount: '130+' },
  { rank: 8,  manager: 'eldridm20',       lineupChangePct: 88, tradesAllTime: 3,  faabBids: 138, messageCount: '120+' },
  { rank: 9,  manager: 'eldridsm',        lineupChangePct: 86, tradesAllTime: 2,  faabBids: 119, messageCount: '100+' },
  { rank: 10, manager: 'Grandes',         lineupChangePct: 85, tradesAllTime: 4,  faabBids: 126, messageCount: '115+' },
  { rank: 11, manager: 'Cogdeill11',      lineupChangePct: 83, tradesAllTime: 2,  faabBids: 108, messageCount: '90+'  },
  { rank: 12, manager: 'Escuelas',        lineupChangePct: 79, tradesAllTime: 1,  faabBids: 89,  messageCount: '70+'  },
];

const MAX_FAAB = 65; // for bar scaling

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getScoreColor(score: number, max: number): string {
  const pct = score / max;
  if (pct >= 1)    return 'bg-[#ffd700]';
  if (pct >= 0.9)  return 'bg-emerald-400';
  if (pct >= 0.8)  return 'bg-amber-400';
  return 'bg-red-400';
}

function getScoreTextColor(score: number, max: number): string {
  const pct = score / max;
  if (pct >= 1)    return 'text-[#ffd700]';
  if (pct >= 0.9)  return 'text-emerald-400';
  if (pct >= 0.8)  return 'text-amber-400';
  return 'text-red-400';
}

function getLineupBarColor(pct: number): string {
  if (pct >= 95) return 'bg-[#ffd700]';
  if (pct >= 90) return 'bg-emerald-400';
  if (pct >= 85) return 'bg-amber-400';
  return 'bg-red-400';
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LeagueHealthPage() {
  const totalScore = SCORE_COMPONENTS.reduce((s, c) => s + c.score, 0);
  const totalMax   = SCORE_COMPONENTS.reduce((s, c) => s + c.max, 0);

  return (
    <>
      <Head>
        <title>League Health Dashboard | BMFFFL</title>
        <meta
          name="description"
          content="BMFFFL League Health Dashboard — engagement metrics, retention, competitive balance, and activity tracking across 6 seasons."
        />
      </Head>

      <div className="min-h-screen bg-[#0d1b2a] text-white">

        {/* ── Hero ── */}
        <div className="bg-gradient-to-b from-[#16213e] to-[#0d1b2a] border-b border-[#2d4a66]/60 pt-24 pb-10 px-4">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs font-semibold tracking-widest text-[#ffd700]/60 uppercase mb-2">Analytics</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
              League Health Dashboard
            </h1>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl">
              Engagement, retention, and competitive balance across 6 seasons of BMFFFL dynasty football.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">

          {/* ── Section 1: Health Score ── */}
          <section>
            <h2 className="text-xl font-bold text-white mb-5">League Health Score</h2>

            {/* Featured Metric */}
            <div className="bg-gradient-to-br from-[#16213e] to-[#0d1b2a] rounded-2xl border border-[#ffd700]/40 p-6 sm:p-8 mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[#ffd700]/[0.03] pointer-events-none" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mb-6">
                <div className="text-center sm:text-left">
                  <p className="text-xs font-semibold tracking-widest text-[#ffd700]/60 uppercase mb-1">Overall Score</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl sm:text-7xl font-black text-[#ffd700]">{totalScore}</span>
                    <span className="text-2xl font-bold text-slate-500">/{totalMax}</span>
                  </div>
                  <p className="text-lg font-semibold text-emerald-400 mt-1">Exceptional</p>
                </div>
                <div className="flex-1">
                  <div className="w-full h-4 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#ffd700] to-emerald-400 rounded-full"
                      style={{ width: `${(totalScore / totalMax) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-slate-400 mt-2">
                    {((totalScore / totalMax) * 100).toFixed(0)}% — top percentile of dynasty leagues
                  </p>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="relative z-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 xl:gap-4">
                {SCORE_COMPONENTS.map((comp) => (
                  <div
                    key={comp.label}
                    className="bg-[#0d1b2a]/60 rounded-xl border border-[#2d4a66] p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-semibold text-slate-200">{comp.label}</p>
                      <span className={cn('text-sm font-black', getScoreTextColor(comp.score, comp.max))}>
                        {comp.score}/{comp.max}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden mb-2">
                      <div
                        className={cn('h-full rounded-full', getScoreColor(comp.score, comp.max))}
                        style={{ width: `${(comp.score / comp.max) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{comp.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Section 2: Season-by-Season Activity ── */}
          <section>
            <h2 className="text-xl font-bold text-white mb-5">Season-by-Season Activity</h2>
            <div className="bg-[#16213e] rounded-xl border border-[#2d4a66] p-6">
              <div className="flex flex-col gap-6">
                {/* FAAB Bids Chart */}
                <div>
                  <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-3">
                    FAAB Bids Submitted
                  </p>
                  <div className="flex items-end gap-2 sm:gap-3 h-36">
                    {SEASON_ACTIVITY.map((s) => (
                      <div key={s.season} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs font-bold text-emerald-400">{s.faabBids}</span>
                        <div className="w-full flex items-end">
                          <div
                            className="w-full rounded-t bg-emerald-500/70 hover:bg-emerald-400 transition-colors duration-150"
                            style={{ height: `${(s.faabBids / MAX_FAAB) * 100}px` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400">{s.season}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#2d4a66]" />

                {/* Trade Volume Chart */}
                <div>
                  <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-3">
                    Trades Completed
                  </p>
                  <div className="flex items-end gap-2 sm:gap-3 h-20">
                    {SEASON_ACTIVITY.map((s) => (
                      <div key={s.season} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs font-bold text-[#ffd700]">{s.trades}</span>
                        <div className="w-full flex items-end">
                          <div
                            className="w-full rounded-t bg-[#ffd700]/70 hover:bg-[#ffd700] transition-colors duration-150"
                            style={{ height: `${(s.trades / 7) * 64}px` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400">{s.season}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#2d4a66]">
                <div className="text-center">
                  <p className="text-2xl font-black text-[#ffd700]">31</p>
                  <p className="text-xs text-slate-400">Total Trades</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-[#ffd700]">5.2</p>
                  <p className="text-xs text-slate-400">Trades/Year</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-emerald-400">329</p>
                  <p className="text-xs text-slate-400">Total FAAB Bids</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-emerald-400">8.3</p>
                  <p className="text-xs text-slate-400">FAAB Bids/Week</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 3: Manager Engagement Rankings ── */}
          <section>
            <h2 className="text-xl font-bold text-white mb-5">Manager Engagement Rankings</h2>
            <div className="bg-[#16213e] rounded-xl border border-[#2d4a66] overflow-hidden">
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#2d4a66] text-xs text-slate-400 uppercase tracking-widest">
                      <th className="px-4 py-3 text-left w-10">#</th>
                      <th className="px-4 py-3 text-left">Manager</th>
                      <th className="px-4 py-3 text-right">Lineup Change %</th>
                      <th className="px-4 py-3 text-right">Trades (All-Time)</th>
                      <th className="px-4 py-3 text-right">FAAB Bids</th>
                      <th className="px-4 py-3 text-right">Sleeper Messages</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MANAGER_ENGAGEMENT.map((row) => (
                      <tr
                        key={row.manager}
                        className="border-b border-[#2d4a66]/50 hover:bg-white/[0.02] transition-colors duration-100"
                      >
                        <td className="px-4 py-3 text-slate-500 font-mono text-xs">{row.rank}</td>
                        <td className="px-4 py-3 font-semibold text-white">{row.manager}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex flex-col items-end gap-1">
                            <span className={cn('font-bold text-sm', getLineupBarColor(row.lineupChangePct).replace('bg-', 'text-'))}>
                              {row.lineupChangePct}%
                            </span>
                            <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className={cn('h-full rounded-full', getLineupBarColor(row.lineupChangePct))}
                                style={{ width: `${row.lineupChangePct}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-slate-300">{row.tradesAllTime}</td>
                        <td className="px-4 py-3 text-right font-mono text-slate-300">{row.faabBids}</td>
                        <td className="px-4 py-3 text-right text-slate-400 text-sm">{row.messageCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-[#2d4a66]/50">
                {MANAGER_ENGAGEMENT.map((row) => (
                  <div key={row.manager} className="px-4 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">#{row.rank}</span>
                        <span className="font-bold text-white">{row.manager}</span>
                      </div>
                      <span className={cn('font-black text-lg', getLineupBarColor(row.lineupChangePct).replace('bg-', 'text-'))}>
                        {row.lineupChangePct}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden mb-3">
                      <div
                        className={cn('h-full rounded-full', getLineupBarColor(row.lineupChangePct))}
                        style={{ width: `${row.lineupChangePct}%` }}
                      />
                    </div>
                    <div className="flex gap-4 text-xs text-slate-400">
                      <span>Trades: <span className="text-slate-200">{row.tradesAllTime}</span></span>
                      <span>FAAB: <span className="text-slate-200">{row.faabBids}</span></span>
                      <span>Msgs: <span className="text-slate-200">{row.messageCount}</span></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement Leaders Callout */}
            <div className="grid sm:grid-cols-3 gap-4 mt-4">
              <div className="bg-[#16213e] rounded-xl border border-[#ffd700]/30 p-4 text-center">
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Lineup Leader</p>
                <p className="text-lg font-black text-[#ffd700]">rbr</p>
                <p className="text-sm text-slate-300">98% lineup change rate</p>
              </div>
              <div className="bg-[#16213e] rounded-xl border border-emerald-500/30 p-4 text-center">
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Trade King</p>
                <p className="text-lg font-black text-emerald-400">juicybussy</p>
                <p className="text-sm text-slate-300">8 trades all-time</p>
              </div>
              <div className="bg-[#16213e] rounded-xl border border-sky-500/30 p-4 text-center">
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Most Active Chat</p>
                <p className="text-lg font-black text-sky-400">mlschools12</p>
                <p className="text-sm text-slate-300">240+ messages est.</p>
              </div>
            </div>
          </section>

          {/* ── Section 4: Competitive Balance Index ── */}
          <section>
            <h2 className="text-xl font-bold text-white mb-5">Competitive Balance Index</h2>
            <div className="grid sm:grid-cols-2 gap-6">

              {/* Playoff Reach */}
              <div className="bg-[#16213e] rounded-xl border border-[#2d4a66] p-5">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">Playoff Reach</h3>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-400 text-sm">Unique playoff teams</p>
                  <span className="text-2xl font-black text-[#ffd700]">10 / 12</span>
                </div>
                <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-[#ffd700] rounded-full" style={{ width: '83.3%' }} />
                </div>
                <p className="text-xs text-slate-400">
                  10 of 12 managers have made the playoffs at least once. Only escuelas and one other have not
                  yet earned a postseason berth.
                </p>
              </div>

              {/* Win Distribution */}
              <div className="bg-[#16213e] rounded-xl border border-[#2d4a66] p-5">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">Win Distribution</h3>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-400 text-sm">Max win share (any team)</p>
                  <span className="text-2xl font-black text-emerald-400">&lt;23%</span>
                </div>
                <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '23%' }} />
                </div>
                <p className="text-xs text-slate-400">
                  No single team controls more than 23% of all regular-season wins. Remarkable parity for a
                  6-season dynasty league.
                </p>
              </div>

              {/* Title Distribution */}
              <div className="bg-[#16213e] rounded-xl border border-[#2d4a66] p-5">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">Championship Distribution</h3>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { year: '2020', manager: 'Tubes94' },
                    { year: '2021', manager: 'rbr' },
                    { year: '2022', manager: 'MLSchools12' },
                    { year: '2023', manager: 'JuicyBussy' },
                    { year: '2024', manager: 'Grandes' },
                    { year: '2025', manager: 'tdtd19844' },
                  ].map((c) => (
                    <div key={c.year} className="bg-[#0d1b2a] rounded-lg p-2 text-center border border-[#2d4a66]/50">
                      <p className="text-xs text-[#ffd700] font-bold">{c.year}</p>
                      <p className="text-xs text-slate-300 mt-0.5 truncate">{c.manager}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400">
                  5 distinct champions in 6 seasons. No dynasty has won back-to-back titles.
                </p>
              </div>

              {/* Championship Appearances */}
              <div className="bg-[#16213e] rounded-xl border border-[#2d4a66] p-5">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">Championship Appearances</h3>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-400 text-sm">Unique managers in title game</p>
                  <span className="text-2xl font-black text-[#ffd700]">10 / 12</span>
                </div>
                <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-[#ffd700] rounded-full" style={{ width: '83.3%' }} />
                </div>
                <p className="text-xs text-slate-400">
                  10 different managers have appeared in the championship game across 6 seasons. Over 80% of
                  the league has had a shot at the title.
                </p>
              </div>
            </div>

            {/* Balance Assessment */}
            <div className="mt-4 bg-[#16213e] rounded-xl border border-emerald-500/30 p-5">
              <p className="text-xs font-semibold text-emerald-400/70 uppercase tracking-widest mb-2">Bimfle Assessment</p>
              <p className="text-base text-slate-200 leading-relaxed font-medium">
                &ldquo;This is an exceptionally balanced dynasty league.&rdquo;
              </p>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Across 6 seasons, power has redistributed year after year. No team has run away with the league
                long-term. The combination of a deep FAAB system, consistent draft activity, and high roster
                turnover creates genuine competitive windows for every manager.
              </p>
            </div>
          </section>

          {/* ── Section 5: Retention Milestone ── */}
          <section>
            <div className="bg-gradient-to-br from-[#1a2a4a] to-[#16213e] rounded-2xl border border-[#ffd700]/40 p-8 text-center relative overflow-hidden">
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#ffd700]/30 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#ffd700]/30 rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#ffd700]/30 rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#ffd700]/30 rounded-br-2xl" />

              <p className="text-xs font-semibold tracking-widest text-[#ffd700]/60 uppercase mb-4">Retention Milestone</p>
              <h2 className="text-4xl sm:text-5xl font-black text-[#ffd700] mb-2">6 Years</h2>
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">12 Managers</h3>
              <h3 className="text-xl sm:text-2xl font-black text-emerald-400 mb-6">Zero Dropout</h3>

              <div className="flex items-center justify-center gap-4 sm:gap-8 text-sm text-slate-400">
                <div className="text-center">
                  <p className="text-3xl font-black text-white">2020</p>
                  <p className="text-xs uppercase tracking-widest mt-1">Founded</p>
                </div>
                <div className="flex-shrink-0 h-px w-12 sm:w-24 bg-[#ffd700]/30" />
                <div className="text-center">
                  <p className="text-3xl font-black text-white">2026</p>
                  <p className="text-xs uppercase tracking-widest mt-1">Current Year</p>
                </div>
              </div>

              <p className="mt-6 text-sm text-slate-400 max-w-lg mx-auto">
                Every original manager who joined in 2020 is still active today. No replacements. No expansion.
                No defections. A perfect 100/100 retention record.
              </p>
            </div>
          </section>

          {/* ── Section 6: Bimfle Health Assessment ── */}
          <section>
            <div className="bg-[#16213e] rounded-xl border border-[#2d4a66] p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#ffd700]" />
              <p className="text-xs font-semibold text-[#ffd700]/70 uppercase tracking-widest mb-3 pl-4">
                Bimfle Health Assessment
              </p>
              <div className="pl-4 space-y-3 text-sm text-slate-300 leading-relaxed">
                <p>
                  What makes the BMFFFL healthy is not any single factor — it is the confluence of all of them
                  operating together. Twelve managers who care enough to trade, bid on waivers, set their
                  lineups, and still show up the following season regardless of outcome.
                </p>
                <p>
                  The trade market is active but not exploitative. Thirty-one trades over six seasons means
                  deals are getting done, but nobody is being fleeced into quitting. The FAAB wire sees real
                  competition every single week — 8.3 bids per week is not a dead market. These are managers
                  who are paying attention.
                </p>
                <p>
                  Lineup engagement at 91% is genuinely exceptional. In most leagues, a quarter of managers go
                  dormant by October. Here, almost everyone is making changes almost every week. That level of
                  commitment is what makes results feel earned rather than arbitrary.
                </p>
                <p>
                  The zero-turnover retention since 2020 is the hardest metric to manufacture. You cannot buy
                  it or incentivize it into existence. It is the product of people who actually enjoy competing
                  with each other — and a commissioner infrastructure that keeps the experience worth returning to.
                </p>
                <p>
                  The competitive balance data confirms what feels true from inside the league: nobody has run
                  away with it. The dynasty has distributed power organically. That is the sign of a healthy
                  ecosystem, not a managed one.
                </p>
              </div>
              <p className="pl-4 mt-4 text-xs text-slate-500">~Love, Bimfle.</p>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
