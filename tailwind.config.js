/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,tsx}'],
  darkMode: 'class',
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Semantic tokens. Every one has a light and a dark value so screens
        // can be written as `bg-canvas dark:bg-canvas-dark` and nothing else.
        canvas: { DEFAULT: '#ffffff', dark: '#0b0b0e' },
        surface: { DEFAULT: '#f4f4f5', dark: '#17171b' },
        line: { DEFAULT: '#e4e4e7', dark: '#27272b' },
        ink: { DEFAULT: '#18181b', dark: '#fafafa' },
        muted: { DEFAULT: '#71717a', dark: '#8b8b94' },
        // One accent, used only for the primary action and active tab.
        accent: { DEFAULT: '#2f6f4e', dark: '#4ea87b' },
        danger: { DEFAULT: '#a33a3a', dark: '#e07a7a' },
      },
    },
  },
  plugins: [],
};
