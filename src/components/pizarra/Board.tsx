import { useReducer, useState, useRef, useCallback, useEffect } from 'preact/hooks';
import type { JSX } from 'preact';
import type {
  Board as BoardModel,
  Frame,
  Arrow,
  Note,
  Tool,
  FieldType,
  Skin,
  SelectedItem,
} from './core/types';
import { FIELD_CONFIG, FRAME_MS, emptyFrame, emptyBoard } from './core/types';
import { clamp, defaultControlPoint, uid } from './core/geometry';
import { getPresetById, PRESETS } from './core/presets';
import { FieldLines } from './primitives/Field';
import { Player } from './primitives/Player';
import { FieldObject as FieldObjectPrimitive } from './primitives/FieldObject';
import { Arrow as ArrowPrimitive } from './primitives/Arrow';
import { Note as NotePrimitive } from './primitives/Note';
import { useSvgDrag } from './hooks/useSvgDrag';
import { useUrlHash, readInitialBoardFromHash } from './hooks/useUrlHash';
import { useKeyboardNudge } from './hooks/useKeyboardNudge';
import { usePrefersReducedMotion, useCoarsePointer } from './hooks/usePrefersReducedMotion';
import { Toolbar } from './ui/Toolbar';
import { TopBar } from './ui/TopBar';
import { Timeline } from './ui/Timeline';
import { NoteEditor } from './ui/NoteEditor';
import { ShareToast, useShareToast } from './ui/ShareToast';
import { Watermark } from './ui/Watermark';
import { ExportButton } from './ui/ExportButton';
import { NudgePad } from './ui/NudgePad';

// ── Reducer ────────────────────────────────────────────────────────────────

export type BoardAction =
  | { type: 'LOAD_BOARD'; board: BoardModel }
  | { type: 'SET_FIELD_TYPE'; fieldType: FieldType }
  | { type: 'SET_SKIN'; skin: Skin }
  | { type: 'ADD_FRAME'; afterIdx: number }
  | { type: 'DELETE_FRAME'; idx: number }
  | { type: 'MOVE_PLAYER'; frameIdx: number; id: string; x: number; y: number }
  | { type: 'MOVE_OBJECT'; frameIdx: number; id: string; x: number; y: number }
  | { type: 'MOVE_ARROW_ENDPOINT'; frameIdx: number; id: string; which: 'x1y1' | 'x2y2' | 'cxcy'; x: number; y: number }
  | { type: 'NUDGE_ARROW'; frameIdx: number; id: string; dx: number; dy: number }
  | { type: 'MOVE_NOTE'; frameIdx: number; id: string; x: number; y: number }
  | { type: 'ADD_ARROW'; frameIdx: number; arrow: Arrow }
  | { type: 'ADD_NOTE'; frameIdx: number; note: Note }
  | { type: 'UPDATE_NOTE_TEXT'; frameIdx: number; id: string; text: string }
  | { type: 'DELETE_ITEM'; frameIdx: number; id: string };

function cloneFrame(f: Frame): Frame {
  return {
    players: f.players.map((p) => ({ ...p })),
    objects: f.objects.map((o) => ({ ...o })),
    arrows: f.arrows.map((a) => ({ ...a })),
    notes: f.notes.map((n) => ({ ...n })),
  };
}

function updateFrame(
  board: BoardModel,
  idx: number,
  updater: (f: Frame) => Frame,
): BoardModel {
  if (idx < 0 || idx >= board.frames.length) return board;
  const frames = [...board.frames];
  const frame = frames[idx];
  if (!frame) return board;
  frames[idx] = updater(frame);
  return { ...board, frames };
}

