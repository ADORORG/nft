/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-changa)'],
        mono: ['var(--font-inconsolata)']
      },
      colors: {
        primary: colors.rose,
        secondary: colors.purple,
        tertiary: colors.cyan,
        gray: colors.neutral
      },
    },
  },
  plugins: [],
}
