/**
 * BMFFFL 2026 Rookie Draft — /rookie-draft
 *
 * Live tracking board for the June 5 rookie draft (conducted in Sleeper).
 * Bimflé uses this to follow along and present picks live.
 * Actual picks are made in Sleeper — this is a display/commentary surface.
 *
 * Convex task types:
 *   rookie_draft_setup  — pick order + player pool configured for tracking
 *   rookie_pick         — picks tracked as they happen in Sleeper
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

// Default prospect pool — 2026 NFL Draft class top prospects (dynasty value, post-draft)
const DEFAULT_PROSPECTS: Omit<Prospect, 'id'>[] = [
  { name: "Jeremiyah Love", position: "RB", nfl_team: "Arizona Cardinals", college: "Notre Dame", rank: 1, notes: "#3 overall pick. Elite burst + contact balance, leads ARI backfield immediately" },
  { name: "Carnell Tate", position: "WR", nfl_team: "Tennessee Titans", college: "Ohio State", rank: 2, notes: "#4 overall. Titans believe he's a top WR — elite separation, contested catch ability" },
  { name: "Jordyn Tyson", position: "WR", nfl_team: "New Orleans Saints", college: "Arizona State", rank: 3, notes: "#8 overall. Creates separation at all levels, excellent YAC, ideal slot/outside hybrid" },
  { name: "Makai Lemon", position: "WR", nfl_team: "Philadelphia Eagles", college: "USC", rank: 4, notes: "#20 overall. Blazing speed, instant deep threat in PHI's prolific offense" },
  { name: "Jadarian Price", position: "RB", nfl_team: "Seattle Seahawks", college: "Notre Dame", rank: 5, notes: "#32 overall. Complementary to Zach Charbonnet but has long-term starter upside" },
  { name: "KC Concepcion", position: "WR", nfl_team: "Cleveland Browns", college: "Texas A&M", rank: 6, notes: "#24 overall. Big bodied WR, excels in contested catch situations, great hands" },
  { name: "Kenyon Sadiq", position: "TE", nfl_team: "New York Jets", college: "Oregon", rank: 7, notes: "#16 overall. Athletic mismatch TE, excellent receiving chops, good blocker" },
  { name: "Eli Stowers", position: "TE", nfl_team: "Philadelphia Eagles", college: "Vanderbilt", rank: 8, notes: "Day 2 pick. QB-turned-TE, savvy route runner, heir to Dallas Goedert" },
  { name: "Omar Cooper Jr.", position: "WR", nfl_team: "New York Jets", college: "Indiana", rank: 9, notes: "#30 overall. Excellent route runner, reliable in traffic, should see targets early" },
  { name: "Denzel Boston", position: "WR", nfl_team: "Cleveland Browns", college: "Washington", rank: 10, notes: "Day 2. Big WR with elite catch radius, fits CLE's rebuild long term" },
  { name: "Fernando Mendoza", position: "QB", nfl_team: "Las Vegas Raiders", college: "Indiana", rank: 11, notes: "#1 overall. Heisman winner. Comps to Matt Ryan. Long-term QB1 ceiling" },
  { name: "Germie Bernard", position: "WR", nfl_team: "Pittsburgh Steelers", college: "Louisville", rank: 12, notes: "Round 2. Excellent routes + hands, PIT traded up to get him" },
  { name: "Antonio Williams", position: "WR", nfl_team: "Washington Commanders", college: "Florida State", rank: 13, notes: "Day 2. Physical WR with strong hands, lands in a pass-heavy offense" },
  { name: "Jonah Coleman", position: "RB", nfl_team: "Denver Broncos", college: "Auburn", rank: 14, notes: "Day 2. Explosive cut-back runner, receiving ability makes him relevant PPR" },
  { name: "De'Zhaun Stribling", position: "WR", nfl_team: "San Francisco 49ers", college: "Michigan State", rank: 15, notes: "#33 overall. Kyle Shanahan loves his WRs — immediate target share candidate" },
  { name: "Chris Bell", position: "WR", nfl_team: "Miami Dolphins", college: "Memphis", rank: 16, notes: "Day 2. MIA offense gives him a high ceiling; quick after the catch" },
  { name: "Nicholas Singleton", position: "RB", nfl_team: "Tennessee Titans", college: "Penn State", rank: 17, notes: "Day 2. Explosive back alongside Love pick — dynasty hold" },
  { name: "Ty Simpson", position: "QB", nfl_team: "Los Angeles Rams", college: "Alabama", rank: 18, notes: "#13 overall. Heir to Matthew Stafford in LA — long-term QB1 ceiling" },
  { name: "Zachariah Branch", position: "WR", nfl_team: "Atlanta Falcons", college: "Oregon", rank: 19, notes: "Day 2. Elite speed, ATL offense needs weapons" },
  { name: "Kaytron Allen", position: "RB", nfl_team: "Washington Commanders", college: "Penn State", rank: 20, notes: "Day 2. Physical runner, good pass pro, should compete for touches" },
  { name: "Mike Washington Jr.", position: "RB", nfl_team: "Las Vegas Raiders", college: "Texas", rank: 21, notes: "Day 2. Complements Mendoza — receiving RB in LV's offense" },
  { name: "Emmett Johnson", position: "RB", nfl_team: "Kansas City Chiefs", college: "Wisconsin", rank: 22, notes: "Day 2. KC lands a reliable rusher — could see touches in their run game" },
  { name: "Ted Hurst", position: "WR", nfl_team: "Tampa Bay Buccaneers", college: "Cincinnati", rank: 23, notes: "Day 2-3. Good size and route running, fits TB's offense" },
  { name: "Chris Brazzell II", position: "WR", nfl_team: "Carolina Panthers", college: "Louisville", rank: 24, notes: "Day 2-3. Long strider, big play potential, young CAR offense" },
  { name: "Bryce Lance", position: "WR", nfl_team: "New Orleans Saints", college: "NC State", rank: 25, notes: "Day 2-3. Lands with Tyson in NO — two dynasty WRs in same offense" },
  { name: "Ja'Kobi Lane", position: "WR", nfl_team: "Baltimore Ravens", college: "Oklahoma", rank: 26, notes: "Day 2-3. Ravens add a speed receiver to their offense" },
  { name: "Max Klare", position: "TE", nfl_team: "Los Angeles Rams", college: "Missouri", rank: 27, notes: "Day 2-3. Solid TE prospect alongside Ty Simpson in LA's offense" },
  { name: "Oscar Delp", position: "TE", nfl_team: "New Orleans Saints", college: "Georgia", rank: 28, notes: "Day 2-3. Athletic TE in NO's offense with multiple dynasty assets" },
  { name: "Demond Claiborne", position: "RB", nfl_team: "Minnesota Vikings", college: "Louisville", rank: 29, notes: "Day 3. Physical runner with receiving upside in MIN's offense" },
  { name: "Malachi Fields", position: "WR", nfl_team: "New York Giants", college: "South Carolina", rank: 30, notes: "Round 3. Giants traded up. Big-bodied WR, contested catch specialist" },
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
