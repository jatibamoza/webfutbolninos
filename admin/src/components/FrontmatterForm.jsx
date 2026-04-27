import { useState } from 'react';

const CATEGORIAS = ['ejercicios', 'juegos', 'equipamiento', 'iniciacion', 'mundial-2026'];
const NIVELES = ['facil', 'media', 'reto'];

function Field({ label, required, helper, helperType, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label className="label">
        {label}
        {required && <span style={{ color: 'var(--color-energy)', marginLeft: 4 }}>*</span>}
      </label>
      {children}
      {helper && (
        <div className={`helper ${helperType === 'ok' ? 'helper-ok' : helperType === 'warn' ? 'helper-warn' : helperType === 'error' ? 'helper-error' : ''}`}>
          {helper}
        </div>
      )}
    </div>
  );
}

function SectionHeader({ num, title }) {
  return (
    <h2
      style={{
        fontSize: 22,
        marginBottom: 14,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontFamily: 'var(--font-display)',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--color-handwritten)',
          opacity: 0.5,
          fontSize: 18,
        }}
      >
        {num}
      </span>{' '}
      {title}
    </h2>
  );
}

export default function FrontmatterForm({ frontmatter, onChange, errors = {} }) {
  const fm = frontmatter || {};

  function set(key, value) {
    onChange({ ...fm, [key]: value });
  }

  const titleLen = (fm.title || '').length;
  const descLen = (fm.description || '').length;

  // Tags input state
  const [tagInput, setTagInput] = useState('');

  function addTag(e) {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/,$/, '');
      const current = fm.tags || [];
      if (!current.includes(newTag)) {
        set('tags', [...current, newTag]);
      }
      setTagInput('');
    }
  }

  function removeTag(tag) {
    set('tags', (fm.tags || []).filter((t) => t !== tag));
  }

  function formatDate(val) {
    if (!val) return '';
    try {
      const d = new Date(val);
      return d.toISOString().split('T')[0];
    } catch {
      return '';
    }
  }

  return (
    <div>
      {/* ── 01 Identidad ── */}
      <div className="card-paper" style={{ padding: 20, marginBottom: 18 }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--color-foreground-subtle)',
            marginBottom: 4,
          }}
        >
          Sección 01
        </div>
        <SectionHeader num="01" title="Identidad" />

        <Field
          label="Title"
          required
          helper={
            errors.title
              ? errors.title
              : titleLen > 0
              ? `${titleLen > 70 ? '⚠' : '✓'} ${titleLen}/70 chars`
              : '0/70 chars'
          }
          helperType={errors.title ? 'error' : titleLen > 70 ? 'warn' : titleLen > 0 ? 'ok' : ''}
        >
          <input
            className="input"
            value={fm.title || ''}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Título del artículo (máx. 70 chars)"
          />
        </Field>

        <Field label="Slug" helper="readonly · cambiar slug rompe URLs públicas">
          <input
            className="input mono"
            value={fm._slug || ''}
            readOnly
            style={{ opacity: 0.7, fontFamily: 'var(--font-mono)' }}
          />
        </Field>

        <Field
          label="Description"
          required
          helper={
            errors.description
              ? errors.description
              : descLen > 0
              ? `${descLen < 120 ? '⚠ muy corta' : descLen > 160 ? '⚠ muy larga' : '✓ longitud óptima'} ${descLen}/160 chars`
              : '0/160 chars'
          }
          helperType={
            errors.description
              ? 'error'
              : descLen > 0 && descLen >= 120 && descLen <= 160
              ? 'ok'
              : descLen > 0
              ? 'warn'
              : ''
          }
        >
          <textarea
            className="textarea"
            value={fm.description || ''}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Meta description (120-160 chars)"
            rows={3}
          />
        </Field>
      </div>

      {/* ── 02 Categorización ── */}
      <div className="card-paper" style={{ padding: 20, marginBottom: 18 }}>
        <SectionHeader num="02" title="Categorización" />

        <Field label="Categoría" required helper={errors.categoria} helperType={errors.categoria ? 'error' : ''}>
          <select
            className="select"
            value={fm.categoria || ''}
            onChange={(e) => set('categoria', e.target.value)}
          >
            <option value="">— Seleccionar —</option>
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Edad mín." helper={errors.edadMin} helperType={errors.edadMin ? 'error' : ''}>
            <input
              className="input"
              type="number"
              min={3}
              max={18}
              value={fm.edadMin ?? ''}
              onChange={(e) => set('edadMin', Number(e.target.value))}
            />
          </Field>
          <Field label="Edad máx." helper={errors.edadMax} helperType={errors.edadMax ? 'error' : ''}>
            <input
              className="input"
              type="number"
              min={3}
              max={18}
              value={fm.edadMax ?? ''}
              onChange={(e) => set('edadMax', Number(e.target.value))}
            />
          </Field>
        </div>

        <Field label="Nivel" required helper={errors.nivel} helperType={errors.nivel ? 'error' : ''}>
          <div style={{ display: 'flex', gap: 6 }}>
            {NIVELES.map((n) => (
              <label key={n} style={{ flex: 1, cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="nivel"
                  value={n}
                  checked={fm.nivel === n}
                  onChange={() => set('nivel', n)}
                  style={{ display: 'none' }}
                />
                <span
                  style={{
                    display: 'block',
                    minHeight: 44,
                    lineHeight: '44px',
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: 13,
                    border: `1.5px solid ${fm.nivel === n ? 'var(--color-foreground)' : 'var(--color-border-strong)'}`,
                    borderRadius: 9999,
                    background: fm.nivel === n ? 'var(--color-foreground)' : 'transparent',
                    color: fm.nivel === n ? 'var(--color-background)' : 'var(--color-foreground)',
                    cursor: 'pointer',
                  }}
                >
                  {n}
                </span>
              </label>
            ))}
          </div>
        </Field>

        <Field label="Tags">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              padding: '8px 10px',
              border: '1.5px solid var(--color-border-strong)',
              borderRadius: 10,
              background: 'var(--color-paper)',
              minHeight: 44,
              alignItems: 'center',
            }}
          >
            {(fm.tags || []).map((tag) => (
              <span
                key={tag}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '4px 10px',
                  background: 'var(--color-surface-alt)',
                  borderRadius: 9999,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: 'var(--color-foreground-muted)',
                    padding: 0,
                    lineHeight: 1,
                    fontSize: 14,
                    minHeight: 'unset',
                  }}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              placeholder="añadir tag…"
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                padding: 4,
                flex: 1,
                minWidth: 100,
                fontFamily: 'var(--font-body)',
                fontSize: 13,
              }}
            />
          </div>
          <div className="helper">Enter o coma para añadir</div>
        </Field>
      </div>

      {/* ── 03 SEO ── */}
      <div className="card-paper" style={{ padding: 20, marginBottom: 18 }}>
        <SectionHeader num="03" title="SEO" />

        <Field
          label="Keyword principal"
          required
          helper={errors.keyword}
          helperType={errors.keyword ? 'error' : ''}
        >
          <input
            className="input"
            value={fm.keyword || ''}
            onChange={(e) => set('keyword', e.target.value)}
            placeholder="ej. ejercicios de fútbol para niños de 6 años"
          />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Fecha publicación" required helper={errors.pubDate} helperType={errors.pubDate ? 'error' : ''}>
            <input
              className="input mono"
              type="date"
              value={formatDate(fm.pubDate)}
              onChange={(e) => set('pubDate', e.target.value)}
            />
          </Field>
          <Field label="Updated date" helper="opcional">
            <input
              className="input mono"
              type="date"
              value={formatDate(fm.updatedDate)}
              onChange={(e) => set('updatedDate', e.target.value || undefined)}
            />
          </Field>
        </div>

        <Field label="Autor" helper={errors.autor} helperType={errors.autor ? 'error' : ''}>
          <input
            className="input"
            value={fm.autor || 'javier-tibamoza'}
            onChange={(e) => set('autor', e.target.value)}
          />
        </Field>

        <Field label="Tiempo de lectura (min)" helper="opcional">
          <input
            className="input"
            type="number"
            min={1}
            value={fm.tiempoLectura ?? ''}
            onChange={(e) =>
              set('tiempoLectura', e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </Field>
      </div>

      {/* ── 04 Cover ── */}
      <div className="card-paper" style={{ padding: 20, marginBottom: 18 }}>
        <SectionHeader num="04" title="Cover" />

        <div
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            padding: 12,
            border: '1.5px dashed var(--color-border-strong)',
            borderRadius: 10,
          }}
        >
          <div
            style={{
              width: 200,
              height: 125,
              background: 'linear-gradient(135deg, #faf6e8 0%, #f4ebc8 100%)',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              flexShrink: 0,
              display: 'grid',
              placeItems: 'center',
              fontFamily: 'var(--font-display)',
              color: 'var(--color-secondary)',
              fontWeight: 700,
              opacity: 0.6,
              fontSize: 12,
              textAlign: 'center',
              padding: 8,
            }}
          >
            {fm.cover ? fm.cover.split('/').pop() : 'cover.jpg'}
            <br />
            1200×750
          </div>

          <div style={{ flex: 1 }}>
            <Field
              label="Ruta cover"
              required
              helper={errors.cover}
              helperType={errors.cover ? 'error' : ''}
            >
              <input
                className="input mono"
                value={fm.cover || ''}
                onChange={(e) => set('cover', e.target.value)}
                placeholder="../../../assets/articulos/categoria/slug.jpg"
                style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
              />
            </Field>

            <Field
              label="Alt text"
              required
              helper={errors.coverAlt}
              helperType={errors.coverAlt ? 'error' : ''}
            >
              <input
                className="input"
                value={fm.coverAlt || ''}
                onChange={(e) => set('coverAlt', e.target.value)}
                placeholder="Descripción accesible de la imagen"
              />
            </Field>
          </div>
        </div>
      </div>

      {/* ── 05 Flags ── */}
      <div className="card-paper" style={{ padding: 20 }}>
        <SectionHeader num="05" title="Flags" />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 10,
          }}
        >
          {[
            { key: 'draft', label: 'Draft' },
            { key: 'tieneAfiliados', label: 'Afiliados' },
            { key: 'featured', label: 'Featured' },
          ].map(({ key, label }) => (
            <label
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                background: 'var(--color-surface-alt)',
                borderRadius: 10,
                minHeight: 44,
                cursor: 'pointer',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 13 }}>{label}</span>
              <Switch
                checked={!!fm[key]}
                onChange={(val) => set(key, val)}
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function Switch({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 36,
        height: 20,
        background: checked ? 'var(--color-foreground)' : 'var(--color-border-strong)',
        borderRadius: 9999,
        position: 'relative',
        transition: 'background 150ms',
        flexShrink: 0,
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: checked ? 18 : 2,
          top: 2,
          width: 16,
          height: 16,
          background: 'var(--color-paper)',
          borderRadius: '50%',
          transition: 'left 150ms',
        }}
      />
    </div>
  );
}
