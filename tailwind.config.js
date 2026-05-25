/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#03000a',
          darker: '#07020d',
          darkest: '#0b0518',
          card: 'rgba(15, 7, 30, 0.45)',
          primary: '#8b5cf6', // purple
          secondary: '#ec4899', // pink
          cyan: '#06b6d4', // cyan
          neonGreen: '#10b981', // green
          neonYellow: '#eab308', // yellow
          glowPurple: 'rgba(139, 92, 246, 0.15)',
          glowCyan: 'rgba(6, 182, 212, 0.15)',
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-cyan': 'glowCyan 2s infinite alternate',
        'glow-purple': 'glowPurple 2s infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        glowCyan: {
          '0%': { boxShadow: '0 0 5px rgba(6, 182, 212, 0.2), 0 0 10px rgba(6, 182, 212, 0.1)' },
          '100%': { boxShadow: '0 0 15px rgba(6, 182, 212, 0.6), 0 0 25px rgba(6, 182, 212, 0.3)' }
        },
        glowPurple: {
          '0%': { boxShadow: '0 0 5px rgba(139, 92, 246, 0.2), 0 0 10px rgba(139, 92, 246, 0.1)' },
          '100%': { boxShadow: '0 0 15px rgba(139, 92, 246, 0.6), 0 0 25px rgba(139, 92, 246, 0.3)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
