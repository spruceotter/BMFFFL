/**
 * BMFFFL Owners Meeting — Availability Poll
 * /meeting
 *
 * Owners select their name and check which dates work.
 * Responses stored in Convex (agent_tasks, task_type: "meeting_poll").
 * Results grid shows live availability across all owners.
 */

import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, Calendar, Users, RefreshCw } from 'lucide-react';

// ─── Config ──────────────────────────────────────────────────────────────────

const CONVEX_URL = 'https://resolute-setter-416.convex.cloud';
const TASK_TYPE = 'meeting_poll';

const OWNERS = [
  'Grandes',
  'SexMachineAndyD',
  'rbr',
  'Cogdeill11',
  'MLSchools12',
  'Cmaleski',
  'eldridm20',
  'JuicyBussy',
  'eldridsm',
  'tdtd19844',
  'Tubes94',
];

// May 18 (Mon) through May 30 (Sat) — 13 days
const DATES: { key: string; label: string; short: string; dayOfWeek: string }[] = [
  { key: '2026-05-18', label: 'Mon May 18', short: 'M 5/18', dayOfWeek: 'Mon' },
  { key: '2026-05-19', label: 'Tue May 19', short: 'T 5/19', dayOfWeek: 'Tue' },
  { key: '2026-05-20', label: 'Wed May 20', short: 'W 5/20', dayOfWeek: 'Wed' },
  { key: '2026-05-21', label: 'Thu May 21', short: 'Th 5/21', dayOfWeek: 'Thu' },
  { key: '2026-05-22', label: 'Fri May 22', short: 'F 5/22', dayOfWeek: 'Fri' },
  { key: '2026-05-23', label: 'Sat May 23', short: 'Sa 5/23', dayOfWeek: 'Sat' },
  { key: '2026-05-24', label: 'Sun May 24', short: 'Su 5/24', dayOfWeek: 'Sun' },
  { key: '2026-05-25', label: 'Mon May 25', short: 'M 5/25', dayOfWeek: 'Mon' },
  { key: '2026-05-26', label: 'Tue May 26', short: 'T 5/26', dayOfWeek: 'Tue' },
  { key: '2026-05-27', label: 'Wed May 27', short: 'W 5/27', dayOfWeek: 'Wed' },
  { key: '2026-05-28', label: 'Thu May 28', short: 'Th 5/28', dayOfWeek: 'Thu' },
  { key: '2026-05-29', label: 'Fri May 29', short: 'F 5/29', dayOfWeek: 'Fri' },
  { key: '2026-05-30', label: 'Sat May 30', short: 'Sa 5/30', dayOfWeek: 'Sat' },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface PollResponse {
  owner_name: string;
  available_dates: string[];
  submitted_at: string;
}

// ─── Convex helpers ───────────────────────────────────────────────────────────

async function submitResponse(owner_name: string, available_dates: string[]): Promise<void> {
  const task_id = `meeting-poll-${owner_name}-${Date.now()}`;
  const resp = await fetch(`${CONVEX_URL}/api/mutation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      path: 'bmfffl:createTask',
      format: 'json',
      args: {
        task_id,
        from_agent: 'web_form',
        to_agent: 'bimfle',
        task_type: TASK_TYPE,
        payload: { owner_name, available_dates, submitted_at: new Date().toISOString() },
      },
    }),
  });
  if (!resp.ok) throw new Error('Submit failed');
}

async function fetchResponses(): Promise<PollResponse[]> {
  const resp = await fetch(`${CONVEX_URL}/api/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      path: 'bmfffl:getTasksFromAgent',
      format: 'json',
      args: { from_agent: 'web_form' },
    }),
  });
  if (!resp.ok) return [];
  const json = await resp.json();
  const tasks = (json.value ?? []) as { task_type: string; payload: PollResponse }[];
  return tasks
    .filter((t) => t.task_type === TASK_TYPE)
    .map((t) => t.payload as PollResponse)
    .filter((p) => p?.owner_name && Array.isArray(p.available_dates));
}

// ─── Components ───────────────────────────────────────────────────────────────

