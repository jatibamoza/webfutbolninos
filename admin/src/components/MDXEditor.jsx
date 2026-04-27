import { useState } from 'react';

const TABS = [
  { id: 'edit', label: 'Editar' },
  { id: 'preview', label: 'Preview' },
  { id: 'raw', label: 'Frontmatter raw' },
];

// Renderizado markdown muy básico para preview — no importa remark para no inflar el bundle en Fase 1
function SimpleMarkdownPreview({ body }) {
  const html = body
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[h|l|b|p])(.+)$/gm, '$1');

  return (
    <div
      style={{
        padding: 20,
        background: 'var(--color-paper)',
        border: '1.5px solid var(--color-border-strong)',
        borderRadius: 10,
        minHeight: 500,
        fontFamily: 'var(--font-body)',
        lineHeight: 1.7,
        color: 'var(--color-foreground)',
        overflowY: 'auto',
      }}
      dangerouslySetInnerHTML={{ __html: `<p>${html}</p>` }}
    />
  );
}

export default function MDXEditor({ body, frontmatter, onChange }) {
  const [activeTab, setActiveTab] = useState('edit');

  const wordCount = body
    ? body
        .trim()
        .split(/\s+/)
        .filter(Boolean).length
    : 0;
  const readingMin = Math.max(1, Math.round(wordCount / 200));

  const rawFrontmatter = frontmatter
    ? Object.entries(frontmatter)
        .filter(([k]) => !k.startsWith('_'))
        .map(([k, v]) => {
          if (v === null || v === undefined) return null;
          if (typeof v === 'string' && v.includes('\n')) return `${k}: |\n  ${v.replace(/\n/g, '\n  ')}`;
          if (Array.isArray(v)) return `${k}:\n${v.map((i) => `  - ${i}`).join('\n')}`;
          if (v instanceof Date) return `${k}: ${v.toISOString().split('T')[0]}`;
          if (typeof v === 'string') return `${k}: "${v}"`;
          return `${k}: ${v}`;
        })
        .filter(Boolean)
        .join('\n')
    : '';

  return (
    <div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              minHeight: 44,
              padding: '8px 16px',
              border: `1.5px solid ${activeTab === tab.id ? 'var(--color-foreground)' : 'var(--color-border-strong)'}`,
              background: activeTab === tab.id ? 'var(--color-foreground)' : 'transparent',
              borderRadius: '10px 10px 0 0',
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              color: activeTab === tab.id ? 'var(--color-background)' : 'var(--color-foreground-muted)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'edit' && (
        <textarea
          value={body || ''}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            minHeight: 500,
            padding: 16,
            border: '1.5px solid var(--color-border-strong)',
            borderRadius: 10,
            background: 'var(--color-paper)',
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            lineHeight: 1.6,
            color: 'var(--color-foreground)',
            resize: 'vertical',
            outline: 'none',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--color-foreground)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--color-border-strong)';
          }}
          placeholder="Escribe el contenido MDX aquí…"
          spellCheck
        />
      )}

      {activeTab === 'preview' && <SimpleMarkdownPreview body={body || ''} />}

      {activeTab === 'raw' && (
        <pre
          style={{
            width: '100%',
            minHeight: 500,
            padding: 16,
            border: '1.5px solid var(--color-border-strong)',
            borderRadius: 10,
            background: 'var(--color-paper)',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            lineHeight: 1.6,
            color: 'var(--color-foreground)',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {`---\n${rawFrontmatter}\n---\n\n${body || ''}`}
        </pre>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 4px',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--color-foreground-subtle)',
          marginTop: 6,
        }}
      >
        <span>
          <strong>{wordCount}</strong> palabras · ~<strong>{readingMin} min</strong> lectura
        </span>
        <span
          style={{
            fontFamily: 'var(--font-hand)',
            color: 'var(--color-handwritten)',
            fontSize: 14,
          }}
        >
          ↑ los cambios no se guardan solos
        </span>
      </div>
    </div>
  );
}
