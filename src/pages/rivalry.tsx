import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Swords, Trophy, TrendingUp, Shield, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterKey = 'all' | 'championship' | 'contenders' | 'historical';

interface Owner {
  username: string;
  teamName: string;
  wins: number;
  losses: number;
  championships: number;
}

interface Rivalry {
  id: string;
  name: string;
  tagline: string;
  ownerA: Owner;
  ownerB: Owner;
  /** positive = ownerA leads, negative = ownerB leads */
  h2hWinsA: number;
  h2hWinsB: number;
  leader: 'A' | 'B' | 'tied';
  narrative: string;
  categories: FilterKey[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const RIVALRIES: Rivalry[] = [
  {
    id: 'apex',
    name: 'The Apex Rivalry',
    tagline: 'Royalty vs. Royalty',
    ownerA: {
      username: 'MLSchools12',
      teamName: 'The Murder Boners',
      wins: 68,
      losses: 15,
      championships: 4,
    },
    ownerB: {
      username: 'JuicyBussy',
      teamName: 'Juicy Bussy',
      wins: 46,
      losses: 37,
      championships: 1,
    },
    h2hWinsA: 9,
    h2hWinsB: 3,
    leader: 'A',
    narrative:
      'The defining matchup of the BMFFFL era. MLSchools12 owns the all-time H2H at 9–3, but JuicyBussy claimed the one trophy that mattered in 2023 — the championship rematch that never happened. MLSchools12 went 13–1 in the regular season that year but fell before the finals, leaving JuicyBussy to run the table as the #6 seed. A rivalry built on dominance vs. destiny.',
    categories: ['all', 'championship', 'contenders'],
  },
  {
    id: 'championship-crossroads',
    name: 'The Championship Crossroads',
    tagline: 'The Old Guard vs. The Dynasty',
    ownerA: {
      username: 'Cogdeill11',
      teamName: 'Cogdeill11',
      wins: 38,
      losses: 45,
      championships: 1,
    },
    ownerB: {
      username: 'MLSchools12',
      teamName: 'The Murder Boners',
      wins: 68,
      losses: 15,
      championships: 4,
    },
    h2hWinsA: 8,
    h2hWinsB: 4,
    leader: 'A',
    narrative:
      'Cogdeill11 was the 2020 inaugural champion while MLSchools12 was still finding their dynasty footing — and those early years built a surprising 8–4 H2H advantage. As MLSchools12 ascended to the top of the all-time standings, Cogdeill11 began to fade. The series is a snapshot of a power transfer: the first king versus the greatest king, frozen in the ledger.',
    categories: ['all', 'championship', 'historical'],
  },
  {
    id: 'commissioners-cross',
    name: "The Commissioner's Cross",
    tagline: 'Power vs. Authority',
    ownerA: {
      username: 'MLSchools12',
      teamName: 'The Murder Boners',
      wins: 68,
      losses: 15,
      championships: 4,
    },
    ownerB: {
      username: 'Grandes',
      teamName: 'El Rioux Grandes',
      wins: 45,
      losses: 38,
      championships: 1,
    },
    h2hWinsA: 9,
    h2hWinsB: 3,
    leader: 'A',
    narrative:
      "Grandes runs the league — and MLSchools12 runs through Grandes. Despite Grandes being the commissioner and a legitimate 2022 champion, MLSchools12 leads the H2H 9–3, making this the most lopsided rivalry involving two champions. Being the commish doesn't grant any scheduling mercy on the field.",
    categories: ['all', 'championship'],
  },
  {
    id: 'doormat-derby',
    name: 'The Doormat Derby',
    tagline: 'Bottom Feeders, Never Forgotten',
    ownerA: {
      username: 'Tubes94',
      teamName: 'Burn it all',
      wins: 43,
      losses: 40,
      championships: 0,
    },
    ownerB: {
      username: 'Escuelas',
      teamName: 'Loud and Stroud!',
      wins: 28,
      losses: 55,
      championships: 0,
    },
    h2hWinsA: 7,
    h2hWinsB: 5,
    leader: 'A',
    narrative:
      "Two teams who've fought the bottom of the standings since Day 1. Tubes94 holds a 7–5 H2H edge but neither owner has sniffed the championship conversation. These matchups carry a desperation energy — every win matters when you're fighting just to finish .500. The Doormat Derby may be unglamorous, but it's never boring.",
    categories: ['all', 'historical'],
  },
  {
    id: 'cinderella-nemesis',
    name: 'The Cinderella Nemesis',
    tagline: 'Commissioner vs. the Underdog',
    ownerA: {
      username: 'JuicyBussy',
      teamName: 'Juicy Bussy',
      wins: 46,
      losses: 37,
      championships: 1,
    },
    ownerB: {
      username: 'Grandes',
      teamName: 'El Rioux Grandes',
      wins: 45,
      losses: 38,
      championships: 1,
    },
    h2hWinsA: 7,
    h2hWinsB: 5,
    leader: 'A',
    narrative:
      "JuicyBussy's legendary 2023 Cinderella run came at Grandes' expense in the semis — bouncing the commissioner on the way to a title as the #6 seed. JuicyBussy leads the all-time series 7–5, and every meeting carries the weight of that playoff upset. Two champions, one rivalry, and one moment that defined a season.",
    categories: ['all', 'championship', 'contenders'],
  },
  {
    id: 'emerging-threat',
    name: 'The Emerging Threat',
    tagline: 'Dynasty Challenged',
    ownerA: {
      username: 'MLSchools12',
      teamName: 'The Murder Boners',
      wins: 68,
      losses: 15,
      championships: 4,
    },
    ownerB: {
      username: 'tdtd19844',
      teamName: '14kids0wins',
      wins: 42,
      losses: 41,
      championships: 1,
    },
    h2hWinsA: 8,
    h2hWinsB: 4,
    leader: 'A',
    narrative:
      "MLSchools12 leads the H2H 8–4 overall, but 2025 changed everything: tdtd19844 finally toppled the Murder Boners dynasty and claimed the championship. The rivalry that defined 2025 — a dynasty tested, and for one season, dethroned. The series now carries a new tension: does tdtd19844 build on that breakthrough or was it a one-year window?",
    categories: ['all', 'championship', 'contenders'],
  },
];

// ─── Filter config ─────────────────────────────────────────────────────────────

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all',          label: 'All Rivalries' },
  { key: 'championship', label: 'Championship' },
  { key: 'contenders',   label: 'Current Contenders' },
  { key: 'historical',   label: 'Historical' },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

function winPct(wins: number, losses: number): string {
  const total = wins + losses;
  if (total === 0) return '.000';
  return (wins / total).toFixed(3).replace('0.', '.');
}

function h2hLabel(rivalry: Rivalry): string {
  const leader =
    rivalry.leader === 'A'
      ? rivalry.ownerA.username
      : rivalry.leader === 'B'
      ? rivalry.ownerB.username
      : null;
  if (!leader) return `${rivalry.h2hWinsA}–${rivalry.h2hWinsB} (Tied)`;
  return `${rivalry.h2hWinsA}–${rivalry.h2hWinsB}, ${leader} leads`;
}

function seriesLeader(rivalry: Rivalry): Owner | null {
  if (rivalry.leader === 'A') return rivalry.ownerA;
  if (rivalry.leader === 'B') return rivalry.ownerB;
  return null;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function OwnerBadge({ owner, isLeader }: { owner: Owner; isLeader: boolean }) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1 rounded-lg border p-3',
        isLeader
          ? 'bg-[#ffd700]/5 border-[#ffd700]/30'
          : 'bg-[#0d1b2a] border-[#2d4a66]'
      )}
    >
      <div className="flex items-center gap-1.5">
        {isLeader && (
          <Shield className="w-3.5 h-3.5 text-[#ffd700] shrink-0" aria-hidden="true" />
        )}
        <span
          className={cn(
            'text-sm font-bold leading-tight',
            isLeader ? 'text-[#ffd700]' : 'text-white'
          )}
        >
          {owner.username}
        </span>
      </div>
      <span className="text-xs text-slate-400 leading-snug">{owner.teamName}</span>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs font-mono text-slate-300">
          {owner.wins}–{owner.losses}
        </span>
        <span className="text-xs text-slate-500">{winPct(owner.wins, owner.losses)}</span>
        {owner.championships > 0 && (
          <span className="inline-flex items-center gap-0.5 text-[#ffd700]">
            {Array.from({ length: owner.championships }).map((_, i) => (
              <Trophy key={i} className="w-3 h-3" aria-hidden="true" />
            ))}
          </span>
        )}
      </div>
    </div>
  );
}

