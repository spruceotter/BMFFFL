import { useState, useMemo } from 'react';
import Head from 'next/head';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type Position = 'QB' | 'RB' | 'WR' | 'TE';

interface Player {
  id: string;
  name: string;
  pos: Position;
  value: number;
}

type Tier = 'S' | 'A' | 'B' | 'C' | 'D';

interface BmffflTeam {
  owner: string;
  teamName: string;
  value: number;
}

// ─── Player Pool ──────────────────────────────────────────────────────────────

const PLAYER_POOL: Player[] = [
  // QBs
  { id: 'lamar',     name: 'Lamar Jackson',      pos: 'QB', value: 9200 },
  { id: 'allen',     name: 'Josh Allen',          pos: 'QB', value: 9100 },
  { id: 'hurts',     name: 'Jalen Hurts',         pos: 'QB', value: 8800 },
  { id: 'stroud',    name: 'CJ Stroud',           pos: 'QB', value: 8700 },
  { id: 'ar',        name: 'Anthony Richardson',  pos: 'QB', value: 8400 },
  { id: 'daniels',   name: 'Jayden Daniels',      pos: 'QB', value: 8200 },
  { id: 'caleb',     name: 'Caleb Williams',      pos: 'QB', value: 7800 },
  { id: 'love',      name: 'Jordan Love',         pos: 'QB', value: 7600 },
  { id: 'darnold',   name: 'Sam Darnold',         pos: 'QB', value: 6800 },
  { id: 'murray',    name: 'Kyler Murray',        pos: 'QB', value: 6500 },
  // RBs
  { id: 'bijan',     name: 'Bijan Robinson',      pos: 'RB', value: 9400 },
  { id: 'breece',    name: 'Breece Hall',         pos: 'RB', value: 9000 },
  { id: 'gibbs',     name: 'Jahmyr Gibbs',        pos: 'RB', value: 8900 },
  { id: 'achane',    name: 'DeVon Achane',        pos: 'RB', value: 8600 },
  { id: 'brooks',    name: 'Jonathon Brooks',     pos: 'RB', value: 7800 },
  { id: 'cook',      name: 'James Cook',          pos: 'RB', value: 7600 },
  { id: 'kyren',     name: 'Kyren Williams',      pos: 'RB', value: 7200 },
  { id: 'white',     name: 'Rashad White',        pos: 'RB', value: 6800 },
  { id: 'javonte',   name: 'Javonte Williams',    pos: 'RB', value: 5900 },
  { id: 'pollard',   name: 'Tony Pollard',        pos: 'RB', value: 5400 },
  // WRs
  { id: 'chase',     name: "Ja'Marr Chase",       pos: 'WR', value: 9800 },
  { id: 'jefferson', name: 'Justin Jefferson',    pos: 'WR', value: 9600 },
  { id: 'lamb',      name: 'CeeDee Lamb',         pos: 'WR', value: 9500 },
  { id: 'puka',      name: 'Puka Nacua',          pos: 'WR', value: 8800 },
  { id: 'stbrown',   name: "AmonRa St'Brown",     pos: 'WR', value: 8700 },
  { id: 'nabers',    name: 'Malik Nabers',        pos: 'WR', value: 8400 },
  { id: 'mhj',       name: 'Marvin Harrison Jr',  pos: 'WR', value: 8300 },
  { id: 'london',    name: 'Drake London',        pos: 'WR', value: 8100 },
  { id: 'btj',       name: 'Brian Thomas Jr',     pos: 'WR', value: 8000 },
  { id: 'rice',      name: 'Rashee Rice',         pos: 'WR', value: 7800 },
  { id: 'tyreek',    name: 'Tyreek Hill',         pos: 'WR', value: 5800 },
  { id: 'adams',     name: 'Davante Adams',       pos: 'WR', value: 5200 },
  // TEs
  { id: 'bowers',    name: 'Brock Bowers',        pos: 'TE', value: 9200 },
  { id: 'laporta',   name: 'Sam LaPorta',         pos: 'TE', value: 8200 },
  { id: 'mcbride',   name: 'Trey McBride',        pos: 'TE', value: 8000 },
  { id: 'kraft',     name: 'Tucker Kraft',        pos: 'TE', value: 7200 },
  { id: 'ferguson',  name: 'Jake Ferguson',       pos: 'TE', value: 7000 },
  { id: 'kincaid',   name: 'Dalton Kincaid',      pos: 'TE', value: 6500 },
];

