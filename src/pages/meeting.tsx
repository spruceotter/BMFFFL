/**
 * BMFFFL Owners Meeting — Availability Poll + Rule Change Hub
 * /meeting
 *
 * Section 1: Availability poll (dates that work for owners)
 * Section 2: Propose a rule change (submit proposals before the meeting)
 * Section 3: Submitted proposals (visible to all; live voting during meeting)
 */

import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, Calendar, Users, RefreshCw, ClipboardList, Vote, ChevronDown, ChevronUp, BookOpen, Gavel, Lightbulb } from 'lucide-react';

// ─── Config ──────────────────────────────────────────────────────────────────

const CONVEX_URL = 'https://resolute-setter-416.convex.cloud';

const OWNERS = [
  'Grandes',
  'SexMachineAndyD',
  'rbr',
  'Cogdeill11',
  'MLSchools12',
  'Cmaleski',
  'eldridm20',
  'JuicyBussy',
  'eldridsm',
  'tdtd19844',
  'Tubes94',
];

const RULE_CATEGORIES = [
  'Scoring',
  'Roster Format',
  'FAAB / Waivers',
  'Trades',
  'Playoffs',
  'Dispersal / Ownership',
  'Season Schedule',
  'Other',
];

// May 18 (Mon) through May 30 (Sat) — 13 days
const DATES: { key: string; label: string; short: string; dayOfWeek: string }[] = [
  { key: '2026-05-18', label: 'Mon May 18', short: 'M 5/18', dayOfWeek: 'Mon' },
  { key: '2026-05-19', label: 'Tue May 19', short: 'T 5/19', dayOfWeek: 'Tue' },
  { key: '2026-05-20', label: 'Wed May 20', short: 'W 5/20', dayOfWeek: 'Wed' },
  { key: '2026-05-21', label: 'Thu May 21', short: 'Th 5/21', dayOfWeek: 'Thu' },
  { key: '2026-05-22', label: 'Fri May 22', short: 'F 5/22', dayOfWeek: 'Fri' },
  { key: '2026-05-23', label: 'Sat May 23', short: 'Sa 5/23', dayOfWeek: 'Sat' },
  { key: '2026-05-24', label: 'Sun May 24', short: 'Su 5/24', dayOfWeek: 'Sun' },
  { key: '2026-05-25', label: 'Mon May 25', short: 'M 5/25', dayOfWeek: 'Mon' },
  { key: '2026-05-26', label: 'Tue May 26', short: 'T 5/26', dayOfWeek: 'Tue' },
  { key: '2026-05-27', label: 'Wed May 27', short: 'W 5/27', dayOfWeek: 'Wed' },
  { key: '2026-05-28', label: 'Thu May 28', short: 'Th 5/28', dayOfWeek: 'Thu' },
  { key: '2026-05-29', label: 'Fri May 29', short: 'F 5/29', dayOfWeek: 'Fri' },
  { key: '2026-05-30', label: 'Sat May 30', short: 'Sa 5/30', dayOfWeek: 'Sat' },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface PollResponse {
  owner_name: string;
  available_dates: string[];
  submitted_at: string;
}

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

// ─── Convex helpers ───────────────────────────────────────────────────────────

async function convexMutation(path: string, args: Record<string, unknown>): Promise<void> {
  const resp = await fetch(`${CONVEX_URL}/api/mutation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, format: 'json', args }),
  });
  if (!resp.ok) throw new Error('Mutation failed');
}

async function convexQuery<T>(path: string, args: Record<string, unknown>): Promise<T[]> {
  const resp = await fetch(`${CONVEX_URL}/api/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, format: 'json', args }),
  });
  if (!resp.ok) return [];
  const json = await resp.json();
  return (json.value ?? []) as T[];
}

async function submitAvailability(owner_name: string, available_dates: string[]): Promise<void> {
  await convexMutation('bmfffl:createTask', {
    task_id: `meeting-poll-${owner_name}-${Date.now()}`,
    from_agent: 'web_form',
    to_agent: 'bimfle',
    task_type: 'meeting_poll',
    payload: { owner_name, available_dates, submitted_at: new Date().toISOString() },
  });
}

async function submitProposal(p: Omit<RuleProposal, 'submitted_at'>): Promise<void> {
  const submitted_at = new Date().toISOString();
  await convexMutation('bmfffl:createTask', {
    task_id: `rule-proposal-${p.proposal_id}`,
    from_agent: 'web_form',
    to_agent: 'bimfle',
    task_type: 'rule_proposal',
    payload: { ...p, submitted_at },
  });
}

async function submitVote(vote: RuleVote): Promise<void> {
  await convexMutation('bmfffl:createTask', {
    task_id: `rule-vote-${vote.proposal_id}-${vote.owner_name}`,
    from_agent: 'web_form',
    to_agent: 'bimfle',
    task_type: 'rule_vote',
    payload: { ...vote, submitted_at: new Date().toISOString() },
  });
}

async function fetchAllData(): Promise<{
  pollResponses: PollResponse[];
  proposals: RuleProposal[];
  votes: RuleVote[];
}> {
  const tasks = await convexQuery<{ task_type: string; payload: unknown }>(
    'bmfffl:getPendingTasksFor',
    { to_agent: 'bimfle' }
  );

  const pollResponses: PollResponse[] = [];
  const proposals: RuleProposal[] = [];
  const votes: RuleVote[] = [];

  for (const t of tasks) {
    if (t.task_type === 'meeting_poll') pollResponses.push(t.payload as PollResponse);
    if (t.task_type === 'rule_proposal') proposals.push(t.payload as RuleProposal);
    if (t.task_type === 'rule_vote') votes.push(t.payload as RuleVote);
  }

  return { pollResponses, proposals, votes };
}

