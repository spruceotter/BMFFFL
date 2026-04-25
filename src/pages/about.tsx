import Head from 'next/head';
import Link from 'next/link';
import {
  Trophy,
  Users,
  Calendar,
  ArrowRight,
  Info,
  Zap,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Static section data ─────────────────────────────────────────────────────

const ROSTER_SLOTS = [
  { slot: 'QB',   count: 1,  label: 'Quarterback' },
  { slot: 'RB',   count: 2,  label: 'Running Back' },
  { slot: 'WR',   count: 2,  label: 'Wide Receiver' },
  { slot: 'TE',   count: 1,  label: 'Tight End' },
  { slot: 'FLEX', count: 1,  label: 'Flex (RB/WR/TE)' },
  { slot: 'SF',   count: 1,  label: 'Superflex (QB/RB/WR/TE)' },
  { slot: 'BN',   count: 6,  label: 'Bench' },
  { slot: 'IR',   count: 1,  label: 'Injured Reserve' },
  { slot: 'TAXI', count: 3,  label: 'Taxi Squad' },
] as const;

const SLOT_COLORS: Record<string, string> = {
  QB:   'bg-purple-900/50 text-purple-300 border-purple-700/50',
  RB:   'bg-green-900/50  text-green-300  border-green-700/50',
  WR:   'bg-blue-900/50   text-blue-300   border-blue-700/50',
  TE:   'bg-yellow-900/50 text-yellow-300 border-yellow-700/50',
  FLEX: 'bg-teal-900/50   text-teal-300   border-teal-700/50',
  SF:   'bg-orange-900/50 text-orange-300 border-orange-700/50',
  BN:   'bg-[#1a2d42]     text-slate-400  border-[#2d4a66]',
  IR:   'bg-red-900/40    text-red-400    border-red-700/40',
  TAXI: 'bg-orange-900/40 text-orange-300 border-orange-700/40',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About — BMFFFL</title>
        <meta
          name="description"
          content="Learn about the BMFFFL — Best MFing Fantasy Football League. 12-team dynasty, full PPR, founded 2016, 10 seasons of history."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#ffd700] transition-colors duration-150">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-300">About</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <Info className="w-6 h-6 text-[#ffd700]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              League Info
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            About{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #ffd700 0%, #ffffff 60%, #e94560 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              BMFFFL
            </span>
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
            The <strong className="text-white">Best MFing Fantasy Football League</strong> — a 12-team
            dynasty league built for the obsessed. Founded in 2016 on ESPN, moved to Sleeper in 2020 —
            we&apos;ve traded picks, celebrated upsets, and crowned six unique champions across ten seasons.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">

        {/* ── League overview ───────────────────────────────────────────── */}
        <section aria-labelledby="overview-heading">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <h2 id="overview-heading" className="text-2xl font-black text-white">
              League Overview
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Full Name',        value: 'Best MFing Fantasy Football League' },
              { label: 'Founded',          value: '2016 (ESPN) — moved to Sleeper in 2020' },
              { label: 'Platform',         value: 'ESPN (2016–2019), Sleeper (2020–present)' },
              { label: 'Format',           value: '12-team Dynasty' },
              { label: 'Scoring',          value: 'Full PPR (1.0 pt/reception)' },
              { label: 'Passing TDs',      value: '4 points' },
              { label: 'Superflex',        value: 'Yes — QB playable in SF slot' },
              { label: 'Seasons Played',   value: '6 (2020 – 2025)' },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-xl bg-[#16213e] border border-[#2d4a66] p-4"
              >
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                  {label}
                </p>
                <p className="text-sm text-slate-200 font-medium">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Roster settings ───────────────────────────────────────────── */}
        <section aria-labelledby="roster-heading">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <h2 id="roster-heading" className="text-2xl font-black text-white">
              Roster Settings
            </h2>
          </div>

          <div className="rounded-xl bg-[#16213e] border border-[#2d4a66] overflow-hidden">
            <table className="w-full text-sm" aria-label="Roster slots">
              <thead>
                <tr className="border-b border-[#2d4a66]">
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                    Slot
                  </th>
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                    Position
                  </th>
                  <th className="text-right px-5 py-3 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                    Count
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROSTER_SLOTS.map(({ slot, count, label }, idx) => (
                  <tr
                    key={slot}
                    className={cn(
                      'border-b border-[#2d4a66]/50',
                      idx === ROSTER_SLOTS.length - 1 && 'border-b-0'
                    )}
                  >
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          'inline-flex items-center justify-center rounded px-1.5 py-0.5',
                          'text-[11px] font-black leading-none border',
                          SLOT_COLORS[slot] ?? 'bg-[#1a2d42] text-slate-400 border-[#2d4a66]'
                        )}
                      >
                        {slot}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-300">{label}</td>
                    <td className="px-5 py-3 text-right font-mono font-bold text-slate-200">
                      {count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Taxi squad note */}
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-orange-900/20 border border-orange-700/30 px-4 py-3">
            <Info className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs text-orange-300 leading-relaxed">
              <strong className="font-semibold">Taxi Squad:</strong> players in their first 2 NFL
              seasons (rookies and second-year players) are eligible for the 3-man taxi squad.
              Taxi players cannot be activated mid-season once locked.
            </p>
          </div>
        </section>

        {/* ── Draft & Season Calendar ────────────────────────────────────── */}
        <section aria-labelledby="calendar-heading">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <h2 id="calendar-heading" className="text-2xl font-black text-white">
              Draft &amp; Season Calendar
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                phase: 'Rookie Draft',
                timing: 'First Friday of June',
                detail: '4 rounds, linear order (no snake). Draft order determined by reverse final standings. Picks are tradeable.',
                icon: Zap,
              },
              {
                phase: 'Regular Season',
                timing: 'NFL Weeks 1–14',
                detail: '13 regular-season weeks. Each team plays every other team once, with select rematches. Top 6 teams make the playoffs.',
                icon: Calendar,
              },
              {
                phase: 'Trade Deadline',
                timing: 'End of Week 14',
                detail: 'No trades after the regular season ends. All trades must be completed before Week 14 locks.',
                icon: RefreshCw,
              },
              {
                phase: 'Playoffs',
                timing: 'NFL Weeks 15–17',
                detail: 'Top 6 seeds qualify. Byes for top 2 seeds in the first round. Single-elimination semifinals and finals.',
                icon: Trophy,
              },
            ].map(({ phase, timing, detail, icon: Icon }) => (
              <div
                key={phase}
                className="flex gap-4 rounded-xl bg-[#16213e] border border-[#2d4a66] p-4"
              >
                <div className="shrink-0 mt-0.5 w-9 h-9 rounded-lg bg-[#0d1b2a] border border-[#2d4a66] flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <p className="text-sm font-bold text-white">{phase}</p>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      {timing}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Waivers & FAAB ────────────────────────────────────────────── */}
        <section aria-labelledby="faab-heading">
          <div className="flex items-center gap-2 mb-6">
            <RefreshCw className="w-5 h-5 text-[#ffd700]" aria-hidden="true" />
            <h2 id="faab-heading" className="text-2xl font-black text-white">
              Waivers &amp; FAAB
            </h2>
          </div>

          <div className="rounded-xl bg-[#16213e] border border-[#2d4a66] p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                  FAAB Budget
                </p>
                <p className="text-3xl font-black text-[#ffd700] font-mono">$10,000</p>
                <p className="text-xs text-slate-400 mt-1">Per season, does not carry over</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
                  Waiver System
                </p>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#ffd700] shrink-0" aria-hidden="true" />
                    Blind bidding — all bids submitted simultaneously
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#ffd700] shrink-0" aria-hidden="true" />
                    Minimum bid: $0 (free pickup on no-bid players)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#ffd700] shrink-0" aria-hidden="true" />
                    Waivers process Wednesday nights
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ───────────────────────────────────────────────── */}
        <section className="rounded-2xl bg-[#16213e] border border-[#2d4a66] p-8 text-center">
          <Trophy className="w-8 h-8 text-[#ffd700] mx-auto mb-3" aria-hidden="true" />
          <h2 className="text-xl font-black text-white mb-2">6 Seasons. 5 Champions. 257 Trades.</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Dive into the full league history, standings, and season-by-season breakdowns.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/history"
              className={cn(
                'inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm',
                'bg-[#e94560] text-white hover:bg-[#c73652]',
                'transition-colors duration-150 shadow-lg shadow-[#e94560]/20'
              )}
            >
              <Trophy className="w-4 h-4" aria-hidden="true" />
              League History
            </Link>
            <Link
              href="/seasons"
              className={cn(
                'inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm',
                'bg-[#1a2d42] text-white border border-[#2d4a66]',
                'hover:border-[#ffd700] hover:text-[#ffd700]',
                'transition-colors duration-150'
              )}
            >
              All Seasons
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