function boardReducer(state: BoardModel, action: BoardAction): BoardModel {
  switch (action.type) {
    case 'LOAD_BOARD':
      return action.board;
    case 'SET_FIELD_TYPE':
      return { ...state, fieldType: action.fieldType };
    case 'SET_SKIN':
      return { ...state, skin: action.skin };
    case 'ADD_FRAME': {
      const frames = [...state.frames];
      const src = frames[action.afterIdx] ?? emptyFrame();
      frames.splice(action.afterIdx + 1, 0, cloneFrame(src));
      return { ...state, frames };
    }
    case 'DELETE_FRAME': {
      if (state.frames.length <= 1) return state;
      return { ...state, frames: state.frames.filter((_, i) => i !== action.idx) };
    }
    case 'MOVE_PLAYER':
      return updateFrame(state, action.frameIdx, (f) => ({
        ...f,
        players: f.players.map((p) =>
          p.id === action.id ? { ...p, x: action.x, y: action.y } : p,
        ),
      }));
    case 'MOVE_OBJECT':
      return updateFrame(state, action.frameIdx, (f) => ({
        ...f,
        objects: f.objects.map((o) =>
          o.id === action.id ? { ...o, x: action.x, y: action.y } : o,
        ),
      }));
    case 'MOVE_ARROW_ENDPOINT':
      return updateFrame(state, action.frameIdx, (f) => ({
        ...f,
        arrows: f.arrows.map((a) => {
          if (a.id !== action.id) return a;
          const { which, x, y } = action;
          if (which === 'x1y1') return { ...a, x1: x, y1: y };
          if (which === 'x2y2') return { ...a, x2: x, y2: y };
          return { ...a, cx: x, cy: y };
        }),
      }));
    case 'NUDGE_ARROW':
      return updateFrame(state, action.frameIdx, (f) => ({
        ...f,
        arrows: f.arrows.map((a) =>
          a.id !== action.id
            ? a
            : {
                ...a,
                x1: clamp(a.x1 + action.dx),
                y1: clamp(a.y1 + action.dy),
                x2: clamp(a.x2 + action.dx),
                y2: clamp(a.y2 + action.dy),
                cx: clamp(a.cx + action.dx),
                cy: clamp(a.cy + action.dy),
              },
        ),
      }));
    case 'MOVE_NOTE':
      return updateFrame(state, action.frameIdx, (f) => ({
        ...f,
        notes: f.notes.map((n) =>
          n.id === action.id ? { ...n, x: action.x, y: action.y } : n,
        ),
      }));
    case 'ADD_ARROW':
      return updateFrame(state, action.frameIdx, (f) => ({
        ...f,
        arrows: [...f.arrows, action.arrow],
      }));
    case 'ADD_NOTE':
      return updateFrame(state, action.frameIdx, (f) => ({
        ...f,
        notes: [...f.notes, action.note],
      }));
    case 'UPDATE_NOTE_TEXT':
      return updateFrame(state, action.frameIdx, (f) => ({
        ...f,
        notes: f.notes.map((n) =>
          n.id === action.id ? { ...n, text: action.text } : n,
        ),
      }));
    case 'DELETE_ITEM':
      return updateFrame(state, action.frameIdx, (f) => ({
        players: f.players.filter((p) => p.id !== action.id),
        objects: f.objects.filter((o) => o.id !== action.id),
        arrows: f.arrows.filter((a) => a.id !== action.id),
        notes: f.notes.filter((n) => n.id !== action.id),
      }));
    default:
      return state;
  }
}

// ── Init ───────────────────────────────────────────────────────────────────

function initBoard(preset?: string): BoardModel {
  const fromHash = readInitialBoardFromHash();
  if (fromHash) return fromHash;
  const found = preset ? getPresetById(preset) : undefined;
  return found?.board ?? PRESETS[0]?.board ?? emptyBoard();
}

// ── Field background colors by skin ───────────────────────────────────────

const BG_BY_SKIN: Record<BoardModel['skin'], string> = {
  chalk: '#1a2e1a',
  paper: '#f5f0e8',
  grass: '#2d5a1b',
};

// ── Public types for sub-panels (Toolbar / TopBar / Timeline) ─────────────

/** Props shape that sub-panels in F2.7/F2.8 will consume. */
export interface BoardPassthrough {
  board: BoardModel;
  frameIdx: number;
  activeTool: Tool;
  selected: SelectedItem;
  playing: boolean;
  reducedMotion: boolean;
  coarsePointer: boolean;
  dispatch: (action: BoardAction) => void;
  setFrameIdx: (idx: number) => void;
  setActiveTool: (t: Tool) => void;
  setSelected: (s: SelectedItem) => void;
  setPlaying: (p: boolean) => void;
}

