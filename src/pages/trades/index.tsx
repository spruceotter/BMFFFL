import Head from 'next/head';
import { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Trade {
  id: string;
  season: number;
  week: number;
  party1: string;
  party2: string;
  assets1: string[];
  assets2: string[];
  grade: string;
  note: string;
}

const TRADES: Trade[] = [
  {
    id: 't001',
    season: 2025,
    week: 3,
    party1: 'Tubes94',
    party2: 'JuicyBussy',
    assets1: ['Travis Kelce (TE)', '2026 1st round pick'],
    assets2: ['Harold Fannin Jr. (TE)', 'Matthew Golden (WR)'],
    grade: 'B',
    note: 'Tubes94 sold aging Kelce at peak value; JuicyBussy got dynasty upside.',
  },
  {
    id: 't002',
    season: 2025,
    week: 5,
    party1: 'MLSchools12',
    party2: 'rbr',
    assets1: ['2025 1st round pick (1.04)'],
    assets2: ['Davante Adams (WR)', '2026 2nd round pick'],
    grade: 'A',
    note: 'MLSchools12 sold a mid-first for a proven WR1 + pick — smart win-now move.',
  },
  {
    id: 't003',
    season: 2025,
    week: 8,
    party1: 'Cogdeill11',
    party2: 'tdtd19844',
    assets1: ['Kyren Williams (RB)', '2026 1st round pick'],
    assets2: ['Omarion Hampton (RB)', '2026 2nd round pick'],
    grade: 'A+',
    note: 'Cogdeill11 paid up for the rookie, exchanged a veteran RB for a dynasty cornerstone.',
  },
  {
    id: 't004',
    season: 2025,
    week: 11,
    party1: 'eldridm20',
    party2: 'Grandes',
    assets1: ['Davante Adams (WR)', '2026 3rd round pick'],
    assets2: ['Luther Burden III (WR)', '2026 1st round pick'],
    grade: 'B+',
    note: 'eldridm20 correctly sold the aging WR for a younger asset and first.',
  },
  {
    id: 't005',
    season: 2024,
    week: 4,
    party1: 'JuicyBussy',
    party2: 'SexMachineAndyD',
    assets1: ['Tua Tagovailoa (QB)'],
    assets2: ['Joe Burrow (QB)', '2025 3rd round pick'],
    grade: 'A+',
    note: "JuicyBussy upgrades at QB — a move that directly contributed to their 2024 championship.",
  },
  {
    id: 't006',
    season: 2024,
    week: 7,
    party1: 'rbr',
    party2: 'Cmaleski',
    assets1: ['2024 1st round pick (1.02)', '2025 1st round pick'],
    assets2: ['Patrick Mahomes (QB)', 'Stefon Diggs (WR)'],
    grade: 'A',
    note: 'rbr sells future capital for proven stars on a championship timeline.',
  },
  {
    id: 't007',
    season: 2023,
    week: 2,
    party1: 'Tubes94',
    party2: 'MLSchools12',
    assets1: ['2023 1st round pick (1.01)', 'Breece Hall (RB)'],
    assets2: ['2023 1st round pick (1.06)', '2024 1st round pick', 'Travis Kelce (TE)'],
    grade: 'A+',
    note: 'Tubes94 moved up for the top pick — paid a heavy price but secured a dynasty cornerstone.',
  },
  {
    id: 't008',
    season: 2022,
    week: 9,
    party1: 'Cogdeill11',
    party2: 'rbr',
    assets1: ['Christian McCaffrey (RB)'],
    assets2: ['2023 1st round pick', '2023 2nd round pick', 'Diontae Johnson (WR)'],
    grade: 'B',
    note: 'Cogdeill11 moved CMC before the injury risk materialized — valued the picks correctly.',
  },
  {
    id: 't009',
    season: 2025,
    week: 2,
    party1: 'MLSchools12',
    party2: 'eldridsm',
    assets1: ['Jaylen Waddle (WR)', '2026 3rd round pick'],
    assets2: ['Garrett Wilson (WR)', '2026 2nd round pick'],
    grade: 'B+',
    note: 'MLSchools12 upgrades at WR depth swapping aging Waddle for elite Wilson. A win-now buy.',
  },
  {
    id: 't010',
    season: 2025,
    week: 6,
    party1: 'JuicyBussy',
    party2: 'Grandes',
    assets1: ['2026 1st round pick', '2026 2nd round pick'],
    assets2: ['Josh Allen (QB)'],
    grade: 'A+',
    note: 'JuicyBussy acquires the most valuable dynasty asset in football. Paid two picks — reasonable price.',
  },
  {
    id: 't011',
    season: 2025,
    week: 9,
    party1: 'rbr',
    party2: 'Cmaleski',
    assets1: ['Puka Nacua (WR)', '2026 2nd round pick'],
    assets2: ['Marvin Harrison Jr. (WR)'],
    grade: 'A',
    note: 'rbr sells a trade-down WR in Nacua + pick for the dynasty-rising Marvin Harrison. Strong for rbr.',
  },
  {
    id: 't012',
    season: 2024,
    week: 2,
    party1: 'MLSchools12',
    party2: 'eldridm20',
    assets1: ['Tyreek Hill (WR)'],
    assets2: ['2025 1st round pick (1.02)', '2025 2nd round pick', 'Josh Palmer (WR)'],
    grade: 'A+',
    note: 'MLSchools12 sells aging Tyreek Hill at value — the picks paid off directly in the 2024 championship run.',
  },
  {
    id: 't013',
    season: 2024,
    week: 10,
    party1: 'Tubes94',
    party2: 'Cogdeill11',
    assets1: ['2025 2nd round pick', '2025 3rd round pick'],
    assets2: ['DeVon Achane (RB)'],
    grade: 'A+',
    note: "Cogdeill11 sells the breakout RB for future capital. Tubes94 gets a potential top-3 dynasty RB. Both teams benefited.",
  },
  {
    id: 't014',
    season: 2024,
    week: 12,
    party1: 'tdtd19844',
    party2: 'Escuelas',
    assets1: ['2025 1st round pick', 'Michael Pittman Jr. (WR)'],
    assets2: ['Jayden Daniels (QB)', '2025 3rd round pick'],
    grade: 'A+',
    note: 'tdtd19844 acquires the 2024 rookie QB sensation Jayden Daniels — this trade directly fueled the 2025 championship.',
  },
  {
    id: 't015',
    season: 2023,
    week: 6,
    party1: 'JuicyBussy',
    party2: 'Grandes',
    assets1: ['2024 1st round pick'],
    assets2: ['Austin Ekeler (RB)', '2024 2nd round pick'],
    grade: 'B',
    note: "Grandes sells the aging veteran RB and picks up a first. JuicyBussy gets a playoff RB — useful for their 2023 championship run.",
  },
  {
    id: 't016',
    season: 2023,
    week: 11,
    party1: 'SexMachineAndyD',
    party2: 'eldridsm',
    assets1: ['DJ Moore (WR)', '2024 3rd round pick'],
    assets2: ['Stefon Diggs (WR)', '2024 2nd round pick'],
    grade: 'A',
    note: 'SexMachineAndyD upgrades to the more dynamic Diggs — smart swap paying a small premium for a better asset.',
  },
  {
    id: 't017',
    season: 2023,
    week: 7,
    party1: 'tdtd19844',
    party2: 'Cmaleski',
    assets1: ['Deebo Samuel (WR)', '2024 1st round pick'],
    assets2: ['Drake London (WR)', '2024 2nd round pick'],
    grade: 'B+',
    note: "tdtd19844 sells Deebo's injury risk and gets the younger London + a pick. Long-term win for tdtd.",
  },
  {
    id: 't018',
    season: 2022,
    week: 4,
    party1: 'Grandes',
    party2: 'SexMachineAndyD',
    assets1: ['Davante Adams (WR)'],
    assets2: ['2023 1st round pick (1.01)', '2023 2nd round pick'],
    grade: 'A+',
    note: "Grandes sells Adams — a championship-year move that worked. The picks would have helped rebuild; instead Grandes won it all without needing them.",
  },
  {
    id: 't019',
    season: 2022,
    week: 7,
    party1: 'JuicyBussy',
    party2: 'tdtd19844',
    assets1: ['2023 1st round pick', '2023 2nd round pick'],
    assets2: ['Justin Jefferson (WR)'],
    grade: 'A+',
    note: "JuicyBussy pays up for the best WR in dynasty. Jefferson's dynasty value and JuicyBussy's ceiling both peak here.",
  },
  {
    id: 't020',
    season: 2021,
    week: 8,
    party1: 'MLSchools12',
    party2: 'rbr',
    assets1: ['2022 1st round pick (1.01)', '2022 2nd round pick'],
    assets2: ['Najee Harris (RB)', '2022 3rd round pick'],
    grade: 'B+',
    note: 'MLSchools12 sells draft capital for immediate production. The #1.01 pick was used on Breece Hall by rbr — a dynasty cornerstone.',
  },
  {
    id: 't021',
    season: 2021,
    week: 3,
    party1: 'Cogdeill11',
    party2: 'eldridsm',
    assets1: ['Saquon Barkley (RB)', '2022 1st round pick'],
    assets2: ['Jonathan Taylor (RB)', '2022 2nd round pick'],
    grade: 'A',
    note: "Cogdeill11 moves the injury-prone Barkley for the ascending JT. This was the right call — JT won the 2021 rushing title.",
  },
  {
    id: 't022',
    season: 2020,
    week: 5,
    party1: 'Grandes',
    party2: 'Cogdeill11',
    assets1: ['Clyde Edwards-Helaire (RB)', '2021 1st round pick'],
    assets2: ['Lamar Jackson (QB)'],
    grade: 'A+',
    note: 'Grandes acquires Lamar as a dynasty cornerstone QB. The deal anchored a multi-year contention window. Cogdeill11 won the 2020 championship without Lamar.',
  },
];

const SEASONS = ['All', '2025', '2024', '2023', '2022', '2021', '2020'] as const;
const GRADES  = ['All', 'A+', 'A', 'B+', 'B'] as const;
const PAGE_SIZE = 10;

type SeasonFilter = typeof SEASONS[number];
type GradeFilter  = typeof GRADES[number];

// ─── Grade badge ──────────────────────────────────────────────────────────────

function gradeBadgeClass(grade: string): string {
  switch (grade) {
    case 'A+': return 'bg-[#ffd700] text-[#1a1a2e] font-black';
    case 'A':  return 'bg-emerald-500 text-white font-bold';
    case 'B+': return 'bg-blue-500 text-white font-bold';
    case 'B':  return 'bg-slate-500 text-white font-bold';
    default:   return 'bg-slate-600 text-white font-bold';
  }
}

// ─── Trade Card ───────────────────────────────────────────────────────────────

function TradeCard({ trade }: { trade: Trade }) {
  return (
    <article className="bg-[#16213e] border border-[#2d4a66] rounded-xl overflow-hidden">
      {/* Header row */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2d4a66] bg-[#0d1b2a]/50">
        <span className="text-xs text-slate-400 font-medium">
          {trade.season} Season &bull; Week {trade.week}
        </span>
        <span
          className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs tracking-wide',
            gradeBadgeClass(trade.grade)
          )}
        >
          Grade: {trade.grade}
        </span>
      </div>

      {/* Exchange display */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-center">
          {/* Party 1 side */}
          <div>
            <p className="text-[#ffd700] font-bold text-sm mb-2">{trade.party1} sends</p>
            <ul className="space-y-1">
              {trade.assets1.map((asset) => (
                <li
                  key={asset}
                  className="text-slate-200 text-sm bg-[#0d1b2a] border border-[#2d4a66] rounded px-2.5 py-1"
                >
                  {asset}
                </li>
              ))}
            </ul>
          </div>

          {/* Arrow */}
          <div className="flex sm:flex-col items-center justify-center gap-1 py-1">
            <ArrowRight className="w-4 h-4 text-[#e94560] rotate-0 sm:rotate-90" aria-hidden="true" />
            <ArrowRight className="w-4 h-4 text-[#e94560] rotate-180 sm:-rotate-90" aria-hidden="true" />
          </div>

          {/* Party 2 side */}
          <div>
            <p className="text-[#ffd700] font-bold text-sm mb-2">{trade.party2} sends</p>
            <ul className="space-y-1">
              {trade.assets2.map((asset) => (
                <li
                  key={asset}
                  className="text-slate-200 text-sm bg-[#0d1b2a] border border-[#2d4a66] rounded px-2.5 py-1"
                >
                  {asset}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Note */}
        <p className="mt-3 pt-3 border-t border-[#2d4a66] text-slate-400 text-xs leading-relaxed italic">
          {trade.note}
        </p>
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TradesPage() {
  const [seasonFilter, setSeasonFilter] = useState<SeasonFilter>('All');
  const [gradeFilter, setGradeFilter]   = useState<GradeFilter>('All');
  const [page, setPage] = useState(1);

  const filtered = TRADES.filter((t) => {
    const seasonMatch = seasonFilter === 'All' || t.season === Number(seasonFilter);
    const gradeMatch  = gradeFilter  === 'All' || t.grade === gradeFilter;
    return seasonMatch && gradeMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Reset to page 1 when filters change
  function handleSeasonFilter(val: SeasonFilter) {
    setSeasonFilter(val);
    setPage(1);
  }
  function handleGradeFilter(val: GradeFilter) {
    setGradeFilter(val);
    setPage(1);
  }

  return (
    <>
      <Head>
        <title>Trade History — BMFFFL</title>
        <meta
          name="description"
          content="Complete trade history for the BMFFFL dynasty fantasy football league."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-[#0d1b2a]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* ── Page Header ─────────────────────────────────────────────── */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-2">
              Trade History
            </h1>
            <p className="text-slate-400 text-sm">
              Notable transactions that shaped the BMFFFL dynasty landscape.
            </p>
          </div>

          {/* ── Filter Controls ──────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-[#16213e] border border-[#2d4a66] rounded-xl">
            {/* Season filter */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Season
              </span>
              <div className="flex flex-wrap gap-2">
                {SEASONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSeasonFilter(s)}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-150',
                      seasonFilter === s
                        ? 'bg-[#e94560] text-white'
                        : 'bg-[#0d1b2a] text-slate-300 border border-[#2d4a66] hover:border-[#e94560] hover:text-[#e94560]'
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden sm:block w-px bg-[#2d4a66]" aria-hidden="true" />

            {/* Grade filter */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Grade
              </span>
              <div className="flex flex-wrap gap-2">
                {GRADES.map((g) => (
                  <button
                    key={g}
                    onClick={() => handleGradeFilter(g)}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-150',
                      gradeFilter === g
                        ? 'bg-[#ffd700] text-[#1a1a2e]'
                        : 'bg-[#0d1b2a] text-slate-300 border border-[#2d4a66] hover:border-[#ffd700] hover:text-[#ffd700]'
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Results Count ────────────────────────────────────────────── */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs text-slate-500">
              {filtered.length === 0
                ? 'No trades match filters'
                : `Showing ${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, filtered.length)} of ${filtered.length} trades`}
            </p>
            {totalPages > 1 && (
              <p className="text-xs text-slate-500">Page {safePage} of {totalPages}</p>
            )}
          </div>

          {/* ── Trade Cards ──────────────────────────────────────────────── */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              No trades match the selected filters.
            </div>
          ) : (
            <div className="space-y-5">
              {paginated.map((trade) => (
                <TradeCard key={trade.id} trade={trade} />
              ))}
            </div>
          )}

          {/* ── Pagination ───────────────────────────────────────────────── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium bg-[#16213e] border border-[#2d4a66] text-slate-300 hover:border-[#ffd700] hover:text-[#ffd700] disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" /> Prev
              </button>
              <div className="flex gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      'w-8 h-8 rounded-lg text-sm font-bold transition-colors duration-150',
                      p === safePage
                        ? 'bg-[#ffd700] text-[#0d1b2a]'
                        : 'bg-[#16213e] border border-[#2d4a66] text-slate-400 hover:border-[#ffd700] hover:text-[#ffd700]'
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium bg-[#16213e] border border-[#2d4a66] text-slate-300 hover:border-[#ffd700] hover:text-[#ffd700] disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
              >
                Next <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
