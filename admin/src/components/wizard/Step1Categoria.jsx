import { CATEGORIAS } from '../../services/wizardSchema.js';

export default function Step1Categoria({ value, onChange }) {
  return (
    <section className="card-paper" style={{ padding: 28, marginBottom: 18 }}>
      <h2 style={{ fontSize: '1.4rem', marginBottom: 6 }}>Elige la categoría</h2>
      <p style={{ color: 'var(--color-foreground-muted)', fontSize: 14, marginBottom: 24 }}>
        El silo de SEO al que pertenece el artículo. Determina la URL y los enlaces internos sugeridos.
      </p>

      <div
        style={{
          display: 'grid',
          gap: 14,
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        }}
      >
        {CATEGORIAS.map((cat) => {
          const selected = value === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChange(cat.id)}
              aria-pressed={selected}
              style={{
                padding: 18,
                border: `2px solid ${selected ? 'var(--color-foreground)' : 'var(--color-border-strong)'}`,
                borderRadius: 12,
                background: selected ? 'var(--color-marker)' : 'var(--color-paper)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                alignItems: 'flex-start',
                transition: 'all 150ms ease',
                minHeight: 120,
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                if (!selected) e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  display: 'grid',
                  placeItems: 'center',
                  background: cat.color,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  fontSize: 11,
                  color: 'var(--color-on-brand)',
                  flexShrink: 0,
                }}
              >
                {cat.abbr}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 15,
                  color: 'var(--color-foreground)',
                }}
              >
                {cat.label}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
