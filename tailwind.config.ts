import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Move-in2stay Brand Colors
        primary: {
          DEFAULT: '#4A7C82',
          light: '#5A8C92',
          dark: '#3A6C72',
        },
        accent: {
          DEFAULT: '#C8944A',
          light: '#D8A45A',
          dark: '#B8843A',
        },
        warm: {
          DEFAULT: '#8B6B3D',
          light: '#9B7B4D',
          dark: '#7B5B2D',
        },
        navy: {
          DEFAULT: '#2C3E50',
          light: '#3C4E60',
          dark: '#1C2E40',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
