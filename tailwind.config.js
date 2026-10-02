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
        border:   '#D9C7A3', // Warm rule — borders and dividers on cream
        success:  '#176B43', // Green — success states (AA on cream and on its own tint)
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
        // ── Tints and shades of the palette above (same hues, for depth) ──
        paper:        '#FFF8EA', // lighter cream — raised surfaces sitting on cream
        'cream-deep': '#F4E2BE', // darker cream — wells and fills on cream
        'sky-deep':   '#1F9CC7', // darker sky — depth on the sky field
        'ink-soft':   '#363B3D', // lifted ink — raised surfaces sitting on ink
        'red-ink':    '#B3212C', // darker sun red — small red text on cream (AA)
      },
      fontFamily: {
        // Loaded with next/font in app/layout.tsx and exposed as CSS variables.
        display: ['var(--font-display)', 'Bebas Neue', 'Impact', 'sans-serif'],
        sans:    ['var(--font-sans)', 'League Spartan', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)', 'Space Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Fluid display scale for Bebas Neue. One clamp per step so headings
        // hold their proportions from a phone to a wide desktop.
        'display-sm': ['clamp(1.75rem, 1.4rem + 1.4vw, 2.5rem)',  { lineHeight: '1',    letterSpacing: '0.02em' }],
        'display-md': ['clamp(2.5rem, 1.8rem + 3vw, 4rem)',       { lineHeight: '0.95', letterSpacing: '0.015em' }],
        'display-lg': ['clamp(3.25rem, 2rem + 5.5vw, 6.5rem)',    { lineHeight: '0.9',  letterSpacing: '0.01em' }],
        'display-xl': ['clamp(4rem, 2rem + 9vw, 10rem)',          { lineHeight: '0.86', letterSpacing: '0.005em' }],
      },
      backgroundImage: {
        // Sunset gradient — Yellow → Orange → Red → Deep Red
        'sunset':   'linear-gradient(135deg, #EFB936 0%, #E78B39 33%, #D62D38 66%, #E23548 100%)',
        'sunset-h': 'linear-gradient(to right,  #EFB936 0%, #E78B39 33%, #D62D38 66%, #E23548 100%)',
        'sunset-v': 'linear-gradient(to bottom, #EFB936 0%, #E78B39 33%, #D62D38 66%, #E23548 100%)',
      },
      boxShadow: {
        // Hard offset shadows — a second ink pass printed slightly off-register.
        'print-sm': '2px 2px 0 0 #272B2C',
        'print':    '4px 4px 0 0 #272B2C',
        'print-lg': '7px 7px 0 0 #272B2C',
        'print-cream': '4px 4px 0 0 #FDF0DA',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      // Keyframes for these live in app/globals.css.
      animation: {
        'rise':     'rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) both',
        'sun-rise': 'sun-rise 1.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'marquee':  'marquee 60s linear infinite',
        'fade-in':  'fade-in 0.25s ease-out both',
        'shimmer':  'shimmer 1.8s linear infinite',
      },
    },
  },
  plugins: [],
}
