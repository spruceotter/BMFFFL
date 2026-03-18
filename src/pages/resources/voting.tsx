import Head from 'next/head';
import Link from 'next/link';
import {
  Vote,
  Lock,
  CheckCircle,
  Clock,
  Users,
  ArrowRight,
  BarChart2,
  Server,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MockPoll {
  id: string;
  question: string;
  status: 'closed' | 'open' | 'opinion';
  year: number;
  options: { label: string; votes: number; pct: number }[];
  winner?: string;
  note?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const MOCK_POLLS: MockPoll[] = [
  {
    id: 'playoffs-6',
    question: 'Should we expand playoffs to 6 teams?',
    status: 'closed',
    year: 2024,
    options: [
      { label: 'No — keep 4', votes: 7, pct: 58 },
      { label: 'Yes — expand to 6', votes: 5, pct: 42 },
    ],
    winner: 'No — keep 4',
    note: 'Closed vote. Result was binding.',
  },
  {
    id: 'devy-roster',
    question: 'Add a devy roster (3 spots)?',
    status: 'open',
    year: 2026,
    options: [
      { label: 'Yes — add devy slots', votes: 6, pct: 60 },
      { label: 'No — not yet', votes: 4, pct: 40 },
    ],
    note: 'Hypothetical open poll. 10 of 12 managers voted.',
  },
  {
    id: 'keeper-value-2026',
    question: 'Best keeper value heading into 2026?',
    status: 'opinion',
    year: 2026,
    options: [
      { label: 'CJ Stroud (Rd 4)', votes: 5, pct: 42 },
      { label: 'Puka Nacua (Rd 7)', votes: 4, pct: 33 },
      { label: 'Bijan Robinson (Rd 3)', votes: 3, pct: 25 },
    ],
    note: 'Non-binding opinion poll.',
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    icon: ShieldCheck,
    title: 'Manager Authenticates',
    detail: 'Commissioner shares a one-time link tied to each manager&apos;s Sleeper account.',
  },
  {
    icon: Vote,
    title: 'Votes Once Per Poll',
    detail: 'Each manager casts a single, irrevocable vote. No changes after submission.',
  },
  {
    icon: BarChart2,
    title: 'Commissioner Tallies',
    detail: 'Results are tallied server-side. Live progress shown only after the poll closes.',
  },
  {
    icon: CheckCircle,
    title: 'Results Published',
    detail: 'Final results posted to the site and announced in league chat. Binding votes go into the rulebook.',
  },
];

const IMPL_REQUIREMENTS = [
  { icon: ShieldCheck, label: 'Authentication', detail: 'Manager identity must be verified — likely via Sleeper OAuth or commissioner-issued tokens' },
  { icon: Server, label: 'Server-side vote storage', detail: 'Votes cannot live in localStorage. A backend (Supabase, PlanetScale, or similar) is required' },
  { icon: Lock, label: 'One-vote enforcement', detail: 'DB constraint or server check prevents double-voting' },
  { icon: AlertCircle, label: 'Poll lifecycle management', detail: 'Commissioner controls open/close state; results locked on close' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  id,
  label,
  title,
}: {
  icon: React.ElementType;
  id: string;
  label: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/30 shrink-0">
        <Icon className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">
          {label}
        </p>
        <h2 id={id} className="text-lg font-black text-white leading-tight">
          {title}
        </h2>
      </div>
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-2xl p-6 bg-[#16213e] border border-[#2d4a66]', className)}>
      {children}
    </div>
  );
}

function PollCard({ poll }: { poll: MockPoll }) {
  const statusColors: Record<MockPoll['status'], string> = {
    closed: 'bg-slate-800 text-slate-400 border-slate-700',
    open: 'bg-[#ffd700]/10 text-[#ffd700] border-[#ffd700]/30',
    opinion: 'bg-blue-900/30 text-blue-300 border-blue-700/40',
  };
  const statusLabels: Record<MockPoll['status'], string> = {
    closed: 'Closed',
    open: 'Open (Mock)',
    opinion: 'Opinion Poll',
  };

  return (
    <div className="rounded-2xl bg-[#16213e] border border-[#2d4a66] p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="text-base font-black text-white leading-snug flex-1">
          {poll.question}
        </h3>
        <span
          className={cn(
            'shrink-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border',
            statusColors[poll.status]
          )}
        >
          {statusLabels[poll.status]}
        </span>
      </div>

      {/* Options */}
      <div className="space-y-2.5 mb-4">
        {poll.options.map((opt) => (
          <div key={opt.label}>
            <div className="flex items-center justify-between mb-1">
              <span className={cn(
                'text-xs font-semibold leading-snug',
                poll.winner === opt.label ? 'text-[#ffd700]' : 'text-slate-300'
              )}>
                {opt.label}
                {poll.winner === opt.label && (
                  <CheckCircle className="inline-block w-3 h-3 ml-1.5 text-[#ffd700]" aria-label="Winner" />
                )}
              </span>
              <span className="text-xs font-bold text-slate-400">
                {opt.votes}v &middot; {opt.pct}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-[#0d1b2a] border border-[#2d4a66] overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  poll.winner === opt.label
                    ? 'bg-[#ffd700]'
                    : 'bg-[#2d4a66]'
                )}
                style={{ width: `${opt.pct}%` }}
                aria-hidden="true"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2">
        {poll.note && (
          <p className="text-[11px] text-slate-500 italic leading-snug flex-1">{poll.note}</p>
        )}
        <span className="shrink-0 text-[10px] text-slate-600 font-medium">{poll.year}</span>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VotingPage() {
  return (
    <>
      <Head>
        <title>Manager Voting System — Future Feature — BMFFFL</title>
        <meta
          name="description"
          content="Design preview for the BMFFFL league polls and voting system. See mock polls, how voting would work, and implementation requirements."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ── Hero Banner ──────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">

          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#ffd700] transition-colors duration-150">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/resources" className="hover:text-[#ffd700] transition-colors duration-150">Resources</Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-300">Voting System</span>
          </nav>

          {/* Coming feature banner */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-[#ffd700]/10 border border-[#ffd700]/30 mb-6">
            <Vote className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#ffd700]">
              Coming Feature
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            League Democracy
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
            A design preview for the BMFFFL manager voting system — league polls, rule change
            votes, and award nominations, all embedded in the site. This page shows what it
            would look like.
          </p>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

        {/* ── Active Polls (Mock) ───────────────────────────────────────── */}
        <section aria-labelledby="polls-heading">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/30 shrink-0">
              <BarChart2 className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">
                Design Preview
              </p>
              <h2 id="polls-heading" className="text-lg font-black text-white leading-tight">
                Active Polls (Mock Data)
              </h2>
            </div>
          </div>
          <div className="rounded-xl bg-[#ffd700]/5 border border-[#ffd700]/20 px-4 py-3 mb-6 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-[#ffd700] shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs text-slate-300 leading-relaxed">
              These are mock polls showing the intended design. No real votes have been cast here.
              Actual voting requires authentication infrastructure not yet built.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {MOCK_POLLS.map((poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </div>
        </section>

        {/* ── How Voting Would Work ─────────────────────────────────────── */}
        <section aria-labelledby="how-heading">
          <Card>
            <SectionHeader
              icon={Vote}
              id="how-heading"
              label="System Design"
              title="How Voting Would Work"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {HOW_IT_WORKS_STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className="rounded-xl bg-[#0d1b2a] border border-[#2d4a66] p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-5 h-5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 flex items-center justify-center text-[10px] font-black text-[#ffd700] shrink-0">
                        {i + 1}
                      </span>
                      <Icon className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
                    </div>
                    <p className="text-sm font-bold text-white leading-snug mb-1">{step.title}</p>
                    <p
                      className="text-[11px] text-slate-400 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: step.detail }}
                    />
                  </div>
                );
              })}
            </div>
          </Card>
        </section>

        {/* ── Row: Historical Votes + Implementation ────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Historical Votes */}
          <section aria-labelledby="history-heading">
            <Card>
              <SectionHeader
                icon={Clock}
                id="history-heading"
                label="Archive"
                title="Historical Votes"
              />
              <p className="text-sm text-slate-400 leading-relaxed mb-5">
                Past rule change votes, award nominations, and league decisions are archived
                in the Commissioner&apos;s Vault. This includes pre-digital votes reconstructed
                from league history.
              </p>
              <div className="space-y-0">
                {[
                  { year: '2019', event: 'Adopted FAAB waivers (unanimous)', binding: true },
                  { year: '2021', event: 'Added taxi squad — 3 spots', binding: true },
                  { year: '2022', event: 'Changed scoring to 0.5 PPR', binding: true },
                  { year: '2023', event: 'Expanded to 18-man rosters', binding: true },
                ].map(({ year, event, binding }) => (
                  <div key={event} className="flex items-start gap-3 py-2.5 border-b border-[#2d4a66]/60 last:border-0">
                    <span className="text-[10px] font-bold text-slate-500 w-10 shrink-0 mt-0.5 tabular-nums">
                      {year}
                    </span>
                    <p className="text-sm text-slate-300 leading-snug flex-1">{event}</p>
                    {binding && (
                      <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ffd700]/10 text-[#ffd700] border border-[#ffd700]/30">
                        Binding
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <Link
                  href="/admin/vault"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-[#ffd700] transition-colors duration-150"
                >
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  View full vote archive in Commissioner&apos;s Vault
                </Link>
              </div>
            </Card>
          </section>

          {/* Implementation Requirements */}
          <section aria-labelledby="impl-heading">
            <Card>
              <SectionHeader
                icon={Server}
                id="impl-heading"
                label="What It Would Take"
                title="Implementation Requirements"
              />
              <p className="text-sm text-slate-400 leading-relaxed mb-5">
                The current site is fully static. A real voting system requires server
                infrastructure that does not yet exist.
              </p>
              <ul className="space-y-0">
                {IMPL_REQUIREMENTS.map(({ icon: Icon, label, detail }) => (
                  <li key={label} className="flex items-start gap-3 py-3 border-b border-[#2d4a66]/60 last:border-0">
                    <div className="shrink-0 w-7 h-7 rounded-lg bg-[#0d1b2a] border border-[#2d4a66] flex items-center justify-center mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-snug">{label}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-xl bg-[#0d1b2a] border border-[#2d4a66] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#ffd700]">
                    Interested?
                  </p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  If you want to help build this, open a GitHub issue or DM the Commissioner.
                  This is one of the higher-effort features on the roadmap.
                </p>
              </div>
            </Card>
          </section>
        </div>

        {/* ── Bottom links ──────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#2d4a66]">
          <div className="flex flex-wrap gap-4 text-xs">
            <Link
              href="/admin/vault"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#ffd700] transition-colors duration-150 font-semibold"
            >
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
              Commissioner&apos;s Vault
            </Link>
            <Link
              href="/resources/contribute"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#ffd700] transition-colors duration-150 font-semibold"
            >
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
              Contribute
            </Link>
            <Link
              href="/resources"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#ffd700] transition-colors duration-150 font-semibold"
            >
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
              All Resources
            </Link>
          </div>
          <p className="text-[11px] text-slate-600">
            BMFFFL Future Feature Preview
          </p>
        </div>

      </div>
    </>
  );
}
