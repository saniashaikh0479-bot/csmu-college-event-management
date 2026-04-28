/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8edf5',
          100: '#c5d0e6',
          200: '#9eb0d4',
          300: '#7790c2',
          400: '#5977b5',
          500: '#3b5fa8',
          600: '#2f4f8a',
          700: '#1e3a6e',
          800: '#0f2854',
          900: '#0a1628',
          950: '#050b14',
        },
        saffron: {
          50: '#fff8ed',
          100: '#ffedd4',
          200: '#fed7a5',
          300: '#fdba6f',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        secondary: {
          50: '#fafbfc',
          100: '#f0f4f8',
          200: '#d9e2ec',
          300: '#bcccdc',
          400: '#9fb3c8',
          500: '#829ab1',
          600: '#627d98',
          700: '#486581',
          800: '#334e68',
          900: '#102a43',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
