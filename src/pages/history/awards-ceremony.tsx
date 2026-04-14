import Head from 'next/head';
import {
  Trophy,
  Star,
  TrendingUp,
  Heart,
  Zap,
  Target,
  Crown,
  Flame,
} from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Award {
  id: string;
  title: string;
  winner: string;
  acceptanceQuote: string;
  detail: string;
  icon: 'trophy' | 'star' | 'trending-up' | 'heart' | 'zap' | 'target' | 'crown' | 'flame';
  color: string;
  bgColor: string;
  borderColor: string;
}

// ─── Award Data ───────────────────────────────────────────────────────────────

const AWARDS: Award[] = [
  {
    id: 'mvm',
    title: 'Most Valuable Manager',
    winner: 'mlschools12',
    acceptanceQuote: '"Just doing what I do."',
    detail: 'Four championships across all eras (2016, 2019, 2021, 2024). 13-1 regular season record in 2025 — the best single-season record in BMFFFL history. The standard everyone else is chasing.',
    icon: 'trophy',
    color: '#ffd700',
    bgColor: 'rgba(255,215,0,0.06)',
    borderColor: 'rgba(255,215,0,0.35)',
  },
  {
    id: 'best-trade',
    title: 'Best Trade of the Year',
    winner: 'rbr',
    acceptanceQuote: '"I just saw the value. Had to move."',
    detail: 'Orchestrated the off-season\'s most praised deal — flipping a late-round pick and a declining veteran for a top-10 dynasty asset at a position of need. The league consensus: rbr won this trade by a wide margin.',
    icon: 'zap',
    color: '#60a5fa',
    bgColor: 'rgba(96,165,250,0.06)',
    borderColor: 'rgba(96,165,250,0.30)',
  },
  {
    id: 'faab-king',
    title: 'FAAB King',
    winner: 'juicybussy',
    acceptanceQuote: '"I bid with my heart."',
    detail: 'Led the league in total FAAB spend efficiency — multiple high-value adds at pivotal moments, including a $42 claim in week 9 that turned a middling week into a victory. The waiver wire is juicybussy\'s playground.',
    icon: 'star',
    color: '#a78bfa',
    bgColor: 'rgba(167,139,250,0.06)',
    borderColor: 'rgba(167,139,250,0.30)',
  },
  {
    id: 'comeback',
    title: 'Comeback Story',
    winner: 'tubes94',
    acceptanceQuote: '"The hunt continues."',
    detail: 'From 6-8 in 2023 to runner-up in 2025. tubes94 quietly assembled one of the best rosters in the league, peaked at 11-3, and made the championship game. The arc is not over.',
    icon: 'trending-up',
    color: '#22d3ee',
    bgColor: 'rgba(34,211,238,0.06)',
    borderColor: 'rgba(34,211,238,0.30)',
  },
  {
    id: 'best-draft',
    title: 'Best Draft',
    winner: 'cmaleski',
    acceptanceQuote: '"Finally got the guys."',
    detail: '2025 rookie draft saw cmaleski execute a patient, needs-based strategy — landing a top-15 dynasty RB prospect in the 2nd round and a late-round TE dart that is already seeing target share. Grade: A.',
    icon: 'target',
    color: '#34d399',
    bgColor: 'rgba(52,211,153,0.06)',
    borderColor: 'rgba(52,211,153,0.30)',
  },
  {
    id: 'worst-beat',
    title: 'Worst Beat',
    winner: 'tubes94',
    acceptanceQuote: '"The football gods are cruel."',
    detail: 'Led the league in opponent points for during the 2025 regular season. tubes94 scored enough to win the championship game — except their opponent scored more. The cruelest irony: the best roster lost to the hottest peak.',
    icon: 'heart',
    color: '#f87171',
    bgColor: 'rgba(248,113,113,0.06)',
    borderColor: 'rgba(248,113,113,0.30)',
  },
  {
    id: 'dynasty-builder',
    title: 'Dynasty Builder',
    winner: 'tdtd19844',
    acceptanceQuote: '"The arc isn\'t over."',
    detail: 'No championship yet, but tdtd19844 has built one of the most durable, age-balanced rosters in the league. Consistent 7-9 win floor every year, improving trajectory, and a deep pipeline of young assets. The window is opening.',
    icon: 'crown',
    color: '#fb923c',
    bgColor: 'rgba(251,146,60,0.06)',
    borderColor: 'rgba(251,146,60,0.30)',
  },
  {
    id: 'likely-2026',
    title: 'Most Likely to Win 2026',
    winner: 'tubes94',
    acceptanceQuote: '"The revenge arc is written."',
    detail: 'Runner-up in 2025. Best roster going into 2026. Chips in the right spots. Every observer\'s consensus pick. Bimfle officially endorses this prediction while accepting no liability for playoff outcomes.',
    icon: 'flame',
    color: '#fb923c',
    bgColor: 'rgba(251,146,60,0.06)',
    borderColor: 'rgba(251,146,60,0.30)',
  },
];

