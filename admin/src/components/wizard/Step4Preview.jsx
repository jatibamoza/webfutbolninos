import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { checkSlugDisponible } from '../../services/wizardAPI.js';
import { CATEGORIAS } from '../../services/wizardSchema.js';

export default function Step4Preview({ state, submitting, onSubmit }) {
  const { categoria, slug, title, description, edadMin, edadMax, nivel, outline, keyword } = state;

  const [slugDisponible, setSlugDisponible] = useState(null); // null = comprobando

  useEffect(() => {
    if (!slug) return;
    setSlugDisponible(null);
    checkSlugDisponible(slug).then(setSlugDisponible);
  }, [slug]);

  const catLabel = CATEGORIAS.find((c) => c.id === categoria)?.label ?? categoria;
  const branchName = `content/${slug}`;
  const commitMsg = `content: añadir ${title?.slice(0, 40) ?? slug}`;
  const filePath = `src/content/articulos/${categoria}/${slug}.mdx`;
  const coverPath = `src/assets/articulos/${categoria}/${slug}.jpg`;

  const checks = [
    {
      ok: !!title && !!description && !!slug && !!keyword,
      label: 'Frontmatter válido (Zod)',
    },
    {
      ok: slugDisponible === true,
      pending: slugDisponible === null,
      label: slugDisponible === null ? 'Comprobando slug…' : slugDisponible ? 'Slug único en la categoría' : 'Slug ya existe en esta categoría',
    },
    {
      ok: (outline?.length ?? 0) >= 3,
      label: 'Estructura con ≥3 encabezados',
    },
    {
      ok: false,
      warn: true,
      label: 'Cuerpo MDX vacío (rellena luego en el editor)',
    },
  ];

  return (
    <section className="card-paper" style={{ padding: 28, marginBottom: 18 }}>
      <h2 style={{ fontSize: '1.4rem', marginBottom: 6 }}>Vista previa y publicación</h2>
      <p style={{ color: 'var(--color-foreground-muted)', fontSize: 14, marginBottom: 24 }}>
        Revisa cómo quedará el artículo antes de generar el archivo MDX.
      </p>

      <div
        style={{
          display: 'grid',
          gap: 18,
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
        }}
      >
        {/* Columna izquierda: preview artículo */}
        <div
          style={{
            padding: 20,
            border: '1px solid var(--color-border)',
            borderRadius: 12,
            background: 'var(--color-paper)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.18em',
              color: 'var(--color-foreground-subtle)',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            Cómo se verá el artículo
          </div>

          {/* Cover mock */}
          <div
            style={{
              width: '100%',
              aspectRatio: '16/10',
              background: 'linear-gradient(135deg, var(--color-surface-alt), var(--color-paper))',
              border: '1px solid var(--color-border)',
              borderRadius: 10,
              marginBottom: 14,
              display: 'grid',
              placeItems: 'center',
              color: 'var(--color-foreground-subtle)',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <span style={{ position: 'relative' }}>cover · 1200×750 (autogenerada)</span>
          </div>

          {/* Meta pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
            {[catLabel?.toUpperCase(), `${edadMin}-${edadMax} años`, `Nivel: ${nivel ?? '—'}`].map((pill) => (
              <span
                key={pill}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  padding: '4px 10px',
                  borderRadius: 9999,
                  background: 'var(--color-surface-alt)',
                  color: 'var(--color-foreground-muted)',
                }}
              >
                {pill}
              </span>
            ))}
          </div>

          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 22,
              lineHeight: 1.2,
              marginBottom: 8,
            }}
          >
            {title || <span style={{ color: 'var(--color-border-strong)' }}>(sin título)</span>}
          </div>
          <div
            style={{
              fontSize: 14,
              color: 'var(--color-foreground-muted)',
              lineHeight: 1.5,
              marginBottom: 14,
            }}
          >
            {description || <span style={{ color: 'var(--color-border-strong)' }}>(sin descripción)</span>}
          </div>

          {/* Outline */}
          {outline?.length > 0 && (
            <>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.18em',
                  color: 'var(--color-foreground-subtle)',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                  marginTop: 8,
                }}
              >
                Estructura
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {outline.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      fontSize: item.level === 3 ? 12 : 13,
                      paddingTop: 4,
                      paddingBottom: 4,
                      paddingLeft: item.level === 3 ? 16 : 0,
                      color: item.level === 3 ? 'var(--color-foreground-muted)' : 'var(--color-foreground)',
                    }}
                  >
                    H{item.level} · {item.text || <em style={{ opacity: 0.5 }}>(vacío)</em>}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Columna derecha: PR card + checks */}
        <div>
          {/* PR card */}
          <div
            style={{
              padding: 18,
              background: 'var(--color-marker)',
              border: '2px solid var(--color-foreground)',
              borderRadius: 12,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.18em',
                color: 'var(--color-on-brand)',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              Pull Request a abrir
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 16,
                lineHeight: 1.3,
                marginBottom: 10,
                color: 'var(--color-on-brand)',
              }}
            >
              {commitMsg}
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--color-on-brand)',
              }}
            >
              <span><strong>Branch:</strong> {branchName}</span>
              <span><strong>Archivo:</strong> {filePath}</span>
              <span><strong>Cover:</strong> {coverPath}</span>
              <span><strong>Estado:</strong> draft (no se publica al merge sin revisión)</span>
            </div>
          </div>

          {/* Checks */}
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none' }}>
            {checks.map((check, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  color: check.ok
                    ? 'var(--color-secondary)'
                    : check.warn
                      ? 'var(--color-foreground-muted)'
                      : check.pending
                        ? 'var(--color-foreground-subtle)'
                        : 'var(--color-energy)',
                  fontWeight: check.ok ? 600 : 400,
                }}
              >
                {check.ok ? (
                  <CheckCircle size={18} style={{ flexShrink: 0, color: 'var(--color-secondary)' }} />
                ) : check.warn ? (
                  <AlertCircle size={18} style={{ flexShrink: 0, color: 'var(--color-foreground-muted)' }} />
                ) : (
                  <AlertCircle size={18} style={{ flexShrink: 0, color: check.pending ? 'var(--color-border-strong)' : 'var(--color-energy)' }} />
                )}
                {check.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
