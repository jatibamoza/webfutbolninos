import type { Board, FieldType, Skin } from '../core/types';
import { FIELD_TYPES, FIELD_CONFIG, SKINS } from '../core/types';
import { PRESETS } from '../core/presets';
import type { BoardAction } from '../Board';

interface TopBarProps {
  board: Board;
  dispatch: (action: BoardAction) => void;
  coarsePointer: boolean;
}

const selectStyle: preact.JSX.CSSProperties = {
  background: 'rgba(255,255,255,0.15)',
  color: 'inherit',
  border: '1px solid rgba(255,255,255,0.3)',
  borderRadius: '6px',
  padding: '0 8px',
  height: '44px',
  minHeight: '44px',
  cursor: 'pointer',
};

const SKIN_LABELS: Record<Skin, string> = {
  chalk: 'Tiza',
  paper: 'Papel',
  grass: 'Hierba (PRO)',
};

export function TopBar({ board, dispatch }: TopBarProps) {
  const handlePresetChange = (e: Event) => {
    const id = (e.target as HTMLSelectElement).value;
    const preset = PRESETS.find((p) => p.id === id);
    if (preset) {
      dispatch({ type: 'LOAD_BOARD', board: preset.board });
    }
  };

  const handleFieldTypeChange = (e: Event) => {
    const value = (e.target as HTMLSelectElement).value as FieldType;
    dispatch({ type: 'SET_FIELD_TYPE', fieldType: value });
  };

  const handleSkinChange = (e: Event) => {
    const value = (e.target as HTMLSelectElement).value as Skin;
    // grass is PRO — ignore if somehow selected
    if (value === 'grass') return;
    dispatch({ type: 'SET_SKIN', skin: value });
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px 12px',
        background: 'rgba(0,0,0,0.7)',
        color: '#f5f0e8',
      }}
    >
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

      <select
        aria-label="Cargar preset"
        style={selectStyle}
        defaultValue={PRESETS[0]!.id}
        onChange={handlePresetChange}
      >
        {PRESETS.map((preset) => (
          <option key={preset.id} value={preset.id}>
            {preset.nombre}
          </option>
        ))}
      </select>

      <select
        aria-label="Tipo de campo"
        style={selectStyle}
        value={board.fieldType}
        onChange={handleFieldTypeChange}
      >
        {FIELD_TYPES.map((ft) => (
          <option key={ft} value={ft}>
            {FIELD_CONFIG[ft].label}
          </option>
        ))}
      </select>

      <select
        aria-label="Estilo visual"
        style={selectStyle}
        value={board.skin}
        onChange={handleSkinChange}
      >
        {SKINS.map((skin) => (
          <option key={skin} value={skin} disabled={skin === 'grass'}>
            {SKIN_LABELS[skin]}
          </option>
        ))}
      </select>
    </div>
  );
}
