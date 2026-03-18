import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type BadgeVariant = 'champion' | 'playoff' | 'runner-up' | 'last' | 'default';
export type BadgeSize    = 'sm' | 'md';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  champion:   'bg-[#ffd700] text-[#1a1a2e] font-bold border border-[#c9a800]',
  'runner-up': 'bg-[#c0c0c0] text-[#1a1a2e] font-semibold border border-[#9ca3af]',
  playoff:    'bg-[#16a34a] text-white font-semibold border border-[#15803d]',
  last:       'bg-[#dc2626] text-white font-semibold border border-[#b91c1c]',
  default:    'bg-[#2d4a66] text-slate-200 font-medium border border-[#3a5f80]',
};

const SIZE_CLASSES: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-xs rounded',
  md: 'px-2.5 py-1 text-sm rounded-md',
};

/**
 * Reusable badge component for league status labels.
 *
 * @example
 * <Badge variant="champion" size="md">2024 Champion</Badge>
 * <Badge variant="playoff">Playoff</Badge>
 */
export default function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 leading-none whitespace-nowrap',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
    >
      {children}
    </span>
  );
}
