/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        mystic: {
          bg:      '#0a0a18',
          surface: '#101026',
          card:    '#14143a',
          border:  '#2a1f4e',
          purple:  '#7b2d8b',
          violet:  '#5b21b6',
          gold:    '#c9a84c',
          accent:  '#e8c97e',
          text:    '#e2d9f3',
          muted:   '#8878aa',
          glow:    '#c9a84c33',
        },
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        sans:    ['Josefin Sans', 'sans-serif'],
        serif:   ['Cinzel', '"Palatino Linotype"', 'Georgia', 'serif'],
      },
      animation: {
        'pulse-slow':  'pulse 3s ease-in-out infinite',
        'float':       'float 6s ease-in-out infinite',
        'float-slow':  'float 9s ease-in-out infinite',
        'blink':       'blink 1s step-end infinite',
        'glow':        'glow 3s ease-in-out infinite',
        'shimmer':     'shimmer 2.5s linear infinite',
        'spin-slow':   'spin 12s linear infinite',
        'waveform':    'waveform 0.9s ease-in-out infinite',
        'fadeIn':      'fadeIn 0.45s ease-out both',
        'fadeInUp':    'fadeInUp 0.5s ease-out both',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 10px #c9a84c22, 0 0 20px #c9a84c11' },
          '50%':      { boxShadow: '0 0 25px #c9a84c55, 0 0 50px #c9a84c22' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        waveform: {
          '0%, 100%': { transform: 'scaleY(0.3)', opacity: '0.5' },
          '50%':      { transform: 'scaleY(1)',   opacity: '1'   },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)'   },
        },
      },
    },
  },
  plugins: [],
}
