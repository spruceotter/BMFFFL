/**
 * /trades/[id] — Per-trade deep dive
 *
 * Shows the full story of a single BMFFFL trade:
 * - What was swapped (players + picks + FAAB)
 * - Dynasty value at time of trade (who appeared to win)
 * - Actual fantasy points delivered rest of season
 * - Multi-season realized value (incl. picks)
 * - Post-trade ownership chain for each player (where did they go next?)
 *
 * Static: generated at build time from public/data/trade-history.json
 */

import * as fs from 'fs';
import * as path from 'path';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ArrowLeftRight, ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlayerGot { n: string; pos: string; }
interface PickGot {
  round?: number;
  season?: string | number;
  description?: string;
  league_id?: string | null;
  roster_id?: number;
  owner_id?: number;
  previous_owner_id?: number;
}

interface FaabItem { amount: number; receiver: string; sender: string; }

interface PointsPlayer {
  player_id: string;
  name: string;
  position: string;
  post_trade_points: number;
  weeks_remaining: number;
}
interface PointsParty {
  owner: string;
  roster_id: number;
  total_post_trade_points: number;
  players_received: PointsPlayer[];
}

interface DynastyValue {
  year: number;
  p1_ranks: (number | null)[];
  p2_ranks: (number | null)[];
  p1_top: number | null;
  p2_top: number | null;
  winner: 'p1' | 'p2' | 'even' | null;
}

interface RealizedDetail {
  n: string; pts: number; span: string;
  end: 'traded' | 'held';
  flip: 'quick' | 'medium' | 'long' | 'held';
  flip_wks: number | null;
}

interface PickResult {
  r: number; s: string; orig: string;
  name: string | null; pos: string | null;
  pts: number | null; note: string | null;
}

interface RealizedPts {
  p1_pts: number; p2_pts: number;
  p1_detail: RealizedDetail[]; p2_detail: RealizedDetail[];
  winner: 'p1' | 'p2' | 'even' | null;
  p1_picks?: PickResult[]; p2_picks?: PickResult[];
  p1_total?: number; p2_total?: number;
}

interface OwnershipWindow {
  owner: string;
  acquisition_season: string;
  acquisition_type: string;
  acquisition_date?: number | null;
  release_type?: string;
}

interface PlayerProfile {
  player_id: string;
  name: string;
  position: string;
  nfl_team: string;
  current_bmfffl_owner: string | null;
  ownership_history: OwnershipWindow[];
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
  faab?: FaabItem[];
  no_counters?: boolean;
  is_counter?: boolean;
  points_delivered?: PointsParty[];
  dynasty_value?: DynastyValue;
  realized_pts?: RealizedPts;
}

