import Head from 'next/head';
import Link from 'next/link';
import {
  Trophy,
  Flame,
  Calendar,
  HelpCircle,
  TrendingUp,
  Star,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PowerRankingEntry {
  rank: number;
  emoji: string;
  owner: string;
  note: string;
}

interface OffseasonQuestion {
  question: string;
}

interface RookieTierEntry {
  name: string;
  tier: 1 | 2;
}

interface KeyDate {
  period: string;
  event: string;
  detail?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const POWER_RANKINGS: PowerRankingEntry[] = [
  { rank: 1,  emoji: '👑', owner: 'mlschools12',    note: 'Back-to-back window still open. Deepest roster in the league.' },
  { rank: 2,  emoji: '🐋', owner: 'tubes94',         note: '2025 runner-up hungry for revenge. Loaded at WR.' },
  { rank: 3,  emoji: '🔵', owner: 'rbr',             note: 'Quietly dominant. Best lineup IQ. Needs RB help.' },
  { rank: 4,  emoji: '🔥', owner: 'tdtd19844',       note: 'The resurrection is complete. Standing pat and winning.' },
  { rank: 5,  emoji: '⚡', owner: 'sexmachineandy',  note: 'Perennial contender. WR corps upgraded.' },
  { rank: 6,  emoji: '💥', owner: 'juicybussy',      note: 'RB-heavy and dangerous. Always the chaos factor.' },
  { rank: 7,  emoji: '🗡️', owner: 'eldridsm',        note: 'Giant slayer mode activated. Roster quietly solid.' },
  { rank: 8,  emoji: '🎯', owner: 'eldridm20',       note: 'Can finally close? Talent says yes.' },
  { rank: 9,  emoji: '🎭', owner: 'cmaleski',        note: '1990 points says top half. Upgraded in draft.' },
  { rank: 10, emoji: '⚖️', owner: 'grandes',         note: 'Commissioner needing a reload. Draft is the key.' },
  { rank: 11, emoji: '🏆', owner: 'cogdeill11',      note: 'Full rebuild underway. Draft picks are the asset.' },
  { rank: 12, emoji: '🌱', owner: 'escuelas',        note: 'Year 5 of the climb. Young core developing.' },
];

const OFFSEASON_QUESTIONS: OffseasonQuestion[] = [
  { question: 'Can mlschools12 three-peat? Only 2 teams in history have done it.' },
  { question: "Is tubes94's RB situation fixable before September?" },
  { question: "Will cogdeill11's rebuild finally produce a playoff team?" },
  { question: 'Which 2025 rookie breaks out in their sophomore year?' },
  { question: 'Does escuelas finally make the playoffs in Year 5?' },
  { question: "Who pulls off the season's biggest trade before the draft?" },
];

const ROOKIE_TIER_1: RookieTierEntry[] = [
  { name: 'McMillan',  tier: 1 },
  { name: 'Hampton',   tier: 1 },
  { name: 'Egbuka',    tier: 1 },
  { name: 'Judkins',   tier: 1 },
];

const ROOKIE_TIER_2: RookieTierEntry[] = [
  { name: 'Luther Burden',  tier: 2 },
  { name: 'Ollie Gordon',   tier: 2 },
  { name: 'Isaiah Davis',   tier: 2 },
];

const KEY_DATES: KeyDate[] = [
  {
    period: 'March 2026',
    event: 'NFL Free Agency Opens',
    detail: 'Roster movement begins — landing spots shift dynasty values overnight.',
  },
  {
    period: 'April 2026',
    event: 'NFL Draft',
    detail: 'Dynasty impact: picks available to trade for immediately after selections.',
  },
  {
    period: 'May / June 2026',
    event: 'BMFFFL Rookie Draft',
    detail: 'TBD — traditionally first Friday of June. 4 rounds, linear format.',
  },
  {
    period: 'July 2026',
    event: 'Training Camp Opens',
    detail: 'Depth charts set. Taxi squad activation deadline looms.',
  },
  {
    period: 'September 2026',
    event: 'NFL Season Kickoff — Season 7 Begins',
    detail: 'BMFFFL Season 7 is live. All offseason work goes on the scoreboard.',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function RankBadge({ rank }: { rank: number }) {
  const isTop3 = rank <= 3;
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-black shrink-0',
        isTop3
          ? 'bg-[#ffd700]/15 text-[#ffd700] border border-[#ffd700]/40'
          : 'bg-[#0d1b2a] text-slate-400 border border-[#2d4a66]'
      )}
    >
      {rank}
    </span>
  );
}

function PowerRankingRow({ entry }: { entry: PowerRankingEntry }) {
  const isTop3 = entry.rank <= 3;
  return (
    <div
      className={cn(
        'flex items-start gap-4 px-5 py-4 border-b border-[#1e3347] last:border-b-0 transition-colors duration-100 hover:bg-[#1f3550]',
        isTop3 && 'bg-[#ffd700]/[0.02]'
      )}
    >
      <RankBadge rank={entry.rank} />
      <div className="flex items-center gap-2 min-w-[130px]">
        <span className="text-lg leading-none" aria-hidden="true">{entry.emoji}</span>
        <span className="text-sm font-black text-white">{entry.owner}</span>
      </div>
      <p className="text-sm text-slate-400 leading-relaxed flex-1 min-w-0">{entry.note}</p>
    </div>
  );
}

function QuestionCard({ q, idx }: { q: OffseasonQuestion; idx: number }) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-[#2d4a66] bg-[#16213e] px-5 py-4 hover:border-[#ffd700]/20 transition-colors duration-200">
      <span className="shrink-0 mt-0.5 w-7 h-7 rounded-full bg-[#e94560]/10 border border-[#e94560]/30 flex items-center justify-center text-xs font-black text-[#e94560]">
        {idx + 1}
      </span>
      <p className="text-sm text-slate-300 leading-relaxed">{q.question}</p>
    </div>
  );
}

