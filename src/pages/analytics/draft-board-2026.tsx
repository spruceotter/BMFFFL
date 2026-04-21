import { useState, useMemo } from 'react';
import Head from 'next/head';
import { Star, Calendar, Users, Trophy } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type Position = 'QB' | 'RB' | 'WR' | 'TE';
type PosFilter = 'ALL' | Position;
type Tier = 1 | 2 | 3 | 4;
type TierFilter = 'ALL' | Tier;

interface Prospect {
  rank: number;
  name: string;
  pos: Position;
  nflTeam: string;
  tier: Tier;
  dynastyCeiling: string;
  note: string;
}

// ─── Draft Order ──────────────────────────────────────────────────────────────

interface DraftSlotEntry {
  pick: string;
  owner: string;
  note: string;
}

const DRAFT_ORDER: DraftSlotEntry[] = [
  { pick: '1.01', owner: 'Escuelas',        note: 'Worst regular-season record 2025' },
  { pick: '1.02', owner: 'Cogdeill11',      note: '2nd worst record 2025' },
  { pick: '1.03', owner: 'Grandes',         note: '3rd worst record 2025' },
  { pick: '1.04', owner: 'eldridsm',        note: '4th worst record 2025' },
  { pick: '1.05', owner: 'eldridm20',       note: '5th — missed playoffs' },
  { pick: '1.06', owner: 'rbr',             note: '6th — missed playoffs' },
  { pick: '1.07', owner: 'Cmaleski',        note: 'Playoff exit — 1st round' },
  { pick: '1.08', owner: 'SexMachineAndyD', note: 'Playoff exit — quarterfinal' },
  { pick: '1.09', owner: 'JuicyBussy',      note: '3rd place finish 2025' },
  { pick: '1.10', owner: 'MLSchools12',     note: 'Semifinal exit 2025' },
  { pick: '1.11', owner: 'Tubes94',         note: 'Runner-up 2025' },
  { pick: '1.12', owner: 'tdtd19844',       note: '2025 Champion — last pick' },
];

// ─── Big Board Data ───────────────────────────────────────────────────────────