function RivalryCard({ rivalry, featured = false }: { rivalry: Rivalry; featured?: boolean }) {
  const leader = seriesLeader(rivalry);

  return (
    <article
      className={cn(
        'relative rounded-xl border flex flex-col overflow-hidden',
        'bg-[#16213e] transition-all duration-200',
        featured
          ? 'border-[#e94560]/50 shadow-lg shadow-[#e94560]/10'
          : 'border-[#2d4a66] hover:border-[#2d4a66]/80 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/40'
      )}
      aria-label={`Rivalry: ${rivalry.name}`}
    >
      {/* Featured accent bar */}
      {featured && (
        <div className="h-1 w-full bg-gradient-to-r from-[#e94560] via-[#ffd700] to-[#e94560]" aria-hidden="true" />
      )}

      <div className={cn('flex flex-col gap-4', featured ? 'p-6 sm:p-8' : 'p-5')}>

        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <div>
            {featured && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e94560]/10 border border-[#e94560]/30 text-[#e94560] text-[10px] font-bold uppercase tracking-widest mb-2">
                <Swords className="w-3 h-3" aria-hidden="true" />
                Featured Rivalry
              </div>
            )}
            <h2
              className={cn(
                'font-black text-white leading-tight',
                featured ? 'text-2xl sm:text-3xl' : 'text-lg'
              )}
            >
              {rivalry.name}
            </h2>
            <p
              className={cn(
                'text-slate-400 mt-0.5',
                featured ? 'text-sm' : 'text-xs'
              )}
            >
              {rivalry.tagline}
            </p>
          </div>
          <Swords
            className={cn(
              'shrink-0 text-[#e94560]/40',
              featured ? 'w-8 h-8' : 'w-5 h-5'
            )}
            aria-hidden="true"
          />
        </div>

        {/* Owner matchup */}
        <div className="grid grid-cols-2 gap-3">
          <OwnerBadge owner={rivalry.ownerA} isLeader={rivalry.leader === 'A'} />
          <OwnerBadge owner={rivalry.ownerB} isLeader={rivalry.leader === 'B'} />
        </div>

        {/* H2H record bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">H2H Record</span>
            <span className="text-xs font-mono text-slate-300">
              {rivalry.h2hWinsA}–{rivalry.h2hWinsB}
            </span>
          </div>
          {/* Visual bar */}
          <div className="h-2 rounded-full overflow-hidden bg-[#0d1b2a] flex" aria-hidden="true">
            <div
              className="h-full bg-[#ffd700] transition-all duration-500"
              style={{
                width: `${(rivalry.h2hWinsA / (rivalry.h2hWinsA + rivalry.h2hWinsB)) * 100}%`,
              }}
            />
            <div
              className="h-full bg-[#e94560]"
              style={{
                width: `${(rivalry.h2hWinsB / (rivalry.h2hWinsA + rivalry.h2hWinsB)) * 100}%`,
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-[#ffd700]/70 font-mono">{rivalry.ownerA.username}</span>
            <span className="text-[10px] text-[#e94560]/70 font-mono">{rivalry.ownerB.username}</span>
          </div>
        </div>

        {/* Narrative */}
        <p
          className={cn(
            'text-slate-300 leading-relaxed',
            featured ? 'text-sm' : 'text-xs'
          )}
        >
          {rivalry.narrative}
        </p>

        {/* Series Champion badge */}
        {leader && (
          <div
            className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/25"
            aria-label={`Series leader: ${leader.username}`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold text-[#ffd700] uppercase tracking-wide">
              Series Leader:
            </span>
            <span className="text-xs text-white font-semibold">{leader.username}</span>
          </div>
        )}
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RivalryPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const featured = RIVALRIES[0];
  const remaining = RIVALRIES.slice(1);

  const filteredRemaining =
    activeFilter === 'all'
      ? remaining
      : remaining.filter((r) => r.categories.includes(activeFilter));

  return (
    <>
      <Head>
        <title>Rivalries — BMFFFL</title>
        <meta
          name="description"
          content="BMFFFL head-to-head rivalry showcase — all major matchup rivalries in league history, from the Apex Rivalry to the Doormat Derby."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Page header ───────────────────────────────────────────────── */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e94560]/10 border border-[#e94560]/30 text-[#e94560] text-xs font-semibold uppercase tracking-widest mb-4">
            <Swords className="w-3.5 h-3.5" aria-hidden="true" />
            Head-to-Head
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-2">
            Rivalries
          </h1>
          <p className="text-slate-400 text-lg">
            Six seasons. Twelve owners. These are the matchups that defined BMFFFL.
          </p>
        </header>

        {/* ── Featured rivalry ──────────────────────────────────────────── */}
        <section className="mb-10" aria-labelledby="featured-heading">
          <h2 id="featured-heading" className="sr-only">Featured Rivalry</h2>
          <RivalryCard rivalry={featured} featured />
        </section>

        {/* ── Filter bar ────────────────────────────────────────────────── */}
        <div
          className="flex flex-wrap gap-2 mb-8"
          role="group"
          aria-label="Filter rivalries by category"
        >
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              aria-pressed={activeFilter === key}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-semibold border transition-colors duration-150',
                activeFilter === key
                  ? 'bg-[#e94560] border-[#e94560] text-white shadow-lg shadow-[#e94560]/20'
                  : 'bg-[#16213e] border-[#2d4a66] text-slate-300 hover:border-[#e94560]/40 hover:text-white'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Rivalry grid ──────────────────────────────────────────────── */}
        <section aria-labelledby="rivalries-grid-heading" className="mb-14">
          <h2 id="rivalries-grid-heading" className="sr-only">All Rivalries</h2>

          {filteredRemaining.length === 0 ? (
            <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-10 text-center">
              <Swords className="w-8 h-8 text-slate-600 mx-auto mb-3" aria-hidden="true" />
              <p className="text-slate-400 text-sm">No rivalries match this filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredRemaining.map((rivalry) => (
                <RivalryCard key={rivalry.id} rivalry={rivalry} />
              ))}
            </div>
          )}
        </section>

        {/* ── H2H Matrix CTA ────────────────────────────────────────────── */}
        <section
          className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
          aria-labelledby="matrix-cta-heading"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
              <h2 id="matrix-cta-heading" className="text-xl font-black text-white">
                All-Time Head-to-Head Matrix
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-md">
              Every owner vs. every owner — the full 12×12 H2H grid for all six seasons of BMFFFL history.
            </p>
          </div>
          <Link
            href="/analytics/h2h-records"
            className={cn(
              'inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm shrink-0',
              'bg-[#ffd700] text-[#0d1b2a] hover:bg-[#ffe033]',
              'transition-colors duration-150 shadow-lg shadow-[#ffd700]/20'
            )}
          >
            View Full Matrix
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </section>

      </div>
    </>
  );
}
