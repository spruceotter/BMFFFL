import { useState, useMemo } from 'react';
import Head from 'next/head';
import { Trophy, Award, TrendingUp, Star } from 'lucide-react';
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

interface DraftGrade {
  owner: string;
  grade: LetterGrade;
  commentary: string;
  isChampion?: boolean;
}

interface SeasonDraft {
  year: number;
  champion: string;
  grades: DraftGrade[];
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

function gpaToDisplay(gpa: number): string {
  return gpa.toFixed(2);
}

// ─── Grade Color Config ────────────────────────────────────────────────────────

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

// ─── Draft Data ───────────────────────────────────────────────────────────────

const SEASONS: SeasonDraft[] = [
  {
    year: 2025,
    champion: 'tdtd19844',
    grades: [
      {
        owner: 'tdtd19844',
        grade: 'A',
        commentary: "Champion's draft — used picks accumulated from rebuilds wisely and built the title-winning core.",
        isChampion: true,
      },
      {
        owner: 'Tubes94',
        grade: 'A-',
        commentary: 'Best value in the draft; stacked future picks intelligently and added real dynasty depth.',
      },
      {
        owner: 'MLSchools12',
        grade: 'B+',
        commentary: 'Got Colston Loveland at 1.02 — elite target — and added solid complementary pieces throughout.',
      },
      {
        owner: 'Cmaleski',
        grade: 'B+',
        commentary: 'Best value per pick in the entire draft; maximized every selection.',
      },
      {
        owner: 'JuicyBussy',
        grade: 'B',
        commentary: 'Solid class that added receiving weapons, but still needed a true RB1.',
      },
      {
        owner: 'eldridsm',
        grade: 'B',
        commentary: 'Solid, nothing flashy — consistent contributor additions with no obvious misses.',
      },
      {
        owner: 'SexMachineAndyD',
        grade: 'B-',
        commentary: 'Missed on the 1st rounder but depth picks were solid and partially recovered value.',
      },
      {
        owner: 'eldridm20',
        grade: 'B-',
        commentary: 'Needed more from this class to move the needle; what they got was merely adequate.',
      },
      {
        owner: 'rbr',
        grade: 'C+',
        commentary: 'Reach in round 1 undercut the class; strong recovery with smart rounds 2 and 3.',
      },
      {
        owner: 'Escuelas',
        grade: 'C+',
        commentary: 'Still calibrating how to evaluate dynasty talent; improving but below league average.',
      },
      {
        owner: 'Grandes',
        grade: 'C',
        commentary: "The commissioner had a rough draft class; not much to show for the picks spent.",
      },
      {
        owner: 'Cogdeill11',
        grade: 'D+',
        commentary: 'Whiffed on the 1st round pick — the pick that should anchor a class instead dragged it down.',
      },
    ],
  },
  {
    year: 2024,
    champion: 'MLSchools12',
    grades: [
      {
        owner: 'MLSchools12',
        grade: 'A',
        commentary: 'Got Malik Nabers 1.01 — instant dynasty stud — and the class backed him up beautifully.',
        isChampion: true,
      },
      {
        owner: 'Tubes94',
        grade: 'A-',
        commentary: 'Excellent class across the board; built meaningful depth that paid dividends all season.',
      },
      {
        owner: 'tdtd19844',
        grade: 'A-',
        commentary: 'Key picks in the rebuild that directly funded the 2025 championship run.',
      },
      {
        owner: 'SexMachineAndyD',
        grade: 'B+',
        commentary: 'Good value overall in a class that helped carry a runner-up finish that season.',
      },
      {
        owner: 'rbr',
        grade: 'B+',
        commentary: 'Smart picks, consistently above market value, one of the cleaner draft boards executed.',
      },
      {
        owner: 'JuicyBussy',
        grade: 'B',
        commentary: 'Solid acquisitions that maintained the roster quality without breaking new ground.',
      },
      {
        owner: 'Cmaleski',
        grade: 'B',
        commentary: 'Decent class that kept the roster competitive without any standout home run picks.',
      },
      {
        owner: 'eldridsm',
        grade: 'C+',
        commentary: 'Missed on the ceiling plays; the class produced role players but nothing that elevated the team.',
      },
      {
        owner: 'Grandes',
        grade: 'C+',
        commentary: 'A forgettable draft — the picks existed, produced nothing memorable.',
      },
      {
        owner: 'eldridm20',
        grade: 'B-',
        commentary: 'Adequate results from an adequate process; nothing to get excited about.',
      },
      {
        owner: 'Cogdeill11',
        grade: 'D',
        commentary: 'Another rough draft; another year the class failed to return value on the picks spent.',
      },
      {
        owner: 'Escuelas',
        grade: 'C',
        commentary: 'Improving but still below league average — draft evaluation still a work in progress.',
      },
    ],
  },
  {
    year: 2023,
    champion: 'JuicyBussy',
    grades: [
      {
        owner: 'JuicyBussy',
        grade: 'A+',
        commentary: 'Bijan Robinson acquisition anchored a championship-winning class — the best draft outcome in league history.',
        isChampion: true,
      },
      {
        owner: 'tdtd19844',
        grade: 'A',
        commentary: 'Great rebuild picks that directly set up the 2025 championship run two years later.',
      },
      {
        owner: 'MLSchools12',
        grade: 'B+',
        commentary: 'Strong overall class even without a top pick — the depth here held up over multiple seasons.',
      },
      {
        owner: 'rbr',
        grade: 'B+',
        commentary: 'Smart class that added usable contributors at multiple positions.',
      },
      {
        owner: 'Tubes94',
        grade: 'B',
        commentary: 'Good building blocks added — nothing elite, but consistently solid execution.',
      },
      {
        owner: 'SexMachineAndyD',
        grade: 'B',
        commentary: 'Solid all around; no home run hit but no misses either.',
      },
      {
        owner: 'Cmaleski',
        grade: 'B-',
        commentary: 'OK class — workmanlike picks that neither elevated nor hurt the roster trajectory.',
      },
      {
        owner: 'eldridm20',
        grade: 'C+',
        commentary: 'Average output from average pick usage; the class did not move the needle.',
      },
      {
        owner: 'eldridsm',
        grade: 'C',
        commentary: 'Below average results; the picks existed without producing notable returns.',
      },
      {
        owner: 'Grandes',
        grade: 'C',
        commentary: 'Mediocre draft that continued a stretch of forgettable offseasons.',
      },
      {
        owner: 'Cogdeill11',
        grade: 'C-',
        commentary: 'Struggling to find value; draft picks consistently underperformed expectations.',
      },
      {
        owner: 'Escuelas',
        grade: 'D+',
        commentary: 'First full dynasty draft — still learning the market and overvaluing the wrong things.',
      },
    ],
  },
  {
    year: 2022,
    champion: 'Grandes',
    grades: [
      {
        owner: 'Grandes',
        grade: 'A',
        commentary: "The commissioner draft year — Grandes won the championship and the class was a key piece of it.",
        isChampion: true,
      },
      {
        owner: 'MLSchools12',
        grade: 'A-',
        commentary: 'Maintained dynasty dominance; the class added depth that kept the machine running.',
      },
      {
        owner: 'rbr',
        grade: 'B+',
        commentary: 'Good adds that maintained roster quality heading into a competitive stretch.',
      },
      {
        owner: 'tdtd19844',
        grade: 'B+',
        commentary: 'Began the rebuild with genuinely good picks that would pay off years down the road.',
      },
      {
        owner: 'JuicyBussy',
        grade: 'B',
        commentary: 'Solid class that helped sustain a competitive roster through a transitional period.',
      },
      {
        owner: 'SexMachineAndyD',
        grade: 'B',
        commentary: 'Consistent execution — SexMachineAndyD reliably avoids disasters and finds contributors.',
      },
      {
        owner: 'Tubes94',
        grade: 'B-',
        commentary: 'Second season of drafting; a learning year with decent but unspectacular results.',
      },
      {
        owner: 'eldridsm',
        grade: 'B-',
        commentary: 'Adequate picks that held roster value without moving the dynasty needle.',
      },
      {
        owner: 'eldridm20',
        grade: 'B-',
        commentary: 'Adequate — a pattern that is emerging as the floor for this manager.',
      },
      {
        owner: 'Cmaleski',
        grade: 'C+',
        commentary: 'First dynasty draft ever; a reasonable debut with expected learning-curve mistakes.',
      },
      {
        owner: 'Escuelas',
        grade: 'C',
        commentary: 'First draft in the league — the baptism by fire produced middling results.',
      },
      {
        owner: 'Cogdeill11',
        grade: 'D+',
        commentary: 'A rough stretch continued; picks failed to provide the reset the roster needed.',
      },
    ],
  },
  {
    year: 2021,
    champion: 'MLSchools12',
    grades: [
      {
        owner: 'MLSchools12',
        grade: 'A+',
        commentary: 'Championship class — the picks built the dynasty and directly delivered the 2021 ring.',
        isChampion: true,
      },
      {
        owner: 'rbr',
        grade: 'A',
        commentary: 'Reached the finals on the strength of great picks; one of the cleanest draft classes in early league history.',
      },
      {
        owner: 'JuicyBussy',
        grade: 'A-',
        commentary: 'The record-setting high-powered offense was built here; the foundation of the 2023 championship run.',
      },
      {
        owner: 'Tubes94',
        grade: 'B+',
        commentary: 'Strong debut draft year for Tubes94 — out of the gate with real dynasty instincts.',
      },
      {
        owner: 'SexMachineAndyD',
        grade: 'B+',
        commentary: 'Strong class that set up a competitive stretch; one of the better drafts in this manager\'s history.',
      },
      {
        owner: 'eldridsm',
        grade: 'B+',
        commentary: 'Solid execution — added good contributors and showed strong early evaluation skills.',
      },
      {
        owner: 'eldridm20',
        grade: 'B',
        commentary: 'Good picks that held roster value and provided usable contributors across positions.',
      },
      {
        owner: 'tdtd19844',
        grade: 'B',
        commentary: 'Early rebuild pieces; picks that would eventually contribute to the long rebuild arc.',
      },
      {
        owner: 'Grandes',
        grade: 'B-',
        commentary: 'Adequate draft that neither elevated nor damaged the franchise trajectory.',
      },
      {
        owner: 'Cogdeill11',
        grade: 'C',
        commentary: 'Post-championship letdown; the class that won 2020 was not successfully parlayed into continued success.',
      },
    ],
  },
  {
    year: 2020,
    champion: 'Cogdeill11',
    grades: [
      {
        owner: 'Cogdeill11',
        grade: 'A',
        commentary: 'Won the inaugural championship — the founding draft class set the blueprint for dynasty success.',
        isChampion: true,
      },
      {
        owner: 'JuicyBussy',
        grade: 'A',
        commentary: 'High-powered offense begins here — the founding picks created one of the most dangerous rosters in league history.',
      },
      {
        owner: 'MLSchools12',
        grade: 'A-',
        commentary: 'Built the dynasty foundation from day one; the startup draft that launched the most decorated franchise in BMFFFL.',
      },
      {
        owner: 'eldridsm',
        grade: 'A-',
        commentary: 'Runner-up class — elite founding draft that established eldridsm as an early contender.',
      },
      {
        owner: 'rbr',
        grade: 'B+',
        commentary: 'Solid founding class; the picks here established rbr as a perennial competitor.',
      },
      {
        owner: 'Grandes',
        grade: 'B+',
        commentary: 'Good foundation laid in Year 1 — picks that provided a competitive base to build from.',
      },
      {
        owner: 'SexMachineAndyD',
        grade: 'B+',
        commentary: 'Strong founding draft; SexMachineAndyD entered the league with strong evaluation instincts.',
      },
      {
        owner: 'eldridm20',
        grade: 'B',
        commentary: 'Decent founding class that provided workable contributors across the startup roster.',
      },
      {
        owner: 'tdtd19844',
        grade: 'C+',
        commentary: 'Rough start to the dynasty journey; a founding class that required years of rebuilding to overcome.',
      },
    ],
  },
];

// ─── All-Time GPA Calculation ─────────────────────────────────────────────────

interface AllTimeRanking {
  owner: string;
  totalGpa: number;
  draftCount: number;
  averageGpa: number;
  grades: { year: number; grade: LetterGrade }[];
}

function computeAllTimeRankings(): AllTimeRanking[] {
  const map = new Map<
    string,
    { total: number; count: number; grades: { year: number; grade: LetterGrade }[] }
  >();

  for (const season of SEASONS) {
    for (const entry of season.grades) {
      const existing = map.get(entry.owner) ?? { total: 0, count: 0, grades: [] };
      existing.total += gradeToGpa(entry.grade);
      existing.count += 1;
      existing.grades.push({ year: season.year, grade: entry.grade });
      map.set(entry.owner, existing);
    }
  }

  const rankings: AllTimeRanking[] = [];
  map.forEach((val, owner) => {
    rankings.push({
      owner,
      totalGpa: val.total,
      draftCount: val.count,
      averageGpa: val.total / val.count,
      grades: val.grades.sort((a, b) => a.year - b.year),
    });
  });

  return rankings.sort((a, b) => b.averageGpa - a.averageGpa);
}

// ─── Season Summary ───────────────────────────────────────────────────────────

interface SeasonSummary {
  bestOwner: string;
  bestGrade: LetterGrade;
  worstOwner: string;
  worstGrade: LetterGrade;
  averageGpa: number;
}

function computeSeasonSummary(season: SeasonDraft): SeasonSummary {
  const sorted = [...season.grades].sort(
    (a, b) => gradeToGpa(b.grade) - gradeToGpa(a.grade)
  );
  const total = season.grades.reduce((sum, g) => sum + gradeToGpa(g.grade), 0);
  return {
    bestOwner: sorted[0].owner,
    bestGrade: sorted[0].grade,
    worstOwner: sorted[sorted.length - 1].owner,
    worstGrade: sorted[sorted.length - 1].grade,
    averageGpa: total / season.grades.length,
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function GradeBadge({ grade, size = 'md' }: { grade: LetterGrade; size?: 'sm' | 'md' | 'lg' }) {
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

function ChampionBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffd700]/15 border border-[#ffd700]/40 text-[#ffd700] text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
      <Trophy className="w-2.5 h-2.5 shrink-0" aria-hidden="true" />
      Champion
    </span>
  );
}

// ─── Season Grade Table ───────────────────────────────────────────────────────

function SeasonGradeTable({ season }: { season: SeasonDraft }) {
  const sorted = useMemo(
    () => [...season.grades].sort((a, b) => gradeToGpa(b.grade) - gradeToGpa(a.grade)),
    [season]
  );

  return (
    <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm" aria-label={`${season.year} draft grades`}>
          <thead>
            <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-12"
              >
                Rank
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider"
              >
                Manager
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider w-20"
              >
                Grade
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider w-20 hidden sm:table-cell"
              >
                GPA
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider hidden md:table-cell"
              >
                Bimfle's Commentary
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e3347]">
            {sorted.map((entry, idx) => {
              const isEven = idx % 2 === 0;
              const gpa = gradeToGpa(entry.grade);
              return (
                <tr
                  key={entry.owner}
                  className={cn(
                    'transition-colors duration-100 hover:bg-[#1f3550]',
                    isEven ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                  )}
                >
                  {/* Rank */}
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono font-bold text-slate-400 tabular-nums">
                      #{idx + 1}
                    </span>
                  </td>

                  {/* Manager + champion badge */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-white text-sm">{entry.owner}</span>
                      {entry.isChampion && <ChampionBadge />}
                    </div>
                    {/* Commentary visible on mobile below name */}
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug md:hidden max-w-xs">
                      {entry.commentary}
                    </p>
                  </td>

                  {/* Grade */}
                  <td className="px-4 py-3 text-center">
                    <GradeBadge grade={entry.grade} />
                  </td>

                  {/* GPA */}
                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    <span
                      className={cn(
                        'text-sm font-black tabular-nums font-mono',
                        gradeColor(entry.grade)
                      )}
                    >
                      {gpaToDisplay(gpa)}
                    </span>
                  </td>

                  {/* Commentary */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-xs text-slate-400 leading-snug max-w-sm">
                      {entry.commentary}
                    </p>
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

// ─── Season Summary Panel ─────────────────────────────────────────────────────

function SeasonSummaryPanel({ season }: { season: SeasonDraft }) {
  const summary = useMemo(() => computeSeasonSummary(season), [season]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* Best drafter */}
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-4 py-3">
        <div className="flex items-center gap-1.5 mb-1">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
            Best Drafter
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-black text-white text-sm">{summary.bestOwner}</span>
          <GradeBadge grade={summary.bestGrade} size="sm" />
        </div>
      </div>

      {/* Season average */}
      <div className="rounded-lg border border-[#2d4a66] bg-[#16213e] px-4 py-3">
        <div className="flex items-center gap-1.5 mb-1">
          <Star className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
            Season Average GPA
          </p>
        </div>
        <p className="text-2xl font-black tabular-nums text-white font-mono">
          {gpaToDisplay(summary.averageGpa)}
        </p>
      </div>

      {/* Worst drafter */}
      <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 px-4 py-3">
        <div className="flex items-center gap-1.5 mb-1">
          <Award className="w-3.5 h-3.5 text-orange-400 shrink-0" aria-hidden="true" />
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
            Worst Drafter
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-black text-white text-sm">{summary.worstOwner}</span>
          <GradeBadge grade={summary.worstGrade} size="sm" />
        </div>
      </div>
    </div>
  );
}

// ─── All-Time Rankings Table ───────────────────────────────────────────────────

function AllTimeRankingsTable({ rankings }: { rankings: AllTimeRanking[] }) {
  const SEASONS_LIST = [2020, 2021, 2022, 2023, 2024, 2025];

  return (
    <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
      <div className="overflow-x-auto">
        <table
          className="min-w-full text-sm"
          aria-label="All-time draft grade rankings"
        >
          <thead>
            <tr className="bg-[#0f2744] border-b border-[#2d4a66]">
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider w-12"
              >
                Rank
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider"
              >
                Manager
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider w-24"
              >
                Avg GPA
              </th>
              {SEASONS_LIST.map((yr) => (
                <th
                  key={yr}
                  scope="col"
                  className="px-3 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider w-14 hidden lg:table-cell"
                >
                  {yr}
                </th>
              ))}
              <th
                scope="col"
                className="px-4 py-3 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider w-16 hidden sm:table-cell"
              >
                Drafts
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e3347]">
            {rankings.map((row, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <tr
                  key={row.owner}
                  className={cn(
                    'transition-colors duration-100 hover:bg-[#1f3550]',
                    isEven ? 'bg-[#1a2d42]' : 'bg-[#162638]'
                  )}
                >
                  {/* Rank */}
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'text-xs font-mono font-black tabular-nums',
                        idx === 0
                          ? 'text-[#ffd700]'
                          : idx === 1
                          ? 'text-slate-300'
                          : idx === 2
                          ? 'text-orange-400'
                          : 'text-slate-500'
                      )}
                    >
                      #{idx + 1}
                    </span>
                  </td>

                  {/* Manager */}
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'font-bold text-sm',
                        idx === 0 ? 'text-[#ffd700]' : 'text-white'
                      )}
                    >
                      {row.owner}
                    </span>
                  </td>

                  {/* Avg GPA */}
                  <td className="px-4 py-3 text-center">
                    <span
                      className={cn(
                        'text-base font-black tabular-nums font-mono',
                        row.averageGpa >= 3.7
                          ? 'text-emerald-400'
                          : row.averageGpa >= 3.0
                          ? 'text-blue-400'
                          : row.averageGpa >= 2.3
                          ? 'text-[#ffd700]'
                          : row.averageGpa >= 1.3
                          ? 'text-orange-400'
                          : 'text-red-400'
                      )}
                    >
                      {gpaToDisplay(row.averageGpa)}
                    </span>
                  </td>

                  {/* Per-year grades */}
                  {SEASONS_LIST.map((yr) => {
                    const g = row.grades.find((x) => x.year === yr);
                    return (
                      <td
                        key={yr}
                        className="px-3 py-3 text-center hidden lg:table-cell"
                      >
                        {g ? (
                          <GradeBadge grade={g.grade} size="sm" />
                        ) : (
                          <span className="text-slate-700 text-xs">—</span>
                        )}
                      </td>
                    );
                  })}

                  {/* Draft count */}
                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    <span className="text-xs font-mono text-slate-400 tabular-nums">
                      {row.draftCount}
                    </span>
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

// ─── Season Tabs ──────────────────────────────────────────────────────────────

const SEASON_YEARS = [2025, 2024, 2023, 2022, 2021, 2020] as const;
type SeasonYear = (typeof SEASON_YEARS)[number];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DraftGradesPage() {
  const [selectedYear, setSelectedYear] = useState<SeasonYear>(2025);

  const activeSeason = useMemo(
    () => SEASONS.find((s) => s.year === selectedYear)!,
    [selectedYear]
  );

  const allTimeRankings = useMemo(() => computeAllTimeRankings(), []);

  return (
    <>
      <Head>
        <title>Dynasty Draft Grades — BMFFFL Analytics</title>
        <meta
          name="description"
          content="Retroactive letter grades for every BMFFFL rookie draft (2020–2025). See what each manager got, what it became, and Bimfle's verdict."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <Award className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            Dynasty Draft Grades
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Retroactive grades for every BMFFFL rookie draft (2020&ndash;2025)
          </p>
        </header>

        {/* ── Summary Stats ────────────────────────────────────────────────── */}
        <section className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3" aria-label="League draft summary">
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-4 py-4 text-center">
            <p className="text-3xl font-black tabular-nums text-[#ffd700]">6</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Seasons Graded</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">2020 – 2025</p>
          </div>
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-4 py-4 text-center">
            <p className="text-3xl font-black tabular-nums text-emerald-400">
              {allTimeRankings[0]?.owner?.split(/(?=[A-Z\d])/)[0] ?? allTimeRankings[0]?.owner}
            </p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Best All-Time Drafter</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {allTimeRankings[0] ? gpaToDisplay(allTimeRankings[0].averageGpa) + ' GPA' : ''}
            </p>
          </div>
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-4 py-4 text-center">
            <p className="text-3xl font-black tabular-nums text-[#e94560]">A+</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Highest Grade</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">JuicyBussy 2023</p>
          </div>
          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-4 py-4 text-center">
            <p className="text-3xl font-black tabular-nums text-orange-400">D</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Lowest Grade</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Cogdeill11 2024</p>
          </div>
        </section>

        {/* ── Season Selector Tabs ─────────────────────────────────────────── */}
        <section className="mb-6" aria-label="Select draft season">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
            Draft Season
          </p>
          <div role="group" aria-label="Season selector" className="flex flex-wrap gap-1.5">
            {SEASON_YEARS.map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setSelectedYear(yr)}
                aria-pressed={selectedYear === yr}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-bold transition-all duration-150 border tabular-nums',
                  selectedYear === yr
                    ? 'bg-[#ffd700] text-[#0d1b2a] border-[#ffd700]'
                    : 'bg-[#16213e] text-slate-400 border-[#2d4a66] hover:border-[#ffd700]/40 hover:text-white'
                )}
              >
                {yr}
              </button>
            ))}
          </div>
        </section>

        {/* ── Season Champion Banner ───────────────────────────────────────── */}
        <div className="mb-5 flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/30">
            <Trophy className="w-4 h-4 text-[#ffd700] shrink-0" aria-hidden="true" />
            <span className="text-[#ffd700] text-xs font-bold uppercase tracking-wider">
              {selectedYear} Champion:
            </span>
            <span className="text-white text-sm font-black">{activeSeason.champion}</span>
          </div>
          <div className="flex-1 h-px bg-[#2d4a66]" aria-hidden="true" />
        </div>

        {/* ── Season Summary Panel ─────────────────────────────────────────── */}
        <section className="mb-6" aria-label={`${selectedYear} season summary`}>
          <SeasonSummaryPanel season={activeSeason} />
        </section>

        {/* ── Grade Table ──────────────────────────────────────────────────── */}
        <section aria-label={`${selectedYear} draft grade table`}>
          <SeasonGradeTable season={activeSeason} />
        </section>

        {/* ── Divider ──────────────────────────────────────────────────────── */}
        <div className="my-12 flex items-center gap-4" aria-hidden="true">
          <div className="flex-1 h-px bg-[#2d4a66]" />
          <span className="text-slate-600 text-xs uppercase tracking-widest font-semibold">
            All-Time Rankings
          </span>
          <div className="flex-1 h-px bg-[#2d4a66]" />
        </div>

        {/* ── All-Time Rankings ─────────────────────────────────────────────── */}
        <section aria-label="All-time draft GPA rankings">
          <div className="mb-4">
            <h2 className="text-xl font-black text-white">All-Time Draft GPA Rankings</h2>
            <p className="text-slate-500 text-sm mt-0.5">
              Cumulative average GPA across all drafted seasons (2020&ndash;2025)
            </p>
          </div>
          <AllTimeRankingsTable rankings={allTimeRankings} />
        </section>

        {/* ── Grade Scale Reference ─────────────────────────────────────────── */}
        <section className="mt-10" aria-label="Grade scale reference">
          <h2 className="text-base font-black text-white mb-3">Grade Scale Reference</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
            {(
              [
                ['A+', '4.3'],
                ['A', '4.0'],
                ['A-', '3.7'],
                ['B+', '3.3'],
                ['B', '3.0'],
                ['B-', '2.7'],
                ['C+', '2.3'],
                ['C', '2.0'],
                ['C-', '1.7'],
                ['D+', '1.3'],
                ['D', '1.0'],
                ['D-', '0.7'],
              ] as [LetterGrade, string][]
            ).map(([g, gpa]) => (
              <div
                key={g}
                className="rounded-lg border border-[#2d4a66] bg-[#16213e] px-3 py-2 flex items-center justify-between gap-2"
              >
                <GradeBadge grade={g} size="sm" />
                <span className="text-xs font-mono text-slate-400 tabular-nums">{gpa}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bimfle's Note ─────────────────────────────────────────────────── */}
        <aside
          className="mt-10 rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/5 px-6 py-5"
          aria-label="Bimfle's note on draft grades"
        >
          <p className="text-xs text-[#ffd700] uppercase tracking-widest font-bold mb-2">
            Bimfle's Note
          </p>
          <p className="text-slate-300 text-sm leading-relaxed italic">
            "Draft grades are applied retroactively with the wisdom of hindsight, which is to say they
            are entirely unfair. Bimfle accepts this and proceeds anyway."
          </p>
          <p className="text-[#ffd700] text-xs font-semibold mt-2">~Love, Bimfle.</p>
        </aside>

        {/* ── Footer Disclaimer ────────────────────────────────────────────── */}
        <div className="mt-6 text-xs text-slate-600 leading-relaxed">
          <p>
            Draft grades are retroactive assessments based on what each pick became — not what was
            expected at the time of the draft. GPA equivalents use a 4.3-scale (A+ = 4.3, A = 4.0,
            A- = 3.7, etc.). All-time rankings include only seasons in which a manager participated.
          </p>
        </div>

      </div>
    </>
  );
}
