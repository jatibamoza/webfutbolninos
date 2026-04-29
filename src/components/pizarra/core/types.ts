import { z } from 'zod';

// ---------- Constantes de dominio ----------
export const PLAYER_KINDS = ['player_blue', 'player_red', 'gk'] as const;
export const OBJECT_KINDS = ['ball', 'cone', 'goal'] as const;
export const ARROW_KINDS = ['pass', 'filtro', 'move'] as const;
export const FIELD_TYPES = ['full', 'half', 'mini'] as const;
export const SKINS = ['chalk', 'paper', 'grass'] as const;
export const TOOLS = ['select', 'pass', 'filtro', 'move', 'note'] as const;

// ---------- Tipos derivados ----------
export type PlayerKind = (typeof PLAYER_KINDS)[number];
export type ObjectKind = (typeof OBJECT_KINDS)[number];
export type ArrowKind = (typeof ARROW_KINDS)[number];
export type FieldType = (typeof FIELD_TYPES)[number];
export type Skin = (typeof SKINS)[number];
export type Tool = (typeof TOOLS)[number];

// ---------- Schemas Zod (boundaries y deserialización) ----------
const coord = z.number().min(0).max(100);

export const playerSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(PLAYER_KINDS),
  x: coord,
  y: coord,
  num: z.string().max(3),
});

export const fieldObjectSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(OBJECT_KINDS),
  x: coord,
  y: coord,
});

export const arrowSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(ARROW_KINDS),
  x1: coord,
  y1: coord,
  x2: coord,
  y2: coord,
  cx: coord,
  cy: coord,
});

export const noteSchema = z.object({
  id: z.string().min(1),
  x: coord,
  y: coord,
  text: z.string().max(80),
});

export const frameSchema = z.object({
  players: z.array(playerSchema),
  objects: z.array(fieldObjectSchema),
  arrows: z.array(arrowSchema),
  notes: z.array(noteSchema),
});

export const boardSchema = z.object({
  fieldType: z.enum(FIELD_TYPES),
  skin: z.enum(SKINS),
  frames: z.array(frameSchema).min(1).max(64),
});

// ---------- Tipos inferidos (single source of truth) ----------
export type Player = z.infer<typeof playerSchema>;
export type FieldObject = z.infer<typeof fieldObjectSchema>;
export type Arrow = z.infer<typeof arrowSchema>;
export type Note = z.infer<typeof noteSchema>;
export type Frame = z.infer<typeof frameSchema>;
export type Board = z.infer<typeof boardSchema>;

// ---------- Selección activa en el editor ----------
export type SelectedItem =
  | { type: 'player'; id: string }
  | { type: 'object'; id: string }
  | { type: 'arrow'; id: string }
  | { type: 'note'; id: string }
  | null;

// ---------- Configuración por tipo de campo ----------
// ratio = ancho / alto (corrige el bug del mockup donde ratio estaba invertido).
export interface FieldConfig {
  ratio: number;
  label: string;
}

export const FIELD_CONFIG: Record<FieldType, FieldConfig> = {
  full: { ratio: 105 / 68, label: 'Campo completo' },
  half: { ratio: 68 / 52, label: 'Medio campo' },
  mini: { ratio: 1, label: 'Mini-cancha' },
};

// ---------- Velocidad de playback ----------
export const FRAME_MS = 1500 as const;

// ---------- Vacíos canónicos ----------
export const emptyFrame = (): Frame => ({
  players: [],
  objects: [],
  arrows: [],
  notes: [],
});

export const emptyBoard = (fieldType: FieldType = 'mini', skin: Skin = 'chalk'): Board => ({
  fieldType,
  skin,
  frames: [emptyFrame()],
});
