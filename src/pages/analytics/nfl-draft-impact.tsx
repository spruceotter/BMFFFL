import { useState, useMemo } from 'react';
import Head from 'next/head';
import { Zap, Star } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type Position = 'QB' | 'RB' | 'WR' | 'TE';
type ImpactRating = 'HIGH' | 'MEDIUM' | 'LOW';
type Category = 'Instant Starter' | 'Wait and See';
type PosFilter = 'ALL' | Position;

interface DraftPick {
  pick: number;
  round: number;
  name: string;
  pos: Position;
  nflTeam: string;
  college: string;
  impactRating: ImpactRating;
  category: Category;
  dynastyNote: string;
  affectedManagers: string[];
}

// ─── 2026 NFL Draft Picks ─────────────────────────────────────────────────────

const DRAFT_PICKS: DraftPick[] = [
  {
    pick: 1,
    round: 1,
    name: 'Tetairoa McMillan',
    pos: 'WR',
    nflTeam: 'CAR',
    college: 'Arizona',
    impactRating: 'HIGH',
    category: 'Instant Starter',
    dynastyNote:
      'WR1 from day one in Carolina. Dave Canales offense is WR-friendly. Bryce Young gains a true #1 target — dynasty managers who own McMillan should be ecstatic.',
    affectedManagers: ['eldridm20', 'mconlon88'],
  },
  {
    pick: 2,
    round: 1,
    name: 'Omarion Hampton',
    pos: 'RB',
    nflTeam: 'LAC',
    college: 'UNC',
    impactRating: 'HIGH',
    category: 'Instant Starter',
    dynastyNote:
      'Chargers hand the backfield to Hampton immediately. Jim Harbaugh loves running the ball. Dynasty managers who rostered him early get a massive win.',
    affectedManagers: ['Nickmurray', 'pmcgrat2'],
  },
  {
    pick: 3,
    round: 1,
    name: 'Emeka Egbuka',
    pos: 'WR',
    nflTeam: 'TB',
    college: 'Ohio State',
    impactRating: 'HIGH',
    category: 'Instant Starter',
    dynastyNote:
      'Baker Mayfield and Egbuka in Tampa is a lethal combination. Slot WR role with volume upside. Buccaneers offense will feed him targets.',
    affectedManagers: ['kcmullen2', 'BrennanH'],
  },
  {
    pick: 4,
    round: 1,
    name: 'Quinshon Judkins',
    pos: 'RB',
    nflTeam: 'CLE',
    college: 'Ohio State',
    impactRating: 'MEDIUM',
    category: 'Wait and See',
    dynastyNote:
      'Cleveland backfield has competition. Judkins talent is unquestioned but will need to beat out Nick Chubb for touches. Monitor camp battles closely.',
    affectedManagers: ['pmcgrat2', 'eldridm20'],
  },
  {
    pick: 5,
    round: 1,
    name: 'Luther Burden III',
    pos: 'WR',
    nflTeam: 'CHI',
    college: 'Missouri',
    impactRating: 'HIGH',
    category: 'Instant Starter',
    dynastyNote:
      'Bears offense needs weapons desperately. Burden gives Caleb Williams a reliable slot target. Dynasty value shoots up immediately — volume WR upside in a pass-heavy offense.',
    affectedManagers: ['BrennanH', 'kcmullen2'],
  },
  {
    pick: 6,
    round: 1,
    name: 'Colston Loveland',
    pos: 'TE',
    nflTeam: 'NYG',
    college: 'Michigan',
    impactRating: 'HIGH',
    category: 'Instant Starter',
    dynastyNote:
      'Giants desperately needed a TE. Loveland gets immediate volume as Daniel Jones or whoever starts their rebuild. TE1 potential by season 2. Buy if available.',
    affectedManagers: ['Nickmurray', 'mconlon88'],
  },
  {
    pick: 7,
    round: 1,
    name: 'Ashton Jeanty',
    pos: 'RB',
    nflTeam: 'NO',
    college: 'Boise State',
    impactRating: 'HIGH',
    category: 'Instant Starter',
    dynastyNote:
      'Saints get the best RB in the class. Immediate workhorse role. Chris Olave and Jeanty form a dangerous offensive duo. Dynasty managers with Jeanty just got a massive landing spot.',
    affectedManagers: ['eldridm20', 'pmcgrat2'],
  },
  {
    pick: 15,
    round: 1,
    name: 'Tyler Warren',
    pos: 'TE',
    nflTeam: 'IND',
    college: 'Penn State',
    impactRating: 'MEDIUM',
    category: 'Instant Starter',
    dynastyNote:
      'Colts finally have their TE1. Anthony Richardson — Warren connection has starter upside. Volume will depend on how quickly the offense develops. Year 2 target.',
    affectedManagers: ['kcmullen2', 'BrennanH'],
  },
  {
    pick: 22,
    round: 1,
    name: 'Kyle Williams',
    pos: 'WR',
    nflTeam: 'MIN',
    college: 'Washington State',
    impactRating: 'MEDIUM',
    category: 'Wait and See',
    dynastyNote:
      'Vikings WR depth chart is crowded with Justin Jefferson at the top. Williams projects as WR2 in year 1 with WR1 upside if Jefferson ever moves on. Hold but temper expectations.',
    affectedManagers: ['Nickmurray', 'mconlon88'],
  },
  {
    pick: 38,
    round: 2,
    name: 'Kaleb Johnson',
    pos: 'RB',
    nflTeam: 'PIT',
    college: 'Iowa',
    impactRating: 'LOW',
    category: 'Wait and See',
    dynastyNote:
      'Pittsburgh RB room is crowded. Johnson adds depth but faces a tough path to immediate touches. Late-round dynasty flier with upside if he outlasts competition.',
    affectedManagers: ['pmcgrat2'],
  },
];

