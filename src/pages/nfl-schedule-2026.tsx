/**
 * BMFFFL — 2026 NFL Schedule Analysis
 * /nfl-schedule-2026
 *
 * Hot takes, strength of schedule rankings, bye week grid,
 * and per-owner BMFFFL impact analysis.
 */

import Head from 'next/head';
import { GetStaticProps } from 'next';
import * as fs from 'fs';
import * as path from 'path';
import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Calendar, Zap, Trophy, AlertTriangle } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SosTeam {
  rank: number;
  team: string;
  abbr: string;
  conf: string;
  div: string;
  byeWeek: number;
  winTotal: number;
  sosNote: string;
}

interface HotTake {
  id: number;
  title: string;
  summary: string;
  impact: 'positive' | 'negative' | 'mixed';
  owner: string;
  players: string[];
  team: string;
  sosRank: number;
}

interface PlayerImpact {
  name: string;
  team: string;
  sosRank: number;
  byeWeek: number;
  note: string;
}

interface OwnerImpact {
  owner: string;
  verdict: string;
  color: 'green' | 'yellow' | 'red';
  players: PlayerImpact[];
}

interface ScheduleData {
  generated: string;
  source: string;
  sosRankings: SosTeam[];
  byeWeeks: Record<string, string[]>;
  hotTakes: HotTake[];
  bmfffImpact: OwnerImpact[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sosColor(rank: number): string {
  if (rank <= 8)  return 'text-emerald-400';
  if (rank <= 16) return 'text-yellow-400';
  if (rank <= 24) return 'text-orange-400';
  return 'text-red-400';
}

function sosBg(rank: number): string {
  if (rank <= 8)  return 'bg-emerald-900/30 border-emerald-700/40';
  if (rank <= 16) return 'bg-yellow-900/20 border-yellow-700/40';
  if (rank <= 24) return 'bg-orange-900/20 border-orange-700/40';
  return 'bg-red-900/30 border-red-700/40';
}

function impactIcon(impact: string) {
  if (impact === 'positive') return <TrendingUp size={16} className="text-emerald-400 shrink-0" />;
  if (impact === 'negative') return <TrendingDown size={16} className="text-red-400 shrink-0" />;
  return <Minus size={16} className="text-yellow-400 shrink-0" />;
}

function impactBorder(impact: string): string {
  if (impact === 'positive') return 'border-emerald-700/50 bg-emerald-950/30';
  if (impact === 'negative') return 'border-red-700/50 bg-red-950/30';
  return 'border-yellow-700/50 bg-yellow-950/20';
}

function verdictColor(color: string): string {
  if (color === 'green')  return 'text-emerald-400';
  if (color === 'red')    return 'text-red-400';
  return 'text-yellow-400';
}

function playerSosColor(rank: number): string {
  if (rank <= 8)  return 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50';
  if (rank <= 16) return 'bg-yellow-900/30 text-yellow-300 border-yellow-700/50';
  if (rank <= 24) return 'bg-orange-900/30 text-orange-300 border-orange-700/50';
  return 'bg-red-900/40 text-red-300 border-red-700/50';
}

// ─── Components ───────────────────────────────────────────────────────────────

type Tab = 'takes' | 'sos' | 'byes' | 'impact';

// ─── Page ─────────────────────────────────────────────────────────────────────

interface Props {
  data: ScheduleData;
}

export default function NflSchedule2026({ data }: Props) {
  const [tab, setTab] = useState<Tab>('takes');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'takes',  label: '🔥 Hot Takes' },
    { id: 'sos',    label: '📊 Strength of Schedule' },
    { id: 'byes',   label: '📅 Bye Weeks' },
    { id: 'impact', label: '🏆 BMFFFL Impact' },
  ];

