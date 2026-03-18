import Head from 'next/head';
import { Trophy, Bot } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type WindowStatus = 'OPEN' | 'OPENING' | 'REBUILDING' | 'CLOSED';

interface WindowTeam {
  owner: string;
  teamName: string;
  status: WindowStatus;
  windowStart: number | null;
  windowEnd: number | null;
  note: string;
  championships: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CURRENT_YEAR = 2026;

const WINDOW_TEAMS: WindowTeam[] = [
  {
    owner: 'MLSchools12',
    teamName: 'The Murder Boners',
    status: 'OPEN',
    windowStart: 2024,
    windowEnd: 2027,
    note: 'Currently open — aging core means ~3 more peak years.',
    championships: 2,
  },
  {
    owner: 'SexMachineAndyD',
    teamName: 'SexMachineAndyD',
    status: 'OPEN',
    windowStart: 2025,
    windowEnd: 2028,
    note: 'Open now — 3–4 years before core ages out.',
    championships: 0,
  },
  {
    owner: 'JuicyBussy',
    teamName: 'Juicy Bussy',
    status: 'OPEN',
    windowStart: 2025,
    windowEnd: 2029,
    note: 'Open — Bijan Robinson anchors a 4-year window.',
    championships: 1,
  },
  {
    owner: 'rbr',
    teamName: 'Really Big Rings',
    status: 'OPEN',
    windowStart: 2025,
    windowEnd: 2027,
    note: 'Closing — aging core, must win in next 2 years.',
    championships: 0,
  },
  {
    owner: 'eldridm20',
    teamName: 'Franks Little Beauties',
    status: 'OPEN',
    windowStart: 2025,
    windowEnd: 2027,
    note: 'Narrow window — playoff-dangerous but limited time.',
    championships: 0,
  },
  {
    owner: 'Tubes94',
    teamName: 'Whale Tails',
    status: 'OPENING',
    windowStart: 2026,
    windowEnd: 2031,
    note: 'Just opening — young roster ascending, 5+ year window.',
    championships: 0,
  },
  {
    owner: 'tdtd19844',
    teamName: '14kids0wins / teammoodie',
    status: 'OPENING',
    windowStart: 2026,
    windowEnd: 2031,
    note: 'Just won, young roster means long window ahead.',
    championships: 1,
  },
  {
    owner: 'Cmaleski',
    teamName: 'Showtyme Boyz',
    status: 'OPENING',
    windowStart: 2026,
    windowEnd: 2029,
    note: 'Young WR corps opening a window.',
    championships: 0,
  },
  {
    owner: 'eldridsm',
    teamName: 'eldridsm',
    status: 'REBUILDING',
    windowStart: null,
    windowEnd: null,
    note: 'Past window — in active rebuild.',
    championships: 0,
  },
  {
    owner: 'Grandes',
    teamName: 'El Rioux Grandes',
    status: 'REBUILDING',
    windowStart: 2029,
    windowEnd: null,
    note: 'Rebuilding — 2029+ potential if rebuild succeeds.',
    championships: 1,
  },
  {
    owner: 'Cogdeill11',
    teamName: 'Cogdeill11',
    status: 'REBUILDING',
    windowStart: null,
    windowEnd: null,
    note: 'Rebuild needed — no active window.',
    championships: 1,
  },
  {
    owner: 'Escuelas',
    teamName: 'Booty Cheeks',
    status: 'REBUILDING',
    windowStart: 2028,
    windowEnd: null,
    note: 'Building toward 2028+.',
    championships: 0,
  },
];

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<WindowStatus, {
  label: string;
  barColor: string;
  textColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  cardBorder: string;
  cardBg: string;
}> = {
  OPEN: {
    label: 'Open Now',
    barColor: '#ffd700',
    textColor: 'text-[#ffd700]',
    badgeBg: 'bg-[#ffd700]/15',
    badgeText: 'text-[#ffd700]',
    badgeBorder: 'border-[#ffd700]/40',
    cardBorder: 'border-[#ffd700]/25',
    cardBg: 'bg-[#ffd700]/5',
  },
  OPENING: {
    label: 'Opening',
    barColor: '#60a5fa',
    textColor: 'text-blue-400',
    badgeBg: 'bg-blue-500/15',
    badgeText: 'text-blue-400',
    badgeBorder: 'border-blue-500/40',
    cardBorder: 'border-blue-500/20',
    cardBg: 'bg-blue-500/5',
  },
  REBUILDING: {
    label: 'Rebuilding',
    barColor: '#94a3b8',
    textColor: 'text-slate-400',
    badgeBg: 'bg-slate-500/15',
    badgeText: 'text-slate-400',
    badgeBorder: 'border-slate-500/30',
    cardBorder: 'border-slate-500/15',
    cardBg: 'bg-slate-500/5',
  },
  CLOSED: {
    label: 'Closed',
    barColor: '#f87171',
    textColor: 'text-red-400',
    badgeBg: 'bg-red-500/15',
    badgeText: 'text-red-400',
    badgeBorder: 'border-red-500/30',
    cardBorder: 'border-red-500/20',
    cardBg: 'bg-red-500/5',
  },
};

// ─── Timeline constants ────────────────────────────────────────────────────────

const TIMELINE_START = 2023;
const TIMELINE_END   = 2033;
const TIMELINE_SPAN  = TIMELINE_END - TIMELINE_START;

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: WindowStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap',
        cfg.badgeBg, cfg.badgeText, cfg.badgeBorder
      )}
    >
      {cfg.label}
    </span>
  );
}

