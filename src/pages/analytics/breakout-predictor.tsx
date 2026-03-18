import Head from 'next/head';
import { TrendingUp, Bot } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type Position = 'QB' | 'RB' | 'WR' | 'TE';

interface BreakoutPlayer {
  rank: number;
  name: string;
  pos: Position;
  nflTeam: string;
  age: number;
  owner: string;
  confidence: number;
  reason: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const BREAKOUT_PLAYERS: BreakoutPlayer[] = [
  {
    rank: 1,
    name: 'Brock Bowers',
    pos: 'TE',
    nflTeam: 'LV',
    age: 22,
    owner: 'eldridm20',
    confidence: 96,
    reason: 'Already produced historic rookie TE season. 2026 should be even better.',
  },
  {
    rank: 2,
    name: 'Malik Nabers',
    pos: 'WR',
    nflTeam: 'NYG',
    age: 21,
    owner: 'MLSchools12',
    confidence: 94,
    reason: 'Giants likely to give him elite target share in 2026. Age-21 WR with top-5 talent.',
  },
  {
    rank: 3,
    name: 'Marvin Harrison Jr',
    pos: 'WR',
    nflTeam: 'ARI',
    age: 22,
    owner: 'JuicyBussy',
    confidence: 91,
    reason: 'New offensive coordinator in Arizona. Harrison is the clear #1.',
  },
  {
    rank: 4,
    name: 'Brian Thomas Jr',
    pos: 'WR',
    nflTeam: 'JAX',
    age: 22,
    owner: 'Tubes94',
    confidence: 89,
    reason: 'Year 2 leap expected. Jaguars need a weapon.',
  },
  {
    rank: 5,
    name: 'C.J. Stroud',
    pos: 'QB',
    nflTeam: 'HOU',
    age: 23,
    owner: 'rbr',
    confidence: 87,
    reason: 'Elite supporting cast building in Houston. Top-5 QB ceiling.',
  },
  {
    rank: 6,
    name: 'Drake London',
    pos: 'WR',
    nflTeam: 'ATL',
    age: 23,
    owner: 'Cmaleski',
    confidence: 85,
    reason: 'Bijan Robinson opens space. London could eclipse 100 targets.',
  },
  {
    rank: 7,
    name: 'Jonathon Brooks',
    pos: 'RB',
    nflTeam: 'CAR',
    age: 22,
    owner: 'SexMachineAndyD',
    confidence: 82,
    reason: 'Full ACL recovery by training camp. Panthers\' backfield his to lose.',
  },
  {
    rank: 8,
    name: 'James Cook',
    pos: 'RB',
    nflTeam: 'BUF',
    age: 24,
    owner: 'Tubes94',
    confidence: 81,
    reason: 'Bills scheme features Cook heavily. 300+ touch season possible.',
  },
  {
    rank: 9,
    name: 'Rashee Rice',
    pos: 'WR',
    nflTeam: 'KC',
    age: 24,
    owner: 'MLSchools12',
    confidence: 79,
    reason: 'Return from suspension, full season as Mahomes\' WR1.',
  },
  {
    rank: 10,
    name: 'Tucker Kraft',
    pos: 'TE',
    nflTeam: 'GB',
    age: 24,
    owner: 'tdtd19844',
    confidence: 78,
    reason: 'Jordan Love–Tucker Kraft connection growing. TE1 ceiling.',
  },
];

// ─── Pos Config ───────────────────────────────────────────────────────────────

const POS_CONFIG: Record<Position, { badge: string; bar: string }> = {
  QB: { badge: 'bg-blue-500/15 text-blue-400 border-blue-500/40', bar: '#60a5fa' },
  RB: { badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40', bar: '#34d399' },
  WR: { badge: 'bg-orange-500/15 text-orange-400 border-orange-500/40', bar: '#fb923c' },
  TE: { badge: 'bg-purple-500/15 text-purple-400 border-purple-500/40', bar: '#c084fc' },
};

// ─── Confidence tier helper ────────────────────────────────────────────────────

function confidenceTier(pct: number): { label: string; barColor: string; textColor: string } {
  if (pct >= 90) return { label: 'Very High', barColor: '#ffd700', textColor: 'text-[#ffd700]' };
  if (pct >= 80) return { label: 'High', barColor: '#34d399', textColor: 'text-emerald-400' };
  return { label: 'Moderate', barColor: '#60a5fa', textColor: 'text-blue-400' };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PosBadge({ pos }: { pos: Position }) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border w-9 shrink-0',
        POS_CONFIG[pos].badge
      )}
    >
      {pos}
    </span>
  );
}

