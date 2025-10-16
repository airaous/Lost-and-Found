/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        campus: {
          blue: '#0f172a',
          teal: '#0ea5e9',
          gold: '#f59e0b'
        }
      }
    }
  },
  plugins: []
};
