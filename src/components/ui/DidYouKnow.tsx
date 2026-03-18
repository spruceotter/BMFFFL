'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/cn';

// ─── League Facts ─────────────────────────────────────────────────────────────

const FACTS: string[] = [
  'mlschools12 has the best regular season win% in league history at 82.0%',
  'JuicyBussy scored 245.80 points in a single week — a record that still stands.',
  'Tubes94 has lost an estimated 240 points to player injuries across 6 seasons.',
  'rbr has the highest lineup optimization rate in the league at 91.9%',
  'BMFFFL has never had a manager quit or drop out in 6 seasons — 100% retention.',
  'The closest championship game was 162.4-148.8 in 2020 (cogdeill11 vs eldridsm)',
  'Grandes both founded and won this league in 2022. Commissioner privilege.',
  'escuelas has gone 0 for 5 in playoff appearances. The climb continues.',
  'JuicyBussy won the 2023 championship as a 6th seed — the lowest seed ever to win.',
  'mlschools12 has won 3 championships (2021, 2024, 2025). The dynasty is real.',
  'rbr has reached 2 championship games and lost both. The efficiency paradox.',
  'The BMFFFL draft capital system has 36 picks across 3 rounds every season.',
  'tdtd19844 went 3-11 before winning a championship three years later.',
  'The FAAB system replaced waiver priority in 2023 with an 11-1 vote.',
  'tubes94 joined in 2021 and reached the championship final just 5 seasons later.',
  'In 2025, the championship was decided by 22.7 points — not particularly close.',
  'Bimfle has a 75% historical accuracy rate on playoff bracket predictions.',
  'The highest team points in a regular season is held by cmaleski (1,990 pts, 2025).',
  'mlschools12 won the 2021 championship over rbr with a 150.90-103.38 victory.',
  'BMFFFL has had 4 unique champions across 6 seasons — exceptional parity.',
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function DidYouKnow() {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Pick a random start index on mount (client-only to avoid hydration mismatch)
  useEffect(() => {
    setIndex(Math.floor(Math.random() * FACTS.length));
    setMounted(true);
  }, []);

  function handleNext() {
    setIndex((prev) => (prev + 1) % FACTS.length);
  }

  // Render a stable placeholder on the server / before mount
  const fact = mounted ? FACTS[index] : FACTS[0];

  return (
    <div
      className={cn(
        'rounded-xl border border-[#ffd700]/25 bg-[#16213e] px-5 py-4',
        'flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5'
      )}
      style={{ borderLeft: '3px solid #ffd700' }}
    >
      {/* Icon + label */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xl leading-none" aria-hidden="true">💡</span>
        <span className="text-[11px] font-black uppercase tracking-widest text-[#ffd700] whitespace-nowrap">
          Did You Know?
        </span>
      </div>

      {/* Fact text */}
      <p className="flex-1 text-sm text-slate-300 leading-relaxed min-w-0">
        {fact}
      </p>

      {/* Next button */}
      <button
        type="button"
        onClick={handleNext}
        className={cn(
          'shrink-0 self-end sm:self-center',
          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg',
          'text-xs font-semibold text-[#ffd700]',
          'bg-[#ffd700]/10 border border-[#ffd700]/25',
          'hover:bg-[#ffd700]/20 hover:border-[#ffd700]/50',
          'transition-colors duration-150 whitespace-nowrap'
        )}
        aria-label="Show next fact"
      >
        Next Fact
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