  return (
    <>
      <Head>
        <title>2026 NFL Schedule Analysis — BMFFFL</title>
        <meta name="description" content="2026 NFL schedule analysis: strength of schedule rankings, bye weeks, and BMFFFL fantasy impact by owner." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-[#0a0a0f] text-white">
        {/* Header */}
        <div className="border-b border-gray-800 px-4 py-5">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-start gap-3">
              <Zap className="text-[#ffd700] mt-0.5 shrink-0" size={22} />
              <div>
                <h1 className="text-xl font-bold text-white">2026 NFL Schedule Analysis</h1>
                <p className="text-gray-400 text-sm mt-0.5">
                  Schedule released May 2026 — hot takes, SOS rankings & BMFFFL owner impact
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mt-5 flex-wrap">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    tab === t.id
                      ? 'bg-[#ffd700] text-black'
                      : 'bg-gray-800/60 text-gray-400 hover:text-white hover:bg-gray-700/60'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-6">

          {/* ── Hot Takes ── */}
          {tab === 'takes' && (
            <div className="space-y-4">
              <p className="text-gray-500 text-sm">
                Early consensus takes on the 2026 NFL schedule — filtered for BMFFFL relevance.
              </p>
              {data.hotTakes.map((take, i) => (
                <div
                  key={take.id}
                  className={`border rounded-xl p-5 ${impactBorder(take.impact)}`}
                >
                  <div className="flex items-start gap-3">
                    {impactIcon(take.impact)}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">#{i + 1}</span>
                        <h3 className="text-base font-bold text-white">{take.title}</h3>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{take.summary}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700">
                          Owner: {take.owner}
                        </span>
                        {take.players.map((p) => (
                          <span key={p} className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 border border-gray-600">
                            {p}
                          </span>
                        ))}
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${sosColor(take.sosRank)} bg-gray-800/50 border-gray-600`}>
                          SOS #{take.sosRank}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <p className="text-gray-600 text-xs mt-4">
                Sources: ESPN, Sharp Football Analysis, CBS Sports, NFL.com — {data.generated}
              </p>
            </div>
          )}

          {/* ── Strength of Schedule ── */}
          {tab === 'sos' && (
            <div>
              <div className="flex gap-4 mb-4 flex-wrap text-xs">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-700/60 inline-block" />Easiest (1–8)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-yellow-700/40 inline-block" />Easy (9–16)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-orange-700/40 inline-block" />Hard (17–24)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-700/50 inline-block" />Hardest (25–32)</span>
              </div>
              <div className="space-y-1.5">
                {data.sosRankings.map((team) => (
                  <div
                    key={team.abbr}
                    className={`border rounded-lg px-4 py-2.5 flex items-center gap-3 ${sosBg(team.rank)}`}
                  >
                    <span className={`text-sm font-bold w-6 text-right shrink-0 ${sosColor(team.rank)}`}>
                      {team.rank}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-medium text-sm">{team.team}</span>
                        <span className="text-xs text-gray-500">{team.conf} · Bye Wk {team.byeWeek}</span>
                        <span className="text-xs text-gray-600">O/U {team.winTotal}W</span>
                      </div>
                      <p className="text-gray-400 text-xs mt-0.5 truncate">{team.sosNote}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Bye Weeks ── */}
          {tab === 'byes' && (
            <div className="space-y-3">
              <p className="text-gray-500 text-sm mb-4">
                No byes in Week 12 (Thanksgiving). 6 teams off in Week 11 — the most of any week.
              </p>
              {Object.entries(data.byeWeeks)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([week, teams]) => (
                  <div key={week} className="bg-gray-900/60 border border-gray-700/60 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar size={14} className="text-[#ffd700] shrink-0" />
                      <h3 className="text-sm font-bold text-white">Week {week} Bye</h3>
                      {Number(week) <= 6 && (
                        <span className="text-xs text-orange-400 bg-orange-900/30 border border-orange-700/40 px-2 py-0.5 rounded-full">
                          Early bye
                        </span>
                      )}
                      {Number(week) >= 13 && (
                        <span className="text-xs text-emerald-400 bg-emerald-900/30 border border-emerald-700/40 px-2 py-0.5 rounded-full">
                          Late bye ✓
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {teams.map((t) => {
                        const sosTeam = data.sosRankings.find((s) => s.team === t);
                        return (
                          <span
                            key={t}
                            className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${
                              sosTeam ? playerSosColor(sosTeam.rank) : 'bg-gray-800 text-gray-400 border-gray-600'
                            }`}
                          >
                            {sosTeam?.abbr ?? t} <span className="opacity-60">#{sosTeam?.rank}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              <p className="text-gray-600 text-xs mt-2">Tag color = schedule difficulty (green=easy, red=hard)</p>
            </div>
          )}

          {/* ── BMFFFL Impact ── */}
          {tab === 'impact' && (
            <div className="space-y-4">
              <p className="text-gray-500 text-sm mb-2">
                Schedule luck isn&apos;t everything — but it&apos;s something. Here&apos;s how the 2026 NFL schedule falls for each BMFFFL owner.
              </p>
              {data.bmfffImpact.map((owner) => (
                <div
                  key={owner.owner}
                  className={`border rounded-xl p-5 ${
                    owner.color === 'green' ? 'border-emerald-700/50 bg-emerald-950/20' :
                    owner.color === 'red'   ? 'border-red-700/50 bg-red-950/20' :
                                              'border-yellow-700/40 bg-yellow-950/10'
                  }`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                    <h3 className="text-base font-bold text-white">{owner.owner}</h3>
                    <span className={`text-sm font-semibold ${verdictColor(owner.color)}`}>
                      {owner.verdict}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {owner.players.map((p) => (
                      <div key={p.name} className="flex items-start gap-3">
                        <div className={`text-xs px-2 py-0.5 rounded border shrink-0 mt-0.5 font-bold ${playerSosColor(p.sosRank)}`}>
                          {p.team} #{p.sosRank}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-white">{p.name}</span>
                            <span className="text-xs text-gray-500">Bye Wk {p.byeWeek}</span>
                          </div>
                          <p className="text-gray-400 text-xs mt-0.5">{p.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="mt-6 p-4 bg-gray-900/40 border border-gray-700/50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={14} className="text-yellow-400" />
                  <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">Analyst note</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Schedule strength is calculated from 2025 opponent win totals and projected 2026 strength.
                  Injury, coaching changes, and mid-season trades will shift the actual impact.
                  Bye weeks matter most in BMFFFL during weeks 14–17 playoff push.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const filePath = path.join(process.cwd(), 'public', 'data', 'nfl-schedule-2026.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data: ScheduleData = JSON.parse(raw);
  return { props: { data } };
};
