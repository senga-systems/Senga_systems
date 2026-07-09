import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#050812',
        foreground: '#f8f9fa',
        primary: '#00e5ff',
        secondary: '#0f1625',
        tertiary: '#1a2339',
        accent: '#ff4757',
        'accent-secondary': '#f57f17',
        muted: '#8892a8',
        'muted-dark': '#4a5568',
        success: '#2ecc71',
        warning: '#f39c12',
      },
      borderRadius: {
        DEFAULT: '0.75rem',
      },
    },
  },
  plugins: [],
};

export default config;
