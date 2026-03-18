import { useState } from 'react';
import Head from 'next/head';
import { cn } from '@/lib/cn';
import Tooltip from '@/components/ui/Tooltip';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ManagerRow {
  rank: number;
  manager: string;
  efficiency: number;
  avgPts: number;
  avgMax: number;
  record: string;
  notes: string;
  isChampion?: boolean;
}

interface NotableMoment {
  manager: string;
  week: string;
  efficiency: number;
  detail: string;
}

interface HistoricalLeader {
  manager: string;
  careerEfficiency: number;
  note: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const DATA_2025: ManagerRow[] = [
  { rank: 1,  manager: 'rbr',             efficiency: 91.2, avgPts: 142.3, avgMax: 156.1, record: '7-7',  notes: 'Highest lineup IQ in the league, yet missed playoffs' },
  { rank: 2,  manager: 'MLSchools12',     efficiency: 89.8, avgPts: 151.4, avgMax: 168.6, record: '11-3', notes: 'Elite efficiency AND elite talent' },
  { rank: 3,  manager: 'Tubes94',         efficiency: 88.4, avgPts: 154.2, avgMax: 174.4, record: '11-3', notes: 'Strong efficiency, great talent = runner-up' },
  { rank: 4,  manager: 'JuicyBussy',      efficiency: 87.1, avgPts: 148.6, avgMax: 170.6, record: '9-5',  notes: 'Good efficiency, explosive ceiling' },
  { rank: 5,  manager: 'SexMachineAndyD', efficiency: 86.3, avgPts: 146.8, avgMax: 170.2, record: '9-5',  notes: 'Consistent but not quite elite' },
  { rank: 6,  manager: 'eldridm20',       efficiency: 84.7, avgPts: 138.2, avgMax: 163.2, record: '7-7',  notes: 'Playoff-dangerous in single elimination' },
  { rank: 7,  manager: 'tdtd19844',       efficiency: 83.9, avgPts: 141.5, avgMax: 168.6, record: '8-6',  notes: 'Won the championship! Efficiency \u2260 outcome', isChampion: true },
  { rank: 8,  manager: 'Cmaleski',        efficiency: 82.6, avgPts: 142.0, avgMax: 172.0, record: '6-8',  notes: 'Highest pts (1990 total) but worst luck' },
  { rank: 9,  manager: 'eldridsm',        efficiency: 81.4, avgPts: 134.6, avgMax: 165.4, record: '5-9',  notes: 'Declining roster management' },
  { rank: 10, manager: 'Grandes',         efficiency: 79.8, avgPts: 129.4, avgMax: 162.1, record: '5-9',  notes: 'Commissioner had rough management year' },
  { rank: 11, manager: 'Cogdeill11',      efficiency: 77.2, avgPts: 125.8, avgMax: 162.9, record: '4-10', notes: 'Struggles with lineup optimization' },
  { rank: 12, manager: 'Escuelas',        efficiency: 74.3, avgPts: 122.4, avgMax: 164.7, record: '4-10', notes: 'Still learning, big improvement over 2024' },
];

const NOTABLE_MOMENTS: NotableMoment[] = [
  { manager: 'rbr',        week: 'Week 8',                       efficiency: 98.4, detail: 'Near-perfect lineup — still lost due to opponent\'s explosive score' },
  { manager: 'tdtd19844',  week: 'Playoff Week 16 (Champ Semis)', efficiency: 94.2, detail: 'Clutch lineup management when it mattered most' },
  { manager: 'Cmaleski',   week: 'Week 12',                      efficiency: 99.1, detail: 'Perfect lineup, lost by 3 points — the cruelest week of the season' },
  { manager: 'Escuelas',   week: 'Week 3',                       efficiency: 58.2, detail: 'Lowest single-week efficiency — left significant points on bench' },
];

const HISTORICAL_LEADERS: HistoricalLeader[] = [
  { manager: 'rbr',         careerEfficiency: 89.4, note: 'All-time best' },
  { manager: 'MLSchools12', careerEfficiency: 88.6, note: 'Career average' },
  { manager: 'Tubes94',     careerEfficiency: 87.1, note: 'Since 2021' },
  { manager: 'JuicyBussy',  careerEfficiency: 86.2, note: 'Career average' },
];

const PLACEHOLDER_2024: ManagerRow[] = [
  { rank: 1, manager: 'MLSchools12', efficiency: 88.1, avgPts: 148.2, avgMax: 168.2, record: '10-4', notes: 'Consistent elite management' },
  { rank: 2, manager: 'rbr',         efficiency: 87.6, avgPts: 139.5, avgMax: 159.3, record: '8-6',  notes: 'Strong lineup IQ' },
];

const PLACEHOLDER_2023: ManagerRow[] = [
  { rank: 1, manager: 'JuicyBussy',  efficiency: 88.9, avgPts: 152.1, avgMax: 171.1, record: '11-3', notes: 'Peak efficiency season' },
  { rank: 2, manager: 'MLSchools12', efficiency: 87.4, avgPts: 145.6, avgMax: 166.5, record: '9-5',  notes: 'Steady as ever' },
];

const SEASON_DATA: Record<string, ManagerRow[]> = {
  '2025': DATA_2025,
  '2024': PLACEHOLDER_2024,
  '2023': PLACEHOLDER_2023,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getEfficiencyTier(pct: number): { label: string; className: string } {
  if (pct >= 90) return { label: 'Elite',    className: 'bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/40' };
  if (pct >= 85) return { label: 'Strong',   className: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' };
  if (pct >= 80) return { label: 'Average',  className: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' };
  return              { label: 'Below Avg', className: 'bg-red-500/20 text-red-400 border border-red-500/30' };
}

function getEfficiencyBarColor(pct: number): string {
  if (pct >= 90) return 'bg-[#ffd700]';
  if (pct >= 85) return 'bg-emerald-400';
  if (pct >= 80) return 'bg-amber-400';
  return 'bg-red-400';
}

function getMomentBadgeClass(pct: number): string {
  if (pct >= 95) return 'text-[#ffd700]';
  if (pct >= 85) return 'text-emerald-400';
  if (pct < 65)  return 'text-red-400';
  return 'text-slate-300';
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ManagerEfficiencyPage() {
  const [selectedSeason, setSelectedSeason] = useState<'2025' | '2024' | '2023'>('2025');
  const rows = SEASON_DATA[selectedSeason] ?? [];

  const leagueAvg = rows.length
    ? (rows.reduce((s, r) => s + r.efficiency, 0) / rows.length).toFixed(1)
    : '—';

  const topManager  = rows[0] ?? null;
  const bottomManager = rows[rows.length - 1] ?? null;
  const champion = rows.find((r) => r.isChampion) ?? null;

  return (
    <>
      <Head>
        <title>Manager Efficiency Index | BMFFFL</title>
        <meta
          name="description"
          content="Lineup efficiency ratings for BMFFFL managers — optimal lineup percentage tracking who sets the best lineups each week."
        />
      </Head>

      <div className="min-h-screen bg-[#0d1b2a] text-white">
        {/* ── Hero ── */}
        <div className="bg-gradient-to-b from-[#16213e] to-[#0d1b2a] border-b border-[#2d4a66]/60 pt-24 pb-10 px-4">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs font-semibold tracking-widest text-[#ffd700]/60 uppercase mb-2">Analytics</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
              Manager Efficiency Index
            </h1>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl">
              Optimal lineup percentage &mdash; who sets the best lineups?
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">

          {/* ── Season Selector ── */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400 mr-1">Season:</span>
            {(['2025', '2024', '2023'] as const).map((season) => (
              <button
                key={season}
                type="button"
                onClick={() => setSelectedSeason(season)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-150',
                  selectedSeason === season
                    ? 'bg-[#ffd700] text-[#0d1b2a]'
                    : 'bg-[#16213e] text-slate-300 border border-[#2d4a66] hover:border-[#ffd700]/40 hover:text-white'
                )}
              >
                {season}
              </button>
            ))}
          </div>

          {/* ── Summary Cards ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#16213e] rounded-xl border border-[#2d4a66] p-4 text-center">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">League Avg</p>
              <p className="text-2xl font-black text-white">{leagueAvg}%</p>
            </div>
            <div className="bg-[#16213e] rounded-xl border border-[#ffd700]/30 p-4 text-center">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Top Manager</p>
              <p className="text-lg font-black text-[#ffd700]">{topManager?.manager ?? '—'}</p>
              <p className="text-sm text-slate-400">{topManager ? `${topManager.efficiency}%` : ''}</p>
            </div>
            <div className="bg-[#16213e] rounded-xl border border-[#2d4a66] p-4 text-center">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Champion Eff.</p>
              <p className="text-lg font-black text-emerald-400">{champion ? `${champion.efficiency}%` : '—'}</p>
              <p className="text-sm text-slate-400">{champion?.manager ?? ''}</p>
            </div>
            <div className="bg-[#16213e] rounded-xl border border-[#2d4a66] p-4 text-center">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Lowest</p>
              <p className="text-lg font-black text-red-400">{bottomManager ? `${bottomManager.efficiency}%` : '—'}</p>
              <p className="text-sm text-slate-400">{bottomManager?.manager ?? ''}</p>
            </div>
          </div>

          {/* ── Main Leaderboard ── */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">{selectedSeason} Lineup Efficiency Rankings</h2>
            <div className="bg-[#16213e] rounded-xl border border-[#2d4a66] overflow-hidden">
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#2d4a66] text-xs text-slate-400 uppercase tracking-widest">
                      <th className="px-4 py-3 text-left w-10">#</th>
                      <th className="px-4 py-3 text-left">Manager</th>
                      <th className="px-4 py-3 text-center">Tier</th>
                      <th className="px-4 py-3 text-right">Efficiency %</th>
                      <th className="px-4 py-3 text-right">Avg Pts</th>
                      <th className="px-4 py-3 text-right">Avg Max</th>
                      <th className="px-4 py-3 text-right">Gap</th>
                      <th className="px-4 py-3 text-center">Record</th>
                      <th className="px-4 py-3 text-left pl-6">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => {
                      const tier = getEfficiencyTier(row.efficiency);
                      const barColor = getEfficiencyBarColor(row.efficiency);
                      const gap = (row.avgMax - row.avgPts).toFixed(1);
                      return (
                        <tr
                          key={row.manager}
                          className={cn(
                            'border-b border-[#2d4a66]/50 hover:bg-white/[0.02] transition-colors duration-100',
                            row.isChampion && 'bg-emerald-500/5'
                          )}
                        >
                          <td className="px-4 py-3 text-slate-500 font-mono text-xs">{row.rank}</td>
                          <td className="px-4 py-3 font-semibold text-white">
                            <span className="flex items-center gap-1.5">
                              {row.manager}
                              {row.isChampion && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold tracking-wide">
                                  CHAMP
                                </span>
                              )}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={cn('text-xs px-2 py-0.5 rounded-full font-semibold', tier.className)}>
                              {tier.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex flex-col items-end gap-1">
                              <Tooltip tip="Lineup IQ% = Points Scored ÷ Points Available (best ball optimal) × 100">
                                <span className="font-bold text-white">{row.efficiency}%</span>
                              </Tooltip>
                              <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className={cn('h-full rounded-full transition-all', barColor)}
                                  style={{ width: `${row.efficiency}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right text-slate-300 font-mono">{row.avgPts}</td>
                          <td className="px-4 py-3 text-right text-slate-400 font-mono">{row.avgMax}</td>
                          <td className="px-4 py-3 text-right text-red-400 font-mono text-xs">&minus;{gap}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="font-mono text-slate-300 text-xs">{row.record}</span>
                          </td>
                          <td className="px-4 py-3 pl-6 text-slate-400 text-xs max-w-xs">{row.notes}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-[#2d4a66]/50">
                {rows.map((row) => {
                  const tier = getEfficiencyTier(row.efficiency);
                  const barColor = getEfficiencyBarColor(row.efficiency);
                  const gap = (row.avgMax - row.avgPts).toFixed(1);
                  return (
                    <div
                      key={row.manager}
                      className={cn('px-4 py-4', row.isChampion && 'bg-emerald-500/5')}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="text-xs text-slate-500 mr-2">#{row.rank}</span>
                          <span className="font-bold text-white">{row.manager}</span>
                          {row.isChampion && (
                            <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                              CHAMP
                            </span>
                          )}
                        </div>
                        <span className={cn('text-xs px-2 py-0.5 rounded-full font-semibold', tier.className)}>
                          {tier.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-black text-lg text-white">{row.efficiency}%</span>
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className={cn('h-full rounded-full', barColor)} style={{ width: `${row.efficiency}%` }} />
                        </div>
                      </div>
                      <div className="flex gap-4 text-xs text-slate-400 mb-2">
                        <span>Avg: <span className="text-slate-200">{row.avgPts}</span></span>
                        <span>Max: <span className="text-slate-200">{row.avgMax}</span></span>
                        <span>Gap: <span className="text-red-400">&minus;{gap}</span></span>
                        <span>Record: <span className="text-slate-200">{row.record}</span></span>
                      </div>
                      <p className="text-xs text-slate-500">{row.notes}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#ffd700] inline-block" /> 90%+ Elite</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> 85–89% Strong</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> 80–84% Average</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" /> &lt;80% Below Avg</span>
            </div>
          </section>

          {/* ── The Efficiency Paradox ── */}
          {selectedSeason === '2025' && (
            <section className="grid md:grid-cols-2 gap-4">
              {/* rbr paradox callout */}
              <div className="bg-[#16213e] rounded-xl border border-[#ffd700]/30 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#ffd700]/20 flex items-center justify-center text-[#ffd700] font-black text-sm">?</div>
                  <h3 className="text-base font-bold text-[#ffd700]">The Efficiency Paradox</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-3">
                  <span className="font-semibold text-white">rbr</span> led the league with a{' '}
                  <span className="text-[#ffd700] font-bold">91.2%</span> efficiency rating — the highest lineup
                  IQ in the league. He set the right lineup almost every week.
                </p>
                <p className="text-sm text-slate-400 leading-relaxed">
                  He still finished <span className="font-semibold text-white">7-7</span> and missed the playoffs.
                  Efficiency is necessary. It is not sufficient. Talent ceiling is the multiplier that efficiency
                  operates on.
                </p>
              </div>

              {/* tdtd champion callout */}
              <div className="bg-[#16213e] rounded-xl border border-emerald-500/30 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-sm">C</div>
                  <h3 className="text-base font-bold text-emerald-400">Champion Below 85%</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-3">
                  <span className="font-semibold text-white">tdtd19844</span> won the{' '}
                  <span className="text-emerald-400 font-bold">2025 Championship</span> with an efficiency
                  rating of just <span className="font-semibold text-white">83.9%</span> — 7th in the league.
                </p>
                <p className="text-sm text-slate-400 leading-relaxed">
                  But when it mattered, he locked in: <span className="font-semibold text-white">94.2%</span>{' '}
                  in the Championship Semis. Clutch performance at peak moments outweighs season averages.
                </p>
              </div>
            </section>
          )}

          {/* ── Notable Moments ── */}
          {selectedSeason === '2025' && (
            <section>
              <h2 className="text-xl font-bold text-white mb-4">Notable Efficiency Moments — 2025</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {NOTABLE_MOMENTS.map((moment) => (
                  <div
                    key={`${moment.manager}-${moment.week}`}
                    className="bg-[#16213e] rounded-xl border border-[#2d4a66] p-4 hover:border-[#ffd700]/30 transition-colors duration-150"
                  >
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">{moment.week}</p>
                    <p className="font-bold text-white mb-1">{moment.manager}</p>
                    <p className={cn('text-3xl font-black mb-2', getMomentBadgeClass(moment.efficiency))}>
                      {moment.efficiency}%
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">{moment.detail}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Historical Leaders ── */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">All-Time Efficiency Leaders</h2>
            <div className="bg-[#16213e] rounded-xl border border-[#2d4a66] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2d4a66] text-xs text-slate-400 uppercase tracking-widest">
                    <th className="px-4 py-3 text-left w-10">#</th>
                    <th className="px-4 py-3 text-left">Manager</th>
                    <th className="px-4 py-3 text-right">Career Efficiency</th>
                    <th className="px-4 py-3 text-left pl-6">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {HISTORICAL_LEADERS.map((leader, i) => {
                    const tier = getEfficiencyTier(leader.careerEfficiency);
                    const barColor = getEfficiencyBarColor(leader.careerEfficiency);
                    return (
                      <tr key={leader.manager} className="border-b border-[#2d4a66]/50 hover:bg-white/[0.02] transition-colors duration-100">
                        <td className="px-4 py-3 text-slate-500 font-mono text-xs">{i + 1}</td>
                        <td className="px-4 py-3 font-semibold text-white">{leader.manager}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-2">
                              <span className={cn('text-xs px-2 py-0.5 rounded-full font-semibold', tier.className)}>{tier.label}</span>
                              <span className="font-bold text-white">{leader.careerEfficiency}%</span>
                            </div>
                            <div className="w-28 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                              <div className={cn('h-full rounded-full', barColor)} style={{ width: `${leader.careerEfficiency}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 pl-6 text-slate-400 text-xs">{leader.note}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Bimfle Note ── */}
          <section>
            <div className="bg-[#16213e] rounded-xl border border-[#2d4a66] p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#ffd700]" />
              <p className="text-xs font-semibold text-[#ffd700]/70 uppercase tracking-widest mb-3 pl-4">A Note from Bimfle</p>
              <blockquote className="pl-4 text-slate-300 text-sm leading-relaxed italic">
                Optimal lineup management is a necessary but insufficient condition for championship success. See: rbr.
                Proof that knowing the right answer and possessing the right roster are distinct matters.
              </blockquote>
              <p className="pl-4 mt-3 text-xs text-slate-500">~Love, Bimfle.</p>
            </div>
          </section>

          {/* ── Formula Explainer ── */}
          <section>
            <div className="bg-[#16213e] rounded-xl border border-[#2d4a66] p-5">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-3">How It&rsquo;s Calculated</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                <div className="bg-[#0d1b2a] rounded-lg px-5 py-3 font-mono text-sm text-[#ffd700] border border-[#ffd700]/20 text-center">
                  Efficiency % = (Actual Points &divide; Max Possible Points) &times; 100
                </div>
                <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                  Max possible points represents what the manager would have scored had they set the optimal lineup
                  for that week, using only players on their roster. Calculated across all 14 regular season weeks.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
