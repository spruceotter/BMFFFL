import { Trophy, Star } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChampionEntry {
  season: number;
  champion: string;
  teamName: string;
  notablePlayer?: string;
  seed?: number;
  record?: string;
}

interface ChampionGalleryProps {
  champions: ChampionEntry[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** A #4+ seed winning the championship counts as an upset. */
function isUpset(entry: ChampionEntry): boolean {
  return entry.seed !== undefined && entry.seed >= 4;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ChampionCard({ entry }: { entry: ChampionEntry }) {
  const upset = isUpset(entry);

  return (
    <article
      className={cn(
        'relative rounded-xl border overflow-hidden',
        'bg-[#16213e] transition-all duration-200',
        'hover:scale-[1.02] hover:shadow-xl',
        upset
          ? 'border-[#e94560]/60 shadow-lg shadow-[#e94560]/5'
          : 'border-[#ffd700]/40 shadow-lg shadow-[#ffd700]/5'
      )}
      aria-label={`${entry.season} champion: ${entry.champion}`}
    >
      {/* Top accent bar */}
      <div
        className={cn(
          'h-1 w-full',
          upset
            ? 'bg-gradient-to-r from-[#e94560] via-[#ffd700] to-[#e94560]'
            : 'bg-gradient-to-r from-[#ffd700] via-[#fff0a0] to-[#ffd700]'
        )}
        aria-hidden="true"
      />

      <div className="p-5">
        {/* Year + upset badge row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span
            className="text-4xl font-black text-[#ffd700] leading-none tabular-nums"
            aria-label={`Season ${entry.season}`}
          >
            {entry.season}
          </span>

          <div className="flex flex-col items-end gap-1.5 mt-0.5">
            {/* Trophy icon */}
            <div className="flex items-center gap-1 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 px-2 py-0.5">
              <Trophy className="w-3 h-3 text-[#ffd700]" aria-hidden="true" />
              <span className="text-[10px] font-bold text-[#ffd700] uppercase tracking-widest">
                Champ
              </span>
            </div>

            {/* Upset indicator */}
            {upset && (
              <div
                className="flex items-center gap-1 rounded-full bg-[#e94560]/15 border border-[#e94560]/40 px-2 py-0.5"
                title={`#${entry.seed} seed upset`}
              >
                <Star className="w-3 h-3 text-[#e94560]" aria-hidden="true" />
                <span className="text-[10px] font-bold text-[#e94560] uppercase tracking-widest">
                  #{entry.seed} Upset
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Champion name */}
        <h3 className="text-lg font-black text-white leading-tight mb-0.5 truncate">
          {entry.champion}
        </h3>

        {/* Team name (if distinct from champion handle) */}
        {entry.teamName !== entry.champion && (
          <p className="text-xs text-slate-400 truncate mb-2">{entry.teamName}</p>
        )}

        {/* Record */}
        {entry.record && (
          <p className="text-xs text-slate-500 font-mono mb-3">
            {entry.record}
            {entry.seed ? ` · #${entry.seed} seed` : ''}
          </p>
        )}

        {/* Notable player footnote */}
        {entry.notablePlayer && (
          <div className="mt-3 pt-3 border-t border-[#2d4a66]">
            <p className="text-[11px] text-slate-500 leading-snug">
              <span className="text-slate-400 font-semibold">Key player: </span>
              {entry.notablePlayer}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * Displays a gallery of all BMFFFL champions, one card per season.
 * Upset winners (#4 seed or lower) receive a special red accent treatment.
 *
 * @example
 * <ChampionGallery champions={CHAMPION_DATA} />
 */
export default function ChampionGallery({ champions }: ChampionGalleryProps) {
  // Most recent first
  const sorted = [...champions].sort((a, b) => b.season - a.season);

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      aria-label="Champion gallery"
    >
      {sorted.map((entry) => (
        <ChampionCard key={entry.season} entry={entry} />
      ))}
    </div>
  );
}
