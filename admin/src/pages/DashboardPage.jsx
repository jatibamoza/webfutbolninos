import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Eye, Search } from 'lucide-react';
import { useArticulosList } from '../hooks/useArticulos.js';

const CATEGORIAS = ['ejercicios', 'juegos', 'equipamiento', 'iniciacion', 'mundial-2026'];
const NIVELES = ['facil', 'media', 'reto'];

function formatDate(val) {
  if (!val) return '—';
  try {
    const d = new Date(val);
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  } catch {
    return '—';
  }
}

export default function DashboardPage() {
  const { articulos, loading, error } = useArticulosList();
  const navigate = useNavigate();

  const [catFilter, setCatFilter] = useState('todas');
  const [nivelFilter, setNivelFilter] = useState('todas');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return articulos.filter((a) => {
      const fm = a.frontmatter || {};
      if (catFilter !== 'todas' && a.categoria !== catFilter) return false;
      if (nivelFilter !== 'todas' && fm.nivel !== nivelFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const titleMatch = (fm.title || '').toLowerCase().includes(q);
        const kwMatch = (fm.keyword || '').toLowerCase().includes(q);
        const slugMatch = a.slug.toLowerCase().includes(q);
        if (!titleMatch && !kwMatch && !slugMatch) return false;
      }
      return true;
    });
  }, [articulos, catFilter, nivelFilter, search]);

  const totalPublicados = articulos.filter((a) => !a.frontmatter?.draft).length;
  const totalBorradores = articulos.filter((a) => !!a.frontmatter?.draft).length;
  const categorias = new Set(articulos.map((a) => a.categoria)).size;
  const lastPub = articulos
    .filter((a) => !a.frontmatter?.draft && a.frontmatter?.pubDate)
    .sort((a, b) => new Date(b.frontmatter.pubDate) - new Date(a.frontmatter.pubDate))[0];

  const now = new Date();
  const lastPubDate = lastPub ? new Date(lastPub.frontmatter.pubDate) : null;
  const lastPubLabel = lastPubDate
    ? Math.abs(now - lastPubDate) < 86400000 * 1.5
      ? 'hoy'
      : lastPubDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
    : '—';

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 60, color: 'var(--color-foreground-muted)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>Cargando artículos…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: 60, color: 'var(--color-energy)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>Error: {error}</span>
      </div>
    );
  }

  return (
    <>
      {/* Page header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 18,
          marginBottom: 28,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <span className="stamp">DASHBOARD · {now.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}</span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            Tus artículos{' '}
            <span className="anno" style={{ fontSize: 22 }}>
              {totalPublicados} publicados
            </span>
          </h1>
        </div>
      </div>

      {/* Stats */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
          marginBottom: 28,
        }}
      >
        <StatCard label="Publicados" value={totalPublicados} meta="+artículos en el sitio" />
        <StatCard
          label="Borradores"
          value={totalBorradores}
          meta="en cola"
          valueStyle={{ color: 'var(--color-handwritten)' }}
        />
        <StatCard label="Categorías" value={categorias} meta="activas" />
        <StatCard
          label="Última publi."
          value={lastPubLabel}
          meta={lastPubDate ? lastPubDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
          valueStyle={{ color: 'var(--color-secondary)', fontSize: lastPubLabel.length > 3 ? 24 : 32 }}
        />
      </section>

      {/* Filters */}
      <section
        style={{
          background: 'var(--color-paper)',
          border: '1px solid var(--color-border)',
          borderRadius: 12,
          padding: '14px 18px',
          marginBottom: 18,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '12px 18px',
        }}
      >
        <FilterGroup label="Categoría">
          <ChipButton active={catFilter === 'todas'} onClick={() => setCatFilter('todas')}>todas</ChipButton>
          {CATEGORIAS.map((c) => (
            <ChipButton key={c} active={catFilter === c} onClick={() => setCatFilter(c)}>
              {c}
            </ChipButton>
          ))}
        </FilterGroup>

        <FilterGroup label="Nivel">
          <ChipButton active={nivelFilter === 'todas'} onClick={() => setNivelFilter('todas')}>todas</ChipButton>
          {NIVELES.map((n) => (
            <ChipButton key={n} active={nivelFilter === n} onClick={() => setNivelFilter(n)}>
              {n}
            </ChipButton>
          ))}
        </FilterGroup>

        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-foreground-subtle)',
                pointerEvents: 'none',
              }}
            />
            <input
              className="input"
              type="search"
              placeholder="Buscar por título o keyword…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 40 }}
            />
          </div>
        </div>
      </section>

      {/* Table */}
      <section
        style={{
          background: 'var(--color-paper)',
          border: '1px solid var(--color-border)',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Artículo', 'Categoría', 'Edad', 'Nivel', 'Publicado', ''].map((h, i) => (
                <th
                  key={i}
                  style={{
                    textAlign: i === 5 ? 'right' : 'left',
                    padding: '14px 16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    letterSpacing: '0.12em',
                    color: 'var(--color-foreground-subtle)',
                    textTransform: 'uppercase',
                    borderBottom: '1px solid var(--color-border)',
                    background: 'var(--color-surface-alt)',
                    fontWeight: 600,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: 40,
                    textAlign: 'center',
                    color: 'var(--color-foreground-muted)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                  }}
                >
                  No hay artículos con esos filtros
                </td>
              </tr>
            )}
            {filtered.map((a, idx) => {
              const fm = a.frontmatter || {};
              const isDraft = !!fm.draft;
              return (
                <tr
                  key={a.slug}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/edit/${a.slug}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'color-mix(in oklab, var(--color-surface-alt), transparent 60%)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '';
                  }}
                >
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--color-border)', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="dorsal" data-cat={a.categoria}>
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>
                          {fm.title || a.slug}
                          {isDraft && <span className="badge-draft">DRAFT</span>}
                        </div>
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 11,
                            color: 'var(--color-foreground-subtle)',
                            marginTop: 2,
                          }}
                        >
                          {a.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--color-border)', verticalAlign: 'middle' }}>
                    <span className="cat-chip" data-cat={a.categoria}>
                      {a.categoria}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--color-border)', verticalAlign: 'middle' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12,
                        color: 'var(--color-foreground-muted)',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {fm.edadMin ?? '?'}–{fm.edadMax ?? '?'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--color-border)', verticalAlign: 'middle' }}>
                    {fm.nivel ? (
                      <span className="nivel-pill" data-nivel={fm.nivel}>
                        {fm.nivel}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--color-foreground-subtle)', fontSize: 12 }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--color-border)', verticalAlign: 'middle' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        color: 'var(--color-foreground-subtle)',
                      }}
                    >
                      {isDraft ? '—' : formatDate(fm.pubDate)}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--color-border)', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                      <button
                        className="icon-btn"
                        title="Editar"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/edit/${a.slug}`);
                        }}
                        style={{ width: 36, height: 36 }}
                      >
                        <Edit size={15} />
                      </button>
                      <a
                        href={`http://localhost:4321/${a.categoria}/${a.slug}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="icon-btn"
                        title="Ver en sitio"
                        onClick={(e) => e.stopPropagation()}
                        style={{ width: 36, height: 36 }}
                      >
                        <Eye size={15} />
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <p style={{ marginTop: 24, textAlign: 'center' }}>
        <span className="anno">click en cualquier fila para editar</span>
      </p>
    </>
  );
}

function StatCard({ label, value, meta, valueStyle }) {
  return (
    <div className="card-paper" style={{ padding: 18 }}>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.12em',
          color: 'var(--color-foreground-subtle)',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 32,
          lineHeight: 1.05,
          marginTop: 6,
          ...valueStyle,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--color-foreground-muted)',
          marginTop: 4,
        }}
      >
        {meta}
      </div>
    </div>
  );
}

function FilterGroup({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.12em',
          color: 'var(--color-foreground-subtle)',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{children}</div>
    </div>
  );
}

function ChipButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        minHeight: 44,
        padding: '8px 14px',
        borderRadius: 9999,
        border: `1.5px solid ${active ? 'var(--color-foreground)' : 'var(--color-border-strong)'}`,
        background: active ? 'var(--color-foreground)' : 'transparent',
        color: active ? 'var(--color-background)' : 'var(--color-foreground)',
        fontWeight: 600,
        fontSize: 13,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}
