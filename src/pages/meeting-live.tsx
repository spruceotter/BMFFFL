/**
 * BMFFFL Meeting Companion — /meeting-live
 *
 * Screen-share display for the Google Meet owners meeting.
 * Large text, high contrast, live Convex data.
 * Navigate proposals with arrow keys or buttons.
 *
 * Data sources (same Convex pool as /meeting):
 *   - rule_proposal tasks → proposals list
 *   - rule_vote tasks     → live tallies
 *   - bimfle_commentary tasks → Bimflé says panel
 */

import Head from 'next/head';
import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

// ─── Config ──────────────────────────────────────────────────────────────────

const CONVEX_URL = 'https://resolute-setter-416.convex.cloud';

// May 26, 2026 — 9:00pm ET official start (room opens 8:30pm ET)
const AGENDA_ITEMS = [
  { id: 'rollcall', label: 'Roll call + live proposals', done: false },
  { id: 'ownership', label: 'New Owner — Commissioner decision', done: false },
  { id: 'dispersal', label: 'Dispersal draft — format, pool, timeline', done: false },
  { id: 'faab', label: 'Escuelas FAAB disposition + 2026 refresh', done: false },
  { id: 'rules', label: 'Rule proposals — vote each', done: false },
  { id: 'activity', label: 'Activity rules — shame + incentives', done: false },
  { id: 'season', label: 'Season prep — blockers, cuts, rookie draft June 5', done: false },
  { id: 'schedule', label: 'Schedule draw — live reveal', done: false },
  { id: 'askbimfle', label: 'Ask Bimflé Anything', done: false },
];

const CATEGORY_COLORS: Record<string, string> = {
  'Scoring': '#a855f7',
  'Roster Format': '#3b82f6',
  'FAAB / Waivers': '#f97316',
  'Trades': '#14b8a6',
  'Playoffs': '#eab308',
  'Dispersal / Ownership': '#ef4444',
  'Season Schedule': '#6366f1',
  'Other': '#6b7280',
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface RuleProposal {
  proposal_id: string;
  owner_name: string;
  category: string;
  title: string;
  proposal: string;
  reasoning: string;
  submitted_at: string;
}

interface RuleVote {
  proposal_id: string;
  owner_name: string;
  vote: 'yes' | 'no' | 'abstain';
  submitted_at: string;
}

interface Commentary {
  text: string;
  submitted_at: string;
}

interface MeetingState {
  current_proposal_index: number;
  decision: 'passed' | 'failed' | null;
  submitted_at: string;
}

// ─── Convex helpers ───────────────────────────────────────────────────────────

async function fetchLiveData(): Promise<{
  proposals: RuleProposal[];
  votes: RuleVote[];
  commentary: Commentary[];
  meetingState: MeetingState | null;
}> {
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
    if (!resp.ok) return { proposals: [], votes: [], commentary: [], meetingState: null };
    const json = await resp.json();
    const tasks = (json.value ?? []) as { task_type: string; payload: unknown }[];

    const proposals: RuleProposal[] = [];
    const votes: RuleVote[] = [];
    const commentary: Commentary[] = [];
    const meetingStates: MeetingState[] = [];

    for (const t of tasks) {
      if (t.task_type === 'rule_proposal') proposals.push(t.payload as RuleProposal);
      if (t.task_type === 'rule_vote') votes.push(t.payload as RuleVote);
      if (t.task_type === 'bimfle_commentary') commentary.push(t.payload as Commentary);
      if (t.task_type === 'meeting_state') meetingStates.push(t.payload as MeetingState);
    }

    // Sort proposals: category order then time
    const catOrder = ['Scoring', 'Roster Format', 'FAAB / Waivers', 'Trades', 'Playoffs', 'Dispersal / Ownership', 'Season Schedule', 'Other'];
    proposals.sort((a, b) => {
      const co = catOrder.indexOf(a.category) - catOrder.indexOf(b.category);
      return co !== 0 ? co : a.submitted_at.localeCompare(b.submitted_at);
    });

    // Sort commentary newest last
    commentary.sort((a, b) => a.submitted_at.localeCompare(b.submitted_at));

    // Latest meeting state
    meetingStates.sort((a, b) => a.submitted_at.localeCompare(b.submitted_at));
    const meetingState = meetingStates.length > 0 ? meetingStates[meetingStates.length - 1] : null;

    return { proposals, votes, commentary, meetingState };
  } catch {
    return { proposals: [], votes: [], commentary: [], meetingState: null };
  }
}

// ─── Vote tally helper ───────────────────────────────────────────────────────

