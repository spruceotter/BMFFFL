import Head from 'next/head';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/cn';

// ─── Config ────────────────────────────────────────────────────────────────────

const CONVEX_SITE_URL = 'https://graceful-grasshopper-238.convex.site';
const YEAR = '2026';

// ─── BMFFFL Owners ────────────────────────────────────────────────────────────

const OWNERS = [
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
  'Escuelas',
];

// ─── Question Data (matches Convex seed) ──────────────────────────────────────

interface Option {
  id: string;
  label: string;
  points: number;
}

interface Question {
  question_id: string;
  section: string;
  question_text: string;
  options: Option[];
  order: number;
}

const SECTIONS: Record<string, { label: string; emoji: string }> = {
  moments:    { label: 'The Moment — Vibes & Viral', emoji: '🎬' },
  top_picks:  { label: 'Top Picks',                  emoji: '🏈' },
  over_under: { label: 'Player O/U Lines',            emoji: '📊' },
  counts:     { label: 'Category Counts',             emoji: '🔢' },
  teams:      { label: 'Team Moves',                  emoji: '🏟️' },
  bmfffl:     { label: 'BMFFFL Inside',              emoji: '💰' },
};

const QUESTIONS: Question[] = [
  // Section 1: Moments
  {
    question_id: 'q01', section: 'moments', order: 1,
    question_text: 'Who does Fernando Mendoza (expected #1 pick) hug FIRST after being drafted?',
    options: [
      { id: 'A', label: 'Mom', points: 200 },
      { id: 'B', label: 'Dad', points: 300 },
      { id: 'C', label: 'Girlfriend/partner', points: 300 },
      { id: 'D', label: 'Agent/coach', points: 500 },
    ],
  },
  {
    question_id: 'q02', section: 'moments', order: 2,
    question_text: 'What is Mendoza wearing on his head when he walks up to the podium?',
    options: [
      { id: 'A', label: 'Raiders hat (puts it on immediately)', points: 200 },
      { id: 'B', label: 'No hat / bare-headed', points: 300 },
      { id: 'C', label: 'His own fitted hat he brought', points: 400 },
    ],
  },
  {
    question_id: 'q03', section: 'moments', order: 3,
    question_text: 'After pick 1 is on the clock — which highlight plays FIRST on ESPN?',
    options: [
      { id: 'A', label: "Mendoza's Heisman acceptance speech", points: 300 },
      { id: 'B', label: "Mendoza's national championship highlights", points: 400 },
      { id: 'C', label: "Mendoza's college touchdown reel", points: 300 },
      { id: 'D', label: 'A player NOT named Mendoza', points: 500 },
    ],
  },
  // Section 2: Top Picks
  {
    question_id: 'q04', section: 'top_picks', order: 4,
    question_text: 'Who is the #2 overall pick? (Jets pick)',
    options: [
      { id: 'A', label: 'Defensive player (edge/LB/CB)', points: 250 },
      { id: 'B', label: 'WR or TE', points: 300 },
      { id: 'C', label: 'OL', points: 350 },
      { id: 'D', label: 'QB', points: 400 },
    ],
  },
  {
    question_id: 'q05', section: 'top_picks', order: 5,
    question_text: 'Who is the #3 overall pick? (Cardinals pick)',
    options: [
      { id: 'A', label: 'Defensive player', points: 250 },
      { id: 'B', label: 'WR', points: 300 },
      { id: 'C', label: 'OL', points: 350 },
      { id: 'D', label: 'QB', points: 400 },
    ],
  },
  {
    question_id: 'q06', section: 'top_picks', order: 6,
    question_text: 'Will a trade occur for picks 2 through 6?',
    options: [
      { id: 'A', label: 'Yes — at least one of picks 2-6 is traded', points: 300 },
      { id: 'B', label: 'No trades in picks 2-6', points: 200 },
    ],
  },
  {
    question_id: 'q07', section: 'top_picks', order: 7,
    question_text: 'What is the first non-QB position drafted?',
    options: [
      { id: 'A', label: 'WR', points: 250 },
      { id: 'B', label: 'Edge Rusher', points: 250 },
      { id: 'C', label: 'Linebacker', points: 300 },
      { id: 'D', label: 'Cornerback', points: 350 },
      { id: 'E', label: 'OL', points: 400 },
      { id: 'F', label: 'TE', points: 500 },
    ],
  },
  // Section 3: O/U
  {
    question_id: 'q08', section: 'over_under', order: 8,
    question_text: 'O/U Arvell Reese (LB, Alabama) pick number: 8.5',
    options: [
      { id: 'A', label: 'Over — picked 9th or later', points: 250 },
      { id: 'B', label: 'Under — picked 8th or earlier', points: 300 },
    ],
  },
  {
    question_id: 'q09', section: 'over_under', order: 9,
    question_text: 'O/U Jeremiyah Love (RB, Notre Dame) pick number: 16.5',
    options: [
      { id: 'A', label: 'Over — picked 17th or later', points: 250 },
      { id: 'B', label: 'Under — picked 16th or earlier', points: 300 },
    ],
  },
  {
    question_id: 'q10', section: 'over_under', order: 10,
    question_text: 'O/U Tetairoa McMillan (WR, Arizona) pick number: 12.5',
    options: [
      { id: 'A', label: 'Over — picked 13th or later', points: 250 },
      { id: 'B', label: 'Under — picked 12th or earlier', points: 300 },
    ],
  },
  {
    question_id: 'q11', section: 'over_under', order: 11,
    question_text: 'O/U Ty Simpson (QB, Alabama) pick number: 38.5',
    options: [
      { id: 'A', label: 'Over — 2nd round or later (pick 33+)', points: 250 },
      { id: 'B', label: 'Under — 1st round (top 32)', points: 300 },
    ],
  },
  // Section 4: Counts
  {
    question_id: 'q12', section: 'counts', order: 12,
    question_text: 'How many QBs are drafted in Round 1?',
    options: [
      { id: 'A', label: '1', points: 200 },
      { id: 'B', label: '2', points: 300 },
      { id: 'C', label: '3 or more', points: 500 },
      { id: 'D', label: '0', points: 600 },
    ],
  },
  {
    question_id: 'q13', section: 'counts', order: 13,
    question_text: 'How many WRs are drafted in Round 1?',
    options: [
      { id: 'A', label: '4 or fewer', points: 300 },
      { id: 'B', label: '5', points: 400 },
      { id: 'C', label: '6', points: 400 },
      { id: 'D', label: '7 or more', points: 350 },
    ],
  },
  {
    question_id: 'q14', section: 'counts', order: 14,
    question_text: 'How many defensive players in the top 10?',
    options: [
      { id: 'A', label: '0', points: 500 },
      { id: 'B', label: '1', points: 300 },
      { id: 'C', label: '2', points: 300 },
      { id: 'D', label: '3', points: 350 },
      { id: 'E', label: '4 or more', points: 400 },
    ],
  },
  // Section 5: Teams
  {
    question_id: 'q15', section: 'teams', order: 15,
    question_text: 'What position does the Raiders select with their SECOND pick?',
    options: [
      { id: 'A', label: 'WR', points: 250 },
      { id: 'B', label: 'OL', points: 250 },
      { id: 'C', label: 'Defensive player', points: 300 },
      { id: 'D', label: 'RB', points: 350 },
      { id: 'E', label: 'TE', points: 400 },
    ],
  },
  {
    question_id: 'q16', section: 'teams', order: 16,
    question_text: 'Will any team trade up into the top 5?',
    options: [
      { id: 'A', label: 'Yes', points: 350 },
      { id: 'B', label: 'No', points: 200 },
    ],
  },
  {
    question_id: 'q17', section: 'teams', order: 17,
    question_text: 'Which team drafts the first Running Back?',
    options: [
      { id: 'A', label: 'Chiefs', points: 300 },
      { id: 'B', label: 'Eagles', points: 350 },
      { id: 'C', label: 'Cowboys', points: 300 },
      { id: 'D', label: 'Bengals', points: 350 },
      { id: 'E', label: 'Other team', points: 250 },
    ],
  },
  // Section 6: BMFFFL
  {
    question_id: 'q18', section: 'bmfffl', order: 18,
    question_text: 'How many BMFFFL trades accepted from pick 1 on clock until pick 32?',
    options: [
      { id: 'A', label: '0', points: 200 },
      { id: 'B', label: '1', points: 250 },
      { id: 'C', label: '2', points: 300 },
      { id: 'D', label: '3', points: 350 },
      { id: 'E', label: '4 or more', points: 400 },
    ],
  },
  {
    question_id: 'q19', section: 'bmfffl', order: 19,
    question_text: 'Will anyone in the BMFFFL trade away a 2026 first-round pick during the NFL Draft?',
    options: [
      { id: 'A', label: 'Yes', points: 500 },
      { id: 'B', label: 'No', points: 200 },
    ],
  },
  {
    question_id: 'q20', section: 'bmfffl', order: 20,
    question_text: 'TIEBREAKER: What pick number is Fernando Mendoza selected at?',
    options: [
      { id: 'A', label: '1st overall (exactly)', points: 1000 },
      { id: 'B', label: 'Top 3 (not #1)', points: 500 },
      { id: 'C', label: 'Top 10 (not top 3)', points: 400 },
    ],
  },
];

