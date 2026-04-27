import { CheckCircle, AlertTriangle } from 'lucide-react';

function checkInternalLinks(body) {
  const matches = (body || '').match(/\[.+?\]\(\/[^)]+\)/g) || [];
  return matches.length;
}

function checkKeywordInContent(keyword, body, frontmatter) {
  if (!keyword || !body) return { h1: false, intro: false, slug: false };
  const kw = keyword.toLowerCase();
  const lines = body.split('\n');
  const h1Line = lines.find((l) => l.startsWith('# '));
  const firstParagraph = lines.slice(0, 10).join(' ').toLowerCase();
  return {
    h1: h1Line ? h1Line.toLowerCase().includes(kw) : false,
    intro: firstParagraph.includes(kw),
    slug: (frontmatter?._slug || '').toLowerCase().includes(kw.split(' ')[0]),
  };
}

export default function ValidationFooter({ frontmatter, body, onAudit, saving }) {
  const fm = frontmatter || {};

  const titleOk = fm.title && fm.title.length >= 1 && fm.title.length <= 70;
  const descOk = fm.description && fm.description.length >= 120 && fm.description.length <= 160;
  const hasCover = !!fm.cover && !!fm.coverAlt;
  const internalLinks = checkInternalLinks(body);
  const linksOk = internalLinks >= 2;
  const kwChecks = checkKeywordInContent(fm.keyword, body, fm);
  const frontmatterValid = titleOk && descOk && hasCover && !!fm.categoria && !!fm.nivel;

  const checks = [
    { ok: frontmatterValid, label: 'Frontmatter válido' },
    { ok: linksOk, label: `${internalLinks} internal links${internalLinks < 2 ? ' (mín. 2)' : ''}` },
    { ok: kwChecks.h1, label: 'Keyword en H1' },
    { ok: kwChecks.intro, label: 'Keyword en intro' },
    { ok: kwChecks.slug, label: 'Keyword en slug' },
  ];

  return (
    <footer
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--color-paper)',
        borderTop: '2px solid var(--color-foreground)',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap',
        zIndex: 40,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          flexWrap: 'wrap',
        }}
      >
        {checks.map(({ ok, label }) => (
          <span
            key={label}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              color: ok ? 'var(--color-secondary)' : 'var(--color-accent)',
            }}
          >
            {ok ? (
              <CheckCircle size={13} />
            ) : (
              <AlertTriangle size={13} />
            )}
            {ok ? `✓ ${label}` : `⚠ ${label}`}
          </span>
        ))}
      </div>

      <button
        className="btn btn-ghost"
        style={{ fontSize: 13 }}
        onClick={onAudit}
        disabled={saving}
        type="button"
      >
        <CheckCircle size={16} />
        {saving ? 'Guardando…' : 'Auditar SEO'}
      </button>
    </footer>
  );
}
