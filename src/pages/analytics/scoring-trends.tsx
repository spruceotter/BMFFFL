import Head from 'next/head';
import { TrendingUp, Trophy } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Season scoring data ──────────────────────────────────────────────────────

interface SeasonScore {
  season: number;
  champion: string;
  topScorer: string;
  topScorerPoints: number;
  leagueAvgPoints: number;
  highestSingleWeek: number;
  highestSingleWeekOwner: string;
  lowestSingleWeek: number;
  totalLeaguePoints: number;
}

const SEASON_SCORES: SeasonScore[] = [
  {
    season:               2020,
    champion:             'Cogdeill11',
    topScorer:            'MLSchools12',
    topScorerPoints:      1842,
    leagueAvgPoints:      1690,
    highestSingleWeek:    196,
    highestSingleWeekOwner: 'Cogdeill11',
    lowestSingleWeek:     72,
    totalLeaguePoints:    20280,
  },
  {
    season:               2021,
    champion:             'MLSchools12',
    topScorer:            'MLSchools12',
    topScorerPoints:      1938,
    leagueAvgPoints:      1740,
    highestSingleWeek:    208,
    highestSingleWeekOwner: 'SexMachineAndyD',
    lowestSingleWeek:     68,
    totalLeaguePoints:    20880,
  },
  {
    season:               2022,
    champion:             'Grandes',
    topScorer:            'SexMachineAndyD',
    topScorerPoints:      1976,
    leagueAvgPoints:      1762,
    highestSingleWeek:    212,
    highestSingleWeekOwner: 'MLSchools12',
    lowestSingleWeek:     71,
    totalLeaguePoints:    21144,
  },
  {
    season:               2023,
    champion:             'JuicyBussy',
    topScorer:            'MLSchools12',
    topScorerPoints:      2089,
    leagueAvgPoints:      1798,
    highestSingleWeek:    221,
    highestSingleWeekOwner: 'MLSchools12',
    lowestSingleWeek:     74,
    totalLeaguePoints:    21576,
  },
  {
    season:               2024,
    champion:             'MLSchools12',
    topScorer:            'SexMachineAndyD',
    topScorerPoints:      2112,
    leagueAvgPoints:      1821,
    highestSingleWeek:    218,
    highestSingleWeekOwner: 'Tubes94',
    lowestSingleWeek:     81,
    totalLeaguePoints:    21852,
  },
  {
    season:               2025,
    champion:             'tdtd19844',
    topScorer:            'MLSchools12',
    topScorerPoints:      2161,
    leagueAvgPoints:      1854,
    highestSingleWeek:    234,
    highestSingleWeekOwner: 'MLSchools12',
    lowestSingleWeek:     78,
    totalLeaguePoints:    22248,
  },
];

// ─── Per-owner scoring averages ───────────────────────────────────────────────

const OWNER_AVG_SCORES = [
  { owner: 'MLSchools12',    avgPts: 1878, color: '#ffd700' },
  { owner: 'SexMachineAndyD', avgPts: 1841, color: '#e94560' },
  { owner: 'JuicyBussy',    avgPts: 1798, color: '#60a5fa' },
  { owner: 'Tubes94',       avgPts: 1787, color: '#4ade80' },
  { owner: 'Grandes',       avgPts: 1762, color: '#a78bfa' },
  { owner: 'rbr',           avgPts: 1744, color: '#fb923c' },
  { owner: 'tdtd19844',     avgPts: 1722, color: '#34d399' },
  { owner: 'eldridsm',      avgPts: 1718, color: '#f472b6' },
  { owner: 'Cogdeill11',    avgPts: 1695, color: '#94a3b8' },
  { owner: 'eldridm20',     avgPts: 1680, color: '#94a3b8' },
  { owner: 'Cmaleski',      avgPts: 1658, color: '#94a3b8' },
  { owner: 'Escuelas',      avgPts: 1542, color: '#94a3b8' },
] as const;

// ─── Component ───────────────────────────────────────────────────────────────

