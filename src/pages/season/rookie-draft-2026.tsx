import Head from 'next/head';
import Link from 'next/link';
import { Calendar, ClipboardList, TrendingUp, BarChart2, Trophy, Info } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type Position = 'QB' | 'RB' | 'WR' | 'TE';
type ProspectTier = 'Elite' | 'Tier1' | 'Tier2';

interface Prospect {
  name: string;
  pos: Position;
  college: string;
  description: string;
  tier: ProspectTier;
}

interface PickInventoryRow {
  owner: string;
  picks: (string | null)[];
}

// ─── Draft Order ──────────────────────────────────────────────────────────────

const DRAFT_ORDER: { owner: string; pick: string; isChamp?: boolean }[] = [
  { owner: 'Escuelas',        pick: '1.01' },
  { owner: 'Cogdeill11',      pick: '1.02' },
  { owner: 'Grandes',         pick: '1.03' },
  { owner: 'eldridsm',        pick: '1.04' },
  { owner: 'eldridm20',       pick: '1.05' },
  { owner: 'rbr',             pick: '1.06' },
  { owner: 'Cmaleski',        pick: '1.07' },
  { owner: 'SexMachineAndyD', pick: '1.08' },
  { owner: 'JuicyBussy',      pick: '1.09' },
  { owner: 'MLSchools12',     pick: '1.10' },
  { owner: 'Tubes94',         pick: '1.11' },
  { owner: 'tdtd19844',       pick: '1.12', isChamp: true },
];

// ─── Top Prospects ────────────────────────────────────────────────────────────

const TOP_PROSPECTS: Prospect[] = [
  {
    name: 'Jeremiyah Love',
    pos: 'RB',
    college: 'Notre Dame',
    description: '1.01 Consensus. Doak Walker winner, 1,372 rush yds, 18 TDs, 4.36 40-time.',
    tier: 'Elite',
  },
  {
    name: 'Ryan Williams',
    pos: 'WR',
    college: 'Alabama',
    description: 'WR1 of class. Elite athlete with elite production as a freshman in 2025.',
    tier: 'Elite',
  },
  {
    name: 'Makai Lemon',
    pos: 'WR',
    college: 'USC',
    description: 'Biletnikoff winner. ~2.5% drop rate. The most reliable hands in the class.',
    tier: 'Elite',
  },
  {
    name: 'TreVeyon Henderson',
    pos: 'RB',
    college: 'Ohio State',
    description: 'Three-down back. Career 6.0 YPC at Ohio State. Pass-catching upside.',
    tier: 'Tier1',
  },
  {
    name: 'Kenyon Sadiq',
    pos: 'TE',
    college: 'Oregon',
    description: 'TE1. 6\'5" receiving TE. Post-combine dynasty riser.',
    tier: 'Tier1',
  },
  {
    name: 'Eli Stowers',
    pos: 'TE',
    college: 'Vanderbilt',
    description: 'TE2. 45.5-inch vertical — TE combine record. SF value in Superflex.',
    tier: 'Tier1',
  },
];

// ─── Pick Inventory ───────────────────────────────────────────────────────────

const PICK_INVENTORY: PickInventoryRow[] = [
  { owner: 'Escuelas',        picks: ['1.01', '2.01', '3.01', '4.01'] },
  { owner: 'Cogdeill11',      picks: ['1.02', '2.02', '3.02', '4.02'] },
  { owner: 'Grandes',         picks: ['1.03', '2.03', '3.03', '4.03'] },
  { owner: 'eldridsm',        picks: ['1.04', '2.04', '3.04', '4.04'] },
  { owner: 'eldridm20',       picks: ['1.05', '2.05', '3.05', '4.05'] },
  { owner: 'rbr',             picks: ['1.06', '2.06', '3.06', '4.06'] },
  { owner: 'Cmaleski',        picks: ['1.07', '2.07', '3.07', '4.07'] },
  { owner: 'SexMachineAndyD', picks: ['1.08', '2.08', '3.08', '4.08'] },
  { owner: 'JuicyBussy',      picks: ['1.09', '2.09', '3.09', '4.09'] },
  { owner: 'MLSchools12',     picks: ['1.10', '2.10', '3.10', '4.10'] },
  { owner: 'Tubes94',         picks: ['1.11', '2.11', '3.11', '4.11'] },
  { owner: 'tdtd19844',       picks: ['1.12', '2.12', '3.12', '4.12'] },
];

// ─── Strategy Notes ───────────────────────────────────────────────────────────

