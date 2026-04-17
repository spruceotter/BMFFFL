import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/cn';

// ─── Config ────────────────────────────────────────────────────────────────────

const CONVEX_SITE_URL = 'https://resolute-setter-416.convex.site';
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
  question_type?: 'multiple_choice' | 'open_response';
  options: Option[];
  order: number;
}

const SECTIONS: Record<string, { label: string; emoji: string }> = {
  moments:    { label: 'The Moment — Vibes & Viral', emoji: '🎬' },
  top_picks:  { label: 'Top Picks',                  emoji: '🏈' },
  over_under: { label: 'Player O/U Lines',            emoji: '📊' },
  counts:     { label: 'Category Counts',             emoji: '🔢' },
  teams:      { label: 'Team Moves',                  emoji: '🏟️' },
  trades:     { label: 'NFL Draft Trades',            emoji: '🔄' },
  bmfffl:     { label: 'BMFFFL Inside',              emoji: '💰' },
  tiebreaker: { label: 'Tiebreaker',                  emoji: '⏱️' },
};

const QUESTIONS: Question[] = [
  // Section 1: The Moment
  {
    question_id: 'q01', section: 'moments', order: 1,
    question_text: 'Who does Fernando Mendoza hug FIRST when picked #1 overall?',
    options: [
      { id: 'A', label: 'Mom', points: 200 },
      { id: 'B', label: 'Dad', points: 300 },
      { id: 'C', label: 'Girlfriend/Wife', points: 350 },
      { id: 'D', label: 'Agent', points: 700 },
      { id: 'E', label: 'Other', points: 500 },
    ],
  },
  {
    question_id: 'q02', section: 'moments', order: 2,
    question_text: 'After pick 1 is on the clock, which highlight does ESPN show FIRST?',
    options: [
      { id: 'A', label: 'Mendoza Heisman moment', points: 250 },
      { id: 'B', label: 'Mendoza national championship game', points: 300 },
      { id: 'C', label: 'Indiana Big Ten championship celebration', points: 400 },
      { id: 'D', label: 'Other Mendoza highlight', points: 400 },
      { id: 'E', label: 'None / cut to Raiders war room', points: 800 },
    ],
  },
  {
    question_id: 'q03', section: 'moments', order: 3,
    question_text: "Will Fernando Mendoza be wearing a hat when he walks to the commissioner's podium?",
    options: [
      { id: 'A', label: 'Yes (Raiders hat)', points: 250 },
      { id: 'B', label: 'No hat', points: 300 },
      { id: 'C', label: "Different team's hat or no NFL hat", points: 600 },
    ],
  },
  // Section 2: Specific Picks
  {
    question_id: 'q04', section: 'top_picks', order: 4,
    question_text: 'Who goes #2 overall?',
    options: [
      { id: 'A', label: 'David Bailey (DE, Texas Tech)', points: 250 },
      { id: 'B', label: 'Jeremiyah Love (RB, Notre Dame)', points: 700 },
      { id: 'C', label: 'Arvell Reese (LB, Ohio State)', points: 200 },
      { id: 'D', label: 'Caleb Downs (S, Ohio State)', points: 800 },
      { id: 'E', label: 'Other', points: 800 },
    ],
  },
  {
    question_id: 'q05', section: 'top_picks', order: 5,
    question_text: 'Who goes #3 overall?',
    options: [
      { id: 'A', label: 'Arvell Reese (LB, Ohio State)', points: 250 },
      { id: 'B', label: 'Jeremiyah Love (RB, Notre Dame)', points: 700 },
      { id: 'C', label: 'David Bailey (DE, Texas Tech)', points: 200 },
      { id: 'D', label: 'Caleb Downs (S, Ohio State)', points: 700 },
      { id: 'E', label: 'Other', points: 500 },
    ],
  },
  {
    question_id: 'q06', section: 'top_picks', order: 6,
    question_text: 'Will a Running Back be taken in the top 5?',
    options: [
      { id: 'A', label: 'Yes', points: 200 },
      { id: 'B', label: 'No', points: 350 },
    ],
  },
  {
    question_id: 'q07', section: 'top_picks', order: 7,
    question_text: 'Who drafts Jeremiyah Love (RB, Notre Dame)?',
    options: [
      { id: 'A', label: 'Tennessee Titans (pick 4)', points: 200 },
      { id: 'B', label: 'New York Giants (pick 5)', points: 500 },
      { id: 'C', label: 'New York Jets (picks 2 or 16)', points: 700 },
      { id: 'D', label: 'Arizona Cardinals (pick 3)', points: 500 },
      { id: 'E', label: 'Other', points: 500 },
    ],
  },
  {
    question_id: 'q08', section: 'top_picks', order: 8,
    question_text: 'Who drafts Kenyon Sadiq (TE, Oregon)?',
    options: [
      { id: 'A', label: 'New Orleans Saints (pick 8)', points: 300 },
      { id: 'B', label: 'Cincinnati Bengals (pick 10)', points: 350 },
      { id: 'C', label: 'Baltimore Ravens (pick 14)', points: 400 },
      { id: 'D', label: 'Other', points: 250 },
    ],
  },
  {
    question_id: 'q09', section: 'top_picks', order: 9,
    question_text: 'Who drafts Makai Lemon (WR, USC)?',
    options: [
      { id: 'A', label: 'LA Rams (pick 13)', points: 300 },
      { id: 'B', label: 'New York Jets (pick 16)', points: 400 },
      { id: 'C', label: 'Cleveland Browns (pick 6)', points: 500 },
      { id: 'D', label: 'Other', points: 200 },
    ],
  },
  {
    question_id: 'q10', section: 'top_picks', order: 10,
    question_text: 'Who drafts Sonny Styles (LB, Ohio State)?',
    options: [
      { id: 'A', label: 'Washington Commanders (pick 7)', points: 300 },
      { id: 'B', label: 'New York Giants (pick 5)', points: 350 },
      { id: 'C', label: 'Tampa Bay Buccaneers (pick 15)', points: 400 },
      { id: 'D', label: 'Other', points: 250 },
    ],
  },
  {
    question_id: 'q11', section: 'top_picks', order: 11,
    question_text: 'Will a TE be taken in the top 10?',
    options: [
      { id: 'A', label: 'Yes', points: 300 },
      { id: 'B', label: 'No', points: 200 },
    ],
  },
  // Section 3: Over / Unders
  {
    question_id: 'q12', section: 'over_under', order: 12,
    question_text: 'O/U Jeremiyah Love pick (4.5)',
    options: [
      { id: 'A', label: 'Under / at pick 4 or earlier', points: 200 },
      { id: 'B', label: 'Over / pick 5 or later', points: 300 },
    ],
  },
  {
    question_id: 'q13', section: 'over_under', order: 13,
    question_text: 'O/U Sonny Styles pick (9.5)',
    options: [
      { id: 'A', label: 'Under (picks 1–9)', points: 250 },
      { id: 'B', label: 'Over (picks 10+)', points: 250 },
    ],
  },
  {
    question_id: 'q14', section: 'over_under', order: 14,
    question_text: 'O/U Makai Lemon pick (14.5)',
    options: [
      { id: 'A', label: 'Under (picks 1–14)', points: 250 },
      { id: 'B', label: 'Over (picks 15+)', points: 300 },
    ],
  },
  {
    question_id: 'q15', section: 'over_under', order: 15,
    question_text: 'O/U Kenyon Sadiq pick (9.5)',
    options: [
      { id: 'A', label: 'Under (picks 1–9)', points: 300 },
      { id: 'B', label: 'Over (picks 10+)', points: 200 },
    ],
  },
  {
    question_id: 'q16', section: 'over_under', order: 16,
    question_text: 'O/U Rueben Bain Jr. pick (16.5)',
    options: [
      { id: 'A', label: 'Under (picks 1–16)', points: 250 },
      { id: 'B', label: 'Over (picks 17+)', points: 300 },
    ],
  },
  {
    question_id: 'q17', section: 'over_under', order: 17,
    question_text: 'O/U Ty Simpson (QB, Alabama) pick (26.5)',
    options: [
      { id: 'A', label: 'Under / drafted in Round 1 (picks 1–26)', points: 250 },
      { id: 'B', label: 'Over / picks 27–32 or not Round 1', points: 300 },
    ],
  },
  // Section 4: Positional Counts
  {
    question_id: 'q18', section: 'counts', order: 18,
    question_text: 'How many QBs will be taken in Round 1?',
    options: [
      { id: 'A', label: '1', points: 350 },
      { id: 'B', label: '2', points: 200 },
      { id: 'C', label: '3 or more', points: 700 },
    ],
  },
  {
    question_id: 'q19', section: 'counts', order: 19,
    question_text: 'How many WRs will be taken in Round 1?',
    options: [
      { id: 'A', label: '4 or fewer', points: 350 },
      { id: 'B', label: '5', points: 250 },
      { id: 'C', label: '6', points: 400 },
      { id: 'D', label: '7 or more', points: 600 },
    ],
  },
  {
    question_id: 'q20', section: 'counts', order: 20,
    question_text: 'How many RBs will be taken in Round 1?',
    options: [
      { id: 'A', label: '0', points: 500 },
      { id: 'B', label: '1', points: 150 },
      { id: 'C', label: '2', points: 650 },
      { id: 'D', label: '3 or more', points: 1200 },
    ],
  },
  {
    question_id: 'q21', section: 'counts', order: 21,
    question_text: 'How many Edge Rushers / DEs will be taken in Round 1?',
    options: [
      { id: 'A', label: '2 or fewer', points: 400 },
      { id: 'B', label: '3', points: 300 },
      { id: 'C', label: '4', points: 300 },
      { id: 'D', label: '5 or more', points: 400 },
    ],
  },
  {
    question_id: 'q22', section: 'counts', order: 22,
    question_text: 'How many LBs will be taken in Round 1?',
    options: [
      { id: 'A', label: '0 or 1', points: 500 },
      { id: 'B', label: '2', points: 200 },
      { id: 'C', label: '3', points: 350 },
      { id: 'D', label: '4 or more', points: 700 },
    ],
  },
  {
    question_id: 'q23', section: 'counts', order: 23,
    question_text: 'How many players from Ohio State will be taken in Round 1?',
    options: [
      { id: 'A', label: '1', points: 1000 },
      { id: 'B', label: '2', points: 350 },
      { id: 'C', label: '3', points: 200 },
      { id: 'D', label: '4 or more', points: 500 },
    ],
  },
  // Section 5: Team Decisions
  {
    question_id: 'q24', section: 'teams', order: 24,
    question_text: 'What position will the New York Jets select at pick 2?',
    options: [
      { id: 'A', label: 'Edge Rusher / DE', points: 250 },
      { id: 'B', label: 'Linebacker', points: 200 },
      { id: 'C', label: 'Running Back', points: 700 },
      { id: 'D', label: 'Offensive Lineman', points: 900 },
      { id: 'E', label: 'Other', points: 800 },
    ],
  },
  {
    question_id: 'q25', section: 'teams', order: 25,
    question_text: 'Will the New York Jets select a QB in Round 1 (either pick)?',
    options: [
      { id: 'A', label: 'Yes', points: 500 },
      { id: 'B', label: 'No', points: 150 },
    ],
  },
  {
    question_id: 'q26', section: 'teams', order: 26,
    question_text: 'What position will Cleveland Browns (pick 6) select?',
    options: [
      { id: 'A', label: 'Wide Receiver', points: 250 },
      { id: 'B', label: 'Edge Rusher / DE', points: 350 },
      { id: 'C', label: 'Defensive Back', points: 500 },
      { id: 'D', label: 'Other', points: 400 },
    ],
  },
  {
    question_id: 'q27', section: 'teams', order: 27,
    question_text: 'What position will Kansas City Chiefs (pick 9) select?',
    options: [
      { id: 'A', label: 'Edge Rusher / DE', points: 300 },
      { id: 'B', label: 'Offensive Lineman', points: 300 },
      { id: 'C', label: 'Wide Receiver', points: 400 },
      { id: 'D', label: 'Other', points: 450 },
    ],
  },
  {
    question_id: 'q28', section: 'teams', order: 28,
    question_text: 'Will Jim Harbaugh (Chargers) draft an Indiana player in Round 1?',
    options: [
      { id: 'A', label: 'Yes', points: 500 },
      { id: 'B', label: 'No', points: 150 },
    ],
  },
  // Section 6: NFL Draft Trades
  {
    question_id: 'q29', section: 'trades', order: 29,
    question_text: 'How many trades will occur in Round 1 of the NFL Draft (picks 1–32)?',
    options: [
      { id: 'A', label: '3 or fewer', points: 600 },
      { id: 'B', label: '4', points: 600 },
      { id: 'C', label: '5', points: 450 },
      { id: 'D', label: '6', points: 400 },
      { id: 'E', label: '7', points: 400 },
      { id: 'F', label: '8 or more', points: 350 },
    ],
  },
  {
    question_id: 'q30', section: 'trades', order: 30,
    question_text: 'Who will be the first NFL player TRADED during the 2026 Draft?',
    options: [
      { id: 'A', label: 'No NFL player traded during Round 1', points: 250 },
      { id: 'B', label: 'A Wide Receiver', points: 350 },
      { id: 'C', label: 'A Quarterback', points: 400 },
      { id: 'D', label: 'Other', points: 450 },
    ],
  },
  {
    question_id: 'q31', section: 'trades', order: 31,
    question_text: 'Will any of picks 2–6 be traded away during Round 1?',
    options: [
      { id: 'A', label: 'Yes', points: 350 },
      { id: 'B', label: 'No', points: 200 },
    ],
  },
  {
    question_id: 'q32', section: 'trades', order: 32,
    question_text: 'Will there be an NFL trade AFTER pick 20 is selected in Round 1?',
    options: [
      { id: 'A', label: 'Yes', points: 200 },
      { id: 'B', label: 'No', points: 300 },
    ],
  },
  // Section 7: BMFFFL Inside
  {
    question_id: 'q33', section: 'bmfffl', order: 33,
    question_text: 'How many trades will be accepted in the BMFFFL from pick 1 through pick 32?',
    options: [
      { id: 'A', label: '0', points: 300 },
      { id: 'B', label: '1', points: 250 },
      { id: 'C', label: '2', points: 350 },
      { id: 'D', label: '3', points: 500 },
      { id: 'E', label: '4 or more', points: 650 },
    ],
  },
  {
    question_id: 'q34', section: 'bmfffl', order: 34,
    question_text: 'Will anyone in the BMFFFL trade away a 2026 BMFFFL first round pick during the NFL Draft?',
    options: [
      { id: 'A', label: 'Yes', points: 500 },
      { id: 'B', label: 'No', points: 150 },
    ],
  },
  // Tiebreaker
  {
    question_id: 'q35', section: 'tiebreaker', order: 35,
    question_type: 'open_response',
    question_text: 'What is the exact time that David Bailey is selected? (Draft begins 8:00pm ET, Thursday April 23)',
    options: [],
  },
];

