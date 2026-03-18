import { useState } from 'react';
import Head from 'next/head';
import { Users, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type ImpactLevel = 'high' | 'moderate' | 'none';
type PlayerImpact = 'positive' | 'neutral' | 'negative' | 'stable';

interface AffectedPlayer {
  name: string;
  pos: 'QB' | 'RB' | 'WR' | 'TE';
  impact: PlayerImpact;
  note: string;
  bmffflOwner?: string;
}

interface CoachingChange {
  id: string;
  team: string;
  teamCode: string;
  impactLevel: ImpactLevel;
  changeType: 'new-hc' | 'new-oc' | 'new-dc' | 'retained' | 'stable';
  changeDesc: string;
  schemeNote: string;
  affectedPlayers: AffectedPlayer[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const COACHING_CHANGES: CoachingChange[] = [
  // ── HIGH IMPACT ────────────────────────────────────────────────────────────
  {
    id: 'ne',
    team: 'New England Patriots',
    teamCode: 'NE',
    impactLevel: 'high',
    changeType: 'new-hc',
    changeDesc: 'Jerod Mayo fired · Mike Vrabel hired as HC',
    schemeNote: 'Vrabel brings aggressive, balanced offensive philosophy. New OC expected. Complete culture reset under a proven winner — Drake Maye gets a real system built around him.',
    affectedPlayers: [
      {
        name: 'Drake Maye',
        pos: 'QB',
        impact: 'positive',
        note: 'Outlook improves significantly. Vrabel will invest in Maye\'s development. Scheme upgrade from Jerod Mayo-era stagnation.',
        bmffflOwner: 'Grandes',
      },
    ],
  },
  {
    id: 'nyj',
    team: 'NY Jets',
    teamCode: 'NYJ',
    impactLevel: 'high',
    changeType: 'new-hc',
    changeDesc: 'Robert Saleh fired · Aaron Glenn hired as HC · New OC incoming',
    schemeNote: 'Aaron Glenn is a defensive-minded HC. New OC hire will define offensive scheme identity. Transition period expected in 2026 — usage patterns flux until depth chart settles.',
    affectedPlayers: [
      {
        name: 'Breece Hall',
        pos: 'RB',
        impact: 'neutral',
        note: 'Usage uncertain early in new regime. Hall\'s talent is scheme-proof long-term, but new OC could re-define backfield role split in 2026.',
        bmffflOwner: 'Tubes94',
      },
    ],
  },
  {
    id: 'jax',
    team: 'Jacksonville Jaguars',
    teamCode: 'JAX',
    impactLevel: 'high',
    changeType: 'new-hc',
    changeDesc: 'Doug Pederson fired · New HC hired',
    schemeNote: 'Full offensive overhaul underway. New HC brings fresh scheme — Trevor Lawrence must prove adaptability as the organizational rebuild continues.',
    affectedPlayers: [
      {
        name: 'Trevor Lawrence',
        pos: 'QB',
        impact: 'neutral',
        note: 'Must adapt to third different offensive system. Talent remains elite but 2026 could be another learning-curve season. Dynasty hold — ceiling unchanged.',
        bmffflOwner: 'MLSchools12',
      },
    ],
  },
  {
    id: 'lv',
    team: 'Las Vegas Raiders',
    teamCode: 'LV',
    impactLevel: 'high',
    changeType: 'new-hc',
    changeDesc: 'New HC hired in offseason',
    schemeNote: 'Raiders in ongoing reset mode. New HC enters with a new vision for the roster. Skill position talent evaluation in progress.',
    affectedPlayers: [
      {
        name: 'Brock Bowers',
        pos: 'TE',
        impact: 'stable',
        note: 'Elite TE1 regardless of scheme. Bowers\' usage is coaching-change-proof — any HC will feature the most dominant young TE in football.',
        bmffflOwner: 'rbr',
      },
      {
        name: 'Tre Tucker',
        pos: 'WR',
        impact: 'stable',
        note: 'Maintains role as a speed-slot option. Regime change unlikely to disrupt Tucker\'s special-teams and complementary receiver role.',
        bmffflOwner: 'SexMachineAndyD',
      },
    ],
  },
  {
    id: 'kc-dc',
    team: 'Kansas City Chiefs',
    teamCode: 'KC',
    impactLevel: 'high',
    changeType: 'new-dc',
    changeDesc: 'DC change · Andy Reid retained as HC',
    schemeNote: 'Andy Reid remains the offensive architect — DC change is a defensive restructure only. Offensive system continuity is near-total. Impact on skill positions is minimal.',
    affectedPlayers: [
      {
        name: 'Rashee Rice',
        pos: 'WR',
        impact: 'stable',
        note: 'Mahomes/Reid system unchanged. DC turnover has zero bearing on offensive target share.',
        bmffflOwner: 'Grandes',
      },
    ],
  },

  // ── MODERATE IMPACT ────────────────────────────────────────────────────────
  {
    id: 'car',
    team: 'Carolina Panthers',
    teamCode: 'CAR',
    impactLevel: 'moderate',
    changeType: 'retained',
    changeDesc: 'Dave Canales retained as HC',
    schemeNote: 'Canales is known for a pass-heavy, WR-friendly system. Continuity is a dynasty positive — players know the scheme and have established roles heading into year two under the same staff.',
    affectedPlayers: [
      {
        name: 'D.J. Moore',
        pos: 'WR',
        impact: 'stable',
        note: 'Stable WR1 role in Canales\' pass-first system. Dynasty hold — no change to outlook.',
        bmffflOwner: 'Tubes94',
      },
    ],
  },
  {
    id: 'min',
    team: 'Minnesota Vikings',
    teamCode: 'MIN',
    impactLevel: 'moderate',
    changeType: 'retained',
    changeDesc: 'Kevin O\'Connell retained as HC',
    schemeNote: 'O\'Connell\'s system was built around Sam Darnold but adapts to new QB. Kyler Murray trade brings a dual-threat element — slight scheme shift expected toward more designed runs and bootlegs.',
    affectedPlayers: [
      {
        name: 'Jordan Addison',
        pos: 'WR',
        impact: 'neutral',
        note: 'O\'Connell uses slot receivers heavily. Murray may favor checkdowns early. Addison\'s role in this system is strong but the QB switch adds short-term variance.',
        bmffflOwner: 'SexMachineAndyD',
      },
    ],
  },
  {
    id: 'hou',
    team: 'Houston Texans',
    teamCode: 'HOU',
    impactLevel: 'moderate',
    changeType: 'retained',
    changeDesc: 'DeMeco Ryans retained as HC',
    schemeNote: 'Ryans and the Texans coaching staff intact. Stable offensive environment for skill players. Stefon Diggs\' age is the only relevant variable.',
    affectedPlayers: [
      {
        name: 'Nico Collins',
        pos: 'WR',
        impact: 'stable',
        note: 'WR1 role locked in under Ryans. Dynasty hold — scheme continuity is a dynasty positive.',
        bmffflOwner: 'MLSchools12',
      },
      {
        name: 'Stefon Diggs',
        pos: 'WR',
        impact: 'neutral',
        note: 'Coaching staff stable but Diggs is 32. Scheme supports him but age limits dynasty ceiling. Monitor usage as season approaches.',
        bmffflOwner: 'rbr',
      },
    ],
  },
  {
    id: 'sf',
    team: 'San Francisco 49ers',
    teamCode: 'SF',
    impactLevel: 'moderate',
    changeType: 'retained',
    changeDesc: 'Kyle Shanahan retained as HC',
    schemeNote: 'Shanahan\'s system is one of the most stable environments in the NFL. Full offensive continuity for CMC and Purdy. Deebo Samuel remains unsigned — key roster variable.',
    affectedPlayers: [
      {
        name: 'Christian McCaffrey',
        pos: 'RB',
        impact: 'stable',
        note: 'Shanahan continuity means CMC\'s usage ceiling is unchanged. Dynasty cornerstone.',
        bmffflOwner: 'Grandes',
      },
      {
        name: 'Brock Purdy',
        pos: 'QB',
        impact: 'stable',
        note: 'Shanahan system continuity protects Purdy\'s floor. No coaching volatility risk.',
        bmffflOwner: 'Tubes94',
      },
      {
        name: 'Deebo Samuel',
        pos: 'WR',
        impact: 'neutral',
        note: 'Coaching staff stable but Deebo is unsigned entering offseason. Contract situation is the dynasty risk, not scheme.',
        bmffflOwner: 'rbr',
      },
    ],
  },

  // ── STABLE / NO CHANGE ─────────────────────────────────────────────────────
  {
    id: 'bal',
    team: 'Baltimore Ravens',
    teamCode: 'BAL',
    impactLevel: 'none',
    changeType: 'stable',
    changeDesc: 'John Harbaugh retained · No staff changes',
    schemeNote: 'Complete organizational stability. The Ravens\' run-first, Lamar-extension system is unchanged.',
    affectedPlayers: [
      {
        name: 'Lamar Jackson',
        pos: 'QB',
        impact: 'stable',
        note: 'Harbaugh continuity — Lamar\'s dynasty ceiling untouched.',
        bmffflOwner: 'MLSchools12',
      },
    ],
  },
  {
    id: 'cin',
    team: 'Cincinnati Bengals',
    teamCode: 'CIN',
    impactLevel: 'none',
    changeType: 'stable',
    changeDesc: 'Zac Taylor retained · No staff changes',
    schemeNote: 'Bengals staff fully intact. Pass-heavy system built around Burrow and Chase is as good as locked in.',
    affectedPlayers: [
      {
        name: "Ja'Marr Chase",
        pos: 'WR',
        impact: 'stable',
        note: 'Scheme unchanged. Dynasty hold at the top of every board.',
        bmffflOwner: 'Tubes94',
      },
    ],
  },
  {
    id: 'mia',
    team: 'Miami Dolphins',
    teamCode: 'MIA',
    impactLevel: 'none',
    changeType: 'stable',
    changeDesc: 'Mike McDaniel retained · No staff changes',
    schemeNote: 'McDaniel\'s speed-in-space system unchanged. Tyreek and Waddle remain in the most WR-friendly scheme in the AFC.',
    affectedPlayers: [
      {
        name: 'Tyreek Hill',
        pos: 'WR',
        impact: 'stable',
        note: 'McDaniel retention is dynasty hold confirmation.',
        bmffflOwner: 'SexMachineAndyD',
      },
      {
        name: 'Jaylen Waddle',
        pos: 'WR',
        impact: 'stable',
        note: 'Slot role in McDaniel system unchanged — safe hold.',
        bmffflOwner: 'rbr',
      },
    ],
  },
  {
    id: 'dal',
    team: 'Dallas Cowboys',
    teamCode: 'DAL',
    impactLevel: 'none',
    changeType: 'stable',
    changeDesc: 'HC situation in flux post-McCarthy · OC TBD',
    schemeNote: 'CeeDee Lamb operates above scheme — he will be a WR1 regardless of who is drawing up the playbook in Dallas.',
    affectedPlayers: [
      {
        name: 'CeeDee Lamb',
        pos: 'WR',
        impact: 'stable',
        note: 'Scheme-proof. Dynasty WR1 regardless of coaching carousel.',
        bmffflOwner: 'Grandes',
      },
    ],
  },
  {
    id: 'atl',
    team: 'Atlanta Falcons',
    teamCode: 'ATL',
    impactLevel: 'none',
    changeType: 'stable',
    changeDesc: 'Raheem Morris retained · No staff changes',
    schemeNote: 'Morris retained following strong 2025 season. Bijan Robinson\'s workhorse role is locked in.',
    affectedPlayers: [
      {
        name: 'Bijan Robinson',
        pos: 'RB',
        impact: 'stable',
        note: 'Workhorse role unchanged. Dynasty RB1 — hold with confidence.',
        bmffflOwner: 'MLSchools12',
      },
    ],
  },
  {
    id: 'tb',
    team: 'Tampa Bay Buccaneers',
    teamCode: 'TB',
    impactLevel: 'none',
    changeType: 'stable',
    changeDesc: 'Todd Bowles retained · No staff changes',
    schemeNote: 'Bowles returns for another season. Bucky Irving\'s role as the featured back is fully intact.',
    affectedPlayers: [
      {
        name: 'Bucky Irving',
        pos: 'RB',
        impact: 'stable',
        note: 'Stable role in Bowles system. Dynasty hold.',
        bmffflOwner: 'SexMachineAndyD',
      },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

type FilterMode = 'all' | 'high' | 'moderate' | 'none';

const IMPACT_LEVEL_STYLES: Record<ImpactLevel, { label: string; badge: string; border: string; sectionBorder: string; dot: string }> = {
  high: {
    label: 'High Impact',
    badge: 'bg-[#e94560]/15 text-[#e94560] border-[#e94560]/30',
    border: 'border-[#e94560]/25',
    sectionBorder: 'border-[#e94560]/30',
    dot: 'bg-[#e94560]',
  },
  moderate: {
    label: 'Moderate Impact',
    badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    border: 'border-amber-500/20',
    sectionBorder: 'border-amber-500/30',
    dot: 'bg-amber-400',
  },
  none: {
    label: 'Stable',
    badge: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    border: 'border-[#2d4a66]',
    sectionBorder: 'border-[#2d4a66]',
    dot: 'bg-slate-500',
  },
};

const PLAYER_IMPACT_STYLES: Record<PlayerImpact, { badge: string; emoji: string; text: string }> = {
  positive: {
    badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    emoji: '🟢',
    text: 'Positive',
  },
  neutral: {
    badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    emoji: '🟡',
    text: 'Neutral',
  },
  negative: {
    badge: 'bg-[#e94560]/15 text-[#e94560] border-[#e94560]/30',
    emoji: '🔴',
    text: 'Negative',
  },
  stable: {
    badge: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    emoji: '⚪',
    text: 'Stable',
  },
};

const CHANGE_TYPE_LABELS: Record<CoachingChange['changeType'], string> = {
  'new-hc':  'New HC',
  'new-oc':  'New OC',
  'new-dc':  'New DC',
  'retained':'HC Retained',
  'stable':  'No Change',
};

const CHANGE_TYPE_STYLES: Record<CoachingChange['changeType'], string> = {
  'new-hc':   'bg-[#e94560]/15 text-[#e94560] border-[#e94560]/30',
  'new-oc':   'bg-orange-500/15 text-orange-400 border-orange-500/30',
  'new-dc':   'bg-purple-500/15 text-purple-400 border-purple-500/30',
  'retained': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'stable':   'bg-slate-500/15 text-slate-400 border-slate-500/30',
};

const POS_STYLES: Record<'QB' | 'RB' | 'WR' | 'TE', string> = {
  QB: 'bg-red-500/15 text-red-400 border-red-500/30',
  RB: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  WR: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  TE: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
};

const FILTER_OPTIONS: { value: FilterMode; label: string }[] = [
  { value: 'all',      label: 'All Teams' },
  { value: 'high',     label: 'High Impact' },
  { value: 'moderate', label: 'Moderate Impact' },
  { value: 'none',     label: 'Stable' },
];

const SECTION_ORDER: ImpactLevel[] = ['high', 'moderate', 'none'];

// ─── Derived stats ────────────────────────────────────────────────────────────

const NEW_HC_COUNT  = COACHING_CHANGES.filter(c => c.changeType === 'new-hc').length;
const NEW_OC_COUNT  = COACHING_CHANGES.filter(c => c.changeType === 'new-oc').length;
const STABLE_COUNT  = COACHING_CHANGES.filter(c => c.changeType === 'stable' || c.changeType === 'retained').length;

// All unique BMFFFL owners with affected players (any non-stable impact)
const AFFECTED_OWNERS = Array.from(
  new Set(
    COACHING_CHANGES
      .flatMap(c => c.affectedPlayers)
      .filter(p => p.impact !== 'stable' && p.bmffflOwner)
      .map(p => p.bmffflOwner as string)
  )
).sort();

// ─── Sub-components ───────────────────────────────────────────────────────────

function PosBadge({ pos }: { pos: 'QB' | 'RB' | 'WR' | 'TE' }) {
  return (
    <span className={cn(
      'inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border w-9',
      POS_STYLES[pos]
    )}>
      {pos}
    </span>
  );
}

function PlayerImpactBadge({ impact }: { impact: PlayerImpact }) {
  const s = PLAYER_IMPACT_STYLES[impact];
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border',
      s.badge
    )}>
      <span aria-hidden="true">{s.emoji}</span>
      {s.text}
    </span>
  );
}

// ─── Player Row ───────────────────────────────────────────────────────────────

function PlayerRow({ player }: { player: AffectedPlayer }) {
  return (
    <div className={cn(
      'rounded-lg border px-4 py-3 flex flex-col gap-2',
      player.impact === 'positive' ? 'border-emerald-500/20 bg-emerald-500/5'  :
      player.impact === 'negative' ? 'border-[#e94560]/20  bg-[#e94560]/5'    :
      player.impact === 'neutral'  ? 'border-amber-500/20  bg-amber-500/5'    :
      'border-[#2d4a66] bg-[#0d1b2a]/40'
    )}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-white text-sm">{player.name}</span>
          <PosBadge pos={player.pos} />
          {player.bmffflOwner && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border bg-[#ffd700]/10 text-[#ffd700] border-[#ffd700]/25">
              <Users className="w-2.5 h-2.5" aria-hidden="true" />
              {player.bmffflOwner}
            </span>
          )}
        </div>
        <PlayerImpactBadge impact={player.impact} />
      </div>
      <p className={cn(
        'text-xs leading-relaxed',
        player.impact === 'positive' ? 'text-emerald-400/90' :
        player.impact === 'negative' ? 'text-[#e94560]/90'   :
        player.impact === 'neutral'  ? 'text-amber-400/90'   :
        'text-slate-400'
      )}>
        {player.note}
      </p>
    </div>
  );
}

// ─── Change Card ──────────────────────────────────────────────────────────────

function ChangeCard({ change }: { change: CoachingChange }) {
  const levelStyle  = IMPACT_LEVEL_STYLES[change.impactLevel];
  const changeStyle = CHANGE_TYPE_STYLES[change.changeType];

  return (
    <div
      className={cn(
        'rounded-xl border bg-[#16213e] overflow-hidden transition-all duration-200',
        levelStyle.border
      )}
      aria-label={`${change.team} coaching change`}
    >
      {/* Card header */}
      <div className={cn('px-5 py-4 border-b', levelStyle.sectionBorder, 'bg-[#0d1b2a]/30')}>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Team code pill */}
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#16213e] border border-[#2d4a66] text-sm font-black text-[#ffd700] font-mono shrink-0">
              {change.teamCode}
            </span>
            <div>
              <h3 className="text-base font-black text-white leading-tight">{change.team}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{change.changeDesc}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn(
              'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border',
              changeStyle
            )}>
              {CHANGE_TYPE_LABELS[change.changeType]}
            </span>
            <span className={cn(
              'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border',
              levelStyle.badge
            )}>
              {levelStyle.label}
            </span>
          </div>
        </div>
      </div>

      {/* Scheme note */}
      <div className="px-5 py-4 border-b border-[#2d4a66]/50">
        <p className="text-xs text-slate-400 leading-relaxed">{change.schemeNote}</p>
      </div>

      {/* Affected players */}
      <div className="px-5 py-4">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-3">
          BMFFFL Impact — Affected Players
        </p>
        <div className="space-y-2">
          {change.affectedPlayers.map(player => (
            <PlayerRow key={player.name} player={player} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Summary Bar ──────────────────────────────────────────────────────────────

function SummaryBar() {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      <div className="rounded-lg border border-[#e94560]/20 bg-[#e94560]/5 px-4 py-3 text-center">
        <p className="text-2xl font-black text-[#e94560] tabular-nums">{NEW_HC_COUNT}</p>
        <p className="text-xs text-slate-400 font-medium mt-0.5">New Head Coach</p>
      </div>
      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-center">
        <p className="text-2xl font-black text-amber-400 tabular-nums">{NEW_OC_COUNT + 1}</p>
        <p className="text-xs text-slate-400 font-medium mt-0.5">New OC / DC</p>
      </div>
      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-center">
        <p className="text-2xl font-black text-emerald-400 tabular-nums">{STABLE_COUNT}</p>
        <p className="text-xs text-slate-400 font-medium mt-0.5">Stable</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CoachingChangesPage() {
  const [filter, setFilter] = useState<FilterMode>('all');

  const visibleGroups: ImpactLevel[] = filter === 'all'
    ? SECTION_ORDER
    : [filter as ImpactLevel];

  const filteredChanges = (level: ImpactLevel) =>
    COACHING_CHANGES.filter(c => c.impactLevel === level);

  const totalVisible = filter === 'all'
    ? COACHING_CHANGES.length
    : COACHING_CHANGES.filter(c => c.impactLevel === filter).length;

  return (
    <>
      <Head>
        <title>2026 Coaching Changes — BMFFFL Analytics</title>
        <meta
          name="description"
          content="2026 NFL offseason coaching changes and scheme impact tracker for BMFFFL dynasty fantasy football. See how new HCs and coordinators affect your roster."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            2026 Coaching Changes
          </h1>
          <p className="text-slate-400 text-lg">
            Scheme Impact Tracker &mdash; How the offseason coaching carousel affects BMFFFL dynasty rosters
          </p>
        </header>

        {/* ── Summary Stats ─────────────────────────────────────────────── */}
        <section className="mb-8" aria-label="Coaching change summary statistics">
          <SummaryBar />
        </section>

        {/* ── BMFFFL Owners Alert ───────────────────────────────────────── */}
        {AFFECTED_OWNERS.length > 0 && (
          <div className="mb-8 rounded-xl border border-[#ffd700]/20 bg-[#ffd700]/5 px-5 py-4 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-[#ffd700] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-[#ffd700] mb-1">
                BMFFFL Owners With Affected Players
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {AFFECTED_OWNERS.map(owner => (
                  <span
                    key={owner}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-[#ffd700]/10 text-[#ffd700] border-[#ffd700]/30"
                  >
                    <Users className="w-2.5 h-2.5" aria-hidden="true" />
                    {owner}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Stable confirmation bar ───────────────────────────────────── */}
        <div className="mb-8 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-4 flex items-start gap-3">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-slate-300 leading-relaxed">
            <span className="font-semibold text-emerald-400">No-risk stables:</span>{' '}
            Harbaugh (BAL), Zac Taylor (CIN), McDaniel (MIA), Shanahan (SF), Morris (ATL), and Bowles (TB)
            are all retained. Players on those rosters carry{' '}
            <span className="font-semibold text-white">zero scheme disruption risk</span> heading into 2026.
          </p>
        </div>

        {/* ── Filters ───────────────────────────────────────────────────── */}
        <section className="mb-6" aria-label="Filter coaching changes">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by impact level">
            {FILTER_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={cn(
                  'px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-150 border',
                  filter === opt.value
                    ? 'bg-[#ffd700] text-[#0d1b2a] border-[#ffd700]'
                    : 'bg-[#16213e] text-slate-400 border-[#2d4a66] hover:border-[#ffd700]/40 hover:text-white'
                )}
                aria-pressed={filter === opt.value}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        {/* ── Results count ─────────────────────────────────────────────── */}
        <p className="mb-6 text-xs text-slate-500">
          Showing {totalVisible} team{totalVisible !== 1 ? 's' : ''}
          {filter !== 'all' && ` · ${FILTER_OPTIONS.find(o => o.value === filter)?.label}`}
        </p>

        {/* ── Grouped sections ──────────────────────────────────────────── */}
        <div className="space-y-10">
          {visibleGroups.map(level => {
            const changes = filteredChanges(level);
            if (changes.length === 0) return null;
            const levelStyle = IMPACT_LEVEL_STYLES[level];

            return (
              <section key={level} aria-labelledby={`section-${level}`}>
                {/* Section heading */}
                <div className="flex items-center gap-3 mb-5">
                  <span className={cn('w-2.5 h-2.5 rounded-full shrink-0', levelStyle.dot)} aria-hidden="true" />
                  <h2
                    id={`section-${level}`}
                    className="text-xl font-black text-white"
                  >
                    {levelStyle.label}
                  </h2>
                  <span className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border',
                    levelStyle.badge
                  )}>
                    {changes.length} team{changes.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {changes.map(change => (
                    <ChangeCard key={change.id} change={change} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* ── Footer note ───────────────────────────────────────────────── */}
        <div className="mt-10 rounded-lg border border-[#2d4a66] bg-[#16213e] px-5 py-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="text-slate-400 font-semibold">Note:</span>{' '}
            Coaching change assessments reflect publicly reported hires and retentions as of March 2026.
            Additional OC / coordinator hires are ongoing. Dynasty impact opinions are editorial and not
            lineup or trade advice. Rosters and ownership listed reflect BMFFFL league data and may not
            reflect recent trades.
          </p>
        </div>

      </div>
    </>
  );
}