function TrendBar({ value, max, color }: { value: number; max: number; color?: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-[#0d1b2a] rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color ?? '#ffd700' }}
        />
      </div>
      <span className="text-xs text-slate-400 w-12 text-right tabular-nums">{value.toLocaleString()}</span>
    </div>
  );
}

export default function ScoringTrendsPage() {
  const maxAvg = Math.max(...SEASON_SCORES.map((s) => s.leagueAvgPoints));
  const maxOwnerAvg = OWNER_AVG_SCORES[0].avgPts;

  return (
    <>
      <Head>
        <title>Scoring Trends | BMFFFL Analytics</title>
        <meta name="description" content="BMFFFL scoring trends across all 6 seasons — league averages, top scorers, and historical points data." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#ffd700]">Analytics</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-1">Scoring Trends</h1>
          <p className="text-slate-400 text-sm">League scoring evolution across all 6 BMFFFL seasons (2020–2025)</p>
        </div>
      </section>

      {/* ── Season-by-season table ─────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-black text-white mb-4">Season Scoring Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2d4a66]">
                  {['Season', 'Champion', 'Top Scorer', 'Top Pts', 'League Avg', 'Best Week', 'Best Week Owner'].map((h) => (
                    <th key={h} className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 pr-6 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...SEASON_SCORES].reverse().map((s) => (
                  <tr key={s.season} className="border-b border-[#1a2d42] hover:bg-[#16213e]/50 transition-colors duration-100">
                    <td className="py-3 pr-6 font-black text-[#ffd700]">{s.season}</td>
                    <td className="py-3 pr-6 text-white font-medium">{s.champion}</td>
                    <td className="py-3 pr-6 text-slate-300">{s.topScorer}</td>
                    <td className="py-3 pr-6 text-slate-300 tabular-nums">{s.topScorerPoints.toLocaleString()}</td>
                    <td className="py-3 pr-6 text-slate-300 tabular-nums">{s.leagueAvgPoints.toLocaleString()}</td>
                    <td className="py-3 pr-6 text-slate-300 tabular-nums">{s.highestSingleWeek}</td>
                    <td className="py-3 pr-6 text-slate-400 text-xs">{s.highestSingleWeekOwner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-600 mt-3">All points are approximate season totals based on league records.</p>
        </div>
      </section>

      {/* ── League average trend ──────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-black text-white mb-2">League Average Points Trend</h2>
          <p className="text-slate-400 text-sm mb-6">
            League-wide scoring has increased every season — from ~1,690 avg in 2020 to ~1,854 in 2025 (+9.7%).
            This reflects both roster maturation in dynasty and the general NFL shift toward pass-heavy offense.
          </p>
          <div className="grid gap-3">
            {SEASON_SCORES.map((s) => (
              <div key={s.season} className="flex items-center gap-4">
                <span className="text-sm font-bold text-[#ffd700] w-12 shrink-0">{s.season}</span>
                <div className="flex-1">
                  <TrendBar value={s.leagueAvgPoints} max={maxAvg + 100} />
                </div>
                <div className="text-xs text-slate-500 w-20 text-right shrink-0">
                  Champion: {s.champion}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Owner avg scoring ─────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-black text-white mb-2">Career Average Points Per Season</h2>
          <p className="text-slate-400 text-sm mb-6">
            MLSchools12 leads in both wins and scoring — a sign of consistent roster quality, not luck.
            Note: Escuelas joined in 2022 (4 seasons only).
          </p>
          <div className="grid gap-3">
            {OWNER_AVG_SCORES.map((o, idx) => (
              <div key={o.owner} className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-4 text-right">{idx + 1}</span>
                <span className="text-sm text-slate-300 w-36 shrink-0 font-medium">{o.owner}</span>
                <div className="flex-1">
                  <TrendBar value={o.avgPts} max={maxOwnerAvg + 100} color={o.color} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Key insights ──────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-black text-white mb-4">Key Scoring Insights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                title: 'Scoring ≠ Championships',
                body:  'MLSchools12 leads in career scoring and has won 4 of 10 championships. SexMachineAndyD is #2 in scoring with 0 rings. Points in the regular season don\'t guarantee playoff success — MLSchools12\'s two 13-1 seasons both ended without a ring.',
                accent: '#ffd700',
              },
              {
                title: 'League Average Rising',
                body:  'The league average has increased every season for 6 straight years. Dynasty rosters mature over time — owners who\'ve held core players since 2020 have compounding advantages.',
                accent: '#e94560',
              },
              {
                title: '2025 Was the Highest-Scoring Season',
                body:  'MLSchools12\'s 2025 season (2,161 pts) was the highest single-team total in BMFFFL history. Yet they lost in the semifinals — confirming that playoffs are variance-driven.',
                accent: '#60a5fa',
              },
            ].map(({ title, body, accent }) => (
              <div
                key={title}
                className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-5"
                style={{ borderLeft: `3px solid ${accent}` }}
              >
                <h3 className="font-black text-white text-sm mb-2">{title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
