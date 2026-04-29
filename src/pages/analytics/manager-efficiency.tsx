import { useState } from 'react';
import Head from 'next/head';
import { Target, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/cn';
import {
  MANAGER_EFFICIENCY,
  LEAGUE_AVG_EFFICIENCY,
  type ManagerEfficiencyRecord,
  type EfficiencySeasonRecord,
} from '@/lib/manager-efficiency-data';

// ─── Constants ────────────────────────────────────────────────────────────────

const SEASONS = ['2020', '2021', '2022', '2023', '2024', '2025'] as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

type Grade = 'Elite' | 'Good' | 'Average' | 'Poor';

const GRADE_STYLES: Record<Grade, string> = {
  Elite:   'bg-emerald-900/40 text-emerald-300 border-emerald-700/40',
  Good:    'bg-blue-900/40 text-blue-300 border-blue-700/40',
  Average: 'bg-amber-900/40 text-amber-300 border-amber-700/40',
  Poor:    'bg-red-900/40 text-red-300 border-red-700/40',
};

function GradeBadge({ grade }: { grade: string }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded border text-xs font-semibold',
      GRADE_STYLES[grade as Grade] ?? GRADE_STYLES.Average
    )}>
      {grade}
    </span>
  );
}

function EfficiencyBar({ pct, leagueAvg }: { pct: number; leagueAvg?: number }) {
  const capped = Math.min(pct, 105);
  const color = pct >= 92 ? 'bg-emerald-500' : pct >= 87 ? 'bg-blue-500' : pct >= 82 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden w-full">
      <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${Math.min(capped, 100)}%` }} />
      {leagueAvg && (
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-slate-400/60"
          style={{ left: `${Math.min(leagueAvg, 100)}%` }}
          title={`League avg: ${leagueAvg}%`}
        />
      )}
    </div>
  );
}

// ─── Rank Row Component ───────────────────────────────────────────────────────

function ManagerRow({
  record,
  rank,
  expanded,
  onToggle,
}: {
  record: ManagerEfficiencyRecord;
  rank: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const careerLeagueAvg =
    Math.round(
      (Object.values(LEAGUE_AVG_EFFICIENCY).reduce((a, b) => a + b, 0) /
        Object.values(LEAGUE_AVG_EFFICIENCY).length) *
        10
    ) / 10;

  const rankStyle =
    rank === 1
      ? 'text-[#ffd700]'
      : rank === 2
      ? 'text-slate-300'
      : rank === 3
      ? 'text-amber-600'
      : 'text-slate-500';

  return (
    <>
      <tr
        className="border-b border-slate-700/50 hover:bg-slate-800/40 cursor-pointer transition-colors"
        onClick={onToggle}
      >
        {/* Rank */}
        <td className="py-3 pl-4 pr-2 w-10">
          <span className={cn('font-black text-sm tabular-nums', rankStyle)}>#{rank}</span>
        </td>
        {/* Owner */}
        <td className="py-3 px-3">
          <div className="font-semibold text-white text-sm">{record.displayName}</div>
          <div className="text-xs text-slate-500">{record.seasonsPlayed} season{record.seasonsPlayed !== 1 ? 's' : ''}</div>
        </td>
        {/* Career Efficiency */}
        <td className="py-3 px-3">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-white text-sm tabular-nums w-12">{record.careerAvgEfficiency}%</span>
            <div className="flex-1 min-w-[80px]">
              <EfficiencyBar pct={record.careerAvgEfficiency} leagueAvg={careerLeagueAvg} />
            </div>
          </div>
        </td>
        {/* Grade */}
        <td className="py-3 px-3 hidden sm:table-cell">
          <GradeBadge grade={record.grade} />
        </td>
        {/* Games Lost */}
        <td className="py-3 px-3 hidden md:table-cell">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className={cn('w-3.5 h-3.5', record.careerGamesLostToLineup > 40 ? 'text-red-400' : record.careerGamesLostToLineup > 20 ? 'text-amber-400' : 'text-slate-400')} />
            <span className="font-mono text-sm tabular-nums text-slate-200">{record.careerGamesLostToLineup}</span>
          </div>
        </td>
        {/* Bench Mistakes */}
        <td className="py-3 px-3 hidden lg:table-cell">
          <span className="font-mono text-sm tabular-nums text-slate-300">{record.careerBenchMistakes}</span>
        </td>
        {/* Toggle */}
        <td className="py-3 pr-4 text-right">
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-slate-500 inline" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500 inline" />
          )}
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-slate-700/50 bg-slate-900/50">
          <td colSpan={7} className="px-4 pt-3 pb-4">
            <SeasonBreakdown record={record} />
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Season Breakdown ─────────────────────────────────────────────────────────

function SeasonBreakdown({ record }: { record: ManagerEfficiencyRecord }) {
  const seasons = SEASONS.filter(s => record.seasons[s]);
  if (seasons.length === 0) return <p className="text-slate-500 text-sm">No season data available.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-slate-500 text-xs uppercase tracking-wide">
            <th className="text-left pb-2 pr-4 font-medium">Season</th>
            <th className="text-left pb-2 pr-4 font-medium">Efficiency</th>
            <th className="text-left pb-2 pr-4 font-medium hidden sm:table-cell">Grade</th>
            <th className="text-left pb-2 pr-4 font-medium hidden sm:table-cell">vs League</th>
            <th className="text-left pb-2 pr-4 font-medium">Games Lost</th>
            <th className="text-left pb-2 pr-4 font-medium hidden md:table-cell">Bench Errors</th>
            <th className="text-left pb-2 pr-4 font-medium hidden md:table-cell">Avg Pts</th>
            <th className="text-left pb-2 font-medium hidden md:table-cell">Avg Optimal</th>
          </tr>
        </thead>
        <tbody>
          {seasons.map(season => {
            const rec: EfficiencySeasonRecord = record.seasons[season];
            const leagueAvg = LEAGUE_AVG_EFFICIENCY[season] ?? 0;
            const delta = rec.avgEfficiency - leagueAvg;
            return (
              <tr key={season} className="border-t border-slate-700/30">
                <td className="py-1.5 pr-4 font-semibold text-slate-300">{season}</td>
                <td className="py-1.5 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono tabular-nums text-white w-11">{rec.avgEfficiency}%</span>
                    <div className="w-20 hidden sm:block">
                      <EfficiencyBar pct={rec.avgEfficiency} leagueAvg={leagueAvg} />
                    </div>
                  </div>
                </td>
                <td className="py-1.5 pr-4 hidden sm:table-cell">
                  <GradeBadge grade={rec.grade} />
                </td>
                <td className="py-1.5 pr-4 hidden sm:table-cell">
                  <span className={cn('font-mono tabular-nums text-xs', delta >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                    {delta >= 0 ? '+' : ''}{delta.toFixed(1)}%
                  </span>
                </td>
                <td className="py-1.5 pr-4">
                  <span className={cn('font-mono tabular-nums', rec.gamesLostToLineup >= 10 ? 'text-red-400' : rec.gamesLostToLineup >= 5 ? 'text-amber-400' : 'text-slate-300')}>
                    {rec.gamesLostToLineup}
                  </span>
                </td>
                <td className="py-1.5 pr-4 font-mono tabular-nums text-slate-400 hidden md:table-cell">{rec.benchMistakes}</td>
                <td className="py-1.5 pr-4 font-mono tabular-nums text-slate-300 hidden md:table-cell">{rec.avgActualPts}</td>
                <td className="py-1.5 font-mono tabular-nums text-slate-400 hidden md:table-cell">{rec.avgOptimalPts}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Stat Cards ───────────────────────────────────────────────────────────────

function InsightCards() {
  const sorted = [...MANAGER_EFFICIENCY];
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  const mostLostGames = [...sorted].sort((a, b) => b.careerGamesLostToLineup - a.careerGamesLostToLineup)[0];
  const leastLostGames = [...sorted].sort((a, b) => a.careerGamesLostToLineup - b.careerGamesLostToLineup)[0];
  const latestLeagueAvg = LEAGUE_AVG_EFFICIENCY['2025'] ?? 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      <div className="bg-slate-800/50 border border-slate-700/40 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-slate-400 uppercase tracking-wide">Top Manager</span>
        </div>
        <div className="font-bold text-white">{best.displayName}</div>
        <div className="text-emerald-400 font-mono text-sm">{best.careerAvgEfficiency}% career</div>
      </div>
      <div className="bg-slate-800/50 border border-slate-700/40 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-1">
          <TrendingDown className="w-4 h-4 text-red-400" />
          <span className="text-xs text-slate-400 uppercase tracking-wide">Most Lineup Losses</span>
        </div>
        <div className="font-bold text-white">{mostLostGames.displayName}</div>
        <div className="text-red-400 font-mono text-sm">{mostLostGames.careerGamesLostToLineup} games lost</div>
      </div>
      <div className="bg-slate-800/50 border border-slate-700/40 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <span className="text-xs text-slate-400 uppercase tracking-wide">Fewest Lineup Losses</span>
        </div>
        <div className="font-bold text-white">{leastLostGames.displayName}</div>
        <div className="text-blue-400 font-mono text-sm">{leastLostGames.careerGamesLostToLineup} games lost</div>
      </div>
      <div className="bg-slate-800/50 border border-slate-700/40 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-1">
          <Target className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400 uppercase tracking-wide">2025 League Avg</span>
        </div>
        <div className="font-bold text-white">{latestLeagueAvg}%</div>
        <div className="text-slate-400 text-sm">efficiency</div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ManagerEfficiencyPage() {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const toggle = (slug: string) => setExpandedSlug(prev => (prev === slug ? null : slug));

  return (
    <>
      <Head>
        <title>Manager Efficiency — BMFFFL Analytics</title>
        <meta name="description" content="How well do BMFFFL managers set their lineups? Career efficiency ratings, bench mistakes, and games lost to poor lineup decisions." />
      </Head>

      <div className="min-h-screen bg-[#0f1117] text-white">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6 text-blue-400" />
              <h1 className="text-2xl font-black text-white">Manager Efficiency</h1>
            </div>
            <p className="text-slate-400 text-sm max-w-2xl">
              Lineup efficiency measures how close each manager sets to their optimal roster each week.
              100% = perfect lineup. Below 80% = regularly leaving points on the bench.
              <span className="text-slate-500 ml-1">Sleeper era 2020–2025 only.</span>
            </p>
          </div>

          {/* Insight Cards */}
          <InsightCards />

          {/* Leaderboard Table */}
          <div className="bg-slate-800/30 border border-slate-700/40 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-700/40 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <h2 className="font-bold text-white text-sm">Career Lineup Efficiency</h2>
              <span className="text-slate-500 text-xs ml-auto">Click a row for season breakdown</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-slate-500 text-xs uppercase tracking-wide bg-slate-900/30">
                    <th className="text-left py-2 pl-4 pr-2 w-10">#</th>
                    <th className="text-left py-2 px-3">Manager</th>
                    <th className="text-left py-2 px-3">Career Efficiency</th>
                    <th className="text-left py-2 px-3 hidden sm:table-cell">Grade</th>
                    <th className="text-left py-2 px-3 hidden md:table-cell">Games Lost</th>
                    <th className="text-left py-2 px-3 hidden lg:table-cell">Bench Errors</th>
                    <th className="py-2 pr-4 w-8" />
                  </tr>
                </thead>
                <tbody>
                  {MANAGER_EFFICIENCY.map((record, i) => (
                    <ManagerRow
                      key={record.slug}
                      record={record}
                      rank={i + 1}
                      expanded={expandedSlug === record.slug}
                      onToggle={() => toggle(record.slug)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Grade Legend */}
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
            <span className="font-semibold text-slate-400">Grades:</span>
            <span><span className="text-emerald-300 font-semibold">Elite</span> ≥92%</span>
            <span><span className="text-blue-300 font-semibold">Good</span> ≥87%</span>
            <span><span className="text-amber-300 font-semibold">Average</span> ≥82%</span>
            <span><span className="text-red-300 font-semibold">Poor</span> &lt;82%</span>
            <span className="ml-2 text-slate-600">|</span>
            <span><span className="text-slate-400">Bar marker</span> = league avg</span>
            <span className="ml-2 text-slate-600">|</span>
            <span>Games Lost = weeks where lineup mistake flipped the outcome</span>
          </div>
        </div>
      </div>
    </>
  );
}
