import { useState, useMemo } from 'react';
import Head from 'next/head';
import { BarChart2, Info } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Data ─────────────────────────────────────────────────────────────────────

type Tier = 'Elite' | 'Tier1' | 'Tier2' | 'Tier3';
type Position = 'QB' | 'RB' | 'WR' | 'TE';

interface DynastyPlayer {
  rank: number;
  name: string;
  pos: Position;
  nflTeam: string;
  age: number;
  tier: Tier;
  bmffflOwner: string;
  dynastyValue: number;
  note?: string;
}

const DYNASTY_PLAYERS: DynastyPlayer[] = [
  // QBs
  { rank: 1,  name: 'Josh Allen',          pos: 'QB', nflTeam: 'BUF', age: 29, tier: 'Elite',  bmffflOwner: 'eldridm20',       dynastyValue: 99 },
  { rank: 2,  name: 'Lamar Jackson',        pos: 'QB', nflTeam: 'BAL', age: 28, tier: 'Elite',  bmffflOwner: 'MLSchools12',     dynastyValue: 97 },
  { rank: 3,  name: 'Patrick Mahomes',      pos: 'QB', nflTeam: 'KC',  age: 30, tier: 'Elite',  bmffflOwner: 'Grandes',         dynastyValue: 94 },
  { rank: 4,  name: 'Joe Burrow',           pos: 'QB', nflTeam: 'CIN', age: 29, tier: 'Elite',  bmffflOwner: 'JuicyBussy',      dynastyValue: 92 },
  { rank: 5,  name: 'Trevor Lawrence',      pos: 'QB', nflTeam: 'JAX', age: 26, tier: 'Tier1',  bmffflOwner: 'Tubes94',         dynastyValue: 88 },
  { rank: 6,  name: 'Jordan Love',          pos: 'QB', nflTeam: 'GB',  age: 26, tier: 'Tier1',  bmffflOwner: 'Tubes94',         dynastyValue: 85 },
  { rank: 7,  name: 'Kyler Murray',         pos: 'QB', nflTeam: 'MIN', age: 27, tier: 'Tier1',  bmffflOwner: 'MLSchools12',     dynastyValue: 82 },
  // RBs
  { rank: 8,  name: 'Bijan Robinson',       pos: 'RB', nflTeam: 'ATL', age: 23, tier: 'Elite',  bmffflOwner: 'Tubes94',         dynastyValue: 95 },
  { rank: 9,  name: 'Breece Hall',          pos: 'RB', nflTeam: 'NYJ', age: 24, tier: 'Elite',  bmffflOwner: 'Tubes94',         dynastyValue: 93 },
  { rank: 10, name: 'Ashton Jeanty',        pos: 'RB', nflTeam: 'LV',  age: 22, tier: 'Elite',  bmffflOwner: 'Escuelas',        dynastyValue: 91 },
  { rank: 11, name: 'Omarion Hampton',      pos: 'RB', nflTeam: 'LAC', age: 22, tier: 'Elite',  bmffflOwner: 'Cogdeill11',      dynastyValue: 90 },
  { rank: 12, name: 'Bucky Irving',         pos: 'RB', nflTeam: 'TB',  age: 23, tier: 'Tier1',  bmffflOwner: 'MLSchools12',     dynastyValue: 84 },
  { rank: 13, name: 'Quinshon Judkins',     pos: 'RB', nflTeam: 'GB',  age: 22, tier: 'Tier1',  bmffflOwner: 'rbr',             dynastyValue: 83 },
  { rank: 14, name: "De'Von Achane",        pos: 'RB', nflTeam: 'MIA', age: 23, tier: 'Tier1',  bmffflOwner: 'SexMachineAndyD', dynastyValue: 81 },
  // WRs
  { rank: 15, name: "Ja'Marr Chase",        pos: 'WR', nflTeam: 'CIN', age: 25, tier: 'Elite',  bmffflOwner: 'eldridm20',       dynastyValue: 96 },
  { rank: 16, name: 'CeeDee Lamb',          pos: 'WR', nflTeam: 'DAL', age: 26, tier: 'Elite',  bmffflOwner: 'MLSchools12',     dynastyValue: 94 },
  { rank: 17, name: 'Tetairoa McMillan',    pos: 'WR', nflTeam: 'CAR', age: 22, tier: 'Elite',  bmffflOwner: 'Escuelas',        dynastyValue: 89 },
  { rank: 18, name: 'Malik Nabers',         pos: 'WR', nflTeam: 'NYG', age: 22, tier: 'Elite',  bmffflOwner: 'SexMachineAndyD', dynastyValue: 88 },
  { rank: 19, name: 'Luther Burden III',    pos: 'WR', nflTeam: 'CHI', age: 22, tier: 'Tier1',  bmffflOwner: 'eldridm20',       dynastyValue: 86 },
  { rank: 20, name: 'Elic Ayomanor',        pos: 'WR', nflTeam: 'TEN', age: 23, tier: 'Tier1',  bmffflOwner: 'rbr',             dynastyValue: 82 },
  { rank: 21, name: 'Matthew Golden',       pos: 'WR', nflTeam: 'HOU', age: 22, tier: 'Tier1',  bmffflOwner: 'JuicyBussy',      dynastyValue: 81 },
  { rank: 22, name: 'Puka Nacua',           pos: 'WR', nflTeam: 'LAR', age: 24, tier: 'Tier1',  bmffflOwner: 'Tubes94',         dynastyValue: 80 },
  { rank: 23, name: 'Jayden Reed',          pos: 'WR', nflTeam: 'GB',  age: 25, tier: 'Tier2',  bmffflOwner: 'tdtd19844',       dynastyValue: 76 },
  { rank: 24, name: 'Zay Flowers',          pos: 'WR', nflTeam: 'BAL', age: 24, tier: 'Tier2',  bmffflOwner: 'eldridsm',        dynastyValue: 75 },
  { rank: 25, name: 'Jordan Addison',       pos: 'WR', nflTeam: 'MIN', age: 23, tier: 'Tier2',  bmffflOwner: 'tdtd19844',       dynastyValue: 74 },
  // TEs
  { rank: 26, name: 'Colston Loveland',     pos: 'TE', nflTeam: 'CHI', age: 23, tier: 'Elite',  bmffflOwner: 'Cogdeill11',      dynastyValue: 90 },
  { rank: 27, name: 'Harold Fannin Jr.',    pos: 'TE', nflTeam: 'HOU', age: 23, tier: 'Elite',  bmffflOwner: 'JuicyBussy',      dynastyValue: 88 },
  { rank: 28, name: 'Tyler Warren',         pos: 'TE', nflTeam: 'IND', age: 23, tier: 'Elite',  bmffflOwner: 'Cmaleski',        dynastyValue: 85 },
  { rank: 29, name: 'Sam LaPorta',          pos: 'TE', nflTeam: 'DET', age: 24, tier: 'Tier1',  bmffflOwner: 'rbr',             dynastyValue: 78 },
  { rank: 30, name: 'George Kittle',        pos: 'TE', nflTeam: 'SF',  age: 31, tier: 'Tier1',  bmffflOwner: 'MLSchools12',     dynastyValue: 77 },
  // Additional
  { rank: 31, name: 'Marvin Harrison Jr.', pos: 'WR', nflTeam: 'ARI', age: 22, tier: 'Tier1',  bmffflOwner: 'eldridsm',        dynastyValue: 86 },
  { rank: 32, name: 'Brian Thomas Jr.',    pos: 'WR', nflTeam: 'JAX', age: 23, tier: 'Tier1',  bmffflOwner: 'tdtd19844',       dynastyValue: 82 },
  { rank: 33, name: 'Josh Jacobs',         pos: 'RB', nflTeam: 'GB',  age: 27, tier: 'Tier2',  bmffflOwner: 'MLSchools12',     dynastyValue: 73 },
  { rank: 34, name: 'Jonathan Taylor',     pos: 'RB', nflTeam: 'IND', age: 27, tier: 'Tier2',  bmffflOwner: 'tdtd19844',       dynastyValue: 72, note: 'Sell-high — age cliff approaching Sep 2026' },
  { rank: 35, name: 'Jaylen Waddle',       pos: 'WR', nflTeam: 'MIA', age: 27, tier: 'Tier2',  bmffflOwner: 'MLSchools12',     dynastyValue: 71 },
  { rank: 36, name: 'Tee Higgins',         pos: 'WR', nflTeam: 'CIN', age: 26, tier: 'Tier2',  bmffflOwner: 'JuicyBussy',      dynastyValue: 70 },
  { rank: 37, name: 'Rashee Rice',         pos: 'WR', nflTeam: 'KC',  age: 24, tier: 'Tier2',  bmffflOwner: 'tdtd19844',       dynastyValue: 72 },
  { rank: 38, name: 'Drake London',        pos: 'WR', nflTeam: 'ATL', age: 24, tier: 'Tier2',  bmffflOwner: 'Cmaleski',        dynastyValue: 74 },
  { rank: 39, name: 'Kyren Williams',      pos: 'RB', nflTeam: 'LAR', age: 25, tier: 'Tier2',  bmffflOwner: 'SexMachineAndyD', dynastyValue: 74 },
  { rank: 40, name: 'James Cook',          pos: 'RB', nflTeam: 'BUF', age: 25, tier: 'Tier2',  bmffflOwner: 'eldridsm',        dynastyValue: 73 },
];

