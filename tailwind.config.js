/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // BMFFFL brand colors — deep navy + gold + slate
        brand: {
          navy:     '#0d1b2a',  // primary dark background
          'navy-l': '#1a2d42',  // lighter navy for cards
          gold:     '#f0a500',  // accent / highlights
          'gold-l': '#f7c948',  // lighter gold for hover states
          slate:    '#6b7f96',  // muted text / secondary
          cream:    '#f5f0e8',  // light mode text
        },
        // Semantic
        win:  '#22c55e',   // green-500
        loss: '#ef4444',   // red-500
        tie:  '#94a3b8',   // slate-400
        // Manager-specific team colors
        manager: {
          mlschools12:       { primary: '#1a472a', accent: '#00ff88' },  // deep forest green
          tubes94:           { primary: '#1e3a5f', accent: '#60a5fa' },  // ocean blue
          sexmachineandy:    { primary: '#4a1942', accent: '#c084fc' },  // purple
          cogdeill11:        { primary: '#7c2d12', accent: '#fb923c' },  // burnt orange
          grandes:           { primary: '#713f12', accent: '#fbbf24' },  // amber/gold
          juicybussy:        { primary: '#134e4a', accent: '#2dd4bf' },  // teal
          tdtd19844:         { primary: '#1e1b4b', accent: '#818cf8' },  // indigo
          eldridm20:         { primary: '#881337', accent: '#fb7185' },  // rose
          rbr:               { primary: '#0c4a6e', accent: '#38bdf8' },  // sky blue
          bro_set:           { primary: '#064e3b', accent: '#34d399' },  // emerald
          cheeseandcrackers: { primary: '#78350f', accent: '#f59e0b' },  // orange
          jimmyeatwurld:     { primary: '#3b0764', accent: '#a855f7' },  // violet
        },
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'monospace'],
        stats: ['"Roboto Mono"', 'monospace'],  // tabular numbers
      },
      fontSize: {
        'stat-lg': ['2rem',   { lineHeight: '1.1', fontWeight: '700' }],
        'stat-md': ['1.25rem', { lineHeight: '1.2', fontWeight: '600' }],
        'stat-sm': ['0.875rem', { lineHeight: '1.3', fontWeight: '500' }],
      },
    },
  },
  plugins: [],
};