function ConfidenceBar({ confidence }: { confidence: number }) {
  const tier = confidenceTier(confidence);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-[#0d1b2a] overflow-hidden border border-[#2d4a66]/30">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${confidence}%`, backgroundColor: tier.barColor }}
          aria-hidden="true"
        />
      </div>
      <span className={cn('text-sm font-black tabular-nums w-10 text-right', tier.textColor)}>
        {confidence}%
      </span>
    </div>
  );
}

// ─── Player Card ──────────────────────────────────────────────────────────────

function PlayerCard({ player }: { player: BreakoutPlayer }) {
  const tier = confidenceTier(player.confidence);
  return (
    <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-4 sm:p-5 hover:border-[#2d4a66]/80 hover:bg-[#1a2d42] transition-colors duration-150">
      {/* Top row */}
      <div className="flex items-start gap-3 mb-3">
        {/* Rank */}
        <div className="shrink-0 w-7 text-center pt-0.5">
          <span className="text-xs font-mono font-bold text-slate-500 tabular-nums">
            #{player.rank}
          </span>
        </div>

        {/* Name + badges */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-base font-bold text-white leading-tight">{player.name}</h3>
            <PosBadge pos={player.pos} />
            <span className="text-[11px] font-mono text-slate-500">{player.nflTeam}</span>
            <span className="text-[11px] text-slate-600">Age {player.age}</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Owner: <span className="text-slate-400 font-medium">{player.owner}</span>
          </p>
        </div>

        {/* Confidence badge */}
        <div className="shrink-0 text-right">
          <span className={cn('text-2xl font-black tabular-nums leading-none', tier.textColor)}>
            {player.confidence}%
          </span>
          <p className="text-[10px] text-slate-600 uppercase tracking-wider mt-0.5">
            {tier.label}
          </p>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="mb-3 pl-10">
        <ConfidenceBar confidence={player.confidence} />
      </div>

      {/* Reason */}
      <p className="pl-10 text-xs text-slate-400 leading-relaxed italic">&ldquo;{player.reason}&rdquo;</p>
    </div>
  );
}

// ─── Summary stats ────────────────────────────────────────────────────────────

const SUMMARY_STATS = [
  { label: 'Players Tracked', value: '10', color: 'text-[#ffd700]' },
  { label: 'Avg Confidence', value: `${Math.round(BREAKOUT_PLAYERS.reduce((s, p) => s + p.confidence, 0) / BREAKOUT_PLAYERS.length)}%`, color: 'text-emerald-400' },
  { label: 'Age Range', value: '21–24', color: 'text-blue-400' },
  { label: 'Positions', value: '4', color: 'text-purple-400' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BreakoutPredictorPage() {
  return (
    <>
      <Head>
        <title>Breakout Predictor — BMFFFL Analytics</title>
        <meta
          name="description"
          content="Identifies young players on BMFFFL rosters (ages 21-24) projected to break out in 2026. Ranked by breakout confidence based on age, opportunity, and talent profile."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Header */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            Breakout Predictor
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Young players on BMFFFL rosters projected to break out in 2026 &mdash; ranked by confidence
          </p>
        </header>

        {/* Summary stats */}
        <section className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3" aria-label="Summary statistics">
          {SUMMARY_STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-[#2d4a66] bg-[#16213e] px-4 py-3 text-center"
            >
              <p className={cn('text-2xl font-black tabular-nums', stat.color)}>{stat.value}</p>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider mt-0.5">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* Confidence legend */}
        <section className="mb-6" aria-label="Confidence tiers legend">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
            Confidence Key
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Very High (90%+)', color: '#ffd700', textColor: 'text-[#ffd700]' },
              { label: 'High (80–89%)', color: '#34d399', textColor: 'text-emerald-400' },
              { label: 'Moderate (70–79%)', color: '#60a5fa', textColor: 'text-blue-400' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                />
                <span className={cn('text-xs font-medium', item.textColor)}>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mb-8 rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4" aria-labelledby="methodology-heading">
          <h2 id="methodology-heading" className="text-sm font-bold text-white mb-2">
            How Breakout Confidence Is Calculated
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-[#ffd700] mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <span className="text-white font-semibold block mb-0.5">Age &amp; Prime Window</span>
                Ages 21–25 represent peak dynasty breakout potential. Younger players earn a ceiling boost.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <span className="text-white font-semibold block mb-0.5">Opportunity</span>
                Target share, depth chart position, scheme fit, and offensive context.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400 mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <span className="text-white font-semibold block mb-0.5">Talent Profile</span>
                College production, athleticism scores, and first-year NFL indicators.
              </div>
            </div>
          </div>
        </section>

        {/* Player cards */}
        <section aria-label="Breakout candidates">
          <h2 className="text-lg font-black text-white mb-4">
            2026 Breakout Candidates &mdash; Ranked by Confidence
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {BREAKOUT_PLAYERS.map((player) => (
              <PlayerCard key={player.name} player={player} />
            ))}
          </div>
        </section>

        {/* Position breakdown */}
        <section className="mt-10" aria-label="Position breakdown">
          <h2 className="text-lg font-black text-white mb-4">Breakdown by Position</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['WR', 'RB', 'TE', 'QB'] as Position[]).map((pos) => {
              const posPlayers = BREAKOUT_PLAYERS.filter((p) => p.pos === pos);
              const avgConf = posPlayers.length
                ? Math.round(posPlayers.reduce((s, p) => s + p.confidence, 0) / posPlayers.length)
                : 0;
              const cfg = POS_CONFIG[pos];
              return (
                <div
                  key={pos}
                  className="rounded-lg border border-[#2d4a66] bg-[#16213e] px-4 py-3 text-center"
                >
                  <span
                    className={cn(
                      'inline-flex items-center justify-center px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border mb-2',
                      cfg.badge
                    )}
                  >
                    {pos}
                  </span>
                  <p className="text-2xl font-black tabular-nums text-white">{posPlayers.length}</p>
                  <p className="text-[11px] text-slate-500 uppercase tracking-wider mt-0.5">Players</p>
                  {posPlayers.length > 0 && (
                    <p className="text-[11px] text-slate-600 mt-1">avg {avgConf}% conf.</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Bimfle advisory */}
        <aside
          className="mt-10 rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/5 px-6 py-5"
          aria-label="Bimfle's Breakout Advisory"
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
                  I have reviewed the breakout landscape with the attention it deserves, and I note that Brock
                  Bowers at 96% confidence is, in fact, barely a prediction — it is simply an observation that
                  a historically productive tight end will continue to be historically productive.
                </p>
                <p>
                  Malik Nabers at age 21 is the most compelling dynasty asset on this list. There is something
                  almost unfair about a receiver of that caliber playing in his early twenties. The Giants, for
                  all their organizational limitations, have little choice but to deploy him extensively.
                </p>
                <p>
                  Jonathon Brooks at 82% is the highest-variance entry. ACL recoveries are notoriously
                  unpredictable. I have assigned this figure with appropriate trepidation and recommend
                  SexMachineAndyD monitor training camp reports with vigilance.
                </p>
                <p className="text-slate-400 italic">~Love, Bimfle.</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Footer disclaimer */}
        <div className="mt-6 text-xs text-slate-600 leading-relaxed">
          <p>
            Breakout confidence scores are estimates based on age, opportunity, talent profile, and situational context
            as of March 2026. Not affiliated with any external ranking or scouting service. Values are subject to
            change based on NFL Draft outcomes, free agency, and training camp developments.
          </p>
        </div>

      </div>
    </>
  );
}
