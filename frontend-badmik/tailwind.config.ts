import type { Config } from 'tailwindcss';

const config: Config = {
    content: ['./components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {
            colors: {
                button: '#fb7500',
                'white-10%': 'rgba(255, 255, 255, 0.1)',
                'black-25%': 'rgba(26, 27, 29, 0.25)',
                black: '#202124',
                'black-45%': 'rgba(26, 27, 29, 0.45)',
              
            },
            screens: {
                mobile: '360px',
                tablet: '834px',
                laptop: '1440px',
                desktop: '1920px',
            },
            fontSize: {
                xs: '0.75rem',
                sm: '0.875rem',
                base: '1rem',
                lg: '1.125rem',
                xl: '1.25rem',
                '2xl': '1.5rem',
                '3xl': '1.875rem',
                '4xl': '2.25rem',
                '5xl': '3rem',
                '6xl': '3.75rem',
            },
        },
    },
    plugins: [],
};
export default config;