const STRATEGY_NOTES: string[] = [
  'With Jeremiyah Love as the consensus 1.01, 1.02 is the real pick to watch — Ryan Williams or Makai Lemon?',
  'TE premium picks: Sadiq and Stowers represent a rare chance to get a generational TE in the top 10.',
  'Teams with early picks (Cmaleski 1.01, eldridsm 1.02) are in full rebuild mode — they\'ll draft BPA, not for need.',
  'Middle picks (tdtd 1.07, JuicyBussy 1.08) — these teams need help now and may reach for positional fit.',
];

// ─── Shared Styles ────────────────────────────────────────────────────────────

const POS_STYLES: Record<Position, string> = {
  QB: 'bg-red-500/15 text-red-400 border-red-500/30',
  RB: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  WR: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  TE: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
};

const TIER_STYLES: Record<ProspectTier, string> = {
  Elite: 'bg-[#ffd700]/15 text-[#ffd700] border-[#ffd700]/30',
  Tier1: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Tier2: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
};

const TIER_LABELS: Record<ProspectTier, string> = {
  Elite: 'Elite',
  Tier1: 'Tier 1',
  Tier2: 'Tier 2',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function PosBadge({ pos }: { pos: Position }) {
  return (
    <span className={cn(
      'inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border w-9',
      POS_STYLES[pos]
    )}>
      {pos}
    </span>
  );
}

function TierBadge({ tier }: { tier: ProspectTier }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border',
      TIER_STYLES[tier]
    )}>
      {TIER_LABELS[tier]}
    </span>
  );
}

