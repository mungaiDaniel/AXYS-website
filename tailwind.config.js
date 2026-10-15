/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#0017BF',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#0017BF',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#0017BF',
          foreground: '#FFFFFF',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'gradient-move': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-up': {
          '0%': { opacity: '0', transform: 'scale(0.9) translateY(20px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'scale-down': {
          '0%': { opacity: '1', transform: 'scale(1) translateY(0)' },
          '100%': { opacity: '0', transform: 'scale(0.9) translateY(20px)' },
        },
        'modal-expand': {
          '0%': { opacity: '0', transform: 'scale(0.05)' },
          '40%': { opacity: '1' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'modal-shrink': {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '60%': { opacity: '0.5' },
          '100%': { opacity: '0', transform: 'scale(0.05)' },
        },
      },
      animation: {
        'gradient-move': 'gradient-move 8s ease infinite',
        'fade-up': 'fade-up 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'scale-up': 'scale-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};