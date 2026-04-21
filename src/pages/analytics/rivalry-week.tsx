import Head from 'next/head';
import Link from 'next/link';
import { Swords, Flame, Trophy, Shield, Zap, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlayoffMeeting {
  year: number;
  round: string;
  winner: string;
  note: string;
}

interface RivalryData {
  id: string;
  name: string;
  managerA: string;
  managerB: string;
  h2hWinsA: number;
  h2hWinsB: number;
  leader: 'A' | 'B' | 'tied';
  playoffMeetings: PlayoffMeeting[];
  iconicStat: string;
  narrative: string;
  hasPlayoffHistory: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const RIVALRIES: RivalryData[] = [
  {
    id: 'apex',
    name: 'The Apex Rivalry',
    managerA: 'MLSchools12',
    managerB: 'JuicyBussy',
    h2hWinsA: 8,
    h2hWinsB: 4,
    leader: 'A',
    playoffMeetings: [
      { year: 2021, round: 'Championship', winner: 'MLSchools12', note: 'MLSchools12 wins the title' },
      { year: 2023, round: 'Semifinals', winner: 'JuicyBussy', note: 'JuicyBussy bounces the dynasty en route to the title' },
    ],
    iconicStat: 'JuicyBussy scored 245.80 pts in Week 16, 2021 — the all-time single-week record — in a matchup vs MLSchools12',
    narrative:
      "The dynasty's defining rivalry. MLSchools12 holds the series 8–4 but JuicyBussy owns the most explosive performance in league history — 245.80 points against this same opponent in Week 16, 2021. Two playoff meetings have split the narrative: MLSchools12 took the 2021 title, JuicyBussy denied the dynasty in 2023 Semis.",
    hasPlayoffHistory: true,
  },
  {
    id: 'executive',
    name: 'The Executive Rivalry',
    managerA: 'MLSchools12',
    managerB: 'rbr',
    h2hWinsA: 10,
    h2hWinsB: 2,
    leader: 'A',
    playoffMeetings: [
      { year: 2021, round: 'Semifinals', winner: 'MLSchools12', note: 'MLSchools12 beats rbr in the semis en route to the title' },
    ],
    iconicStat: 'rbr has the best lineup IQ in the league — and still can\'t crack MLSchools12 (10–2 all-time)',
    narrative:
      "Consistent excellence versus dynasty dominance. rbr is widely regarded as the sharpest roster manager in the BMFFFL — optimal lineup decisions, aggressive waiver use, elite instincts. But against MLSchools12 it hasn't mattered. Their 2021 playoff meeting: MLSchools12 eliminated rbr in the semifinals on the way to the title.",
    hasPlayoffHistory: true,
  },
  {
    id: 'founders-feud',
    name: "The Founder's Feud",
    managerA: 'MLSchools12',
    managerB: 'Grandes',
    h2hWinsA: 9,
    h2hWinsB: 3,
    leader: 'A',
    playoffMeetings: [],
    iconicStat: "Grandes won the 2022 championship — yet trails MLSchools12 9–3 all-time",
    narrative:
      "The commissioner and the dynasty king — the irony is not lost on anyone. Grandes runs the league, set the rules, and claimed the 2022 championship. On paper, a rival worthy of MLSchools12. On the schedule, it's a 9–3 beatdown. Being commissioner grants no mercy on the field.",
    hasPlayoffHistory: false,
  },
  {
    id: 'brothers-war',
    name: "The Brothers' War",
    managerA: 'eldridsm',
    managerB: 'eldridm20',
    h2hWinsA: 7,
    h2hWinsB: 5,
    leader: 'A',
    playoffMeetings: [
      { year: 2022, round: 'Semifinals', winner: 'eldridm20', note: 'eldridm20 eliminates eldridsm in the semis' },
      { year: 2023, round: 'Quarterfinals', winner: 'eldridm20', note: 'eldridm20 does it again — back-to-back playoff eliminations' },
    ],
    iconicStat: 'eldridm20 has beaten eldridsm in both playoff meetings — 2022 Semis and 2023 Quarters',
    narrative:
      "Family grudge match. eldridsm leads the regular season series 7–5, but eldridm20 always shows up when it matters. Two playoff meetings, two wins for eldridm20 — including back-to-back eliminations of eldridsm in 2022 and 2023. The regular season record is eldridsm's. The playoff record belongs to eldridm20.",
    hasPlayoffHistory: true,
  },
  {
    id: 'resurrection',
    name: 'The Resurrection',
    managerA: 'tdtd19844',
    managerB: 'MLSchools12',
    h2hWinsA: 3,
    h2hWinsB: 9,
    leader: 'B',
    playoffMeetings: [
      { year: 2025, round: 'Semifinals', winner: 'tdtd19844', note: 'tdtd19844 topples the dynasty — the championship run begins' },
    ],
    iconicStat: 'Three years of regular season losses. One pivotal 2025 Semis win. One championship.',
    narrative:
      "MLSchools12 leads the all-time series 9–3 — and then 2025 happened. tdtd19844 beat the dynasty in the Semifinals and never looked back, running the table to claim the championship. Three years of regular season losses set up the one win that launched a title run. The series record looks one-sided; the history doesn't.",
    hasPlayoffHistory: true,
  },
  {
    id: 'new-blood',
    name: 'The New Blood Rivalry',
    managerA: 'Tubes94',
    managerB: 'SexMachineAndyD',
    h2hWinsA: 4,
    h2hWinsB: 6,
    leader: 'B',
    playoffMeetings: [],
    iconicStat: 'Both are top-3 dynasty contenders entering 2026 — neither has won the title',
    narrative:
      "The two next-gen challengers battling for the right to dethrone MLSchools12. SexMachineAndyD leads the series 6–4, but both fell short of the title in 2025. Tubes94 reached the Championship game; SexMachineAndyD was eliminated in the Quarterfinals by Cmaleski. Their H2H will define who leads the next wave.",
    hasPlayoffHistory: false,
  },
  {
    id: 'eternal-runner-up',
    name: 'The Eternal Runner-Up',
    managerA: 'rbr',
    managerB: 'eldridm20',
    h2hWinsA: 7,
    h2hWinsB: 5,
    leader: 'A',
    playoffMeetings: [],
    iconicStat: 'rbr: one runner-up finish (2022). eldridm20: one (2023). Neither can close.',
    narrative:
      "Two managers defined by near-misses, facing each other. rbr reached the 2022 championship game and lost to Grandes. eldridm20 reached the 2023 championship game and fell to JuicyBussy. When they meet in the regular season it carries the weight of that shared grief — two title-caliber managers who have everything except the ring.",
    hasPlayoffHistory: false,
  },
  {
    id: 'moodie-bowl',
    name: 'The Moodie Bowl Prophecy',
    managerA: 'Grandes',
    managerB: 'Cogdeill11',
    h2hWinsA: 6,
    h2hWinsB: 6,
    leader: 'tied',
    playoffMeetings: [],
    iconicStat: 'Both are former champions now at the bottom of the standings — the Moodie Bowl waits',
    narrative:
      "The most poetic rivalry in the league. Grandes won the 2022 championship. Cogdeill11 took the 2020 inaugural title. Today, both sit near the bottom of the standings, locked in a perfectly even 6–6 series, having both faced the humiliation of Moodie Bowl contention. Former champions humbled — and tied.",
    hasPlayoffHistory: false,
  },
  {
    id: 'underdog-derby',
    name: 'The Underdog Derby',
    managerA: 'Cmaleski',
    managerB: 'Escuelas',
    h2hWinsA: 8,
    h2hWinsB: 2,
    leader: 'A',
    playoffMeetings: [],
    iconicStat: 'Cmaleski scored 1,990 pts in 2025 — outside the championship tier but impossible to dismiss',
    narrative:
      "The bottom half rivalry — one team building up, one refusing to be counted out. Cmaleski leads 8–2 but Escuelas only joined in 2022 and is still building. Cmaleski put up 1,990 points in 2025 without the playoff run to show for it. Neither team is in the championship conversation yet. Both are fighting to change that.",
    hasPlayoffHistory: false,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function H2HBar({ winsA, winsB, managerA, managerB }: {
  winsA: number;
  winsB: number;
  managerA: string;
  managerB: string;
}) {
  const total = winsA + winsB;
  const pctA = total > 0 ? (winsA / total) * 100 : 50;
  const pctB = total > 0 ? (winsB / total) * 100 : 50;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          All-Time H2H
        </span>
        <span className="text-xs font-mono text-slate-300 tabular-nums">
          {winsA}–{winsB}
        </span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden bg-[#0d1b2a] flex"
        role="img"
        aria-label={`H2H record: ${managerA} ${winsA} wins, ${managerB} ${winsB} wins`}
      >
        <div
          className="h-full bg-[#ffd700] transition-all duration-500"
          style={{ width: `${pctA}%` }}
        />
        <div
          className="h-full bg-[#e94560]"
          style={{ width: `${pctB}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-[#ffd700]/70 font-mono truncate max-w-[45%]">{managerA}</span>
        <span className="text-[10px] text-[#e94560]/70 font-mono truncate max-w-[45%] text-right">{managerB}</span>
      </div>
    </div>
  );
}

function PlayoffBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <div
      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#ffd700]/10 border border-[#ffd700]/25"
      aria-label={`${count} playoff meeting${count !== 1 ? 's' : ''}`}
    >
      <Trophy className="w-3 h-3 text-[#ffd700]" aria-hidden="true" />
      <span className="text-[10px] font-bold text-[#ffd700] uppercase tracking-wide tabular-nums">
        {count} Playoff Meeting{count !== 1 ? 's' : ''}
      </span>
    </div>
  );
}

function LeaderBadge({ leader, managerA, managerB }: {
  leader: 'A' | 'B' | 'tied';
  managerA: string;
  managerB: string;
}) {
  if (leader === 'tied') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-700/40 border border-slate-600/40">
        <Shield className="w-3 h-3 text-slate-400" aria-hidden="true" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Series Tied</span>
      </div>
    );
  }
  const leaderName = leader === 'A' ? managerA : managerB;
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/25">
      <Shield className="w-3 h-3 text-[#ffd700]" aria-hidden="true" />
      <span className="text-[10px] font-bold text-[#ffd700] uppercase tracking-wide">
        {leaderName} leads
      </span>
    </div>
  );
}

function RivalryCard({ rivalry, featured = false }: { rivalry: RivalryData; featured?: boolean }) {
  return (
    <article
      className={cn(
        'relative rounded-xl border flex flex-col overflow-hidden bg-[#16213e]',
        'transition-all duration-200',
        featured
          ? 'border-[#e94560]/60 shadow-xl shadow-[#e94560]/15'
          : rivalry.hasPlayoffHistory
          ? 'border-[#ffd700]/30 hover:border-[#ffd700]/50 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ffd700]/10'
          : 'border-[#2d4a66] hover:border-[#2d4a66]/80 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/40'
      )}
      aria-label={`Rivalry: ${rivalry.name}`}
    >
      {/* Featured gradient bar */}
      {featured && (
        <div
          className="h-1 w-full bg-gradient-to-r from-[#e94560] via-[#ffd700] to-[#e94560]"
          aria-hidden="true"
        />
      )}

      {/* Playoff history accent bar (non-featured) */}
      {!featured && rivalry.hasPlayoffHistory && (
        <div
          className="h-0.5 w-full bg-gradient-to-r from-[#ffd700]/60 to-[#e94560]/60"
          aria-hidden="true"
        />
      )}

      <div className={cn('flex flex-col gap-4', featured ? 'p-6 sm:p-8' : 'p-5')}>

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            {featured && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e94560]/10 border border-[#e94560]/30 text-[#e94560] text-[10px] font-bold uppercase tracking-widest mb-2">
                <Flame className="w-3 h-3" aria-hidden="true" />
                Rivalry of the Season
              </div>
            )}
            <h2
              className={cn(
                'font-black text-[#ffd700] leading-tight',
                featured ? 'text-2xl sm:text-3xl' : 'text-lg'
              )}
            >
              {rivalry.name}
            </h2>
          </div>
          <Swords
            className={cn(
              'shrink-0 text-[#e94560]/40',
              featured ? 'w-8 h-8 mt-1' : 'w-5 h-5'
            )}
            aria-hidden="true"
          />
        </div>

        {/* Managers VS */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              'font-black tabular-nums',
              featured ? 'text-xl text-white' : 'text-base text-white'
            )}
          >
            {rivalry.managerA}
          </span>
          <span
            className={cn(
              'font-black tracking-widest shrink-0 select-none',
              featured ? 'text-lg text-[#e94560]' : 'text-sm text-[#e94560]'
            )}
          >
            VS
          </span>
          <span
            className={cn(
              'font-black tabular-nums text-right',
              featured ? 'text-xl text-white' : 'text-base text-white'
            )}
          >
            {rivalry.managerB}
          </span>
        </div>

        {/* H2H bar */}
        <H2HBar
          winsA={rivalry.h2hWinsA}
          winsB={rivalry.h2hWinsB}
          managerA={rivalry.managerA}
          managerB={rivalry.managerB}
        />

        {/* Narrative */}
        <p
          className={cn(
            'text-slate-300 leading-relaxed',
            featured ? 'text-sm' : 'text-xs'
          )}
        >
          {rivalry.narrative}
        </p>

        {/* Iconic stat callout */}
        <div className="flex items-start gap-2 rounded-lg bg-[#0d1b2a] border border-[#2d4a66] px-3 py-2.5">
          <Zap
            className="w-3.5 h-3.5 text-[#ffd700] shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <p className="text-xs text-slate-300 leading-snug italic">
            {rivalry.iconicStat}
          </p>
        </div>

        {/* Playoff meetings */}
        {rivalry.playoffMeetings.length > 0 && (
          <div className="rounded-lg bg-[#ffd700]/5 border border-[#ffd700]/20 p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Trophy className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
              <span className="text-[10px] font-bold text-[#ffd700] uppercase tracking-widest">
                Playoff Meetings
              </span>
            </div>
            <div className="space-y-1.5">
              {rivalry.playoffMeetings.map((meeting, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3"
                >
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono font-bold text-[#ffd700] bg-[#ffd700]/10 px-1.5 py-0.5 rounded tabular-nums">
                      {meeting.year}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                      {meeting.round}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs font-bold text-white">{meeting.winner}</span>
                    <span className="text-[10px] text-slate-600">won —</span>
                    <span className="text-[10px] text-slate-500 italic truncate">{meeting.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <PlayoffBadge count={rivalry.playoffMeetings.length} />
          <LeaderBadge
            leader={rivalry.leader}
            managerA={rivalry.managerA}
            managerB={rivalry.managerB}
          />
        </div>

      </div>
    </article>
  );
}

// ─── Stats strip ──────────────────────────────────────────────────────────────

function StatStrip() {
  const stats = [
    { icon: <Swords className="w-4 h-4 text-[#e94560]" aria-hidden="true" />, label: 'Named Rivalries', value: '9' },
    { icon: <Trophy className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />, label: 'Playoff Meetings', value: '7' },
    { icon: <Flame className="w-4 h-4 text-[#e94560]" aria-hidden="true" />, label: 'Most Lopsided', value: '10–2 (MLSchools12 vs rbr)' },
    { icon: <Zap className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />, label: 'All-Time High Score', value: '245.80 pts (JuicyBussy, 2021)' },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col gap-1 rounded-xl border border-[#2d4a66] bg-[#16213e] p-4"
        >
          <div className="flex items-center gap-1.5">
            {stat.icon}
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {stat.label}
            </span>
          </div>
          <span className="text-sm font-black text-white leading-tight">{stat.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RivalryWeekPage() {
  const featured = RIVALRIES[0];
  const rest = RIVALRIES.slice(1);

  return (
    <>
      <Head>
        <title>Rivalry Week Spotlight — BMFFFL Analytics</title>
        <meta
          name="description"
          content="The 9 defining feuds of the BMFFFL dynasty — all-time H2H records, playoff meetings, and the iconic moments that define each rivalry."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Page Header ───────────────────────────────────────────────── */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e94560]/10 border border-[#e94560]/30 text-[#e94560] text-xs font-semibold uppercase tracking-widest mb-4">
            <Swords className="w-3.5 h-3.5" aria-hidden="true" />
            Rivalry Week
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-3">
            Rivalry Week
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            The defining feuds of the BMFFFL dynasty. Six seasons of history, nine named rivalries, and the moments that live on.
          </p>
        </header>

        {/* ── Stats Strip ───────────────────────────────────────────────── */}
        <StatStrip />

        {/* ── Featured Rivalry ──────────────────────────────────────────── */}
        <section className="mb-12" aria-labelledby="featured-rivalry-heading">
          <h2
            id="featured-rivalry-heading"
            className="flex items-center gap-2 text-lg font-bold text-white mb-4"
          >
            <Flame className="w-5 h-5 text-[#e94560]" aria-hidden="true" />
            Rivalry of the Season
          </h2>
          <RivalryCard rivalry={featured} featured />
        </section>

        {/* ── All Rivalries Grid ────────────────────────────────────────── */}
        <section aria-labelledby="all-rivalries-heading" className="mb-14">
          <h2
            id="all-rivalries-heading"
            className="flex items-center gap-2 text-lg font-bold text-white mb-6"
          >
            <Swords className="w-5 h-5 text-[#e94560]" aria-hidden="true" />
            All Named Rivalries
            <span className="text-sm font-normal text-slate-500 ml-1">
              ({rest.length} more)
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {rest.map((rivalry) => (
              <RivalryCard key={rivalry.id} rivalry={rivalry} />
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 bg-gradient-to-r from-[#ffd700]/60 to-[#e94560]/60 rounded" />
              <span>Playoff history</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 bg-[#2d4a66] rounded" />
              <span>Regular-season only</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-[#ffd700]" aria-hidden="true" />
              <span>Gold = series leader</span>
            </div>
          </div>
        </section>

        {/* ── CTA: Full H2H Matrix ──────────────────────────────────────── */}
        <section
          className={cn(
            'rounded-xl border border-[#2d4a66] bg-[#16213e]',
            'p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6'
          )}
          aria-labelledby="cta-heading"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
              <h2 id="cta-heading" className="text-xl font-black text-white">
                Dig Deeper
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-md">
              Select any two managers and explore their full head-to-head history — or browse the complete 12×12 all-time H2H matrix.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/analytics/grudge-match"
              className={cn(
                'inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm',
                'bg-[#e94560] text-white hover:bg-[#f05070]',
                'transition-colors duration-150 shadow-lg shadow-[#e94560]/20'
              )}
            >
              Grudge Match
              <Swords className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/analytics/h2h-records"
              className={cn(
                'inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm',
                'bg-[#ffd700] text-[#0d1b2a] hover:bg-[#ffe033]',
                'transition-colors duration-150 shadow-lg shadow-[#ffd700]/20'
              )}
            >
              Full Matrix
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </section>

      </div>
    </>
  );
}
