import type { JSX } from 'preact';
import type { Board } from '../core/types';
import type { BoardAction } from '../Board';

// ── Icons ──────────────────────────────────────────────────────────────────

function IconPlay(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" width="20" height="20" aria-hidden="true">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function IconPause(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" width="20" height="20" aria-hidden="true">
      <line x1="6" y1="4" x2="6" y2="20" />
      <line x1="18" y1="4" x2="18" y2="20" />
    </svg>
  );
}

function IconPlus(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" width="20" height="20" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function IconTrash(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" width="20" height="20" aria-hidden="true">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

// ── Shared button styles ───────────────────────────────────────────────────

const BTN_BASE: JSX.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '44px',
  minHeight: '44px',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.25)',
  background: 'transparent',
  color: '#f5f0e8',
  cursor: 'pointer',
  padding: '0 8px',
};

const BTN_PLAY: JSX.CSSProperties = {
  ...BTN_BASE,
  minWidth: '52px',
  minHeight: '52px',
  border: '2px solid #fbbf24',
};

const BTN_DELETE: JSX.CSSProperties = {
  ...BTN_BASE,
  color: '#ef4444',
  borderColor: '#ef4444',
};

const FOCUS_STYLE = `
  .tl-btn:focus-visible {
    outline: 3px solid #fbbf24;
    outline-offset: 2px;
  }
`;

// ── Component ──────────────────────────────────────────────────────────────

export interface TimelineProps {
  board: Board;
  frameIdx: number;
  setFrameIdx: (i: number) => void;
  playing: boolean;
  setPlaying: (p: boolean) => void;
  reducedMotion: boolean;
  dispatch: (a: BoardAction) => void;
}

export function Timeline({
  board,
  frameIdx,
  setFrameIdx,
  playing,
  setPlaying,
  reducedMotion,
  dispatch,
}: TimelineProps): JSX.Element {
  const totalFrames = board.frames.length;

  const playLabel = playing ? 'Pausar animación' : 'Reproducir animación';

  const playBtnStyle: JSX.CSSProperties = reducedMotion
    ? { ...BTN_PLAY, opacity: 0.4, cursor: 'not-allowed' }
    : BTN_PLAY;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        background: 'rgba(0,0,0,0.7)',
        color: '#f5f0e8',
        flexWrap: 'nowrap',
      }}
      role="toolbar"
      aria-label="Controles de frames"
    >
      {/* Inject focus-visible styles once */}
      <style>{FOCUS_STYLE}</style>

      {/* Play / Pause */}
      <button
        class="tl-btn"
        style={playBtnStyle}
        aria-label={playLabel}
        title={reducedMotion ? 'Sin animación (prefers-reduced-motion)' : playLabel}
        disabled={reducedMotion}
        onClick={() => setPlaying(!playing)}
      >
        {playing ? <IconPause /> : <IconPlay />}
      </button>

      {/* Frame dots */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}
        role="group"
        aria-label="Frames"
      >
        {board.frames.map((_frame, i) => (
          <button
            key={i}
            class="tl-btn"
            style={{
              minWidth: '44px',
              minHeight: '44px',
              borderRadius: '50%',
              width: '16px',
              height: '16px',
              padding: '14px',
              border: '1px solid rgba(255,255,255,0.4)',
              background: frameIdx === i ? '#fbbf24' : 'rgba(255,255,255,0.15)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: frameIdx === i ? '#1a1a1a' : '#f5f0e8',
              transition: 'background 0.15s',
              boxSizing: 'border-box' as const,
            }}
            aria-label={`Frame ${i + 1}`}
            aria-pressed={frameIdx === i}
            onClick={() => setFrameIdx(i)}
          />
        ))}
      </div>

      {/* Counter */}
      <span
        style={{
          fontSize: '0.875rem',
          whiteSpace: 'nowrap',
          padding: '0 4px',
          color: '#f5f0e8',
        }}
        aria-hidden="true"
      >
        Frame {frameIdx + 1} / {totalFrames}
      </span>

      {/* Add frame */}
      <button
        class="tl-btn"
        style={BTN_BASE}
        aria-label="Añadir frame después del actual"
        onClick={() => dispatch({ type: 'ADD_FRAME', afterIdx: frameIdx })}
      >
        <IconPlus />
      </button>

      {/* Delete frame — only when more than one frame exists */}
      {totalFrames > 1 && (
        <button
          class="tl-btn"
          style={BTN_DELETE}
          aria-label="Eliminar frame actual"
          onClick={() => dispatch({ type: 'DELETE_FRAME', idx: frameIdx })}
        >
          <IconTrash />
        </button>
      )}

      {/* Live region for screen readers */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{ position: 'absolute', left: '-9999px' }}
      >
        Frame {frameIdx + 1} de {totalFrames}
      </div>
    </div>
  );
}
