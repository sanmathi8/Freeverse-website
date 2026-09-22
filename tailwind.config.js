/** @type {import('tailwindcss').Config} */
export default {
  // 'class' = dark styles apply ONLY when the .dark class is on <html>
  // (which useTheme.ts always sets). This guarantees the Ocean theme
  // on every device, regardless of that device's OS/browser color-scheme.
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
