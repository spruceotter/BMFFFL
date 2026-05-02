import { useState, useMemo, useCallback } from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import { ArrowLeftRight, Search, Filter, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import * as fs from 'fs';
import * as path from 'path';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlayerGot {
  n: string;   // name
  pos: string; // position
}

interface PickGot {
  season?: number;
  round?: number;
  description?: string;
}

interface PointsParty {
  owner: string;
  roster_id: number;
  total_post_trade_points: number;
  players_received: {
    player_id: string;
    name: string;
    position: string;
    post_trade_points: number;
    weeks_remaining: number;
  }[];
}

interface DynastyValue {
  year: number;
  p1_ranks: (number | null)[];
  p2_ranks: (number | null)[];
  p1_top: number | null;
  p2_top: number | null;
  winner: 'p1' | 'p2' | 'even' | null;
}

interface Trade {
  id: string;
  season: number;
  week: number | null;
  date: string | null;
  source: 'espn' | 'sleeper';
  p1: string;
  p2: string;
  p1gets: PlayerGot[];
  p2gets: PlayerGot[];
  p1picks: PickGot[];
  p2picks: PickGot[];
  points_delivered?: PointsParty[];
  dynasty_value?: DynastyValue;
}

interface TradeHistoryData {
  generated_at: string;
  total: number;
  by_season: Record<string, number>;
  trades: Trade[];
}

interface TradesPageProps {
  data: TradeHistoryData;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SEASON_COLORS: Record<number, string> = {
  2018: 'bg-slate-700 text-slate-200',
  2019: 'bg-slate-700 text-slate-200',
  2020: 'bg-blue-900/60 text-blue-200',
  2021: 'bg-indigo-900/60 text-indigo-200',
  2022: 'bg-violet-900/60 text-violet-200',
  2023: 'bg-purple-900/60 text-purple-200',
  2024: 'bg-fuchsia-900/60 text-fuchsia-200',
  2025: 'bg-rose-900/60 text-rose-200',
};

const POS_COLORS: Record<string, string> = {
  QB:  'text-[#f97316]',
  RB:  'text-[#22c55e]',
  WR:  'text-[#38bdf8]',
  TE:  'text-[#fbbf24]',
  K:   'text-slate-400',
  DEF: 'text-slate-400',
  '?': 'text-slate-500',
};

// All owners with trades (Sleeper canonical + ESPN alumni)
const ALL_OWNERS = [
  'Grandes', 'MLSchools12', 'Cmaleski', 'SexMachineAndyD', 'eldridsm',
  'JuicyBussy', 'Escuelas', 'Tubes94', 'eldridm20', 'MCSchools',
  'Cogdeill11', 'tdtd19844', 'rbr', 'MMoodie12', 'Miroslav', 'Homer473',
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function posColor(pos: string): string {
  return POS_COLORS[pos] ?? POS_COLORS['?'];
}

function formatPick(p: PickGot): string {
  if (p.description) return p.description;
  if (p.season && p.round) {
    const ordinal = p.round === 1 ? '1st' : p.round === 2 ? '2nd' : p.round === 3 ? '3rd' : `${p.round}th`;
    return `${p.season} ${ordinal}`;
  }
  if (p.season) return `${p.season} pick`;
  return 'Draft pick';
}

function tradeLabel(t: Trade): string {
  const allPlayers = [
    ...t.p1gets.map(p => p.n),
    ...t.p2gets.map(p => p.n),
  ];
  if (allPlayers.length === 0) return 'Pick swap';
  if (allPlayers.length <= 3) return allPlayers.join(' · ');
  return allPlayers.slice(0, 2).join(' · ') + ` +${allPlayers.length - 2} more`;
}

function tradeMatchesSearch(t: Trade, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  const searchable = [
    t.p1, t.p2,
    ...t.p1gets.map(p => p.n),
    ...t.p2gets.map(p => p.n),
    ...t.p1picks.map(formatPick),
    ...t.p2picks.map(formatPick),
  ].join(' ').toLowerCase();
  return searchable.includes(q);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SeasonBadge({ season }: { season: number }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded text-xs font-bold tabular-nums',
      SEASON_COLORS[season] ?? 'bg-slate-700 text-slate-200'
    )}>
      {season}
    </span>
  );
}

function PosBadge({ pos }: { pos: string }) {
  return (
    <span className={cn('text-[10px] font-bold uppercase', posColor(pos))}>
      {pos}
    </span>
  );
}

function PlayerList({
  players,
  picks,
  owner,
}: {
  players: PlayerGot[];
  picks: PickGot[];
  owner: string;
}) {
  const hasPlayers = players.length > 0;
  const hasPicks = picks.length > 0;

  if (!hasPlayers && !hasPicks) {
    return <span className="text-slate-600 text-xs italic">nothing</span>;
  }

  return (
    <div className="space-y-0.5">
      {players.map((p, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <PosBadge pos={p.pos} />
          <span className="text-sm text-white font-medium leading-tight">{p.n}</span>
        </div>
      ))}
      {picks.map((p, i) => (
        <div key={`pick-${i}`} className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase text-amber-400">PICK</span>
          <span className="text-sm text-amber-200/80 font-medium leading-tight">{formatPick(p)}</span>
        </div>
      ))}
    </div>
  );
}

function TradeCard({
  trade,
  expanded,
  onToggle,
}: {
  trade: Trade;
  expanded: boolean;
  onToggle: () => void;
}) {
  const label = tradeLabel(trade);
  const weekStr = trade.week ? `Wk ${trade.week}` : null;
  const dateStr = trade.date ?? null;

  return (
    <div
      className={cn(
        'rounded-xl border transition-all duration-150',
        'bg-[#16213e]',
        expanded
          ? 'border-[#ffd700]/30 shadow-lg shadow-black/30'
          : 'border-[#2d4a66] hover:border-[#3a5a7a]'
      )}
    >
      {/* ── Collapsed header ─────────────────────────────────────────── */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left px-4 py-3 flex items-center gap-3 min-h-[56px]"
        aria-expanded={expanded}
        aria-label={`Trade: ${trade.p1} and ${trade.p2} — ${label}`}
      >
        {/* Season badge */}
        <div className="shrink-0">
          <SeasonBadge season={trade.season} />
        </div>

        {/* Week / date */}
        <div className="shrink-0 text-xs text-slate-500 tabular-nums w-14 text-right">
          {weekStr ?? (dateStr ? dateStr.slice(5) : '—')}
        </div>

        {/* Parties */}
        <div className="flex items-center gap-1.5 shrink-0 min-w-0">
          <span className="text-xs font-semibold text-white truncate max-w-[80px] sm:max-w-none">
            {trade.p1}
          </span>
          <ArrowLeftRight className="w-3 h-3 text-slate-500 shrink-0" aria-hidden="true" />
          <span className="text-xs font-semibold text-white truncate max-w-[80px] sm:max-w-none">
            {trade.p2}
          </span>
        </div>

        {/* Players preview */}
        <div className="flex-1 min-w-0 hidden sm:block">
          <p className="text-xs text-slate-400 truncate">{label}</p>
        </div>

        {/* Expand icon */}
        <div className="shrink-0 ml-auto text-slate-500">
          {expanded
            ? <ChevronUp className="w-4 h-4" />
            : <ChevronDown className="w-4 h-4" />
          }
        </div>
      </button>

      {/* ── Expanded detail ───────────────────────────────────────────── */}
      {expanded && (
        <div className="border-t border-[#2d4a66] px-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-start">

            {/* Party 1 receives */}
            <div>
              <p className="text-xs font-bold text-[#ffd700] mb-2 uppercase tracking-wider">
                {trade.p1} receives
              </p>
              <PlayerList
                players={trade.p1gets}
                picks={trade.p1picks}
                owner={trade.p1}
              />
            </div>

            {/* Arrow divider */}
            <div className="hidden sm:flex items-center justify-center pt-6">
              <ArrowLeftRight className="w-5 h-5 text-slate-600" aria-hidden="true" />
            </div>

            {/* Party 2 receives */}
            <div>
              <p className="text-xs font-bold text-[#ffd700] mb-2 uppercase tracking-wider">
                {trade.p2} receives
              </p>
              <PlayerList
                players={trade.p2gets}
                picks={trade.p2picks}
                owner={trade.p2}
              />
            </div>
          </div>

          {/* ── Dynasty Value at Time of Trade ───────────────────────── */}
          {trade.dynasty_value && (() => {
            const dv = trade.dynasty_value;
            const p1Ranks = dv.p1_ranks;
            const p2Ranks = dv.p2_ranks;
            const p1ValidRanks = p1Ranks.filter((r): r is number => r !== null);
            const p2ValidRanks = p2Ranks.filter((r): r is number => r !== null);
            const hasAny = p1ValidRanks.length > 0 || p2ValidRanks.length > 0;
            if (!hasAny) return null;

            // For the bar chart: lower rank = higher value
            // Score = 1/rank (so rank 1 = 1.0, rank 100 = 0.01)
            const p1Score = p1ValidRanks.reduce((s, r) => s + (1 / r), 0);
            const p2Score = p2ValidRanks.reduce((s, r) => s + (1 / r), 0);
            const totalScore = p1Score + p2Score;
            const p1Pct = totalScore > 0 ? Math.round((p1Score / totalScore) * 100) : 50;
            const p2Pct = 100 - p1Pct;

            const isP1Winner = dv.winner === 'p1';
            const isP2Winner = dv.winner === 'p2';
            const isEven = dv.winner === 'even';

            function rankBadge(rank: number | null) {
              if (rank === null) return null;
              const tier = rank <= 12 ? 'text-[#ffd700] font-bold' :
                           rank <= 36 ? 'text-emerald-400' :
                           rank <= 72 ? 'text-sky-400' :
                           'text-slate-500';
              return (
                <span className={cn('text-[9px] font-mono ml-1 shrink-0', tier)}>
                  #{rank}
                </span>
              );
            }

            return (
              <div className="mt-4 rounded-lg bg-[#0d1b2a] border border-sky-900/30 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">
                    Dynasty Value at Time of Trade
                  </span>
                  <span className="text-[10px] text-slate-600">— {dv.year} dynasty ADP rankings</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  {/* P1 haul */}
                  <div>
                    <p className={cn('text-xs font-semibold mb-1.5', isP1Winner ? 'text-[#ffd700]' : 'text-slate-400')}>
                      {trade.p1} received
                      {isP1Winner && <span className="ml-1 text-[9px]">★</span>}
                    </p>
                    <div className="space-y-0.5">
                      {trade.p1gets.map((p, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <span className={cn('text-[10px] font-bold uppercase', posColor(p.pos))}>{p.pos}</span>
                          <span className="text-xs text-white/80">{p.n}</span>
                          {rankBadge(p1Ranks[i] ?? null)}
                        </div>
                      ))}
                      {p1ValidRanks.length === 0 && <span className="text-[10px] text-slate-600 italic">no rank data</span>}
                    </div>
                  </div>

                  {/* P2 haul */}
                  <div>
                    <p className={cn('text-xs font-semibold mb-1.5', isP2Winner ? 'text-[#ffd700]' : 'text-slate-400')}>
                      {trade.p2} received
                      {isP2Winner && <span className="ml-1 text-[9px]">★</span>}
                    </p>
                    <div className="space-y-0.5">
                      {trade.p2gets.map((p, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <span className={cn('text-[10px] font-bold uppercase', posColor(p.pos))}>{p.pos}</span>
                          <span className="text-xs text-white/80">{p.n}</span>
                          {rankBadge(p2Ranks[i] ?? null)}
                        </div>
                      ))}
                      {p2ValidRanks.length === 0 && <span className="text-[10px] text-slate-600 italic">no rank data</span>}
                    </div>
                  </div>
                </div>

                {/* Value bar */}
                {p1ValidRanks.length > 0 && p2ValidRanks.length > 0 && (
                  <div className="mt-2">
                    <div className="flex text-[9px] text-slate-500 justify-between mb-1">
                      <span className={isP1Winner ? 'text-[#ffd700] font-bold' : ''}>{trade.p1} {p1Pct}%</span>
                      <span className={isP2Winner ? 'text-[#ffd700] font-bold' : ''}>{trade.p2} {p2Pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#1a2d42] overflow-hidden flex">
                      <div
                        className={cn('h-full transition-all', isP1Winner ? 'bg-[#ffd700]' : 'bg-sky-700')}
                        style={{ width: `${p1Pct}%` }}
                      />
                      <div
                        className={cn('h-full transition-all', isP2Winner ? 'bg-[#ffd700]' : 'bg-indigo-700')}
                        style={{ width: `${p2Pct}%` }}
                      />
                    </div>
                    {isEven && (
                      <p className="text-[10px] text-slate-500 mt-1">Roughly even value at time of trade</p>
                    )}
                    {(isP1Winner || isP2Winner) && (
                      <p className="text-[10px] text-slate-500 mt-1">
                        {isP1Winner ? trade.p1 : trade.p2}{' '}
                        had the edge in dynasty value (top asset: #{isP1Winner ? dv.p1_top : dv.p2_top})
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {/* ── How It Aged: points delivered ───────────────────────── */}
          {trade.points_delivered && trade.points_delivered.length > 0 && (() => {
            const parties = trade.points_delivered;
            const sorted = [...parties].sort((a, b) => b.total_post_trade_points - a.total_post_trade_points);
            const winner = sorted[0];
            const loser = sorted[sorted.length - 1];
            const spread = winner.total_post_trade_points - loser.total_post_trade_points;
            const winnerPct = winner.total_post_trade_points > 0
              ? Math.round((winner.total_post_trade_points / (winner.total_post_trade_points + loser.total_post_trade_points)) * 100)
              : 50;

            return (
              <div className="mt-4 rounded-lg bg-[#0d1b2a] border border-[#ffd700]/20 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold text-[#ffd700] uppercase tracking-widest">
                    How It Aged
                  </span>
                  <span className="text-[10px] text-slate-600">— fantasy points delivered rest of season</span>
                </div>
                <div className="space-y-2">
                  {sorted.map((party) => {
                    const pts = party.total_post_trade_points;
                    const isWinner = party.owner === winner.owner;
                    const barPct = winner.total_post_trade_points > 0
                      ? (pts / winner.total_post_trade_points) * 100
                      : 50;
                    return (
                      <div key={party.owner} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className={cn(
                            'font-semibold',
                            isWinner ? 'text-[#ffd700]' : 'text-slate-400'
                          )}>
                            {party.owner}
                          </span>
                          <span className={cn(
                            'font-mono font-bold tabular-nums',
                            isWinner ? 'text-[#ffd700]' : 'text-slate-400'
                          )}>
                            {pts.toFixed(1)} pts
                          </span>
                        </div>
                        <div className="h-1.5 bg-[#1a2d42] rounded-full overflow-hidden">
                          <div
                            className={cn('h-full rounded-full transition-all', isWinner ? 'bg-[#ffd700]' : 'bg-slate-600')}
                            style={{ width: `${Math.max(barPct, 3)}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-slate-600">
                          {party.players_received.map(p => `${p.name} (${p.post_trade_points.toFixed(0)})`).join(' · ') || '—'}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {spread > 10 && (
                  <p className="mt-3 text-[10px] text-slate-500">
                    {winner.owner} won the deal by{' '}
                    <span className="text-[#ffd700] font-bold">{spread.toFixed(1)} pts</span>
                    {' '}({winnerPct}% of combined production)
                  </p>
                )}
                {sorted[0].players_received[0] && (
                  <p className="text-[10px] text-slate-600 mt-1">
                    {sorted[0].players_received[0].weeks_remaining} weeks of season remaining at time of trade
                  </p>
                )}
              </div>
            );
          })()}

          {/* Meta row */}
          <div className="mt-4 pt-3 border-t border-[#1e3347] flex items-center gap-4 text-[10px] text-slate-600 uppercase tracking-wider">
            <span>
              {trade.source === 'espn' ? 'ESPN era' : 'Sleeper era'}
            </span>
            {dateStr && <span>{dateStr}</span>}
            {weekStr && !dateStr && <span>Week {trade.week}</span>}
            <span className="font-mono opacity-50">{trade.id.slice(0, 8)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Stats Bar ─────────────────────────────────────────────────────────────────

function StatsBar({
  trades,
  filteredCount,
}: {
  trades: Trade[];
  filteredCount: number;
}) {
  // Most active trader
  const counts: Record<string, number> = {};
  for (const t of trades) {
    counts[t.p1] = (counts[t.p1] ?? 0) + 1;
    if (t.p2) counts[t.p2] = (counts[t.p2] ?? 0) + 1;
  }
  const topTrader = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const seasons = new Set(trades.map(t => t.season)).size;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      {[
        { label: 'Total Trades', value: filteredCount === trades.length ? trades.length : `${filteredCount} / ${trades.length}` },
        { label: 'Seasons', value: seasons },
        { label: 'Most Active', value: topTrader ? `${topTrader[0]}` : '—' },
        { label: 'Data Coverage', value: '2018–2025' },
      ].map(({ label, value }) => (
        <div
          key={label}
          className="rounded-xl bg-[#16213e] border border-[#2d4a66] px-4 py-3"
        >
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-xl font-black text-white tabular-nums">{value}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function TradesPage({ data }: TradesPageProps) {
  const [seasonFilter, setSeasonFilter] = useState<string>('all');
  const [ownerFilter, setOwnerFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const seasons = useMemo(
    () => Object.keys(data.by_season).sort().reverse(),
    [data.by_season]
  );

  // Owners who appear in trades (in order of activity)
  const activeOwners = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const t of data.trades) {
      counts[t.p1] = (counts[t.p1] ?? 0) + 1;
      if (t.p2) counts[t.p2] = (counts[t.p2] ?? 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([owner]) => owner);
  }, [data.trades]);

  const filtered = useMemo(() => {
    let result = data.trades;
    if (seasonFilter !== 'all') {
      result = result.filter(t => String(t.season) === seasonFilter);
    }
    if (ownerFilter !== 'all') {
      result = result.filter(t => t.p1 === ownerFilter || t.p2 === ownerFilter);
    }
    if (searchQuery.trim()) {
      result = result.filter(t => tradeMatchesSearch(t, searchQuery.trim()));
    }
    return result;
  }, [data.trades, seasonFilter, ownerFilter, searchQuery]);

  const handleToggle = useCallback((id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  }, []);

  const isFiltered = seasonFilter !== 'all' || ownerFilter !== 'all' || searchQuery.trim();

  return (
    <>
      <Head>
        <title>Trade History — BMFFFL</title>
        <meta
          name="description"
          content="Every trade in BMFFFL history — 291 deals from 2018 to 2025. Filter by owner, season, or player."
        />
      </Head>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Page header ───────────────────────────────────────────────── */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e94560]/10 border border-[#e94560]/30 text-[#e94560] text-xs font-semibold uppercase tracking-widest mb-4">
            <ArrowLeftRight className="w-3.5 h-3.5" aria-hidden="true" />
            Trade History
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-2">
            The Deal Sheet
          </h1>
          <p className="text-slate-400 text-lg">
            {data.total} trades &bull; 2018&ndash;2025
          </p>
          <p className="text-slate-600 text-sm mt-1">
            ESPN era 2018&ndash;2019 &bull; Sleeper era 2020&ndash;2025
          </p>
        </header>

        {/* ── Stats bar ─────────────────────────────────────────────────── */}
        <StatsBar trades={data.trades} filteredCount={filtered.length} />

        {/* ── Filters ───────────────────────────────────────────────────── */}
        <div className="mb-6 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search by player, owner…"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setExpandedId(null);
              }}
              className={cn(
                'w-full pl-10 pr-4 py-2.5 rounded-xl text-sm',
                'bg-[#16213e] border border-[#2d4a66] text-white placeholder:text-slate-500',
                'focus:outline-none focus:border-[#ffd700]/40 focus:ring-1 focus:ring-[#ffd700]/20',
              )}
              aria-label="Search trades"
            />
          </div>

          {/* Toggle filters */}
          <button
            type="button"
            onClick={() => setShowFilters(f => !f)}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors duration-150"
            aria-expanded={showFilters}
          >
            <Filter className="w-3.5 h-3.5" aria-hidden="true" />
            {showFilters ? 'Hide filters' : 'Show filters'}
            {isFiltered && !showFilters && (
              <span className="px-1.5 py-0.5 rounded bg-[#ffd700]/20 text-[#ffd700] text-[10px] font-bold">
                Active
              </span>
            )}
          </button>

          {showFilters && (
            <div className="flex flex-wrap gap-3">
              {/* Season filter */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-500 uppercase tracking-wider" htmlFor="season-filter">
                  Season
                </label>
                <select
                  id="season-filter"
                  value={seasonFilter}
                  onChange={e => {
                    setSeasonFilter(e.target.value);
                    setExpandedId(null);
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm',
                    'bg-[#16213e] border border-[#2d4a66] text-white',
                    'focus:outline-none focus:border-[#ffd700]/40',
                  )}
                  aria-label="Filter by season"
                >
                  <option value="all">All seasons</option>
                  {seasons.map(s => (
                    <option key={s} value={s}>
                      {s} ({data.by_season[s]} trades)
                    </option>
                  ))}
                </select>
              </div>

              {/* Owner filter */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-500 uppercase tracking-wider" htmlFor="owner-filter">
                  Owner
                </label>
                <select
                  id="owner-filter"
                  value={ownerFilter}
                  onChange={e => {
                    setOwnerFilter(e.target.value);
                    setExpandedId(null);
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm',
                    'bg-[#16213e] border border-[#2d4a66] text-white',
                    'focus:outline-none focus:border-[#ffd700]/40',
                  )}
                  aria-label="Filter by owner"
                >
                  <option value="all">All owners</option>
                  {activeOwners.map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              {/* Reset */}
              {isFiltered && (
                <button
                  type="button"
                  onClick={() => {
                    setSeasonFilter('all');
                    setOwnerFilter('all');
                    setSearchQuery('');
                    setExpandedId(null);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 border border-[#2d4a66] hover:border-[#e94560]/40 hover:text-white transition-all duration-150"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Results count ─────────────────────────────────────────────── */}
        {isFiltered && (
          <p className="text-xs text-slate-500 mb-4 tabular-nums">
            Showing {filtered.length} of {data.total} trades
          </p>
        )}

        {/* ── Trade list ────────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <ArrowLeftRight className="w-10 h-10 mx-auto mb-4 opacity-30" aria-hidden="true" />
            <p className="text-sm">No trades match your filters.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(trade => (
              <TradeCard
                key={trade.id}
                trade={trade}
                expanded={expandedId === trade.id}
                onToggle={() => handleToggle(trade.id)}
              />
            ))}
          </div>
        )}

        {/* ── Data notes ───────────────────────────────────────────────── */}
        <footer className="mt-12 pt-8 border-t border-[#2d4a66]">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Data Notes
          </h2>
          <ul className="space-y-1.5 text-xs text-slate-600">
            <li>
              <span className="text-slate-500 font-semibold">2018–2019 (ESPN era):</span>{' '}
              34 trades via ESPN Fantasy API. Trade dates available; week numbers not.
            </li>
            <li>
              <span className="text-slate-500 font-semibold">2020–2025 (Sleeper era):</span>{' '}
              257 trades from local Sleeper database. Trade timestamps unavailable (known data bug); sorted by week.
            </li>
            <li>
              <span className="text-slate-500 font-semibold">2016–2017:</span>{' '}
              ESPN API does not store transaction history for pre-2018 seasons. ~13 Facebook group records exist but are unstructured.
            </li>
            <li>
              <span className="text-slate-500 font-semibold">Draft picks:</span>{' '}
              Captured for Sleeper era only; ESPN era trades show players only.
            </li>
          </ul>
        </footer>

      </div>
    </>
  );
}

// ─── getStaticProps ───────────────────────────────────────────────────────────

export const getStaticProps: GetStaticProps<TradesPageProps> = async () => {
  const dataPath = path.join(process.cwd(), 'public', 'data', 'trade-history.json');
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const data: TradeHistoryData = JSON.parse(raw);

  return {
    props: { data },
  };
};
