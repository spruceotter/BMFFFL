import { useState } from 'react';
import Head from 'next/head';
import { BarChart2, TrendingUp, Award } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type Season = 2020 | 2021 | 2022 | 2023 | 2024 | 2025;
type SortKey = 'owner' | Season | 'careerAvg';
type SortDir = 'asc' | 'desc';

interface OwnerData {
  owner: string;
  seasons: Record<Season, number>;
  careerAvg: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SEASONS: Season[] = [2020, 2021, 2022, 2023, 2024, 2025];

const OWNERS: OwnerData[] = [
  { owner: 'MLSchools12',     seasons: { 2020: 148, 2021: 162, 2022: 155, 2023: 158, 2024: 170, 2025: 165 }, careerAvg: 159.7 },
  { owner: 'SexMachineAndyD', seasons: { 2020: 142, 2021: 149, 2022: 138, 2023: 152, 2024: 163, 2025: 158 }, careerAvg: 150.3 },
  { owner: 'JuicyBussy',      seasons: { 2020: 135, 2021: 140, 2022: 152, 2023: 175, 2024: 155, 2025: 160 }, careerAvg: 152.8 },
  { owner: 'Grandes',         seasons: { 2020: 138, 2021: 145, 2022: 168, 2023: 148, 2024: 152, 2025: 148 }, careerAvg: 149.8 },
  { owner: 'Tubes94',         seasons: { 2020: 130, 2021: 138, 2022: 145, 2023: 140, 2024: 148, 2025: 155 }, careerAvg: 142.7 },
  { owner: 'Cogdeill11',      seasons: { 2020: 152, 2021: 135, 2022: 130, 2023: 128, 2024: 125, 2025: 130 }, careerAvg: 133.3 },
  { owner: 'tdtd19844',       seasons: { 2020: 125, 2021: 130, 2022: 138, 2023: 142, 2024: 158, 2025: 172 }, careerAvg: 144.2 },
  { owner: 'eldridm20',       seasons: { 2020: 128, 2021: 142, 2022: 135, 2023: 138, 2024: 130, 2025: 125 }, careerAvg: 133.0 },
  { owner: 'eldridsm',        seasons: { 2020: 120, 2021: 125, 2022: 130, 2023: 128, 2024: 135, 2025: 140 }, careerAvg: 129.7 },
  { owner: 'Escuelas',        seasons: { 2020: 118, 2021: 122, 2022: 118, 2023: 125, 2024: 120, 2025: 118 }, careerAvg: 120.2 },
  { owner: 'Cmaleski',        seasons: { 2020: 130, 2021: 135, 2022: 125, 2023: 130, 2024: 128, 2025: 132 }, careerAvg: 130.0 },
  { owner: 'rbr',             seasons: { 2020: 135, 2021: 128, 2022: 140, 2023: 135, 2024: 142, 2025: 145 }, careerAvg: 137.5 },
];

// Pre-compute league averages per season
const LEAGUE_AVG: Record<Season, number> = SEASONS.reduce((acc, yr) => {
  const total = OWNERS.reduce((s, o) => s + o.seasons[yr], 0);
  acc[yr] = Math.round((total / OWNERS.length) * 10) / 10;
  return acc;
}, {} as Record<Season, number>);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function variance(o: OwnerData): number {
  const vals = SEASONS.map((yr) => o.seasons[yr]);
  const mean = vals.reduce((s, v) => s + v, 0) / vals.length;
  return vals.reduce((s, v) => s + (v - mean) ** 2, 0) / vals.length;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface BarChartSectionProps {
  season: Season;
  onSeasonChange: (s: Season) => void;
}

function BarChartSection({ season, onSeasonChange }: BarChartSectionProps) {
  const sorted = [...OWNERS].sort((a, b) => b.seasons[season] - a.seasons[season]);
  const maxPts = sorted[0].seasons[season];
  const minPts = sorted[sorted.length - 1].seasons[season];
  const leagueAvg = LEAGUE_AVG[season];
  const leaguePct = ((leagueAvg - minPts) / (maxPts - minPts + 1)) * 100;

  return (
    <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-2 mb-5">
          <BarChart2 className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
          <h2 className="text-xl font-black text-white">Season Bar Chart</h2>
        </div>

        {/* Season selector */}
        <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Select season">
          {SEASONS.map((yr) => (
            <button
              key={yr}
              onClick={() => onSeasonChange(yr)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-bold border transition-colors duration-150',
                season === yr
                  ? 'bg-[#ffd700] text-[#0d1b2a] border-[#ffd700]'
                  : 'bg-transparent text-slate-400 border-[#2d4a66] hover:border-[#ffd700] hover:text-[#ffd700]',
              )}
            >
              {yr}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-5 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm bg-[#ffd700]" />
            League leader
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm bg-[#e94560]" />
            Bottom scorer
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm bg-[#60a5fa]" />
            League avg range
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm bg-[#334155]" />
            Other
          </span>
        </div>

        {/* Bars */}
        <div className="relative space-y-2">
          {/* League average marker line — positioned over the bar area */}
          <div
            className="absolute top-0 bottom-0 w-px bg-[#ffd700]/50 border-l border-dashed border-[#ffd700]/60 z-10 pointer-events-none"
            style={{ left: `calc(${((leagueAvg - minPts) / (maxPts - minPts + 10)) * 100}% + 9rem)` }}
          >
            <span className="absolute -top-5 left-1 text-[10px] text-[#ffd700]/80 whitespace-nowrap font-bold">
              Avg {leagueAvg}
            </span>
          </div>

          {sorted.map((o, idx) => {
            const pts = o.seasons[season];
            const isLeader = idx === 0;
            const isBottom = idx === sorted.length - 1;
            const isAboveAvg = pts >= leagueAvg;
            const widthPct = ((pts - minPts + 1) / (maxPts - minPts + 10)) * 100;

            const barColor = isLeader
              ? '#ffd700'
              : isBottom
              ? '#e94560'
              : isAboveAvg
              ? '#60a5fa'
              : '#334155';

            return (
              <div key={o.owner} className="flex items-center gap-3">
                <span className="text-xs text-slate-400 w-36 shrink-0 text-right truncate font-medium">
                  {o.owner}
                </span>
                <div className="flex-1 bg-[#16213e] rounded h-7 overflow-hidden relative">
                  <div
                    className="h-full rounded transition-all duration-500"
                    style={{ width: `${widthPct}%`, backgroundColor: barColor }}
                  />
                </div>
                <span
                  className="text-xs font-bold w-10 shrink-0 tabular-nums"
                  style={{ color: barColor }}
                >
                  {pts}
                </span>
                {isLeader && (
                  <span className="text-[10px] text-[#ffd700] font-black uppercase tracking-widest hidden sm:block">
                    #1
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-xs text-slate-600 mt-4">
          League avg {season}: <span className="text-slate-400 font-bold">{leagueAvg} pts/gm</span>
        </p>
      </div>
    </section>
  );
}

// ─── Trend table ──────────────────────────────────────────────────────────────

function TrendTable() {
  const [sortKey, setSortKey] = useState<SortKey>('careerAvg');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const sorted = [...OWNERS].sort((a, b) => {
    let aVal: number | string;
    let bVal: number | string;

    if (sortKey === 'owner') {
      aVal = a.owner.toLowerCase();
      bVal = b.owner.toLowerCase();
    } else if (sortKey === 'careerAvg') {
      aVal = a.careerAvg;
      bVal = b.careerAvg;
    } else {
      aVal = a.seasons[sortKey];
      bVal = b.seasons[sortKey];
    }

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortDir === 'asc'
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  });

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span className="text-slate-600 ml-1">↕</span>;
    return <span className="text-[#ffd700] ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  function cellColor(pts: number, avg: number): string {
    const diff = pts - avg;
    if (diff >= 15) return 'text-green-400 font-bold';
    if (diff >= 5) return 'text-green-500';
    if (diff >= -5) return 'text-slate-300';
    if (diff >= -15) return 'text-red-400';
    return 'text-red-500 font-bold';
  }

  const overallCareerAvg =
    OWNERS.reduce((s, o) => s + o.careerAvg, 0) / OWNERS.length;

  return (
    <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
          <h2 className="text-xl font-black text-white">Points Per Game — All Seasons</h2>
        </div>
        <p className="text-slate-400 text-sm mb-5">
          Click any column header to sort. Green = above league avg that year, red = below.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2d4a66]">
                <th
                  className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 pr-6 cursor-pointer hover:text-[#ffd700] whitespace-nowrap select-none"
                  onClick={() => handleSort('owner')}
                >
                  Owner <SortIcon col="owner" />
                </th>
                {SEASONS.map((yr) => (
                  <th
                    key={yr}
                    className="pb-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500 pr-4 cursor-pointer hover:text-[#ffd700] whitespace-nowrap select-none"
                    onClick={() => handleSort(yr)}
                  >
                    {yr} <SortIcon col={yr} />
                  </th>
                ))}
                <th
                  className="pb-3 text-right text-xs font-bold uppercase tracking-wider text-[#ffd700]/80 pl-2 cursor-pointer hover:text-[#ffd700] whitespace-nowrap select-none"
                  onClick={() => handleSort('careerAvg')}
                >
                  Career Avg <SortIcon col="careerAvg" />
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((o) => (
                <tr
                  key={o.owner}
                  className="border-b border-[#1a2d42] hover:bg-[#16213e]/50 transition-colors duration-100"
                >
                  <td className="py-3 pr-6 text-white font-medium whitespace-nowrap">{o.owner}</td>
                  {SEASONS.map((yr) => {
                    const pts = o.seasons[yr];
                    const avg = LEAGUE_AVG[yr];
                    return (
                      <td
                        key={yr}
                        className={cn('py-3 pr-4 text-right tabular-nums', cellColor(pts, avg))}
                      >
                        {pts}
                      </td>
                    );
                  })}
                  <td
                    className={cn(
                      'py-3 pl-2 text-right tabular-nums font-bold',
                      cellColor(o.careerAvg, overallCareerAvg),
                    )}
                  >
                    {o.careerAvg.toFixed(1)}
                  </td>
                </tr>
              ))}

              {/* League avg row */}
              <tr className="border-t-2 border-[#2d4a66] bg-[#16213e]/30">
                <td className="py-3 pr-6 text-xs font-black uppercase tracking-wider text-slate-500">
                  League Avg
                </td>
                {SEASONS.map((yr) => (
                  <td key={yr} className="py-3 pr-4 text-right text-xs text-slate-500 tabular-nums">
                    {LEAGUE_AVG[yr]}
                  </td>
                ))}
                <td className="py-3 pl-2 text-right text-xs text-slate-500 tabular-nums">
                  {(overallCareerAvg).toFixed(1)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Color legend */}
        <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5 text-green-400 font-bold">■ +15 or more above avg</span>
          <span className="flex items-center gap-1.5 text-green-500">■ +5 to +14 above avg</span>
          <span className="flex items-center gap-1.5 text-slate-300">■ Within ±5 of avg</span>
          <span className="flex items-center gap-1.5 text-red-400">■ -5 to -14 below avg</span>
          <span className="flex items-center gap-1.5 text-red-500 font-bold">■ -15 or more below avg</span>
        </div>
      </div>
    </section>
  );
}

// ─── Key insights ─────────────────────────────────────────────────────────────

function KeyInsights() {
  const insights = [
    {
      icon: <Award className="w-5 h-5" aria-hidden="true" />,
      accent: '#ffd700',
      title: 'Highest Single-Season Avg',
      stat: '175 pts/gm',
      body: 'JuicyBussy in 2023 posted the highest single-season scoring average in BMFFFL history — 175 points per game, a full 26.3 pts above the league average that year.',
    },
    {
      icon: <BarChart2 className="w-5 h-5" aria-hidden="true" />,
      accent: '#60a5fa',
      title: 'Most Consistent Scorer',
      stat: 'MLSchools12',
      body: 'MLSchools12 has the lowest scoring variance across all 6 seasons, ranging from 148 to 170 pts/gm. Year-in, year-out reliability at the top of the leaderboard.',
    },
    {
      icon: <TrendingUp className="w-5 h-5" aria-hidden="true" />,
      accent: '#4ade80',
      title: 'Biggest Climber',
      stat: '+47 pts/gm',
      body: 'tdtd19844 has gone from 125 pts/gm in 2020 to 172 pts/gm in 2025 — a +47 point improvement, the largest upward trajectory of any team in the league over 6 seasons.',
    },
  ];

  return (
    <section className="bg-[#0d1b2a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-xl font-black text-white mb-5">Key Insights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {insights.map(({ icon, accent, title, stat, body }) => (
            <div
              key={title}
              className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-5"
              style={{ borderLeft: `3px solid ${accent}` }}
            >
              <div className="flex items-center gap-2 mb-1" style={{ color: accent }}>
                {icon}
                <span className="text-xs font-black uppercase tracking-widest">{title}</span>
              </div>
              <p className="text-2xl font-black text-white mb-2">{stat}</p>
              <p className="text-slate-400 text-xs leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HistoricalPointsPage() {
  const [selectedSeason, setSelectedSeason] = useState<Season>(2025);

  return (
    <>
      <Head>
        <title>Historical Points | BMFFFL Analytics</title>
        <meta
          name="description"
          content="How each BMFFFL dynasty team's scoring has evolved across all 6 seasons (2020–2025). Season bar charts, trend table, and key insights."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Header */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#ffd700]">Analytics</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-1">Historical Points</h1>
          <p className="text-slate-400 text-sm">
            Team scoring evolution across all 6 BMFFFL seasons (2020–2025) — Full PPR, Superflex, 12 teams
          </p>
        </div>
      </section>

      <BarChartSection season={selectedSeason} onSeasonChange={setSelectedSeason} />
      <TrendTable />
      <KeyInsights />
    </>
  );
}