// Group questions by section, preserving section order
const SECTION_ORDER = ['moments', 'top_picks', 'over_under', 'counts', 'teams', 'bmfffl'];

function getQuestionsBySection(): Array<{ section: string; questions: Question[] }> {
  const map = new Map<string, Question[]>();
  for (const q of QUESTIONS) {
    if (!map.has(q.section)) map.set(q.section, []);
    map.get(q.section)!.push(q);
  }
  return SECTION_ORDER
    .filter((s) => map.has(s))
    .map((s) => ({ section: s, questions: map.get(s)! }));
}

// ─── Answered count helper ────────────────────────────────────────────────────

function countAnswered(answers: Record<string, string>): number {
  return Object.keys(answers).length;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export default function DraftGame2026Page() {
  const [ownerName, setOwnerName]   = useState('');
  const [answers, setAnswers]       = useState<Record<string, string>>({});
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMsg, setErrorMsg]     = useState('');
  const [savedOwner, setSavedOwner] = useState('');

  const sections = getQuestionsBySection();
  const answered = countAnswered(answers);
  const total    = QUESTIONS.length;
  const allAnswered = answered === total && ownerName.trim().length > 0;

  // Persist owner selection across reload (convenience)
  useEffect(() => {
    const stored = localStorage.getItem('bmfffl-draft-game-owner');
    if (stored) setOwnerName(stored);
  }, []);

  function handleOwnerChange(name: string) {
    setOwnerName(name);
    if (name) localStorage.setItem('bmfffl-draft-game-owner', name);
  }

  function handleSelect(questionId: string, optionId: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }

  async function handleSubmit() {
    if (!allAnswered) return;
    setSubmitState('submitting');
    setErrorMsg('');

    try {
      const res = await fetch(`${CONVEX_SITE_URL}/submitDraftGameEntry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: YEAR,
          owner_name: ownerName,
          answers,
        }),
      });
      const data = await res.json() as { success?: boolean; error?: string; message?: string };
      if (!res.ok || data.error) {
        setErrorMsg(data.error ?? 'Submission failed. Try again.');
        setSubmitState('error');
      } else {
        setSavedOwner(ownerName);
        setSubmitState('success');
      }
    } catch {
      setErrorMsg('Network error. Check your connection and try again.');
      setSubmitState('error');
    }
  }

  if (submitState === 'success') {
    return (
      <>
        <Head>
          <title>2026 Draft Game — BMFFFL</title>
        </Head>
        <div className="min-h-screen bg-[#0d1b2a] flex items-center justify-center px-4">
          <div className="max-w-lg text-center">
            <div className="text-6xl mb-6">🏆</div>
            <h1 className="text-3xl font-black text-white mb-3">Entry Locked In!</h1>
            <p className="text-slate-400 mb-2">
              <span className="text-[#ffd700] font-bold">{savedOwner}</span> — your picks are in Convex.
            </p>
            <p className="text-slate-500 text-sm mb-8">
              Bimflé will score all entries after the draft on April 24. Good luck.
            </p>
            <div className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-5 text-left mb-6">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-3">Your {total} picks</p>
              {QUESTIONS.map((q) => {
                const chosen = answers[q.question_id];
                const opt = q.options.find((o) => o.id === chosen);
                return (
                  <div key={q.question_id} className="flex items-start gap-2 mb-2">
                    <span className="text-xs text-[#ffd700] font-mono mt-0.5">{q.question_id.toUpperCase()}</span>
                    <div>
                      <p className="text-xs text-slate-400 leading-snug">{q.question_text}</p>
                      <p className="text-xs text-white font-bold">{opt?.label} <span className="text-[#ffd700]">(+{opt?.points})</span></p>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => { setSubmitState('idle'); }}
              className="text-sm text-slate-400 hover:text-slate-200 underline"
            >
              Edit picks (re-submit to update)
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>2026 Draft Game — BMFFFL</title>
        <meta name="description" content="BMFFFL NFL Draft prediction game — pick your answers before the 2026 NFL Draft." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-[#0d1b2a]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

          {/* ── Header ──────────────────────────────────────────────────────── */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700] animate-pulse" />
              2026 NFL Draft — April 24
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-2">
              Draft Game 2026
            </h1>
            <p className="text-slate-400 text-sm">
              20 questions. Lock in your picks before the draft. Bimflé scores everything after.
              Highest total points wins.
            </p>
          </div>

          {/* ── Owner picker ─────────────────────────────────────────────────── */}
          <div className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-5 mb-8">
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
              Who are you?
            </label>
            <select
              value={ownerName}
              onChange={(e) => handleOwnerChange(e.target.value)}
              className="w-full bg-[#0d1b2a] border border-[#2d4a66] text-white rounded-lg px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-[#ffd700] transition-colors"
            >
              <option value="">Select your team...</option>
              {OWNERS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          {/* ── Progress bar ─────────────────────────────────────────────────── */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-400">
                {answered} / {total} answered
              </span>
              <span className={cn('text-xs font-bold', answered === total ? 'text-[#ffd700]' : 'text-slate-500')}>
                {answered === total ? 'All answered — ready to submit!' : `${total - answered} remaining`}
              </span>
            </div>
            <div className="h-1.5 bg-[#16213e] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#ffd700] rounded-full transition-all duration-300"
                style={{ width: `${(answered / total) * 100}%` }}
              />
            </div>
          </div>

          {/* ── Sections ─────────────────────────────────────────────────────── */}
          {sections.map(({ section, questions }) => {
            const meta = SECTIONS[section] ?? { label: section, emoji: '❓' };
            return (
              <section key={section} className="mb-10">
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-xl">{meta.emoji}</span>
                  <h2 className="text-lg font-black text-white">{meta.label}</h2>
                  <div className="flex-1 h-px bg-[#2d4a66] ml-2" />
                </div>

                <div className="space-y-6">
                  {questions.map((q) => {
                    const chosen = answers[q.question_id];
                    return (
                      <div
                        key={q.question_id}
                        className={cn(
                          'bg-[#16213e] border rounded-xl p-5 transition-colors duration-150',
                          chosen ? 'border-[#ffd700]/40' : 'border-[#2d4a66]'
                        )}
                      >
                        {/* Question header */}
                        <div className="flex items-start gap-3 mb-4">
                          <span className="text-xs text-[#ffd700] font-mono font-bold mt-0.5 shrink-0">
                            {q.question_id.toUpperCase()}
                          </span>
                          <p className="text-white font-bold text-sm leading-snug">
                            {q.question_text}
                          </p>
                        </div>

                        {/* Options */}
                        <div className="space-y-2">
                          {q.options.map((opt) => {
                            const isSelected = chosen === opt.id;
                            return (
                              <button
                                key={opt.id}
                                onClick={() => handleSelect(q.question_id, opt.id)}
                                className={cn(
                                  'w-full flex items-center justify-between px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-150 text-left',
                                  isSelected
                                    ? 'bg-[#ffd700]/10 border-[#ffd700] text-white'
                                    : 'bg-[#0d1b2a] border-[#2d4a66] text-slate-300 hover:border-slate-400 hover:text-white'
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <span className={cn(
                                    'w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold shrink-0',
                                    isSelected ? 'border-[#ffd700] text-[#ffd700]' : 'border-slate-600 text-slate-500'
                                  )}>
                                    {opt.id}
                                  </span>
                                  <span>{opt.label}</span>
                                </div>
                                <span className={cn(
                                  'text-xs font-black shrink-0',
                                  isSelected ? 'text-[#ffd700]' : 'text-slate-500'
                                )}>
                                  +{opt.points}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {/* ── Submit ───────────────────────────────────────────────────────── */}
          <div className="sticky bottom-6">
            <div className="bg-[#0d1b2a]/90 backdrop-blur rounded-2xl border border-[#2d4a66] p-5">
              {!allAnswered && (
                <p className="text-xs text-slate-500 text-center mb-3">
                  {!ownerName ? 'Select your team above to continue.' : `Answer all ${total - answered} remaining questions to submit.`}
                </p>
              )}
              <button
                onClick={handleSubmit}
                disabled={!allAnswered || submitState === 'submitting'}
                className={cn(
                  'w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-200',
                  allAnswered && submitState !== 'submitting'
                    ? 'bg-[#ffd700] text-[#0d1b2a] hover:bg-[#ffed4a] shadow-lg shadow-[#ffd700]/20'
                    : 'bg-[#16213e] text-slate-600 cursor-not-allowed'
                )}
              >
                {submitState === 'submitting' ? 'Submitting...' : 'Lock In My Picks'}
              </button>
              {submitState === 'error' && (
                <p className="text-[#e94560] text-xs text-center mt-2">{errorMsg}</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
