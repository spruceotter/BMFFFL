import Head from 'next/head';
import { Trophy, Zap, TrendingUp, Award, Star, Shield } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Record Data Types ────────────────────────────────────────────────────────

interface RecordEntry {
  id: string;
  title: string;
  holder: string;
  value: string;
  context: string; // year / week / note
  icon: 'trophy' | 'zap' | 'trending' | 'award' | 'star' | 'shield';
  highlight?: boolean; // extra visual emphasis
  note?: string;       // small footnote text
}

// ─── Records Data ─────────────────────────────────────────────────────────────

const WEEKLY_RECORDS: RecordEntry[] = [
  {
    id: 'highest-score-all-time',
    title: 'Highest Single-Game Score',
    holder: 'JuicyBussy',
    value: '245.80 pts',
    context: '2021 — Week 16 Consolation',
    icon: 'zap',
    highlight: true,
    note: 'Scored during the Week 16 consolation bracket — the highest total in BMFFFL history.',
  },
  {
    id: 'highest-championship-score',
    title: 'Known Championship Score',
    holder: 'Cogdeill11',
    value: '203.10 pts',
    context: '2020 Championship (win over eldridsm 198.34)',
    icon: 'trophy',
    highlight: true,
    note: '2020 is the only season with a verified championship game score. 2021–2025 game-level data requires Sleeper API.',
  },
  {
    id: 'closest-championship',
    title: 'Closest Championship Game',
    holder: 'Cogdeill11 vs eldridsm',
    value: '4.76 pt margin',
    context: '2020 Championship — 203.10 vs 198.34',
    icon: 'award',
    highlight: true,
    note: 'The only championship decided by under 5 points.',
  },
  {
    id: 'biggest-championship-blowout',
    title: 'Biggest Championship Blowout',
    holder: 'MLSchools12',
    value: 'Data pending',
    context: '2021 Championship — game score not yet available',
    icon: 'trending',
    note: 'Requires Sleeper API enrichment for individual game-level scores.',
  },
];

const SEASON_RECORDS: RecordEntry[] = [
  {
    id: 'most-wins-season',
    title: 'Most Wins (Single Season)',
    holder: 'MLSchools12',
    value: '13–1',
    context: 'Two 13-1 seasons: 2023 and 2025',
    icon: 'trophy',
    highlight: true,
    note: 'MLSchools12 went 13-1 in both 2023 and 2025 — the only team to achieve this in back-to-back seasons.',
  },
  {
    id: 'highest-season-points',
    title: 'Highest Season Points',
    holder: 'MLSchools12',
    value: '2,327 pts',
    context: '2021 Season',
    icon: 'trending',
  },
  {
    id: 'worst-season',
    title: 'Worst Season Record',
    holder: 'MCSchools',
    value: '0–14',
    context: '2021 Season',
    icon: 'shield',
    note: 'The only 0–14 season in BMFFFL history.',
  },
];

const ALL_TIME_RECORDS: RecordEntry[] = [
  {
    id: 'most-championships',
    title: 'Most Championships',
    holder: 'MLSchools12 (The Murder Boners)',
    value: '4 Rings',
    context: '2016 · 2019 · 2021 · 2024',
    icon: 'trophy',
    highlight: true,
    note: 'Four-time champion across all eras — 2016 & 2019 (ESPN era), 2021 & 2024 (Sleeper era). Won as #1 seed in 2021, #3 seed in 2024.',
  },
  {
    id: 'most-wins-all-time',
    title: 'All-Time Wins Leader',
    holder: 'MLSchools12',
    value: '68 Wins',
    context: '68–15 · .820 win% · 2020–Present',
    icon: 'star',
    highlight: true,
    note: 'The highest win percentage (.820) in BMFFFL history across 6 seasons.',
  },
  {
    id: 'most-playoff-appearances',
    title: 'Most Playoff Appearances',
    holder: 'MLSchools12',
    value: '6 Appearances',
    context: '2020 – 2025 (every season)',
    icon: 'award',
    note: 'The only team to make the playoffs in every season they have competed.',
  },
  {
    id: 'longest-winning-streak',
    title: 'Longest Winning Streak',
    holder: 'TBD',
    value: 'Unknown',
    context: 'Data pending full week-by-week audit',
    icon: 'trending',
  },
];

// ─── Icon Renderer ────────────────────────────────────────────────────────────

function RecordIcon({ type, className }: { type: RecordEntry['icon']; className?: string }) {
  const cls = cn('shrink-0', className);
  switch (type) {
    case 'trophy':   return <Trophy   className={cls} aria-hidden="true" />;
    case 'zap':      return <Zap      className={cls} aria-hidden="true" />;
    case 'trending': return <TrendingUp className={cls} aria-hidden="true" />;
    case 'award':    return <Award    className={cls} aria-hidden="true" />;
    case 'star':     return <Star     className={cls} aria-hidden="true" />;
    case 'shield':   return <Shield   className={cls} aria-hidden="true" />;
  }
}

// ─── Record Card ──────────────────────────────────────────────────────────────