// ── Component ──────────────────────────────────────────────────────────────

interface BoardProps {
  preset?: string;
  class?: string;
}

export function Board({ preset, class: className }: BoardProps) {
  const [board, dispatch] = useReducer(boardReducer, undefined, () => initBoard(preset));
  const [frameIdx, setFrameIdx] = useState(0);
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [selected, setSelected] = useState<SelectedItem>(null);
  const [playing, setPlaying] = useState(false);
  const [drawPreview, setDrawPreview] = useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } | null>(null);

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  const reducedMotion = usePrefersReducedMotion();
  const coarsePointer = useCoarsePointer();
  const { triggerShare, visible: shareVisible, url: shareUrl, dismiss: dismissShare } = useShareToast();

  const svgRef = useRef<SVGSVGElement | null>(null);
  const startDrag = useSvgDrag(svgRef);

  // Keep frameIdx in bounds when frames are deleted
  useEffect(() => {
    if (frameIdx >= board.frames.length) {
      setFrameIdx(Math.max(0, board.frames.length - 1));
    }
  }, [board.frames.length, frameIdx]);

  // Play loop — functional setState avoids stale closure on frameIdx.
  // reducedMotion: skip rAF, advance synchronously not needed — just stop.
  useEffect(() => {
    if (!playing || reducedMotion || board.frames.length <= 1) return;
    let last = performance.now();
    let raf: number;
    const tick = (now: number) => {
      if (now - last >= FRAME_MS) {
        last = now;
        setFrameIdx((i) => (i + 1) % board.frames.length);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, reducedMotion, board.frames.length]);

  useUrlHash(board, true);

  // Escape deselects; Delete/Backspace removes selected item
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName?.toLowerCase();
      if (
        tag === 'input' ||
        tag === 'textarea' ||
        tag === 'select' ||
        t?.isContentEditable
      )
        return;

      if (e.key === 'Escape') {
        setSelected(null);
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && selected) {
        e.preventDefault();
        dispatch({ type: 'DELETE_ITEM', frameIdx, id: selected.id });
        setSelected(null);
      } else if (e.key === ' ') {
        // Space = play / pause
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.key === '1') {
        setActiveTool('select');
      } else if (e.key === '2') {
        setActiveTool('pass');
      } else if (e.key === '3') {
        setActiveTool('filtro');
      } else if (e.key === '4') {
        setActiveTool('move');
      } else if (e.key === '5') {
        setActiveTool('note');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, frameIdx, setPlaying, setActiveTool]);

  // Keyboard nudge (arrow keys move selected item 1 % / Shift+arrow 5 %)
  const handleNudge = useCallback(
    (sel: NonNullable<SelectedItem>, dx: number, dy: number) => {
      const frame = board.frames[frameIdx];
      if (!frame) return;
      if (sel.type === 'player') {
        const p = frame.players.find((pl) => pl.id === sel.id);
        if (p)
          dispatch({
            type: 'MOVE_PLAYER',
            frameIdx,
            id: sel.id,
            x: clamp(p.x + dx),
            y: clamp(p.y + dy),
          });
      } else if (sel.type === 'object') {
        const o = frame.objects.find((ob) => ob.id === sel.id);
        if (o)
          dispatch({
            type: 'MOVE_OBJECT',
            frameIdx,
            id: sel.id,
            x: clamp(o.x + dx),
            y: clamp(o.y + dy),
          });
      } else if (sel.type === 'note') {
        const n = frame.notes.find((no) => no.id === sel.id);
        if (n)
          dispatch({
            type: 'MOVE_NOTE',
            frameIdx,
            id: sel.id,
            x: clamp(n.x + dx),
            y: clamp(n.y + dy),
          });
      } else if (sel.type === 'arrow') {
        dispatch({ type: 'NUDGE_ARROW', frameIdx, id: sel.id, dx, dy });
      }
    },
    [board.frames, frameIdx],
  );
  useKeyboardNudge(selected, handleNudge);

  const onNudge = useCallback(
    (dx: number, dy: number) => {
      if (selected) handleNudge(selected, dx, dy);
    },
    [selected, handleNudge],
  );

  // Screen → SVG viewBox coordinate transform
  const toLocal = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    return pt.matrixTransform(ctm.inverse());
  }, []);

  // SVG background pointer handler:
  //   select tool → deselect
  //   note tool   → place note at click position
  //   arrow tools → start drawing arrow (onMove/onUp registered on window)
  //
  // Primitives call e.stopPropagation() so this only fires on background taps.
  const onSvgPointerDown = useCallback(
    (e: JSX.TargetedPointerEvent<SVGSVGElement>) => {
      if (activeTool === 'select') {
        setSelected(null);
        return;
      }

      const local = toLocal(e.clientX, e.clientY);
      if (!local) return;

      if (activeTool === 'note') {
        const note: Note = {
          id: uid('n'),
          x: clamp(local.x),
          y: clamp(local.y),
          text: 'nota',
        };
        dispatch({ type: 'ADD_NOTE', frameIdx, note });
        setSelected({ type: 'note', id: note.id });
        return;
      }

      // Pass, filtro, move — draw new arrow
      // activeTool is narrowed to 'pass' | 'filtro' | 'move' here
      const start = { x: clamp(local.x), y: clamp(local.y) };
      const kind = activeTool;

      const onMove = (ev: PointerEvent) => {
        const pt = toLocal(ev.clientX, ev.clientY);
        if (!pt) return;
        setDrawPreview({ x1: start.x, y1: start.y, x2: clamp(pt.x), y2: clamp(pt.y) });
      };
      const onUp = (ev: PointerEvent) => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
        setDrawPreview(null);

        const endPt = toLocal(ev.clientX, ev.clientY);
        if (!endPt) return;
        const x2 = clamp(endPt.x);
        const y2 = clamp(endPt.y);
        if (Math.hypot(x2 - start.x, y2 - start.y) < 3) return; // too short

        const { cx, cy } = defaultControlPoint(start.x, start.y, x2, y2);
        const arrow: Arrow = { id: uid('a'), kind, x1: start.x, y1: start.y, x2, y2, cx, cy };
        dispatch({ type: 'ADD_ARROW', frameIdx, arrow });
        setSelected({ type: 'arrow', id: arrow.id });
      };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    },
    [activeTool, frameIdx, toLocal],
  );

  const currentFrame = board.frames[frameIdx];
  const { ratio } = FIELD_CONFIG[board.fieldType];
  const editingNote = editingNoteId
    ? (currentFrame?.notes.find((n) => n.id === editingNoteId) ?? null)
    : null;

  if (!currentFrame) return null;

  return (
    <div
      class={['pizarra-board', className].filter(Boolean).join(' ')}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <div style={{ display: 'flex', background: 'rgba(0,0,0,0.7)' }}>
        <TopBar board={board} dispatch={dispatch} coarsePointer={coarsePointer} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 8px', flexShrink: 0 }}>
          <button
            type="button"
            aria-label="Compartir pizarra"
            title="Compartir enlace"
            onClick={triggerShare}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              minWidth: '44px', minHeight: '44px', border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '8px', background: 'transparent', color: '#f5f0e8', cursor: 'pointer',
            }}
          >
            <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" width="18" height="18" aria-hidden="true">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>
          <ExportButton svgRef={svgRef} />
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <Toolbar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          selected={selected}
          frameIdx={frameIdx}
          dispatch={dispatch}
        />

        {/* Field canvas */}
        <div
          class="pizarra-field-wrap"
          style={{ flex: 1, position: 'relative', overflow: 'hidden' }}
        >
          <svg
            ref={svgRef}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              width: '100%',
              aspectRatio: String(ratio),
              display: 'block',
              touchAction: 'none',
              userSelect: 'none',
            }}
            aria-label="Pizarra táctica interactiva"
            role="application"
            onPointerDown={onSvgPointerDown}
          >
            {/* Field background (skin color) */}
            <rect x="0" y="0" width="100" height="100" fill={BG_BY_SKIN[board.skin]} />

            <FieldLines type={board.fieldType} />

            {/* Arrows under players so players appear on top */}
            {currentFrame.arrows.map((arrow) => (
              <ArrowPrimitive
                key={arrow.id}
                arrow={arrow}
                selected={selected?.type === 'arrow' && selected.id === arrow.id}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setSelected({ type: 'arrow', id: arrow.id });
                }}
                onPointerDownEndpoint={(e, which) => {
                  e.stopPropagation();
                  setSelected({ type: 'arrow', id: arrow.id });
                  startDrag(
                    e as unknown as JSX.TargetedPointerEvent<SVGElement>,
                    ({ x, y }) =>
                      dispatch({
                        type: 'MOVE_ARROW_ENDPOINT',
                        frameIdx,
                        id: arrow.id,
                        which: which === 1 ? 'x1y1' : 'x2y2',
                        x,
                        y,
                      }),
                  );
                }}
                onPointerDownControl={(e) => {
                  e.stopPropagation();
                  setSelected({ type: 'arrow', id: arrow.id });
                  startDrag(
                    e as unknown as JSX.TargetedPointerEvent<SVGElement>,
                    ({ x, y }) =>
                      dispatch({
                        type: 'MOVE_ARROW_ENDPOINT',
                        frameIdx,
                        id: arrow.id,
                        which: 'cxcy',
                        x,
                        y,
                      }),
                  );
                }}
              />
            ))}

            {currentFrame.players.map((player) => (
              <Player
                key={player.id}
                player={player}
                selected={selected?.type === 'player' && selected.id === player.id}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setSelected({ type: 'player', id: player.id });
                  startDrag(e, ({ x, y }) =>
                    dispatch({ type: 'MOVE_PLAYER', frameIdx, id: player.id, x, y }),
                  );
                }}
              />
            ))}

            {currentFrame.objects.map((obj) => (
              <FieldObjectPrimitive
                key={obj.id}
                object={obj}
                selected={selected?.type === 'object' && selected.id === obj.id}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setSelected({ type: 'object', id: obj.id });
                  startDrag(e, ({ x, y }) =>
                    dispatch({ type: 'MOVE_OBJECT', frameIdx, id: obj.id, x, y }),
                  );
                }}
              />
            ))}

            {currentFrame.notes.map((note) => (
              <NotePrimitive
                key={note.id}
                note={note}
                selected={selected?.type === 'note' && selected.id === note.id}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setSelected({ type: 'note', id: note.id });
                  startDrag(e, ({ x, y }) =>
                    dispatch({ type: 'MOVE_NOTE', frameIdx, id: note.id, x, y }),
                  );
                }}
                onDoubleClick={() => setEditingNoteId(note.id)}
              />
            ))}

            <Watermark skin={board.skin} />

            {/* Live arrow preview while drawing */}
            {drawPreview && (
              <line
                x1={drawPreview.x1}
                y1={drawPreview.y1}
                x2={drawPreview.x2}
                y2={drawPreview.y2}
                stroke="#fbbf24"
                stroke-width="0.4"
                stroke-dasharray="1 1"
                pointer-events="none"
              />
            )}
          </svg>
        </div>

        {coarsePointer && (
          <NudgePad selected={selected} onNudge={onNudge} />
        )}
      </div>

      <Timeline
        board={board}
        frameIdx={frameIdx}
        setFrameIdx={setFrameIdx}
        playing={playing}
        setPlaying={setPlaying}
        reducedMotion={reducedMotion}
        dispatch={dispatch}
      />

      {editingNote && (
        <NoteEditor
          note={editingNote}
          frameIdx={frameIdx}
          dispatch={dispatch}
          onClose={() => setEditingNoteId(null)}
        />
      )}

      <ShareToast visible={shareVisible} url={shareUrl} onDismiss={dismissShare} />
    </div>
  );
}
