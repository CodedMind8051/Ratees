/** @type {import('tailwindcss').Config} */
export const content = [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
];
export const darkMode = 'class';
export const theme = {
    container: {
        center: true,
        padding: '1rem',
    },
    extend: {
        colors: {
            background: 'var(--background)',
            foreground: 'var(--foreground)',
            primary: {
                DEFAULT: 'var(--primary)',
                foreground: 'var(--primary-foreground)',
            },
            secondary: {
                DEFAULT: 'var(--secondary)',
                foreground: 'var(--secondary-foreground)',
            },
            accent: {
                DEFAULT: 'var(--accent)',
                foreground: 'var(--accent-foreground)',
            },
            muted: {
                DEFAULT: 'var(--muted)',
                foreground: 'var(--muted-foreground)',
            },
            card: {
                DEFAULT: 'var(--card)',
                foreground: 'var(--card-foreground)',
            },
            border: 'var(--border)',
            input: 'var(--input)',
            ring: 'var(--ring)',
        },
        borderRadius: {
            lg: 'var(--radius)',
            md: 'calc(var(--radius) - 2px)',
            sm: 'calc(var(--radius) - 4px)',
        },
        fontFamily: {
            sans: ['var(--font-plus-jakarta-sans)', 'sans-serif'],
        },
    },
};
export const plugins = [require('@tailwindcss/typography')];