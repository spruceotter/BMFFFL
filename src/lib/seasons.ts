// src/lib/seasons.ts
// Re-exports season data as a utility
// The actual data lives in src/pages/history/[year].tsx
// This provides types for external consumers

export interface SeasonSummary {
  year: number;
  champion: string;
  championOwner: string;
  runnerUp: string;
  championshipScore: string;
}

// Champion history validated 2026-04-14. ESPN era (2016-2019) confirmed by Commissioner. Sleeper era (2020-2025) verified from SQLite DB.
export const SEASON_SUMMARIES: SeasonSummary[] = [
  { year: 2016, champion: 'The Murder Boners',           championOwner: 'MLSchools12',     runnerUp: '', championshipScore: '' },
  { year: 2017, champion: 'Alvin and the Chipmunks',     championOwner: 'Cogdeill11',      runnerUp: '', championshipScore: '' },
  { year: 2018, champion: 'Stand Against Trade Rape',    championOwner: 'SexMachineAndyD', runnerUp: '', championshipScore: '' },
  { year: 2019, champion: 'The Murder Boners',           championOwner: 'MLSchools12',     runnerUp: '', championshipScore: '' },
  { year: 2020, champion: 'Alvin and the Chipmunks', championOwner: 'Cogdeill11',  runnerUp: 'eldridsm',        championshipScore: '203.10 - 198.34' },
  { year: 2021, champion: 'The Murder Boners',        championOwner: 'MLSchools12', runnerUp: 'SexMachineAndyD', championshipScore: '193.10 - 111.34' },
  { year: 2022, champion: 'El Rioux Grandes',         championOwner: 'Grandes',     runnerUp: 'rbr',             championshipScore: '137.82 - 115.08' },
  { year: 2023, champion: 'Juicy Bussy',              championOwner: 'JuicyBussy',  runnerUp: 'eldridm20',       championshipScore: '179.40 - 149.62' },
  { year: 2024, champion: 'Schoolcraft Football Team',championOwner: 'MLSchools12', runnerUp: 'SexMachineAndyD', championshipScore: '168.40 - 146.86' },
  { year: 2025, champion: 'THE Shameful Saggy sack',  championOwner: 'tdtd19844',   runnerUp: 'Tubes94',         championshipScore: '152.92 - 135.08' },
];
