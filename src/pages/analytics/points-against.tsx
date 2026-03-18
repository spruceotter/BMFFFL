import { useState } from 'react';
import Head from 'next/head';
import { ShieldAlert, TrendingDown, Calendar, Star } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type ViewMode = '2025' | 'all-time';

interface SeasonEntry {
  manager: string;
  pf: number;
  pa: number;
  paRank: number;
  wins: number;
  losses: number;
  luckRating: number;
  luckLabel: string;
}

interface AllTimeEntry {
  rank: number;
  manager: string;
  careerPA: number;
  seasons: number;
  avgLuck: number;
  luckLabel: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SEASON_2025: SeasonEntry[] = [
  { manager: 'Cmaleski',       pf: 1990.4, pa: 1842.6, paRank: 1,  wins: 6,  losses: 8, luckRating: -3.2, luckLabel: 'Very Unlucky'    },
  { manager: 'JuicyBussy',     pf: 1876.2, pa: 1798.4, paRank: 2,  wins: 9,  losses: 5, luckRating: -0.8, luckLabel: 'Slightly Unlucky' },
  { manager: 'MLSchools12',    pf: 2118.6, pa: 1784.2, paRank: 3,  wins: 11, losses: 3, luckRating:  0.2, luckLabel: 'Neutral'          },
  { manager: 'rbr',            pf: 1992.0, pa: 1776.8, paRank: 4,  wins: 7,  losses: 7, luckRating: -1.4, luckLabel: 'Unlucky'          },
  { manager: 'Tubes94',        pf: 2159.6, pa: 1768.4, paRank: 5,  wins: 11, losses: 3, luckRating:  1.6, luckLabel: 'Lucky'            },
  { manager: 'SexMachineAndyD',pf: 2054.2, pa: 1756.2, paRank: 6,  wins: 9,  losses: 5, luckRating:  0.6, luckLabel: 'Slightly Lucky'   },
  { manager: 'tdtd19844',      pf: 1981.4, pa: 1744.8, paRank: 7,  wins: 8,  losses: 6, luckRating:  0.1, luckLabel: 'Neutral'          },
  { manager: 'eldridm20',      pf: 1936.8, pa: 1732.6, paRank: 8,  wins: 7,  losses: 7, luckRating:  0.0, luckLabel: 'Neutral'          },
  { manager: 'eldridsm',       pf: 1884.6, pa: 1718.4, paRank: 9,  wins: 5,  losses: 9, luckRating: -0.3, luckLabel: 'Neutral'          },
  { manager: 'Cogdeill11',     pf: 1758.4, pa: 1706.2, paRank: 10, wins: 4,  losses: 10, luckRating: -1.2, luckLabel: 'Unlucky'         },
  { manager: 'Grandes',        pf: 1812.8, pa: 1692.4, paRank: 11, wins: 5,  losses: 9, luckRating:  0.4, luckLabel: 'Slightly Lucky'   },
  { manager: 'Escuelas',       pf: 1714.2, pa: 1668.6, paRank: 12, wins: 4,  losses: 10, luckRating:  1.8, luckLabel: 'Lucky'           },
];

const ALL_TIME: AllTimeEntry[] = [
  { rank: 1, manager: 'MLSchools12', careerPA: 12840, seasons: 6, avgLuck:  0.3, luckLabel: 'Neutral'       },
  { rank: 2, manager: 'JuicyBussy',  careerPA: 11924, seasons: 6, avgLuck: -0.6, luckLabel: 'Slightly Unlucky' },
  { rank: 3, manager: 'rbr',         careerPA: 11642, seasons: 6, avgLuck: -0.9, luckLabel: 'Slightly Unlucky' },
  { rank: 4, manager: 'Grandes',     careerPA: 11284, seasons: 6, avgLuck:  0.2, luckLabel: 'Neutral'       },
  { rank: 5, manager: 'eldridsm',    careerPA: 11182, seasons: 6, avgLuck:  0.1, luckLabel: 'Neutral'       },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function luckColor(rating: number): string {
  if (rating <= -2.0) return '#ef4444';
  if (rating <= -0.5) return '#f97316';
  if (rating < 0.5)  return '#fbbf24';
  if (rating < 2.0)  return '#4ade80';
  return '#22c55e';
}

function luckBarWidth(rating: number): number {
  // rating range: -3 to +3 → map to 0–100%
  // center at 50%; each unit = ~16.67%
  const pct = 50 + (rating / 3) * 50;
  return Math.max(2, Math.min(98, pct));
}

function luckBarStyle(rating: number): { barLeft: string; barWidth: string; barColor: string } {
  const center = 50;
  const unitPct = (1 / 3) * 50;
  const offset = rating * unitPct;

  if (rating >= 0) {
    return {
      barLeft: `${center}%`,
      barWidth: `${Math.min(offset, 48)}%`,
      barColor: luckColor(rating),
    };
  } else {
    const w = Math.min(Math.abs(offset), 48);
    return {
      barLeft: `${center - w}%`,
      barWidth: `${w}%`,
      barColor: luckColor(rating),
    };
  }
}

// ─── Luck Distribution Chart ───────────────────────────────────────────────────

function LuckDistributionChart({ data }: { data: SeasonEntry[] }) {
  const sorted = [...data].sort((a, b) => a.luckRating - b.luckRating);

  return (
    <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-2 mb-2">
          <TrendingDown className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
          <h2 className="text-xl font-black text-white">Luck Distribution</h2>
        </div>
        <p className="text-slate-400 text-sm mb-6">
          Each bar extends left (unlucky) or right (lucky) from center. Red = schedule robbed you; green = schedule helped you.
        </p>

        {/* Scale labels */}
        <div className="flex justify-between text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-2 px-1">
          <span>-3 (Most Unlucky)</span>
          <span>0 (Neutral)</span>
          <span>+3 (Luckiest)</span>
        </div>

        {/* Center line reference */}
        <div className="relative space-y-2 mb-4">
          {/* Vertical center line */}
          <div
            className="absolute top-0 bottom-0 w-px bg-[#2d4a66] z-10 pointer-events-none"
            style={{ left: '50%' }}
            aria-hidden="true"
          />

          {sorted.map((entry) => {
            const { barLeft, barWidth, barColor } = luckBarStyle(entry.luckRating);
            const isInjustice = entry.manager === 'Cmaleski';

            return (
              <div key={entry.manager} className="flex items-center gap-3">
                <span
                  className={cn(
                    'text-xs w-36 shrink-0 text-right font-medium truncate',
                    isInjustice ? 'text-[#ffd700] font-black' : 'text-slate-300',
                  )}
                >
                  {entry.manager}
                  {isInjustice && ' *'}
                </span>
                <div className="flex-1 relative h-7 bg-[#16213e] rounded overflow-hidden">
                  <div
                    className="absolute top-0 h-full rounded transition-all duration-500"
                    style={{
                      left: barLeft,
                      width: barWidth,
                      backgroundColor: barColor,
                      opacity: 0.85,
                    }}
                  />
                </div>
                <span
                  className="text-xs font-bold w-16 shrink-0 tabular-nums"
                  style={{ color: barColor }}
                >
                  {entry.luckRating > 0 ? '+' : ''}{entry.luckRating.toFixed(1)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-4">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm bg-red-500" />
            Very Unlucky (&le; &minus;2.0)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm bg-orange-500" />
            Unlucky (&minus;2.0 to &minus;0.5)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm bg-yellow-400" />
            Neutral (&minus;0.5 to +0.5)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm bg-green-400" />
            Lucky (+0.5 to +2.0)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm bg-green-500" />
            Very Lucky (&ge; +2.0)
          </span>
        </div>
        <p className="text-xs text-slate-600 mt-2">* Cmaleski 2025 — most unlucky season in BMFFFL history</p>
      </div>
    </section>
  );
}

// ─── Main Season Table ─────────────────────────────────────────────────────────

function SeasonTable({ data }: { data: SeasonEntry[] }) {
  const maxPA = Math.max(...data.map((d) => d.pa));
  const minPA = Math.min(...data.map((d) => d.pa));

  return (
    <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
          <h2 className="text-xl font-black text-white">2025 Season — Points Against Rankings</h2>
        </div>
        <p className="text-slate-400 text-sm mb-6">
          Ranked by Points Against (highest first). Luck Rating: positive = schedule helped you; negative = schedule worked against you.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2d4a66]">
                <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 pr-2 w-8">
                  PA#
                </th>
                <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 pr-4">
                  Manager
                </th>
                <th className="pb-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500 pr-4 whitespace-nowrap">
                  Pts For
                </th>
                <th className="pb-3 text-right text-xs font-bold uppercase tracking-wider text-[#ffd700]/80 pr-4 whitespace-nowrap">
                  Pts Against
                </th>
                <th className="pb-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500 pr-4 whitespace-nowrap">
                  Record
                </th>
                <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 min-w-[160px]">
                  Luck Rating
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry) => {
                const isInjustice = entry.manager === 'Cmaleski';
                const paBarWidth = ((entry.pa - minPA) / (maxPA - minPA + 1)) * 100;
                const { barColor } = luckBarStyle(entry.luckRating);

                return (
                  <tr
                    key={entry.manager}
                    className={cn(
                      'border-b border-[#1a2d42] transition-colors duration-100',
                      isInjustice
                        ? 'bg-red-950/20 hover:bg-red-950/30'
                        : 'hover:bg-[#16213e]/50',
                    )}
                  >
                    {/* PA Rank */}
                    <td className="py-3 pr-2 text-slate-600 tabular-nums text-xs font-bold">
                      {entry.paRank === 1 && (
                        <span className="text-red-400 font-black" title="Highest PA">#1</span>
                      )}
                      {entry.paRank === data.length && (
                        <span className="text-green-400 font-black" title="Lowest PA">#{entry.paRank}</span>
                      )}
                      {entry.paRank !== 1 && entry.paRank !== data.length && (
                        <span className="text-slate-600">#{entry.paRank}</span>
                      )}
                    </td>

                    {/* Manager */}
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <span
                        className={cn(
                          'font-medium',
                          isInjustice ? 'text-[#ffd700] font-black' : 'text-white',
                        )}
                      >
                        {entry.manager}
                      </span>
                      {isInjustice && (
                        <span className="ml-2 text-[10px] text-red-400 font-black uppercase tracking-widest">
                          Injustice
                        </span>
                      )}
                    </td>

                    {/* Points For */}
                    <td className="py-3 pr-4 text-right tabular-nums text-slate-300">
                      {entry.pf.toFixed(1)}
                    </td>

                    {/* Points Against with mini bar */}
                    <td className="py-3 pr-4 text-right tabular-nums">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 bg-[#16213e] rounded overflow-hidden hidden sm:block">
                          <div
                            className="h-full rounded"
                            style={{
                              width: `${paBarWidth}%`,
                              backgroundColor: entry.paRank <= 3 ? '#ef4444' : entry.paRank >= 10 ? '#4ade80' : '#64748b',
                            }}
                          />
                        </div>
                        <span
                          className={cn(
                            'font-bold',
                            entry.paRank <= 3 ? 'text-red-400' : entry.paRank >= 10 ? 'text-green-400' : 'text-slate-300',
                          )}
                        >
                          {entry.pa.toFixed(1)}
                        </span>
                      </div>
                    </td>

                    {/* Record */}
                    <td className="py-3 pr-4 text-center tabular-nums text-slate-300 whitespace-nowrap">
                      {entry.wins}-{entry.losses}
                    </td>

                    {/* Luck Rating bar */}
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="relative w-32 h-4 bg-[#16213e] rounded overflow-hidden">
                          {/* center marker */}
                          <div
                            className="absolute top-0 bottom-0 w-px bg-[#2d4a66] z-10"
                            style={{ left: '50%' }}
                            aria-hidden="true"
                          />
                          {(() => {
                            const { barLeft, barWidth, barColor: bc } = luckBarStyle(entry.luckRating);
                            return (
                              <div
                                className="absolute top-0 h-full rounded"
                                style={{
                                  left: barLeft,
                                  width: barWidth,
                                  backgroundColor: bc,
                                  opacity: 0.8,
                                }}
                              />
                            );
                          })()}
                        </div>
                        <span
                          className="text-xs font-bold tabular-nums whitespace-nowrap"
                          style={{ color: barColor }}
                        >
                          {entry.luckRating > 0 ? '+' : ''}{entry.luckRating.toFixed(1)}
                        </span>
                        <span className="text-[10px] text-slate-500 hidden md:inline">
                          {entry.luckLabel}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-600 mt-4">
          Luck Rating = (Actual Wins &minus; Expected Wins based on PA) / 14 &times; standard factor.
          Positive = lucky schedule, negative = unlucky schedule.
        </p>
      </div>
    </section>
  );
}

// ─── Spotlight Card ────────────────────────────────────────────────────────────

function InjusticeSpotlight() {
  return (
    <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-[#16213e] border border-red-800/60 rounded-xl p-6 relative overflow-hidden">
          {/* Background accent */}
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at top left, #ef4444 0%, transparent 70%)',
            }}
            aria-hidden="true"
          />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-5 h-5 text-red-400" aria-hidden="true" />
              <span className="text-xs font-black uppercase tracking-widest text-red-400">
                Most Unlucky Season — BMFFFL History
              </span>
            </div>

            <h3 className="text-2xl font-black text-[#ffd700] mb-1">
              Cmaleski &mdash; 2025
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 mb-5">
              {[
                { label: 'Points For',    value: '1,990.4', note: '2nd in league',    color: '#ffd700' },
                { label: 'Points Against', value: '1,842.6', note: 'Highest in league', color: '#ef4444' },
                { label: 'Record',         value: '6-8',     note: 'Missed playoffs',  color: '#f97316' },
                { label: 'Luck Rating',    value: '-3.2',    note: 'Most unlucky ever', color: '#ef4444' },
              ].map(({ label, value, note, color }) => (
                <div key={label} className="bg-[#0d1b2a]/60 rounded-lg p-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">{label}</p>
                  <p className="text-xl font-black" style={{ color }}>{value}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{note}</p>
                </div>
              ))}
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              Cmaleski scored <strong className="text-white">1,990 points</strong> — the 2nd highest total in the league —
              yet faced the <strong className="text-red-400">hardest schedule</strong> in BMFFFL history, going 6-8 and missing
              the playoffs. In any other schedule configuration, this team almost certainly reaches the postseason.
              No manager in league history has been more victimized by the schedule gods.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── All-Time Section ──────────────────────────────────────────────────────────

function AllTimeSection({ data }: { data: AllTimeEntry[] }) {
  const luckHighlights = [
    { label: 'Luckiest All-Time',  manager: 'Tubes94',    rating: '+2.1 avg', color: '#22c55e' },
    { label: 'Unluckiest All-Time', manager: 'Cmaleski',  rating: '-1.8 avg', color: '#ef4444' },
    { label: 'Most Neutral',        manager: 'eldridm20', rating: '+0.1 avg', color: '#fbbf24' },
  ];

  return (
    <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
          <h2 className="text-xl font-black text-white">All-Time Points Against Leaders</h2>
        </div>
        <p className="text-slate-400 text-sm mb-6">
          Career totals. High career PA often means facing quality opponents because you're always in the mix.
        </p>

        {/* All-time PA table */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2d4a66]">
                <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 pr-2 w-8">Rank</th>
                <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 pr-6">Manager</th>
                <th className="pb-3 text-right text-xs font-bold uppercase tracking-wider text-[#ffd700]/80 pr-4 whitespace-nowrap">Career PA</th>
                <th className="pb-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500 pr-4">Seasons</th>
                <th className="pb-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Avg Luck</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry) => {
                const avgLuckColor = luckColor(entry.avgLuck);
                return (
                  <tr
                    key={entry.manager}
                    className="border-b border-[#1a2d42] hover:bg-[#16213e]/50 transition-colors duration-100"
                  >
                    <td className="py-3 pr-2 text-slate-500 text-xs font-bold tabular-nums">
                      #{entry.rank}
                    </td>
                    <td className="py-3 pr-6 text-white font-medium whitespace-nowrap">{entry.manager}</td>
                    <td className="py-3 pr-4 text-right text-[#ffd700] font-black tabular-nums">
                      {entry.careerPA.toLocaleString()}
                    </td>
                    <td className="py-3 pr-4 text-center text-slate-400 tabular-nums">{entry.seasons}</td>
                    <td className="py-3 text-right tabular-nums">
                      <span className="font-bold text-xs" style={{ color: avgLuckColor }}>
                        {entry.avgLuck > 0 ? '+' : ''}{entry.avgLuck.toFixed(1)} — {entry.luckLabel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Historical luck highlights */}
        <h3 className="text-lg font-black text-white mb-4">Historical Luck Ratings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {luckHighlights.map(({ label, manager, rating, color }) => (
            <div
              key={label}
              className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-5"
              style={{ borderLeft: `3px solid ${color}` }}
            >
              <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color }}>
                {label}
              </p>
              <p className="text-xl font-black text-white mb-1">{manager}</p>
              <p className="text-2xl font-black tabular-nums" style={{ color }}>{rating}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PA vs W-L Callout ─────────────────────────────────────────────────────────

function CorrelationCallout() {
  // Managers who scored high but had bad records due to tough PA
  const robbed = SEASON_2025
    .filter((d) => d.pf > 1850 && d.wins < 8)
    .sort((a, b) => b.pf - a.pf);

  return (
    <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-6">
          <h3 className="text-lg font-black text-white mb-2">
            PA vs. Win-Loss Correlation
          </h3>
          <p className="text-slate-400 text-sm mb-5">
            Teams with high Points Against and disappointing records were robbed by schedule difficulty —
            their records don&apos;t reflect their true quality.
          </p>

          <div className="space-y-3">
            {robbed.map((entry) => {
              const { barColor } = luckBarStyle(entry.luckRating);
              return (
                <div
                  key={entry.manager}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 bg-[#0d1b2a]/60 rounded-lg"
                >
                  <span className="text-white font-black w-36 shrink-0">{entry.manager}</span>
                  <div className="flex items-center gap-4 flex-wrap text-xs">
                    <span className="text-slate-300">
                      <span className="text-slate-500 mr-1">PF:</span>
                      <span className="font-bold text-white">{entry.pf.toFixed(1)}</span>
                    </span>
                    <span>
                      <span className="text-slate-500 mr-1">PA:</span>
                      <span className="font-bold text-red-400">{entry.pa.toFixed(1)}</span>
                    </span>
                    <span>
                      <span className="text-slate-500 mr-1">Record:</span>
                      <span className="font-bold text-orange-400">{entry.wins}-{entry.losses}</span>
                    </span>
                    <span>
                      <span className="text-slate-500 mr-1">Luck:</span>
                      <span className="font-bold tabular-nums" style={{ color: barColor }}>
                        {entry.luckRating > 0 ? '+' : ''}{entry.luckRating.toFixed(1)}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Bimfle Note ──────────────────────────────────────────────────────────────

function BimfleNote() {
  return (
    <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-[#16213e] border border-[#ffd700]/20 rounded-xl p-6 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at bottom right, #ffd700 0%, transparent 70%)',
            }}
            aria-hidden="true"
          />
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#ffd700]/60 mb-3">
              A note from your Commissioner
            </p>
            <blockquote className="text-slate-300 text-sm leading-relaxed italic">
              &ldquo;The Points Against tracker reveals what the standings conceal: some managers are simply victims
              of the schedule gods. Cmaleski&rsquo;s 2025 campaign was, statistically, the most unjust in BMFFFL history.
              Your Commissioner acknowledges this, for all the good it does.&rdquo;
            </blockquote>
            <p className="text-[#ffd700] font-black text-sm mt-3">&mdash; Love, Bimfle.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PointsAgainstPage() {
  const [view, setView] = useState<ViewMode>('2025');

  return (
    <>
      <Head>
        <title>Points Against Tracker | BMFFFL Analytics</title>
        <meta
          name="description"
          content="Track how many points each BMFFFL manager's opponents have scored against them — schedule difficulty, luck ratings, and who got robbed by the schedule gods."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Header */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#ffd700]">Analytics</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-1">Points Against Tracker</h1>
          <p className="text-slate-400 text-sm mb-6">
            Schedule difficulty, luck ratings, and who got robbed
          </p>

          {/* Season selector */}
          <div className="flex gap-2" role="group" aria-label="Select view">
            {(['2025', 'all-time'] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-bold border transition-colors duration-150',
                  view === v
                    ? 'bg-[#ffd700] text-[#0d1b2a] border-[#ffd700]'
                    : 'bg-transparent text-slate-400 border-[#2d4a66] hover:border-[#ffd700] hover:text-[#ffd700]',
                )}
              >
                {v === '2025' ? '2025 Season' : 'All-Time'}
              </button>
            ))}
          </div>
        </div>
      </section>

      {view === '2025' ? (
        <>
          <InjusticeSpotlight />
          <SeasonTable data={SEASON_2025} />
          <LuckDistributionChart data={SEASON_2025} />
          <CorrelationCallout />
          <BimfleNote />
        </>
      ) : (
        <>
          <AllTimeSection data={ALL_TIME} />
          <BimfleNote />
        </>
      )}
    </>
  );
}
