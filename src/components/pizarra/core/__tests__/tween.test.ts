import { describe, it, expect } from 'vitest';
import { tweenFrames } from '../tween';
import type { Frame } from '../types';

const frameAt = (px: number, py: number, ox: number, oy: number): Frame => ({
  players: [{ id: 'p1', kind: 'player_blue', x: px, y: py, num: '1' }],
  objects: [{ id: 'o1', kind: 'ball', x: ox, y: oy }],
  arrows: [],
  notes: [],
});

describe('tweenFrames', () => {
  it('si no hay frameB devuelve frameA', () => {
    const a = frameAt(10, 20, 30, 40);
    expect(tweenFrames(a, undefined, 0.5)).toBe(a);
  });

  it('t=0 mantiene posiciones de A', () => {
    const a = frameAt(0, 0, 0, 0);
    const b = frameAt(100, 100, 100, 100);
    const r = tweenFrames(a, b, 0);
    expect(r.players[0]).toMatchObject({ x: 0, y: 0 });
    expect(r.objects[0]).toMatchObject({ x: 0, y: 0 });
  });

  it('t=1 alcanza posiciones de B', () => {
    const a = frameAt(0, 0, 0, 0);
    const b = frameAt(100, 100, 100, 100);
    const r = tweenFrames(a, b, 1);
    expect(r.players[0]).toMatchObject({ x: 100, y: 100 });
    expect(r.objects[0]).toMatchObject({ x: 100, y: 100 });
  });

  it('t=0.5 interpola al medio', () => {
    const a = frameAt(0, 0, 0, 0);
    const b = frameAt(100, 50, 80, 20);
    const r = tweenFrames(a, b, 0.5);
    expect(r.players[0]).toMatchObject({ x: 50, y: 25 });
    expect(r.objects[0]).toMatchObject({ x: 40, y: 10 });
  });

  it('clampa t fuera de [0,1]', () => {
    const a = frameAt(0, 0, 0, 0);
    const b = frameAt(100, 100, 100, 100);
    expect(tweenFrames(a, b, -2).players[0]).toMatchObject({ x: 0, y: 0 });
    expect(tweenFrames(a, b, 5).players[0]).toMatchObject({ x: 100, y: 100 });
  });

  it('items sin matching id en B mantienen su posición de A', () => {
    const a: Frame = {
      players: [{ id: 'p1', kind: 'player_blue', x: 10, y: 10, num: '1' }],
      objects: [],
      arrows: [],
      notes: [],
    };
    const b: Frame = {
      players: [{ id: 'p2', kind: 'player_blue', x: 90, y: 90, num: '2' }],
      objects: [],
      arrows: [],
      notes: [],
    };
    const r = tweenFrames(a, b, 0.5);
    expect(r.players[0]).toMatchObject({ id: 'p1', x: 10, y: 10 });
  });

  it('flechas saltan al cambiar de frame (t>0)', () => {
    const a: Frame = {
      players: [],
      objects: [],
      arrows: [{ id: 'a1', kind: 'pass', x1: 0, y1: 0, x2: 50, y2: 50, cx: 25, cy: 22 }],
      notes: [],
    };
    const b: Frame = {
      players: [],
      objects: [],
      arrows: [{ id: 'a2', kind: 'move', x1: 0, y1: 0, x2: 99, y2: 99, cx: 50, cy: 47 }],
      notes: [],
    };
    expect(tweenFrames(a, b, 0).arrows[0]?.id).toBe('a1');
    expect(tweenFrames(a, b, 0.01).arrows[0]?.id).toBe('a2');
  });
});
