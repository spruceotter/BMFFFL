import Head from 'next/head';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { PAGE_STATUS, getStatusSummary, type PageStatus } from '@/data/page-status';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface QuickAction {
  icon: string;
  label: string;
  description: string;
  href?: string;
}

interface ChecklistItem {
  text: string;
  done?: boolean;
}

interface ChecklistSection {
  phase: string;
  icon: string;
  items: ChecklistItem[];
}

interface Resource {
  icon: string;
  label: string;
  description: string;
  href: string;
  external?: boolean;
}

interface TimelineEntry {
  year: number;
  event: string;
}

// ─── Data ──────────────────────────────────────────────────────────────────────

const QUICK_ACTIONS: QuickAction[] = [
  {
    icon: '📋',
    label: 'Trade Review',
    description: 'View all trade disputes and veto history',
    href: '/history/veto-log',
  },
  {
    icon: '🗳️',
    label: 'Rule Votes',
    description: 'Rule change history and past league votes',
    href: '/admin/vault',
  },
  {
    icon: '💰',
    label: 'FAAB Reminder',
    description: 'Set waiver priority, announce FAAB deadlines',
  },
  {
    icon: '📅',
    label: 'Season Schedule',
    description: 'View and manage the league calendar',
    href: '/calendar',
  },
  {
    icon: '🏆',
    label: 'Award Winners',
    description: 'Annual awards history and past recipients',
    href: '/history/awards',
  },
  {
    icon: '📣',
    label: 'Commish Speaks',
    description: 'Commissioner announcements and editorials',
    href: '/articles/commish-speaks',
  },
];

const CHECKLISTS: ChecklistSection[] = [
  {
    phase: 'Pre-Season',
    icon: '🌱',
    items: [
      { text: 'Set draft date and confirm all managers are available' },
      { text: 'Confirm rosters and enforce keeper deadlines' },
      { text: 'Set bye week rules and confirm tiebreaker procedures' },
      { text: 'Reset FAAB budgets for all teams' },
    ],
  },
  {
    phase: 'In-Season',
    icon: '⚡',
    items: [
      { text: 'Process waivers every week — confirm FAAB bids run on schedule' },
      { text: 'Monitor and communicate injury reports as needed' },
      { text: 'Handle trade protests and disputes within 48 hours' },
    ],
  },
  {
    phase: 'Post-Season',
    icon: '🏁',
    items: [
      { text: 'Crown the champion — announce the final score and results' },
      { text: 'Run the annual awards vote with the league' },
      { text: 'Set next year\'s draft order based on standings' },
      { text: 'Collect dues and confirm all managers returning' },
    ],
  },
];

const RESOURCES: Resource[] = [
  {
    icon: '📖',
    label: 'Sleeper Commissioner Guide',
    description: 'Official Sleeper platform guide for commissioners',
    href: 'https://support.sleeper.com/en/articles/commissioner-tools',
    external: true,
  },
  {
    icon: '📜',
    label: 'BMFFFL Constitution',
    description: 'The founding charter and governing document of the league',
    href: '/constitution',
  },
  {
    icon: '📋',
    label: 'League Rules',
    description: 'Full current rulebook for BMFFFL',
    href: '/rules',
  },
  {
    icon: '📚',
    label: 'League History',
    description: 'All seasons, champions, and historical records',
    href: '/history',
  },
];

