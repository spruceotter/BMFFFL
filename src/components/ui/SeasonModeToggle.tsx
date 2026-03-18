import { useState, useEffect } from 'react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SeasonMode = 'offseason' | 'inseason';

const STORAGE_KEY = 'bmfffl-season-mode';
const EVENT_NAME  = 'bmfffl:season-mode-change';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function readStoredMode(): SeasonMode {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'offseason' || raw === 'inseason') return raw;
  } catch {
    // localStorage unavailable (SSR / private browsing)
  }
  return 'offseason';
}

function writeStoredMode(mode: SeasonMode): void {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // ignore
  }
}

// ─── Hook (exported for consumers) ───────────────────────────────────────────

/**
 * Subscribe to the current season mode. Returns the mode and a setter.
 * Listens for `bmfffl:season-mode-change` so cross-component updates work.
 */
export function useSeasonMode(): [SeasonMode, (m: SeasonMode) => void] {
  // Start with the default — never read localStorage during render to stay
  // hydration-safe. The useEffect below syncs with localStorage on mount.
  const [mode, setModeState] = useState<SeasonMode>('offseason');

  useEffect(() => {
    // Sync with stored value once client-side
    setModeState(readStoredMode());

    function handleExternalChange(e: Event) {
      const detail = (e as CustomEvent<SeasonMode>).detail;
      if (detail === 'offseason' || detail === 'inseason') {
        setModeState(detail);
      }
    }

    window.addEventListener(EVENT_NAME, handleExternalChange);
    return () => window.removeEventListener(EVENT_NAME, handleExternalChange);
  }, []);

  function setMode(next: SeasonMode) {
    writeStoredMode(next);
    setModeState(next);
    window.dispatchEvent(new CustomEvent<SeasonMode>(EVENT_NAME, { detail: next }));
  }

  return [mode, setMode];
}

// ─── Component ───────────────────────────────────────────────────────────────

interface SeasonModeToggleProps {
  /** Extra Tailwind classes applied to the outer pill wrapper. */
  className?: string;
}

/**
 * Pill-shaped toggle that switches between Offseason and In-Season modes.
 *
 * Persists the selection to localStorage under `'bmfffl-season-mode'` and
 * dispatches a `bmfffl:season-mode-change` CustomEvent so other parts of
 * the app can react without prop-drilling.
 *
 * Hydration-safe: localStorage is read inside useEffect, never during SSR.
 *
 * @example
 * // Drop into Navigation or Layout — renders nothing on the server.
 * <SeasonModeToggle />
 */
export default function SeasonModeToggle({ className }: SeasonModeToggleProps) {
  const [mode, setMode] = useSeasonMode();
  // Render nothing server-side to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div
      role="group"
      aria-label="Season mode"
      className={cn(
        'inline-flex items-center rounded-full border border-[#2d4a66] bg-[#0d1b2a] p-0.5',
        className
      )}
    >
      {/* Offseason segment */}
      <button
        type="button"
        onClick={() => setMode('offseason')}
        aria-pressed={mode === 'offseason'}
        className={cn(
          'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold',
          'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd700]/60',
          mode === 'offseason'
            ? 'bg-[#ffd700] text-[#0d1b2a] shadow-sm shadow-[#ffd700]/20'
            : 'text-slate-400 hover:text-white'
        )}
      >
        <span aria-hidden="true">🌴</span>
        Offseason
      </button>

      {/* In-Season segment */}
      <button
        type="button"
        onClick={() => setMode('inseason')}
        aria-pressed={mode === 'inseason'}
        className={cn(
          'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold',
          'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd700]/60',
          mode === 'inseason'
            ? 'bg-[#e94560] text-white shadow-sm shadow-[#e94560]/20'
            : 'text-slate-400 hover:text-white'
        )}
      >
        <span aria-hidden="true">🏈</span>
        In Season
      </button>
    </div>
  );
}
