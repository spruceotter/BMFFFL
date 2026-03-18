/**
 * BMFFFL — Manager Team Color Palette
 * task-916 | Each manager has a primary background color and a bright accent.
 * Use getManagerColor(slug) anywhere you need per-manager theming.
 */

export interface ManagerColors {
  primary: string;
  accent: string;
  name: string;
}

export const MANAGER_COLORS: Record<string, ManagerColors> = {
  mlschools12:       { primary: '#1a472a', accent: '#00ff88', name: 'Forest Green' },
  tubes94:           { primary: '#1e3a5f', accent: '#60a5fa', name: 'Ocean Blue' },
  sexmachineandy:    { primary: '#4a1942', accent: '#c084fc', name: 'Purple' },
  cogdeill11:        { primary: '#7c2d12', accent: '#fb923c', name: 'Burnt Orange' },
  grandes:           { primary: '#713f12', accent: '#fbbf24', name: 'Amber Gold' },
  juicybussy:        { primary: '#134e4a', accent: '#2dd4bf', name: 'Teal' },
  tdtd19844:         { primary: '#1e1b4b', accent: '#818cf8', name: 'Indigo' },
  eldridm20:         { primary: '#881337', accent: '#fb7185', name: 'Rose' },
  rbr:               { primary: '#0c4a6e', accent: '#38bdf8', name: 'Sky Blue' },
  bro_set:           { primary: '#064e3b', accent: '#34d399', name: 'Emerald' },
  cheeseandcrackers: { primary: '#78350f', accent: '#f59e0b', name: 'Orange' },
  jimmyeatwurld:     { primary: '#3b0764', accent: '#a855f7', name: 'Violet' },
};

/** Returns the color pair for a given manager slug, falling back to league default. */
export function getManagerColor(slug: string): ManagerColors {
  return MANAGER_COLORS[slug] ?? { primary: '#1a1a2e', accent: '#ffd700', name: 'Default' };
}
