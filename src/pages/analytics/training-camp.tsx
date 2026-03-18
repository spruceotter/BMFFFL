import Head from 'next/head';
import { Tent, AlertTriangle, TrendingUp, Clock, Shield } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
type Position = 'QB' | 'RB' | 'WR' | 'TE';

interface WatchPlayer {
  player: string;
  pos: Position;
  team: string;
  concern: string;
  watchFor: string;
  risk: RiskLevel;
  bmffflOwner?: string;
}

interface PositionBattle {
  title: string;
  team: string;
  players: string[];
  dynastyStake: string;
  winner: string;
}

interface InjuryReturn {
  player: string;
  pos: Position;
  team: string;
  injury: string;
  timeline: string;
  dynastyUpside: string;
  bmffflOwner?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const WATCH_PLAYERS: WatchPlayer[] = [
  {
    player: 'Jayden Daniels',
    pos: 'QB',
    team: 'WAS',
    concern: 'Cementing Year 2 leap as face of the franchise',
    watchFor: 'Arm health, expanded route tree, connection with new WR additions',
    risk: 'LOW',
    bmffflOwner: 'Grandes',
  },
  {
    player: 'Bijan Robinson',
    pos: 'RB',
    team: 'ATL',
    concern: 'Usage ceiling under new OC — is he truly the bell cow?',
    watchFor: 'Pass-game role, snap count, Tyler Allgeier usage in camp',
    risk: 'MEDIUM',
    bmffflOwner: 'SexMachineAndyD',
  },
  {
    player: 'Malik Nabers',
    pos: 'WR',
    team: 'NYG',
    concern: 'QB situation murky, may drag down target quality',
    watchFor: 'Who wins QB battle, his slot vs. outside alignment',
    risk: 'MEDIUM',
  },
  {
    player: 'Rome Odunze',
    pos: 'WR',
    team: 'CHI',
    concern: 'Year 2 breakout — needs to win the clear WR2 role',
    watchFor: 'Target share in 11 personnel, red zone involvement',
    risk: 'LOW',
    bmffflOwner: 'rbr',
  },
  {
    player: 'Trey Benson',
    pos: 'RB',
    team: 'ARI',
    concern: 'Competing for lead-back role with James Conner aging out',
    watchFor: 'Three-down usage, pass protection reps in camp',
    risk: 'MEDIUM',
  },
  {
    player: 'Puka Nacua',
    pos: 'WR',
    team: 'LAR',
    concern: 'Returning from knee injury — is he 100%?',
    watchFor: 'Burst on routes, full practice participation, injury designation',
    risk: 'HIGH',
    bmffflOwner: 'MLSchools12',
  },
  {
    player: 'Sam LaPorta',
    pos: 'TE',
    team: 'DET',
    concern: 'Sophomore regression risk — can he build on Year 1?',
    watchFor: 'Route tree expansion, red zone targets, chemistry with Goff',
    risk: 'LOW',
  },
  {
    player: 'De\'Von Achane',
    pos: 'RB',
    team: 'MIA',
    concern: 'Durability concerns after multiple missed games in 2025',
    watchFor: 'Practice participation, workload management, contact avoidance',
    risk: 'HIGH',
    bmffflOwner: 'Tubes94',
  },
  {
    player: 'Jaylen Warren',
    pos: 'RB',
    team: 'PIT',
    concern: 'Battle to retain lead-back role after Najee Harris departure',
    watchFor: 'First-team reps, goal-line carries, receiving work out of backfield',
    risk: 'MEDIUM',
  },
  {
    player: 'Tucker Kraft',
    pos: 'TE',
    team: 'GB',
    concern: 'Can he be a true TE1 with Luke Musgrave gone?',
    watchFor: 'Starter reps, red zone alignment, Jordan Love target connection',
    risk: 'MEDIUM',
  },
  {
    player: 'Rashee Rice',
    pos: 'WR',
    team: 'KC',
    concern: 'Full recovery from knee injury suffered in 2024',
    watchFor: 'Route sharpness, full practice reps, Patrick Mahomes chemistry',
    risk: 'HIGH',
    bmffflOwner: 'SexMachineAndyD',
  },
  {
    player: 'Jonathon Brooks',
    pos: 'RB',
    team: 'CAR',
    concern: 'First real camp after ACL rehab — proving he can be the guy',
    watchFor: 'Burst and explosion in space, durability through camp grind',
    risk: 'HIGH',
  },
  {
    player: 'Marvin Harrison Jr.',
    pos: 'WR',
    team: 'ARI',
    concern: 'Year 2 with a better QB — ascending to true WR1 status',
    watchFor: 'Alignment versatility, YAC ability, red zone targets',
    risk: 'LOW',
    bmffflOwner: 'Boomerang19',
  },
  {
    player: 'Keon Coleman',
    pos: 'WR',
    team: 'BUF',
    concern: 'Competing to be Josh Allen\'s clear WR1 — size matters here',
    watchFor: 'Red zone alignment, separation drills, wrist health',
    risk: 'MEDIUM',
  },
  {
    player: 'Rhamondre Stevenson',
    pos: 'RB',
    team: 'LAR',
    concern: 'New team, new system — needs to lock up the lead-back role',
    watchFor: 'First-team reps in McVay offense, pass-pro grading, receiving role',
    risk: 'MEDIUM',
    bmffflOwner: 'Grandes',
  },
];

const POSITION_BATTLES: PositionBattle[] = [
  {
    title: 'Giants QB Battle',
    team: 'NYG',
    players: ['Daniel Jones (returning)', 'Tommy DeVito', 'Draft pick TBD'],
    dynastyStake: 'The QB who wins this directly determines Malik Nabers\'s value. A mobile, accurate starter unlocks Nabers as a top-10 WR asset.',
    winner: 'Watch for: Who gets first-team reps in Week 1 of camp',
  },
  {
    title: 'Cardinals RB1 Competition',
    team: 'ARI',
    players: ['Trey Benson', 'James Conner', 'Emari Demercado'],
    dynastyStake: 'Conner is aging out. Benson is a dynasty asset only if he wins this outright. A timeshare tanks his value.',
    winner: 'Watch for: Who leads goal-line and passing-down packages',
  },
  {
    title: 'Steelers Lead Back Role',
    team: 'PIT',
    players: ['Jaylen Warren', 'Jonathan Ward', 'UDFA camp bodies'],
    dynastyStake: 'Post-Najee era. Warren could be a usable RB2 if he wins clearly. Anyone else winning is a dynasty non-factor.',
    winner: 'Watch for: Who takes first-team reps in padded practices',
  },
  {
    title: 'Panthers RB Depth Chart',
    team: 'CAR',
    players: ['Jonathon Brooks', 'Chuba Hubbard', 'Miles Sanders'],
    dynastyStake: 'Brooks is the long-term dynasty investment. If healthy and dominant in camp, buy now. Hubbard will keep the job until Brooks proves it.',
    winner: 'Watch for: Brooks participation level and whether he takes contact reps',
  },
  {
    title: 'Packers TE1 Role',
    team: 'GB',
    players: ['Tucker Kraft', 'Josiah Deguara', 'TE draft pick TBD'],
    dynastyStake: 'Kraft is a dynasty upside play if he wins the target-share battle. Jordan Love targets his TE heavily when healthy.',
    winner: 'Watch for: Red zone snaps and solo routes vs. inline blocking role',
  },
];

const INJURY_RETURNS: InjuryReturn[] = [
  {
    player: 'Rashee Rice',
    pos: 'WR',
    team: 'KC',
    injury: 'Knee (ACL) — missed most of 2024 season',
    timeline: 'Expected full participant by start of camp. Cleared for 11s in spring.',
    dynastyUpside: 'If healthy, top-20 WR. Patrick Mahomes will feed him. Don\'t sleep on the buy-low window closing fast.',
    bmffflOwner: 'SexMachineAndyD',
  },
  {
    player: 'Puka Nacua',
    pos: 'WR',
    team: 'LAR',
    injury: 'Knee sprain — ended 2024 early',
    timeline: 'Cleared for contact in spring. Should be full-go by camp open.',
    dynastyUpside: 'Pre-injury pace was WR1 territory. Cooper Kupp aging out means Puka becomes the clear alpha if healthy.',
    bmffflOwner: 'MLSchools12',
  },
  {
    player: 'Jonathon Brooks',
    pos: 'RB',
    team: 'CAR',
    injury: 'ACL — missed entire 2024 rookie season',
    timeline: 'On track for full camp participation. 14+ months post-surgery.',
    dynastyUpside: 'Elite pre-draft prospect. If he shows burst and handles contact, he\'s the most valuable dynasty RB in camp.',
  },
  {
    player: 'De\'Von Achane',
    pos: 'RB',
    team: 'MIA',
    injury: 'Multiple soft-tissue injuries throughout 2025 season',
    timeline: 'Healthy heading into offseason. Camp will be the durability proof.',
    dynastyUpside: 'When healthy he\'s a top-5 dynasty RB. The camp question is whether Miami limits his contact to preserve him.',
    bmffflOwner: 'Tubes94',
  },
  {
    player: 'Christian Watson',
    pos: 'WR',
    team: 'GB',
    injury: 'Hamstring — persistent issues limiting 2025 availability',
    timeline: 'No surgery needed. Expected healthy at camp open.',
    dynastyUpside: 'Athleticism is undeniable. If he stays healthy in camp, a buy-low on the breakout is still on the table.',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const RISK_STYLES: Record<RiskLevel, { badge: string; label: string }> = {
  LOW:    { badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', label: 'LOW RISK' },
  MEDIUM: { badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',       label: 'MED RISK' },
  HIGH:   { badge: 'bg-[#e94560]/15 text-[#e94560] border-[#e94560]/30',       label: 'HIGH RISK' },
};

const POS_STYLES: Record<Position, string> = {
  QB: 'bg-red-500/15 text-red-400 border-red-500/30',
  RB: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  WR: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  TE: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
};

function PosBadge({ pos }: { pos: Position }) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border w-9 justify-center', POS_STYLES[pos])}>
      {pos}
    </span>
  );
}

function RiskBadge({ risk }: { risk: RiskLevel }) {
  const s = RISK_STYLES[risk];
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border', s.badge)}>
      {s.label}
    </span>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function WatchCard({ p }: { p: WatchPlayer }) {
  const isOwned = !!p.bmffflOwner;
  return (
    <div className={cn(
      'rounded-xl border bg-[#16213e] p-5 flex flex-col gap-3 transition-all duration-200',
      isOwned ? 'border-[#ffd700]/30' : 'border-[#2d4a66]'
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-base font-bold text-white">{p.player}</h3>
          <PosBadge pos={p.pos} />
          <span className="text-xs font-mono font-semibold text-slate-400">{p.team}</span>
          {isOwned && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-[#ffd700]/15 text-[#ffd700] border-[#ffd700]/30">
              BMFFFL
            </span>
          )}
        </div>
        <RiskBadge risk={p.risk} />
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Dynasty Concern</p>
        <p className="text-sm text-slate-300 leading-relaxed">{p.concern}</p>
      </div>

      <div className="pt-2 border-t border-[#2d4a66]">
        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Watch For</p>
        <p className="text-xs text-slate-400 leading-relaxed">{p.watchFor}</p>
      </div>

      {isOwned && (
        <div className="flex items-center gap-2 pt-1 border-t border-[#2d4a66]">
          <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Owner</span>
          <span className="text-xs font-semibold text-slate-200">{p.bmffflOwner}</span>
        </div>
      )}
    </div>
  );
}

function BattleCard({ b }: { b: PositionBattle }) {
  return (
    <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <h3 className="text-base font-bold text-white">{b.title}</h3>
        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#0d1b2a] border border-[#2d4a66] text-slate-400">{b.team}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {b.players.map((pl) => (
          <span key={pl} className="text-xs px-2.5 py-1 rounded-full bg-[#0d1b2a] border border-[#2d4a66] text-slate-300">
            {pl}
          </span>
        ))}
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Dynasty Stake</p>
        <p className="text-sm text-slate-300 leading-relaxed">{b.dynastyStake}</p>
      </div>

      <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 px-3 py-2">
        <p className="text-xs text-amber-400 leading-relaxed">{b.winner}</p>
      </div>
    </div>
  );
}

function InjuryCard({ r }: { r: InjuryReturn }) {
  const isOwned = !!r.bmffflOwner;
  return (
    <div className={cn(
      'rounded-xl border bg-[#16213e] p-5 flex flex-col gap-3',
      isOwned ? 'border-[#ffd700]/30' : 'border-[#2d4a66]'
    )}>
      <div className="flex items-center gap-2 flex-wrap">
        <h3 className="text-base font-bold text-white">{r.player}</h3>
        <PosBadge pos={r.pos} />
        <span className="text-xs font-mono font-semibold text-slate-400">{r.team}</span>
        {isOwned && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-[#ffd700]/15 text-[#ffd700] border-[#ffd700]/30">
            BMFFFL
          </span>
        )}
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Injury</p>
        <p className="text-sm text-[#e94560]/90 leading-relaxed">{r.injury}</p>
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Timeline</p>
        <p className="text-xs text-slate-400 leading-relaxed">{r.timeline}</p>
      </div>

      <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 px-3 py-2">
        <p className="text-[11px] uppercase tracking-wider text-emerald-500/80 font-semibold mb-0.5">Dynasty Upside</p>
        <p className="text-xs text-emerald-400 leading-relaxed">{r.dynastyUpside}</p>
      </div>

      {isOwned && (
        <div className="flex items-center gap-2 pt-1 border-t border-[#2d4a66]">
          <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Owner</span>
          <span className="text-xs font-semibold text-slate-200">{r.bmffflOwner}</span>
        </div>
      )}
    </div>
  );
}

// ─── Strategy Tips ─────────────────────────────────────────────────────────────

const STRATEGY_TIPS: { icon: string; phase: string; title: string; detail: string }[] = [
  {
    icon: 'buy',
    phase: 'Pre-Camp (June)',
    title: 'Buy Before Camp Opens',
    detail: 'Prices are lowest before camp hype inflates value. Target injury returns and position battle favorites before beat reporters start generating buzz. Rashee Rice and Jonathon Brooks are examples — buy now while the narrative is still uncertain.',
  },
  {
    icon: 'sell',
    phase: 'During Camp (July–Aug)',
    title: 'Sell After Bad Camp Reports',
    detail: 'When a beat reporter posts "XYZ getting limited reps" or "competition is closer than expected," that is your sell window. The market takes 12–24 hours to reprice. Move first. Do not wait for depth-chart confirmation.',
  },
  {
    icon: 'hold',
    phase: 'Post-Preseason (Aug)',
    title: 'Hold Through the Noise',
    detail: 'Preseason game stats mean almost nothing. Elite dynasty assets who have quiet preseason games are often being protected. Do not sell an RB1 because he did not play in a Week 1 preseason game — that is the plan.',
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TrainingCampPage() {
  return (
    <>
      <Head>
        <title>Training Camp Tracker 2026 — BMFFFL Analytics</title>
        <meta
          name="description"
          content="2026 NFL Training Camp tracker. Players to watch, position battles, injury returns, and dynasty strategy for BMFFFL managers."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Header */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <Tent className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            Training Camp 2026
          </h1>
          <p className="text-slate-400 text-lg">
            Dynasty Watch Tracker &mdash; Players, battles, and moves to make before the season
          </p>
        </header>

        {/* Status Banner */}
        <section className="mb-10" aria-label="Training camp status">
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse shrink-0" aria-hidden="true" />
              <div>
                <p className="text-base font-bold text-white">Training Camp 2026 — Opens July 2026</p>
                <p className="text-sm text-slate-400 mt-0.5">Current Status: <span className="text-amber-400 font-semibold">Offseason</span></p>
              </div>
            </div>
            <div className="sm:ml-auto flex flex-wrap gap-3 text-xs">
              <span className="px-3 py-1.5 rounded-lg bg-[#0d1b2a] border border-[#2d4a66] text-slate-400">
                Vets Report: ~July 22
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-[#0d1b2a] border border-[#2d4a66] text-slate-400">
                Preseason Week 1: ~Aug 7
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-[#0d1b2a] border border-[#2d4a66] text-slate-400">
                Final Cuts: Aug 26
              </span>
            </div>
          </div>
        </section>

        {/* Players to Watch */}
        <section className="mb-12" aria-label="Players to watch in training camp">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <h2 className="text-2xl font-black text-white">Players to Watch</h2>
            <span className="text-xs px-2 py-1 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/20 text-[#ffd700] font-semibold">
              {WATCH_PLAYERS.length} players
            </span>
          </div>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            These are the dynasty-relevant players whose camp performance will move markets. Gold-bordered cards indicate BMFFFL-owned players.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {WATCH_PLAYERS.map((p) => (
              <WatchCard key={`${p.player}-${p.team}`} p={p} />
            ))}
          </div>
        </section>

        {/* Position Battles */}
        <section className="mb-12" aria-label="Position battles to track">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-amber-400" aria-hidden="true" />
            <h2 className="text-2xl font-black text-white">Competitions to Track</h2>
          </div>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            Five position battles where the outcome has real dynasty consequences. The winner matters — the loser is often droppable.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {POSITION_BATTLES.map((b) => (
              <BattleCard key={b.title} b={b} />
            ))}
          </div>
        </section>

        {/* Injury Recovery Watch */}
        <section className="mb-12" aria-label="Injury recovery watch">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-5 h-5 text-[#e94560]" aria-hidden="true" />
            <h2 className="text-2xl font-black text-white">Injury Recovery Watch</h2>
          </div>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            Players returning from significant injuries. Camp is where dynasty managers get their clearest signal on health before committing dynasty capital.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INJURY_RETURNS.map((r) => (
              <InjuryCard key={`${r.player}-${r.team}`} r={r} />
            ))}
          </div>
        </section>

        {/* When to Make Moves */}
        <section className="mb-12" aria-label="Dynasty strategy during training camp">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-5 h-5 text-blue-400" aria-hidden="true" />
            <h2 className="text-2xl font-black text-white">When to Make Moves</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STRATEGY_TIPS.map((tip) => (
              <div
                key={tip.phase}
                className={cn(
                  'rounded-xl border bg-[#16213e] p-5 flex flex-col gap-3',
                  tip.icon === 'buy'  ? 'border-emerald-500/20' :
                  tip.icon === 'sell' ? 'border-[#e94560]/20' :
                  'border-blue-500/20'
                )}
              >
                <div>
                  <p className={cn(
                    'text-[11px] uppercase tracking-wider font-bold mb-1',
                    tip.icon === 'buy'  ? 'text-emerald-400' :
                    tip.icon === 'sell' ? 'text-[#e94560]' :
                    'text-blue-400'
                  )}>
                    {tip.phase}
                  </p>
                  <h3 className="text-base font-bold text-white">{tip.title}</h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{tip.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bimfle's Camp Preview */}
        <section className="mb-8" aria-label="Bimfle's camp preview">
          <div className="rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/5 p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#ffd700]/20 border border-[#ffd700]/40 flex items-center justify-center shrink-0">
                <span className="text-[#ffd700] text-lg font-black">B</span>
              </div>
              <div>
                <p className="text-sm font-bold text-[#ffd700] uppercase tracking-wider mb-2">
                  Bimfle's Camp Preview
                </p>
                <p className="text-base text-slate-200 leading-relaxed font-medium">
                  "I will monitor the Sleeper feed. Act accordingly when the news drops."
                </p>
                <p className="text-xs text-slate-500 mt-3">
                  — Bimfle, Official BMFFFL League Intelligence System &mdash; July 2026
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Note */}
        <div className="rounded-lg border border-[#2d4a66] bg-[#16213e] px-5 py-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="text-slate-400 font-semibold">Note:</span> This page reflects offseason projections as of March 2026.
            All training camp information will be updated when camp opens in July 2026.
            Dynasty impact assessments are editorial opinions — not lineup advice.
          </p>
        </div>

      </div>
    </>
  );
}
