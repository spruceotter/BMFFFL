import Head from 'next/head';
import Link from 'next/link';
import styles from '@/styles/404.module.css';

const NAV_LINKS = [
  { emoji: '🏠', label: 'Home', href: '/' },
  { emoji: '📊', label: 'Analytics', href: '/analytics' },
  { emoji: '👑', label: 'Owners', href: '/owners' },
  { emoji: '📰', label: 'Latest Articles', href: '/articles' },
] as const;

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>404 — Fumbled on the Goal Line | BMFFFL</title>
        <meta name="description" content="This page took a hit and didn't get up." />
        <meta name="robots" content="noindex" />
      </Head>

      <div className="min-h-[80vh] flex items-center justify-center bg-[#0d1b2a] px-4 py-16">
        <div className="text-center max-w-2xl w-full">

          {/* Animated football */}
          <div className={styles.footballBounce} aria-hidden="true">
            🏈
          </div>

          {/* Big 404 */}
          <div
            className="text-[10rem] sm:text-[12rem] font-black leading-none mb-4 select-none"
            style={{
              background: 'linear-gradient(135deg, #ffd700 0%, #fff8dc 50%, #b8860b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: 'none',
            }}
            aria-label="404"
          >
            404
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">
            Fumbled on the Goal Line
          </h1>

          {/* Subtext */}
          <p className="text-slate-400 text-base sm:text-lg mb-6 leading-relaxed max-w-md mx-auto">
            This page took a hit and didn&apos;t get up.{' '}
            <span className="text-[#ffd700]">Bimfle</span> is investigating.
          </p>

          {/* Bimfle quote */}
          <blockquote className="mx-auto max-w-lg mb-10 px-6 py-4 rounded-xl border border-[#ffd700]/30 bg-[#1a2d42]/60 backdrop-blur-sm">
            <p className="text-sm text-slate-300 italic leading-relaxed">
              &ldquo;I have searched every dimension of the BMFFFL multiverse.
              This page does not exist.&rdquo;
            </p>
            <footer className="mt-2 text-xs text-[#ffd700] font-semibold tracking-wide uppercase">
              — Bimfle
            </footer>
          </blockquote>

          {/* Nav cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {NAV_LINKS.map(({ emoji, label, href }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-2 px-4 py-5 rounded-xl border border-[#2d4a66] bg-[#1a2d42] hover:border-[#ffd700] hover:bg-[#1e3250] transition-colors duration-150 group"
              >
                <span className="text-2xl" aria-hidden="true">{emoji}</span>
                <span className="text-xs font-semibold text-slate-300 group-hover:text-[#ffd700] transition-colors duration-150">
                  {label}
                </span>
              </Link>
            ))}
          </div>

          {/* Divider + back link */}
          <div className="pt-4 border-t border-[#2d4a66]">
            <p className="text-xs text-slate-500">
              Lost?{' '}
              <Link href="/" className="text-[#ffd700] hover:text-[#fff0a0] underline transition-colors duration-100">
                Return to the BMFFFL hub
              </Link>
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
