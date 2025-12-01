// DeepAuto Design System & Tailwind Configuration
// Shared across all pages for consistent design language

tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                bgBody: 'var(--bg-body)',
                bgPanel: 'var(--bg-panel)',
                bgSoft: 'var(--bg-soft)',
                borderSubtle: 'var(--border-subtle)',
                textMain: 'var(--text-main)',
                textMuted: 'var(--text-muted)',
                accentBlue: 'var(--accent-blue)',
                accentTeal: 'var(--accent-teal)',
                accentGold: 'var(--accent-gold)',
                accentPurple: 'var(--accent-purple)',
                accentRed: 'var(--accent-red)',
            },
            fontFamily: {
                sans: ['var(--font-sans)'],
                head: ['var(--font-head)'],
                mono: ['var(--font-mono)'],
            },
            fontSize: {
                xs: ['var(--text-xs)', { lineHeight: '1rem' }],
                sm: ['var(--text-sm)', { lineHeight: '1.25rem' }],
                base: ['var(--text-base)', { lineHeight: '1.5rem' }],
                lg: ['var(--text-lg)', { lineHeight: '1.75rem' }],
                xl: ['var(--text-xl)', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
            }
        }
    }
};
