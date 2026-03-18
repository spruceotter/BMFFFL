import { useState, useMemo } from 'react';
import Head from 'next/head';
import { Star } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type Position = 'QB' | 'RB' | 'WR' | 'TE';
type PosFilter = 'ALL' | Position;

type Tier = 1 | 2 | 3 | 4;

interface RookieProspect {
  rank: number;
  name: string;
  pos: Position;
  college: string;
  nflTeam: string;
  dynastyValue: number;
  tier: Tier;
  note: string;
}

// ─── Prospect Data ────────────────────────────────────────────────────────────

const PROSPECTS: RookieProspect[] = [
  // Tier 1 — Dynasty Elite
  {
    rank: 1,
    name: 'Tetairoa McMillan',
    pos: 'WR',
    college: 'Arizona',
    nflTeam: 'TBD (top-5 pick)',
    dynastyValue: 9200,
    tier: 1,
    note: 'Projected top-5 pick. Elite size/speed/hands. Comparable to early Ja\'Marr Chase dynasty profiles.',
  },
  {
    rank: 2,
    name: 'Ashton Jeanty',
    pos: 'RB',
    college: 'Boise State',
    nflTeam: 'TBD (top-10 RB pick)',
    dynastyValue: 9000,
    tier: 1,
    note: 'Heisman finalist, historic college production. Best RB prospect in years.',
  },
  // Tier 2 — Dynasty Strong
  {
    rank: 3,
    name: 'Colston Loveland',
    pos: 'TE',
    college: 'Michigan',
    nflTeam: 'TBD',
    dynastyValue: 8600,
    tier: 2,
    note: 'Best TE prospect since Brock Bowers. Elite athleticism.',
  },
  {
    rank: 4,
    name: 'Travis Hunter',
    pos: 'WR',
    college: 'Colorado',
    nflTeam: 'TBD',
    dynastyValue: 8200,
    tier: 2,
    note: 'Two-way Heisman winner. As WR, elite route runner.',
  },
  {
    rank: 5,
    name: 'Omarion Hampton',
    pos: 'RB',
    college: 'UNC',
    nflTeam: 'TBD',
    dynastyValue: 8000,
    tier: 2,
    note: 'Complete back, elite pass catcher.',
  },
  {
    rank: 6,
    name: 'Tyler Warren',
    pos: 'TE',
    college: 'Penn State',
    nflTeam: 'TBD',
    dynastyValue: 7800,
    tier: 2,
    note: 'Big, physical TE. Could be top TE1 by Year 2.',
  },
  {
    rank: 7,
    name: 'Emeka Egbuka',
    pos: 'WR',
    college: 'Ohio State',
    nflTeam: 'TBD',
    dynastyValue: 7600,
    tier: 2,
    note: 'Ultra-reliable slot WR. High floor.',
  },
  {
    rank: 8,
    name: 'Kyle Williams',
    pos: 'WR',
    college: 'Washington State',
    nflTeam: 'TBD',
    dynastyValue: 7400,
    tier: 2,
    note: 'Electric YAC threat, elite athleticism.',
  },
  {
    rank: 9,
    name: 'Tre Harris',
    pos: 'WR',
    college: 'Ole Miss',
    nflTeam: 'TBD',
    dynastyValue: 7200,
    tier: 2,
    note: 'Big-play WR, strong combine.',
  },
  {
    rank: 10,
    name: 'Quinshon Judkins',
    pos: 'RB',
    college: 'Ohio State',
    nflTeam: 'TBD',
    dynastyValue: 7000,
    tier: 2,
    note: 'Productive back, early draft entry.',
  },
  // Tier 3 — Dynasty Upside
  {
    rank: 11,
    name: 'RJ Harvey',
    pos: 'RB',
    college: 'UCF',
    nflTeam: 'TBD',
    dynastyValue: 6800,
    tier: 3,
    note: 'Undersized but electric.',
  },
  {
    rank: 12,
    name: 'Cam Ward',
    pos: 'QB',
    college: 'Miami',
    nflTeam: 'TBD',
    dynastyValue: 6500,
    tier: 3,
    note: 'Top QB prospect, strong arm. QB-premium leagues value: 7500.',
  },
  {
    rank: 13,
    name: 'Shedeur Sanders',
    pos: 'QB',
    college: 'Colorado',
    nflTeam: 'TBD',
    dynastyValue: 6200,
    tier: 3,
    note: 'High IQ, pocket presence.',
  },
  {
    rank: 14,
    name: 'Jaylen Moody',
    pos: 'WR',
    college: 'Alabama',
    nflTeam: 'TBD',
    dynastyValue: 6000,
    tier: 3,
    note: 'Strong hands, solid route tree.',
  },
  {
    rank: 15,
    name: 'Harold Fannin Jr.',
    pos: 'TE',
    college: 'Bowling Green',
    nflTeam: 'TBD',
    dynastyValue: 5800,
    tier: 3,
    note: 'Surprise TE prospect, elite athleticism.',
  },
  {
    rank: 16,
    name: 'Elic Ayomanor',
    pos: 'WR',
    college: 'Stanford',
    nflTeam: 'TBD',
    dynastyValue: 5600,
    tier: 3,
    note: 'Big frame, red zone threat.',
  },
  {
    rank: 17,
    name: 'Kaleb Johnson',
    pos: 'RB',
    college: 'Iowa',
    nflTeam: 'TBD',
    dynastyValue: 5400,
    tier: 3,
    note: 'Power back, limited pass-catch role.',
  },
  {
    rank: 18,
    name: 'Darius Robinson',
    pos: 'WR',
    college: 'Missouri',
    nflTeam: 'TBD',
    dynastyValue: 5200,
    tier: 3,
    note: 'Excellent combine.',
  },
  {
    rank: 19,
    name: 'Jack Bech',
    pos: 'WR',
    college: 'TCU',
    nflTeam: 'TBD',
    dynastyValue: 5000,
    tier: 3,
    note: 'Reliable slot.',
  },
  // Tier 4 — Dynasty Depth / Dart Throws
  {
    rank: 20,
    name: 'Jalen Milroe',
    pos: 'QB',
    college: 'Alabama',
    nflTeam: 'TBD',
    dynastyValue: 4800,
    tier: 4,
    note: 'Athletic QB, run-heavy.',
  },
  {
    rank: 21,
    name: 'Damien Martinez',
    pos: 'RB',
    college: 'Miami',
    nflTeam: 'TBD',
    dynastyValue: 4500,
    tier: 4,
    note: 'Solid runner, limited upside.',
  },
  {
    rank: 22,
    name: 'Isaiah Bond',
    pos: 'WR',
    college: 'Texas',
    nflTeam: 'TBD',
    dynastyValue: 4200,
    tier: 4,
    note: 'Speed threat, needs landing spot.',
  },
  {
    rank: 23,
    name: 'Luke Lachey',
    pos: 'TE',
    college: 'Iowa',
    nflTeam: 'TBD',
    dynastyValue: 3800,
    tier: 4,
    note: 'Big TE, blocker-first but improving.',
  },
  {
    rank: 24,
    name: 'Eli Volker',
    pos: 'RB',
    college: 'Wisconsin',
    nflTeam: 'TBD',
    dynastyValue: 3200,
    tier: 4,
    note: 'Depth back.',
  },
  {
    rank: 25,
    name: 'Dillon Gabriel',
    pos: 'QB',
    college: 'Oregon',
    nflTeam: 'TBD',
    dynastyValue: 2500,
    tier: 4,
    note: 'Senior QB, limited dynasty ceiling.',
  },
];

