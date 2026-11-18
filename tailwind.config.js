export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#050505',
        panel: '#0A0A0D',
        muted: '#92929B',
        accent: '#8875FF',
        mint: '#00D6A0',
        cyan: '#16D9E8',
        magenta: '#D66BCE',
        burgundy: '#6E304D',
      },
      fontFamily: {
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 42px rgba(136, 117, 255, 0.18)',
      },
    },
  },
  plugins: [],
}