// ─── BMFFFL Teams for comparison ──────────────────────────────────────────────

const BMFFFL_TEAMS: BmffflTeam[] = [
  { owner: 'Flint',    teamName: 'The Flintstone Phenoms',    value: 87400 },
  { owner: 'Marcus',   teamName: 'Marcus Madness',            value: 83200 },
  { owner: 'Devon',    teamName: "Devon's Destroyers",        value: 79800 },
  { owner: 'Kelsey',   teamName: 'Kelsey Killers',            value: 76500 },
  { owner: 'Trent',    teamName: "Trent's Trenchers",         value: 74100 },
  { owner: 'Jordan',   teamName: 'Jordan Juggernauts',        value: 71300 },
  { owner: 'Casey',    teamName: 'Casey Crushers',            value: 68700 },
  { owner: 'Taylor',   teamName: 'Taylor Tornadoes',          value: 65400 },
  { owner: 'Morgan',   teamName: 'Morgan Maulers',            value: 62800 },
  { owner: 'Riley',    teamName: 'Riley Raiders',             value: 59200 },
  { owner: 'Avery',    teamName: 'Avery All-Stars',           value: 55600 },
  { owner: 'Jamie',    teamName: 'Jamie Jukes',               value: 51900 },
];

// ─── Constants ────────────────────────────────────────────────────────────────

// Elite benchmark: top 2 QBs + top 4 RBs + top 4 WRs + top 2 TEs
// QB: 9200+9100 = 18300
// RB: 9400+9000+8900+8600 = 35900
// WR: 9800+9600+9500+8800 = 37700
// TE: 9200+8200 = 17400
// Total elite = 109300
const ELITE_BENCHMARK = 109300;

const ROSTER_LIMITS = {
  QB: { min: 1, max: 2 },
  RB: { min: 2, max: 4 },
  WR: { min: 2, max: 4 },
  TE: { min: 1, max: 2 },
};

const POS_COLORS: Record<Position, string> = {
  QB: 'bg-purple-500/20 text-purple-300 border border-purple-500/40',
  RB: 'bg-blue-500/20   text-blue-300   border border-blue-500/40',
  WR: 'bg-sky-500/20    text-sky-300    border border-sky-500/40',
  TE: 'bg-orange-500/20 text-orange-300 border border-orange-500/40',
};

const TIER_CONFIG: Record<Tier, { label: string; color: string; bg: string; border: string }> = {
  S: { label: 'S-Tier', color: 'text-yellow-300',  bg: 'bg-yellow-500/20',  border: 'border-yellow-500/60' },
  A: { label: 'A-Tier', color: 'text-emerald-300', bg: 'bg-emerald-500/20', border: 'border-emerald-500/60' },
  B: { label: 'B-Tier', color: 'text-blue-300',    bg: 'bg-blue-500/20',    border: 'border-blue-500/60' },
  C: { label: 'C-Tier', color: 'text-amber-300',   bg: 'bg-amber-500/20',   border: 'border-amber-500/60' },
  D: { label: 'D-Tier', color: 'text-red-300',     bg: 'bg-red-500/20',     border: 'border-red-500/60' },
};