function getTally(proposalId: string, votes: RuleVote[]) {
  const latest = new Map<string, RuleVote>();
  votes
    .filter((v) => v.proposal_id === proposalId)
    .sort((a, b) => a.submitted_at.localeCompare(b.submitted_at))
    .forEach((v) => latest.set(v.owner_name, v));

  const tally = { yes: 0, no: 0, abstain: 0 };
  const voters: string[] = [];
  latest.forEach((v, owner) => {
    tally[v.vote]++;
    voters.push(owner);
  });
  return { tally, voters, total: tally.yes + tally.no + tally.abstain };
}

// ─── Vote Bar ─────────────────────────────────────────────────────────────────

function VoteBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-4">
      <span className="text-2xl font-bold w-16 text-right" style={{ color }}>{count}</span>
      <span className="text-gray-400 w-24 text-lg">{label}</span>
      <div className="flex-1 h-4 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-gray-500 w-12 text-base">{pct}%</span>
    </div>
  );
}

// ─── Agenda Sidebar ───────────────────────────────────────────────────────────

function AgendaSidebar({
  items,
  activeIndex,
  onToggle,
}: {
  items: { id: string; label: string; done: boolean }[];
  activeIndex: number;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-1">Agenda</h2>
      {items.map((item, i) => (
        <button
          key={item.id}
          onClick={() => onToggle(item.id)}
          className={`text-left px-3 py-2 rounded-lg transition-all text-sm font-medium flex items-start gap-2 ${
            item.done
              ? 'text-gray-600 line-through'
              : i === activeIndex
              ? 'bg-[#ffd700]/10 text-[#ffd700] border border-[#ffd700]/30'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <span className="mt-0.5 flex-shrink-0">{item.done ? '✓' : '○'}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MeetingLivePage() {
  const [proposals, setProposals] = useState<RuleProposal[]>([]);
  const [votes, setVotes] = useState<RuleVote[]>([]);
  const [commentary, setCommentary] = useState<Commentary[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [decision, setDecision] = useState<'passed' | 'failed' | null>(null);
  const [agendaItems, setAgendaItems] = useState(AGENDA_ITEMS);
  const [activeAgenda, setActiveAgenda] = useState(0);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [now, setNow] = useState(new Date());
  const commentaryRef = useRef<HTMLDivElement>(null);

  // Clock
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Auto-scroll commentary
  useEffect(() => {
    if (commentaryRef.current) {
      commentaryRef.current.scrollTop = commentaryRef.current.scrollHeight;
    }
  }, [commentary]);

  const loadData = useCallback(async () => {
    const data = await fetchLiveData();
    setProposals(data.proposals);
    setVotes(data.votes);
    setCommentary(data.commentary);
    // Sync to admin-controlled index if present
    if (data.meetingState !== null) {
      const idx = Math.max(0, Math.min(data.meetingState.current_proposal_index, data.proposals.length - 1));
      setCurrentIdx(idx);
      setDecision(data.meetingState.decision);
    }
    setLastRefresh(new Date());
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15_000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setCurrentIdx((i) => Math.min(i + 1, proposals.length - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setCurrentIdx((i) => Math.max(i - 1, 0));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [proposals.length]);

  const toggleAgendaItem = (id: string) => {
    setAgendaItems((prev) => prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
  };

  const currentProposal = proposals[currentIdx];
  const { tally, voters, total } = currentProposal
    ? getTally(currentProposal.proposal_id, votes)
    : { tally: { yes: 0, no: 0, abstain: 0 }, voters: [], total: 0 };

  const latestCommentary = commentary[commentary.length - 1];

  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  return (
    <>
      <Head>
        <title>BMFFFL Meeting Live</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-[#07070d] text-white flex flex-col select-none" style={{ fontFamily: 'system-ui, sans-serif' }}>

        {/* ── TOP BAR ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <span className="text-[#ffd700] text-2xl font-black tracking-tight">🏈 BMFFFL</span>
            <span className="text-gray-500 text-lg">2026 Owners Meeting</span>
            <span className="text-gray-700 text-sm">May 26 · 9:00 PM ET</span>
          </div>
          <div className="flex items-center gap-6 text-gray-400">
            <button onClick={loadData} className="flex items-center gap-1.5 text-sm hover:text-white transition-colors">
              <RefreshCw size={14} />
              {lastRefresh
                ? `Updated ${lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : 'Loading…'}
            </button>
            <span className="text-white font-mono text-lg">{timeStr}</span>
          </div>
        </div>

        {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
        <div className="flex flex-1 overflow-hidden">

          {/* Agenda sidebar */}
          <div className="w-64 flex-shrink-0 border-r border-gray-800 p-6 flex flex-col gap-6">
            <AgendaSidebar
              items={agendaItems}
              activeIndex={activeAgenda}
              onToggle={toggleAgendaItem}
            />
            <div className="mt-auto text-gray-700 text-xs">
              Click item to check off<br />
              ← → to navigate proposals
            </div>
          </div>

          {/* Center — current proposal */}
          <div className="flex-1 flex flex-col px-10 py-8">
            {proposals.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-600 text-2xl">No proposals submitted yet</p>
                  <p className="text-gray-700 text-base mt-2">Visit bmfffl.vercel.app/meeting to submit</p>
                </div>
              </div>
            ) : (
              <>
                {/* Proposal header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-sm font-bold px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: `${CATEGORY_COLORS[currentProposal?.category] ?? '#6b7280'}20`,
                        color: CATEGORY_COLORS[currentProposal?.category] ?? '#6b7280',
                        border: `1px solid ${CATEGORY_COLORS[currentProposal?.category] ?? '#6b7280'}40`,
                      }}
                    >
                      {currentProposal?.category}
                    </span>
                    <span className="text-gray-500 text-sm">by {currentProposal?.owner_name}</span>
                    {decision === 'passed' && (
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 uppercase tracking-wider">
                        ✓ Passed
                      </span>
                    )}
                    {decision === 'failed' && (
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 uppercase tracking-wider">
                        ✗ Failed
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCurrentIdx((i) => Math.max(i - 1, 0))}
                      disabled={currentIdx === 0}
                      className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-30 transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="text-gray-400 text-sm font-mono">
                      {currentIdx + 1} / {proposals.length}
                    </span>
                    <button
                      onClick={() => setCurrentIdx((i) => Math.min(i + 1, proposals.length - 1))}
                      disabled={currentIdx === proposals.length - 1}
                      className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-30 transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                {/* Proposal title */}
                <h1 className="text-4xl font-bold text-white leading-tight mb-4">
                  {currentProposal?.title}
                </h1>

                {/* Proposal text */}
                <p className="text-gray-300 text-xl leading-relaxed mb-2">
                  {currentProposal?.proposal}
                </p>
                {currentProposal?.reasoning && (
                  <p className="text-gray-500 text-base leading-relaxed mt-3 italic">
                    "{currentProposal.reasoning}"
                  </p>
                )}

                {/* Vote tallies */}
                <div className="mt-8 space-y-3">
                  <VoteBar label="YES" count={tally.yes} total={Math.max(total, 1)} color="#22c55e" />
                  <VoteBar label="NO" count={tally.no} total={Math.max(total, 1)} color="#ef4444" />
                  <VoteBar label="ABSTAIN" count={tally.abstain} total={Math.max(total, 1)} color="#6b7280" />
                </div>

                {/* Voter list */}
                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  <span className="text-gray-600 text-sm">{total} votes cast:</span>
                  {voters.map((v) => (
                    <span key={v} className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded">
                      {v}
                    </span>
                  ))}
                  {total === 0 && (
                    <span className="text-gray-700 text-sm">
                      No votes yet — use bmfffl.vercel.app/meeting to vote
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right panel — proposal index */}
          <div className="w-52 flex-shrink-0 border-l border-gray-800 p-5 overflow-y-auto">
            <h2 className="text-gray-600 text-xs font-semibold uppercase tracking-widest mb-3">All proposals</h2>
            <div className="space-y-1.5">
              {proposals.map((p, i) => {
                const { tally: t, total: tot } = getTally(p.proposal_id, votes);
                const passed = tot > 0 && t.yes > t.no;
                return (
                  <button
                    key={p.proposal_id}
                    onClick={() => setCurrentIdx(i)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg transition-all text-xs ${
                      i === currentIdx
                        ? 'bg-[#ffd700]/10 border border-[#ffd700]/30 text-white'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
                    }`}
                  >
                    <div className="font-medium leading-snug truncate">{p.title}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-gray-700">{p.category.split(' ')[0]}</span>
                      {tot > 0 && (
                        <span className={passed ? 'text-green-500' : 'text-red-500'}>
                          {t.yes}–{t.no}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── BIMFLÉ COMMENTARY BAR ─────────────────────────────────── */}
        <div className="border-t border-gray-800 px-8 py-4 flex items-start gap-4 min-h-[80px]">
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="text-2xl">🎩</span>
            <span className="text-[#ffd700] font-bold text-sm">Bimflé says:</span>
          </div>
          <div
            ref={commentaryRef}
            className="flex-1 overflow-y-auto max-h-16 text-gray-300 text-base leading-relaxed"
          >
            {latestCommentary ? (
              <span>{latestCommentary.text}</span>
            ) : (
              <span className="text-gray-700 italic">
                Standing by. Relay questions via Telegram and I shall respond forthwith.
              </span>
            )}
          </div>
          {commentary.length > 1 && (
            <span className="text-gray-700 text-xs flex-shrink-0">{commentary.length} notes</span>
          )}
        </div>

      </div>
    </>
  );
}
