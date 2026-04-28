import { useNavigate } from 'react-router-dom';
import Logo from './Logo.jsx';

export default function Layout({ children }) {
  const navigate = useNavigate();

  return (
    <>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          borderBottom: '1px solid var(--color-border)',
          background: 'color-mix(in oklab, var(--color-background) 88%, transparent)',
          backdropFilter: 'blur(8px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          gap: 12,
        }}
      >
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <Logo />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 18,
                color: 'var(--color-foreground)',
              }}
            >
              MiniGol{' '}
              <span style={{ color: 'var(--color-handwritten)' }}>Club</span>
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                letterSpacing: '0.18em',
                color: 'var(--color-foreground-subtle)',
                textTransform: 'uppercase',
              }}
            >
              ADMIN · CONTENT MANAGER
            </span>
          </div>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            className="icon-btn"
            title="Nuevo artículo"
            onClick={() => navigate('/nuevo')}
          >
            <svg
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 20px 80px' }}>
        {children}
      </main>
    </>
  );
}
