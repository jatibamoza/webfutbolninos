import type { Frame } from './types';

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

// Devuelve un snapshot interpolado entre `frameA` y `frameB` con factor t∈[0,1].
//
// Reglas de match:
// - Jugadores y objetos se interpolan por id. Los items que no aparezcan en
//   `frameB` se quedan donde estaban en `frameA` (no se desvanecen).
// - Las flechas y notas se cambian abruptamente al pasar de frame: son
//   instrucciones tácticas, no movimiento físico.
//
// Si `frameB` no existe (último frame), devuelve `frameA` tal cual.
export function tweenFrames(
  frameA: Frame,
  frameB: Frame | undefined,
  rawT: number,
): Frame {
  if (!frameB) return frameA;
  const t = rawT < 0 ? 0 : rawT > 1 ? 1 : rawT;

  const playersBById = new Map(frameB.players.map((p) => [p.id, p]));
  const objectsBById = new Map(frameB.objects.map((o) => [o.id, o]));

  const tweenedPlayers = frameA.players.map((p) => {
    const target = playersBById.get(p.id);
    if (!target) return p;
    return { ...p, x: lerp(p.x, target.x, t), y: lerp(p.y, target.y, t) };
  });

  const tweenedObjects = frameA.objects.map((o) => {
    const target = objectsBById.get(o.id);
    if (!target) return o;
    return { ...o, x: lerp(o.x, target.x, t), y: lerp(o.y, target.y, t) };
  });

  // Flechas y notas saltan a las del próximo frame en cuanto t > 0.
  // Mantener las de A mientras t === 0 evita parpadeos al hacer scrub.
  const arrows = t === 0 ? frameA.arrows : frameB.arrows;
  const notes = t === 0 ? frameA.notes : frameB.notes;

  return { players: tweenedPlayers, objects: tweenedObjects, arrows, notes };
}
