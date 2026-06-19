/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        noir: {
          DEFAULT: '#0D0D0F',
          surface: '#1A1A2E',
          light: '#242440',
        },
        amber: {
          DEFAULT: '#D4A843',
          dark: '#A07D2E',
          light: '#E8C76A',
        },
        crimson: {
          DEFAULT: '#8B2500',
          light: '#B5330A',
        },
        smoke: '#6B6B7B',
        ghost: '#E8E6E1',
        'ghost-dim': '#9A9A9A',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Noto Sans SC', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float-in': 'float-in 0.4s ease-out forwards',
        'shimmer': 'shimmer 3s infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
};