function ProspectCard({ prospect }: { prospect: Prospect }) {
  return (
    <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5 flex flex-col gap-3 hover:border-[#ffd700]/30 transition-colors duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-black text-white leading-tight mb-0.5 truncate">
            {prospect.name}
          </h3>
          <p className="text-xs text-slate-500">{prospect.college}</p>
        </div>
        <PosBadge pos={prospect.pos} />
      </div>
      <p className="text-sm text-slate-300 leading-relaxed flex-1">
        {prospect.description}
      </p>
      <div className="flex items-center justify-between gap-3 pt-1 border-t border-[#1e3347]">
        <TierBadge tier={prospect.tier} />
        <Link
          href="/nfl-draft/2026"
          className="text-xs text-[#ffd700]/70 hover:text-[#ffd700] transition-colors font-medium"
        >
          Full profile &rarr;
        </Link>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RookieDraft2026Page() {
  return (
    <>
      <Head>
        <title>2026 BMFFFL Rookie Draft — Season Hub</title>
        <meta
          name="description"
          content="2026 BMFFFL Rookie Draft hub — draft overview, top prospects, pick inventory, and strategy notes for the June 2026 draft."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Section 1: Draft Overview ──────────────────────────────────── */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <ClipboardList className="w-3.5 h-3.5" aria-hidden="true" />
            2026 Rookie Draft
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-3">
            2026 BMFFFL Rookie Draft
          </h1>

          {/* Meta grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="rounded-lg border border-[#2d4a66] bg-[#16213e] px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
                <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Date</p>
              </div>
              <p className="text-sm font-bold text-white">First Friday of June 2026</p>
              <p className="text-xs text-slate-400 mt-0.5">June 5, 2026 (est.)</p>
            </div>
            <div className="rounded-lg border border-[#2d4a66] bg-[#16213e] px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <ClipboardList className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
                <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Format</p>
              </div>
              <p className="text-sm font-bold text-white">Linear, 4 Rounds</p>
              <p className="text-xs text-slate-400 mt-0.5">12 picks/round = 48 total picks</p>
            </div>
            <div className="rounded-lg border border-[#2d4a66] bg-[#16213e] px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
                <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Champion Picks</p>
              </div>
              <p className="text-sm font-bold text-white">tdtd19844 picks last</p>
              <p className="text-xs text-slate-400 mt-0.5">2025 BMFFFL Champion</p>
            </div>
          </div>

          {/* Pick order badge strip */}
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">
              Round 1 Pick Order
            </p>
            <div className="flex flex-wrap gap-2">
              {DRAFT_ORDER.map(({ owner, pick, isChamp }) => (
                <div
                  key={pick}
                  className={cn(
                    'flex flex-col items-center gap-0.5 rounded-lg border px-3 py-2 min-w-[64px]',
                    isChamp
                      ? 'border-[#ffd700]/40 bg-[#ffd700]/5'
                      : 'border-[#2d4a66] bg-[#0d1b2a]'
                  )}
                >
                  <span className={cn(
                    'text-[11px] font-black tabular-nums',
                    isChamp ? 'text-[#ffd700]' : 'text-slate-400'
                  )}>
                    {pick}
                  </span>
                  <span className="text-[10px] text-slate-300 font-medium text-center leading-tight">
                    {owner}
                    {isChamp && (
                      <Trophy className="inline-block ml-1 w-2.5 h-2.5 text-[#ffd700]" aria-hidden="true" />
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/analytics/mock-draft"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#ffd700]/30 bg-[#ffd700]/5 text-[#ffd700] text-sm font-semibold hover:bg-[#ffd700]/10 transition-colors"
            >
              <ClipboardList className="w-4 h-4" aria-hidden="true" />
              Mock Draft Simulator
            </Link>
            <Link
              href="/nfl-draft/2026"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#2d4a66] bg-[#16213e] text-slate-300 text-sm font-semibold hover:border-[#ffd700]/30 hover:text-white transition-colors"
            >
              <TrendingUp className="w-4 h-4" aria-hidden="true" />
              NFL Draft Tracker
            </Link>
            <Link
              href="/analytics/dynasty-rankings"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#2d4a66] bg-[#16213e] text-slate-300 text-sm font-semibold hover:border-[#ffd700]/30 hover:text-white transition-colors"
            >
              <BarChart2 className="w-4 h-4" aria-hidden="true" />
              Dynasty Rankings
            </Link>
          </div>
        </header>

        {/* ── Section 2: Top Prospects Grid ─────────────────────────────── */}
        <section className="mb-12" aria-labelledby="prospects-heading">
          <div className="flex items-center gap-3 mb-5">
            <h2 id="prospects-heading" className="text-2xl font-black text-white">
              Top Prospects — 2026 Class
            </h2>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold border border-[#2d4a66] text-slate-400 bg-[#16213e]">
              Pre-NFL Draft
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOP_PROSPECTS.map(prospect => (
              <ProspectCard key={prospect.name} prospect={prospect} />
            ))}
          </div>
        </section>

        {/* ── Section 3: BMFFFL Pick Inventory ──────────────────────────── */}
        <section className="mb-12" aria-labelledby="pick-inventory-heading">
          <div className="flex items-center gap-3 mb-5">
            <h2 id="pick-inventory-heading" className="text-2xl font-black text-white">
              BMFFFL Pick Inventory
            </h2>
          </div>

          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm" aria-label="2026 draft pick inventory by owner">
                <thead>
                  <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      Owner
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      Round 1
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      Round 2
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      Round 3
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      Round 4
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3347]">
                  {PICK_INVENTORY.map((row, idx) => {
                    const isChamp = row.owner === 'tdtd19844';
                    return (
                      <tr
                        key={row.owner}
                        className={cn(
                          'transition-colors duration-100 hover:bg-[#1f3550]',
                          idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]',
                          isChamp && 'ring-1 ring-inset ring-[#ffd700]/10'
                        )}
                      >
                        <td className="px-4 py-3">
                          <span className="font-semibold text-white text-sm">
                            {row.owner}
                          </span>
                          {isChamp && (
                            <Trophy className="inline-block ml-1.5 w-3 h-3 text-[#ffd700]" aria-hidden="true" />
                          )}
                        </td>
                        {row.picks.map((pick, rIdx) => (
                          <td key={rIdx} className="px-4 py-3 text-center">
                            {pick ? (
                              <span className={cn(
                                'inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-mono font-bold',
                                rIdx === 0
                                  ? 'text-[#ffd700] bg-[#ffd700]/10 border border-[#ffd700]/20'
                                  : pick.includes('†')
                                  ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                                  : 'text-slate-300 bg-[#16213e] border border-[#2d4a66]'
                              )}>
                                {pick}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-600 italic">traded</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-2 text-[11px] text-slate-600 leading-relaxed">
            † 3.06 acquired by Cogdeill11 via trade with eldridm20.
            Pick order reflects linear format — no snake reversal in rounds 2–4.
            Subject to commissioner confirmation.
          </p>
        </section>

        {/* ── Section 4: Draft Strategy Notes ───────────────────────────── */}
        <section className="mb-10" aria-labelledby="strategy-heading">
          <div className="flex items-center gap-3 mb-5">
            <Info className="w-5 h-5 text-[#ffd700] shrink-0" aria-hidden="true" />
            <h2 id="strategy-heading" className="text-2xl font-black text-white">
              Draft Strategy Notes
            </h2>
          </div>

          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] divide-y divide-[#1e3347]">
            {STRATEGY_NOTES.map((note, idx) => (
              <div key={idx} className="px-5 py-4 flex items-start gap-3">
                <span
                  className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full bg-[#ffd700]"
                  aria-hidden="true"
                />
                <p className="text-sm text-slate-300 leading-relaxed">{note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer note */}
        <p className="text-xs text-slate-600 leading-relaxed">
          Draft information is estimated as of March 2026. Pick ownership reflects known trades as of this date —
          additional trades may occur before June 5. Prospect rankings are pre-NFL Draft (April 23&ndash;25, 2026)
          and will shift based on landing spots and combine results.
        </p>

      </div>
    </>
  );
}
