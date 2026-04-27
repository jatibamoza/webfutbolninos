/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--color-paper)',
        background: 'var(--color-background)',
        'surface-alt': 'var(--color-surface-alt)',
        foreground: 'var(--color-foreground)',
        'foreground-muted': 'var(--color-foreground-muted)',
        'foreground-subtle': 'var(--color-foreground-subtle)',
        handwritten: 'var(--color-handwritten)',
        marker: 'var(--color-marker)',
        border: 'var(--color-border)',
        'border-strong': 'var(--color-border-strong)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        fun: 'var(--color-fun)',
        energy: 'var(--color-energy)',
        info: 'var(--color-info)',
        'on-brand': 'var(--color-on-brand)',
      },
      fontFamily: {
        display: ['Fredoka', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
        hand: ['Caveat', 'cursive'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
};
