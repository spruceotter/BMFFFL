/**
 * BMFFFL NFL Draft Game 2026 — Unified Page
 *
 * Single URL: /nfl-draft-game
 * Phase-aware: ENTRY → LIVE → FINAL
 *
 * ENTRY  (before April 23 8pm ET): Submission form
 *   - LANDING:   Countdown, who's in, [Enter Picks] CTA
 *   - QUIZ:      One question at a time, progress bar, back/next
 *   - CONFIRMED: Success state, pick review, countdown to draft
 *
 * LIVE   (during draft): Leaderboard tabs
 *   - Leaderboard | My Picks | Field Picks
 *   - Auto-refresh every 30s
 *
 * FINAL  (after Round 1): Full results, winner banner
 *
 * Redirects from old URLs handled in vercel.json.
 */

import Head from 'next/head';
import { useState, useEffect, useCallback, useRef, type ReactElement } from 'react';
import { cn } from '@/lib/cn';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// ─── Config ──────────────────────────────────────────────────────────────────

const CONVEX_SITE = 'https://resolute-setter-416.convex.site';
const YEAR = '2026';

// Draft schedule (ET)
const SUBMISSION_DEADLINE = new Date('2026-04-23T20:00:00-04:00'); // lock at kickoff
const DRAFT_END           = new Date('2026-04-24T01:00:00-04:00'); // ~end of Round 1

// ─── Phase detection ─────────────────────────────────────────────────────────

type Phase = 'ENTRY' | 'LIVE' | 'FINAL';

function usePhase(): Phase {
  const [phase, setPhase] = useState<Phase>(() => getPhase());
  useEffect(() => {
    const id = setInterval(() => setPhase(getPhase()), 10_000);
    return () => clearInterval(id);
  }, []);
  return phase;
}

function getPhase(): Phase {
  const now = Date.now();
  if (now < SUBMISSION_DEADLINE.getTime()) return 'ENTRY';
  if (now < DRAFT_END.getTime())           return 'LIVE';
  return 'FINAL';
}

// ─── Countdown ───────────────────────────────────────────────────────────────

type Countdown = { d: number; h: number; m: number; s: number } | null;

