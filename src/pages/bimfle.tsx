import Head from 'next/head';
import { Bot, Star, Zap, Trophy } from 'lucide-react';
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

          {/* ── Bimfle's Current Observations ────────────────────────────── */}
          <section aria-label="Bimfle's Current Observations">
            {/* Section header */}
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[#ffd700]">
                Bimfle's Current Observations
              </h2>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ObservationCard
                icon={<Trophy className="w-4 h-4" />}
                title="Dynasty Standings"
                body="MLSchools12 — The Murder Boners — remains the standard of excellence in the BMFFFL. 4x champion (2016, 2019, 2021, 2024), they went 13-1 in 2025 but were eliminated before the finals. The consensus dynasty threat heading into 2026."
              />
              <ObservationCard
                icon={<Star className="w-4 h-4" />}
                title="2026 Outlook"
                body="The rookie draft is approaching and several franchises are in active rebuild mode. Expect aggressive trade activity as contenders look to consolidate picks and rebuilders look to accelerate timelines."
              />
              <ObservationCard
                icon={<Zap className="w-4 h-4" />}
                title="Commissioner Decree"
                body="The Annual Owners Meeting is forthcoming and will determine the 2026 rule changes. All owners are encouraged to submit proposals ahead of the meeting to ensure their voice is heard."
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
