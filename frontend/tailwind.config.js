/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rr-navy': '#14213D',
        'rr-pink': '#E83E8C',
        'rr-blue': '#174EA6',
        'rr-bg': '#F5F6FA',
        'rr-card': '#FFFFFF',
        'rr-dark-card': '#1E293B',
        'rr-gold': '#F59E0B'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

