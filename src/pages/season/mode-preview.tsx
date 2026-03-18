import Head from 'next/head';
import Link from 'next/link';
import {
  Activity,
  BarChart2,
  Zap,
  ListChecks,
  ArrowRight,
  TrendingUp,
  Trophy,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MockMatchup {
  homeOwner: string;
  homeScore: number;
  awayOwner: string;
  awayScore: number;
  week: number;
  isLive: boolean;
}

interface PowerRankRow {
  rank: number;
  prev: number;
  owner: string;
  record: string;
  pts: number;
}

interface WaiverItem {
  player: string;
  pos: string;
  action: string;
  owner: string;
}

// ─── Hardcoded Mock Data ──────────────────────────────────────────────────────

const MOCK_MATCHUPS: MockMatchup[] = [
  { homeOwner: 'Cogdeill11',      homeScore: 142.8, awayOwner: 'MLSchools12',     awayScore: 119.4, week: 7, isLive: false },
  { homeOwner: 'rbr',             homeScore: 158.2, awayOwner: 'JuicyBussy',      awayScore: 134.7, week: 7, isLive: false },
  { homeOwner: 'SexMachineAndyD', homeScore: 126.1, awayOwner: 'tdtd19844',       awayScore: 109.9, week: 7, isLive: false },
  { homeOwner: 'Tubes94',         homeScore: 137.4, awayOwner: 'Bimfle',          awayScore:  88.2, week: 7, isLive: false },
  { homeOwner: 'eldridm20',       homeScore: 114.6, awayOwner: 'Grandes',         awayScore: 121.3, week: 7, isLive: false },
  { homeOwner: 'eldridsm',        homeScore:  97.8, awayOwner: 'Cmaleski',        awayScore: 103.5, week: 7, isLive: false },
];

const POWER_RANKINGS: PowerRankRow[] = [
  { rank: 1, prev: 2, owner: 'Cogdeill11',      record: '6-1', pts: 978.4 },
  { rank: 2, prev: 1, owner: 'rbr',             record: '5-2', pts: 962.7 },
  { rank: 3, prev: 3, owner: 'MLSchools12',     record: '5-2', pts: 944.1 },
  { rank: 4, prev: 5, owner: 'JuicyBussy',      record: '4-3', pts: 901.8 },
  { rank: 5, prev: 4, owner: 'SexMachineAndyD', record: '4-3', pts: 887.3 },
  { rank: 6, prev: 7, owner: 'Tubes94',         record: '3-4', pts: 856.9 },
];

const WAIVER_ITEMS: WaiverItem[] = [
  { player: 'Bucky Irving',    pos: 'RB', action: 'Add',  owner: 'rbr' },
  { player: 'Rome Odunze',     pos: 'WR', action: 'Add',  owner: 'Cogdeill11' },
  { player: 'Bo Nix',          pos: 'QB', action: 'Drop', owner: 'eldridsm' },
  { player: 'Zamir White',     pos: 'RB', action: 'Drop', owner: 'Grandes' },
];

const WEEK_AT_A_GLANCE = [
  { label: 'Highest Scorer',    value: 'rbr — 158.2 pts' },
  { label: 'Closest Matchup',   value: 'eldridsm vs Cmaleski (5.7 pts)' },
  { label: 'Biggest Blowout',   value: 'rbr (+23.5 over JuicyBussy)' },
  { label: 'Top Individual',    value: 'CeeDee Lamb — 42.4 pts (Cogdeill11)' },
  { label: 'Bust of the Week',  value: 'Christian McCaffrey — 2.1 pts (MLSchools12)' },
];

// ─── Shared Sub-components ───────────────────────────────────────────────────

function SectionHeading({ icon: Icon, label }: { icon: React.FC<{ className?: string }>, label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <Icon className="w-5 h-5 text-[#e94560] shrink-0" aria-hidden="true" />
      <h2 className="text-2xl font-black text-white">{label}</h2>
    </div>
  );
}

function PosBadge({ pos }: { pos: string }) {
  const colours: Record<string, string> = {
    QB: 'bg-red-500/15 text-red-400 border-red-500/30',
    RB: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    WR: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    TE: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  };
  return (
    <span className={cn(
      'inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border w-9',
      colours[pos] ?? 'bg-slate-500/15 text-slate-400 border-slate-500/30'
    )}>
      {pos}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SeasonModePreviewPage() {
  return (
    <>
      <Head>
        <title>In-Season Mode Preview — BMFFFL</title>
        <meta
          name="description"
          content="Preview what the BMFFFL site looks like in In-Season mode: live scoring, matchups, power rankings, and waiver wire at a glance."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Page Header ────────────────────────────────────────────────── */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e94560]/10 border border-[#e94560]/30 text-[#e94560] text-xs font-semibold uppercase tracking-widest mb-4">
            <Activity className="w-3.5 h-3.5" aria-hidden="true" />
            In-Season Mode — Preview
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-3">
            What In-Season Looks Like
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            When the regular season is live, this is your command center. Scores,
            standings, and waiver moves — all in one view.
          </p>
        </header>

        {/* ── Live Scoring Widget Mockup ─────────────────────────────────── */}
        <section className="mb-12" aria-labelledby="scoring-heading">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e94560]/10 border border-[#e94560]/30 text-[#e94560] text-[10px] font-bold uppercase tracking-widest mb-4">
            <Zap className="w-3 h-3" aria-hidden="true" />
            Live Scoring — Week 7 (Mockup)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {MOCK_MATCHUPS.map((m) => {
              const homeWin = m.homeScore > m.awayScore;
              return (
                <div
                  key={`${m.homeOwner}-${m.awayOwner}`}
                  className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-4 py-3 flex flex-col gap-2 hover:border-[#e94560]/30 transition-colors duration-200"
                >
                  {/* Home row */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn(
                      'text-sm font-bold truncate',
                      homeWin ? 'text-white' : 'text-slate-400'
                    )}>
                      {m.homeOwner}
                    </span>
                    <span className={cn(
                      'text-sm font-black tabular-nums',
                      homeWin ? 'text-[#ffd700]' : 'text-slate-400'
                    )}>
                      {m.homeScore.toFixed(1)}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-[#2d4a66]" aria-hidden="true" />

                  {/* Away row */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn(
                      'text-sm font-bold truncate',
                      !homeWin ? 'text-white' : 'text-slate-400'
                    )}>
                      {m.awayOwner}
                    </span>
                    <span className={cn(
                      'text-sm font-black tabular-nums',
                      !homeWin ? 'text-[#ffd700]' : 'text-slate-400'
                    )}>
                      {m.awayScore.toFixed(1)}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-500 font-mono">Week {m.week}</span>
                    <span className={cn(
                      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border',
                      m.isLive
                        ? 'text-[#e94560] border-[#e94560]/30 bg-[#e94560]/10 animate-pulse'
                        : 'text-slate-500 border-[#2d4a66] bg-[#0d1b2a]'
                    )}>
                      {m.isLive ? 'Live' : 'Final'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Quick Links ────────────────────────────────────────────────── */}
        <section className="mb-12" aria-labelledby="quick-links-heading">
          <h2 id="quick-links-heading" className="sr-only">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { href: '/season/matchups',           icon: Activity,  label: 'Matchups',       desc: 'All weekly head-to-head results' },
              { href: '/analytics/power-rankings',  icon: TrendingUp, label: 'Power Rankings', desc: 'Who\'s hot, who\'s not' },
              { href: '/analytics/waiver-priority', icon: ListChecks, label: 'Waiver Wire',     desc: 'Priority order + FAAB activity' },
            ].map(({ href, icon: Icon, label, desc }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-start gap-3 rounded-xl bg-[#16213e] border border-[#2d4a66] p-4 hover:border-[#e94560]/40 hover:bg-[#1a1a2e] transition-all duration-150"
              >
                <div className="mt-0.5 text-[#e94560] group-hover:scale-110 transition-transform duration-150 shrink-0">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-bold text-sm text-white group-hover:text-[#ffd700] transition-colors duration-150">
                    {label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">{desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 ml-auto mt-0.5 group-hover:text-slate-400 transition-colors duration-150" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>

        {/* ── Power Rankings + Week at a Glance ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

          {/* Power Rankings snapshot */}
          <section aria-labelledby="pr-heading">
            <SectionHeading icon={BarChart2} label="Power Rankings" />
            <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
              <table className="min-w-full text-sm" aria-label="Power rankings snapshot">
                <thead>
                  <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                    <th scope="col" className="px-4 py-2.5 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-10">#</th>
                    <th scope="col" className="px-4 py-2.5 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">Owner</th>
                    <th scope="col" className="px-4 py-2.5 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider">W-L</th>
                    <th scope="col" className="px-4 py-2.5 text-right text-xs text-slate-400 font-semibold uppercase tracking-wider">PF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3347]">
                  {POWER_RANKINGS.map((row, idx) => {
                    const moved = row.prev - row.rank;
                    return (
                      <tr key={row.owner} className={cn(
                        'transition-colors duration-100 hover:bg-[#1f3550]',
                        idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                      )}>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-[#ffd700] tabular-nums w-4">{row.rank}</span>
                            {moved > 0 && (
                              <TrendingUp className="w-3 h-3 text-[#22c55e]" aria-label={`Up ${moved}`} />
                            )}
                            {moved < 0 && (
                              <TrendingUp className="w-3 h-3 text-[#ef4444] rotate-180" aria-label={`Down ${Math.abs(moved)}`} />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2.5 font-semibold text-white text-sm">{row.owner}</td>
                        <td className="px-4 py-2.5 text-center text-xs text-slate-300 font-mono">{row.record}</td>
                        <td className="px-4 py-2.5 text-right text-xs text-slate-300 font-mono tabular-nums">{row.pts.toFixed(1)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[11px] text-slate-600">
              <Link href="/analytics/power-rankings" className="hover:text-slate-400 transition-colors">
                Full power rankings &rarr;
              </Link>
            </p>
          </section>

          {/* Week at a glance + waiver activity */}
          <div className="flex flex-col gap-6">

            {/* Week at a glance */}
            <section aria-labelledby="week-heading">
              <SectionHeading icon={Star} label="Week at a Glance" />
              <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] divide-y divide-[#1e3347]">
                {WEEK_AT_A_GLANCE.map((item) => (
                  <div key={item.label} className="flex items-start justify-between gap-4 px-4 py-3">
                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider leading-snug shrink-0 w-32">
                      {item.label}
                    </span>
                    <span className="text-sm text-slate-200 font-medium leading-snug text-right">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Waiver Wire activity */}
            <section aria-labelledby="waiver-heading">
              <div className="flex items-center gap-3 mb-4">
                <ListChecks className="w-5 h-5 text-[#e94560] shrink-0" aria-hidden="true" />
                <h2 id="waiver-heading" className="text-lg font-black text-white">Waiver Wire</h2>
              </div>
              <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] divide-y divide-[#1e3347]">
                {WAIVER_ITEMS.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 px-4 py-3">
                    <PosBadge pos={item.pos} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{item.player}</p>
                      <p className="text-xs text-slate-500 leading-snug">{item.owner}</p>
                    </div>
                    <span className={cn(
                      'shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border',
                      item.action === 'Add'
                        ? 'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/30'
                        : 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/30'
                    )}>
                      {item.action}
                    </span>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>

        {/* ── Switch to Offseason CTA ────────────────────────────────────── */}
        <section
          className="rounded-2xl border border-[#ffd700]/20 bg-[#ffd700]/5 px-6 py-8 text-center"
          aria-label="Switch to offseason mode"
        >
          <Trophy className="w-10 h-10 text-[#ffd700] mx-auto mb-3" aria-hidden="true" />
          <h2 className="text-2xl font-black text-white mb-2">
            NFL Season Not Live Yet
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-6 leading-relaxed">
            It&rsquo;s currently the offseason. Switch to Offseason Mode to see dynasty
            content — rosters, trades, draft capital, and devy rankings.
          </p>
          <Link
            href="/season/offseason-hub"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#ffd700] text-[#0d1b2a] text-sm font-black hover:bg-[#ffe033] transition-colors duration-150 shadow-lg shadow-[#ffd700]/20"
          >
            <span aria-hidden="true">🌴</span>
            Switch to Offseason Mode
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </section>

      </div>
    </>
  );
}
