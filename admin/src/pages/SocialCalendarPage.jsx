import { useCallback, useEffect, useState } from 'react';
import { useSocialCalendar } from '../hooks/useSocialCalendar.js';
import {
  setPostStatus,
  setPostScheduledAt,
  fetchCalendarDiff,
  commitCalendar,
} from '../services/socialAPI.js';
import { toast } from '../services/toast.js';
import InstagramPreview from '../components/social/InstagramPreview.jsx';

/**
 * Convierte un ISO con offset (`2026-05-07T19:00:00+02:00`) al formato del input
 * datetime-local (`2026-05-07T19:00`), preservando los componentes de fecha/hora
 * tal como aparecen en el ISO (sin convertir a la TZ del navegador).
 * Nota: ignoramos el offset porque el datetime-local no lo acepta. El offset
 * lo añadimos al guardar.
 */
function isoToDatetimeLocal(iso) {
  const m = iso.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(?::\d{2})?/);
  return m ? `${m[1]}T${m[2]}` : '';
}

/**
 * Detecta el offset original del ISO (`+02:00`, `-05:00`, `Z`).
 * Si no encuentra, devuelve el offset Madrid del momento (CET/CEST según fecha).
 */
function detectOffset(iso) {
  const m = iso.match(/([zZ]|[+-]\d{2}:\d{2})$/);
  if (m) return m[1] === 'Z' || m[1] === 'z' ? 'Z' : m[1];
  // Fallback: offset de Madrid en la fecha del ISO (CEST entre 27 mar y 30 oct, CET el resto)
  const d = new Date(iso);
  const month = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  const isCEST = (month > 3 && month < 10) ||
    (month === 3 && day >= 27) ||
    (month === 10 && day < 30);
  return isCEST ? '+02:00' : '+01:00';
}

const STATUS_STYLE = {
  draft:     { bg: '#e5e7eb', fg: '#374151', label: 'Borrador' },
  approved:  { bg: '#FACC15', fg: '#1a1f2c', label: 'Aprobado' },
  published: { bg: '#16A34A', fg: '#ffffff', label: 'Publicado' },
  failed:    { bg: '#DC2626', fg: '#ffffff', label: 'Falló' },
  archived:  { bg: '#9ca3af', fg: '#1a1f2c', label: 'Archivado' },
};

const PLATFORM_LABEL = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  x: 'X',
  linkedin: 'LinkedIn',
  pinterest: 'Pinterest',
  youtube: 'YouTube',
};

const FORMAT_LABEL = {
  single_image: 'Imagen',
  carousel: 'Carrusel',
  reel: 'Reel',
  story: 'Story',
  video: 'Vídeo',
  text: 'Texto',
};

function dayKey(iso) {
  return new Date(iso).toISOString().slice(0, 10);
}

