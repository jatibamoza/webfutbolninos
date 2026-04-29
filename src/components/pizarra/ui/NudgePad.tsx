import type { SelectedItem } from '../core/types';

interface NudgePadProps {
  selected: SelectedItem;
  onNudge: (dx: number, dy: number) => void;
}

interface NudgeButton {
  label: string;
  dx: number;
  dy: number;
  gridColumn: number;
  gridRow: number;
  icon: preact.ComponentChildren;
}

const BUTTONS: NudgeButton[] = [
  {
    label: 'Mover arriba',
    dx: 0,
    dy: -1,
    gridColumn: 2,
    gridRow: 1,
    icon: <polyline points="18 15 12 9 6 15" />,
  },
  {
    label: 'Mover izquierda',
    dx: -1,
    dy: 0,
    gridColumn: 1,
    gridRow: 2,
    icon: <polyline points="15 18 9 12 15 6" />,
  },
  {
    label: 'Mover derecha',
    dx: 1,
    dy: 0,
    gridColumn: 3,
    gridRow: 2,
    icon: <polyline points="9 18 15 12 9 6" />,
  },
  {
    label: 'Mover abajo',
    dx: 0,
    dy: 1,
    gridColumn: 2,
    gridRow: 3,
    icon: <polyline points="6 9 12 15 18 9" />,
  },
];

export function NudgePad({ selected, onNudge }: NudgePadProps) {
  const isDisabled = selected === null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px',
        background: 'rgba(0,0,0,0.4)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 44px)',
          gridTemplateRows: 'repeat(3, 44px)',
          gap: '4px',
        }}
        role="group"
        aria-label="Desplazar elemento seleccionado"
      >
        {BUTTONS.map(({ label, dx, dy, gridColumn, gridRow, icon }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            disabled={isDisabled}
            onClick={() => onNudge(dx, dy)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              background: 'rgba(0,0,0,0.6)',
              color: '#f5f0e8',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              opacity: isDisabled ? 0.35 : 1,
              gridColumn,
              gridRow,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              style={{ width: '20px', height: '20px', pointerEvents: 'none' }}
              aria-hidden="true"
            >
              {icon}
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
