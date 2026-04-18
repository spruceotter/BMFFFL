/**
 * Draft Game 2026 — Leaderboard (legacy URL redirect)
 *
 * This page has moved to /nfl-draft-game.
 * Client-side redirect preserves ?name= query param.
 */

import { useEffect, type ReactElement } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function DraftGameLeaderboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    const name = router.query.name as string | undefined;
    const qs = name ? `?name=${encodeURIComponent(name)}` : '';
    router.replace(`/nfl-draft-game${qs}`);
  }, [router, router.isReady]);

  return (
    <>
      <Head>
        <title>Draft Game 2026 — Redirecting…</title>
        <meta httpEquiv="refresh" content="0; url=/nfl-draft-game" />
      </Head>
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <p className="text-slate-400 text-sm">Redirecting to draft game…</p>
      </div>
    </>
  );
}

// Suppress BMFFFL navigation for the redirect page
DraftGameLeaderboardRedirect.getLayout = (page: ReactElement) => page;