const ALL_OWNERS = Array.from(new Set(DYNASTY_PLAYERS.map(p => p.bmffflOwner))).sort();

// ─── Tier Badge ───────────────────────────────────────────────────────────────

const TIER_STYLES: Record<Tier, string> = {
  Elite: 'bg-[#ffd700]/15 text-[#ffd700] border-[#ffd700]/30',
  Tier1: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Tier2: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  Tier3: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
};

const TIER_LABELS: Record<Tier, string> = {
  Elite: 'Elite',
  Tier1: 'Tier 1',
  Tier2: 'Tier 2',
  Tier3: 'Tier 3',
};

function TierBadge({ tier }: { tier: Tier }) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border', TIER_STYLES[tier])}>
      {TIER_LABELS[tier]}
    </span>
  );
}

// ─── Position Badge ───────────────────────────────────────────────────────────

const POS_STYLES: Record<Position, string> = {
  QB: 'bg-red-500/15 text-red-400 border-red-500/30',
  RB: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  WR: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  TE: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
};

function PosBadge({ pos }: { pos: Position }) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border w-9 justify-center', POS_STYLES[pos])}>
      {pos}
    </span>
  );
}

// ─── Dynasty Value Bar ────────────────────────────────────────────────────────

function DynastyValueBar({ value }: { value: number }) {
  const pct = Math.round(value);
  const color =
    value >= 90 ? '#ffd700' :
    value >= 80 ? '#34d399' :
    value >= 70 ? '#60a5fa' :
    '#94a3b8';

  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-1.5 rounded-full bg-[#1a2d42] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: color }}
          aria-hidden="true"
        />
      </div>
      <span className="text-xs font-mono font-semibold tabular-nums text-slate-300 w-6 text-right">{value}</span>
    </div>
  );
}

