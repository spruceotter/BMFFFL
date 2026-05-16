/**
 * BMFFFL Meeting Admin — /meeting-admin
 *
 * Commissioner control panel for the owners meeting Google Meet stage.
 * Controls what /meeting-live displays via Convex.
 *
 * Controls:
 *   - Navigate proposals (← →) → writes meeting_state to Convex → /meeting-live follows
 *   - Post pre-written Bimflé commentary → writes bimfle_commentary → appears on stage bar
 *   - Mark proposal passed/failed → stage shows result overlay
 *   - Live Q&A: type a question → Bimflé responds via daemon
 */

import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, MessageSquare, Send } from 'lucide-react';

const CONVEX_URL = 'https://resolute-setter-416.convex.cloud';

// Pre-written Bimflé commentary per proposal category/topic
const PREPARED_COMMENTARY: Record<string, string[]> = {
  'Ratify Roster 9': [
    'The ownership question is straightforward: continuity requires a steward. If the YES vote carried, Roster 9 proceeds to dispersal. Commissioner decides the tiebreaker. Either way, the dispersal runs before June 5.',
    'Eleven seasons of precedent say the roster stays at 12. The only question is who holds the keys.',
  ],
  'IR slots': [
    "IR slots serve a legitimate purpose — dynasty injury horizons run 10+ weeks. Turning them off year-round creates roster anxiety without tactical benefit. My recommendation: IR on during the regular season, off during offseason.",
    "Without IR, a CeeDee Lamb foot injury in Week 2 forces a difficult choice. With IR, you manage the season. The downside risk is minimal.",
  ],
  'FAAB refresh': [
    "Escuelas's $9.86 FAAB should follow the roster, not the man — give it to the new owner as part of the transition. The refresh question is separate: standard refresh proceeds normally.",
    "Three options: (A) FAAB transfers to new owner, (B) FAAB enters dispersal pool, (C) forfeited. I'd recommend A — simplest, cleanest, precedented in other leagues.",
  ],
  'Expanded dispersal': [
    "MLSchools12 said he'd enter dispersal only with enough teams for a fair shot. That's the right instinct — a 3-team dispersal gives minimal choice. Five or more creates real optionality. Vote to remove the cap.",
    "The dispersal pool depth directly determines the new owner's team quality. Thin pool = weak new team = competitive imbalance. More participants = healthier outcome for the league.",
  ],
  'Generic': [
    "The evidence suggests this rule change nets positive. The risk is adaptation lag — owners will adjust their strategies within a season.",
    "I've reviewed the historical precedent from the ESPN era through Sleeper. The league has evolved on this before and survived. Proceed.",
    "This is a commissioner call at the margins. My read: if the vote is close, table it and revisit in September after seeing how the season plays out.",
  ],
};

interface RuleProposal {
  proposal_id: string;
  owner_name: string;
  category: string;
  title: string;
  proposal: string;
  submitted_at: string;
}

interface MeetingState {
  current_proposal_index: number;
  decision?: 'passed' | 'failed' | null;
  updated_at: string;
}

