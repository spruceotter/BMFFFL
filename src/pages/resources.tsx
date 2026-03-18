import Head from 'next/head';
import Link from 'next/link';
import {
  ExternalLink,
  Link2,
  Calendar,
  BookOpen,
  Trophy,
  Star,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Data ─────────────────────────────────────────────────────────────────────

interface ExternalLinkItem {
  label: string;
  href: string;
  description: string;
}

interface InternalLinkItem {
  label: string;
  href: string;
  description: string;
}

interface CalendarEvent {
  title: string;
  date: string;
  note?: string;
}

const DYNASTY_TOOLS: ExternalLinkItem[] = [
  {
    label: 'KeepTradeCut.com',
    href: 'https://keeptradecut.com',
    description: 'Dynasty trade values and rankings',
  },
  {
    label: 'DynastyProcess.com',
    href: 'https://dynastyprocess.com',
    description: 'Advanced dynasty analytics',
  },
  {
    label: 'FantasyPros.com',
    href: 'https://fantasypros.com',
    description: 'Expert consensus rankings',
  },
  {
    label: 'DynastyNerds.com',
    href: 'https://dynastynerds.com',
    description: 'Dynasty rankings and tools',
  },
  {
    label: 'SleeperBot Discord',
    href: 'https://discord.gg/sleeper',
    description: 'Community dynasty discussion',
  },
];

const BMFFFL_RESOURCES: InternalLinkItem[] = [
  {
    label: 'Go to Sleeper',
    href: 'https://sleeper.com/leagues/910140889474326528',
    description: 'Sleeper League',
  },
  {
    label: 'Trade Analyzer',
    href: '/analytics/trade-analyzer',
    description: 'Evaluate trade value and fairness',
  },
  {
    label: 'Draft Pick Calculator',
    href: '/analytics/draft-pick-calculator',
    description: 'Dynasty pick value estimator',
  },
  {
    label: 'Dynasty Rankings',
    href: '/analytics/dynasty-rankings',
    description: 'Current BMFFFL dynasty rankings',
  },
  {
    label: 'Buy / Sell / Hold',
    href: '/analytics/buy-sell',
    description: 'Roster move recommendations',
  },
];

const RULES_RESOURCES: InternalLinkItem[] = [
  {
    label: 'League Rules',
    href: '/rules',
    description: 'Official BMFFFL rules and laws',
  },
  {
    label: 'Constitution',
    href: '/constitution',
    description: 'Founding document of the BMFFFL',
  },
  {
    label: 'Bimfle',
    href: '/bimfle',
    description: 'AI Commissioner Assistant',
  },
  {
    label: 'Records',
    href: '/records',
    description: 'All-time BMFFFL records and milestones',
  },
];

const CALENDAR_EVENTS: CalendarEvent[] = [
  {
    title: 'NFL Free Agency',
    date: 'March 12, 2026',
  },
  {
    title: 'NFL Draft',
    date: 'April 24–26, 2026',
  },
  {
    title: 'Annual Owners Meeting',
    date: 'May 2026',
    note: 'Date TBD by Commissioner',
  },
  {
    title: 'BMFFFL Rookie Draft',
    date: 'First Friday of June 2026',
    note: '4 rounds, linear order',
  },
  {
    title: 'BMFFFL Season Start',
    date: 'September 2026',
    note: 'NFL Week 1',
  },
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

function ExternalLinkCard({ item }: { item: ExternalLinkItem }) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group flex items-center justify-between gap-4 rounded-xl p-4',
        'bg-[#16213e] border border-[#2d4a66]',
        'hover:border-[#ffd700]/50 hover:bg-[#1a2d42]',
        'transition-colors duration-150'
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="shrink-0 w-8 h-8 rounded-lg bg-[#0d1b2a] border border-[#2d4a66] flex items-center justify-center group-hover:border-[#ffd700]/30 transition-colors duration-150">
          <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#ffd700] transition-colors duration-150" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white group-hover:text-[#ffd700] transition-colors duration-150 leading-snug">
            {item.label}
          </p>
          <p className="text-xs text-slate-500 leading-snug mt-0.5 truncate">
            {item.description}
          </p>
        </div>
      </div>
      <ExternalLink
        className="w-3.5 h-3.5 text-slate-600 group-hover:text-[#ffd700]/60 shrink-0 transition-colors duration-150"
        aria-hidden="true"
      />
    </a>
  );
}

