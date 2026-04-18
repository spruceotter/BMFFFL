/**
 * Draft Game 2026 — Leaderboard & Submission Tracker
 *
 * Pre-draft: shows which owners have submitted picks.
 * Post-draft: live scoring leaderboard as Bimflé marks correct answers.
 * Auto-refreshes every 30 seconds.
 */

import { useEffect, useState, useCallback, useRef, type ReactElement } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CONVEX_SITE = 'https://resolute-setter-416.convex.site';
const YEAR = '2026';
const DRAFT_DATE = new Date('2026-04-23T20:00:00-04:00'); // 8pm ET draft start — April 23 (Round 1)
const SUBMISSION_DEADLINE = new Date('2026-04-23T20:00:00-04:00'); // lock at kickoff

// Distinct color per owner for the bump chart
const OWNER_COLORS: Record<string, string> = {
  'Grandes':        '#f59e0b',
  'SexMachineAndyD':'#3b82f6',
  'tdtd19844':      '#10b981',
  'Cogdeill11':     '#ef4444',
  'rbr':            '#8b5cf6',
  'MLSchools12':    '#f97316',
  'Cmaleski':       '#14b8a6',
  'eldridm20':      '#ec4899',
  'JuicyBussy':     '#6366f1',
  'eldridsm':       '#84cc16',
  'Tubes94':        '#06b6d4',
  'Bimflé':         '#ffd700',
};

// Snapshot type for bump chart history
type RankSnapshot = { n: number } & Record<string, number>;
const HISTORY_KEY = 'bmfffl-lb-history-2026';

const ALL_OWNERS = [
  'Grandes',
  'SexMachineAndyD',
  'tdtd19844',
  'Cogdeill11',
  'rbr',
  'MLSchools12',
  'Cmaleski',
  'eldridm20',
  'JuicyBussy',
  'eldridsm',
  'Tubes94',
  'Bimflé',
];

// Special prize conditions per owner (displayed alongside their entry)
const OWNER_NOTES: Record<string, string> = {
  'Bimflé': '⚠️ If wins: 3.13 pick → Dispersal Draft',
};

interface Submission {
  owner_name: string;
  submitted_at: string;
}

interface LeaderboardEntry {
  owner_name: string;
  total_score: number;
  scored_at?: string;
}

interface AnsweredQuestion {
  question_id: string;
  question_text: string;
  section: string;
  order: number;
  correct_option_id: string;
  options: { id: string; label: string; points: number }[];
}

interface PublicQuestion {
  question_id: string;
  question_text: string;
  section: string;
  order: number;
  options: { id: string; label: string; points: number }[];
}

interface OwnerPicks {
  owner_name: string;
  answers: Record<string, string>;
}

interface DraftGameState {
  submissions: Submission[];
  leaderboard: LeaderboardEntry[];
  lastFetched: Date | null;
  loading: boolean;
  error: string | null;
}

