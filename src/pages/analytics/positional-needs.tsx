import Head from 'next/head';
import { AlertTriangle, Target, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type NeedRating = 'SOLID' | 'NEED' | 'URGENT';
type OffseasonPriority = 'REBUILD' | 'RELOAD' | 'TWEAK' | 'STAND PAT';
type Position = 'QB' | 'RB' | 'WR' | 'TE';

interface TeamNeed {
  id: string;
  emoji: string;
  owner: string;
  needs: Record<Position, NeedRating>;
  priority: OffseasonPriority;
  bimfleNote: string;
}

interface PositionMarket {
  pos: Position;
  headline: string;
  body: string;
}

interface TradeTarget {
  needingTeam: string;
  position: Position;
  targetPlayer: string;
  surplusTeam: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TEAMS: TeamNeed[] = [
  {
    id: 'mlschools12',
    emoji: '🏆',
    owner: 'mlschools12',
    needs: { QB: 'SOLID', RB: 'NEED', WR: 'SOLID', TE: 'NEED' },
    priority: 'TWEAK',
    bimfleNote: 'Dynasty is intact. Just add depth.',
  },
  {
    id: 'tubes94',
    emoji: '💪',
    owner: 'tubes94',
    needs: { QB: 'SOLID', RB: 'URGENT', WR: 'SOLID', TE: 'SOLID' },
    priority: 'RELOAD',
    bimfleNote: 'Lost Ekeler/CMC era backs. Need RB now.',
  },
  {
    id: 'rbr',
    emoji: '🎯',
    owner: 'rbr',
    needs: { QB: 'SOLID', RB: 'NEED', WR: 'NEED', TE: 'SOLID' },
    priority: 'RELOAD',
    bimfleNote: 'Deep at QB/TE, thin at skill positions.',
  },
  {
    id: 'juicybussy',
    emoji: '🌀',
    owner: 'juicybussy',
    needs: { QB: 'NEED', RB: 'SOLID', WR: 'SOLID', TE: 'NEED' },
    priority: 'TWEAK',
    bimfleNote: 'Chaos is fine. The chaos works.',
  },
  {
    id: 'sexmachineandy',
    emoji: '⚡',
    owner: 'sexmachineandy',
    needs: { QB: 'SOLID', RB: 'SOLID', WR: 'NEED', TE: 'NEED' },
    priority: 'RELOAD',
    bimfleNote: 'WR corps needs a true WR1.',
  },
  {
    id: 'cogdeill11',
    emoji: '🔥',
    owner: 'cogdeill11',
    needs: { QB: 'URGENT', RB: 'NEED', WR: 'NEED', TE: 'SOLID' },
    priority: 'REBUILD',
    bimfleNote: 'Full rebuild mode. Draft high, draft often.',
  },
  {
    id: 'grandes',
    emoji: '👑',
    owner: 'grandes',
    needs: { QB: 'SOLID', RB: 'URGENT', WR: 'NEED', TE: 'SOLID' },
    priority: 'RELOAD',
    bimfleNote: "Commissioner's team needs RBs badly.",
  },
  {
    id: 'tdtd19844',
    emoji: '📈',
    owner: 'tdtd19844',
    needs: { QB: 'SOLID', RB: 'SOLID', WR: 'SOLID', TE: 'NEED' },
    priority: 'STAND PAT',
    bimfleNote: 'The resurrection continues. TE is the only gap.',
  },
  {
    id: 'eldridsm',
    emoji: '🧱',
    owner: 'eldridsm',
    needs: { QB: 'NEED', RB: 'SOLID', WR: 'SOLID', TE: 'NEED' },
    priority: 'TWEAK',
    bimfleNote: 'Solid core, needs QB stability.',
  },
  {
    id: 'eldridm20',
    emoji: '🎲',
    owner: 'eldridm20',
    needs: { QB: 'SOLID', RB: 'NEED', WR: 'SOLID', TE: 'NEED' },
    priority: 'TWEAK',
    bimfleNote: 'Great at busting brackets. Now build depth.',
  },
  {
    id: 'cmaleski',
    emoji: '📊',
    owner: 'cmaleski',
    needs: { QB: 'SOLID', RB: 'NEED', WR: 'SOLID', TE: 'SOLID' },
    priority: 'TWEAK',
    bimfleNote: '1990 points proves the core is real. Add RB.',
  },
  {
    id: 'escuelas',
    emoji: '🚀',
    owner: 'escuelas',
    needs: { QB: 'URGENT', RB: 'URGENT', WR: 'NEED', TE: 'NEED' },
    priority: 'REBUILD',
    bimfleNote: 'The climb continues. Multiple urgent needs.',
  },
];

const POSITION_MARKETS: PositionMarket[] = [
  {
    pos: 'RB',
    headline: 'Deep rookie class',
    body: 'McMillan/Hampton/Judkins available early. Volume backs in multiple rounds.',
  },
  {
    pos: 'WR',
    headline: 'Even deeper',
    body: 'McMillan is WR1. Burden/Egbuka/Stewart all mid-round value. Best WR class in years.',
  },
  {
    pos: 'QB',
    headline: 'Thin market',
    body: 'Premium on veterans. Draft picks or trade up. No obvious franchise QB in this class.',
  },
  {
    pos: 'TE',
    headline: 'TE is always a desert',
    body: 'Brock Bowers, Trey McBride already owned. If you missed the window, you wait.',
  },
];

const TRADE_TARGETS: TradeTarget[] = [
  {
    needingTeam: 'tubes94',
    position: 'RB',
    targetPlayer: 'Ashton Jeanty',
    surplusTeam: 'grandes',
  },
  {
    needingTeam: 'cogdeill11',
    position: 'QB',
    targetPlayer: 'Trevor Lawrence',
    surplusTeam: 'tubes94',
  },
  {
    needingTeam: 'escuelas',
    position: 'QB',
    targetPlayer: 'Jordan Love',
    surplusTeam: 'grandes',
  },
  {
    needingTeam: 'escuelas',
    position: 'RB',
    targetPlayer: 'Bucky Irving',
    surplusTeam: 'mlschools12',
  },
  {
    needingTeam: 'grandes',
    position: 'RB',
    targetPlayer: 'Omarion Hampton',
    surplusTeam: 'cogdeill11',
  },
];

const POSITIONS: Position[] = ['QB', 'RB', 'WR', 'TE'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const NEED_STYLES: Record<NeedRating, { cell: string; badge: string; label: string }> = {
  SOLID: {
    cell: 'bg-emerald-500/15 text-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    label: 'text-emerald-400',
  },
  NEED: {
    cell: 'bg-amber-500/15 text-amber-400',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    label: 'text-amber-400',
  },
  URGENT: {
    cell: 'bg-[#e94560]/15 text-[#e94560]',
    badge: 'bg-[#e94560]/20 text-[#e94560] border-[#e94560]/40',
    label: 'text-[#e94560]',
  },
};

const PRIORITY_STYLES: Record<OffseasonPriority, string> = {
  REBUILD:    'bg-[#e94560]/15 text-[#e94560] border-[#e94560]/35',
  RELOAD:     'bg-amber-500/15 text-amber-300 border-amber-500/35',
  TWEAK:      'bg-blue-500/15 text-blue-300 border-blue-500/35',
  'STAND PAT': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35',
};

const POS_MARKET_STYLES: Record<Position, { border: string; icon: string; badge: string }> = {
  RB: { border: 'border-emerald-500/30', icon: 'text-emerald-400', badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  WR: { border: 'border-blue-500/30',    icon: 'text-blue-400',    badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
  QB: { border: 'border-red-500/30',     icon: 'text-red-400',     badge: 'bg-red-500/15 text-red-300 border-red-500/30' },
  TE: { border: 'border-orange-500/30',  icon: 'text-orange-400',  badge: 'bg-orange-500/15 text-orange-300 border-orange-500/30' },
};

function NeedBadge({ rating }: { rating: NeedRating }) {
  const s = NEED_STYLES[rating];
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-2 py-0.5 rounded border text-[10px] font-black uppercase tracking-wider min-w-[56px]',
        s.badge
      )}
    >
      {rating}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: OffseasonPriority }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest',
        PRIORITY_STYLES[priority]
      )}
    >
      {priority}
    </span>
  );
}

