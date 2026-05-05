import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import * as fs from 'fs';
import * as path from 'path';
import { cn } from '@/lib/cn';
import { getManagerColor } from '@/data/manager-colors';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Swing {
  owner: string;
  slug: string;
  actual: string | null;
  counterfactual: string | null;
  delta: number;
}

interface BenchRow {
  owner: string;
  slug: string;
  actual: number;
  optimal: number;
  leftOnBench: number;
  avgPerWeek: number;
}

interface Season {
  year: number;
  flips: number;
  totalWeeks: number;
  note: string;
  swings: Swing[];
  benchEfficiency?: BenchRow[];
}

interface AllTimeSwing {
  owner: string;
  slug: string;
  netDelta: number;
  perSeason: Record<string, number>;
  pattern: string;
}

interface ChampionVerdict {
  year: number;
  champion: string;
  slug: string;
  verdict: 'legitimate' | 'partial';
  note: string;
}

interface LineupRegretsData {
  generated: string;
  leagueSummary: {
    totalFlips: number;
    seasonsAnalyzed: number[];
    mostFlips: { year: number; count: number };
  };
  seasons: Season[];
  allTimeSwings: AllTimeSwing[];
  championshipVerdict: ChampionVerdict[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function deltaColor(delta: number): string {
  if (delta > 0) return 'text-emerald-400';
  if (delta < 0) return 'text-rose-400';
  return 'text-slate-500';
}

function deltaLabel(delta: number): string {
  if (delta > 0) return `+${delta}W`;
  if (delta < 0) return `${delta}W`;
  return '—';
}

function DeltaBadge({ delta }: { delta: number }) {
  const big = Math.abs(delta) >= 3;
  return (
    <span className={cn(
      'inline-flex items-center justify-center rounded px-1.5 py-0.5 text-xs font-bold tabular-nums',
      delta > 0
        ? big ? 'bg-emerald-900/60 text-emerald-300' : 'bg-emerald-900/40 text-emerald-400'
        : delta < 0
        ? big ? 'bg-rose-900/60 text-rose-300' : 'bg-rose-900/40 text-rose-400'
        : 'bg-slate-800 text-slate-500'
    )}>
      {deltaLabel(delta)}
    </span>
  );
}

function OwnerChip({ owner, slug }: { owner: string; slug: string }) {
  const color = getManagerColor(slug);
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold"
      style={{ backgroundColor: color.primary + 'cc', color: color.accent }}
    >
      {owner}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type TabId = 'all-time' | 'by-season' | 'bench' | 'championships';

export default function LineupRegretsPage({ data }: { data: LineupRegretsData }) {
  const [activeTab, setActiveTab] = useState<TabId>('all-time');
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  const tabs: { id: TabId; label: string }[] = [
    { id: 'all-time', label: 'All-Time' },
    { id: 'by-season', label: 'By Season' },
    { id: 'bench', label: 'Bench Waste (2020)' },
    { id: 'championships', label: 'Championships' },
  ];

  const selectedSeason = data.seasons.find(s => s.year === selectedYear);

  return (
    <>
      <Head>
        <title>Lineup Regrets — BMFFFL</title>
        <meta name="description" content="Counterfactual lineup analysis: who left the most wins on the bench in BMFFFL history?" />
      </Head>

      <main className="min-h-screen bg-[#0a0f1a] text-white">
        {/* Header */}
        <div className="border-b border-slate-800 bg-[#0d1525]">
          <div className="max-w-4xl mx-auto px-4 py-5">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-400 mb-3 inline-block">
              ← BMFFFL
            </Link>
            <h1 className="text-2xl font-bold text-white">Lineup Regrets</h1>
            <p className="text-sm text-slate-400 mt-1">
              If every owner had played their optimal lineup, how different would BMFFFL history look?
            </p>
            <div className="flex gap-6 mt-3 text-xs text-slate-500">
              <span><span className="text-white font-bold">{data.leagueSummary.totalFlips}</span> matchup flips</span>
              <span><span className="text-white font-bold">{data.leagueSummary.seasonsAnalyzed.length}</span> seasons analyzed (2020–2025)</span>
              <span>Most in a season: <span className="text-white font-bold">{data.leagueSummary.mostFlips.count}</span> ({data.leagueSummary.mostFlips.year})</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-800 bg-[#0d1525]">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex gap-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                    activeTab === tab.id
                      ? 'border-[#ffd700] text-[#ffd700]'
                      : 'border-transparent text-slate-400 hover:text-slate-300'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">

          {/* ── All-Time Tab ─────────────────────────────────────────── */}
          {activeTab === 'all-time' && (
            <div>
              <p className="text-sm text-slate-400 mb-4">
                Net wins gained or lost over 5 seasons if every owner had played their optimal lineup.
                Positive = undermanaged (left wins on bench). Negative = schedule luck / opponent mistakes helped them.
              </p>

              {/* Heat map bar */}
              <div className="mb-6">
                {[...data.allTimeSwings]
                  .sort((a, b) => b.netDelta - a.netDelta)
                  .map(row => {
                    const color = getManagerColor(row.slug);
                    const maxDelta = 10;
                    const pct = Math.abs(row.netDelta) / maxDelta * 100;
                    return (
                      <div key={row.slug} className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <OwnerChip owner={row.owner} slug={row.slug} />
                          </div>
                          <DeltaBadge delta={row.netDelta} />
                        </div>
                        {/* Per-season mini bars */}
                        <div className="flex gap-1 mb-1">
                          {Object.entries(row.perSeason).map(([yr, d]) => (
                            <div key={yr} className="flex flex-col items-center gap-0.5">
                              <span className={cn('text-[10px] font-bold', deltaColor(d))}>{deltaLabel(d)}</span>
                              <span className="text-[9px] text-slate-600">{yr}</span>
                            </div>
                          ))}
                        </div>
                        {/* Bar */}
                        <div className="h-1.5 bg-slate-800 rounded overflow-hidden">
                          <div
                            className={cn('h-full rounded', row.netDelta > 0 ? 'bg-emerald-500' : 'bg-rose-500')}
                            style={{ width: `${pct}%`, marginLeft: row.netDelta < 0 ? `${100 - pct}%` : 0 }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{row.pattern}</p>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ── By Season Tab ─────────────────────────────────────────── */}
          {activeTab === 'by-season' && (
            <div>
              {/* Season selector */}
              <div className="flex gap-2 mb-5 flex-wrap">
                {data.seasons.map(s => (
                  <button
                    key={s.year}
                    onClick={() => setSelectedYear(s.year)}
                    className={cn(
                      'px-3 py-1.5 rounded text-sm font-semibold border transition-colors',
                      selectedYear === s.year
                        ? 'bg-[#ffd700] text-[#0a0f1a] border-[#ffd700]'
                        : 'bg-transparent text-slate-400 border-slate-700 hover:border-slate-500'
                    )}
                  >
                    {s.year}
                    <span className={cn(
                      'ml-1.5 text-xs',
                      selectedYear === s.year ? 'text-[#0a0f1a]/70' : 'text-slate-600'
                    )}>
                      {s.flips} flips
                    </span>
                  </button>
                ))}
              </div>

              {selectedSeason && (
                <div>
                  <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-4 mb-5">
                    <p className="text-sm text-slate-300">{selectedSeason.note}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {selectedSeason.flips} matchup flips in {selectedSeason.totalWeeks} weeks
                    </p>
                  </div>

                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-slate-500 border-b border-slate-800">
                        <th className="text-left pb-2 font-normal">Owner</th>
                        <th className="text-center pb-2 font-normal">Actual</th>
                        <th className="text-center pb-2 font-normal">Counterfactual</th>
                        <th className="text-right pb-2 font-normal">Δ Wins</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...selectedSeason.swings]
                        .sort((a, b) => b.delta - a.delta)
                        .map(row => (
                          <tr key={row.slug} className="border-b border-slate-800/50">
                            <td className="py-2">
                              <OwnerChip owner={row.owner} slug={row.slug} />
                            </td>
                            <td className="py-2 text-center text-slate-300 tabular-nums">
                              {row.actual ?? '—'}
                            </td>
                            <td className="py-2 text-center text-slate-300 tabular-nums">
                              {row.counterfactual ?? '—'}
                            </td>
                            <td className="py-2 text-right">
                              <DeltaBadge delta={row.delta} />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Bench Waste Tab ────────────────────────────────────────── */}
          {activeTab === 'bench' && (() => {
            const season2020 = data.seasons.find(s => s.year === 2020);
            const bench = season2020?.benchEfficiency ?? [];
            const maxLeft = Math.max(...bench.map(b => b.leftOnBench));
            return (
              <div>
                <p className="text-sm text-slate-400 mb-4">
                  2020 season — total points left on the bench vs. optimal lineup. Ranked by waste.
                </p>
                {[...bench].sort((a, b) => b.leftOnBench - a.leftOnBench).map(row => {
                  const pct = (row.leftOnBench / maxLeft) * 100;
                  return (
                    <div key={row.slug} className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <OwnerChip owner={row.owner} slug={row.slug} />
                        <div className="flex gap-4 text-xs tabular-nums">
                          <span className="text-slate-500">{row.actual.toFixed(1)} actual</span>
                          <span className="text-slate-400">{row.optimal.toFixed(1)} optimal</span>
                          <span className="text-rose-400 font-semibold">{row.leftOnBench.toFixed(1)} wasted</span>
                          <span className="text-slate-500">{row.avgPerWeek.toFixed(1)}/wk</span>
                        </div>
                      </div>
                      <div className="h-2 bg-slate-800 rounded overflow-hidden">
                        <div
                          className="h-full bg-rose-600/70 rounded"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                <p className="text-xs text-slate-600 mt-4">
                  Method: greedy optimal lineup from rostered players using 2020 config (QB×1, RB×2, WR×3, TE×1, FLEX×2, SF×1).
                  Actual points from <code>players_points</code> in Sleeper matchup data.
                </p>
              </div>
            );
          })()}

          {/* ── Championships Tab ──────────────────────────────────────── */}
          {activeTab === 'championships' && (
            <div>
              <p className="text-sm text-slate-400 mb-4">
                Did each champion actually deserve to win? Counterfactual analysis of whether they were the best team, or benefited from opponents' mistakes.
              </p>
              <div className="space-y-3">
                {data.championshipVerdict.map(row => {
                  const color = getManagerColor(row.slug);
                  return (
                    <div
                      key={row.year}
                      className="rounded-lg border border-slate-800 bg-slate-800/20 p-4 flex items-start gap-4"
                    >
                      <div className="text-2xl font-bold text-slate-600 tabular-nums w-12 shrink-0">{row.year}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <OwnerChip owner={row.champion} slug={row.slug} />
                          <span className={cn(
                            'text-xs font-semibold px-2 py-0.5 rounded',
                            row.verdict === 'legitimate'
                              ? 'bg-emerald-900/40 text-emerald-400'
                              : 'bg-amber-900/40 text-amber-400'
                          )}>
                            {row.verdict === 'legitimate' ? '✓ Legitimate' : '~ Partial'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300">{row.note}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 p-4 rounded-lg border border-slate-800 bg-slate-800/20">
                <p className="text-xs text-slate-500 leading-relaxed">
                  <strong className="text-slate-400">Verdict:</strong> 5 of 6 championships are unambiguously legitimate.
                  2023 JuicyBussy won with some help from schedule variance. 2020 SexMachineAndyD was the best team but
                  cost themselves the championship through lineup mistakes — a counterfactual 12-1 to 9-4 actual.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 mt-8 py-4">
          <div className="max-w-4xl mx-auto px-4 text-xs text-slate-600">
            Analysis by Bimflé · 2020–2025 · {data.leagueSummary.totalFlips} counterfactual matchup flips across {data.leagueSummary.seasonsAnalyzed.length} seasons
          </div>
        </div>
      </main>
    </>
  );
}

// ─── Data Loading ─────────────────────────────────────────────────────────────

export const getStaticProps: GetStaticProps = async () => {
  const filePath = path.join(process.cwd(), 'public', 'data', 'lineup-regrets.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data: LineupRegretsData = JSON.parse(raw);

  return {
    props: { data },
  };
};
