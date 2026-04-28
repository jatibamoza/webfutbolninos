import type { Tool, SelectedItem } from '../core/types';
import type { BoardAction } from '../Board';

// ── Types ─────────────────────────────────────────────────────────────────

interface ToolbarProps {
  activeTool: Tool;
  setActiveTool: (t: Tool) => void;
  selected: SelectedItem;
  frameIdx: number;
  dispatch: (action: BoardAction) => void;
}

// ── Icon helper ────────────────────────────────────────────────────────────

interface IconProps {
  children: preact.ComponentChildren;
}

function Icon({ children }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      stroke="currentColor"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      style={{ width: '20px', height: '20px', pointerEvents: 'none', flexShrink: 0 }}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// ── Tool config ────────────────────────────────────────────────────────────

interface ToolConfig {
  tool: Tool;
  label: string;
  icon: preact.ComponentChildren;
}

const TOOL_LIST: ToolConfig[] = [
  {
    tool: 'select',
    label: 'Seleccionar elemento',
    icon: (
      <Icon>
        <path d="m4 4 7.07 17 2.51-7.39L21 11.07z" />
      </Icon>
    ),
  },
  {
    tool: 'pass',
    label: 'Dibujar pase',
    icon: (
      <Icon>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </Icon>
    ),
  },
  {
    tool: 'filtro',
    label: 'Dibujar movimiento sin balón (filtro)',
    icon: (
      <Icon>
        <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
        <path d="m18 2 4 4-4 4" />
        <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
        <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />
        <path d="m18 14 4 4-4 4" />
      </Icon>
    ),
  },
  {
    tool: 'move',
    label: 'Dibujar desplazamiento con balón',
    icon: (
      <Icon>
        <polyline points="5 9 2 12 5 15" />
        <polyline points="9 5 12 2 15 5" />
        <polyline points="15 19 12 22 9 19" />
        <polyline points="19 9 22 12 19 15" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <line x1="12" y1="2" x2="12" y2="22" />
      </Icon>
    ),
  },
  {
    tool: 'note',
    label: 'Añadir nota',
    icon: (
      <Icon>
        <path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3z" />
        <polyline points="15 3 15 9 21 9" />
      </Icon>
    ),
  },
];

// ── Styles ─────────────────────────────────────────────────────────────────

const CSS = `
.pizarra-toolbar-inner {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 6px;
  background: rgba(0,0,0,0.72);
  border-radius: 10px;
  align-items: center;
}

@media (max-width: 639px) {
  .pizarra-toolbar-inner {
    flex-direction: row;
    padding: 6px 8px;
    border-radius: 10px;
  }
}

.pizarra-tool-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  border: 2px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: rgba(255,255,255,0.82);
  cursor: pointer;
  transition: background 0.12s, border-color 0.12s, color 0.12s;
  outline-offset: 2px;
}

.pizarra-tool-btn:hover {
  background: rgba(255,255,255,0.12);
}

.pizarra-tool-btn[aria-pressed="true"] {
  background: #fbbf24;
  border-color: #fbbf24;
  color: #000;
}

.pizarra-tool-btn:focus-visible {
  outline: 3px solid #fbbf24;
}

.pizarra-tool-divider {
  width: 28px;
  height: 1px;
  background: rgba(255,255,255,0.2);
  margin: 2px 0;
  flex-shrink: 0;
}

@media (max-width: 639px) {
  .pizarra-tool-divider {
    width: 1px;
    height: 28px;
    margin: 0 2px;
  }
}

.pizarra-delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  border: 2px solid #ef4444;
  border-radius: 8px;
  background: transparent;
  color: #ef4444;
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
  outline-offset: 2px;
}

.pizarra-delete-btn:hover {
  background: #ef4444;
  color: #fff;
}

.pizarra-delete-btn:focus-visible {
  outline: 3px solid #ef4444;
}
`;

// ── Component ──────────────────────────────────────────────────────────────

export function Toolbar({ activeTool, setActiveTool, selected, frameIdx, dispatch }: ToolbarProps) {
  const handleDelete = () => {
    if (!selected) return;
    dispatch({ type: 'DELETE_ITEM', frameIdx, id: selected.id });
  };

  return (
    <>
      <style>{CSS}</style>
      <div class="pizarra-toolbar-inner" role="toolbar" aria-label="Herramientas de la pizarra">
        {TOOL_LIST.map(({ tool, label, icon }) => (
          <button
            key={tool}
            type="button"
            class="pizarra-tool-btn"
            aria-label={label}
            aria-pressed={activeTool === tool}
            onClick={() => setActiveTool(tool)}
          >
            {icon}
          </button>
        ))}

        {selected !== null && (
          <>
            <div class="pizarra-tool-divider" role="separator" />
            <button
              type="button"
              class="pizarra-delete-btn"
              aria-label="Eliminar elemento seleccionado"
              onClick={handleDelete}
            >
              <Icon>
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </Icon>
            </button>
          </>
        )}
      </div>
    </>
  );
}
