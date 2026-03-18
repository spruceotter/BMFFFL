'use client';

/**
 * ErrorBoundary — React class component that catches render-time errors.
 * Class components are required by the React error boundary API;
 * this is the one intentional class component in the codebase.
 * task-629
 */

import React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  children: React.ReactNode;
  /** Optional custom fallback UI. When omitted the built-in error screen is shown. */
  fallback?: React.ReactNode;
  /**
   * Changing this prop resets the error state so the children re-mount.
   * Useful when navigation occurs and you want to clear a stale error.
   */
  resetKey?: string;
}

interface State {
  hasError: boolean;
  errorMessage: string | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: null };
    this.handleReload = this.handleReload.bind(this);
  }

  // Reset when the consumer changes `resetKey` (e.g. on route change)
  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    // We track the previous resetKey in state via a non-obvious but standard pattern.
    // Cast to access the internal field safely.
    const s = state as State & { _resetKey?: string };
    if (props.resetKey !== undefined && props.resetKey !== s._resetKey) {
      return { hasError: false, errorMessage: null, _resetKey: props.resetKey } as Partial<State>;
    }
    return null;
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      errorMessage: error?.message ?? 'Unknown error',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // Wire into the project's error logger when it is available.
    // Using a dynamic require here avoids a hard circular-dependency risk
    // and keeps the boundary working even before the logger is initialised.
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { logError } = require('@/lib/error-logger') as {
        logError: (msg: string, ctx?: Record<string, unknown>) => void;
      };
      logError('ErrorBoundary caught a render error', {
        message: error.message,
        stack: error.stack,
        componentStack: info.componentStack,
      });
    } catch {
      // Logger not yet available — fall back to the browser console.
      console.error('[ErrorBoundary]', error, info);
    }
  }

  handleReload(): void {
    window.location.reload();
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    // Consumer-supplied fallback takes priority
    if (this.props.fallback) {
      return this.props.fallback;
    }

    const isDev = process.env.NODE_ENV === 'development';

    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-[#2d4a66] bg-[#16213e] p-8 text-center">
        {/* Icon */}
        <div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1e3045]"
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-[#f0a500]"
          >
            <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          </svg>
        </div>

        <h2 className="mb-1 text-base font-semibold text-white">
          Something went wrong
        </h2>
        <p className="mb-5 text-sm text-slate-400">
          An unexpected error occurred while rendering this section.
        </p>

        {/* Dev-only error details */}
        {isDev && this.state.errorMessage && (
          <pre className="mb-5 max-w-lg overflow-x-auto rounded bg-[#0d1b2a] px-4 py-3 text-left text-xs text-red-400">
            {this.state.errorMessage}
          </pre>
        )}

        <button
          type="button"
          onClick={this.handleReload}
          className="rounded-md bg-[#f0a500] px-4 py-2 text-sm font-semibold text-[#0d1b2a] transition-colors duration-150 hover:bg-[#f7c948] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f0a500] focus-visible:ring-offset-2 focus-visible:ring-offset-[#16213e]"
        >
          Try reloading
        </button>
      </div>
    );
  }
}
