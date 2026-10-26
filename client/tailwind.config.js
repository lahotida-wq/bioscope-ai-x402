/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amber: {
          450: '#f59e0b',
          950: '#1b0f02'
        },
        bioscope: {
          dark: '#090a0f',
          card: '#12141d',
          cardBorder: '#232736',
          gold: '#e5a93c',
          goldLight: '#fcd34d',
          goldDim: 'rgba(229, 169, 60, 0.15)',
          brass: '#c28935',
          cream: '#f5f0e6',
          muted: '#94a3b8'
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace']
      },
      backgroundImage: {
        'vignette': 'radial-gradient(circle at center, transparent 40%, rgba(9, 10, 15, 0.85) 100%)',
        'brass-gradient': 'linear-gradient(135deg, #d49a3f 0%, #aa7228 50%, #f4c06c 100%)'
      }
    },
  },
  plugins: [],
}
