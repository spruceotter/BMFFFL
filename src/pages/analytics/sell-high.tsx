import Head from 'next/head';
import { TrendingUp, TrendingDown, AlertTriangle, ArrowRightLeft } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type Position = 'QB' | 'RB' | 'WR' | 'TE';

interface TradePlayer {
  name:         string;
  position:     Position;
  nflTeam:      string;
  dynastyRank:  number;
  verdict:      string;
  reason:       string;
}

interface TradeTrigger {
  id:          number;
  action:      string;
  description: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SELL_HIGH: TradePlayer[] = [
  {
    name: 'Davante Adams',    position: 'WR', nflTeam: 'KC',  dynastyRank: 48,
    verdict: 'Sell immediately.',
    reason: 'Age 33. One ring to ride. Dynasty value evaporating.',
  },
  {
    name: 'Austin Ekeler',    position: 'RB', nflTeam: 'DAL', dynastyRank: 52,
    verdict: 'Move him now.',
    reason: 'Age 29. Career on borrowed time.',
  },
  {
    name: 'Keenan Allen',     position: 'WR', nflTeam: 'CHI', dynastyRank: 55,
    verdict: 'Trade while there is still a buyer.',
    reason: 'One good season left at best.',
  },
  {
    name: 'Kareem Hunt',      position: 'RB', nflTeam: 'TB',  dynastyRank: 61,
    verdict: 'Exit before 2027.',
    reason: 'Useful now, worthless in 2027.',
  },
  {
    name: 'DJ Moore',         position: 'WR', nflTeam: 'CHI', dynastyRank: 29,
    verdict: 'Peak value. Act now.',
    reason: 'Value peak. New QB situation unclear.',
  },
  {
    name: 'Travis Etienne',   position: 'RB', nflTeam: 'JAC', dynastyRank: 34,
    verdict: 'Declining trajectory.',
    reason: 'Usage declining. Injury history.',
  },
  {
    name: 'Gus Edwards',      position: 'RB', nflTeam: 'NE',  dynastyRank: 68,
    verdict: 'Final window.',
    reason: 'Last productive year.',
  },
  {
    name: 'Kadarius Toney',   position: 'WR', nflTeam: 'KC',  dynastyRank: 74,
    verdict: 'The hope is gone.',
    reason: 'The hope is gone. Trade the body.',
  },
  {
    name: 'Samaje Perine',    position: 'RB', nflTeam: 'TB',  dynastyRank: 79,
    verdict: 'Committee back. No dynasty value.',
    reason: 'Committee back. Minimal dynasty value.',
  },
  {
    name: 'Odell Beckham Jr', position: 'WR', nflTeam: 'LAR', dynastyRank: 57,
    verdict: 'Sell the comeback story.',
    reason: 'The comeback is complete. Now sell.',
  },
];

const BUY_LOW: TradePlayer[] = [
  {
    name: 'Trey McBride',   position: 'TE', nflTeam: 'ARI', dynastyRank: 3,
    verdict: 'Buy at all costs.',
    reason: 'Best TE not named Kelce. Under-owned.',
  },
  {
    name: 'Puka Nacua',     position: 'WR', nflTeam: 'LAR', dynastyRank: 22,
    verdict: 'The slump is priced in. Buy.',
    reason: 'Sophomore slump narrative is wrong.',
  },
  {
    name: 'Rashee Rice',    position: 'WR', nflTeam: 'KC',  dynastyRank: 18,
    verdict: 'Return window is open.',
    reason: 'Returning from injury. Window open.',
  },
  {
    name: 'Jaylen Warren',  position: 'RB', nflTeam: 'PIT', dynastyRank: 31,
    verdict: 'Feature role incoming.',
    reason: 'Harris gone. Feature back role incoming.',
  },
  {
    name: 'Malik Nabers',   position: 'WR', nflTeam: 'NYG', dynastyRank: 14,
    verdict: 'Year 2 leap. Get ahead of it.',
    reason: 'Year 2 leap incoming. Buy now.',
  },
  {
    name: 'Rome Odunze',    position: 'WR', nflTeam: 'CHI', dynastyRank: 27,
    verdict: 'Learning curve complete.',
    reason: 'Learning curve done. New WR1.',
  },
  {
    name: 'Blake Corum',    position: 'RB', nflTeam: 'LAR', dynastyRank: 38,
    verdict: 'System + role = value.',
    reason: 'McVay offense + feature role = value.',
  },
  {
    name: 'Bo Nix',         position: 'QB', nflTeam: 'DEN', dynastyRank: 19,
    verdict: 'Floor priced in. Buy the ceiling.',
    reason: 'QB2 value rock bottom. Upside is 20+ TDs.',
  },
  {
    name: 'Brock Bowers',   position: 'TE', nflTeam: 'LV',  dynastyRank: 6,
    verdict: 'Year 2 breakout imminent.',
    reason: 'Year 2 TE breakout. Get him cheap.',
  },
  {
    name: 'Ladd McConkey',  position: 'WR', nflTeam: 'LAC', dynastyRank: 20,
    verdict: 'Target hog. Lock him up.',
    reason: 'Target hog. Extension incoming.',
  },
];

const TRADE_TRIGGERS: TradeTrigger[] = [
  {
    id: 1,
    action: 'Sell Davante Adams (KC) for Rashee Rice (KC)',
    description: 'Exact same offense. Rice is 5 years younger and cheaper to acquire. This trade wins the next three years.',
  },
  {
    id: 2,
    action: 'Sell Travis Etienne for Jaylen Warren',
    description: 'Declining JAX situation versus ascending PIT role. Warren takes over as the bell cow. Swap now.',
  },
  {
    id: 3,
    action: 'Sell DJ Moore + aging asset for Malik Nabers',
    description: 'Moore is peak value in an uncertain QB situation. Nabers is Year 2 with a clear upside path. Recycle the value.',
  },
  {
    id: 4,
    action: 'Sell OBJ + pick for Puka Nacua',
    description: 'Beckham is narrative-driven value. Nacua is real system-driven value in the best WR offense in football.',
  },
  {
    id: 5,
    action: 'Sell Kareem Hunt for Trey McBride',
    description: 'Hunt has one usable dynasty season. McBride has five. If anyone will trade Hunt for McBride — execute immediately.',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const POS_COLORS: Record<Position, string> = {
  QB: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  RB: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  WR: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  TE: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
};

function PosBadge({ position }: { position: Position }) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center w-9 h-6 rounded text-[10px] font-black uppercase tracking-wider border',
        POS_COLORS[position]
      )}
    >
      {position}
    </span>
  );
}

