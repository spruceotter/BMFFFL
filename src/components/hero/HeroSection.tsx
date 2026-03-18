import { cn } from '@/lib/cn';

interface HeroSectionProps {
  leagueName: string;
  currentSeason: string;   // e.g. "2026"
  statusText: string;      // e.g. "2026 Offseason — Rookie Draft in June"
  headline: string;        // e.g. "Best MFing Fantasy Football League"
  nextEvent?: string;      // e.g. "Rookie Draft · June 2026"
}

/**
 * Full-width hero banner for the BMFFFL site.
 * Uses a dark gradient background and centers all content.
 */
export default function HeroSection({
  leagueName,
  currentSeason,
  statusText,
  headline,
  nextEvent,
}: HeroSectionProps) {
  return (
    <section
      className="relative w-full overflow-hidden border-b border-[#2d4a66]"
      style={{
        background: 'linear-gradient(180deg, #0d1b2a 0%, #1a1a2e 100%)',
      }}
      aria-label={`${leagueName} hero banner`}
    >
      {/* Ambient glow layers */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] rounded-full bg-[#ffd700]/4 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full bg-[#e94560]/5 blur-2xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">

        {/* Season status pill */}
        <div
          className={cn(
            'inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6',
            'bg-[#e94560]/10 border border-[#e94560]/30',
            'text-[#e94560] text-xs font-semibold uppercase tracking-widest'
          )}
        >
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#e94560] animate-pulse"
            aria-hidden="true"
          />
          {statusText}
        </div>

        {/* League name — large gold */}
        <h1
          className="text-5xl sm:text-7xl md:text-8xl font-black tracking-widest text-[#ffd700] mb-4 leading-none"
          aria-label={leagueName}
        >
          {leagueName}
        </h1>

        {/* Headline */}
        <p className="text-lg sm:text-2xl md:text-3xl font-semibold text-white mb-3 leading-snug">
          {headline}
        </p>

        {/* Season label */}
        <p className="text-sm text-slate-400 mb-6 font-medium tracking-wide uppercase">
          {currentSeason} Season
        </p>

        {/* Next event badge — only shown when provided */}
        {nextEvent && (
          <div className="flex justify-center">
            <span
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full',
                'bg-[#ffd700]/10 border border-[#ffd700]/40',
                'text-[#ffd700] text-sm font-semibold'
              )}
            >
              {/* Calendar icon dot */}
              <span
                className="w-2 h-2 rounded-full bg-[#ffd700]"
                aria-hidden="true"
              />
              <span>
                <span className="text-slate-400 font-normal">Next: </span>
                {nextEvent}
              </span>
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