function WindowBar({ team }: { team: WindowTeam }) {
  const cfg = STATUS_CONFIG[team.status];

  if (team.status === 'REBUILDING' && team.windowStart === null) {
    // No window bar — just show a dashed placeholder
    return (
      <div className="relative h-7 rounded-lg bg-[#0d1b2a] border border-dashed border-[#2d4a66]/50 flex items-center justify-center">
        <span className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">
          No Active Window
        </span>
        {/* Current year marker */}
        <CurrentYearMarker />
      </div>
    );
  }

  const startYear = team.windowStart ?? CURRENT_YEAR;
  const endYear   = team.windowEnd   ?? (team.status === 'REBUILDING' ? startYear + 2 : TIMELINE_END);

  const startPct = Math.max(0, Math.min(100, ((startYear - TIMELINE_START) / TIMELINE_SPAN) * 100));
  const widthPct = Math.max(2, Math.min(100 - startPct, ((endYear - startYear) / TIMELINE_SPAN) * 100));

  const isProjected = team.windowEnd === null;

  return (
    <div className="relative h-7 rounded-lg bg-[#0d1b2a] border border-[#2d4a66]/30 overflow-hidden">
      {/* Window bar */}
      <div
        className="absolute top-1 bottom-1 rounded-md flex items-center overflow-hidden"
        style={{
          left:            `${startPct}%`,
          width:           `${widthPct}%`,
          backgroundColor: cfg.barColor,
          opacity:         isProjected ? 0.45 : 0.85,
        }}
        aria-hidden="true"
      />
      {/* Window label inside bar */}
      <div
        className="absolute top-0 bottom-0 flex items-center px-1.5"
        style={{ left: `${startPct}%`, width: `${widthPct}%` }}
        aria-hidden="true"
      >
        <span className="text-[10px] font-black text-[#0d1b2a] truncate leading-none select-none">
          {startYear}–{isProjected ? '?' : endYear}
        </span>
      </div>
      {/* Current year marker */}
      <CurrentYearMarker />
    </div>
  );
}

function CurrentYearMarker() {
  const pct = ((CURRENT_YEAR - TIMELINE_START) / TIMELINE_SPAN) * 100;
  return (
    <div
      className="absolute top-0 bottom-0 w-px bg-white/30 z-10"
      style={{ left: `${pct}%` }}
      aria-hidden="true"
    />
  );
}

// ─── Timeline axis ─────────────────────────────────────────────────────────────

