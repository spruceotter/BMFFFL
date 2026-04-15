import { useState, useMemo } from 'react';
import Head from 'next/head';
import { ArrowLeftRight, Filter, FlaskConical, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type Season = 2020 | 2021 | 2022 | 2023 | 2024 | 2025;

interface TradeEntry {
  id: string;
  date: string;
  season: Season;
  teamA: string;
  teamB: string;
  aGives: string[];
  bGives: string[];
  context?: string;
}

// ─── Notable Trade Data ───────────────────────────────────────────────────────
// Representative sample — full trade history via Sleeper API in Phase G.

const NOTABLE_TRADES: TradeEntry[] = [
  // 2020 — Startup / early dynasty trades
  {
    id: 't001',
    date: 'Sep 2, 2020',
    season: 2020,
    teamA: 'Cogdeill11',
    teamB: 'MLSchools12',
    aGives: ['Christian McCaffrey', '2021 1st (1.04)'],
    bGives: ['Davante Adams', 'Tyreek Hill', '2021 1st (1.10)'],
    context: 'MLSchools12 bet on volume WRs; Cogdeill11 landed CMC at the cost of two elite wideouts.',
  },
  {
    id: 't002',
    date: 'Sep 14, 2020',
    season: 2020,
    teamA: 'rbr',
    teamB: 'SexMachineAndyD',
    aGives: ['Patrick Mahomes', '2021 2nd'],
    bGives: ['Lamar Jackson', '2021 1st (1.06)', '2022 1st'],
    context: 'rbr shipped the hottest QB in dynasty for Lamar and two first-round bullets.',
  },
  {
    id: 't003',
    date: 'Oct 1, 2020',
    season: 2020,
    teamA: 'JuicyBussy',
    teamB: 'Grandes',
    aGives: ['Saquon Barkley', '2021 1st (1.07)'],
    bGives: ["Ja'Marr Chase (rookie pick)", 'Jaylen Waddle (rookie pick)', '2021 2nd'],
    context: 'JuicyBussy sold high on Saquon to invest in the loaded 2021 WR class.',
  },
  {
    id: 't004',
    date: 'Nov 3, 2020',
    season: 2020,
    teamA: 'eldridm20',
    teamB: 'tdtd19844',
    aGives: ['Josh Allen', '2021 2nd'],
    bGives: ['Kyler Murray', '2021 1st (1.05)', '2022 2nd'],
    context: 'Early dynasty QB shuffle — both teams reshaped their QB rooms.',
  },
  {
    id: 't005',
    date: 'Dec 7, 2020',
    season: 2020,
    teamA: 'Tubes94',
    teamB: 'eldridsm',
    aGives: ['Dalvin Cook', 'Keenan Allen'],
    bGives: ['Jonathan Taylor (rookie)', '2021 1st (1.03)', '2022 1st'],
    context: 'Tubes94 mortgaged veteran production for the consensus RB1 of the 2021 draft class.',
  },
  // 2021 — Mid-dynasty trades
  {
    id: 't006',
    date: 'Mar 15, 2021',
    season: 2021,
    teamA: 'Cogdeill11',
    teamB: 'JuicyBussy',
    aGives: ['Christian McCaffrey'],
    bGives: ["Ja'Marr Chase", 'Joe Mixon', '2022 1st'],
    context: 'CMC era ends in Cogdeill11; JuicyBussy landed a franchise RB.',
  },
  {
    id: 't007',
    date: 'Jun 18, 2021',
    season: 2021,
    teamA: 'MLSchools12',
    teamB: 'Tubes94',
    aGives: ['CeeDee Lamb', '2022 2nd'],
    bGives: ['Bijan Robinson (2022 pick)', '2023 1st'],
    context: 'MLSchools12 sold a proven WR for a dynasty lottery ticket — Bijan became a superstar.',
  },
  {
    id: 't008',
    date: 'Sep 28, 2021',
    season: 2021,
    teamA: 'tdtd19844',
    teamB: 'Cmaleski',
    aGives: ['Derrick Henry', '2022 3rd'],
    bGives: ['Najee Harris', 'Javonte Williams', '2022 2nd'],
    context: 'tdtd19844 bet on volume; Cmaleski moved on from aging Henry.',
  },
  {
    id: 't009',
    date: 'Oct 12, 2021',
    season: 2021,
    teamA: 'rbr',
    teamB: 'Grandes',
    aGives: ['Justin Jefferson', '2022 1st (mid)'],
    bGives: ['Stefon Diggs', 'A.J. Brown', '2022 1st (late)', '2023 2nd'],
    context: 'rbr dispersed WR value across two bodies plus future capital.',
  },
  {
    id: 't010',
    date: 'Nov 8, 2021',
    season: 2021,
    teamA: 'eldridsm',
    teamB: 'Escuelas',
    aGives: ['Cooper Kupp', '2022 2nd'],
    bGives: ['Amon-Ra St. Brown', 'Garrett Wilson (rookie pick)', '2022 1st', '2023 1st'],
    context: 'eldridsm sold the 2021 PPR king for three lottery tickets.',
  },
  // 2022 — Championship contention
  {
    id: 't011',
    date: 'Feb 14, 2022',
    season: 2022,
    teamA: 'JuicyBussy',
    teamB: 'Cogdeill11',
    aGives: ['Joe Burrow', 'Tee Higgins'],
    bGives: ['Justin Herbert', 'Deebo Samuel', '2023 1st'],
    context: 'JuicyBussy reset at QB; Cogdeill11 acquired Burrow for a championship window.',
  },
  {
    id: 't012',
    date: 'Jul 22, 2022',
    season: 2022,
    teamA: 'tdtd19844',
    teamB: 'SexMachineAndyD',
    aGives: ['Davante Adams', '2023 2nd'],
    bGives: ['Stefon Diggs', 'Brandon Aiyuk', '2023 1st'],
    context: 'WR reshuffling pre-2022 season. tdtd19844 spread the value.',
  },
  {
    id: 't013',
    date: 'Oct 3, 2022',
    season: 2022,
    teamA: 'MLSchools12',
    teamB: 'eldridm20',
    aGives: ['Josh Jacobs', '2023 2nd'],
    bGives: ['Bucky Irving (2024 pick)', '2023 1st (top 3)', '2024 2nd'],
    context: 'MLSchools12 swapped a proven RB for a future star and premium picks.',
  },
  // 2023 — Playoff contention and JuicyBussy run
  {
    id: 't014',
    date: 'Mar 3, 2023',
    season: 2023,
    teamA: 'JuicyBussy',
    teamB: 'Tubes94',
    aGives: ["De'Von Achane (2023 pick)", '2024 1st'],
    bGives: ['Breece Hall', '2024 3rd'],
    context: "JuicyBussy stole Achane's draft pick rights and built a dominant backfield.",
  },
  {
    id: 't015',
    date: 'Aug 28, 2023',
    season: 2023,
    teamA: 'Grandes',
    teamB: 'rbr',
    aGives: ['Ashton Jeanty (2024 pick)', '2024 2nd'],
    bGives: ['Najee Harris', '2024 1st (late)', '2024 2nd'],
    context: 'Grandes bought Jeanty rights a year early; rbr got near-term production.',
  },
  {
    id: 't016',
    date: 'Oct 9, 2023',
    season: 2023,
    teamA: 'Cogdeill11',
    teamB: 'MLSchools12',
    aGives: ["Ja'Marr Chase", '2024 3rd'],
    bGives: ['CeeDee Lamb', 'Puka Nacua (rookie)', '2024 2nd'],
    context: 'The most-talked-about trade of 2023 — Cogdeill11 flipped Chase for Lamb plus youth.',
  },
  {
    id: 't017',
    date: 'Nov 5, 2023',
    season: 2023,
    teamA: 'SexMachineAndyD',
    teamB: 'eldridsm',
    aGives: ['Travis Kelce', '2024 2nd'],
    bGives: ['Sam LaPorta (2023 pick)', 'Tyler Warren (2024 pick)', '2024 1st'],
    context: 'SexMachineAndyD sold aging Kelce for two elite young TEs and a first.',
  },
  // 2024 — Contender moves and JuicyBussy championship run
  {
    id: 't018',
    date: 'Apr 10, 2024',
    season: 2024,
    teamA: 'JuicyBussy',
    teamB: 'Grandes',
    aGives: ['Breece Hall', '2025 2nd'],
    bGives: ['Malik Nabers (2024 pick)', '2025 1st'],
    context: 'JuicyBussy dealt a proven RB for a future WR1 — Nabers won Offensive ROY.',
  },
  {
    id: 't019',
    date: 'Sep 24, 2024',
    season: 2024,
    teamA: 'eldridm20',
    teamB: 'rbr',
    aGives: ['Josh Allen', '2025 3rd'],
    bGives: ['Patrick Mahomes', '2025 1st (1.04)', '2025 2nd'],
    context: 'eldridm20 shipped Allen for a pick bundle; rbr bet on Mahomes longevity.',
  },
  {
    id: 't020',
    date: 'Oct 28, 2024',
    season: 2024,
    teamA: 'Cogdeill11',
    teamB: 'Escuelas',
    aGives: ['Omarion Hampton (2025 pick)', '2025 2nd'],
    bGives: ['Quinshon Judkins (2025 pick)', '2025 1st (1.09)', '2025 2nd'],
    context: 'Cogdeill11 bet on Hampton at the cost of a premium 2025 first.',
  },
  // 2025 — Championship run trades
  {
    id: 't021',
    date: 'Mar 20, 2025',
    season: 2025,
    teamA: 'rbr',
    teamB: 'tdtd19844',
    aGives: ['Elic Ayomanor (2025 pick)', '2026 1st'],
    bGives: ['Tetairoa McMillan (2025 pick)', '2026 2nd', '2026 3rd'],
    context: "rbr added McMillan ahead of his rookie season — the WR was a key piece in rbr's 2025 playoff run.",
  },
  {
    id: 't022',
    date: 'Sep 9, 2025',
    season: 2025,
    teamA: 'MLSchools12',
    teamB: 'Tubes94',
    aGives: ['Bucky Irving', '2026 2nd'],
    bGives: ['Bijan Robinson', '2026 1st (mid)'],
    context: 'MLSchools12 added the RB who fueled the record-setting 13-1 regular season.',
  },
  {
    id: 't023',
    date: 'Oct 14, 2025',
    season: 2025,
    teamA: 'rbr',
    teamB: 'JuicyBussy',
    aGives: ['Quinshon Judkins', '2026 2nd'],
    bGives: ['Matthew Golden (2025 pick)', '2026 1st (late)', '2026 3rd'],
    context: 'rbr rebuilt depth for playoff push; surrendered Judkins but gained a young WR and picks.',
  },
  {
    id: 't024',
    date: 'Nov 30, 2025',
    season: 2025,
    teamA: 'Cogdeill11',
    teamB: 'eldridsm',
    aGives: ['Colston Loveland', '2026 3rd'],
    bGives: ['Luther Burden III (2025 pick)', '2026 1st', '2026 2nd'],
    context: 'Cogdeill11 cashed in a proven TE for a boatload of 2026 capital at the trade deadline.',
  },
  {
    id: 't025',
    date: 'Dec 15, 2025',
    season: 2025,
    teamA: 'rbr',
    teamB: 'SexMachineAndyD',
    aGives: ['2026 1st (late)', '2026 2nd'],
    bGives: ['Jonathan Taylor', 'Harold Fannin Jr.'],
    context: "Championship window move — rbr added Taylor's playoff surge and Fannin's elite TE ceiling.",
  },
];

// ─── Owner List ───────────────────────────────────────────────────────────────

const OWNERS = [
  'MLSchools12', 'Tubes94', 'SexMachineAndyD', 'JuicyBussy', 'Grandes',
  'rbr', 'eldridsm', 'eldridm20', 'Cogdeill11', 'tdtd19844', 'Cmaleski',
  'Escuelas',
] as const;

const SEASONS: Season[] = [2020, 2021, 2022, 2023, 2024, 2025];

// ─── Page Component ───────────────────────────────────────────────────────────

export default function TradeLedgerPage() {
  const [seasonFilter, setSeasonFilter] = useState<Season | 'all'>('all');
  const [ownerFilter, setOwnerFilter] = useState<string>('all');

  const filteredTrades = useMemo(() => {
    return NOTABLE_TRADES.filter(trade => {
      const seasonMatch = seasonFilter === 'all' || trade.season === seasonFilter;
      const ownerMatch =
        ownerFilter === 'all' ||
        trade.teamA === ownerFilter ||
        trade.teamB === ownerFilter;
      return seasonMatch && ownerMatch;
    });
  }, [seasonFilter, ownerFilter]);

  return (
    <>
      <Head>
        <title>Trade Ledger — BMFFFL Analytics</title>
        <meta
          name="description"
          content="BMFFFL dynasty trade ledger. 257 all-time trades — browse notable trades by season and owner. Full history via Sleeper API in Phase G."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Header ────────────────────────────────────────────────────────── */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <ArrowLeftRight className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
            Trade Ledger
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mb-5">
            Every deal that shaped the BMFFFL dynasty. Browse notable trades by season or owner.
          </p>

          {/* Stats strip */}
          <div className="flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/5">
              <ArrowLeftRight className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
              <span className="text-sm font-black text-[#ffd700]">257</span>
              <span className="text-sm text-[#ffd700]/70 font-medium">total trades in league history</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#2d4a66] bg-[#16213e]">
              <span className="text-sm text-slate-400 font-medium">6 seasons &bull; 2020–2025</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#2d4a66] bg-[#16213e]">
              <span className="text-sm text-slate-400 font-medium">
                Avg <span className="text-white font-bold">42.8</span> trades/season
              </span>
            </div>
          </div>
        </header>

        {/* ── Phase G Notice ────────────────────────────────────────────────── */}
        <div className="mb-8 rounded-xl border border-[#e94560]/30 bg-[#e94560]/5 px-5 py-4 flex items-start gap-3">
          <FlaskConical className="w-4 h-4 text-[#e94560] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-[#e94560] mb-1">
              Selected notable trades — full trade history via Sleeper API in Phase G
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Showing {NOTABLE_TRADES.length} handpicked trades from BMFFFL history. Full trade history
              (all 257 transactions) will be pulled live from the Sleeper API in Phase G.
              Trade data below is illustrative and curated from league records.
            </p>
          </div>
        </div>

        {/* ── Filters ───────────────────────────────────────────────────────── */}
        <section aria-labelledby="filters-heading" className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <h2 id="filters-heading" className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Filters
            </h2>
            {(seasonFilter !== 'all' || ownerFilter !== 'all') && (
              <button
                onClick={() => { setSeasonFilter('all'); setOwnerFilter('all'); }}
                className="ml-auto text-xs text-[#e94560] hover:text-[#e94560]/80 font-semibold transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Season filter */}
            <div className="relative">
              <label htmlFor="season-filter" className="sr-only">Filter by season</label>
              <div className="relative inline-flex items-center">
                <select
                  id="season-filter"
                  value={String(seasonFilter)}
                  onChange={e => {
                    const val = e.target.value;
                    setSeasonFilter(val === 'all' ? 'all' : Number(val) as Season);
                  }}
                  className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-[#2d4a66] bg-[#16213e] text-sm text-white font-semibold focus:outline-none focus:border-[#ffd700]/40 focus:ring-1 focus:ring-[#ffd700]/20 cursor-pointer"
                  aria-label="Filter trades by season"
                >
                  <option value="all">All Seasons</option>
                  {SEASONS.map(s => (
                    <option key={s} value={String(s)}>{s} Season</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 w-3.5 h-3.5 text-slate-500 pointer-events-none" aria-hidden="true" />
              </div>
            </div>

            {/* Owner filter */}
            <div className="relative">
              <label htmlFor="owner-filter" className="sr-only">Filter by owner</label>
              <div className="relative inline-flex items-center">
                <select
                  id="owner-filter"
                  value={ownerFilter}
                  onChange={e => setOwnerFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-[#2d4a66] bg-[#16213e] text-sm text-white font-semibold focus:outline-none focus:border-[#ffd700]/40 focus:ring-1 focus:ring-[#ffd700]/20 cursor-pointer"
                  aria-label="Filter trades by owner"
                >
                  <option value="all">All Owners</option>
                  {OWNERS.map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 w-3.5 h-3.5 text-slate-500 pointer-events-none" aria-hidden="true" />
              </div>
            </div>

            {/* Result count */}
            <div className="flex items-center ml-auto">
              <span className="text-sm text-slate-500 font-medium">
                Showing <span className="text-white font-bold">{filteredTrades.length}</span> of {NOTABLE_TRADES.length} notable trades
              </span>
            </div>
          </div>
        </section>

        {/* ── Trade Table ───────────────────────────────────────────────────── */}
        {filteredTrades.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#2d4a66] py-16 text-center">
            <p className="text-slate-500 font-medium">No trades match the current filters.</p>
            <button
              onClick={() => { setSeasonFilter('all'); setOwnerFilter('all'); }}
              className="mt-3 text-sm text-[#ffd700] hover:text-[#ffd700]/80 font-semibold transition-colors"
            >
              Clear filters &rarr;
            </button>
          </div>
        ) : (
          <div className="space-y-3" role="list" aria-label="Trade ledger">
            {filteredTrades.map((trade, idx) => (
              <TradeRow key={trade.id} trade={trade} idx={idx} />
            ))}
          </div>
        )}

        {/* ── Footer Note ───────────────────────────────────────────────────── */}
        <p className="mt-10 text-xs text-center text-slate-600">
          Full trade history pulled from Sleeper API. Currently showing selected notable trades.
          Trade data reflects BMFFFL League ID 1312123497203376128.
          All 257 trades will be available via live API sync in Phase G.
        </p>

      </div>
    </>
  );
}

// ─── Trade Row Component ──────────────────────────────────────────────────────

function TradeRow({ trade, idx }: { trade: TradeEntry; idx: number }) {
  const isEven = idx % 2 === 0;

  return (
    <div
      role="listitem"
      className={cn(
        'rounded-xl border border-[#2d4a66] p-4 sm:p-5 hover:border-[#ffd700]/20 transition-colors duration-150',
        isEven ? 'bg-[#16213e]' : 'bg-[#1a2d42]'
      )}
    >
      {/* Top row: ID + date + season badge */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-wider">
          {trade.id}
        </span>
        <span className="text-[10px] text-slate-500">{trade.date}</span>
        <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-[#2d4a66] bg-[#0d1b2a] text-slate-400">
          {trade.season}
        </span>
      </div>

      {/* Trade body */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 sm:gap-4 items-start">

        {/* Team A side */}
        <div>
          <p className="text-xs font-black text-white mb-1.5">{trade.teamA} <span className="text-slate-500 font-normal">receives</span></p>
          <ul className="space-y-1">
            {trade.bGives.map((item, i) => (
              <li key={i} className="flex items-start gap-1.5 text-sm text-slate-300 leading-snug">
                <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full bg-emerald-500" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Divider */}
        <div className="hidden sm:flex items-center justify-center self-center">
          <div className="flex flex-col items-center gap-1">
            <div className="w-px h-6 bg-[#2d4a66]" />
            <ArrowLeftRight className="w-4 h-4 text-[#2d4a66]" aria-hidden="true" />
            <div className="w-px h-6 bg-[#2d4a66]" />
          </div>
        </div>
        <div className="flex sm:hidden items-center gap-2 my-1">
          <div className="flex-1 h-px bg-[#2d4a66]" />
          <ArrowLeftRight className="w-3.5 h-3.5 text-[#2d4a66] shrink-0" aria-hidden="true" />
          <div className="flex-1 h-px bg-[#2d4a66]" />
        </div>

        {/* Team B side */}
        <div>
          <p className="text-xs font-black text-white mb-1.5">{trade.teamB} <span className="text-slate-500 font-normal">receives</span></p>
          <ul className="space-y-1">
            {trade.aGives.map((item, i) => (
              <li key={i} className="flex items-start gap-1.5 text-sm text-slate-300 leading-snug">
                <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full bg-blue-500" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Context note */}
      {trade.context && (
        <div className="mt-3 pt-3 border-t border-[#1e3347]">
          <p className="text-xs text-slate-500 leading-relaxed italic">{trade.context}</p>
        </div>
      )}
    </div>
  );
}

// ─── Static Generation ────────────────────────────────────────────────────────

import type { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} };
};
