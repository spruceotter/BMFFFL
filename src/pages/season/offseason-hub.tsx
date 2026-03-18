import Head from 'next/head';
import Link from 'next/link';
import {
  ArrowLeftRight,
  Eye,
  Calendar,
  BarChart2,
  TrendingUp,
  ArrowRight,
  Trophy,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type Position = 'QB' | 'RB' | 'WR' | 'TE';

interface NotableTrade {
  id: number;
  date: string;
  teamA: string;
  gave: string[];
  teamB: string;
  received: string[];
  verdict: 'A-wins' | 'B-wins' | 'Even';
  note: string;
}

interface RosterWatch {
  owner: string;
  tier: 'Rebuild' | 'Rising' | 'Contender' | 'Dynasty';
  headline: string;
  detail: string;
  picks: string;
}

interface UpcomingEvent {
  date: string;
  label: string;
  description: string;
  href?: string;
}

interface DynastyRankPreview {
  rank: number;
  owner: string;
  tag: string;
  keyPlayers: { name: string; pos: Position }[];
  trend: 'up' | 'down' | 'flat';
}

// ─── Hardcoded Data ───────────────────────────────────────────────────────────

const NOTABLE_TRADES: NotableTrade[] = [
  {
    id: 1,
    date: 'Feb 14, 2026',
    teamA: 'eldridm20',
    gave: ['2026 2.06', '2027 2nd'],
    teamB: 'Cogdeill11',
    received: ['Jaylen Waddle'],
    verdict: 'A-wins',
    note: 'Waddle on a cheap deal heading into age-28 season. eldridm20 flips future capital for a proven WR2.',
  },
  {
    id: 2,
    date: 'Feb 28, 2026',
    teamA: 'JuicyBussy',
    gave: ['Tee Higgins', '2026 3rd'],
    teamB: 'Tubes94',
    received: ['2026 1st (1.08)', '2027 1st'],
    verdict: 'B-wins',
    note: 'Tubes94 loads up on draft capital for a full rebuild. Tee Higgins coming off a contract year.',
  },
  {
    id: 3,
    date: 'Mar 5, 2026',
    teamA: 'Grandes',
    gave: ['Brock Bowers', '2026 4th'],
    teamB: 'rbr',
    received: ['Amon-Ra St. Brown', '2026 2nd'],
    verdict: 'Even',
    note: 'rbr adds elite TE in Bowers, Grandes gets proven WR1 upside. Both teams addressed needs.',
  },
  {
    id: 4,
    date: 'Mar 12, 2026',
    teamA: 'SexMachineAndyD',
    gave: ['2026 1st (1.05)', '2026 2nd'],
    teamB: 'MLSchools12',
    received: ['CeeDee Lamb'],
    verdict: 'A-wins',
    note: 'CeeDee Lamb is an all-time dynasty asset. SexMachineAndyD goes all-in on a 2026 championship window.',
  },
];

const ROSTER_WATCH: RosterWatch[] = [
  {
    owner: 'Cmaleski',
    tier: 'Rebuild',
    headline: 'Full Dynasty Rebuild',
    detail: 'Holds 1.01 in 2026 rookie draft. Best asset collection of any rebuilding team — patient and well-positioned.',
    picks: '1.01, 2.01, 3.01, 4.01',
  },
  {
    owner: 'eldridsm',
    tier: 'Rebuild',
    headline: 'Youth Movement',
    detail: 'Holds 1.02. Roster built around ascending young WRs. If landing spots cooperate, breakout contender by 2027.',
    picks: '1.02, 2.02, 3.02, 4.02',
  },
  {
    owner: 'Tubes94',
    tier: 'Rising',
    headline: 'Capital Loaded',
    detail: 'Traded Tee Higgins for two 1sts. Now owns one of the deepest pick portfolios in the league heading into 2026 draft.',
    picks: '1.11, 2.11, 2026 1st (via JuicyBussy), 2027 1st',
  },
  {
    owner: 'rbr',
    tier: 'Contender',
    headline: 'Defending Champion',
    detail: 'Added Brock Bowers in a major offseason trade. Window is open now — roster built to win in 2026.',
    picks: '1.12 (champ), 2.12',
  },
  {
    owner: 'SexMachineAndyD',
    tier: 'Contender',
    headline: 'All-In for 2026',
    detail: 'Surrendered two picks to land CeeDee Lamb. Roster has top-5 ceiling. Window closes quickly if 2026 doesn\'t deliver.',
    picks: '2026 picks traded for Lamb',
  },
];

const UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    date: 'April 24–26, 2026',
    label: 'NFL Draft',
    description: 'Landing spots will reshape rookie rankings. Watch for RBs in lead-back roles and rookie WRs in high-target offenses.',
    href: '/nfl-draft/2026',
  },
  {
    date: 'May 2026 (TBD)',
    label: 'BMFFFL Owners Meeting',
    description: 'Annual league governance meeting. Rule changes, constitution review, and 2026 season calendar finalized.',
    href: '/season/owners-meeting-2026',
  },
  {
    date: 'June 5, 2026 (est.)',
    label: '2026 BMFFFL Rookie Draft',
    description: 'Linear format, 4 rounds, 48 picks. Cmaleski holds 1.01. Draft order finalized after owners meeting.',
    href: '/season/rookie-draft-2026',
  },
  {
    date: 'September 2026',
    label: '2026 Regular Season Kickoff',
    description: 'NFL Week 1 means dynasty rosters lock and the BMFFFL season begins. Set your lineups and check the waiver wire.',
  },
];

