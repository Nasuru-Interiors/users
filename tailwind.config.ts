import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          // Pure red + white identity. Overridable at runtime via CSS vars.
          DEFAULT: 'var(--brand-primary, #E10600)',
          primary: 'var(--brand-primary, #E10600)',
          secondary: 'var(--brand-secondary, #FFFFFF)',
          dark: '#B10500',
          ink: '#1A1A1A',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
};

export default config;
