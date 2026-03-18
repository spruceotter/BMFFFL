import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * DataTimestamp
 * Displays when data was last refreshed. For a static site this shows the build/data date.
 * Uses a module-level const to avoid hydration mismatches.
 */

// Fixed at build time — never computed at runtime to prevent SSR/client mismatch
const hydrationDate = '2026-03-16';

interface DataTimestampProps {
  /** e.g. "Roster data" */
  label?: string;
  /** ISO date string, defaults to hydrationDate */
  date?: string;
  className?: string;
}

function formatTimestampDate(isoDate: string): string {
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return isoDate;

  // If day is meaningful (not just a year-month), show full date
  return d.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export default function DataTimestamp({
  label,
  date,
  className,
}: DataTimestampProps) {
  const resolvedDate = date ?? hydrationDate;
  const formatted = formatTimestampDate(resolvedDate);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs text-slate-500 italic',
        className
      )}
    >
      <RefreshCw size={12} aria-hidden="true" className="shrink-0" />
      {label ? `${label} — ` : ''}Last updated: {formatted}
    </span>
  );
}
