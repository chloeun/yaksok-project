import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    './public/**/*.html',
  ], 
  theme: {
    extend: {
      colors: {
        primary: '#FEF8EE',
        secondary: '#F6C6BA',
        secondaryHover: '#e4b4a6',
        buttonA:'#FFECD1',
        textMain:'#737370',
        textButton:'#4D4C51'
      },
      fontFamily: {
        seoulHangang: 'var(--font-seoulHangang)',
        deliusRegular: 'var(--font-deliusUnicaseRegular)',
        deliusBold: 'var(--font-deliusUnicaseBold)',
        pretendard: 'var(--font-pretendardVariable)',
        gangwonEdu: ['GangwonEdu', 'sans-serif'],
      },
      
    },
  },
  plugins: [],
};

export default config;
