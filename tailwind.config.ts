import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0e27',
        foreground: '#ffffff',
        gold: '#FFD700',
        'gold-dark': '#B8860B',
        electric: '#00D4FF',
        'electric-dark': '#0099CC',
        zeus: {
          DEFAULT: '#FFD700',
          dark: '#B8860B',
          light: '#FFF4B8',
        },
        poseidon: {
          DEFAULT: '#00D4FF',
          dark: '#0099CC',
          light: '#80EAFF',
        },
        apolo: {
          DEFAULT: '#9B59B6',
          dark: '#7D3C98',
          light: '#D7BDE2',
        },
        surface: {
          DEFAULT: '#141a3d',
          light: '#1e2650',
          dark: '#0d1029',
        },
        border: '#2a3560',
      },
      fontFamily: {
        greek: ['Georgia', 'serif'],
        sans: ['Helvetica Neue', 'Arial', 'sans-serif'],
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
        'glow': {
          'from': { boxShadow: '0 0 5px #FFD700, 0 0 10px #FFD700, 0 0 15px #FFD700' },
          'to': { boxShadow: '0 0 10px #FFD700, 0 0 20px #FFD700, 0 0 30px #FFD700' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gradient-zeus': 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)',
        'gradient-poseidon': 'linear-gradient(135deg, #00D4FF 0%, #0066CC 100%)',
        'gradient-apolo': 'linear-gradient(135deg, #9B59B6 0%, #E74C3C 50%, #FFD700 100%)',
        'gradient-olympus': 'linear-gradient(180deg, #0a0e27 0%, #141a3d 50%, #1e2650 100%)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
