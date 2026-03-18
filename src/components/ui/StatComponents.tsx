import { cn } from '@/lib/cn';

// ─── Color Maps ───────────────────────────────────────────────────────────────

type Color = 'gold' | 'red' | 'green' | 'blue' | 'slate';

const BAR_FILL: Record<Color, string> = {
  gold:  'bg-[#ffd700]',
  red:   'bg-[#e94560]',
  green: 'bg-emerald-500',
  blue:  'bg-blue-500',
  slate: 'bg-slate-500',
};

const BADGE_BG: Record<Color, string> = {
  gold:  'bg-[#ffd700]/15 border border-[#ffd700]/30 text-[#ffd700]',
  red:   'bg-[#e94560]/15 border border-[#e94560]/30 text-[#e94560]',
  green: 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400',
  blue:  'bg-blue-500/15 border border-blue-500/30 text-blue-400',
  slate: 'bg-slate-500/15 border border-slate-500/30 text-slate-400',
};

// ─── StatBar ──────────────────────────────────────────────────────────────────

interface StatBarProps {
  label: string;
  value: number;
  max: number;
  color?: Color;
  showValue?: boolean;
  size?: 'sm' | 'md';
}

/**
 * A labeled horizontal progress bar.
 *
 * @example
 * <StatBar label="Win %" value={68} max={90} color="gold" showValue />
 */
export function StatBar({
  label,
  value,
  max,
  color = 'gold',
  showValue = false,
  size = 'md',
}: StatBarProps) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  const barHeight   = size === 'sm' ? 'h-1.5' : 'h-2.5';
  const labelSize   = size === 'sm' ? 'text-xs' : 'text-sm';
  const valueSize   = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {/* Label row */}
      <div className="flex items-center justify-between gap-2">
        <span className={cn(labelSize, 'text-slate-400 font-medium leading-none')}>
          {label}
        </span>
        {showValue && (
          <span className={cn(valueSize, 'font-mono tabular-nums text-slate-300 leading-none shrink-0')}>
            {value}/{max}
          </span>
        )}
      </div>

      {/* Track */}
      <div className={cn('w-full rounded-full bg-[#2d4a66]', barHeight)} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', BAR_FILL[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── TrendArrow ───────────────────────────────────────────────────────────────

interface TrendArrowProps {
  direction: 'up' | 'down' | 'neutral';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const TREND_SYMBOL: Record<'up' | 'down' | 'neutral', string> = {
  up:      '▲',
  down:    '▼',
  neutral: '→',
};

const TREND_COLOR: Record<'up' | 'down' | 'neutral', string> = {
  up:      'text-emerald-400',
  down:    'text-[#e94560]',
  neutral: 'text-slate-400',
};

const TREND_ARIA: Record<'up' | 'down' | 'neutral', string> = {
  up:      'Trending up',
  down:    'Trending down',
  neutral: 'No change',
};

const TREND_SIZE: Record<'sm' | 'md' | 'lg', { arrow: string; label: string }> = {
  sm: { arrow: 'text-xs',  label: 'text-xs' },
  md: { arrow: 'text-sm',  label: 'text-sm' },
  lg: { arrow: 'text-lg',  label: 'text-base' },
};

/**
 * Visual trend direction indicator with arrow symbol.
 *
 * @example
 * <TrendArrow direction="up" label="+3 spots" size="md" />
 */
export function TrendArrow({ direction, label, size = 'md' }: TrendArrowProps) {
  const sz = TREND_SIZE[size];

  return (
    <span
      className={cn('inline-flex items-center gap-1', TREND_COLOR[direction])}
      title={TREND_ARIA[direction]}
      aria-label={label ? `${TREND_ARIA[direction]}: ${label}` : TREND_ARIA[direction]}
    >
      <span className={cn(sz.arrow, 'font-bold leading-none')} aria-hidden="true">
        {TREND_SYMBOL[direction]}
      </span>
      {label && (
        <span className={cn(sz.label, 'font-medium leading-none')}>
          {label}
        </span>
      )}
    </span>
  );
}

// ─── StatBadge ────────────────────────────────────────────────────────────────

interface StatBadgeProps {
  label: string;
  value: string | number;
  color?: Color;
  size?: 'sm' | 'md';
}

const BADGE_SIZE: Record<'sm' | 'md', string> = {
  sm: 'px-2 py-0.5 text-xs rounded',
  md: 'px-3 py-1 text-sm rounded-md',
};

/**
 * A compact labeled-value pill badge.
 *
 * @example
 * <StatBadge label="PPG" value="161.4" color="gold" />
 */
export function StatBadge({ label, value, color = 'slate', size = 'sm' }: StatBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium whitespace-nowrap leading-none',
        BADGE_BG[color],
        BADGE_SIZE[size]
      )}
    >
      <span className="opacity-70">{label}:</span>
      <span className="font-bold tabular-nums">{value}</span>
    </span>
  );
}
