/**
 * performance — Lightweight performance measurement utilities.
 * No external dependencies. Safe to import on both server and client.
 * task-702
 */

import { lazy } from 'react';

// ─── measureTime ──────────────────────────────────────────────────────────────

/**
 * Synchronously measure and log the wall-clock time for a function.
 * Returns the function's return value unchanged.
 *
 * @example
 * const data = measureTime('loadOwnerStats', () => loadOwnerStats());
 */
export function measureTime<T>(label: string, fn: () => T): T {
  const start = typeof performance !== 'undefined'
    ? performance.now()
    : Date.now();

  const result = fn();

  const duration = (
    typeof performance !== 'undefined' ? performance.now() : Date.now()
  ) - start;

  if (process.env.NODE_ENV === 'development') {
    console.log(`[perf] ${label}: ${duration.toFixed(2)}ms`);
  }

  return result;
}

// ─── recordWebVital ───────────────────────────────────────────────────────────

/**
 * Record a single web vital metric.
 * Integrates with Vercel Analytics' `window.va` if present,
 * otherwise falls back to a console log in development.
 *
 * @example
 * recordWebVital('LCP', 1340);
 */
export function recordWebVital(name: string, value: number): void {
  // Vercel Speed Insights / Web Analytics API
  type WindowWithVA = Window & typeof globalThis & {
    va?: (event: string, data: Record<string, unknown>) => void;
  };
  if (
    typeof window !== 'undefined' &&
    typeof (window as WindowWithVA).va === 'function'
  ) {
    ((window as unknown) as { va: (event: string, data: Record<string, unknown>) => void }).va('vitals', { name, value });
    return;
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`[web-vital] ${name}: ${value}`);
  }
}

// ─── isSlowConnection ─────────────────────────────────────────────────────────

/**
 * Returns true when the browser reports a slow or metered network connection.
 * Falls back to false in environments where the Network Information API is
 * unavailable (SSR, Safari, Firefox).
 *
 * Slow signals:
 *   - effectiveType is '2g' or 'slow-2g'
 *   - saveData is true (user has enabled Data Saver)
 *
 * @example
 * if (isSlowConnection()) { loadLowResImages(); }
 */
export function isSlowConnection(): boolean {
  if (typeof navigator === 'undefined') return false;

  // Network Information API — not available in all browsers
  const connection = (
    navigator as Navigator & {
      connection?: { effectiveType?: string; saveData?: boolean };
      mozConnection?: { effectiveType?: string; saveData?: boolean };
      webkitConnection?: { effectiveType?: string; saveData?: boolean };
    }
  ).connection ??
    (navigator as Navigator & { mozConnection?: { effectiveType?: string; saveData?: boolean } }).mozConnection ??
    (navigator as Navigator & { webkitConnection?: { effectiveType?: string; saveData?: boolean } }).webkitConnection;

  if (!connection) return false;

  if (connection.saveData) return true;

  const slowTypes = new Set(['slow-2g', '2g']);
  return slowTypes.has(connection.effectiveType ?? '');
}

// ─── lazyLoad ─────────────────────────────────────────────────────────────────

/**
 * Thin wrapper around React.lazy for dynamically imported components.
 * Centralises lazy loading so import paths are easy to audit.
 *
 * The generic `T` is the component's props type; React.lazy requires the
 * module to have a `default` export that is a React component.
 *
 * @example
 * const HeavyChart = lazyLoad<ChartProps>(() => import('@/components/HeavyChart'));
 * // Use inside a <Suspense fallback={<SkeletonCard />}>
 */
export function lazyLoad<T extends object>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>
): React.LazyExoticComponent<React.ComponentType<T>> {
  return lazy(importFn);
}
