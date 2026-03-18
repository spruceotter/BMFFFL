import Head from 'next/head';
import { cn } from '@/lib/cn';

// ─── Event Data ───────────────────────────────────────────────────────────────

type EventStatus = 'past' | 'current' | 'upcoming';

interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  status: EventStatus;
}

const EVENTS: CalendarEvent[] = [
  {
    id: 'nfl-free-agency',
    date: 'Feb 2026',
    title: 'NFL Free Agency Opens',
    description: 'Key dynasty moves tracked. See free agency impact article.',
    status: 'past',
  },
  {
    id: 'bmfffl-faab',
    date: 'Mar 1–15, 2026',
    title: 'BMFFFL Free Agent Claims / FAAB Period',
    description: 'Blind bid waiver claims processed. $10,000 FAAB budget in play.',
    status: 'past',
  },
  {
    id: 'content-launch',
    date: 'Mar 15, 2026',
    title: 'Content Launch',
    description: 'BMFFFL website goes live.',
    status: 'past',
  },
  {
    id: 'nfl-draft',
    date: 'Apr 2026',
    title: 'NFL Draft',
    description: '2026 NFL Draft — dynasty prospect tracker live.',
    status: 'current',
  },
  {
    id: 'owners-meeting',
    date: 'May 2026',
    title: 'BMFFFL Owners Meeting',
    description: 'Annual meeting. Rule proposals, offseason agenda.',
    status: 'upcoming',
  },
  {
    id: 'rookie-draft',
    date: 'Jun 6, 2026 (est.)',
    title: 'BMFFFL Rookie Draft',
    description: 'Linear format, 4 rounds. First Friday of June.',
    status: 'upcoming',
  },
  {
    id: 'training-camp',
    date: 'Jul 2026',
    title: 'Training Camp Opens',
    description: 'Roster cut decisions, waiver pickups.',
    status: 'upcoming',
  },
  {
    id: 'preseason-faab',
    date: 'Aug 2026',
    title: 'Preseason / FAAB Opens',
    description: '$10,000 FAAB budget resets.',
    status: 'upcoming',
  },
  {
    id: 'nfl-week1',
    date: 'Sep 4, 2026',
    title: 'NFL Regular Season Week 1',
    description: '2026 dynasty season begins.',
    status: 'upcoming',
  },
  {
    id: 'bmfffl-week1',
    date: 'Sep 2026',
    title: 'BMFFFL Week 1',
    description: 'Dynasty season kicks off. Start your lineups.',
    status: 'upcoming',
  },
  {
    id: 'trade-deadline',
    date: 'Nov 2026',
    title: 'Trade Deadline',
    description: 'Week 14 — last chance to make moves.',
    status: 'upcoming',
  },
  {
    id: 'playoffs-begin',
    date: 'Dec 2026',
    title: 'BMFFFL Playoffs Begin',
    description: 'Week 15–17, 6-team bracket. Top 2 seeds receive a first-round bye.',
    status: 'upcoming',
  },
  {
    id: 'champion-crowned',
    date: 'Jan 2027',
    title: '2026 Champion Crowned',
    description: 'The BMFFFL dynasty champion is crowned after Week 17.',
    status: 'upcoming',
  },
];

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<EventStatus, {
  dotClass: string;
  datePillClass: string;
  cardClass: string;
  lineClass: string;
  label: string;
}> = {
  past: {
    dotClass: 'w-3 h-3 rounded-full bg-slate-600 border-2 border-slate-500',
    datePillClass: 'bg-slate-700 border-slate-600 text-slate-400',
    cardClass: 'bg-[#16213e] border-[#2d4a66] opacity-60',
    lineClass: 'bg-slate-700',
    label: 'Past',
  },
  current: {
    dotClass: 'w-3 h-3 rounded-full bg-[#22c55e] border-2 border-[#16a34a] shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse',
    datePillClass: 'bg-[#ffd700]/20 border-[#ffd700]/40 text-[#ffd700] font-bold',
    cardClass: 'bg-[#16213e] border-[#ffd700]/40 shadow-lg shadow-[#ffd700]/5',
    lineClass: 'bg-[#ffd700]/30',
    label: 'Now',
  },
  upcoming: {
    dotClass: 'w-3 h-3 rounded-full bg-[#ffd700]/60 border-2 border-[#ffd700]/40',
    datePillClass: 'bg-[#ffd700]/10 border-[#ffd700]/30 text-[#ffd700]',
    cardClass: 'bg-[#16213e] border-[#2d4a66] hover:border-[#3a5f80] transition-colors duration-150',
    lineClass: 'bg-[#2d4a66]',
    label: 'Upcoming',
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CalendarPage() {
  return (
    <>
      <Head>
        <title>League Calendar — BMFFFL Dynasty</title>
        <meta name="description" content="BMFFFL dynasty fantasy football league calendar — key dates, draft, playoffs, and more." />
      </Head>

      <main className="min-h-screen bg-[#0d1b2a] px-4 py-10">
        <div className="max-w-2xl mx-auto">

          {/* Page header */}
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#ffd700] mb-1">
              BMFFFL
            </p>
            <h1 className="text-4xl font-black text-white mb-2">League Calendar</h1>
            <p className="text-slate-400 text-sm">
              Key dates for the 2026 dynasty season — draft, trades, playoffs, and more.
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-5 mb-8 flex-wrap text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600 border border-slate-500 inline-block" />
              Past
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] border border-[#16a34a] inline-block" />
              Current
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffd700]/60 border border-[#ffd700]/40 inline-block" />
              Upcoming
            </span>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-[5px] top-2 bottom-2 w-0.5 bg-[#2d4a66]"
              aria-hidden="true"
            />

            <ol className="relative space-y-0">
              {EVENTS.map((event, index) => {
                const cfg = STATUS_CONFIG[event.status];
                const isLast = index === EVENTS.length - 1;

                return (
                  <li key={event.id} className="relative flex gap-6 pb-6">
                    {/* Dot */}
                    <div className="relative z-10 flex-shrink-0 mt-1.5">
                      <span className={cfg.dotClass} aria-label={cfg.label} />
                    </div>

                    {/* Content */}
                    <div className={cn('flex-1 rounded-xl p-4 border', cfg.cardClass)}>
                      {/* Current event accent */}
                      {event.status === 'current' && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#22c55e]">
                            Happening Now
                          </span>
                        </div>
                      )}

                      {/* Date pill */}
                      <span
                        className={cn(
                          'inline-block text-xs px-2.5 py-0.5 rounded-full border mb-2 tracking-wide',
                          cfg.datePillClass
                        )}
                      >
                        {event.date}
                      </span>

                      {/* Title */}
                      <h2
                        className={cn(
                          'font-bold leading-snug mb-1',
                          event.status === 'past' ? 'text-slate-400' : 'text-white'
                        )}
                      >
                        {event.title}
                      </h2>

                      {/* Description */}
                      <p
                        className={cn(
                          'text-sm leading-relaxed',
                          event.status === 'past' ? 'text-slate-500' : 'text-slate-300'
                        )}
                      >
                        {event.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </main>
    </>
  );
}