const BIG_BOARD: Prospect[] = [
  // Tier 1 — Dynasty Cornerstones
  {
    rank: 1,
    name: 'Tetairoa McMillan',
    pos: 'WR',
    nflTeam: 'CAR',
    tier: 1,
    dynastyCeiling: 'WR1',
    note: 'Elite size, route running, and hands. Generational WR prospect. 1.01 consensus.',
  },
  {
    rank: 2,
    name: 'Emeka Egbuka',
    pos: 'WR',
    nflTeam: 'TB',
    tier: 1,
    dynastyCeiling: 'WR1/2',
    note: 'Ultra-reliable slot WR landing in a great spot. High floor, elite target share potential.',
  },
  {
    rank: 3,
    name: 'Omarion Hampton',
    pos: 'RB',
    nflTeam: 'LAC',
    tier: 1,
    dynastyCeiling: 'RB1',
    note: 'Complete back. Elite pass-catcher, earns early-down work. Best RB of the class.',
  },
  {
    rank: 4,
    name: 'Quinshon Judkins',
    pos: 'RB',
    nflTeam: 'CLE',
    tier: 1,
    dynastyCeiling: 'RB1/2',
    note: 'High-volume runner with pass-catch upside. Strong landing spot in Cleveland backfield.',
  },
  {
    rank: 5,
    name: 'Luther Burden III',
    pos: 'WR',
    nflTeam: 'CHI',
    tier: 1,
    dynastyCeiling: 'WR1/2',
    note: 'Explosive YAC machine. Chicago slot usage gives him immediate volume.',
  },

  // Tier 2 — Dynasty Starters
  {
    rank: 6,
    name: 'Ollie Gordon',
    pos: 'RB',
    nflTeam: 'TEN',
    tier: 2,
    dynastyCeiling: 'RB2',
    note: 'Big, physical runner. Could take over as Tennessee\'s lead back by Week 1.',
  },
  {
    rank: 7,
    name: 'Isaiah Davis',
    pos: 'RB',
    nflTeam: 'NYJ',
    tier: 2,
    dynastyCeiling: 'RB1/2',
    note: 'Jets need a backfield anchor. Davis has the vision and burst to be the guy.',
  },
  {
    rank: 8,
    name: 'Evan Stewart',
    pos: 'WR',
    nflTeam: 'JAC',
    tier: 2,
    dynastyCeiling: 'WR2',
    note: 'Lightning-quick slot. Jacksonville gives him immediate opportunity in a thin WR corps.',
  },
  {
    rank: 9,
    name: 'Jaylen Wright',
    pos: 'RB',
    nflTeam: 'MIA',
    tier: 2,
    dynastyCeiling: 'RB2',
    note: 'Speed back who can take over in Miami. Excellent receiving upside in Dolphins system.',
  },
  {
    rank: 10,
    name: 'Tez Johnson',
    pos: 'WR',
    nflTeam: 'DEN',
    tier: 2,
    dynastyCeiling: 'WR2',
    note: 'Dynamic route runner. Denver WR corps gives him a clear path to targets.',
  },
  {
    rank: 11,
    name: 'Tahj Washington',
    pos: 'WR',
    nflTeam: 'HOU',
    tier: 2,
    dynastyCeiling: 'WR2',
    note: 'Vertical threat with great hands. Houston targets the boundary — fits his skill set.',
  },
  {
    rank: 12,
    name: 'RaRa Thomas',
    pos: 'WR',
    nflTeam: 'NYG',
    tier: 2,
    dynastyCeiling: 'WR1/2',
    note: 'High upside WR with elite athleticism. New York gives him a starting spot immediately.',
  },

  // Tier 3 — Developmental
  {
    rank: 13,
    name: 'Kaleb Johnson',
    pos: 'RB',
    nflTeam: 'PIT',
    tier: 3,
    dynastyCeiling: 'RB2/3',
    note: 'Powerful downhill runner. Pittsburgh is a strong destination for early work.',
  },
  {
    rank: 14,
    name: 'Cam Ward',
    pos: 'QB',
    nflTeam: 'TEN',
    tier: 3,
    dynastyCeiling: 'QB1',
    note: 'Top QB prospect. Strong arm, mobile. Premium leagues value him near top-5.',
  },
  {
    rank: 15,
    name: 'Jayden Higgins',
    pos: 'WR',
    nflTeam: 'HOU',
    tier: 3,
    dynastyCeiling: 'WR2/3',
    note: '6\'4" boundary WR. Red zone threat with a strong catch radius.',
  },
  {
    rank: 16,
    name: 'Elic Ayomanor',
    pos: 'WR',
    nflTeam: 'LV',
    tier: 3,
    dynastyCeiling: 'WR2/3',
    note: 'Physical WR with contested-catch ability. Las Vegas slot creates target volume.',
  },
  {
    rank: 17,
    name: 'Darien Porter',
    pos: 'WR',
    nflTeam: 'IND',
    tier: 3,
    dynastyCeiling: 'WR2/3',
    note: 'Rangy WR who creates after the catch. Good scheme fit in Indianapolis.',
  },
  {
    rank: 18,
    name: 'Harold Fannin Jr.',
    pos: 'TE',
    nflTeam: 'CLE',
    tier: 3,
    dynastyCeiling: 'TE1',
    note: 'Surprise TE riser. Elite athleticism — landing spot will define ceiling.',
  },
  {
    rank: 19,
    name: 'Justice Haynes',
    pos: 'RB',
    nflTeam: 'NE',
    tier: 3,
    dynastyCeiling: 'RB2/3',
    note: 'Pass-catching specialist. New England backfield opportunity is real.',
  },
  {
    rank: 20,
    name: 'Jack Bech',
    pos: 'WR',
    nflTeam: 'LV',
    tier: 3,
    dynastyCeiling: 'WR3',
    note: 'Reliable slot with strong hands. Steady volume projection.',
  },
  {
    rank: 21,
    name: 'Shedeur Sanders',
    pos: 'QB',
    nflTeam: 'CLE',
    tier: 3,
    dynastyCeiling: 'QB1/2',
    note: 'High IQ, elite pocket presence. Cleveland gives him a real starting path.',
  },
  {
    rank: 22,
    name: 'Kyle Williams',
    pos: 'WR',
    nflTeam: 'BUF',
    tier: 3,
    dynastyCeiling: 'WR2/3',
    note: 'Electric YAC threat. Buffalo\'s offense creates upside for boundary WRs.',
  },
  {
    rank: 23,
    name: 'Dillon Gabriel',
    pos: 'QB',
    nflTeam: 'GB',
    tier: 3,
    dynastyCeiling: 'QB2',
    note: 'Accurate, high-IQ signal caller. Development pick behind Love.',
  },
  {
    rank: 24,
    name: 'Tre Harris',
    pos: 'WR',
    nflTeam: 'LAR',
    tier: 3,
    dynastyCeiling: 'WR2/3',
    note: 'Big-play WR with contested-catch ability. Strong combine measurables.',
  },

  // Tier 4 — Late Round Fliers
  {
    rank: 25,
    name: 'RJ Harvey',
    pos: 'RB',
    nflTeam: 'DEN',
    tier: 4,
    dynastyCeiling: 'RB2/3',
    note: 'Undersized but explosive. Returns value if he wins the Denver backfield.',
  },
  {
    rank: 26,
    name: 'Damien Martinez',
    pos: 'RB',
    nflTeam: 'MIA',
    tier: 4,
    dynastyCeiling: 'RB3',
    note: 'Thumper back. Short-yardage role likely, limited target share.',
  },
  {
    rank: 27,
    name: 'Kaliq Lockett',
    pos: 'WR',
    nflTeam: 'WAS',
    tier: 4,
    dynastyCeiling: 'WR3',
    note: 'Speed demon. Deep threat who needs to refine route running.',
  },
  {
    rank: 28,
    name: 'Isaiah Bond',
    pos: 'WR',
    nflTeam: 'NE',
    tier: 4,
    dynastyCeiling: 'WR3',
    note: 'Pure speed. Slot/return specialist with home-run upside.',
  },
  {
    rank: 29,
    name: 'Jalen Milroe',
    pos: 'QB',
    nflTeam: 'SEA',
    tier: 4,
    dynastyCeiling: 'QB1 (superFlex)',
    note: 'Athleticism is elite. Must improve as a passer. SuperFlex dart throw.',
  },
  {
    rank: 30,
    name: 'Luke Lachey',
    pos: 'TE',
    nflTeam: 'CIN',
    tier: 4,
    dynastyCeiling: 'TE2',
    note: 'Blocker-first TE improving as a receiver. Cincinnati investment is encouraging.',
  },
  {
    rank: 31,
    name: 'Makai Lemon',
    pos: 'WR',
    nflTeam: 'NYJ',
    tier: 4,
    dynastyCeiling: 'WR3',
    note: 'Biletnikoff winner — elite hands. New York WR room is competitive.',
  },
  {
    rank: 32,
    name: 'Eli Stowers',
    pos: 'TE',
    nflTeam: 'DAL',
    tier: 4,
    dynastyCeiling: 'TE1/2',
    note: '45.5" vertical — elite combine. Dallas TE usage is boom-or-bust.',
  },
  {
    rank: 33,
    name: 'Darius Robinson',
    pos: 'WR',
    nflTeam: 'KC',
    tier: 4,
    dynastyCeiling: 'WR3',
    note: 'KC WR opposite Kelce creates volume paths. Strong combine.',
  },
  {
    rank: 34,
    name: 'Elijah Roberts',
    pos: 'RB',
    nflTeam: 'SF',
    tier: 4,
    dynastyCeiling: 'RB3',
    note: 'Power runner. San Francisco system is favorable for patient backs.',
  },
  {
    rank: 35,
    name: 'Brashard Smith',
    pos: 'WR',
    nflTeam: 'KC',
    tier: 4,
    dynastyCeiling: 'WR3',
    note: 'Speed slot with great hands. Role player with ceiling games if healthy.',
  },
  {
    rank: 36,
    name: 'Marcus Simms',
    pos: 'WR',
    nflTeam: 'ATL',
    tier: 4,
    dynastyCeiling: 'WR3',
    note: 'Last-round flier. Touches in Atlanta\'s efficient offense could surprise.',
  },
];

