/**
 * PlayerPopup — click-triggered popup card for a Sleeper player.
 *
 * Shows player image (Sleeper CDN), name, position badge, and NFL team.
 * Designed to wrap player name text in trade/draft history tables.
 *
 * Usage:
 *   <PlayerPopup playerId="4046" name="Stefon Diggs" position="WR" team="BUF">
 *     <span className="cursor-pointer hover:text-white">Stefon Diggs</span>
 *   </PlayerPopup>
 */

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PlayerMeta {
  name: string;
  position: string;
  team: string | null;
}

interface PlayerPopupProps {
  playerId: string;
  name: string;
  position?: string;
  team?: string | null;
  children: React.ReactNode;
  /** Additional class for the trigger wrapper */
  className?: string;
}

// ─── Position badge colours ───────────────────────────────────────────────────

const POS_STYLES: Record<string, { bg: string; text: string }> = {
  QB: { bg: 'bg-blue-900/80',   text: 'text-blue-300'   },
  RB: { bg: 'bg-green-900/80',  text: 'text-green-300'  },
  WR: { bg: 'bg-amber-900/80',  text: 'text-amber-300'  },
  TE: { bg: 'bg-purple-900/80', text: 'text-purple-300' },
  K:  { bg: 'bg-slate-700/80',  text: 'text-slate-300'  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function PlayerPopup({
  playerId,
  name,
  position = '',
  team,
  children,
  className,
}: PlayerPopupProps) {
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);

  const imageUrl = `https://sleepercdn.com/content/nfl/players/thumb/${playerId}.jpg`;
  const posStyle = POS_STYLES[position.toUpperCase()] ?? { bg: 'bg-slate-700/80', text: 'text-slate-300' };

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [open]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (
        popupRef.current && !popupRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  return (
    <span className={cn('relative inline-block', className)} ref={triggerRef}>
      {/* Trigger */}
      <span
        onClick={() => setOpen(v => !v)}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-label={`View player card for ${name}`}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen(v => !v); }}
        className="cursor-pointer hover:text-white transition-colors"
      >
        {children}
      </span>

      {/* Popup */}
      {open && (
        <div
          ref={popupRef}
          className={cn(
            'absolute z-50 left-0 bottom-full mb-2',
            'w-52 rounded-xl overflow-hidden',
            'bg-[#0d1b2a] border border-[#3a5f80]',
            'shadow-2xl shadow-black/60',
            'animate-in fade-in slide-in-from-bottom-1 duration-150',
          )}
          role="tooltip"
        >
          {/* Player image */}
          {!imgError ? (
            <div className="w-full h-32 bg-[#16213e] overflow-hidden flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover object-top"
                onError={() => setImgError(true)}
              />
            </div>
          ) : (
            <div className="w-full h-20 bg-[#16213e] flex items-center justify-center">
              <span className="text-3xl select-none" aria-hidden="true">🏈</span>
            </div>
          )}

          {/* Info */}
          <div className="px-3 py-2.5">
            <p className="text-white text-sm font-bold leading-tight truncate">{name}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              {position && (
                <span className={cn(
                  'text-xs font-bold px-1.5 py-0.5 rounded font-mono',
                  posStyle.bg, posStyle.text
                )}>
                  {position.toUpperCase()}
                </span>
              )}
              {team && (
                <span className="text-xs text-slate-400 font-medium">{team}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </span>
  );
}
