/**
 * BMFFFL 2026 Schedule Draw
 * /schedule-draw
 *
 * Live schedule-draw game for the owners meeting.
 * Enter a seed word/number → generates the full 14-week
 * BMFFFL schedule and reveals it week-by-week.
 *
 * Season format (confirmed by Commissioner):
 * - 14 weeks, 3 divisions of 4 teams
 * - Weeks 1–3: division games (each rival once)
 * - Weeks 4–11: cross-division (every team plays every other exactly once)
 * - Weeks 12–14: division games again (each rival twice total)
 */

import Head from 'next/head';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Shuffle, Play, RotateCcw, Trophy, Users, Calendar, Zap } from 'lucide-react';

// ─── Config ──────────────────────────────────────────────────────────────────

const DIVISIONS: { name: string; color: string; teams: string[] }[] = [
  {
    name: 'Group of Death',
    color: 'text-red-400',
    teams: ['Grandes', 'SexMachineAndyD', 'rbr', 'JuicyBussy'],
  },
  {
    name: "Moodie's Wives",
    color: 'text-blue-400',
    teams: ['Cogdeill11', 'MLSchools12', 'Cmaleski', 'Open Roster'],
  },
  {
    name: 'Pig Bottoms',
    color: 'text-green-400',
    teams: ['eldridm20', 'eldridsm', 'tdtd19844', 'Tubes94'],
  },
];