// ─── Roster Disruptions ───────────────────────────────────────────────────────

interface RosterDisruption {
  player: string;
  pos: Position;
  nflTeam: string;
  situation: string;
  dynastyImpact: 'NEGATIVE' | 'POSITIVE' | 'NEUTRAL';
}

const DISRUPTIONS: RosterDisruption[] = [
  {
    player: 'Nick Chubb',
    pos: 'RB',
    nflTeam: 'CLE',
    situation: 'Judkins (pick 4) drafted directly behind him. Touches will split. Chubb dynasty value craters unless trade rumors emerge.',
    dynastyImpact: 'NEGATIVE',
  },
  {
    player: 'Bryce Young',
    pos: 'QB',
    nflTeam: 'CAR',
    situation: 'Gains elite WR1 in McMillan. Young dynasty value ticks up — finally has a weapon to work with.',
    dynastyImpact: 'POSITIVE',
  },
  {
    player: 'DJ Moore',
    pos: 'WR',
    nflTeam: 'CHI',
    situation: 'Burden drafted into Chicago. Moore drops to WR2 role. Target share dilution is real.',
    dynastyImpact: 'NEGATIVE',
  },
  {
    player: 'Caleb Williams',
    pos: 'QB',
    nflTeam: 'CHI',
    situation: 'Luther Burden joins the offense. Williams dynasty value increases significantly — weapons matter.',
    dynastyImpact: 'POSITIVE',
  },
  {
    player: 'Justin Jefferson',
    pos: 'WR',
    nflTeam: 'MIN',
    situation: 'Kyle Williams drafted as eventual successor. No immediate impact — Jefferson remains WR1.',
    dynastyImpact: 'NEUTRAL',
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const IMPACT_CONFIG: Record<ImpactRating, { label: string; style: string; dot: string }> = {
  HIGH:   { label: 'HIGH',   style: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',   dot: 'bg-emerald-400' },
  MEDIUM: { label: 'MEDIUM', style: 'bg-[#ffd700]/15 text-[#ffd700] border-[#ffd700]/40',         dot: 'bg-[#ffd700]' },
  LOW:    { label: 'LOW',    style: 'bg-slate-500/15 text-slate-400 border-slate-500/40',          dot: 'bg-slate-400' },
};

const CATEGORY_CONFIG: Record<Category, { style: string }> = {
  'Instant Starter': { style: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40' },
  'Wait and See':    { style: 'bg-orange-500/15 text-orange-400 border-orange-500/40' },
};

const POS_CONFIG: Record<Position, string> = {
  QB: 'bg-blue-500/15 text-blue-400 border-blue-500/40',
  RB: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
  WR: 'bg-orange-500/15 text-orange-400 border-orange-500/40',
  TE: 'bg-purple-500/15 text-purple-400 border-purple-500/40',
};

const DISRUPTION_CONFIG: Record<RosterDisruption['dynastyImpact'], { label: string; style: string }> = {
  POSITIVE: { label: 'Positive', style: 'text-emerald-400' },
  NEGATIVE: { label: 'Negative', style: 'text-[#e94560]' },
  NEUTRAL:  { label: 'Neutral',  style: 'text-slate-400' },
};

const POS_FILTER_OPTIONS: PosFilter[] = ['ALL', 'QB', 'RB', 'WR', 'TE'];

// ─── Sub-components ───────────────────────────────────────────────────────────

function PosBadge({ pos }: { pos: Position }) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border w-9',
        POS_CONFIG[pos]
      )}
    >
      {pos}
    </span>
  );
}

