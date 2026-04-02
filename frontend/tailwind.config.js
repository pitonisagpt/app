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
      },
    },
  },
  plugins: [],
}
