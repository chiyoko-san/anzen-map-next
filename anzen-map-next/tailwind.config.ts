import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            h1: { fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#1a1d2e' },
            h2: { fontSize: '1.2rem', fontWeight: '700', marginTop: '2rem', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '2px solid #eff6ff', color: '#1a1d2e' },
            h3: { fontSize: '1.05rem', fontWeight: '700', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#1a1d2e' },
            p:  { lineHeight: '1.9', marginBottom: '1rem', color: '#374151' },
            li: { lineHeight: '1.9', color: '#374151' },
            a:  { color: '#2563eb', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } },
            strong: { color: '#1a1d2e', fontWeight: '700' },
            small:  { color: '#6b7280', fontSize: '0.8rem' },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config