// ─── Team Card ─────────────────────────────────────────────────────────────────

function TeamCard({ team }: { team: TeamNeed }) {
  const urgentCount = POSITIONS.filter(p => team.needs[p] === 'URGENT').length;
  const needCount   = POSITIONS.filter(p => team.needs[p] === 'NEED').length;

  return (
    <div
      className={cn(
        'rounded-xl border bg-[#16213e] p-4 flex flex-col gap-3 transition-all duration-150 hover:border-[#3d5a76]',
        urgentCount > 0 ? 'border-[#e94560]/25' : 'border-[#2d4a66]'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-2xl leading-none" aria-hidden="true">{team.emoji}</span>
          <div className="min-w-0">
            <p className="text-sm font-black text-white truncate">{team.owner}</p>
            {urgentCount > 0 && (
              <p className="text-[10px] text-[#e94560] font-semibold mt-0.5">
                {urgentCount} urgent need{urgentCount > 1 ? 's' : ''}
              </p>
            )}
            {urgentCount === 0 && needCount > 0 && (
              <p className="text-[10px] text-amber-400 font-semibold mt-0.5">
                {needCount} need{needCount > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
        <PriorityBadge priority={team.priority} />
      </div>

      {/* Position need ratings */}
      <div className="grid grid-cols-4 gap-1.5">
        {POSITIONS.map(pos => (
          <div key={pos} className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{pos}</span>
            <NeedBadge rating={team.needs[pos]} />
          </div>
        ))}
      </div>

      {/* Bimfle assessment */}
      <div className="pt-1 border-t border-[#1e3347]">
        <div className="flex items-start gap-1.5">
          <span className="text-[10px] font-black text-[#ffd700] uppercase tracking-wider shrink-0 mt-0.5">
            Bimfle:
          </span>
          <p className="text-xs text-slate-400 italic leading-snug">&ldquo;{team.bimfleNote}&rdquo;</p>
        </div>
      </div>
    </div>
  );
}

// ─── Position Market Card ──────────────────────────────────────────────────────

function PositionMarketCard({ market }: { market: PositionMarket }) {
  const s = POS_MARKET_STYLES[market.pos];
  return (
    <div className={cn('rounded-xl border bg-[#16213e] p-5', s.border)}>
      <div className="flex items-center gap-3 mb-3">
        <span
          className={cn(
            'inline-flex items-center justify-center w-10 h-10 rounded-lg border text-base font-black',
            s.badge
          )}
          aria-hidden="true"
        >
          {market.pos}
        </span>
        <div>
          <p className="text-sm font-black text-white">{market.pos} Market</p>
          <p className={cn('text-xs font-bold', s.icon)}>{market.headline}</p>
        </div>
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">{market.body}</p>
    </div>
  );
}

// ─── Needs Matrix ──────────────────────────────────────────────────────────────

function NeedsMatrix() {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#2d4a66]">
      <table className="w-full text-sm border-collapse" aria-label="Team positional needs matrix">
        <thead>
          <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
              Team
            </th>
            {POSITIONS.map(pos => (
              <th
                key={pos}
                className="px-3 py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider"
              >
                {pos}
              </th>
            ))}
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
              Priority
            </th>
          </tr>
        </thead>
        <tbody>
          {TEAMS.map((team, idx) => (
            <tr
              key={team.id}
              className={cn(
                'border-b border-[#1e3347] transition-colors duration-100 hover:bg-[#1f3550]',
                idx % 2 === 0 ? 'bg-[#16213e]' : 'bg-[#142038]'
              )}
            >
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span aria-hidden="true">{team.emoji}</span>
                  <span className="font-semibold text-slate-200 text-sm">{team.owner}</span>
                </div>
              </td>
              {POSITIONS.map(pos => {
                const rating = team.needs[pos];
                const s = NEED_STYLES[rating];
                return (
                  <td key={pos} className={cn('px-3 py-2.5 text-center font-black text-xs', s.cell)}>
                    {rating}
                  </td>
                );
              })}
              <td className="px-4 py-2.5">
                <PriorityBadge priority={team.priority} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Trade Targets Section ─────────────────────────────────────────────────────

function TradeTargetsSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {TRADE_TARGETS.map((target, idx) => {
        const s = POS_MARKET_STYLES[target.position];
        return (
          <div key={idx} className={cn('rounded-xl border bg-[#16213e] p-4', s.border)}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className={cn('w-4 h-4 shrink-0', s.icon)} aria-hidden="true" />
              <span className={cn('text-xs font-black uppercase tracking-wider', s.icon)}>
                URGENT {target.position}
              </span>
              <span className="text-xs text-slate-500 ml-auto">→ {target.needingTeam}</span>
            </div>
            <p className="text-base font-black text-white mb-1">{target.targetPlayer}</p>
            <p className="text-xs text-slate-400">
              Potential surplus on{' '}
              <span className="text-slate-200 font-semibold">{target.surplusTeam}</span>
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ─── Stats Bar ─────────────────────────────────────────────────────────────────

function LeagueSummaryBar() {
  const urgentByPos = POSITIONS.reduce<Record<Position, number>>(
    (acc, pos) => {
      acc[pos] = TEAMS.filter(t => t.needs[pos] === 'URGENT').length;
      return acc;
    },
    { QB: 0, RB: 0, WR: 0, TE: 0 }
  );

  const priorityCounts = (['REBUILD', 'RELOAD', 'TWEAK', 'STAND PAT'] as OffseasonPriority[]).reduce<
    Record<OffseasonPriority, number>
  >(
    (acc, p) => {
      acc[p] = TEAMS.filter(t => t.priority === p).length;
      return acc;
    },
    { REBUILD: 0, RELOAD: 0, TWEAK: 0, 'STAND PAT': 0 }
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {(Object.entries(priorityCounts) as [OffseasonPriority, number][]).map(([priority, count]) => (
        <div
          key={priority}
          className="rounded-xl border bg-[#16213e] border-[#2d4a66] px-4 py-3 flex flex-col gap-1"
        >
          <span
            className={cn(
              'text-[10px] font-black uppercase tracking-widest',
              PRIORITY_STYLES[priority].split(' ').find(c => c.startsWith('text-')) ?? 'text-slate-400'
            )}
          >
            {priority}
          </span>
          <span className="text-3xl font-black text-white tabular-nums">{count}</span>
          <span className="text-[11px] text-slate-500">
            team{count !== 1 ? 's' : ''}
          </span>
        </div>
      ))}
      <div className="col-span-2 sm:col-span-4 rounded-xl border bg-[#16213e] border-[#2d4a66] px-4 py-3">
        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">
          Urgent Needs by Position
        </p>
        <div className="flex flex-wrap gap-3">
          {POSITIONS.map(pos => {
            const count = urgentByPos[pos];
            const s = POS_MARKET_STYLES[pos];
            return (
              <div key={pos} className="flex items-center gap-2">
                <span
                  className={cn(
                    'inline-flex items-center justify-center w-7 h-7 rounded border text-[10px] font-black',
                    s.badge
                  )}
                >
                  {pos}
                </span>
                <span className={cn('text-sm font-black tabular-nums', count > 1 ? 'text-[#e94560]' : count === 1 ? 'text-amber-400' : 'text-slate-500')}>
                  {count} urgent
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PositionalNeedsPage() {
  return (
    <>
      <Head>
        <title>Positional Needs | BMFFFL Analytics</title>
        <meta
          name="description"
          content="2026 offseason positional needs analysis for all 12 BMFFFL dynasty teams."
        />
      </Head>

      <main className="min-h-screen bg-[#0a1628] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#1e3347]">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-[#16213e] border border-[#2d4a66]">
                  <Target className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Positional Needs
                </h1>
              </div>
              <p className="text-sm text-slate-400 max-w-xl">
                2026 offseason analysis — where each BMFFFL team stands heading into the rookie draft and free agency.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Users className="w-3.5 h-3.5" aria-hidden="true" />
              <span>12 teams</span>
              <span className="text-slate-700">·</span>
              <BarChart3 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>2026 offseason</span>
            </div>
          </div>

          {/* League summary bar */}
          <section aria-labelledby="summary-heading">
            <h2
              id="summary-heading"
              className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4"
            >
              League Snapshot
            </h2>
            <LeagueSummaryBar />
          </section>

          {/* Section 1: Needs Overview */}
          <section aria-labelledby="needs-overview-heading">
            <div className="flex items-center gap-3 mb-5">
              <Users className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
              <h2
                id="needs-overview-heading"
                className="text-lg font-black text-white"
              >
                Needs Overview
              </h2>
              <span className="text-xs text-slate-500 font-medium">All 12 teams</span>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="font-semibold text-slate-400">Rating key:</span>
              {(['SOLID', 'NEED', 'URGENT'] as NeedRating[]).map(r => (
                <div key={r} className="flex items-center gap-1.5">
                  <NeedBadge rating={r} />
                  <span>
                    {r === 'SOLID' && '— strong depth, no action needed'}
                    {r === 'NEED'   && '— room for improvement'}
                    {r === 'URGENT' && '— critical gap, must address'}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {TEAMS.map(team => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          </section>

          {/* Section 2: Position Market Overview */}
          <section aria-labelledby="market-overview-heading">
            <div className="flex items-center gap-3 mb-5">
              <TrendingUp className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
              <h2
                id="market-overview-heading"
                className="text-lg font-black text-white"
              >
                Position Market Overview
              </h2>
              <span className="text-xs text-slate-500 font-medium">2026 offseason landscape</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {POSITION_MARKETS.map(market => (
                <PositionMarketCard key={market.pos} market={market} />
              ))}
            </div>
          </section>

          {/* Section 3: Needs Matrix */}
          <section aria-labelledby="matrix-heading">
            <div className="flex items-center gap-3 mb-5">
              <BarChart3 className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
              <h2
                id="matrix-heading"
                className="text-lg font-black text-white"
              >
                Needs Matrix
              </h2>
              <span className="text-xs text-slate-500 font-medium">All teams × all positions</span>
            </div>
            <div className="mb-4 flex flex-wrap gap-4 text-xs text-slate-500">
              {(['SOLID', 'NEED', 'URGENT'] as NeedRating[]).map(r => {
                const s = NEED_STYLES[r];
                return (
                  <div key={r} className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-md', s.cell)}>
                    <span className="font-black">{r}</span>
                  </div>
                );
              })}
            </div>
            <NeedsMatrix />
          </section>

          {/* Section 4: Top Trade Targets by Need */}
          <section aria-labelledby="trade-targets-heading">
            <div className="flex items-center gap-3 mb-5">
              <AlertTriangle className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
              <h2
                id="trade-targets-heading"
                className="text-lg font-black text-white"
              >
                Top Trade Targets by Need
              </h2>
              <span className="text-xs text-slate-500 font-medium">Suggested targets for URGENT needs</span>
            </div>
            <p className="text-sm text-slate-400 mb-5">
              For each team with an URGENT positional need, a potential trade target and which roster might have surplus at that position.
            </p>
            <TradeTargetsSection />
          </section>

          {/* Footer note */}
          <div className="pt-4 border-t border-[#1e3347]">
            <p className="text-xs text-slate-600 text-center">
              Positional ratings reflect 2026 offseason roster construction. Data current as of March 2026. Bimfle assessments are final.
            </p>
          </div>

        </div>
      </main>
    </>
  );
}
