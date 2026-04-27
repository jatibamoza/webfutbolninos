import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Save } from 'lucide-react';
import FrontmatterForm from '../components/FrontmatterForm.jsx';
import MDXEditor from '../components/MDXEditor.jsx';
import ValidationFooter from '../components/ValidationFooter.jsx';
import { useArticulo } from '../hooks/useArticulos.js';
import { validateArticulo } from '../services/schemaValidator.js';
import { toast } from '../services/toast.js';

export default function EditPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, saving, save } = useArticulo(slug);

  const [frontmatter, setFrontmatter] = useState(null);
  const [body, setBody] = useState('');
  const [errors, setErrors] = useState({});

  // Inicializa estado local con los datos del API
  useEffect(() => {
    if (data) {
      setFrontmatter({ ...data.frontmatter, _slug: slug, _categoria: data.categoria });
      setBody(data.body || '');
    }
  }, [data, slug]);

  function handleSave(asDraft) {
    if (!frontmatter) return;
    const { _slug, _categoria, ...cleanFm } = frontmatter;
    if (asDraft) cleanFm.draft = true;

    const { valid, errors: validationErrors } = validateArticulo(cleanFm);
    if (!valid && !asDraft) {
      setErrors(validationErrors);
      toast('Corrige los errores antes de publicar', 'error');
      return;
    }
    setErrors({});
    save(cleanFm, body);
  }

  function handleAudit() {
    if (!frontmatter) return;
    const { _slug, _categoria, ...cleanFm } = frontmatter;
    const { valid, errors: validationErrors } = validateArticulo(cleanFm);
    setErrors(validationErrors);
    if (valid) {
      toast('Frontmatter válido — revisa los checks en el footer', 'success');
    } else {
      toast(`${Object.keys(validationErrors).length} errores en frontmatter`, 'warning');
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 60, color: 'var(--color-foreground-muted)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>Cargando artículo…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <p style={{ color: 'var(--color-energy)', fontFamily: 'var(--font-mono)', marginBottom: 20 }}>
          {error}
        </p>
        <button className="btn btn-ghost" onClick={() => navigate('/')}>
          Volver al dashboard
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Topbar breadcrumb de la edit page */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 24,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-foreground-muted)' }}>
          <button
            className="icon-btn"
            style={{ width: 36, height: 36 }}
            onClick={() => navigate('/')}
            title="Volver al dashboard"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-foreground-muted)', fontFamily: 'var(--font-mono)', fontSize: 11 }}
          >
            Dashboard
          </button>
          <span style={{ color: 'var(--color-foreground-subtle)' }}>›</span>
          <span style={{ color: 'var(--color-foreground)', fontWeight: 600, maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {frontmatter?.title || slug}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            className="btn btn-ghost"
            onClick={() => handleSave(true)}
            disabled={saving}
            type="button"
          >
            <Save size={16} />
            Guardar borrador
          </button>
          <a
            href={`http://localhost:4321/${data?.categoria}/${slug}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            title="Ver en sitio"
          >
            <ExternalLink size={16} />
          </a>
          <button
            className="btn btn-primary"
            onClick={() => handleSave(false)}
            disabled={saving}
            type="button"
          >
            <Save size={16} />
            {saving ? 'Guardando…' : 'Guardar publicado'}
          </button>
        </div>
      </div>

      {/* 2-col layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 20,
        }}
        className="edit-grid"
      >
        {/* Col izq: form */}
        <div>
          {frontmatter && (
            <FrontmatterForm
              frontmatter={frontmatter}
              onChange={setFrontmatter}
              errors={errors}
            />
          )}
        </div>

        {/* Col der: editor */}
        <div>
          <MDXEditor
            body={body}
            frontmatter={frontmatter}
            onChange={setBody}
          />
        </div>
      </div>

      <ValidationFooter
        frontmatter={frontmatter}
        body={body}
        onAudit={handleAudit}
        saving={saving}
      />

      <style>{`
        @media (min-width: 1024px) {
          .edit-grid {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr) !important;
          }
        }
      `}</style>
    </>
  );
}
