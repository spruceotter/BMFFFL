import { useState } from 'react';
import Head from 'next/head';
import { Bot, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type Trend = 'up' | 'down' | 'stable';

interface TeamRanking {
  rank: number;
  team: string;
  owner: string;
  score: number;
  allTimeWinPct: number;
  allTimeRecord: string;
  recentRecord: string;
  championships: number;
  trend: Trend;
  bimfleNote: string;
  badge?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const RANKINGS: TeamRanking[] = [
  {
    rank: 1,
    team: 'MLSchools12',
    owner: 'MLSchools12',
    score: 98,
    allTimeWinPct: 0.820,
    allTimeRecord: '68-15',
    recentRecord: '23-5',
    championships: 4,
    trend: 'stable',
    bimfleNote: 'The historical record remains unambiguous.',
  },
  {
    rank: 2,
    team: 'Tubes94',
    owner: 'Tubes94',
    score: 88,
    allTimeWinPct: 0.486,
    allTimeRecord: '34-36',
    recentRecord: '21-7',
    championships: 0,
    trend: 'up',
    bimfleNote: 'A remarkable ascent. The archives note a 2-12 debut in 2021.',
    badge: '2025 Runner-Up',
  },
  {
    rank: 3,
    team: 'tdtd19844',
    owner: 'tdtd19844',
    score: 86,
    allTimeWinPct: 0.434,
    allTimeRecord: '36-47',
    recentRecord: '18-10',
    championships: 1,
    trend: 'up',
    bimfleNote: 'Reigning champion. The rebuild arc is, frankly, extraordinary.',
    badge: '2025 Champion',
  },
  {
    rank: 4,
    team: 'SexMachineAndyD',
    owner: 'SexMachineAndyD',
    score: 82,
    allTimeWinPct: 0.603,
    allTimeRecord: '50-33',
    recentRecord: '20-8',
    championships: 1,
    trend: 'stable',
    bimfleNote: '2018 ESPN champion. Consistent contender across both eras.',
  },
  {
    rank: 5,
    team: 'JuicyBussy',
    owner: 'JuicyBussy',
    score: 78,
    allTimeWinPct: 0.554,
    allTimeRecord: '46-37',
    recentRecord: '15-13',
    championships: 1,
    trend: 'stable',
    bimfleNote: 'The highest ceiling in the league. Scheduling luck is a variable.',
  },
  {
    rank: 6,
    team: 'rbr',
    owner: 'rbr',
    score: 70,
    allTimeWinPct: 0.530,
    allTimeRecord: '44-39',
    recentRecord: '13-15',
    championships: 0,
    trend: 'down',
    bimfleNote: 'Two runner-ups. The dynasty window may be closing.',
  },
  {
    rank: 7,
    team: 'Cogdeill11',
    owner: 'Cogdeill11',
    score: 64,
    allTimeWinPct: 0.458,
    allTimeRecord: '38-45',
    recentRecord: '9-19',
    championships: 1,
    trend: 'down',
    bimfleNote: 'The founding champion. The playoff drought is... noted.',
  },
  {
    rank: 8,
    team: 'Grandes',
    owner: 'Grandes',
    score: 60,
    allTimeWinPct: 0.506,
    allTimeRecord: '42-41',
    recentRecord: '11-17',
    championships: 1,
    trend: 'down',
    bimfleNote: 'I am required to note the 2025 Moodie Bowl result. The Commissioner was gracious about it.',
    badge: '2025 Moodie Bowl',
  },
  {
    rank: 9,
    team: 'eldridm20',
    owner: 'eldridm20',
    score: 58,
    allTimeWinPct: 0.470,
    allTimeRecord: '39-44',
    recentRecord: '12-16',
    championships: 0,
    trend: 'stable',
    bimfleNote: 'Three playoff appearances, one runner-up. Inconsistent but dangerous.',
  },
  {
    rank: 10,
    team: 'eldridsm',
    owner: 'eldridsm',
    score: 54,
    allTimeWinPct: 0.494,
    allTimeRecord: '41-42',
    recentRecord: '9-19',
    championships: 0,
    trend: 'down',
    bimfleNote: '2020 runner-up. Recent form has been less distinguished.',
  },
  {
    rank: 11,
    team: 'Cmaleski',
    owner: 'Cmaleski',
    score: 50,
    allTimeWinPct: 0.434,
    allTimeRecord: '36-47',
    recentRecord: '10-18',
    championships: 0,
    trend: 'up',
    bimfleNote: '1,990 points in 2025 with a 6-8 record. The data is curious.',
  },
  {
    rank: 12,
    team: 'Escuelas',
    owner: 'Escuelas',
    score: 30,
    allTimeWinPct: 0.268,
    allTimeRecord: '15-41',
    recentRecord: '9-19',
    championships: 0,
    trend: 'up',
    bimfleNote: 'Progress is being made. Slowly. With dignity.',
  },
];

// ─── Score Bar ────────────────────────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 70 ? '#22c55e' :
    score >= 50 ? '#f59e0b' :
    '#e94560';

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-[#0d1b2a] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${score}%`, backgroundColor: color }}
          aria-hidden="true"
        />
      </div>
      <span
        className="text-sm font-black tabular-nums w-12 text-right"
        style={{ color }}
      >
        {score}/100
      </span>
    </div>
  );
}

// ─── Trend Icon ───────────────────────────────────────────────────────────────

function TrendIcon({ trend }: { trend: Trend }) {
  if (trend === 'up') {
    return <TrendingUp className="w-4 h-4 text-emerald-400" aria-label="Trending up" />;
  }
  if (trend === 'down') {
    return <TrendingDown className="w-4 h-4 text-[#e94560]" aria-label="Trending down" />;
  }
  return <Minus className="w-4 h-4 text-slate-400" aria-label="Stable" />;
}

// ─── Ranking Card ─────────────────────────────────────────────────────────────

function RankingCard({ team }: { team: TeamRanking }) {
  const isTop3 = team.rank <= 3;
  const rankColor =
    team.rank === 1 ? '#ffd700' :
    team.rank === 2 ? '#94a3b8' :
    team.rank === 3 ? '#cd7f32' :
    '#475569';

  return (
    <div
      className={cn(
        'rounded-xl border bg-[#16213e] p-4 sm:p-5 transition-all duration-150 hover:border-[#3d5a76]',
        isTop3 ? 'border-[#ffd700]/30' : 'border-[#2d4a66]'
      )}
    >
      <div className="flex items-start gap-4">
        {/* Rank number */}
        <div className="shrink-0 flex flex-col items-center justify-center w-12">
          <span
            className="text-3xl sm:text-4xl font-black tabular-nums leading-none"
            style={{ color: rankColor }}
            aria-label={`Rank ${team.rank}`}
          >
            {team.rank}
          </span>
          {isTop3 && (
            <span className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: rankColor }}>
              {team.rank === 1 ? 'Best' : team.rank === 2 ? '2nd' : '3rd'}
            </span>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-white font-bold text-base sm:text-lg leading-tight">{team.team}</h3>
            <TrendIcon trend={team.trend} />
            {team.badge && (
              <span className={cn(
                'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border',
                team.badge.includes('Champion')
                  ? 'bg-[#ffd700]/15 text-[#ffd700] border-[#ffd700]/30'
                  : team.badge.includes('Runner')
                  ? 'bg-slate-500/15 text-slate-300 border-slate-500/30'
                  : 'bg-[#e94560]/15 text-[#e94560] border-[#e94560]/30'
              )}>
                {team.badge}
              </span>
            )}
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 mb-3">
            <span>All-time: <span className="text-slate-200 font-semibold">{team.allTimeRecord}</span> <span className="text-slate-500">({(team.allTimeWinPct * 100).toFixed(1)}%)</span></span>
            <span>2024–25: <span className="text-slate-200 font-semibold">{team.recentRecord}</span></span>
            {team.championships > 0 && (
              <span>
                {team.championships === 1 ? '1 championship' : `${team.championships} championships`}
                <span className="ml-1 text-[#ffd700]">{'★'.repeat(team.championships)}</span>
              </span>
            )}
          </div>

          {/* Score bar */}
          <ScoreBar score={team.score} />

          {/* Bimfle commentary */}
          <p className="mt-3 text-xs text-slate-400 italic leading-relaxed border-l-2 border-[#2d4a66] pl-3">
            &ldquo;{team.bimfleNote}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Methodology Section ──────────────────────────────────────────────────────

function MethodologySection() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors duration-150"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-slate-300">Methodology & Formula</span>
        {open
          ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
          : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
        }
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-3 text-sm text-slate-400 border-t border-[#2d4a66]">
          <p className="pt-4 font-mono text-xs bg-[#0d1b2a] rounded-lg p-4 text-emerald-400 leading-relaxed">
            Dynasty Score = (All-time Win% × 30) + (Recent Form Score × 40) + (Championship Bonus × 20) + (Playoff Streak × 10)
          </p>
          <ul className="space-y-1.5 text-xs">
            <li><span className="text-slate-300 font-semibold">All-time Win% (30%):</span> Normalized win percentage across all league seasons.</li>
            <li><span className="text-slate-300 font-semibold">Recent Form (40%):</span> 2024–2025 record, reflecting current dynasty trajectory.</li>
            <li><span className="text-slate-300 font-semibold">Championships (20%):</span> Bonus points per title. Championships are the point of the enterprise.</li>
            <li><span className="text-slate-300 font-semibold">Playoff Streak (10%):</span> Consecutive playoff appearances; a measure of sustained relevance.</li>
          </ul>
          <p className="text-xs text-slate-500 italic border-t border-[#2d4a66] pt-3">
            These rankings are, per my earlier statement, unofficial and provisional. The Commissioner has been informed.
            <br />
            — Bimfle, League Commissioner Assistant
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PowerRankingsPage() {
  return (
    <>
      <Head>
        <title>Power Rankings — BMFFFL Analytics</title>
        <meta
          name="description"
          content="Bimfle's provisional dynasty power rankings for the BMFFFL. The official calculations remain forthcoming."
        />
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Page header */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <Bot className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            Power Rankings
          </h1>
          <p className="text-slate-400 text-lg">
            Provisional Dynasty Assessment &mdash; As Compiled by Bimfle
          </p>
        </header>

        {/* Bimfle apology card */}
        <section className="mb-10" aria-label="Statement from Bimfle">
          <div className="rounded-xl border border-[#ffd700]/40 bg-[#16213e] p-6 sm:p-8">
            <div className="flex items-start gap-4">
              {/* Bot icon in gold circle */}
              <div className="shrink-0 w-12 h-12 rounded-full bg-[#ffd700]/15 border border-[#ffd700]/40 flex items-center justify-center">
                <Bot className="w-6 h-6 text-[#ffd700]" aria-hidden="true" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[#ffd700] font-bold text-sm">Bimfle</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#ffd700]/60 border border-[#ffd700]/30 rounded px-1.5 py-0.5">
                    AI Commissioner Assistant
                  </span>
                </div>

                <div className="space-y-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                  <p>
                    I must confess, with considerable professional embarrassment, that I have yet to complete
                    the power rankings. This item has appeared on my agenda since the league&rsquo;s founding.
                    I assure you, the calculations are forthcoming. I have been&hellip; occupied with other
                    archival duties.
                  </p>
                  <p>
                    In the interim, I have prepared the following provisional assessment based on available
                    roster and performance data. I present it with the caveat that these rankings remain,
                    in the most formal sense, unofficial.
                  </p>
                  <p className="text-slate-400 italic">
                    ~Love, Bimfle.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rankings list */}
        <section aria-label="Dynasty Power Rankings" className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Dynasty Power Index</h2>
            <span className="text-xs text-slate-500 italic">March 2026 &bull; Provisional</span>
          </div>

          <div className="space-y-3">
            {RANKINGS.map(team => (
              <RankingCard key={team.team} team={team} />
            ))}
          </div>
        </section>

        {/* Methodology */}
        <section aria-label="Methodology">
          <MethodologySection />
        </section>

        {/* Footer note */}
        <p className="mt-6 text-xs text-slate-600 leading-relaxed">
          Rankings are unofficial, provisional, and represent a composite dynasty power score based on
          historical performance data. Official power rankings have been pending since the league&rsquo;s
          founding and remain, regrettably, forthcoming.
        </p>

      </div>
    </>
  );
}
