import { describe, it, expect } from 'vitest';
import { PRESETS, getPresetById } from '../presets';
import { boardSchema } from '../types';
import { serializeBoard, deserializeBoard } from '../serialize';

describe('PRESETS', () => {
  it('los 6 presets validan contra boardSchema', () => {
    for (const preset of PRESETS) {
      const result = boardSchema.safeParse(preset.board);
      if (!result.success) {
        throw new Error(
          `Preset ${preset.id} no valida: ${JSON.stringify(result.error.issues)}`,
        );
      }
      expect(result.success).toBe(true);
    }
  });

  it('IDs de preset son únicos', () => {
    const ids = PRESETS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('cada preset tiene fieldType consistente con board.fieldType', () => {
    for (const preset of PRESETS) {
      expect(preset.fieldType).toBe(preset.board.fieldType);
    }
  });

  it('todos los presets son round-trip serializables', () => {
    for (const preset of PRESETS) {
      const decoded = deserializeBoard(serializeBoard(preset.board));
      expect(decoded).toEqual(preset.board);
    }
  });

  it('IDs de items dentro de un preset son únicos por frame', () => {
    for (const preset of PRESETS) {
      for (const frame of preset.board.frames) {
        const ids = [
          ...frame.players.map((p) => p.id),
          ...frame.objects.map((o) => o.id),
          ...frame.arrows.map((a) => a.id),
          ...frame.notes.map((n) => n.id),
        ];
        expect(new Set(ids).size).toBe(ids.length);
      }
    }
  });
});

describe('getPresetById', () => {
  it('encuentra preset existente', () => {
    expect(getPresetById('rondo-4v1')?.nombre).toBe('Rondo 4v1');
  });

  it('devuelve undefined si no existe', () => {
    expect(getPresetById('inexistente')).toBeUndefined();
  });
});
