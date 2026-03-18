/**
 * owner-tokens.ts
 * League emoji / personality tokens for each BMFFFL manager.
 * Consistent branding across all pages — import this instead of hardcoding.
 *
 * Usage:
 *   import { getOwnerToken, OWNER_TOKENS } from '@/lib/owner-tokens';
 *   const token = getOwnerToken('mlschools12');
 *   // { emoji: '👑', color: '#ffd700', personality: 'Dynasty Lord', tagline: '...' }
 */

export interface OwnerToken {
  slug: string;
  displayName: string;
  emoji: string;
  color: string;
  personality: string;
  tagline: string;
  archetype: 'dynasty' | 'contender' | 'wildcard' | 'rebuilding';
}

export const OWNER_TOKENS: OwnerToken[] = [
  {
    slug: 'mlschools12',
    displayName: 'MLSchools12',
    emoji: '👑',
    color: '#ffd700',
    personality: 'Dynasty Lord',
    tagline: 'Two rings. Zero mercy.',
    archetype: 'dynasty',
  },
  {
    slug: 'tubes94',
    displayName: 'Tubes94',
    emoji: '🐋',
    color: '#38bdf8',
    personality: 'The Rising Tide',
    tagline: '2025 runner-up. Next time, the ring is mine.',
    archetype: 'contender',
  },
  {
    slug: 'sexmachineandy',
    displayName: 'SexMachineAndyD',
    emoji: '⚡',
    color: '#a78bfa',
    personality: 'The Perennial Contender',
    tagline: 'Four playoff runs. The title is overdue.',
    archetype: 'contender',
  },
  {
    slug: 'juicybussy',
    displayName: 'JuicyBussy',
    emoji: '💥',
    color: '#f97316',
    personality: 'The Chaos Engine',
    tagline: '245.80 points. One ring. Infinite explosions.',
    archetype: 'wildcard',
  },
  {
    slug: 'rbr',
    displayName: 'rbr',
    emoji: '🔵',
    color: '#60a5fa',
    personality: 'The Chess Master',
    tagline: 'Two finals. The best lineup IQ in the league.',
    archetype: 'contender',
  },
  {
    slug: 'cogdeill11',
    displayName: 'Cogdeill11',
    emoji: '🏆',
    color: '#94a3b8',
    personality: 'The Founding Champion',
    tagline: '2020 champion. Won the tightest game in history.',
    archetype: 'rebuilding',
  },
  {
    slug: 'grandes',
    displayName: 'Grandes',
    emoji: '⚖️',
    color: '#34d399',
    personality: 'The Commissioner',
    tagline: 'Founded this league. Won it in 2022. The law is his.',
    archetype: 'rebuilding',
  },
  {
    slug: 'tdtd19844',
    displayName: 'tdtd19844',
    emoji: '🔥',
    color: '#fb923c',
    personality: 'The Resurrection',
    tagline: '3-11 to champion in three years. Never count them out.',
    archetype: 'dynasty',
  },
  {
    slug: 'eldridsm',
    displayName: 'eldridsm',
    emoji: '🗡️',
    color: '#e2e8f0',
    personality: 'The Giant Slayer',
    tagline: 'Knocked out MLSchools12 in 2020 with 181 points.',
    archetype: 'contender',
  },
  {
    slug: 'eldridm20',
    displayName: 'eldridm20',
    emoji: '🎯',
    color: '#f472b6',
    personality: 'The Bracket Buster',
    tagline: 'Eliminated the #1 seed twice. Just can\'t close.',
    archetype: 'wildcard',
  },
  {
    slug: 'cmaleski',
    displayName: 'Cmaleski',
    emoji: '🎭',
    color: '#c084fc',
    personality: 'The Underrated',
    tagline: '1,990 points in 2025. The record doesn\'t tell the story.',
    archetype: 'wildcard',
  },
  {
    slug: 'escuelas',
    displayName: 'Escuelas',
    emoji: '🌱',
    color: '#4ade80',
    personality: 'The Long Rebuild',
    tagline: 'Joined 2022. Zero playoffs. The climb continues.',
    archetype: 'rebuilding',
  },
];

export function getOwnerToken(slug: string): OwnerToken | undefined {
  return OWNER_TOKENS.find((t) => t.slug === slug);
}

export function getOwnerEmoji(slug: string): string {
  return getOwnerToken(slug)?.emoji ?? '🏈';
}

export function getOwnerColor(slug: string): string {
  return getOwnerToken(slug)?.color ?? '#94a3b8';
}

/**
 * Archetype badge text helper.
 */
export const ARCHETYPE_LABELS: Record<OwnerToken['archetype'], string> = {
  dynasty:    'Dynasty',
  contender:  'Contender',
  wildcard:   'Wildcard',
  rebuilding: 'Rebuilding',
};
