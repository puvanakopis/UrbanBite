/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#090909',
        surface: {
          DEFAULT: '#141414',
          subtle: '#181818',
          hover: '#1e1e1e',
        },
        gold: {
          DEFAULT: '#d4af37',
          light: '#f3e5ab',
          dark: '#aa8c2c',
        },
        cream: '#faf8f5',
        border: {
          subtle: 'rgba(255, 255, 255, 0.08)',
          gold: 'rgba(212, 175, 55, 0.35)',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Cinzel"', 'serif'],
        display: ['"Cinzel"', 'serif'],
      },
      letterSpacing: {
        widest: '2px',
        brand: '3px',
      }
    },
  },
  plugins: [],
}
