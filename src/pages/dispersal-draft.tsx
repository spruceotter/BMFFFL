/**
 * BMFFFL Dispersal Draft — /dispersal-draft
 *
 * Commissioner-controlled snake draft tool for the 2026 orphan roster dispersal.
 * Participating teams put their rosters into a pool; new owner picks first each round.
 *
 * Convex task types:
 *   dispersal_setup  — pool + team order configured by commissioner
 *   dispersal_pick   — each pick made during the draft
 *
 * Admin mode: append ?admin=1 to URL to show commissioner controls.
 */

import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, ChevronDown, ChevronUp, Search, Settings, CheckCircle2 } from 'lucide-react';

// ─── Config ──────────────────────────────────────────────────────────────────

const CONVEX_URL = 'https://resolute-setter-416.convex.cloud';

const POSITIONS = ['QB', 'RB', 'WR', 'TE', 'K', 'DEF'];

const POSITION_COLORS: Record<string, string> = {
  QB: '#f97316',
  RB: '#22c55e',
  WR: '#3b82f6',
  TE: '#a855f7',
  K: '#6b7280',
  DEF: '#eab308',
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface PoolPlayer {
  id: string;
  name: string;
  position: string;
  nfl_team: string;
  source_team: string;
}

interface DraftSetup {
  participating_teams: string[];
  draft_order: string[];
  total_rounds: number;
  pool: PoolPlayer[];
  bonus_picks: string[];
  new_owner: string;
  configured_at: string;
}

interface DraftPick {
  round: number;
  pick_in_round: number;
  overall_pick: number;
  picking_team: string;
  player_id: string;
  player_name: string;
  position: string;
  nfl_team: string;
  source_team: string;
  picked_at: string;
}

// ─── Snake order helper ───────────────────────────────────────────────────────

function buildPickOrder(teams: string[], rounds: number): { round: number; pick: number; overall: number; team: string }[] {
  const picks: { round: number; pick: number; overall: number; team: string }[] = [];
  let overall = 1;
  for (let r = 1; r <= rounds; r++) {
    const order = r % 2 === 1 ? [...teams] : [...teams].reverse();
    order.forEach((team, i) => {
      picks.push({ round: r, pick: i + 1, overall, team });
      overall++;
    });
  }
  return picks;
}

// ─── Convex helpers ───────────────────────────────────────────────────────────

async function fetchDraftData(): Promise<{ setup: DraftSetup | null; picks: DraftPick[] }> {
  try {
    const resp = await fetch(`${CONVEX_URL}/api/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: 'bmfffl:getPendingTasksFor',
        format: 'json',
        args: { to_agent: 'bimfle' },
      }),
    });
    if (!resp.ok) return { setup: null, picks: [] };
    const json = await resp.json();
    const tasks = (json.value ?? []) as { task_type: string; payload: unknown }[];

    const setups: DraftSetup[] = [];
    const picks: DraftPick[] = [];

    for (const t of tasks) {
      if (t.task_type === 'dispersal_setup') setups.push(t.payload as DraftSetup);
      if (t.task_type === 'dispersal_pick') picks.push(t.payload as DraftPick);
    }

    setups.sort((a, b) => a.configured_at.localeCompare(b.configured_at));
    picks.sort((a, b) => a.overall_pick - b.overall_pick);

    return { setup: setups.length > 0 ? setups[setups.length - 1] : null, picks };
  } catch {
    return { setup: null, picks: [] };
  }
}

async function submitSetup(setup: Omit<DraftSetup, 'configured_at'>): Promise<void> {
  const now = new Date().toISOString();
  await fetch(`${CONVEX_URL}/api/mutation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      path: 'bmfffl:createTask',
      format: 'json',
      args: {
        to_agent: 'bimfle',
        task_type: 'dispersal_setup',
        payload: { ...setup, configured_at: now },
      },
    }),
  });
}