function ResultsGrid({ responses }: { responses: PollResponse[] }) {
  if (responses.length === 0) {
    return (
      <p className="text-gray-500 text-sm text-center py-8">
        No responses yet — be the first.
      </p>
    );
  }

  const respondedOwners = [...new Set(responses.map((r) => r.owner_name))];
  // Take the latest response per owner
  const latestByOwner = new Map<string, PollResponse>();
  responses.forEach((r) => {
    const existing = latestByOwner.get(r.owner_name);
    if (!existing || r.submitted_at > existing.submitted_at) {
      latestByOwner.set(r.owner_name, r);
    }
  });

  const ownerList = [...latestByOwner.keys()];
  const dateCount = new Map<string, number>();
  DATES.forEach((d) => {
    let count = 0;
    latestByOwner.forEach((r) => {
      if (r.available_dates.includes(d.key)) count++;
    });
    dateCount.set(d.key, count);
  });

  const maxCount = Math.max(...dateCount.values(), 0);
  const bestDates = DATES.filter((d) => dateCount.get(d.key) === maxCount && maxCount > 0);

  return (
    <div className="mt-2">
      {bestDates.length > 0 && (
        <div className="mb-4 p-3 bg-green-900/40 border border-green-600 rounded-lg">
          <p className="text-green-400 font-semibold text-sm">
            🏆 Best date{bestDates.length > 1 ? 's' : ''} ({maxCount}/{ownerList.length} available):{' '}
            {bestDates.map((d) => d.label).join(', ')}
          </p>
        </div>
      )}

      {/* Scrollable table */}
      <div className="overflow-x-auto">
        <table className="text-xs w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left text-gray-400 font-normal py-1 pr-3 min-w-[100px]">Owner</th>
              {DATES.map((d) => (
                <th
                  key={d.key}
                  className={`text-center px-1 py-1 font-normal min-w-[36px] ${
                    bestDates.some((b) => b.key === d.key) ? 'text-green-400 font-bold' : 'text-gray-400'
                  }`}
                >
                  <span className="block">{d.dayOfWeek}</span>
                  <span className="block">{d.short.split(' ')[1]}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ownerList.map((owner) => {
              const r = latestByOwner.get(owner)!;
              return (
                <tr key={owner} className="border-t border-gray-700/50">
                  <td className="py-1.5 pr-3 text-gray-300 font-medium whitespace-nowrap">{owner}</td>
                  {DATES.map((d) => (
                    <td key={d.key} className="text-center py-1.5 px-1">
                      {r.available_dates.includes(d.key) ? (
                        <span className="text-green-500 text-base">✓</span>
                      ) : (
                        <span className="text-gray-700">·</span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
            {/* Count row */}
            <tr className="border-t border-gray-600">
              <td className="py-1.5 pr-3 text-gray-500 text-xs">Total</td>
              {DATES.map((d) => {
                const count = dateCount.get(d.key) ?? 0;
                const isBest = bestDates.some((b) => b.key === d.key);
                return (
                  <td key={d.key} className={`text-center py-1.5 px-1 font-bold ${isBest ? 'text-green-400' : count > 0 ? 'text-gray-400' : 'text-gray-700'}`}>
                    {count}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-gray-600 text-xs mt-3">
        {ownerList.length} of {OWNERS.length} owners responded
        {OWNERS.filter((o) => !ownerList.includes(o)).length > 0 && (
          <> — waiting on: {OWNERS.filter((o) => !ownerList.includes(o)).join(', ')}</>
        )}
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MeetingPage() {
  const [owner, setOwner] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
  const [responses, setResponses] = useState<PollResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const loadResponses = useCallback(async () => {
    try {
      const data = await fetchResponses();
      setResponses(data);
      setLastRefresh(new Date());
    } catch {
      // silent fail on refresh
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResponses();
    const interval = setInterval(loadResponses, 30_000);
    return () => clearInterval(interval);
  }, [loadResponses]);

  const toggleDate = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!owner || selected.size === 0) return;
    setFormState('submitting');
    try {
      await submitResponse(owner, [...selected].sort());
      setFormState('done');
      await loadResponses();
    } catch {
      setFormState('error');
    }
  };

  return (
    <>
      <Head>
        <title>Owners Meeting — BMFFFL</title>
        <meta name="description" content="BMFFFL Owners Meeting availability poll" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-[#0a0a0f] text-white">
        {/* Header */}
        <div className="border-b border-gray-800 px-4 py-4">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <Calendar className="text-[#ffd700]" size={22} />
            <div>
              <h1 className="text-lg font-bold text-white">Owners Meeting</h1>
              <p className="text-gray-400 text-xs">BMFFFL 2026 — Set the date</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">

          {/* Poll Form */}
          <section className="bg-gray-900/60 border border-gray-700 rounded-xl p-5">
            <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
              <Users size={16} className="text-[#ffd700]" />
              Mark your availability
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Check every date that works for you. Pick your name, then submit.
            </p>

            {formState === 'done' ? (
              <div className="flex items-center gap-3 text-green-400 py-4">
                <CheckCircle2 size={20} />
                <span className="font-semibold">Response recorded. Results updated below.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Owner select */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Your name</label>
                  <select
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    required
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm w-full max-w-xs focus:outline-none focus:border-[#ffd700]"
                  >
                    <option value="">— select owner —</option>
                    {OWNERS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>

                {/* Date grid */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Dates that work (check all that apply)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {DATES.map((d) => (
                      <button
                        key={d.key}
                        type="button"
                        onClick={() => toggleDate(d.key)}
                        className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                          selected.has(d.key)
                            ? 'bg-[#ffd700]/20 border-[#ffd700] text-[#ffd700]'
                            : 'bg-gray-800/50 border-gray-600 text-gray-400 hover:border-gray-400'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                  {selected.size > 0 && (
                    <p className="text-xs text-gray-500 mt-2">{selected.size} date{selected.size !== 1 ? 's' : ''} selected</p>
                  )}
                </div>

                {formState === 'error' && (
                  <p className="text-red-400 text-sm">Something went wrong — try again.</p>
                )}

                <button
                  type="submit"
                  disabled={!owner || selected.size === 0 || formState === 'submitting'}
                  className="px-5 py-2 bg-[#ffd700] text-black font-bold rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-yellow-300 transition-colors"
                >
                  {formState === 'submitting' ? 'Submitting…' : 'Submit availability'}
                </button>
              </form>
            )}
          </section>

          {/* Results */}
          <section className="bg-gray-900/60 border border-gray-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Calendar size={16} className="text-[#ffd700]" />
                Results
              </h2>
              <button
                onClick={loadResponses}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                <RefreshCw size={12} />
                Refresh
                {lastRefresh && (
                  <span className="ml-1">
                    (updated {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                  </span>
                )}
              </button>
            </div>

            {loading ? (
              <p className="text-gray-500 text-sm">Loading responses…</p>
            ) : (
              <ResultsGrid responses={responses} />
            )}
          </section>

        </div>
      </div>
    </>
  );
}