const BIMFLE_ASSESSMENTS: Record<Tier, string> = {
  S: "Your Commissioner is... unsettled. This roster is an affront to competitive balance. Bimfle is obligated to advise the league to watch this manager with considerable suspicion. ~Love, Bimfle.",
  A: "A formidable construction. Championship caliber, should injuries cooperate. Bimfle approves. ~Love, Bimfle.",
  B: "Adequate. One star player away from genuine contention. The FAAB budget may be your salvation. ~Love, Bimfle.",
  C: "Your Commissioner notes several positions of concern. A thoughtful trade strategy is recommended with some urgency. ~Love, Bimfle.",
  D: "Bimfle has reviewed this roster and will be referring the matter to the Shame Board. ~Love, Bimfle.",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRating(totalValue: number): number {
  return Math.round((totalValue / ELITE_BENCHMARK) * 100);
}

function getTier(rating: number): Tier {
  if (rating >= 90) return 'S';
  if (rating >= 75) return 'A';
  if (rating >= 60) return 'B';
  if (rating >= 45) return 'C';
  return 'D';
}

function formatValue(v: number): string {
  return v.toLocaleString();
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TeamBuilderPage() {
  const [roster, setRoster] = useState<Player[]>([]);

  // Pool filtered by position and not already selected
  const poolByPos = useMemo(() => {
    const selectedIds = new Set(roster.map((p) => p.id));
    const result: Record<Position, Player[]> = { QB: [], RB: [], WR: [], TE: [] };
    for (const p of PLAYER_POOL) {
      if (!selectedIds.has(p.id)) result[p.pos].push(p);
    }
    return result;
  }, [roster]);

  const rosterByPos = useMemo(() => {
    const result: Record<Position, Player[]> = { QB: [], RB: [], WR: [], TE: [] };
    for (const p of roster) result[p.pos].push(p);
    return result;
  }, [roster]);

  const totalValue = useMemo(() => roster.reduce((s, p) => s + p.value, 0), [roster]);
  const rating = useMemo(() => (roster.length > 0 ? getRating(totalValue) : 0), [totalValue, roster]);
  const tier = useMemo(() => getTier(rating), [rating]);

  // Starting lineup: best QB, 2 best RBs, 2 best WRs, 1 best TE, 1 FLEX (next best RB/WR/TE)
  const { starters, bench } = useMemo(() => {
    const sorted = (pos: Position) =>
      [...rosterByPos[pos]].sort((a, b) => b.value - a.value);

    const startQB  = sorted('QB').slice(0, 1);
    const startRB  = sorted('RB').slice(0, 2);
    const startWR  = sorted('WR').slice(0, 2);
    const startTE  = sorted('TE').slice(0, 1);

    const usedIds = new Set([
      ...startQB, ...startRB, ...startWR, ...startTE,
    ].map((p) => p.id));

    // FLEX candidates: remaining RB/WR/TE not yet started
    const flexCandidates = roster
      .filter((p) => !usedIds.has(p.id) && (p.pos === 'RB' || p.pos === 'WR' || p.pos === 'TE'))
      .sort((a, b) => b.value - a.value);
    const flex = flexCandidates.slice(0, 1);
    flex.forEach((p) => usedIds.add(p.id));

    const startingList = [...startQB, ...startRB, ...startWR, ...startTE, ...flex];
    const benchList = roster.filter((p) => !usedIds.has(p.id));

    return { starters: startingList, bench: benchList };
  }, [roster, rosterByPos]);

  const starterValue = useMemo(() => starters.reduce((s, p) => s + p.value, 0), [starters]);

  // Compare to BMFFFL teams
  const leagueComparison = useMemo(() => {
    const all = [
      ...BMFFFL_TEAMS,
      { owner: 'Your Team', teamName: 'My Dream Roster', value: totalValue },
    ].sort((a, b) => b.value - a.value);
    const rank = all.findIndex((t) => t.owner === 'Your Team') + 1;
    return { teams: all, rank };
  }, [totalValue]);

  function addPlayer(player: Player) {
    const posCount = rosterByPos[player.pos].length;
    if (posCount >= ROSTER_LIMITS[player.pos].max) return;
    if (roster.length >= 10) return;
    setRoster((prev) => [...prev, player]);
  }

  function removePlayer(id: string) {
    setRoster((prev) => prev.filter((p) => p.id !== id));
  }

  function resetRoster() {
    setRoster([]);
  }

  const tierCfg = TIER_CONFIG[tier];

  return (
    <>
      <Head>
        <title>Dynasty Team Builder | BMFFFL Analytics</title>
        <meta
          name="description"
          content="Build your ideal BMFFFL dynasty roster, see your total dynasty value and rating, and get a Bimfle Assessment of your construction."
        />
      </Head>

      <main className="min-h-screen bg-[#0d1b2a] text-white pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[#ffd700] text-2xl" aria-hidden="true">🏗️</span>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Dynasty Team Builder
              </h1>
            </div>
            <p className="text-slate-400 text-lg mt-1">
              Construct your dream roster — Bimfle will rate it
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Left / Main Panel — Player Selection */}
            <div className="xl:col-span-2 space-y-6">

              {((['QB', 'RB', 'WR', 'TE'] as Position[])).map((pos) => {
                const selected = rosterByPos[pos];
                const available = poolByPos[pos];
                const limit = ROSTER_LIMITS[pos];
                const atMax = selected.length >= limit.max;

                return (
                  <section
                    key={pos}
                    className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-5"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          'px-2.5 py-0.5 rounded-md text-xs font-bold border',
                          POS_COLORS[pos]
                        )}>
                          {pos}
                        </span>
                        <h2 className="text-white font-semibold text-sm">
                          {pos === 'QB' && 'Quarterbacks'}
                          {pos === 'RB' && 'Running Backs'}
                          {pos === 'WR' && 'Wide Receivers'}
                          {pos === 'TE' && 'Tight Ends'}
                        </h2>
                      </div>
                      <span className="text-xs text-slate-500">
                        {selected.length} / {limit.max} max
                        <span className="ml-1 text-slate-600">(min {limit.min})</span>
                      </span>
                    </div>

                    {/* Selected chips */}
                    {selected.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selected.map((player) => (
                          <div
                            key={player.id}
                            className={cn(
                              'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium',
                              POS_COLORS[pos]
                            )}
                          >
                            <span>{player.name}</span>
                            <span className="text-xs opacity-75">{formatValue(player.value)}</span>
                            <button
                              type="button"
                              onClick={() => removePlayer(player.id)}
                              className="ml-1 opacity-60 hover:opacity-100 transition-opacity text-xs font-bold leading-none"
                              aria-label={`Remove ${player.name}`}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Dropdown to add */}
                    {!atMax && available.length > 0 ? (
                      <select
                        className={cn(
                          'w-full max-w-sm bg-[#0d1b2a] border border-[#2d4a66] rounded-lg px-3 py-2',
                          'text-sm text-slate-300 focus:outline-none focus:border-[#ffd700]/60',
                          'cursor-pointer'
                        )}
                        value=""
                        onChange={(e) => {
                          const player = PLAYER_POOL.find((p) => p.id === e.target.value);
                          if (player) addPlayer(player);
                        }}
                        aria-label={`Add ${pos} to roster`}
                      >
                        <option value="" disabled>
                          + Add {pos}...
                        </option>
                        {available.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({formatValue(p.value)})
                          </option>
                        ))}
                      </select>
                    ) : atMax ? (
                      <p className="text-xs text-slate-600 italic">
                        Max {limit.max} {pos}s selected
                      </p>
                    ) : (
                      <p className="text-xs text-slate-600 italic">All available players selected</p>
                    )}
                  </section>
                );
              })}

              {/* Roster cap info */}
              <p className="text-xs text-slate-600 text-center">
                Up to 10 players total — {10 - roster.length} slot{10 - roster.length !== 1 ? 's' : ''} remaining
              </p>

              {/* Reset */}
              {roster.length > 0 && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={resetRoster}
                    className="px-6 py-2 rounded-lg border border-red-500/40 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors duration-150"
                  >
                    Reset Roster
                  </button>
                </div>
              )}

              {/* Starting Lineup + Bench */}
              {roster.length > 0 && (
                <section className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-5">
                  <h2 className="text-white font-bold text-base mb-4">Optimal Starting Lineup</h2>

                  {starters.length > 0 ? (
                    <div className="space-y-2 mb-6">
                      {starters.map((player, i) => {
                        let slot = player.pos as string;
                        const rbStarters  = starters.filter((p) => p.pos === 'RB');
                        const wrStarters  = starters.filter((p) => p.pos === 'WR');
                        // Determine if this is a flex slot
                        const qbCount  = starters.filter((p) => p.pos === 'QB').length;
                        const rbCount  = rbStarters.length;
                        const wrCount  = wrStarters.length;
                        const teCount  = starters.filter((p) => p.pos === 'TE').length;
                        // Count how many of this player's pos appear before it in starters
                        const posIdx = starters.filter((p, idx) => p.pos === player.pos && idx <= i).length;
                        const maxForPos = player.pos === 'QB' ? 1
                          : player.pos === 'RB' ? 2
                          : player.pos === 'WR' ? 2
                          : 1;
                        if (posIdx > maxForPos) slot = 'FLEX';

                        return (
                          <div key={player.id} className="flex items-center justify-between bg-[#0d1b2a]/60 rounded-lg px-4 py-2.5">
                            <div className="flex items-center gap-3">
                              <span className={cn(
                                'w-14 text-center px-1.5 py-0.5 rounded text-xs font-bold border',
                                slot === 'FLEX'
                                  ? 'bg-pink-500/20 text-pink-300 border-pink-500/40'
                                  : POS_COLORS[player.pos]
                              )}>
                                {slot}
                              </span>
                              <span className="text-sm text-white font-medium">{player.name}</span>
                            </div>
                            <span className="text-sm text-[#ffd700] font-mono font-semibold">
                              {formatValue(player.value)}
                            </span>
                          </div>
                        );
                      })}
                      <div className="flex items-center justify-between px-4 py-2 border-t border-[#2d4a66] mt-1">
                        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Starter Value</span>
                        <span className="text-sm text-[#ffd700] font-mono font-bold">{formatValue(starterValue)}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic mb-4">Add players to populate your lineup.</p>
                  )}

                  {bench.length > 0 && (
                    <>
                      <h3 className="text-slate-400 font-semibold text-sm mb-3">Bench</h3>
                      <div className="space-y-2">
                        {bench.map((player) => (
                          <div key={player.id} className="flex items-center justify-between bg-[#0d1b2a]/40 rounded-lg px-4 py-2.5 opacity-70">
                            <div className="flex items-center gap-3">
                              <span className={cn(
                                'w-14 text-center px-1.5 py-0.5 rounded text-xs font-bold border',
                                POS_COLORS[player.pos]
                              )}>
                                {player.pos}
                              </span>
                              <span className="text-sm text-slate-300">{player.name}</span>
                            </div>
                            <span className="text-sm text-slate-400 font-mono">{formatValue(player.value)}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </section>
              )}

              {/* Compare to BMFFFL Teams */}
              {roster.length > 0 && (
                <section className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-5">
                  <h2 className="text-white font-bold text-base mb-1">Compare to BMFFFL Teams</h2>
                  <p className="text-xs text-slate-500 mb-4">
                    How your hypothetical roster stacks up against the 12 BMFFFL managers by dynasty value.
                  </p>

                  <div className="space-y-2">
                    {leagueComparison.teams.map((team, i) => {
                      const isYours = team.owner === 'Your Team';
                      const pct = Math.round((team.value / leagueComparison.teams[0].value) * 100);
                      return (
                        <div
                          key={team.owner}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2.5',
                            isYours
                              ? 'bg-[#ffd700]/10 border border-[#ffd700]/40'
                              : 'bg-[#0d1b2a]/50'
                          )}
                        >
                          <span className={cn(
                            'w-6 text-center text-xs font-bold',
                            i === 0 ? 'text-[#ffd700]' : 'text-slate-500'
                          )}>
                            {i + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className={cn(
                                'text-sm font-medium truncate',
                                isYours ? 'text-[#ffd700]' : 'text-slate-300'
                              )}>
                                {isYours ? 'Your Dream Roster' : team.teamName}
                                {isYours && (
                                  <span className="ml-2 text-xs font-normal text-[#ffd700]/60">(you)</span>
                                )}
                              </span>
                              <span className={cn(
                                'text-xs font-mono ml-2 shrink-0',
                                isYours ? 'text-[#ffd700]' : 'text-slate-400'
                              )}>
                                {formatValue(team.value)}
                              </span>
                            </div>
                            <div className="w-full bg-[#2d4a66]/40 rounded-full h-1">
                              <div
                                className={cn(
                                  'h-1 rounded-full transition-all duration-300',
                                  isYours ? 'bg-[#ffd700]' : 'bg-[#2d4a66]'
                                )}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {roster.length > 0 && (
                    <p className="text-xs text-slate-500 mt-3 text-center">
                      Your team ranks <span className="text-white font-semibold">#{leagueComparison.rank}</span> of 13
                    </p>
                  )}
                </section>
              )}
            </div>

            {/* Right Sidebar — Rating Panel */}
            <div className="space-y-5">

              {/* Total Value & Rating */}
              <div className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-5 sticky top-24">
                <h2 className="text-white font-bold text-base mb-5">Roster Rating</h2>

                {roster.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500 text-sm italic">Add players to see your rating</p>
                    <div className="mt-4 text-4xl font-black text-[#2d4a66]">—</div>
                  </div>
                ) : (
                  <>
                    {/* Rating score */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-4xl font-black text-white tracking-tight">
                          {rating}
                          <span className="text-lg text-slate-500 ml-1">/ 100</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">vs elite benchmark</p>
                      </div>
                      <div className={cn(
                        'px-4 py-2 rounded-xl text-xl font-black border',
                        tierCfg.bg, tierCfg.color, tierCfg.border
                      )}>
                        {tierCfg.label}
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-[#0d1b2a] rounded-full h-3 mb-5 overflow-hidden">
                      <div
                        className={cn(
                          'h-3 rounded-full transition-all duration-500',
                          tier === 'S' ? 'bg-yellow-400'
                          : tier === 'A' ? 'bg-emerald-400'
                          : tier === 'B' ? 'bg-blue-400'
                          : tier === 'C' ? 'bg-amber-400'
                          : 'bg-red-400'
                        )}
                        style={{ width: `${Math.min(rating, 100)}%` }}
                      />
                    </div>

                    {/* Tier scale */}
                    <div className="flex justify-between text-xs text-slate-600 mb-5 px-0.5">
                      <span>D &lt;45</span>
                      <span>C 45</span>
                      <span>B 60</span>
                      <span>A 75</span>
                      <span>S 90+</span>
                    </div>

                    {/* Total dynasty value */}
                    <div className="bg-[#0d1b2a]/60 rounded-lg px-4 py-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 uppercase tracking-wider">Total Dynasty Value</span>
                        <span className="text-lg font-black text-[#ffd700] font-mono">
                          {formatValue(totalValue)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-slate-500 uppercase tracking-wider">Players Selected</span>
                        <span className="text-sm font-semibold text-white">{roster.length} / 10</span>
                      </div>
                    </div>

                    {/* Position breakdown */}
                    <div className="space-y-2 mb-5">
                      {(['QB', 'RB', 'WR', 'TE'] as Position[]).map((pos) => {
                        const posPlayers = rosterByPos[pos];
                        const posVal = posPlayers.reduce((s, p) => s + p.value, 0);
                        return (
                          <div key={pos} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                'px-1.5 py-0.5 rounded text-xs font-bold border',
                                POS_COLORS[pos]
                              )}>
                                {pos}
                              </span>
                              <span className="text-slate-400">{posPlayers.length} player{posPlayers.length !== 1 ? 's' : ''}</span>
                            </div>
                            <span className="text-slate-300 font-mono text-xs">
                              {posVal > 0 ? formatValue(posVal) : '—'}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bimfle's Assessment */}
                    <div className={cn(
                      'rounded-xl p-4 border',
                      tierCfg.bg, tierCfg.border
                    )}>
                      <p className="text-xs font-black uppercase tracking-widest mb-2 text-[#ffd700]">
                        Bimfle&apos;s Assessment
                      </p>
                      <p className={cn('text-sm leading-relaxed italic', tierCfg.color)}>
                        &ldquo;{BIMFLE_ASSESSMENTS[tier]}&rdquo;
                      </p>
                    </div>
                  </>
                )}

                {/* Roster requirements hint */}
                {roster.length < 7 && roster.length > 0 && (
                  <div className="mt-4 bg-[#0d1b2a]/60 rounded-lg px-4 py-3 text-xs text-slate-500">
                    <p className="font-semibold text-slate-400 mb-1">Recommended minimums:</p>
                    <ul className="space-y-0.5">
                      {(['QB', 'RB', 'WR', 'TE'] as Position[]).map((pos) => {
                        const count  = rosterByPos[pos].length;
                        const needed = ROSTER_LIMITS[pos].min;
                        const met    = count >= needed;
                        return (
                          <li key={pos} className={met ? 'text-emerald-500/70' : 'text-amber-500/70'}>
                            {met ? '✓' : '○'} {pos}: {count}/{needed} min
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
