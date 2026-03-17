/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0e0e0e',
        surface: '#1a1a1a',
        primary: '#16a1cf',
        secondary: '#e84c2b',
        text: '#f0ede6',
        muted: '#7a7672',
        border: '#2e2e2e',
        success: '#4caf7d',
        warning: '#16a1cf',
        danger: '#e84c2b',
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