function InternalLinkCard({
  item,
  external = false,
}: {
  item: InternalLinkItem;
  external?: boolean;
}) {
  const sharedClasses = cn(
    'group flex items-center justify-between gap-4 rounded-xl p-4',
    'bg-[#16213e] border border-[#2d4a66]',
    'hover:border-[#ffd700]/50 hover:bg-[#1a2d42]',
    'transition-colors duration-150'
  );

  const inner = (
    <>
      <div className="flex items-center gap-3 min-w-0">
        <div className="shrink-0 w-8 h-8 rounded-lg bg-[#0d1b2a] border border-[#2d4a66] flex items-center justify-center group-hover:border-[#ffd700]/30 transition-colors duration-150">
          <Link2 className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#ffd700] transition-colors duration-150" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white group-hover:text-[#ffd700] transition-colors duration-150 leading-snug">
            {item.label}
          </p>
          <p className="text-xs text-slate-500 leading-snug mt-0.5 truncate">
            {item.description}
          </p>
        </div>
      </div>
      <ArrowRight
        className="w-3.5 h-3.5 text-slate-600 group-hover:text-[#ffd700]/60 shrink-0 transition-colors duration-150"
        aria-hidden="true"
      />
    </>
  );

  if (external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={sharedClasses}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={item.href} className={sharedClasses}>
      {inner}
    </Link>
  );
}

function CalendarCard({ event }: { event: CalendarEvent }) {
  return (
    <div
      className={cn(
        'rounded-xl p-4 bg-[#16213e] border border-[#2d4a66]',
        'flex items-start gap-3'
      )}
    >
      <div className="shrink-0 w-8 h-8 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/20 flex items-center justify-center mt-0.5">
        <Calendar className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-white leading-snug">{event.title}</p>
        <p className="text-xs font-semibold text-[#ffd700] mt-0.5">{event.date}</p>
        {event.note && (
          <p className="text-[11px] text-slate-500 mt-1 leading-snug">{event.note}</p>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResourcesPage() {
  return (
    <>
      <Head>
        <title>Resources — BMFFFL</title>
        <meta
          name="description"
          content="Useful links and resources for BMFFFL managers — dynasty tools, league links, rules reference, and the 2026 calendar."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#ffd700] transition-colors duration-150">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-300">Resources</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Manager Hub
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            Resources
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
            Everything a BMFFFL manager needs — dynasty tools, league links, rules reference,
            and the 2026 season calendar.
          </p>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left column */}
          <div className="space-y-10">

            {/* ── Dynasty Tools ──────────────────────────────────────── */}
            <section aria-labelledby="dynasty-tools-heading">
              <SectionHeader
                icon={Star}
                id="dynasty-tools-heading"
                label="External"
                title="Dynasty Tools"
              />
              <div className="space-y-2.5">
                {DYNASTY_TOOLS.map((item) => (
                  <ExternalLinkCard key={item.href} item={item} />
                ))}
              </div>
            </section>

            {/* ── BMFFFL-Specific Resources ──────────────────────────── */}
            <section aria-labelledby="bmfffl-resources-heading">
              <SectionHeader
                icon={Trophy}
                id="bmfffl-resources-heading"
                label="League"
                title="BMFFFL-Specific Resources"
              />
              <div className="space-y-2.5">
                {BMFFFL_RESOURCES.map((item, idx) => (
                  <InternalLinkCard
                    key={item.href}
                    item={item}
                    external={idx === 0} /* Sleeper link is external */
                  />
                ))}
              </div>
            </section>

          </div>

          {/* Right column */}
          <div className="space-y-10">

            {/* ── Rules & Reference ──────────────────────────────────── */}
            <section aria-labelledby="rules-heading">
              <SectionHeader
                icon={BookOpen}
                id="rules-heading"
                label="Reference"
                title="Rules &amp; Reference"
              />
              <div className="space-y-2.5">
                {RULES_RESOURCES.map((item) => (
                  <InternalLinkCard key={item.href} item={item} />
                ))}
              </div>
            </section>

            {/* ── 2026 Calendar ──────────────────────────────────────── */}
            <section aria-labelledby="calendar-heading">
              <SectionHeader
                icon={Clock}
                id="calendar-heading"
                label="Informational"
                title="2026 Calendar"
              />
              <div className="space-y-2.5">
                {CALENDAR_EVENTS.map((event) => (
                  <CalendarCard key={event.title} event={event} />
                ))}
              </div>

              {/* Calendar CTA */}
              <div className="mt-4">
                <Link
                  href="/calendar"
                  className={cn(
                    'inline-flex items-center gap-2 text-xs font-semibold',
                    'text-slate-400 hover:text-[#ffd700]',
                    'transition-colors duration-150'
                  )}
                >
                  <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                  View full league calendar
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
              </div>
            </section>

          </div>
        </div>

        {/* ── Bottom note ────────────────────────────────────────────────── */}
        <p className="mt-12 text-xs text-center text-slate-600">
          External links open in a new tab. BMFFFL is not affiliated with any third-party tools listed above.
        </p>
      </div>
    </>
  );
}
