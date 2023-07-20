/** @type {import('tailwindcss').Config} */
module.exports = {
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
        'primary': '#eee',
        'secondary': '#fff',
        'tertiary': '#bbb'
      },
    },
  },
  plugins: [],
}
