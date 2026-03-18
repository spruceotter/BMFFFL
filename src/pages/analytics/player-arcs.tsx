import { useState } from 'react';
import Head from 'next/head';
import { TrendingUp, TrendingDown, Zap, Clock } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type Position = 'QB' | 'RB' | 'WR' | 'TE';
type ArcPhase = 'RISING' | 'PEAK' | 'DECLINING' | 'PROJECTED';

interface SeasonValue {
  year: number;
  value: number;
  projected?: boolean;
}

interface PlayerArc {
  name: string;
  position: Position;
  currentValue: number;
  age: number;
  seasons: SeasonValue[];
  phase: ArcPhase;
  peakYear: number;
  peakValue: number;
  note?: string;
}

// ─── Player Arc Data ──────────────────────────────────────────────────────────

const PLAYER_ARCS: PlayerArc[] = [
  // ── Running Backs ──────────────────────────────────────────────────────────
  {
    name: 'Bijan Robinson',
    position: 'RB',
    currentValue: 9400,
    age: 23,
    phase: 'RISING',
    peakYear: 2026,
    peakValue: 9600,
    note: 'Age-23 ascending star. Peak window 2026–2027. Dynasty cornerstone.',
    seasons: [
      { year: 2023, value: 6200 },
      { year: 2024, value: 8800 },
      { year: 2025, value: 9400 },
      { year: 2026, value: 9600, projected: true },
      { year: 2027, value: 8800, projected: true },
      { year: 2028, value: 7200, projected: true },
    ],
  },
  {
    name: 'Derrick Henry',
    position: 'RB',
    currentValue: 5600,
    age: 31,
    phase: 'DECLINING',
    peakYear: 2019,
    peakValue: 8600,
    note: '2024 Baltimore resurgence defied the aging curve. The exception, not the rule.',
    seasons: [
      { year: 2016, value: 3400 },
      { year: 2017, value: 5200 },
      { year: 2018, value: 7400 },
      { year: 2019, value: 8600 },
      { year: 2020, value: 8200 },
      { year: 2021, value: 6800 },
      { year: 2022, value: 5200 },
      { year: 2023, value: 4400 },
      { year: 2024, value: 6800 },
      { year: 2025, value: 5600 },
    ],
  },
  {
    name: 'Alvin Kamara',
    position: 'RB',
    currentValue: 3800,
    age: 30,
    phase: 'DECLINING',
    peakYear: 2020,
    peakValue: 8600,
    note: 'Classic RB aging arc. Peaked at 25, steady decline thereafter.',
    seasons: [
      { year: 2017, value: 5800 },
      { year: 2018, value: 8200 },
      { year: 2019, value: 7400 },
      { year: 2020, value: 8600 },
      { year: 2021, value: 7200 },
      { year: 2022, value: 6400 },
      { year: 2023, value: 5200 },
      { year: 2024, value: 4600 },
      { year: 2025, value: 3800 },
    ],
  },
  // ── Wide Receivers ─────────────────────────────────────────────────────────
  {
    name: 'Justin Jefferson',
    position: 'WR',
    currentValue: 9600,
    age: 26,
    phase: 'PEAK',
    peakYear: 2023,
    peakValue: 9600,
    note: 'Sustained peak production across three straight seasons. WR1 in dynasty.',
    seasons: [
      { year: 2020, value: 5200 },
      { year: 2021, value: 8400 },
      { year: 2022, value: 9200 },
      { year: 2023, value: 9600 },
      { year: 2024, value: 9600 },
      { year: 2025, value: 9600 },
      { year: 2026, value: 9400, projected: true },
      { year: 2027, value: 8800, projected: true },
    ],
  },
  {
    name: 'Davante Adams',
    position: 'WR',
    currentValue: 4800,
    age: 33,
    phase: 'DECLINING',
    peakYear: 2018,
    peakValue: 9200,
    note: 'Long prime (2018–2021) but now in sharp decline. Classic WR arc.',
    seasons: [
      { year: 2014, value: 2400 },
      { year: 2015, value: 3800 },
      { year: 2016, value: 5400 },
      { year: 2017, value: 7200 },
      { year: 2018, value: 9200 },
      { year: 2019, value: 8400 },
      { year: 2020, value: 8800 },
      { year: 2021, value: 8800 },
      { year: 2022, value: 7200 },
      { year: 2023, value: 6400 },
      { year: 2024, value: 5600 },
      { year: 2025, value: 4800 },
    ],
  },
  {
    name: 'Tyreek Hill',
    position: 'WR',
    currentValue: 6400,
    age: 31,
    phase: 'DECLINING',
    peakYear: 2022,
    peakValue: 9200,
    note: 'Speed-based WR aging faster than route-runners. Miami peak era was elite.',
    seasons: [
      { year: 2016, value: 4200 },
      { year: 2017, value: 6800 },
      { year: 2018, value: 7600 },
      { year: 2019, value: 8400 },
      { year: 2020, value: 8600 },
      { year: 2021, value: 8800 },
      { year: 2022, value: 9200 },
      { year: 2023, value: 8400 },
      { year: 2024, value: 7200 },
      { year: 2025, value: 6400 },
    ],
  },
  // ── Tight Ends ─────────────────────────────────────────────────────────────
  {
    name: 'Travis Kelce',
    position: 'TE',
    currentValue: 5800,
    age: 36,
    phase: 'DECLINING',
    peakYear: 2019,
    peakValue: 9400,
    note: 'Greatest TE dynasty arc in history. Peak window lasted 2017–2022.',
    seasons: [
      { year: 2013, value: 2800 },
      { year: 2014, value: 4400 },
      { year: 2015, value: 5600 },
      { year: 2016, value: 7200 },
      { year: 2017, value: 8400 },
      { year: 2018, value: 9200 },
      { year: 2019, value: 9400 },
      { year: 2020, value: 9200 },
      { year: 2021, value: 9400 },
      { year: 2022, value: 9000 },
      { year: 2023, value: 8400 },
      { year: 2024, value: 7200 },
      { year: 2025, value: 5800 },
    ],
  },
  {
    name: 'Brock Bowers',
    position: 'TE',
    currentValue: 9200,
    age: 22,
    phase: 'RISING',
    peakYear: 2027,
    peakValue: 9600,
    note: 'Generational TE prospect. Early production suggests a Kelce-tier arc.',
    seasons: [
      { year: 2024, value: 7800 },
      { year: 2025, value: 9200 },
      { year: 2026, value: 9400, projected: true },
      { year: 2027, value: 9600, projected: true },
      { year: 2028, value: 9200, projected: true },
    ],
  },
  // ── Quarterbacks ───────────────────────────────────────────────────────────
  {
    name: 'Lamar Jackson',
    position: 'QB',
    currentValue: 9200,
    age: 28,
    phase: 'PEAK',
    peakYear: 2024,
    peakValue: 9400,
    note: 'Elite dual-threat QB at peak. Dynasty QB1 heading into age-29 window.',
    seasons: [
      { year: 2018, value: 4200 },
      { year: 2019, value: 7600 },
      { year: 2020, value: 8200 },
      { year: 2021, value: 8400 },
      { year: 2022, value: 7800 },
      { year: 2023, value: 8800 },
      { year: 2024, value: 9400 },
      { year: 2025, value: 9200 },
      { year: 2026, value: 9000, projected: true },
    ],
  },
  {
    name: 'Josh Allen',
    position: 'QB',
    currentValue: 9100,
    age: 29,
    phase: 'PEAK',
    peakYear: 2023,
    peakValue: 9200,
    note: 'Consistent elite QB. Remarkably flat peak arc suggests sustained value.',
    seasons: [
      { year: 2018, value: 3800 },
      { year: 2019, value: 5600 },
      { year: 2020, value: 7800 },
      { year: 2021, value: 9000 },
      { year: 2022, value: 8800 },
      { year: 2023, value: 9200 },
      { year: 2024, value: 9100 },
      { year: 2025, value: 9100 },
    ],
  },
];

