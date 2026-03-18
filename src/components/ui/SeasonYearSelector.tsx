import { useRouter } from 'next/router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Constants ────────────────────────────────────────────────────────────────

export const BMFFFL_SEASONS = [2020, 2021, 2022, 2023, 2024, 2025] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

interface SeasonYearSelectorProps {
  currentYear: number;
  availableYears?: number[];
  onYearChange?: (year: number) => void;
  variant?: 'pills' | 'tabs' | 'arrows';
}

// ─── Pills Variant ────────────────────────────────────────────────────────────

function PillsVariant({
  currentYear,
  availableYears,
  onYearChange,
  navigate,
}: {
  currentYear: number;
  availableYears: number[];
  onYearChange?: (year: number) => void;
  navigate: (year: number) => void;
}) {
  return (
    <nav
      className="flex flex-wrap items-center gap-2"
      aria-label="Season year selector"
    >
      {availableYears.map((year) => {
        const isActive = year === currentYear;
        return (
          <button
            key={year}
            type="button"
            onClick={() => {
              if (onYearChange) {
                onYearChange(year);
              } else {
                navigate(year);
              }
            }}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-bold tabular-nums transition-all duration-150',
              'border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd700]/60',
              isActive
                ? 'bg-[#ffd700] text-[#0d1b2a] border-[#ffd700] shadow-md shadow-[#ffd700]/20'
                : 'bg-[#0d1b2a] text-slate-300 border-[#2d4a66] hover:border-[#ffd700]/50 hover:text-white hover:bg-[#16213e]'
            )}
          >
            {year}
          </button>
        );
      })}
    </nav>
  );
}

// ─── Tabs Variant ─────────────────────────────────────────────────────────────

function TabsVariant({
  currentYear,
  availableYears,
  onYearChange,
  navigate,
}: {
  currentYear: number;
  availableYears: number[];
  onYearChange?: (year: number) => void;
  navigate: (year: number) => void;
}) {
  return (
    <nav
      className="flex items-end border-b border-[#2d4a66] overflow-x-auto"
      aria-label="Season year selector"
      role="tablist"
    >
      {availableYears.map((year) => {
        const isActive = year === currentYear;
        return (
          <button
            key={year}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => {
              if (onYearChange) {
                onYearChange(year);
              } else {
                navigate(year);
              }
            }}
            className={cn(
              'relative shrink-0 px-5 py-3 text-sm font-bold tabular-nums transition-all duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ffd700]/60',
              isActive
                ? 'text-[#ffd700] bg-[#0d1b2a]'
                : 'text-slate-400 bg-[#0d1b2a] hover:text-white hover:bg-[#16213e]'
            )}
          >
            {year}
            {/* Active underline */}
            {isActive && (
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ffd700] rounded-t"
                aria-hidden="true"
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}

// ─── Arrows Variant ───────────────────────────────────────────────────────────

function ArrowsVariant({
  currentYear,
  availableYears,
  onYearChange,
  navigate,
}: {
  currentYear: number;
  availableYears: number[];
  onYearChange?: (year: number) => void;
  navigate: (year: number) => void;
}) {
  const currentIdx = availableYears.indexOf(currentYear);
  const prevYear = currentIdx > 0 ? availableYears[currentIdx - 1] : null;
  const nextYear = currentIdx < availableYears.length - 1 ? availableYears[currentIdx + 1] : null;

  function handleYear(year: number) {
    if (onYearChange) {
      onYearChange(year);
    } else {
      navigate(year);
    }
  }

  return (
    <nav
      className="inline-flex items-center gap-0 rounded-xl border border-[#2d4a66] bg-[#0d1b2a] overflow-hidden"
      aria-label="Season year selector"
    >
      {/* Left arrow */}
      <button
        type="button"
        onClick={() => prevYear !== null && handleYear(prevYear)}
        disabled={prevYear === null}
        aria-label={prevYear !== null ? `Go to ${prevYear} season` : 'No previous season'}
        className={cn(
          'flex items-center justify-center w-10 h-10 border-r border-[#2d4a66] transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ffd700]/60',
          prevYear !== null
            ? 'text-slate-300 hover:text-[#ffd700] hover:bg-[#16213e] cursor-pointer'
            : 'text-slate-600 cursor-not-allowed opacity-40'
        )}
      >
        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
      </button>

      {/* Current year display */}
      <div className="px-6 py-2 flex flex-col items-center min-w-[80px]">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 leading-none mb-0.5">
          Season
        </span>
        <span className="text-xl font-black text-[#ffd700] tabular-nums leading-tight">
          {currentYear}
        </span>
      </div>

      {/* Right arrow */}
      <button
        type="button"
        onClick={() => nextYear !== null && handleYear(nextYear)}
        disabled={nextYear === null}
        aria-label={nextYear !== null ? `Go to ${nextYear} season` : 'No next season'}
        className={cn(
          'flex items-center justify-center w-10 h-10 border-l border-[#2d4a66] transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ffd700]/60',
          nextYear !== null
            ? 'text-slate-300 hover:text-[#ffd700] hover:bg-[#16213e] cursor-pointer'
            : 'text-slate-600 cursor-not-allowed opacity-40'
        )}
      >
        <ChevronRight className="w-4 h-4" aria-hidden="true" />
      </button>
    </nav>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SeasonYearSelector({
  currentYear,
  availableYears = [...BMFFFL_SEASONS],
  onYearChange,
  variant = 'pills',
}: SeasonYearSelectorProps) {
  const router = useRouter();

  function navigate(year: number) {
    router.push(`/history/${year}`);
  }

  const sharedProps = { currentYear, availableYears, onYearChange, navigate };

  if (variant === 'tabs') {
    return <TabsVariant {...sharedProps} />;
  }

  if (variant === 'arrows') {
    return <ArrowsVariant {...sharedProps} />;
  }

  // Default: pills
  return <PillsVariant {...sharedProps} />;
}
