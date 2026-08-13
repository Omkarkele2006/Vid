/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vid: {
          bg:       '#070B14',
          surface:  '#0D1526',
          card:     '#111B2E',
          border:   '#1E2D4A',
          muted:    '#243352',
          blue:     '#3B82F6',
          cyan:     '#06B6D4',
          purple:   '#8B5CF6',
          indigo:   '#6366F1',
          green:    '#10B981',
          amber:    '#F59E0B',
          red:      '#EF4444',
          text:     '#E2E8F0',
          subtext:  '#94A3B8',
          dim:      '#475569',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-cyber': 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #06B6D4 100%)',
        'gradient-card':  'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.08) 100%)',
        'gradient-glow':  'radial-gradient(ellipse at top, rgba(59,130,246,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'card':    '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'glow-b':  '0 0 20px rgba(59,130,246,0.3)',
        'glow-p':  '0 0 20px rgba(139,92,246,0.3)',
        'glow-c':  '0 0 20px rgba(6,182,212,0.3)',
      },
      animation: {
        'pulse-slow':   'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow':    'spin 8s linear infinite',
        'gradient-x':  'gradient-x 4s ease infinite',
        'float':       'float 6s ease-in-out infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%':       { 'background-position': '100% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
      },
      borderRadius: {
        'xl2': '1rem',
        'xl3': '1.5rem',
      },
    },
  },
  plugins: [],
}
