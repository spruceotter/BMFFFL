import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Keyboard, X } from 'lucide-react';

// ─── Shortcut Definitions ─────────────────────────────────────────────────────

interface Shortcut {
  key: string;
  modifier?: 'ctrl' | 'alt';
  description: string;
  action: () => void;
}

interface ShortcutDisplay {
  keys: string[];
  description: string;
  category: string;
}

const SHORTCUT_HELP: ShortcutDisplay[] = [
  { keys: ['?'], description: 'Toggle this help panel', category: 'General' },
  { keys: ['g', 'h'], description: 'Go to Home', category: 'Navigation' },
  { keys: ['g', 'a'], description: 'Go to Analytics', category: 'Navigation' },
  { keys: ['g', 's'], description: 'Go to Season', category: 'Navigation' },
  { keys: ['g', 'y'], description: 'Go to History', category: 'Navigation' },
  { keys: ['g', 'o'], description: 'Go to Owners', category: 'Navigation' },
  { keys: ['g', 'm'], description: 'Go to Managers', category: 'Navigation' },
  { keys: ['g', 'r'], description: 'Go to Records', category: 'Navigation' },
  { keys: ['g', 'p'], description: 'Go to Power Rankings', category: 'Analytics' },
  { keys: ['g', 'l'], description: 'Go to Live Scoring', category: 'Analytics' },
  { keys: ['g', 't'], description: 'Go to Trade Analyzer', category: 'Analytics' },
  { keys: ['Esc'], description: 'Close this panel', category: 'General' },
];

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * KeyboardShortcuts — global keyboard navigation for power users.
 *
 * Implements a "g + letter" chord system (like GitHub). Press ? to show help.
 * All state is local; no server interaction. Works at the App level.
 */
export default function KeyboardShortcuts() {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);
  const [pendingG, setPendingG] = useState(false);
  const [pendingGTimer, setPendingGTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Skip if user is typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      // Escape closes help panel
      if (e.key === 'Escape') {
        setShowHelp(false);
        setPendingG(false);
        return;
      }

      // ? toggles help
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowHelp(prev => !prev);
        setPendingG(false);
        return;
      }

      // "g" chord start — wait for second key
      if (e.key === 'g' && !e.ctrlKey && !e.metaKey && !pendingG) {
        e.preventDefault();
        setPendingG(true);

        // Clear after 1 second if no second key
        const timer = setTimeout(() => {
          setPendingG(false);
        }, 1000);
        setPendingGTimer(timer);
        return;
      }

      // Second key of "g + x" chord
      if (pendingG) {
        e.preventDefault();
        if (pendingGTimer) clearTimeout(pendingGTimer);
        setPendingG(false);

        const destinations: Record<string, string> = {
          h: '/',
          a: '/analytics',
          s: '/season',
          y: '/history',
          o: '/owners',
          m: '/managers',
          r: '/records',
          p: '/analytics/power-rankings',
          l: '/analytics/live-scoring',
          t: '/analytics/trade-analyzer',
        };

        const dest = destinations[e.key];
        if (dest) {
          void router.push(dest);
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, pendingG, pendingGTimer]);

  // Close on route change
  useEffect(() => {
    setShowHelp(false);
  }, [router.pathname]);

  if (!showHelp) {
    return (
      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-4 right-4 z-40 p-2 bg-slate-800 border border-slate-600 rounded-full text-slate-400 hover:text-yellow-400 hover:border-yellow-400/50 transition-all opacity-40 hover:opacity-100"
        title="Keyboard shortcuts (?)"
        aria-label="Show keyboard shortcuts"
      >
        <Keyboard size={16} />
      </button>
    );
  }

  const categories = Array.from(new Set(SHORTCUT_HELP.map(s => s.category)));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={() => setShowHelp(false)}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Keyboard size={18} className="text-yellow-400" />
            <h2 className="text-white font-semibold">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={() => setShowHelp(false)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Shortcut grid */}
        <div className="space-y-4">
          {categories.map(cat => (
            <div key={cat}>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {cat}
              </h3>
              <div className="space-y-1">
                {SHORTCUT_HELP.filter(s => s.category === cat).map(shortcut => (
                  <div key={shortcut.keys.join('+')} className="flex items-center justify-between py-1">
                    <span className="text-slate-300 text-sm">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((k, i) => (
                        <span key={i} className="flex items-center gap-1">
                          <kbd className="px-2 py-0.5 bg-slate-800 border border-slate-600 rounded text-xs text-yellow-400 font-mono">
                            {k}
                          </kbd>
                          {i < shortcut.keys.length - 1 && (
                            <span className="text-slate-600 text-xs">then</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <p className="text-slate-600 text-xs mt-5 pt-4 border-t border-slate-800">
          Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs font-mono">?</kbd> anytime to toggle this panel
          {pendingG && (
            <span className="ml-2 text-yellow-400 animate-pulse">g → waiting for next key…</span>
          )}
        </p>
      </div>
    </div>
  );
}
