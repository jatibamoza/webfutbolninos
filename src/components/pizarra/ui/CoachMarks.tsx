import { useState, useEffect } from 'preact/hooks';
import type { JSX } from 'preact';

interface CoachMarksProps {
  onDone: () => void;
}

const STEPS = [
  {
    selector: '[data-coach="preset"]',
    title: 'Elige un preset',
    desc: 'Selecciona un ejercicio predefinido. Los jugadores aparecen automáticamente en el campo.',
  },
  {
    selector: '.pizarra-toolbar-inner',
    title: 'Herramientas de dibujo',
    desc: 'Usa estas herramientas para seleccionar, dibujar pases (→), movimientos sin balón o añadir notas de texto.',
  },
  {
    selector: '[data-coach="add-frame"]',
    title: 'Añade frames',
    desc: 'Crea frames para animar la jugada paso a paso. Pulsa ▶ para ver la animación completa.',
  },
  {
    selector: '[data-coach="share"]',
    title: 'Comparte tu trabajo',
    desc: 'Copia el enlace para compartir con otros padres o el entrenador, o exporta la pizarra como PNG.',
  },
];

export function CoachMarks({ onDone }: CoachMarksProps): JSX.Element | null {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const s = STEPS[step];
    if (!s) return;
    const el = document.querySelector(s.selector);
    setRect(el ? el.getBoundingClientRect() : null);
  }, [step]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDone();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onDone]);

  const current = STEPS[step];
  if (!rect || !current) return null;

  const isLast = step === STEPS.length - 1;

  function next() {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onDone();
    }
  }

  const spotlightStyle: JSX.CSSProperties = {
    position: 'absolute',
    top: rect.top - 8,
    left: rect.left - 8,
    width: rect.width + 16,
    height: rect.height + 16,
    borderRadius: 10,
    boxShadow: '0 0 0 9999px rgba(0,0,0,0.65)',
    border: '2px solid #fbbf24',
    transition: 'top 0.2s ease, left 0.2s ease, width 0.2s ease, height 0.2s ease',
  };

  const overlayStyle: JSX.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 490,
    pointerEvents: 'none',
  };

  const panelStyle: JSX.CSSProperties = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 500,
    background: '#1e1e2e',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    padding: '14px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    fontFamily: "'Nunito Variable', Nunito, sans-serif",
  };

  const stepCountStyle: JSX.CSSProperties = {
    fontSize: '0.75rem',
    color: '#64748b',
    whiteSpace: 'nowrap',
    minWidth: 36,
  };

  const textBlockStyle: JSX.CSSProperties = {
    flex: 1,
  };

  const titleStyle: JSX.CSSProperties = {
    fontSize: '0.9rem',
    color: '#f5f0e8',
  };

  const descStyle: JSX.CSSProperties = {
    fontSize: '0.8rem',
    color: '#94a3b8',
    margin: 0,
  };

  const skipBtnStyle: JSX.CSSProperties = {
    background: 'transparent',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    fontSize: '0.8rem',
    minHeight: 44,
    padding: '0 8px',
    whiteSpace: 'nowrap',
  };

  const nextBtnStyle: JSX.CSSProperties = {
    background: '#fbbf24',
    color: '#000',
    border: 'none',
    borderRadius: 8,
    padding: '8px 16px',
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: '0.875rem',
    minHeight: 44,
    whiteSpace: 'nowrap',
  };

  return (
    <>
      <div style={overlayStyle}>
        <div style={spotlightStyle} />
      </div>
      <div style={panelStyle} onClick={(e) => e.stopPropagation()}>
        <span style={stepCountStyle}>{step + 1} / {STEPS.length}</span>
        <div style={textBlockStyle}>
          <strong style={titleStyle}>{current.title}</strong>
          <p style={descStyle}>{current.desc}</p>
        </div>
        <button style={skipBtnStyle} onClick={onDone}>Saltar</button>
        <button style={nextBtnStyle} onClick={next}>{isLast ? '¡Listo!' : 'Siguiente →'}</button>
      </div>
    </>
  );
}
