import { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { Search, Filter, Users } from 'lucide-react';
import { cn } from '@/lib/cn';
import Badge from '@/components/ui/Badge';
import * as fs from 'fs';
import * as path from 'path';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlayerIndexEntry {
  player_id: string;
  name: string;
  position: string;
  nfl_team: string;
  current_bmfffl_owner: string | null;
  ownership_count: number;
  first_season: string;
  career_pts_started: number;
  weeks_in_league: number;
}

interface Props {
  players: PlayerIndexEntry[];
}

// ─── Position color map ───────────────────────────────────────────────────────

const POS_COLORS: Record<string, string> = {
  QB: 'bg-red-500/20 text-red-300 border-red-500/30',
  RB: 'bg-green-500/20 text-green-300 border-green-500/30',
  WR: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  TE: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  K:  'bg-gray-500/20 text-gray-300 border-gray-500/30',
  DEF:'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

const POSITIONS = ['All', 'QB', 'RB', 'WR', 'TE'];

// ─── Component ────────────────────────────────────────────────────────────────

export default function PlayersPage({ players }: Props) {
  const [search, setSearch] = useState('');
  const [posFilter, setPosFilter] = useState('All');
  const [showActive, setShowActive] = useState(false);

  const filtered = useMemo(() => {
    let result = players;
    if (posFilter !== 'All') result = result.filter(p => p.position === posFilter);
    if (showActive) result = result.filter(p => p.current_bmfffl_owner !== null);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.current_bmfffl_owner || '').toLowerCase().includes(q) ||
        (p.nfl_team || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [players, search, posFilter, showActive]);

  return (
    <>
      <Head>
        <title>Players — BMFFFL</title>
        <meta name="description" content="Every player tracked in BMFFFL history — ownership timeline, fantasy performance, and dynasty value." />
      </Head>

      <main className="min-h-screen bg-gray-950 text-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-7 h-7 text-emerald-400" />
              <h1 className="text-3xl font-bold text-white">Players</h1>
            </div>
            <p className="text-gray-400 text-sm">
              {players.length.toLocaleString()} players tracked across BMFFFL history (2016–2025).
              Click any player for ownership timeline, weekly performance, and dynasty value history.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search players, owners, NFL teams..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
              />
            </div>

            {/* Position filter */}
            <div className="flex gap-2">
              {POSITIONS.map(pos => (
                <button
                  key={pos}
                  onClick={() => setPosFilter(pos)}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium rounded-md border transition-colors',
                    posFilter === pos
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500'
                  )}
                >
                  {pos}
                </button>
              ))}
            </div>

            {/* Active only toggle */}
            <button
              onClick={() => setShowActive(a => !a)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap',
                showActive
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500'
              )}
            >
              Active only
            </button>
          </div>

          {/* Results count */}
          <p className="text-xs text-gray-500 mb-4">
            {filtered.length.toLocaleString()} player{filtered.length !== 1 ? 's' : ''}
            {posFilter !== 'All' || search || showActive ? ' matching filters' : ''}
          </p>

          {/* Player grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.slice(0, 200).map(player => (
              <PlayerCard key={player.player_id} player={player} />
            ))}
          </div>

          {filtered.length > 200 && (
            <p className="text-center text-gray-500 text-sm mt-8">
              Showing top 200 of {filtered.length}. Use search to narrow results.
            </p>
          )}
        </div>
      </main>
    </>
  );
}

function PlayerCard({ player }: { player: PlayerIndexEntry }) {
  const posClass = POS_COLORS[player.position] || POS_COLORS.K;

  return (
    <Link href={`/players/${player.player_id}`}>
      <div className="group bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-emerald-500/40 hover:bg-gray-800/80 transition-all cursor-pointer">
        {/* Name + position */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="font-semibold text-white text-sm leading-tight group-hover:text-emerald-300 transition-colors line-clamp-1">
            {player.name}
          </span>
          <span className={cn('text-xs px-1.5 py-0.5 rounded border font-mono shrink-0', posClass)}>
            {player.position}
          </span>
        </div>

        {/* NFL team */}
        {player.nfl_team && (
          <p className="text-xs text-gray-500 mb-2">{player.nfl_team}</p>
        )}

        {/* Stats row */}
        <div className="flex items-center justify-between text-xs text-gray-400 mt-auto">
          <span>
            {player.career_pts_started > 0
              ? <><span className="text-white font-medium">{player.career_pts_started.toFixed(0)}</span> pts</>
              : <span className="text-gray-600">no pts data</span>
            }
          </span>
          <span className="text-gray-600">
            {player.ownership_count > 1 ? `${player.ownership_count} owners` : `since ${player.first_season}`}
          </span>
        </div>

        {/* Current owner */}
        {player.current_bmfffl_owner && (
          <div className="mt-2 pt-2 border-t border-gray-800">
            <span className="text-xs text-emerald-400">
              {player.current_bmfffl_owner}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

// ─── Static data ──────────────────────────────────────────────────────────────

export const getStaticProps: GetStaticProps<Props> = async () => {
  const dataPath = path.join(process.cwd(), 'public', 'data', 'player-index.json');
  const players: PlayerIndexEntry[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  return {
    props: { players },
  };
};
