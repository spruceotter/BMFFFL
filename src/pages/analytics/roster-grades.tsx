import { useState, useMemo } from 'react';
import Head from 'next/head';
import { Trophy, BarChart2, TrendingUp, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type LetterGrade =
  | 'A+'
  | 'A'
  | 'A-'
  | 'B+'
  | 'B'
  | 'B-'
  | 'C+'
  | 'C'
  | 'C-'
  | 'D+'
  | 'D'
  | 'D-'
  | 'F';

type SortKey = 'grade' | 'name' | 'ceiling';

interface RosterGrade {
  manager: string;
  overall: LetterGrade;
  starterQuality: LetterGrade;
  depth: LetterGrade;
  age: LetterGrade;
  balance: LetterGrade;
  dynastyCeiling: LetterGrade;
  starterNote: string;
  depthNote: string;
  ageNote: string;
  balanceNote: string;
  ceilingNote: string;
  bimfleQuote: string;
  championships: number[];
}

// ─── Grade Utilities ──────────────────────────────────────────────────────────

const GRADE_ORDER: LetterGrade[] = [
  'A+', 'A', 'A-',
  'B+', 'B', 'B-',
  'C+', 'C', 'C-',
  'D+', 'D', 'D-',
  'F',
];

function gradeRank(grade: LetterGrade): number {
  return GRADE_ORDER.indexOf(grade);
}

function gradeColor(grade: LetterGrade): string {
  const g = grade[0];
  if (g === 'A') return 'text-emerald-400';
  if (g === 'B') return 'text-blue-400';
  if (g === 'C') return 'text-[#ffd700]';
  if (g === 'D') return 'text-orange-400';
  return 'text-red-400';
}

function gradeBg(grade: LetterGrade): string {
  const g = grade[0];
  if (g === 'A') return 'bg-emerald-500/15 border-emerald-500/40';
  if (g === 'B') return 'bg-blue-500/15 border-blue-500/40';
  if (g === 'C') return 'bg-[#ffd700]/15 border-[#ffd700]/40';
  if (g === 'D') return 'bg-orange-500/15 border-orange-500/40';
  return 'bg-red-500/15 border-red-500/40';
}

function gradeTierLabel(grade: LetterGrade): string {
  const g = grade[0];
  if (g === 'A') return 'Elite';
  if (g === 'B') return 'Contender';
  if (g === 'C') return 'Rebuilding';
  if (g === 'D') return 'Overhaul';
  return 'Rebuild';
}

// ─── Roster Data ──────────────────────────────────────────────────────────────

const ROSTER_GRADES: RosterGrade[] = [
  {
    manager: 'MLSchools12',
    overall: 'A',
    starterQuality: 'A+',
    depth: 'A-',
    age: 'B+',
    balance: 'A',
    dynastyCeiling: 'A',
    starterNote: 'Lamar Jackson, elite WR corps',
    depthNote: 'Strong backups across positions',
    ageNote: 'Core at ages 26–29, some aging',
    balanceNote: 'Strong at QB/WR, adequate everywhere',
    ceilingNote: 'Proven dynasty machine',
    bimfleQuote:
      'The benchmark. Every other construction is implicitly compared to this one.',
    championships: [2021, 2024],
  },
  {
    manager: 'Tubes94',
    overall: 'A-',
    starterQuality: 'A',
    depth: 'B+',
    age: 'A',
    balance: 'A-',
    dynastyCeiling: 'A+',
    starterNote: 'Breece Hall elite, strong WR/TE',
    depthNote: 'Solid throughout',
    ageNote: 'Very young core, ascending',
    balanceNote: 'Slight QB question mark',
    ceilingNote: 'Highest ceiling in the non-champion tier',
    bimfleQuote:
      'The dynasty with the highest ceiling of the non-champions. The next era may belong to Tubes94.',
    championships: [],
  },
  {
    manager: 'SexMachineAndyD',
    overall: 'B+',
    starterQuality: 'A-',
    depth: 'B',
    age: 'B+',
    balance: 'B+',
    dynastyCeiling: 'A-',
    starterNote: 'Elite WR group, adequate RBs',
    depthNote: 'Thin at TE',
    ageNote: 'Core in prime',
    balanceNote: 'WR-heavy construction',
    ceilingNote: 'One position upgrade from elite',
    bimfleQuote:
      'Consistently strong. The roster that should have a ring. One position away from true elite status.',
    championships: [],
  },
  {
    manager: 'JuicyBussy',
    overall: 'B+',
    starterQuality: 'A-',
    depth: 'B',
    age: 'B+',
    balance: 'B',
    dynastyCeiling: 'A',
    starterNote: 'Bijan Robinson elite, explosive WRs',
    depthNote: 'Thin at TE, needs depth RB',
    ageNote: 'Explosive players, some volatility risk',
    balanceNote: 'RB/WR strength, TE weakness',
    ceilingNote: 'Elite if healthy',
    bimfleQuote:
      'The most explosive offense in construction. The TE situation is your Commissioner\'s primary concern.',
    championships: [2023],
  },
  {
    manager: 'tdtd19844',
    overall: 'B+',
    starterQuality: 'B+',
    depth: 'A-',
    age: 'A',
    balance: 'B+',
    dynastyCeiling: 'A',
    starterNote: "Reigning champion's core",
    depthNote: 'Deep roster from rebuild picks',
    ageNote: 'Youngest core in top tier',
    balanceNote: 'QB needs upgrade',
    ceilingNote: 'Dynasty beginning',
    bimfleQuote:
      'The reigning champion with the youngest core. The rebuild is complete. The dynasty begins now.',
    championships: [2025],
  },
  {
    manager: 'rbr',
    overall: 'B',
    starterQuality: 'B+',
    depth: 'B+',
    age: 'C+',
    balance: 'A-',
    dynastyCeiling: 'B+',
    starterNote: 'Solid QB/WR, adequate RB',
    depthNote: 'Best depth management in the league',
    ageNote: 'Core aging into 28–30',
    balanceNote: 'Most balanced construction',
    ceilingNote: 'Aging limits ceiling',
    bimfleQuote:
      'The best-managed roster that hasn\'t won. The aging core is the ticking clock.',
    championships: [],
  },
  {
    manager: 'Cmaleski',
    overall: 'B-',
    starterQuality: 'B',
    depth: 'B-',
    age: 'B',
    balance: 'C+',
    dynastyCeiling: 'B+',
    starterNote: 'Elite WR group, weak at other positions',
    depthNote: 'Thin at RB, TE',
    ageNote: 'Young WR corps is the asset',
    balanceNote: 'Extreme WR concentration',
    ceilingNote: 'WR-dominated ceilings',
    bimfleQuote:
      'The WR room is the envy of several managers. Everything else requires urgent attention.',
    championships: [],
  },
  {
    manager: 'eldridm20',
    overall: 'C+',
    starterQuality: 'B-',
    depth: 'B-',
    age: 'B-',
    balance: 'B-',
    dynastyCeiling: 'B-',
    starterNote: 'Solid TE, inconsistent elsewhere',
    depthNote: 'Adequate',
    ageNote: 'Mixed age profile',
    balanceNote: 'TE-heavy lean',
    ceilingNote: 'Playoff danger lurks',
    bimfleQuote:
      'Dangerous in elimination scenarios. The construction is adequate if unspectacular.',
    championships: [],
  },
  {
    manager: 'eldridsm',
    overall: 'C+',
    starterQuality: 'C+',
    depth: 'B-',
    age: 'C',
    balance: 'C+',
    dynastyCeiling: 'C',
    starterNote: 'Declining stars, no clear ace',
    depthNote: 'Adequate',
    ageNote: 'Core aging, few young pieces',
    balanceNote: 'No dominant position',
    ceilingNote: 'Window has narrowed',
    bimfleQuote:
      'The 2020 giant-slayer requires structural renovation. The window that was is no longer.',
    championships: [],
  },
  {
    manager: 'Grandes',
    overall: 'C',
    starterQuality: 'C+',
    depth: 'C+',
    age: 'C',
    balance: 'C+',
    dynastyCeiling: 'C',
    starterNote: "Commissioner's difficult year",
    depthNote: 'Adequate aging roster',
    ageNote: 'Older core',
    balanceNote: 'No clear strengths',
    ceilingNote: '2022 champion rebuilding',
    bimfleQuote:
      'Your Commissioner\'s own roster is, regrettably, in need of a thorough renovation. Bimfle is aware.',
    championships: [2022],
  },
  {
    manager: 'Cogdeill11',
    overall: 'D+',
    starterQuality: 'D+',
    depth: 'C-',
    age: 'D',
    balance: 'C-',
    dynastyCeiling: 'D+',
    starterNote: 'No elite players',
    depthNote: 'Thin',
    ageNote: 'Aging core, few young assets',
    balanceNote: 'No dominant position',
    ceilingNote: 'Significant rebuild needed',
    bimfleQuote:
      'The founding champion has arrived at a crossroads. The picks acquired now will determine the next five years.',
    championships: [2020],
  },
  {
    manager: 'Escuelas',
    overall: 'D',
    starterQuality: 'D',
    depth: 'D+',
    age: 'B-',
    balance: 'D',
    dynastyCeiling: 'B-',
    starterNote: 'No true starters',
    depthNote: 'Lots of lottery tickets',
    ageNote: 'Young roster, upside exists',
    balanceNote: 'Weak everywhere equally',
    ceilingNote: 'Youth means ceiling exists',
    bimfleQuote:
      'The rebuild continues. The age profile is the single positive. Draft capital is required with some urgency.',
    championships: [],
  },
];

// ─── Distribution Calculation ─────────────────────────────────────────────────

interface GradeDistribution {
  A: number;
  B: number;
  C: number;
  D: number;
}

function computeDistribution(grades: RosterGrade[]): GradeDistribution {
  const dist: GradeDistribution = { A: 0, B: 0, C: 0, D: 0 };
  for (const r of grades) {
    const g = r.overall[0] as 'A' | 'B' | 'C' | 'D';
    if (g in dist) dist[g]++;
  }
  return dist;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function GradeBadge({
  grade,
  size = 'md',
}: {
  grade: LetterGrade;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const sizeClass =
    size === 'xl'
      ? 'text-4xl font-black w-20 h-20'
      : size === 'lg'
      ? 'text-2xl font-black w-14 h-14'
      : size === 'sm'
      ? 'text-xs font-black w-9 h-7'
      : 'text-base font-black w-12 h-10';

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-lg border tabular-nums',
        gradeBg(grade),
        gradeColor(grade),
        sizeClass
      )}
      aria-label={`Grade: ${grade}`}
    >
      {grade}
    </span>
  );
}

