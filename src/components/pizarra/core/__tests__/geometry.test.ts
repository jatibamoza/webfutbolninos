import { describe, it, expect } from 'vitest';
import { clamp, distance, defaultControlPoint, uid } from '../geometry';

describe('clamp', () => {
  it('respeta valores dentro del rango por defecto', () => {
    expect(clamp(50)).toBe(50);
    expect(clamp(0)).toBe(0);
    expect(clamp(100)).toBe(100);
  });

  it('limita por debajo del mínimo', () => {
    expect(clamp(-5)).toBe(0);
    expect(clamp(-9999)).toBe(0);
  });

  it('limita por encima del máximo', () => {
    expect(clamp(150)).toBe(100);
    expect(clamp(9999)).toBe(100);
  });

  it('admite rangos custom', () => {
    expect(clamp(15, 0, 10)).toBe(10);
    expect(clamp(-5, -1, 1)).toBe(-1);
  });

  it('NaN se colapsa al mínimo', () => {
    expect(clamp(Number.NaN)).toBe(0);
  });
});

describe('distance', () => {
  it('calcula distancia euclídea', () => {
    expect(distance(0, 0, 3, 4)).toBe(5);
    expect(distance(10, 10, 10, 10)).toBe(0);
  });
});

describe('defaultControlPoint', () => {
  it('punto medio desplazado 6 unidades arriba', () => {
    expect(defaultControlPoint(0, 50, 100, 50)).toEqual({ cx: 50, cy: 44 });
  });

  it('clamp si el punto medio se sale del campo', () => {
    expect(defaultControlPoint(0, 0, 0, 0)).toEqual({ cx: 0, cy: 0 });
  });
});

describe('uid', () => {
  it('IDs únicos consecutivos respetan el prefijo', () => {
    const a = uid('p');
    const b = uid('p');
    expect(a).not.toBe(b);
    expect(a.startsWith('p_')).toBe(true);
    expect(b.startsWith('p_')).toBe(true);
  });

  it('cada prefijo da su propia familia', () => {
    expect(uid('a').startsWith('a_')).toBe(true);
    expect(uid('n').startsWith('n_')).toBe(true);
  });
});
