import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/cn';

export type TrendDirection = 'up' | 'down' | 'neutral';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: TrendDirection;
  className?: string;
}

const TREND_CONFIG: Record<TrendDirection, { icon: React.FC<{ className?: string }>, color: string, label: string }> = {
  up:      { icon: TrendingUp,   color: 'text-[#22c55e]', label: 'Trending up' },
  down:    { icon: TrendingDown, color: 'text-[#ef4444]', label: 'Trending down' },
  neutral: { icon: Minus,        color: 'text-slate-400',  label: 'No change' },
};

/**
 * Clean stat display card with optional trend indicator.
 *
 * @example
 * <StatCard label="Win %" value=".623" subtext="All-time" trend="up" />
 * <StatCard label="Total Points" value="14,230" />
 */
export default function StatCard({
  label,
  value,
  subtext,
  trend,
  className,
}: StatCardProps) {
  const trendCfg = trend ? TREND_CONFIG[trend] : null;
  const TrendIcon = trendCfg?.icon ?? null;

  return (
    <div
      className={cn(
        'flex flex-col gap-1 p-4 rounded-lg',
        'bg-[#1a2d42] border border-[#2d4a66]',
        'transition-colors duration-150 hover:border-[#3a5f80]',
        className
      )}
    >
      {/* Label */}
      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
        {label}
      </p>

      {/* Value row */}
      <div className="flex items-end gap-2">
        <span
          className="font-black text-2xl leading-none text-white tabular-nums"
          style={{ fontFamily: "'Roboto Mono', monospace" }}
        >
          {value}
        </span>

        {/* Trend indicator */}
        {trendCfg && TrendIcon && (
          <span
            className={cn('mb-0.5 flex items-center', trendCfg.color)}
            aria-label={trendCfg.label}
            title={trendCfg.label}
          >
            <TrendIcon className="w-4 h-4" aria-hidden="true" />
          </span>
        )}
      </div>

      {/* Optional subtext */}
      {subtext && (
        <p className="text-xs text-slate-400 leading-snug">
          {subtext}
        </p>
      )}
    </div>
  );
}
