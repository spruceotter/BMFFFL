import { useState, useEffect } from 'react';

/**
 * ThemeToggle — dark / light mode switcher.
 *
 * Reads from localStorage on mount (falling back to system preference),
 * then toggles the `dark` class on <html> and persists the choice.
 * All DOM interaction is inside useEffect so there are no SSR hydration
 * mismatches (Pages Router, static export).
 */
export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true); // default dark; corrected on mount

  // Read saved preference (or system preference) after hydration
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    const shouldBeDark = saved ? saved === 'dark' : prefersDark !== false;
    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="p-2 rounded-md text-slate-300 hover:text-[#ffd700] hover:bg-white/10 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd700] text-base leading-none"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}
