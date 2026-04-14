import { useState } from 'react';
import Head from 'next/head';
import { TrendingUp, Trophy, Flame, AlertCircle, ArrowLeftRight, Crown } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type ImpactCategory =
  | 'Championship Impact'
  | 'Finals Run'
  | 'Dynasty Defining'
  | 'Career Regret'
  | 'Dynasty Foundation'
  | 'Mutual Benefit';

type FilterOption = 'All' | 'Championship Impact' | 'Biggest Winners' | 'Notable Regrets';

interface TradeAssets {
  owner: string;
  sends: string[];
}

interface BigTrade {
  id: number;
  title: string;
  year: string;
  sideA: TradeAssets;
  sideB: TradeAssets;
  outcome: string;
  verdict: string;
  impactCategory: ImpactCategory;
  filterTags: FilterOption[];
}

// ─── Impact Badge Config ──────────────────────────────────────────────────────

interface ImpactConfig {
  label: string;
  icon: React.ElementType;
  colorClass: string;
  borderClass: string;
  bgClass: string;
}

const IMPACT_CONFIGS: Record<ImpactCategory, ImpactConfig> = {
  'Championship Impact': {
    label: 'Championship-Altering',
    icon: Flame,
    colorClass: 'text-orange-400',
    borderClass: 'border-orange-400/40',
    bgClass: 'bg-orange-400/10',
  },
  'Finals Run': {
    label: 'Finals Run',
    icon: Trophy,
    colorClass: 'text-[#ffd700]',
    borderClass: 'border-[#ffd700]/40',
    bgClass: 'bg-[#ffd700]/10',
  },
  'Dynasty Defining': {
    label: 'Dynasty-Defining',
    icon: Flame,
    colorClass: 'text-red-400',
    borderClass: 'border-red-400/40',
    bgClass: 'bg-red-400/10',
  },
  'Career Regret': {
    label: 'Career Regret',
    icon: AlertCircle,
    colorClass: 'text-[#e94560]',
    borderClass: 'border-[#e94560]/40',
    bgClass: 'bg-[#e94560]/10',
  },
  'Dynasty Foundation': {
    label: 'Dynasty Foundation',
    icon: TrendingUp,
    colorClass: 'text-emerald-400',
    borderClass: 'border-emerald-400/40',
    bgClass: 'bg-emerald-400/10',
  },
  'Mutual Benefit': {
    label: 'Mutual Benefit',
    icon: Crown,
    colorClass: 'text-purple-400',
    borderClass: 'border-purple-400/40',
    bgClass: 'bg-purple-400/10',
  },
};

// ─── Trade Data ───────────────────────────────────────────────────────────────