const DYNASTY_RANKINGS_PREVIEW: DynastyRankPreview[] = [
  {
    rank: 1,
    owner: 'Cogdeill11',
    tag: 'Peak Dynasty',
    keyPlayers: [{ name: 'Justin Jefferson', pos: 'WR' }, { name: 'Breece Hall', pos: 'RB' }],
    trend: 'flat',
  },
  {
    rank: 2,
    owner: 'MLSchools12',
    tag: 'Established Power',
    keyPlayers: [{ name: 'CeeDee Lamb', pos: 'WR' }, { name: 'Puka Nacua', pos: 'WR' }],
    trend: 'up',
  },
  {
    rank: 3,
    owner: 'rbr',
    tag: 'Defending Champ',
    keyPlayers: [{ name: 'Ja\'Marr Chase', pos: 'WR' }, { name: 'Brock Bowers', pos: 'TE' }],
    trend: 'up',
  },
  {
    rank: 4,
    owner: 'JuicyBussy',
    tag: 'Reload Mode',
    keyPlayers: [{ name: 'Malik Nabers', pos: 'WR' }, { name: 'De\'Von Achane', pos: 'RB' }],
    trend: 'down',
  },
  {
    rank: 5,
    owner: 'SexMachineAndyD',
    tag: 'All-In Window',
    keyPlayers: [{ name: 'CeeDee Lamb', pos: 'WR' }, { name: 'Saquon Barkley', pos: 'RB' }],
    trend: 'up',
  },
];

// ─── Shared Sub-components ────────────────────────────────────────────────────

