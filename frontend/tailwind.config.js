/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        mystic: {
          bg:      '#F5EDE3',  // crema parchment cálido
          surface: '#EDE0D0',  // crema profunda para paneles
          card:    '#E8D8C8',  // blush crema para cards
          border:  '#C4B4E0',  // lavanda suave (bordes)
          purple:  '#5B6BE0',  // azul pervinca (acento principal)
          violet:  '#8070C8',  // lavanda media
          gold:    '#F0A05A',  // melocotón/ámbar (reemplaza el dorado)
          accent:  '#C4B4E0',  // lavanda acento
          text:    '#2E3C14',  // verde bosque oscuro (texto principal)
          muted:   '#7B5C3A',  // marrón cálido (texto secundario)
          glow:    '#5B6BE022',// pervinca sutil
          moss:    '#606B2C',  // verde musgo (figuras botánicas)
          mint:    '#A8C8A0',  // menta suave (hierba, naturaleza)
          blush:   '#E8D0C0',  // rosa blush (marcos)
          red:     '#CC2A1A',  // rojo botánico (acento)
        },
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        sans:    ['Josefin Sans', 'sans-serif'],
        serif:   ['Lora', 'Georgia', 'serif'],
        body:    ['Lora', 'Georgia', 'serif'],
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
        'card-enter':  'cardEnter 0.45s cubic-bezier(0.22, 1, 0.36, 1) both',
        'shake-once':  'shakeOnce 0.55s ease-in-out',
        'glow-burst':  'glowBurst 0.65s ease-out forwards',
        'card-back-shimmer': 'cardBackShimmer 1.8s ease-in-out infinite',
        'slide-in-bottom': 'slideInFromBottom 380ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-out-top':   'slideOutToTop 380ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-in-top':    'slideInFromTop 380ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-out-bottom':'slideOutToBottom 380ms cubic-bezier(0.22, 1, 0.36, 1) both',
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
          '0%, 100%': { boxShadow: '0 2px 12px #5B6BE022, 0 4px 24px #606B2C11' },
          '50%':      { boxShadow: '0 4px 24px #5B6BE055, 0 8px 40px #606B2C22' },
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
        cardEnter: {
          '0%':   { opacity: '0', transform: 'translateX(80px) scale(0.93)' },
          '100%': { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
        cardExit: {
          '0%':   { opacity: '1', transform: 'translateX(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateX(-80px) scale(0.93)' },
        },
        shakeOnce: {
          '0%, 100%': { transform: 'translateX(0) rotate(0deg)' },
          '15%': { transform: 'translateX(-7px) rotate(-1.5deg)' },
          '30%': { transform: 'translateX(7px) rotate(1.5deg)' },
          '45%': { transform: 'translateX(-5px) rotate(-0.8deg)' },
          '60%': { transform: 'translateX(5px) rotate(0.8deg)' },
          '75%': { transform: 'translateX(-2px)' },
        },
        glowBurst: {
          '0%':   { opacity: '0', transform: 'scale(0.85)' },
          '40%':  { opacity: '1', transform: 'scale(1.15)' },
          '100%': { opacity: '0', transform: 'scale(1.5)' },
        },
        cardBackShimmer: {
          '0%, 100%': { opacity: '0.5' },
          '50%':      { opacity: '1' },
        },
        slideInFromBottom: {
          '0%':   { opacity: '0', transform: 'translateY(60px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideOutToTop: {
          '0%':   { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-60px)' },
        },
        slideInFromTop: {
          '0%':   { opacity: '0', transform: 'translateY(-60px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideOutToBottom: {
          '0%':   { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(60px)' },
        },
      },
    },
  },
  plugins: [],
}
