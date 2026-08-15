/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Black & White Design System - primary brand colors
        primary: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#000000',
          600: '#000000',
          700: '#000000',
          800: '#000000',
          900: '#000000',
        },
        // Additional gray shades for depth
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // GirlSecret brand accent - the site's one confident colour.
        // `pink` is overridden to the same values so the ~100 existing
        // `pink-*` utility classes across the app (buttons, links, focus
        // rings) pick up the brand colour automatically. Use `rose-*` in
        // new code - `pink-*` is kept as an alias for what's already there.
        rose: {
          50: '#fef4f6',
          100: '#fce7ec',
          200: '#f8ccd6',
          300: '#f2a3b5',
          400: '#ea7189',
          500: '#e14d6c',
          600: '#cc3a58',
          700: '#af2c47',
          800: '#8a2239',
          900: '#6b1c2e',
          950: '#3d0f19',
        },
        pink: {
          50: '#fef4f6',
          100: '#fce7ec',
          200: '#f8ccd6',
          300: '#f2a3b5',
          400: '#ea7189',
          500: '#e14d6c',
          600: '#cc3a58',
          700: '#af2c47',
          800: '#8a2239',
          900: '#6b1c2e',
          950: '#3d0f19',
        },
        // Small, sparing premium accent - dividers, badges, fine details.
        gold: '#b8935c',
        // Warm off-white ground, distinct from plain white for alternating
        // sections (product shelf vs. content sections).
        paper: {
          DEFAULT: '#ffffff',
          warm: '#fff6f8',
        },
      },
      fontFamily: {
        // System stacks only - no webfont request, no layout shift while
        // fonts load. Iowan Old Style carries the brand's editorial voice
        // (headlines, product names, prices); the geometric sans is for
        // navigation, buttons and anything read fast while shopping.
        sans: ['Avenir Next', 'Century Gothic', 'Futura', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        serif: ['Iowan Old Style', 'Palatino Linotype', 'Palatino', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}