function SectionHeading({
  icon: Icon,
  label,
  href,
  linkLabel,
}: {
  icon: React.FC<{ className?: string }>;
  label: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 mb-5">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-[#ffd700] shrink-0" aria-hidden="true" />
        <h2 className="text-2xl font-black text-white">{label}</h2>
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="hidden sm:inline-flex items-center gap-1 text-sm text-slate-400 hover:text-[#ffd700] transition-colors duration-150"
        >
          {linkLabel}
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

const POS_STYLES: Record<Position, string> = {
  QB: 'bg-red-500/15 text-red-400 border-red-500/30',
  RB: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  WR: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  TE: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
};

function PosBadge({ pos }: { pos: Position }) {
  return (
    <span className={cn(
      'inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border w-9',
      POS_STYLES[pos]
    )}>
      {pos}
    </span>
  );
}

const TIER_STYLES: Record<RosterWatch['tier'], string> = {
  Rebuild:   'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/30',
  Rising:    'bg-amber-500/10 text-amber-400 border-amber-500/30',
  Contender: 'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/30',
  Dynasty:   'bg-[#ffd700]/10 text-[#ffd700] border-[#ffd700]/30',
};

const VERDICT_STYLES: Record<NotableTrade['verdict'], string> = {
  'A-wins': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  'B-wins': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  'Even':   'bg-slate-500/10 text-slate-400 border-slate-500/30',
};

const VERDICT_LABELS: Record<NotableTrade['verdict'], string> = {
  'A-wins': 'Edge: buyer',
  'B-wins': 'Edge: seller',
  'Even':   'Even',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OffseasonHubPage() {
  return (
    <>
      <Head>
        <title>Offseason Hub 2026 — BMFFFL</title>
        <meta
          name="description"
          content="BMFFFL 2026 offseason hub: notable trades, roster watch, upcoming events, and dynasty rankings preview heading into the 2026 season."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Page Header ────────────────────────────────────────────────── */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <span aria-hidden="true">🌴</span>
            Offseason Mode
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-3">
            Offseason Hub
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Everything dynasty managers need heading into 2026 &mdash; trades, rosters,
            upcoming events, and rankings.
          </p>
        </header>

        {/* ── Notable Trades ─────────────────────────────────────────────── */}
        <section className="mb-14" aria-labelledby="trades-heading">
          <SectionHeading
            icon={ArrowLeftRight}
            label="Top Moves"
            href="/trades"
            linkLabel="All trades"
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {NOTABLE_TRADES.map((trade) => (
              <div
                key={trade.id}
                className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5 flex flex-col gap-3 hover:border-[#ffd700]/20 transition-colors duration-200"
              >
                {/* Trade header */}
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs text-slate-500 font-mono">{trade.date}</span>
                  <span className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border',
                    VERDICT_STYLES[trade.verdict]
                  )}>
                    {VERDICT_LABELS[trade.verdict]}
                  </span>
                </div>

                {/* Trade body */}
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  {/* Team A */}
                  <div>
                    <p className="text-xs font-bold text-white mb-1.5">{trade.teamA}</p>
                    <div className="flex flex-col gap-1">
                      {trade.gave.map((asset) => (
                        <span
                          key={asset}
                          className="inline-block text-xs text-slate-300 bg-[#0d1b2a] border border-[#2d4a66] rounded px-2 py-0.5 w-fit"
                        >
                          {asset}
                        </span>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1.5 uppercase tracking-wider font-semibold">
                      receives from {trade.teamB}
                    </p>
                    <div className="flex flex-col gap-1 mt-1">
                      {trade.received.map((asset) => (
                        <span
                          key={asset}
                          className="inline-block text-xs text-[#ffd700] bg-[#ffd700]/5 border border-[#ffd700]/20 rounded px-2 py-0.5 w-fit"
                        >
                          {asset}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex flex-col items-center gap-1" aria-hidden="true">
                    <ArrowLeftRight className="w-4 h-4 text-slate-600" />
                  </div>

                  {/* Team B */}
                  <div className="text-right">
                    <p className="text-xs font-bold text-white mb-1.5">{trade.teamB}</p>
                    <div className="flex flex-col gap-1 items-end">
                      {trade.received.map((asset) => (
                        <span
                          key={asset}
                          className="inline-block text-xs text-slate-300 bg-[#0d1b2a] border border-[#2d4a66] rounded px-2 py-0.5"
                        >
                          {asset}
                        </span>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1.5 uppercase tracking-wider font-semibold">
                      receives from {trade.teamA}
                    </p>
                    <div className="flex flex-col gap-1 mt-1 items-end">
                      {trade.gave.map((asset) => (
                        <span
                          key={asset}
                          className="inline-block text-xs text-[#ffd700] bg-[#ffd700]/5 border border-[#ffd700]/20 rounded px-2 py-0.5"
                        >
                          {asset}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Note */}
                <div className="pt-2 border-t border-[#1e3347] flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-xs text-slate-400 leading-relaxed">{trade.note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Roster Watch ───────────────────────────────────────────────── */}
        <section className="mb-14" aria-labelledby="roster-watch-heading">
          <SectionHeading
            icon={Eye}
            label="Roster Watch"
            href="/owners"
            linkLabel="All rosters"
          />
          <p className="text-sm text-slate-400 mb-5 -mt-2">
            Five teams to watch heading into the 2026 rookie draft.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ROSTER_WATCH.map((team) => (
              <div
                key={team.owner}
                className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5 flex flex-col gap-3 hover:border-[#ffd700]/20 transition-colors duration-200"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-base font-black text-white leading-tight">{team.owner}</p>
                  <span className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border shrink-0',
                    TIER_STYLES[team.tier]
                  )}>
                    {team.tier}
                  </span>
                </div>
                <p className="text-sm font-semibold text-[#ffd700]/80 leading-tight">{team.headline}</p>
                <p className="text-sm text-slate-300 leading-relaxed flex-1">{team.detail}</p>
                <div className="pt-2 border-t border-[#1e3347]">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">
                    2026 Picks
                  </p>
                  <p className="text-xs text-slate-300 font-mono">{team.picks}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Upcoming Events ────────────────────────────────────────────── */}
        <section className="mb-14" aria-labelledby="upcoming-heading">
          <SectionHeading icon={Calendar} label="Upcoming Events" />
          <ol className="space-y-3">
            {UPCOMING_EVENTS.map((event, idx) => (
              <li
                key={idx}
                className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:border-[#ffd700]/20 transition-colors duration-200"
              >
                <div className="sm:w-48 shrink-0">
                  <p className="text-xs font-mono text-[#ffd700]/70 leading-snug">{event.date}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-white mb-0.5">{event.label}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{event.description}</p>
                </div>
                {event.href && (
                  <Link
                    href={event.href}
                    className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-[#ffd700]/70 hover:text-[#ffd700] transition-colors duration-150"
                  >
                    View
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* ── Dynasty Rankings Preview ───────────────────────────────────── */}
        <section className="mb-10" aria-labelledby="dynasty-heading">
          <SectionHeading
            icon={BarChart2}
            label="Dynasty Rankings Preview"
            href="/analytics/dynasty-rankings"
            linkLabel="Full rankings"
          />
          <p className="text-sm text-slate-400 mb-5 -mt-2">
            Pre-draft snapshot — rankings will shift significantly after June 5.
          </p>

          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <table className="min-w-full text-sm" aria-label="Dynasty power rankings preview">
              <thead>
                <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                  <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-10">#</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">Owner</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider hidden sm:table-cell">Status</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider hidden lg:table-cell">Key Players</th>
                  <th scope="col" className="px-4 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider w-16">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e3347]">
                {DYNASTY_RANKINGS_PREVIEW.map((row, idx) => (
                  <tr
                    key={row.owner}
                    className={cn(
                      'transition-colors duration-100 hover:bg-[#1f3550]',
                      idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                    )}
                  >
                    <td className="px-4 py-3">
                      <span className="text-xs font-black text-[#ffd700] tabular-nums">{row.rank}</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-white text-sm">{row.owner}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs text-slate-400">{row.tag}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1.5">
                        {row.keyPlayers.map(({ name, pos }) => (
                          <span key={name} className="inline-flex items-center gap-1">
                            <PosBadge pos={pos} />
                            <span className="text-xs text-slate-300">{name}</span>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {row.trend === 'up' && (
                        <TrendingUp className="w-4 h-4 text-[#22c55e] mx-auto" aria-label="Trending up" />
                      )}
                      {row.trend === 'down' && (
                        <TrendingUp className="w-4 h-4 text-[#ef4444] rotate-180 mx-auto" aria-label="Trending down" />
                      )}
                      {row.trend === 'flat' && (
                        <span className="inline-block w-4 h-0.5 bg-slate-500 rounded mx-auto" aria-label="Flat" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-2 text-[11px] text-slate-600">
            Rankings based on current roster + pick inventory. Subject to change after 2026 NFL Draft (April 24–26).
            <Link
              href="/analytics/dynasty-rankings"
              className="ml-2 text-slate-500 hover:text-slate-400 transition-colors"
            >
              Full methodology &rarr;
            </Link>
          </p>
        </section>

        {/* ── Switch to In-Season CTA ────────────────────────────────────── */}
        <section
          className="rounded-2xl border border-[#e94560]/20 bg-[#e94560]/5 px-6 py-8 text-center"
          aria-label="In-Season mode callout"
        >
          <Trophy className="w-10 h-10 text-[#e94560] mx-auto mb-3" aria-hidden="true" />
          <h2 className="text-2xl font-black text-white mb-2">
            Ready for Gameday?
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-6 leading-relaxed">
            When the NFL season kicks off in September, switch to In-Season Mode for
            live scores, matchups, and power rankings.
          </p>
          <Link
            href="/season/mode-preview"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#e94560] text-white text-sm font-black hover:bg-[#f05573] transition-colors duration-150 shadow-lg shadow-[#e94560]/20"
          >
            <span aria-hidden="true">🏈</span>
            Preview In-Season Mode
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </section>

      </div>
    </>
  );
}
