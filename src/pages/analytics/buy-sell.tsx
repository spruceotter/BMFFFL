import Head from 'next/head';
import { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, Filter } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Data ────────────────────────────────────────────────────────────────────

type Recommendation = 'buy' | 'sell' | 'hold';
type Position = 'QB' | 'RB' | 'WR' | 'TE';

interface PlayerRec {
  player:     string;
  position:   Position;
  nflTeam:    string;
  age:        number;
  bmfff1Owner: string;
  rec:        Recommendation;
  confidence: 1 | 2 | 3;  // 1=low, 2=medium, 3=high
  reason:     string;
  horizon:    '2026' | '2027-28' | 'Long term';
}

const RECOMMENDATIONS: PlayerRec[] = [
  // BUY
  {
    player: 'Bijan Robinson',      position: 'RB', nflTeam: 'ATL', age: 24, bmfff1Owner: 'Tubes94',
    rec: 'buy', confidence: 3,
    reason: 'Age 24 with workhorse role. Three years of dynasty prime runway. Atlanta\'s offense trending up.',
    horizon: '2027-28',
  },
  {
    player: 'Breece Hall',         position: 'RB', nflTeam: 'NYJ', age: 24, bmfff1Owner: 'Tubes94',
    rec: 'buy', confidence: 3,
    reason: 'Best receiving back in dynasty. Age 24 in his prime. NYJ offensive investment should improve.',
    horizon: '2027-28',
  },
  {
    player: 'Trevor Lawrence',     position: 'QB', nflTeam: 'JAX', age: 26, bmfff1Owner: 'Tubes94',
    rec: 'buy', confidence: 2,
    reason: 'Elite arm talent with a team investing in his supporting cast. Age 26 = Superflex prime.',
    horizon: '2027-28',
  },
  {
    player: 'Jordan Addison',      position: 'WR', nflTeam: 'MIN', age: 24, bmfff1Owner: 'MLSchools12',
    rec: 'buy', confidence: 2,
    reason: 'Young WR2 in a pass-happy offense with Kyler Murray (MIN). Could break out as a WR1 by 2027.',
    horizon: '2027-28',
  },
  {
    player: 'Bucky Irving',        position: 'RB', nflTeam: 'TB',  age: 23, bmfff1Owner: 'MLSchools12',
    rec: 'buy', confidence: 3,
    reason: 'Age 23 workhorse in Tampa Bay\'s run-first scheme. Extreme dynasty value at his age.',
    horizon: 'Long term',
  },
  {
    player: 'Ricky Pearsall',      position: 'WR', nflTeam: 'SF',  age: 25, bmfff1Owner: 'MLSchools12',
    rec: 'buy', confidence: 2,
    reason: 'Will inherit SF WR1 role as Deebo ages out. Already showing WR1 flashes in a great system.',
    horizon: '2027-28',
  },
  // SELL
  {
    player: 'Christian McCaffrey', position: 'RB', nflTeam: 'SF',  age: 29, bmfff1Owner: 'MLSchools12',
    rec: 'sell', confidence: 3,
    reason: 'Age 29 RB entering the back half of his dynasty window. Still elite now, but decline is imminent. Sell at peak value.',
    horizon: '2026',
  },
  {
    player: 'Josh Jacobs',         position: 'RB', nflTeam: 'GB',  age: 28, bmfff1Owner: 'MLSchools12',
    rec: 'sell', confidence: 3,
    reason: 'Age 28 RB with significant mileage. 2026 is likely his last high-value dynasty season. Trade now.',
    horizon: '2026',
  },
  {
    player: 'Davante Adams',       position: 'WR', nflTeam: 'LAR', age: 33, bmfff1Owner: 'MLSchools12',
    rec: 'sell', confidence: 3,
    reason: 'Age 33 WR. Final year of real fantasy relevance. Get what you can in the offseason.',
    horizon: '2026',
  },
  {
    player: 'Hunter Henry',        position: 'TE', nflTeam: 'NE',  age: 31, bmfff1Owner: 'MLSchools12',
    rec: 'sell', confidence: 2,
    reason: 'Aging TE in a weak offense. Replace with 2026 rookie TE (Sadiq or Stowers). Minimal return value.',
    horizon: '2026',
  },
  {
    player: 'George Kittle',       position: 'TE', nflTeam: 'SF',  age: 32, bmfff1Owner: 'MLSchools12',
    rec: 'sell', confidence: 2,
    reason: 'Age 32 TE declining into retirement territory. Elite 2026 TE class makes replacement affordable.',
    horizon: '2026',
  },
  {
    player: 'Deebo Samuel',        position: 'WR', nflTeam: 'FA',  age: 30, bmfff1Owner: 'MLSchools12',
    rec: 'sell', confidence: 3,
    reason: 'Unsigned FA at age 30 with injury history. Dynasty value near zero regardless of where he lands.',
    horizon: '2026',
  },
  // HOLD
  {
    player: 'Jaylen Waddle',       position: 'WR', nflTeam: 'MIA', age: 27, bmfff1Owner: 'MLSchools12',
    rec: 'hold', confidence: 2,
    reason: 'Age 27 with another 2-3 prime years. Miami offense volatile but Waddle\'s talent is real. Monitor Tua health.',
    horizon: '2027-28',
  },
  {
    player: 'Lamar Jackson',       position: 'QB', nflTeam: 'BAL', age: 29, bmfff1Owner: 'MLSchools12',
    rec: 'hold', confidence: 3,
    reason: 'Best QB in fantasy. Age 29 but QBs age slower in dynasty Superflex. 3-4 more elite years.',
    horizon: '2027-28',
  },
  {
    player: 'Kyler Murray',        position: 'QB', nflTeam: 'MIN', age: 28, bmfff1Owner: 'MLSchools12',
    rec: 'hold', confidence: 2,
    reason: 'New landing spot (MIN) is a potential upgrade. SF2 value still strong at age 28.',
    horizon: '2027-28',
  },
  {
    player: 'CeeDee Lamb',         position: 'WR', nflTeam: 'DAL', age: 26, bmfff1Owner: 'MLSchools12',
    rec: 'hold', confidence: 3,
    reason: 'Age 26 WR1 entering his absolute prime. No reason to move unless you receive elite compensation.',
    horizon: 'Long term',
  },
] as const;

