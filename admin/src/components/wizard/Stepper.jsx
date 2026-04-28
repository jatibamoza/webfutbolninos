const STEPS = [
  { label: 'Categoría', hint: 'Silo SEO' },
  { label: 'Keyword', hint: 'Long-tail' },
  { label: 'Estructura', hint: 'H2 / H3' },
  { label: 'Vista previa', hint: 'Crear PR' },
];

export default function Stepper({ current }) {
  return (
    <nav
      aria-label="Progreso del asistente"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 28,
        padding: 18,
        background: 'var(--color-paper)',
        border: '1px solid var(--color-border)',
        borderRadius: 12,
        overflowX: 'auto',
      }}
    >
      {STEPS.map((step, idx) => {
        const num = idx + 1;
        const state = num < current ? 'done' : num === current ? 'active' : 'pending';
        const isLast = idx === STEPS.length - 1;

        return (
          <div key={num} style={{ display: 'contents' }}>
            <div
              data-state={state}
              style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}
              aria-current={state === 'active' ? 'step' : undefined}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 16,
                  flexShrink: 0,
                  border: '2px solid',
                  ...(state === 'done'
                    ? {
                        background: 'var(--color-secondary)',
                        color: 'var(--color-on-brand)',
                        borderColor: 'var(--color-secondary)',
                      }
                    : state === 'active'
                      ? {
                          background: 'var(--color-foreground)',
                          color: 'var(--color-background)',
                          borderColor: 'var(--color-foreground)',
                        }
                      : {
                          background: 'var(--color-surface-alt)',
                          color: 'var(--color-foreground-muted)',
                          borderColor: 'var(--color-border-strong)',
                        }),
                }}
              >
                {state === 'done' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  num
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 13,
                    lineHeight: 1.1,
                    whiteSpace: 'nowrap',
                    color: state === 'pending' ? 'var(--color-foreground-muted)' : 'var(--color-foreground)',
                  }}
                >
                  {step.label}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: 'var(--color-foreground-subtle)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {step.hint}
                </span>
              </div>
            </div>

            {!isLast && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  background: state === 'done' ? 'var(--color-secondary)' : 'var(--color-border)',
                  borderRadius: 2,
                  minWidth: 16,
                }}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
