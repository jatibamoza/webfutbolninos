import type { Board, FieldType, Skin } from '../core/types';
import { FIELD_TYPES, FIELD_CONFIG, SKINS } from '../core/types';
import { PRESETS } from '../core/presets';
import type { BoardAction } from '../Board';

interface TopBarProps {
  board: Board;
  dispatch: (action: BoardAction) => void;
  coarsePointer: boolean;
  compact?: boolean;
}

const SKIN_LABELS: Record<Skin, string> = {
  chalk: 'Tiza',
  paper: 'Papel',
  grass: 'Hierba (PRO)',
};

const optionStyle: preact.JSX.CSSProperties = {
  background: '#2d2d44',
  color: '#f5f0e8',
};

export function TopBar({ board, dispatch, compact }: TopBarProps) {
  const selStyle: preact.JSX.CSSProperties = {
    background: '#2d2d44',
    color: '#f5f0e8',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '6px',
    padding: '0 8px',
    height: compact ? '36px' : '44px',
    minHeight: compact ? '36px' : '44px',
    cursor: 'pointer',
    ...(compact ? { flex: 1, minWidth: 0 } : {}),
  };

  const handlePresetChange = (e: Event) => {
    const id = (e.target as HTMLSelectElement).value;
    const preset = PRESETS.find((p) => p.id === id);
    if (preset) dispatch({ type: 'LOAD_BOARD', board: preset.board });
  };

  const handleFieldTypeChange = (e: Event) => {
    const value = (e.target as HTMLSelectElement).value as FieldType;
    dispatch({ type: 'SET_FIELD_TYPE', fieldType: value });
  };

  const handleSkinChange = (e: Event) => {
    const value = (e.target as HTMLSelectElement).value as Skin;
    if (value === 'grass') return;
    dispatch({ type: 'SET_SKIN', skin: value });
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: compact ? '6px' : '12px',
        padding: compact ? '4px 8px' : '8px 12px',
        background: 'rgba(0,0,0,0.7)',
        color: '#f5f0e8',
        ...(compact ? {} : { flex: 1, minWidth: 0 }),
      }}
    >
      {!compact && (
        <span
          style={{
            fontFamily: "'Fredoka Variable', Fredoka, sans-serif",
            fontSize: '1.1rem',
            fontWeight: 600,
            marginRight: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          Pizarra Táctica
        </span>
      )}

      <select
        aria-label="Cargar preset"
        data-coach="preset"
        style={selStyle}
        defaultValue={PRESETS[0]!.id}
        onChange={handlePresetChange}
      >
        {PRESETS.map((preset) => (
          <option key={preset.id} value={preset.id} style={optionStyle}>
            {preset.nombre}
          </option>
        ))}
      </select>

      <select
        aria-label="Tipo de campo"
        style={selStyle}
        value={board.fieldType}
        onChange={handleFieldTypeChange}
      >
        {FIELD_TYPES.map((ft) => (
          <option key={ft} value={ft} style={optionStyle}>
            {FIELD_CONFIG[ft].label}
          </option>
        ))}
      </select>

      <select
        aria-label="Estilo visual"
        style={selStyle}
        value={board.skin}
        onChange={handleSkinChange}
      >
        {SKINS.map((skin) => (
          <option key={skin} value={skin} disabled={skin === 'grass'} style={optionStyle}>
            {SKIN_LABELS[skin]}
          </option>
        ))}
      </select>
    </div>
  );
}
