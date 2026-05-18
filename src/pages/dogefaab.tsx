/**
 * BMFFFL DogeFAAB — Treasury, Balances & History
 * /dogefaab
 *
 * Section 1: League Treasury — total DOGE, buy/sell rates
 * Section 2: Current Owner Balances — FAAB remaining → DOGE share
 * Section 3: Historical FAAB Spending — per season matrix
 * Section 4: All-Time Top Bids
 */

import Head from 'next/head';
import { GetStaticProps } from 'next';
import * as fs from 'fs';
import * as path from 'path';
import { useState } from 'react';
import { DollarSign, TrendingDown, Award, BarChart2 } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface OwnerBalance {
  username: string;
  displayName: string;
  faabRemaining: number;
  pctOfPool: number;
  dogeShare: number;
}

interface SeasonSpend {
  season: string;
  username: string;
  displayName: string;
  totalSpent: number;
  claims: number;
  biggestBid: number;
}

interface TopBid {
  season: string;
  week: number;
  username: string;
  displayName: string;
  bidAmount: number;
  transactionId: string;
}

interface DogeFaabData {
  generatedAt: string;
  treasury: {
    totalDoge: number;
    totalFaabOutstanding: number;
    buyRate: number;
    sellRate: number;
    balancesPulledAt: string;
  };
  currentBalances: OwnerBalance[];
  historicalSpend: SeasonSpend[];
  topBids: TopBid[];
  leagueTotalsBySeasonFaab: Record<string, number>;
}

// ─── Owner colors ─────────────────────────────────────────────────────────────

const OWNER_COLORS: Record<string, { bar: string; text: string; bg: string }> = {
  Grandes:         { bar: 'bg-blue-500',    text: 'text-blue-300',    bg: 'bg-blue-900/30' },
  SexMachineAndyD: { bar: 'bg-purple-500',  text: 'text-purple-300',  bg: 'bg-purple-900/30' },
  rbr:             { bar: 'bg-emerald-500', text: 'text-emerald-300', bg: 'bg-emerald-900/30' },
  Cogdeill11:      { bar: 'bg-teal-500',    text: 'text-teal-300',    bg: 'bg-teal-900/30' },
  MLSchools12:     { bar: 'bg-rose-500',    text: 'text-rose-300',    bg: 'bg-rose-900/30' },
  Cmaleski:        { bar: 'bg-orange-500',  text: 'text-orange-300',  bg: 'bg-orange-900/30' },
  eldridm20:       { bar: 'bg-yellow-500',  text: 'text-yellow-300',  bg: 'bg-yellow-900/30' },
  JuicyBussy:      { bar: 'bg-pink-500',    text: 'text-pink-300',    bg: 'bg-pink-900/30' },
  eldridsm:        { bar: 'bg-indigo-500',  text: 'text-indigo-300',  bg: 'bg-indigo-900/30' },
  tdtd19844:       { bar: 'bg-red-500',     text: 'text-red-300',     bg: 'bg-red-900/30' },
  Tubes94:         { bar: 'bg-violet-500',  text: 'text-violet-300',  bg: 'bg-violet-900/30' },
  MCSchools:       { bar: 'bg-cyan-500',    text: 'text-cyan-300',    bg: 'bg-cyan-900/30' },
  MMoodie12:       { bar: 'bg-sky-500',     text: 'text-sky-300',     bg: 'bg-sky-900/30' },
  'Bimflé':        { bar: 'bg-slate-500',   text: 'text-slate-300',   bg: 'bg-slate-900/30' },
};

