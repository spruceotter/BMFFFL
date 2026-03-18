import type { ReactNode } from 'react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Root layout wrapper used in _app.tsx.
 * Stacks Navigation → main content → Footer in a full-height flex column.
 */
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#0d1b2a]">
      <Navigation />

      {/* Offset fixed nav height */}
      <main
        id="main-content"
        className="flex-1 pt-16"
        tabIndex={-1}
      >
        {children}
      </main>

      <Footer />
    </div>
  );
}