// ─── Position aging windows ───────────────────────────────────────────────────

const POSITION_PEAKS = [
  {
    position: 'QB' as Position,
    peakWindow: '27–32',
    declineStart: 33,
    color: 'text-sky-400',
    borderColor: 'border-sky-500/30',
    bgColor: 'bg-sky-500/5',
    description: 'Longest arc in football. QBs hit their peak later and hold it longer. Dynasty QBs remain elite into their early 30s.',
  },
  {
    position: 'RB' as Position,
    peakWindow: '23–25',
    declineStart: 27,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500/5',
    description: 'Shortest window of any skill position. RBs decline sharply at 27-28. Buy young, sell at peak — no exceptions.',
  },
  {
    position: 'WR' as Position,
    peakWindow: '24–28',
    declineStart: 29,
    color: 'text-[#ffd700]',
    borderColor: 'border-[#ffd700]/30',
    bgColor: 'bg-[#ffd700]/5',
    description: 'Medium-length arc. Route runners age better than speed merchants. Sell window is 28-29, not 26-27 like RBs.',
  },
  {
    position: 'TE' as Position,
    peakWindow: '25–29',
    declineStart: 30,
    color: 'text-violet-400',
    borderColor: 'border-violet-500/30',
    bgColor: 'bg-violet-500/5',
    description: 'TE development is slow — most top TEs hit their prime in year 3-4. The decline is also the most gradual of any position.',
  },
];