// ─── Positional Breakdown ─────────────────────────────────────────────────────

const POS_BREAKDOWN = [
  { pos: 'WR', count: 18, color: '#f97316', pct: 50 },
  { pos: 'RB', count: 12, color: '#34d399', pct: 33 },
  { pos: 'TE', count: 4,  color: '#a78bfa', pct: 11 },
  { pos: 'QB', count: 2,  color: '#60a5fa', pct: 6  },
] as const;

// ─── Bimfle Draft Notes ───────────────────────────────────────────────────────

const DRAFT_NOTES = [
  {
    subject: 'On Tetairoa McMillan',
    note: '"McMillan is the kind of prospect that comes along once every several years. Comparable dynasty profiles include early Ja\'Marr Chase. If you are picking 1.01, congratulations — you will draft him and be grateful."',
  },
  {
    subject: 'On the RB landscape',
    note: '"Hampton and Judkins both carry genuine RB1 dynasty ceilings. In a class full of wide receivers, securing a bellcow back early is advisable. I would not wait past 1.05 to take the first RB I preferred."',
  },
  {
    subject: 'On late-round strategy',
    note: '"Rounds 2 and 3 should target upside over safety. The gap between picks 13 and 36 is not as large as the rankings suggest — a landing spot surprise can make a third-round pick a genuine dynasty asset."',
  },
];

