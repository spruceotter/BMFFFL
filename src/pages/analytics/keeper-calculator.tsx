import { useState, useMemo } from 'react';
import Head from 'next/head';
import { cn } from '@/lib/cn';
import Breadcrumb from '@/components/ui/Breadcrumb';

// ─── Types ────────────────────────────────────────────────────────────────────

type Position = 'QB' | 'RB' | 'WR' | 'TE';
type Recommendation = 'STASH' | 'HOLD' | 'SELL';
type FilterTab = 'ALL' | Recommendation;

interface KeeperPlayer {
  name: string;
  pos: Position;
  age: number;
  value: number;
  rec: Recommendation;
  reason: string;
}

// ─── Position age-curve context ───────────────────────────────────────────────

const POSITION_CURVE: Record<Position, { label: string; peak: string; cliff: number }> = {
  WR: { label: 'Wide Receiver',  peak: 'Ages 24–28',  cliff: 30 },
  RB: { label: 'Running Back',   peak: 'Ages 23–25',  cliff: 28 },
  TE: { label: 'Tight End',      peak: 'Ages 25–28',  cliff: 30 },
  QB: { label: 'Quarterback',    peak: 'Ages 27–32',  cliff: 33 },
};

// ─── Value arc projection logic ───────────────────────────────────────────────

function projectValue(player: KeeperPlayer, yearsForward: number): number {
  const { pos, age, value, rec } = player;
  const futureAge = age + yearsForward;
  const curve = POSITION_CURVE[pos];

  if (rec === 'SELL') {
    // Already declining — accelerate decay
    return Math.max(0, Math.round(value * Math.pow(0.78, yearsForward)));
  }

  if (futureAge < curve.cliff - 2) {
    // Still within or approaching peak
    const growthFactor = rec === 'STASH' ? 1.08 : 1.02;
    return Math.round(value * Math.pow(growthFactor, yearsForward));
  }

  if (futureAge >= curve.cliff) {
    // Past cliff
    return Math.max(0, Math.round(value * Math.pow(0.75, yearsForward)));
  }

  // Approaching cliff — modest decay
  return Math.max(0, Math.round(value * Math.pow(0.92, yearsForward)));
}

// ─── Player data ──────────────────────────────────────────────────────────────

