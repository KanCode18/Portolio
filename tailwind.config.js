/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 24px 80px rgba(37, 99, 235, 0.16)',
      },
      fontFamily: {
        sans: ['Syne', 'sans-serif'],
        heading: ['DM Mono', 'Syne', 'sans-serif'],
      },
      colors: {
        accent: '#2563eb',
        surface: '#111111',
        surface2: '#141414',
        muted: '#9ca3af',
      },
    },
  },
  plugins: [],
};
