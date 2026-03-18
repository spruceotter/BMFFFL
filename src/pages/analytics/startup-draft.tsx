import { useState } from 'react';
import Head from 'next/head';
import { BookOpen, Users, Zap, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type Position = 'QB' | 'RB' | 'WR' | 'TE';

interface StartupPlayer {
  rank: number;
  name: string;
  pos: Position;
  age: number;
  nflTeam: string;
  startupValue: number;
  note: string;
}

interface SimPick {
  overall: number;
  round: number;
  pick: number;
  teamSlot: number; // 1–12
  name: string;
  pos: Position;
}

// ─── Startup Rankings — Top 24 ────────────────────────────────────────────────

const STARTUP_RANKINGS: StartupPlayer[] = [
  { rank: 1,  name: 'Justin Jefferson',    pos: 'WR', age: 25, nflTeam: 'MIN', startupValue: 9800, note: 'Best dynasty WR alive. Young, elite production. 1.01 in all formats.' },
  { rank: 2,  name: 'CeeDee Lamb',         pos: 'WR', age: 25, nflTeam: 'DAL', startupValue: 9600, note: 'Dominant WR1. Dallas target share is massive and sustainable.' },
  { rank: 3,  name: 'Puka Nacua',          pos: 'WR', age: 24, nflTeam: 'LAR', startupValue: 9200, note: 'Slot monster with best-ball upside. Young age makes him a dynasty gem.' },
  { rank: 4,  name: 'Ja\'Marr Chase',      pos: 'WR', age: 25, nflTeam: 'CIN', startupValue: 9000, note: 'Elite production whenever healthy. Cincy offense runs through him.' },
  { rank: 5,  name: 'Bijan Robinson',      pos: 'RB', age: 23, nflTeam: 'ATL', startupValue: 8800, note: 'Best young RB in football. Three-down back with elite receiving floor.' },
  { rank: 6,  name: 'Amon-Ra St. Brown',   pos: 'WR', age: 25, nflTeam: 'DET', startupValue: 8600, note: 'Detroit slot king. Consistent WR1 production with elite target share.' },
  { rank: 7,  name: 'Malik Nabers',        pos: 'WR', age: 22, nflTeam: 'NYG', startupValue: 8400, note: 'Instant dynasty star. Young WR1 with a growing quarterback situation.' },
  { rank: 8,  name: 'Sam LaPorta',         pos: 'TE', age: 24, nflTeam: 'DET', startupValue: 8200, note: 'Best young TE in football. Detroit targets him heavily in every situation.' },
  { rank: 9,  name: 'Jaylen Waddle',       pos: 'WR', age: 26, nflTeam: 'MIA', startupValue: 8000, note: 'Explosive slot, Tua relationship is elite. Consistent WR2 floor.' },
  { rank: 10, name: 'De\'Von Achane',       pos: 'RB', age: 23, nflTeam: 'MIA', startupValue: 7800, note: 'Fastest RB in the league. Miami bell cow with massive upside.' },
  { rank: 11, name: 'Marvin Harrison Jr.', pos: 'WR', age: 22, nflTeam: 'ARI', startupValue: 7600, note: 'Blue-chip WR prospect. Still learning but talent is undeniable.' },
  { rank: 12, name: 'Rashee Rice',         pos: 'WR', age: 24, nflTeam: 'KC',  startupValue: 7400, note: 'KC\'s new WR1. Patrick Mahomes target share is the ultimate floor.' },
  { rank: 13, name: 'Rome Odunze',         pos: 'WR', age: 22, nflTeam: 'CHI', startupValue: 7200, note: 'WR1 upside with a young QB in a developing offense. Dynasty buy.' },
  { rank: 14, name: 'Zayne Anderson',      pos: 'RB', age: 23, nflTeam: 'LAC', startupValue: 7000, note: 'LAC bell cow. Efficient, durable, receives heavily — ideal dynasty profile.' },
  { rank: 15, name: 'Jordan Love',         pos: 'QB', age: 26, nflTeam: 'GB',  startupValue: 6800, note: 'Ascending QB1. Green Bay system is QB-friendly for fantasy production.' },
  { rank: 16, name: 'Keon Coleman',        pos: 'WR', age: 22, nflTeam: 'BUF', startupValue: 6600, note: 'Buffalo WR1 with an elite QB. Red-zone monster with incredible hands.' },
  { rank: 17, name: 'Lamar Jackson',       pos: 'QB', age: 28, nflTeam: 'BAL', startupValue: 6400, note: 'Reigning MVP. SuperFlex and 1QB leagues both value him highly.' },
  { rank: 18, name: 'Tetairoa McMillan',   pos: 'WR', age: 21, nflTeam: 'CAR', startupValue: 6200, note: '2026 class WR1. Age-21 WR with generational talent — future dynasty cornerstone.' },
  { rank: 19, name: 'Travis Etienne',      pos: 'RB', age: 25, nflTeam: 'JAC', startupValue: 6000, note: 'Lead back with receiving chops. Consistent fantasy starter.' },
  { rank: 20, name: 'Tank Dell',           pos: 'WR', age: 24, nflTeam: 'HOU', startupValue: 5800, note: 'Explosive slot in a good offense. Dynasty upside if healthy.' },
  { rank: 21, name: 'Omarion Hampton',     pos: 'RB', age: 21, nflTeam: 'LAC', startupValue: 5600, note: '2026 rookie RB1. Walks into a good situation with enormous ceiling.' },
  { rank: 22, name: 'Trey McBride',        pos: 'TE', age: 25, nflTeam: 'ARI', startupValue: 5400, note: 'Workhorse TE. Arizona targets him constantly — the new TE1 of the class.' },
  { rank: 23, name: 'Emeka Egbuka',        pos: 'WR', age: 21, nflTeam: 'TB',  startupValue: 5200, note: '2026 rookie WR2. TB offense gives him immediate opportunity.' },
  { rank: 24, name: 'Jordan Addison',      pos: 'WR', age: 23, nflTeam: 'MIN', startupValue: 5000, note: 'Vikings WR2 alongside Jefferson. Upside if Jefferson misses time.' },
];

// ─── Simulated Draft Board — First 3 Rounds ───────────────────────────────────

// 12 teams, snake draft. Round 1: 1→12, Round 2: 12→1, Round 3: 1→12
const TEAM_NAMES = [
  'Team Alpha', 'Team Bravo', 'Team Charlie', 'Team Delta',
  'Team Echo',  'Team Foxtrot','Team Golf',   'Team Hotel',
  'Team India', 'Team Juliet','Team Kilo',   'Team Lima',
];

// Pre-simulated picks for first 3 rounds (36 picks)
const SIM_PICKS_DATA: Array<{ name: string; pos: Position }> = [
  // Round 1 (1→12)
  { name: 'Justin Jefferson',    pos: 'WR' },
  { name: 'CeeDee Lamb',         pos: 'WR' },
  { name: 'Bijan Robinson',      pos: 'RB' },
  { name: 'Ja\'Marr Chase',      pos: 'WR' },
  { name: 'Puka Nacua',          pos: 'WR' },
  { name: 'Amon-Ra St. Brown',   pos: 'WR' },
  { name: 'Sam LaPorta',         pos: 'TE' },
  { name: 'De\'Von Achane',      pos: 'RB' },
  { name: 'Malik Nabers',        pos: 'WR' },
  { name: 'Jaylen Waddle',       pos: 'WR' },
  { name: 'Marvin Harrison Jr.', pos: 'WR' },
  { name: 'Rashee Rice',         pos: 'WR' },
  // Round 2 (12→1)
  { name: 'Rome Odunze',         pos: 'WR' },
  { name: 'Keon Coleman',        pos: 'WR' },
  { name: 'Jordan Love',         pos: 'QB' },
  { name: 'Zayne Anderson',      pos: 'RB' },
  { name: 'Lamar Jackson',       pos: 'QB' },
  { name: 'Tank Dell',           pos: 'WR' },
  { name: 'Travis Etienne',      pos: 'RB' },
  { name: 'Trey McBride',        pos: 'TE' },
  { name: 'Jordan Addison',      pos: 'WR' },
  { name: 'Tetairoa McMillan',   pos: 'WR' },
  { name: 'Omarion Hampton',     pos: 'RB' },
  { name: 'Emeka Egbuka',        pos: 'WR' },
  // Round 3 (1→12)
  { name: 'Jaxon Smith-Njigba',  pos: 'WR' },
  { name: 'Drake London',        pos: 'WR' },
  { name: 'Tony Pollard',        pos: 'RB' },
  { name: 'Davante Adams',       pos: 'WR' },
  { name: 'Jaylen Wright',       pos: 'RB' },
  { name: 'Evan Stewart',        pos: 'WR' },
  { name: 'Tez Johnson',         pos: 'WR' },
  { name: 'Xavier Worthy',       pos: 'WR' },
  { name: 'Jonathon Brooks',     pos: 'RB' },
  { name: 'Luther Burden III',   pos: 'WR' },
  { name: 'Isaiah Davis',        pos: 'RB' },
  { name: 'Harold Fannin Jr.',   pos: 'TE' },
];

function buildSimPicks(): SimPick[] {
  const picks: SimPick[] = [];
  for (let round = 1; round <= 3; round++) {
    const isReverse = round % 2 === 0;
    for (let i = 0; i < 12; i++) {
      const pickInRound = i + 1;
      const overall = (round - 1) * 12 + pickInRound;
      const dataIdx = overall - 1;
      const teamSlot = isReverse ? 13 - pickInRound : pickInRound;
      picks.push({
        overall,
        round,
        pick: pickInRound,
        teamSlot,
        name: SIM_PICKS_DATA[dataIdx].name,
        pos: SIM_PICKS_DATA[dataIdx].pos,
      });
    }
  }
  return picks;
}

const SIM_PICKS = buildSimPicks();

// ─── Startup Strategies ───────────────────────────────────────────────────────

const STRATEGIES = [
  {
    name: 'Zero RB',
    icon: '0️⃣',
    tagline: 'Load up on WRs early, stream RBs',
    description:
      'Draft WRs in every early round, relying on the waiver wire and late-round RBs for the position. Works in PPR leagues where WR volume is easiest to predict. Risk: thin at RB if waivers are weak.',
    bestFor: 'PPR / heavy WR scoring',
    risk: 'Medium',
  },
  {
    name: 'Robust RB',
    icon: '💪',
    tagline: 'Secure 2–3 RBs in the first 4 rounds',
    description:
      'Prioritize RBs early because bell cows are scarce and injury rates are high. Fill WR later. This approach maximizes RB depth and secures rare high-volume backs while they\'re available.',
    bestFor: 'Standard / non-PPR leagues',
    risk: 'Low–Medium',
  },
  {
    name: 'Best Player Available',
    icon: '⭐',
    tagline: 'Always draft the best player on the board',
    description:
      'Ignore positional need entirely in the first several rounds. Take whoever has the highest dynasty value. Positional balance emerges naturally as the draft progresses.',
    bestFor: 'All formats',
    risk: 'Low',
  },
  {
    name: 'Positional Value',
    icon: '📊',
    tagline: 'Draft by positional scarcity windows',
    description:
      'Map out when elite players at each position disappear. QBs in SuperFlex go fast — take one early. TEs thin out by Round 3. Use the scarcity curve to time picks correctly.',
    bestFor: 'SuperFlex / TE premium',
    risk: 'Medium',
  },
  {
    name: 'Devy-First',
    icon: '🌱',
    tagline: 'Load up on young players and rookies',
    description:
      'Build your roster around 21–23 year old players with elite upside. Accept a weaker Year 1 in exchange for a dynasty window that peaks in 3–5 years. Patient approach for committed dynasty managers.',
    bestFor: 'Deep dynasty / long-term leagues',
    risk: 'High (short-term), Low (long-term)',
  },
];

// ─── Format Comparison ────────────────────────────────────────────────────────

interface FormatRow {
  feature: string;
  redraft: string;
  dynasty: string;
  startup: string;
}

const FORMAT_ROWS: FormatRow[] = [
  { feature: 'Roster reset',       redraft: 'Every year',    dynasty: 'Never',         startup: 'One-time, full' },
  { feature: 'Draft type',         redraft: 'Annual snake',  dynasty: 'Rookie only',   startup: 'Full 20-player' },
  { feature: 'Player age value',   redraft: 'Irrelevant',    dynasty: 'Crucial',       startup: 'Crucial' },
  { feature: 'Waiver strategy',    redraft: 'Core mechanic', dynasty: 'Supplemental',  startup: 'N/A (pre-draft)' },
  { feature: 'Commitment level',   redraft: 'Low',           dynasty: 'High',          startup: 'Very high' },
  { feature: 'Keeper rules',       redraft: 'Sometimes',     dynasty: 'Always',        startup: 'Always' },
  { feature: 'Roster size',        redraft: '15–17',         dynasty: '20–30',         startup: '20–30' },
  { feature: 'Transaction volume', redraft: 'High',          dynasty: 'Medium',        startup: 'Low after Year 1' },
];

// ─── Position Config ──────────────────────────────────────────────────────────

const POS_CONFIG: Record<Position, string> = {
  QB: 'bg-blue-500/15 text-blue-400 border-blue-500/40',
  RB: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
  WR: 'bg-orange-500/15 text-orange-400 border-orange-500/40',
  TE: 'bg-purple-500/15 text-purple-400 border-purple-500/40',
};

const POS_DOT: Record<Position, string> = {
  QB: 'bg-blue-500',
  RB: 'bg-emerald-500',
  WR: 'bg-orange-500',
  TE: 'bg-purple-500',
};

const MAX_STARTUP_VALUE = 9800;

// ─── Sub-components ───────────────────────────────────────────────────────────

function PosBadge({ pos }: { pos: Position }) {
  return (
    <span className={cn(
      'inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border w-9 shrink-0',
      POS_CONFIG[pos]
    )}>
      {pos}
    </span>
  );
}

function SimPickCell({ pick }: { pick: SimPick }) {
  return (
    <div className={cn(
      'rounded-lg border border-[#2d4a66] bg-[#16213e] overflow-hidden text-left'
    )}>
      <div className="px-2.5 py-1.5 flex items-center justify-between gap-1 border-b border-[#1e3347] bg-[#0f2744]">
        <span className="text-[10px] font-black tabular-nums text-[#ffd700]">
          {pick.round}.{String(pick.pick).padStart(2, '0')}
        </span>
        <span className="text-[9px] text-slate-600 truncate max-w-[52px]">
          {TEAM_NAMES[pick.teamSlot - 1].replace('Team ', 'Tm ')}
        </span>
      </div>
      <div className="px-2.5 py-2 min-h-[48px] flex flex-col justify-center">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', POS_DOT[pick.pos])} aria-hidden="true" />
          <span className="text-xs font-bold text-white leading-tight truncate">{pick.name}</span>
        </div>
        <span className={cn('text-[9px] font-bold uppercase px-1 py-0.5 rounded self-start border mt-0.5', POS_CONFIG[pick.pos])}>
          {pick.pos}
        </span>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StartupDraftPage() {
  const [activeTeam, setActiveTeam] = useState<number | null>(null);

  // Build per-team summary from sim picks
  const teamSummaries = TEAM_NAMES.map((name, i) => {
    const teamSlot = i + 1;
    const picks = SIM_PICKS.filter(p => p.teamSlot === teamSlot);
    const posCounts = picks.reduce<Record<string, number>>((acc, p) => {
      acc[p.pos] = (acc[p.pos] ?? 0) + 1;
      return acc;
    }, {});
    return { name, teamSlot, picks, posCounts };
  });

  return (
    <>
      <Head>
        <title>Startup Draft Guide — BMFFFL Analytics</title>
        <meta
          name="description"
          content="Dynasty startup draft simulator, strategy guide, and top 24 startup rankings for BMFFFL dynasty fantasy football."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Header */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            Startup Draft Guide
          </h1>
          <p className="text-slate-400 text-lg">
            Dynasty startup draft simulator, strategy guide, and top 24 startup rankings.
          </p>
        </header>

        {/* What Is a Startup Draft */}
        <section className="mb-12" aria-label="What is a startup draft">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            <h2 className="text-lg font-black text-white">What Is a Startup Draft?</h2>
            <div className="flex-1 h-px bg-[#2d4a66]" aria-hidden="true" />
          </div>
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5 sm:p-6">
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              In a <strong className="text-white">startup draft</strong>, every player in the NFL is available — no existing rosters, no keepers. Every manager builds their full dynasty roster from scratch. This happens once: when the league is created.
            </p>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              A typical dynasty startup draft is <strong className="text-white">15–20 rounds</strong> with rosters of 20–30 players. Once it concludes, managers keep their players year-over-year, adding rookies through annual rookie drafts and acquiring talent via trades and free agency.
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              The startup draft is the <strong className="text-white">most important event in dynasty</strong> — it defines your roster for years. A strong startup class can set you up for a championship window; a poor one can require years of rebuilding.
            </p>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: '📋', label: '15–20 Rounds', desc: 'Full roster drafted from scratch' },
                { icon: '🔒', label: 'Keep Forever', desc: 'Players stay on your team until traded or cut' },
                { icon: '🌱', label: 'Rookies Added Yearly', desc: 'Annual rookie draft adds new players' },
              ].map(({ icon, label, desc }) => (
                <div key={label} className="rounded-lg border border-[#2d4a66] bg-[#0d1b2a] px-4 py-3 text-center">
                  <div className="text-2xl mb-1">{icon}</div>
                  <p className="text-sm font-bold text-white">{label}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sample Startup Draft — First 3 Rounds */}
        <section className="mb-12" aria-label="Simulated startup draft board">
          <div className="flex items-center gap-3 mb-4">
            <BarChart2 className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            <h2 className="text-lg font-black text-white">Sample Startup Draft — First 3 Rounds</h2>
            <div className="flex-1 h-px bg-[#2d4a66]" aria-hidden="true" />
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Simulated 15-round, 12-team startup draft. Showing rounds 1–3 (36 of 180 picks). Snake format.
          </p>

          {/* Draft board by round */}
          <div className="space-y-6">
            {[1, 2, 3].map((round) => {
              const roundPicks = SIM_PICKS.filter(p => p.round === round);
              const isSnakeBack = round % 2 === 0;
              return (
                <section key={round}>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-sm font-bold text-white">Round {round}</h3>
                    <span className="text-xs text-slate-500">
                      {isSnakeBack ? 'Snake — picks 12→1' : 'Picks 1→12'}
                    </span>
                    <span className="ml-auto text-xs text-slate-600 tabular-nums">
                      {roundPicks.length}/12 picks
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-12 gap-2">
                    {roundPicks.map((pick) => (
                      <SimPickCell key={pick.overall} pick={pick} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Team summary toggle */}
          <div className="mt-6">
            <h3 className="text-sm font-bold text-white mb-3">
              Team Summaries — 3-Round Class
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {teamSummaries.map(({ name, teamSlot, picks, posCounts }) => (
                <div
                  key={teamSlot}
                  className="rounded-lg border border-[#2d4a66] bg-[#16213e] overflow-hidden"
                >
                  <button
                    onClick={() => setActiveTeam(activeTeam === teamSlot ? null : teamSlot)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#1f3550] transition-colors text-left"
                    aria-expanded={activeTeam === teamSlot}
                  >
                    <span className="font-semibold text-sm text-white flex-1">{name}</span>
                    <div className="flex gap-1 flex-wrap">
                      {Object.entries(posCounts).map(([pos, count]) => (
                        <span
                          key={pos}
                          className={cn('px-1.5 py-0.5 rounded text-[10px] font-bold border', POS_CONFIG[pos as Position])}
                        >
                          {count}{pos}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-slate-600 tabular-nums shrink-0">
                      {activeTeam === teamSlot ? '▲' : '▼'}
                    </span>
                  </button>
                  {activeTeam === teamSlot && picks.length > 0 && (
                    <div className="border-t border-[#1e3347] divide-y divide-[#1e3347]">
                      {picks.map(p => (
                        <div key={p.overall} className="px-4 py-2 flex items-center gap-3">
                          <span className="text-[10px] font-mono text-slate-600 tabular-nums w-10 shrink-0">
                            {p.round}.{String(p.pick).padStart(2, '0')}
                          </span>
                          <PosBadge pos={p.pos} />
                          <span className="text-sm text-slate-300 flex-1">{p.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Startup Strategy Guide */}
        <section className="mb-12" aria-label="Startup draft strategy guide">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            <h2 className="text-lg font-black text-white">Startup Strategy Guide</h2>
            <div className="flex-1 h-px bg-[#2d4a66]" aria-hidden="true" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {STRATEGIES.map(({ name, tagline, description, bestFor, risk }) => (
              <div
                key={name}
                className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-5"
              >
                <h3 className="text-base font-black text-white mb-1">{name}</h3>
                <p className="text-xs text-[#ffd700] font-semibold mb-3">{tagline}</p>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">{description}</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold w-16 shrink-0">Best For</span>
                    <span className="text-xs text-slate-300 font-medium">{bestFor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold w-16 shrink-0">Risk</span>
                    <span className={cn(
                      'text-xs font-semibold',
                      risk.startsWith('High') ? 'text-[#e94560]'
                        : risk.startsWith('Low') ? 'text-emerald-400'
                        : 'text-amber-400'
                    )}>
                      {risk}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Format Comparison */}
        <section className="mb-12" aria-label="Startup vs Redraft vs Dynasty comparison">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            <h2 className="text-lg font-black text-white">Startup vs Redraft vs Dynasty</h2>
            <div className="flex-1 h-px bg-[#2d4a66]" aria-hidden="true" />
          </div>
          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm" aria-label="Format comparison">
                <thead>
                  <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 w-36">Feature</th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">Redraft</th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-blue-400">Dynasty</th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[#ffd700]">Startup</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3347]">
                  {FORMAT_ROWS.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={cn(
                        'transition-colors hover:bg-[#1f3550]',
                        i % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                      )}
                    >
                      <td className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                        {row.feature}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-300 text-center">{row.redraft}</td>
                      <td className="px-4 py-3 text-sm text-slate-300 text-center">{row.dynasty}</td>
                      <td className="px-4 py-3 text-sm text-white font-semibold text-center">{row.startup}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Bimfle's Startup Rankings — Top 24 */}
        <section aria-label="Bimfle's startup rankings — top 24">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-black text-white">Bimfle&apos;s Startup Rankings — Top 24</h2>
            <div className="flex-1 h-px bg-[#2d4a66]" aria-hidden="true" />
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Overall startup draft value on a 0–10,000 scale. Reflects age, talent, opportunity, and dynasty longevity.
          </p>
          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm" aria-label="Startup rankings top 24">
                <thead>
                  <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-12">Rank</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">Player</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-14">Pos</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-10 hidden sm:table-cell">Age</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-14 hidden sm:table-cell">NFL</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-40">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3347]">
                  {STARTUP_RANKINGS.map((p, idx) => {
                    const pct = Math.round((p.startupValue / MAX_STARTUP_VALUE) * 100);
                    const barColor = p.rank <= 5 ? '#ffd700' : p.rank <= 12 ? '#60a5fa' : p.rank <= 18 ? '#34d399' : '#94a3b8';
                    return (
                      <tr
                        key={p.rank}
                        className={cn(
                          'transition-colors hover:bg-[#1f3550]',
                          idx % 2 === 0 ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                        )}
                      >
                        <td className="px-4 py-3">
                          <span className="text-xs font-mono font-bold text-slate-400 tabular-nums">#{p.rank}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-white text-sm block">{p.name}</span>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug max-w-xs">{p.note}</p>
                        </td>
                        <td className="px-4 py-3">
                          <PosBadge pos={p.pos} />
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="text-xs font-mono text-slate-400 tabular-nums">{p.age}</span>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="text-xs font-mono font-semibold text-slate-300">{p.nflTeam}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 min-w-[100px]">
                            <div className="flex-1 h-1.5 rounded-full bg-[#1a2d42] overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{ width: `${pct}%`, backgroundColor: barColor }}
                                aria-hidden="true"
                              />
                            </div>
                            <span className="text-xs font-mono font-bold tabular-nums text-slate-200 w-12 text-right">
                              {p.startupValue.toLocaleString()}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Bimfle Advisory */}
        <aside
          className="mt-10 rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/5 px-6 py-5"
          aria-label="Bimfle's Startup Advisory"
        >
          <p className="text-xs text-[#ffd700] uppercase tracking-widest font-bold mb-2">
            Bimfle&apos;s Startup Advisory
          </p>
          <p className="text-slate-300 text-sm leading-relaxed italic">
            "A startup draft is the single most consequential event in dynasty fantasy football. I would advise approaching it with the gravity it deserves. Take Justin Jefferson first overall. Do not overthink it."
          </p>
          <p className="text-[#ffd700] text-xs font-semibold mt-2">~Love, Bimfle.</p>
        </aside>

        {/* Footer disclaimer */}
        <div className="mt-6 text-xs text-slate-600 leading-relaxed">
          <p>
            Rankings and startup values are estimates as of Spring 2026 and are not affiliated with any official dynasty platform.
            Player values are on a 0–10,000 scale reflecting projected dynasty impact. Simulated draft results are illustrative only.
          </p>
        </div>

      </div>
    </>
  );
}
