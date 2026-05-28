import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F8F1DF',
        card: '#FFF9EA',
        sticky: '#FEF7D2',
        ink: '#2F2A24',
        pencil: '#8A7D6B',
        crayonBlue: '#5DADEC',
        moss: '#79B86D',
        honey: '#F2B84B',
        coral: '#E97865',
        lavender: '#A98BD8',
        softBorder: '#D8C8A8',
      },
      fontFamily: {
        fraunces: ['var(--font-fraunces)', 'Fraunces', 'Georgia', 'serif'],
        nunito: ['var(--font-nunito)', 'Nunito', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
        caveat: ['var(--font-caveat)', 'Caveat', 'cursive'],
      },
      boxShadow: {
        pencil: '4px 4px 0px 0px rgba(138,125,107,0.35)',
        ink: '4px 4px 0px 0px rgba(47,42,36,1)',
        inkBig: '6px 6px 0px 0px rgba(47,42,36,1)',
        sticker: '2px 2px 0px 0px rgba(47,42,36,1)',
      },
      borderRadius: {
        wobble: '255px 15px 225px 15px / 15px 225px 15px 255px',
        wobbleAlt: '15px 225px 15px 255px / 255px 15px 225px 15px',
      },
      keyframes: {
        floatY: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        wiggle: {
          '0%,100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' },
        },
        dashFlow: {
          to: { 'stroke-dashoffset': '-20' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        floatY: 'floatY 3.6s ease-in-out infinite',
        wiggle: 'wiggle 4s ease-in-out infinite',
        dashFlow: 'dashFlow 1s linear infinite',
        fadeUp: 'fadeUp .45s cubic-bezier(0.34,1.56,0.64,1) both',
      },
    },
  },
  plugins: [],
};

export default config;
