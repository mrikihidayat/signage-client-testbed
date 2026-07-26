/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary / Accent - Teal / Toska Cerah
        primary: {
          DEFAULT: '#3BBFA2',
          light: '#44C2A6',
          dark: '#2FA88E',
        },
        // Secondary / Slate - Dark Teal / Soft Slate
        secondary: {
          DEFAULT: '#385A64',
          light: '#2D4850',
          dark: '#24393F',
        },
        // Background - Very Light Mint / Ice Blue
        bgmint: {
          DEFAULT: '#EBF5F4',
          light: '#F0F8F7',
        },
        // Typography - Dark Slate / Charcoal Grey
        inktext: {
          DEFAULT: '#2E3842',
          muted: '#354049',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(56, 90, 100, 0.12)',
        toast: '0 8px 30px -4px rgba(46, 56, 66, 0.25)',
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(120%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'pulse-dot': 'pulse-dot 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
