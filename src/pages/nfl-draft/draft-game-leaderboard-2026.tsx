/**
 * Draft Game 2026 — Leaderboard & Submission Tracker
 *
 * Pre-draft: shows which owners have submitted picks.
 * Post-draft: live scoring leaderboard as Bimflé marks correct answers.
 * Auto-refreshes every 30 seconds.
 */

import { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const CONVEX_SITE = 'https://resolute-setter-416.convex.site';
const YEAR = '2026';
const DRAFT_DATE = new Date('2026-04-24T20:00:00-04:00'); // 8pm ET draft start
const SUBMISSION_DEADLINE = new Date('2026-04-24T18:00:00-04:00'); // lock 2h before

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

  // Detect which owner is viewing (from localStorage, set when they submitted)
  useEffect(() => {
    const stored = localStorage.getItem('bmfffl-draft-game-owner');
    if (stored) setMyName(stored);
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
      const [subRes, lbRes] = await Promise.all([
        fetch(`${CONVEX_SITE}/getDraftGameSubmissions?year=${YEAR}`),
        fetch(`${CONVEX_SITE}/getDraftGameLeaderboard?year=${YEAR}`),
      ]);
      const submissions: Submission[] = await subRes.json();
      const leaderboard: LeaderboardEntry[] = await lbRes.json();
      setState({ submissions, leaderboard, lastFetched: new Date(), loading: false, error: null });
      // Also refresh answered questions for the scorecard
      fetchAnsweredQuestions();
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'Failed to load data. Will retry.',
      }));
    }
    setNextRefresh(30);
  }, [fetchAnsweredQuestions]);

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
                    </tr>
                  </thead>
                  <tbody>
                    {state.leaderboard.map((entry, idx) => {
                      const isFirst = idx === 0;
                      const isTied = idx > 0 && entry.total_score === state.leaderboard[idx - 1].total_score;
                      const rank = isTied ? '—' : String(idx + 1);
                      const isMe = myName && entry.owner_name === myName;
                      return (
                        <tr
                          key={entry.owner_name}
                          className={`border-t border-slate-700/40 ${
                            isMe
                              ? 'bg-[#ffd700]/10 ring-1 ring-inset ring-[#ffd700]/30'
                              : isFirst ? 'bg-[#ffd700]/5' : 'bg-slate-900/30'
                          }`}
                        >
                          <td className="px-4 py-3 text-slate-500 font-mono text-sm">
                            {isFirst ? '🥇' : rank}
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
