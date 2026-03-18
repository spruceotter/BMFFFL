import Head from 'next/head';
import { useState, useMemo } from 'react';
import { Search, TrendingUp, TrendingDown, Minus, Info, DollarSign } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type Position = 'QB' | 'RB' | 'WR' | 'TE';
type Tier     = 'Dynasty Cornerstone' | 'Dynasty Starter' | 'Solid Piece' | 'Depth' | 'Stash';
type Trend    = 'up' | 'down' | 'stable' | null;

interface Player {
  name:      string;
  pos:       Position;
  nflTeam:   string;
  age:       number;
  ktcValue:  number;
  bimfleIdx: number;
  tier:      Tier;
  trend:     Trend;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLAYERS: Player[] = [
  // QBs
  { name: 'Caleb Williams',      pos: 'QB', nflTeam: 'CHI', age: 23, ktcValue: 9200, bimfleIdx: 9400, tier: 'Dynasty Cornerstone', trend: 'up'   },
  { name: 'C.J. Stroud',         pos: 'QB', nflTeam: 'HOU', age: 23, ktcValue: 9100, bimfleIdx: 9100, tier: 'Dynasty Cornerstone', trend: 'up'   },
  { name: 'Lamar Jackson',       pos: 'QB', nflTeam: 'BAL', age: 29, ktcValue: 8600, bimfleIdx: 8700, tier: 'Dynasty Cornerstone', trend: 'stable'},
  { name: 'Jalen Hurts',         pos: 'QB', nflTeam: 'PHI', age: 27, ktcValue: 8400, bimfleIdx: 8300, tier: 'Dynasty Cornerstone', trend: 'stable'},
  { name: 'Josh Allen',          pos: 'QB', nflTeam: 'BUF', age: 29, ktcValue: 8200, bimfleIdx: 8100, tier: 'Dynasty Cornerstone', trend: 'stable'},
  { name: 'Patrick Mahomes',     pos: 'QB', nflTeam: 'KC',  age: 30, ktcValue: 7800, bimfleIdx: 7700, tier: 'Dynasty Starter',     trend: 'down' },
  { name: 'Trevor Lawrence',     pos: 'QB', nflTeam: 'JAX', age: 26, ktcValue: 7600, bimfleIdx: 7700, tier: 'Dynasty Starter',     trend: 'up'   },
  { name: 'Anthony Richardson',  pos: 'QB', nflTeam: 'IND', age: 24, ktcValue: 7200, bimfleIdx: 7100, tier: 'Dynasty Starter',     trend: 'down' },
  { name: 'Cam Ward',            pos: 'QB', nflTeam: 'TEN', age: 23, ktcValue: 6800, bimfleIdx: 6900, tier: 'Solid Piece',         trend: 'up'   },
  { name: 'Kyler Murray',        pos: 'QB', nflTeam: 'MIN', age: 28, ktcValue: 6500, bimfleIdx: 6400, tier: 'Solid Piece',         trend: 'stable'},

  // RBs
  { name: 'Bijan Robinson',      pos: 'RB', nflTeam: 'ATL', age: 24, ktcValue: 9400, bimfleIdx: 9500, tier: 'Dynasty Cornerstone', trend: 'up'   },
  { name: 'Breece Hall',         pos: 'RB', nflTeam: 'NYJ', age: 24, ktcValue: 9100, bimfleIdx: 9200, tier: 'Dynasty Cornerstone', trend: 'up'   },
  { name: 'Ashton Jeanty',       pos: 'RB', nflTeam: 'LV',  age: 21, ktcValue: 9000, bimfleIdx: 9100, tier: 'Dynasty Cornerstone', trend: 'up'   },
  { name: 'Jahmyr Gibbs',        pos: 'RB', nflTeam: 'DET', age: 23, ktcValue: 8900, bimfleIdx: 8800, tier: 'Dynasty Cornerstone', trend: 'stable'},
  { name: 'Bucky Irving',        pos: 'RB', nflTeam: 'TB',  age: 23, ktcValue: 8200, bimfleIdx: 8400, tier: 'Dynasty Cornerstone', trend: 'up'   },
  { name: 'De\'Von Achane',      pos: 'RB', nflTeam: 'MIA', age: 24, ktcValue: 8000, bimfleIdx: 7900, tier: 'Dynasty Starter',     trend: 'stable'},
  { name: 'Jonathon Brooks',     pos: 'RB', nflTeam: 'CAR', age: 22, ktcValue: 7500, bimfleIdx: 7600, tier: 'Dynasty Starter',     trend: 'up'   },
  { name: 'Jaylen Wright',       pos: 'RB', nflTeam: 'TEN', age: 22, ktcValue: 6800, bimfleIdx: 6700, tier: 'Solid Piece',         trend: 'up'   },
  { name: 'Josh Jacobs',         pos: 'RB', nflTeam: 'GB',  age: 28, ktcValue: 5200, bimfleIdx: 5000, tier: 'Solid Piece',         trend: 'down' },
  { name: 'Christian McCaffrey', pos: 'RB', nflTeam: 'SF',  age: 29, ktcValue: 4800, bimfleIdx: 4600, tier: 'Depth',               trend: 'down' },
  { name: 'Chuba Hubbard',       pos: 'RB', nflTeam: 'CAR', age: 26, ktcValue: 4200, bimfleIdx: 4300, tier: 'Depth',               trend: 'stable'},
  { name: 'Tyjae Spears',        pos: 'RB', nflTeam: 'TEN', age: 24, ktcValue: 3800, bimfleIdx: 3900, tier: 'Depth',               trend: 'stable'},
  { name: 'Isaac Guerendo',      pos: 'RB', nflTeam: 'SF',  age: 25, ktcValue: 2800, bimfleIdx: 2700, tier: 'Depth',               trend: 'up'   },
  { name: 'Tank Bigsby',         pos: 'RB', nflTeam: 'JAX', age: 23, ktcValue: 2200, bimfleIdx: 2100, tier: 'Depth',               trend: 'stable'},
  { name: 'MarShawn Lloyd',      pos: 'RB', nflTeam: 'TB',  age: 22, ktcValue: 1600, bimfleIdx: 1700, tier: 'Stash',               trend: 'up'   },

  // WRs
  { name: 'Justin Jefferson',    pos: 'WR', nflTeam: 'MIN', age: 26, ktcValue: 9500, bimfleIdx: 9600, tier: 'Dynasty Cornerstone', trend: 'stable'},
  { name: 'Ja\'Marr Chase',      pos: 'WR', nflTeam: 'CIN', age: 25, ktcValue: 9400, bimfleIdx: 9500, tier: 'Dynasty Cornerstone', trend: 'stable'},
  { name: 'CeeDee Lamb',         pos: 'WR', nflTeam: 'DAL', age: 26, ktcValue: 9300, bimfleIdx: 9400, tier: 'Dynasty Cornerstone', trend: 'stable'},
  { name: 'Amon-Ra St. Brown',   pos: 'WR', nflTeam: 'DET', age: 25, ktcValue: 9000, bimfleIdx: 9100, tier: 'Dynasty Cornerstone', trend: 'up'   },
  { name: 'Puka Nacua',          pos: 'WR', nflTeam: 'LAR', age: 24, ktcValue: 8600, bimfleIdx: 8700, tier: 'Dynasty Cornerstone', trend: 'up'   },
  { name: 'Travis Hunter',       pos: 'WR', nflTeam: 'JAX', age: 22, ktcValue: 8400, bimfleIdx: 8500, tier: 'Dynasty Cornerstone', trend: 'up'   },
  { name: 'Tetairoa McMillan',   pos: 'WR', nflTeam: 'CAR', age: 22, ktcValue: 8200, bimfleIdx: 8100, tier: 'Dynasty Cornerstone', trend: 'up'   },
  { name: 'Malik Nabers',        pos: 'WR', nflTeam: 'NYG', age: 22, ktcValue: 8100, bimfleIdx: 8000, tier: 'Dynasty Cornerstone', trend: 'up'   },
  { name: 'Brian Thomas Jr.',    pos: 'WR', nflTeam: 'JAX', age: 23, ktcValue: 7900, bimfleIdx: 8000, tier: 'Dynasty Starter',     trend: 'up'   },
  { name: 'Jaylen Waddle',       pos: 'WR', nflTeam: 'MIA', age: 27, ktcValue: 7600, bimfleIdx: 7500, tier: 'Dynasty Starter',     trend: 'stable'},
  { name: 'Ricky Pearsall',      pos: 'WR', nflTeam: 'SF',  age: 25, ktcValue: 7200, bimfleIdx: 7400, tier: 'Dynasty Starter',     trend: 'up'   },
  { name: 'Jordan Addison',      pos: 'WR', nflTeam: 'MIN', age: 24, ktcValue: 7000, bimfleIdx: 7100, tier: 'Dynasty Starter',     trend: 'up'   },
  { name: 'Marvin Harrison Jr.', pos: 'WR', nflTeam: 'ARI', age: 23, ktcValue: 6800, bimfleIdx: 6700, tier: 'Solid Piece',         trend: 'down' },
  { name: 'Jaxon Smith-Njigba',  pos: 'WR', nflTeam: 'SEA', age: 23, ktcValue: 6500, bimfleIdx: 6600, tier: 'Solid Piece',         trend: 'up'   },
  { name: 'Xavier Worthy',       pos: 'WR', nflTeam: 'KC',  age: 22, ktcValue: 5900, bimfleIdx: 6000, tier: 'Solid Piece',         trend: 'up'   },
  { name: 'Ladd McConkey',       pos: 'WR', nflTeam: 'LAC', age: 23, ktcValue: 5700, bimfleIdx: 5600, tier: 'Solid Piece',         trend: 'stable'},
  { name: 'Quentin Johnston',    pos: 'WR', nflTeam: 'LAC', age: 24, ktcValue: 4500, bimfleIdx: 4600, tier: 'Depth',               trend: 'stable'},
  { name: 'Demario Douglas',     pos: 'WR', nflTeam: 'NE',  age: 25, ktcValue: 3200, bimfleIdx: 3100, tier: 'Depth',               trend: 'stable'},
  { name: 'Tre Harris',          pos: 'WR', nflTeam: 'LAC', age: 22, ktcValue: 2400, bimfleIdx: 2500, tier: 'Depth',               trend: 'up'   },
  { name: 'Keon Coleman',        pos: 'WR', nflTeam: 'BUF', age: 23, ktcValue: 2100, bimfleIdx: 2000, tier: 'Depth',               trend: 'down' },
  { name: 'Mike Sainristil',     pos: 'WR', nflTeam: 'MIA', age: 23, ktcValue: 1400, bimfleIdx: 1500, tier: 'Stash',               trend: null   },

  // TEs
  { name: 'Sam LaPorta',         pos: 'TE', nflTeam: 'DET', age: 24, ktcValue: 8500, bimfleIdx: 8600, tier: 'Dynasty Cornerstone', trend: 'up'   },
  { name: 'Trey McBride',        pos: 'TE', nflTeam: 'ARI', age: 25, ktcValue: 8300, bimfleIdx: 8400, tier: 'Dynasty Cornerstone', trend: 'up'   },
  { name: 'Brock Bowers',        pos: 'TE', nflTeam: 'LV',  age: 22, ktcValue: 8800, bimfleIdx: 9000, tier: 'Dynasty Cornerstone', trend: 'up'   },
  { name: 'Tucker Kraft',        pos: 'TE', nflTeam: 'GB',  age: 25, ktcValue: 7100, bimfleIdx: 7200, tier: 'Dynasty Starter',     trend: 'up'   },
  { name: 'Jake Ferguson',       pos: 'TE', nflTeam: 'DAL', age: 25, ktcValue: 6900, bimfleIdx: 7000, tier: 'Dynasty Starter',     trend: 'stable'},
  { name: 'Theo Johnson',        pos: 'TE', nflTeam: 'NYG', age: 24, ktcValue: 5800, bimfleIdx: 5700, tier: 'Solid Piece',         trend: 'up'   },
  { name: 'Cade Stover',         pos: 'TE', nflTeam: 'HOU', age: 25, ktcValue: 5200, bimfleIdx: 5300, tier: 'Solid Piece',         trend: 'up'   },
  { name: 'Dalton Schultz',      pos: 'TE', nflTeam: 'HOU', age: 29, ktcValue: 3600, bimfleIdx: 3500, tier: 'Depth',               trend: 'down' },
  { name: 'Luke Musgrave',       pos: 'TE', nflTeam: 'GB',  age: 25, ktcValue: 2800, bimfleIdx: 2900, tier: 'Depth',               trend: 'stable'},
  { name: 'Zach Ertz',           pos: 'TE', nflTeam: 'WAS', age: 35, ktcValue: 1200, bimfleIdx: 1100, tier: 'Stash',               trend: 'down' },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const TIER_CONFIG: Record<Tier, { color: string; bg: string; border: string; min: number }> = {
  'Dynasty Cornerstone': { color: 'text-[#ffd700]',   bg: 'bg-[#ffd700]/10',    border: 'border-[#ffd700]/30',   min: 9000 },
  'Dynasty Starter':     { color: 'text-emerald-400', bg: 'bg-emerald-400/10',  border: 'border-emerald-400/30', min: 7000 },
  'Solid Piece':         { color: 'text-blue-400',    bg: 'bg-blue-400/10',     border: 'border-blue-400/30',    min: 5000 },
  'Depth':               { color: 'text-slate-300',   bg: 'bg-slate-700/20',    border: 'border-slate-700/40',   min: 2000 },
  'Stash':               { color: 'text-slate-500',   bg: 'bg-slate-800/20',    border: 'border-slate-800/40',   min: 0    },
};

const POS_COLORS: Record<Position, string> = {
  QB: 'text-rose-400 bg-rose-400/10 border-rose-400/30',
  RB: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  WR: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  TE: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
};

const TREND_CONFIG = {
  up:     { icon: TrendingUp,   color: 'text-emerald-400', label: 'Rising'  },
  down:   { icon: TrendingDown, color: 'text-[#e94560]',   label: 'Falling' },
  stable: { icon: Minus,        color: 'text-slate-400',   label: 'Stable'  },
} as const;

type PosFilter = 'All' | Position;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PriceCheckPage() {
  const [query,     setQuery]     = useState('');
  const [posFilter, setPosFilter] = useState<PosFilter>('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PLAYERS.filter((p) => {
      if (posFilter !== 'All' && p.pos !== posFilter) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.nflTeam.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, posFilter]);

  const tierCounts = useMemo(() => {
    const result: Partial<Record<Tier, number>> = {};
    for (const p of PLAYERS) {
      result[p.tier] = (result[p.tier] ?? 0) + 1;
    }
    return result;
  }, []);

  return (
    <>
      <Head>
        <title>Dynasty Price Check | BMFFFL Analytics</title>
        <meta
          name="description"
          content="Searchable dynasty player value reference — KTC values, Bimfle Index, tiers, and market trend arrows for 60 top dynasty players."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ── Hero + Search ─────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#ffd700]">Analytics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-1 leading-tight">
            Dynasty Price Check
          </h1>
          <p className="text-slate-400 text-sm mb-6">
            Current Market Values — KTC scale &amp; Bimfle Index
          </p>

          {/* Search input */}
          <div className="relative max-w-lg">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search player or NFL team..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={cn(
                'w-full pl-9 pr-4 py-3 rounded-lg text-sm',
                'bg-[#16213e] border border-[#2d4a66] text-white placeholder-slate-500',
                'focus:outline-none focus:ring-2 focus:ring-[#ffd700]/40 focus:border-[#ffd700]/40',
              )}
              aria-label="Search players"
            />
          </div>
        </div>
      </section>

      {/* ── Position Filter Tabs ───────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-2 flex-wrap">
            {(['All', 'QB', 'RB', 'WR', 'TE'] as PosFilter[]).map((pos) => (
              <button
                key={pos}
                type="button"
                onClick={() => setPosFilter(pos)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-colors duration-100',
                  posFilter === pos
                    ? 'bg-[#ffd700] text-[#1a1a2e]'
                    : 'bg-[#16213e] text-slate-400 hover:text-white border border-[#2d4a66]'
                )}
              >
                {pos}
                {pos !== 'All' && (
                  <span className="ml-1.5 opacity-60">
                    {PLAYERS.filter((p) => p.pos === pos).length}
                  </span>
                )}
              </button>
            ))}
            <span className="ml-auto text-xs text-slate-500 self-center">
              Showing {filtered.length} of {PLAYERS.length} players
            </span>
          </div>
        </div>
      </section>

      {/* ── Player Value Table ─────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-500 text-sm">No players match your search.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[#2d4a66]">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="border-b border-[#2d4a66] bg-[#16213e]">
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Player</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Pos</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Team</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Age</th>
                    <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">KTC</th>
                    <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Bimfle Idx</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Tier</th>
                    <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2d4a66]">
                  {filtered.map((p) => {
                    const tierCfg = TIER_CONFIG[p.tier];
                    const posCls  = POS_COLORS[p.pos];
                    const trendCfg = p.trend ? TREND_CONFIG[p.trend] : null;
                    const TrendIcon = trendCfg?.icon;
                    return (
                      <tr
                        key={p.name}
                        className="hover:bg-[#16213e]/60 transition-colors duration-75"
                      >
                        {/* Name */}
                        <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">{p.name}</td>

                        {/* Pos */}
                        <td className="px-4 py-3">
                          <span className={cn('px-2 py-0.5 rounded text-xs font-bold border', posCls)}>
                            {p.pos}
                          </span>
                        </td>

                        {/* Team */}
                        <td className="px-4 py-3 text-slate-400 font-mono text-xs">{p.nflTeam}</td>

                        {/* Age */}
                        <td className="px-4 py-3 text-slate-300">{p.age}</td>

                        {/* KTC */}
                        <td className="px-4 py-3 text-right font-black text-white tabular-nums">
                          {p.ktcValue.toLocaleString()}
                        </td>

                        {/* Bimfle Idx */}
                        <td className="px-4 py-3 text-right">
                          <span className={cn('font-black tabular-nums', tierCfg.color)}>
                            {p.bimfleIdx.toLocaleString()}
                          </span>
                        </td>

                        {/* Tier */}
                        <td className="px-4 py-3">
                          <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap', tierCfg.color, tierCfg.bg, tierCfg.border)}>
                            {p.tier}
                          </span>
                        </td>

                        {/* Trend */}
                        <td className="px-4 py-3 text-center">
                          {TrendIcon && trendCfg ? (
                            <span title={trendCfg.label} className="inline-flex justify-center">
                              <TrendIcon className={cn('w-4 h-4', trendCfg.color)} aria-label={trendCfg.label} />
                            </span>
                          ) : (
                            <span className="text-slate-700 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* ── Tier Legend ───────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-4">Tier Legend</h2>
          <div className="flex flex-wrap gap-3">
            {(Object.entries(TIER_CONFIG) as [Tier, typeof TIER_CONFIG[Tier]][]).map(([tier, cfg]) => (
              <div key={tier} className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold', cfg.color, cfg.bg, cfg.border)}>
                <span>{tier}</span>
                <span className="opacity-60">{tierCounts[tier] ?? 0}</span>
              </div>
            ))}
          </div>

          {/* Trend key */}
          <div className="flex gap-4 mt-5 items-center">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Trend Key:</span>
            {(['up', 'down', 'stable'] as const).map((t) => {
              const cfg  = TREND_CONFIG[t];
              const Icon = cfg.icon;
              return (
                <div key={t} className="flex items-center gap-1.5 text-xs">
                  <Icon className={cn('w-3.5 h-3.5', cfg.color)} aria-hidden="true" />
                  <span className={cn(cfg.color)}>{cfg.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Bimfle's Pricing Methodology ──────────────────────────────────── */}
      <section className="bg-[#0d1b2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <h2 className="text-lg font-black text-white">Bimfle&apos;s Pricing Methodology</h2>
          </div>
          <div className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-6 max-w-3xl">
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              The <span className="text-[#ffd700] font-bold">Bimfle Index</span> is a league-specific dynasty valuation
              that adjusts KTC&apos;s market values based on four factors:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Age Curve',        desc: 'Heavy penalties past 28 for RBs/WRs, 30+ for QBs. Premiums for under-25 players.' },
                { label: 'Production',        desc: 'Actual fantasy scoring in BMFFFL scoring format. Raw stats adjusted for opportunity.' },
                { label: 'Team Context',      desc: 'Offensive system quality, target hierarchy, depth chart risk.' },
                { label: 'Scarcity Premium',  desc: 'Positional scarcity in BMFFFL rosters — tight ends and premium QBs get a bump.' },
              ].map((item) => (
                <div key={item.label} className="flex gap-3">
                  <div className="w-1 rounded-full bg-[#ffd700]/40 shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-white">{item.label}</div>
                    <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-600 mt-5">
              Values on a 1–10,000 scale. Updated pre-season and after significant injury or trade news.
              KTC values sourced from KeepTradeCut.com. Bimfle Index is BMFFFL-specific and may differ
              substantially from market consensus.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