async function submitPick(pick: Omit<DraftPick, 'picked_at'>): Promise<void> {
  const now = new Date().toISOString();
  await fetch(`${CONVEX_URL}/api/mutation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      path: 'bmfffl:createTask',
      format: 'json',
      args: {
        to_agent: 'bimfle',
        task_type: 'dispersal_pick',
        payload: { ...pick, picked_at: now },
      },
    }),
  });
}

// ─── Components ───────────────────────────────────────────────────────────────

function PositionBadge({ pos }: { pos: string }) {
  const color = POSITION_COLORS[pos] ?? '#6b7280';
  return (
    <span
      className="text-xs font-bold px-1.5 py-0.5 rounded"
      style={{ backgroundColor: `${color}25`, color, border: `1px solid ${color}40` }}
    >
      {pos}
    </span>
  );
}

function PlayerCard({
  player,
  onPick,
  picked,
  compact = false,
}: {
  player: PoolPlayer;
  onPick?: (p: PoolPlayer) => void;
  picked?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
        picked
          ? 'opacity-30 border-gray-800 bg-gray-900/50'
          : onPick
          ? 'border-gray-700 bg-gray-900 hover:border-[#ffd700]/50 hover:bg-gray-800 cursor-pointer'
          : 'border-gray-800 bg-gray-900/50'
      } ${compact ? 'py-1.5' : ''}`}
      onClick={() => !picked && onPick?.(player)}
    >
      <PositionBadge pos={player.position} />
      <div className="flex-1 min-w-0">
        <p className={`font-medium text-white truncate ${compact ? 'text-sm' : ''}`}>{player.name}</p>
        <p className="text-gray-500 text-xs truncate">{player.nfl_team} · from {player.source_team}</p>
      </div>
      {picked && <CheckCircle2 size={14} className="text-gray-600 flex-shrink-0" />}
    </div>
  );
}

// ─── Setup Form ───────────────────────────────────────────────────────────────