function ChampionBadge({ years }: { years: number[] }) {
  if (years.length === 0) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffd700]/15 border border-[#ffd700]/40 text-[#ffd700] text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
      <Trophy className="w-2.5 h-2.5 shrink-0" aria-hidden="true" />
      {years.length === 1 ? `${years[0]} Champ` : `${years.length}x Champ`}
    </span>
  );
}

function SubGradeRow({
  label,
  grade,
  note,
}: {
  label: string;
  grade: LetterGrade;
  note: string;
}) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-[#1e3347] last:border-0">
      <div className="w-28 shrink-0">
        <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold leading-tight">
          {label}
        </span>
      </div>
      <GradeBadge grade={grade} size="sm" />
      <p className="text-xs text-slate-400 leading-snug flex-1">{note}</p>
    </div>
  );
}

function RosterCard({ roster }: { roster: RosterGrade }) {
  return (
    <article
      className={cn(
        'rounded-2xl border bg-[#16213e] overflow-hidden transition-shadow duration-200 hover:shadow-xl hover:shadow-black/30',
        gradeBg(roster.overall).replace('bg-', 'border-').split(' ')[1]
      )}
      aria-label={`${roster.manager} roster grade`}
    >
      {/* Card header */}
      <div className="px-5 py-4 border-b border-[#1e3347]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-lg font-black text-white leading-tight truncate">
                {roster.manager}
              </h2>
              <ChampionBadge years={roster.championships} />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={cn(
                  'text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border',
                  gradeBg(roster.overall),
                  gradeColor(roster.overall)
                )}
              >
                {gradeTierLabel(roster.overall)}
              </span>
            </div>
          </div>
          <GradeBadge grade={roster.overall} size="xl" />
        </div>
      </div>

      {/* Sub-grades */}
      <div className="px-5 py-3">
        <SubGradeRow label="Starters" grade={roster.starterQuality} note={roster.starterNote} />
        <SubGradeRow label="Depth" grade={roster.depth} note={roster.depthNote} />
        <SubGradeRow label="Age Profile" grade={roster.age} note={roster.ageNote} />
        <SubGradeRow label="Balance" grade={roster.balance} note={roster.balanceNote} />
        <SubGradeRow label="Dyn. Ceiling" grade={roster.dynastyCeiling} note={roster.ceilingNote} />
      </div>

      {/* Bimfle quote */}
      <div className="px-5 pb-5 pt-1">
        <blockquote className="rounded-lg bg-[#ffd700]/5 border border-[#ffd700]/20 px-4 py-3">
          <p className="text-xs text-slate-300 italic leading-relaxed">
            &ldquo;{roster.bimfleQuote}&rdquo;
          </p>
          <footer className="text-[#ffd700] text-[10px] font-bold mt-1.5">~Bimfle</footer>
        </blockquote>
      </div>
    </article>
  );
}