// ─── Pattern cards data ───────────────────────────────────────────────────────

const ARC_PATTERNS = [
  {
    title: 'The Ascent',
    icon: TrendingUp,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500/5',
    examples: ['Bijan Robinson', 'Brock Bowers'],
    description: 'Young rising player entering their prime window. Dynasty value climbing steeply. Buy aggressively — you are acquiring peak seasons at a discount.',
    signal: 'BUY NOW',
    signalColor: 'text-emerald-400',
  },
  {
    title: 'The Dynasty Peak',
    icon: Zap,
    color: 'text-[#ffd700]',
    borderColor: 'border-[#ffd700]/30',
    bgColor: 'bg-[#ffd700]/5',
    examples: ['Justin Jefferson', 'Lamar Jackson', 'Josh Allen'],
    description: 'Established star at maximum dynasty value. Production is elite and consistent. Hold tightly — this is what you built your roster around.',
    signal: 'HOLD FIRMLY',
    signalColor: 'text-[#ffd700]',
  },
  {
    title: 'The Graceful Decline',
    icon: TrendingDown,
    color: 'text-[#e94560]',
    borderColor: 'border-[#e94560]/30',
    bgColor: 'bg-[#e94560]/5',
    examples: ['Davante Adams', 'Alvin Kamara', 'Travis Kelce'],
    description: 'Aging veteran past their peak. Production remains decent but dynasty value is eroding season by season. The sell window has passed for most; extract what you can.',
    signal: 'SELL / CUT',
    signalColor: 'text-[#e94560]',
  },
  {
    title: 'The Second Wind',
    icon: Clock,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    bgColor: 'bg-amber-500/5',
    examples: ['Derrick Henry (2024)'],
    description: 'The rare aging-curve exception. An older player defies expectations with a late-career resurgence. Context-specific: Henry\'s 2024 was historic. Do not build a dynasty strategy around it.',
    signal: 'SELL INTO BUZZ',
    signalColor: 'text-amber-400',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MAX_VALUE = 10000;

function phaseBadgeStyle(phase: ArcPhase): string {
  switch (phase) {
    case 'RISING':    return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    case 'PEAK':      return 'bg-[#ffd700]/15 text-[#ffd700] border-[#ffd700]/30';
    case 'DECLINING': return 'bg-[#e94560]/15 text-[#e94560] border-[#e94560]/30';
    case 'PROJECTED': return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
  }
}

function positionColor(pos: Position): string {
  switch (pos) {
    case 'QB': return 'text-sky-400';
    case 'RB': return 'text-emerald-400';
    case 'WR': return 'text-[#ffd700]';
    case 'TE': return 'text-violet-400';
  }
}

function positionBg(pos: Position): string {
  switch (pos) {
    case 'QB': return 'bg-sky-500/15 border-sky-500/30';
    case 'RB': return 'bg-emerald-500/15 border-emerald-500/30';
    case 'WR': return 'bg-[#ffd700]/15 border-[#ffd700]/30';
    case 'TE': return 'bg-violet-500/15 border-violet-500/30';
  }
}

function barColor(season: SeasonValue, phase: ArcPhase): string {
  if (season.projected) return 'bg-sky-500/50';
  switch (phase) {
    case 'RISING':    return 'bg-emerald-500';
    case 'PEAK':      return 'bg-[#ffd700]';
    case 'DECLINING': return 'bg-[#e94560]';
    case 'PROJECTED': return 'bg-sky-500';
  }
}

function yearsSincePeak(player: PlayerArc): number {
  return 2025 - player.peakYear;
}

// ─── Arc Chart component ──────────────────────────────────────────────────────

function ArcChart({ player }: { player: PlayerArc }) {
  const maxVal = Math.max(...player.seasons.map(s => s.value));
  // Normalize bar heights to maxVal for visual clarity
  return (
    <div className="flex items-end gap-1 h-16" aria-label={`Career arc chart for ${player.name}`}>
      {player.seasons.map((season) => {
        const heightPct = Math.round((season.value / MAX_VALUE) * 100);
        const isPeak = season.value === maxVal && !season.projected;
        return (
          <div key={season.year} className="flex flex-col items-center gap-0.5 flex-1 min-w-0">
            <div className="w-full flex flex-col justify-end" style={{ height: '52px' }}>
              <div
                className={cn(
                  'w-full rounded-t-sm transition-all',
                  barColor(season, player.phase),
                  isPeak && 'ring-1 ring-white/30'
                )}
                style={{ height: `${heightPct}%` }}
                aria-hidden="true"
                title={`${season.year}: ${season.value.toLocaleString()}${season.projected ? ' (projected)' : ''}`}
              />
            </div>
            <span className="text-[8px] text-slate-600 tabular-nums leading-none">
              {String(season.year).slice(2)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PlayerArcsPage() {
  const [activePos, setActivePos] = useState<Position>('RB');

  const visiblePlayers = PLAYER_ARCS.filter(p => p.position === activePos);
  const positionPeak = POSITION_PEAKS.find(p => p.position === activePos)!;

  return (
    <>
      <Head>
        <title>Player Career Arcs — BMFFFL Analytics</title>
        <meta
          name="description"
          content="Dynasty value trajectories for key players — peak, decline, and projection by position. The career arc is the dynasty manager's most critical analytical framework."
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
            Player Career Arcs
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Dynasty value trajectories — peak, decline, and projection
          </p>
        </header>

        {/* Position filter tabs */}
        <div className="flex gap-2 flex-wrap mb-8" role="group" aria-label="Filter by position">
          {(['QB', 'RB', 'WR', 'TE'] as const).map(pos => (
            <button
              key={pos}
              onClick={() => setActivePos(pos)}
              aria-pressed={activePos === pos}
              className={cn(
                'px-5 py-2.5 rounded-lg text-sm font-bold border transition-all duration-150',
                activePos === pos
                  ? pos === 'QB' ? 'bg-sky-500 text-white border-sky-500'
                    : pos === 'RB' ? 'bg-emerald-500 text-white border-emerald-500'
                    : pos === 'WR' ? 'bg-[#ffd700] text-[#0d1b2a] border-[#ffd700]'
                    : 'bg-violet-500 text-white border-violet-500'
                  : 'bg-[#16213e] text-slate-400 border-[#2d4a66] hover:border-[#ffd700]/40 hover:text-white'
              )}
            >
              {pos}
            </button>
          ))}
        </div>

        {/* Position context banner */}
        <div className={cn(
          'rounded-xl border p-4 mb-8 flex flex-col sm:flex-row sm:items-center gap-3',
          positionPeak.borderColor,
          positionPeak.bgColor
        )}>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={cn('text-xs font-bold uppercase tracking-widest', positionPeak.color)}>
                {positionPeak.position}
              </span>
              <span className="text-[10px] text-slate-500">&bull;</span>
              <span className="text-xs text-slate-400 font-semibold">
                Peak window: Age {positionPeak.peakWindow}
              </span>
              <span className="text-[10px] text-slate-500">&bull;</span>
              <span className="text-xs text-slate-400">
                Decline typically begins age {positionPeak.declineStart}
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{positionPeak.description}</p>
          </div>
        </div>

        {/* Player arc cards */}
        <section className="mb-12" aria-labelledby="arcs-heading">
          <h2 id="arcs-heading" className="text-lg font-bold text-white mb-5">
            {activePos} Career Arc Visualizations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {visiblePlayers.map(player => {
              const sinceP = yearsSincePeak(player);
              const hasSinceFlag = player.phase === 'DECLINING' && sinceP > 0;
              return (
                <div
                  key={player.name}
                  className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5"
                >
                  {/* Player header row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-black text-white leading-tight">{player.name}</h3>
                        <span className={cn(
                          'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border',
                          positionBg(player.position),
                          positionColor(player.position)
                        )}>
                          {player.position}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs text-slate-500 font-mono">Age {player.age}</span>
                        <span className="text-[10px] text-slate-600">&bull;</span>
                        <span className="text-xs text-[#ffd700] font-bold tabular-nums">
                          {player.currentValue.toLocaleString()} dynasty pts
                        </span>
                      </div>
                    </div>
                    <span className={cn(
                      'inline-flex items-center justify-center px-2.5 py-1 rounded text-[10px] font-bold border shrink-0 tracking-wider',
                      phaseBadgeStyle(player.phase)
                    )}>
                      {player.phase}
                    </span>
                  </div>

                  {/* Arc chart */}
                  <div className="mb-3 bg-[#0d1b2a] rounded-lg p-3 border border-[#2d4a66]/40">
                    <ArcChart player={player} />
                  </div>

                  {/* Meta row */}
                  <div className="flex flex-wrap gap-3 mb-3">
                    {/* Peak callout */}
                    <div className="flex-1 min-w-0 rounded-lg bg-[#0d1b2a] border border-[#2d4a66]/40 px-3 py-2">
                      <p className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold mb-0.5">Peak Year</p>
                      <p className="text-sm font-bold text-white">
                        {player.peakYear}
                        <span className="text-xs font-normal text-slate-500 ml-1">
                          ({player.peakValue.toLocaleString()})
                        </span>
                      </p>
                    </div>

                    {/* Since peak or projected peak */}
                    {hasSinceFlag ? (
                      <div className="flex-1 min-w-0 rounded-lg bg-[#e94560]/5 border border-[#e94560]/20 px-3 py-2">
                        <p className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold mb-0.5">Since Peak</p>
                        <p className="text-sm font-bold text-[#e94560]">
                          {sinceP} yr{sinceP !== 1 ? 's' : ''} ago
                        </p>
                      </div>
                    ) : player.phase === 'RISING' ? (
                      <div className="flex-1 min-w-0 rounded-lg bg-emerald-500/5 border border-emerald-500/20 px-3 py-2">
                        <p className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold mb-0.5">Projected Peak</p>
                        <p className="text-sm font-bold text-emerald-400">
                          {player.peakYear}
                          <span className="text-xs font-normal text-slate-500 ml-1">
                            ({player.peakValue.toLocaleString()})
                          </span>
                        </p>
                      </div>
                    ) : (
                      <div className="flex-1 min-w-0 rounded-lg bg-[#ffd700]/5 border border-[#ffd700]/20 px-3 py-2">
                        <p className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold mb-0.5">Status</p>
                        <p className="text-sm font-bold text-[#ffd700]">Active Peak</p>
                      </div>
                    )}
                  </div>

                  {/* Projected seasons (if any) */}
                  {player.seasons.some(s => s.projected) && (
                    <div className="mb-3 rounded-lg bg-sky-500/5 border border-sky-500/20 px-3 py-2">
                      <p className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold mb-1">Projected</p>
                      <div className="flex flex-wrap gap-2">
                        {player.seasons.filter(s => s.projected).map(s => (
                          <span key={s.year} className="text-xs text-sky-400 font-mono tabular-nums">
                            {s.year}: <span className="font-bold">{s.value.toLocaleString()}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Note */}
                  {player.note && (
                    <p className="text-[11px] text-slate-500 leading-relaxed">{player.note}</p>
                  )}

                  {/* Chart legend */}
                  <div className="mt-3 pt-3 border-t border-[#2d4a66]/40 flex gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className={cn(
                        'w-2.5 h-2.5 rounded-sm shrink-0',
                        player.phase === 'RISING' ? 'bg-emerald-500' :
                        player.phase === 'PEAK' ? 'bg-[#ffd700]' :
                        'bg-[#e94560]'
                      )} aria-hidden="true" />
                      <span className="text-[10px] text-slate-600">Actual</span>
                    </div>
                    {player.seasons.some(s => s.projected) && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-sm shrink-0 bg-sky-500/50" aria-hidden="true" />
                        <span className="text-[10px] text-slate-600">Projected</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Position Aging Curves summary */}
        <section className="mb-12" aria-labelledby="aging-curves-heading">
          <h2 id="aging-curves-heading" className="text-lg font-bold text-white mb-2">
            Position Aging Curves
          </h2>
          <p className="text-sm text-slate-500 mb-5">Typical peak age windows per position — the foundation of dynasty roster construction</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {POSITION_PEAKS.map(pos => (
              <div
                key={pos.position}
                className={cn('rounded-xl border p-4', pos.borderColor, pos.bgColor)}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={cn('text-2xl font-black', pos.color)}>{pos.position}</span>
                  <span className="text-xs font-mono text-slate-500 bg-[#0d1b2a] px-2 py-0.5 rounded border border-[#2d4a66]/40">
                    Peak: {pos.peakWindow}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold">Decline starts</span>
                  <p className="text-sm font-bold text-white">Age {pos.declineStart}</p>
                </div>
                {/* Visual peak bar */}
                <div className="h-2 bg-[#0d1b2a] rounded-full overflow-hidden border border-[#2d4a66]/30 mb-3">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      pos.position === 'QB' ? 'bg-sky-500' :
                      pos.position === 'RB' ? 'bg-emerald-500' :
                      pos.position === 'WR' ? 'bg-[#ffd700]' : 'bg-violet-500'
                    )}
                    style={{
                      // Normalize relative window length visually: QB=6yr, WR=5yr, TE=5yr, RB=3yr
                      width: pos.position === 'QB' ? '92%' : pos.position === 'WR' || pos.position === 'TE' ? '78%' : '52%'
                    }}
                    aria-hidden="true"
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{pos.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Career arc pattern cards */}
        <section className="mb-12" aria-labelledby="patterns-heading">
          <h2 id="patterns-heading" className="text-lg font-bold text-white mb-2">
            Career Arc Patterns
          </h2>
          <p className="text-sm text-slate-500 mb-5">The four fundamental career trajectories in dynasty fantasy football</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ARC_PATTERNS.map(pattern => {
              const Icon = pattern.icon;
              return (
                <div
                  key={pattern.title}
                  className={cn('rounded-xl border p-5', pattern.borderColor, pattern.bgColor)}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border',
                      pattern.borderColor,
                      pattern.bgColor
                    )}>
                      <Icon className={cn('w-4 h-4', pattern.color)} aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <h3 className="text-sm font-black text-white leading-tight">{pattern.title}</h3>
                        <span className={cn('text-[10px] font-bold uppercase tracking-wider', pattern.signalColor)}>
                          {pattern.signal}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {pattern.examples.map(ex => (
                          <span key={ex} className="text-[10px] text-slate-500 bg-[#0d1b2a] border border-[#2d4a66]/40 px-1.5 py-0.5 rounded font-mono">
                            {ex}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{pattern.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bimfle note */}
        <div className="rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/5 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="w-1.5 self-stretch rounded-full bg-[#ffd700]/50 shrink-0" aria-hidden="true" />
            <blockquote className="flex-1">
              <p className="text-sm text-slate-300 leading-relaxed italic">
                "The career arc is the dynasty manager's most critical analytical framework. One acquires players on the ascent and sells them at the peak. Those who hold through the decline are sentenced to mediocrity."
              </p>
              <footer className="mt-2 text-xs font-semibold text-[#ffd700]">~Love, Bimfle</footer>
            </blockquote>
          </div>
        </div>

      </div>
    </>
  );
}
