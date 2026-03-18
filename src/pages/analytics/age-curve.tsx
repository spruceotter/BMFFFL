import Head from 'next/head';
import { TrendingUp, Users, AlertTriangle, Trophy } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type DynastyPhase = 'Opening Window' | 'Peak Window' | 'Closing Window' | 'Rebuilding' | 'Opening/Peak';

interface RosterAgeEntry {
  manager: string;
  qbAge: number;
  rbAge: number;
  wrAge: number;
  teAge: number;
  overallAvg: number;
  phase: DynastyPhase;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ROSTER_DATA: RosterAgeEntry[] = [
  { manager: 'MLSchools12',    qbAge: 28, rbAge: 26, wrAge: 25, teAge: 27, overallAvg: 26.5, phase: 'Peak Window'     },
  { manager: 'Tubes94',        qbAge: 26, rbAge: 23, wrAge: 24, teAge: 25, overallAvg: 24.5, phase: 'Opening Window'  },
  { manager: 'SexMachineAndyD',qbAge: 27, rbAge: 25, wrAge: 24, teAge: 26, overallAvg: 25.5, phase: 'Opening Window'  },
  { manager: 'JuicyBussy',     qbAge: 26, rbAge: 23, wrAge: 25, teAge: 27, overallAvg: 25.3, phase: 'Opening Window'  },
  { manager: 'rbr',            qbAge: 29, rbAge: 28, wrAge: 27, teAge: 26, overallAvg: 27.5, phase: 'Closing Window'  },
  { manager: 'tdtd19844',      qbAge: 25, rbAge: 24, wrAge: 24, teAge: 24, overallAvg: 24.3, phase: 'Opening Window'  },
  { manager: 'eldridsm',       qbAge: 29, rbAge: 27, wrAge: 28, teAge: 27, overallAvg: 27.8, phase: 'Closing Window'  },
  { manager: 'eldridm20',      qbAge: 27, rbAge: 26, wrAge: 26, teAge: 23, overallAvg: 25.5, phase: 'Peak Window'     },
  { manager: 'Cmaleski',       qbAge: 27, rbAge: 26, wrAge: 23, teAge: 29, overallAvg: 26.3, phase: 'Opening/Peak'    },
  { manager: 'Grandes',        qbAge: 30, rbAge: 28, wrAge: 29, teAge: 27, overallAvg: 28.5, phase: 'Rebuilding'      },
  { manager: 'Cogdeill11',     qbAge: 31, rbAge: 29, wrAge: 30, teAge: 28, overallAvg: 29.5, phase: 'Rebuilding'      },
  { manager: 'Escuelas',       qbAge: 26, rbAge: 24, wrAge: 24, teAge: 25, overallAvg: 24.8, phase: 'Opening Window'  },
];

const LEAGUE_AVG = 26.3;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function phaseColors(phase: DynastyPhase): {
  badge: string;
  bg: string;
  border: string;
  bar: string;
  text: string;
} {
  switch (phase) {
    case 'Opening Window':
      return {
        badge:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        bg:     'bg-emerald-500/5',
        border: 'border-emerald-500/20',
        bar:    'bg-emerald-500',
        text:   'text-emerald-400',
      };
    case 'Peak Window':
      return {
        badge:  'bg-[#ffd700]/15 text-[#ffd700] border-[#ffd700]/30',
        bg:     'bg-[#ffd700]/5',
        border: 'border-[#ffd700]/20',
        bar:    'bg-[#ffd700]',
        text:   'text-[#ffd700]',
      };
    case 'Opening/Peak':
      return {
        badge:  'bg-amber-400/15 text-amber-300 border-amber-400/30',
        bg:     'bg-amber-400/5',
        border: 'border-amber-400/20',
        bar:    'bg-amber-400',
        text:   'text-amber-300',
      };
    case 'Closing Window':
      return {
        badge:  'bg-orange-500/15 text-orange-400 border-orange-500/30',
        bg:     'bg-orange-500/5',
        border: 'border-orange-500/20',
        bar:    'bg-orange-500',
        text:   'text-orange-400',
      };
    case 'Rebuilding':
      return {
        badge:  'bg-[#e94560]/15 text-[#e94560] border-[#e94560]/30',
        bg:     'bg-[#e94560]/5',
        border: 'border-[#e94560]/20',
        bar:    'bg-[#e94560]',
        text:   'text-[#e94560]',
      };
  }
}

// Map avg age to a bar fill percentage for the visual
// Range: 23–30 maps to 10%–100%
function avgToBarPct(avg: number): string {
  const pct = Math.round(10 + ((avg - 23) / (30 - 23)) * 90);
  return `${Math.min(100, Math.max(10, pct))}%`;
}

function posAvg(pos: 'qbAge' | 'rbAge' | 'wrAge' | 'teAge'): number {
  const sum = ROSTER_DATA.reduce((acc, r) => acc + r[pos], 0);
  return Math.round((sum / ROSTER_DATA.length) * 10) / 10;
}

const POS_AVGS = {
  QB: posAvg('qbAge'),
  RB: posAvg('rbAge'),
  WR: posAvg('wrAge'),
  TE: posAvg('teAge'),
};

const PHASE_DIST: { phase: DynastyPhase; count: number }[] = [
  { phase: 'Opening Window', count: 5 },
  { phase: 'Peak Window',    count: 2 },
  { phase: 'Closing Window', count: 2 },
  { phase: 'Rebuilding',     count: 2 },
];
// Opening/Peak (Cmaleski) rolled into summary note below the distribution

// ─── Sub-components ───────────────────────────────────────────────────────────

function PhaseBadge({ phase }: { phase: DynastyPhase }) {
  const c = phaseColors(phase);
  return (
    <span className={cn(
      'inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap',
      c.badge
    )}>
      {phase}
    </span>
  );
}

function AgeCell({ age, pos }: { age: number; pos: 'QB' | 'RB' | 'WR' | 'TE' }) {
  // Color-code based on position-specific sweet spots
  let color = 'text-slate-300';
  if (pos === 'QB')  color = age >= 26 && age <= 33 ? 'text-emerald-400' : age > 33 ? 'text-[#e94560]' : 'text-slate-400';
  if (pos === 'RB')  color = age >= 23 && age <= 26 ? 'text-emerald-400' : age > 28  ? 'text-[#e94560]' : age === 27 || age === 28 ? 'text-orange-400' : 'text-slate-400';
  if (pos === 'WR')  color = age >= 24 && age <= 28 ? 'text-emerald-400' : age > 31  ? 'text-[#e94560]' : age >= 29  ? 'text-orange-400' : 'text-slate-400';
  if (pos === 'TE')  color = age >= 25 && age <= 29 ? 'text-emerald-400' : age > 33  ? 'text-[#e94560]' : age >= 30  ? 'text-orange-400' : 'text-slate-400';
  return <span className={cn('text-xs font-bold tabular-nums', color)}>{age}</span>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AgeCurvePage() {
  const sorted = [...ROSTER_DATA].sort((a, b) => a.overallAvg - b.overallAvg);

  return (
    <>
      <Head>
        <title>Dynasty Age Curve Analysis — BMFFFL Analytics</title>
        <meta
          name="description"
          content="Roster age profiles and dynasty window assessment for all 12 BMFFFL teams. See where each manager sits in their dynasty cycle — opening, peak, closing, or rebuilding."
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
            Dynasty Age Curve Analysis
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Roster age profiles and dynasty window assessment — March 2026
          </p>
        </header>

        {/* Summary stat + phase distribution */}
        <section className="mb-10 grid grid-cols-1 lg:grid-cols-2 gap-6" aria-labelledby="summary-heading">

          {/* League avg callout */}
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-6 flex flex-col justify-between gap-6">
            <div>
              <h2 id="summary-heading" className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
                League Snapshot
              </h2>
              <p className="text-xs text-slate-500 mb-5">Skilled positions only (QB, RB, WR, TE) — 12 teams</p>

              <div className="rounded-lg bg-[#0d1b2a] border border-[#ffd700]/20 px-5 py-4 text-center mb-5">
                <p className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold mb-1">League Average Age</p>
                <p className="text-5xl font-black text-[#ffd700] tabular-nums leading-none">{LEAGUE_AVG}</p>
                <p className="text-sm text-slate-400 mt-2 font-semibold">Mid-cycle dynasty</p>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                At 26.3 years old across all skill positions, the BMFFFL sits squarely in the middle of a dynasty cycle.
                Teams are divided between those building toward a window and those competing in it.
                The championship window is present — but not universal.
              </p>
            </div>

            {/* Position averages bar */}
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">League-wide Position Averages</p>
              <div className="space-y-2" aria-label="Average age by position across all 12 BMFFFL teams">
                {(Object.entries(POS_AVGS) as [string, number][]).map(([pos, avg]) => {
                  const pct = Math.round(((avg - 22) / (32 - 22)) * 100);
                  const posColors: Record<string, string> = { QB: 'bg-blue-500', RB: 'bg-emerald-500', WR: 'bg-[#ffd700]', TE: 'bg-purple-500' };
                  return (
                    <div key={pos} className="flex items-center gap-3">
                      <div className="w-8 shrink-0 text-right">
                        <span className="text-xs font-bold text-slate-400">{pos}</span>
                      </div>
                      <div className="flex-1 bg-[#0d1b2a] rounded-sm h-6 overflow-hidden relative border border-[#2d4a66]/40">
                        <div
                          className={cn('h-full rounded-sm', posColors[pos])}
                          style={{ width: `${pct}%`, opacity: 0.7 }}
                          aria-hidden="true"
                        />
                        <div className="absolute inset-0 flex items-center px-2">
                          <span className="text-[11px] font-bold text-white/90 tabular-nums">{avg}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-600 mt-2">Bar length relative to age range 22–32</p>
            </div>
          </div>

          {/* Phase distribution */}
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-6">
            <h2 className="text-base font-bold text-white mb-1">Dynasty Phase Distribution</h2>
            <p className="text-xs text-slate-500 mb-5">Where BMFFFL rosters sit in their dynasty cycle</p>

            <div className="space-y-4">
              {PHASE_DIST.map(({ phase, count }) => {
                const c = phaseColors(phase);
                const pct = Math.round((count / 12) * 100);
                return (
                  <div key={phase}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <PhaseBadge phase={phase} />
                        <span className="text-xs text-slate-500">{count} team{count !== 1 ? 's' : ''}</span>
                      </div>
                      <span className={cn('text-xs font-bold tabular-nums', c.text)}>{pct}%</span>
                    </div>
                    <div className="h-2.5 bg-[#0d1b2a] rounded-full overflow-hidden border border-[#2d4a66]/30">
                      <div
                        className={cn('h-full rounded-full', c.bar)}
                        style={{ width: `${pct}%`, opacity: 0.8 }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-600 mt-4 leading-relaxed">
              One additional team (Cmaleski) sits on the Opening/Peak boundary at 26.3 avg.
            </p>

            {/* Phase definitions */}
            <div className="mt-5 pt-4 border-t border-[#2d4a66] space-y-2.5">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">Phase Definitions</p>
              {(
                [
                  { phase: 'Opening Window' as DynastyPhase, def: 'Avg age <25.5 — young roster, dynasty ceiling ahead, 3–5 year window opening' },
                  { phase: 'Peak Window'    as DynastyPhase, def: 'Avg age 25.5–27 — prime dynasty years, championship window now'                },
                  { phase: 'Closing Window' as DynastyPhase, def: 'Avg age 27–29 — stars aging, must compete now or begin rebuilding'             },
                  { phase: 'Rebuilding'     as DynastyPhase, def: 'Avg age 29+ — roster needs overhaul, draft capital critical'                   },
                ]
              ).map(({ phase, def }) => {
                const c = phaseColors(phase);
                return (
                  <div key={phase} className={cn('rounded-lg border px-3 py-2', c.border, c.bg)}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <PhaseBadge phase={phase} />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{def}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Main roster table */}
        <section className="mb-10" aria-labelledby="roster-table-heading">
          <h2 id="roster-table-heading" className="text-lg font-bold text-white mb-2">
            Roster Age Profiles — All 12 Managers
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Sorted youngest to oldest overall average. Cell color indicates position-specific age health (green = prime window, orange = late/declining, red = past peak).
          </p>

          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm" aria-label="BMFFFL roster age profiles by manager">
                <thead>
                  <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider sticky left-0 bg-[#0f2744] z-10">Manager</th>
                    <th scope="col" className="px-3 py-3 text-center text-xs text-blue-400 font-semibold uppercase tracking-wider">QB</th>
                    <th scope="col" className="px-3 py-3 text-center text-xs text-emerald-400 font-semibold uppercase tracking-wider">RB</th>
                    <th scope="col" className="px-3 py-3 text-center text-xs text-[#ffd700] font-semibold uppercase tracking-wider">WR</th>
                    <th scope="col" className="px-3 py-3 text-center text-xs text-purple-400 font-semibold uppercase tracking-wider">TE</th>
                    <th scope="col" className="px-3 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider">Avg</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider min-w-[140px]">Phase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3347]">
                  {sorted.map((row, idx) => {
                    const isEven = idx % 2 === 0;
                    const c = phaseColors(row.phase);
                    return (
                      <tr
                        key={row.manager}
                        className={cn(
                          'transition-colors duration-100 hover:bg-[#1f3550]',
                          isEven ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                        )}
                      >
                        <td className={cn(
                          'px-4 py-3 sticky left-0 z-10 font-bold text-white',
                          isEven ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                        )}>
                          {row.manager}
                        </td>
                        <td className="px-3 py-3 text-center"><AgeCell age={row.qbAge} pos="QB" /></td>
                        <td className="px-3 py-3 text-center"><AgeCell age={row.rbAge} pos="RB" /></td>
                        <td className="px-3 py-3 text-center"><AgeCell age={row.wrAge} pos="WR" /></td>
                        <td className="px-3 py-3 text-center"><AgeCell age={row.teAge} pos="TE" /></td>
                        <td className="px-3 py-3 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className={cn('text-sm font-black tabular-nums', c.text)}>{row.overallAvg}</span>
                            <div className="w-16 h-1 bg-[#0d1b2a] rounded-full overflow-hidden border border-[#2d4a66]/30">
                              <div
                                className={cn('h-full rounded-full', c.bar)}
                                style={{ width: avgToBarPct(row.overallAvg), opacity: 0.75 }}
                                aria-hidden="true"
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <PhaseBadge phase={row.phase} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {/* League avg footer row */}
                <tfoot>
                  <tr className="bg-[#0d1b2a] border-t-2 border-[#2d4a66]">
                    <td className="px-4 py-2.5 sticky left-0 bg-[#0d1b2a] z-10">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">League Avg</span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="text-xs font-bold text-blue-400 tabular-nums">{POS_AVGS.QB}</span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="text-xs font-bold text-emerald-400 tabular-nums">{POS_AVGS.RB}</span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="text-xs font-bold text-[#ffd700] tabular-nums">{POS_AVGS.WR}</span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="text-xs font-bold text-purple-400 tabular-nums">{POS_AVGS.TE}</span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="text-sm font-black text-slate-300 tabular-nums">{LEAGUE_AVG}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-[10px] text-slate-500 italic">Mid-cycle dynasty</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>

        {/* Two-column: optimal age window + position aging notes */}
        <section className="mb-10 grid grid-cols-1 lg:grid-cols-2 gap-6" aria-labelledby="sweet-spot-heading">

          {/* Optimal age window */}
          <div className="rounded-xl border border-[#ffd700]/20 bg-[#ffd700]/5 p-6">
            <h2 id="sweet-spot-heading" className="text-base font-bold text-white mb-1">
              Optimal Age Window
            </h2>
            <p className="text-xs text-slate-500 mb-4">The sweet spot for dynasty rosters</p>

            <div className="rounded-lg bg-[#0d1b2a] border border-[#ffd700]/30 px-4 py-3 mb-4 text-center">
              <p className="text-3xl font-black text-[#ffd700]">Ages 24–27</p>
              <p className="text-xs text-slate-400 mt-1">Prime dynasty years</p>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Teams whose overall roster average falls in the 24–27 band are in their prime dynasty years. They have the youth to sustain
              a multi-year run and the maturity to win now. This is the zone where championships are won and rosters are built to last.
            </p>

            <div className="space-y-2">
              {sorted
                .filter(r => r.overallAvg >= 24 && r.overallAvg <= 27)
                .map(r => {
                  const c = phaseColors(r.phase);
                  return (
                    <div key={r.manager} className={cn('rounded-lg border px-3 py-2 flex items-center justify-between gap-2', c.border, c.bg)}>
                      <span className="text-sm font-bold text-white">{r.manager}</span>
                      <div className="flex items-center gap-2">
                        <span className={cn('text-xs font-bold tabular-nums', c.text)}>{r.overallAvg}</span>
                        <PhaseBadge phase={r.phase} />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Position-specific aging notes */}
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-6">
            <h2 className="text-base font-bold text-white mb-1">Position Aging Notes</h2>
            <p className="text-xs text-slate-500 mb-4">How each skilled position ages in dynasty</p>

            <div className="space-y-3">
              {[
                {
                  pos: 'QB',
                  color: 'text-blue-400',
                  border: 'border-blue-500/20',
                  bg: 'bg-blue-500/5',
                  bar: 'bg-blue-500',
                  peak: '26–33',
                  cliff: '34+',
                  note: 'QBs age gracefully — they peak later and hold value longer than any other position. A 30-year-old QB can be a dynasty cornerstone. The cliff after 34 is real but the runway is long.',
                },
                {
                  pos: 'RB',
                  color: 'text-emerald-400',
                  border: 'border-emerald-500/20',
                  bg: 'bg-emerald-500/5',
                  bar: 'bg-emerald-500',
                  peak: '23–26',
                  cliff: '28+',
                  note: 'The most age-sensitive position. The RB cliff arrives fast and hard. A 28-year-old RB on your dynasty roster is a liability unless you\'re competing right now.',
                },
                {
                  pos: 'WR',
                  color: 'text-[#ffd700]',
                  border: 'border-[#ffd700]/20',
                  bg: 'bg-[#ffd700]/5',
                  bar: 'bg-[#ffd700]',
                  peak: '24–28',
                  cliff: '31+',
                  note: 'WRs have the second-widest prime window. Elite WRs can produce at 30–31, but dynasty value dips well before production does. Sell at 27, re-evaluate at 28.',
                },
                {
                  pos: 'TE',
                  color: 'text-purple-400',
                  border: 'border-purple-500/20',
                  bg: 'bg-purple-500/5',
                  bar: 'bg-purple-500',
                  peak: '25–29',
                  cliff: '33+',
                  note: 'TEs age the best of any skill position. The Travis Kelce example proves a TE can dominate through 32–33. Slow starts are the tradeoff — patience in years 1–2 is rewarded.',
                },
              ].map(item => (
                <div key={item.pos} className={cn('rounded-lg border p-3', item.border, item.bg)}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn('text-sm font-black', item.color)}>{item.pos}</span>
                    <div className="flex items-center gap-1.5 ml-auto">
                      <span className="text-[10px] text-slate-500">Peak</span>
                      <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded', item.color, item.bg, item.border, 'border')}>
                        {item.peak}
                      </span>
                      <span className="text-[10px] text-slate-500">Cliff</span>
                      <span className="text-[10px] font-bold text-[#e94560] px-1.5 py-0.5 rounded bg-[#e94560]/10 border border-[#e94560]/20">
                        {item.cliff}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Age vs Performance callout */}
        <section className="mb-10" aria-labelledby="perf-callout-heading">
          <h2 id="perf-callout-heading" className="text-lg font-bold text-white mb-4">
            Age vs. Performance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Championship callout */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 sm:col-span-2 lg:col-span-1">
              <div className="flex items-start gap-3 mb-3">
                <Trophy className="w-5 h-5 text-[#ffd700] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-0.5">Championship Proof</p>
                  <h3 className="text-sm font-bold text-white leading-tight">Youth Wins Championships</h3>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-emerald-400">tdtd19844</span> won the 2025 BMFFFL championship with the{' '}
                <span className="font-bold text-white">3rd youngest roster</span> in the league (24.3 overall avg).
                The data confirms: dynasty windows open early, not late.
                A young, talented roster can overcome the experience gap — especially when the players are in their prime athletic years.
              </p>
            </div>

            {/* Oldest roster callout */}
            <div className="rounded-xl border border-[#e94560]/30 bg-[#e94560]/5 p-5">
              <div className="flex items-start gap-3 mb-3">
                <AlertTriangle className="w-5 h-5 text-[#e94560] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-[10px] text-[#e94560] font-bold uppercase tracking-widest mb-0.5">Rebuilding Alert</p>
                  <h3 className="text-sm font-bold text-white leading-tight">The Aging Problem</h3>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-[#e94560]">Cogdeill11</span> (29.5) and{' '}
                <span className="font-bold text-[#e94560]">Grandes</span> (28.5) sit well above the league average.
                Both rosters are in rebuild territory. Draft capital and patience — not trades for aging veterans — are the prescription.
              </p>
            </div>

            {/* Window balance callout */}
            <div className="rounded-xl border border-[#ffd700]/20 bg-[#ffd700]/5 p-5">
              <div className="flex items-start gap-3 mb-3">
                <TrendingUp className="w-5 h-5 text-[#ffd700] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-[10px] text-[#ffd700] font-bold uppercase tracking-widest mb-0.5">League Balance</p>
                  <h3 className="text-sm font-bold text-white leading-tight">Competitive Era</h3>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                With 5 teams in Opening Window, 2 in Peak, 2 Closing, and 2 Rebuilding, the BMFFFL is entering a{' '}
                <span className="font-bold text-white">competitive renaissance</span>. The young teams are closing fast.
                The aging teams must decide: compete hard in 2026 or begin the teardown.
              </p>
            </div>
          </div>
        </section>

        {/* Bimfle note */}
        <section className="mb-8" aria-labelledby="bimfle-note-heading">
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-6 py-5">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-3" id="bimfle-note-heading">
              A Note from Your Commissioner
            </p>
            <blockquote className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-[#ffd700] pl-4">
              &ldquo;The age curve is the dynasty manager&rsquo;s north star. The young roster is rich in potential but poor in present results.
              The aging roster is the inverse. Your Commissioner recommends the pursuit of perpetual youth without sacrificing competitive maturity.&rdquo;
            </blockquote>
            <p className="text-xs text-[#ffd700] font-bold mt-3 pl-4">~Love, Bimfle</p>
          </div>
        </section>

        {/* Data note footer */}
        <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="text-slate-400 font-semibold">Data note:</span>{' '}
            Age averages reflect skilled positions only (QB, RB, WR, TE) as of March 2026.
            Ages are approximate roster-weighted averages based on the primary starters and depth at each position.
            Dynasty phase thresholds are guidelines — individual roster construction, draft capital, and schedule context
            all factor into true dynasty window assessment.
          </p>
        </div>

      </div>
    </>
  );
}