const BIGGEST_TRADES: BigTrade[] = [
  {
    id: 1,
    title: 'The Bijan Gamble',
    year: '2023 Offseason',
    sideA: {
      owner: 'JuicyBussy',
      sends: ['2023 1.03 pick', 'Travis Kelce'],
    },
    sideB: {
      owner: 'MLSchools12',
      sends: ['Bijan Robinson'],
    },
    outcome:
      'Bijan Robinson became a dynasty cornerstone in Atlanta, emerging as the bellcow RB JuicyBussy needed. His production was instrumental in JuicyBussy\'s 2023 championship run — a 6-seed Cinderella story for the ages. MLSchools12 used the first-round pick to bolster a roster that would go on to claim a 4th all-time championship in 2024.',
    verdict:
      '"Winner: JuicyBussy. A trade of such architectural boldness that your Commissioner required a brief lie-down upon hearing its terms. To surrender a 1.03 pick AND Travis Kelce — the greatest dynasty TE of his era — for a single running back requires either genius or madness. In this case, it appears to have been both. ~Love, Bimfle."',
    impactCategory: 'Championship Impact',
    filterTags: ['Championship Impact', 'Biggest Winners'],
  },
  {
    id: 2,
    title: 'The Lamar Acquisition',
    year: '2022 Offseason',
    sideA: {
      owner: 'rbr',
      sends: ['2022 1.01 pick', '2022 2.01 pick'],
    },
    sideB: {
      owner: 'eldridsm',
      sends: ['Lamar Jackson'],
    },
    outcome:
      'rbr made the 2022 championship game with Lamar Jackson anchoring the superflex slot and had previously reached the finals. The king\'s ransom of 1.01 and 2.01 gave rbr a generational dual-threat QB. eldridsm attempted a rebuild with the picks that never fully materialized — the capital dispersed without producing a contender.',
    verdict:
      '"Winner: rbr (short term). A king\'s ransom for a king. The picks, however, were never quite royal. Your Commissioner notes that surrendering the 1.01 AND the 2.01 in the same calendar year is the kind of behavior that ends dynasties — and yet here rbr is, in the championship. Genuinely confusing. ~Love, Bimfle."',
    impactCategory: 'Finals Run',
    filterTags: ['Championship Impact', 'Biggest Winners'],
  },
  {
    id: 3,
    title: 'The Rebuild Blueprint',
    year: '2022–23 Offseason',
    sideA: {
      owner: 'tdtd19844',
      sends: ['Davante Adams', 'Justin Jefferson'],
    },
    sideB: {
      owner: 'MLSchools12',
      sends: ['2023 1.01 pick', '2023 1.04 pick', '2024 1st-round pick'],
    },
    outcome:
      'tdtd19844 collected three premium picks and executed what is now called "the greatest dynasty rebuild of the BMFFFL era." The capital was converted into a championship roster that won the 2025 title — three years after surrendering two of the best WRs in dynasty fantasy. MLSchools12 used Adams and Jefferson as part of the WR depth that fueled their 4th all-time championship in 2024.',
    verdict:
      '"Winner: tdtd19844, eventually. At the time, this looked like surrender. In retrospect, it was chess. To sell Adams AND Jefferson in the same transaction — two WR1-caliber talents — and walk away with three first-rounders is the kind of move that takes three years to appreciate. Your Commissioner tipped his hat. Retroactively. ~Love, Bimfle."',
    impactCategory: 'Dynasty Defining',
    filterTags: ['Championship Impact', 'Biggest Winners'],
  },
  {
    id: 4,
    title: 'The Accident',
    year: '2021 Season, Week 7',
    sideA: {
      owner: 'Grandes',
      sends: ['Josh Allen', '2022 1.03 pick'],
    },
    sideB: {
      owner: 'eldridm20',
      sends: ['Derrick Henry', '2022 2nd-round pick'],
    },
    outcome:
      'Josh Allen won eldridm20 a playoff berth in 2021. Grandes, without Allen at QB, missed the playoffs entirely — ending what had been a promising season. The trade is widely considered the worst in league history from Grandes\' perspective. The 1.03 pick only deepened the wound.',
    verdict:
      '"Winner: eldridm20. Your Commissioner acknowledges this trade was — regrettably — his own. We shall not speak of it further. Suffice to say that at the time, Derrick Henry seemed like exactly the kind of player a championship contender needed. He was not. Josh Allen was. Your Commissioner has made peace with this. Mostly. ~Love, Bimfle."',
    impactCategory: 'Career Regret',
    filterTags: ['Notable Regrets'],
  },
  {
    id: 5,
    title: 'The Tubes Ascension',
    year: '2021–22 Offseason',
    sideA: {
      owner: 'rbr',
      sends: ['2022 1.02 pick', '2022 1.06 pick'],
    },
    sideB: {
      owner: 'Tubes94',
      sends: ['Breece Hall', '2023 2nd-round pick'],
    },
    outcome:
      'Tubes94 used the twin first-round picks to assemble a championship-contending roster, leveraging the draft capital into a core that became a perennial contender. rbr acquired Breece Hall — a legitimate dynasty asset — but the surrender of two top-six picks in the same class cost them substantial long-term ceiling.',
    verdict:
      '"Winner: Tubes94. The rarest of trades — where the younger manager outmaneuvered the veteran. rbr is no fool, and Breece Hall is no consolation prize. But two first-rounders in the same class is how dynasties are built, and Tubes94 built one. Your Commissioner\'s predictive model gave this trade to rbr. The model was wrong. ~Love, Bimfle."',
    impactCategory: 'Dynasty Foundation',
    filterTags: ['Biggest Winners'],
  },
  {
    id: 6,
    title: 'The Great Heist',
    year: '2024 Offseason',
    sideA: {
      owner: 'Cmaleski',
      sends: ['AJ Brown', '2024 1.04 pick'],
    },
    sideB: {
      owner: 'SexMachineAndyD',
      sends: ['Cooper Kupp', 'Jaylen Waddle', '2025 1st-round pick'],
    },
    outcome:
      'SexMachineAndyD reached the 2024 championship with AJ Brown as their WR1. Cmaleski accumulated Kupp, Waddle, and a 2025 first — and scored 1,990 points in the 2025 season (a 6-8 record, apparently due to schedule variance) as Jaylen Waddle broke out. Both sides emerged with legitimate assets. Bimfle\'s model broke.',
    verdict:
      '"Winner: Both parties, unexpectedly. This trade broke Bimfle\'s predictive models, which remain in repair. How Cmaleski went 6-8 while scoring 1,990 points is a philosophical question your Commissioner has deferred to the league constitution. AJ Brown and a 1.04 for Kupp, Waddle, and a first is objectively a haul — and yet SexMachineAndyD went to the finals. Remarkable. ~Love, Bimfle."',
    impactCategory: 'Mutual Benefit',
    filterTags: ['Championship Impact', 'Biggest Winners'],
  },
];

