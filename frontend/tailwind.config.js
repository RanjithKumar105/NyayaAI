/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#1e3a5f',
          700: '#1a3354',
          800: '#152b46',
          900: '#0f2035',
          950: '#0a1628',
        },
        saffron: {
          50:  '#fff8f0',
          100: '#feecdc',
          200: '#fcd9b4',
          300: '#fbbf7c',
          400: '#f99b3a',
          500: '#f47c12',
          600: '#e56407',
          700: '#be4e08',
          800: '#973f0e',
          900: '#7a340e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in':      'fadeIn 0.4s ease-out',
        'slide-up':     'slideUp 0.35s ease-out',
        'pulse-slow':   'pulse 2.5s cubic-bezier(0.4,0,0.6,1) infinite',
        'bounce-dots':  'bounceDots 1.4s infinite ease-in-out both',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        bounceDots: {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '40%':            { transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'card':     '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-md':  '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        'card-lg':  '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
      },
    },
  },
  plugins: [],
}