function SellCard({ player }: { player: TradePlayer }) {
  return (
    <article className="bg-[#16213e] rounded-xl border border-red-500/25 p-4 hover:border-red-500/45 transition-colors duration-150">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <PosBadge position={player.position} />
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">{player.nflTeam}</span>
            <span className="text-[11px] text-slate-600">#{player.dynastyRank} dynasty</span>
          </div>
          <h3 className="text-white font-black text-base leading-tight">{player.name}</h3>
        </div>
        <div className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
          <TrendingDown className="w-3 h-3" aria-hidden="true" />
          Sell
        </div>
      </div>
      <p className="text-slate-400 text-xs leading-relaxed mb-2">{player.reason}</p>
      <div className="rounded-md bg-[#0d1b2a] border border-red-500/15 px-3 py-2">
        <p className="text-red-300 text-xs font-semibold italic">&ldquo;{player.verdict}&rdquo;</p>
        <p className="text-[#ffd700] text-[9px] font-bold mt-0.5">~Bimfle</p>
      </div>
    </article>
  );
}

function BuyCard({ player }: { player: TradePlayer }) {
  return (
    <article className="bg-[#16213e] rounded-xl border border-emerald-500/25 p-4 hover:border-emerald-500/45 transition-colors duration-150">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <PosBadge position={player.position} />
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">{player.nflTeam}</span>
            <span className="text-[11px] text-slate-600">#{player.dynastyRank} dynasty</span>
          </div>
          <h3 className="text-white font-black text-base leading-tight">{player.name}</h3>
        </div>
        <div className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
          <TrendingUp className="w-3 h-3" aria-hidden="true" />
          Buy
        </div>
      </div>
      <p className="text-slate-400 text-xs leading-relaxed mb-2">{player.reason}</p>
      <div className="rounded-md bg-[#0d1b2a] border border-emerald-500/15 px-3 py-2">
        <p className="text-emerald-300 text-xs font-semibold italic">&ldquo;{player.verdict}&rdquo;</p>
        <p className="text-[#ffd700] text-[9px] font-bold mt-0.5">~Bimfle</p>
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SellHighPage() {
  return (
    <>
      <Head>
        <title>Sell High / Buy Low — 2026 Offseason | BMFFFL Analytics</title>
        <meta
          name="description"
          content="Bimfle identifies 20 dynasty players whose perceived value diverges from their true ceiling — sell-high targets and buy-low opportunities for the 2026 BMFFFL offseason."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="bg-[#0d1b2a] border-b border-[#2d4a66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-semibold uppercase tracking-widest mb-5">
            <ArrowRightLeft className="w-3.5 h-3.5" aria-hidden="true" />
            Analytics — Trade Intelligence
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-3">
            Sell High / Buy Low
          </h1>
          <p className="text-slate-400 text-lg mb-6">2026 Offseason Edition</p>

          {/* Bimfle intro quote */}
          <blockquote className="max-w-2xl rounded-xl bg-[#ffd700]/5 border border-[#ffd700]/25 px-6 py-5">
            <p className="text-slate-200 text-sm leading-relaxed italic">
              &ldquo;I have identified 20 players whose perceived value diverges from their true dynasty
              ceiling. Act accordingly.&rdquo;
            </p>
            <footer className="mt-3 text-[#ffd700] text-xs font-black uppercase tracking-widest">~Bimfle</footer>
          </blockquote>

          {/* Summary pills */}
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold">
              <TrendingDown className="w-4 h-4" aria-hidden="true" />
              10 Sell High Targets
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold">
              <TrendingUp className="w-4 h-4" aria-hidden="true" />
              10 Buy Low Targets
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-sm font-bold">
              <AlertTriangle className="w-4 h-4" aria-hidden="true" />
              5 Actionable Trades
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">

        {/* ── SELL HIGH ───────────────────────────────────────────────────── */}
        <section aria-label="Sell high players">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-widest">
              <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />
              Sell High
            </div>
            <h2 className="text-2xl font-black text-white">Trade These Now</h2>
          </div>
          <p className="text-slate-400 text-sm mb-6 max-w-2xl">
            These players are trading at or near peak dynasty value. The window to extract maximum return
            is open — but it will not remain so for long.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {SELL_HIGH.map((p) => (
              <SellCard key={p.name} player={p} />
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-[#2d4a66]" aria-hidden="true" />

        {/* ── BUY LOW ─────────────────────────────────────────────────────── */}
        <section aria-label="Buy low players">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-widest">
              <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
              Buy Low
            </div>
            <h2 className="text-2xl font-black text-white">Acquire at Discount</h2>
          </div>
          <p className="text-slate-400 text-sm mb-6 max-w-2xl">
            These players are available below their true dynasty ceiling. Depressed value creates
            the opportunity. The window for acquiring them cheaply will close as the market corrects.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {BUY_LOW.map((p) => (
              <BuyCard key={p.name} player={p} />
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-[#2d4a66]" aria-hidden="true" />

        {/* ── Trade Trigger List ──────────────────────────────────────────── */}
        <section aria-label="Trade trigger list">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-black uppercase tracking-widest">
              <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
              Trade Triggers
            </div>
            <h2 className="text-2xl font-black text-white">Bimfle&rsquo;s Trade Trigger List</h2>
          </div>
          <p className="text-slate-400 text-sm mb-6 max-w-2xl">
            Five actionable trades to pursue right now in BMFFFL based on the above analysis.
            These are not hypotheticals. These are instructions.
          </p>

          <div className="space-y-3">
            {TRADE_TRIGGERS.map((t) => (
              <div
                key={t.id}
                className="bg-[#16213e] rounded-xl border border-[#2d4a66] p-5 flex gap-4 hover:border-[#ffd700]/30 transition-colors duration-150"
              >
                <div className="shrink-0 w-8 h-8 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 flex items-center justify-center text-[#ffd700] font-black text-sm">
                  {t.id}
                </div>
                <div>
                  <p className="text-white font-black text-sm mb-1">{t.action}</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{t.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer disclaimer ───────────────────────────────────────────── */}
        <div className="border-t border-[#1e3347] pt-5 text-xs text-slate-600 leading-relaxed">
          <p>
            Dynasty values reflect March 2026 offseason context. All assessments are Bimfle&rsquo;s own and
            are considered final. Trade at your own risk — or don&rsquo;t, and live with the consequences.
          </p>
        </div>

      </div>
    </>
  );
}