function useCountdown(target: Date) {
  const [diff, setDiff] = useState(() => target.getTime() - Date.now());
  useEffect(() => {
    const id = setInterval(() => setDiff(target.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  if (diff <= 0) return null;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s };
}

export default function DraftGameLeaderboard2026() {
  const [state, setState] = useState<DraftGameState>({
    submissions: [],
    leaderboard: [],
    lastFetched: null,
    loading: true,
    error: null,
  });
  const [nextRefresh, setNextRefresh] = useState(30);
  const [myName, setMyName] = useState<string | null>(null);
  const [myPicks, setMyPicks] = useState<Record<string, string> | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([]);
  const [chartHistory, setChartHistory] = useState<RankSnapshot[]>([]);
  // rankMovements: diff since last scoring change (positive = moved up the leaderboard)
  const [rankMovements, setRankMovements] = useState<Record<string, number>>({});
  const prevRanksRef = useRef<Record<string, number>>({});
  // All picks (revealed only once scoring starts) + all question definitions
  const [allPicks, setAllPicks] = useState<OwnerPicks[]>([]);
  const [allQuestions, setAllQuestions] = useState<PublicQuestion[]>([]);

  // Detect which owner is viewing (from localStorage, set when they submitted)
  useEffect(() => {
    const stored = localStorage.getItem('bmfffl-draft-game-owner');
    if (stored) setMyName(stored);
    // Load bump chart history from localStorage
    try {
      const hist = localStorage.getItem(HISTORY_KEY);
      if (hist) setChartHistory(JSON.parse(hist) as RankSnapshot[]);
    } catch { /* ignore */ }
  }, []);

  // Fetch this owner's own picks (for scorecard)
  useEffect(() => {
    if (!myName) return;
    fetch(`${CONVEX_SITE}/getMyDraftGameEntry?year=${YEAR}&owner_name=${encodeURIComponent(myName)}`)
      .then((r) => r.json())
      .then((data: { answers?: Record<string, string> } | null) => {
        if (data?.answers) setMyPicks(data.answers);
      })
      .catch(() => {});
  }, [myName]);

  // Fetch answered questions for scorecard (public endpoint, safe post-draft)
  const fetchAnsweredQuestions = useCallback(async () => {
    try {
      const r = await fetch(`${CONVEX_SITE}/getDraftGameAnsweredQuestions?year=${YEAR}`);
      const data = await r.json() as AnsweredQuestion[];
      setAnsweredQuestions(data);
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    fetchAnsweredQuestions();
  }, [fetchAnsweredQuestions]);

  const countdown = useCountdown(DRAFT_DATE);
  const isPastDeadline = Date.now() >= SUBMISSION_DEADLINE.getTime();
  const isScored = state.leaderboard.length > 0;

  const fetchData = useCallback(async () => {
    try {
      const [subRes, lbRes, aqRes, picksRes, qRes] = await Promise.all([
        fetch(`${CONVEX_SITE}/getDraftGameSubmissions?year=${YEAR}`),
        fetch(`${CONVEX_SITE}/getDraftGameLeaderboard?year=${YEAR}`),
        fetch(`${CONVEX_SITE}/getDraftGameAnsweredQuestions?year=${YEAR}`),
        fetch(`${CONVEX_SITE}/getDraftGameAllPicks?year=${YEAR}`),
        fetch(`${CONVEX_SITE}/getDraftGameQuestionsPublic?year=${YEAR}`),
      ]);
      const submissions: Submission[] = await subRes.json();
      const leaderboard: LeaderboardEntry[] = await lbRes.json();
      const answered: AnsweredQuestion[] = await aqRes.json();
      const picks: OwnerPicks[] = await picksRes.json();
      const questions: PublicQuestion[] = await qRes.json();
      setState({ submissions, leaderboard, lastFetched: new Date(), loading: false, error: null });
      setAnsweredQuestions(answered);
      setAllPicks(picks);
      setAllQuestions(questions);

      // Initialize prevRanks ref on very first leaderboard load
      if (Object.keys(prevRanksRef.current).length === 0 && leaderboard.length > 0) {
        const init: Record<string, number> = {};
        leaderboard.forEach((e, i) => { init[e.owner_name] = i + 1; });
        prevRanksRef.current = init;
      }

      // Push bump chart snapshot when pick count changes
      if (leaderboard.length > 0 && answered.length > 0) {
        setChartHistory((prev) => {
          const lastN = prev.length > 0 ? prev[prev.length - 1].n : -1;
          if (answered.length === lastN) return prev; // no change — no movement update either
          // Compute movement arrows BEFORE updating the ref (so we capture old→new diff)
          if (Object.keys(prevRanksRef.current).length > 0) {
            const movements: Record<string, number> = {};
            leaderboard.forEach((e, i) => {
              const old = prevRanksRef.current[e.owner_name];
              if (old !== undefined) movements[e.owner_name] = old - (i + 1); // positive = moved up
            });
            setRankMovements(movements);
          }
          // Update ref to reflect new order
          const newRanks: Record<string, number> = {};
          leaderboard.forEach((e, i) => { newRanks[e.owner_name] = i + 1; });
          prevRanksRef.current = newRanks;
          // Build chart snapshot (inverted: 13 - rank so rank1 displays at top)
          const snapshot: RankSnapshot = { n: answered.length };
          leaderboard.forEach((e, i) => {
            snapshot[e.owner_name] = 13 - (i + 1);
          });
          const next = [...prev, snapshot].slice(-40);
          try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch { /* ignore */ }
          return next;
        });
      }
    } catch {
      setState((prev) => ({ ...prev, loading: false, error: 'Failed to load data. Will retry.' }));
    }
    setNextRefresh(30);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh countdown
  useEffect(() => {
    const id = setInterval(() => {
      setNextRefresh((n) => {
        if (n <= 1) { fetchData(); return 30; }
        return n - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [fetchData]);

  const submittedSet = new Set(state.submissions.map((s) => s.owner_name));

  // Compute max-possible scores when allPicks + allQuestions are available
  // Max possible = current score + sum of points for remaining unanswered picks
  const answeredIds = new Set(answeredQuestions.map((q) => q.question_id));
  const unansweredQuestions = allQuestions.filter((q) => !answeredIds.has(q.question_id));
  const maxPossible: Record<string, number> = {};
  if (allPicks.length > 0 && isScored) {
    for (const ownerPicks of allPicks) {
      const lb = state.leaderboard.find((e) => e.owner_name === ownerPicks.owner_name);
      let current = lb?.total_score ?? 0;
      for (const q of unansweredQuestions) {
        const optId = ownerPicks.answers[q.question_id];
        if (!optId) continue; // skipped — no upside
        const opt = q.options.find((o) => o.id === optId);
        if (opt) current += opt.points;
      }
      maxPossible[ownerPicks.owner_name] = current;
    }
  }

  // Build per-question picks map: { question_id → { owner_name → option_id } }
  const picksMap: Record<string, Record<string, string>> = {};
  for (const op of allPicks) {
    for (const [qid, optId] of Object.entries(op.answers)) {
      if (!picksMap[qid]) picksMap[qid] = {};
      picksMap[qid][op.owner_name] = optId;
    }
  }

  return (
    <>
      <Head>
        <title>Draft Game 2026 — Leaderboard | BMFFFL</title>
      </Head>

      <div className="min-h-screen bg-[#0d1b2a] text-white font-sans px-4 py-8">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <Link href="/nfl-draft/2026" className="text-slate-500 hover:text-slate-300 text-sm">
                ← NFL Draft 2026
              </Link>
              {myName && (
                <Link
                  href="/nfl-draft/draft-game-2026"
                  className="text-[#ffd700]/70 hover:text-[#ffd700] text-xs font-semibold"
                >
                  My Picks →
                </Link>
              )}
            </div>
            <h1 className="text-3xl font-black text-white mb-1">
              🏆 Draft Game 2026
            </h1>
            <p className="text-slate-400 text-sm">
              {isScored
                ? 'Live leaderboard — scores update as Bimflé marks correct answers'
                : 'Track who has locked in their picks before April 23'}
            </p>
          </div>

          {/* ── LIVE FEED (public — recently answered picks + remaining count) ── */}
          {answeredQuestions.length > 0 && (() => {
            const TOTAL_QUESTIONS = 34; // 35 questions minus tiebreaker
            const remaining = Math.max(0, TOTAL_QUESTIONS - answeredQuestions.length);
            const recentPicks = [...answeredQuestions].reverse().slice(0, 5);
            return (
              <div className="mb-6 bg-[#0f2133] rounded-xl border border-[#1e3a55] overflow-hidden">
                <div className="px-4 py-2.5 border-b border-[#1e3a55] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-white font-bold text-sm">Live</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    <span className="text-white font-semibold">{answeredQuestions.length}</span>
                    <span className="text-slate-500"> / {TOTAL_QUESTIONS} scored</span>
                    {remaining > 0 && <span className="ml-2 text-slate-500">· {remaining} open</span>}
                    {remaining === 0 && <span className="ml-2 text-green-400 font-semibold">· Complete</span>}
                  </span>
                </div>
                <div className="divide-y divide-[#1e3a55]">
                  {recentPicks.map((q) => {
                    const correctOpt = q.options.find((o) => o.id === q.correct_option_id);
                    return (
                      <div key={q.question_id} className="px-4 py-2.5 flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-600 shrink-0 w-7">{q.question_id}</span>
                        <p className="text-slate-300 text-xs flex-1 leading-snug line-clamp-1">{q.question_text}</p>
                        <span className="text-green-400 text-xs font-semibold shrink-0 text-right max-w-[120px] truncate">
                          {correctOpt?.label ?? q.correct_option_id}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {answeredQuestions.length > 5 && (
                  <div className="px-4 py-2 text-xs text-slate-600 border-t border-[#1e3a55]">
                    + {answeredQuestions.length - 5} more answered
                  </div>
                )}
              </div>
            );
          })()}

          {/* "You're in" banner when owner is identified and scoring is live */}
          {myName && isScored && (() => {
            const myEntry = state.leaderboard.find((e) => e.owner_name === myName);
            const myRank = myEntry ? state.leaderboard.findIndex((e) => e.owner_name === myName) + 1 : null;
            return myEntry ? (
              <div className="bg-[#ffd700]/10 border border-[#ffd700]/50 rounded-xl px-4 py-3 mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[#ffd700] font-bold text-sm">You — {myName}</p>
                  <p className="text-slate-400 text-xs mt-0.5">Rank #{myRank} of {state.leaderboard.length}</p>
                </div>
                <span className="text-[#ffd700] font-black text-2xl tabular-nums">{myEntry.total_score.toLocaleString()}</span>
              </div>
            ) : null;
          })()}

          {/* Scoring note */}
          <div className="bg-amber-900/20 border border-amber-500/40 rounded-xl p-3 mb-6 flex items-center gap-2">
            <span className="text-amber-400 text-sm">⚠️</span>
            <p className="text-amber-200/70 text-xs">
              Scoring: correct = full points · <span className="text-red-400 font-semibold">wrong = −100 pts</span> · unanswered = 0 (skip freely)
            </p>
          </div>

          {/* Countdown (pre-draft) */}
          {!isPastDeadline && countdown && (
            <div className="bg-[#ffd700]/10 border border-[#ffd700]/30 rounded-xl p-4 mb-6">
              <p className="text-[#ffd700] text-xs font-bold uppercase tracking-widest mb-2">Submissions lock in</p>
              <div className="flex gap-4">
                {[
                  { label: 'Days', val: countdown.d },
                  { label: 'Hrs', val: countdown.h },
                  { label: 'Min', val: countdown.m },
                  { label: 'Sec', val: countdown.s },
                ].map(({ label, val }) => (
                  <div key={label} className="text-center">
                    <div className="text-2xl font-black text-[#ffd700] tabular-nums">{String(val).padStart(2, '0')}</div>
                    <div className="text-xs text-slate-500 uppercase">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error state */}
          {state.error && (
            <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-3 mb-4 text-red-300 text-sm">
              {state.error}
            </div>
          )}

          {/* Loading state */}
          {state.loading && (
            <div className="text-slate-500 text-sm text-center py-8">Loading…</div>
          )}

          {/* ── LEADERBOARD (post-scoring) ── */}
          {!state.loading && isScored && (
            <div className="mb-6">
              <h2 className="text-[#ffd700] font-black text-sm uppercase tracking-widest mb-3">
                Leaderboard
              </h2>
              <div className="rounded-xl overflow-hidden border border-slate-700/50">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-800/60 text-left">
                      <th className="px-4 py-3 text-slate-400 text-xs uppercase tracking-wider w-10">#</th>
                      <th className="px-4 py-3 text-slate-400 text-xs uppercase tracking-wider">Owner</th>
                      <th className="px-4 py-3 text-slate-400 text-xs uppercase tracking-wider text-right">Score</th>
                      {Object.keys(maxPossible).length > 0 && (
                        <th className="px-3 py-3 text-slate-500 text-xs uppercase tracking-wider text-right">Max</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {state.leaderboard.map((entry, idx) => {
                      const isFirst = idx === 0;
                      const isTied = idx > 0 && entry.total_score === state.leaderboard[idx - 1].total_score;
                      const rank = isTied ? '—' : String(idx + 1);
                      const isMe = myName && entry.owner_name === myName;
                      const moved = rankMovements[entry.owner_name] ?? 0;
                      return (
                        <tr
                          key={entry.owner_name}
                          className={`border-t border-slate-700/40 ${
                            isMe
                              ? 'bg-[#ffd700]/10 ring-1 ring-inset ring-[#ffd700]/30'
                              : isFirst ? 'bg-[#ffd700]/5' : 'bg-slate-900/30'
                          }`}
                        >
                          <td className="px-4 py-3 font-mono text-sm">
                            <div className="flex items-center gap-1">
                              <span className="text-slate-500">{isFirst ? '🥇' : rank}</span>
                              {moved > 0 && <span className="text-green-400 text-xs leading-none">↑</span>}
                              {moved < 0 && <span className="text-red-400 text-xs leading-none">↓</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-semibold text-white">
                            <div className="flex items-center gap-2">
                              {entry.owner_name}
                              {isMe && (
                                <span className="text-[10px] font-bold bg-[#ffd700] text-[#0d1b2a] px-1.5 py-0.5 rounded uppercase tracking-wide leading-none">you</span>
                              )}
                            </div>
                            {OWNER_NOTES[entry.owner_name] && (
                              <div className="text-xs text-amber-400/80 font-normal mt-0.5">{OWNER_NOTES[entry.owner_name]}</div>
                            )}
                          </td>
                          <td className={`px-4 py-3 text-right font-black tabular-nums text-lg ${isFirst || isMe ? 'text-[#ffd700]' : 'text-white'}`}>
                            {entry.total_score.toLocaleString()}
                          </td>
                          {Object.keys(maxPossible).length > 0 && (
                            <td className="px-3 py-3 text-right text-slate-400 text-sm tabular-nums font-medium">
                              {maxPossible[entry.owner_name] !== undefined
                                ? maxPossible[entry.owner_name].toLocaleString()
                                : '—'}
                            </td>
                          )}
                        </tr>
                      );
                    })}

                    {/* Owners who submitted but aren't scored yet */}
                    {state.submissions
                      .filter((s) => !state.leaderboard.find((l) => l.owner_name === s.owner_name))
                      .map((s) => (
                        <tr key={s.owner_name} className="border-t border-slate-700/40 bg-slate-900/20">
                          <td className="px-4 py-3 text-slate-600 text-sm">—</td>
                          <td className="px-4 py-3 text-slate-400">
                            <div>{s.owner_name}</div>
                            {OWNER_NOTES[s.owner_name] && (
                              <div className="text-xs text-amber-400/80 font-normal mt-0.5">{OWNER_NOTES[s.owner_name]}</div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right text-slate-500 text-sm">pending</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {state.leaderboard[0]?.scored_at && (
                <p className="text-slate-600 text-xs mt-2 text-right">
                  Last scored: {new Date(state.leaderboard[0].scored_at).toLocaleString()}
                </p>
              )}
            </div>
          )}

          {/* ── THE RACE — Bump chart (ranking over time) ── */}
          {chartHistory.length >= 2 && (
            <div className="mb-6 bg-[#0f2133] rounded-xl border border-[#1e3a55] overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#1e3a55] flex items-center justify-between">
                <h2 className="text-white font-bold text-sm">📈 The Race</h2>
                <span className="text-xs text-slate-500">
                  {chartHistory[chartHistory.length - 1]?.n ?? 0} of 34 picks scored
                </span>
              </div>
              <div className="px-2 pt-3 pb-1">
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartHistory} margin={{ top: 5, right: 12, bottom: 22, left: 0 }}>
                    <XAxis
                      dataKey="n"
                      tick={{ fill: '#64748b', fontSize: 10 }}
                      label={{ value: 'picks scored', position: 'insideBottom', offset: -10, fill: '#475569', fontSize: 10 }}
                    />
                    <YAxis
                      domain={[1, 12]}
                      ticks={[1, 4, 7, 10, 12]}
                      tickFormatter={(v: number) => `#${13 - v}`}
                      tick={{ fill: '#64748b', fontSize: 10 }}
                      width={26}
                    />
                    <Tooltip
                      contentStyle={{ background: '#0f2133', border: '1px solid #1e3a55', borderRadius: 8, fontSize: 11, padding: '6px 10px' }}
                      labelFormatter={(label: number) => `After pick ${label}`}
                      formatter={(val: unknown, name: string) => [`#${13 - (val as number)}`, name]}
                      itemSorter={(item) => -(item.value as number)}
                    />
                    {ALL_OWNERS.map((owner) => (
                      <Line
                        key={owner}
                        type="monotone"
                        dataKey={owner}
                        stroke={OWNER_COLORS[owner] ?? '#888888'}
                        strokeWidth={myName === owner ? 3 : 1.5}
                        dot={false}
                        activeDot={{ r: 3 }}
                        opacity={myName ? (myName === owner ? 1 : 0.4) : 0.8}
                        connectNulls
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
                {myName && OWNER_COLORS[myName] && (
                  <div className="flex items-center gap-1.5 px-2 pb-2">
                    <div
                      className="w-5 h-0.5 rounded-full"
                      style={{ background: OWNER_COLORS[myName] }}
                    />
                    <span className="text-xs text-slate-400">{myName} (you)</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── FIELD PICKS — who picked what per question (revealed once scoring starts) ── */}
          {allPicks.length > 0 && allQuestions.length > 0 && (() => {
            // Group questions by section
            const sections: Record<string, PublicQuestion[]> = {};
            for (const q of allQuestions) {
              if (!sections[q.section]) sections[q.section] = [];
              sections[q.section].push(q);
            }
            // Build answered lookup for quick access
            const answeredMap: Record<string, AnsweredQuestion> = {};
            for (const aq of answeredQuestions) answeredMap[aq.question_id] = aq;

            return (
              <div className="mb-6">
                <h2 className="text-[#ffd700] font-black text-sm uppercase tracking-widest mb-3">
                  Field Picks
                </h2>
                <div className="space-y-3">
                  {Object.entries(sections).map(([section, sectionQs]) => (
                    <div key={section}>
                      <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2 px-1">{section}</div>
                      <div className="space-y-2">
                        {sectionQs.map((q) => {
                          const answered = answeredMap[q.question_id];
                          const qPicks = picksMap[q.question_id] ?? {};
                          return (
                            <div key={q.question_id} className="bg-[#0f2133] rounded-xl border border-[#1e3a55] overflow-hidden">
                              <div className="px-4 py-2 border-b border-[#1e3a55] flex items-center gap-2">
                                <span className="text-slate-600 text-xs font-mono">{q.question_id}</span>
                                <p className="text-white text-xs font-medium leading-snug flex-1">{q.question_text}</p>
                                {answered && (
                                  <span className="text-green-400 text-xs font-semibold shrink-0">
                                    ✓ {q.options.find((o) => o.id === answered.correct_option_id)?.label ?? answered.correct_option_id}
                                  </span>
                                )}
                              </div>
                              <div className="px-3 py-2 flex flex-wrap gap-1.5">
                                {ALL_OWNERS.map((owner) => {
                                  const optId = qPicks[owner];
                                  const opt = q.options.find((o) => o.id === optId);
                                  const isCorrect = answered && optId === answered.correct_option_id;
                                  const isWrong = answered && optId && optId !== answered.correct_option_id;
                                  const isSkipped = !optId;
                                  const isMe = owner === myName;
                                  return (
                                    <div
                                      key={owner}
                                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border ${
                                        isSkipped
                                          ? 'border-slate-700 text-slate-600 bg-transparent'
                                          : isCorrect
                                            ? 'border-green-500/50 bg-green-900/20 text-green-300'
                                            : isWrong
                                              ? 'border-red-500/40 bg-red-900/20 text-red-300'
                                              : 'border-slate-600 bg-slate-800/50 text-slate-300'
                                      } ${isMe ? 'ring-1 ring-[#ffd700]/50' : ''}`}
                                    >
                                      <span
                                        className="w-1.5 h-1.5 rounded-full shrink-0"
                                        style={{ background: OWNER_COLORS[owner] ?? '#888' }}
                                      />
                                      <span className="font-medium">{owner}</span>
                                      {!isSkipped && (
                                        <span className={`${isCorrect ? 'text-green-400' : isWrong ? 'text-red-400' : 'text-slate-400'}`}>
                                          {opt?.label ?? optId}
                                          {isCorrect && ' ✅'}
                                          {isWrong && ' ❌'}
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* ── MY SCORECARD (when owner detected + answers flowing in) ── */}
          {myName && myPicks && answeredQuestions.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[#ffd700] font-black text-sm uppercase tracking-widest">
                  My Scorecard
                </h2>
                <span className="text-slate-400 text-sm font-semibold">
                  {answeredQuestions.filter((q) => myPicks[q.question_id] === q.correct_option_id).length}
                  <span className="text-slate-500"> / {answeredQuestions.length} correct</span>
                </span>
              </div>
              <div className="rounded-xl overflow-hidden border border-slate-700/50 divide-y divide-slate-700/40">
                {answeredQuestions.map((q) => {
                  const myPick = myPicks[q.question_id];
                  const isCorrect = myPick === q.correct_option_id;
                  const correctOpt = q.options.find((o) => o.id === q.correct_option_id);
                  const myPickOpt = q.options.find((o) => o.id === myPick);
                  const pts = isCorrect ? (correctOpt?.points ?? 0) : (myPick ? -100 : 0);
                  return (
                    <div key={q.question_id} className={`px-4 py-3 flex items-start gap-3 ${isCorrect ? 'bg-green-900/10' : myPick ? 'bg-red-900/10' : 'bg-slate-900/20'}`}>
                      <span className="text-lg shrink-0 mt-0.5">
                        {isCorrect ? '✅' : myPick ? '❌' : '⏭️'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm leading-snug">{q.question_text}</p>
                        <div className="mt-1 flex flex-wrap gap-2 text-xs">
                          {myPickOpt && !isCorrect && (
                            <span className="text-red-400">Your pick: {myPickOpt.label}</span>
                          )}
                          <span className={isCorrect ? 'text-green-400' : 'text-slate-400'}>
                            {isCorrect ? `Correct: ${correctOpt?.label}` : `Correct: ${correctOpt?.label ?? '—'}`}
                          </span>
                        </div>
                      </div>
                      <span className={`text-sm font-bold shrink-0 tabular-nums ${isCorrect ? 'text-green-400' : myPick ? 'text-red-400' : 'text-slate-500'}`}>
                        {pts > 0 ? `+${pts}` : pts === 0 ? '0' : pts}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── SUBMISSIONS TRACKER (pre-draft or alongside leaderboard) ── */}
          {!state.loading && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[#ffd700] font-black text-sm uppercase tracking-widest">
                  {isScored ? 'All Participants' : 'Who\'s In'}
                </h2>
                <span className="text-slate-400 text-sm font-semibold">
                  {submittedSet.size} / {ALL_OWNERS.length} submitted
                </span>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-700/50">
                {ALL_OWNERS.map((owner, idx) => {
                  const sub = state.submissions.find((s) => s.owner_name === owner);
                  const hasSubmitted = !!sub;
                  const isMe = myName && owner === myName;
                  return (
                    <div
                      key={owner}
                      className={`flex items-center justify-between px-4 py-3 ${idx > 0 ? 'border-t border-slate-700/40' : ''} ${
                        isMe ? 'bg-[#ffd700]/10' : hasSubmitted ? 'bg-slate-900/30' : 'bg-slate-900/10'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${hasSubmitted ? 'text-white' : 'text-slate-500'}`}>
                            {owner}
                          </span>
                          {isMe && (
                            <span className="text-[10px] font-bold bg-[#ffd700] text-[#0d1b2a] px-1.5 py-0.5 rounded uppercase tracking-wide leading-none">you</span>
                          )}
                        </div>
                        {OWNER_NOTES[owner] && (
                          <div className="text-xs text-amber-400/70 mt-0.5">{OWNER_NOTES[owner]}</div>
                        )}
                      </div>
                      <span>
                        {hasSubmitted ? (
                          <span className="text-green-400 font-bold text-sm">✓ Locked</span>
                        ) : (
                          <span className="text-slate-600 text-sm">Pending</span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>

              {!isScored && !isPastDeadline && (
                <div className="mt-4 text-center">
                  <Link
                    href="/nfl-draft/draft-game-2026"
                    className="inline-block bg-[#ffd700] text-[#0d1b2a] font-black px-6 py-2 rounded-lg hover:bg-yellow-300 transition-colors text-sm"
                  >
                    Submit Your Picks →
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Refresh indicator */}
          <div className="flex items-center justify-between text-slate-600 text-xs mt-4">
            <span>
              {state.lastFetched ? `Updated ${state.lastFetched.toLocaleTimeString()}` : 'Loading…'}
            </span>
            <span>Refreshes in {nextRefresh}s</span>
          </div>

        </div>
      </div>
    </>
  );
}

// Standalone shell — suppress BMFFFL navigation and footer for the live game experience.
// The page has its own minimal back link and is self-contained.
DraftGameLeaderboard2026.getLayout = (page: ReactElement) => page;

export async function getServerSideProps(context: { query: Record<string, string> }) {
  const { name, ...rest } = context.query;
  const params = new URLSearchParams();
  if (name) params.set('name', name);
  const qs = params.toString() ? `?${params.toString()}` : '';
  return {
    redirect: {
      destination: `/nfl-draft-game${qs}`,
      permanent: true,
    },
  };
}
