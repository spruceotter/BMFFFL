/**
 * BMFFFL 2026 Rookie Draft — /rookie-draft
 *
 * Live draft board for the June 5 rookie draft.
 * Commissioner controls the draft via ?admin=1 mode.
 * All 12 owners watch picks in real-time (auto-refresh 30s).
 *
 * Convex task types:
 *   rookie_draft_setup  — pick order + player pool configured by commissioner
 *   rookie_pick         — each pick made during the draft
 */

import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Search, Settings, ChevronDown, ChevronUp, CheckCircle2, Star } from 'lucide-react';

// ─── Config ──────────────────────────────────────────────────────────────────

const CONVEX_URL = 'https://resolute-setter-416.convex.cloud';

const POSITIONS = ['QB', 'RB', 'WR', 'TE'];

const POSITION_COLORS: Record<string, string> = {
  QB: '#f97316',
  RB: '#22c55e',
  WR: '#3b82f6',
  TE: '#a855f7',
};

// Default prospect pool — 2026 NFL Draft class top prospects (dynasty value)
const DEFAULT_PROSPECTS: Omit<Prospect, 'id'>[] = [
  { name: "Ashton Jeanty", position: "RB", nfl_team: "Las Vegas Raiders", college: "Boise State", rank: 1, notes: "Heisman finalist, elite vision + contact balance" },
  { name: "Travis Hunter", position: "WR", nfl_team: "Jacksonville Jaguars", college: "Colorado", rank: 2, notes: "Two-way Heisman winner, elite separation" },
  { name: "Tetairoa McMillan", position: "WR", nfl_team: "Carolina Panthers", college: "Arizona", rank: 3, notes: "6'5\" monster, elite route runner" },
  { name: "Cam Ward", position: "QB", nfl_team: "Tennessee Titans", college: "Miami", rank: 4, notes: "Big arm, mobility, top QB off the board" },
  { name: "Luther Burden III", position: "WR", nfl_team: "Chicago Bears", college: "Missouri", rank: 5, notes: "YAC machine, rare burst after the catch" },
  { name: "Omarion Hampton", position: "RB", nfl_team: "Los Angeles Chargers", college: "North Carolina", rank: 6, notes: "Big back with speed, great pass protection" },
  { name: "Colston Loveland", position: "TE", nfl_team: "Chicago Bears", college: "Michigan", rank: 7, notes: "Top TE, route runner + red zone threat" },
  { name: "Tyler Warren", position: "TE", nfl_team: "Indianapolis Colts", college: "Penn State", rank: 8, notes: "Swiss army knife TE, massive catch radius" },
  { name: "Emeka Egbuka", position: "WR", nfl_team: "Tampa Bay Buccaneers", college: "Ohio State", rank: 9, notes: "Complete WR, tremendous hands + routes" },
  { name: "Dillon Gabriel", position: "QB", nfl_team: "Cleveland Browns", college: "Oregon", rank: 10, notes: "Elite accuracy, processed defenses well in college" },
  { name: "TreVeyon Henderson", position: "RB", nfl_team: "New England Patriots", college: "Ohio State", rank: 11, notes: "Explosive, plus receiver, limited tread" },
  { name: "Shedeur Sanders", position: "QB", nfl_team: "New Orleans Saints", college: "Colorado", rank: 12, notes: "Accuracy, poise under pressure; line concerns" },
  { name: "Quinshon Judkins", position: "RB", nfl_team: "Cleveland Browns", college: "Ohio State", rank: 13, notes: "Power/speed hybrid, great broken tackle rate" },
  { name: "Ollie Gordon II", position: "RB", nfl_team: "New York Jets", college: "Oklahoma State", rank: 14, notes: "Heisman winner 2023, physical runner" },
  { name: "Elic Ayomanor", position: "WR", nfl_team: "Las Vegas Raiders", college: "Stanford", rank: 15, notes: "Long strider, big play ability" },
  { name: "Jack Bech", position: "WR", nfl_team: "Pittsburgh Steelers", college: "TCU", rank: 16, notes: "Technically sound, strong hands" },
  { name: "Matthew Golden", position: "WR", nfl_team: "Green Bay Packers", college: "Texas", rank: 17, notes: "Elite speed, YAC threat" },
  { name: "Jaylen Higgins", position: "WR", nfl_team: "Minnesota Vikings", college: "Iowa State", rank: 18, notes: "Route runner, reliable in traffic" },
  { name: "Isaac TeSlaa", position: "WR", nfl_team: "Baltimore Ravens", college: "Arkansas", rank: 19, notes: "Big slot, exceptional catch radius" },
  { name: "RJ Harvey", position: "RB", nfl_team: "Denver Broncos", college: "UCF", rank: 20, notes: "Explosive, great after contact" },
  { name: "Josh Simmons", position: "QB", nfl_team: "Philadelphia Eagles", college: "Ohio State", rank: 21, notes: "Deep sleeper QB, upside pick" },
  { name: "Jaydon Blue", position: "RB", nfl_team: "Dallas Cowboys", college: "Texas", rank: 22, notes: "Speed back, receiving specialist" },
  { name: "Kaleb Johnson", position: "RB", nfl_team: "Pittsburgh Steelers", college: "Iowa", rank: 23, notes: "Big back, excellent balance" },
  { name: "Kyle Williams", position: "WR", nfl_team: "Arizona Cardinals", college: "Washington State", rank: 24, notes: "Route tech, YAC upside" },
  { name: "Drew Allar", position: "QB", nfl_team: "San Francisco 49ers", college: "Penn State", rank: 25, notes: "Strong arm, good decision-maker" },
  { name: "Nick Emmanwori", position: "TE", nfl_team: "Carolina Panthers", college: "South Carolina", rank: 26, notes: "Hybrid S/TE with receiving upside" },
  { name: "Harold Fannin Jr.", position: "TE", nfl_team: "Cleveland Browns", college: "Bowling Green", rank: 27, notes: "Elite receiving TE from MAC, needs adjusting" },
  { name: "Jordyn Tyson", position: "WR", nfl_team: "Arizona Cardinals", college: "Arizona State", rank: 28, notes: "Speed + size combo, upside play" },
  { name: "Tez Johnson", position: "WR", nfl_team: "Seattle Seahawks", college: "Oregon", rank: 29, notes: "Tiny but electric, slot specialist" },
  { name: "Savion Williams", position: "WR", nfl_team: "Chicago Bears", college: "TCU", rank: 30, notes: "6'4\" physical freak, raw" },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface Prospect {
  id: string;
  name: string;
  position: string;
  nfl_team: string;
  college: string;
  rank: number;
  notes: string;
}

interface DraftSlot {
  overall: number;
  round: number;
  pick_in_round: number;
  owner: string;
  original_owner?: string;
  traded?: boolean;
}

interface DraftSetup {
  slots: DraftSlot[];
  prospects: Prospect[];
  total_rounds: number;
  configured_at: string;
}

interface RookiePick {
  overall: number;
  round: number;
  pick_in_round: number;
  picking_team: string;
  prospect_id: string;
  prospect_name: string;
  position: string;
  nfl_team: string;
  college: string;
  picked_at: string;
}

// ─── Convex helpers ───────────────────────────────────────────────────────────

async function fetchDraftData(): Promise<{ setup: DraftSetup | null; picks: RookiePick[] }> {
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
    const picks: RookiePick[] = [];

    for (const t of tasks) {
      if (t.task_type === 'rookie_draft_setup') setups.push(t.payload as DraftSetup);
      if (t.task_type === 'rookie_pick') picks.push(t.payload as RookiePick);
    }

    setups.sort((a, b) => a.configured_at.localeCompare(b.configured_at));
    picks.sort((a, b) => a.overall - b.overall);

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
        task_type: 'rookie_draft_setup',
        payload: { ...setup, configured_at: now },
      },
    }),
  });
}

