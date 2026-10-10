/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#1F6FAF',
        orange: '#D96C2C',
        green: '#2E9B5F',
        purple: '#7C3AED',
        gold: '#D8A23A',
        cream: '#F7F2E8',
        text: '#18212F',
        muted: '#6B7280',
        border: '#DDD2C2',
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