const MAX_VALUE = 9200;

// ─── Draft Pick Reference Data ────────────────────────────────────────────────

interface DraftPick {
  label: string;
  value: number;
}

const DRAFT_PICKS: DraftPick[] = [
  { label: '2026 1.01', value: 8500 },
  { label: '2026 1.03', value: 7600 },
  { label: '2026 1.06', value: 6400 },
  { label: '2026 1.12', value: 4000 },
  { label: '2026 2.01', value: 3200 },
];

// ─── Tier Config ──────────────────────────────────────────────────────────────

const TIER_CONFIG: Record<
  Tier,
  { label: string; style: string; barColor: string }
> = {
  1: {
    label: 'Tier 1 — Dynasty Elite',
    style: 'bg-[#ffd700]/15 text-[#ffd700] border-[#ffd700]/40',
    barColor: '#ffd700',
  },
  2: {
    label: 'Tier 2 — Dynasty Strong',
    style: 'bg-blue-500/15 text-blue-400 border-blue-500/40',
    barColor: '#60a5fa',
  },
  3: {
    label: 'Tier 3 — Dynasty Upside',
    style: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
    barColor: '#34d399',
  },
  4: {
    label: 'Tier 4 — Depth / Dart Throws',
    style: 'bg-slate-500/15 text-slate-400 border-slate-500/40',
    barColor: '#94a3b8',
  },
};

