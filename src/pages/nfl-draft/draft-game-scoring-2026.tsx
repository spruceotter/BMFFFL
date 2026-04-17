/**
 * Draft Game — Live Scoring Admin (2026)
 *
 * Admin-only page for Bimflé to mark correct answers during/after the draft.
 * Requires admin secret (stored in localStorage or passed via ?secret= URL param).
 *
 * Flow:
 *   1. Enter admin secret to unlock
 *   2. Each question shown with its options — click to mark correct answer
 *   3. "Recalculate Scores" button updates the leaderboard
 *   4. Auto-refreshes leaderboard standings every 30s
 */

import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, Trophy, RefreshCw, Lock, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';

const CONVEX_SITE = 'https://resolute-setter-416.convex.site';
const YEAR = '2026';
const SECRET_KEY = 'bmfffl-draft-admin-secret';

interface Option {
  id: string;
  label: string;
  points: number;
}

interface Question {
  _id: string;
  question_id: string;
  section: string;
  question_text: string;
  question_type?: string;
  options: Option[];
  correct_option_id?: string;
  order: number;
}

interface LeaderboardEntry {
  owner_name: string;
  total_score: number;
  scored_at?: string;
}

const SECTION_LABELS: Record<string, string> = {
  moments: '🎬 Moments',
  top_picks: '🎯 Top Picks',
  over_under: '📊 Over/Under',
  counts: '🔢 Counts',
  teams: '🏈 Teams',
  trades: '🔄 Trades',
  bmfffl: '👑 BMFFFL',
  tiebreaker: '⚖️ Tiebreaker',
};