function useCountdown(target: Date): Countdown {
  const [diff, setDiff] = useState(() => target.getTime() - Date.now());
  useEffect(() => {
    const id = setInterval(() => setDiff(target.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  if (diff <= 0) return null;
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
}

// ─── Owners ──────────────────────────────────────────────────────────────────

const OWNERS = [
  'Grandes', 'SexMachineAndyD', 'tdtd19844', 'Cogdeill11',
  'rbr', 'MLSchools12', 'Cmaleski', 'eldridm20',
  'JuicyBussy', 'eldridsm', 'Tubes94', 'Escuelas',
];

const OWNER_COLORS: Record<string, string> = {
  'Grandes':         '#f59e0b',
  'SexMachineAndyD': '#3b82f6',
  'tdtd19844':       '#10b981',
  'Cogdeill11':      '#ef4444',
  'rbr':             '#8b5cf6',
  'MLSchools12':     '#f97316',
  'Cmaleski':        '#14b8a6',
  'eldridm20':       '#ec4899',
  'JuicyBussy':      '#6366f1',
  'eldridsm':        '#84cc16',
  'Tubes94':         '#06b6d4',
  'Escuelas':        '#d97706',
  'Bimflé':          '#ffd700',
};

// ─── Question data ────────────────────────────────────────────────────────────

interface Option   { id: string; label: string; points: number }
interface Question { question_id: string; section: string; question_text: string; question_type?: string; options: Option[]; order: number }

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
  { question_id: 'q01', section: 'moments', order: 1,
    question_text: 'Who does Fernando Mendoza hug FIRST when picked #1 overall?',
    options: [{ id: 'A', label: 'Mom', points: 200 },{ id: 'B', label: 'Dad', points: 300 },{ id: 'C', label: 'Girlfriend/Wife', points: 350 },{ id: 'D', label: 'Agent', points: 700 },{ id: 'E', label: 'Other', points: 500 }] },
  { question_id: 'q02', section: 'moments', order: 2,
    question_text: 'After pick 1 is on the clock, which highlight does ESPN show FIRST?',
    options: [{ id: 'A', label: 'Mendoza Heisman moment', points: 250 },{ id: 'B', label: 'Mendoza national championship game', points: 300 },{ id: 'C', label: 'Indiana Big Ten championship celebration', points: 400 },{ id: 'D', label: 'Other Mendoza highlight', points: 400 },{ id: 'E', label: 'None / cut to Raiders war room', points: 800 }] },
  { question_id: 'q03', section: 'moments', order: 3,
    question_text: "Will Fernando Mendoza be wearing a hat when he walks to the commissioner's podium?",
    options: [{ id: 'A', label: 'Yes (Raiders hat)', points: 250 },{ id: 'B', label: 'No hat', points: 300 },{ id: 'C', label: "Different team's hat or no NFL hat", points: 600 }] },
  { question_id: 'q04', section: 'top_picks', order: 4,
    question_text: 'Who goes #2 overall?',
    options: [{ id: 'A', label: 'David Bailey (DE, Texas Tech)', points: 250 },{ id: 'B', label: 'Jeremiyah Love (RB, Notre Dame)', points: 700 },{ id: 'C', label: 'Arvell Reese (LB, Ohio State)', points: 200 },{ id: 'D', label: 'Caleb Downs (S, Ohio State)', points: 800 },{ id: 'E', label: 'Other', points: 800 }] },
  { question_id: 'q05', section: 'top_picks', order: 5,
    question_text: 'Who goes #3 overall?',
    options: [{ id: 'A', label: 'Arvell Reese (LB, Ohio State)', points: 250 },{ id: 'B', label: 'Jeremiyah Love (RB, Notre Dame)', points: 700 },{ id: 'C', label: 'David Bailey (DE, Texas Tech)', points: 200 },{ id: 'D', label: 'Caleb Downs (S, Ohio State)', points: 700 },{ id: 'E', label: 'Other', points: 500 }] },
  { question_id: 'q06', section: 'top_picks', order: 6,
    question_text: 'Will a Running Back be taken in the top 5?',
    options: [{ id: 'A', label: 'Yes', points: 200 },{ id: 'B', label: 'No', points: 350 }] },
  { question_id: 'q07', section: 'top_picks', order: 7,
    question_text: 'Who drafts Jeremiyah Love (RB, Notre Dame)?',
    options: [{ id: 'A', label: 'Tennessee Titans (pick 4)', points: 200 },{ id: 'B', label: 'New York Giants (pick 5)', points: 500 },{ id: 'C', label: 'New York Jets (picks 2 or 16)', points: 700 },{ id: 'D', label: 'Arizona Cardinals (pick 3)', points: 500 },{ id: 'E', label: 'Other', points: 500 }] },
  { question_id: 'q08', section: 'top_picks', order: 8,
    question_text: 'Who drafts Kenyon Sadiq (TE, Oregon)?',
    options: [{ id: 'A', label: 'New Orleans Saints (pick 8)', points: 300 },{ id: 'B', label: 'Cincinnati Bengals (pick 10)', points: 350 },{ id: 'C', label: 'Baltimore Ravens (pick 14)', points: 400 },{ id: 'D', label: 'Other', points: 250 }] },
  { question_id: 'q09', section: 'top_picks', order: 9,
    question_text: 'Who drafts Makai Lemon (WR, USC)?',
    options: [{ id: 'A', label: 'LA Rams (pick 13)', points: 300 },{ id: 'B', label: 'New York Jets (pick 16)', points: 400 },{ id: 'C', label: 'Cleveland Browns (pick 6)', points: 500 },{ id: 'D', label: 'Other', points: 200 }] },
  { question_id: 'q10', section: 'top_picks', order: 10,
    question_text: 'Who drafts Sonny Styles (LB, Ohio State)?',
    options: [{ id: 'A', label: 'Washington Commanders (pick 7)', points: 300 },{ id: 'B', label: 'New York Giants (pick 5)', points: 350 },{ id: 'C', label: 'Tampa Bay Buccaneers (pick 15)', points: 400 },{ id: 'D', label: 'Other', points: 250 }] },
  { question_id: 'q11', section: 'top_picks', order: 11,
    question_text: 'Will a TE be taken in the top 10?',
    options: [{ id: 'A', label: 'Yes', points: 300 },{ id: 'B', label: 'No', points: 200 }] },
  { question_id: 'q12', section: 'over_under', order: 12,
    question_text: 'O/U Jeremiyah Love pick (4.5)',
    options: [{ id: 'A', label: 'Under / at pick 4 or earlier', points: 200 },{ id: 'B', label: 'Over / pick 5 or later', points: 300 }] },
  { question_id: 'q13', section: 'over_under', order: 13,
    question_text: 'O/U Sonny Styles pick (9.5)',
    options: [{ id: 'A', label: 'Under (picks 1–9)', points: 250 },{ id: 'B', label: 'Over (picks 10+)', points: 250 }] },
  { question_id: 'q14', section: 'over_under', order: 14,
    question_text: 'O/U Makai Lemon pick (14.5)',
    options: [{ id: 'A', label: 'Under (picks 1–14)', points: 250 },{ id: 'B', label: 'Over (picks 15+)', points: 300 }] },
  { question_id: 'q15', section: 'over_under', order: 15,
    question_text: 'O/U Kenyon Sadiq pick (9.5)',
    options: [{ id: 'A', label: 'Under (picks 1–9)', points: 300 },{ id: 'B', label: 'Over (picks 10+)', points: 200 }] },
  { question_id: 'q16', section: 'over_under', order: 16,
    question_text: 'O/U Rueben Bain Jr. pick (16.5)',
    options: [{ id: 'A', label: 'Under (picks 1–16)', points: 250 },{ id: 'B', label: 'Over (picks 17+)', points: 300 }] },
  { question_id: 'q17', section: 'over_under', order: 17,
    question_text: 'O/U Ty Simpson (QB, Alabama) pick (26.5)',
    options: [{ id: 'A', label: 'Under / drafted in Round 1 (picks 1–26)', points: 250 },{ id: 'B', label: 'Over / picks 27–32 or not Round 1', points: 300 }] },
  { question_id: 'q18', section: 'counts', order: 18,
    question_text: 'How many QBs will be taken in Round 1?',
    options: [{ id: 'A', label: '1', points: 350 },{ id: 'B', label: '2', points: 200 },{ id: 'C', label: '3 or more', points: 700 }] },
  { question_id: 'q19', section: 'counts', order: 19,
    question_text: 'How many WRs will be taken in Round 1?',
    options: [{ id: 'A', label: '4 or fewer', points: 350 },{ id: 'B', label: '5', points: 250 },{ id: 'C', label: '6', points: 400 },{ id: 'D', label: '7 or more', points: 600 }] },
  { question_id: 'q20', section: 'counts', order: 20,
    question_text: 'How many RBs will be taken in Round 1?',
    options: [{ id: 'A', label: '0', points: 500 },{ id: 'B', label: '1', points: 150 },{ id: 'C', label: '2', points: 650 },{ id: 'D', label: '3 or more', points: 1200 }] },
  { question_id: 'q21', section: 'counts', order: 21,
    question_text: 'How many Edge Rushers / DEs will be taken in Round 1?',
    options: [{ id: 'A', label: '2 or fewer', points: 400 },{ id: 'B', label: '3', points: 300 },{ id: 'C', label: '4', points: 300 },{ id: 'D', label: '5 or more', points: 400 }] },
  { question_id: 'q22', section: 'counts', order: 22,
    question_text: 'How many LBs will be taken in Round 1?',
    options: [{ id: 'A', label: '0 or 1', points: 500 },{ id: 'B', label: '2', points: 200 },{ id: 'C', label: '3', points: 350 },{ id: 'D', label: '4 or more', points: 700 }] },
  { question_id: 'q23', section: 'counts', order: 23,
    question_text: 'How many players from Ohio State will be taken in Round 1?',
    options: [{ id: 'A', label: '1', points: 1000 },{ id: 'B', label: '2', points: 350 },{ id: 'C', label: '3', points: 200 },{ id: 'D', label: '4 or more', points: 500 }] },
  { question_id: 'q24', section: 'teams', order: 24,
    question_text: 'What position will the New York Jets select at pick 2?',
    options: [{ id: 'A', label: 'Edge Rusher / DE', points: 250 },{ id: 'B', label: 'Linebacker', points: 200 },{ id: 'C', label: 'Running Back', points: 700 },{ id: 'D', label: 'Offensive Lineman', points: 900 },{ id: 'E', label: 'Other', points: 800 }] },
  { question_id: 'q25', section: 'teams', order: 25,
    question_text: 'Will the New York Jets select a QB in Round 1 (either pick)?',
    options: [{ id: 'A', label: 'Yes', points: 500 },{ id: 'B', label: 'No', points: 150 }] },
  { question_id: 'q26', section: 'teams', order: 26,
    question_text: 'What position will Cleveland Browns (pick 6) select?',
    options: [{ id: 'A', label: 'Wide Receiver', points: 250 },{ id: 'B', label: 'Edge Rusher / DE', points: 350 },{ id: 'C', label: 'Defensive Back', points: 500 },{ id: 'D', label: 'Other', points: 400 }] },
  { question_id: 'q27', section: 'teams', order: 27,
    question_text: 'What position will Kansas City Chiefs (pick 9) select?',
    options: [{ id: 'A', label: 'Edge Rusher / DE', points: 300 },{ id: 'B', label: 'Offensive Lineman', points: 300 },{ id: 'C', label: 'Wide Receiver', points: 400 },{ id: 'D', label: 'Other', points: 450 }] },
  { question_id: 'q28', section: 'teams', order: 28,
    question_text: 'Will Jim Harbaugh (Chargers) draft an Indiana player in Round 1?',
    options: [{ id: 'A', label: 'Yes', points: 500 },{ id: 'B', label: 'No', points: 150 }] },
  { question_id: 'q29', section: 'trades', order: 29,
    question_text: 'How many trades will occur in Round 1 of the NFL Draft (picks 1–32)?',
    options: [{ id: 'A', label: '3 or fewer', points: 600 },{ id: 'B', label: '4', points: 600 },{ id: 'C', label: '5', points: 450 },{ id: 'D', label: '6', points: 400 },{ id: 'E', label: '7', points: 400 },{ id: 'F', label: '8 or more', points: 350 }] },
  { question_id: 'q30', section: 'trades', order: 30,
    question_text: 'Who will be the first NFL player TRADED during the 2026 Draft?',
    options: [{ id: 'A', label: 'No NFL player traded during Round 1', points: 250 },{ id: 'B', label: 'A Wide Receiver', points: 350 },{ id: 'C', label: 'A Quarterback', points: 400 },{ id: 'D', label: 'Other', points: 450 }] },
  { question_id: 'q31', section: 'trades', order: 31,
    question_text: 'Will any of picks 2–6 be traded away during Round 1?',
    options: [{ id: 'A', label: 'Yes', points: 350 },{ id: 'B', label: 'No', points: 200 }] },
  { question_id: 'q32', section: 'trades', order: 32,
    question_text: 'Will there be an NFL trade AFTER pick 20 is selected in Round 1?',
    options: [{ id: 'A', label: 'Yes', points: 200 },{ id: 'B', label: 'No', points: 300 }] },
  { question_id: 'q33', section: 'bmfffl', order: 33,
    question_text: 'How many trades will be accepted in the BMFFFL from pick 1 through pick 32?',
    options: [{ id: 'A', label: '0', points: 300 },{ id: 'B', label: '1', points: 250 },{ id: 'C', label: '2', points: 350 },{ id: 'D', label: '3', points: 500 },{ id: 'E', label: '4 or more', points: 650 }] },
  { question_id: 'q34', section: 'bmfffl', order: 34,
    question_text: 'Will anyone in the BMFFFL trade away a 2026 BMFFFL first round pick during the NFL Draft?',
    options: [{ id: 'A', label: 'Yes', points: 500 },{ id: 'B', label: 'No', points: 150 }] },
  { question_id: 'q35', section: 'tiebreaker', order: 35,
    question_type: 'open_response',
    question_text: 'What is the exact time that David Bailey is selected? (Draft begins 8:00pm ET, Thursday April 23)',
    options: [] },
];

const ENTRY_QUESTIONS = QUESTIONS.filter((q) => q.question_type !== 'open_response');
const TIEBREAKER      = QUESTIONS.find((q) => q.question_type === 'open_response')!;

// ─── Leaderboard types ────────────────────────────────────────────────────────

interface Submission      { owner_name: string; submitted_at: string }
interface LeaderboardEntry { owner_name: string; total_score: number; scored_at?: string }
interface AnsweredQuestion { question_id: string; question_text: string; section: string; order: number; correct_option_id: string; options: Option[] }
interface OwnerPicks       { owner_name: string; answers: Record<string, string> }
interface PublicQuestion   { question_id: string; question_text: string; section: string; order: number; options: Option[] }

type RankSnapshot = { n: number } & Record<string, number>;
const HISTORY_KEY = 'bmfffl-lb-history-2026';

// ─── ENTRY phase ─────────────────────────────────────────────────────────────

type EntryView = 'LANDING' | 'QUIZ' | 'CONFIRMED';
type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

function EntryPhase() {
  const [view,        setView]        = useState<EntryView>('LANDING');
  const [ownerName,   setOwnerName]   = useState('');
  const [answers,     setAnswers]     = useState<Record<string, string>>({});
  const [tiebreaker,  setTiebreaker]  = useState('');
  const [currentIdx,  setCurrentIdx]  = useState(0);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMsg,    setErrorMsg]    = useState('');
  const [submissions, setSubmissions] = useState<string[]>([]);

  const deadline = useCountdown(SUBMISSION_DEADLINE);

  // Restore owner from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('bmfffl-draft-game-owner');
    if (stored) setOwnerName(stored);
  }, []);

  // Fetch submission list for LANDING
  useEffect(() => {
    fetch(`${CONVEX_SITE}/getDraftGameSubmissions?year=${YEAR}`)
      .then((r) => r.json())
      .then((data: Submission[]) => setSubmissions(data.map((s) => s.owner_name)))
      .catch(() => {});
  }, []);

  function handleOwnerChange(name: string) {
    setOwnerName(name);
    if (name) localStorage.setItem('bmfffl-draft-game-owner', name);
  }

  function handleSelect(qid: string, optId: string) {
    setAnswers((prev) => ({ ...prev, [qid]: optId }));
  }

  function handleNext() {
    if (currentIdx < ENTRY_QUESTIONS.length - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      // After all main Qs, go to tiebreaker (last question)
      setCurrentIdx(ENTRY_QUESTIONS.length); // sentinel for tiebreaker
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleBack() {
    if (currentIdx > 0) setCurrentIdx((i) => i - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit() {
    if (!ownerName) return;
    setSubmitState('submitting');
    setErrorMsg('');
    const allAnswers: Record<string, string> = { ...answers };
    if (tiebreaker.trim()) allAnswers['q35'] = tiebreaker.trim();
    try {
      const res = await fetch(`${CONVEX_SITE}/submitDraftGameEntry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year: YEAR, owner_name: ownerName, answers: allAnswers }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok || data.error) {
        setErrorMsg(data.error ?? 'Submission failed. Try again.');
        setSubmitState('error');
      } else {
        setSubmitState('success');
        setView('CONFIRMED');
      }
    } catch {
      setErrorMsg('Network error. Check your connection and try again.');
      setSubmitState('error');
    }
  }

  // ── LANDING ────────────────────────────────────────────────────────────────
  if (view === 'LANDING') {
    return (
      <div className="min-h-screen bg-[#0d1b2a] px-4 py-10">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="text-5xl mb-3">🏈</div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-1">
              BMFFFL Draft Game
            </h1>
            <p className="text-slate-400 text-sm">2026 NFL Draft · Pittsburgh · April 23</p>
          </div>

          {/* Countdown */}
          {deadline && (
            <div className="bg-[#16213e] border border-[#2d4a66] rounded-2xl p-6 mb-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
                Picks lock in
              </p>
              <div className="flex justify-center gap-4">
                {([['d', 'days'], ['h', 'hrs'], ['m', 'min'], ['s', 'sec']] as const).map(([k, label]) => (
                  <div key={k} className="flex flex-col items-center">
                    <span className="text-3xl font-black text-white tabular-nums">
                      {String(deadline[k]).padStart(2, '0')}
                    </span>
                    <span className="text-xs text-slate-500 mt-0.5">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scoring warning */}
          <div className="bg-amber-900/20 border border-amber-500/40 rounded-xl p-4 mb-6 flex gap-3">
            <span className="text-amber-400 text-lg mt-0.5">⚠️</span>
            <div>
              <p className="text-amber-300 font-bold text-sm mb-1">Wrong answers cost points</p>
              <p className="text-amber-200/70 text-xs leading-relaxed">
                Correct: <span className="text-white font-semibold">full points</span> ·
                Wrong: <span className="text-red-400 font-semibold">−100 pts</span> ·
                Skip: <span className="text-slate-300 font-semibold">0 pts</span>. Skip freely.
              </p>
            </div>
          </div>

          {/* Submission list */}
          <div className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-5 mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
              {submissions.length} of 12 submitted
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {[...OWNERS, 'Bimflé'].map((name) => {
                const done = submissions.includes(name);
                return (
                  <div key={name} className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium',
                    done ? 'bg-emerald-900/30 text-emerald-300' : 'bg-[#0d1b2a] text-slate-500'
                  )}>
                    <span>{done ? '✅' : '○'}</span>
                    <span className="truncate">{name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => {
              if (!ownerName) return;
              setView('QUIZ');
              setCurrentIdx(0);
            }}
            disabled={!ownerName}
            className={cn(
              'w-full py-4 rounded-2xl text-lg font-black tracking-wide transition-all',
              ownerName
                ? 'bg-[#ffd700] text-[#0d1b2a] hover:bg-yellow-300 shadow-lg shadow-yellow-900/30'
                : 'bg-[#1e3a5f] text-slate-500 cursor-not-allowed'
            )}
          >
            {ownerName ? `Enter Picks — ${ownerName} →` : 'Select your name below first'}
          </button>

          {/* Owner picker */}
          <div className="mt-4">
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
              Who are you?
            </label>
            <select
              value={ownerName}
              onChange={(e) => handleOwnerChange(e.target.value)}
              className="w-full bg-[#16213e] border border-[#2d4a66] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ffd700]"
            >
              <option value="">— pick your name —</option>
              {OWNERS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          {/* Prize note */}
          <p className="text-center text-xs text-slate-500 mt-6">
            🏆 Prize: pick 3.13 (end of 3rd round BMFFFL Rookie Draft)
          </p>
        </div>
      </div>
    );
  }

  // ── QUIZ ───────────────────────────────────────────────────────────────────
  if (view === 'QUIZ') {
    const isTiebreaker = currentIdx >= ENTRY_QUESTIONS.length;
    const question     = isTiebreaker ? TIEBREAKER : ENTRY_QUESTIONS[currentIdx];
    const progress     = isTiebreaker ? ENTRY_QUESTIONS.length : currentIdx;
    const total        = ENTRY_QUESTIONS.length;
    const pct          = Math.round((progress / total) * 100);
    const answered     = isTiebreaker ? !!tiebreaker.trim() : !!answers[question.question_id];
    const sectionInfo  = SECTIONS[question.section] ?? { label: question.section, emoji: '•' };

    return (
      <div className="min-h-screen bg-[#0d1b2a] px-4 py-8">
        <div className="max-w-lg mx-auto">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-400 font-semibold">
                {isTiebreaker ? 'Tiebreaker' : `Question ${currentIdx + 1} of ${total}`}
              </span>
              <button
                onClick={() => setView('LANDING')}
                className="text-xs text-slate-500 hover:text-slate-300"
              >
                ← Back to start
              </button>
            </div>
            <div className="h-1.5 bg-[#16213e] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#ffd700] rounded-full transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Section label */}
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
            {sectionInfo.emoji} {sectionInfo.label}
          </p>

          {/* Question */}
          <h2 className="text-xl font-bold text-white mb-6 leading-snug">
            {question.question_text}
          </h2>

          {/* Options */}
          {isTiebreaker ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">Enter a time (e.g. 9:47pm). Closest wins. No penalty for being wrong.</p>
              <input
                type="text"
                value={tiebreaker}
                onChange={(e) => setTiebreaker(e.target.value)}
                placeholder="e.g. 9:47pm"
                className="w-full bg-[#16213e] border border-[#2d4a66] text-white rounded-xl px-4 py-4 text-lg focus:outline-none focus:border-[#ffd700]"
              />
            </div>
          ) : (
            <div className="space-y-3">
              {question.options.map((opt) => {
                const selected = answers[question.question_id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(question.question_id, opt.id)}
                    className={cn(
                      'w-full text-left flex items-center justify-between px-4 py-4 rounded-xl border text-sm font-medium transition-all',
                      selected
                        ? 'border-[#ffd700] bg-yellow-900/20 text-white'
                        : 'border-[#2d4a66] bg-[#16213e] text-slate-300 hover:border-[#4a7a9b]'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0',
                        selected ? 'bg-[#ffd700] text-[#0d1b2a]' : 'bg-[#0d1b2a] text-slate-400'
                      )}>
                        {opt.id}
                      </span>
                      <span>{opt.label}</span>
                    </div>
                    <span className={cn('text-xs font-bold shrink-0 ml-2', selected ? 'text-[#ffd700]' : 'text-slate-500')}>
                      +{opt.points.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {currentIdx > 0 && (
              <button
                onClick={handleBack}
                className="flex-1 py-3 rounded-xl border border-[#2d4a66] text-slate-300 font-semibold text-sm hover:border-[#4a7a9b] transition-all"
              >
                ← Back
              </button>
            )}
            {!isTiebreaker ? (
              <button
                onClick={handleNext}
                className={cn(
                  'flex-1 py-3 rounded-xl font-bold text-sm transition-all',
                  answered
                    ? 'bg-[#ffd700] text-[#0d1b2a] hover:bg-yellow-300'
                    : 'bg-[#1e3a5f] text-slate-500 hover:bg-[#243f5c]'
                )}
              >
                {answered ? 'Next →' : 'Skip →'}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!ownerName || submitState === 'submitting'}
                className={cn(
                  'flex-1 py-3 rounded-xl font-black text-sm transition-all',
                  ownerName && submitState !== 'submitting'
                    ? 'bg-[#ffd700] text-[#0d1b2a] hover:bg-yellow-300'
                    : 'bg-[#1e3a5f] text-slate-500 cursor-not-allowed'
                )}
              >
                {submitState === 'submitting' ? 'Locking in…' : '🏈 Submit Picks'}
              </button>
            )}
          </div>

          {errorMsg && (
            <p className="mt-4 text-red-400 text-xs text-center">{errorMsg}</p>
          )}

          {/* Answered count */}
          <p className="text-center text-xs text-slate-500 mt-4">
            {Object.keys(answers).length} of {total} answered
            {Object.keys(answers).length < total && ' — unanswered questions score 0'}
          </p>
        </div>
      </div>
    );
  }

  // ── CONFIRMED ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0d1b2a] flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-3xl font-black text-white mb-2">Picks Locked In!</h1>
          <p className="text-slate-400">
            <span className="text-[#ffd700] font-bold">{ownerName}</span> — you&apos;re in the game.
          </p>
          <p className="text-slate-500 text-sm mt-1">
            Bimflé scores everything after the draft on April 23. Good luck.
          </p>
        </div>
        {/* Pick review */}
        <div className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
            Your picks ({Object.keys(answers).length} of {ENTRY_QUESTIONS.length} answered)
          </p>
          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {ENTRY_QUESTIONS.map((q) => {
              const chosen = answers[q.question_id];
              const opt    = q.options.find((o) => o.id === chosen);
              return (
                <div key={q.question_id} className="flex items-start gap-2 text-xs">
                  <span className="text-[#ffd700] font-mono shrink-0">{q.question_id.toUpperCase()}</span>
                  <div>
                    <p className="text-slate-400 leading-snug">{q.question_text}</p>
                    {opt ? (
                      <p className="text-white font-semibold">{opt.label} (+{opt.points.toLocaleString()})</p>
                    ) : (
                      <p className="text-slate-600 italic">Skipped (0 pts)</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Deadline */}
        {deadline && (
          <p className="text-center text-xs text-slate-500 mt-4">
            Picks lock in {deadline.d}d {deadline.h}h {deadline.m}m
          </p>
        )}
      </div>
    </div>
  );
}

// ─── LIVE phase ───────────────────────────────────────────────────────────────

type LiveTab = 'leaderboard' | 'my_picks' | 'field_picks';

function LivePhase() {
  const [tab,                setTab]              = useState<LiveTab>('leaderboard');
  const [submissions,        setSubmissions]      = useState<Submission[]>([]);
  const [leaderboard,        setLeaderboard]      = useState<LeaderboardEntry[]>([]);
  const [answeredQuestions,  setAnsweredQuestions] = useState<AnsweredQuestion[]>([]);
  const [allPicks,           setAllPicks]         = useState<OwnerPicks[]>([]);
  const [allQuestions,       setAllQuestions]     = useState<PublicQuestion[]>([]);
  const [myName,             setMyName]           = useState<string | null>(null);
  const [myPicks,            setMyPicks]          = useState<Record<string, string> | null>(null);
  const [chartHistory,       setChartHistory]     = useState<RankSnapshot[]>([]);
  const [rankMovements,      setRankMovements]    = useState<Record<string, number>>({});
  const [nextRefresh,        setNextRefresh]      = useState(30);
  const [loading,            setLoading]          = useState(true);
  const [error,              setError]            = useState<string | null>(null);
  const prevRanksRef = useRef<Record<string, number>>({});

  // Owner identity from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('bmfffl-draft-game-owner');
    if (stored) setMyName(stored);
    try {
      const hist = localStorage.getItem(HISTORY_KEY);
      if (hist) setChartHistory(JSON.parse(hist) as RankSnapshot[]);
    } catch { /* ignore */ }
  }, []);

  // Own picks
  useEffect(() => {
    if (!myName) return;
    fetch(`${CONVEX_SITE}/getMyDraftGameEntry?year=${YEAR}&owner_name=${encodeURIComponent(myName)}`)
      .then((r) => r.json())
      .then((d: { answers?: Record<string, string> } | null) => { if (d?.answers) setMyPicks(d.answers); })
      .catch(() => {});
  }, [myName]);

  const fetchAll = useCallback(async () => {
    try {
      const [subRes, lbRes, aqRes, picksRes, qRes] = await Promise.all([
        fetch(`${CONVEX_SITE}/getDraftGameSubmissions?year=${YEAR}`),
        fetch(`${CONVEX_SITE}/getDraftGameLeaderboard?year=${YEAR}`),
        fetch(`${CONVEX_SITE}/getDraftGameAnsweredQuestions?year=${YEAR}`),
        fetch(`${CONVEX_SITE}/getDraftGameAllPicks?year=${YEAR}`),
        fetch(`${CONVEX_SITE}/getDraftGameQuestionsPublic?year=${YEAR}`),
      ]);
      const subs: Submission[]       = await subRes.json();
      const lb:   LeaderboardEntry[] = await lbRes.json();
      const aq:   AnsweredQuestion[] = await aqRes.json();
      const picks: OwnerPicks[]      = await picksRes.json();
      const qs:   PublicQuestion[]   = await qRes.json();

      setSubmissions(subs);
      setLeaderboard(lb);
      setAnsweredQuestions(aq);
      setAllPicks(picks);
      setAllQuestions(qs);
      setLoading(false);
      setError(null);

      // Rank movement tracking
      if (lb.length > 0 && aq.length > 0) {
        setChartHistory((prev) => {
          const lastN = prev.length > 0 ? prev[prev.length - 1].n : -1;
          if (aq.length === lastN) return prev;
          if (Object.keys(prevRanksRef.current).length > 0) {
            const movements: Record<string, number> = {};
            lb.forEach((e, i) => {
              const old = prevRanksRef.current[e.owner_name];
              if (old !== undefined) movements[e.owner_name] = old - (i + 1);
            });
            setRankMovements(movements);
          }
          const newRanks: Record<string, number> = {};
          lb.forEach((e, i) => { newRanks[e.owner_name] = i + 1; });
          prevRanksRef.current = newRanks;
          const snapshot: RankSnapshot = { n: aq.length };
          lb.forEach((e, i) => { snapshot[e.owner_name] = 13 - (i + 1); });
          const next = [...prev, snapshot].slice(-40);
          try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch { /* ignore */ }
          return next;
        });
      }
    } catch {
      setError('Failed to load. Will retry.');
      setLoading(false);
    }
    setNextRefresh(30);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);
  useEffect(() => {
    const id = setInterval(() => setNextRefresh((n) => {
      if (n <= 1) { fetchAll(); return 30; }
      return n - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [fetchAll]);

  const answeredIds    = new Set(answeredQuestions.map((q) => q.question_id));
  const unansweredQs   = allQuestions.filter((q) => !answeredIds.has(q.question_id));
  const isScored       = leaderboard.length > 0;

  // Max possible scores
  const maxPossible: Record<string, number> = {};
  if (allPicks.length > 0 && isScored) {
    for (const op of allPicks) {
      const lb = leaderboard.find((e) => e.owner_name === op.owner_name);
      let cur = lb?.total_score ?? 0;
      for (const q of unansweredQs) {
        const optId = op.answers[q.question_id];
        if (!optId) continue;
        const opt = q.options.find((o) => o.id === optId);
        if (opt) cur += opt.points;
      }
      maxPossible[op.owner_name] = cur;
    }
  }

  // Elimination
  const leaderScore = isScored ? (leaderboard[0]?.total_score ?? 0) : 0;
  const eliminated  = new Set<string>();
  if (isScored && Object.keys(maxPossible).length > 0) {
    for (const [name, max] of Object.entries(maxPossible)) {
      if (max < leaderScore) eliminated.add(name);
    }
  }

  // Picks map: { qid → { owner → optId } }
  const picksMap: Record<string, Record<string, string>> = {};
  for (const op of allPicks) {
    for (const [qid, optId] of Object.entries(op.answers)) {
      if (!picksMap[qid]) picksMap[qid] = {};
      picksMap[qid][op.owner_name] = optId;
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0d1b2a] flex items-center justify-center">
      <p className="text-slate-400">Loading…</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d1b2a]">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-[#0d1b2a] border-b border-[#2d4a66] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-black text-white text-sm">BMFFFL Draft Game</span>
            <span className="text-xs font-bold text-red-400 bg-red-900/30 px-2 py-0.5 rounded-full">🔴 LIVE</span>
          </div>
          <div className="flex items-center gap-2">
            {error && <span className="text-red-400 text-xs">{error}</span>}
            <span className="text-xs text-slate-500">↻ {nextRefresh}s</span>
            <button onClick={fetchAll} className="text-xs text-[#ffd700] font-semibold hover:text-yellow-300">Refresh</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#2d4a66] px-4">
        <div className="max-w-2xl mx-auto flex">
          {(['leaderboard', 'my_picks', 'field_picks'] as LiveTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'px-4 py-3 text-sm font-semibold border-b-2 transition-all',
                tab === t
                  ? 'border-[#ffd700] text-[#ffd700]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              )}
            >
              {t === 'leaderboard' ? '🏆 Leaderboard' : t === 'my_picks' ? '🎯 My Picks' : '👥 Field Picks'}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* ── Leaderboard tab ── */}
        {tab === 'leaderboard' && (
          <div>
            {!isScored ? (
              <div className="text-center py-12">
                <p className="text-slate-400">Scoring starts when the first pick is made.</p>
                <p className="text-slate-500 text-sm mt-1">{submissions.length} of 12 submitted</p>
              </div>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((entry, i) => {
                  const mov  = rankMovements[entry.owner_name] ?? 0;
                  const elim = eliminated.has(entry.owner_name);
                  const max  = maxPossible[entry.owner_name];
                  return (
                    <div key={entry.owner_name} className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl border transition-all',
                      i === 0 ? 'border-[#ffd700] bg-yellow-900/10' : 'border-[#2d4a66] bg-[#16213e]',
                      elim && 'opacity-40'
                    )}>
                      <span className={cn('text-lg font-black w-7 shrink-0', i === 0 ? 'text-[#ffd700]' : 'text-slate-400')}>
                        {i === 0 ? '🏆' : `${i + 1}`}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={cn('font-bold text-sm truncate', elim ? 'text-slate-500' : 'text-white')}>
                          {entry.owner_name}
                          {elim && <span className="ml-1.5 text-xs text-red-500">💀 eliminated</span>}
                          {entry.owner_name === myName && <span className="ml-1.5 text-xs text-[#ffd700]">← you</span>}
                        </p>
                        {max !== undefined && (
                          <p className="text-xs text-slate-500">max {max.toLocaleString()}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {mov !== 0 && (
                          <span className={cn('text-xs font-bold', mov > 0 ? 'text-emerald-400' : 'text-red-400')}>
                            {mov > 0 ? `↑${mov}` : `↓${Math.abs(mov)}`}
                          </span>
                        )}
                        <span className={cn('text-lg font-black tabular-nums', i === 0 ? 'text-[#ffd700]' : 'text-white')}>
                          {entry.total_score.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bump chart */}
            {chartHistory.length > 1 && (
              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">The Race</p>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartHistory}>
                      <XAxis dataKey="n" hide />
                      <YAxis hide domain={[0, 13]} />
                      <Tooltip
                        contentStyle={{ background: '#16213e', border: '1px solid #2d4a66', borderRadius: 8, fontSize: 11 }}
                        formatter={(v: number, name: string) => [`rank ${13 - v}`, name]}
                      />
                      {Object.keys(OWNER_COLORS).map((name) => (
                        <Line key={name} type="monotone" dataKey={name} stroke={OWNER_COLORS[name]} strokeWidth={2} dot={false} />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── My Picks tab ── */}
        {tab === 'my_picks' && (
          <div>
            {!myName || !myPicks ? (
              <div className="text-center py-12">
                <p className="text-slate-400">
                  {myName ? 'Your picks are loading…' : 'Select your name to see your scorecard.'}
                </p>
                {!myName && (
                  <select
                    onChange={(e) => {
                      setMyName(e.target.value);
                      localStorage.setItem('bmfffl-draft-game-owner', e.target.value);
                    }}
                    className="mt-4 bg-[#16213e] border border-[#2d4a66] text-white rounded-xl px-4 py-2 text-sm"
                  >
                    <option value="">— who are you? —</option>
                    {OWNERS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {answeredQuestions.sort((a, b) => a.order - b.order).map((aq) => {
                  const myOpt    = myPicks[aq.question_id];
                  const correct  = myOpt === aq.correct_option_id;
                  const opted    = aq.options.find((o) => o.id === myOpt);
                  const correctO = aq.options.find((o) => o.id === aq.correct_option_id);
                  return (
                    <div key={aq.question_id} className={cn(
                      'p-4 rounded-xl border text-sm',
                      !myOpt ? 'border-[#2d4a66] bg-[#16213e]'
                        : correct ? 'border-emerald-500/40 bg-emerald-900/10'
                        : 'border-red-500/30 bg-red-900/10'
                    )}>
                      <p className="text-slate-400 text-xs leading-snug mb-2">{aq.question_text}</p>
                      {myOpt ? (
                        <>
                          <p className={cn('font-bold', correct ? 'text-emerald-300' : 'text-red-400')}>
                            {correct ? '✅' : '❌'} {opted?.label ?? myOpt}
                            <span className="ml-2 text-xs font-normal">
                              {correct ? `+${opted?.points.toLocaleString()}` : '−100'}
                            </span>
                          </p>
                          {!correct && correctO && (
                            <p className="text-xs text-slate-400 mt-0.5">Correct: {correctO.label}</p>
                          )}
                        </>
                      ) : (
                        <p className="text-slate-500 italic text-xs">Skipped — 0 pts</p>
                      )}
                    </div>
                  );
                })}
                {unansweredQs.length > 0 && (
                  <p className="text-xs text-slate-500 text-center pt-2">
                    {unansweredQs.length} questions not yet scored
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Field Picks tab ── */}
        {tab === 'field_picks' && (
          <div>
            {allQuestions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400">Field picks revealed as scoring begins.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {allQuestions
                  .filter((q) => answeredIds.has(q.question_id))
                  .sort((a, b) => a.order - b.order)
                  .map((q) => {
                    const aq = answeredQuestions.find((a) => a.question_id === q.question_id);
                    return (
                      <div key={q.question_id} className="bg-[#16213e] border border-[#2d4a66] rounded-xl p-4">
                        <p className="text-white font-semibold text-sm mb-3">{q.question_text}</p>
                        <div className="space-y-1.5">
                          {q.options.map((opt) => {
                            const owners = Object.entries(picksMap[q.question_id] ?? {})
                              .filter(([, v]) => v === opt.id)
                              .map(([k]) => k);
                            const isCorrect = aq?.correct_option_id === opt.id;
                            return (
                              <div key={opt.id} className={cn(
                                'flex items-center gap-2 px-3 py-2 rounded-lg text-xs',
                                isCorrect ? 'bg-emerald-900/20 text-emerald-300' : 'bg-[#0d1b2a] text-slate-400'
                              )}>
                                <span className="font-bold w-5">{opt.id}</span>
                                <span className="flex-1 truncate">{opt.label}</span>
                                {isCorrect && <span>✅</span>}
                                <span className="text-slate-500 ml-auto">
                                  {owners.length > 0 ? owners.join(', ') : '—'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                {answeredQuestions.length === 0 && (
                  <p className="text-slate-500 text-sm text-center py-8">Field picks revealed when first question is scored.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── FINAL phase ──────────────────────────────────────────────────────────────

function FinalPhase() {
  // Reuse LivePhase but locked — no countdown, full reveal, winner banner
  return <LivePhase />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NflDraftGamePage() {
  const phase = usePhase();

  return (
    <>
      <Head>
        <title>BMFFFL Draft Game 2026</title>
        <meta name="description" content="BMFFFL NFL Draft Game 2026 — pick who goes where, score points, win a rookie draft pick." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {phase === 'ENTRY' && <EntryPhase />}
      {phase === 'LIVE'  && <LivePhase />}
      {phase === 'FINAL' && <FinalPhase />}
    </>
  );
}

// Opt out of the BMFFFL nav/footer shell — standalone game experience.
NflDraftGamePage.getLayout = (page: ReactElement) => page;