interface Props {
  trade: Trade;
  // player_id → compact ownership windows (post-trade slice only)
  playerOwnership: Record<string, { profile: PlayerProfile; tradeWindowIdx: number }>;
  prevTradeId: string | null;
  nextTradeId: string | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const POS_COLORS: Record<string, string> = {
  QB:  'text-[#f97316]',
  RB:  'text-[#22c55e]',
  WR:  'text-[#38bdf8]',
  TE:  'text-[#fbbf24]',
  K:   'text-slate-400',
  DEF: 'text-slate-400',
  '?': 'text-slate-500',
};

const ACQ_TYPE_LABELS: Record<string, string> = {
  trade: 'traded',
  waiver: 'claimed',
  free_agent: 'free agent',
  auction_draft: 'startup draft',
  startup_draft: 'startup draft',
  rookie_draft_espn: 'rookie draft',
  rookie_draft_sleeper: 'rookie draft',
  commissioner: 'commissioner',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function posColor(pos: string) { return POS_COLORS[pos] ?? POS_COLORS['?']; }

function formatPick(p: PickGot): string {
  if (p.description) return p.description;
  const s = p.season ? String(p.season) : '';
  const r = p.round
    ? (p.round === 1 ? '1st' : p.round === 2 ? '2nd' : p.round === 3 ? '3rd' : `${p.round}th`)
    : '';
  if (s && r) return `${s} ${r}`;
  if (s) return `${s} pick`;
  return 'Draft pick';
}

function acqLabel(type: string) { return ACQ_TYPE_LABELS[type] ?? type; }

// ─── Static generation ────────────────────────────────────────────────────────

export const getStaticPaths: GetStaticPaths = async () => {
  const dataPath = path.join(process.cwd(), 'public', 'data', 'trade-history.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const trades: Trade[] = data.trades ?? [];
  return {
    paths: trades.map(t => ({ params: { id: t.id } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const tradeId = params?.id as string;
  const dataPath = path.join(process.cwd(), 'public', 'data', 'trade-history.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const trades: Trade[] = data.trades ?? [];

  const idx = trades.findIndex(t => t.id === tradeId);
  if (idx === -1) return { notFound: true };

  const trade = trades[idx];
  const prevTradeId = idx > 0 ? trades[idx - 1].id : null;
  const nextTradeId = idx < trades.length - 1 ? trades[idx + 1].id : null;

  // Build player_id → profile map from points_delivered
  const playerOwnership: Record<string, { profile: PlayerProfile; tradeWindowIdx: number }> = {};
  const playersDir = path.join(process.cwd(), 'public', 'data', 'players');

  if (trade.points_delivered) {
    for (const party of trade.points_delivered) {
      for (const pr of party.players_received) {
        if (!pr.player_id) continue;
        const profilePath = path.join(playersDir, `${pr.player_id}.json`);
        if (!fs.existsSync(profilePath)) continue;

        const profile: PlayerProfile = JSON.parse(fs.readFileSync(profilePath, 'utf-8'));

        // Find the window at or just before the trade season
        const tradeSeason = String(trade.season);
        const windows = profile.ownership_history;

        // Find the index of the ownership window that corresponds to around the trade time
        // The owner who "received" the player should be in the windows
        // Find the window where this player was received (acquisition_season matches or closest to trade season)
        let windowIdx = -1;
        for (let i = 0; i < windows.length; i++) {
          const w = windows[i];
          if (w.owner === party.owner && w.acquisition_season <= tradeSeason) {
            windowIdx = i;
          }
        }

        playerOwnership[pr.player_id] = { profile, tradeWindowIdx: windowIdx };
      }
    }
  }

  return { props: { trade, playerOwnership, prevTradeId, nextTradeId } };
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function PosBadge({ pos }: { pos: string }) {
  return <span className={cn('text-[10px] font-bold uppercase shrink-0', posColor(pos))}>{pos}</span>;
}

function SectionHeader({ children, color = 'text-slate-400' }: { children: React.ReactNode; color?: string }) {
  return (
    <h2 className={cn('text-[10px] font-bold uppercase tracking-widest mb-3', color)}>
      {children}
    </h2>
  );
}

function TradePartyColumn({
  owner, players, picks, faab, isWinner, label,
}: {
  owner: string;
  players: PlayerGot[];
  picks: PickGot[];
  faab?: FaabItem[];
  isWinner?: boolean;
  label: string;
}) {
  const receivedFaab = faab?.filter(f => f.receiver === owner) ?? [];

  return (
    <div>
      <p className={cn('text-sm font-bold mb-3', isWinner ? 'text-[#ffd700]' : 'text-white')}>
        {owner}
        {isWinner && <span className="ml-1.5 text-[11px]">★</span>}
        <span className="ml-1 text-[10px] font-normal text-slate-500">{label}</span>
      </p>

      <div className="space-y-1.5">
        {players.map((p, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <PosBadge pos={p.pos} />
            <span className="text-sm text-white font-medium">{p.n}</span>
          </div>
        ))}
        {picks.map((p, i) => (
          <div key={`pick-${i}`} className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-amber-400 shrink-0">PICK</span>
            <span className="text-sm text-amber-200/80 font-medium">{formatPick(p)}</span>
          </div>
        ))}
        {receivedFaab.map((f, i) => (
          <div key={`faab-${i}`} className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-emerald-400 shrink-0">FAAB</span>
            <span className="text-sm text-emerald-200/80 font-medium">${f.amount}</span>
          </div>
        ))}
        {players.length === 0 && picks.length === 0 && receivedFaab.length === 0 && (
          <span className="text-slate-600 text-xs italic">nothing</span>
        )}
      </div>
    </div>
  );
}

function DynastyValueSection({ trade }: { trade: Trade }) {
  const dv = trade.dynasty_value;
  if (!dv) return null;

  const p1ValidRanks = dv.p1_ranks.filter((r): r is number => r !== null);
  const p2ValidRanks = dv.p2_ranks.filter((r): r is number => r !== null);
  if (p1ValidRanks.length === 0 && p2ValidRanks.length === 0) return null;

  const p1Score = p1ValidRanks.reduce((s, r) => s + (1 / r), 0);
  const p2Score = p2ValidRanks.reduce((s, r) => s + (1 / r), 0);
  const totalScore = p1Score + p2Score;
  const p1Pct = totalScore > 0 ? Math.round((p1Score / totalScore) * 100) : 50;
  const p2Pct = 100 - p1Pct;
  const isP1Winner = dv.winner === 'p1';
  const isP2Winner = dv.winner === 'p2';

  function RankBadge({ rank }: { rank: number | null }) {
    if (rank === null) return <span className="text-slate-600 text-xs">–</span>;
    const tier = rank <= 12 ? 'text-[#ffd700] font-bold' :
                 rank <= 36 ? 'text-emerald-400' :
                 rank <= 72 ? 'text-sky-400' : 'text-slate-500';
    return <span className={cn('text-xs font-mono', tier)}>#{rank}</span>;
  }

  return (
    <div className="rounded-xl border border-sky-900/30 bg-[#0d1b2a] p-5">
      <SectionHeader color="text-sky-400">Dynasty Value at Trade Time</SectionHeader>
      <p className="text-[10px] text-slate-600 mb-4">{dv.year} dynasty ADP rankings</p>

      <div className="grid grid-cols-2 gap-6 mb-4">
        <div>
          <p className={cn('text-xs font-semibold mb-2', isP1Winner ? 'text-[#ffd700]' : 'text-slate-400')}>
            {trade.p1} received {isP1Winner && '★'}
          </p>
          <div className="space-y-1">
            {trade.p1gets.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <PosBadge pos={p.pos} />
                <span className="text-xs text-white/80">{p.n}</span>
                <RankBadge rank={dv.p1_ranks[i] ?? null} />
              </div>
            ))}
            {p1ValidRanks.length === 0 && trade.p1picks.length > 0 && (
              <span className="text-[10px] text-slate-600 italic">picks only</span>
            )}
            {p1ValidRanks.length === 0 && trade.p1picks.length === 0 && (
              <span className="text-[10px] text-slate-600 italic">no rank data</span>
            )}
          </div>
        </div>
        <div>
          <p className={cn('text-xs font-semibold mb-2', isP2Winner ? 'text-[#ffd700]' : 'text-slate-400')}>
            {trade.p2} received {isP2Winner && '★'}
          </p>
          <div className="space-y-1">
            {trade.p2gets.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <PosBadge pos={p.pos} />
                <span className="text-xs text-white/80">{p.n}</span>
                <RankBadge rank={dv.p2_ranks[i] ?? null} />
              </div>
            ))}
            {p2ValidRanks.length === 0 && trade.p2picks.length > 0 && (
              <span className="text-[10px] text-slate-600 italic">picks only</span>
            )}
            {p2ValidRanks.length === 0 && trade.p2picks.length === 0 && (
              <span className="text-[10px] text-slate-600 italic">no rank data</span>
            )}
          </div>
        </div>
      </div>

      {/* Value bar */}
      {p1ValidRanks.length > 0 && p2ValidRanks.length > 0 && (
        <div>
          <div className="flex text-[10px] justify-between mb-1">
            <span className={isP1Winner ? 'text-[#ffd700] font-bold' : 'text-slate-500'}>
              {trade.p1} · {p1Pct}%
            </span>
            <span className={isP2Winner ? 'text-[#ffd700] font-bold' : 'text-slate-500'}>
              {trade.p2} · {p2Pct}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-[#1a2d42] overflow-hidden flex">
            <div className={cn('h-full', isP1Winner ? 'bg-[#ffd700]' : 'bg-sky-700')} style={{ width: `${p1Pct}%` }} />
            <div className={cn('h-full', isP2Winner ? 'bg-[#ffd700]' : 'bg-indigo-700')} style={{ width: `${p2Pct}%` }} />
          </div>
          <p className="text-[10px] text-slate-500 mt-1.5">
            {dv.winner === 'even'
              ? 'Roughly even value at time of trade'
              : `${isP1Winner ? trade.p1 : trade.p2} held the dynasty edge (top asset: #${isP1Winner ? dv.p1_top : dv.p2_top})`}
          </p>
        </div>
      )}
    </div>
  );
}

function RealizedPtsSection({ trade }: { trade: Trade }) {
  const rp = trade.realized_pts;
  if (!rp) return null;

  const p1Picks = rp.p1_picks ?? [];
  const p2Picks = rp.p2_picks ?? [];
  const hasData = rp.p1_detail.length > 0 || rp.p2_detail.length > 0 || p1Picks.length > 0 || p2Picks.length > 0;
  if (!hasData) return null;

  const p1Total = rp.p1_total ?? rp.p1_pts;
  const p2Total = rp.p2_total ?? rp.p2_pts;
  const combined = p1Total + p2Total;
  const p1Pct = combined > 0 ? Math.round((p1Total / combined) * 100) : 50;
  const p2Pct = 100 - p1Pct;
  const isP1Winner = rp.winner === 'p1';
  const isP2Winner = rp.winner === 'p2';

  function FlipBadge({ detail }: { detail: RealizedDetail }) {
    if (detail.end !== 'traded') return null;
    const label =
      detail.flip === 'quick'  ? `⚡ quick flip${detail.flip_wks != null ? ` (${detail.flip_wks}w)` : ''}` :
      detail.flip === 'medium' ? `→ flipped${detail.flip_wks != null ? ` wk ${detail.flip_wks}` : ''}` :
      '→ eventually flipped';
    const color = detail.flip === 'quick' ? 'text-amber-400' : detail.flip === 'medium' ? 'text-sky-500' : 'text-sky-600';
    return <span className={cn('text-[9px]', color)}>{label}</span>;
  }

  return (
    <div className="rounded-xl border border-emerald-900/30 bg-[#0a1a10] p-5">
      <SectionHeader color="text-emerald-400">Full Realized Value (Multi-Season)</SectionHeader>
      <p className="text-[10px] text-slate-600 mb-4">PPR fantasy points including draft picks, all seasons</p>

      <div className="grid grid-cols-2 gap-6 mb-4">
        {/* P1 */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <p className={cn('text-xs font-semibold', isP1Winner ? 'text-emerald-400' : 'text-slate-400')}>
              {trade.p1} {isP1Winner && '★'}
            </p>
            <span className={cn('text-sm font-bold font-mono tabular-nums', isP1Winner ? 'text-emerald-400' : 'text-slate-500')}>
              {p1Total.toFixed(1)}
            </span>
          </div>
          <div className="space-y-0.5">
            {rp.p1_detail.map((d, i) => (
              <div key={i} className="flex items-center gap-1 flex-wrap">
                <span className="text-xs text-white/70">{d.n}</span>
                <span className={cn('text-[10px] font-mono font-bold', isP1Winner ? 'text-emerald-400' : 'text-slate-400')}>
                  {d.pts.toFixed(1)}
                </span>
                <span className="text-[9px] text-slate-600">{d.span}</span>
                <FlipBadge detail={d} />
              </div>
            ))}
            {p1Picks.map((pk, i) => (
              <div key={`pk-${i}`} className="flex items-center gap-1 flex-wrap">
                <span className="text-[9px] text-slate-500 font-mono">{pk.s} R{pk.r}</span>
                {pk.name ? (
                  <>
                    <span className="text-xs text-white/60">→ {pk.name}</span>
                    <span className={cn('text-[10px] font-mono font-bold', isP1Winner ? 'text-emerald-400' : 'text-slate-400')}>
                      {(pk.pts ?? 0).toFixed(1)}
                    </span>
                  </>
                ) : (
                  <span className="text-[9px] text-slate-600 italic">{pk.note ?? 'unresolved'}</span>
                )}
              </div>
            ))}
            {rp.p1_detail.length === 0 && p1Picks.length === 0 && (
              <span className="text-[10px] text-slate-600 italic">0 pts</span>
            )}
          </div>
        </div>

        {/* P2 */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <p className={cn('text-xs font-semibold', isP2Winner ? 'text-emerald-400' : 'text-slate-400')}>
              {trade.p2} {isP2Winner && '★'}
            </p>
            <span className={cn('text-sm font-bold font-mono tabular-nums', isP2Winner ? 'text-emerald-400' : 'text-slate-500')}>
              {p2Total.toFixed(1)}
            </span>
          </div>
          <div className="space-y-0.5">
            {rp.p2_detail.map((d, i) => (
              <div key={i} className="flex items-center gap-1 flex-wrap">
                <span className="text-xs text-white/70">{d.n}</span>
                <span className={cn('text-[10px] font-mono font-bold', isP2Winner ? 'text-emerald-400' : 'text-slate-400')}>
                  {d.pts.toFixed(1)}
                </span>
                <span className="text-[9px] text-slate-600">{d.span}</span>
                <FlipBadge detail={d} />
              </div>
            ))}
            {p2Picks.map((pk, i) => (
              <div key={`pk-${i}`} className="flex items-center gap-1 flex-wrap">
                <span className="text-[9px] text-slate-500 font-mono">{pk.s} R{pk.r}</span>
                {pk.name ? (
                  <>
                    <span className="text-xs text-white/60">→ {pk.name}</span>
                    <span className={cn('text-[10px] font-mono font-bold', isP2Winner ? 'text-emerald-400' : 'text-slate-400')}>
                      {(pk.pts ?? 0).toFixed(1)}
                    </span>
                  </>
                ) : (
                  <span className="text-[9px] text-slate-600 italic">{pk.note ?? 'unresolved'}</span>
                )}
              </div>
            ))}
            {rp.p2_detail.length === 0 && p2Picks.length === 0 && (
              <span className="text-[10px] text-slate-600 italic">0 pts</span>
            )}
          </div>
        </div>
      </div>

      {/* Spread bar */}
      {combined > 0 && (
        <div>
          <div className="flex text-[10px] justify-between mb-1">
            <span className={isP1Winner ? 'text-emerald-400 font-bold' : 'text-slate-500'}>{trade.p1} · {p1Pct}%</span>
            <span className={isP2Winner ? 'text-emerald-400 font-bold' : 'text-slate-500'}>{trade.p2} · {p2Pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-[#1a2d42] overflow-hidden flex">
            <div className={cn('h-full', isP1Winner ? 'bg-emerald-500' : 'bg-slate-600')} style={{ width: `${p1Pct}%` }} />
            <div className={cn('h-full', isP2Winner ? 'bg-emerald-500' : 'bg-slate-600')} style={{ width: `${p2Pct}%` }} />
          </div>
          {Math.abs(p1Total - p2Total) > 10 && (
            <p className="text-[10px] text-slate-500 mt-1.5">
              {isP1Winner ? trade.p1 : trade.p2} won by{' '}
              <span className="text-emerald-400 font-bold">{Math.abs(p1Total - p2Total).toFixed(1)} pts</span>
            </p>
          )}
          {rp.winner === 'even' && (
            <p className="text-[10px] text-slate-500 mt-1.5">Roughly even realized value</p>
          )}
        </div>
      )}
    </div>
  );
}

function PlayerJourneySection({
  trade,
  playerOwnership,
}: {
  trade: Trade;
  playerOwnership: Record<string, { profile: PlayerProfile; tradeWindowIdx: number }>;
}) {
  const entries = Object.entries(playerOwnership);
  if (entries.length === 0) return null;

  // Determine which party received which player
  const p1ReceivedIds = new Set<string>();
  const p2ReceivedIds = new Set<string>();
  if (trade.points_delivered) {
    for (const party of trade.points_delivered) {
      const isP1 = party.owner === trade.p1;
      for (const pr of party.players_received) {
        if (isP1) p1ReceivedIds.add(pr.player_id);
        else p2ReceivedIds.add(pr.player_id);
      }
    }
  }

  return (
    <div className="rounded-xl border border-violet-900/30 bg-[#0f0d1a] p-5">
      <SectionHeader color="text-violet-400">Player Journeys After This Trade</SectionHeader>
      <p className="text-[10px] text-slate-600 mb-4">Where each player landed after this deal</p>

      <div className="space-y-5">
        {entries.map(([playerId, { profile, tradeWindowIdx }]) => {
          const windows = profile.ownership_history;
          // Show windows from the trade window onwards (3-4 max)
          const relevantWindows = tradeWindowIdx >= 0
            ? windows.slice(tradeWindowIdx, tradeWindowIdx + 5)
            : windows.slice(-3);

          const receivedBy = p1ReceivedIds.has(playerId) ? trade.p1 : p2ReceivedIds.has(playerId) ? trade.p2 : null;

          return (
            <div key={playerId}>
              <div className="flex items-center gap-2 mb-2">
                <span className={cn('text-[10px] font-bold uppercase', posColor(profile.position))}>
                  {profile.position}
                </span>
                <Link
                  href={`/players/${playerId}`}
                  className="text-sm font-semibold text-white hover:text-[#ffd700] transition-colors"
                >
                  {profile.name}
                </Link>
                {receivedBy && (
                  <span className="text-[10px] text-slate-600">→ {receivedBy}</span>
                )}
                <Link
                  href={`/players/${playerId}`}
                  className="text-[9px] text-slate-600 hover:text-[#ffd700] ml-auto transition-colors"
                >
                  full history →
                </Link>
              </div>

              {/* Ownership chain */}
              <div className="flex flex-wrap items-center gap-1 pl-2">
                {relevantWindows.map((w, i) => (
                  <div key={i} className="flex items-center gap-1">
                    {i > 0 && <ArrowRight className="w-2.5 h-2.5 text-slate-700 shrink-0" />}
                    <div className="inline-flex flex-col items-start">
                      <span className="text-[10px] font-semibold text-white/70">{w.owner}</span>
                      <span className="text-[9px] text-slate-600">
                        {w.acquisition_season} · {acqLabel(w.acquisition_type)}
                      </span>
                    </div>
                  </div>
                ))}
                {profile.current_bmfffl_owner && relevantWindows.length > 0 &&
                  relevantWindows[relevantWindows.length - 1]?.release_type === 'still_held' && (
                  <span className="text-[9px] text-emerald-600 ml-1">← still held</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page component ───────────────────────────────────────────────────────────

export default function TradePage({ trade, playerOwnership, prevTradeId, nextTradeId }: Props) {
  const dateStr = trade.date
    ? new Date(trade.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;
  const weekStr = trade.week ? `Week ${trade.week}` : null;
  const timeStr = [weekStr, dateStr].filter(Boolean).join(' · ');

  // Determine overall winner
  const rpWinner = trade.realized_pts?.winner;
  const dvWinner = trade.dynasty_value?.winner;
  const overallP1Win = rpWinner === 'p1' || (!rpWinner && dvWinner === 'p1');
  const overallP2Win = rpWinner === 'p2' || (!rpWinner && dvWinner === 'p2');

  const title = `${trade.p1} ↔ ${trade.p2} | ${trade.season} Trade Analysis — BMFFFL`;
  const desc = `${trade.season} Season · ${trade.p1gets.map(p => p.n).join(', ') || 'picks'} for ${trade.p2gets.map(p => p.n).join(', ') || 'picks'}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
      </Head>

      <main className="min-h-screen bg-[#0f0f23] text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pt-20">

          {/* ── Breadcrumb / nav ────────────────────────── */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/trades"
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#ffd700] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              All Trades
            </Link>

            <div className="flex items-center gap-3">
              {prevTradeId && (
                <Link href={`/trades/${prevTradeId}`} className="text-xs text-slate-600 hover:text-slate-300 transition-colors">
                  ← Prev
                </Link>
              )}
              {nextTradeId && (
                <Link href={`/trades/${nextTradeId}`} className="text-xs text-slate-600 hover:text-slate-300 transition-colors">
                  Next →
                </Link>
              )}
            </div>
          </div>

          {/* ── Header ──────────────────────────────────── */}
          <div className="mb-8">
            {/* Season + metadata badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-700 text-slate-200">
                {trade.season}
              </span>
              {timeStr && (
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Calendar className="w-3 h-3" />
                  {timeStr}
                </span>
              )}
              {trade.source === 'espn' && (
                <span className="text-[10px] text-slate-600 font-mono">ESPN era</span>
              )}
              {trade.no_counters && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-900/30 text-emerald-400 border border-emerald-700/30">
                  ✓ No counters
                </span>
              )}
              {trade.is_counter && !trade.no_counters && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-900/30 text-indigo-400 border border-indigo-700/30">
                  ↩ Counter-trade
                </span>
              )}
            </div>

            {/* Parties */}
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">
              <span className={overallP1Win ? 'text-[#ffd700]' : 'text-white'}>{trade.p1}</span>
              <span className="text-slate-600 mx-3">↔</span>
              <span className={overallP2Win ? 'text-[#ffd700]' : 'text-white'}>{trade.p2}</span>
            </h1>
            <p className="text-sm text-slate-500">
              {[...trade.p1gets.map(p => p.n), ...trade.p2gets.map(p => p.n)].join(' · ') || 'Pick swap'}
            </p>
          </div>

          {/* ── What Was Traded ──────────────────────────── */}
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5 mb-4">
            <SectionHeader>The Trade</SectionHeader>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_40px_1fr] gap-4 items-start">
              <TradePartyColumn
                owner={trade.p1}
                players={trade.p1gets}
                picks={trade.p1picks}
                faab={trade.faab}
                isWinner={overallP1Win}
                label="receives"
              />
              <div className="hidden sm:flex items-center justify-center pt-5">
                <ArrowLeftRight className="w-5 h-5 text-slate-600" />
              </div>
              <TradePartyColumn
                owner={trade.p2}
                players={trade.p2gets}
                picks={trade.p2picks}
                faab={trade.faab}
                isWinner={overallP2Win}
                label="receives"
              />
            </div>
          </div>

          {/* ── Dynasty Value ────────────────────────────── */}
          <div className="mb-4">
            <DynastyValueSection trade={trade} />
          </div>

          {/* ── Realized Value ───────────────────────────── */}
          <div className="mb-4">
            <RealizedPtsSection trade={trade} />
          </div>

          {/* ── Player Journeys ──────────────────────────── */}
          <div className="mb-8">
            <PlayerJourneySection trade={trade} playerOwnership={playerOwnership} />
          </div>

          {/* ── Footer nav ───────────────────────────────── */}
          <div className="flex items-center justify-between border-t border-[#2d4a66] pt-6">
            <Link href="/trades" className="text-xs text-slate-500 hover:text-[#ffd700] transition-colors">
              ← All Trades
            </Link>
            <div className="flex gap-4">
              {prevTradeId && (
                <Link href={`/trades/${prevTradeId}`} className="text-xs text-slate-500 hover:text-white transition-colors">
                  ← Previous trade
                </Link>
              )}
              {nextTradeId && (
                <Link href={`/trades/${nextTradeId}`} className="text-xs text-slate-500 hover:text-white transition-colors">
                  Next trade →
                </Link>
              )}
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
