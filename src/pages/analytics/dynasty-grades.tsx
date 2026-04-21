import { useMemo } from 'react';
import Head from 'next/head';
import { GraduationCap, Trophy, Award, TrendingUp, TrendingDown, Star } from 'lucide-react';
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

interface ReportCard {
  manager: string;
  rosterConstruction: LetterGrade;
  tradeActivity: LetterGrade;
  faabStrategy: LetterGrade;
  lineupDecisions: LetterGrade;
  dynastyVision: LetterGrade;
  gpa: number;
  comment: string;
  championships: number[];
}

// ─── GPA Conversion ───────────────────────────────────────────────────────────

const GRADE_TO_GPA: Record<LetterGrade, number> = {
  'A+': 4.3,
  'A':  4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B':  3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C':  2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D':  1.0,
  'D-': 0.7,
  'F':  0.0,
};

function gradeToGpa(grade: LetterGrade): number {
  return GRADE_TO_GPA[grade];
}

// ─── Grade Utilities ──────────────────────────────────────────────────────────

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

function gpaColor(gpa: number): string {
  if (gpa >= 3.7) return 'text-emerald-400';
  if (gpa >= 3.0) return 'text-blue-400';
  if (gpa >= 2.0) return 'text-[#ffd700]';
  if (gpa >= 1.0) return 'text-orange-400';
  return 'text-red-400';
}

// ─── Report Card Data ─────────────────────────────────────────────────────────

const REPORT_CARDS: ReportCard[] = [
  {
    manager: 'MLSchools12',
    rosterConstruction: 'B+',
    tradeActivity: 'A',
    faabStrategy: 'B',
    lineupDecisions: 'A',
    dynastyVision: 'A',
    gpa: 3.7,
    comment: 'Three-time all-time champion. Two Sleeper rings (2021, 2024) and still ascending.',
    championships: [2021, 2024],
  },
  {
    manager: 'Tubes94',
    rosterConstruction: 'A',
    tradeActivity: 'B+',
    faabStrategy: 'A-',
    lineupDecisions: 'A-',
    dynastyVision: 'A-',
    gpa: 3.8,
    comment: 'Best roster in the league. The ring eludes.',
    championships: [],
  },
  {
    manager: 'rbr',
    rosterConstruction: 'A',
    tradeActivity: 'C+',
    faabStrategy: 'A+',
    lineupDecisions: 'A+',
    dynastyVision: 'A',
    gpa: 3.7,
    comment: 'Lineup wizard. Trades conservatively.',
    championships: [],
  },
  {
    manager: 'JuicyBussy',
    rosterConstruction: 'B',
    tradeActivity: 'A+',
    faabStrategy: 'C',
    lineupDecisions: 'B',
    dynastyVision: 'B+',
    gpa: 3.2,
    comment: 'Chaos strategy with occasional brilliance.',
    championships: [2023],
  },
  {
    manager: 'SexMachineAndyD',
    rosterConstruction: 'B+',
    tradeActivity: 'B',
    faabStrategy: 'B+',
    lineupDecisions: 'B',
    dynastyVision: 'B+',
    gpa: 3.3,
    comment: '2018 ESPN champion. Consistent contender across both eras.',
    championships: [],
  },
  {
    manager: 'Cogdeill11',
    rosterConstruction: 'C',
    tradeActivity: 'D+',
    faabStrategy: 'C-',
    lineupDecisions: 'C',
    dynastyVision: 'D',
    gpa: 1.8,
    comment: 'Rebuild mode. The 2020 championship feels distant.',
    championships: [2020],
  },
  {
    manager: 'Grandes',
    rosterConstruction: 'B',
    tradeActivity: 'C',
    faabStrategy: 'C+',
    lineupDecisions: 'B-',
    dynastyVision: 'C+',
    gpa: 2.5,
    comment: 'Commissioner duties may have affected focus.',
    championships: [2022],
  },
  {
    manager: 'tdtd19844',
    rosterConstruction: 'B+',
    tradeActivity: 'B+',
    faabStrategy: 'B',
    lineupDecisions: 'B',
    dynastyVision: 'A-',
    gpa: 3.3,
    comment: 'Steady rise. The dynasty phase has begun.',
    championships: [2025],
  },
  {
    manager: 'eldridsm',
    rosterConstruction: 'B',
    tradeActivity: 'B+',
    faabStrategy: 'B',
    lineupDecisions: 'B-',
    dynastyVision: 'B+',
    gpa: 3.1,
    comment: 'Underrated. One of the best draft-day managers.',
    championships: [],
  },
  {
    manager: 'eldridm20',
    rosterConstruction: 'B',
    tradeActivity: 'B-',
    faabStrategy: 'B+',
    lineupDecisions: 'B',
    dynastyVision: 'B',
    gpa: 3.0,
    comment: 'Bracket buster. Needs one more playoff push.',
    championships: [],
  },
  {
    manager: 'Cmaleski',
    rosterConstruction: 'B+',
    tradeActivity: 'B',
    faabStrategy: 'B',
    lineupDecisions: 'B-',
    dynastyVision: 'B',
    gpa: 3.0,
    comment: '1990 points says the roster is real.',
    championships: [],
  },
  {
    manager: 'Escuelas',
    rosterConstruction: 'D+',
    tradeActivity: 'C-',
    faabStrategy: 'D',
    lineupDecisions: 'C',
    dynastyVision: 'C-',
    gpa: 1.7,
    comment: 'Year 5. Still climbing. The devy picks are the plan.',
    championships: [],
  },
];

