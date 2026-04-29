import { useState, useEffect } from 'preact/hooks';

export function useShareToast() {
  const [visible, setVisible] = useState(false);
  const [url, setUrl] = useState('');

  const triggerShare = async () => {
    const href = window.location.href;
    setUrl(href);
    try {
      await navigator.clipboard.writeText(href);
    } catch {
      // clipboard unavailable — url still shown in the toast input
    }
    setVisible(true);
  };

  return { triggerShare, visible, url, dismiss: () => setVisible(false) };
}

interface ShareToastProps {
  visible: boolean;
  url: string;
  onDismiss: () => void;
}

export function ShareToast({ visible, url, onDismiss }: ShareToastProps) {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [visible, onDismiss]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 200,
        background: '#1e1e2e',
        color: '#e2e8f0',
        borderRadius: '10px',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
      }}
    >
      <span style={{ fontFamily: "'Nunito Variable', Nunito, sans-serif", fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
        ¡Enlace copiado!
      </span>
      <input
        readOnly
        value={url}
        aria-label="URL copiada"
        style={{
          fontSize: '0.75rem',
          width: '200px',
          background: '#2d2d44',
          color: '#94a3b8',
          border: '1px solid #3d3d5c',
          borderRadius: '4px',
          padding: '4px 6px',
          fontFamily: "'JetBrains Mono Variable', 'JetBrains Mono', monospace",
        }}
      />
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onDismiss}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#94a3b8',
          cursor: 'pointer',
          minWidth: '44px',
          minHeight: '44px',
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        ✕
      </button>
    </div>
  );
}