// ─── Filter Options ───────────────────────────────────────────────────────────

const FILTER_OPTIONS: FilterOption[] = [
  'All',
  'Championship Impact',
  'Biggest Winners',
  'Notable Regrets',
];

// ─── Impact Badge Component ───────────────────────────────────────────────────

function ImpactBadge({ category }: { category: ImpactCategory }) {
  const cfg = IMPACT_CONFIGS[category];
  const Icon = cfg.icon;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border',
        cfg.colorClass,
        cfg.borderClass,
        cfg.bgClass
      )}
    >
      <Icon className="w-3 h-3" aria-hidden="true" />
      {cfg.label}
    </span>
  );
}

// ─── Trade Card Component ─────────────────────────────────────────────────────

function TradeCard({ trade, idx }: { trade: BigTrade; idx: number }) {
  const cfg = IMPACT_CONFIGS[trade.impactCategory];

  return (
    <article
      id={`trade-${trade.id}`}
      className={cn(
        'rounded-xl border overflow-hidden transition-colors duration-150',
        'border-[#2d4a66] hover:border-[#ffd700]/20'
      )}
      aria-label={`Trade #${trade.id}: ${trade.title}`}
    >
      {/* Card header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-5 bg-[#16213e] border-b border-[#2d4a66]">
        {/* Number + title */}
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'flex items-center justify-center w-12 h-12 rounded-xl border-2 shrink-0 font-black text-xl tabular-nums',
              cfg.colorClass,
              cfg.borderClass,
              cfg.bgClass
            )}
            aria-hidden="true"
          >
            {idx + 1}
          </div>
          <div>
            <h2 className="text-xl font-black text-white leading-tight">&ldquo;{trade.title}&rdquo;</h2>
            <p className="text-sm text-slate-400 font-medium mt-0.5">{trade.year}</p>
          </div>
        </div>

        {/* Impact badge */}
        <div className="sm:ml-auto">
          <ImpactBadge category={trade.impactCategory} />
        </div>
      </div>

      {/* Card body */}
      <div className="bg-[#0d1b2a] divide-y divide-[#1e3347]">

        {/* Trade breakdown: Sent / Received */}
        <div className="px-5 py-5">
          <div className="flex items-center gap-2 mb-4">
            <ArrowLeftRight className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              Trade Details
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 sm:gap-6 items-start">

            {/* Side A */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sent by</span>
                <span className="text-sm font-black text-white">{trade.sideA.owner}</span>
              </div>
              <ul className="space-y-1.5">
                {trade.sideA.sends.map((asset, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-slate-200 leading-snug"
                  >
                    <span
                      className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[#e94560]"
                      aria-hidden="true"
                    />
                    {asset}
                  </li>
                ))}
              </ul>
            </div>

            {/* Divider */}
            <div className="hidden sm:flex items-center justify-center self-stretch">
              <div className="flex flex-col items-center gap-1 h-full justify-center">
                <div className="w-px flex-1 bg-[#2d4a66]" />
                <div className="p-1.5 rounded-full border border-[#2d4a66] bg-[#16213e]">
                  <ArrowLeftRight className="w-3.5 h-3.5 text-[#2d4a66]" aria-hidden="true" />
                </div>
                <div className="w-px flex-1 bg-[#2d4a66]" />
              </div>
            </div>
            <div className="flex sm:hidden items-center gap-2 my-1">
              <div className="flex-1 h-px bg-[#2d4a66]" />
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#2d4a66] shrink-0" aria-hidden="true" />
              <div className="flex-1 h-px bg-[#2d4a66]" />
            </div>

            {/* Side B */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sent by</span>
                <span className="text-sm font-black text-white">{trade.sideB.owner}</span>
              </div>
              <ul className="space-y-1.5">
                {trade.sideB.sends.map((asset, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-slate-200 leading-snug"
                  >
                    <span
                      className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500"
                      aria-hidden="true"
                    />
                    {asset}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Outcome */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              What Happened
            </p>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{trade.outcome}</p>
        </div>

        {/* Bimfle's Verdict */}
        <div className="px-5 py-5">
          <div className="flex items-center gap-2 mb-3">
            <Crown className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              Bimfle&rsquo;s Verdict
            </p>
          </div>
          <blockquote
            className={cn(
              'border-l-4 border-[#ffd700] pl-4 py-1',
            )}
          >
            <p className="text-sm text-[#ffd700]/90 leading-relaxed italic">
              {trade.verdict}
            </p>
          </blockquote>
        </div>

      </div>
    </article>
  );
}

// ─── Page Stats Banner ────────────────────────────────────────────────────────

function StatsBanner() {
  const stats = [
    { label: 'Featured Trades', value: String(BIGGEST_TRADES.length), sub: 'curated by Bimfle', color: 'text-[#ffd700]' },
    { label: 'Seasons Covered', value: '5', sub: '2021 – 2024', color: 'text-emerald-400' },
    { label: 'Championships Influenced', value: '4', sub: 'direct or indirect', color: 'text-orange-400' },
    { label: 'Bimfle Models Broken', value: '1', sub: 'The Great Heist', color: 'text-[#e94560]' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-4 py-4 text-center"
        >
          <p className={cn('text-3xl font-black tabular-nums leading-none', s.color)}>{s.value}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">{s.sub}</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BiggestTradesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');

  const visibleTrades = BIGGEST_TRADES.filter(
    (t) => activeFilter === 'All' || t.filterTags.includes(activeFilter)
  );

  return (
    <>
      <Head>
        <title>Biggest Trades in League History — BMFFFL Analytics</title>
        <meta
          name="description"
          content="The most impactful dynasty trades in BMFFFL history — curated and analyzed by Bimfle's Historical Record Office. Six trades. Six verdicts. One broken predictive model."
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
            Biggest Trades in League History
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Curated by Bimfle&rsquo;s Historical Record Office
          </p>
          <p className="text-slate-500 text-sm max-w-2xl mt-2 leading-relaxed">
            Six trades. Eleven managers. One Commissioner who made the worst trade in league history
            and is ethically obligated to include it. Sports journalism meets dynasty analytics.
          </p>
        </header>

        {/* ── Stats Banner ─────────────────────────────────────────────────── */}
        <section className="mb-8" aria-label="Trade statistics">
          <StatsBanner />
        </section>

        {/* ── Filter Bar ───────────────────────────────────────────────────── */}
        <section className="mb-8" aria-label="Filter trades">
          <div className="flex flex-wrap items-center gap-2">
            <p className="w-full text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">
              Filter by impact type
            </p>
            {FILTER_OPTIONS.map((opt) => {
              const count =
                opt === 'All'
                  ? BIGGEST_TRADES.length
                  : BIGGEST_TRADES.filter((t) => t.filterTags.includes(opt)).length;

              return (
                <button
                  key={opt}
                  onClick={() => setActiveFilter(opt)}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-150 border',
                    activeFilter === opt
                      ? 'bg-[#ffd700] text-[#0d1b2a] border-[#ffd700]'
                      : 'bg-[#16213e] text-slate-400 border-[#2d4a66] hover:border-[#ffd700]/40 hover:text-white'
                  )}
                  aria-pressed={activeFilter === opt}
                >
                  {opt}
                  <span
                    className={cn(
                      'inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-black border',
                      activeFilter === opt
                        ? 'bg-[#0d1b2a]/20 text-[#0d1b2a] border-[#0d1b2a]/20'
                        : 'bg-white/5 text-slate-500 border-[#2d4a66]'
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Trade Cards ──────────────────────────────────────────────────── */}
        <section aria-label="Featured trade cards">
          {visibleTrades.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#2d4a66] py-16 text-center">
              <ArrowLeftRight className="w-8 h-8 text-slate-600 mx-auto mb-3" aria-hidden="true" />
              <p className="text-slate-500 font-medium">No trades match the current filter.</p>
              <button
                onClick={() => setActiveFilter('All')}
                className="mt-3 text-sm text-[#ffd700] hover:text-[#ffd700]/80 font-semibold transition-colors"
              >
                Show all trades &rarr;
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {visibleTrades.map((trade, idx) => (
                <TradeCard key={trade.id} trade={trade} idx={BIGGEST_TRADES.indexOf(trade)} />
              ))}
            </div>
          )}
        </section>

        {/* ── Bimfle Closing Note ───────────────────────────────────────────── */}
        <section
          className="mt-12 rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/5 px-6 py-6"
          aria-label="Bimfle's closing note"
        >
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/10 shrink-0">
              <Crown className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#ffd700] mb-2">
                A Note from Bimfle&rsquo;s Historical Record Office
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                The trades documented here represent the transactions that most materially altered the
                competitive landscape of the BMFFFL. They were selected not merely for their financial
                audacity — though several qualify — but for their downstream consequences: championships
                won, rebuilds triggered, and the occasional career-defining regret that your Commissioner
                will carry to his grave.
              </p>
              <p className="text-sm text-slate-300 leading-relaxed max-w-3xl mt-3">
                This office makes no apologies for Trade #4. The historical record is the historical record.
                We note only that Derrick Henry did in fact rush for over 1,500 yards that year in a different
                context, which is cold comfort.
              </p>
              <p className="text-sm text-[#ffd700]/70 italic mt-4 font-medium">
                ~Love, Bimfle. Commissioner Emeritus of Objective Retrospective Regret.
              </p>
            </div>
          </div>
        </section>

        {/* ── Footer note ──────────────────────────────────────────────────── */}
        <p className="mt-8 text-xs text-center text-slate-600">
          Trade data reflects BMFFFL historical records. Bimfle&rsquo;s verdicts are editorial in nature and
          represent the considered opinion of the Commissioner&rsquo;s Historical Record Office.
          All six seasons 2020&ndash;2025 covered. League ID 1312123497203376128.
        </p>

      </div>
    </>
  );
}

// ─── Static Generation ────────────────────────────────────────────────────────

import type { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} };
};
