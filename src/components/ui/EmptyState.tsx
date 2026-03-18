/**
 * EmptyState — Centered placeholder for pages or sections with no data.
 * Supports an icon, title, subtitle, and optional CTA button.
 * task-629
 */

import type { ComponentType } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  /** Lucide (or any) icon component — receives a `className` prop. */
  icon?: ComponentType<{ className?: string }>;
  /** Primary heading text. Required. */
  title: string;
  /** Supporting text below the title. */
  subtitle?: string;
  /** Optional call-to-action link rendered as a gold button. */
  action?: { label: string; href: string };
  /** Extra classes on the outer container. */
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Empty state display for sections with no data.
 *
 * @example
 * <EmptyState
 *   icon={Trophy}
 *   title="No champions yet"
 *   subtitle="Check back after the season ends."
 *   action={{ label: 'View schedule', href: '/calendar' }}
 * />
 */
export default function EmptyState({
  icon: Icon,
  title,
  subtitle,
  action,
  className,
}: Props) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-[#2d4a66]',
        'bg-[#16213e] px-6 py-12 text-center',
        className
      )}
    >
      {/* Icon container */}
      {Icon && (
        <div
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#1e3045]"
          aria-hidden="true"
        >
          <Icon className="h-7 w-7 text-[#f0a500]" />
        </div>
      )}

      {/* Title */}
      <h3 className="mb-1 text-base font-semibold text-white">{title}</h3>

      {/* Subtitle */}
      {subtitle && (
        <p className="mb-5 max-w-xs text-sm leading-relaxed text-slate-400">
          {subtitle}
        </p>
      )}

      {/* CTA */}
      {action && (
        <Link
          href={action.href}
          className={cn(
            'inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold',
            'bg-[#f0a500] text-[#0d1b2a]',
            'transition-colors duration-150 hover:bg-[#f7c948]',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f0a500]',
            'focus-visible:ring-offset-2 focus-visible:ring-offset-[#16213e]',
            // Add top margin only when subtitle is absent (title already provides spacing)
            !subtitle && 'mt-4'
          )}
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