async function submitPick(pick: Omit<RookiePick, 'picked_at'>): Promise<void> {
  const now = new Date().toISOString();
  await fetch(`${CONVEX_URL}/api/mutation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      path: 'bmfffl:createTask',
      format: 'json',
      args: {
        to_agent: 'bimfle',
        task_type: 'rookie_pick',
        payload: { ...pick, picked_at: now },
      },
    }),
  });
}

// ─── Components ───────────────────────────────────────────────────────────────

function PosBadge({ pos }: { pos: string }) {
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

function ProspectRow({
  prospect,
  onPick,
  picked,
}: {
  prospect: Prospect;
  onPick?: (p: Prospect) => void;
  picked?: boolean;
}) {
  return (
    <div
      onClick={() => !picked && onPick?.(prospect)}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all ${
        picked
          ? 'opacity-25 border-gray-800 bg-transparent cursor-default'
          : onPick
          ? 'border-gray-700 bg-gray-900 hover:border-[#ffd700]/50 hover:bg-gray-800/60 cursor-pointer'
          : 'border-gray-800 bg-gray-900/30'
      }`}
    >
      <span className="text-gray-600 font-mono text-xs w-5 text-right flex-shrink-0">
        {prospect.rank}
      </span>
      <PosBadge pos={prospect.position} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white text-sm truncate">{prospect.name}</p>
        <p className="text-gray-500 text-xs truncate">{prospect.nfl_team} · {prospect.college}</p>
      </div>
      {!picked && (
        <p className="text-gray-600 text-xs hidden lg:block max-w-[180px] truncate italic">{prospect.notes}</p>
      )}
      {picked && <CheckCircle2 size={14} className="text-gray-700 flex-shrink-0" />}
    </div>
  );
}

