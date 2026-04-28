import { cloneElement, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step2Schema } from '../../services/wizardSchema.js';

// Convierte texto a slug kebab-case sin tildes
export function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')  // elimina diacríticos tras NFD (á→a, ñ→n, etc.)
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const NIVELES = [
  { id: 'facil', label: 'Fácil' },
  { id: 'media', label: 'Media' },
  { id: 'reto', label: 'Reto' },
];

export default function Step2Keyword({ values, categoria, onValidChange }) {
  const {
    register,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      keyword: values.keyword ?? '',
      title: values.title ?? '',
      description: values.description ?? '',
      slug: values.slug ?? '',
      coverAlt: values.coverAlt ?? '',
      edadMin: values.edadMin ?? 4,
      edadMax: values.edadMax ?? 12,
      nivel: values.nivel ?? 'facil',
    },
    mode: 'onChange',
  });

  const watched = watch();
  const slugManuallyEdited = useRef(!!values.slug);

  // Auto-genera slug desde keyword salvo que el usuario lo haya editado manualmente
  const keyword = watch('keyword');
  useEffect(() => {
    if (!slugManuallyEdited.current) {
      setValue('slug', slugify(keyword), { shouldValidate: true });
    }
  }, [keyword, setValue]);

  // Notifica al padre en cada cambio válido
  useEffect(() => {
    onValidChange(watched, isValid);
  }, [JSON.stringify(watched), isValid]); // eslint-disable-line react-hooks/exhaustive-deps

  const titleLen = (watched.title || '').length;
  const descLen = (watched.description || '').length;
  const slugVal = watched.slug || '';

  return (
    <section className="card-paper" style={{ padding: 28, marginBottom: 18 }}>
      <h2 style={{ fontSize: '1.4rem', marginBottom: 6 }}>Keyword y título</h2>
      <p style={{ color: 'var(--color-foreground-muted)', fontSize: 14, marginBottom: 24 }}>
        El long-tail principal que el artículo intentará rankear, más el H1 visible.
      </p>

      <Field label="Keyword principal" hint="2-5 palabras · long-tail · validar en docs/seo/KeywordResearch.md" error={errors.keyword?.message} required>
        <input
          className="input"
          type="text"
          {...register('keyword')}
          placeholder="ejercicios fútbol niños en casa"
        />
      </Field>

      <Field
        label="Título (H1)"
        hint={`Debe contener la keyword. Máximo 70 caracteres.`}
        error={errors.title?.message}
        required
        counter={`${titleLen} / 70`}
        counterWarn={titleLen > 60}
        counterError={titleLen > 70}
      >
        <input className="input" type="text" {...register('title')} />
      </Field>

      <Field
        label="Meta description"
        hint="120-160 caracteres. Debe vender el clic, no resumir."
        error={errors.description?.message}
        required
        counter={`${descLen} / 160`}
        counterWarn={descLen < 120 || descLen > 155}
        counterError={descLen > 160}
      >
        <textarea className="textarea" {...register('description')} style={{ minHeight: 100 }} />
      </Field>

      <Field label="Alt de la imagen cover" hint="Describe la imagen para accesibilidad y SEO" error={errors.coverAlt?.message} required>
        <input className="input" type="text" {...register('coverAlt')} placeholder="Niño practicando ejercicios de fútbol en el salón" />
      </Field>

      <div
        style={{
          display: 'grid',
          gap: 14,
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          marginBottom: 18,
        }}
      >
        <Field label="Edad mínima" error={errors.edadMin?.message} required>
          <input className="input" type="number" min={4} max={12} {...register('edadMin', { valueAsNumber: true })} />
        </Field>
        <Field label="Edad máxima" error={errors.edadMax?.message} required>
          <input className="input" type="number" min={4} max={12} {...register('edadMax', { valueAsNumber: true })} />
        </Field>
        <Field label="Nivel" error={errors.nivel?.message} required>
          <select className="select" {...register('nivel')}>
            {NIVELES.map((n) => (
              <option key={n.id} value={n.id}>{n.label}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field
        label="Slug"
        hint="Autogenerado desde la keyword. Edítalo si necesitas ajustarlo."
        error={errors.slug?.message}
        required
      >
        <input
          className="input"
          type="text"
          {...register('slug')}
          onChange={(e) => {
            slugManuallyEdited.current = true;
            setValue('slug', e.target.value, { shouldValidate: true });
          }}
          style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}
        />
      </Field>

      {/* URL preview */}
      <div
        style={{
          background: 'var(--color-surface-alt)',
          border: '1.5px dashed var(--color-border-strong)',
          borderRadius: 10,
          padding: 16,
          marginTop: 4,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.18em',
            color: 'var(--color-foreground-subtle)',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          URL final
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            color: 'var(--color-handwritten)',
            wordBreak: 'break-all',
          }}
        >
          /{categoria || '(categoría)'}/{slugVal || '(slug)'}/
        </div>
      </div>

      {/* Checks rápidos */}
      <CheckList items={[
        {
          ok: !!keyword && (watched.title || '').toLowerCase().includes(keyword.split(' ')[0]?.toLowerCase()),
          label: 'Keyword presente en título',
        },
        {
          ok: slugRegexCheck(slugVal),
          label: 'Slug en kebab-case sin tildes',
        },
        {
          ok: descLen >= 120 && descLen <= 160,
          label: 'Meta description en rango (120-160)',
        },
      ]} />
    </section>
  );
}

function slugRegexCheck(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function fieldId(label) {
  return label
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function Field({ label, hint, error, required, counter, counterWarn, counterError, children }) {
  const id = fieldId(label);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
      <label
        htmlFor={id}
        style={{
          fontWeight: 700,
          fontSize: 13,
          color: 'var(--color-foreground)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {label}
        {required && (
          <span aria-hidden="true" style={{ color: 'var(--color-energy)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>*</span>
        )}
        {counter && (
          <span
            aria-hidden="true"
            style={{
              marginLeft: 'auto',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: counterError
                ? 'var(--color-energy)'
                : counterWarn
                  ? 'var(--color-accent)'
                  : 'var(--color-foreground-subtle)',
            }}
          >
            {counter}
          </span>
        )}
      </label>
      {cloneElement(children, { id })}
      {error ? (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--color-energy)',
          }}
        >
          {error}
        </span>
      ) : hint ? (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-foreground-subtle)' }}>
          {hint}
        </span>
      ) : null}
    </div>
  );
}

function CheckList({ items }) {
  return (
    <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14, listStyle: 'none' }}>
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 13,
            color: item.ok ? 'var(--color-secondary)' : 'var(--color-foreground-muted)',
            fontWeight: item.ok ? 600 : 400,
          }}
        >
          {item.ok ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--color-secondary)' }}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--color-border-strong)' }}>
              <circle cx="12" cy="12" r="10" />
            </svg>
          )}
          {item.label}
        </li>
      ))}
    </ul>
  );
}
