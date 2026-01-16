/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#FF3B00',
        surface: '#0F0F0F',
        background: '#050505',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 15s linear infinite',
        'reverse-spin': 'spin 20s linear infinite reverse',
        'marquee': 'marquee 30s linear infinite',
        'scan': 'scan 4s linear infinite',
        'blink': 'blink 2s ease-in-out infinite',
        'dash': 'dash 20s linear infinite',
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'border-glow': 'border-glow 3s ease-in-out infinite',
        'float': 'float 8s ease-in-out infinite',
        'spotlight': 'spotlight 2s ease .75s 1 forwards',
        'spotlight-drift': 'spotlight-drift 2s ease-in-out infinite',
        'spotlight-drift-reverse': 'spotlight-drift-reverse 8s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-33.333%)' },
        },
        scan: {
          '0%': { top: '-20%' },
          '100%': { top: '120%' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        dash: {
          to: { 'stroke-dashoffset': '1000' }
        },
        'fade-in-up': {
          from: {
            opacity: '0',
            transform: 'translateY(50px) scale(0.95)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
        },
        'glow-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(255, 59, 0, 0.2), 0 0 40px rgba(255, 59, 0, 0.1)',
            transform: 'scale(1)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(255, 59, 0, 0.4), 0 0 80px rgba(255, 59, 0, 0.2)',
            transform: 'scale(1.02)',
          },
        },
        'border-glow': {
          '0%, 100%': {
            borderColor: 'rgba(255, 59, 0, 0.3)',
            boxShadow: '0 0 20px rgba(255, 59, 0, 0.2), inset 0 0 20px rgba(255, 59, 0, 0.1)',
          },
          '50%': {
            borderColor: 'rgba(255, 59, 0, 0.6)',
            boxShadow: '0 0 40px rgba(255, 59, 0, 0.4), inset 0 0 40px rgba(255, 59, 0, 0.2)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px) rotate(0deg)',
          },
          '33%': {
            transform: 'translateY(-20px) rotate(1deg)',
          },
          '66%': {
            transform: 'translateY(-10px) rotate(-1deg)',
          },
        },
        spotlight: {
          '0%': {
            opacity: '0',
            transform: 'translate(-72%, -62%) scale(0.5)',
          },
          '100%': {
            opacity: '1',
            transform: 'translate(-50%, -40%) scale(1)',
          },
        },
        'spotlight-drift': {
          '0%': {
            transform: 'translateX(-300px)',
            opacity: '0.6',
          },
          '25%': {
            transform: 'translateX(0px)',
            opacity: '1',
          },
          '50%': {
            transform: 'translateX(300px)',
            opacity: '0.8',
          },
          '75%': {
            transform: 'translateX(0px)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateX(-300px)',
            opacity: '0.6',
          },
        },
        'spotlight-drift-reverse': {
          '0%': {
            transform: 'translateX(200px)',
            opacity: '0.6',
          },
          '25%': {
            transform: 'translateX(0px)',
            opacity: '1',
          },
          '50%': {
            transform: 'translateX(-200px)',
            opacity: '0.8',
          },
          '75%': {
            transform: 'translateX(0px)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateX(200px)',
            opacity: '0.6',
          },
        },
      },
    },
  },
  plugins: [],
}
