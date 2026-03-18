import Head from 'next/head';
import Link from 'next/link';
import {
  LayoutDashboard,
  CheckCircle,
  AlertCircle,
  Calendar,
  Activity,
  Users,
  Clock,
  Trophy,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Data ─────────────────────────────────────────────────────────────────────

interface StandingsRow {
  rank: number;
  owner: string;
  record: string;
  pf: string;
  playoff: boolean;
  champion?: boolean;
  runnerUp?: boolean;
  note?: string;
}

const STANDINGS_2025: StandingsRow[] = [
  { rank: 1,  owner: 'tdtd19844',       record: '6-8',  pf: '1,814.2', playoff: true,  champion: true                  },
  { rank: 2,  owner: 'Tubes94',         record: '11-3', pf: '2,203.6', playoff: true,  runnerUp: true                  },
  { rank: 3,  owner: 'JuicyBussy',      record: '9-5',  pf: '2,098.4', playoff: true                                   },
  { rank: 4,  owner: 'MLSchools12',     record: '8-6',  pf: '2,011.8', playoff: true,  note: 'Eliminated in semis'     },
  { rank: 5,  owner: 'SexMachineAndyD', record: '7-7',  pf: '1,934.5', playoff: false                                  },
  { rank: 6,  owner: 'Cmaleski',        record: '7-7',  pf: '1,921.0', playoff: true,  note: 'First Round exit'        },
  { rank: 7,  owner: 'rbr',             record: '6-8',  pf: '1,888.3', playoff: false                                  },
  { rank: 8,  owner: 'eldridsm',        record: '6-8',  pf: '1,842.7', playoff: false                                  },
  { rank: 9,  owner: 'eldridm20',       record: '5-9',  pf: '1,790.1', playoff: false                                  },
  { rank: 10, owner: 'Grandes',         record: '4-10', pf: '1,711.4', playoff: false, note: 'Moodie Bowl'             },
  { rank: 11, owner: 'Cogdeill11',      record: '4-10', pf: '1,689.9', playoff: false                                  },
  { rank: 12, owner: 'Escuelas',        record: '3-11', pf: '1,602.3', playoff: false                                  },
];

interface ActivityEvent {
  date: string;
  description: string;
  type: 'milestone' | 'result' | 'admin' | 'offseason';
}

const ACTIVITY_FEED: ActivityEvent[] = [
  { date: '2026-01-15', description: '2025 Season concluded. tdtd19844 crowned champion.', type: 'milestone' },
  { date: '2025-12-28', description: 'Championship: tdtd19844 def. Tubes94', type: 'result' },
  { date: '2025-12-21', description: 'Semis: tdtd19844 def. MLSchools12; Tubes94 def. JuicyBussy', type: 'result' },
  { date: '2025-11-20', description: 'Waiver order reset for playoffs', type: 'admin' },
  { date: '2025-10-01', description: 'Regular season trade deadline passed', type: 'admin' },
  { date: '2025-08-30', description: '2025 Rookie Draft completed — 36 picks made', type: 'milestone' },
  { date: '2025-07-15', description: '2025–26 Owners Meeting held', type: 'milestone' },
  { date: '2025-03-01', description: '2025 Offseason began', type: 'offseason' },
  { date: '2024-12-29', description: 'MLSchools12 wins 2024 championship', type: 'milestone' },
  { date: '2024-08-28', description: '2024 Rookie Draft completed', type: 'milestone' },
];

interface ActionItem {
  label: string;
  status: 'pending' | 'scheduled' | 'tbd';
}

const ACTION_ITEMS: ActionItem[] = [
  { label: 'Deploy to production (GitHub → Vercel) — awaiting captain', status: 'pending' },
  { label: '2026 Rookie Draft order: TBD (inverse standings)', status: 'tbd' },
  { label: '2026 Owners Meeting: Date TBD', status: 'tbd' },
  { label: 'Constitution amendment vote: Keeper rules update — pending', status: 'pending' },
  { label: 'FAAB reset for 2026 season: Scheduled', status: 'scheduled' },
];

interface CalendarEntry {
  month: string;
  label: string;
  note: string;
}

const CALENDAR: CalendarEntry[] = [
  { month: 'March 2026',    label: 'NFL Combine / Rookie scouting',    note: 'Ongoing' },
  { month: 'April 2026',    label: '2026 Rookie Draft',                note: 'Exact date TBD' },
  { month: 'May 2026',      label: 'Owners Meeting',                   note: 'Date TBD' },
  { month: 'August 2026',   label: '2026 Season kickoff',              note: 'Roster locks' },
  { month: 'September 2026',label: 'Regular season starts',            note: 'NFL Week 1' },
];

interface QuickLink {
  label: string;
  href: string;
}

const QUICK_LINKS: QuickLink[] = [
  { label: 'Power Rankings',    href: '/analytics/power-rankings' },
  { label: 'Dynasty Rankings',  href: '/analytics/dynasty-rankings' },
  { label: 'Trade Ledger',      href: '/analytics/trade-ledger' },
  { label: 'Owner Dashboard',   href: '/analytics/owners' },
  { label: 'Constitution',      href: '/constitution' },
  { label: 'League Rules',      href: '/rules' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function activityDotColor(type: ActivityEvent['type']): string {
  switch (type) {
    case 'milestone': return 'bg-[#ffd700]';
    case 'result':    return 'bg-emerald-400';
    case 'admin':     return 'bg-slate-500';
    case 'offseason': return 'bg-blue-400';
  }
}

function actionStatusBadge(status: ActionItem['status']) {
  switch (status) {
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border border-amber-500/30 bg-amber-500/10 text-amber-400">
          <Clock className="w-2.5 h-2.5" aria-hidden="true" />
          Pending
        </span>
      );
    case 'scheduled':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
          <CheckCircle className="w-2.5 h-2.5" aria-hidden="true" />
          Scheduled
        </span>
      );
    case 'tbd':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border border-slate-600/60 bg-slate-700/40 text-slate-400">
          <AlertCircle className="w-2.5 h-2.5" aria-hidden="true" />
          TBD
        </span>
      );
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeading({
  icon,
  id,
  children,
}: {
  icon: React.ReactNode;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-[#ffd700]" aria-hidden="true">{icon}</span>
      <h2
        id={id}
        className="text-base font-black text-white uppercase tracking-wider"
      >
        {children}
      </h2>
    </div>
  );
}

function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[#2d4a66] bg-[#16213e] p-5',
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CommissionerDashboardPage() {
  return (
    <>
      <Head>
        <title>Commissioner Dashboard — BMFFFL</title>
        <meta
          name="description"
          content="BMFFFL Commissioner Dashboard — a read-only league ops center showing standings, recent activity, open action items, and the upcoming 2026 calendar at a glance."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <LayoutDashboard className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            Commissioner Dashboard
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            League Operations Center —{' '}
            <span className="text-slate-500 font-medium">Read Only</span>
          </p>
        </header>

        {/* ── 1. League Health Overview (stat strip) ──────────────────────── */}
        <section aria-labelledby="health-heading" className="mb-8">
          <h2 id="health-heading" className="sr-only">League Health Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

            <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Users className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Active Teams</p>
              </div>
              <p className="text-3xl font-black text-white tabular-nums leading-none">12<span className="text-slate-600 text-lg font-bold">/12</span></p>
            </div>

            <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Users className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Avg Roster Size</p>
              </div>
              <p className="text-3xl font-black text-white tabular-nums leading-none">24 <span className="text-slate-500 text-sm font-normal">players</span></p>
            </div>

            <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Activity className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">FAAB Remaining (avg)</p>
              </div>
              <p className="text-3xl font-black text-white tabular-nums leading-none"><span className="text-emerald-400">$67</span></p>
            </div>

            <div className="rounded-xl border border-[#ffd700]/20 bg-[#ffd700]/5 p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Calendar className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#ffd700]/60">Next Key Date</p>
              </div>
              <p className="text-base font-black text-[#ffd700] leading-tight">2026 Rookie Draft</p>
              <p className="text-[11px] text-slate-400 mt-0.5">April 2026</p>
            </div>

          </div>
        </section>

        {/* ── 2 + 3: Standings + Activity Feed (two-column layout) ─────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* ── 2. Standings Snapshot ──────────────────────────────────────── */}
          <section aria-labelledby="standings-heading">
            <Panel>
              <SectionHeading icon={<Trophy className="w-4 h-4" />} id="standings-heading">
                2025 Final Standings
              </SectionHeading>

              <div className="overflow-x-auto -mx-1">
                <table className="min-w-full text-xs" aria-label="2025 BMFFFL final standings">
                  <thead>
                    <tr className="border-b border-[#2d4a66]">
                      <th scope="col" className="px-2 py-2 text-left text-slate-500 font-semibold uppercase tracking-wider w-6">#</th>
                      <th scope="col" className="px-2 py-2 text-left text-slate-500 font-semibold uppercase tracking-wider">Owner</th>
                      <th scope="col" className="px-2 py-2 text-center text-slate-500 font-semibold uppercase tracking-wider">W-L</th>
                      <th scope="col" className="px-2 py-2 text-right text-slate-500 font-semibold uppercase tracking-wider">PF</th>
                      <th scope="col" className="px-2 py-2 text-center text-slate-500 font-semibold uppercase tracking-wider">PO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e3347]">
                    {STANDINGS_2025.map((row) => (
                      <tr
                        key={row.owner}
                        className={cn(
                          'transition-colors duration-100',
                          row.champion
                            ? 'bg-[#ffd700]/8 hover:bg-[#ffd700]/12'
                            : row.runnerUp
                            ? 'bg-slate-700/20 hover:bg-slate-700/30'
                            : 'hover:bg-[#1f3550]'
                        )}
                      >
                        <td className="px-2 py-2.5 text-slate-500 font-mono tabular-nums">{row.rank}</td>
                        <td className="px-2 py-2.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={cn(
                              'font-semibold',
                              row.champion ? 'text-[#ffd700]' : 'text-white'
                            )}>
                              {row.owner}
                            </span>
                            {row.champion && (
                              <span className="text-[10px]" role="img" aria-label="Champion">🏆</span>
                            )}
                            {row.note && (
                              <span className="text-[10px] text-slate-600 hidden sm:inline">{row.note}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-2 py-2.5 text-center font-mono tabular-nums text-slate-300">{row.record}</td>
                        <td className="px-2 py-2.5 text-right font-mono tabular-nums text-slate-400">{row.pf}</td>
                        <td className="px-2 py-2.5 text-center">
                          {row.playoff ? (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[9px] font-black text-emerald-400" aria-label="Made playoffs">
                              ✓
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-700/30 border border-slate-700 text-[9px] text-slate-600" aria-label="Missed playoffs">
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-[10px] text-slate-600">PF = Points For (regular season). PO = Made playoffs.</p>
            </Panel>
          </section>

          {/* ── 3. Recent Activity Feed ──────────────────────────────────── */}
          <section aria-labelledby="activity-heading">
            <Panel className="h-full">
              <SectionHeading icon={<Activity className="w-4 h-4" />} id="activity-heading">
                Recent Activity
              </SectionHeading>

              <ol className="space-y-0" aria-label="League activity feed, newest first">
                {ACTIVITY_FEED.map((event, idx) => (
                  <li
                    key={idx}
                    className={cn(
                      'flex gap-3 py-3',
                      idx < ACTIVITY_FEED.length - 1 && 'border-b border-[#1e3347]'
                    )}
                  >
                    {/* Dot + vertical line */}
                    <div className="flex flex-col items-center pt-1 shrink-0">
                      <span
                        className={cn('w-2 h-2 rounded-full shrink-0', activityDotColor(event.type))}
                        aria-hidden="true"
                      />
                      {idx < ACTIVITY_FEED.length - 1 && (
                        <span className="w-px flex-1 bg-[#2d4a66]/40 mt-1" aria-hidden="true" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-mono text-slate-500 mb-0.5 tabular-nums">{event.date}</p>
                      <p className="text-xs text-slate-300 leading-snug">{event.description}</p>
                    </div>
                  </li>
                ))}
              </ol>

              {/* Legend */}
              <div className="mt-4 pt-3 border-t border-[#2d4a66] flex flex-wrap gap-x-4 gap-y-1">
                {(
                  [
                    { color: 'bg-[#ffd700]',   label: 'Milestone' },
                    { color: 'bg-emerald-400', label: 'Result'    },
                    { color: 'bg-blue-400',    label: 'Offseason' },
                    { color: 'bg-slate-500',   label: 'Admin'     },
                  ] as { color: string; label: string }[]
                ).map(({ color, label }) => (
                  <span key={label} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <span className={cn('w-2 h-2 rounded-full shrink-0', color)} aria-hidden="true" />
                    {label}
                  </span>
                ))}
              </div>
            </Panel>
          </section>
        </div>

        {/* ── 4. Open Issues / Action Items ───────────────────────────────── */}
        <section aria-labelledby="issues-heading" className="mb-8">
          <Panel>
            <SectionHeading icon={<AlertCircle className="w-4 h-4" />} id="issues-heading">
              Open Issues / Action Items
            </SectionHeading>

            <ul className="space-y-2" aria-label="Commissioner action items">
              {ACTION_ITEMS.map((item, idx) => (
                <li
                  key={idx}
                  className={cn(
                    'flex items-start sm:items-center justify-between gap-3 rounded-lg px-4 py-3',
                    'border bg-[#0d1b2a]',
                    item.status === 'scheduled'
                      ? 'border-emerald-500/20'
                      : item.status === 'pending'
                      ? 'border-amber-500/20'
                      : 'border-[#2d4a66]'
                  )}
                >
                  <p className="text-sm text-slate-300 leading-snug">{item.label}</p>
                  <div className="shrink-0">{actionStatusBadge(item.status)}</div>
                </li>
              ))}
            </ul>
          </Panel>
        </section>

        {/* ── 5 + 6: Calendar + Quick Links (two-column) ──────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">

          {/* ── 5. League Calendar ──────────────────────────────────────── */}
          <section aria-labelledby="calendar-heading">
            <Panel className="h-full">
              <SectionHeading icon={<Calendar className="w-4 h-4" />} id="calendar-heading">
                League Calendar
              </SectionHeading>

              <ol className="space-y-0" aria-label="Upcoming league dates">
                {CALENDAR.map((entry, idx) => (
                  <li
                    key={idx}
                    className={cn(
                      'flex items-start gap-4 py-3',
                      idx < CALENDAR.length - 1 && 'border-b border-[#1e3347]'
                    )}
                  >
                    <div className="shrink-0 mt-0.5">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/20">
                        <Calendar className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-0.5">{entry.month}</p>
                      <p className="text-sm font-semibold text-white leading-snug">{entry.label}</p>
                      <p className="text-[11px] text-slate-500">{entry.note}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Panel>
          </section>

          {/* ── 6. Quick Links ──────────────────────────────────────────── */}
          <section aria-labelledby="links-heading">
            <Panel className="h-full">
              <SectionHeading icon={<ExternalLink className="w-4 h-4" />} id="links-heading">
                Quick Links
              </SectionHeading>

              <ul className="grid grid-cols-1 gap-2" aria-label="Key league page links">
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        'flex items-center justify-between gap-3 rounded-lg border border-[#2d4a66] bg-[#0d1b2a] px-4 py-3',
                        'text-sm text-slate-300 font-medium',
                        'hover:border-[#ffd700]/30 hover:text-white hover:bg-[#ffd700]/5',
                        'transition-colors duration-150 group'
                      )}
                    >
                      {link.label}
                      <ExternalLink
                        className="w-3.5 h-3.5 text-slate-600 group-hover:text-[#ffd700]/60 shrink-0 transition-colors duration-150"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          </section>

        </div>

        {/* ── Footer note ─────────────────────────────────────────────────── */}
        <p className="text-xs text-center text-slate-600">
          Commissioner Dashboard — read-only view. All data is curated and static. Last updated: January 2026.
        </p>

      </div>
    </>
  );
}

// ─── Static Generation ────────────────────────────────────────────────────────

import type { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} };
};
