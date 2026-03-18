import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticProps } from 'next';
import {
  Trophy,
  CheckCircle2,
  Clock,
  Circle,
  Calendar,
  Users,
  FileText,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import Badge from '@/components/ui/Badge';
import OwnerCard from '@/components/owners/OwnerCard';
import type { OwnerCardData } from '@/components/owners/OwnerCard';

// ─── Offseason Timeline Data ─────────────────────────────────────────────────

type TimelineStatus = 'done' | 'active' | 'upcoming';

interface TimelineItem {
  status: TimelineStatus;
  label: string;
  dateRange: string;
  description: string;
}

const TIMELINE: TimelineItem[] = [
  {
    status: 'done',
    label: 'Free Agency',
    dateRange: 'Feb – Mar 2026',
    description: 'Key signings tracked. See free agency impact article.',
  },
  {
    status: 'active',
    label: 'NFL Draft',
    dateRange: 'April 2026',
    description: 'Draft tracker coming soon. Prospect profiles live.',
  },
  {
    status: 'upcoming',
    label: 'BMFFFL Owners Meeting',
    dateRange: 'May 2026',
    description: 'Date TBD',
  },
  {
    status: 'upcoming',
    label: 'BMFFFL Rookie Draft',
    dateRange: 'June 2026 (first Friday)',
    description: 'Linear format, 4 rounds',
  },
  {
    status: 'upcoming',
    label: 'Preseason / FAAB Opens',
    dateRange: 'July 2026',
    description: '',
  },
  {
    status: 'upcoming',
    label: 'Regular Season Week 1',
    dateRange: 'September 2026',
    description: '',
  },
];

// ─── Owner Roster Data ────────────────────────────────────────────────────────

const OWNERS: OwnerCardData[] = [
  {
    name: 'Cogdeill11',
    teamName: 'Dynasty Rank #1',
    allTimeRecord: { wins: 68, losses: 22, ties: 0, winPct: 0.755 },
    championships: 2,
    playoffAppearances: 5,
    winPct: 0.755,
  },
  {
    name: 'MLSchools12',
    teamName: 'Dynasty Rank #2',
    allTimeRecord: { wins: 55, losses: 35, ties: 0, winPct: 0.611 },
    championships: 1,
    playoffAppearances: 4,
    winPct: 0.611,
  },
  {
    name: 'rbr',
    teamName: 'Really Big Rings — 2025 Champion',
    allTimeRecord: { wins: 52, losses: 38, ties: 0, winPct: 0.578 },
    championships: 1,
    playoffAppearances: 4,
    winPct: 0.578,
  },
  {
    name: 'Tubes94',
    teamName: 'Rising Contender',
    allTimeRecord: { wins: 35, losses: 35, ties: 0, winPct: 0.5 },
    championships: 0,
    playoffAppearances: 1,
    winPct: 0.5,
  },
  {
    name: 'JuicyBussy',
    teamName: '2024 Champion',
    allTimeRecord: { wins: 48, losses: 42, ties: 0, winPct: 0.533 },
    championships: 1,
    playoffAppearances: 3,
    winPct: 0.533,
  },
  {
    name: 'tdtd19844',
    teamName: '2022 Champion',
    allTimeRecord: { wins: 45, losses: 45, ties: 0, winPct: 0.5 },
    championships: 1,
    playoffAppearances: 3,
    winPct: 0.5,
  },
  {
    name: 'SexMachineAndyD',
    teamName: 'Perennial Contender',
    allTimeRecord: { wins: 44, losses: 46, ties: 0, winPct: 0.489 },
    championships: 0,
    playoffAppearances: 3,
    winPct: 0.489,
  },
  {
    name: 'eldridm20',
    teamName: 'Rebuilding',
    allTimeRecord: { wins: 42, losses: 48, ties: 0, winPct: 0.467 },
    championships: 0,
    playoffAppearances: 2,
    winPct: 0.467,
  },
  {
    name: 'Grandes',
    teamName: 'Steady Presence',
    allTimeRecord: { wins: 40, losses: 50, ties: 0, winPct: 0.444 },
    championships: 0,
    playoffAppearances: 2,
    winPct: 0.444,
  },
  {
    name: 'eldridsm',
    teamName: 'Fighting Back',
    allTimeRecord: { wins: 32, losses: 58, ties: 0, winPct: 0.356 },
    championships: 0,
    playoffAppearances: 1,
    winPct: 0.356,
  },
  {
    name: 'Cmaleski',
    teamName: 'Seeking First Ring',
    allTimeRecord: { wins: 30, losses: 60, ties: 0, winPct: 0.333 },
    championships: 0,
    playoffAppearances: 0,
    winPct: 0.333,
  },
  {
    name: 'Bimfle',
    teamName: 'Developing Roster',
    allTimeRecord: { wins: 8, losses: 34, ties: 0, winPct: 0.19 },
    championships: 0,
    playoffAppearances: 0,
    winPct: 0.19,
  },
];

// ─── Quick Links Data ─────────────────────────────────────────────────────────

interface QuickLink {
  href: string;
  label: string;
  description: string;
  icon: 'article' | 'book' | 'calendar' | 'users';
}

const QUICK_LINKS: QuickLink[] = [
  {
    href: '/season/matchups',
    label: '2025 Matchups',
    description: 'All 14 regular season weeks + full playoff bracket',
    icon: 'calendar',
  },
  {
    href: '/articles/2026-rookie-draft-preview',
    label: 'Draft Preview',
    description: '2026 Rookie Draft — full class rankings',
    icon: 'article',
  },
  {
    href: '/articles/2026-free-agency-dynasty-impact',
    label: 'Free Agency Impact',
    description: 'NFL free agency moves for dynasty managers',
    icon: 'book',
  },
  {
    href: '/articles/state-of-the-league-march-2026',
    label: 'State of the League',
    description: 'Where every owner stands heading into 2026',
    icon: 'article',
  },
  {
    href: '/owners',
    label: 'Owner Rosters',
    description: 'View every team\'s full dynasty roster',
    icon: 'users',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function TimelineStatusIcon({ status }: { status: TimelineStatus }) {
  if (status === 'done') {
    return (
      <CheckCircle2
        className="w-5 h-5 text-[#22c55e] shrink-0"
        aria-label="Completed"
      />
    );
  }
  if (status === 'active') {
    return (
      <Clock
        className="w-5 h-5 text-[#ffd700] shrink-0 animate-pulse"
        aria-label="In progress"
      />
    );
  }
  return (
    <Circle
      className="w-5 h-5 text-slate-600 shrink-0"
      aria-label="Upcoming"
    />
  );
}

function QuickLinkIcon({ icon }: { icon: QuickLink['icon'] }) {
  const cls = 'w-5 h-5';
  if (icon === 'article') return <FileText className={cls} aria-hidden="true" />;
  if (icon === 'book')    return <BookOpen className={cls} aria-hidden="true" />;
  if (icon === 'calendar') return <Calendar className={cls} aria-hidden="true" />;
  return <Users className={cls} aria-hidden="true" />;
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function SeasonIndexPage() {
  return (
    <>
      <Head>
        <title>2026 Season — BMFFFL</title>
        <meta
          name="description"
          content="BMFFFL 2026 offseason hub. 2025 champion: rbr (Really Big Rings). Offseason timeline, roster status, and key links."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Page header ───────────────────────────────────────────────── */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-700/40 border border-[#2d4a66] text-slate-400 text-xs font-semibold uppercase tracking-widest mb-4">
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            Offseason
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-3">
            2026 Season
          </h1>
          <p className="text-slate-400 text-lg">
            BMFFFL &bull; Offseason Hub
          </p>
        </header>

        {/* ── Champion banner ───────────────────────────────────────────── */}
        <div className="mb-10 rounded-xl bg-[#ffd700]/5 border border-[#ffd700]/30 px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 shadow-lg shadow-[#ffd700]/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ffd700]/20 border-2 border-[#ffd700] flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#ffd700]/70 mb-0.5">
                Reigning Champion
              </p>
              <p className="text-xl font-black text-[#ffd700]">
                rbr — Really Big Rings
              </p>
            </div>
          </div>
          <div className="sm:ml-auto flex items-center gap-3">
            <Badge variant="champion" size="md">2025 Champion</Badge>
            <Link
              href="/history/2025"
              className="text-xs text-slate-400 hover:text-[#ffd700] transition-colors duration-150 underline underline-offset-2"
            >
              View 2025 season
            </Link>
          </div>
        </div>

        {/* ── Two-column layout: Timeline + Quick Links ─────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

          {/* Offseason Timeline */}
          <section className="lg:col-span-2" aria-labelledby="timeline-heading">
            <h2 id="timeline-heading" className="text-2xl font-black text-white mb-5">
              Offseason Timeline
            </h2>

            <div className="relative">
              {/* Vertical line */}
              <div
                className="absolute left-[9px] top-0 bottom-0 w-px bg-[#2d4a66]"
                aria-hidden="true"
              />

              <ol className="space-y-1">
                {TIMELINE.map((item, idx) => (
                  <li
                    key={idx}
                    className={cn(
                      'relative flex gap-4 rounded-xl p-4 pl-8 border transition-colors duration-150',
                      item.status === 'done'
                        ? 'bg-[#22c55e]/5 border-[#22c55e]/20'
                        : item.status === 'active'
                        ? 'bg-[#ffd700]/5 border-[#ffd700]/30'
                        : 'bg-[#16213e] border-[#2d4a66]'
                    )}
                  >
                    {/* Icon — positioned over the vertical line */}
                    <div className="absolute left-2 top-4">
                      <TimelineStatusIcon status={item.status} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                        <span
                          className={cn(
                            'font-bold text-sm',
                            item.status === 'done'
                              ? 'text-[#22c55e]'
                              : item.status === 'active'
                              ? 'text-[#ffd700]'
                              : 'text-white'
                          )}
                        >
                          {item.label}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          {item.dateRange}
                        </span>
                        {item.status === 'active' && (
                          <span className="inline-flex px-2 py-0.5 rounded-full bg-[#ffd700]/20 text-[#ffd700] text-[10px] font-bold uppercase tracking-wider border border-[#ffd700]/30 w-fit">
                            In Progress
                          </span>
                        )}
                        {item.status === 'done' && (
                          <span className="inline-flex px-2 py-0.5 rounded-full bg-[#22c55e]/20 text-[#22c55e] text-[10px] font-bold uppercase tracking-wider border border-[#22c55e]/30 w-fit">
                            Complete
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Quick Links */}
          <section aria-labelledby="quick-links-heading">
            <h2 id="quick-links-heading" className="text-2xl font-black text-white mb-5">
              Quick Links
            </h2>
            <div className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-start gap-3 rounded-xl bg-[#16213e] border border-[#2d4a66] p-4 hover:border-[#e94560] hover:bg-[#1a1a2e] transition-all duration-150"
                >
                  <div className="mt-0.5 text-[#e94560] group-hover:text-white transition-colors duration-150">
                    <QuickLinkIcon icon={link.icon} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white group-hover:text-[#ffd700] transition-colors duration-150">
                      {link.label}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                      {link.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* ── Current Rosters ───────────────────────────────────────────── */}
        <section aria-labelledby="rosters-heading">
          <div className="flex items-center justify-between mb-5">
            <h2 id="rosters-heading" className="text-2xl font-black text-white">
              Current Rosters
            </h2>
            <Link
              href="/owners"
              className="text-sm text-slate-400 hover:text-[#ffd700] transition-colors duration-150"
            >
              View all owners &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {OWNERS.map((owner) => (
              <OwnerCard
                key={owner.name}
                owner={owner}
                variant="expanded"
              />
            ))}
          </div>
        </section>

      </div>
    </>
  );
}

// ─── Static Generation ────────────────────────────────────────────────────────

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} };
};