function RecordCard({ entry }: { entry: RecordEntry }) {
  const { title, holder, value, context, icon, highlight, note } = entry;

  return (
    <div
      className={cn(
        'rounded-xl border p-5 bg-[#16213e] flex flex-col gap-3',
        'transition-colors duration-150 hover:border-[#3a5f80]',
        highlight
          ? 'border-[#ffd700]/40 shadow-lg shadow-[#ffd700]/5'
          : 'border-[#2d4a66]'
      )}
    >
      {/* Icon + title row */}
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'p-2 rounded-lg border shrink-0 mt-0.5',
            highlight
              ? 'bg-[#ffd700]/10 border-[#ffd700]/30'
              : 'bg-[#1a1a2e] border-[#2d4a66]'
          )}
        >
          <RecordIcon
            type={icon}
            className={cn(
              'w-4 h-4',
              highlight ? 'text-[#ffd700]' : 'text-slate-400'
            )}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            {title}
          </p>
          <p
            className={cn(
              'font-bold text-sm leading-snug',
              highlight ? 'text-[#ffd700]' : 'text-white'
            )}
          >
            {holder}
          </p>
        </div>
      </div>

      {/* Value — large display */}
      <div
        className={cn(
          'text-3xl font-black tabular-nums leading-none',
          highlight ? 'text-[#ffd700]' : 'text-white'
        )}
        style={{ fontFamily: "'Roboto Mono', monospace" }}
      >
        {value}
      </div>

      {/* Context / year */}
      <p className="text-xs text-slate-500 leading-snug">
        {context}
      </p>

      {/* Optional footnote */}
      {note && (
        <p className="text-[11px] text-slate-600 italic leading-snug border-t border-[#1e3347] pt-2 mt-1">
          {note}
        </p>
      )}
    </div>
  );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────

function RecordSection({
  id,
  heading,
  records,
}: {
  id: string;
  heading: string;
  records: RecordEntry[];
}) {
  return (
    <section className="mb-14" aria-labelledby={`${id}-heading`}>
      <h2
        id={`${id}-heading`}
        className="text-2xl font-black text-white mb-6 flex items-center gap-3"
      >
        {heading}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {records.map(entry => (
          <RecordCard key={entry.id} entry={entry} />
        ))}
      </div>
    </section>
  );
}

// ─── Hero Record ─────────────────────────────────────────────────────────────

function HeroRecord() {
  return (
    <div className="mb-12 rounded-2xl border border-[#ffd700]/40 bg-gradient-to-br from-[#16213e] to-[#1a1a2e] p-6 sm:p-8 shadow-xl shadow-[#ffd700]/5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        {/* Icon */}
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#ffd700]/10 border border-[#ffd700]/30 shrink-0">
          <Zap className="w-8 h-8 text-[#ffd700]" aria-hidden="true" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#ffd700]/60 mb-1">
            All-Time League Record
          </p>
          <h2 className="text-xl sm:text-2xl font-black text-white mb-1 leading-tight">
            Highest Single-Game Score
          </h2>
          <p className="text-slate-400 text-sm leading-snug">
            JuicyBussy · 2021 Season · Week 16 Consolation Game
          </p>
        </div>

        {/* Value */}
        <div className="shrink-0 text-right">
          <div
            className="text-5xl sm:text-6xl font-black text-[#ffd700] tabular-nums leading-none"
            style={{ fontFamily: "'Roboto Mono', monospace" }}
          >
            245.80
          </div>
          <p className="text-sm text-[#ffd700]/60 font-semibold mt-1 uppercase tracking-wider">
            Points
          </p>
        </div>
      </div>

      <p className="mt-5 text-xs text-slate-600 italic leading-snug border-t border-[#ffd700]/10 pt-4">
        Scored during the Week 16 consolation bracket in 2021, this stands as the highest single-game total in BMFFFL history.
        JuicyBussy would go on to win the 2023 championship as the 6th seed — the lowest-seeded champion in BMFFFL history.
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RecordsPage() {
  return (
    <>
      <Head>
        <title>All-Time Records — BMFFFL</title>
        <meta
          name="description"
          content="All-time BMFFFL dynasty fantasy football records — highest scores, season bests, championship records, and historical milestones."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Page header */}
        <header className="mb-12 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <Trophy className="w-3.5 h-3.5" aria-hidden="true" />
            Record Books
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-2">
            All-Time Records
          </h1>
          <p className="text-slate-400 text-lg">
            BMFFFL &bull; 2020 &ndash; Present
          </p>
        </header>

        {/* Hero record — JuicyBussy 245.80 */}
        <HeroRecord />

        {/* Record sections */}
        <RecordSection
          id="weekly"
          heading="Weekly Records"
          records={WEEKLY_RECORDS}
        />

        <RecordSection
          id="season"
          heading="Season Records"
          records={SEASON_RECORDS}
        />

        <RecordSection
          id="all-time"
          heading="All-Time Records"
          records={ALL_TIME_RECORDS}
        />

        {/* Footer note */}
        <p className="mt-4 text-xs text-center text-slate-600">
          Records are based on available BMFFFL data from 2020–2025. Week-by-week records and streaks pending full historical audit.
        </p>

      </div>
    </>
  );
}
