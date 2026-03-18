'use client';

/**
 * DataFreshnessIndicator
 * Shows when data was last fetched from Sleeper (or flags it as static).
 */

interface Props {
  /** ISO date string of last data update */
  lastUpdated?: string;
  /** Data source label, e.g. "Sleeper API" or "Static data" */
  source?: string;
  /** True when the component is wired to a live data feed */
  isLive?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRelativeTime(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffMs = now - then;

  if (isNaN(diffMs)) return isoDate;

  const diffMinutes = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);

  if (diffMinutes < 2) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;

  // More than 24 hours — format as a readable date
  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function isWithin24Hours(isoDate: string): boolean {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  return diffMs >= 0 && diffMs < 86_400_000;
}

// ─── Dot Component ────────────────────────────────────────────────────────────

function StatusDot({ color }: { color: 'green' | 'yellow' | 'gray' }) {
  const colorClass =
    color === 'green'
      ? 'bg-green-400'
      : color === 'yellow'
      ? 'bg-yellow-400'
      : 'bg-gray-400';

  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${colorClass} flex-shrink-0`}
      aria-hidden="true"
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DataFreshnessIndicator({
  lastUpdated,
  source,
  isLive = false,
}: Props) {
  // Static data — no freshness info available
  if (source === 'Static data' || (!lastUpdated && !isLive)) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
        <StatusDot color="gray" />
        Static — offseason data
      </span>
    );
  }

  // Live data feed
  if (isLive) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-green-400">
        <StatusDot color="green" />
        Live data
      </span>
    );
  }

  // Has a lastUpdated timestamp
  if (lastUpdated) {
    const recent = isWithin24Hours(lastUpdated);

    if (recent) {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-yellow-400">
          <StatusDot color="yellow" />
          Updated {formatRelativeTime(lastUpdated)}
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
        <StatusDot color="gray" />
        Last updated {formatRelativeTime(lastUpdated)}
      </span>
    );
  }

  // Fallback — should not reach here given the guards above
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
      <StatusDot color="gray" />
      Data status unknown
    </span>
  );
}
