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
        primary: '#f5c842',
        secondary: '#e84c2b',
        text: '#f0ede6',
        muted: '#7a7672',
        border: '#2e2e2e',
        success: '#4caf7d',
        warning: '#f5a623',
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
