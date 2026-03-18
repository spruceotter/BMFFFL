import { useState, useMemo, useCallback } from 'react';
import Head from 'next/head';
import { DollarSign, Gavel, RotateCcw, Zap, ChevronDown, ChevronUp, Info, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type Position = 'QB' | 'RB' | 'WR' | 'TE';

interface AuctionPlayer {
  id: string;
  name: string;
  pos: Position;
  nflTeam: string;
  tier: 1 | 2 | 3 | 4;
  dynastyValue: number;   // 0–100 dynasty value index
  projectedCost: number;  // projected auction dollar cost (out of $200 budget)
  note: string;
}

interface Bid {
  playerId: string;
  owner: string;
  amount: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SALARY_CAP = 200;
const TEAM_COUNT = 12;

const OWNERS = [
  { name: 'rbr',             slug: 'rbr'             },
  { name: 'juicybussy',      slug: 'juicybussy'      },
  { name: 'tubes94',         slug: 'tubes94'         },
  { name: 'mlschools12',     slug: 'mlschools12'     },
  { name: 'eldridsm',        slug: 'eldridsm'        },
  { name: 'sexmachineandy',  slug: 'sexmachineandy'  },
  { name: 'cogdeill11',      slug: 'cogdeill11'      },
  { name: 'grandes',         slug: 'grandes'         },
  { name: 'tdtd19844',       slug: 'tdtd19844'       },
  { name: 'eldridm20',       slug: 'eldridm20'       },
  { name: 'cmaleski',        slug: 'cmaleski'        },
  { name: 'escuelas',        slug: 'escuelas'        },
];

// ─── Player Pool ──────────────────────────────────────────────────────────────

const AUCTION_PLAYERS: AuctionPlayer[] = [
  // Tier 1 — Franchise anchors
  { id: 'cmc',        name: 'Christian McCaffrey', pos: 'RB', nflTeam: 'SF',  tier: 1, dynastyValue: 98, projectedCost: 74, note: 'Perennial RB1, workhorse back for Shanahan. Dynasty cornerstone.' },
  { id: 'breece',     name: 'Breece Hall',          pos: 'RB', nflTeam: 'NYJ', tier: 1, dynastyValue: 94, projectedCost: 62, note: 'Elite pass-catcher and rusher. Top-3 RB1 fantasy seasons ahead.' },
  { id: 'jj',         name: 'Justin Jefferson',     pos: 'WR', nflTeam: 'MIN', tier: 1, dynastyValue: 96, projectedCost: 70, note: 'WR1 consensus. Route-running, contested catches — elite everything.' },
  { id: 'puka',       name: 'Puka Nacua',           pos: 'WR', nflTeam: 'LAR', tier: 1, dynastyValue: 91, projectedCost: 56, note: 'LA\'s WR1. McVay loves him. Target hog with slot/outside versatility.' },
  { id: 'sam',        name: 'Sam LaPorta',          pos: 'TE', nflTeam: 'DET', tier: 1, dynastyValue: 88, projectedCost: 48, note: 'TE1 of his class. Detroit offense loves the TE. Legitimate top-5 TE.' },
  { id: 'jallen',     name: 'Josh Allen',           pos: 'QB', nflTeam: 'BUF', tier: 1, dynastyValue: 97, projectedCost: 44, note: 'SF QB1 consensus. Rushing ceiling is insane. Worth reaching for.' },

  // Tier 2 — High-end starters
  { id: 'bijan',      name: 'Bijan Robinson',       pos: 'RB', nflTeam: 'ATL', tier: 2, dynastyValue: 90, projectedCost: 52, note: 'Falcon bellcow. Dominant when healthy. Must-roster in any format.' },
  { id: 'chase',      name: 'Ja\'Marr Chase',       pos: 'WR', nflTeam: 'CIN', tier: 2, dynastyValue: 92, projectedCost: 58, note: 'Burrow\'s #1 option. Elite ceiling every week. Dynasty WR1 upside.' },
  { id: 'kelce',      name: 'Travis Kelce',          pos: 'TE', nflTeam: 'KC',  tier: 2, dynastyValue: 82, projectedCost: 38, note: 'GOAT TE. Age is a concern but still the safest TE floor in fantasy.' },
  { id: 'lamar',      name: 'Lamar Jackson',         pos: 'QB', nflTeam: 'BAL', tier: 2, dynastyValue: 90, projectedCost: 38, note: 'Back-to-back MVP. Rushing ceiling separates him from every other QB.' },
  { id: 'ceedee',     name: 'CeeDee Lamb',           pos: 'WR', nflTeam: 'DAL', tier: 2, dynastyValue: 93, projectedCost: 60, note: 'Dallas WR1, arguably WR1 dynasty-wide. 100+ catch ceiling.' },
  { id: 'tyreek',     name: 'Tyreek Hill',           pos: 'WR', nflTeam: 'MIA', tier: 2, dynastyValue: 83, projectedCost: 46, note: 'Elite speed WR. Dynasty concern is age but floor remains high.' },
  { id: 'gibbs',      name: 'Jahmyr Gibbs',          pos: 'RB', nflTeam: 'DET', tier: 2, dynastyValue: 89, projectedCost: 50, note: 'Split with Montgomery but still elite touch share. Top-5 dynasty RB.' },
  { id: 'achane',     name: 'De\'Von Achane',        pos: 'RB', nflTeam: 'MIA', tier: 2, dynastyValue: 87, projectedCost: 48, note: 'Fastest player in the NFL. Elite yards per carry, injury risk is real.' },

  // Tier 3 — Strong contributors
  { id: 'mcbride',    name: 'Trey McBride',          pos: 'TE', nflTeam: 'ARI', tier: 3, dynastyValue: 84, projectedCost: 34, note: 'ARI\'s lead TE. High target share, good ceiling in Kingsbury-lite offense.' },
  { id: 'amon',       name: 'Amon-Ra St. Brown',     pos: 'WR', nflTeam: 'DET', tier: 3, dynastyValue: 85, projectedCost: 40, note: 'Slot maestro. 1200+ yard threat every year. Underpriced in auctions.' },
  { id: 'diontae',    name: 'Diontae Johnson',       pos: 'WR', nflTeam: 'CAR', tier: 3, dynastyValue: 74, projectedCost: 22, note: 'New team, solid floor. Route-runner with good hands.' },
  { id: 'jjensen',    name: 'Joe Mixon',             pos: 'RB', nflTeam: 'HOU', tier: 3, dynastyValue: 72, projectedCost: 20, note: 'Houston bellcow in a run-heavy system. Safe workhorse floor.' },
  { id: 'kyren',      name: 'Kyren Williams',        pos: 'RB', nflTeam: 'LAR', tier: 3, dynastyValue: 82, projectedCost: 36, note: 'McVay\'s lead back. Breakout season in 2024. Young and entrenched.' },
  { id: 'dmoore',     name: 'DJ Moore',              pos: 'WR', nflTeam: 'CHI', tier: 3, dynastyValue: 80, projectedCost: 30, note: 'Bears WR1. Should benefit heavily from Williams improvement.' },
  { id: 'kupp',       name: 'Cooper Kupp',           pos: 'WR', nflTeam: 'LAR', tier: 3, dynastyValue: 73, projectedCost: 20, note: 'When healthy he\'s WR1 territory. Health is the only question.' },
  { id: 'zach',       name: 'Zach Charbonnet',       pos: 'RB', nflTeam: 'SEA', tier: 3, dynastyValue: 78, projectedCost: 26, note: 'Walker gone — Charbonnet is the lead back. Solid starter floor.' },

  // Tier 4 — Depth / Upside picks
  { id: 'tucker',     name: 'Jordan Addison',        pos: 'WR', nflTeam: 'MIN', tier: 4, dynastyValue: 71, projectedCost: 16, note: 'Jefferson\'s sidekick. Slot target hog, upside game.' },
  { id: 'njoku',      name: 'David Njoku',            pos: 'TE', nflTeam: 'CLE', tier: 4, dynastyValue: 68, projectedCost: 14, note: 'CLE TE1. Safe floor as primary red-zone TE in a tough situation.' },
  { id: 'devonta',    name: 'DeVonta Smith',          pos: 'WR', nflTeam: 'PHI', tier: 4, dynastyValue: 76, projectedCost: 22, note: 'PHI WR2 but volume is elite. Safe WR2/flex with upside.' },
  { id: 'pollard',    name: 'Tony Pollard',           pos: 'RB', nflTeam: 'TEN', tier: 4, dynastyValue: 64, projectedCost: 12, note: 'TEN lead back. Low upside situation but safe touches in a weak room.' },
  { id: 'odell',      name: 'Rashee Rice',            pos: 'WR', nflTeam: 'KC',  tier: 4, dynastyValue: 79, projectedCost: 26, note: 'KC WR1 after Hill era ends. Mahomes relationship is the upside.' },
  { id: 'hfield',     name: 'Hollywood Brown',        pos: 'WR', nflTeam: 'KC',  tier: 4, dynastyValue: 60, projectedCost: 8,  note: 'Buy low with upside if healthy and in Mahomes orbit.' },
  { id: 'love',       name: 'Jordan Love',            pos: 'QB', nflTeam: 'GB',  tier: 4, dynastyValue: 77, projectedCost: 18, note: 'GB QB1 long-term. Full season should show his true ceiling.' },
  { id: 'tucker2',    name: 'Rhamondre Stevenson',   pos: 'RB', nflTeam: 'NE',  tier: 4, dynastyValue: 58, projectedCost: 8,  note: 'NE lead back in a weak offense — low floor, low ceiling.' },
];

// ─── Position Colors ──────────────────────────────────────────────────────────

const POS_COLOR: Record<Position, string> = {
  QB: 'bg-[#e94560]/15 text-[#e94560] border border-[#e94560]/30',
  RB: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  WR: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  TE: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
};

const POS_DOT: Record<Position, string> = {
  QB: 'bg-[#e94560]',
  RB: 'bg-emerald-500',
  WR: 'bg-blue-500',
  TE: 'bg-yellow-500',
};

const TIER_LABEL: Record<1 | 2 | 3 | 4, string> = {
  1: 'Elite — Franchise Anchors',
  2: 'High-End Starters',
  3: 'Strong Contributors',
  4: 'Depth / Upside Fliers',
};

const TIER_COLOR: Record<1 | 2 | 3 | 4, string> = {
  1: 'text-[#ffd700]',
  2: 'text-blue-400',
  3: 'text-emerald-400',
  4: 'text-slate-400',
};

// ─── Budget Allocation Guide ──────────────────────────────────────────────────

const BUDGET_STRATEGIES = [
  {
    name: 'Stars & Scrubs',
    slug: 'stars',
    description: 'Spend big on 2–3 elite players, fill the rest with $1 picks.',
    allocation: { QB: 15, RB: 40, WR: 35, TE: 5, reserve: 5 },
    risk: 'High',
    upside: 'Elite',
    tip: 'Win or go home — elite players dominate dynasty. If you miss the top-tier RBs/WRs, pivot hard at $1 everywhere else.',
  },
  {
    name: 'Balanced',
    slug: 'balanced',
    description: 'Spread budget across positions for roster depth and flexibility.',
    allocation: { QB: 12, RB: 35, WR: 33, TE: 12, reserve: 8 },
    risk: 'Medium',
    upside: 'Good',
    tip: 'Avoid paying $1 at every position. $8–$15 on a TE like McBride or a WR2 like Amon-Ra can be best value.',
  },
  {
    name: 'RB Heavy',
    slug: 'rb-heavy',
    description: 'Overpay for elite RBs — scarcity makes them most valuable in dynasty.',
    allocation: { QB: 8, RB: 55, WR: 28, TE: 5, reserve: 4 },
    risk: 'Medium',
    upside: 'High',
    tip: 'RB is the scarcest position dynasty-wide. Paying a premium is justified when you\'re getting McCaffrey or Breece Hall.',
  },
  {
    name: 'Positional Value',
    slug: 'pos-value',
    description: 'Target under-priced positions: punt QB (SF streaming), load up WR.',
    allocation: { QB: 5, RB: 30, WR: 52, TE: 8, reserve: 5 },
    risk: 'Medium',
    upside: 'High',
    tip: 'In SF leagues, QB streaming is viable with Love or Stroud. Load WRs in a 4-WR starting lineup. CeeDee + Puka + Amon-Ra = dominant.',
  },
];

// ─── Nomination Tips ──────────────────────────────────────────────────────────

const NOMINATION_TIPS = [
  { tip: 'Nominate a player you don\'t want early', detail: 'Get other teams to burn budget on players outside your target tier. Nominate expensive QBs if you plan to stream.' },
  { tip: 'Nominate your target last', detail: 'Save your key nomination for late — competitors will be cash-strapped, driving prices down on your actual targets.' },
  { tip: 'Track everyone\'s remaining budget', detail: 'If a rival has $40 left and needs 6 players, their max bid is $35 on your guy. Use this to set prices strategically.' },
  { tip: 'Exploit inflation in the room', detail: 'When early bids run high (overspending), stay disciplined — late nominations get huge value as everyone runs low on cash.' },
  { tip: '$1 dart throws have real upside', detail: 'Uncontested $1 players often include depth pieces that hit. Budget winners load up on 4+ $1 players and often win a RB2.' },
];

// ─── Player Card ──────────────────────────────────────────────────────────────

interface PlayerCardProps {
  player: AuctionPlayer;
  bid: Bid | null;
  onBid: (player: AuctionPlayer) => void;
}

function PlayerCard({ player, bid, onBid }: PlayerCardProps) {
  const pct = (player.dynastyValue / 100) * 100;
  const isSold = bid !== null;

  return (
    <div
      className={cn(
        'rounded-lg border overflow-hidden transition-all duration-150',
        isSold
          ? 'border-[#2d4a66] bg-[#16213e] opacity-70'
          : 'border-[#2d4a66] bg-[#16213e] hover:border-[#3a5f80]'
      )}
    >
      {/* Header */}
      <div className="px-3 py-2 bg-[#0f2744] border-b border-[#1e3347] flex items-center gap-2">
        <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-bold uppercase shrink-0', POS_COLOR[player.pos])}>
          {player.pos}
        </span>
        <span className="text-xs font-semibold text-white truncate flex-1">{player.name}</span>
        <span className="text-[10px] text-slate-500 shrink-0">{player.nflTeam}</span>
      </div>

      {/* Body */}
      <div className="px-3 py-2.5">
        {/* Dynasty value bar */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wide">Dynasty Value</span>
            <span className="text-[10px] font-bold text-slate-400 tabular-nums">{player.dynastyValue}/100</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#0d1b2a] overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all', POS_DOT[player.pos])}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Projected cost */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-slate-500">Proj. Cost</span>
          <span className="text-xs font-black text-[#ffd700] tabular-nums">${player.projectedCost}</span>
        </div>

        {/* Note */}
        <p className="text-[11px] text-slate-500 leading-snug mb-2.5 line-clamp-2">{player.note}</p>

        {/* Action / sold state */}
        {isSold ? (
          <div className="rounded-md bg-[#0d1b2a] border border-[#2d4a66] px-2.5 py-1.5 text-center">
            <span className="text-[10px] text-slate-500">Sold to </span>
            <span className="text-[10px] font-bold text-emerald-400">{bid!.owner}</span>
            <span className="text-[10px] text-slate-500"> for </span>
            <span className="text-[10px] font-bold text-[#ffd700]">${bid!.amount}</span>
          </div>
        ) : (
          <button
            onClick={() => onBid(player)}
            className="w-full py-1.5 rounded-md text-xs font-semibold bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] hover:bg-[#ffd700]/20 transition-colors"
          >
            <Gavel className="inline w-3 h-3 mr-1" aria-hidden="true" />
            Record Bid
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Bid Modal ────────────────────────────────────────────────────────────────

interface BidModalProps {
  player: AuctionPlayer;
  ownerBudgets: Record<string, number>;
  onConfirm: (bid: Bid) => void;
  onClose: () => void;
}

function BidModal({ player, ownerBudgets, onConfirm, onClose }: BidModalProps) {
  const [selectedOwner, setSelectedOwner] = useState('');
  const [amount, setAmount] = useState(player.projectedCost);

  const maxBid = selectedOwner ? ownerBudgets[selectedOwner] ?? SALARY_CAP : SALARY_CAP;
  const isValid = selectedOwner && amount >= 1 && amount <= maxBid;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Record bid for ${player.name}`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-md rounded-xl border border-[#2d4a66] bg-[#16213e] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-[#0f2744] border-b border-[#2d4a66]">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-0.5">Recording bid for</p>
          <div className="flex items-center gap-2">
            <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-bold', POS_COLOR[player.pos])}>
              {player.pos}
            </span>
            <h3 className="text-base font-bold text-white">{player.name}</h3>
            <span className="text-sm text-slate-500">{player.nflTeam}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Projected: <span className="text-[#ffd700] font-semibold">${player.projectedCost}</span></p>
        </div>

        {/* Form */}
        <div className="px-5 py-4 space-y-4">
          {/* Owner select */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Winning Owner
            </label>
            <select
              value={selectedOwner}
              onChange={e => setSelectedOwner(e.target.value)}
              className="w-full rounded-lg border border-[#2d4a66] bg-[#0d1b2a] text-white text-sm px-3 py-2 focus:outline-none focus:border-[#ffd700]/50"
            >
              <option value="">— Select owner —</option>
              {OWNERS.map(o => (
                <option key={o.slug} value={o.name}>
                  {o.name} (${ownerBudgets[o.name] ?? SALARY_CAP} left)
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Winning Bid ($)
            </label>
            <input
              type="number"
              min={1}
              max={maxBid}
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              className="w-full rounded-lg border border-[#2d4a66] bg-[#0d1b2a] text-white text-sm px-3 py-2 focus:outline-none focus:border-[#ffd700]/50 tabular-nums"
            />
            {selectedOwner && (
              <p className="mt-1 text-[11px] text-slate-600">
                Max available: <span className="text-slate-400">${maxBid}</span>
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 py-3 border-t border-[#2d4a66] flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-400 hover:text-white border border-[#2d4a66] hover:bg-[#1f3550] transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!isValid}
            onClick={() => {
              if (!isValid) return;
              onConfirm({ playerId: player.id, owner: selectedOwner, amount });
              onClose();
            }}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
              isValid
                ? 'bg-[#ffd700] text-[#0d1b2a] hover:bg-[#ffe033]'
                : 'bg-[#2d4a66] text-slate-500 cursor-not-allowed'
            )}
          >
            Confirm Bid
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Team Budget Row ──────────────────────────────────────────────────────────

function TeamBudgetRow({ ownerName, budget, spent, players }: {
  ownerName: string;
  budget: number;
  spent: number;
  players: { player: AuctionPlayer; bid: Bid }[];
}) {
  const [expanded, setExpanded] = useState(false);
  const spentPct = (spent / SALARY_CAP) * 100;
  const remainingPct = (budget / SALARY_CAP) * 100;

  return (
    <div className="rounded-lg border border-[#2d4a66] bg-[#16213e] overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#1f3550] transition-colors text-left"
        aria-expanded={expanded}
      >
        <span className="font-semibold text-sm text-white flex-1">{ownerName}</span>

        {/* Budget bar */}
        <div className="hidden sm:flex items-center gap-2 w-28">
          <div className="flex-1 h-1.5 rounded-full bg-[#0d1b2a] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#ffd700] transition-all"
              style={{ width: `${remainingPct}%` }}
            />
          </div>
        </div>

        <span className={cn(
          'text-xs font-black tabular-nums shrink-0',
          budget < 20 ? 'text-[#e94560]' : budget < 50 ? 'text-yellow-400' : 'text-emerald-400'
        )}>
          ${budget} left
        </span>
        <span className="text-[10px] text-slate-600 tabular-nums shrink-0">
          ${spent} spent
        </span>
        <span className="text-[10px] text-slate-600 tabular-nums shrink-0">
          {players.length}p
        </span>
        {expanded
          ? <ChevronUp className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
          : <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
        }
      </button>

      {expanded && (
        <div className="border-t border-[#1e3347]">
          {players.length === 0 ? (
            <p className="px-4 py-3 text-xs text-slate-600">No players acquired yet</p>
          ) : (
            <div className="divide-y divide-[#1e3347]">
              {players.map(({ player, bid }) => (
                <div key={player.id} className="px-4 py-2 flex items-center gap-3">
                  <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0', POS_COLOR[player.pos])}>
                    {player.pos}
                  </span>
                  <span className="text-sm text-slate-300 flex-1 truncate">{player.name}</span>
                  <span className="text-[10px] text-slate-500 shrink-0">{player.nflTeam}</span>
                  <span className="text-xs font-bold text-[#ffd700] tabular-nums shrink-0">${bid.amount}</span>
                </div>
              ))}
            </div>
          )}
          {/* Spending breakdown */}
          {players.length > 0 && (
            <div className="px-4 py-2 border-t border-[#1e3347] bg-[#0f2744]">
              <div className="w-full h-2 rounded-full bg-[#0d1b2a] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#ffd700]/60 transition-all"
                  style={{ width: `${spentPct}%` }}
                />
              </div>
              <p className="mt-1 text-[10px] text-slate-600">
                {spentPct.toFixed(0)}% of cap used — {SALARY_CAP - spent}/${SALARY_CAP} remaining
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type TabId = 'board' | 'budgets' | 'strategy';

export default function AuctionDraftPage() {
  const [bids, setBids] = useState<Record<string, Bid>>({});
  const [activeBidPlayer, setActiveBidPlayer] = useState<AuctionPlayer | null>(null);
  const [posFilter, setPosFilter] = useState<Position | 'ALL'>('ALL');
  const [tierFilter, setTierFilter] = useState<1 | 2 | 3 | 4 | 0>(0);
  const [tab, setTab] = useState<TabId>('board');
  const [activeStrategy, setActiveStrategy] = useState('balanced');

  // Owner remaining budgets
  const ownerBudgets = useMemo(() => {
    const budgets: Record<string, number> = {};
    OWNERS.forEach(o => { budgets[o.name] = SALARY_CAP; });
    Object.values(bids).forEach(bid => {
      budgets[bid.owner] = (budgets[bid.owner] ?? SALARY_CAP) - bid.amount;
    });
    return budgets;
  }, [bids]);

  // Per-owner player lists
  const ownerPlayers = useMemo(() => {
    const map: Record<string, { player: AuctionPlayer; bid: Bid }[]> = {};
    OWNERS.forEach(o => { map[o.name] = []; });
    const playerMap = Object.fromEntries(AUCTION_PLAYERS.map(p => [p.id, p]));
    Object.values(bids).forEach(bid => {
      const player = playerMap[bid.playerId];
      if (player) {
        map[bid.owner] = [...(map[bid.owner] ?? []), { player, bid }];
      }
    });
    return map;
  }, [bids]);

  // Filtered players
  const filteredPlayers = useMemo(() => {
    return AUCTION_PLAYERS.filter(p => {
      if (posFilter !== 'ALL' && p.pos !== posFilter) return false;
      if (tierFilter !== 0 && p.tier !== tierFilter) return false;
      return true;
    });
  }, [posFilter, tierFilter]);

  const soldCount = Object.keys(bids).length;
  const totalPlayers = AUCTION_PLAYERS.length;
  const totalSpent = Object.values(bids).reduce((s, b) => s + b.amount, 0);

  const handleConfirmBid = useCallback((bid: Bid) => {
    setBids(prev => ({ ...prev, [bid.playerId]: bid }));
  }, []);

  const handleReset = useCallback(() => {
    setBids({});
  }, []);

  const handleAutoFill = useCallback(() => {
    const newBids: Record<string, Bid> = { ...bids };
    const remainingBudgets: Record<string, number> = { ...ownerBudgets };

    AUCTION_PLAYERS.forEach((player, idx) => {
      if (newBids[player.id]) return;
      const owner = OWNERS[idx % OWNERS.length];
      const ownerRemaining = remainingBudgets[owner.name] ?? 0;
      if (ownerRemaining < 1) return;
      const bid = Math.min(player.projectedCost, ownerRemaining - 1);
      const finalBid = Math.max(1, bid);
      newBids[player.id] = { playerId: player.id, owner: owner.name, amount: finalBid };
      remainingBudgets[owner.name] = (remainingBudgets[owner.name] ?? 0) - finalBid;
    });
    setBids(newBids);
  }, [bids, ownerBudgets]);

  const TABS: { id: TabId; label: string }[] = [
    { id: 'board', label: 'Auction Board' },
    { id: 'budgets', label: 'Team Budgets' },
    { id: 'strategy', label: 'Strategy Guide' },
  ];

  const positions: Array<Position | 'ALL'> = ['ALL', 'QB', 'RB', 'WR', 'TE'];
  const tiers: Array<{ value: 1 | 2 | 3 | 4 | 0; label: string }> = [
    { value: 0, label: 'All Tiers' },
    { value: 1, label: 'Tier 1' },
    { value: 2, label: 'Tier 2' },
    { value: 3, label: 'Tier 3' },
    { value: 4, label: 'Tier 4' },
  ];

  const currentStrategy = BUDGET_STRATEGIES.find(s => s.slug === activeStrategy) ?? BUDGET_STRATEGIES[0];

  return (
    <>
      <Head>
        <title>Auction Draft Simulator — BMFFFL Analytics</title>
        <meta
          name="description"
          content="BMFFFL auction draft simulator — track bids, manage team budgets, and use player value projections for your next dynasty auction draft."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Page header */}
        <header className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <DollarSign className="w-3.5 h-3.5" aria-hidden="true" />
            Auction Draft Simulator
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-2">
            Auction Draft Tool
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl">
            Simulate an auction draft with FAAB-style bidding. Track team budgets, player values,
            and use the strategy guide to optimize your next dynasty auction haul.
          </p>
        </header>

        {/* Stats bar */}
        <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Salary Cap', value: `$${SALARY_CAP}`, sub: 'per team' },
            { label: 'Players Sold', value: `${soldCount}/${totalPlayers}`, sub: 'in pool' },
            { label: 'Total Spent', value: `$${totalSpent.toLocaleString()}`, sub: 'across all teams' },
            { label: 'Teams', value: TEAM_COUNT, sub: '12-team league' },
          ].map(stat => (
            <div key={stat.label} className="rounded-lg border border-[#2d4a66] bg-[#16213e] px-4 py-3">
              <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-0.5">{stat.label}</p>
              <p className="text-2xl font-black text-white tabular-nums">{stat.value}</p>
              <p className="text-[11px] text-slate-600">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#16213e] border border-[#2d4a66]">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                aria-pressed={tab === t.id}
                className={cn(
                  'px-4 py-1.5 rounded-md text-sm font-semibold transition-colors',
                  tab === t.id ? 'bg-[#ffd700] text-[#0d1b2a]' : 'text-slate-400 hover:text-white'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          {tab === 'board' && (
            <div className="flex gap-2">
              <button
                onClick={handleAutoFill}
                disabled={soldCount === totalPlayers}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors',
                  soldCount === totalPlayers
                    ? 'border-[#2d4a66] text-slate-600 cursor-not-allowed bg-[#16213e]'
                    : 'border-[#ffd700]/40 text-[#ffd700] bg-[#ffd700]/5 hover:bg-[#ffd700]/10'
                )}
              >
                <Zap className="w-4 h-4" aria-hidden="true" />
                Auto-Fill
              </button>
              <button
                onClick={handleReset}
                disabled={soldCount === 0}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors',
                  soldCount === 0
                    ? 'border-[#2d4a66] text-slate-600 cursor-not-allowed bg-[#16213e]'
                    : 'border-[#e94560]/30 text-[#e94560] bg-[#e94560]/5 hover:bg-[#e94560]/10'
                )}
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                Reset
              </button>
            </div>
          )}
        </div>

        {/* ── Board Tab ── */}
        {tab === 'board' && (
          <>
            {/* Filters */}
            <div className="mb-4 flex flex-wrap gap-2">
              {positions.map(pos => (
                <button
                  key={pos}
                  onClick={() => setPosFilter(pos)}
                  className={cn(
                    'px-3 py-1 rounded-md text-xs font-semibold transition-colors',
                    posFilter === pos
                      ? 'bg-[#ffd700] text-[#0d1b2a]'
                      : 'bg-[#16213e] border border-[#2d4a66] text-slate-400 hover:text-white'
                  )}
                >
                  {pos}
                </button>
              ))}
              <div className="w-px h-5 bg-[#2d4a66] self-center mx-1" aria-hidden="true" />
              {tiers.map(t => (
                <button
                  key={t.value}
                  onClick={() => setTierFilter(t.value)}
                  className={cn(
                    'px-3 py-1 rounded-md text-xs font-semibold transition-colors',
                    tierFilter === t.value
                      ? 'bg-[#ffd700] text-[#0d1b2a]'
                      : 'bg-[#16213e] border border-[#2d4a66] text-slate-400 hover:text-white'
                  )}
                >
                  {t.label}
                </button>
              ))}
              <span className="ml-auto text-xs text-slate-600 self-center">
                {filteredPlayers.length} players
              </span>
            </div>

            {/* Progress bar */}
            <div className="mb-6 w-full h-1.5 rounded-full bg-[#2d4a66] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#ffd700] transition-all duration-500"
                style={{ width: `${totalPlayers > 0 ? (soldCount / totalPlayers) * 100 : 0}%` }}
                role="progressbar"
                aria-valuenow={soldCount}
                aria-valuemin={0}
                aria-valuemax={totalPlayers}
                aria-label="Auction progress"
              />
            </div>

            {/* Tier groups */}
            {([1, 2, 3, 4] as const).map(tier => {
              const tierPlayers = filteredPlayers.filter(p => p.tier === tier);
              if (tierPlayers.length === 0) return null;
              return (
                <section key={tier} className="mb-8">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className={cn('text-sm font-bold uppercase tracking-wider', TIER_COLOR[tier])}>
                      Tier {tier}
                    </h2>
                    <span className="text-xs text-slate-500">{TIER_LABEL[tier]}</span>
                    <span className="ml-auto text-xs text-slate-600 tabular-nums">
                      {tierPlayers.filter(p => bids[p.id]).length}/{tierPlayers.length} sold
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {tierPlayers.map(player => (
                      <PlayerCard
                        key={player.id}
                        player={player}
                        bid={bids[player.id] ?? null}
                        onBid={setActiveBidPlayer}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </>
        )}

        {/* ── Team Budgets Tab ── */}
        {tab === 'budgets' && (
          <div className="space-y-3">
            <p className="text-sm text-slate-500 mb-4">
              Live budget tracker — updates as bids are recorded on the Auction Board.
            </p>
            {OWNERS.map(owner => (
              <TeamBudgetRow
                key={owner.slug}
                ownerName={owner.name}
                budget={ownerBudgets[owner.name] ?? SALARY_CAP}
                spent={SALARY_CAP - (ownerBudgets[owner.name] ?? SALARY_CAP)}
                players={ownerPlayers[owner.name] ?? []}
              />
            ))}

            {/* Value summary */}
            {soldCount > 0 && (
              <div className="mt-6 rounded-xl border border-[#2d4a66] bg-[#16213e] overflow-hidden">
                <div className="px-4 py-3 bg-[#0f2744] border-b border-[#2d4a66]">
                  <h3 className="text-sm font-bold text-white">Bid Value Summary</h3>
                  <p className="text-xs text-slate-500">Comparing final bid vs projected cost for sold players</p>
                </div>
                <div className="divide-y divide-[#1e3347]">
                  {Object.entries(bids).map(([playerId, bid]) => {
                    const player = AUCTION_PLAYERS.find(p => p.id === playerId);
                    if (!player) return null;
                    const diff = bid.amount - player.projectedCost;
                    const isOver = diff > 0;
                    return (
                      <div key={playerId} className="px-4 py-2 flex items-center gap-3">
                        <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0', POS_COLOR[player.pos])}>
                          {player.pos}
                        </span>
                        <span className="text-sm text-slate-300 flex-1 truncate">{player.name}</span>
                        <span className="text-xs text-slate-500 shrink-0">{bid.owner}</span>
                        <span className="text-xs font-bold text-[#ffd700] tabular-nums shrink-0">${bid.amount}</span>
                        <span className={cn(
                          'text-[10px] font-semibold tabular-nums shrink-0',
                          isOver ? 'text-[#e94560]' : 'text-emerald-400'
                        )}>
                          {isOver ? `+$${diff}` : `-$${Math.abs(diff)}`}
                          <span className="text-slate-600 font-normal ml-0.5">vs proj</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Strategy Tab ── */}
        {tab === 'strategy' && (
          <div className="space-y-8">

            {/* Budget strategies */}
            <section>
              <h2 className="text-base font-bold text-white mb-1">Budget Allocation Strategies</h2>
              <p className="text-sm text-slate-500 mb-4">
                Select a strategy to see the recommended spending breakdown for a {TEAM_COUNT}-team, ${SALARY_CAP} cap auction.
              </p>

              {/* Strategy selector */}
              <div className="flex flex-wrap gap-2 mb-6">
                {BUDGET_STRATEGIES.map(s => (
                  <button
                    key={s.slug}
                    onClick={() => setActiveStrategy(s.slug)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-semibold border transition-colors',
                      activeStrategy === s.slug
                        ? 'bg-[#ffd700] text-[#0d1b2a] border-[#ffd700]'
                        : 'bg-[#16213e] border-[#2d4a66] text-slate-400 hover:text-white'
                    )}
                  >
                    {s.name}
                  </button>
                ))}
              </div>

              {/* Strategy detail */}
              <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] overflow-hidden">
                <div className="px-5 py-4 bg-[#0f2744] border-b border-[#2d4a66]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-white">{currentStrategy.name}</h3>
                      <p className="text-sm text-slate-400 mt-0.5">{currentStrategy.description}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <span className={cn(
                        'px-2 py-1 rounded text-[10px] font-bold uppercase',
                        currentStrategy.risk === 'High'
                          ? 'bg-[#e94560]/15 text-[#e94560] border border-[#e94560]/30'
                          : currentStrategy.risk === 'Medium'
                            ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      )}>
                        {currentStrategy.risk} Risk
                      </span>
                      <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-blue-500/15 text-blue-400 border border-blue-500/30">
                        {currentStrategy.upside} Upside
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-4">
                  {/* Allocation bars */}
                  <div className="space-y-3 mb-4">
                    {Object.entries(currentStrategy.allocation).map(([pos, pct]) => {
                      const dollarAmt = Math.round((pct / 100) * SALARY_CAP);
                      const posKey = pos as Position | 'reserve';
                      const barColor =
                        posKey === 'QB' ? 'bg-[#e94560]'
                        : posKey === 'RB' ? 'bg-emerald-500'
                        : posKey === 'WR' ? 'bg-blue-500'
                        : posKey === 'TE' ? 'bg-yellow-500'
                        : 'bg-slate-500';

                      return (
                        <div key={pos}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-slate-300 uppercase">{pos}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500 tabular-nums">{pct}%</span>
                              <span className="text-xs font-bold text-[#ffd700] tabular-nums">${dollarAmt}</span>
                            </div>
                          </div>
                          <div className="w-full h-2 rounded-full bg-[#0d1b2a] overflow-hidden">
                            <div
                              className={cn('h-full rounded-full transition-all duration-500', barColor)}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bimfle tip */}
                  <div className="rounded-lg bg-[#0d1b2a] border border-[#ffd700]/20 px-4 py-3 flex gap-3">
                    <TrendingUp className="w-4 h-4 text-[#ffd700] shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-semibold text-[#ffd700] mb-0.5">Bimfle's Take</p>
                      <p className="text-xs text-slate-400 leading-relaxed">{currentStrategy.tip}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Nomination tips */}
            <section>
              <h2 className="text-base font-bold text-white mb-1">Nomination Strategy</h2>
              <p className="text-sm text-slate-500 mb-4">
                Who you nominate is as important as what you bid. Use these tactics to gain an edge.
              </p>
              <div className="space-y-3">
                {NOMINATION_TIPS.map((tip, i) => (
                  <div key={i} className="rounded-lg border border-[#2d4a66] bg-[#16213e] px-4 py-3 flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 flex items-center justify-center shrink-0 text-[10px] font-black text-[#ffd700]">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white mb-0.5">{tip.tip}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{tip.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Player value reference */}
            <section>
              <h2 className="text-base font-bold text-white mb-1">Player Value Reference</h2>
              <p className="text-sm text-slate-500 mb-4">
                Projected auction costs in a standard ${SALARY_CAP} cap league. Use as a bidding floor to avoid overpaying.
              </p>
              <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm" aria-label="Player auction values">
                    <thead>
                      <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                        <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Player</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Pos</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 hidden sm:table-cell">Team</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Proj $</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400 hidden md:table-cell">Dynasty</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 hidden lg:table-cell">Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e3347]">
                      {AUCTION_PLAYERS.sort((a, b) => b.dynastyValue - a.dynastyValue).map((player, i) => (
                        <tr
                          key={player.id}
                          className={cn(
                            'hover:bg-[#1f3550] transition-colors',
                            i % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                          )}
                        >
                          <td className="px-4 py-2.5 font-semibold text-white">{player.name}</td>
                          <td className="px-4 py-2.5">
                            <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-bold', POS_COLOR[player.pos])}>
                              {player.pos}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-xs text-slate-500 hidden sm:table-cell">{player.nflTeam}</td>
                          <td className="px-4 py-2.5 text-right font-black text-[#ffd700] tabular-nums">${player.projectedCost}</td>
                          <td className="px-4 py-2.5 text-right text-xs text-slate-400 tabular-nums hidden md:table-cell">{player.dynastyValue}</td>
                          <td className="px-4 py-2.5 text-xs text-slate-500 hidden lg:table-cell max-w-xs truncate">{player.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Disclaimer */}
            <div className="rounded-lg border border-[#2d4a66] bg-[#16213e] px-4 py-3 flex gap-3">
              <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-xs text-slate-500 leading-relaxed">
                Projected auction values are estimates for a 12-team, ${SALARY_CAP} salary cap league using DPAR
                (Dollar Per Point Above Replacement) methodology. Actual clearing prices vary based on league
                preferences, inflation, and nomination order. Values are for strategic planning only.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Bid modal */}
      {activeBidPlayer && (
        <BidModal
          player={activeBidPlayer}
          ownerBudgets={ownerBudgets}
          onConfirm={handleConfirmBid}
          onClose={() => setActiveBidPlayer(null)}
        />
      )}
    </>
  );
}
