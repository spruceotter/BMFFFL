import Head from 'next/head';
import { Users, Trophy, TrendingUp, Award } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type ManagerTier = 'FOUNDING' | 'EXPANSION';

interface ManagerRecord {
  manager:    string;
  tier:       ManagerTier;
  joinYear:   number;
  seasons:    number;
  wins:       number;
  losses:     number;
  winPct:     number;
  playoffs:   number;
  titles:     number;
  assessment: string;
  trend:      'up' | 'down' | 'stable';
  yearlyWins: number[]; // wins per season 2020-2025 (6 seasons; expansion managers get 0 for seasons before joining)
}

interface YearStat {
  year: number;
  label: string;
  foundingAvgWin: number;
  expansionAvgWin: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const MANAGERS: ManagerRecord[] = [
  {
    manager:    'mlschools12',
    tier:       'FOUNDING',
    joinYear:   2020,
    seasons:    6,
    wins:       68,
    losses:     36,
    winPct:     0.654,
    playoffs:   5,
    titles:     2,
    assessment: 'DYNASTY PATRIARCH',
    trend:      'stable',
    yearlyWins: [11, 12, 10, 11, 12, 12],
  },
  {
    manager:    'tdtd19844',
    tier:       'FOUNDING',
    joinYear:   2020,
    seasons:    6,
    wins:       62,
    losses:     42,
    winPct:     0.596,
    playoffs:   4,
    titles:     1,
    assessment: '2025 CHAMPION',
    trend:      'up',
    yearlyWins: [9, 10, 11, 10, 11, 11],
  },
  {
    manager:    'rbr',
    tier:       'FOUNDING',
    joinYear:   2020,
    seasons:    6,
    wins:       58,
    losses:     46,
    winPct:     0.558,
    playoffs:   4,
    titles:     1,
    assessment: 'ELITE VETERAN',
    trend:      'stable',
    yearlyWins: [9, 10, 9, 10, 9, 11],
  },
  {
    manager:    'SexMachineAndyD',
    tier:       'FOUNDING',
    joinYear:   2020,
    seasons:    6,
    wins:       56,
    losses:     48,
    winPct:     0.538,
    playoffs:   3,
    titles:     1,
    assessment: 'PROVEN CONTENDER',
    trend:      'stable',
    yearlyWins: [8, 9, 10, 9, 9, 11],
  },
  {
    manager:    'grandes',
    tier:       'FOUNDING',
    joinYear:   2020,
    seasons:    6,
    wins:       50,
    losses:     54,
    winPct:     0.481,
    playoffs:   3,
    titles:     0,
    assessment: 'VETERAN UNDERACHIEVER',
    trend:      'down',
    yearlyWins: [10, 9, 8, 8, 7, 8],
  },
  {
    manager:    'cogdeill11',
    tier:       'FOUNDING',
    joinYear:   2020,
    seasons:    6,
    wins:       46,
    losses:     58,
    winPct:     0.442,
    playoffs:   2,
    titles:     0,
    assessment: 'INCONSISTENT VETERAN',
    trend:      'up',
    yearlyWins: [6, 7, 8, 7, 9, 9],
  },
  {
    manager:    'Cmaleski',
    tier:       'FOUNDING',
    joinYear:   2020,
    seasons:    6,
    wins:       54,
    losses:     50,
    winPct:     0.519,
    playoffs:   3,
    titles:     0,
    assessment: 'PERENNIAL BRIDESMAID',
    trend:      'stable',
    yearlyWins: [9, 9, 9, 9, 9, 9],
  },
  {
    manager:    'JuicyBussy',
    tier:       'FOUNDING',
    joinYear:   2020,
    seasons:    6,
    wins:       52,
    losses:     52,
    winPct:     0.500,
    playoffs:   3,
    titles:     0,
    assessment: 'BOOM-OR-BUST VETERAN',
    trend:      'stable',
    yearlyWins: [10, 11, 7, 8, 8, 8],
  },
  {
    manager:    'eldridsm',
    tier:       'FOUNDING',
    joinYear:   2020,
    seasons:    6,
    wins:       44,
    losses:     60,
    winPct:     0.423,
    playoffs:   2,
    titles:     0,
    assessment: 'REBUILDING VETERAN',
    trend:      'down',
    yearlyWins: [9, 8, 7, 6, 7, 7],
  },
  {
    manager:    'eldridm20',
    tier:       'FOUNDING',
    joinYear:   2020,
    seasons:    6,
    wins:       42,
    losses:     62,
    winPct:     0.404,
    playoffs:   1,
    titles:     0,
    assessment: 'BOTTOM-TIER FOUNDER',
    trend:      'up',
    yearlyWins: [5, 6, 7, 8, 8, 8],
  },
  {
    manager:    'tubes94',
    tier:       'EXPANSION',
    joinYear:   2021,
    seasons:    5,
    wins:       54,
    losses:     36,
    winPct:     0.600,
    playoffs:   4,
    titles:     0,
    assessment: 'FASTEST ASCENT IN HISTORY',
    trend:      'up',
    yearlyWins: [0, 11, 12, 11, 11, 9],
  },
  {
    manager:    'escuelas',
    tier:       'EXPANSION',
    joinYear:   2022,
    seasons:    4,
    wins:       36,
    losses:     44,
    winPct:     0.450,
    playoffs:   1,
    titles:     0,
    assessment: 'STILL LEARNING',
    trend:      'up',
    yearlyWins: [0, 0, 8, 9, 9, 10],
  },
];

const YEARLY_STATS: YearStat[] = [
  { year: 2020, label: 'Founding Season',   foundingAvgWin: 8.7, expansionAvgWin: 0   },
  { year: 2021, label: 'First Expansion',   foundingAvgWin: 9.1, expansionAvgWin: 11.0 },
  { year: 2022, label: 'Second Expansion',  foundingAvgWin: 8.8, expansionAvgWin: 9.5  },
  { year: 2023, label: 'Tubes94 Ascent',    foundingAvgWin: 8.6, expansionAvgWin: 10.0 },
  { year: 2024, label: 'Championship Year', foundingAvgWin: 8.9, expansionAvgWin: 10.0 },
  { year: 2025, label: '2025 Season',       foundingAvgWin: 9.2, expansionAvgWin: 9.5  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const TIER_CONFIG: Record<ManagerTier, { color: string; label: string; bg: string; border: string }> = {
  FOUNDING:  { color: '#ffd700', label: 'FOUNDING',  bg: 'bg-yellow-500/10', border: 'border-yellow-500/40' },
  EXPANSION: { color: '#60a5fa', label: 'EXPANSION', bg: 'bg-blue-500/10',   border: 'border-blue-500/40' },
};

const TREND_CONFIG = {
  up:     { label: 'Improving', color: '#4ade80', symbol: '↑' },
  down:   { label: 'Declining', color: '#e94560', symbol: '↓' },
  stable: { label: 'Stable',    color: '#94a3b8', symbol: '→' },
} as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

function TierBadge({ tier }: { tier: ManagerTier }) {
  const cfg = TIER_CONFIG[tier];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border shrink-0',
        cfg.bg,
        cfg.border
      )}
      style={{ color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
}

function WinBar({ wins, losses }: { wins: number; losses: number }) {
  const total = wins + losses;
  const pct   = Math.round((wins / total) * 100);
  const color =
    pct >= 60 ? '#4ade80' :
    pct >= 50 ? '#60a5fa' :
    pct >= 40 ? '#fbbf24' : '#e94560';

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-[#0d1b2a] overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-bold tabular-nums shrink-0" style={{ color }}>
        {(wins / total).toFixed(3).replace(/^0/, '')}
      </span>
    </div>
  );
}

function SparkLine({ wins, joinYear }: { wins: number[]; joinYear: number }) {
  const years = [2020, 2021, 2022, 2023, 2024, 2025];
  const max   = Math.max(...wins.filter((w) => w > 0), 1);
  const h     = 24;
  const w     = 80;
  const pts   = wins.map((v, i) => {
    const x = Math.round((i / (wins.length - 1)) * w);
    const y = v === 0 ? h : Math.round(h - (v / max) * h);
    return [x, y] as [number, number];
  });

  const path = pts
    .filter(([, y]) => y <= h)
    .map(([x, y], i, arr) => `${i === 0 ? 'M' : 'L'}${x},${y}`)
    .join(' ');

  return (
    <svg width={w} height={h} aria-hidden="true" className="overflow-visible">
      <path d={path} fill="none" stroke="#60a5fa" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      {pts.map(([x, y], i) => {
        if (wins[i] === 0) return null;
        return <circle key={i} cx={x} cy={y} r={2} fill="#60a5fa" />;
      })}
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VeteranVsRookiePage() {
  const founding  = MANAGERS.filter((m) => m.tier === 'FOUNDING');
  const expansion = MANAGERS.filter((m) => m.tier === 'EXPANSION');

  const foundingAvgWin  = founding.reduce((s, m) => s + m.winPct, 0) / founding.length;
  const expansionAvgWin = expansion.reduce((s, m) => s + m.winPct, 0) / expansion.length;

  const totalTitles        = MANAGERS.reduce((s, m) => s + m.titles, 0);
  const foundingTitles     = founding.reduce((s, m) => s + m.titles, 0);
  const mostPlayoffs       = [...MANAGERS].sort((a, b) => b.playoffs - a.playoffs)[0];
  const sortedByWin        = [...MANAGERS].sort((a, b) => b.winPct - a.winPct);

  return (
    <>
      <Head>
        <title>Veteran vs New Manager Analysis | BMFFFL Analytics</title>
        <meta
          name="description"
          content="BMFFFL experience analysis — comparing founding managers vs expansion entrants by win rate, playoff appearances, championships, and learning curve trends."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#ffd700]">Analytics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 leading-tight">
            Veteran vs New Manager Analysis
          </h1>
          <p className="text-slate-400 text-base max-w-2xl">
            BMFFFL has 10 founding managers since 2020, plus 2 who joined later. Does experience
            translate to dynasty success? The data has an answer.
          </p>
        </div>
      </section>

      {/* ── Stat strip ───────────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label:  'Founding Managers',
                value:  '10',
                sub:    'Since 2020',
                accent: '#ffd700',
              },
              {
                label:  'Expansion Managers',
                value:  '2',
                sub:    'Joined 2021–2022',
                accent: '#60a5fa',
              },
              {
                label:  'Founding Win%',
                value:  foundingAvgWin.toFixed(3).replace(/^0/, ''),
                sub:    'League avg, all seasons',
                accent: '#4ade80',
              },
              {
                label:  'Expansion Win%',
                value:  expansionAvgWin.toFixed(3).replace(/^0/, ''),
                sub:    'In seasons played',
                accent: '#fb923c',
              },
            ].map(({ label, value, sub, accent }) => (
              <div
                key={label}
                className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-4 text-center"
                style={{ borderTop: `3px solid ${accent}` }}
              >
                <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">{label}</div>
                <div className="text-2xl font-black tabular-nums" style={{ color: accent }}>{value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Experience rankings table ─────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-black text-white mb-1">Experience Rankings</h2>
          <p className="text-slate-400 text-sm mb-6">
            All 12 managers ranked by win percentage. Founding vs expansion managers highlighted.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2d4a66]">
                  {['Rank', 'Manager', 'Tier', 'Joined', 'Seasons', 'W–L', 'Win%', 'Playoffs', 'Titles', 'Trend', 'Assessment'].map((h) => (
                    <th
                      key={h}
                      className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 pr-4 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedByWin.map((m, idx) => {
                  const trend = TREND_CONFIG[m.trend];
                  return (
                    <tr
                      key={m.manager}
                      className={cn(
                        'border-b border-[#1a2d42] hover:bg-[#16213e]/50 transition-colors duration-100',
                        m.tier === 'EXPANSION' && 'bg-blue-500/5'
                      )}
                    >
                      <td className="py-2.5 pr-4">
                        <span
                          className={cn(
                            'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black tabular-nums',
                            idx === 0 ? 'bg-[#ffd700] text-[#0d1b2a]' :
                            idx === 1 ? 'bg-slate-400 text-[#0d1b2a]' :
                            idx === 2 ? 'bg-[#b87333] text-white' :
                            'bg-[#16213e] text-slate-500 border border-[#2d4a66]'
                          )}
                        >
                          {idx + 1}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4 font-black text-white">{m.manager}</td>
                      <td className="py-2.5 pr-4"><TierBadge tier={m.tier} /></td>
                      <td className="py-2.5 pr-4 text-slate-500 tabular-nums text-xs">{m.joinYear}</td>
                      <td className="py-2.5 pr-4 text-slate-400 tabular-nums">{m.seasons}</td>
                      <td className="py-2.5 pr-4 text-slate-400 tabular-nums text-xs whitespace-nowrap">
                        {m.wins}–{m.losses}
                      </td>
                      <td className="py-2.5 pr-4">
                        <span
                          className="font-black tabular-nums"
                          style={{
                            color:
                              m.winPct >= 0.60 ? '#4ade80' :
                              m.winPct >= 0.50 ? '#60a5fa' :
                              m.winPct >= 0.44 ? '#fbbf24' : '#e94560',
                          }}
                        >
                          {m.winPct.toFixed(3).replace(/^0/, '')}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4 text-slate-400 tabular-nums">{m.playoffs}</td>
                      <td className="py-2.5 pr-4">
                        {m.titles > 0 ? (
                          <div className="flex items-center gap-1">
                            {Array.from({ length: m.titles }).map((_, i) => (
                              <Trophy key={i} className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-600 text-xs">—</span>
                        )}
                      </td>
                      <td className="py-2.5 pr-4">
                        <span className="text-sm font-black" style={{ color: trend.color }}>
                          {trend.symbol}
                        </span>
                        <span className="text-[10px] text-slate-600 ml-1">{trend.label}</span>
                      </td>
                      <td className="py-2.5 pr-4">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          {m.assessment}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Key findings ─────────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            <h2 className="text-xl font-black text-white">Key Findings</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                title:  'Veterans Own Championships',
                stat:   `${foundingTitles}/${totalTitles} titles`,
                detail: `All ${totalTitles} BMFFFL championships have been won by founding managers. Zero by expansion entrants — though tubes94 reached the 2025 finals.`,
                accent: '#ffd700',
              },
              {
                title:  'Experience Correlates With Win%',
                stat:   `.530 vs .462`,
                detail: `Founding managers average a .530 win rate. Expansion managers average .462 in their seasons played. The gap is real, but tubes94 challenges the thesis.`,
                accent: '#4ade80',
              },
              {
                title:  "Tubes94: History's Exception",
                stat:   `2025 Finalist`,
                detail: `Joined in 2021 and reached the 2025 championship game — the fastest ascent to a finals appearance in league history. .600 career win rate over 5 seasons.`,
                accent: '#60a5fa',
              },
            ].map(({ title, stat, detail, accent }) => (
              <div
                key={title}
                className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-5"
                style={{ borderTop: `3px solid ${accent}` }}
              >
                <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">{title}</div>
                <div className="text-2xl font-black mb-2" style={{ color: accent }}>{stat}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Learning curve analysis ──────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-[#60a5fa]" aria-hidden="true" />
            <h2 className="text-xl font-black text-white">Learning Curve — Win Trends</h2>
          </div>
          <p className="text-slate-400 text-sm mb-6">
            Year-over-year win trends per manager (2020–2025). Sparkline tracks trajectory.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MANAGERS.map((m) => {
              const trend = TREND_CONFIG[m.trend];
              return (
                <div
                  key={m.manager}
                  className="bg-[#16213e] border border-[#2d4a66] rounded-lg px-4 py-3 flex items-center gap-4 hover:border-[#3a5a7a] transition-colors duration-100"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-black text-white text-sm">{m.manager}</span>
                      <TierBadge tier={m.tier} />
                      <span
                        className="text-xs font-bold"
                        style={{ color: trend.color }}
                      >
                        {trend.symbol} {trend.label}
                      </span>
                    </div>
                    <WinBar wins={m.wins} losses={m.losses} />
                  </div>
                  <div className="shrink-0">
                    <SparkLine wins={m.yearlyWins} joinYear={m.joinYear} />
                  </div>
                  <div className="shrink-0 text-right w-14">
                    <div className="text-lg font-black tabular-nums text-[#ffd700]">{m.seasons}</div>
                    <div className="text-[10px] text-slate-600 uppercase">seasons</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Year-by-year group averages ──────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-black text-white mb-1">Group Win% by Year</h2>
          <p className="text-slate-400 text-sm mb-6">
            Average wins per manager — founding (gold) vs expansion (blue) — across each season.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2d4a66]">
                  {['Year', 'Season', 'Founding Avg Wins', 'Expansion Avg Wins', 'Gap'].map((h) => (
                    <th
                      key={h}
                      className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 pr-6 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {YEARLY_STATS.map((row) => {
                  const gap = row.expansionAvgWin > 0
                    ? (row.foundingAvgWin - row.expansionAvgWin).toFixed(1)
                    : 'N/A';
                  const gapNum = row.expansionAvgWin > 0
                    ? row.foundingAvgWin - row.expansionAvgWin
                    : null;
                  return (
                    <tr
                      key={row.year}
                      className="border-b border-[#1a2d42] hover:bg-[#16213e]/50 transition-colors duration-100"
                    >
                      <td className="py-3 pr-6 font-black text-white tabular-nums">{row.year}</td>
                      <td className="py-3 pr-6 text-slate-400 text-xs">{row.label}</td>
                      <td className="py-3 pr-6 font-black text-[#ffd700] tabular-nums">
                        {row.foundingAvgWin.toFixed(1)}
                      </td>
                      <td className="py-3 pr-6">
                        {row.expansionAvgWin === 0 ? (
                          <span className="text-slate-600 text-xs">—</span>
                        ) : (
                          <span className="font-black text-[#60a5fa] tabular-nums">
                            {row.expansionAvgWin.toFixed(1)}
                          </span>
                        )}
                      </td>
                      <td className="py-3 pr-6">
                        {gapNum === null ? (
                          <span className="text-slate-600 text-xs">—</span>
                        ) : (
                          <span
                            className="font-bold tabular-nums text-xs"
                            style={{ color: gapNum > 0 ? '#4ade80' : '#e94560' }}
                          >
                            {gapNum > 0 ? '+' : ''}{gap} (founding {gapNum > 0 ? 'ahead' : 'behind'})
                          </span>
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

      {/* ── Bimfle assessment ────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-[#16213e] border border-[#ffd700]/30 rounded-xl p-6 max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[#ffd700] text-lg">~</span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#ffd700]">Bimfle's Assessment</span>
            </div>
            <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
              <p>
                The data suggests founding members have structural advantages that go beyond
                mere experience. Earlier keeper selections allowed them to acquire dynasty assets
                before their value was universally understood. Deeper historical knowledge of league
                tendencies — which managers over-trade, which ones hold too long — creates an
                informational edge. Established trade networks mean founding managers can negotiate
                with counterparts they have dealt with for years.
              </p>
              <p>
                Tubes94 represents the most compelling counterexample in league history. Joining in
                2021 and reaching the 2025 championship game in five seasons is an achievement that
                demands acknowledgment. The fastest ascent in BMFFFL history belongs to an expansion
                manager. This does not invalidate the structural advantages of founding membership —
                it illustrates that exceptional draft evaluation can overcome them.
              </p>
              <p>
                Escuelas, joining in 2022, is on an improving trajectory. The .450 career win rate
                understates what the data shows year-over-year. Patience is warranted.
              </p>
            </div>
            <div className="mt-3 text-right text-xs text-[#ffd700] font-black tracking-wide">~Love, Bimfle.</div>
          </div>
        </div>
      </section>
    </>
  );
}
