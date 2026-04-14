import type { ReactNode } from 'react';
import { useRouter } from 'next/router';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { PageStatusBanner } from '@/components/status/PageStatusBanner';
import { PAGE_STATUS } from '@/data/page-status';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Root layout wrapper used in _app.tsx.
 * Stacks Navigation → main content → Footer in a full-height flex column.
 *
 * Auto-injects a PageStatusBanner for any route registered in PAGE_STATUS
 * with a status other than 'validated'. No per-page changes required —
 * the banner appears automatically based on the current route.
 *
 * Status meanings:
 *   validated    — no banner shown (data is DB-verified)
 *   partial      — yellow "⚡ Partially Validated" banner
 *   placeholder  — orange "⚠ Placeholder Data" banner
 *   coming-soon  — slate "🚧 Coming Soon" banner
 */
export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const pageEntry = PAGE_STATUS[router.pathname];
  const showBanner = pageEntry != null && pageEntry.status !== 'validated';

  return (
    <div className="flex flex-col min-h-screen bg-[#0d1b2a]">
      <Navigation />

      {/* Offset fixed nav height */}
      <main
        id="main-content"
        className="flex-1 pt-16"
        tabIndex={-1}
      >
        {showBanner && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <PageStatusBanner
              status={pageEntry.status}
              notes={pageEntry.notes}
            />
          </div>
        )}
        {children}
      </main>

      <Footer />
    </div>
  );
}