// Group questions by section, preserving section order
const SECTION_ORDER = ['moments', 'top_picks', 'over_under', 'counts', 'teams', 'trades', 'bmfffl', 'tiebreaker'];

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
type LoadState  = 'idle' | 'loading' | 'loaded' | 'none';

export default function DraftGame2026Page() {
  const [ownerName, setOwnerName]   = useState('');
  const [answers, setAnswers]       = useState<Record<string, string>>({});
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMsg, setErrorMsg]     = useState('');
  const [savedOwner, setSavedOwner] = useState('');
  const [loadState, setLoadState]   = useState<LoadState>('idle');
  const [existingSubmittedAt, setExistingSubmittedAt] = useState<string | null>(null);

  const sections = getQuestionsBySection();
  const answered = countAnswered(answers);
  const total    = QUESTIONS.length;
  const allAnswered = answered === total && ownerName.trim().length > 0;
  const isEditing = loadState === 'loaded' && existingSubmittedAt !== null;

  // Fetch existing entry for owner (if any) and pre-populate answers
  async function fetchExistingEntry(name: string) {
    if (!name) return;
    setLoadState('loading');
    try {
      const res = await fetch(
        `${CONVEX_SITE_URL}/getMyDraftGameEntry?year=${YEAR}&owner_name=${encodeURIComponent(name)}`
      );
      const data = await res.json() as { answers?: Record<string, string>; submitted_at?: string } | null;
      if (data && data.answers && data.submitted_at) {
        setAnswers(data.answers);
        setExistingSubmittedAt(data.submitted_at);
        setLoadState('loaded');
      } else {
        setAnswers({});
        setExistingSubmittedAt(null);
        setLoadState('none');
      }
    } catch {
      setLoadState('none');
    }
  }

  // Persist owner selection across reload (convenience)
  useEffect(() => {
    const stored = localStorage.getItem('bmfffl-draft-game-owner');
    if (stored) {
      setOwnerName(stored);
      fetchExistingEntry(stored);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleOwnerChange(name: string) {
    setOwnerName(name);
    setAnswers({});
    setExistingSubmittedAt(null);
    setLoadState('idle');
    if (name) {
      localStorage.setItem('bmfffl-draft-game-owner', name);
      fetchExistingEntry(name);
    }
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
              Bimflé will score all entries after the draft on April 23. Good luck.
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
                      {q.question_type === 'open_response' ? (
                        <p className="text-xs text-white font-bold">{chosen}</p>
                      ) : (
                        <p className="text-xs text-white font-bold">{opt?.label} <span className="text-[#ffd700]">(+{opt?.points})</span></p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col items-center gap-3">
              <Link
                href="/nfl-draft/draft-game-leaderboard-2026"
                className="inline-block bg-[#ffd700]/10 border border-[#ffd700]/40 hover:border-[#ffd700] text-[#ffd700] font-bold px-5 py-2 rounded-lg transition-colors text-sm"
              >
                See who else has submitted →
              </Link>
              <button
                onClick={() => { setSubmitState('idle'); }}
                className="text-sm text-slate-400 hover:text-slate-200 underline"
              >
                Edit picks (re-submit to update)
              </button>
            </div>
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
              2026 NFL Draft — April 23
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-2">
              Draft Game 2026
            </h1>
            <p className="text-slate-400 text-sm">
              34 questions + tiebreaker. Lock in your picks before the draft. Bimflé scores everything after.
              Highest total points wins.
            </p>
            <div className="mt-3">
              <Link
                href="/nfl-draft/draft-game-leaderboard-2026"
                className="text-xs text-slate-500 hover:text-slate-300 underline"
              >
                See who&apos;s submitted →
              </Link>
            </div>
          </div>

          {/* ── Scoring Warning ──────────────────────────────────────────────── */}
          <div className="bg-amber-900/20 border border-amber-500/40 rounded-xl p-4 mb-8 flex items-start gap-3">
            <span className="text-amber-400 text-lg mt-0.5">⚠️</span>
            <div>
              <p className="text-amber-300 font-bold text-sm mb-1">Scoring: Wrong answers cost points</p>
              <p className="text-amber-200/70 text-xs leading-relaxed">
                Correct answer: <span className="text-white font-semibold">full points</span> ·
                Wrong answer: <span className="text-red-400 font-semibold">−100 points</span> ·
                Unanswered: <span className="text-slate-300 font-semibold">0 points</span> (no penalty for skipping).
                Only lock in answers you&apos;re confident about.
              </p>
            </div>
          </div>

          {/* ── Owner picker ─────────────────────────────────────────────────── */}
          <div className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-5 mb-4">
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

          {/* ── Existing picks banner ────────────────────────────────────────── */}
          {loadState === 'loading' && ownerName && (
            <div className="bg-[#16213e] border border-[#2d4a66] rounded-xl px-5 py-3 mb-8 text-slate-400 text-sm">
              Loading your picks…
            </div>
          )}
          {isEditing && (
            <div className="bg-green-900/20 border border-green-500/40 rounded-xl px-5 py-3 mb-8 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <p className="text-green-300 text-sm font-semibold">
                  Your picks are loaded. Make changes below and re-submit to update.
                </p>
              </div>
              <Link
                href="/nfl-draft/draft-game-leaderboard-2026"
                className="text-xs text-slate-400 hover:text-slate-200 whitespace-nowrap shrink-0"
              >
                Who&apos;s in →
              </Link>
            </div>
          )}

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
                        {q.question_type === 'open_response' ? (
                          <div>
                            <input
                              type="text"
                              placeholder="e.g. 8:47 PM ET"
                              value={chosen ?? ''}
                              onChange={(e) => handleSelect(q.question_id, e.target.value)}
                              className={cn(
                                'w-full bg-[#0d1b2a] border rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors',
                                chosen ? 'border-[#ffd700]/60' : 'border-[#2d4a66] focus:border-slate-400'
                              )}
                            />
                            <p className="text-xs text-slate-600 mt-1.5">Enter your best guess for the exact time (24-hour Eastern format or "8:47 PM ET").</p>
                          </div>
                        ) : (
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
                        )}
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
