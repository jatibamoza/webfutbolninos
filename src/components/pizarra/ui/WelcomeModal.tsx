import { useEffect, useRef } from 'preact/hooks';
import type { JSX } from 'preact';

interface WelcomeModalProps {
  onStart: () => void;
  onSkip: () => void;
}

const FEATURES: {
  title: string;
  desc: string;
  icon: JSX.Element;
}[] = [
  {
    title: 'Elige un ejercicio',
    desc: 'Selecciona un preset o empieza el campo vacío.',
    icon: (
      <svg
        width={20}
        height={20}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        style={{ color: '#fbbf24', flexShrink: 0, marginTop: '1px' }}
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    title: 'Mueve los jugadores',
    desc: 'Arrastra jugadores y objetos a cualquier posición.',
    icon: (
      <svg
        width={20}
        height={20}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        style={{ color: '#fbbf24', flexShrink: 0, marginTop: '1px' }}
      >
        <path d="m4 4 7.07 17 2.51-7.39L21 11.07z" />
      </svg>
    ),
  },
  {
    title: 'Dibuja jugadas',
    desc: 'Pases, desplazamientos y notas sobre el campo.',
    icon: (
      <svg
        width={20}
        height={20}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        style={{ color: '#fbbf24', flexShrink: 0, marginTop: '1px' }}
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    ),
  },
  {
    title: 'Anima frames',
    desc: 'Añade frames y pulsa Play para ver la jugada.',
    icon: (
      <svg
        width={20}
        height={20}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        style={{ color: '#fbbf24', flexShrink: 0, marginTop: '1px' }}
      >
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
  },
];

const overlayStyle: JSX.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 400,
  background: 'rgba(0,0,0,0.72)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const cardStyle: JSX.CSSProperties = {
  maxWidth: '480px',
  width: '100%',
  background: '#1e1e2e',
  borderRadius: '16px',
  padding: '28px 24px',
  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
};

const titleStyle: JSX.CSSProperties = {
  fontFamily: "'Fredoka Variable', Fredoka, sans-serif",
  fontSize: '1.5rem',
  color: '#f5f0e8',
  marginBottom: '4px',
  marginTop: 0,
};

const subtitleStyle: JSX.CSSProperties = {
  fontSize: '0.875rem',
  color: '#94a3b8',
  marginBottom: '20px',
  marginTop: 0,
};

const gridStyle: JSX.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '10px',
  marginBottom: '24px',
};

const featureStyle: JSX.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  borderRadius: '10px',
  padding: '12px',
  display: 'flex',
  gap: '10px',
  alignItems: 'flex-start',
};

const featureTitleStyle: JSX.CSSProperties = {
  fontWeight: 700,
  fontSize: '0.875rem',
  color: '#f5f0e8',
  marginBottom: '2px',
};

const featureDescStyle: JSX.CSSProperties = {
  fontSize: '0.8rem',
  color: '#94a3b8',
  lineHeight: 1.4,
};

const btnPrimaryStyle: JSX.CSSProperties = {
  background: '#fbbf24',
  color: '#000',
  border: 'none',
  borderRadius: '8px',
  padding: '12px 24px',
  fontSize: '1rem',
  fontWeight: 700,
  cursor: 'pointer',
  width: '100%',
  fontFamily: "'Fredoka Variable', Fredoka, sans-serif",
  minHeight: '44px',
};

const btnSkipStyle: JSX.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: '#94a3b8',
  cursor: 'pointer',
  fontSize: '0.8rem',
  width: '100%',
  marginTop: '8px',
  minHeight: '44px',
};

export function WelcomeModal({ onStart, onSkip }: WelcomeModalProps) {
  const startBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    startBtnRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onSkip();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onSkip]);

  return (
    <div style={overlayStyle}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        style={cardStyle}
      >
        <h2 id="welcome-title" style={titleStyle}>
          Pizarra Táctica
        </h2>
        <p style={subtitleStyle}>
          Diseña ejercicios de fútbol en segundos. Sin registro, gratis.
        </p>

        <div style={gridStyle}>
          {FEATURES.map(({ title, desc, icon }) => (
            <div key={title} style={featureStyle}>
              {icon}
              <div>
                <div style={featureTitleStyle}>{title}</div>
                <div style={featureDescStyle}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        <button ref={startBtnRef} onClick={onStart} style={btnPrimaryStyle}>
          ¡Empezar! →
        </button>
        <button onClick={onSkip} style={btnSkipStyle}>
          Saltar introducción
        </button>
      </div>
    </div>
  );
}