function ImpactBadge({ rating }: { rating: ImpactRating }) {
  const cfg = IMPACT_CONFIG[rating];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap',
        cfg.style
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} aria-hidden="true" />
      {cfg.label}
    </span>
  );
}

function CategoryBadge({ category }: { category: Category }) {
  const cfg = CATEGORY_CONFIG[category];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap',
        cfg.style
      )}
    >
      {category}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NflDraftImpactPage() {
  const [posFilter, setPosFilter] = useState<PosFilter>('ALL');
  const [activeCategory, setActiveCategory] = useState<'ALL' | Category>('ALL');

  const filteredPicks = useMemo(() => {
    return DRAFT_PICKS.filter((p) => {
      const posMatch = posFilter === 'ALL' || p.pos === posFilter;
      const catMatch = activeCategory === 'ALL' || p.category === activeCategory;
      return posMatch && catMatch;
    });
  }, [posFilter, activeCategory]);

  const instantStarters = DRAFT_PICKS.filter((p) => p.category === 'Instant Starter').length;
  const waitAndSee = DRAFT_PICKS.filter((p) => p.category === 'Wait and See').length;
  const highImpact = DRAFT_PICKS.filter((p) => p.impactRating === 'HIGH').length;

  return (
    <>
      <Head>
        <title>2026 NFL Draft Impact — Dynasty Ripple Effects — BMFFFL Analytics</title>
        <meta
          name="description"
          content="How the 2026 NFL Draft impacts dynasty rosters. Top picks, landing spots, roster disruptions, and which BMFFFL managers benefit."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Hero */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <Zap className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-3">
            2026 NFL Draft Impact
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Dynasty ripple effects from the 2026 NFL Draft &mdash; landing spots, roster disruptions,
            and who benefits in BMFFFL.
          </p>
        </header>

        {/* Summary stats */}
        <section className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3" aria-label="Draft impact summary">
          {[
            { label: 'Picks Tracked', value: DRAFT_PICKS.length, color: '#ffd700' },
            { label: 'High Impact',   value: highImpact,          color: '#34d399' },
            { label: 'Instant Starters', value: instantStarters,  color: '#60a5fa' },
            { label: 'Wait and See',  value: waitAndSee,          color: '#fb923c' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-[#2d4a66] bg-[#16213e] px-4 py-3 text-center"
            >
              <p className="text-2xl font-black tabular-nums" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider mt-0.5 leading-snug">
                {stat.label}
              </p>
            </div>
          ))}
        </section>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Position filter */}
          <section aria-label="Filter by position">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Position</p>
            <div role="group" aria-label="Position filter" className="flex flex-wrap gap-1.5">
              {POS_FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setPosFilter(opt)}
                  aria-pressed={posFilter === opt}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border',
                    posFilter === opt
                      ? 'bg-[#ffd700] text-[#0d1b2a] border-[#ffd700]'
                      : 'bg-[#16213e] text-slate-400 border-[#2d4a66] hover:border-[#ffd700]/40 hover:text-white'
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </section>

          {/* Category filter */}
          <section aria-label="Filter by category">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Category</p>
            <div role="group" aria-label="Category filter" className="flex flex-wrap gap-1.5">
              {(['ALL', 'Instant Starter', 'Wait and See'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setActiveCategory(opt)}
                  aria-pressed={activeCategory === opt}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border',
                    activeCategory === opt
                      ? 'bg-[#ffd700] text-[#0d1b2a] border-[#ffd700]'
                      : 'bg-[#16213e] text-slate-400 border-[#2d4a66] hover:border-[#ffd700]/40 hover:text-white'
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Results count */}
        <p className="mb-4 text-xs text-slate-500">
          Showing {filteredPicks.length} pick{filteredPicks.length !== 1 ? 's' : ''}
          {posFilter !== 'ALL' ? ` · ${posFilter}` : ''}
          {activeCategory !== 'ALL' ? ` · ${activeCategory}` : ''}
        </p>

        {/* Top Dynasty-Impacting Picks */}
        <section className="mb-10" aria-label="Top dynasty-impacting picks">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-black text-white">Top Dynasty-Impacting Picks</h2>
            <div className="flex-1 h-px bg-[#2d4a66]" aria-hidden="true" />
          </div>

          {filteredPicks.length === 0 ? (
            <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-6 py-10 text-center">
              <p className="text-slate-500 text-sm">No picks match the current filters.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm" aria-label="2026 NFL Draft dynasty impact picks">
                  <thead>
                    <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
                      <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-16">
                        Pick
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">
                        Player
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-16">
                        Pos
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider hidden sm:table-cell w-16">
                        Team
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-24">
                        Impact
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-36 hidden md:table-cell">
                        Category
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e3347]">
                    {filteredPicks.map((pick, idx) => {
                      const isEven = idx % 2 === 0;
                      return (
                        <tr
                          key={pick.pick}
                          className={cn(
                            'transition-colors duration-100 hover:bg-[#1f3550]',
                            isEven ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                          )}
                        >
                          {/* Pick */}
                          <td className="px-4 py-3">
                            <div>
                              <span className="text-xs font-mono font-black text-[#ffd700] tabular-nums">
                                #{pick.pick}
                              </span>
                              <p className="text-[10px] text-slate-600 font-mono">Rd {pick.round}</p>
                            </div>
                          </td>

                          {/* Player */}
                          <td className="px-4 py-3">
                            <span className="font-bold text-white text-sm block">{pick.name}</span>
                            <p className="text-[11px] text-slate-500 mt-0.5">{pick.college}</p>
                            <p className="text-[11px] text-slate-400 mt-1 leading-snug max-w-xs">{pick.dynastyNote}</p>
                            {pick.affectedManagers.length > 0 && (
                              <p className="text-[10px] text-slate-600 mt-1">
                                Affected:{' '}
                                {pick.affectedManagers.map((m, i) => (
                                  <span key={m}>
                                    <span className="text-[#ffd700]/70">{m}</span>
                                    {i < pick.affectedManagers.length - 1 ? ', ' : ''}
                                  </span>
                                ))}
                              </p>
                            )}
                          </td>

                          {/* Pos */}
                          <td className="px-4 py-3">
                            <PosBadge pos={pick.pos} />
                          </td>

                          {/* Team */}
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <span className="text-xs font-mono font-bold text-slate-300 bg-[#0f2744] px-2 py-1 rounded border border-[#2d4a66]">
                              {pick.nflTeam}
                            </span>
                          </td>

                          {/* Impact */}
                          <td className="px-4 py-3">
                            <ImpactBadge rating={pick.impactRating} />
                          </td>

                          {/* Category */}
                          <td className="px-4 py-3 hidden md:table-cell">
                            <CategoryBadge category={pick.category} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* Instant Starters vs Wait and See */}
        <section className="mb-10" aria-label="Instant Starters vs Wait and See">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-black text-white">Instant Starters vs Wait and See</h2>
            <div className="flex-1 h-px bg-[#2d4a66]" aria-hidden="true" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Instant Starters */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-5 py-4">
              <h3 className="text-sm font-black text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Star className="w-3.5 h-3.5" aria-hidden="true" />
                Instant Starters
              </h3>
              <ul className="space-y-2">
                {DRAFT_PICKS.filter((p) => p.category === 'Instant Starter').map((pick) => (
                  <li key={pick.pick} className="flex items-start gap-2">
                    <span className="text-xs font-mono text-[#ffd700] font-bold mt-0.5 shrink-0">
                      #{pick.pick}
                    </span>
                    <div>
                      <span className="text-sm font-bold text-white">{pick.name}</span>
                      <span className="text-xs text-slate-500 font-mono ml-2">{pick.nflTeam}</span>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {pick.pos} — Start in dynasty lineups from week 1.
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Wait and See */}
            <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 px-5 py-4">
              <h3 className="text-sm font-black text-orange-400 uppercase tracking-wider mb-3">
                Wait and See
              </h3>
              <ul className="space-y-2">
                {DRAFT_PICKS.filter((p) => p.category === 'Wait and See').map((pick) => (
                  <li key={pick.pick} className="flex items-start gap-2">
                    <span className="text-xs font-mono text-[#ffd700] font-bold mt-0.5 shrink-0">
                      #{pick.pick}
                    </span>
                    <div>
                      <span className="text-sm font-bold text-white">{pick.name}</span>
                      <span className="text-xs text-slate-500 font-mono ml-2">{pick.nflTeam}</span>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {pick.pos} — Monitor training camp before starting.
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Roster Disruptions */}
        <section className="mb-10" aria-label="Roster disruptions">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-black text-white">Roster Disruptions</h2>
            <div className="flex-1 h-px bg-[#2d4a66]" aria-hidden="true" />
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Existing dynasty players whose value shifts due to draft additions.
          </p>
          <div className="space-y-3">
            {DISRUPTIONS.map((d) => {
              const cfg = DISRUPTION_CONFIG[d.dynastyImpact];
              return (
                <div
                  key={`${d.player}-${d.nflTeam}`}
                  className="rounded-lg border border-[#2d4a66] bg-[#16213e] px-5 py-4 flex flex-col sm:flex-row sm:items-start gap-3"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <PosBadge pos={d.pos} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-sm">{d.player}</span>
                        <span className="text-xs font-mono text-slate-500">{d.nflTeam}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug">{d.situation}</p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className={cn('text-xs font-bold uppercase tracking-wider', cfg.style)}>
                      {cfg.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Who Benefits */}
        <section className="mb-10" aria-label="Who benefits — dynasty managers">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-black text-white">Who Benefits — Dynasty Managers</h2>
            <div className="flex-1 h-px bg-[#2d4a66]" aria-hidden="true" />
          </div>
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              {[
                {
                  manager: 'eldridm20',
                  picks: ['McMillan (CAR #1)', 'Hampton (LAC #2)', 'Jeanty (NO #7)'],
                  verdict: 'Biggest winner of the draft. Three high-impact picks land in great situations.',
                },
                {
                  manager: 'mconlon88',
                  picks: ['McMillan (CAR #1)', 'Loveland (NYG #6)'],
                  verdict: 'WR1 and TE1 potential both land in immediately starter-friendly roles.',
                },
                {
                  manager: 'kcmullen2',
                  picks: ['Egbuka (TB #3)', 'Warren (IND #15)'],
                  verdict: 'Slot WR and TE both see day-1 target volume. Solid floor picks.',
                },
                {
                  manager: 'BrennanH',
                  picks: ['Egbuka (TB #3)', 'Burden (CHI #5)'],
                  verdict: 'Dual WR week-1 starters. Chicago and Tampa both pass-heavy offenses.',
                },
                {
                  manager: 'Nickmurray',
                  picks: ['Hampton (LAC #2)', 'Loveland (NYG #6)'],
                  verdict: 'RB and TE both in immediate starter roles. Excellent dynasty outlook.',
                },
                {
                  manager: 'pmcgrat2',
                  picks: ['Hampton (LAC #2)', 'Judkins (CLE #4)', 'Jeanty (NO #7)'],
                  verdict: 'Judkins is the risk — Cleveland backfield uncertain. The other two are locks.',
                },
              ].map((row) => (
                <div key={row.manager} className="rounded-lg bg-[#0f2744] border border-[#2d4a66] px-4 py-3">
                  <p className="font-black text-[#ffd700] text-sm mb-1">{row.manager}</p>
                  <ul className="space-y-0.5 mb-2">
                    {row.picks.map((pick) => (
                      <li key={pick} className="text-[11px] text-slate-300">
                        <span className="text-slate-500">→</span> {pick}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-slate-400 italic leading-snug">{row.verdict}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bimfle Advisory */}
        <aside
          className="rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/5 px-6 py-5"
          aria-label="Bimfle's Draft Advisory"
        >
          <p className="text-xs text-[#ffd700] uppercase tracking-widest font-bold mb-2">
            Bimfle&apos;s Draft Advisory
          </p>
          <p className="text-slate-300 text-sm leading-relaxed italic">
            &ldquo;Landing spots matter. Scheme matters. Opportunity matters. Tetairoa McMillan to Carolina is
            among the finest dynasty landing spots in recent memory. The rest of you, please do not simply
            assume that being drafted in the first round guarantees points. It does not. Ask Nick Chubb.&rdquo;
          </p>
          <p className="text-[#ffd700] text-xs font-semibold mt-2">~Love, Bimfle.</p>
        </aside>

        {/* Footer disclaimer */}
        <div className="mt-6 text-xs text-slate-600 leading-relaxed">
          <p>
            Draft pick projections are based on pre-draft consensus and early 2026 NFL Draft mock data.
            Actual draft order, team needs, and trade-ups may alter these projections. Dynasty impact
            ratings reflect estimated fantasy value in standard dynasty scoring formats as of March 2026.
          </p>
        </div>

      </div>
    </>
  );
}
