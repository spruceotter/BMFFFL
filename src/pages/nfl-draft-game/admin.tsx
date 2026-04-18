/**
 * Draft Game 2026 — Admin Scoring Panel
 * /nfl-draft-game/admin
 *
 * For Bimflé on draft night. Secret-protected.
 * Loads all questions, lets admin click correct answer per question.
 * Triggers rescore after each answer.
 */

import { useEffect, useState, useCallback, type ReactElement } from 'react';
import Head from 'next/head';

const CONVEX_SITE = 'https://resolute-setter-416.convex.site';
const YEAR = '2026';
const SECRET_KEY = 'bmfffl-admin-secret-2026';

interface QuestionOption {
  id: string;
  label: string;
  points: number;
}

interface AdminQuestion {
  question_id: string;
  question_text: string;
  section: string;
  order: number;
  question_type: string;
  correct_option_id?: string;
  options: QuestionOption[];
}

// ─── Secret Gate ─────────────────────────────────────────────────────────────

function SecretGate({ onUnlock }: { onUnlock: (s: string) => void }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) { setError('Enter the admin secret.'); return; }
    onUnlock(input.trim());
  }

  return (
    <div className="min-h-screen bg-[#0d1b2a] flex items-center justify-center px-4">
      <div className="bg-[#0f2133] rounded-2xl border border-[#1e3a55] p-8 w-full max-w-sm">
        <h1 className="text-xl font-black text-white mb-1">🔐 Admin Access</h1>
        <p className="text-slate-400 text-sm mb-6">BMFFFL Draft Game 2026 — Scoring Panel</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Admin secret"
            className="w-full bg-[#0d1b2a] border border-[#1e3a55] rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#ffd700]/50"
            autoFocus
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#ffd700] text-[#0d1b2a] font-black py-3 rounded-lg hover:bg-yellow-300 transition-colors"
          >
            Unlock →
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ name }: { name: string }) {
  return (
    <div className="sticky top-[60px] z-10 bg-[#0d1b2a] py-2 mb-3">
      <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{name}</h2>
    </div>
  );
}

// ─── Question Card ────────────────────────────────────────────────────────────

interface QuestionCardProps {
  q: AdminQuestion;
  secret: string;
  onScored: () => void;
}