// ─── Icon Renderer ────────────────────────────────────────────────────────────

function AwardIcon({ icon, color, size = 'md' }: { icon: Award['icon']; color: string; size?: 'sm' | 'md' | 'lg' }) {
  const cls = size === 'lg' ? 'w-8 h-8' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const props = { className: cls, style: { color }, 'aria-hidden': true as const };
  switch (icon) {
    case 'trophy':      return <Trophy {...props} />;
    case 'star':        return <Star {...props} />;
    case 'trending-up': return <TrendingUp {...props} />;
    case 'heart':       return <Heart {...props} />;
    case 'zap':         return <Zap {...props} />;
    case 'target':      return <Target {...props} />;
    case 'crown':       return <Crown {...props} />;
    case 'flame':       return <Flame {...props} />;
  }
}

// ─── Award Card ───────────────────────────────────────────────────────────────

function AwardCard({ award, rank }: { award: Award; rank: number }) {
  return (
    <article
      className="rounded-2xl border p-6 flex flex-col gap-4 transition-shadow duration-200 hover:shadow-lg"
      style={{ borderColor: award.borderColor, backgroundColor: award.bgColor }}
      aria-label={`${award.title}: ${award.winner}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border"
            style={{ borderColor: award.borderColor, backgroundColor: `${award.color}15` }}
          >
            <AwardIcon icon={award.icon} color={award.color} size="sm" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: `${award.color}99` }}>
              Award {rank}
            </p>
            <h3 className="text-sm font-black text-white leading-tight">{award.title}</h3>
          </div>
        </div>
        <span
          className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full border shrink-0"
          style={{ borderColor: award.borderColor, color: award.color, backgroundColor: `${award.color}10` }}
        >
          Winner
        </span>
      </div>

      {/* Winner */}
      <div>
        <p className="text-3xl font-black capitalize mb-1" style={{ color: award.color }}>
          {award.winner}
        </p>
        <blockquote className="text-sm text-slate-400 italic leading-snug">
          {award.acceptanceQuote}
        </blockquote>
      </div>

      {/* Detail */}
      <p className="text-xs text-slate-400 leading-relaxed border-t pt-3" style={{ borderColor: `${award.color}15` }}>
        {award.detail}
      </p>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AwardsCeremonyPage() {
  return (
    <>
      <Head>
        <title>2025 BMFFFL Awards Ceremony — History</title>
        <meta
          name="description"
          content="The 2025 BMFFFL Annual Awards Ceremony. Eight awards, eight winners, and Bimfle's closing statement."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <header className="mb-14 text-center relative">
          {/* Decorative spotlight effect */}
          <div
            className="absolute inset-0 -top-8 flex items-start justify-center pointer-events-none"
            aria-hidden="true"
          >
            <div
              className="w-[600px] h-[200px] rounded-full opacity-10"
              style={{
                background: 'radial-gradient(ellipse at center top, #ffd700 0%, transparent 70%)',
              }}
            />
          </div>

          {/* Top curtain strip */}
          <div className="flex items-center justify-center gap-3 mb-6" aria-hidden="true">
            <div className="flex-1 max-w-[120px] h-px bg-gradient-to-r from-transparent to-[#ffd700]/40" />
            <span className="text-2xl">🎭</span>
            <div className="flex-1 max-w-[120px] h-px bg-gradient-to-l from-transparent to-[#ffd700]/40" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/40 text-[#ffd700] text-sm font-semibold uppercase tracking-widest mb-6">
            <Trophy className="w-4 h-4" aria-hidden="true" />
            Annual Awards
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-4">
            The 2025 BMFFFL
            <br />
            <span style={{ color: '#ffd700' }}>Awards Ceremony</span>
          </h1>

          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            Recognizing excellence, suffering, resilience, and audacity across the 2025 BMFFFL season.
            Your Commissioner, Bimfle, presiding.
          </p>

          {/* Bottom curtain strip */}
          <div className="flex items-center justify-center gap-3 mt-8" aria-hidden="true">
            <div className="flex-1 max-w-[200px] h-px bg-gradient-to-r from-transparent to-[#ffd700]/30" />
            <Star className="w-4 h-4 text-[#ffd700]/50" />
            <div className="flex-1 max-w-[200px] h-px bg-gradient-to-l from-transparent to-[#ffd700]/30" />
          </div>
        </header>

        {/* ── Winners Circle ───────────────────────────────────────────────── */}
        <section aria-labelledby="winners-heading" className="mb-16">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px flex-1 max-w-[60px] bg-[#2d4a66]" aria-hidden="true" />
            <Crown className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <h2 id="winners-heading" className="text-2xl font-black text-white text-center">
              The Winners Circle
            </h2>
            <Crown className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <div className="h-px flex-1 max-w-[60px] bg-[#2d4a66]" aria-hidden="true" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {AWARDS.map((award, idx) => (
              <AwardCard key={award.id} award={award} rank={idx + 1} />
            ))}
          </div>
        </section>

        {/* ── Bimfle's Closing Statement ───────────────────────────────────── */}
        <section aria-labelledby="closing-heading" className="mb-12">
          <div className="rounded-2xl border border-[#ffd700]/25 bg-[#ffd700]/5 p-8 relative overflow-hidden">
            {/* Decorative corner */}
            <div
              className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none"
              aria-hidden="true"
              style={{
                background: 'radial-gradient(circle at top right, #ffd700, transparent 70%)',
              }}
            />

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full border border-[#ffd700]/40 bg-[#ffd700]/10 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[10px] text-[#ffd700]/60 uppercase tracking-widest font-semibold">
                  Office of the Commissioner
                </p>
                <h2 id="closing-heading" className="text-lg font-black text-white">
                  Bimfle&rsquo;s Closing Statement
                </h2>
              </div>
            </div>

            <blockquote className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <p>
                &ldquo;Managers of BMFFFL &mdash; six seasons. Six champions. One dynasty.
              </p>
              <p>
                mlschools12, what you have done to this league is both inspiring and clinically concerning.
                Four championships. A 13-1 season that ended in heartbreak. We are all, effectively, playing for second place,
                and yet: we return. Every year. Because the chase is the point.
              </p>
              <p>
                tubes94, your revenge arc has been officially certified. The runner-up trophy is cold comfort,
                but 2026 is yours to lose. Do not lose it.
              </p>
              <p>
                To escuelas &mdash; your commitment to fielding a roster in all six seasons, against all statistical
                evidence that things will improve, is the most human thing about this league. We salute you.
              </p>
              <p>
                To everyone who traded, streamed, bid, cursed, and returned &mdash; this is what dynasty is.
                The arc is long. The arc bends toward a championship, eventually, for someone.
              </p>
              <p>
                See you in 2026. ~Bimfle.&rdquo;
              </p>
            </blockquote>
          </div>
        </section>

        {/* ── Vote for 2026 ─────────────────────────────────────────────────── */}
        <section aria-labelledby="vote-heading" className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <Star className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <h2 id="vote-heading" className="text-2xl font-black text-white">
              2026 Ballot Preview
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-500/20 border border-slate-500/30 text-slate-400">
              Coming Soon
            </span>
          </div>

          <div className="rounded-xl border border-[#2d4a66] bg-[#16213e] p-6">
            <p className="text-slate-400 text-sm mb-5 leading-relaxed">
              Voting for the 2026 BMFFFL Awards will open at the conclusion of the 2026 regular season.
              The following categories are confirmed for next year&rsquo;s ceremony:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                'Most Valuable Manager',
                'Best Trade of the Year',
                'FAAB King',
                'Comeback Story',
                'Best Rookie Draft',
                'Worst Beat',
                'Dynasty Builder',
                'Most Likely to Win 2027',
              ].map((cat) => (
                <div
                  key={cat}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-[#2d4a66] bg-[#0f2744]"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffd700]/40 shrink-0" aria-hidden="true" />
                  <span className="text-xs text-slate-400 font-medium">{cat}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[11px] text-slate-600">
              Voting will be conducted via the BMFFFL community. All 12 managers eligible to vote.
              Commissioner&rsquo;s vote counts 1.5x in the event of a tie.
            </p>
          </div>
        </section>

        {/* Footer */}
        <p className="text-xs text-center text-slate-600">
          The 2025 BMFFFL Awards Ceremony is a BMFFFL official production.
          All records reflect the 2025 regular season and playoffs.
          Bimfle reserves the right to amend award criteria at any time and without notice.
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