// ─── Tier Config ──────────────────────────────────────────────────────────────

const TIER_CONFIG: Record<Tier, { label: string; style: string; barColor: string; pickRange: string }> = {
  1: {
    label: 'Tier 1 — Dynasty Cornerstones',
    style: 'bg-[#ffd700]/15 text-[#ffd700] border-[#ffd700]/40',
    barColor: '#ffd700',
    pickRange: 'Picks 1–5',
  },
  2: {
    label: 'Tier 2 — Dynasty Starters',
    style: 'bg-blue-500/15 text-blue-400 border-blue-500/40',
    barColor: '#60a5fa',
    pickRange: 'Picks 6–12',
  },
  3: {
    label: 'Tier 3 — Developmental',
    style: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
    barColor: '#34d399',
    pickRange: 'Picks 13–24',
  },
  4: {
    label: 'Tier 4 — Late Round Fliers',
    style: 'bg-slate-500/15 text-slate-400 border-slate-500/40',
    barColor: '#94a3b8',
    pickRange: 'Picks 25–36',
  },
};

const POS_CONFIG: Record<Position, string> = {
  QB: 'bg-blue-500/15 text-blue-400 border-blue-500/40',
  RB: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
  WR: 'bg-orange-500/15 text-orange-400 border-orange-500/40',
  TE: 'bg-purple-500/15 text-purple-400 border-purple-500/40',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function PosBadge({ pos }: { pos: Position }) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border w-9 shrink-0',
        POS_CONFIG[pos]
      )}
    >
      {pos}
    </span>
  );
}

function TierBadge({ tier }: { tier: Tier }) {
  const cfg = TIER_CONFIG[tier];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap',
        cfg.style
      )}
    >
      T{tier}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const POS_FILTER_OPTIONS: PosFilter[] = ['ALL', 'RB', 'WR', 'TE', 'QB'];
const TIER_FILTER_OPTIONS: Array<{ value: TierFilter; label: string }> = [
  { value: 'ALL', label: 'All Tiers' },
  { value: 1,     label: 'Tier 1' },
  { value: 2,     label: 'Tier 2' },
  { value: 3,     label: 'Tier 3' },
  { value: 4,     label: 'Tier 4' },
];

