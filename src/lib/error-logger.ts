/**
 * error-logger — Lightweight client-side logging utility.
 * Development: colored console output.
 * Production: console.error (swap this section for a real service, e.g. Sentry).
 * No external dependencies.
 * task-710
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LogEntry {
  timestamp: string;
  level: 'error' | 'warn' | 'info';
  message: string;
  context?: Record<string, unknown>;
  userAgent?: string;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

const IS_DEV = process.env.NODE_ENV === 'development';

/** ANSI-style CSS colours for browser console output. */
const LEVEL_STYLES: Record<LogEntry['level'], string> = {
  error: 'color:#ef4444;font-weight:bold',   // red-500
  warn:  'color:#f0a500;font-weight:bold',   // brand-gold
  info:  'color:#6b7f96;font-weight:normal', // brand-slate
};

function buildEntry(
  level: LogEntry['level'],
  message: string,
  context?: Record<string, unknown>
): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    context,
    // userAgent is only available in browser environments
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
  };
}

function emitDev(entry: LogEntry): void {
  const style = LEVEL_STYLES[entry.level];
  const prefix = `[${entry.level.toUpperCase()}] ${entry.timestamp}`;

  if (entry.context) {
    console.log(`%c${prefix}`, style, entry.message, entry.context);
  } else {
    console.log(`%c${prefix}`, style, entry.message);
  }
}

function emitProd(entry: LogEntry): void {
  // In production we route everything through console.error so it surfaces
  // in Vercel's function logs and can be grep'd easily.
  // Replace this block with a real sink (Sentry, Datadog, etc.) when ready.
  const payload = JSON.stringify({
    t: entry.timestamp,
    level: entry.level,
    msg: entry.message,
    ctx: entry.context,
  });
  console.error(payload);
}

function log(
  level: LogEntry['level'],
  message: string,
  context?: Record<string, unknown>
): void {
  const entry = buildEntry(level, message, context);

  if (IS_DEV) {
    emitDev(entry);
  } else {
    // In production only emit errors and warnings to avoid noise.
    if (level !== 'info') {
      emitProd(entry);
    }
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Log a recoverable or fatal error.
 *
 * @example
 * logError('Failed to parse roster data', { filename: 'rosters-2026.json' });
 */
export function logError(
  message: string,
  context?: Record<string, unknown>
): void {
  log('error', message, context);
}

/**
 * Log a non-fatal warning (unexpected but handled condition).
 *
 * @example
 * logWarn('Owner stats missing runnerUpSeasons field', { owner: 'Flint' });
 */
export function logWarn(
  message: string,
  context?: Record<string, unknown>
): void {
  log('warn', message, context);
}

/**
 * Log a general informational event.
 * Only emitted in development — silenced in production to reduce log volume.
 *
 * @example
 * logInfo('Analytics page mounted', { route: '/analytics' });
 */
export function logInfo(
  message: string,
  context?: Record<string, unknown>
): void {
  log('info', message, context);
}