function SetupForm({ onSubmit }: { onSubmit: (setup: Omit<DraftSetup, 'configured_at'>) => Promise<void> }) {
  const [newOwner, setNewOwner] = useState('');
  const [teams, setTeams] = useState('');
  const [rounds, setRounds] = useState(3);
  const [bonusPicks, setBonusPicks] = useState('1st Round Pick 2026 (Late)\n1st Round Pick 2027');
  const [poolText, setPoolText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = async () => {
    if (!newOwner.trim() || !teams.trim()) return;
    setSubmitting(true);

    const teamList = teams.split('\n').map((t) => t.trim()).filter(Boolean);
    const draftOrder = [newOwner.trim(), ...teamList.filter((t) => t !== newOwner.trim())];

    const pool: PoolPlayer[] = poolText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, i) => {
        // Format: "Name | POS | NFL_TEAM | SOURCE_TEAM"
        const parts = line.split('|').map((p) => p.trim());
        return {
          id: `player-${i}`,
          name: parts[0] ?? line,
          position: parts[1] ?? 'FLEX',
          nfl_team: parts[2] ?? '—',
          source_team: parts[3] ?? '—',
        };
      });

    const bonus = bonusPicks.split('\n').map((b) => b.trim()).filter(Boolean);

    await onSubmit({
      new_owner: newOwner.trim(),
      participating_teams: teamList,
      draft_order: draftOrder,
      total_rounds: rounds,
      pool,
      bonus_picks: bonus,
    });
    setSubmitting(false);
  };

  return (
    <div className="border border-gray-700 rounded-xl p-6 bg-gray-900/50">
      <button
        className="flex items-center justify-between w-full"
        onClick={() => setExpanded((e) => !e)}
      >
        <h3 className="text-[#ffd700] font-semibold flex items-center gap-2">
          <Settings size={16} /> Configure Draft
        </h3>
        {expanded ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-gray-400 text-sm font-medium block mb-1">New Owner Name</label>
            <input
              value={newOwner}
              onChange={(e) => setNewOwner(e.target.value)}
              placeholder="e.g. Roster9Owner"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#ffd700]/50 outline-none"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm font-medium block mb-1">
              Participating Teams (one per line — new owner auto-picks first)
            </label>
            <textarea
              value={teams}
              onChange={(e) => setTeams(e.target.value)}
              rows={4}
              placeholder={'Grandes\nJuicyBussy\nCmaleski'}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#ffd700]/50 outline-none resize-none font-mono"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm font-medium block mb-1">Total Rounds</label>
            <input
              type="number"
              min={1}
              max={10}
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              className="w-32 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#ffd700]/50 outline-none"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm font-medium block mb-1">Bonus Picks (one per line)</label>
            <textarea
              value={bonusPicks}
              onChange={(e) => setBonusPicks(e.target.value)}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#ffd700]/50 outline-none resize-none font-mono"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm font-medium block mb-1">
              Player Pool (one per line: Name | POS | NFL_TEAM | SOURCE_TEAM)
            </label>
            <textarea
              value={poolText}
              onChange={(e) => setPoolText(e.target.value)}
              rows={8}
              placeholder={'Ja\'Marr Chase | WR | CIN | Grandes\nDerrick Henry | RB | DAL | JuicyBussy'}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#ffd700]/50 outline-none resize-none font-mono text-xs"
            />
            <p className="text-gray-600 text-xs mt-1">Leave blank to add players later</p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting || !newOwner.trim()}
            className="px-6 py-2.5 rounded-lg bg-[#ffd700] text-black font-bold text-sm hover:bg-yellow-400 disabled:opacity-40 transition-colors"
          >
            {submitting ? 'Saving…' : 'Save Draft Setup'}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DisperusalDraftPage() {
  const [setup, setSetup] = useState<DraftSetup | null>(null);
  const [picks, setPicks] = useState<DraftPick[]>([]);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [search, setSearch] = useState('');
  const [posFilter, setPosFilter] = useState<string>('ALL');
  const [isAdmin, setIsAdmin] = useState(false);
  const [makingPick, setMakingPick] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAdmin(new URLSearchParams(window.location.search).has('admin'));
    }
  }, []);

  const loadData = useCallback(async () => {
    const data = await fetchDraftData();
    setSetup(data.setup);
    setPicks(data.picks);
    setLastRefresh(new Date());
  }, []);

  useEffect(() => {
    loadData();
    const t = setInterval(loadData, 30_000);
    return () => clearInterval(t);
  }, [loadData]);

  // Build full pick order from setup
  const pickOrder = setup
    ? buildPickOrder(setup.draft_order, setup.total_rounds)
    : [];

  // Map picks to slots
  const pickedPlayerIds = new Set(picks.map((p) => p.player_id));
  const currentSlotIdx = picks.length;
  const currentSlot = pickOrder[currentSlotIdx];

  // Filtered available pool
  const availablePool = (setup?.pool ?? []).filter((p) => {
    if (pickedPlayerIds.has(p.id)) return false;
    if (posFilter !== 'ALL' && p.position !== posFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleSetupSubmit = async (s: Omit<DraftSetup, 'configured_at'>) => {
    await submitSetup(s);
    await loadData();
  };

  const handlePick = async (player: PoolPlayer) => {
    if (!currentSlot || makingPick) return;
    setMakingPick(true);
    await submitPick({
      round: currentSlot.round,
      pick_in_round: currentSlot.pick,
      overall_pick: currentSlot.overall,
      picking_team: currentSlot.team,
      player_id: player.id,
      player_name: player.name,
      position: player.position,
      nfl_team: player.nfl_team,
      source_team: player.source_team,
    });
    await loadData();
    setMakingPick(false);
  };

  const draftComplete = setup ? picks.length >= pickOrder.length : false;

  return (
    <>
      <Head>
        <title>BMFFFL 2026 Dispersal Draft</title>
      </Head>

      <div className="min-h-screen bg-[#07070d] text-white" style={{ fontFamily: 'system-ui, sans-serif' }}>

        {/* ── HEADER ─────────────────────────────────────────────── */}
        <div className="border-b border-gray-800 px-6 py-5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#ffd700]">🏈 BMFFFL Dispersal Draft</h1>
              <p className="text-gray-500 text-sm mt-0.5">
                2026 · Orphan Roster Redistribution
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {setup && !draftComplete && currentSlot && (
                <span className="text-white font-medium">
                  Pick {currentSlot.overall} — <span className="text-[#ffd700]">{currentSlot.team}</span>
                </span>
              )}
              {draftComplete && (
                <span className="text-green-400 font-bold">✓ Draft Complete</span>
              )}
              <button onClick={loadData} className="flex items-center gap-1 hover:text-white transition-colors">
                <RefreshCw size={13} />
                {lastRefresh ? lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
              </button>
              {isAdmin && (
                <span className="text-xs px-2 py-0.5 bg-[#ffd700]/10 text-[#ffd700] border border-[#ffd700]/30 rounded font-bold">
                  ADMIN
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

          {/* ── NO SETUP STATE ───────────────────────────────────── */}
          {!setup && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-xl mb-2">Draft not configured yet</p>
              <p className="text-gray-700 text-sm">
                {isAdmin
                  ? 'Use the form below to configure the draft.'
                  : 'Check back after the owners meeting — the commissioner will set this up.'}
              </p>
            </div>
          )}

          {/* ── DRAFT BOARD ──────────────────────────────────────── */}
          {setup && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="text-left text-gray-600 font-medium py-2 pr-4 w-16">Rd</th>
                    {setup.draft_order.map((team) => (
                      <th key={team} className="text-center text-gray-400 font-medium py-2 px-3 min-w-[140px]">
                        {team}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: setup.total_rounds }, (_, r) => {
                    const round = r + 1;
                    const roundOrder = round % 2 === 1 ? [...setup.draft_order] : [...setup.draft_order].reverse();
                    return (
                      <tr key={round} className="border-t border-gray-800">
                        <td className="py-2 pr-4 text-gray-600 font-medium">{round}</td>
                        {setup.draft_order.map((team) => {
                          const slotIdx = roundOrder.indexOf(team);
                          const overall = (round - 1) * setup.draft_order.length + slotIdx + 1;
                          const pick = picks.find((p) => p.overall_pick === overall);
                          const isCurrentSlot = overall === currentSlot?.overall && !draftComplete;

                          return (
                            <td
                              key={team}
                              className={`py-1.5 px-3 text-center rounded ${
                                isCurrentSlot ? 'bg-[#ffd700]/10 ring-1 ring-[#ffd700]/40' : ''
                              }`}
                            >
                              {pick ? (
                                <div>
                                  <p className="text-white text-xs font-medium leading-tight">{pick.player_name}</p>
                                  <div className="flex items-center justify-center gap-1 mt-0.5">
                                    <PositionBadge pos={pick.position} />
                                    <span className="text-gray-600 text-xs">{pick.nfl_team}</span>
                                  </div>
                                </div>
                              ) : (
                                <span className={`text-xs ${isCurrentSlot ? 'text-[#ffd700]/50' : 'text-gray-800'}`}>
                                  {isCurrentSlot ? '▸ on the clock' : `#${overall}`}
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ── BONUS PICKS ──────────────────────────────────────── */}
          {setup && setup.bonus_picks.length > 0 && (
            <div className="border border-gray-800 rounded-xl p-4 bg-gray-900/30">
              <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-3">
                Supplemental Bonus Picks — New Owner ({setup.new_owner})
              </h3>
              <div className="flex flex-wrap gap-2">
                {setup.bonus_picks.map((bp, i) => (
                  <span key={i} className="text-xs px-3 py-1.5 bg-[#ffd700]/10 text-[#ffd700] border border-[#ffd700]/20 rounded-full font-medium">
                    🎯 {bp}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── PLAYER POOL (only shown when draft active) ────────── */}
          {setup && !draftComplete && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Current pick info */}
              <div className="lg:col-span-1">
                <div className="border border-[#ffd700]/20 rounded-xl p-4 bg-[#ffd700]/5">
                  <h3 className="text-[#ffd700] font-semibold mb-1">On The Clock</h3>
                  <p className="text-white text-2xl font-bold">{currentSlot?.team ?? '—'}</p>
                  <p className="text-gray-500 text-sm">
                    Round {currentSlot?.round}, Pick {currentSlot?.pick} (Overall #{currentSlot?.overall})
                  </p>
                  {!isAdmin && (
                    <p className="text-gray-600 text-xs mt-3">
                      Picks made by commissioner on behalf of all teams.
                    </p>
                  )}
                </div>

                {/* Pool stats */}
                <div className="mt-4 border border-gray-800 rounded-xl p-4">
                  <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Pool</h4>
                  <div className="space-y-1.5">
                    {POSITIONS.map((pos) => {
                      const total = setup.pool.filter((p) => p.position === pos).length;
                      const remaining = setup.pool.filter((p) => p.position === pos && !pickedPlayerIds.has(p.id)).length;
                      if (total === 0) return null;
                      return (
                        <div key={pos} className="flex items-center gap-2 text-sm">
                          <PositionBadge pos={pos} />
                          <span className="text-gray-300 font-mono">{remaining}</span>
                          <span className="text-gray-600 text-xs">/ {total} remaining</span>
                        </div>
                      );
                    })}
                    <div className="pt-1 border-t border-gray-800 flex items-center gap-2 text-sm">
                      <span className="text-gray-400 text-xs">Total:</span>
                      <span className="text-white font-mono">
                        {setup.pool.filter((p) => !pickedPlayerIds.has(p.id)).length}
                      </span>
                      <span className="text-gray-600 text-xs">/ {setup.pool.length} remaining</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Available players */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search players…"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder-gray-600 focus:border-[#ffd700]/50 outline-none"
                    />
                  </div>
                  <div className="flex gap-1">
                    {['ALL', ...POSITIONS].map((pos) => (
                      <button
                        key={pos}
                        onClick={() => setPosFilter(pos)}
                        className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                          posFilter === pos
                            ? 'bg-[#ffd700] text-black'
                            : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
                  {availablePool.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">No players match filter</p>
                  ) : (
                    availablePool.map((player) => (
                      <PlayerCard
                        key={player.id}
                        player={player}
                        onPick={isAdmin && !makingPick ? handlePick : undefined}
                        compact
                      />
                    ))
                  )}
                </div>

                {isAdmin && (
                  <p className="text-gray-600 text-xs mt-2">
                    Click a player to assign them to {currentSlot?.team}&apos;s current pick.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── DRAFT COMPLETE SUMMARY ───────────────────────────── */}
          {setup && draftComplete && (
            <div className="border border-green-500/20 rounded-xl p-6 bg-green-500/5">
              <h3 className="text-green-400 font-bold text-lg mb-4">✓ Dispersal Draft Complete</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {setup.draft_order.map((team) => {
                  const teamPicks = picks.filter((p) => p.picking_team === team);
                  return (
                    <div key={team} className="border border-gray-800 rounded-lg p-3">
                      <h4 className="text-white font-semibold text-sm mb-2">{team}</h4>
                      <div className="space-y-1">
                        {teamPicks.map((p) => (
                          <div key={p.overall_pick} className="flex items-center gap-2 text-xs">
                            <span className="text-gray-600 w-5">#{p.overall_pick}</span>
                            <PositionBadge pos={p.position} />
                            <span className="text-gray-300">{p.player_name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── ADMIN: SETUP FORM ────────────────────────────────── */}
          {isAdmin && (
            <SetupForm onSubmit={handleSetupSubmit} />
          )}

          {/* Admin toggle hint for non-admin */}
          {!isAdmin && (
            <p className="text-gray-700 text-xs text-center">
              Commissioner: add ?admin=1 to URL for controls
            </p>
          )}

        </div>
      </div>
    </>
  );
}