function TimelineAxis() {
  const years = Array.from(
    { length: TIMELINE_END - TIMELINE_START + 1 },
    (_, i) => TIMELINE_START + i
  );
  return (
    <div className="relative flex mb-1" aria-hidden="true">
      {years.map((yr) => {
        const pct = ((yr - TIMELINE_START) / TIMELINE_SPAN) * 100;
        const isCurrent = yr === CURRENT_YEAR;
        return (
          <div
            key={yr}
            className="absolute -translate-x-1/2"
            style={{ left: `${pct}%` }}
          >
            <span
              className={cn(
                'text-[10px] font-mono tabular-nums',
                isCurrent ? 'text-white font-bold' : 'text-slate-600'
              )}
            >
              {yr}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Team Row ─────────────────────────────────────────────────────────────────

function TeamRow({ team }: { team: WindowTeam }) {
  const cfg = STATUS_CONFIG[team.status];
  return (
    <div
      className={cn(
        'rounded-xl border p-4 sm:p-5 transition-colors duration-150',
        cfg.cardBorder, cfg.cardBg
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h3 className="text-sm font-bold text-white leading-tight">
              {team.teamName !== team.owner ? team.teamName : team.owner}
            </h3>
            {team.championships > 0 && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border bg-[#ffd700]/10 text-[#ffd700] border-[#ffd700]/25">
                <Trophy className="w-2.5 h-2.5" aria-hidden="true" />
                {team.championships}x
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">{team.owner}</p>
        </div>
        <StatusBadge status={team.status} />
      </div>

      {/* Timeline bar */}
      <div className="mb-2">
        <WindowBar team={team} />
      </div>

      {/* Note */}
      <p className="text-xs text-slate-500 leading-relaxed">{team.note}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const STATUS_ORDER: WindowStatus[] = ['OPEN', 'OPENING', 'REBUILDING', 'CLOSED'];

export default function ChampionshipWindowPage() {
  const teamsByStatus = (status: WindowStatus) =>
    WINDOW_TEAMS.filter((t) => t.status === status);

  const openCount      = teamsByStatus('OPEN').length;
  const openingCount   = teamsByStatus('OPENING').length;
  const rebuildCount   = teamsByStatus('REBUILDING').length;
  const closedCount    = teamsByStatus('CLOSED').length;

  return (
    <>
      <Head>
        <title>Championship Window Calculator — BMFFFL Analytics</title>
        <meta
          name="description"
          content="Estimates each BMFFFL manager's championship window — the years during which their roster is optimally positioned to win. Based on roster age, dynasty value, and trajectory."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Header */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <Trophy className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            Championship Window Calculator
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            When is each team&rsquo;s window to win? Timeline-based estimate by roster age, dynasty value, and trajectory.
          </p>
        </header>

        {/* Summary stats */}
        <section className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3" aria-label="Window summary">
          {[
            { label: 'Open Now', value: openCount,    cfg: STATUS_CONFIG.OPEN },
            { label: 'Opening',  value: openingCount, cfg: STATUS_CONFIG.OPENING },
            { label: 'Rebuild',  value: rebuildCount, cfg: STATUS_CONFIG.REBUILDING },
            { label: 'Closed',   value: closedCount,  cfg: STATUS_CONFIG.CLOSED },
          ].map((item) => (
            <div
              key={item.label}
              className={cn(
                'rounded-lg border px-4 py-3 text-center',
                item.cfg.cardBorder, item.cfg.cardBg
              )}
            >
              <p className={cn('text-2xl font-black tabular-nums', item.cfg.textColor)}>
                {item.value}
              </p>
              <p className={cn('text-[11px] font-bold uppercase tracking-wider mt-0.5', item.cfg.badgeText)}>
                {item.label}
              </p>
              <p className="text-[10px] text-slate-600 mt-0.5">Teams</p>
            </div>
          ))}
        </section>

        {/* League summary callout */}
        <div className="mb-8 rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            <span className="text-[#ffd700] font-bold">{openCount} teams</span> have open championship windows right now.{' '}
            <span className="text-blue-400 font-bold">{openingCount} teams</span> have windows opening imminently.{' '}
            <span className="text-slate-400 font-bold">{rebuildCount} teams</span> are in rebuild mode.
            The current year marker{' '}
            <span className="inline-block w-2 h-2 border-r-2 border-white/40 align-middle mx-0.5" aria-hidden="true" />
            is shown on each timeline bar.
          </p>
        </div>

        {/* Timeline reference */}
        <section className="mb-8" aria-labelledby="timeline-heading">
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-5">
            <h2 id="timeline-heading" className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Timeline Reference ({TIMELINE_START}–{TIMELINE_END})
            </h2>
            <div className="pr-2">
              <TimelineAxis />
              {/* Tick marks */}
              <div className="relative h-2 mt-5">
                {Array.from({ length: TIMELINE_END - TIMELINE_START + 1 }, (_, i) => {
                  const yr  = TIMELINE_START + i;
                  const pct = ((yr - TIMELINE_START) / TIMELINE_SPAN) * 100;
                  return (
                    <div
                      key={yr}
                      className={cn(
                        'absolute top-0 bottom-0 w-px',
                        yr === CURRENT_YEAR ? 'bg-white/40' : 'bg-[#2d4a66]/50'
                      )}
                      style={{ left: `${pct}%` }}
                      aria-hidden="true"
                    />
                  );
                })}
              </div>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4">
              {STATUS_ORDER.map((s) => {
                const cfg = STATUS_CONFIG[s];
                return (
                  <div key={s} className="flex items-center gap-1.5">
                    <div
                      className="w-3 h-3 rounded-sm shrink-0"
                      style={{ backgroundColor: cfg.barColor, opacity: 0.85 }}
                      aria-hidden="true"
                    />
                    <span className={cn('text-xs font-medium', cfg.textColor)}>{cfg.label}</span>
                  </div>
                );
              })}
              <div className="flex items-center gap-1.5">
                <div className="w-px h-3 bg-white/40 shrink-0" aria-hidden="true" />
                <span className="text-xs text-slate-500">Current year ({CURRENT_YEAR})</span>
              </div>
            </div>
          </div>
        </section>

        {/* Teams grouped by status */}
        {STATUS_ORDER.map((status) => {
          const teams = teamsByStatus(status);
          if (teams.length === 0) return null;
          const cfg = STATUS_CONFIG[status];
          return (
            <section key={status} className="mb-10" aria-label={`${cfg.label} teams`}>
              {/* Section header */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={cn(
                    'inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border',
                    cfg.badgeBg, cfg.badgeText, cfg.badgeBorder
                  )}
                >
                  {cfg.label} &mdash; {teams.length} team{teams.length !== 1 ? 's' : ''}
                </span>
                <div className="flex-1 h-px bg-[#2d4a66]" aria-hidden="true" />
              </div>

              {/* Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {teams.map((team) => (
                  <TeamRow key={team.owner} team={team} />
                ))}
              </div>
            </section>
          );
        })}

        {/* Bimfle commentary */}
        <aside
          className="mt-2 rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/5 px-6 py-5"
          aria-label="Bimfle's Window Analysis"
        >
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-10 h-10 rounded-full bg-[#ffd700]/15 border border-[#ffd700]/40 flex items-center justify-center">
              <Bot className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[#ffd700] font-bold text-sm">Bimfle</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#ffd700]/60 border border-[#ffd700]/30 rounded px-1.5 py-0.5">
                  AI Commissioner Assistant
                </span>
              </div>
              <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
                <p>
                  The championship window is one of the most consequential concepts in dynasty fantasy football,
                  and I present these estimates with the gravity they deserve. Four teams are in open windows
                  simultaneously — a condition that historically produces the league&rsquo;s most competitive seasons.
                </p>
                <p>
                  MLSchools12&rsquo;s window extends through 2027, though I note with professional concern that
                  they have won twice already. A third championship would represent a dynasty of genuinely
                  uncomfortable proportions.
                </p>
                <p>
                  Tubes94 and tdtd19844 share the league&rsquo;s longest projected windows — both running
                  through 2031. Youth is a formidable asset in this league. The reigning champion with a
                  five-year window is not a comfortable thought for the contending teams.
                </p>
                <p>
                  rbr&rsquo;s window is closing. I say this not to alarm but to inform. Aging cores
                  do not wait for sentiment. The next two years represent the most urgent championship
                  opportunity on that roster.
                </p>
                <p className="text-slate-400 italic">~Love, Bimfle.</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Footer note */}
        <div className="mt-6 text-xs text-slate-600 leading-relaxed">
          <p>
            Championship window estimates are based on roster age distribution, dynasty asset values, current win
            trajectory, and draft capital as of March 2026. These are projections, not guarantees. Windows can
            accelerate or contract based on trades, injuries, and NFL roster changes.
            Dashed projections (&ldquo;?&rdquo; end year) indicate rebuild trajectories where a window has not yet opened.
          </p>
        </div>

      </div>
    </>
  );
}