function QuestionCard({ q, secret, onScored }: QuestionCardProps) {
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  async function markCorrect(optionId: string) {
    if (saving) return;
    setSaving(true);
    setSaveError('');
    try {
      const resp = await fetch(`${CONVEX_SITE}/adminSetAnswer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year: YEAR, question_id: q.question_id, correct_option_id: optionId, secret }),
      });
      if (!resp.ok) {
        const err = await resp.json() as { error: string };
        setSaveError(err.error ?? 'Save failed');
        return;
      }
      onScored();
    } catch (e) {
      setSaveError(String(e));
    } finally {
      setSaving(false);
    }
  }

  const isAnswered = !!q.correct_option_id;

  return (
    <div className={`rounded-xl border p-4 mb-3 transition-colors ${
      isAnswered ? 'bg-[#0a1f0a] border-green-900/50' : 'bg-[#0f2133] border-[#1e3a55]'
    }`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <span className="text-xs font-mono text-slate-600 mr-2">{q.question_id}</span>
          <span className="text-sm font-semibold text-white leading-snug">{q.question_text}</span>
        </div>
        {isAnswered && (
          <span className="shrink-0 text-green-400 text-xs font-bold bg-green-900/30 px-2 py-0.5 rounded-full">✓ scored</span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-1.5">
        {q.options.map((opt) => {
          const isCorrect = q.correct_option_id === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => markCorrect(opt.id)}
              disabled={saving}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                isCorrect
                  ? 'bg-green-600 text-white font-bold'
                  : 'bg-[#1a2f45] text-slate-300 hover:bg-[#243d57] hover:text-white'
              } ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span>{opt.label}</span>
              <span className={`text-xs tabular-nums font-mono ${isCorrect ? 'text-green-200' : 'text-slate-600'}`}>
                {opt.points > 0 ? `+${opt.points}` : opt.points}
              </span>
            </button>
          );
        })}
      </div>

      {saveError && (
        <p className="text-red-400 text-xs mt-2">{saveError}</p>
      )}
    </div>
  );
}

// ─── Main Admin Panel ─────────────────────────────────────────────────────────

function AdminPanel({ secret }: { secret: string }) {
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [scoreResult, setScoreResult] = useState<string>('');
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const fetchQuestions = useCallback(async () => {
    try {
      const resp = await fetch(
        `${CONVEX_SITE}/getDraftGameQuestions?year=${YEAR}&secret=${encodeURIComponent(secret)}`
      );
      if (resp.status === 401) { setAuthError(true); return; }
      const data = await resp.json() as AdminQuestion[];
      setQuestions(data.sort((a, b) => a.order - b.order));
      setLastFetched(new Date());
    } catch (e) {
      console.error('Fetch questions error:', e);
    } finally {
      setLoading(false);
    }
  }, [secret]);

  useEffect(() => { void fetchQuestions(); }, [fetchQuestions]);

  async function runScoring() {
    setScoring(true);
    setScoreResult('');
    try {
      const resp = await fetch(`${CONVEX_SITE}/adminScoreEntries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year: YEAR, secret }),
      });
      const data = await resp.json() as { success?: boolean; scored?: number; error?: string };
      if (data.success) {
        setScoreResult(`✓ Scored ${data.scored} entries`);
      } else {
        setScoreResult(`Error: ${data.error ?? 'unknown'}`);
      }
    } catch (e) {
      setScoreResult(`Error: ${String(e)}`);
    } finally {
      setScoring(false);
    }
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-[#0d1b2a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg font-bold mb-2">Wrong secret</p>
          <button
            onClick={() => { localStorage.removeItem(SECRET_KEY); window.location.reload(); }}
            className="text-slate-500 text-sm underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1b2a] flex items-center justify-center">
        <p className="text-slate-500 text-sm">Loading questions…</p>
      </div>
    );
  }

  const answeredCount = questions.filter((q) => q.correct_option_id).length;
  const sectionSet: Record<string, true> = {};
  for (const q of questions) sectionSet[q.section] = true;
  const sections = Object.keys(sectionSet);

  return (
    <div className="min-h-screen bg-[#0d1b2a] text-white font-sans">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-[#0d1b2a] border-b border-[#1e3a55] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <span className="font-black text-white text-sm">Draft Game Admin</span>
            <span className="text-slate-600 text-xs ml-2">2026</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">
              <span className="text-green-400 font-bold">{answeredCount}</span>
              <span> / {questions.length} scored</span>
            </span>
            <button
              onClick={() => void runScoring()}
              disabled={scoring}
              className="bg-[#ffd700] text-[#0d1b2a] font-black text-xs px-3 py-1.5 rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50"
            >
              {scoring ? 'Scoring…' : 'Rescore All'}
            </button>
          </div>
        </div>
        {scoreResult && (
          <div className="max-w-2xl mx-auto mt-1">
            <p className={`text-xs font-semibold ${scoreResult.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>
              {scoreResult}
            </p>
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Instructions */}
        <div className="bg-[#0f2133] rounded-xl border border-[#1e3a55] px-4 py-3 mb-6 text-xs text-slate-400 space-y-1">
          <p>Click the correct answer for each question as it becomes known during the draft.</p>
          <p>Hit <strong className="text-white">Rescore All</strong> after marking answers to update the live leaderboard.</p>
          <p>Leaderboard at <a href="/nfl-draft-game" className="text-[#ffd700] hover:underline" target="_blank">/nfl-draft-game</a> auto-refreshes every 30s.</p>
        </div>

        {/* Questions by section */}
        {sections.map((section) => (
          <div key={section}>
            <SectionHeader name={section} />
            {questions
              .filter((q) => q.section === section)
              .map((q) => (
                <QuestionCard
                  key={q.question_id}
                  q={q}
                  secret={secret}
                  onScored={() => {
                    void fetchQuestions();
                    void runScoring();
                  }}
                />
              ))}
          </div>
        ))}

        {/* Footer */}
        <div className="mt-8 text-center text-slate-700 text-xs">
          {lastFetched && `Last loaded ${lastFetched.toLocaleTimeString()}`}
          {' · '}
          <button onClick={() => void fetchQuestions()} className="hover:text-slate-500 underline">
            Refresh
          </button>
          {' · '}
          <button
            onClick={() => { localStorage.removeItem(SECRET_KEY); window.location.reload(); }}
            className="hover:text-slate-500 underline"
          >
            Lock
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [secret, setSecret] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(SECRET_KEY);
    if (stored) setSecret(stored);
  }, []);

  function handleUnlock(s: string) {
    localStorage.setItem(SECRET_KEY, s);
    setSecret(s);
  }

  if (!secret) return <SecretGate onUnlock={handleUnlock} />;
  return <AdminPanel secret={secret} />;
}

AdminPage.getLayout = (page: ReactElement) => page;
