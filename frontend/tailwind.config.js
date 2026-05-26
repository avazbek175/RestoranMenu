/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        restaurant: {
          bg: '#0B0B0C',        // Deep obsidian black
          card: '#121214',      // Soft dark grey for cards
          cardHover: '#1A1A1D', // Subtle hover card state
          border: '#242428',    // Dark grey border
          gold: {
            light: '#F3E5AB',   // Light champagne gold
            DEFAULT: '#D4AF37', // Premium metallic gold
            dark: '#AA7C11',    // Burnished dark gold
          },
          text: {
            primary: '#F5F5F7',
            secondary: '#A1A1A6',
          }
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 2s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(15px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.02)', opacity: '0.9' },
        }
      }
    },
  },
  plugins: [],
}
