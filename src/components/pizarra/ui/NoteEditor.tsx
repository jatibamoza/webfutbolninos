import { useEffect, useRef } from 'preact/hooks';
import type { Note } from '../core/types';
import type { BoardAction } from '../Board';

interface NoteEditorProps {
  note: Note;
  frameIdx: number;
  dispatch: (a: BoardAction) => void;
  onClose: () => void;
}

export function NoteEditor({ note, frameIdx, dispatch, onClose }: NoteEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Editar nota"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#f5f0e8',
          borderRadius: '12px',
          padding: '20px',
          minWidth: '280px',
          maxWidth: '400px',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          aria-label="Cerrar editor de nota"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            minWidth: '44px',
            minHeight: '44px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#555',
          }}
        >
          ✕
        </button>

        <p
          style={{
            fontFamily: "'Fredoka Variable', Fredoka, sans-serif",
            fontSize: '1rem',
            color: '#555',
            marginBottom: '8px',
            marginTop: 0,
          }}
        >
          Editar nota
        </p>

        <textarea
          ref={textareaRef}
          value={note.text}
          maxLength={80}
          rows={3}
          aria-label="Texto de la nota"
          style={{
            width: '100%',
            fontFamily: "'Caveat Variable', Caveat, cursive",
            fontSize: '1.1rem',
            boxSizing: 'border-box',
            border: '1px solid #ccc',
            borderRadius: '6px',
            padding: '8px',
            resize: 'vertical',
            background: '#fffdf7',
          }}
          onChange={(e) =>
            dispatch({
              type: 'UPDATE_NOTE_TEXT',
              frameIdx,
              id: note.id,
              text: e.currentTarget.value,
            })
          }
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '8px',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 20px',
              minHeight: '44px',
              fontSize: '0.95rem',
              cursor: 'pointer',
              fontFamily: "'Fredoka Variable', Fredoka, sans-serif",
            }}
          >
            Listo
          </button>
          <small style={{ color: '#888' }}>
            {note.text.length} / 80
          </small>
        </div>
      </div>
    </div>
  );
}
