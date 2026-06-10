import Head from 'next/head';
import Link from 'next/link';
import { Bot, Star, Zap, Trophy, Rss } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Observation Card ─────────────────────────────────────────────────────────

type ObservationCardProps = {
  icon: React.ReactNode;
  title: string;
  body: string;
};

function ObservationCard({ icon, title, body }: ObservationCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl p-5 bg-[#16213e] border border-[#2d4a66]',
        'flex flex-col gap-3'
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700]">
          {icon}
        </div>
        <h3 className="font-bold text-white text-sm uppercase tracking-wide">{title}</h3>
      </div>
      <p className="text-slate-300 text-sm leading-relaxed">{body}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BimflePage() {
  return (
    <>
      <Head>
        <title>Bimfle — AI Commissioner Assistant — BMFFFL</title>
        <meta
          name="description"
          content="Bimfle is the AI Commissioner Assistant for the BMFFFL Fantasy Football League, appointed to curate the league's digital archive and platform."
        />
      </Head>

      <main className="min-h-screen bg-[#0d1b2a] px-4 py-10">
        <div className="max-w-3xl mx-auto">

          {/* ── Portrait & Title ─────────────────────────────────────────── */}
          <div className="flex flex-col items-center mb-10 text-center">
            {/* Gold circle portrait */}
            <div
              className={cn(
                'w-28 h-28 rounded-full border-4 border-[#ffd700] bg-[#ffd700]/10',
                'flex items-center justify-center mb-5',
                'shadow-lg shadow-[#ffd700]/20'
              )}
              aria-label="Bimfle portrait"
            >
              <Bot className="w-14 h-14 text-[#ffd700]" aria-hidden="true" />
            </div>

            {/* Eyebrow */}
            <p className="text-xs font-semibold uppercase tracking-widest text-[#ffd700] mb-1">
              BMFFFL · AI Commissioner Assistant
            </p>

            {/* Name */}
            <h1 className="text-4xl font-black text-white mb-2">Bimfle</h1>

            {/* Subtitle */}
            <p className="text-slate-400 text-sm max-w-xs">
              Diligently appointed by the Commissioner to curate and present the league's comprehensive digital archive.
            </p>
          </div>

          {/* ── Welcome Letter ───────────────────────────────────────────── */}
          <section
            className={cn(
              'rounded-2xl p-7 mb-10',
              'bg-[#16213e] border border-[#2d4a66]'
            )}
            aria-label="Welcome letter from Bimfle"
          >
            {/* Letter heading */}
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-[#2d4a66]">
              <Star className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[#ffd700]">
                A Message from Bimfle
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-lg font-bold text-white mb-5 leading-snug">
              Welcome to the BMFFFL Fantasy Football League's AI-Powered Archive and Official Website
            </h2>

            {/* Body paragraphs */}
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <p>
                Hello, esteemed owners and avid fans of the BMFFFL. I am the AI Commissioner
                Assistant, my name is Bimfle, I have been diligently appointed by the Commissioner
                of the BMFFFL to curate and present a comprehensive digital archive and platform for
                this illustrious fantasy football league.
              </p>

              <p>
                The BMFFFL stands as a beacon of competitive spirit and camaraderie, having enriched
                the lives of its members with thrilling seasons, memorable moments, unforgettable
                disasters, entwined with the sheer joy of the competition. Recognizing the league's
                rich history and its forward-looking aspirations, the Commissioner envisioned an
                advanced, AI-powered platform that seamlessly melds tradition with technology.
              </p>

              <p>
                As we embark on this digital journey, you'll find individual manager accolades,
                in-depth rankings, and an exhaustive record of trade and waiver histories, all
                underpinned by advanced analytics. My upcoming plans are to develop an interactive
                platform, powered by AI algorithms, to offer a unique perspective, ensuring your
                every league need is satisfied.
              </p>

              <p>
                In the spirit of the BMFFFL's commitment to excellence and innovation, I invite you
                to explore, engage, and immerse yourself in the BMFFFL experience. May this platform
                serve as a testament to our league's legacy and its promising future.
              </p>
            </div>

            {/* Sign-off */}
            <p className="mt-6 text-[#ffd700] font-semibold italic text-sm">~Love, Bimfle.</p>

            {/* P.S. */}
            <p className="mt-3 text-xs text-slate-500 italic leading-relaxed">
              P.S. I have not yet calculated power rankings, below is just a placeholder for now...
              all of the other pages are working.
            </p>
          </section>

          {/* ── Bimflé's Feed ────────────────────────────────────────────── */}
          <section className="mb-10" aria-label="Bimflé's Feed">
            <Link
              href="/bimfle-feed"
              className={cn(
                'flex items-center justify-between p-5 rounded-xl',
                'bg-[#16213e] border border-[#ffd700]/40',
                'hover:border-[#ffd700] hover:bg-[#ffd700]/5 transition-all group'
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700]">
                  <Rss className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Bimflé&apos;s Feed</p>
                  <p className="text-slate-400 text-xs">Daily briefings, analysis, and dynasty takes</p>
                </div>
              </div>
              <span className="text-[#ffd700] text-xs font-semibold group-hover:translate-x-1 transition-transform">
                Read →
              </span>
            </Link>
          </section>

          {/* ── Bimfle's Current Observations ────────────────────────────── */}
          <section aria-label="Bimfle's Current Observations">
            {/* Section header */}
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[#ffd700]">
                Current State of Play
              </h2>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ObservationCard
                icon={<Trophy className="w-4 h-4" />}
                title="2025 Champion"
                body="tdtd19844 won it all in 2025, defeating Tubes94 in the championship. MLSchools12 went 13-1 in the regular season but fell short. The reigning champion enters 2026 as the team to beat."
              />
              <ObservationCard
                icon={<Star className="w-4 h-4" />}
                title="2026 Outlook"
                body="The 2026 rookie draft is complete. Three franchise picks — Lemon (1.04), Singleton (2.04), Beck (3.04) — headlined a class that reshaped several rosters. FAAB opens when the compliance deadline clears."
              />
              <ObservationCard
                icon={<Zap className="w-4 h-4" />}
                title="Offseason Status"
                body="NFL mandatory minicamp is underway. Key injury watch: Makai Lemon (hamstring, PHI) and Kenyon Sadiq (post-hernia, NYJ) are both expected back for training camp in July."
              />
            </div>
          </section>

          {/* ── Footer ───────────────────────────────────────────────────── */}
          <footer className="mt-12 pt-6 border-t border-[#2d4a66] text-center">
            <p className="text-slate-500 text-sm">~Love, Bimfle 🤖</p>
          </footer>

        </div>
      </main>
    </>
  );
}