// ─── Class Ranking Tiers ──────────────────────────────────────────────────────

type Tier = "Dean's List" | 'Honor Roll' | 'On Track' | 'Academic Probation';

function getTier(rank: number): Tier {
  if (rank <= 3) return "Dean's List";
  if (rank <= 6) return 'Honor Roll';
  if (rank <= 9) return 'On Track';
  return 'Academic Probation';
}

function tierColor(tier: Tier): string {
  if (tier === "Dean's List") return 'text-[#ffd700]';
  if (tier === 'Honor Roll') return 'text-emerald-400';
  if (tier === 'On Track') return 'text-blue-400';
  return 'text-orange-400';
}

function tierBg(tier: Tier): string {
  if (tier === "Dean's List") return 'bg-[#ffd700]/10 border-[#ffd700]/30';
  if (tier === 'Honor Roll') return 'bg-emerald-500/10 border-emerald-500/30';
  if (tier === 'On Track') return 'bg-blue-500/10 border-blue-500/30';
  return 'bg-orange-500/10 border-orange-500/30';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function GradeBadge({
  grade,
  size = 'md',
}: {
  grade: LetterGrade;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClass =
    size === 'lg'
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

interface GradeRowProps {
  label: string;
  grade: LetterGrade;
}

function GradeRow({ label, grade }: GradeRowProps) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-[#1e3347] last:border-0">
      <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
        {label}
      </span>
      <GradeBadge grade={grade} size="sm" />
    </div>
  );
}

function ReportCardItem({ card }: { card: ReportCard }) {
  const avgGrade = card.gpa;

  return (
    <article
      className="rounded-2xl border border-[#2d4a66] bg-[#16213e] overflow-hidden transition-shadow duration-200 hover:shadow-xl hover:shadow-black/30"
      aria-label={`${card.manager} dynasty report card`}
    >
      {/* Card header */}
      <div className="px-5 py-4 border-b border-[#1e3347] bg-[#0f2744]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-lg font-black text-white leading-tight">{card.manager}</h2>
              <ChampionBadge years={card.championships} />
            </div>
            <p className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold">
              2025 Season Assessment
            </p>
          </div>
          {/* GPA display */}
          <div className="text-right shrink-0">
            <p className={cn('text-3xl font-black tabular-nums font-mono', gpaColor(avgGrade))}>
              {avgGrade.toFixed(1)}
            </p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">GPA</p>
          </div>
        </div>
      </div>

      {/* Category grades */}
      <div className="px-5 py-3">
        <GradeRow label="Roster Construction" grade={card.rosterConstruction} />
        <GradeRow label="Trade Activity" grade={card.tradeActivity} />
        <GradeRow label="FAAB Strategy" grade={card.faabStrategy} />
        <GradeRow label="Lineup Decisions" grade={card.lineupDecisions} />
        <GradeRow label="Dynasty Vision" grade={card.dynastyVision} />
      </div>

      {/* Bimfle comment */}
      <div className="px-5 pb-5 pt-1">
        <blockquote className="rounded-lg bg-[#ffd700]/5 border border-[#ffd700]/20 px-4 py-3">
          <p className="text-xs text-slate-300 italic leading-relaxed">
            &ldquo;{card.comment}&rdquo;
          </p>
          <footer className="text-[#ffd700] text-[10px] font-bold mt-1.5">~Professor Bimfle</footer>
        </blockquote>
      </div>
    </article>
  );
}

// ─── Rankings Table ───────────────────────────────────────────────────────────

function ClassRankingsTable({ ranked }: { ranked: ReportCard[] }) {
  return (
    <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm" aria-label="Class GPA rankings">
          <thead>
            <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
              <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-12">
                Rank
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Manager
              </th>
              <th scope="col" className="px-4 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider w-24">
                GPA
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider hidden sm:table-cell">
                Standing
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider hidden md:table-cell">
                Bimfle's Note
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e3347]">
            {ranked.map((card, idx) => {
              const rank = idx + 1;
              const tier = getTier(rank);
              const isEven = idx % 2 === 0;
              return (
                <tr
                  key={card.manager}
                  className={cn(
                    'transition-colors duration-100 hover:bg-[#1f3550]',
                    isEven ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                  )}
                >
                  <td className="px-4 py-3">
                    <span className={cn(
                      'text-xs font-mono font-black tabular-nums',
                      rank === 1 ? 'text-[#ffd700]' : rank === 2 ? 'text-slate-300' : rank === 3 ? 'text-orange-400' : 'text-slate-500'
                    )}>
                      #{rank}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn('font-bold text-sm', rank === 1 ? 'text-[#ffd700]' : 'text-white')}>
                        {card.manager}
                      </span>
                      {card.championships.length > 0 && (
                        <ChampionBadge years={card.championships} />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 md:hidden italic">{card.comment}</p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn('text-base font-black tabular-nums font-mono', gpaColor(card.gpa))}>
                      {card.gpa.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={cn(
                      'text-xs font-bold px-2 py-0.5 rounded-full border',
                      tierBg(tier),
                      tierColor(tier)
                    )}>
                      {tier}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-xs text-slate-400 italic leading-snug max-w-xs">{card.comment}</p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DynastyGradesPage() {
  const ranked = useMemo(
    () => [...REPORT_CARDS].sort((a, b) => b.gpa - a.gpa),
    []
  );

  const topManager = ranked[0];
  const bottomManager = ranked[ranked.length - 1];

  // Most improved: escuelas has been climbing each year; highlight as most improved
  const mostImproved = REPORT_CARDS.find((c) => c.manager === 'tdtd19844')!;

  const avgGpa = useMemo(
    () => REPORT_CARDS.reduce((s, c) => s + c.gpa, 0) / REPORT_CARDS.length,
    []
  );

  return (
    <>
      <Head>
        <title>Dynasty Grade Report Card — BMFFFL Analytics</title>
        <meta
          name="description"
          content="2025 end-of-year dynasty grade report card. Professor Bimfle assesses all 12 BMFFFL managers across roster construction, trades, FAAB, lineup decisions, and dynasty vision."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Header / Hero ────────────────────────────────────────────────── */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <GraduationCap className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            Dynasty Grade Report Card
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mb-6">
            2025 End of Year — Annual Manager Assessment by Professor Bimfle
          </p>
          {/* Professor Bimfle hero quote */}
          <div className="rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/5 px-6 py-5 max-w-2xl">
            <p className="text-xs text-[#ffd700] uppercase tracking-widest font-bold mb-2">
              Professor Bimfle Addressing the Class
            </p>
            <p className="text-slate-300 text-sm leading-relaxed italic">
              &ldquo;Please take your seats. I have reviewed your coursework, evaluated your transactions,
              scrutinized your lineups, and audited your FAAB budgets. You have been graded. Some of you
              should be proud. Others should be ashamed. Class dismissed.&rdquo;
            </p>
            <p className="text-[#ffd700] text-xs font-semibold mt-2">~Professor Bimfle, 2025</p>
          </div>
        </header>

        {/* ── Summary Stats ────────────────────────────────────────────────── */}
        <section className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3" aria-label="Class summary stats">
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-4 py-4 text-center">
            <p className="text-3xl font-black tabular-nums text-[#ffd700]">12</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Managers Graded</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">2025 Season</p>
          </div>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-4 text-center">
            <div className="flex justify-center mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            </div>
            <p className="text-sm font-black text-emerald-400">{topManager.manager}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Class Valedictorian</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{topManager.gpa.toFixed(1)} GPA</p>
          </div>
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-4 py-4 text-center">
            <p className={cn('text-3xl font-black tabular-nums font-mono', gpaColor(avgGpa))}>
              {avgGpa.toFixed(2)}
            </p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Class Average GPA</p>
          </div>
          <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 px-4 py-4 text-center">
            <div className="flex justify-center mb-1">
              <TrendingDown className="w-4 h-4 text-orange-400" aria-hidden="true" />
            </div>
            <p className="text-sm font-black text-orange-400">{bottomManager.manager}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Needs Improvement</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{bottomManager.gpa.toFixed(1)} GPA</p>
          </div>
        </section>

        {/* ── Report Cards Grid ────────────────────────────────────────────── */}
        <section aria-label="Dynasty report cards" className="mb-12">
          <div className="mb-5 flex items-center gap-4">
            <h2 className="text-xl font-black text-white whitespace-nowrap">Individual Report Cards</h2>
            <div className="flex-1 h-px bg-[#2d4a66]" aria-hidden="true" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {REPORT_CARDS.map((card) => (
              <ReportCardItem key={card.manager} card={card} />
            ))}
          </div>
        </section>

        {/* ── Divider ──────────────────────────────────────────────────────── */}
        <div className="my-10 flex items-center gap-4" aria-hidden="true">
          <div className="flex-1 h-px bg-[#2d4a66]" />
          <span className="text-slate-600 text-xs uppercase tracking-widest font-semibold">
            Class Rankings
          </span>
          <div className="flex-1 h-px bg-[#2d4a66]" />
        </div>

        {/* ── Class Rankings ───────────────────────────────────────────────── */}
        <section aria-label="Class GPA rankings" className="mb-12">
          <div className="mb-5">
            <h2 className="text-xl font-black text-white">Class Rankings</h2>
            <p className="text-slate-500 text-sm mt-0.5">
              All 12 managers ranked by overall 2025 dynasty GPA
            </p>
          </div>

          {/* Tier legend */}
          <div className="mb-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(
              [
                ["Dean's List", '#1–3 — Top performers'],
                ['Honor Roll', '#4–6 — Above average'],
                ['On Track', '#7–9 — Solid standing'],
                ['Academic Probation', '#10–12 — Needs work'],
              ] as [Tier, string][]
            ).map(([tier, desc]) => (
              <div
                key={tier}
                className={cn('rounded-lg border px-3 py-2.5', tierBg(tier))}
              >
                <p className={cn('text-xs font-black uppercase tracking-wider', tierColor(tier))}>
                  {tier}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>

          <ClassRankingsTable ranked={ranked} />
        </section>

        {/* ── Most Improved Award ──────────────────────────────────────────── */}
        <section aria-label="Most improved award" className="mb-12">
          <div className="mb-5 flex items-center gap-4">
            <h2 className="text-xl font-black text-white whitespace-nowrap">Most Improved</h2>
            <div className="flex-1 h-px bg-[#2d4a66]" aria-hidden="true" />
          </div>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-6 py-5 max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              <p className="text-xs text-emerald-400 uppercase tracking-widest font-bold">
                2025 Most Improved Manager
              </p>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-center">
                <p className="text-4xl font-black text-emerald-400 font-mono tabular-nums">
                  {mostImproved.gpa.toFixed(1)}
                </p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">2025 GPA</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">{mostImproved.manager}</p>
                <ChampionBadge years={mostImproved.championships} />
              </div>
            </div>
            <blockquote className="rounded-lg bg-[#ffd700]/5 border border-[#ffd700]/20 px-4 py-3">
              <p className="text-xs text-slate-300 italic leading-relaxed">
                &ldquo;{mostImproved.comment}&rdquo;
              </p>
              <footer className="text-[#ffd700] text-[10px] font-bold mt-1.5">~Professor Bimfle</footer>
            </blockquote>
          </div>
        </section>

        {/* ── Professor Bimfle's Closing Remarks ──────────────────────────── */}
        <section aria-label="Professor Bimfle closing remarks" className="mb-8">
          <div className="mb-5 flex items-center gap-4">
            <h2 className="text-xl font-black text-white whitespace-nowrap">
              Professor Bimfle&rsquo;s Closing Remarks
            </h2>
            <div className="flex-1 h-px bg-[#2d4a66]" aria-hidden="true" />
          </div>
          <div className="rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/5 px-6 py-6 max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
              <p className="text-xs text-[#ffd700] uppercase tracking-widest font-bold">
                Formal Address — End of Year 2025
              </p>
            </div>
            <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
              <p>
                &ldquo;This cohort shows growth in lineup management but concerning trends in FAAB
                discipline. Several managers continue to treat the waiver wire as an afterthought
                rather than a strategic lever, and it shows in their results.
              </p>
              <p>
                The upper tier — tubes94, mlschools12, rbr — represents the standard to which this
                class should aspire. The championship window is not guaranteed. It is built, pick by
                pick, trade by trade, add by add.
              </p>
              <p>
                The class of 2025 graduates with mixed results. Some of you have earned your stripes.
                Others owe me office hours. You know who you are.&rdquo;
              </p>
            </div>
            <p className="text-[#ffd700] text-xs font-bold mt-4">
              ~Professor Bimfle, BMFFFL Department of Dynasty Management
            </p>
          </div>
        </section>

        {/* ── Grading Key ─────────────────────────────────────────────────── */}
        <section aria-label="Grading categories key" className="mb-8">
          <h2 className="text-base font-black text-white mb-3">Grading Categories</h2>
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4 grid grid-cols-1 sm:grid-cols-5 gap-4 text-xs text-slate-400">
            {[
              ['Roster Construction', 'Overall quality and depth of the current roster heading into 2026.'],
              ['Trade Activity', 'Buy-low execution, sell-high discipline, and trade return value.'],
              ['FAAB Strategy', 'Budget allocation, bid efficiency, and waiver wire asset identification.'],
              ['Lineup Decisions', 'Start/sit accuracy, bye-week management, and in-season adjustments.'],
              ['Dynasty Vision', 'Long-term roster building strategy, age curve management, and asset hoarding.'],
            ].map(([cat, desc]) => (
              <div key={cat}>
                <p className="text-slate-300 font-black mb-1 uppercase tracking-wider text-[10px]">{cat}</p>
                <p className="leading-snug">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div className="mt-6 text-xs text-slate-600 leading-relaxed border-t border-[#1e3347] pt-5">
          <p>
            Dynasty grades are Bimfle&rsquo;s subjective retroactive assessment of the 2025 season.
            GPA values are curated to reflect relative manager performance, not calculated from the
            letter grades shown. All verdicts are final. Bimfle does not accept appeals.
          </p>
        </div>

      </div>
    </>
  );
}
