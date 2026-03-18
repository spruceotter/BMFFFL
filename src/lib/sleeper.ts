import { useState, useEffect } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────

export const LEAGUE_ID = '1312123497203376128';
export const SLEEPER_BASE = 'https://api.sleeper.app/v1';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SleeperLeagueInfo {
  name: string;
  season: string;
  status: string;
  total_rosters: number;
  scoring_settings: Record<string, number>;
  roster_positions: string[];
}

export interface SleeperUser {
  user_id: string;
  username: string;
  display_name: string;
  avatar: string | null;
}

export interface SleeperRoster {
  roster_id: number;
  owner_id: string;
  players: string[];
  starters: string[];
  reserve: string[] | null;
  taxi: string[] | null;
  settings: {
    wins: number;
    losses: number;
    ties: number;
    fpts: number;
    fpts_decimal: number;
    fpts_against: number;
    fpts_against_decimal: number;
  };
}

export interface SleeperMatchup {
  matchup_id: number;
  roster_id: number;
  starters: string[];
  players: string[];
  points: number;
  starters_points: number[];
}

// ─── API Functions ────────────────────────────────────────────────────────────

export async function fetchLeague(leagueId: string = LEAGUE_ID): Promise<SleeperLeagueInfo> {
  const res = await fetch(`${SLEEPER_BASE}/league/${leagueId}`);
  if (!res.ok) throw new Error(`Failed to fetch league: ${res.status}`);
  return res.json();
}

export async function fetchUsers(leagueId: string = LEAGUE_ID): Promise<SleeperUser[]> {
  const res = await fetch(`${SLEEPER_BASE}/league/${leagueId}/users`);
  if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);
  return res.json();
}

export async function fetchRosters(leagueId: string = LEAGUE_ID): Promise<SleeperRoster[]> {
  const res = await fetch(`${SLEEPER_BASE}/league/${leagueId}/rosters`);
  if (!res.ok) throw new Error(`Failed to fetch rosters: ${res.status}`);
  return res.json();
}

export async function fetchMatchups(leagueId: string, week: number): Promise<SleeperMatchup[]> {
  const res = await fetch(`${SLEEPER_BASE}/league/${leagueId}/matchups/${week}`);
  if (!res.ok) throw new Error(`Failed to fetch matchups: ${res.status}`);
  return res.json();
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseSleeperLeagueResult {
  league: SleeperLeagueInfo | null;
  users: SleeperUser[];
  rosters: SleeperRoster[];
  loading: boolean;
  error: string | null;
}

/**
 * Client-side hook that fetches league info, users, and rosters in parallel.
 * Safe to use in Pages Router components — no 'use client' directive needed.
 *
 * @example
 * const { league, users, rosters, loading, error } = useSleeperLeague();
 */
export function useSleeperLeague(leagueId: string = LEAGUE_ID): UseSleeperLeagueResult {
  const [league, setLeague] = useState<SleeperLeagueInfo | null>(null);
  const [users, setUsers] = useState<SleeperUser[]>([]);
  const [rosters, setRosters] = useState<SleeperRoster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [leagueData, usersData, rostersData] = await Promise.all([
          fetchLeague(leagueId),
          fetchUsers(leagueId),
          fetchRosters(leagueId),
        ]);

        if (!cancelled) {
          setLeague(leagueData);
          setUsers(usersData);
          setRosters(rostersData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load league data');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [leagueId]);

  return { league, users, rosters, loading, error };
}