const PLAYERS: KeeperPlayer[] = [
  { name: 'Bijan Robinson',    pos: 'RB', age: 23, value: 9400, rec: 'STASH', reason: 'Elite age/value combo. RB age curve peaks 23–26.' },
  { name: 'Breece Hall',       pos: 'RB', age: 23, value: 9000, rec: 'STASH', reason: "Hall's athletic profile ages extremely well." },
  { name: 'Jahmyr Gibbs',      pos: 'RB', age: 23, value: 8900, rec: 'STASH', reason: 'Motor and explosiveness rare at age 23.' },
  { name: "De'Von Achane",     pos: 'RB', age: 23, value: 8600, rec: 'STASH', reason: 'Smaller RBs age longer. Ceiling untouched.' },
  { name: "Ja'Marr Chase",     pos: 'WR', age: 25, value: 9800, rec: 'STASH', reason: 'Only 25. At least 5 peak years remaining.' },
  { name: 'Justin Jefferson',  pos: 'WR', age: 26, value: 9600, rec: 'STASH', reason: 'Still in his prime window.' },
  { name: 'CeeDee Lamb',       pos: 'WR', age: 25, value: 9500, rec: 'STASH', reason: 'Long-term WR1, still ascending.' },
  { name: 'Brock Bowers',      pos: 'TE', age: 22, value: 9200, rec: 'STASH', reason: 'Historic TE prospect. Age 22.' },
  { name: 'Sam LaPorta',       pos: 'TE', age: 23, value: 8200, rec: 'STASH', reason: 'High floor, just entering peak.' },
  { name: 'Lamar Jackson',     pos: 'QB', age: 28, value: 9200, rec: 'HOLD',  reason: 'Still elite but entering maintenance window.' },
  { name: 'Josh Allen',        pos: 'QB', age: 29, value: 9100, rec: 'HOLD',  reason: '29 is the QB age cliff. Use with awareness.' },
  { name: 'Malik Nabers',      pos: 'WR', age: 21, value: 8400, rec: 'STASH', reason: 'Only 21. Massive ceiling.' },
  { name: 'Marvin Harrison Jr', pos: 'WR', age: 22, value: 8300, rec: 'STASH', reason: 'Age 22 WR with top-5 talent.' },
  { name: 'Drake London',      pos: 'WR', age: 23, value: 8100, rec: 'STASH', reason: 'Physical WR with elite volume floor.' },
  { name: 'Brian Thomas Jr',   pos: 'WR', age: 22, value: 8000, rec: 'STASH', reason: 'Explosive playmaker entering peak.' },
  { name: 'Puka Nacua',        pos: 'WR', age: 24, value: 8800, rec: 'STASH', reason: 'Established at 24, still ascending.' },
  { name: 'Kyren Williams',    pos: 'RB', age: 25, value: 7200, rec: 'HOLD',  reason: 'Good but RB age curve means sell window is near.' },
  { name: 'Tony Pollard',      pos: 'RB', age: 28, value: 5400, rec: 'SELL',  reason: 'RB at 28 is dynasty dead zone. Value falling.' },
  { name: 'Davante Adams',     pos: 'WR', age: 33, value: 5200, rec: 'SELL',  reason: 'Age 33 WR. Exit now.' },
  { name: 'Tyreek Hill',       pos: 'WR', age: 31, value: 5800, rec: 'SELL',  reason: 'Speed-based WR at 31. Time to sell.' },
  { name: 'Trey McBride',      pos: 'TE', age: 25, value: 8000, rec: 'STASH', reason: '25-year-old TE1. Peak years ahead.' },
  { name: 'Tucker Kraft',      pos: 'TE', age: 24, value: 7200, rec: 'STASH', reason: '24 with TE1 upside.' },
  { name: 'Kyler Murray',      pos: 'QB', age: 27, value: 6500, rec: 'HOLD',  reason: 'Mobile QB, injury concerns limit ceiling.' },
  { name: 'Anthony Richardson', pos: 'QB', age: 23, value: 8400, rec: 'HOLD', reason: 'Elite ceiling, injury risk is the wildcard.' },
  { name: 'James Cook',        pos: 'RB', age: 24, value: 7600, rec: 'STASH', reason: '24 with elite athleticism, good usage.' },
  { name: 'Jonathon Brooks',   pos: 'RB', age: 22, value: 7800, rec: 'STASH', reason: 'ACL recovery adds risk but age/talent elite.' },
  { name: 'Rashad White',      pos: 'RB', age: 24, value: 6800, rec: 'HOLD',  reason: 'Good but committee limits ceiling.' },
  { name: 'Jake Ferguson',     pos: 'TE', age: 25, value: 7000, rec: 'HOLD',  reason: 'Solid TE2 but limited ceiling.' },
  { name: 'Rashee Rice',       pos: 'WR', age: 24, value: 7800, rec: 'STASH', reason: '24 with WR1 upside if he stays healthy.' },
  { name: 'Sam Darnold',       pos: 'QB', age: 28, value: 6800, rec: 'SELL',  reason: 'Journey QB, regression likely.' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const REC_COLORS: Record<Recommendation, { bg: string; text: string; border: string; badge: string }> = {
  STASH: {
    bg:     'bg-emerald-900/30',
    text:   'text-emerald-400',
    border: 'border-emerald-500/40',
    badge:  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50',
  },
  HOLD: {
    bg:     'bg-amber-900/30',
    text:   'text-amber-400',
    border: 'border-amber-500/40',
    badge:  'bg-amber-500/20 text-amber-300 border border-amber-500/50',
  },
  SELL: {
    bg:     'bg-red-900/30',
    text:   'text-red-400',
    border: 'border-red-500/40',
    badge:  'bg-red-500/20 text-red-300 border border-red-500/50',
  },
};

const POS_COLORS: Record<Position, string> = {
  QB: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  RB: 'bg-blue-500/20   text-blue-300   border-blue-500/40',
  WR: 'bg-sky-500/20    text-sky-300    border-sky-500/40',
  TE: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
};

function valueTierLabel(value: number): string {
  if (value >= 9000) return 'Dynasty Elite';
  if (value >= 8000) return 'Tier 1';
  if (value >= 7000) return 'Tier 2';
  if (value >= 5500) return 'Tier 3';
  return 'Aging Asset';
}

function peakYearsRemaining(player: KeeperPlayer): number {
  const cliff = POSITION_CURVE[player.pos].cliff;
  return Math.max(0, cliff - player.age);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ValueArc({ player }: { player: KeeperPlayer }) {
  const milestones = [0, 2, 4, 6];
  const projected = milestones.map((y) => ({
    label: `Age ${player.age + y}`,
    value: projectValue(player, y),
  }));

  const maxVal = Math.max(...projected.map((p) => p.value));

  return (
    <div className="mt-6">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
        Projected Value Arc
      </h3>
      <div className="flex items-end gap-3 h-28">
        {projected.map(({ label, value }, i) => {
          const heightPct = maxVal > 0 ? Math.round((value / maxVal) * 100) : 0;
          const isFirst = i === 0;
          const barColor = isFirst
            ? 'bg-[#ffd700]'
            : value >= projected[0].value
            ? 'bg-emerald-500'
            : 'bg-red-500';

          return (
            <div key={label} className="flex flex-col items-center flex-1 gap-1">
              <span className="text-xs font-medium text-slate-300">
                {value.toLocaleString()}
              </span>
              <div className="w-full flex items-end" style={{ height: '72px' }}>
                <div
                  className={cn('w-full rounded-t transition-all duration-500', barColor)}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 text-center leading-tight">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PlayerCard({ player }: { player: KeeperPlayer }) {
  const rec = REC_COLORS[player.rec];
  const pos = POS_COLORS[player.pos];
  const curve = POSITION_CURVE[player.pos];
  const peakYrs = peakYearsRemaining(player);

  return (
    <div className={cn('rounded-xl border p-6', rec.bg, rec.border)}>
      {/* Header row */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-black text-white">{player.name}</h2>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={cn('text-xs font-bold px-2 py-0.5 rounded border', pos)}>
              {player.pos}
            </span>
            <span className="text-sm text-slate-400">Age {player.age}</span>
            <span className="text-sm text-slate-400">&mdash;</span>
            <span className="text-sm text-slate-400">{valueTierLabel(player.value)}</span>
          </div>
        </div>

        {/* Big recommendation badge */}
        <div className="flex flex-col items-end gap-1">
          <span
            className={cn(
              'text-3xl font-black px-5 py-2 rounded-lg border tracking-wider',
              rec.badge
            )}
          >
            {player.rec}
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        <div className="bg-black/30 rounded-lg p-3">
          <div className="text-xs text-slate-500 uppercase tracking-wider">Dynasty Value</div>
          <div className="text-xl font-bold text-[#ffd700] mt-0.5">
            {player.value.toLocaleString()}
          </div>
        </div>
        <div className="bg-black/30 rounded-lg p-3">
          <div className="text-xs text-slate-500 uppercase tracking-wider">Peak Yrs Left</div>
          <div className="text-xl font-bold text-white mt-0.5">
            {peakYrs > 0 ? `~${peakYrs}` : '0'}
          </div>
        </div>
        <div className="bg-black/30 rounded-lg p-3 col-span-2 sm:col-span-1">
          <div className="text-xs text-slate-500 uppercase tracking-wider">Pos Peak Window</div>
          <div className="text-sm font-semibold text-slate-300 mt-0.5">{curve.peak}</div>
        </div>
      </div>

      {/* Rationale */}
      <div className={cn('rounded-lg px-4 py-3 border text-sm', rec.bg, rec.border)}>
        <span className={cn('font-bold mr-2', rec.text)}>Analysis:</span>
        <span className="text-slate-300">{player.reason}</span>
      </div>

      {/* Value arc */}
      <ValueArc player={player} />

      {/* Age curve context */}
      <p className="mt-4 text-xs text-slate-500 italic">
        {curve.label} age curve: peak window {curve.peak}, dynasty cliff typically around age {curve.cliff}.
      </p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const POSITIONS: Position[] = ['QB', 'RB', 'WR', 'TE'];
const FILTER_TABS: FilterTab[] = ['ALL', 'STASH', 'HOLD', 'SELL'];

export default function KeeperCalculatorPage() {
  const [selectedName, setSelectedName] = useState<string>('');
  const [filter, setFilter] = useState<FilterTab>('ALL');

  const selectedPlayer = useMemo(
    () => PLAYERS.find((p) => p.name === selectedName) ?? null,
    [selectedName]
  );

  const sortedByAge = useMemo(
    () => [...PLAYERS].sort((a, b) => a.age - b.age || a.name.localeCompare(b.name)),
    []
  );

  const filteredPlayers = useMemo(
    () => (filter === 'ALL' ? sortedByAge : sortedByAge.filter((p) => p.rec === filter)),
    [sortedByAge, filter]
  );

  return (
    <>
      <Head>
        <title>Keeper Calculator | BMFFFL Dynasty Analytics</title>
        <meta
          name="description"
          content="Dynasty stash analysis for BMFFFL managers. Should you hold, trade, or cut? Age-based value projections for 30 key dynasty players."
        />
      </Head>

      <main className="min-h-screen bg-[#0d1b2a] text-white pt-20 pb-16 px-4">
        <div className="max-w-5xl mx-auto">

          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: 'Analytics', href: '/analytics' },
            { label: 'Keeper Calculator' },
          ]} />

          {/* Page header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[#ffd700] text-3xl font-black">&#9733;</span>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Keeper Calculator
              </h1>
            </div>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl">
              Dynasty stash analysis &mdash; should you hold, trade, or cut?
            </p>
          </div>

          {/* Player selector */}
          <div className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-5 mb-8">
            <label
              htmlFor="player-select"
              className="block text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wider"
            >
              Select a player to analyze
            </label>
            <select
              id="player-select"
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
              className="w-full bg-[#0d1b2a] border border-[#2d4a66] rounded-lg px-4 py-3 text-white text-base focus:outline-none focus:ring-2 focus:ring-[#ffd700]/50 focus:border-[#ffd700]/50"
            >
              <option value="">-- Choose a player --</option>
              {POSITIONS.map((pos) => {
                const group = PLAYERS.filter((p) => p.pos === pos).sort(
                  (a, b) => b.value - a.value
                );
                if (group.length === 0) return null;
                return (
                  <optgroup key={pos} label={`── ${pos}s ──`}>
                    {group.map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.name} &nbsp;&middot;&nbsp; Age {p.age} &nbsp;&middot;&nbsp; {p.rec}
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
          </div>

          {/* Player detail card */}
          {selectedPlayer ? (
            <div className="mb-12">
              <PlayerCard player={selectedPlayer} />
            </div>
          ) : (
            <div className="mb-12 bg-[#16213e] border border-[#2d4a66] rounded-xl p-8 text-center">
              <p className="text-slate-500 text-base italic">
                Select a player above to see their dynasty stash analysis.
              </p>
            </div>
          )}

          {/* Full table section */}
          <div className="mb-6">
            <h2 className="text-xl font-black text-white mb-1">All Players</h2>
            <p className="text-slate-500 text-sm mb-4">
              Sorted youngest first. Filter by recommendation.
            </p>

            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2 mb-5">
              {FILTER_TABS.map((tab) => {
                const count =
                  tab === 'ALL'
                    ? PLAYERS.length
                    : PLAYERS.filter((p) => p.rec === tab).length;
                return (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-bold border transition-colors duration-150',
                      filter === tab
                        ? tab === 'ALL'
                          ? 'bg-[#ffd700]/20 text-[#ffd700] border-[#ffd700]/50'
                          : cn(REC_COLORS[tab as Recommendation].badge)
                        : 'bg-[#16213e] text-slate-400 border-[#2d4a66] hover:text-white hover:border-slate-500'
                    )}
                  >
                    {tab}
                    <span className="ml-1.5 text-xs opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-[#2d4a66]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#16213e] border-b border-[#2d4a66]">
                    <th className="text-left px-4 py-3 text-slate-400 font-semibold uppercase tracking-wider text-xs">
                      Player
                    </th>
                    <th className="text-center px-3 py-3 text-slate-400 font-semibold uppercase tracking-wider text-xs">
                      Pos
                    </th>
                    <th className="text-center px-3 py-3 text-slate-400 font-semibold uppercase tracking-wider text-xs">
                      Age
                    </th>
                    <th className="text-right px-3 py-3 text-slate-400 font-semibold uppercase tracking-wider text-xs">
                      Value
                    </th>
                    <th className="text-center px-3 py-3 text-slate-400 font-semibold uppercase tracking-wider text-xs">
                      Rec
                    </th>
                    <th className="text-left px-4 py-3 text-slate-400 font-semibold uppercase tracking-wider text-xs hidden sm:table-cell">
                      Rationale
                    </th>
                    <th className="text-center px-3 py-3 text-slate-400 font-semibold uppercase tracking-wider text-xs hidden md:table-cell">
                      Analyze
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlayers.map((player, i) => {
                    const rec = REC_COLORS[player.rec];
                    const pos = POS_COLORS[player.pos];
                    return (
                      <tr
                        key={player.name}
                        className={cn(
                          'border-b border-[#1e2d45] transition-colors duration-100',
                          i % 2 === 0 ? 'bg-[#0d1b2a]' : 'bg-[#101e30]',
                          'hover:bg-[#16213e]'
                        )}
                      >
                        <td className="px-4 py-3 font-semibold text-white">{player.name}</td>
                        <td className="px-3 py-3 text-center">
                          <span
                            className={cn(
                              'text-xs font-bold px-2 py-0.5 rounded border',
                              pos
                            )}
                          >
                            {player.pos}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center text-slate-300">{player.age}</td>
                        <td className="px-3 py-3 text-right font-mono text-[#ffd700]">
                          {player.value.toLocaleString()}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span
                            className={cn(
                              'text-xs font-bold px-2 py-0.5 rounded border',
                              rec.badge
                            )}
                          >
                            {player.rec}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs hidden sm:table-cell">
                          {player.reason}
                        </td>
                        <td className="px-3 py-3 text-center hidden md:table-cell">
                          <button
                            onClick={() => {
                              setSelectedName(player.name);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="text-xs text-[#ffd700]/70 hover:text-[#ffd700] underline underline-offset-2 transition-colors"
                          >
                            Analyze
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bimfle note */}
          <div className="mt-10 bg-[#16213e] border border-[#2d4a66] rounded-xl p-6">
            <p className="text-slate-400 text-sm leading-relaxed italic">
              &ldquo;The dynasty manager who sells a 22-year-old elite prospect has committed an error
              of the most preventable variety. That said, Bimfle also once rostered Adrian Peterson
              past age 33. We learn.&rdquo;
            </p>
            <p className="text-[#ffd700] text-xs font-bold mt-2">~ Love, Bimfle</p>
          </div>

        </div>
      </main>
    </>
  );
}
