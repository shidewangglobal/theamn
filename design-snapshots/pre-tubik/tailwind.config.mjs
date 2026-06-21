/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        amn: {
          blue: '#00A0F0',
          dark: '#0A0A0A',
          lime: '#D4E600',
          taupe: '#C4B8A9',
          cream: '#F2F0EB',
          'cream-alt': '#E0DACE',
          olive: '#8B9A4B',
          brown: '#4A4233',
          'cream-legacy': '#F0EEEB',
          teal: '#1C4653',
        },
      },
      fontFamily: {
        headline: ['"HelveticaNeue 3"', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        'headline-bold': ['"Helvetica Now Display Bold"', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        body: ['"HelveticaNeue 2"', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        'body-secondary': ['"Helvetica Now Display"', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        caption: ['"Open Sauce"', 'system-ui', 'sans-serif'],
        accent: ['"Montserrat Bold"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        soft: '0 4px 40px rgba(10, 10, 10, 0.06)',
        'soft-lg': '0 12px 60px rgba(10, 10, 10, 0.1)',
        glow: '0 0 80px rgba(0, 160, 240, 0.35)',
        'glow-lime': '0 0 60px rgba(212, 230, 0, 0.2)',
      },
      animation: {
        'hero-glow': 'heroGlow 8s ease-in-out infinite',
        marquee: 'marquee 40s linear infinite',
        'marquee-reverse': 'marqueeReverse 40s linear infinite',
      },
      keyframes: {
        heroGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.08)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeReverse: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