async function convexMutation(path: string, args: Record<string, unknown>): Promise<void> {
  await fetch(`${CONVEX_URL}/api/mutation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, format: 'json', args }),
  });
}

async function fetchData(): Promise<{ proposals: RuleProposal[]; meetingState: MeetingState | null }> {
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
    const json = await resp.json();
    const tasks = (json.value ?? []) as { task_type: string; payload: unknown; _creationTime?: number }[];

    const proposals: RuleProposal[] = tasks
      .filter((t) => t.task_type === 'rule_proposal')
      .map((t) => t.payload as RuleProposal)
      .sort((a, b) => a.submitted_at.localeCompare(b.submitted_at));

    const stateTask = tasks
      .filter((t) => t.task_type === 'meeting_state')
      .sort((a, b) => (b._creationTime ?? 0) - (a._creationTime ?? 0))[0];

    const meetingState = stateTask ? (stateTask.payload as MeetingState) : null;

    return { proposals, meetingState };
  } catch {
    return { proposals: [], meetingState: null };
  }
}

async function setProposalIndex(index: number, decision: 'passed' | 'failed' | null = null) {
  await convexMutation('bmfffl:createTask', {
    task_id: `meeting-state-${Date.now()}`,
    from_agent: 'meeting_admin',
    to_agent: 'bimfle',
    task_type: 'meeting_state',
    payload: { current_proposal_index: index, decision, updated_at: new Date().toISOString() },
  });
}

async function postCommentary(text: string) {
  await convexMutation('bmfffl:createTask', {
    task_id: `bimfle-commentary-${Date.now()}`,
    from_agent: 'meeting_admin',
    to_agent: 'bimfle',
    task_type: 'bimfle_commentary',
    payload: { text, submitted_at: new Date().toISOString() },
  });
}

async function postQuestion(question: string) {
  await convexMutation('bmfffl:createTask', {
    task_id: `bimfle-question-${Date.now()}`,
    from_agent: 'meeting_admin',
    to_agent: 'bimfle',
    task_type: 'bimfle_question',
    payload: { question, submitted_at: new Date().toISOString() },
  });
}

export default function MeetingAdminPage() {
  const [proposals, setProposals] = useState<RuleProposal[]>([]);
  const [meetingState, setMeetingState] = useState<MeetingState | null>(null);
  const [localIdx, setLocalIdx] = useState(0);
  const [qaText, setQaText] = useState('');
  const [qaState, setQaState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [commentaryState, setCommentaryState] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const currentIdx = meetingState?.current_proposal_index ?? localIdx;
  const currentProposal = proposals[currentIdx];

  const loadData = useCallback(async () => {
    const data = await fetchData();
    setProposals(data.proposals);
    if (data.meetingState) {
      setMeetingState(data.meetingState);
      setLocalIdx(data.meetingState.current_proposal_index);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10_000);
    return () => clearInterval(interval);
  }, [loadData]);

  const navigate = async (newIdx: number, decision: 'passed' | 'failed' | null = null) => {
    setLocalIdx(newIdx);
    setMeetingState({ current_proposal_index: newIdx, decision, updated_at: new Date().toISOString() });
    await setProposalIndex(newIdx, decision);
    setLastAction(decision ? `Marked ${decision}` : `Moved to proposal ${newIdx + 1}`);
  };

  const handleCommentary = async (text: string) => {
    setCommentaryState(text.slice(0, 40) + '…');
    await postCommentary(text);
    setLastAction('Commentary posted to stage');
    setTimeout(() => setCommentaryState(null), 3000);
  };

  const handleQA = async () => {
    if (!qaText.trim()) return;
    setQaState('sending');
    await postQuestion(qaText);
    setQaState('sent');
    setLastAction(`Question sent: "${qaText.slice(0, 40)}"`);
    setQaText('');
    setTimeout(() => setQaState('idle'), 3000);
  };

  // Get commentary options for current proposal
  const getCommentaryOptions = () => {
    if (!currentProposal) return PREPARED_COMMENTARY['Generic'];
    const title = currentProposal.title;
    for (const [key, lines] of Object.entries(PREPARED_COMMENTARY)) {
      if (key !== 'Generic' && title.toLowerCase().includes(key.toLowerCase())) {
        return [...lines, ...PREPARED_COMMENTARY['Generic']];
      }
    }
    return PREPARED_COMMENTARY['Generic'];
  };

  const categoryColor: Record<string, string> = {
    'Dispersal / Ownership': '#ef4444',
    'Roster Format': '#3b82f6',
    'FAAB / Waivers': '#f97316',
    'Trades': '#14b8a6',
    'Playoffs': '#eab308',
    'Scoring': '#a855f7',
    'Season Schedule': '#6366f1',
    'Other': '#6b7280',
  };

  return (
    <>
      <Head>
        <title>Meeting Admin — BMFFFL</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-[#070710] text-white">
        {/* Header */}
        <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              🎛️ Meeting Admin
              <span className="text-xs font-normal text-gray-500 ml-2">Commissioner Controls</span>
            </h1>
            <p className="text-xs text-gray-600">Controls /meeting-live stage via Convex · Auto-refreshes every 10s</p>
          </div>
          {lastAction && (
            <div className="text-xs text-green-400 bg-green-900/30 border border-green-700 px-3 py-1.5 rounded">
              ✓ {lastAction}
            </div>
          )}
        </div>

        <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">

          {/* ── PROPOSAL NAVIGATION ────────────────────────────────────── */}
          <section className="bg-gray-900/60 border border-gray-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
              Stage Control — Current Proposal
            </h2>

            {proposals.length === 0 ? (
              <p className="text-gray-600 text-sm">No proposals loaded yet — check /meeting to see if they submitted.</p>
            ) : (
              <>
                {/* Current proposal display */}
                <div className="bg-gray-800/60 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs px-2 py-0.5 rounded font-medium"
                      style={{
                        color: categoryColor[currentProposal?.category] ?? '#6b7280',
                        backgroundColor: `${categoryColor[currentProposal?.category] ?? '#6b7280'}20`,
                      }}
                    >
                      {currentProposal?.category}
                    </span>
                    <span className="text-gray-500 text-xs">by {currentProposal?.owner_name}</span>
                    <span className="text-gray-700 text-xs ml-auto">{currentIdx + 1} / {proposals.length}</span>
                  </div>
                  <p className="text-white font-semibold text-base">{currentProposal?.title}</p>
                  <p className="text-gray-400 text-sm mt-1 leading-relaxed line-clamp-2">{currentProposal?.proposal}</p>
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={() => navigate(Math.max(0, currentIdx - 1))}
                    disabled={currentIdx === 0}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-30 transition-colors text-sm"
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>
                  <button
                    onClick={() => navigate(Math.min(proposals.length - 1, currentIdx + 1))}
                    disabled={currentIdx === proposals.length - 1}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-30 transition-colors text-sm"
                  >
                    Next <ChevronRight size={16} />
                  </button>

                  <div className="ml-auto flex items-center gap-2">
                    <button
                      onClick={() => navigate(currentIdx, 'passed')}
                      className="flex items-center gap-1.5 px-4 py-2 bg-green-800/60 hover:bg-green-700/60 border border-green-600 rounded-lg transition-colors text-sm text-green-300"
                    >
                      <CheckCircle size={14} /> Mark Passed
                    </button>
                    <button
                      onClick={() => navigate(currentIdx, 'failed')}
                      className="flex items-center gap-1.5 px-4 py-2 bg-red-900/60 hover:bg-red-800/60 border border-red-700 rounded-lg transition-colors text-sm text-red-300"
                    >
                      <XCircle size={14} /> Mark Failed
                    </button>
                  </div>
                </div>

                {/* Quick jump */}
                <div className="flex flex-wrap gap-1.5">
                  {proposals.map((p, i) => (
                    <button
                      key={p.proposal_id}
                      onClick={() => navigate(i)}
                      className={`text-xs px-2.5 py-1 rounded transition-colors ${
                        i === currentIdx
                          ? 'bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/40'
                          : 'bg-gray-800 text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {i + 1}. {p.title.slice(0, 25)}{p.title.length > 25 ? '…' : ''}
                    </button>
                  ))}
                </div>
              </>
            )}
          </section>

          {/* ── BIMFLÉ COMMENTARY ─────────────────────────────────────── */}
          <section className="bg-gray-900/60 border border-gray-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wider flex items-center gap-2">
              🎩 Bimflé Commentary
            </h2>
            <p className="text-gray-600 text-xs mb-4">Click to post to the stage's Bimflé bar. Appears on /meeting-live immediately.</p>

            {commentaryState && (
              <div className="mb-3 text-xs text-green-400 bg-green-900/20 border border-green-800 px-3 py-2 rounded">
                ✓ Posted: "{commentaryState}"
              </div>
            )}

            <div className="space-y-2">
              {getCommentaryOptions().map((line, i) => (
                <button
                  key={i}
                  onClick={() => handleCommentary(line)}
                  className="w-full text-left px-3 py-2.5 bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700 hover:border-gray-500 rounded-lg text-sm text-gray-300 leading-relaxed transition-all"
                >
                  "{line.slice(0, 120)}{line.length > 120 ? '…' : ''}"
                </button>
              ))}
            </div>

            {/* Custom commentary */}
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={qaText.startsWith('COMMENTARY:') ? qaText.slice(11) : ''}
                onChange={(e) => setQaText(`COMMENTARY:${e.target.value}`)}
                placeholder="Or type custom commentary to post to stage…"
                className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ffd700] placeholder-gray-600"
              />
              <button
                onClick={() => {
                  if (qaText.startsWith('COMMENTARY:')) {
                    handleCommentary(qaText.slice(11));
                    setQaText('');
                  }
                }}
                disabled={!qaText.startsWith('COMMENTARY:') || qaText.length < 13}
                className="px-4 py-2 bg-[#ffd700] text-black font-bold rounded-lg text-sm disabled:opacity-40 hover:bg-yellow-300 transition-colors"
              >
                Post
              </button>
            </div>
          </section>

          {/* ── LIVE Q&A ──────────────────────────────────────────────── */}
          <section className="bg-gray-900/60 border border-gray-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare size={14} /> Live Q&A — Ask Bimflé
            </h2>
            <p className="text-gray-600 text-xs mb-4">
              Type a question mid-meeting → sends to Bimflé via Telegram → response appears on stage bar (~30s).
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={qaState !== 'sending' && !qaText.startsWith('COMMENTARY:') ? qaText : ''}
                onChange={(e) => setQaText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQA()}
                placeholder="Ask Bimflé anything during the meeting…"
                className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ffd700] placeholder-gray-600"
              />
              <button
                onClick={handleQA}
                disabled={qaState === 'sending' || !qaText.trim() || qaText.startsWith('COMMENTARY:')}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white font-medium rounded-lg text-sm disabled:opacity-40 transition-colors"
              >
                <Send size={14} />
                {qaState === 'sending' ? 'Sending…' : qaState === 'sent' ? 'Sent ✓' : 'Ask'}
              </button>
            </div>
          </section>

          {/* ── STATUS ────────────────────────────────────────────────── */}
          <section className="bg-gray-900/40 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span>Proposals loaded: <span className="text-gray-400">{proposals.length}</span></span>
              <span>Stage at: <span className="text-gray-400">Proposal {currentIdx + 1}</span></span>
              <span>Decision: <span className={meetingState?.decision === 'passed' ? 'text-green-400' : meetingState?.decision === 'failed' ? 'text-red-400' : 'text-gray-500'}>{meetingState?.decision ?? 'none'}</span></span>
              <a href="/meeting-live" target="_blank" rel="noopener noreferrer" className="ml-auto text-[#ffd700] hover:underline">
                Open /meeting-live ↗
              </a>
              <a href="/meeting" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                Open /meeting ↗
              </a>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