export default function DraftGameScoringAdmin() {
  const router = useRouter();
  const [secret, setSecret] = useState('');
  const [secretInput, setSecretInput] = useState('');
  const [authed, setAuthed] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [scoreResult, setScoreResult] = useState<string | null>(null);
  const [settingAnswer, setSettingAnswer] = useState<string | null>(null); // question_id being set
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [lastLeaderboardRefresh, setLastLeaderboardRefresh] = useState<Date | null>(null);

  // Check for secret in URL params or localStorage on mount
  useEffect(() => {
    const urlSecret = router.query.secret as string | undefined;
    if (urlSecret) {
      setSecret(urlSecret);
      setAuthed(true);
      localStorage.setItem(SECRET_KEY, urlSecret);
      return;
    }
    const stored = localStorage.getItem(SECRET_KEY);
    if (stored) {
      setSecret(stored);
      setAuthed(true);
    }
  }, [router.query.secret]);

  // Fetch questions
  const fetchQuestions = useCallback(async (s: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${CONVEX_SITE}/getDraftGameQuestions?year=${YEAR}&secret=${encodeURIComponent(s)}`);
      if (res.status === 401) {
        setAuthed(false);
        localStorage.removeItem(SECRET_KEY);
        return;
      }
      const data = await res.json() as Question[];
      setQuestions(data);
    } catch (e) {
      console.error('Failed to fetch questions', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch leaderboard
  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch(`${CONVEX_SITE}/getDraftGameLeaderboard?year=${YEAR}`);
      const data = await res.json() as LeaderboardEntry[];
      setLeaderboard(data);
      setLastLeaderboardRefresh(new Date());
    } catch (e) {
      console.error('Failed to fetch leaderboard', e);
    }
  }, []);

  // Load data when authed
  useEffect(() => {
    if (authed && secret) {
      fetchQuestions(secret);
      fetchLeaderboard();
    }
  }, [authed, secret, fetchQuestions, fetchLeaderboard]);

  // Auto-refresh leaderboard every 30s
  useEffect(() => {
    if (!authed) return;
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [authed, fetchLeaderboard]);

  function handleSecretSubmit(e: React.FormEvent) {
    e.preventDefault();
    const s = secretInput.trim();
    if (!s) return;
    setSecret(s);
    setAuthed(true);
    localStorage.setItem(SECRET_KEY, s);
    fetchQuestions(s);
    fetchLeaderboard();
  }

  async function handleSetAnswer(question_id: string, correct_option_id: string) {
    setSettingAnswer(question_id);
    try {
      const res = await fetch(`${CONVEX_SITE}/adminSetAnswer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year: YEAR, question_id, correct_option_id, secret }),
      });
      if (res.ok) {
        // Update local state optimistically
        setQuestions((prev) =>
          prev.map((q) => q.question_id === question_id ? { ...q, correct_option_id } : q)
        );
      }
    } catch (e) {
      console.error('Failed to set answer', e);
    } finally {
      setSettingAnswer(null);
    }
  }

  async function handleScoreAll() {
    setScoring(true);
    setScoreResult(null);
    try {
      const res = await fetch(`${CONVEX_SITE}/adminScoreEntries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year: YEAR, secret }),
      });
      const data = await res.json() as { success: boolean; scored: number };
      setScoreResult(`✅ Scored ${data.scored} entries`);
      await fetchLeaderboard();
    } catch (e) {
      setScoreResult('❌ Scoring failed — check console');
      console.error(e);
    } finally {
      setScoring(false);
    }
  }

  // Group questions by section
  const sections = questions.reduce<Record<string, Question[]>>((acc, q) => {
    if (!acc[q.section]) acc[q.section] = [];
    acc[q.section].push(q);
    return acc;
  }, {});

  const answeredCount = questions.filter((q) => q.correct_option_id).length;

  // ── Auth screen ───────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <>
        <Head>
          <title>Draft Game Scoring — BMFFFL</title>
        </Head>
        <Navigation />
        <main className="min-h-screen bg-[#0d1b2a] text-white pt-20 flex items-center justify-center px-4">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <Lock className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <h1 className="text-2xl font-bold text-white">Scoring Admin</h1>
              <p className="text-slate-400 mt-1 text-sm">Enter admin secret to continue</p>
            </div>
            <form onSubmit={handleSecretSubmit} className="space-y-4">
              <input
                type="password"
                value={secretInput}
                onChange={(e) => setSecretInput(e.target.value)}
                placeholder="Admin secret"
                className="w-full bg-[#1a2d42] border border-[#2d4a66] rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                autoFocus
              />
              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-[#0d1b2a] font-bold py-3 rounded-lg transition-colors"
              >
                Unlock
              </button>
            </form>
          </div>
        </main>
      </>
    );
  }

  // ── Main scoring UI ───────────────────────────────────────────────────────
  return (
    <>
      <Head>
        <title>Draft Game Scoring — BMFFFL 2026</title>
      </Head>
      <Navigation />
      <main className="min-h-screen bg-[#0d1b2a] text-white pt-16 pb-20">

        {/* Header */}
        <div className="sticky top-16 z-20 bg-[#0d1b2a]/95 backdrop-blur-sm border-b border-[#2d4a66]/50 px-4 py-3">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-lg font-bold text-white">🏈 Draft Scoring Admin — 2026</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {answeredCount}/{questions.length} answered
                {lastLeaderboardRefresh && (
                  <span className="ml-2 text-slate-500">· leaderboard refreshed {Math.round((Date.now() - lastLeaderboardRefresh.getTime()) / 1000)}s ago</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {scoreResult && (
                <span className="text-sm text-green-400">{scoreResult}</span>
              )}
              <button
                onClick={fetchLeaderboard}
                className="flex items-center gap-1.5 text-slate-400 hover:text-white px-3 py-1.5 rounded border border-[#2d4a66] hover:border-slate-400 transition-colors text-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </button>
              <button
                onClick={handleScoreAll}
                disabled={scoring || answeredCount === 0}
                className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-[#0d1b2a] font-bold px-4 py-1.5 rounded transition-colors text-sm"
              >
                {scoring ? (
                  <><RefreshCw className="w-3.5 h-3.5 animate-spin" />Scoring…</>
                ) : (
                  <><Trophy className="w-3.5 h-3.5" />Recalculate Scores</>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 pt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — questions */}
          <div className="lg:col-span-2 space-y-4">
            {loading && (
              <div className="text-center text-slate-400 py-12">Loading questions…</div>
            )}
            {Object.entries(sections).map(([section, qs]) => {
              const collapsed = collapsedSections.has(section);
              const sectionAnswered = qs.filter((q) => q.correct_option_id).length;
              return (
                <div key={section} className="bg-[#0f2133] rounded-xl border border-[#1e3a55] overflow-hidden">
                  {/* Section header */}
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#152a40] transition-colors"
                    onClick={() => setCollapsedSections((prev) => {
                      const next = new Set(prev);
                      if (collapsed) next.delete(section); else next.add(section);
                      return next;
                    })}
                  >
                    <span className="font-semibold text-white text-sm">
                      {SECTION_LABELS[section] ?? section}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">{sectionAnswered}/{qs.length}</span>
                      {collapsed ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
                    </div>
                  </button>

                  {/* Questions */}
                  {!collapsed && (
                    <div className="divide-y divide-[#1e3a55]">
                      {qs.map((q) => (
                        <div key={q.question_id} className="px-4 py-3">
                          <div className="flex items-start gap-2 mb-2">
                            <span className="text-xs text-slate-500 font-mono mt-0.5 shrink-0">{q.question_id}</span>
                            <p className="text-sm text-white leading-snug">{q.question_text}</p>
                            {q.correct_option_id && (
                              <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                            )}
                          </div>
                          {q.question_type === 'open_response' ? (
                            <p className="text-xs text-slate-500 italic">Tiebreaker — no scoring</p>
                          ) : (
                            <div className="grid grid-cols-2 gap-1.5 mt-2">
                              {q.options.map((opt) => {
                                const isCorrect = q.correct_option_id === opt.id;
                                const isSetting = settingAnswer === q.question_id;
                                return (
                                  <button
                                    key={opt.id}
                                    disabled={isSetting}
                                    onClick={() => handleSetAnswer(q.question_id, opt.id)}
                                    className={`text-left px-3 py-2 rounded-lg border text-xs transition-all ${
                                      isCorrect
                                        ? 'bg-green-500/20 border-green-500 text-green-300 font-semibold'
                                        : 'bg-[#1a2d42] border-[#2d4a66] text-slate-300 hover:border-slate-400 hover:text-white'
                                    } ${isSetting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  >
                                    <span className="font-mono text-slate-500 mr-1">{opt.id}.</span>
                                    {opt.label}
                                    <span className="ml-1 text-slate-500">({opt.points > 0 ? `+${opt.points}` : opt.points})</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right — live leaderboard */}
          <div className="space-y-4">
            <div className="bg-[#0f2133] rounded-xl border border-[#1e3a55] overflow-hidden sticky top-28">
              <div className="px-4 py-3 border-b border-[#1e3a55] flex items-center justify-between">
                <h2 className="font-semibold text-white text-sm flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  Live Standings
                </h2>
                {leaderboard.length === 0 && (
                  <span className="text-xs text-slate-500">No scores yet</span>
                )}
              </div>
              {leaderboard.length > 0 ? (
                <div className="divide-y divide-[#1e3a55]">
                  {leaderboard.map((entry, idx) => (
                    <div key={entry.owner_name} className="px-4 py-2.5 flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-400 w-5 shrink-0">
                        {idx === 0 ? '🥇' : idx + 1}
                      </span>
                      <span className="text-sm text-white flex-1 truncate">{entry.owner_name}</span>
                      <span className="text-sm font-bold text-yellow-400 shrink-0">
                        {entry.total_score.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-6 text-center text-slate-500 text-xs">
                  <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                  Mark correct answers above, then hit<br />
                  <strong className="text-slate-400">Recalculate Scores</strong>
                </div>
              )}
              {leaderboard[0]?.scored_at && (
                <div className="px-4 py-2 border-t border-[#1e3a55] text-xs text-slate-500">
                  Last scored: {new Date(leaderboard[0].scored_at).toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