export default function DraftBoard2026Page() {
  const [posFilter, setPosFilter] = useState<PosFilter>('ALL');
  const [tierFilter, setTierFilter] = useState<TierFilter>('ALL');

  const filtered = useMemo(() => {
    return BIG_BOARD.filter((p) => {
      const posOk = posFilter === 'ALL' || p.pos === posFilter;
      const tierOk = tierFilter === 'ALL' || p.tier === tierFilter;
      return posOk && tierOk;
    });
  }, [posFilter, tierFilter]);

  const tierGroups = useMemo(() => {
    const groups = new Map<Tier, Prospect[]>();
    for (const p of filtered) {
      if (!groups.has(p.tier)) groups.set(p.tier, []);
      groups.get(p.tier)!.push(p);
    }
    return groups;
  }, [filtered]);

  const activeTiers = ([1, 2, 3, 4] as Tier[]).filter((t) => tierGroups.has(t));

  return (
    <>
      <Head>
        <title>2026 Draft Board — BMFFFL Analytics</title>
        <meta
          name="description"
          content="2026 BMFFFL Rookie Draft pre-draft preparation tool. Big board rankings, tiers, draft order, positional breakdown, and Bimfle's scouting notes."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Header */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <Star className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            2026 Draft Board
          </h1>
          <p className="text-slate-400 text-lg">
            Pre-Draft Preparation Tool &mdash; 2026 BMFFFL Rookie Draft
          </p>
        </header>

        {/* Draft Overview */}
        <section className="mb-10" aria-label="Draft overview">
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <h2 className="text-base font-black text-white mb-1">Draft Overview</h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  3 rounds &middot; 36 picks &middot; Snake format &middot; 12 teams.
                  Draft order based on reverse 2025 standings — worst record picks first, champion picks last.
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-[#ffd700]/30 bg-[#ffd700]/5 shrink-0">
                <Calendar className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
                <div>
                  <p className="text-[10px] text-[#ffd700]/70 uppercase tracking-wider font-semibold">Draft Date</p>
                  <p className="text-sm font-bold text-[#ffd700]">TBD — Spring 2026</p>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { label: 'Rounds', value: '3' },
                { label: 'Total Picks', value: '36' },
                { label: 'Format', value: 'Snake' },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg border border-[#2d4a66] bg-[#0d1b2a] px-3 py-2.5 text-center">
                  <p className="text-xl font-black text-[#ffd700] tabular-nums">{value}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Draft Order */}
        <section className="mb-10" aria-label="2026 draft order">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            <h2 className="text-lg font-black text-white">Draft Order</h2>
            <div className="flex-1 h-px bg-[#2d4a66]" aria-hidden="true" />
          </div>
          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm" aria-label="2026 BMFFFL draft order">
                <thead>
                  <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 w-16">Pick</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Owner</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 hidden sm:table-cell">2025 Finish</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3347]">
                  {DRAFT_ORDER.map((entry, i) => {
                    const isFirst = i === 0;
                    const isLast = i === DRAFT_ORDER.length - 1;
                    return (
                      <tr
                        key={entry.pick}
                        className={cn(
                          'transition-colors hover:bg-[#1f3550]',
                          i % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                        )}
                      >
                        <td className={cn(
                          'px-4 py-2.5 font-black font-mono tabular-nums',
                          isFirst ? 'text-[#ffd700]' : isLast ? 'text-slate-500' : 'text-slate-300'
                        )}>
                          {entry.pick}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="font-semibold text-white">{entry.owner}</span>
                          {isLast && (
                            <Trophy className="inline-block ml-1.5 w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-xs text-slate-500 hidden sm:table-cell">
                          {entry.note}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-slate-600">
            Rounds 2 and 3 follow snake format — even rounds reverse. Picks 2.01–2.12 run from mlschools12 back to escuelas.
          </p>
        </section>

        {/* Big Board */}
        <section aria-label="2026 Big Board — Top 36 Prospects">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            <h2 className="text-lg font-black text-white">Big Board — Top 36 Prospects</h2>
            <div className="flex-1 h-px bg-[#2d4a66]" aria-hidden="true" />
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-3">
            {/* Position filter */}
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Position</p>
              <div role="group" aria-label="Position filter" className="flex flex-wrap gap-1.5">
                {POS_FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setPosFilter(opt)}
                    aria-pressed={posFilter === opt}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border',
                      posFilter === opt
                        ? 'bg-[#ffd700] text-[#0d1b2a] border-[#ffd700]'
                        : 'bg-[#16213e] text-slate-400 border-[#2d4a66] hover:border-[#ffd700]/40 hover:text-white'
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Tier filter */}
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Tier</p>
              <div role="group" aria-label="Tier filter" className="flex flex-wrap gap-1.5">
                {TIER_FILTER_OPTIONS.map(({ value, label }) => (
                  <button
                    key={String(value)}
                    type="button"
                    onClick={() => setTierFilter(value)}
                    aria-pressed={tierFilter === value}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border',
                      tierFilter === value
                        ? 'bg-[#ffd700] text-[#0d1b2a] border-[#ffd700]'
                        : 'bg-[#16213e] text-slate-400 border-[#2d4a66] hover:border-[#ffd700]/40 hover:text-white'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results count */}
          <p className="mb-4 text-xs text-slate-500">
            Showing {filtered.length} prospect{filtered.length !== 1 ? 's' : ''}
            {posFilter !== 'ALL' ? ` · ${posFilter}` : ''}
            {tierFilter !== 'ALL' ? ` · Tier ${tierFilter}` : ''}
          </p>

          {/* Prospect list by tier */}
          <div className="space-y-8">
            {activeTiers.map((tier) => {
              const prospects = tierGroups.get(tier)!;
              const cfg = TIER_CONFIG[tier];
              return (
                <section key={tier} aria-label={cfg.label}>
                  {/* Tier header */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className={cn(
                      'inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border',
                      cfg.style
                    )}>
                      {cfg.label}
                    </span>
                    <span className="text-xs text-slate-600">{cfg.pickRange}</span>
                    <div className="flex-1 h-px bg-[#2d4a66]" aria-hidden="true" />
                  </div>

                  {/* Prospect table */}
                  <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm" aria-label={`${cfg.label} prospects`}>
                        <thead>
                          <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                            <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-12">Rank</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">Prospect</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-14">Pos</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-14 hidden sm:table-cell">NFL</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider hidden md:table-cell">Ceiling</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1e3347]">
                          {prospects.map((p, idx) => (
                            <tr
                              key={p.rank}
                              className={cn(
                                'transition-colors hover:bg-[#1f3550]',
                                idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                              )}
                            >
                              <td className="px-4 py-3">
                                <span className="text-xs font-mono font-bold text-slate-400 tabular-nums">
                                  #{p.rank}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="font-bold text-white text-sm block">{p.name}</span>
                                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug max-w-xs">{p.note}</p>
                              </td>
                              <td className="px-4 py-3">
                                <PosBadge pos={p.pos} />
                              </td>
                              <td className="px-4 py-3 hidden sm:table-cell">
                                <span className="text-xs font-mono font-semibold text-slate-300">{p.nflTeam}</span>
                              </td>
                              <td className="px-4 py-3 hidden md:table-cell">
                                <span className={cn(
                                  'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border',
                                  TIER_CONFIG[tier].style
                                )}>
                                  {p.dynastyCeiling}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
              );
            })}

            {filtered.length === 0 && (
              <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-6 py-10 text-center text-slate-500">
                No prospects match the current filters.
              </div>
            )}
          </div>
        </section>

        {/* Positional Breakdown */}
        <section className="mt-12" aria-label="Positional breakdown">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-black text-white">Positional Breakdown</h2>
            <div className="flex-1 h-px bg-[#2d4a66]" aria-hidden="true" />
          </div>
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5">
            <p className="text-xs text-slate-500 mb-4">
              Class composition — 36 prospects across 4 positions. WR-heavy class.
            </p>
            <div className="space-y-3">
              {POS_BREAKDOWN.map(({ pos, count, color, pct }) => (
                <div key={pos} className="flex items-center gap-3">
                  <span
                    className={cn(
                      'w-9 text-center text-[10px] font-bold uppercase tracking-wider py-0.5 rounded border shrink-0',
                      POS_CONFIG[pos as Position]
                    )}
                  >
                    {pos}
                  </span>
                  <div className="flex-1 h-3 rounded-full bg-[#0d1b2a] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-xs font-bold text-white tabular-nums w-6 text-right">{count}</span>
                  <span className="text-xs text-slate-500 tabular-nums w-8 text-right">{pct}%</span>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {POS_BREAKDOWN.map(({ pos, count, color }) => (
                <div key={pos} className="rounded-lg border border-[#2d4a66] bg-[#0d1b2a] px-3 py-2.5 text-center">
                  <p className="text-xl font-black tabular-nums" style={{ color }}>{count}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{pos}s</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bimfle's Draft Notes */}
        <section className="mt-10" aria-label="Bimfle's Draft Notes">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-black text-white">Bimfle&apos;s Draft Notes</h2>
            <div className="flex-1 h-px bg-[#2d4a66]" aria-hidden="true" />
          </div>
          <div className="space-y-3">
            {DRAFT_NOTES.map(({ subject, note }) => (
              <div
                key={subject}
                className="rounded-xl border border-[#ffd700]/20 bg-[#ffd700]/5 px-5 py-4"
              >
                <p className="text-xs text-[#ffd700] font-bold uppercase tracking-widest mb-2">
                  {subject}
                </p>
                <p className="text-slate-300 text-sm leading-relaxed italic">{note}</p>
              </div>
            ))}
            <p className="text-[#ffd700] text-xs font-semibold mt-1 text-right">~Love, Bimfle.</p>
          </div>
        </section>

        {/* Footer disclaimer */}
        <div className="mt-8 text-xs text-slate-600 leading-relaxed">
          <p>
            Rankings are pre-draft estimates as of Spring 2026 and are not affiliated with any official dynasty ranking service.
            Dynasty ceilings are projections, not guarantees. Draft order subject to commissioner confirmation.
          </p>
        </div>

      </div>
    </>
  );
}