function ownerColor(name: string) {
  return OWNER_COLORS[name] ?? { bar: 'bg-slate-500', text: 'text-slate-300', bg: 'bg-slate-900/30' };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatFaab(n: number): string {
  return n.toLocaleString();
}

function pctBar(pct: number, color: string) {
  return (
    <div className="w-full bg-slate-700/50 rounded-full h-1.5 mt-1">
      <div
        className={`h-1.5 rounded-full ${color}`}
        style={{ width: `${Math.min(pct, 100)}%` }}
      />
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  data: DogeFaabData;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DogeFaabPage({ data }: Props) {
  const { treasury, currentBalances, historicalSpend, topBids, leagueTotalsBySeasonFaab } = data;
  const seasons = Object.keys(leagueTotalsBySeasonFaab).sort();
  const [activeTab, setActiveTab] = useState<'spend' | 'topbids'>('spend');

  // Build season matrix: owner → season → spend data
  const spendMatrix: Record<string, Record<string, SeasonSpend>> = {};
  const allOwners = [...new Set(historicalSpend.map(r => r.displayName))];
  for (const row of historicalSpend) {
    if (!spendMatrix[row.displayName]) spendMatrix[row.displayName] = {};
    spendMatrix[row.displayName][row.season] = row;
  }

  // Max spend per season (for relative shading)
  const maxBySeasonFaab: Record<string, number> = {};
  for (const row of historicalSpend) {
    if (!maxBySeasonFaab[row.season] || row.totalSpent > maxBySeasonFaab[row.season]) {
      maxBySeasonFaab[row.season] = row.totalSpent;
    }
  }

  return (
    <>
      <Head>
        <title>DogeFAAB — BMFFFL</title>
        <meta name="description" content="BMFFFL DogeFAAB treasury, FAAB balances, and waiver history" />
      </Head>

      <div className="min-h-screen bg-slate-900 text-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-8">

          {/* ── Header ──────────────────────────────────────────────────── */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-400" />
              </div>
              <h1 className="text-3xl font-bold text-slate-100">DogeFAAB</h1>
            </div>
            <p className="text-slate-400 ml-14">
              BMFFFL treasury · waiver balances · DOGE allocation
            </p>
          </div>

          {/* ── Treasury Cards ───────────────────────────────────────────── */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <span className="text-yellow-400">◈</span> League Treasury
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700/50">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">DOGE in Treasury</p>
                <p className="text-2xl font-bold text-yellow-400">{treasury.totalDoge.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">DOGE (Commissioner escrow)</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700/50">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">FAAB Outstanding</p>
                <p className="text-2xl font-bold text-cyan-400">{formatFaab(treasury.totalFaabOutstanding)}</p>
                <p className="text-xs text-slate-500 mt-1">across {currentBalances.length} owners</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700/50">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Buy Rate (fixed)</p>
                <p className="text-2xl font-bold text-emerald-400">{treasury.buyRate}:1</p>
                <p className="text-xs text-slate-500 mt-1">FAAB per DOGE (refresh)</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700/50">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Sell Rate (variable)</p>
                <p className="text-2xl font-bold text-orange-400">{treasury.sellRate}:1</p>
                <p className="text-xs text-slate-500 mt-1">FAAB per DOGE (sell windows)</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Balances as of {treasury.balancesPulledAt} · Sell rate = Total FAAB ÷ Total DOGE
            </p>
          </section>

          {/* ── Current Balances ─────────────────────────────────────────── */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" /> Current Owner Balances
            </h2>
            <div className="bg-slate-800 rounded-xl border border-slate-700/50 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50 text-xs text-slate-500 uppercase tracking-wide">
                    <th className="text-left px-4 py-3">Owner</th>
                    <th className="text-right px-4 py-3">FAAB Remaining</th>
                    <th className="text-right px-4 py-3 hidden sm:table-cell">% of Pool</th>
                    <th className="text-right px-4 py-3">DOGE Share</th>
                    <th className="px-4 py-3 hidden md:table-cell w-32"></th>
                  </tr>
                </thead>
                <tbody>
                  {currentBalances.map((owner, i) => {
                    const c = ownerColor(owner.displayName);
                    return (
                      <tr key={owner.username} className={`border-b border-slate-700/30 ${i % 2 === 0 ? '' : 'bg-slate-800/50'}`}>
                        <td className="px-4 py-3">
                          <span className={`font-medium ${c.text}`}>{owner.displayName}</span>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-slate-200">
                          {formatFaab(owner.faabRemaining)}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-400 hidden sm:table-cell">
                          {owner.pctOfPool}%
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-yellow-400">
                          {owner.dogeShare.toFixed(1)}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {pctBar(owner.pctOfPool, c.bar)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t border-slate-700 bg-slate-700/30 text-xs font-semibold">
                    <td className="px-4 py-2 text-slate-400">TOTAL</td>
                    <td className="px-4 py-2 text-right font-mono text-slate-300">
                      {formatFaab(treasury.totalFaabOutstanding)}
                    </td>
                    <td className="px-4 py-2 text-right text-slate-400 hidden sm:table-cell">100%</td>
                    <td className="px-4 py-2 text-right font-mono text-yellow-500">
                      {treasury.totalDoge.toLocaleString()}
                    </td>
                    <td className="hidden md:table-cell" />
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          {/* ── History Tabs ─────────────────────────────────────────────── */}
          <section className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-orange-400" /> FAAB History
              </h2>
              <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('spend')}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${activeTab === 'spend' ? 'bg-slate-600 text-slate-100' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  By Season
                </button>
                <button
                  onClick={() => setActiveTab('topbids')}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${activeTab === 'topbids' ? 'bg-slate-600 text-slate-100' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Top Bids
                </button>
              </div>
            </div>

            {activeTab === 'spend' && (
              <div className="bg-slate-800 rounded-xl border border-slate-700/50 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700/50 text-xs text-slate-500 uppercase tracking-wide">
                      <th className="text-left px-4 py-3 sticky left-0 bg-slate-800">Owner</th>
                      {seasons.map(s => (
                        <th key={s} className="text-right px-3 py-3 min-w-16">{s}</th>
                      ))}
                      <th className="text-right px-4 py-3">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allOwners
                      .map(owner => ({
                        owner,
                        total: seasons.reduce((sum, s) => sum + (spendMatrix[owner]?.[s]?.totalSpent ?? 0), 0),
                      }))
                      .sort((a, b) => b.total - a.total)
                      .map(({ owner, total }, i) => {
                        const c = ownerColor(owner);
                        return (
                          <tr key={owner} className={`border-b border-slate-700/30 ${i % 2 === 0 ? '' : 'bg-slate-800/50'}`}>
                            <td className={`px-4 py-2 sticky left-0 bg-slate-800 ${i % 2 !== 0 ? 'bg-slate-800/80' : ''} font-medium ${c.text}`}>
                              {owner}
                            </td>
                            {seasons.map(s => {
                              const cell = spendMatrix[owner]?.[s];
                              const spent = cell?.totalSpent ?? 0;
                              const maxS = maxBySeasonFaab[s] ?? 1;
                              const intensity = spent > 0 ? Math.round((spent / maxS) * 80) + 20 : 0;
                              return (
                                <td key={s} className="px-3 py-2 text-right font-mono">
                                  {spent > 0 ? (
                                    <span
                                      className="text-orange-300"
                                      style={{ opacity: intensity / 100 }}
                                      title={cell ? `${cell.claims} claims, biggest: ${cell.biggestBid}` : ''}
                                    >
                                      {formatFaab(spent)}
                                    </span>
                                  ) : (
                                    <span className="text-slate-700">—</span>
                                  )}
                                </td>
                              );
                            })}
                            <td className="px-4 py-2 text-right font-mono font-semibold text-slate-300">
                              {formatFaab(total)}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-slate-700 bg-slate-700/30 text-xs font-semibold">
                      <td className="px-4 py-2 text-slate-400 sticky left-0 bg-slate-700/30">League Total</td>
                      {seasons.map(s => (
                        <td key={s} className="px-3 py-2 text-right font-mono text-slate-400">
                          {formatFaab(leagueTotalsBySeasonFaab[s] ?? 0)}
                        </td>
                      ))}
                      <td className="px-4 py-2 text-right font-mono text-slate-300">
                        {formatFaab(Object.values(leagueTotalsBySeasonFaab).reduce((a, b) => a + b, 0))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
                <p className="text-xs text-slate-600 px-4 py-2">
                  FAAB spent on winning waiver bids. Note: budget scale differs by era (2020–2021 used 1,000/team; current scale is 10,000/team).
                </p>
              </div>
            )}

            {activeTab === 'topbids' && (
              <div className="bg-slate-800 rounded-xl border border-slate-700/50 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700/50 text-xs text-slate-500 uppercase tracking-wide">
                      <th className="text-left px-4 py-3 w-8">#</th>
                      <th className="text-left px-4 py-3">Owner</th>
                      <th className="text-right px-4 py-3">FAAB Bid</th>
                      <th className="text-right px-4 py-3 hidden sm:table-cell">Season</th>
                      <th className="text-right px-4 py-3 hidden sm:table-cell">Week</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topBids.map((bid, i) => {
                      const c = ownerColor(bid.displayName);
                      return (
                        <tr key={bid.transactionId} className={`border-b border-slate-700/30 ${i % 2 === 0 ? '' : 'bg-slate-800/50'}`}>
                          <td className="px-4 py-3 text-slate-600 text-xs">{i + 1}</td>
                          <td className="px-4 py-3">
                            <span className={`font-medium ${c.text}`}>{bid.displayName}</span>
                          </td>
                          <td className="px-4 py-3 text-right font-mono font-semibold text-orange-400">
                            {formatFaab(bid.bidAmount)}
                          </td>
                          <td className="px-4 py-3 text-right text-slate-400 hidden sm:table-cell">{bid.season}</td>
                          <td className="px-4 py-3 text-right text-slate-400 hidden sm:table-cell">Wk {bid.week}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* ── Footer ───────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>
              <Award className="w-3 h-3 inline mr-1" />
              Data updated {new Date(data.generatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span>BMFFFL DogeFAAB System — Prop D(OGE)</span>
          </div>

        </div>
      </div>
    </>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const getStaticProps: GetStaticProps<Props> = async () => {
  const dataPath = path.join(process.cwd(), 'public', 'data', 'dogefaab.json');
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const data: DogeFaabData = JSON.parse(raw);
  return { props: { data } };
};
