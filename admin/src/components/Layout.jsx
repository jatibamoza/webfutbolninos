import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo.jsx';

const NAV_ITEMS = [
  {
    to: '/',
    label: 'Artículos',
    match: (path) => path === '/' || path.startsWith('/edit/'),
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
  },
  {
    to: '/nuevo',
    label: 'Crear nuevo',
    match: (path) => path.startsWith('/nuevo'),
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
  },
  {
    to: '/social',
    label: 'Social Calendar',
    match: (path) => path.startsWith('/social'),
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
];

const SIDEBAR_WIDTH = 240;

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  const showSidebar = !isMobile || drawerOpen;

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {drawerOpen && isMobile && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(26,31,44,0.4)',
            zIndex: 40,
          }}
          aria-hidden="true"
        />
      )}

      <aside
        style={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          background: 'var(--color-paper)',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          position: isMobile ? 'fixed' : 'sticky',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: 50,
          transform: showSidebar ? 'translateX(0)' : 'translateX(-100%)',
          transition: isMobile ? 'transform 220ms ease' : 'none',
          boxShadow: isMobile && drawerOpen ? '0 8px 32px rgba(26,31,44,0.18)' : 'none',
        }}
        aria-label="Navegación admin"
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
            padding: '20px 18px',
            borderBottom: '1px solid var(--color-border)',
            textAlign: 'left',
          }}
        >
          <Logo />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 17,
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
              ADMIN
            </span>
          </div>
        </button>

        <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_ITEMS.map((item) => {
            const active = item.match(location.pathname);
            return (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '11px 12px',
                  borderRadius: 10,
                  textDecoration: 'none',
                  fontFamily: 'var(--font-body)',
                  fontWeight: active ? 700 : 500,
                  fontSize: 14,
                  color: active ? 'var(--color-foreground)' : 'var(--color-foreground-muted)',
                  background: active ? 'var(--color-surface-alt)' : 'transparent',
                  borderLeft: `3px solid ${active ? 'var(--color-handwritten)' : 'transparent'}`,
                  transition: 'background 120ms',
                }}
              >
                <span style={{ display: 'inline-flex', color: active ? 'var(--color-handwritten)' : 'var(--color-foreground-muted)' }}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div
          style={{
            padding: '14px 18px',
            borderTop: '1px solid var(--color-border)',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--color-foreground-subtle)',
          }}
        >
          <span style={{
            display: 'inline-block',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--color-secondary)',
            marginRight: 8,
            verticalAlign: 'middle',
          }} />
          Solo local · No indexado
        </div>
      </aside>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {isMobile && (
          <header
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              borderBottom: '1px solid var(--color-border)',
              background: 'var(--color-paper)',
              position: 'sticky',
              top: 0,
              zIndex: 30,
            }}
          >
            <button
              className="icon-btn"
              onClick={() => setDrawerOpen(true)}
              aria-label="Abrir menú"
              aria-expanded={drawerOpen}
            >
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 16,
                color: 'var(--color-foreground)',
              }}
            >
              MiniGol{' '}
              <span style={{ color: 'var(--color-handwritten)' }}>Club</span>{' '}
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.14em',
                color: 'var(--color-foreground-subtle)',
                textTransform: 'uppercase',
              }}>
                Admin
              </span>
            </span>
          </header>
        )}

        <main style={{ flex: 1, maxWidth: 1400, margin: '0 auto', padding: '24px 20px 80px', width: '100%' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