// ─── Availability Results Grid ────────────────────────────────────────────────

function ResultsGrid({ responses }: { responses: PollResponse[] }) {
  if (responses.length === 0) {
    return (
      <p className="text-gray-500 text-sm text-center py-8">
        No responses yet — be the first.
      </p>
    );
  }

  const latestByOwner = new Map<string, PollResponse>();
  responses.forEach((r) => {
    const existing = latestByOwner.get(r.owner_name);
    if (!existing || r.submitted_at > existing.submitted_at) {
      latestByOwner.set(r.owner_name, r);
    }
  });

  const ownerList = [...latestByOwner.keys()];
  const dateCount = new Map<string, number>();
  DATES.forEach((d) => {
    let count = 0;
    latestByOwner.forEach((r) => {
      if (r.available_dates.includes(d.key)) count++;
    });
    dateCount.set(d.key, count);
  });

  const maxCount = Math.max(...dateCount.values(), 0);
  const bestDates = DATES.filter((d) => dateCount.get(d.key) === maxCount && maxCount > 0);

  return (
    <div className="mt-2">
      {bestDates.length > 0 && (
        <div className="mb-4 p-3 bg-green-900/40 border border-green-600 rounded-lg">
          <p className="text-green-400 font-semibold text-sm">
            🏆 Best date{bestDates.length > 1 ? 's' : ''} ({maxCount}/{ownerList.length} available):{' '}
            {bestDates.map((d) => d.label).join(', ')}
          </p>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="text-xs w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left text-gray-400 font-normal py-1 pr-3 min-w-[100px]">Owner</th>
              {DATES.map((d) => (
                <th
                  key={d.key}
                  className={`text-center px-1 py-1 font-normal min-w-[36px] ${
                    bestDates.some((b) => b.key === d.key) ? 'text-green-400 font-bold' : 'text-gray-400'
                  }`}
                >
                  <span className="block">{d.dayOfWeek}</span>
                  <span className="block">{d.short.split(' ')[1]}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ownerList.map((owner) => {
              const r = latestByOwner.get(owner)!;
              return (
                <tr key={owner} className="border-t border-gray-700/50">
                  <td className="py-1.5 pr-3 text-gray-300 font-medium whitespace-nowrap">{owner}</td>
                  {DATES.map((d) => (
                    <td key={d.key} className="text-center py-1.5 px-1">
                      {r.available_dates.includes(d.key) ? (
                        <span className="text-green-500 text-base">✓</span>
                      ) : (
                        <span className="text-gray-700">·</span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
            <tr className="border-t border-gray-600">
              <td className="py-1.5 pr-3 text-gray-500 text-xs">Total</td>
              {DATES.map((d) => {
                const count = dateCount.get(d.key) ?? 0;
                const isBest = bestDates.some((b) => b.key === d.key);
                return (
                  <td key={d.key} className={`text-center py-1.5 px-1 font-bold ${isBest ? 'text-green-400' : count > 0 ? 'text-gray-400' : 'text-gray-700'}`}>
                    {count}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-gray-600 text-xs mt-3">
        {ownerList.length} of {OWNERS.length} owners responded
        {OWNERS.filter((o) => !ownerList.includes(o)).length > 0 && (
          <> — waiting on: {OWNERS.filter((o) => !ownerList.includes(o)).join(', ')}</>
        )}
      </p>
    </div>
  );
}

// ─── Proposal Card ────────────────────────────────────────────────────────────

function ProposalCard({
  proposal,
  votes,
  activeVoter,
  onVote,
  propositionLabel,
}: {
  proposal: RuleProposal;
  votes: RuleVote[];
  activeVoter: string;
  onVote: (proposalId: string, vote: 'yes' | 'no' | 'abstain') => void;
  propositionLabel?: string;
}) {
  const [expanded, setExpanded] = useState(false);

  // Latest vote per owner
  const latestVotes = new Map<string, RuleVote>();
  votes
    .filter((v) => v.proposal_id === proposal.proposal_id)
    .sort((a, b) => a.submitted_at.localeCompare(b.submitted_at))
    .forEach((v) => latestVotes.set(v.owner_name, v));

  const tally = { yes: 0, no: 0, abstain: 0 };
  latestVotes.forEach((v) => {
    tally[v.vote]++;
  });

  const myVote = activeVoter ? latestVotes.get(activeVoter)?.vote : undefined;
  const total = tally.yes + tally.no + tally.abstain;

  const categoryColor: Record<string, string> = {
    'Scoring': 'bg-purple-900/60 text-purple-300 border-purple-700',
    'Roster Format': 'bg-blue-900/60 text-blue-300 border-blue-700',
    'FAAB / Waivers': 'bg-orange-900/60 text-orange-300 border-orange-700',
    'Trades': 'bg-teal-900/60 text-teal-300 border-teal-700',
    'Playoffs': 'bg-yellow-900/60 text-yellow-300 border-yellow-700',
    'Dispersal / Ownership': 'bg-red-900/60 text-red-300 border-red-700',
    'Season Schedule': 'bg-indigo-900/60 text-indigo-300 border-indigo-700',
    'Other': 'bg-gray-800/60 text-gray-400 border-gray-600',
  };
  const catClass = categoryColor[proposal.category] ?? categoryColor['Other'];

  return (
    <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {propositionLabel && (
            <span className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/30 flex items-center justify-center text-xs font-black text-[#ffd700]">
              {propositionLabel}
            </span>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-xs px-2 py-0.5 rounded border font-medium ${catClass}`}>
                {proposal.category}
              </span>
              <span className="text-gray-500 text-xs">{proposal.owner_name}</span>
            </div>
            <h3 className="text-white font-semibold text-sm leading-snug">
              {propositionLabel ? `Proposition ${propositionLabel} — ` : ''}{proposal.title}
            </h3>
          </div>
        </div>
        <button
          onClick={() => setExpanded((e) => !e)}
          className="text-gray-500 hover:text-gray-300 flex-shrink-0 mt-0.5"
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Expandable detail */}
      {expanded && (
        <div className="mt-3 space-y-2 border-t border-gray-700/50 pt-3">
          <p className="text-gray-300 text-sm leading-relaxed">{proposal.proposal}</p>
          {proposal.reasoning && (
            <div>
              <p className="text-gray-500 text-xs font-medium mb-0.5">Reasoning</p>
              <p className="text-gray-400 text-sm leading-relaxed">{proposal.reasoning}</p>
            </div>
          )}
        </div>
      )}

      {/* Vote tally + controls */}
      <div className="mt-3 pt-3 border-t border-gray-700/50">
        {/* Tally bar */}
        {total > 0 && (
          <div className="mb-2">
            <div className="flex gap-3 text-xs mb-1">
              <span className="text-green-400">✓ {tally.yes} yes</span>
              <span className="text-red-400">✗ {tally.no} no</span>
              {tally.abstain > 0 && <span className="text-gray-500">— {tally.abstain} abstain</span>}
              <span className="text-gray-600 ml-auto">{total} votes</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden flex">
              {tally.yes > 0 && (
                <div className="bg-green-500 h-full" style={{ width: `${(tally.yes / total) * 100}%` }} />
              )}
              {tally.no > 0 && (
                <div className="bg-red-500 h-full" style={{ width: `${(tally.no / total) * 100}%` }} />
              )}
              {tally.abstain > 0 && (
                <div className="bg-gray-600 h-full" style={{ width: `${(tally.abstain / total) * 100}%` }} />
              )}
            </div>
          </div>
        )}

        {/* Vote buttons */}
        {activeVoter && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-gray-500 text-xs mr-1">Your vote:</span>
            {(['yes', 'no', 'abstain'] as const).map((v) => (
              <button
                key={v}
                onClick={() => onVote(proposal.proposal_id, v)}
                className={`px-2.5 py-1 rounded text-xs font-medium border transition-all ${
                  myVote === v
                    ? v === 'yes'
                      ? 'bg-green-600 border-green-500 text-white'
                      : v === 'no'
                      ? 'bg-red-700 border-red-600 text-white'
                      : 'bg-gray-600 border-gray-500 text-white'
                    : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-400'
                }`}
              >
                {v === 'yes' ? '✓ Yes' : v === 'no' ? '✗ No' : '— Abstain'}
              </button>
            ))}
            {myVote && <span className="text-gray-600 text-xs">voted</span>}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Commissioner Propositions (pre-seeded agenda items) ──────────────────────

interface PropOption {
  label: string;
  description: string;
}

interface CommissionerProposition {
  id: string;          // 'A', 'B', 'C' …
  category: string;
  title: string;
  context: string;
  options: PropOption[];
  recommendation?: string;
}

const COMMISSIONER_PROPOSITIONS: CommissionerProposition[] = [
  {
    id: 'A',
    category: 'FAAB / Waivers',
    title: 'Disposition of Orphan FAAB Balance (MCSchools / Escuelas)',
    context:
      'The departing Escuelas team left behind ~986 FAAB currently held in stewardship (mapped to TBD - Orphan Roster pending new owner placement). ' +
      'The league must decide what happens to these funds before the new owner joins.',
    options: [
      {
        label: 'Option 1 — Transfer to new owner',
        description:
          'The new owner receives the orphan\'s full current FAAB balance as their starting funds. Preserves the asset and rewards the incoming owner for taking on the inherited roster.',
      },
      {
        label: 'Option 2 — Pro-rata redistribution to remaining owners',
        description:
          'The ~986 orphan FAAB is distributed proportionally across the remaining 11 active owners. Small boost for everyone; new owner starts fresh.',
      },
      {
        label: 'Option 3 — Retire to treasury',
        description:
          'The orphan FAAB is removed from circulation entirely, reducing total outstanding FAAB (currently 14,283) and slightly improving the DOGE sell rate for all active owners.',
      },
    ],
    recommendation:
      'Option 1 — transfer to new owner. Keeps the asset whole, gives the new owner a fair starting cushion, and avoids the administrative overhead of redistribution.',
  },
  {
    id: 'B',
    category: 'FAAB / Waivers',
    title: 'New Owner Starting FAAB',
    context:
      'Regardless of Proposition A\'s outcome, the league should formally decide what FAAB the incoming owner begins their first season with.',
    options: [
      {
        label: 'Option 1 — Inherit orphan balance (dependent on Prop A, Option 1)',
        description:
          'If Prop A passes Option 1, this is automatically settled: new owner starts with ~986 FAAB.',
      },
      {
        label: 'Option 2 — League median / average',
        description:
          'New owner starts with the league\'s current median FAAB balance (~1,189 FAAB based on 14,283 total / 12 teams). Puts them in the middle of the pack.',
      },
      {
        label: 'Option 3 — Last-place starting grant',
        description:
          'New owner starts with a fixed new-owner grant equivalent to the last-place refresh cap (832 FAAB). Acknowledges they\'re entering mid-dynasty with no history.',
      },
      {
        label: 'Option 4 — Zero FAAB',
        description:
          'New owner starts with $0 and must purchase their starting FAAB at the annual refresh. Only viable if refresh happens BEFORE the dispersal draft — see Proposition D.',
      },
    ],
    recommendation:
      'If Prop A → Option 1: inherit orphan balance. Otherwise, league average is a fair and simple middle ground.',
  },
  {
    id: 'C',
    category: 'Dispersal / Ownership',
    title: 'Dispersal Team FAAB — What Happens to Participating Teams\' Balances',
    context:
      'Teams contributing their full rosters + picks to the dispersal pool are giving up significant assets. The league should clarify whether and how their FAAB balances are affected.',
    options: [
      {
        label: 'Option 1 — Dispersal teams keep 100% of their FAAB',
        description:
          'No FAAB adjustment for dispersal participation. Teams contribute roster assets only. Their FAAB is unaffected and available for the upcoming season.',
      },
      {
        label: 'Option 2 — Dispersal teams contribute a fixed amount to the new owner',
        description:
          'Each dispersal team transfers a set amount (e.g., 100–200 FAAB) to the new owner as part of the dispersal package. Supplements the new owner\'s starting balance.',
      },
      {
        label: 'Option 3 — Dispersal teams\' FAAB is frozen during the dispersal draft',
        description:
          'FAAB remains with dispersal teams but cannot be used during the dispersal draft itself. Prevents dispersal participants from having an edge in bidding on their own contributed players.',
      },
    ],
    recommendation:
      'Option 1 with a clarifying note: dispersal teams keep their FAAB. The dispersal draft is a roster draft, not a waiver auction — FAAB doesn\'t play a role in the dispersal process itself.',
  },
  {
    id: 'D',
    category: 'FAAB / Waivers',
    title: 'Annual Refresh Timing — Before or After Dispersal Draft?',
    context:
      'The 2026 DogeFAAB annual refresh buy window is currently on hold pending this decision. ' +
      'Whether the refresh opens before or after the dispersal draft has cascading effects on what FAAB teams have available and when the new owner gets their initial refresh. ' +
      'This must be decided before Proposition E (refresh caps) can be finalized.',
    options: [
      {
        label: 'Option 1 — Refresh BEFORE dispersal draft',
        description:
          'All active owners (excluding the orphan slot) buy their annual refresh first. Then the dispersal draft occurs. New owner gets their refresh cap after joining, as a separate one-time event.',
      },
      {
        label: 'Option 2 — Dispersal draft FIRST, then refresh for all',
        description:
          'Complete the dispersal draft and install the new owner. Then open the annual refresh buy window for all 12 owners simultaneously — including the new owner at their assigned cap. Clean and symmetrical.',
      },
    ],
    recommendation:
      'Option 2 — dispersal first, then refresh. This lets the new owner participate in the same refresh window as everyone else on equal footing, and avoids edge cases around refreshed FAAB interacting with dispersal contributions.',
  },
  {
    id: 'E',
    category: 'FAAB / Waivers',
    title: 'Annual Refresh Buy Limit — New Owner & Dispersal Teams',
    context:
      'Once Proposition D (timing) is settled, the league must decide the refresh buy cap for the new owner and whether dispersal teams\' caps are adjusted. ' +
      'The 2026 refresh pool = 4,744 FAAB (prior year\'s total spend). The orphan team\'s assigned cap is 500 FAAB (8th place, 10.53%).',
    options: [
      {
        label: 'Option 1 — New owner inherits orphan team\'s earned cap (8th = 500 FAAB)',
        description:
          'The incoming owner steps into the orphan slot, inheriting the 2025 8th-place refresh cap of 500 FAAB. Consistent with the "inherit the team" philosophy.',
      },
      {
        label: 'Option 2 — New owner gets last-place cap (12th = 832 FAAB)',
        description:
          'Since the new owner is joining fresh mid-dynasty, they receive the largest refresh cap to help them compete. Dispersal teams keep their normal caps.',
      },
      {
        label: 'Option 3 — Dispersal teams get reduced or zero refresh',
        description:
          'Teams that contributed to the dispersal draft forgo or reduce their refresh this year as a cost offset against the asset value they gave up. Controversial — may discourage dispersal participation.',
      },
      {
        label: 'Option 4 — All caps unchanged, no special treatment',
        description:
          'Every team\'s 2026 refresh cap stands as computed. New owner uses orphan\'s 8th-place cap. Simpler; least disruption.',
      },
    ],
    recommendation:
      'Option 1 for new owner (8th-place cap). Option 4 for dispersal teams — they\'re already giving up roster assets, and reducing their refresh would double-penalize participation.',
  },
];

function PropositionCard({ p }: { p: CommissionerProposition }) {
  const [open, setOpen] = useState(false);

  const categoryColor: Record<string, string> = {
    'FAAB / Waivers':        'bg-orange-900/60 text-orange-300 border-orange-700',
    'Dispersal / Ownership': 'bg-red-900/60 text-red-300 border-red-700',
  };
  const catClass = categoryColor[p.category] ?? 'bg-gray-800/60 text-gray-400 border-gray-600';

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-3 px-4 py-3 text-left hover:bg-gray-800/80 transition-colors"
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/30 flex items-center justify-center text-xs font-black text-[#ffd700]">
            {p.id}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className={`text-xs px-2 py-0.5 rounded border font-medium ${catClass}`}>
                {p.category}
              </span>
            </div>
            <p className="text-sm font-semibold text-white leading-snug">Proposition {p.id} — {p.title}</p>
          </div>
        </div>
        {open ? <ChevronUp size={15} className="text-gray-500 flex-shrink-0 mt-1" /> : <ChevronDown size={15} className="text-gray-500 flex-shrink-0 mt-1" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-700/60">
          <p className="text-gray-400 text-sm leading-relaxed pt-3">{p.context}</p>

          <div className="space-y-2">
            {p.options.map((opt, i) => (
              <div key={i} className="bg-gray-900/60 rounded-lg p-3">
                <p className="text-gray-200 text-xs font-semibold mb-0.5">{opt.label}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{opt.description}</p>
              </div>
            ))}
          </div>

          {p.recommendation && (
            <div className="flex items-start gap-2 bg-[#ffd700]/5 border border-[#ffd700]/20 rounded-lg p-3">
              <Lightbulb size={14} className="text-[#ffd700] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[#ffd700] text-xs font-semibold mb-0.5">Bimflé recommends</p>
                <p className="text-gray-300 text-xs leading-relaxed">{p.recommendation}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MeetingPage() {
  // Availability state
  const [owner, setOwner] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [availState, setAvailState] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');

  // Rule proposal state
  const [propOwner, setPropOwner] = useState('');
  const [propCategory, setPropCategory] = useState('');
  const [propTitle, setPropTitle] = useState('');
  const [propText, setPropText] = useState('');
  const [propReasoning, setPropReasoning] = useState('');
  const [propState, setPropState] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');

  // Active voter for the proposals section (shared owner context)
  const [activeVoter, setActiveVoter] = useState('');

  // Data
  const [pollResponses, setPollResponses] = useState<PollResponse[]>([]);
  const [proposals, setProposals] = useState<RuleProposal[]>([]);
  const [votes, setVotes] = useState<RuleVote[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const loadData = useCallback(async () => {
    try {
      const data = await fetchAllData();
      setPollResponses(data.pollResponses);
      // Sort proposals by category then time
      setProposals(data.proposals.sort((a, b) => {
        const catOrder = RULE_CATEGORIES.indexOf(a.category) - RULE_CATEGORIES.indexOf(b.category);
        if (catOrder !== 0) return catOrder;
        return a.submitted_at.localeCompare(b.submitted_at);
      }));
      setVotes(data.votes);
      setLastRefresh(new Date());
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30_000);
    return () => clearInterval(interval);
  }, [loadData]);

  const toggleDate = (key: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const handleAvailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!owner || selected.size === 0) return;
    setAvailState('submitting');
    try {
      await submitAvailability(owner, [...selected].sort());
      setAvailState('done');
      await loadData();
    } catch {
      setAvailState('error');
    }
  };

  const handlePropSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propOwner || !propCategory || !propTitle || !propText) return;
    setPropState('submitting');
    try {
      const proposal_id = `rp-${Date.now()}`;
      await submitProposal({
        proposal_id,
        owner_name: propOwner,
        category: propCategory,
        title: propTitle,
        proposal: propText,
        reasoning: propReasoning,
      });
      setPropState('done');
      setPropTitle('');
      setPropText('');
      setPropReasoning('');
      await loadData();
    } catch {
      setPropState('error');
    }
  };

  const handleVote = async (proposalId: string, vote: 'yes' | 'no' | 'abstain') => {
    if (!activeVoter) return;
    try {
      await submitVote({ proposal_id: proposalId, owner_name: activeVoter, vote, submitted_at: new Date().toISOString() });
      await loadData();
    } catch {
      // silent fail
    }
  };

  // Group proposals by category
  const proposalsByCategory = new Map<string, RuleProposal[]>();
  proposals.forEach((p) => {
    const arr = proposalsByCategory.get(p.category) ?? [];
    arr.push(p);
    proposalsByCategory.set(p.category, arr);
  });

  // Proposition letter mapping for dynamic proposals (A–E = Commissioner pre-seeded; F+ = owner-submitted)
  const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const propositionLetterMap = new Map<string, string>();
  let letterIdx = COMMISSIONER_PROPOSITIONS.length; // start after pre-seeded (A–E = 0–4, so F = 5)
  [...proposalsByCategory.values()].flat().forEach((p) => {
    propositionLetterMap.set(p.proposal_id, ALPHA[letterIdx] ?? String(letterIdx + 1));
    letterIdx++;
  });

  return (
    <>
      <Head>
        <title>Owners Meeting 2026 — BMFFFL</title>
        <meta name="description" content="BMFFFL Owners Meeting — availability + rule change proposals" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-[#0a0a0f] text-white">
        {/* Header */}
        <div className="border-b border-gray-800 px-4 py-4">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <Calendar className="text-[#ffd700]" size={22} />
            <div>
              <h1 className="text-lg font-bold text-white">BMFFFL Owners Meeting 2026</h1>
              <p className="text-gray-400 text-xs">Availability • Rule proposals • Live voting</p>
            </div>
            <div className="ml-auto">
              <button
                onClick={loadData}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                <RefreshCw size={12} />
                {lastRefresh
                  ? `Updated ${lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : 'Refresh'}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">

          {/* ── SECTION 1: Availability ──────────────────────────────────────── */}
          <section className="bg-gray-900/60 border border-gray-700 rounded-xl p-5">
            <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
              <Users size={16} className="text-[#ffd700]" />
              Mark your availability
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Check every date that works. Target: ~May 26 (most available).
            </p>

            {availState === 'done' ? (
              <div className="flex items-center gap-3 text-green-400 py-4">
                <CheckCircle2 size={20} />
                <span className="font-semibold">Availability recorded. Results updated below.</span>
              </div>
            ) : (
              <form onSubmit={handleAvailSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Your name</label>
                  <select
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    required
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm w-full max-w-xs focus:outline-none focus:border-[#ffd700]"
                  >
                    <option value="">— select owner —</option>
                    {OWNERS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Dates that work (check all)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {DATES.map((d) => (
                      <button
                        key={d.key}
                        type="button"
                        onClick={() => toggleDate(d.key)}
                        className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                          selected.has(d.key)
                            ? 'bg-[#ffd700]/20 border-[#ffd700] text-[#ffd700]'
                            : 'bg-gray-800/50 border-gray-600 text-gray-400 hover:border-gray-400'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                  {selected.size > 0 && (
                    <p className="text-xs text-gray-500 mt-2">{selected.size} date{selected.size !== 1 ? 's' : ''} selected</p>
                  )}
                </div>

                {availState === 'error' && (
                  <p className="text-red-400 text-sm">Something went wrong — try again.</p>
                )}

                <button
                  type="submit"
                  disabled={!owner || selected.size === 0 || availState === 'submitting'}
                  className="px-5 py-2 bg-[#ffd700] text-black font-bold rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-yellow-300 transition-colors"
                >
                  {availState === 'submitting' ? 'Submitting…' : 'Submit availability'}
                </button>
              </form>
            )}

            {/* Availability results */}
            <div className="mt-6 border-t border-gray-700/50 pt-4">
              <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                <Calendar size={14} className="text-gray-500" />
                Availability grid
              </h3>
              {loading ? (
                <p className="text-gray-500 text-sm">Loading…</p>
              ) : (
                <ResultsGrid responses={pollResponses} />
              )}
            </div>
          </section>

          {/* ── SECTION 1b: Commissioner Propositions ───────────────────────── */}
          <section className="bg-gray-900/60 border border-gray-700 rounded-xl p-5">
            <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
              <Gavel size={16} className="text-[#ffd700]" />
              Agenda: Orphan Roster &amp; DogeFAAB Dispositions
            </h2>
            <p className="text-gray-400 text-sm mb-1">
              Pre-seeded agenda items from Commissioner for the 2026 Owners Meeting.
              Expand each Proposition to see the options and Bimflé&apos;s recommendation.
            </p>
            <p className="text-gray-500 text-xs mb-4">
              Background: MCSchools (Escuelas) has left the league. A new owner will be found via dispersal draft.
              The items below must be decided before the 2026 DogeFAAB refresh window can open.
            </p>

            {/* 2025 Non-Playoff Standings Confirmation */}
            <div className="mb-4 bg-gray-800/60 border border-gray-700 rounded-lg p-3">
              <p className="text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1.5">
                <span className="text-[#ffd700]">◈</span>
                2025 Regular Season — Non-Playoff Finish Order (confirmed from DB)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-0.5 text-xs text-gray-400">
                <span><span className="text-gray-300 font-medium">7th</span> — eldridm20 (6-8, pot: 2146.6)</span>
                <span><span className="text-gray-300 font-medium">8th</span> — eldridsm (5-9, pot: 2007.3)</span>
                <span><span className="text-gray-300 font-medium">9th</span> — Cogdeill11 (5-9, pot: 1977.8)</span>
                <span><span className="text-gray-300 font-medium">10th</span> — rbr (5-9, pot: 1969.0)</span>
                <span><span className="text-orange-400 font-medium">11th</span> — MCSchools / Orphan (6-8, pot: 1943.4)</span>
                <span><span className="text-gray-300 font-medium">12th</span> — Grandes (4-10, pot: 1862.8)</span>
              </div>
              <p className="text-gray-600 text-xs mt-1.5">Ranked by potential points (max possible lineup score) — primary criterion. W/L is secondary. MCSchools was 6-8 but had lowest potential among non-Grandes teams → 11th. Aligns with 2026 draft pick order.</p>
            </div>

            <div className="space-y-2">
              {COMMISSIONER_PROPOSITIONS.map((p) => (
                <PropositionCard key={p.id} p={p} />
              ))}
            </div>
          </section>

          {/* ── SECTION 2: Propose a Rule Change ────────────────────────────── */}
          <section className="bg-gray-900/60 border border-gray-700 rounded-xl p-5">
            <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
              <ClipboardList size={16} className="text-[#ffd700]" />
              Propose a rule change
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Submit your proposals before the meeting. Everyone can see them — we'll vote on each one during the call.
            </p>

            {propState === 'done' ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-green-400 py-2">
                  <CheckCircle2 size={20} />
                  <span className="font-semibold">Proposal submitted — scroll down to see it.</span>
                </div>
                <button
                  onClick={() => setPropState('idle')}
                  className="text-sm text-gray-400 hover:text-white underline underline-offset-2"
                >
                  Submit another proposal
                </button>
              </div>
            ) : (
              <form onSubmit={handlePropSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Your name</label>
                    <select
                      value={propOwner}
                      onChange={(e) => setPropOwner(e.target.value)}
                      required
                      className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm w-full focus:outline-none focus:border-[#ffd700]"
                    >
                      <option value="">— select owner —</option>
                      {OWNERS.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Category</label>
                    <select
                      value={propCategory}
                      onChange={(e) => setPropCategory(e.target.value)}
                      required
                      className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm w-full focus:outline-none focus:border-[#ffd700]"
                    >
                      <option value="">— select category —</option>
                      {RULE_CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Title <span className="text-gray-600">(short summary)</span>
                  </label>
                  <input
                    type="text"
                    value={propTitle}
                    onChange={(e) => setPropTitle(e.target.value)}
                    placeholder="e.g. Add an extra FLEX spot to lineups"
                    required
                    maxLength={120}
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm w-full focus:outline-none focus:border-[#ffd700] placeholder-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Proposal <span className="text-gray-600">(the actual rule change)</span>
                  </label>
                  <textarea
                    value={propText}
                    onChange={(e) => setPropText(e.target.value)}
                    placeholder="Describe the rule change in detail. What changes, what stays the same?"
                    required
                    rows={4}
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm w-full focus:outline-none focus:border-[#ffd700] placeholder-gray-600 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Reasoning <span className="text-gray-600">(optional — why should we do this?)</span>
                  </label>
                  <textarea
                    value={propReasoning}
                    onChange={(e) => setPropReasoning(e.target.value)}
                    placeholder="Why does this make the league better?"
                    rows={2}
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm w-full focus:outline-none focus:border-[#ffd700] placeholder-gray-600 resize-none"
                  />
                </div>

                {propState === 'error' && (
                  <p className="text-red-400 text-sm">Submit failed — try again.</p>
                )}

                <button
                  type="submit"
                  disabled={!propOwner || !propCategory || !propTitle || !propText || propState === 'submitting'}
                  className="px-5 py-2 bg-[#ffd700] text-black font-bold rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-yellow-300 transition-colors"
                >
                  {propState === 'submitting' ? 'Submitting…' : 'Submit proposal'}
                </button>
              </form>
            )}
          </section>

          {/* ── SECTION 3: Proposals + Voting ───────────────────────────────── */}
          <section className="bg-gray-900/60 border border-gray-700 rounded-xl p-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <Vote size={16} className="text-[#ffd700]" />
                  Owner Propositions
                  {proposals.length > 0 && (
                    <span className="text-xs text-gray-500 font-normal">({proposals.length})</span>
                  )}
                </h2>
                <p className="text-gray-400 text-xs mt-0.5">
                  Owner-submitted propositions — labeled {ALPHA[COMMISSIONER_PROPOSITIONS.length]}+ in meeting order. Select your name to vote.
                </p>
              </div>
            </div>

            {/* Voter selector */}
            <div className="mb-4 flex items-center gap-3">
              <label className="text-sm text-gray-400 flex-shrink-0">Voting as:</label>
              <select
                value={activeVoter}
                onChange={(e) => setActiveVoter(e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#ffd700] max-w-[200px]"
              >
                <option value="">— select to vote —</option>
                {OWNERS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              {activeVoter && (
                <span className="text-green-400 text-xs">✓ ready to vote</span>
              )}
            </div>

            {loading ? (
              <p className="text-gray-500 text-sm">Loading proposals…</p>
            ) : proposals.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">
                No owner propositions yet — Commissioner pre-seeded Propositions A–E are above. Submit yours above.
              </p>
            ) : (
              <div className="space-y-6">
                {[...proposalsByCategory.entries()].map(([category, catProposals]) => (
                  <div key={category}>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      {category} ({catProposals.length})
                    </h3>
                    <div className="space-y-3">
                      {catProposals.map((p) => (
                        <ProposalCard
                          key={p.proposal_id}
                          proposal={p}
                          votes={votes}
                          activeVoter={activeVoter}
                          onVote={handleVote}
                          propositionLabel={propositionLetterMap.get(p.proposal_id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── SECTION 4: Current League Rules ─────────────────────────────── */}
          <section className="bg-gray-900/60 border border-gray-700 rounded-xl p-5">
            <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
              <BookOpen size={16} className="text-[#ffd700]" />
              Current League Rules
            </h2>
            <p className="text-gray-400 text-sm mb-4">Reference during the meeting. Click any rule to expand.</p>

            <div className="space-y-2">

              <details className="group rounded-lg overflow-hidden">
                <summary className="cursor-pointer select-none text-sm font-medium text-gray-200 hover:text-white py-2.5 px-3 bg-gray-800/60 rounded-lg flex items-center justify-between list-none">
                  <span>Roster Format &amp; Scoring</span>
                  <ChevronDown size={14} className="text-gray-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-3 pt-2 pb-3 text-sm text-gray-400 space-y-1 bg-gray-800/30 rounded-b-lg">
                  <p><span className="text-gray-300">Lineup:</span> QB · RB · RB · WR · WR · WR · TE · FLEX · FLEX · SUPER_FLEX</p>
                  <p><span className="text-gray-300">Bench:</span> 16 spots (cut to 12 before season)</p>
                  <p><span className="text-gray-300">Taxi squad:</span> 5 players</p>
                  <p><span className="text-gray-300">IR:</span> Off offseason/preseason; may turn on in-season</p>
                  <p><span className="text-gray-300">Scoring:</span> Full PPR (1.0 rec) · 4-pt passing TDs</p>
                </div>
              </details>

              <details className="group rounded-lg overflow-hidden">
                <summary className="cursor-pointer select-none text-sm font-medium text-gray-200 hover:text-white py-2.5 px-3 bg-gray-800/60 rounded-lg flex items-center justify-between list-none">
                  <span>Trades</span>
                  <ChevronDown size={14} className="text-gray-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-3 pt-2 pb-3 text-sm text-gray-400 space-y-1 bg-gray-800/30 rounded-b-lg">
                  <p><span className="text-gray-300">Counter window:</span> 24 hours after a trade is proposed</p>
                  <p><span className="text-gray-300">No-counter signal:</span> Both sides include $1 FAAB → counter window waived, trade processes immediately</p>
                </div>
              </details>

              <details className="group rounded-lg overflow-hidden">
                <summary className="cursor-pointer select-none text-sm font-medium text-gray-200 hover:text-white py-2.5 px-3 bg-gray-800/60 rounded-lg flex items-center justify-between list-none">
                  <span>FAAB — Prop D(OGE) System</span>
                  <ChevronDown size={14} className="text-gray-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-3 pt-2 pb-3 text-sm text-gray-400 space-y-1 bg-gray-800/30 rounded-b-lg">
                  <p><span className="text-gray-300">Rate:</span> 5 FAAB = 1 Dogecoin (current; has increased 3× since original)</p>
                  <p><span className="text-gray-300">Treasury:</span> All Doge held in escrow by Commissioner</p>
                  <p><span className="text-gray-300">Annual refresh:</span> Owners buy additional FAAB by paying Doge at market price; pool total = prior year's total FAAB spend</p>
                  <p><span className="text-gray-300">In-season sell windows:</span> Weeks 4, 8, 12, 16</p>
                  <p><span className="text-gray-300">Mid-season buy:</span> After Week 8, before Week 11 — bottom 6 teams only, up to $300 FAAB</p>
                  <p><span className="text-gray-300">Cash-out (offseason):</span> Up to $500 FAAB in $100 increments at variable sell rate</p>
                </div>
              </details>

              <details className="group rounded-lg overflow-hidden">
                <summary className="cursor-pointer select-none text-sm font-medium text-gray-200 hover:text-white py-2.5 px-3 bg-gray-800/60 rounded-lg flex items-center justify-between list-none">
                  <span>Playoffs</span>
                  <ChevronDown size={14} className="text-gray-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-3 pt-2 pb-3 text-sm text-gray-400 space-y-1 bg-gray-800/30 rounded-b-lg">
                  <p><span className="text-gray-300">Format:</span> 6-team bracket</p>
                  <p><span className="text-gray-300">Auto bids:</span> 3 division winners (regardless of record)</p>
                  <p><span className="text-gray-300">Wild cards:</span> 3 remaining spots by record (points tiebreaker)</p>
                  <p><span className="text-gray-300">Byes:</span> Seeds 1 &amp; 2 — Seeds 3–6 play Round 1</p>
                </div>
              </details>

              <details className="group rounded-lg overflow-hidden">
                <summary className="cursor-pointer select-none text-sm font-medium text-gray-200 hover:text-white py-2.5 px-3 bg-gray-800/60 rounded-lg flex items-center justify-between list-none">
                  <span>Preseason Cut-Down (2026+)</span>
                  <ChevronDown size={14} className="text-gray-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-3 pt-2 pb-3 text-sm text-gray-400 space-y-1 bg-gray-800/30 rounded-b-lg">
                  <p><span className="text-gray-300">Blocker players:</span> 2 added to each of the 6 prior-year playoff teams when FA opens (late June/July) — occupy bench slots until cut</p>
                  <p><span className="text-gray-300">All-team cut:</span> All 12 teams cut 4 bench spots (16 → 12) before the season</p>
                  <p>Playoff teams drop their blockers once the season begins as normal roster management</p>
                </div>
              </details>

              <details className="group rounded-lg overflow-hidden">
                <summary className="cursor-pointer select-none text-sm font-medium text-gray-200 hover:text-white py-2.5 px-3 bg-gray-800/60 rounded-lg flex items-center justify-between list-none">
                  <span>Dispersal Draft (2026)</span>
                  <ChevronDown size={14} className="text-gray-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-3 pt-2 pb-3 text-sm text-gray-400 space-y-1 bg-gray-800/30 rounded-b-lg">
                  <p><span className="text-gray-300">Trigger:</span> Escuelas left the league — new owner needed</p>
                  <p><span className="text-gray-300">Format:</span> Snake draft, randomized order — 3–4 teams participate</p>
                  <p><span className="text-gray-300">Pool:</span> All participating teams contribute full roster + 2+ years of picks anonymously; new owner builds squad from pool</p>
                  <p><span className="text-gray-300">Bonus:</span> One late 1st this year + one next year added to pool</p>
                  <p>Open governance questions on FAAB disposition pending meeting vote</p>
                </div>
              </details>

            </div>
          </section>

        </div>
      </div>
    </>
  );
}
