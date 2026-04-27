import type { Board, FieldType } from './types';

// Presets editoriales de la Pizarra Táctica.
//
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
  {
    id: 'rondo-4v1',
    nombre: 'Rondo 4v1',
    edad: '7-12',
    descripcion: 'Cuatro pasan, uno persigue. Si te lo quitan, te toca a ti.',
    fieldType: 'mini',
    locked: false,
    board: {
      fieldType: 'mini',
      skin: 'chalk',
      frames: [
        {
          players: [
            { id: 'rondo:p1', kind: 'player_blue', x: 25, y: 25, num: '1' },
            { id: 'rondo:p2', kind: 'player_blue', x: 75, y: 25, num: '2' },
            { id: 'rondo:p3', kind: 'player_blue', x: 75, y: 75, num: '3' },
            { id: 'rondo:p4', kind: 'player_blue', x: 25, y: 75, num: '4' },
            { id: 'rondo:px', kind: 'player_red', x: 50, y: 50, num: 'X' },
          ],
          objects: [{ id: 'rondo:ball', kind: 'ball', x: 25, y: 25 }],
          arrows: [
            { id: 'rondo:arrow1', kind: 'pass', x1: 28, y1: 25, x2: 72, y2: 25, cx: 50, cy: 22 },
          ],
          notes: [{ id: 'rondo:note1', x: 50, y: 92, text: '4 pases seguidos = punto' }],
        },
        {
          players: [
            { id: 'rondo:p1', kind: 'player_blue', x: 25, y: 25, num: '1' },
            { id: 'rondo:p2', kind: 'player_blue', x: 75, y: 25, num: '2' },
            { id: 'rondo:p3', kind: 'player_blue', x: 75, y: 75, num: '3' },
            { id: 'rondo:p4', kind: 'player_blue', x: 25, y: 75, num: '4' },
            { id: 'rondo:px', kind: 'player_red', x: 60, y: 35, num: 'X' },
          ],
          objects: [{ id: 'rondo:ball', kind: 'ball', x: 75, y: 25 }],
          arrows: [
            { id: 'rondo:arrow2', kind: 'pass', x1: 75, y1: 28, x2: 75, y2: 72, cx: 78, cy: 50 },
          ],
          notes: [{ id: 'rondo:note2', x: 50, y: 92, text: 'el rojo persigue, los azules giran' }],
        },
      ],
    },
  },
  {
    id: 'conduccion-zigzag',
    nombre: 'Conducción zigzag',
    edad: '4-8',
    descripcion: 'Cinco conos, suela izquierda y derecha. Al final, tiro.',
    fieldType: 'half',
    locked: false,
    board: {
      fieldType: 'half',
      skin: 'chalk',
      frames: [
        {
          players: [{ id: 'zig:p1', kind: 'player_blue', x: 15, y: 80, num: '1' }],
          objects: [
            { id: 'zig:ball', kind: 'ball', x: 15, y: 80 },
            { id: 'zig:c1', kind: 'cone', x: 30, y: 65 },
            { id: 'zig:c2', kind: 'cone', x: 45, y: 55 },
            { id: 'zig:c3', kind: 'cone', x: 60, y: 45 },
            { id: 'zig:c4', kind: 'cone', x: 75, y: 35 },
            { id: 'zig:goal', kind: 'goal', x: 50, y: 8 },
          ],
          arrows: [
            { id: 'zig:arrow', kind: 'move', x1: 15, y1: 80, x2: 50, y2: 20, cx: 60, cy: 50 },
          ],
          notes: [{ id: 'zig:note', x: 80, y: 75, text: 'suela ↔ suela' }],
        },
      ],
    },
  },
  {
    id: 'pase-y-va',
    nombre: 'Pase y va',
    edad: '6-10',
    descripcion: 'Pasas, corres a la otra cono. El compañero te devuelve.',
    fieldType: 'half',
    locked: false,
    board: {
      fieldType: 'half',
      skin: 'chalk',
      frames: [
        {
          players: [
            { id: 'pyv:p1', kind: 'player_blue', x: 30, y: 70, num: '1' },
            { id: 'pyv:p2', kind: 'player_blue', x: 70, y: 70, num: '2' },
          ],
          objects: [
            { id: 'pyv:ball', kind: 'ball', x: 30, y: 70 },
            { id: 'pyv:c1', kind: 'cone', x: 30, y: 30 },
            { id: 'pyv:c2', kind: 'cone', x: 70, y: 30 },
          ],
          arrows: [
            { id: 'pyv:pass1', kind: 'pass', x1: 32, y1: 70, x2: 68, y2: 70, cx: 50, cy: 67 },
            { id: 'pyv:move1', kind: 'move', x1: 30, y1: 70, x2: 30, y2: 32, cx: 22, cy: 50 },
          ],
          notes: [{ id: 'pyv:note1', x: 50, y: 92, text: 'pasa y corre. siempre.' }],
        },
        {
          players: [
            { id: 'pyv:p1', kind: 'player_blue', x: 30, y: 30, num: '1' },
            { id: 'pyv:p2', kind: 'player_blue', x: 70, y: 70, num: '2' },
          ],
          objects: [
            { id: 'pyv:ball', kind: 'ball', x: 70, y: 70 },
            { id: 'pyv:c1', kind: 'cone', x: 30, y: 30 },
            { id: 'pyv:c2', kind: 'cone', x: 70, y: 30 },
          ],
          arrows: [
            { id: 'pyv:pass2', kind: 'pass', x1: 68, y1: 70, x2: 32, y2: 30, cx: 50, cy: 42 },
          ],
          notes: [{ id: 'pyv:note2', x: 50, y: 92, text: 'devolución al espacio' }],
        },
      ],
    },
  },
  {
    id: 'tiro-porteria',
    nombre: 'Tiro a portería',
    edad: '7-12',
    descripcion: 'Cuatro atacantes, un portero. Cada uno chuta una vez.',
    fieldType: 'half',
    locked: false,
    board: {
      fieldType: 'half',
      skin: 'chalk',
      frames: [
        {
          players: [
            { id: 'tir:p1', kind: 'player_blue', x: 30, y: 70, num: '1' },
            { id: 'tir:p2', kind: 'player_blue', x: 45, y: 75, num: '2' },
            { id: 'tir:p3', kind: 'player_blue', x: 60, y: 75, num: '3' },
            { id: 'tir:p4', kind: 'player_blue', x: 75, y: 70, num: '4' },
            { id: 'tir:gk', kind: 'gk', x: 50, y: 12, num: 'P' },
          ],
          objects: [
            { id: 'tir:ball', kind: 'ball', x: 30, y: 70 },
            { id: 'tir:goal', kind: 'goal', x: 50, y: 8 },
            { id: 'tir:c1', kind: 'cone', x: 35, y: 55 },
            { id: 'tir:c2', kind: 'cone', x: 65, y: 55 },
          ],
          arrows: [
            { id: 'tir:move', kind: 'move', x1: 30, y1: 70, x2: 40, y2: 35, cx: 30, cy: 50 },
            { id: 'tir:shot', kind: 'pass', x1: 40, y1: 35, x2: 50, y2: 14, cx: 45, cy: 22 },
          ],
          notes: [{ id: 'tir:note', x: 80, y: 80, text: 'conduce → tira' }],
        },
      ],
    },
  },
  {
    id: 'mini-3v3',
    nombre: 'Mini partido 3v3',
    edad: '6-12',
    descripcion: 'Tres contra tres, sin porteros. Gol vale doble si toca tres.',
    fieldType: 'mini',
    locked: false,
    board: {
      fieldType: 'mini',
      skin: 'chalk',
      frames: [
        {
          players: [
            { id: '3v3:b1', kind: 'player_blue', x: 25, y: 35, num: '1' },
            { id: '3v3:b2', kind: 'player_blue', x: 25, y: 65, num: '2' },
            { id: '3v3:b3', kind: 'player_blue', x: 40, y: 50, num: '3' },
            { id: '3v3:r1', kind: 'player_red', x: 60, y: 50, num: '1' },
            { id: '3v3:r2', kind: 'player_red', x: 75, y: 35, num: '2' },
            { id: '3v3:r3', kind: 'player_red', x: 75, y: 65, num: '3' },
          ],
          objects: [
            { id: '3v3:ball', kind: 'ball', x: 50, y: 50 },
            { id: '3v3:g1', kind: 'goal', x: 8, y: 50 },
            { id: '3v3:g2', kind: 'goal', x: 92, y: 50 },
          ],
          arrows: [],
          notes: [{ id: '3v3:note', x: 50, y: 92, text: '3 toques = gol doble' }],
        },
      ],
    },
  },
  {
    id: 'calentamiento',
    nombre: 'Calentamiento sin balón',
    edad: '4-12',
    descripcion: 'Cuatro estaciones. 30 segundos cada una. Sin parar.',
    fieldType: 'half',
    locked: false,
    board: {
      fieldType: 'half',
      skin: 'chalk',
      frames: [
        {
          players: [
            { id: 'cal:p1', kind: 'player_blue', x: 25, y: 25, num: '1' },
            { id: 'cal:p2', kind: 'player_blue', x: 75, y: 25, num: '2' },
            { id: 'cal:p3', kind: 'player_blue', x: 75, y: 75, num: '3' },
            { id: 'cal:p4', kind: 'player_blue', x: 25, y: 75, num: '4' },
          ],
          objects: [
            { id: 'cal:c1', kind: 'cone', x: 25, y: 25 },
            { id: 'cal:c2', kind: 'cone', x: 75, y: 25 },
            { id: 'cal:c3', kind: 'cone', x: 75, y: 75 },
            { id: 'cal:c4', kind: 'cone', x: 25, y: 75 },
          ],
          arrows: [
            { id: 'cal:m1', kind: 'move', x1: 25, y1: 25, x2: 75, y2: 25, cx: 50, cy: 18 },
            { id: 'cal:m2', kind: 'move', x1: 75, y1: 25, x2: 75, y2: 75, cx: 82, cy: 50 },
            { id: 'cal:m3', kind: 'move', x1: 75, y1: 75, x2: 25, y2: 75, cx: 50, cy: 82 },
            { id: 'cal:m4', kind: 'move', x1: 25, y1: 75, x2: 25, y2: 25, cx: 18, cy: 50 },
          ],
          notes: [
            { id: 'cal:n1', x: 25, y: 18, text: 'skipping' },
            { id: 'cal:n2', x: 82, y: 50, text: 'lateral' },
            { id: 'cal:n3', x: 50, y: 88, text: 'sprint' },
            { id: 'cal:n4', x: 18, y: 50, text: 'pasos cortos' },
          ],
        },
      ],
    },
  },
];

export const getPresetById = (id: string): Preset | undefined =>
  PRESETS.find((p) => p.id === id);
