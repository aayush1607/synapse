/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#0a0a0f',
        surface: '#12121a',
        'surface-light': '#1a1a2e',
        neon: {
          cyan: '#00f0ff',
          magenta: '#ff00e5',
          green: '#39ff14',
          orange: '#ff6b00',
          purple: '#bf5fff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'spark': 'spark 0.6s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'fray': 'fray 1s ease-in-out infinite',
      },
      keyframes: {
        spark: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        pulseGlow: {
          '0%, 100%': { filter: 'brightness(1)' },
          '50%': { filter: 'brightness(1.4)' },
        },
        fray: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '0.3' },
        },
      },
    },
  },
  plugins: [],
}
