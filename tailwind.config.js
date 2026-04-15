/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#7C3AED',
          'purple-light': '#8B5CF6',
          'purple-dim': '#4C1D95',
          'purple-glow': 'rgba(139,92,246,0.15)',
          gold: '#F59E0B',
          'gold-light': '#FCD34D',
          'gold-dim': '#92400E',
          'gold-glow': 'rgba(245,158,11,0.15)',
        },
        dark: {
          950: '#05050B',
          900: '#0A0A13',
          850: '#0F0F1A',
          800: '#141421',
          750: '#1A1A2E',
          700: '#1F1F38',
          600: '#2A2A4A',
          500: '#383860',
        },
        surface: {
          primary: '#111128',
          secondary: '#191932',
          tertiary: '#21213D',
          border: '#2D2D52',
          'border-light': '#3D3D6A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(124,58,237,0.25), transparent)',
        'card-glow': 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(245,158,11,0.04) 100%)',
        'alert-glow': 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(124,58,237,0.10) 100%)',
      },
      boxShadow: {
        'glow-purple': '0 0 30px rgba(124,58,237,0.3)',
        'glow-gold': '0 0 30px rgba(245,158,11,0.3)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.6)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(245,158,11,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(245,158,11,0.6)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