// ─── Filter Tabs ──────────────────────────────────────────────────────────────

type PosFilter = 'All' | Position;

function FilterTabs<T extends string>({
  options,
  active,
  onChange,
  label,
}: {
  options: T[];
  active: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border',
            active === opt
              ? 'bg-[#ffd700] text-[#0d1b2a] border-[#ffd700]'
              : 'bg-[#16213e] text-slate-400 border-[#2d4a66] hover:border-[#ffd700]/40 hover:text-white'
          )}
          aria-pressed={active === opt}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// ─── Coverage Stat ────────────────────────────────────────────────────────────

function CoverageStats({ players }: { players: DynastyPlayer[] }) {
  const rostered = players.length;
  const total = DYNASTY_PLAYERS.length;
  const uniqueOwners = new Set(players.map(p => p.bmffflOwner)).size;

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      <div className="rounded-lg border border-[#2d4a66] bg-[#16213e] px-4 py-3 text-center">
        <p className="text-2xl font-black text-[#ffd700] tabular-nums">{rostered}</p>
        <p className="text-[11px] text-slate-500 uppercase tracking-wider mt-0.5">of top {total}</p>
        <p className="text-xs text-slate-400 font-medium">Players Rostered</p>
      </div>
      <div className="rounded-lg border border-[#2d4a66] bg-[#16213e] px-4 py-3 text-center">
        <p className="text-2xl font-black text-emerald-400 tabular-nums">{uniqueOwners}</p>
        <p className="text-[11px] text-slate-500 uppercase tracking-wider mt-0.5">of 12 teams</p>
        <p className="text-xs text-slate-400 font-medium">With Coverage</p>
      </div>
      <div className="rounded-lg border border-[#2d4a66] bg-[#16213e] px-4 py-3 text-center">
        <p className="text-2xl font-black text-blue-400 tabular-nums">
          {Math.round((rostered / total) * 100)}%
        </p>
        <p className="text-[11px] text-slate-500 uppercase tracking-wider mt-0.5">coverage</p>
        <p className="text-xs text-slate-400 font-medium">BMFFFL Rate</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DynastyRankingsPage() {
  const [posFilter, setPosFilter] = useState<PosFilter>('All');
  const [ownerFilter, setOwnerFilter] = useState<string>('All Teams');

  const filtered = useMemo(() => {
    return DYNASTY_PLAYERS.filter(p => {
      if (posFilter !== 'All' && p.pos !== posFilter) return false;
      if (ownerFilter !== 'All Teams' && p.bmffflOwner !== ownerFilter) return false;
      return true;
    });
  }, [posFilter, ownerFilter]);

  const posOptions: PosFilter[] = ['All', 'QB', 'RB', 'WR', 'TE'];
  const ownerOptions = ['All Teams', ...ALL_OWNERS];

  return (
    <>
      <Head>
        <title>Dynasty Rankings — BMFFFL Analytics</title>
        <meta
          name="description"
          content="March 2026 consensus dynasty rankings for the top 50 NFL players. Filter by position and BMFFFL owner."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Header */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <BarChart2 className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            Dynasty Rankings
          </h1>
          <p className="text-slate-400 text-lg">
            March 2026 Consensus &mdash; Top 50 Dynasty Players
          </p>
        </header>

        {/* BMFFFL Coverage */}
        <section className="mb-8" aria-label="BMFFFL coverage statistics">
          <CoverageStats players={DYNASTY_PLAYERS} />
        </section>

        {/* Filters */}
        <section className="mb-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between" aria-label="Filters">
          <div className="space-y-2">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Position</p>
            <FilterTabs
              options={posOptions}
              active={posFilter}
              onChange={setPosFilter}
              label="Filter by position"
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">BMFFFL Owner</p>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by owner">
              <select
                value={ownerFilter}
                onChange={e => setOwnerFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#2d4a66] bg-[#16213e] text-slate-300 focus:outline-none focus:border-[#ffd700]/40 focus:ring-1 focus:ring-[#ffd700]/30"
                aria-label="Select owner"
              >
                {ownerOptions.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Results count */}
        <p className="mb-3 text-xs text-slate-500">
          Showing {filtered.length} player{filtered.length !== 1 ? 's' : ''}
          {posFilter !== 'All' ? ` · ${posFilter}` : ''}
          {ownerFilter !== 'All Teams' ? ` · ${ownerFilter}` : ''}
        </p>

        {/* Table */}
        <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm" aria-label="Dynasty player rankings">
              <thead>
                <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                  <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-12">Rank</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">Player</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-16">Pos</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-16 hidden sm:table-cell">NFL</th>
                  <th scope="col" className="px-4 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider w-12 hidden md:table-cell">Age</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-24">Tier</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider hidden lg:table-cell">BMFFFL Owner</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-36">Dynasty Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e3347]">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-slate-500 text-sm">
                      No players match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((player, idx) => {
                    const isEven = idx % 2 === 0;
                    return (
                      <tr
                        key={player.rank}
                        className={cn(
                          'transition-colors duration-100 hover:bg-[#1f3550]',
                          isEven ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                        )}
                      >
                        {/* Rank */}
                        <td className="px-4 py-3">
                          <span className="text-xs font-mono font-bold text-slate-400 tabular-nums">
                            #{player.rank}
                          </span>
                        </td>

                        {/* Player name + note */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white text-sm">{player.name}</span>
                            {player.note && (
                              <span title={player.note} aria-label={`Note: ${player.note}`}>
                                <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="false" />
                              </span>
                            )}
                          </div>
                          {/* Show owner on mobile */}
                          <p className="text-[11px] text-slate-500 mt-0.5 lg:hidden">{player.bmffflOwner}</p>
                          {player.note && (
                            <p className="text-[11px] text-amber-500/80 mt-0.5 leading-snug">{player.note}</p>
                          )}
                        </td>

                        {/* Pos */}
                        <td className="px-4 py-3">
                          <PosBadge pos={player.pos} />
                        </td>

                        {/* NFL Team */}
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="text-xs font-mono font-semibold text-slate-400">{player.nflTeam}</span>
                        </td>

                        {/* Age */}
                        <td className="px-4 py-3 text-center hidden md:table-cell">
                          <span className={cn(
                            'text-xs font-mono font-semibold tabular-nums',
                            player.age <= 23 ? 'text-emerald-400' :
                            player.age <= 26 ? 'text-slate-300' :
                            player.age <= 29 ? 'text-amber-400' :
                            'text-[#e94560]'
                          )}>
                            {player.age}
                          </span>
                        </td>

                        {/* Tier */}
                        <td className="px-4 py-3">
                          <TierBadge tier={player.tier} />
                        </td>

                        {/* Owner */}
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className="text-xs text-slate-300 font-medium">{player.bmffflOwner}</span>
                        </td>

                        {/* Dynasty Value bar */}
                        <td className="px-4 py-3">
                          <DynastyValueBar value={player.dynastyValue} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2 text-xs text-slate-600 leading-relaxed">
          <p>
            Rankings are March 2026 consensus estimates — not official or affiliated with any dynasty ranking service.
            Dynasty values are relative (0–100 scale) and reflect age, talent, situation, and long-term upside.
          </p>
        </div>

      </div>
    </>
  );
}