// ─── Position Config ──────────────────────────────────────────────────────────

const POS_CONFIG: Record<Position, string> = {
  QB: 'bg-blue-500/15 text-blue-400 border-blue-500/40',
  RB: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
  WR: 'bg-orange-500/15 text-orange-400 border-orange-500/40',
  TE: 'bg-purple-500/15 text-purple-400 border-purple-500/40',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function TierBadge({ tier }: { tier: Tier }) {
  const cfg = TIER_CONFIG[tier];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap',
        cfg.style
      )}
    >
      Tier {tier}
    </span>
  );
}

function PosBadge({ pos }: { pos: Position }) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border w-9',
        POS_CONFIG[pos]
      )}
    >
      {pos}
    </span>
  );
}

function ValueBar({ value, tier }: { value: number; tier: Tier }) {
  const pct = Math.round((value / MAX_VALUE) * 100);
  const color = TIER_CONFIG[tier].barColor;
  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <div className="flex-1 h-1.5 rounded-full bg-[#1a2d42] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: color }}
          aria-hidden="true"
        />
      </div>
      <span className="text-xs font-mono font-bold tabular-nums text-slate-200 w-12 text-right">
        {value.toLocaleString()}
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const POS_FILTER_OPTIONS: PosFilter[] = ['ALL', 'RB', 'WR', 'TE', 'QB'];

export default function RookieProspectsPage() {
  const [posFilter, setPosFilter] = useState<PosFilter>('ALL');

  const filtered = useMemo(() => {
    if (posFilter === 'ALL') return PROSPECTS;
    return PROSPECTS.filter((p) => p.pos === posFilter);
  }, [posFilter]);

  // Group into tiers for display
  const tierGroups = useMemo(() => {
    const groups: Map<Tier, RookieProspect[]> = new Map();
    for (const p of filtered) {
      if (!groups.has(p.tier)) groups.set(p.tier, []);
      groups.get(p.tier)!.push(p);
    }
    return groups;
  }, [filtered]);

  const tiers = ([1, 2, 3, 4] as Tier[]).filter((t) => tierGroups.has(t));

  return (
    <>
      <Head>
        <title>2026 Rookie Prospect Database — BMFFFL Analytics</title>
        <meta
          name="description"
          content="2026 NFL Rookie class dynasty prospect rankings with dynasty value, position, college, and scouting notes. Post-combine, March 2026."
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
            2026 Rookie Prospect Database
          </h1>
          <p className="text-slate-400 text-lg">
            Dynasty values and scouting notes &mdash; Post-Combine, March 2026
          </p>
        </header>

        {/* Summary stats */}
        <section className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3" aria-label="Prospect summary">
          {([1, 2, 3, 4] as Tier[]).map((t) => {
            const count = PROSPECTS.filter((p) => p.tier === t).length;
            const cfg = TIER_CONFIG[t];
            return (
              <div
                key={t}
                className="rounded-lg border border-[#2d4a66] bg-[#16213e] px-4 py-3 text-center"
              >
                <p
                  className="text-2xl font-black tabular-nums"
                  style={{ color: cfg.barColor }}
                >
                  {count}
                </p>
                <p className="text-[11px] text-slate-500 uppercase tracking-wider mt-0.5">
                  Prospects
                </p>
                <p className="text-xs text-slate-400 font-medium mt-0.5 leading-snug">
                  Tier {t}
                </p>
              </div>
            );
          })}
        </section>

        {/* Position filter tabs */}
        <section className="mb-6" aria-label="Filter by position">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
            Position
          </p>
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
        </section>

        {/* Results count */}
        <p className="mb-4 text-xs text-slate-500">
          Showing {filtered.length} prospect{filtered.length !== 1 ? 's' : ''}
          {posFilter !== 'ALL' ? ` · ${posFilter}` : ''}
        </p>

        {/* Prospect list grouped by tier */}
        <div className="space-y-8">
          {tiers.map((tier) => {
            const prospects = tierGroups.get(tier)!;
            const cfg = TIER_CONFIG[tier];
            return (
              <section key={tier} aria-label={cfg.label}>
                {/* Tier header */}
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={cn(
                      'inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border',
                      cfg.style
                    )}
                  >
                    {cfg.label}
                  </span>
                  <div className="flex-1 h-px bg-[#2d4a66]" aria-hidden="true" />
                </div>

                {/* Prospect table */}
                <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table
                      className="min-w-full text-sm"
                      aria-label={`${cfg.label} prospects`}
                    >
                      <thead>
                        <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-12"
                          >
                            Rank
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider"
                          >
                            Prospect
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-16"
                          >
                            Pos
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider hidden sm:table-cell"
                          >
                            College
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider hidden md:table-cell"
                          >
                            NFL Team
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-36"
                          >
                            Dynasty Value
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1e3347]">
                        {prospects.map((p, idx) => {
                          const isEven = idx % 2 === 0;
                          return (
                            <tr
                              key={p.rank}
                              className={cn(
                                'transition-colors duration-100 hover:bg-[#1f3550]',
                                isEven ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                              )}
                            >
                              {/* Rank */}
                              <td className="px-4 py-3">
                                <span className="text-xs font-mono font-bold text-slate-400 tabular-nums">
                                  #{p.rank}
                                </span>
                              </td>

                              {/* Prospect name + scouting note */}
                              <td className="px-4 py-3">
                                <span className="font-bold text-white text-sm block">
                                  {p.name}
                                </span>
                                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug sm:hidden">
                                  {p.college}
                                </p>
                                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug max-w-xs">
                                  {p.note}
                                </p>
                              </td>

                              {/* Pos */}
                              <td className="px-4 py-3">
                                <PosBadge pos={p.pos} />
                              </td>

                              {/* College */}
                              <td className="px-4 py-3 hidden sm:table-cell">
                                <span className="text-xs text-slate-300 font-medium">
                                  {p.college}
                                </span>
                              </td>

                              {/* NFL Team */}
                              <td className="px-4 py-3 hidden md:table-cell">
                                <span className="text-xs font-mono text-slate-400">
                                  {p.nflTeam}
                                </span>
                              </td>

                              {/* Dynasty Value */}
                              <td className="px-4 py-3">
                                <ValueBar value={p.dynastyValue} tier={p.tier} />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* Draft Pick Value Quick Reference */}
        <section className="mt-10" aria-label="Draft pick values">
          <h2 className="text-lg font-black text-white mb-4">
            Draft Pick Values &mdash; Quick Reference
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {DRAFT_PICKS.map((pick) => (
              <div
                key={pick.label}
                className="rounded-lg border border-[#2d4a66] bg-[#16213e] px-4 py-3 text-center"
              >
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                  {pick.label}
                </p>
                <p className="text-xl font-black text-[#ffd700] tabular-nums">
                  {pick.value.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-slate-600">
            Draft pick values are approximate and reflect post-combine dynasty market estimates. Values shift as landing spots become known.
          </p>
        </section>

        {/* Bimfle Advisory */}
        <aside
          className="mt-10 rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/5 px-6 py-5"
          aria-label="Bimfle's Rookie Advisory"
        >
          <p className="text-xs text-[#ffd700] uppercase tracking-widest font-bold mb-2">
            Bimfle's Rookie Advisory
          </p>
          <p className="text-slate-300 text-sm leading-relaxed italic">
            "One must exercise appropriate caution before investing dynasty capital in players who have yet to play a single professional snap. That said, Tetairoa McMillan is rather compelling."
          </p>
          <p className="text-[#ffd700] text-xs font-semibold mt-2">~Love, Bimfle.</p>
        </aside>

        {/* Footer disclaimer */}
        <div className="mt-6 text-xs text-slate-600 leading-relaxed">
          <p>
            Prospect rankings are post-combine estimates as of March 2026 — not official or affiliated with any dynasty ranking service.
            Dynasty values are on a 0–10,000 scale and reflect projected NFL role, talent, age, and long-term fantasy upside.
            QB values shown are for standard (non-QB-premium) leagues unless otherwise noted.
          </p>
        </div>

      </div>
    </>
  );
}
