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
        // ── Semantic tokens (used throughout the codebase) ──
        bg:       '#45BEE4', // Sky Blue — primary background field
        surface:  '#FDF0DA', // Cream — cards, panels, light surfaces
        primary:  '#D62D38', // Sun Red — main interactive accent
        secondary:'#EFB936', // Sun Yellow — secondary accent
        text:     '#272B2C', // Ink Black — all body text
        muted:    '#4A5A62', // Muted blue-gray — subdued text / labels
        border:   '#B0C4CA', // Muted sky — borders and dividers
        success:  '#4caf7d', // Green — success states
        warning:  '#EFB936', // Sun Yellow — warnings
        danger:   '#E23548', // Sun Red Deep — errors / danger
        // ── Named palette tokens (for explicit use) ──
        ink:            '#272B2C',
        cream:          '#FDF0DA',
        sky:            '#45BEE4',
        'sun-yellow':   '#EFB936',
        'sun-orange':   '#E78B39',
        'sun-red':      '#D62D38',
        'sun-red-deep': '#E23548',
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        sans:    ['League Spartan', 'system-ui', 'sans-serif'],
        mono:    ['Space Mono', 'monospace'],
      },
      backgroundImage: {
        // Sunset gradient — Yellow → Orange → Red → Deep Red
        'sunset':   'linear-gradient(135deg, #EFB936 0%, #E78B39 33%, #D62D38 66%, #E23548 100%)',
        'sunset-h': 'linear-gradient(to right,  #EFB936 0%, #E78B39 33%, #D62D38 66%, #E23548 100%)',
        'sunset-v': 'linear-gradient(to bottom, #EFB936 0%, #E78B39 33%, #D62D38 66%, #E23548 100%)',
      },
    },
  },
  plugins: [],
}

