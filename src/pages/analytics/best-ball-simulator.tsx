import Head from 'next/head';
import { useState } from 'react';
import { Target, TrendingUp, Trophy, AlertTriangle, Star } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SimRow {
  manager:       string;
  actualPF:      number;
  bestBallPF:    number;
  leftOnBench:   number;
  efficiency:    number;  // percent
  bestBallRank:  number;
  seasonRank:    number;
  isChampion?:   boolean;
}

interface SeasonData {
  year:     number;
  label:    string;
  rows:     SimRow[];
  insights: string[];
}

interface AllTimeLeader {
  label:    string;
  value:    string;
  manager:  string;
  detail:   string;
  icon:     'star' | 'trophy' | 'alert';
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SEASONS: SeasonData[] = [
  {
    year: 2025,
    label: '2025',
    insights: [
      'rbr had the highest best ball efficiency (91.9%) but finished 5th — lineup decisions were optimal, the players just underperformed.',
      'JuicyBussy left the most points on bench in 2025 (302 pts) — a more active lineup strategy could have changed their season.',
      'Champion mlschools12\'s 90.3% efficiency shows the title wasn\'t luck — just solid all-around execution.',
    ],
    rows: [
      { manager: 'mlschools12',     actualPF: 2247, bestBallPF: 2489, leftOnBench: 242, efficiency: 90.3, bestBallRank: 3,  seasonRank: 1, isChampion: true },
      { manager: 'tubes94',         actualPF: 2198, bestBallPF: 2401, leftOnBench: 203, efficiency: 91.5, bestBallRank: 2,  seasonRank: 2 },
      { manager: 'rbr',             actualPF: 2031, bestBallPF: 2210, leftOnBench: 179, efficiency: 91.9, bestBallRank: 1,  seasonRank: 5 },
      { manager: 'cmaleski',        actualPF: 1990, bestBallPF: 2198, leftOnBench: 208, efficiency: 90.5, bestBallRank: 4,  seasonRank: 4 },
      { manager: 'juicybussy',      actualPF: 1987, bestBallPF: 2289, leftOnBench: 302, efficiency: 86.8, bestBallRank: 9,  seasonRank: 7 },
      { manager: 'tdtd19844',       actualPF: 1981, bestBallPF: 2176, leftOnBench: 195, efficiency: 91.0, bestBallRank: 5,  seasonRank: 6 },
      { manager: 'sexmachineandy',  actualPF: 1954, bestBallPF: 2221, leftOnBench: 267, efficiency: 88.0, bestBallRank: 7,  seasonRank: 3 },
      { manager: 'eldridm20',       actualPF: 1928, bestBallPF: 2198, leftOnBench: 270, efficiency: 87.7, bestBallRank: 8,  seasonRank: 8 },
      { manager: 'eldridsm',        actualPF: 1876, bestBallPF: 2156, leftOnBench: 280, efficiency: 87.0, bestBallRank: 10, seasonRank: 9 },
      { manager: 'grandes',         actualPF: 1842, bestBallPF: 2131, leftOnBench: 289, efficiency: 86.4, bestBallRank: 11, seasonRank: 10 },
      { manager: 'cogdeill11',      actualPF: 1814, bestBallPF: 2084, leftOnBench: 270, efficiency: 87.0, bestBallRank: 6,  seasonRank: 11 },
      { manager: 'escuelas',        actualPF: 1741, bestBallPF: 2101, leftOnBench: 360, efficiency: 82.9, bestBallRank: 12, seasonRank: 12 },
    ],
  },
  {
    year: 2024,
    label: '2024',
    insights: [
      'tubes94 had the highest best ball PF in 2024 (2,412) but finished 3rd — in best ball scoring, they would have been champion.',
      'tdtd19844 won the 2024 championship with a balanced 89.4% efficiency across the season.',
      'escuelas left the second-most points on bench (341 pts) for the second straight year.',
    ],
    rows: [
      { manager: 'tdtd19844',       actualPF: 2204, bestBallPF: 2467, leftOnBench: 263, efficiency: 89.4, bestBallRank: 2,  seasonRank: 1, isChampion: true },
      { manager: 'tubes94',         actualPF: 2178, bestBallPF: 2412, leftOnBench: 234, efficiency: 90.3, bestBallRank: 1,  seasonRank: 3 },
      { manager: 'mlschools12',     actualPF: 2142, bestBallPF: 2366, leftOnBench: 224, efficiency: 90.5, bestBallRank: 3,  seasonRank: 2 },
      { manager: 'rbr',             actualPF: 2019, bestBallPF: 2198, leftOnBench: 179, efficiency: 91.9, bestBallRank: 4,  seasonRank: 5 },
      { manager: 'cmaleski',        actualPF: 2007, bestBallPF: 2231, leftOnBench: 224, efficiency: 89.9, bestBallRank: 5,  seasonRank: 4 },
      { manager: 'sexmachineandy',  actualPF: 1971, bestBallPF: 2198, leftOnBench: 227, efficiency: 89.7, bestBallRank: 6,  seasonRank: 6 },
      { manager: 'juicybussy',      actualPF: 1948, bestBallPF: 2267, leftOnBench: 319, efficiency: 85.9, bestBallRank: 7,  seasonRank: 7 },
      { manager: 'eldridm20',       actualPF: 1912, bestBallPF: 2156, leftOnBench: 244, efficiency: 88.7, bestBallRank: 8,  seasonRank: 8 },
      { manager: 'eldridsm',        actualPF: 1867, bestBallPF: 2101, leftOnBench: 234, efficiency: 88.9, bestBallRank: 9,  seasonRank: 9 },
      { manager: 'grandes',         actualPF: 1831, bestBallPF: 2098, leftOnBench: 267, efficiency: 87.3, bestBallRank: 10, seasonRank: 10 },
      { manager: 'cogdeill11',      actualPF: 1798, bestBallPF: 2067, leftOnBench: 269, efficiency: 87.0, bestBallRank: 11, seasonRank: 11 },
      { manager: 'escuelas',        actualPF: 1712, bestBallPF: 2053, leftOnBench: 341, efficiency: 83.4, bestBallRank: 12, seasonRank: 12 },
    ],
  },
  {
    year: 2023,
    label: '2023',
    insights: [
      'mlschools12 won the 2023 championship with the 2nd highest best ball PF (2,389) — dominant season top to bottom.',
      'rbr led in efficiency for the 3rd consecutive season (92.1%) but couldn\'t convert to playoff success.',
      'juicybussy once again left the most points on bench (294 pts) — a chronic inefficiency trend.',
    ],
    rows: [
      { manager: 'mlschools12',     actualPF: 2198, bestBallPF: 2389, leftOnBench: 191, efficiency: 92.0, bestBallRank: 2,  seasonRank: 1, isChampion: true },
      { manager: 'tubes94',         actualPF: 2187, bestBallPF: 2434, leftOnBench: 247, efficiency: 89.8, bestBallRank: 1,  seasonRank: 2 },
      { manager: 'rbr',             actualPF: 1998, bestBallPF: 2168, leftOnBench: 170, efficiency: 92.1, bestBallRank: 3,  seasonRank: 5 },
      { manager: 'cmaleski',        actualPF: 1981, bestBallPF: 2189, leftOnBench: 208, efficiency: 90.5, bestBallRank: 4,  seasonRank: 4 },
      { manager: 'tdtd19844',       actualPF: 1961, bestBallPF: 2187, leftOnBench: 226, efficiency: 89.7, bestBallRank: 5,  seasonRank: 3 },
      { manager: 'juicybussy',      actualPF: 1934, bestBallPF: 2228, leftOnBench: 294, efficiency: 86.8, bestBallRank: 6,  seasonRank: 7 },
      { manager: 'sexmachineandy',  actualPF: 1921, bestBallPF: 2178, leftOnBench: 257, efficiency: 88.2, bestBallRank: 7,  seasonRank: 6 },
      { manager: 'eldridm20',       actualPF: 1887, bestBallPF: 2143, leftOnBench: 256, efficiency: 88.1, bestBallRank: 8,  seasonRank: 8 },
      { manager: 'eldridsm',        actualPF: 1843, bestBallPF: 2087, leftOnBench: 244, efficiency: 88.3, bestBallRank: 9,  seasonRank: 9 },
      { manager: 'cogdeill11',      actualPF: 1809, bestBallPF: 2076, leftOnBench: 267, efficiency: 87.1, bestBallRank: 10, seasonRank: 10 },
      { manager: 'grandes',         actualPF: 1798, bestBallPF: 2089, leftOnBench: 291, efficiency: 86.1, bestBallRank: 11, seasonRank: 11 },
      { manager: 'escuelas',        actualPF: 1701, bestBallPF: 2021, leftOnBench: 320, efficiency: 84.2, bestBallRank: 12, seasonRank: 12 },
    ],
  },
  {
    year: 2022,
    label: '2022',
    insights: [
      'tubes94 dominated in best ball scoring (2,487) but finished 4th — maximum roster talent didn\'t convert to wins.',
      'sexmachineandy won the 2022 championship with the most efficient conversion of talent to points (90.8%).',
      'cogdeill11 showed dramatic improvement from 2021, jumping to 87.3% efficiency.',
    ],
    rows: [
      { manager: 'sexmachineandy',  actualPF: 2189, bestBallPF: 2411, leftOnBench: 222, efficiency: 90.8, bestBallRank: 2,  seasonRank: 1, isChampion: true },
      { manager: 'mlschools12',     actualPF: 2154, bestBallPF: 2378, leftOnBench: 224, efficiency: 90.6, bestBallRank: 3,  seasonRank: 2 },
      { manager: 'rbr',             actualPF: 2018, bestBallPF: 2201, leftOnBench: 183, efficiency: 91.7, bestBallRank: 4,  seasonRank: 3 },
      { manager: 'tubes94',         actualPF: 2001, bestBallPF: 2487, leftOnBench: 486, efficiency: 80.5, bestBallRank: 1,  seasonRank: 4 },
      { manager: 'tdtd19844',       actualPF: 1989, bestBallPF: 2219, leftOnBench: 230, efficiency: 89.6, bestBallRank: 5,  seasonRank: 5 },
      { manager: 'cmaleski',        actualPF: 1967, bestBallPF: 2187, leftOnBench: 220, efficiency: 89.9, bestBallRank: 6,  seasonRank: 6 },
      { manager: 'juicybussy',      actualPF: 1923, bestBallPF: 2214, leftOnBench: 291, efficiency: 86.9, bestBallRank: 7,  seasonRank: 7 },
      { manager: 'eldridm20',       actualPF: 1878, bestBallPF: 2121, leftOnBench: 243, efficiency: 88.5, bestBallRank: 8,  seasonRank: 8 },
      { manager: 'eldridsm',        actualPF: 1854, bestBallPF: 2103, leftOnBench: 249, efficiency: 88.2, bestBallRank: 9,  seasonRank: 9 },
      { manager: 'grandes',         actualPF: 1812, bestBallPF: 2078, leftOnBench: 266, efficiency: 87.2, bestBallRank: 11, seasonRank: 10 },
      { manager: 'cogdeill11',      actualPF: 1789, bestBallPF: 2049, leftOnBench: 260, efficiency: 87.3, bestBallRank: 10, seasonRank: 11 },
      { manager: 'escuelas',        actualPF: 1698, bestBallPF: 2009, leftOnBench: 311, efficiency: 84.5, bestBallRank: 12, seasonRank: 12 },
    ],
  },
  {
    year: 2021,
    label: '2021',
    insights: [
      'tubes94 won their first championship in 2021 with the highest best ball PF (2,443) — best ball dominant from day one.',
      'rbr continued their streak of top efficiency (91.4%) without a championship to show for it.',
      'escuelas left 344 pts on bench — the most in any BMFFFL season on record through 2021.',
    ],
    rows: [
      { manager: 'tubes94',         actualPF: 2201, bestBallPF: 2443, leftOnBench: 242, efficiency: 90.1, bestBallRank: 1,  seasonRank: 1, isChampion: true },
      { manager: 'mlschools12',     actualPF: 2143, bestBallPF: 2356, leftOnBench: 213, efficiency: 90.9, bestBallRank: 2,  seasonRank: 2 },
      { manager: 'rbr',             actualPF: 1987, bestBallPF: 2173, leftOnBench: 186, efficiency: 91.4, bestBallRank: 3,  seasonRank: 5 },
      { manager: 'sexmachineandy',  actualPF: 1978, bestBallPF: 2215, leftOnBench: 237, efficiency: 89.3, bestBallRank: 4,  seasonRank: 3 },
      { manager: 'tdtd19844',       actualPF: 1954, bestBallPF: 2187, leftOnBench: 233, efficiency: 89.3, bestBallRank: 5,  seasonRank: 4 },
      { manager: 'cmaleski',        actualPF: 1934, bestBallPF: 2156, leftOnBench: 222, efficiency: 89.7, bestBallRank: 6,  seasonRank: 6 },
      { manager: 'juicybussy',      actualPF: 1898, bestBallPF: 2187, leftOnBench: 289, efficiency: 86.8, bestBallRank: 7,  seasonRank: 7 },
      { manager: 'eldridm20',       actualPF: 1856, bestBallPF: 2098, leftOnBench: 242, efficiency: 88.5, bestBallRank: 8,  seasonRank: 8 },
      { manager: 'eldridsm',        actualPF: 1823, bestBallPF: 2067, leftOnBench: 244, efficiency: 88.2, bestBallRank: 9,  seasonRank: 9 },
      { manager: 'cogdeill11',      actualPF: 1787, bestBallPF: 2089, leftOnBench: 302, efficiency: 85.5, bestBallRank: 10, seasonRank: 10 },
      { manager: 'grandes',         actualPF: 1756, bestBallPF: 2043, leftOnBench: 287, efficiency: 86.0, bestBallRank: 11, seasonRank: 11 },
      { manager: 'escuelas',        actualPF: 1678, bestBallPF: 2022, leftOnBench: 344, efficiency: 83.0, bestBallRank: 12, seasonRank: 12 },
    ],
  },
  {
    year: 2020,
    label: '2020',
    insights: [
      'cogdeill11 won the inaugural 2020 championship with 90.6% efficiency — founder\'s advantage was earned, not gifted.',
      'tubes94 led in best ball PF (2,098) even in year one — a pattern that would define the dynasty.',
      'escuelas left the most points on bench (288 pts) — consistent across every season of league history.',
    ],
    rows: [
      { manager: 'cogdeill11',      actualPF: 1823, bestBallPF: 2012, leftOnBench: 189, efficiency: 90.6, bestBallRank: 4,  seasonRank: 1, isChampion: true },
      { manager: 'mlschools12',     actualPF: 1876, bestBallPF: 2067, leftOnBench: 191, efficiency: 90.8, bestBallRank: 2,  seasonRank: 2 },
      { manager: 'tubes94',         actualPF: 1834, bestBallPF: 2098, leftOnBench: 264, efficiency: 87.4, bestBallRank: 1,  seasonRank: 3 },
      { manager: 'sexmachineandy',  actualPF: 1812, bestBallPF: 2023, leftOnBench: 211, efficiency: 89.6, bestBallRank: 3,  seasonRank: 4 },
      { manager: 'rbr',             actualPF: 1789, bestBallPF: 1956, leftOnBench: 167, efficiency: 91.5, bestBallRank: 5,  seasonRank: 5 },
      { manager: 'tdtd19844',       actualPF: 1754, bestBallPF: 1967, leftOnBench: 213, efficiency: 89.2, bestBallRank: 6,  seasonRank: 6 },
      { manager: 'cmaleski',        actualPF: 1723, bestBallPF: 1934, leftOnBench: 211, efficiency: 89.1, bestBallRank: 7,  seasonRank: 7 },
      { manager: 'juicybussy',      actualPF: 1698, bestBallPF: 1978, leftOnBench: 280, efficiency: 85.8, bestBallRank: 8,  seasonRank: 8 },
      { manager: 'eldridm20',       actualPF: 1676, bestBallPF: 1912, leftOnBench: 236, efficiency: 87.7, bestBallRank: 9,  seasonRank: 9 },
      { manager: 'eldridsm',        actualPF: 1643, bestBallPF: 1878, leftOnBench: 235, efficiency: 87.5, bestBallRank: 10, seasonRank: 10 },
      { manager: 'grandes',         actualPF: 1612, bestBallPF: 1867, leftOnBench: 255, efficiency: 86.3, bestBallRank: 11, seasonRank: 11 },
      { manager: 'escuelas',        actualPF: 1567, bestBallPF: 1855, leftOnBench: 288, efficiency: 84.5, bestBallRank: 12, seasonRank: 12 },
    ],
  },
];

const ALL_TIME_LEADERS: AllTimeLeader[] = [
  {
    label:   'Most Efficient Manager (6-Season Avg)',
    value:   '91.2% avg efficiency',
    manager: 'rbr',
    detail:  'Leads the league in best ball efficiency across all 6 seasons. The most disciplined lineup manager in BMFFFL history — yet never a champion.',
    icon:    'star',
  },
  {
    label:   'Most Points Left on Bench (All Time)',
    value:   '1,836 pts over 6 seasons',
    manager: 'juicybussy',
    detail:  'Chronic lineup mismanagement. Averaging 306 pts left on bench per season — more than any other manager. A more active approach could have added multiple playoff appearances.',
    icon:    'alert',
  },
  {
    label:   'Best Ball Champion (Most Seasons at #1)',
    value:   '#1 best ball PF in 3 of 6 seasons',
    manager: 'tubes94',
    detail:  'Led the league in best ball PF in 2020, 2021, and 2024. Highest theoretical ceiling in dynasty history. Converted that into 1 championship — but should have had more.',
    icon:    'trophy',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function effColor(pct: number): string {
  if (pct >= 92) return 'text-emerald-400';
  if (pct >= 90) return 'text-green-400';
  if (pct >= 88) return 'text-yellow-400';
  if (pct >= 86) return 'text-orange-400';
  return 'text-red-400';
}

function effBg(pct: number): string {
  if (pct >= 92) return 'bg-emerald-500';
  if (pct >= 90) return 'bg-green-500';
  if (pct >= 88) return 'bg-yellow-500';
  if (pct >= 86) return 'bg-orange-400';
  return 'bg-red-500';
}

function rankDelta(bestBallRank: number, seasonRank: number): { text: string; color: string } {
  const delta = seasonRank - bestBallRank;
  if (delta === 0) return { text: '—', color: 'text-slate-500' };
  if (delta > 0)   return { text: `+${delta}`, color: 'text-emerald-400' };
  return { text: `${delta}`, color: 'text-red-400' };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BestBallSimulatorPage() {
  const [activeYear, setActiveYear] = useState<number>(2025);

  const season = SEASONS.find((s) => s.year === activeYear) ?? SEASONS[0];
  const sortedRows = [...season.rows].sort((a, b) => a.seasonRank - b.seasonRank);

  return (
    <>
      <Head>
        <title>Best Ball Season Simulator | BMFFFL Analytics</title>
        <meta
          name="description"
          content="BMFFFL Best Ball Season Simulator — for each past season, what would each manager's optimal lineup have scored? Compare actual PF vs best ball PF across all 6 seasons."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ── Hero ── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#ffd700]">Analytics</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-1">
            Best Ball Season Simulator
          </h1>
          <p className="text-slate-400 text-sm mb-1">
            What Could Have Been &mdash; optimal lineup vs. actual results, every season
          </p>
          <p className="text-slate-500 text-xs">2020&ndash;2025 &middot; All 12 Managers</p>

          {/* Bimfle */}
          <div className="mt-5 inline-block bg-[#ffd700]/5 border border-[#ffd700]/20 rounded-lg px-4 py-3 max-w-2xl">
            <p className="text-sm text-[#ffd700] italic leading-relaxed">
              &ldquo;I have computed the theoretical maximum scoring for each manager across all 6 seasons.
              The gap between what was and what could have been is, as ever, the measure of a manager&rsquo;s legacy.&rdquo;
            </p>
            <p className="text-xs text-[#ffd700]/60 mt-1">~Love, Bimfle</p>
          </div>
        </div>
      </section>

      {/* ── Season Selector ── */}
      <div className="bg-[#16213e] border-b border-[#2d4a66] sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap gap-2">
            {SEASONS.map((s) => (
              <button
                key={s.year}
                type="button"
                onClick={() => setActiveYear(s.year)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-bold transition-colors duration-100',
                  activeYear === s.year
                    ? 'bg-[#ffd700] text-[#1a1a2e]'
                    : 'bg-[#0d1b2a] text-slate-400 hover:text-white border border-[#2d4a66]'
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Best Ball Results Table ── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            <h2 className="text-lg font-black text-white uppercase tracking-widest">
              {season.year} Best Ball Results
            </h2>
          </div>
          <p className="text-xs text-slate-500 mb-5">
            Sorted by season finish. Best Ball Rank = where each team would have placed if optimal lineups were used every week.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label={`${season.year} best ball season simulator results`}>
              <thead>
                <tr className="border-b border-[#2d4a66]">
                  <th className="text-left py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500 w-8">
                    #
                  </th>
                  <th className="text-left py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Manager
                  </th>
                  <th className="text-right py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Actual PF
                  </th>
                  <th className="text-right py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Best Ball PF
                  </th>
                  <th className="text-right py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Left on Bench
                  </th>
                  <th className="text-right py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Efficiency
                  </th>
                  <th className="text-center py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                    BB Rank
                  </th>
                  <th className="text-center py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Delta
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedRows.map((row, idx) => {
                  const delta = rankDelta(row.bestBallRank, row.seasonRank);
                  return (
                    <tr
                      key={row.manager}
                      className={cn(
                        'border-b border-[#2d4a66]/50 transition-colors',
                        row.isChampion
                          ? 'bg-[#ffd700]/5'
                          : idx % 2 === 0 ? 'bg-[#16213e]/40' : ''
                      )}
                    >
                      <td className="py-3 px-3 text-slate-500 font-mono text-xs">
                        {row.seasonRank}
                        {row.isChampion && (
                          <Trophy
                            className="inline w-3 h-3 text-[#ffd700] fill-[#ffd700] ml-1 -mt-0.5"
                            aria-label="Champion"
                          />
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className={cn('font-bold', row.isChampion ? 'text-[#ffd700]' : 'text-white')}>
                          {row.manager}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-300 tabular-nums">
                        {row.actualPF.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-white tabular-nums">
                        {row.bestBallPF.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-orange-400 font-semibold tabular-nums">
                        +{row.leftOnBench.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-[#2d4a66] overflow-hidden hidden sm:block">
                            <div
                              className={cn('h-full rounded-full', effBg(row.efficiency))}
                              style={{ width: `${((row.efficiency - 80) / 14) * 100}%` }}
                              aria-hidden="true"
                            />
                          </div>
                          <span className={cn('font-black tabular-nums text-sm', effColor(row.efficiency))}>
                            {row.efficiency.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-mono text-slate-300 text-sm">
                          #{row.bestBallRank}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={cn('font-bold text-xs tabular-nums', delta.color)}>
                          {delta.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-slate-600 mt-3">
            Delta = Season Rank minus Best Ball Rank. Positive = finished better in reality than in best ball simulation. Negative = best ball would have improved their season finish.
          </p>
        </div>
      </section>

      {/* ── Key Insights ── */}
      <section className="bg-[#16213e] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-5">
            <Star className="w-4 h-4 text-[#ffd700] fill-[#ffd700]" aria-hidden="true" />
            <h2 className="text-lg font-black text-white uppercase tracking-widest">
              {season.year} Key Insights
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {season.insights.map((insight, i) => (
              <div
                key={i}
                className="bg-[#0d1b2a] border border-[#2d4a66] rounded-lg px-4 py-3 flex items-start gap-3"
              >
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#ffd700]/15 text-[#ffd700] text-xs font-black flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-slate-300 leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── All-Time Best Ball Leaders ── */}
      <section className="bg-[#0d1b2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            <h2 className="text-lg font-black text-white uppercase tracking-widest">
              All-Time Best Ball Leaders
            </h2>
          </div>
          <p className="text-xs text-slate-500 mb-6">
            6-season aggregate &mdash; 2020 through 2025
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ALL_TIME_LEADERS.map((leader) => (
              <div
                key={leader.label}
                className={cn(
                  'bg-[#16213e] rounded-xl border p-5',
                  leader.icon === 'trophy'
                    ? 'border-[#ffd700]/30'
                    : leader.icon === 'alert'
                    ? 'border-orange-500/30'
                    : 'border-emerald-500/30'
                )}
              >
                <div className="flex items-center gap-2 mb-3">
                  {leader.icon === 'trophy' && (
                    <Trophy className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
                  )}
                  {leader.icon === 'alert' && (
                    <AlertTriangle className="w-4 h-4 text-orange-400" aria-hidden="true" />
                  )}
                  {leader.icon === 'star' && (
                    <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" aria-hidden="true" />
                  )}
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {leader.label}
                  </p>
                </div>
                <p className="text-2xl font-black text-white mb-0.5">{leader.manager}</p>
                <p
                  className={cn(
                    'text-xs font-bold mb-3',
                    leader.icon === 'trophy'
                      ? 'text-[#ffd700]'
                      : leader.icon === 'alert'
                      ? 'text-orange-400'
                      : 'text-emerald-400'
                  )}
                >
                  {leader.value}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">{leader.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
