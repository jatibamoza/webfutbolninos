import type { JSX } from 'preact';
import type { Note as NoteModel } from '../core/types';

interface NoteProps {
  note: NoteModel;
  selected: boolean;
  onPointerDown: (e: JSX.TargetedPointerEvent<SVGGElement>) => void;
  onDoubleClick?: (note: NoteModel) => void;
}

export function Note({ note, selected, onPointerDown, onDoubleClick }: NoteProps) {
  const w = Math.max(20, note.text.length * 1.6);
  const ariaLabel = `Nota: "${note.text}"${selected ? ', seleccionada' : ''}`;

  return (
    <g
      transform={`translate(${note.x} ${note.y})`}
      onPointerDown={onPointerDown}
      onDblClick={() => onDoubleClick?.(note)}
      style={{ cursor: 'grab', touchAction: 'none' }}
      role="note"
      aria-label={ariaLabel}
    >
      {selected && (
        <rect
          x={-w / 2 - 1}
          y="-3"
          width={w + 2}
          height="5"
          rx="0.6"
          fill="none"
          stroke="#fbbf24"
          stroke-width="0.3"
          stroke-dasharray="0.6 0.6"
        />
      )}
      <text
        text-anchor="middle"
        y="0.5"
        font-family="Caveat Variable, Caveat, cursive"
        font-size="3.2"
        fill="#fbbf24"
        font-weight="600"
      >
        {note.text}
      </text>
    </g>
  );
}
