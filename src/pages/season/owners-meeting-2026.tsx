import Head from 'next/head';
import Link from 'next/link';
import { Calendar, ClipboardList, Users, CheckCircle2, Clock, MessageSquare, Vote, BookOpen, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AgendaItem {
  title: string;
  description: string;
  status: 'discussion' | 'vote' | 'info';
  currentRule?: string;
  proposal?: string;
}

interface PastMeetingResult {
  year: number;
  items: string[];
}

// ─── Agenda Items ─────────────────────────────────────────────────────────────

const AGENDA_ITEMS: AgendaItem[] = [
  {
    title: 'Potential Rule Changes for 2026',
    description:
      'General discussion of any rule changes proposed by owners since the 2025 season concluded. Owners may submit proposals in advance of the meeting.',
    status: 'discussion',
  },
  {
    title: 'Taxi Squad Age Limit',
    description:
      'The current taxi squad eligibility requires players to be within their first two NFL seasons. Some owners have proposed extending this to three seasons to better accommodate developmental prospects.',
    status: 'vote',
    currentRule: 'Players eligible only in their first 2 NFL seasons',
    proposal: 'Extend eligibility to first 3 NFL seasons',
  },
  {
    title: 'Trade Deadline Timing',
    description:
      'The current trade deadline falls at the end of Week 14, which some owners argue leaves too little time for meaningful moves before the fantasy playoffs. A proposal to move it to Week 12 is on the table.',
    status: 'vote',
    currentRule: 'Trade deadline: Week 14',
    proposal: 'Move trade deadline to Week 12',
  },
  {
    title: 'FAAB Budget Increase',
    description:
      'With the league now in its 7th season and player values increasing across dynasty, a proposal to raise the annual FAAB budget from $10,000 to $15,000 has been submitted. Discussion will cover inflation of costs and competitive balance.',
    status: 'vote',
    currentRule: '$10,000 FAAB per season',
    proposal: 'Increase FAAB budget to $15,000 per season',
  },
  {
    title: 'Playoff Format',
    description:
      'The current playoffs feature 6 teams. A proposal to expand to 8 teams would give more owners a postseason path, but may dilute the playoff field. Discussion will weigh competitive integrity vs. engagement for middle-of-table teams.',
    status: 'vote',
    currentRule: '6-team playoff bracket',
    proposal: 'Expand to 8-team playoff bracket',
  },
  {
    title: 'Scoring Tweaks (PPR Value)',
    description:
      'General discussion on whether any position-specific PPR adjustments are warranted — particularly around tight end premium (TEP), or fractional PPR for receptions under 5 yards. No specific proposal yet; open floor discussion.',
    status: 'discussion',
    currentRule: 'Full PPR, Superflex — no TEP',
    proposal: 'None formally submitted; community discussion',
  },
];

// ─── Past Meeting Results ─────────────────────────────────────────────────────

const PAST_MEETINGS: PastMeetingResult[] = [
  {
    year: 2025,
    items: [
      'Approved taxi squad expansion from 3 to 5 players (passed 8-4)',
      'Confirmed trade deadline remains at Week 14 after owners voted against moving to Week 12',
      'Adopted tiered IR slots — 2 standard IR slots, 1 designated COVID/PUP slot',
      'Commissioner confirmed Sleeper will remain the platform through at least the 2027 season',
    ],
  },
  {
    year: 2024,
    items: [
      'Moved the entire league to Sleeper from the previous platform — unanimous vote (12-0)',
      'Added a 5th round to the rookie draft (later reversed in 2025 proposal)',
      'Standardized the FAAB waiver process: continuous waivers with blind bids processing Sunday nights',
      'Approved keeper dynasty rules amendment clarifying taxi squad activation deadlines (Week 1 cutoff)',
    ],
  },
  {
    year: 2023,
    items: [
      'Adopted Full PPR scoring (previously 0.5 PPR) — passed 7-5, closest vote in league history',
      'Approved Superflex roster slot addition, replacing a second FLEX spot',
      'Set rookie draft as linear format, first Friday of June, permanent rule',
      'FAAB budget set at $10,000 per season starting 2024',
    ],
  },
];

// ─── Status Badge Styles ──────────────────────────────────────────────────────

const STATUS_STYLES: Record<AgendaItem['status'], string> = {
  discussion: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  vote:       'bg-[#ffd700]/10 text-[#ffd700] border-[#ffd700]/30',
  info:       'bg-slate-500/10 text-slate-400 border-slate-500/30',
};

const STATUS_LABELS: Record<AgendaItem['status'], string> = {
  discussion: 'Discussion',
  vote:       'Pending Vote',
  info:       'Informational',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function AgendaCard({ item }: { item: AgendaItem }) {
  return (
    <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5 flex flex-col gap-3 hover:border-[#ffd700]/20 transition-colors duration-200">
      {/* Title + status badge */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-bold text-white leading-snug flex-1">{item.title}</h3>
        <span className={cn(
          'shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border',
          STATUS_STYLES[item.status]
        )}>
          {STATUS_LABELS[item.status]}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>

      {/* Current vs. Proposed */}
      {(item.currentRule || item.proposal) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
          {item.currentRule && (
            <div className="rounded-lg border border-[#2d4a66] bg-[#0d1b2a] px-3 py-2">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Current Rule</p>
              <p className="text-xs text-slate-300 leading-snug">{item.currentRule}</p>
            </div>
          )}
          {item.proposal && (
            <div className="rounded-lg border border-[#ffd700]/20 bg-[#ffd700]/5 px-3 py-2">
              <p className="text-[10px] text-[#ffd700]/70 uppercase tracking-wider font-semibold mb-1">Proposal</p>
              <p className="text-xs text-slate-300 leading-snug">{item.proposal}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PastMeetingCard({ meeting }: { meeting: PastMeetingResult }) {
  return (
    <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5">
      {/* Year header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
        </div>
        <h3 className="text-base font-black text-white">{meeting.year} Meeting</h3>
        <span className="ml-auto text-[10px] text-slate-600 font-semibold uppercase tracking-wider border border-[#2d4a66] px-2 py-0.5 rounded bg-[#0d1b2a]">
          Completed
        </span>
      </div>

      {/* Items */}
      <ul className="space-y-2">
        {meeting.items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">
            <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[#ffd700]/60" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OwnersMeeting2026Page() {
  return (
    <>
      <Head>
        <title>2026 Owners Meeting — BMFFFL</title>
        <meta
          name="description"
          content="BMFFFL 2026 Owners Meeting hub. Agenda items, upcoming votes on taxi squad rules, trade deadline, FAAB budget, playoff format, and past meeting results."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Page Header ───────────────────────────────────────────────────── */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-700/40 border border-[#2d4a66] text-slate-400 text-xs font-semibold uppercase tracking-widest mb-4">
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            2026 Season
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            2026 Owners Meeting
          </h1>
          <p className="text-slate-400 text-lg mb-6">
            BMFFFL &bull; May 2026 (TBD)
          </p>

          {/* Status banner */}
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-700/50 border border-[#2d4a66] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-slate-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-0.5">Status</p>
                <p className="text-base font-bold text-white">Upcoming — Date not yet announced</p>
              </div>
            </div>
            <div className="sm:ml-auto flex flex-wrap gap-2">
              <div className="rounded-lg border border-[#2d4a66] bg-[#0d1b2a] px-3 py-2">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">When</p>
                <p className="text-sm font-bold text-white">May 2026</p>
              </div>
              <div className="rounded-lg border border-[#2d4a66] bg-[#0d1b2a] px-3 py-2">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Owners</p>
                <p className="text-sm font-bold text-white">12 Voting Members</p>
              </div>
              <div className="rounded-lg border border-[#2d4a66] bg-[#0d1b2a] px-3 py-2">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Agenda Items</p>
                <p className="text-sm font-bold text-white">{AGENDA_ITEMS.length} Topics</p>
              </div>
            </div>
          </div>
        </header>

        {/* ── Main Grid: Agenda + Sidebar ───────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

          {/* Agenda Items */}
          <section className="lg:col-span-2" aria-labelledby="agenda-heading">
            <div className="flex items-center gap-3 mb-5">
              <ClipboardList className="w-5 h-5 text-[#ffd700] shrink-0" aria-hidden="true" />
              <h2 id="agenda-heading" className="text-2xl font-black text-white">
                2026 Agenda Items
              </h2>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold border border-[#2d4a66] text-slate-400 bg-[#16213e]">
                {AGENDA_ITEMS.filter(i => i.status === 'vote').length} pending votes
              </span>
            </div>

            <div className="space-y-4">
              {AGENDA_ITEMS.map((item, idx) => (
                <AgendaCard key={idx} item={item} />
              ))}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-5">

            {/* How to Vote */}
            <section aria-labelledby="voting-heading" className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <Vote className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
                <h2 id="voting-heading" className="text-base font-black text-white">How Voting Works</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="shrink-0 mt-1 w-5 h-5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 flex items-center justify-center text-[10px] font-black text-[#ffd700]">1</span>
                  <p className="text-sm text-slate-400 leading-snug">All 12 owners receive a vote on each proposed change.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="shrink-0 mt-1 w-5 h-5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 flex items-center justify-center text-[10px] font-black text-[#ffd700]">2</span>
                  <p className="text-sm text-slate-400 leading-snug">A simple majority (7 of 12) passes any standard rule change.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="shrink-0 mt-1 w-5 h-5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 flex items-center justify-center text-[10px] font-black text-[#ffd700]">3</span>
                  <p className="text-sm text-slate-400 leading-snug">Scoring changes require a supermajority (9 of 12) given their material impact on competitive balance.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="shrink-0 mt-1 w-5 h-5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 flex items-center justify-center text-[10px] font-black text-[#ffd700]">4</span>
                  <p className="text-sm text-slate-400 leading-snug">Results are announced within 48 hours of the meeting on the league Sleeper chat and on this site.</p>
                </div>
              </div>
            </section>

            {/* Commissioner Notes */}
            <section aria-labelledby="commissioner-heading" className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <MessageSquare className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
                <h2 id="commissioner-heading" className="text-base font-black text-white">Commissioner Notes</h2>
              </div>
              <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
                <p>
                  The Commissioner will schedule the exact meeting date via the league Sleeper group chat by
                  mid-April 2026. Expect a video call format used in prior years.
                </p>
                <p>
                  Any owner wishing to submit a formal proposal for the agenda must do so
                  at least <span className="text-white font-semibold">14 days</span> before the meeting date.
                  Last-minute proposals may be tabled for the following year.
                </p>
                <p>
                  Decisions made at the owners meeting are final and take effect
                  at the start of the 2026 BMFFFL season (September 2026), unless otherwise specified.
                </p>
              </div>
            </section>

            {/* Quick Links */}
            <section aria-labelledby="links-heading">
              <h2 id="links-heading" className="text-sm font-black text-white mb-3 uppercase tracking-wider">
                Related Pages
              </h2>
              <div className="space-y-2">
                <Link
                  href="/rules"
                  className="group flex items-center gap-3 rounded-xl bg-[#16213e] border border-[#2d4a66] px-4 py-3 hover:border-[#ffd700]/30 hover:bg-[#1a2d42] transition-all duration-150"
                >
                  <BookOpen className="w-4 h-4 text-[#e94560] group-hover:text-white transition-colors shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-[#ffd700] transition-colors">League Rules</p>
                    <p className="text-xs text-slate-500">Full current rulebook</p>
                  </div>
                </Link>
                <Link
                  href="/season"
                  className="group flex items-center gap-3 rounded-xl bg-[#16213e] border border-[#2d4a66] px-4 py-3 hover:border-[#ffd700]/30 hover:bg-[#1a2d42] transition-all duration-150"
                >
                  <Calendar className="w-4 h-4 text-[#e94560] group-hover:text-white transition-colors shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-[#ffd700] transition-colors">2026 Season Hub</p>
                    <p className="text-xs text-slate-500">Offseason timeline and roster status</p>
                  </div>
                </Link>
                <Link
                  href="/owners"
                  className="group flex items-center gap-3 rounded-xl bg-[#16213e] border border-[#2d4a66] px-4 py-3 hover:border-[#ffd700]/30 hover:bg-[#1a2d42] transition-all duration-150"
                >
                  <Users className="w-4 h-4 text-[#e94560] group-hover:text-white transition-colors shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-[#ffd700] transition-colors">All Owners</p>
                    <p className="text-xs text-slate-500">Dynasty rosters and profiles</p>
                  </div>
                </Link>
              </div>
            </section>

          </aside>
        </div>

        {/* ── Past Meeting Results ───────────────────────────────────────────── */}
        <section aria-labelledby="past-meetings-heading" className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
            <h2 id="past-meetings-heading" className="text-2xl font-black text-white">
              Past Meeting Results
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PAST_MEETINGS.map(meeting => (
              <PastMeetingCard key={meeting.year} meeting={meeting} />
            ))}
          </div>
        </section>

        {/* ── Info Note ─────────────────────────────────────────────────────── */}
        <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs text-slate-500 leading-relaxed">
            Agenda items and proposals listed here are based on discussions through March 2026 and are subject to
            change before the meeting. The Commissioner will publish the final agenda at least one week in advance.
            All 12 BMFFFL owners are required to participate. Contact the Commissioner via Sleeper DM with questions.
          </p>
        </div>

      </div>
    </>
  );
}

// ─── Static Generation ────────────────────────────────────────────────────────

import type { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} };
};