function RookieChip({ name, tier }: { name: string; tier: 1 | 2 }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-semibold',
        tier === 1
          ? 'bg-[#ffd700]/10 border-[#ffd700]/30 text-[#ffd700]'
          : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
      )}
    >
      {name}
    </span>
  );
}

function DateCard({ entry }: { entry: KeyDate }) {
  return (
    <div className="flex gap-4">
      {/* Timeline stem */}
      <div className="flex flex-col items-center shrink-0">
        <div className="w-3 h-3 rounded-full bg-[#ffd700] mt-1.5 shrink-0" aria-hidden="true" />
        <div className="w-px flex-1 bg-[#2d4a66] mt-1" aria-hidden="true" />
      </div>
      {/* Content */}
      <div className="pb-7 flex-1 min-w-0">
        <p className="text-[11px] text-[#ffd700]/70 font-bold uppercase tracking-widest mb-0.5">
          {entry.period}
        </p>
        <p className="text-base font-black text-white mb-1">{entry.event}</p>
        {entry.detail && (
          <p className="text-sm text-slate-400 leading-relaxed">{entry.detail}</p>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SeasonPreview2026Page() {
  return (
    <>
      <Head>
        <title>2026 Season Preview — BMFFFL Season 7</title>
        <meta
          name="description"
          content="BMFFFL Season 7 preseason hub — power rankings, offseason questions, rookie draft preview, key dates, and Bimfle's bold predictions for 2026."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Section 1: Hero ───────────────────────────────────────────────── */}
        <header className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-4">
            <Star className="w-3.5 h-3.5" aria-hidden="true" />
            Season 7 Preview
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-3">
            BMFFFL Season 7 Preview &mdash; 2026
          </h1>
          <p className="text-xl text-slate-400 mb-4">
            Dynasty reloads. Contenders reload. The chase begins again.
          </p>
          <p className="inline-flex items-center gap-2 text-sm text-slate-500 border border-[#2d4a66] rounded-full px-3 py-1.5 bg-[#16213e]">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            NFL Season starts September 2026
          </p>
        </header>

        {/* ── Section 2: Power Rankings ─────────────────────────────────────── */}
        <section className="mb-14" aria-labelledby="power-rankings-heading">
          <div className="flex items-center gap-3 mb-5">
            <TrendingUp className="w-5 h-5 text-[#ffd700] shrink-0" aria-hidden="true" />
            <h2 id="power-rankings-heading" className="text-2xl font-black text-white">
              Power Rankings Heading into 2026
            </h2>
          </div>
          <p className="text-sm text-slate-500 mb-5">
            Bimfle&apos;s offseason assessment — all 12 teams ranked by dynasty standing entering Season 7.
          </p>

          <div className="rounded-xl border border-[#2d4a66] overflow-hidden">
            {POWER_RANKINGS.map(entry => (
              <PowerRankingRow key={entry.owner} entry={entry} />
            ))}
          </div>
        </section>

        {/* ── Section 3: Key Offseason Questions ───────────────────────────── */}
        <section className="mb-14" aria-labelledby="questions-heading">
          <div className="flex items-center gap-3 mb-5">
            <HelpCircle className="w-5 h-5 text-[#e94560] shrink-0" aria-hidden="true" />
            <h2 id="questions-heading" className="text-2xl font-black text-white">
              Key Offseason Questions
            </h2>
          </div>
          <p className="text-sm text-slate-500 mb-5">
            Six editorial questions Bimfle is tracking through the 2026 offseason.
          </p>
          <div className="space-y-3">
            {OFFSEASON_QUESTIONS.map((q, idx) => (
              <QuestionCard key={idx} q={q} idx={idx} />
            ))}
          </div>
        </section>

        {/* ── Section 4: 2026 Rookie Draft Preview ─────────────────────────── */}
        <section className="mb-14" aria-labelledby="rookie-draft-heading">
          <div className="flex items-center gap-3 mb-5">
            <Flame className="w-5 h-5 text-orange-400 shrink-0" aria-hidden="true" />
            <h2 id="rookie-draft-heading" className="text-2xl font-black text-white">
              2026 Rookie Draft Preview
            </h2>
          </div>

          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-6 space-y-6">

            {/* Tier 1 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-[#ffd700]/15 text-[#ffd700] border border-[#ffd700]/30">
                  Tier 1 — Top Dynasty Value
                </span>
                <span className="text-xs text-slate-500">All expected to start contributing in 2026</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {ROOKIE_TIER_1.map(r => (
                  <RookieChip key={r.name} name={r.name} tier={r.tier} />
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#1e3347]" />

            {/* Tier 2 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-300 border border-blue-500/30">
                  Tier 2 — Hold
                </span>
                <span className="text-xs text-slate-500">Developmental value; monitor situation</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {ROOKIE_TIER_2.map(r => (
                  <RookieChip key={r.name} name={r.name} tier={r.tier} />
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-1">
              <Link
                href="/analytics/draft-capital"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#ffd700]/30 bg-[#ffd700]/5 text-[#ffd700] text-sm font-semibold hover:bg-[#ffd700]/10 transition-colors duration-150"
              >
                <TrendingUp className="w-4 h-4" aria-hidden="true" />
                View Full Draft Capital Page &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* ── Section 5: Key Dates ──────────────────────────────────────────── */}
        <section className="mb-14" aria-labelledby="key-dates-heading">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-5 h-5 text-[#ffd700] shrink-0" aria-hidden="true" />
            <h2 id="key-dates-heading" className="text-2xl font-black text-white">
              Key Dates
            </h2>
          </div>

          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] px-6 pt-7 pb-0">
            {KEY_DATES.map((entry, idx) => (
              <DateCard key={idx} entry={entry} />
            ))}
          </div>
        </section>

        {/* ── Section 6: Bimfle's Season 7 Prediction ──────────────────────── */}
        <section className="mb-10" aria-labelledby="prediction-heading">
          <div className="flex items-center gap-3 mb-5">
            <Trophy className="w-5 h-5 text-[#ffd700] shrink-0" aria-hidden="true" />
            <h2 id="prediction-heading" className="text-2xl font-black text-white">
              Bimfle&apos;s Season 7 Prediction
            </h2>
          </div>

          <div className="rounded-xl border border-[#ffd700]/25 bg-[#ffd700]/[0.03] overflow-hidden">

            {/* Header bar */}
            <div className="px-6 py-4 border-b border-[#ffd700]/15 bg-[#ffd700]/5">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#ffd700]/70">
                Formal Projection — Season 7
              </p>
            </div>

            {/* Prediction cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#2d4a66]">

              {/* Champion */}
              <div className="px-6 py-5">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1.5">
                  Champion
                </p>
                <p className="text-lg font-black text-white mb-1">mlschools12</p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/25 text-[#ffd700] text-xs font-bold">
                  34% probability
                </div>
              </div>

              {/* Most Likely Upset */}
              <div className="px-6 py-5">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1.5">
                  Most Likely Upset
                </p>
                <p className="text-lg font-black text-white mb-1">tubes94 over any seed</p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-bold">
                  62% reaches finals
                </div>
              </div>

              {/* Breakout Team */}
              <div className="px-6 py-5">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1.5">
                  Breakout Team
                </p>
                <p className="text-lg font-black text-white mb-1">eldridsm</p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold">
                  Dynasty Ascendant
                </div>
              </div>

            </div>

            {/* Disclaimer */}
            <div className="px-6 py-4 border-t border-[#2d4a66] flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-xs text-slate-600 leading-relaxed italic">
                These projections have 23% accuracy. Bimfle accepts no responsibility.
              </p>
            </div>

          </div>
        </section>

        {/* Footer note */}
        <p className="text-xs text-slate-600 leading-relaxed">
          Preview content reflects Bimfle&apos;s offseason assessment as of March 2026.
          Power rankings, questions, and predictions will be updated as the offseason develops.
          All projections are editorial opinion — not financial advice, not legal advice,
          and certainly not dynasty advice.
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