// ─── Setup Form ───────────────────────────────────────────────────────────────

function SetupForm({ onSubmit }: { onSubmit: (setup: Omit<DraftSetup, 'configured_at'>) => Promise<void> }) {
  const [slotsText, setSlotsText] = useState(
    `Grandes\nJuicyBussy\nCmaleski\nMLSchools12\ntdtd19844\nrbr\nSexMachineAndyD\neldridsm\neldridm20\nCogdeill11\nTubes94\nRoster9Owner`
  );
  const [rounds, setRounds] = useState(4);
  const [useDefaults, setUseDefaults] = useState(true);
  const [customProspects, setCustomProspects] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    const teamOrder = slotsText.split('\n').map((t) => t.trim()).filter(Boolean);
    const totalPicks = teamOrder.length * rounds;

    // Build snake pick slots
    const slots: DraftSlot[] = [];
    for (let overall = 1; overall <= totalPicks; overall++) {
      const round = Math.ceil(overall / teamOrder.length);
      const pickInRound = ((overall - 1) % teamOrder.length) + 1;
      const idx = round % 2 === 1 ? pickInRound - 1 : teamOrder.length - pickInRound;
      slots.push({
        overall,
        round,
        pick_in_round: pickInRound,
        owner: teamOrder[idx] ?? '—',
      });
    }

    let prospects: Prospect[];
    if (useDefaults) {
      prospects = DEFAULT_PROSPECTS.map((p, i) => ({ ...p, id: `prospect-${i}` }));
    } else {
      prospects = customProspects
        .split('\n')
        .filter(Boolean)
        .map((line, i) => {
          const parts = line.split('|').map((s) => s.trim());
          return {
            id: `prospect-${i}`,
            name: parts[0] ?? line,
            position: parts[1] ?? 'WR',
            nfl_team: parts[2] ?? '—',
            college: parts[3] ?? '—',
            rank: i + 1,
            notes: parts[4] ?? '',
          };
        });
    }

    await onSubmit({ slots, prospects, total_rounds: rounds });
    setSubmitting(false);
  };

  return (
    <div className="border border-gray-700 rounded-xl p-5 bg-gray-900/50">
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
            <label className="text-gray-400 text-sm font-medium block mb-1">
              Draft Order — Round 1 (one team per line, snake auto-generates)
            </label>
            <textarea
              value={slotsText}
              onChange={(e) => setSlotsText(e.target.value)}
              rows={12}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#ffd700]/50 outline-none resize-none font-mono"
            />
            <p className="text-gray-600 text-xs mt-1">Slot 1 picks first. Traded picks: note who currently holds them in the name.</p>
          </div>

          <div>
            <label className="text-gray-400 text-sm font-medium block mb-1">Rounds</label>
            <input
              type="number"
              min={1}
              max={8}
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              className="w-24 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#ffd700]/50 outline-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-400 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={useDefaults}
                onChange={(e) => setUseDefaults(e.target.checked)}
                className="rounded"
              />
              Use default 2026 NFL Draft prospect list (top 30 dynasty-ranked)
            </label>
          </div>

          {!useDefaults && (
            <div>
              <label className="text-gray-400 text-sm font-medium block mb-1">
                Custom prospects (Name | POS | NFL_TEAM | College | Notes)
              </label>
              <textarea
                value={customProspects}
                onChange={(e) => setCustomProspects(e.target.value)}
                rows={8}
                placeholder="Ashton Jeanty | RB | Las Vegas Raiders | Boise State | Heisman finalist"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#ffd700]/50 outline-none resize-none font-mono text-xs"
              />
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting || !slotsText.trim()}
            className="px-6 py-2.5 rounded-lg bg-[#ffd700] text-black font-bold text-sm hover:bg-yellow-400 disabled:opacity-40 transition-colors"
          >
            {submitting ? 'Saving…' : 'Configure Draft'}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RookieDraftPage() {
  const [setup, setSetup] = useState<DraftSetup | null>(null);
  const [picks, setPicks] = useState<RookiePick[]>([]);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [search, setSearch] = useState('');
  const [posFilter, setPosFilter] = useState<string>('ALL');
  const [isAdmin, setIsAdmin] = useState(false);
  const [makingPick, setMakingPick] = useState(false);
  const [activeRound, setActiveRound] = useState(1);

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
    // Auto-scroll to active round
    if (data.picks.length > 0 && data.setup) {
      const currentPick = data.picks.length + 1;
      const round = Math.ceil(currentPick / (data.setup.slots.length / data.setup.total_rounds));
      setActiveRound(Math.min(round, data.setup.total_rounds));
    }
  }, []);

  useEffect(() => {
    loadData();
    const t = setInterval(loadData, 30_000);
    return () => clearInterval(t);
  }, [loadData]);

  const pickedIds = new Set(picks.map((p) => p.prospect_id));
  const currentOverall = picks.length + 1;
  const currentSlot = setup?.slots.find((s) => s.overall === currentOverall);
  const draftComplete = setup ? picks.length >= setup.slots.length : false;

  const availableProspects = (setup?.prospects ?? DEFAULT_PROSPECTS.map((p, i) => ({ ...p, id: `p-${i}` })))
    .filter((p) => {
      if (pickedIds.has(p.id)) return false;
      if (posFilter !== 'ALL' && p.position !== posFilter) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => a.rank - b.rank);

  const roundTeams = setup
    ? [...new Set(setup.slots.filter((s) => s.round === activeRound).sort((a, b) => a.pick_in_round - b.pick_in_round).map((s) => s.owner))]
    : [];

  const handlePick = async (prospect: Prospect) => {
    if (!currentSlot || makingPick) return;
    setMakingPick(true);
    await submitPick({
      overall: currentSlot.overall,
      round: currentSlot.round,
      pick_in_round: currentSlot.pick_in_round,
      picking_team: currentSlot.owner,
      prospect_id: prospect.id,
      prospect_name: prospect.name,
      position: prospect.position,
      nfl_team: prospect.nfl_team,
      college: prospect.college,
    });
    await loadData();
    setMakingPick(false);
  };

  return (
    <>
      <Head>
        <title>BMFFFL 2026 Rookie Draft</title>
      </Head>

      <div className="min-h-screen bg-[#07070d] text-white" style={{ fontFamily: 'system-ui, sans-serif' }}>

        {/* ── HEADER ─────────────────────────────────────────────── */}
        <div className="border-b border-gray-800 px-6 py-5">
          <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#ffd700]">🏈 BMFFFL 2026 Rookie Draft</h1>
              <p className="text-gray-500 text-sm mt-0.5">Friday, June 5, 2026</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {setup && !draftComplete && currentSlot && (
                <div className="text-right">
                  <p className="text-white font-medium">
                    Pick {currentOverall} — <span className="text-[#ffd700]">{currentSlot.owner}</span>
                  </p>
                  <p className="text-gray-600 text-xs">Round {currentSlot.round}, Pick {currentSlot.pick_in_round}</p>
                </div>
              )}
              {draftComplete && <span className="text-green-400 font-bold">✓ Draft Complete</span>}
              <button onClick={loadData} className="flex items-center gap-1 hover:text-white transition-colors">
                <RefreshCw size={13} />
                {lastRefresh ? lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
              </button>
              {isAdmin && (
                <span className="text-xs px-2 py-0.5 bg-[#ffd700]/10 text-[#ffd700] border border-[#ffd700]/30 rounded font-bold uppercase tracking-wider">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-screen-2xl mx-auto px-6 py-6 space-y-6">

          {!setup && (
            <div className="text-center py-16">
              <Star size={32} className="text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-xl mb-2">2026 Rookie Draft</p>
              <p className="text-gray-700 text-sm">
                {isAdmin
                  ? 'Configure the draft below to get started.'
                  : 'Draft board goes live on June 5. Check back soon.'}
              </p>
            </div>
          )}

          {setup && (
            <>
              {/* Round tabs */}
              <div className="flex items-center gap-1">
                {Array.from({ length: setup.total_rounds }, (_, i) => i + 1).map((r) => {
                  const roundPicks = picks.filter((p) => p.round === r);
                  const teamsThisRound = setup.slots.filter((s) => s.round === r).length;
                  const roundComplete = roundPicks.length >= teamsThisRound;
                  return (
                    <button
                      key={r}
                      onClick={() => setActiveRound(r)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        activeRound === r
                          ? 'bg-[#ffd700] text-black'
                          : roundComplete
                          ? 'bg-gray-800 text-gray-400'
                          : 'bg-gray-900 text-gray-500 hover:text-gray-300 border border-gray-800'
                      }`}
                    >
                      Round {r}
                      {roundComplete && <span className="ml-1 text-green-500">✓</span>}
                    </button>
                  );
                })}
              </div>

              {/* Draft board — active round */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left text-gray-600 font-medium py-2 pr-4 w-12">#</th>
                      <th className="text-left text-gray-500 font-medium py-2 pr-6 w-36">Team</th>
                      <th className="text-left text-gray-500 font-medium py-2">Pick</th>
                    </tr>
                  </thead>
                  <tbody>
                    {setup.slots
                      .filter((s) => s.round === activeRound)
                      .map((slot) => {
                        const pick = picks.find((p) => p.overall === slot.overall);
                        const isCurrent = slot.overall === currentOverall && !draftComplete;
                        return (
                          <tr
                            key={slot.overall}
                            className={`border-t border-gray-900 ${isCurrent ? 'bg-[#ffd700]/5' : ''}`}
                          >
                            <td className={`py-2 pr-4 font-mono text-xs ${isCurrent ? 'text-[#ffd700]' : 'text-gray-700'}`}>
                              {slot.overall}
                            </td>
                            <td className="py-2 pr-6">
                              <span className={`text-sm font-medium ${isCurrent ? 'text-[#ffd700]' : 'text-gray-400'}`}>
                                {slot.owner}
                                {isCurrent && <span className="ml-1.5 text-xs font-normal text-[#ffd700]/60">on the clock</span>}
                              </span>
                            </td>
                            <td className="py-2">
                              {pick ? (
                                <div className="flex items-center gap-2.5">
                                  <PosBadge pos={pick.position} />
                                  <span className="text-white font-semibold">{pick.prospect_name}</span>
                                  <span className="text-gray-500 text-xs">{pick.nfl_team}</span>
                                  <span className="text-gray-600 text-xs">({pick.college})</span>
                                </div>
                              ) : (
                                <span className="text-gray-800 text-xs italic">
                                  {isCurrent ? 'Selecting…' : 'Pending'}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ── PROSPECT POOL ────────────────────────────────────── */}
          {(!draftComplete) && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-gray-300 font-semibold text-sm">
                  Available Prospects
                  <span className="ml-2 text-gray-600 font-normal text-xs">
                    {availableProspects.length} remaining
                  </span>
                </h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search…"
                      className="bg-gray-800 border border-gray-700 rounded-lg pl-7 pr-3 py-1.5 text-xs text-white placeholder-gray-600 focus:border-[#ffd700]/50 outline-none w-36"
                    />
                  </div>
                  <div className="flex gap-1">
                    {['ALL', ...POSITIONS].map((pos) => (
                      <button
                        key={pos}
                        onClick={() => setPosFilter(pos)}
                        className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                          posFilter === pos ? 'bg-[#ffd700] text-black' : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-1.5 max-h-[500px] overflow-y-auto pr-1">
                {availableProspects.map((p) => (
                  <ProspectRow
                    key={p.id}
                    prospect={p}
                    onPick={isAdmin && setup && !makingPick ? handlePick : undefined}
                    picked={false}
                  />
                ))}
              </div>

              {isAdmin && currentSlot && (
                <p className="text-gray-600 text-xs mt-2">
                  Click a prospect to assign them to {currentSlot.owner}&apos;s pick.
                </p>
              )}
            </div>
          )}

          {/* ── DRAFT COMPLETE SUMMARY ───────────────────────────── */}
          {setup && draftComplete && (
            <div className="border border-green-500/20 rounded-xl p-6 bg-green-500/5">
              <h3 className="text-green-400 font-bold text-lg mb-5">✓ 2026 Rookie Draft Complete</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...new Set(setup.slots.map((s) => s.owner))].map((team) => {
                  const teamPicks = picks.filter((p) => p.picking_team === team);
                  return (
                    <div key={team} className="border border-gray-800 rounded-lg p-3">
                      <h4 className="text-white font-semibold text-sm mb-2 truncate">{team}</h4>
                      <div className="space-y-1.5">
                        {teamPicks.map((p) => (
                          <div key={p.overall} className="flex items-center gap-1.5 text-xs">
                            <span className="text-gray-600 font-mono w-4">{p.round}.{p.pick_in_round}</span>
                            <PosBadge pos={p.position} />
                            <span className="text-gray-300 truncate">{p.prospect_name}</span>
                          </div>
                        ))}
                        {teamPicks.length === 0 && (
                          <p className="text-gray-700 text-xs italic">No picks</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── ADMIN SETUP ──────────────────────────────────────── */}
          {isAdmin && <SetupForm onSubmit={async (s) => { await submitSetup(s); await loadData(); }} />}

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