const WEEK_LABELS = [
  '', // 0-index padding
  'Week 1',  'Week 2',  'Week 3',
  'Week 4',  'Week 5',  'Week 6',  'Week 7',
  'Week 8',  'Week 9',  'Week 10', 'Week 11',
  'Week 12', 'Week 13', 'Week 14',
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface Matchup {
  home: string;
  away: string;
  type: 'division' | 'cross';
}

interface WeekSchedule {
  week: number;
  matchups: Matchup[];
  revealed: boolean;
}

// ─── Seeded PRNG (mulberry32) ─────────────────────────────────────────────────

function hashSeed(seed: string): number {
  let h = 0xdeadbeef;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 0x9e3779b9);
    h ^= h >>> 16;
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Schedule Generation ─────────────────────────────────────────────────────

/**
 * Division round-robin template (3 rounds for 4 teams, 2 games each).
 * Returns array of 3 rounds, each with 2 matchup index pairs within the division.
 */
const DIV_RR: [number, number][][] = [
  [[0, 1], [2, 3]],
  [[0, 2], [1, 3]],
  [[0, 3], [1, 2]],
];

/**
 * Cross-division template for K(4,4,4).
 * Verified complete tripartite tournament: each team plays every
 * team in each of the other two divisions exactly once.
 *
 * Format: [divA_idx, divB_idx, divA_idx, divB_idx, ...] — no, cleaner:
 * Each round is an array of 6 [team, team] pairs where team is encoded
 * as [division, index_within_div].
 */
const CROSS_TEMPLATE: [number, number, number, number][][] = [
  // Round, matchup: [divA, idxA, divB, idxB] where div: 0=A,1=B,2=C
  // R1: A0-B0, A1-B2, A2-C0, A3-C2, B1-C1, B3-C3
  [[0,0,1,0],[0,1,1,2],[0,2,2,0],[0,3,2,2],[1,1,2,1],[1,3,2,3]],
  // R2: A0-B1, A1-B3, A2-C1, A3-C3, B0-C2, B2-C0
  [[0,0,1,1],[0,1,1,3],[0,2,2,1],[0,3,2,3],[1,0,2,2],[1,2,2,0]],
  // R3: A0-B2, A1-B0, A2-C2, A3-C0, B1-C3, B3-C1
  [[0,0,1,2],[0,1,1,0],[0,2,2,2],[0,3,2,0],[1,1,2,3],[1,3,2,1]],
  // R4: A0-B3, A1-B1, A2-C3, A3-C1, B0-C0, B2-C2
  [[0,0,1,3],[0,1,1,1],[0,2,2,3],[0,3,2,1],[1,0,2,0],[1,2,2,2]],
  // R5: A0-C0, A1-C2, A2-B1, A3-B3, B0-C3, B2-C1
  [[0,0,2,0],[0,1,2,2],[0,2,1,1],[0,3,1,3],[1,0,2,3],[1,2,2,1]],
  // R6: A0-C1, A1-C3, A2-B0, A3-B2, B1-C2, B3-C0
  [[0,0,2,1],[0,1,2,3],[0,2,1,0],[0,3,1,2],[1,1,2,2],[1,3,2,0]],
  // R7: A0-C2, A1-C0, A2-B3, A3-B1, B0-C1, B2-C3
  [[0,0,2,2],[0,1,2,0],[0,2,1,3],[0,3,1,1],[1,0,2,1],[1,2,2,3]],
  // R8: A0-C3, A1-C1, A2-B2, A3-B0, B1-C0, B3-C2
  [[0,0,2,3],[0,1,2,1],[0,2,1,2],[0,3,1,0],[1,1,2,0],[1,3,2,2]],
];

function generateSchedule(seedStr: string): WeekSchedule[] {
  const rng = mulberry32(hashSeed(seedStr || 'BMFFFL2026'));

  // Shuffle team order within each division
  const teams = DIVISIONS.map((d) => shuffle([...d.teams], rng));

  // Shuffle division round-robin order (weeks 1-3)
  const divOrder1 = shuffle([0, 1, 2], rng);
  // Shuffle cross-division round order (weeks 4-11)
  const crossOrder = shuffle([0, 1, 2, 3, 4, 5, 6, 7], rng);
  // Shuffle division round-robin order (weeks 12-14)
  const divOrder2 = shuffle([0, 1, 2], rng);

  const weeks: WeekSchedule[] = [];

  // Weeks 1–3: division round-robin (first pass)
  for (let w = 0; w < 3; w++) {
    const round = DIV_RR[divOrder1[w]];
    const matchups: Matchup[] = [];
    DIVISIONS.forEach((_, divIdx) => {
      round.forEach(([i, j]) => {
        matchups.push({
          home: teams[divIdx][i],
          away: teams[divIdx][j],
          type: 'division',
        });
      });
    });
    weeks.push({ week: w + 1, matchups, revealed: false });
  }

  // Weeks 4–11: cross-division
  for (let w = 0; w < 8; w++) {
    const round = CROSS_TEMPLATE[crossOrder[w]];
    const matchups: Matchup[] = round.map(([da, ia, db, ib]) => ({
      home: teams[da][ia],
      away: teams[db][ib],
      type: 'cross',
    }));
    weeks.push({ week: w + 4, matchups, revealed: false });
  }

  // Weeks 12–14: division round-robin (second pass)
  for (let w = 0; w < 3; w++) {
    const round = DIV_RR[divOrder2[w]];
    const matchups: Matchup[] = [];
    DIVISIONS.forEach((_, divIdx) => {
      round.forEach(([i, j]) => {
        matchups.push({
          home: teams[divIdx][i],
          away: teams[divIdx][j],
          type: 'division',
        });
      });
    });
    weeks.push({ week: w + 12, matchups, revealed: false });
  }

  return weeks;
}

// ─── Components ───────────────────────────────────────────────────────────────

function MatchupCard({ matchup, compact }: { matchup: Matchup; compact?: boolean }) {
  const divColor = matchup.type === 'division' ? 'border-[#ffd700]/30 bg-[#ffd700]/5' : 'border-gray-600/40 bg-gray-800/30';
  if (compact) {
    return (
      <div className={`border rounded px-2 py-1 text-xs flex items-center gap-1.5 ${divColor}`}>
        <span className="text-white font-medium truncate">{matchup.home}</span>
        <span className="text-gray-500 shrink-0">vs</span>
        <span className="text-gray-300 truncate">{matchup.away}</span>
        {matchup.type === 'division' && <span className="text-[#ffd700] text-xs shrink-0">★</span>}
      </div>
    );
  }
  return (
    <div className={`border rounded-lg px-3 py-2 flex items-center gap-2 ${divColor}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white font-semibold text-sm truncate">{matchup.home}</span>
          <span className="text-gray-500 text-xs shrink-0">vs</span>
          <span className="text-gray-300 text-sm truncate">{matchup.away}</span>
        </div>
      </div>
      {matchup.type === 'division' && (
        <span className="text-[#ffd700] text-xs shrink-0 font-bold">DIV</span>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ScheduleDraw() {
  const [seedInput, setSeedInput] = useState('');
  const [phase, setPhase] = useState<'idle' | 'animating' | 'done'>('idle');
  const [weeks, setWeeks] = useState<WeekSchedule[]>([]);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [view, setView] = useState<'reveal' | 'grid'>('reveal');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase('idle');
    setWeeks([]);
    setCurrentWeek(0);
    setView('reveal');
  }, []);

  const startDraw = useCallback(() => {
    if (!seedInput.trim()) return;
    const schedule = generateSchedule(seedInput.trim());
    setWeeks(schedule);
    setCurrentWeek(0);
    setPhase('animating');
    setView('reveal');
  }, [seedInput]);

  // Animation loop: reveal one week at a time
  useEffect(() => {
    if (phase !== 'animating' || weeks.length === 0) return;

    const revealNext = () => {
      setCurrentWeek((prev) => {
        const next = prev + 1;
        if (next > 14) {
          setPhase('done');
          return 14;
        }
        setWeeks((w) =>
          w.map((week) =>
            week.week === next ? { ...week, revealed: true } : week
          )
        );
        timerRef.current = setTimeout(revealNext, 600);
        return next;
      });
    };

    // Kick off after a short delay
    timerRef.current = setTimeout(revealNext, 400);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phase, weeks.length]);

  const revealAll = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setWeeks((w) => w.map((week) => ({ ...week, revealed: true })));
    setCurrentWeek(14);
    setPhase('done');
  };

  // Full schedule grid view
  const ScheduleGrid = () => {
    // Build a map: owner → week → opponent
    const allTeams = DIVISIONS.flatMap((d) => d.teams);
    const ownerSchedule: Record<string, Record<number, { opp: string; type: 'division' | 'cross' }>> = {};
    allTeams.forEach((t) => { ownerSchedule[t] = {}; });

    weeks.forEach((week) => {
      week.matchups.forEach((m) => {
        if (ownerSchedule[m.home]) ownerSchedule[m.home][week.week] = { opp: m.away, type: m.type };
        if (ownerSchedule[m.away]) ownerSchedule[m.away][week.week] = { opp: m.home, type: m.type };
      });
    });

    return (
      <div className="overflow-x-auto mt-2">
        <table className="text-xs w-full border-collapse min-w-[800px]">
          <thead>
            <tr>
              <th className="text-left text-gray-400 font-normal py-1.5 pr-3 min-w-[130px]">Owner</th>
              {Array.from({ length: 14 }, (_, i) => i + 1).map((w) => (
                <th
                  key={w}
                  className={`text-center px-1 py-1.5 font-normal min-w-[56px] ${
                    w <= 3 || w >= 12 ? 'text-[#ffd700]' : 'text-gray-400'
                  }`}
                >
                  Wk {w}
                  {(w <= 3 || w >= 12) && <div className="text-[9px] text-[#ffd700]/60">DIV</div>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DIVISIONS.map((div, di) => (
              <>
                <tr key={`div-header-${di}`}>
                  <td
                    colSpan={15}
                    className={`pt-3 pb-1 text-xs font-bold uppercase tracking-wider ${div.color}`}
                  >
                    {div.name}
                  </td>
                </tr>
                {div.teams.map((team) => (
                  <tr key={team} className="border-t border-gray-800/60">
                    <td className="py-1.5 pr-3 text-gray-300 font-medium whitespace-nowrap">{team}</td>
                    {Array.from({ length: 14 }, (_, i) => i + 1).map((w) => {
                      const entry = ownerSchedule[team]?.[w];
                      if (!entry) return <td key={w} className="text-center py-1.5 px-1 text-gray-700">—</td>;
                      return (
                        <td key={w} className="text-center py-1.5 px-0.5">
                          <span
                            className={`text-[10px] px-1 py-0.5 rounded whitespace-nowrap block text-center ${
                              entry.type === 'division'
                                ? 'bg-[#ffd700]/10 text-[#ffd700] border border-[#ffd700]/20'
                                : 'text-gray-400'
                            }`}
                            title={entry.opp}
                          >
                            {entry.opp.length > 8 ? entry.opp.slice(0, 8) + '…' : entry.opp}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Schedule Draw — BMFFFL 2026</title>
        <meta name="description" content="BMFFFL 2026 live schedule draw — enter a seed word and generate the full 14-week schedule." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-[#0a0a0f] text-white">
        {/* Header */}
        <div className="border-b border-gray-800 px-4 py-5">
          <div className="max-w-5xl mx-auto flex items-start gap-3">
            <Shuffle className="text-[#ffd700] mt-0.5 shrink-0" size={22} />
            <div>
              <h1 className="text-xl font-bold text-white">2026 Schedule Draw</h1>
              <p className="text-gray-400 text-sm mt-0.5">
                Enter a seed word or number — generates the full BMFFFL 14-week schedule
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

          {/* Season format info */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <Calendar size={14} />, label: 'Division Weeks', detail: '1–3, 12–14', color: 'text-[#ffd700]' },
              { icon: <Users size={14} />, label: 'Cross-Division', detail: 'Weeks 4–11', color: 'text-blue-400' },
              { icon: <Trophy size={14} />, label: '3 Divisions', detail: '4 teams each', color: 'text-green-400' },
            ].map((item) => (
              <div key={item.label} className="bg-gray-900/60 border border-gray-700/60 rounded-xl p-3 text-center">
                <div className={`flex justify-center mb-1 ${item.color}`}>{item.icon}</div>
                <div className={`text-sm font-bold ${item.color}`}>{item.detail}</div>
                <div className="text-gray-500 text-xs">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Seed input */}
          {phase === 'idle' && (
            <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-6">
              <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <Zap size={16} className="text-[#ffd700]" />
                Enter the draw seed
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                Any word, name, or number — the schedule is deterministic from the seed, so everyone in the room sees the same result.
              </p>
              <div className="flex gap-3 flex-wrap">
                <input
                  type="text"
                  value={seedInput}
                  onChange={(e) => setSeedInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && startDraw()}
                  placeholder="e.g. BMFFFL2026 or your lucky word…"
                  className="flex-1 min-w-[200px] bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#ffd700] placeholder-gray-600"
                />
                <button
                  onClick={startDraw}
                  disabled={!seedInput.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#ffd700] text-black font-bold rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-yellow-300 transition-colors"
                >
                  <Play size={16} />
                  Draw Schedule
                </button>
              </div>

              {/* Division preview */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {DIVISIONS.map((div) => (
                  <div key={div.name} className="bg-gray-800/40 rounded-lg p-3">
                    <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${div.color}`}>{div.name}</div>
                    {div.teams.map((t) => (
                      <div key={t} className="text-gray-300 text-sm py-0.5">{t}</div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Animating / Done */}
          {(phase === 'animating' || phase === 'done') && (
            <div className="space-y-4">
              {/* Controls */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-400">
                    Seed: <span className="text-white font-mono font-bold">{seedInput}</span>
                  </div>
                  {phase === 'done' && (
                    <span className="text-xs text-emerald-400 bg-emerald-900/30 border border-emerald-700/40 px-2 py-0.5 rounded-full">
                      Schedule complete ✓
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {phase === 'animating' && (
                    <button
                      onClick={revealAll}
                      className="text-xs px-3 py-1.5 bg-gray-800 border border-gray-600 rounded-lg text-gray-300 hover:text-white transition-colors"
                    >
                      Reveal all
                    </button>
                  )}
                  {phase === 'done' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setView(view === 'reveal' ? 'grid' : 'reveal')}
                        className="text-xs px-3 py-1.5 bg-gray-800 border border-gray-600 rounded-lg text-gray-300 hover:text-white transition-colors"
                      >
                        {view === 'reveal' ? '📊 Full Grid' : '📅 Week View'}
                      </button>
                    </div>
                  )}
                  <button
                    onClick={reset}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gray-800 border border-gray-600 rounded-lg text-gray-300 hover:text-white transition-colors"
                  >
                    <RotateCcw size={12} />
                    New seed
                  </button>
                </div>
              </div>

              {/* Week reveal view */}
              {view === 'reveal' && (
                <div className="space-y-3">
                  {weeks.map((week) => {
                    const isDivWeek = week.week <= 3 || week.week >= 12;
                    return (
                      <div
                        key={week.week}
                        className={`border rounded-xl overflow-hidden transition-all duration-500 ${
                          week.revealed ? 'opacity-100' : 'opacity-0 translate-y-2'
                        } ${
                          week.week === currentWeek && phase === 'animating'
                            ? 'border-[#ffd700]/60 bg-[#ffd700]/5 shadow-lg shadow-[#ffd700]/10'
                            : isDivWeek
                            ? 'border-[#ffd700]/20 bg-[#ffd700]/3'
                            : 'border-gray-700/60 bg-gray-900/40'
                        }`}
                      >
                        <div className="px-4 py-2.5 border-b border-gray-700/40 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{WEEK_LABELS[week.week]}</span>
                            {isDivWeek && (
                              <span className="text-xs text-[#ffd700] bg-[#ffd700]/10 border border-[#ffd700]/30 px-2 py-0.5 rounded-full">
                                Division ★
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">{week.matchups.length} games</span>
                        </div>
                        {week.revealed && (
                          <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {week.matchups.map((m, i) => (
                              <MatchupCard key={i} matchup={m} />
                            ))}
                          </div>
                        )}
                        {!week.revealed && (
                          <div className="px-4 py-3 flex items-center gap-2 text-gray-600 text-sm">
                            <span className="animate-pulse">Drawing…</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Full grid view */}
              {view === 'grid' && phase === 'done' && (
                <div className="bg-gray-900/60 border border-gray-700/60 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="inline-block w-3 h-3 rounded bg-[#ffd700]/20 border border-[#ffd700]/40" />
                      Division game
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 ml-4">
                      <span className="inline-block w-3 h-3 rounded bg-gray-700/40" />
                      Cross-division
                    </div>
                  </div>
                  <ScheduleGrid />
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
