import type { Board, FieldType } from './types';
import rondo4v1Json from '../../../content/pizarras/rondo-4v1.json';
import conduccionZigzagJson from '../../../content/pizarras/conduccion-zigzag.json';
import paseYVaJson from '../../../content/pizarras/pase-y-va.json';
import tiroPorteriaJson from '../../../content/pizarras/tiro-porteria.json';
import mini3v3Json from '../../../content/pizarras/mini-3v3.json';
import calentamientoJson from '../../../content/pizarras/calentamiento.json';

// IDs hardcodeados (no `uid()`) para que la URL serializada sea estable entre
// recargas y deploys. Si cambia un id, una pizarra compartida puede dejar de
// resolver bien con tween.
//
// `locked: true` marca el preset como PRO. En Fase 2 todos los `locked` son
// false; cuando arranque Fase 3 se pondrán a true los presets premium.

export interface Preset {
  id: string;
  nombre: string;
  edad: string;
  descripcion: string;
  fieldType: FieldType;
  locked: boolean;
  board: Board;
}

export const PRESETS: readonly Preset[] = [
  rondo4v1Json as unknown as Preset,
  conduccionZigzagJson as unknown as Preset,
  paseYVaJson as unknown as Preset,
  tiroPorteriaJson as unknown as Preset,
  mini3v3Json as unknown as Preset,
  calentamientoJson as unknown as Preset,
];

export const getPresetById = (id: string): Preset | undefined =>
  PRESETS.find((p) => p.id === id);
