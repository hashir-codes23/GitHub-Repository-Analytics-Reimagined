/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Centralized DevPulse palette: yellow & white.
        brand: {
          50: '#FFFDE7',
          100: '#FFF9C4',
          200: '#FFF59D',
          300: '#FFF176',
          400: '#FFEE58',
          500: '#FACC15',
          600: '#EAB308',
          700: '#CA8A04',
          800: '#A16207',
          900: '#854D0E'
        },
        ink: {
          DEFAULT: '#1C1917',
          soft: '#57534E',
          mute: '#A8A29E'
        },
        night: {
          DEFAULT: '#14110A',
          soft: '#1C1912',
          card: '#221D12'
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        card: '0 4px 24px -8px rgba(202, 138, 4, 0.18)',
        lift: '0 12px 40px -12px rgba(202, 138, 4, 0.35)',
        glow: '0 0 44px -10px rgba(250, 204, 21, 0.55)'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' }
        },
        'float-slow': {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(30px, -30px) scale(1.08)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' }
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 14s ease-in-out infinite',
        shimmer: 'shimmer 1.8s linear infinite'
      }
    }
  },
  plugins: []
};