function fmtDay(key) {
  const d = new Date(`${key}T12:00:00`);
  return d.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

function previewCaption(caption, max = 140) {
  if (!caption) return '';
  if (caption.length <= max) return caption;
  return caption.slice(0, max).trim() + '…';
}

function PostCard({ post, onChanged }) {
  const [showPreview, setShowPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [editingDate, setEditingDate] = useState(false);
  const [draftDateTime, setDraftDateTime] = useState(() => isoToDatetimeLocal(post.scheduled_at));
  const status = STATUS_STYLE[post.status] || STATUS_STYLE.draft;

  async function changeStatus(nextStatus, confirmMsg) {
    if (confirmMsg && !window.confirm(confirmMsg)) return;
    setBusy(true);
    try {
      const result = await setPostStatus(post.id, nextStatus);
      const verb = nextStatus === 'approved' ? 'aprobado' : nextStatus === 'draft' ? 'devuelto a borrador' : nextStatus;
      toast(`Post ${verb}. ${result.hint || 'Recuerda commit + push.'}`, nextStatus === 'approved' ? 'success' : 'warning');
      onChanged?.();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  async function saveDateTime() {
    if (!draftDateTime) {
      toast('Fecha/hora vacía', 'error');
      return;
    }
    const offset = detectOffset(post.scheduled_at);
    const newIso = `${draftDateTime}:00${offset}`;
    if (newIso === post.scheduled_at) {
      setEditingDate(false);
      return;
    }
    setBusy(true);
    try {
      const result = await setPostScheduledAt(post.id, newIso);
      toast(`Fecha actualizada. ${result.hint || 'Recuerda commit + push.'}`, 'success');
      setEditingDate(false);
      onChanged?.();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  function cancelDateEdit() {
    setDraftDateTime(isoToDatetimeLocal(post.scheduled_at));
    setEditingDate(false);
  }

  return (
    <article
      className="card-paper"
      style={{
        padding: 20,
        borderLeft: `6px solid ${status.bg}`,
      }}
    >
      <header style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
          <span
            className="mono"
            style={{
              display: 'inline-block',
              borderRadius: 9999,
              padding: '4px 12px',
              fontSize: 11,
              fontWeight: 700,
              background: status.bg,
              color: status.fg,
              letterSpacing: '0.05em',
            }}
          >
            {status.label}
          </span>
          {post.platforms?.map((pl) => (
            <span
              key={pl}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                borderRadius: 6,
                padding: '4px 8px',
                fontSize: 11,
                fontWeight: 500,
                background: 'var(--color-surface-alt)',
                color: 'var(--color-foreground)',
              }}
            >
              {PLATFORM_LABEL[pl] || pl}
            </span>
          ))}
          <span
            className="mono"
            style={{
              display: 'inline-block',
              borderRadius: 6,
              padding: '4px 8px',
              fontSize: 11,
              background: 'var(--color-surface-alt)',
              color: 'var(--color-foreground-muted)',
            }}
          >
            {FORMAT_LABEL[post.format] || post.format}
          </span>
          <span
            className="mono"
            style={{
              display: 'inline-block',
              borderRadius: 6,
              padding: '4px 8px',
              fontSize: 11,
              textTransform: 'uppercase',
              background: 'var(--color-surface-alt)',
              color: 'var(--color-foreground-muted)',
              letterSpacing: '0.06em',
            }}
          >
            {post.locale}
          </span>
          {post.isOverdue && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                borderRadius: 6,
                padding: '4px 8px',
                fontSize: 11,
                fontWeight: 700,
                background: '#FEF3C7',
                color: '#92400E',
              }}
            >
              ⚠ vencido
            </span>
          )}
        </div>
        {!editingDate && (post.status === 'draft' || post.status === 'approved') ? (
          <button
            type="button"
            onClick={() => setEditingDate(true)}
            title="Editar fecha y hora"
            className="mono"
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--color-foreground-muted)',
              background: 'none',
              border: '1px dashed transparent',
              borderRadius: 6,
              padding: '4px 6px',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-border-strong)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; }}
          >
            {fmtTime(post.scheduled_at)} ✎
          </button>
        ) : !editingDate ? (
          <time
            className="mono"
            style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-foreground-muted)' }}
            dateTime={post.scheduled_at}
          >
            {fmtTime(post.scheduled_at)}
          </time>
        ) : null}
      </header>

      {editingDate && (
        <div style={{ marginTop: 12, padding: 12, background: 'var(--color-surface-alt)', borderRadius: 8, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
          <label className="mono" style={{ fontSize: 11, color: 'var(--color-foreground-muted)' }}>
            Fecha y hora ({detectOffset(post.scheduled_at)} Madrid):
          </label>
          <input
            type="datetime-local"
            value={draftDateTime}
            onChange={(e) => setDraftDateTime(e.target.value)}
            disabled={busy}
            className="input"
            style={{ minHeight: 36, padding: '6px 10px', fontSize: 13, width: 'auto', flex: '0 0 auto' }}
          />
          <button
            type="button"
            onClick={saveDateTime}
            disabled={busy}
            className="btn btn-primary"
            style={{ minHeight: 36, padding: '6px 12px', fontSize: 13 }}
          >
            {busy ? 'Guardando…' : '💾 Guardar'}
          </button>
          <button
            type="button"
            onClick={cancelDateEdit}
            disabled={busy}
            className="btn btn-ghost"
            style={{ minHeight: 36, padding: '6px 12px', fontSize: 13 }}
          >
            Cancelar
          </button>
        </div>
      )}

      <p style={{ marginTop: 12, fontSize: 13, lineHeight: 1.5, color: 'var(--color-foreground)', whiteSpace: 'pre-line' }}>
        {previewCaption(post.caption)}
      </p>

      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: '8px 16px', fontSize: 11 }}>
        {post.target_url && (
          <a
            href={post.target_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            ↗ {post.article_slug || 'destino'}
          </a>
        )}
        {post.media?.[0] && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              color: post.assetReady ? 'var(--color-secondary)' : 'var(--color-energy)',
            }}
          >
            {post.assetReady ? '✓' : '✗'} {post.media[0].path}
          </span>
        )}
        {post.hashtags && post.hashtags.length > 0 && (
          <span className="mono" style={{ color: 'var(--color-foreground-muted)' }}>
            {post.hashtags.length} hashtags
          </span>
        )}
        <span className="mono" style={{ color: 'var(--color-foreground-subtle)' }}>
          id: {post.id}
        </span>
      </div>

      {post.error && (
        <div style={{ marginTop: 12, padding: 12, borderRadius: 6, fontSize: 12, background: '#FEE2E2', color: '#991B1B' }}>
          <strong>Error:</strong> {post.error}
        </div>
      )}

      {post.notes && (
        <p className="hand" style={{ marginTop: 12, fontSize: 16 }}>
          ✏ {post.notes}
        </p>
      )}

      {post.publer_post_id && (
        <p className="mono" style={{ marginTop: 12, fontSize: 11, color: 'var(--color-foreground-subtle)' }}>
          Publer job: {post.publer_post_id}
        </p>
      )}

      {(post.status === 'draft' || post.status === 'approved') && (
        <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {post.status === 'draft' && (
            <button
              type="button"
              onClick={() =>
                changeStatus(
                  'approved',
                  `¿Aprobar este post para publicación automática el ${new Date(post.scheduled_at).toLocaleString('es-ES')}?\n\nRecuerda: tras aprobar tienes que commit + push de calendar.json para que el cron lo recoja.`,
                )
              }
              disabled={busy}
              className="btn btn-primary"
              style={{ minHeight: 36, padding: '8px 14px', fontSize: 13 }}
            >
              {busy ? 'Aprobando…' : '✓ Aprobar publicación'}
            </button>
          )}
          {post.status === 'approved' && !post.publer_post_id && (
            <button
              type="button"
              onClick={() => changeStatus('draft', '¿Devolver este post aprobado a borrador? El cron dejará de procesarlo.')}
              disabled={busy}
              className="btn btn-ghost"
              style={{ minHeight: 36, padding: '8px 14px', fontSize: 13 }}
            >
              {busy ? 'Cambiando…' : '↺ Volver a borrador'}
            </button>
          )}
        </div>
      )}

      {post.platforms?.includes('instagram') && post.media?.[0] && (
        <div style={{ marginTop: 16 }}>
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--color-primary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            👁 {showPreview ? 'Ocultar' : 'Vista previa'} Instagram
          </button>
          {showPreview && (
            <div style={{ marginTop: 16 }}>
              <InstagramPreview post={post} />
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function CommitButton({ onCommitted }) {
  const [diff, setDiff] = useState({ hasChanges: false, changes: [] });
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const d = await fetchCalendarDiff();
      setDiff(d);
    } catch {
      setDiff({ hasChanges: false, changes: [] });
    }
  }, []);

  useEffect(() => {
    refresh();
    const i = setInterval(refresh, 5000);
    return () => clearInterval(i);
  }, [refresh]);

  if (!diff.hasChanges) return null;

  const summary = diff.changes.length > 0
    ? diff.changes.map((c) => `• ${c.id}: ${c.field} → ${c.value}`).join('\n')
    : '(cambios en calendar.json detectados)';

  async function doCommit() {
    if (!window.confirm(`¿Crear PR con estos cambios?\n\n${summary}\n\nEl PR se abrirá en GitHub. Tras el merge, el cron lo recoge en max 30min.`)) return;
    setBusy(true);
    try {
      const result = await commitCalendar();
      const msg = result.autoMergeQueued
        ? `PR #${result.prNumber} creado y encolado para auto-merge cuando CI pase (~3-4min)`
        : `PR #${result.prNumber} creado — mergéalo manualmente`;
      toast(msg, 'success');
      window.open(result.prUrl, '_blank', 'noopener');
      await refresh();
      onCommitted?.();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={doCommit}
      disabled={busy}
      className="btn btn-primary"
      style={{ minHeight: 36, padding: '6px 14px', fontSize: 13 }}
      title={summary}
    >
      {busy ? 'Creando PR…' : `📤 Commitear (${diff.changes.length || 'cambios'}) y abrir PR`}
    </button>
  );
}

export default function SocialCalendarPage() {
  const { data, loading, error, refetch } = useSocialCalendar();

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-foreground-muted)' }}>
        Cargando calendar…
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-paper" style={{ padding: 24, background: '#FEE2E2', borderColor: '#DC2626' }}>
        <strong style={{ color: '#991B1B' }}>Error:</strong>{' '}
        <span style={{ color: '#991B1B' }}>{error}</span>
      </div>
    );
  }

  const { posts = [], counts = {}, upcomingApproved = 0, overdueApproved = 0 } = data || {};

  const sorted = [...posts].sort(
    (a, b) => Date.parse(a.scheduled_at) - Date.parse(b.scheduled_at),
  );
  const grouped = new Map();
  for (const p of sorted) {
    const key = dayKey(p.scheduled_at);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(p);
  }

  return (
    <div>
      <header style={{ marginBottom: 32 }}>
        <p className="mono" style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-foreground-subtle)' }}>
          Admin · solo visualización
        </p>
        <h1 style={{ margin: '8px 0 0', fontSize: 'clamp(2rem, 4vw, 2.75rem)', lineHeight: 1, letterSpacing: '-0.02em' }}>
          Social Calendar
        </h1>
        <p style={{ marginTop: 12, fontSize: 13, color: 'var(--color-foreground-muted)' }}>
          Lectura de <code style={{ fontFamily: 'var(--font-mono)', padding: '2px 6px', background: 'var(--color-surface-alt)', borderRadius: 4 }}>content/social/calendar.json</code>.{' '}
          Para editar, abre cada post abajo o usa el botón de commitear cambios.
        </p>
        <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            onClick={refetch}
            className="mono"
            style={{
              fontSize: 11,
              padding: '6px 12px',
              borderRadius: 6,
              background: 'var(--color-surface-alt)',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-foreground)',
              minHeight: 36,
            }}
          >
            ↻ Recargar
          </button>
          <CommitButton onCommitted={refetch} />
        </div>
      </header>

      <section style={{ marginBottom: 32, display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
        {Object.entries(STATUS_STYLE).map(([s, style]) => (
          <div key={s} className="card-paper" style={{ padding: 16 }}>
            <div className="mono" style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: style.bg }}>
              {style.label}
            </div>
            <div style={{ marginTop: 4, fontSize: 30, fontFamily: 'var(--font-display)', fontWeight: 700, lineHeight: 1 }}>
              {counts[s] ?? 0}
            </div>
          </div>
        ))}
      </section>

      {(overdueApproved > 0 || upcomingApproved > 0) && (
        <section style={{ marginBottom: 24, display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {overdueApproved > 0 && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 16, borderRadius: 8, background: '#FEF3C7', border: '1px solid #D97706' }}>
              <span style={{ fontSize: 20 }}>⚠</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#92400E' }}>
                  {overdueApproved} post(s) approved con fecha pasada
                </p>
                <p style={{ marginTop: 4, fontSize: 11, color: '#92400E' }}>
                  El próximo cron del scheduler los marcará como <code>failed</code> si quedan fuera de la ventana.
                </p>
              </div>
            </div>
          )}
          {upcomingApproved > 0 && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 16, borderRadius: 8, background: '#DCFCE7', border: '1px solid #16A34A' }}>
              <span style={{ fontSize: 20 }}>✓</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#166534' }}>
                  {upcomingApproved} post(s) approved en la cola
                </p>
                <p style={{ marginTop: 4, fontSize: 11, color: '#166534' }}>
                  El scheduler los enviará a Publer cuando llegue su <code>scheduled_at</code>.
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      {grouped.size === 0 ? (
        <div className="card-paper" style={{ padding: 32, textAlign: 'center', borderStyle: 'dashed' }}>
          <p style={{ fontSize: 13, color: 'var(--color-foreground-muted)' }}>
            El calendar.json está vacío. Añade el primer post en Git.
          </p>
        </div>
      ) : (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {Array.from(grouped.entries()).map(([day, dayPosts]) => (
            <div key={day}>
              <h2 style={{ margin: '0 0 12px', fontSize: 18, fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'capitalize' }}>
                {fmtDay(day)}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {dayPosts.map((post) => (
                  <PostCard key={post.id} post={post} onChanged={refetch} />
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      <footer style={{ marginTop: 48, fontSize: 11, color: 'var(--color-foreground-subtle)' }}>
        <p>Última generación: {data?.generated_at || 'nunca (manual)'}</p>
        <p style={{ marginTop: 4 }}>
          Para editar: modifica <code>content/social/calendar.json</code> y abre un PR.
        </p>
      </footer>
    </div>
  );
}
