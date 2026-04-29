import { describe, it, expect } from 'vitest';
import {
  serializeBoard,
  deserializeBoard,
  readBoardFromHash,
  buildHashForBoard,
} from '../serialize';
import type { Board } from '../types';
import { emptyBoard } from '../types';

const sampleBoard: Board = {
  fieldType: 'mini',
  skin: 'chalk',
  frames: [
    {
      players: [
        { id: 'p1', kind: 'player_blue', x: 25, y: 25, num: '1' },
        { id: 'p2', kind: 'player_red', x: 75, y: 75, num: 'X' },
      ],
      objects: [{ id: 'o1', kind: 'ball', x: 50, y: 50 }],
      arrows: [
        {
          id: 'a1',
          kind: 'pass',
          x1: 25,
          y1: 25,
          x2: 75,
          y2: 25,
          cx: 50,
          cy: 22,
        },
      ],
      notes: [{ id: 'n1', x: 50, y: 92, text: '4 pases seguidos = punto' }],
    },
  ],
};

describe('serializeBoard / deserializeBoard', () => {
  it('round-trip idempotente con board completo', () => {
    const encoded = serializeBoard(sampleBoard);
    const decoded = deserializeBoard(encoded);
    expect(decoded).toEqual(sampleBoard);
  });

  it('round-trip con board mínimo (vacío)', () => {
    const empty = emptyBoard();
    const decoded = deserializeBoard(serializeBoard(empty));
    expect(decoded).toEqual(empty);
  });

  it('round-trip preserva tildes, ñ y emojis en notas', () => {
    const board: Board = {
      ...sampleBoard,
      frames: [
        {
          players: [],
          objects: [],
          arrows: [],
          notes: [{ id: 'n1', x: 50, y: 50, text: 'pasa, niño ⚽ y corre' }],
        },
      ],
    };
    const decoded = deserializeBoard(serializeBoard(board));
    expect(decoded?.frames[0]?.notes[0]?.text).toBe('pasa, niño ⚽ y corre');
  });

  it('output es URL-safe (sin +, /, = al final)', () => {
    const encoded = serializeBoard(sampleBoard);
    expect(encoded).not.toMatch(/[+/=]/);
  });

  it('input inválido devuelve null sin lanzar', () => {
    expect(deserializeBoard('')).toBeNull();
    expect(deserializeBoard('no-es-base64-???!')).toBeNull();
    expect(deserializeBoard('Zm9vYmFy')).toBeNull(); // base64 pero no JSON
  });

  it('JSON con shape inválido falla la validación Zod', () => {
    const bogus = btoa(JSON.stringify({ fieldType: 'inventado', skin: 'chalk', frames: [] }));
    expect(deserializeBoard(bogus)).toBeNull();
  });

  it('coordenadas fuera de [0,100] son rechazadas', () => {
    const broken = serializeBoard({
      ...sampleBoard,
      frames: [
        {
          players: [{ id: 'p1', kind: 'player_blue', x: 200, y: 0, num: '1' }],
          objects: [],
          arrows: [],
          notes: [],
        },
      ],
    });
    // Aún serializa porque serializeBoard no valida; deserialize sí.
    expect(deserializeBoard(broken)).toBeNull();
  });
});

describe('readBoardFromHash / buildHashForBoard', () => {
  it('round-trip a través de location.hash', () => {
    const hash = buildHashForBoard(sampleBoard);
    expect(hash.startsWith('#pz=')).toBe(true);
    expect(readBoardFromHash(hash)).toEqual(sampleBoard);
  });

  it('admite hash sin # inicial', () => {
    const hash = buildHashForBoard(sampleBoard).slice(1);
    expect(readBoardFromHash(hash)).toEqual(sampleBoard);
  });

  it('hash sin prefijo pz= devuelve null', () => {
    expect(readBoardFromHash('#otracosa=foo')).toBeNull();
    expect(readBoardFromHash('')).toBeNull();
  });
});