// ─── Component ───────────────────────────────────────────────────────────────

const REC_CONFIG = {
  buy:  { label: 'Buy',  color: '#4ade80', icon: TrendingUp,   bg: 'bg-green-500/10',  border: 'border-green-500/30' },
  sell: { label: 'Sell', color: '#e94560', icon: TrendingDown, bg: 'bg-red-500/10',    border: 'border-red-500/30'   },
  hold: { label: 'Hold', color: '#ffd700', icon: Minus,        bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
} as const;

type FilterRec = 'all' | Recommendation;
type FilterPos = 'all' | Position;

export default function BuySellPage() {
  const [recFilter, setRecFilter] = useState<FilterRec>('all');
  const [posFilter, setPosFilter] = useState<FilterPos>('all');

  const filtered = useMemo(() => {
    return RECOMMENDATIONS.filter((r) => {
      if (recFilter !== 'all' && r.rec !== recFilter) return false;
      if (posFilter !== 'all' && r.position !== posFilter) return false;
      return true;
    });
  }, [recFilter, posFilter]);

  const counts = useMemo(() => ({
    buy:  RECOMMENDATIONS.filter((r) => r.rec === 'buy').length,
    sell: RECOMMENDATIONS.filter((r) => r.rec === 'sell').length,
    hold: RECOMMENDATIONS.filter((r) => r.rec === 'hold').length,
  }), []);

  return (
    <>
      <Head>
        <title>Buy/Sell/Hold | BMFFFL Analytics</title>
        <meta name="description" content="Dynasty buy, sell, and hold recommendations for BMFFFL roster assets — March 2026 offseason." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Header */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#ffd700]">Analytics</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-1">Buy / Sell / Hold</h1>
          <p className="text-slate-400 text-sm">Dynasty recommendations for BMFFFL roster assets — March 2026 offseason</p>

          {/* Summary badges */}
          <div className="flex gap-3 mt-4">
            {(['buy', 'sell', 'hold'] as const).map((r) => {
              const cfg = REC_CONFIG[r];
              return (
                <div key={r} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-semibold', cfg.bg, cfg.border)} style={{ color: cfg.color }}>
                  <cfg.icon className="w-3.5 h-3.5" aria-hidden="true" />
                  {cfg.label}: {counts[r]}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="w-4 h-4 text-slate-500" aria-hidden="true" />
            {(['all', 'buy', 'sell', 'hold'] as FilterRec[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRecFilter(r)}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-semibold capitalize transition-colors duration-100',
                  recFilter === r
                    ? 'bg-[#ffd700] text-[#1a1a2e]'
                    : 'bg-[#16213e] text-slate-400 hover:text-white border border-[#2d4a66]'
                )}
              >
                {r}
              </button>
            ))}
            <span className="text-slate-600 text-xs">|</span>
            {(['all', 'QB', 'RB', 'WR', 'TE'] as (FilterPos)[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPosFilter(p)}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-100',
                  posFilter === p
                    ? 'bg-[#e94560] text-white'
                    : 'bg-[#16213e] text-slate-400 hover:text-white border border-[#2d4a66]'
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Player cards */}
      <section className="bg-[#0d1b2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-xs text-slate-500 mb-4">
            Showing {filtered.length} of {RECOMMENDATIONS.length} players. Valid as of March 2026 offseason.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((r) => {
              const cfg = REC_CONFIG[r.rec];
              const Icon = cfg.icon;
              return (
                <div
                  key={`${r.player}-${r.rec}`}
                  className={cn('bg-[#16213e] rounded-xl p-4 border', cfg.border)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-black text-white text-base leading-tight">{r.player}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {r.position} · {r.nflTeam} · Age {r.age}
                      </div>
                    </div>
                    <div
                      className={cn('flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold', cfg.bg)}
                      style={{ color: cfg.color }}
                    >
                      <Icon className="w-3 h-3" aria-hidden="true" />
                      {cfg.label}
                    </div>
                  </div>

                  {/* Reason */}
                  <p className="text-slate-300 text-xs leading-relaxed mb-3">{r.reason}</p>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Owner: {r.bmfff1Owner}</span>
                    <span className="text-slate-500">Horizon: {r.horizon}</span>
                  </div>

                  {/* Confidence */}
                  <div className="flex gap-0.5 mt-2">
                    {[1, 2, 3].map((n) => (
                      <div
                        key={n}
                        className="h-0.5 flex-1 rounded-full"
                        style={{ backgroundColor: n <= r.confidence ? cfg.color : '#2d4a66' }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
