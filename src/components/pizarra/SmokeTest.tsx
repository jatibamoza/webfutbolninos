import { useState } from 'preact/hooks';

export default function SmokeTest() {
  const [count, setCount] = useState(0);
  return (
    <div
      style={{
        padding: '16px',
        border: '1.5px dashed var(--color-border-strong)',
        borderRadius: '10px',
        background: 'var(--color-paper)',
        fontFamily: 'var(--font-mono)',
        fontSize: '13px',
        color: 'var(--color-foreground-muted)',
      }}
    >
      <div style={{ marginBottom: 8 }}>PIZARRA · PREACT SMOKE TEST · OK</div>
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        style={{
          padding: '8px 14px',
          minHeight: 40,
          borderRadius: 8,
          border: '1.5px solid var(--color-border-strong)',
          background: 'var(--color-foreground)',
          color: 'var(--color-background)',
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: 14,
          cursor: 'pointer',
        }}
      >
        clicks: {count}
      </button>
    </div>
  );
}