// ─── Sort Controls ────────────────────────────────────────────────────────────

function SortButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'px-4 py-2 rounded-lg text-sm font-bold transition-all duration-150 border',
        active
          ? 'bg-[#ffd700] text-[#0d1b2a] border-[#ffd700]'
          : 'bg-[#16213e] text-slate-400 border-[#2d4a66] hover:border-[#ffd700]/40 hover:text-white'
      )}
    >
      {label}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RosterGradesPage() {
  const [sortKey, setSortKey] = useState<SortKey>('grade');

  const sorted = useMemo(() => {
    const copy = [...ROSTER_GRADES];
    if (sortKey === 'grade') {
      return copy.sort((a, b) => gradeRank(a.overall) - gradeRank(b.overall));
    }
    if (sortKey === 'name') {
      return copy.sort((a, b) => a.manager.localeCompare(b.manager));
    }
    if (sortKey === 'ceiling') {
      return copy.sort(
        (a, b) => gradeRank(a.dynastyCeiling) - gradeRank(b.dynastyCeiling)
      );
    }
    return copy;
  }, [sortKey]);

  const distribution = useMemo(() => computeDistribution(ROSTER_GRADES), []);

  const topRoster = useMemo(
    () => [...ROSTER_GRADES].sort((a, b) => gradeRank(a.overall) - gradeRank(b.overall))[0],
    []
  );
  const bottomRoster = useMemo(
    () =>
      [...ROSTER_GRADES].sort((a, b) => gradeRank(b.overall) - gradeRank(a.overall))[0],
    []
  );
  const highestCeiling = useMemo(
    () =>
      [...ROSTER_GRADES].sort(
        (a, b) => gradeRank(a.dynastyCeiling) - gradeRank(b.dynastyCeiling)
      )[0],
    []
  );

  return (
    <>
      <Head>
        <title>Roster Construction Grades — BMFFFL Analytics</title>
        <meta
          name="description"
          content="Comprehensive A-F roster construction grades for every BMFFFL dynasty manager — March 2026 offseason. Starter quality, depth, age, balance, and dynasty ceiling evaluated."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <BarChart2 className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            Roster Construction Grades
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Comprehensive A–F grades for every BMFFFL roster &mdash; March 2026
          </p>
        </header>

        {/* ── Summary Stats ─────────────────────────────────────────────── */}
        <section
          className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3"
          aria-label="Roster grade summary"
        >
          {/* Best roster */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-4 text-center">
            <div className="flex justify-center mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            </div>
            <p className="text-sm font-black text-white tabular-nums">{topRoster.manager}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">
              Top Roster
            </p>
            <div className="flex justify-center mt-1.5">
              <GradeBadge grade={topRoster.overall} size="sm" />
            </div>
          </div>

          {/* Highest ceiling */}
          <div className="rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/5 px-4 py-4 text-center">
            <div className="flex justify-center mb-1">
              <Trophy className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
            </div>
            <p className="text-sm font-black text-white">{highestCeiling.manager}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">
              Highest Ceiling
            </p>
            <div className="flex justify-center mt-1.5">
              <GradeBadge grade={highestCeiling.dynastyCeiling} size="sm" />
            </div>
          </div>

          {/* Bottom roster */}
          <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 px-4 py-4 text-center">
            <div className="flex justify-center mb-1">
              <AlertTriangle className="w-4 h-4 text-orange-400" aria-hidden="true" />
            </div>
            <p className="text-sm font-black text-white">{bottomRoster.manager}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">
              Needs Most Work
            </p>
            <div className="flex justify-center mt-1.5">
              <GradeBadge grade={bottomRoster.overall} size="sm" />
            </div>
          </div>

          {/* Distribution */}
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-4 py-4 text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2">
              Grade Distribution
            </p>
            <div className="flex justify-center gap-3 text-xs font-black tabular-nums">
              <span className="text-emerald-400">
                A <span className="text-white">{distribution.A}</span>
              </span>
              <span className="text-blue-400">
                B <span className="text-white">{distribution.B}</span>
              </span>
              <span className="text-[#ffd700]">
                C <span className="text-white">{distribution.C}</span>
              </span>
              <span className="text-orange-400">
                D <span className="text-white">{distribution.D}</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">12 rosters evaluated</p>
          </div>
        </section>

        {/* ── Bimfle's Picks Banner ─────────────────────────────────────── */}
        <section
          className="mb-8 rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/5 px-6 py-5"
          aria-label="Bimfle's featured verdicts"
        >
          <p className="text-xs text-[#ffd700] uppercase tracking-widest font-bold mb-3">
            Bimfle's Featured Verdicts
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">
                Best Construction
              </p>
              <div className="flex items-start gap-3">
                <GradeBadge grade={topRoster.overall} size="sm" />
                <div>
                  <p className="text-white font-black text-sm">{topRoster.manager}</p>
                  <p className="text-xs text-slate-400 italic mt-0.5 leading-snug">
                    &ldquo;{topRoster.bimfleQuote}&rdquo;
                  </p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">
                Most Urgent Rebuild
              </p>
              <div className="flex items-start gap-3">
                <GradeBadge grade={bottomRoster.overall} size="sm" />
                <div>
                  <p className="text-white font-black text-sm">{bottomRoster.manager}</p>
                  <p className="text-xs text-slate-400 italic mt-0.5 leading-snug">
                    &ldquo;{bottomRoster.bimfleQuote}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Sort Controls ─────────────────────────────────────────────── */}
        <section className="mb-6" aria-label="Sort rosters">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
            Sort By
          </p>
          <div role="group" aria-label="Sort controls" className="flex flex-wrap gap-1.5">
            <SortButton
              active={sortKey === 'grade'}
              label="By Grade"
              onClick={() => setSortKey('grade')}
            />
            <SortButton
              active={sortKey === 'name'}
              label="By Manager Name"
              onClick={() => setSortKey('name')}
            />
            <SortButton
              active={sortKey === 'ceiling'}
              label="By Dynasty Ceiling"
              onClick={() => setSortKey('ceiling')}
            />
          </div>
        </section>

        {/* ── Roster Cards Grid ─────────────────────────────────────────── */}
        <section
          aria-label="Roster construction grades"
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        >
          {sorted.map((roster) => (
            <RosterCard key={roster.manager} roster={roster} />
          ))}
        </section>

        {/* ── Grade Tier Legend ──────────────────────────────────────────── */}
        <section className="mt-10" aria-label="Grade tier legend">
          <h2 className="text-base font-black text-white mb-3">Grade Tier Reference</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-4 py-3">
              <p className="text-emerald-400 text-xs font-black uppercase tracking-wider mb-1">
                A Tier — Gold
              </p>
              <p className="text-slate-400 text-xs leading-snug">
                Elite construction. Contender in any season.
              </p>
            </div>
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 px-4 py-3">
              <p className="text-blue-400 text-xs font-black uppercase tracking-wider mb-1">
                B Tier — Green
              </p>
              <p className="text-slate-400 text-xs leading-snug">
                Solid foundation. Playoff caliber with upside.
              </p>
            </div>
            <div className="rounded-lg border border-[#ffd700]/30 bg-[#ffd700]/5 px-4 py-3">
              <p className="text-[#ffd700] text-xs font-black uppercase tracking-wider mb-1">
                C Tier — Amber
              </p>
              <p className="text-slate-400 text-xs leading-snug">
                In transition. Structural changes needed.
              </p>
            </div>
            <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 px-4 py-3">
              <p className="text-orange-400 text-xs font-black uppercase tracking-wider mb-1">
                D / F Tier — Red
              </p>
              <p className="text-slate-400 text-xs leading-snug">
                Full rebuild required. Focus on draft capital.
              </p>
            </div>
          </div>
        </section>

        {/* ── Grading Methodology ────────────────────────────────────────── */}
        <section className="mt-8" aria-label="Grading methodology">
          <h2 className="text-base font-black text-white mb-3">Grading Methodology</h2>
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4 grid grid-cols-1 sm:grid-cols-5 gap-4 text-xs text-slate-400">
            <div>
              <p className="text-slate-300 font-black mb-1 uppercase tracking-wider text-[10px]">
                Starter Quality
              </p>
              <p className="leading-snug">
                Evaluates the top-tier talent at each position relative to the league.
              </p>
            </div>
            <div>
              <p className="text-slate-300 font-black mb-1 uppercase tracking-wider text-[10px]">
                Depth
              </p>
              <p className="leading-snug">
                Bench and IR value — the insurance against injury and bye weeks.
              </p>
            </div>
            <div>
              <p className="text-slate-300 font-black mb-1 uppercase tracking-wider text-[10px]">
                Age Profile
              </p>
              <p className="leading-snug">
                Weighted average age of the contributing core. Younger is better for dynasty.
              </p>
            </div>
            <div>
              <p className="text-slate-300 font-black mb-1 uppercase tracking-wider text-[10px]">
                Balance
              </p>
              <p className="leading-snug">
                Positional coverage. Does the roster have assets at every scoring position?
              </p>
            </div>
            <div>
              <p className="text-slate-300 font-black mb-1 uppercase tracking-wider text-[10px]">
                Dynasty Ceiling
              </p>
              <p className="leading-snug">
                Best-case outcome for the next 3 years given current construction and trajectory.
              </p>
            </div>
          </div>
        </section>

        {/* ── Footer Disclaimer ──────────────────────────────────────────── */}
        <div className="mt-8 text-xs text-slate-600 leading-relaxed border-t border-[#1e3347] pt-5">
          <p>
            Grades reflect dynasty value, not current-season win probability. All assessments as of
            March 2026 offseason. Bimfle&rsquo;s verdicts are final.
          </p>
        </div>

      </div>
    </>
  );
}
