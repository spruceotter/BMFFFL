import Head from 'next/head';
import { useState } from 'react';
import { Target, TrendingUp, AlertTriangle, Star, Trophy } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type WeekKey = 'week1' | 'week8' | 'week14' | 'championship';

interface WeekEntry {
  manager:     string;
  actual:      number;
  bestBall:    number;
  pctOptimal:  number;
  notes?:      string;
}

interface SeasonSummaryEntry {
  manager:      string;
  totalActual:  number;
  totalBestBall: number;
  avgPctOptimal: number;
  perfectWeeks:  number;
}

interface BenchDisaster {
  rank:    number;
  week:    number;
  manager: string;
  detail:  string;
  loss:    number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const WEEK_DATA: Record<WeekKey, { label: string; subtitle: string; rows: WeekEntry[] }> = {
  week1: {
    label: 'Week 1',
    subtitle: 'Opening week lineup decisions',
    rows: [
      { manager: 'MLSchools12',     actual: 164.2, bestBall: 178.4, pctOptimal: 92, notes: "Benched De'Von Achane" },
      { manager: 'Tubes94',         actual: 171.8, bestBall: 188.6, pctOptimal: 91, notes: 'Benched WR backup' },
      { manager: 'JuicyBussy',      actual: 148.4, bestBall: 196.2, pctOptimal: 76, notes: 'Benched Bijan Robinson (bye?)' },
    ],
  },
  week8: {
    label: 'Week 8',
    subtitle: 'Most variance week of the season',
    rows: [
      { manager: 'JuicyBussy',      actual: 208.6, bestBall: 208.6, pctOptimal: 100, notes: 'Perfect lineup!' },
      { manager: 'Cmaleski',        actual: 172.4, bestBall: 198.6, pctOptimal: 87,  notes: undefined },
      { manager: 'rbr',             actual: 164.8, bestBall: 164.8, pctOptimal: 100, notes: 'Perfect lineup!' },
    ],
  },
  week14: {
    label: 'Week 14',
    subtitle: 'Playoff bubble week — last regular season game',
    rows: [
      { manager: 'Cmaleski',        actual: 162.8, bestBall: 192.4, pctOptimal: 85, notes: 'Bench points could have changed playoff seeding' },
      { manager: 'SexMachineAndyD', actual: 158.4, bestBall: 158.4, pctOptimal: 100, notes: 'Perfect lineup in must-win' },
      { manager: 'tdtd19844',       actual: 154.6, bestBall: 178.2, pctOptimal: 87,  notes: 'Made playoffs anyway' },
    ],
  },
  championship: {
    label: 'Championship',
    subtitle: '"What If" — the title game',
    rows: [
      { manager: 'tdtd19844',       actual: 174.2, bestBall: 192.4, pctOptimal: 91, notes: 'Would still have won by more' },
      { manager: 'Tubes94',         actual: 165.8, bestBall: 184.2, pctOptimal: 90, notes: 'Best ball would have been enough to win!' },
    ],
  },
};

const SEASON_SUMMARY: SeasonSummaryEntry[] = [
  { manager: 'rbr',             totalActual: 1992.0, totalBestBall: 2186.4, avgPctOptimal: 91.2, perfectWeeks: 3 },
  { manager: 'MLSchools12',     totalActual: 2118.6, totalBestBall: 2358.4, avgPctOptimal: 89.8, perfectWeeks: 2 },
  { manager: 'Tubes94',         totalActual: 2159.6, totalBestBall: 2443.8, avgPctOptimal: 88.4, perfectWeeks: 1 },
  { manager: 'JuicyBussy',      totalActual: 1876.2, totalBestBall: 2155.0, avgPctOptimal: 87.1, perfectWeeks: 1 },
  { manager: 'SexMachineAndyD', totalActual: 2054.2, totalBestBall: 2381.2, avgPctOptimal: 86.3, perfectWeeks: 2 },
  { manager: 'eldridm20',       totalActual: 1936.8, totalBestBall: 2285.6, avgPctOptimal: 84.7, perfectWeeks: 2 },
  { manager: 'tdtd19844',       totalActual: 1981.4, totalBestBall: 2360.4, avgPctOptimal: 83.9, perfectWeeks: 1 },
  { manager: 'Cmaleski',        totalActual: 1990.4, totalBestBall: 2409.8, avgPctOptimal: 82.6, perfectWeeks: 0 },
  { manager: 'eldridsm',        totalActual: 1884.6, totalBestBall: 2314.8, avgPctOptimal: 81.4, perfectWeeks: 1 },
  { manager: 'Grandes',         totalActual: 1812.8, totalBestBall: 2270.4, avgPctOptimal: 79.8, perfectWeeks: 0 },
  { manager: 'Cogdeill11',      totalActual: 1758.4, totalBestBall: 2277.4, avgPctOptimal: 77.2, perfectWeeks: 0 },
  { manager: 'Escuelas',        totalActual: 1714.2, totalBestBall: 2307.2, avgPctOptimal: 74.3, perfectWeeks: 0 },
];

const BENCH_DISASTERS: BenchDisaster[] = [
  {
    rank: 1,
    week: 11,
    manager: 'Escuelas',
    detail: 'Benched two players who combined for 84 pts in favor of two who scored 12 total — a 72-point swing that defined their season.',
    loss: 72,
  },
  {
    rank: 2,
    week: 5,
    manager: 'Grandes',
    detail: "Benched Josh Allen who scored 42 pts; started backup QB who got 8 pts — a 34-point gift to the opponent.",
    loss: 34,
  },
  {
    rank: 3,
    week: 3,
    manager: 'Cogdeill11',
    detail: 'Flex spot decision — chose the wrong player by 38 points. A single slot decision that cost a win.',
    loss: 38,
  },
];

const WEEKS: { key: WeekKey; label: string }[] = [
  { key: 'week1',        label: 'Week 1' },
  { key: 'week8',        label: 'Week 8' },
  { key: 'week14',       label: 'Week 14' },
  { key: 'championship', label: 'Championship' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pctColor(pct: number): string {
  if (pct >= 95) return 'text-emerald-400';
  if (pct >= 88) return 'text-green-400';
  if (pct >= 80) return 'text-yellow-400';
  if (pct >= 72) return 'text-orange-400';
  return 'text-red-400';
}

function pctBg(pct: number): string {
  if (pct >= 95) return 'bg-emerald-500';
  if (pct >= 88) return 'bg-green-500';
  if (pct >= 80) return 'bg-yellow-500';
  if (pct >= 72) return 'bg-orange-400';
  return 'bg-red-500';
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BestBallPage() {
  const [activeWeek, setActiveWeek] = useState<WeekKey>('week1');

  const weekData = WEEK_DATA[activeWeek];

  return (
    <>
      <Head>
        <title>Best Ball Analysis | BMFFFL Analytics</title>
        <meta
          name="description"
          content="2025 BMFFFL season best ball analysis — maximum lineup vs. actual lineup. Who left points on the bench, who aced their lineup calls, and what could have been."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ── Page Header ── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#ffd700]">Analytics</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-1">Best Ball Analysis</h1>
          <p className="text-slate-400 text-sm">
            Maximum lineup vs. actual lineup &mdash; who left points on the bench?
          </p>
          <p className="text-slate-500 text-xs mt-1">2025 Season &middot; Weeks 1&ndash;14</p>

          {/* Bimfle note */}
          <div className="mt-5 inline-block bg-[#ffd700]/5 border border-[#ffd700]/20 rounded-lg px-4 py-3 max-w-2xl">
            <p className="text-sm text-[#ffd700] italic leading-relaxed">
              &ldquo;Best ball analysis reveals the gap between optimal management and actual results.
              rbr&rsquo;s 91.2% optimal rate is the finest lineup management in the league &mdash; a fact
              that makes their failure to win a championship all the more poignant.&rdquo;
            </p>
            <p className="text-xs text-[#ffd700]/60 mt-1">~Love, Bimfle</p>
          </div>
        </div>
      </section>

      {/* ── Perfect Week Callout ── */}
      <div className="bg-[#16213e] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-[#ffd700]">
              <Star className="w-4 h-4 fill-[#ffd700]" aria-hidden="true" />
              <span className="text-sm font-black uppercase tracking-widest">Perfect Week Spotlight</span>
            </div>
            <p className="text-sm text-slate-300">
              <span className="font-bold text-white">JuicyBussy</span> posted a{' '}
              <span className="font-black text-[#ffd700]">208.6</span>-point week in Week 8 at{' '}
              <span className="font-bold text-emerald-400">100% optimal</span> &mdash; every possible player
              performed to maximum. The highest single-week best ball score in the league.
            </p>
          </div>
        </div>
      </div>

      {/* ── Season Summary Table ── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            <h2 className="text-lg font-black text-white uppercase tracking-widest">
              Season Summary &mdash; All 14 Weeks
            </h2>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Ranked by average % optimal &mdash; how efficiently each manager converted their roster into lineup points.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Season best ball summary">
              <thead>
                <tr className="border-b border-[#2d4a66]">
                  <th className="text-left py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500 w-8">#</th>
                  <th className="text-left py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">Manager</th>
                  <th className="text-right py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">Actual Pts</th>
                  <th className="text-right py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">Best Ball</th>
                  <th className="text-right py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">Left on Bench</th>
                  <th className="text-right py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">% Optimal</th>
                  <th className="text-center py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">Perfect Wks</th>
                </tr>
              </thead>
              <tbody>
                {SEASON_SUMMARY.map((row, idx) => {
                  const benchedPts = (row.totalBestBall - row.totalActual).toFixed(1);
                  const isPerfectContender = row.perfectWeeks >= 2;
                  return (
                    <tr
                      key={row.manager}
                      className={cn(
                        'border-b border-[#2d4a66]/50 transition-colors',
                        idx === 0
                          ? 'bg-[#ffd700]/5'
                          : idx % 2 === 0 ? 'bg-[#16213e]/40' : ''
                      )}
                    >
                      <td className="py-3 px-3 text-slate-500 font-mono text-xs">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <span className={cn('font-bold', idx === 0 ? 'text-[#ffd700]' : 'text-white')}>
                          {row.manager}
                        </span>
                        {isPerfectContender && (
                          <Star
                            className="inline w-3 h-3 fill-[#ffd700] text-[#ffd700] ml-1.5 -mt-0.5"
                            aria-label="Multiple perfect weeks"
                          />
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-300">{row.totalActual.toFixed(1)}</td>
                      <td className="py-3 px-3 text-right font-mono text-slate-300">{row.totalBestBall.toFixed(1)}</td>
                      <td className="py-3 px-3 text-right font-mono text-orange-400 font-semibold">
                        &minus;{benchedPts}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-20 h-1.5 rounded-full bg-[#2d4a66] overflow-hidden hidden sm:block">
                            <div
                              className={cn('h-full rounded-full', pctBg(row.avgPctOptimal))}
                              style={{ width: `${((row.avgPctOptimal - 70) / 25) * 100}%` }}
                            />
                          </div>
                          <span className={cn('font-black text-sm tabular-nums', pctColor(row.avgPctOptimal))}>
                            {row.avgPctOptimal.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {row.perfectWeeks > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[#ffd700] font-bold text-xs">
                            <Star className="w-3 h-3 fill-[#ffd700]" aria-hidden="true" />
                            {row.perfectWeeks}
                          </span>
                        ) : (
                          <span className="text-slate-600 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Week Selector + Detail Table ── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            <h2 className="text-lg font-black text-white uppercase tracking-widest">
              Notable Weeks
            </h2>
          </div>

          {/* Week selector tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {WEEKS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveWeek(key)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-bold transition-colors duration-100',
                  activeWeek === key
                    ? 'bg-[#ffd700] text-[#1a1a2e]'
                    : 'bg-[#16213e] text-slate-400 hover:text-white border border-[#2d4a66]'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Week context */}
          <p className="text-xs text-slate-500 mb-4">{weekData.subtitle}</p>

          {/* Week table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label={`${weekData.label} best ball detail`}>
              <thead>
                <tr className="border-b border-[#2d4a66]">
                  <th className="text-left py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">Manager</th>
                  <th className="text-right py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">Actual</th>
                  <th className="text-right py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">Best Ball</th>
                  <th className="text-right py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">% Optimal</th>
                  <th className="text-left py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">Notes</th>
                </tr>
              </thead>
              <tbody>
                {weekData.rows.map((row) => {
                  const isPerfect = row.pctOptimal === 100;
                  return (
                    <tr
                      key={row.manager}
                      className={cn(
                        'border-b border-[#2d4a66]/50 transition-colors',
                        isPerfect ? 'bg-emerald-500/5' : 'hover:bg-[#16213e]/40'
                      )}
                    >
                      <td className="py-3 px-3">
                        <span className={cn('font-bold', isPerfect ? 'text-emerald-400' : 'text-white')}>
                          {row.manager}
                        </span>
                        {isPerfect && (
                          <span className="ml-2 text-xs font-black text-emerald-400 uppercase tracking-wider">
                            Perfect
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-300">
                        {row.actual.toFixed(1)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-white">
                        {row.bestBall.toFixed(1)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className={cn('font-black tabular-nums', pctColor(row.pctOptimal))}>
                          {row.pctOptimal}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-xs">
                        {row.notes ?? '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Championship "What If" box */}
          {activeWeek === 'championship' && (
            <div className="mt-6 bg-[#16213e] border border-[#ffd700]/30 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
                <h3 className="text-sm font-black text-[#ffd700] uppercase tracking-widest">
                  Championship &ldquo;What If&rdquo;
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#0d1b2a] rounded-lg p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-bold">tdtd19844 (Champion)</p>
                  <p className="text-white text-sm">
                    Actual: <span className="font-black text-[#ffd700]">174.20</span>
                  </p>
                  <p className="text-slate-300 text-sm">
                    Best Ball: <span className="font-semibold">192.40</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-2">Would have won by even more.</p>
                </div>
                <div className="bg-[#0d1b2a] rounded-lg p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-bold">Tubes94 (Runner-Up)</p>
                  <p className="text-white text-sm">
                    Actual: <span className="font-black text-orange-400">165.80</span>
                  </p>
                  <p className="text-slate-300 text-sm">
                    Best Ball: <span className="font-semibold">184.20</span>
                  </p>
                  <p className="text-xs text-orange-400 mt-2 font-semibold">
                    Optimal lineup would have been enough to win the championship.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Bench Disasters Hall of Shame ── */}
      <section className="bg-[#0d1b2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" aria-hidden="true" />
            <h2 className="text-lg font-black text-white uppercase tracking-widest">
              Bench Disasters &mdash; Hall of Shame
            </h2>
          </div>
          <p className="text-xs text-slate-500 mb-6">
            The three most catastrophic individual lineup decisions of the 2025 season.
          </p>

          <div className="flex flex-col gap-4">
            {BENCH_DISASTERS.map((d) => (
              <div
                key={d.rank}
                className={cn(
                  'bg-[#16213e] rounded-xl p-5 border',
                  d.rank === 1 ? 'border-red-500/40' : 'border-[#2d4a66]'
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Rank badge */}
                  <div
                    className={cn(
                      'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black',
                      d.rank === 1 ? 'bg-red-500/20 text-red-400' : 'bg-[#2d4a66]/60 text-slate-400'
                    )}
                  >
                    {d.rank}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-black text-white">{d.manager}</span>
                      <span className="text-xs text-slate-500">Week {d.week}</span>
                      <span
                        className={cn(
                          'text-xs font-black px-2 py-0.5 rounded-full',
                          d.rank === 1
                            ? 'bg-red-500/15 text-red-400'
                            : 'bg-orange-500/15 text-orange-400'
                        )}
                      >
                        &minus;{d.loss} pts
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{d.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
