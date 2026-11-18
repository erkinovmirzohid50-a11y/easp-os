/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#090b10',
        panel: '#11141c',
        muted: '#8b90a0',
        accent: '#a78bfa',
        mint: '#85e0c3',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 42px rgba(167, 139, 250, 0.16)',
      },
    },
  },
  plugins: [],
}