const TIMELINE: TimelineEntry[] = [
  { year: 2020, event: 'Grandes founds BMFFFL. First draft held. cogdeill11 wins inaugural championship.' },
  { year: 2021, event: 'Taxi squad added by league vote (10-2). Grandes establishes formal dispute process.' },
  { year: 2022, event: 'Keeper limit expanded to 3. Grandes wins championship — commissioner takes the crown.' },
  { year: 2023, event: 'FAAB implemented by near-unanimous vote (11-1). Replaces waiver wire priority system.' },
  { year: 2024, event: 'Playoff expansion to 6 teams fails in vote (5-7). Grandes rules stand firm.' },
  { year: 2025, event: 'Six seasons complete. League remains 12 managers, fully intact. Governance holds.' },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CommissionerToolkitPage() {
  return (
    <>
      <Head>
        <title>Commissioner Toolkit — BMFFFL</title>
        <meta
          name="description"
          content="Commissioner Toolkit — Grandes' Workshop. Tools, checklists, and resources for running the BMFFFL dynasty fantasy football league."
        />
      </Head>

      <main className="min-h-screen bg-[#0d0d1a] text-slate-200">

        {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: 'Admin', href: '/admin' },
            { label: 'Commissioner Toolkit' },
          ]} />
        </div>

        {/* ── Hero ───────────────────────────────────────────────────────────── */}
        <section className="relative flex flex-col items-center justify-center py-20 px-4 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(255,215,0,0.06) 0%, transparent 70%)' }}
            aria-hidden="true"
          />
          <span className="text-6xl mb-6" role="img" aria-label="Scales of justice">⚖️</span>
          <h1
            className="text-4xl md:text-5xl font-black tracking-widest text-center"
            style={{ color: '#ffd700', textShadow: '0 0 30px rgba(255,215,0,0.4)' }}
          >
            COMMISSIONER TOOLKIT
          </h1>
          <p className="mt-3 text-slate-400 text-sm md:text-base tracking-widest uppercase text-center">
            Grandes&rsquo; Workshop
          </p>
          <p className="mt-4 text-slate-500 text-sm text-center max-w-lg">
            Everything needed to run the BMFFFL with the precision, clarity, and quiet authority the league demands.
          </p>
        </section>

        <div className="max-w-5xl mx-auto px-4 pb-20 space-y-14">

          {/* ── Quick Actions ──────────────────────────────────────────────────── */}
          <section>
            <SectionHeader icon="⚡" title="Quick Actions" subtitle="Commonly used commissioner tools and destinations" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {QUICK_ACTIONS.map((action) => (
                <QuickActionCard key={action.label} action={action} />
              ))}
            </div>
          </section>

          {/* ── Season Checklist ────────────────────────────────────────────────── */}
          <section>
            <SectionHeader icon="✅" title="Season Checklist" subtitle="Commissioner responsibilities across the full league year" />
            <div className="grid sm:grid-cols-3 gap-6 mt-6">
              {CHECKLISTS.map((section) => (
                <div
                  key={section.phase}
                  className="rounded-xl border border-[#2d4a66] bg-[#111827] p-5 flex flex-col gap-3"
                >
                  <div className="flex items-center gap-2 border-b border-[#2d4a66] pb-3">
                    <span className="text-xl" role="img" aria-label={section.phase}>{section.icon}</span>
                    <h3 className="text-base font-bold text-slate-100">{section.phase}</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-400">
                        <span className="mt-0.5 text-slate-600 flex-shrink-0">&#9633;</span>
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* ── Commissioner Resources ──────────────────────────────────────────── */}
          <section>
            <SectionHeader icon="📚" title="Commissioner Resources" subtitle="Essential references for running the league" />
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              {RESOURCES.map((resource) => (
                <a
                  key={resource.label}
                  href={resource.href}
                  target={resource.external ? '_blank' : undefined}
                  rel={resource.external ? 'noopener noreferrer' : undefined}
                  className={cn(
                    'flex items-start gap-4 rounded-xl border border-[#2d4a66] bg-[#111827] p-5',
                    'hover:border-[#ffd700]/40 hover:bg-[#1a1a2e] transition-colors duration-150'
                  )}
                >
                  <span className="text-2xl flex-shrink-0 mt-0.5" role="img" aria-label={resource.label}>{resource.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                      {resource.label}
                      {resource.external && (
                        <span className="text-xs text-slate-600 font-normal">&#8599;</span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{resource.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* ── Commissioner History ──────────────────────────────────────────── */}
          <section>
            <SectionHeader icon="📜" title="Commissioner History" subtitle="Six seasons of governance under Grandes" />
            <div className="mt-6 relative">
              {/* Vertical line */}
              <div className="absolute left-5 top-0 bottom-0 w-px bg-[#2d4a66]" aria-hidden="true" />
              <div className="space-y-6">
                {TIMELINE.map((entry) => (
                  <div key={entry.year} className="flex items-start gap-5 pl-14 relative">
                    {/* Year dot */}
                    <div
                      className="absolute left-0 w-10 h-10 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, #7a5c00, #ffd700)',
                        color: '#1a1a0a',
                        boxShadow: '0 0 8px rgba(255,215,0,0.3)',
                      }}
                    >
                      {String(entry.year).slice(2)}
                    </div>
                    <div className="rounded-xl border border-[#2d4a66] bg-[#111827] p-4 flex-1">
                      <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">{entry.year}</p>
                      <p className="text-sm text-slate-300 leading-relaxed">{entry.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Bimfle's Message ──────────────────────────────────────────────── */}
          <section>
            <SectionHeader icon="🤖" title="Bimfle's Message to the Commissioner" subtitle="A formal address from the league's artificial observer" />
            <div
              className="mt-6 rounded-xl border p-8"
              style={{ background: 'rgba(255,215,0,0.03)', borderColor: 'rgba(255,215,0,0.2)' }}
            >
              <div className="flex items-start gap-5">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #1a1a2e, #2d4a66)',
                    border: '2px solid rgba(255,215,0,0.3)',
                    boxShadow: '0 0 16px rgba(255,215,0,0.1)',
                  }}
                >
                  🤖
                </div>
                <div>
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">
                    BIMFLE — Formal Address — Commissioner
                  </p>
                  <blockquote className="text-base text-slate-200 leading-relaxed space-y-3">
                    <p>
                      &ldquo;Commissioner Grandes.
                    </p>
                    <p>
                      Your record: 6 years. 0 vetoes. 1 override. This is good governance.
                    </p>
                    <p>
                      You built the structure. You set the rules. You won once. You lost more than once.
                      You treated both the same. The league is better for this.
                    </p>
                    <p>
                      Continue.&rdquo;
                    </p>
                  </blockquote>
                  <footer className="mt-4 text-xs text-amber-600/70 font-mono">
                    — Bimfle, League Observer &amp; Chronicler
                  </footer>
                </div>
              </div>
            </div>
          </section>

          {/* ── Page Status Overview ───────────────────────────────────────── */}
          <section aria-labelledby="page-status-heading" className="pt-8">
            <SectionHeader
              icon="🗄️"
              title="Page Status"
              subtitle="Data quality and validation status across all site pages"
            />
            <PageStatusOverview />
          </section>

          {/* ── Back link ─────────────────────────────────────────────────────── */}
          <div className="pt-4">
            <Link
              href="/admin/vault"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors duration-150"
            >
              &larr; Commissioner&rsquo;s Vault
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-3 border-b border-[#2d4a66] pb-4">
      <span className="text-2xl flex-shrink-0 mt-0.5" role="img" aria-label={title}>{icon}</span>
      <div>
        <h2 className="text-xl font-bold text-slate-100 tracking-wide">{title}</h2>
        <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

const STATUS_META: Record<PageStatus, { label: string; color: string; dot: string }> = {
  validated:      { label: 'Validated',    color: 'text-emerald-400', dot: 'bg-emerald-500' },
  partial:        { label: 'Partial',      color: 'text-yellow-400',  dot: 'bg-yellow-500' },
  placeholder:    { label: 'Placeholder',  color: 'text-orange-400',  dot: 'bg-orange-500' },
  'coming-soon':  { label: 'Coming Soon',  color: 'text-slate-400',   dot: 'bg-slate-600' },
};

function PageStatusOverview() {
  const summary = getStatusSummary();
  const needsAttention = Object.values(PAGE_STATUS).filter(
    p => p.status === 'placeholder'
  );

  return (
    <div className="mt-4 space-y-4">
      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.keys(STATUS_META) as PageStatus[]).map(status => {
          const meta = STATUS_META[status];
          return (
            <div key={status} className="flex flex-col gap-1 rounded-lg border border-[#2d4a66] bg-[#111827] px-3 py-2">
              <div className="flex items-center gap-1.5">
                <span className={`inline-block h-2 w-2 rounded-full ${meta.dot}`} />
                <span className={`text-xs font-semibold ${meta.color}`}>{meta.label}</span>
              </div>
              <span className="text-2xl font-black text-white">{summary[status]}</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest">pages</span>
            </div>
          );
        })}
      </div>

      {/* Needs attention */}
      {needsAttention.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-2">
            ⚠ Placeholder pages — data not validated
          </p>
          <div className="space-y-1">
            {needsAttention.map(page => (
              <div key={page.path} className="flex items-start gap-2 text-xs text-slate-400 py-0.5">
                <span className="text-orange-500 flex-shrink-0 mt-0.5">•</span>
                <span className="font-mono text-slate-300">{page.path}</span>
                {page.notes && <span className="text-slate-500"> — {page.notes}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-[10px] text-slate-600">
        Last updated 2026-04-14 by Flint. Edit <code>src/data/page-status.ts</code> to update.
      </p>
    </div>
  );
}

function QuickActionCard({ action }: { action: QuickAction }) {
  const inner = (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-xl border border-[#2d4a66] bg-[#111827] p-5 h-full',
        action.href && 'hover:border-[#ffd700]/40 hover:bg-[#1a1a2e] transition-colors duration-150 cursor-pointer'
      )}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl flex-shrink-0" role="img" aria-label={action.label}>{action.icon}</span>
        <p className="text-sm font-bold text-slate-100">{action.label}</p>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">{action.description}</p>
    </div>
  );

  if (action.href) {
    return <Link href={action.href} className="block h-full">{inner}</Link>;
  }

  return <div className="h-full">{inner}</div>;
}
