// Coordenadas del campo en porcentaje (0–100). Las utilidades viven aquí
// para que cualquier hook o primitive las consuma sin volverse a inventar.

export const clamp = (value: number, min = 0, max = 100): number => {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
};

export const distance = (
  ax: number,
  ay: number,
  bx: number,
  by: number,
): number => Math.hypot(bx - ax, by - ay);

// Punto de control por defecto para una flecha curva nueva: a medio camino
// y desplazada 6 unidades hacia arriba para que se note la curvatura.
export const defaultControlPoint = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): { cx: number; cy: number } => ({
  cx: clamp((x1 + x2) / 2),
  cy: clamp((y1 + y2) / 2 - 6),
});

// Generador de IDs para items creados en runtime. Los presets traen IDs
// estables hardcodeados; los items que añade el usuario usan este helper.
let counter = 0;
export const uid = (prefix: 'p' | 'o' | 'a' | 'n'): string => {
  counter += 1;
  return `${prefix}_${counter.toString(36)}_${Date.now().toString(36)}`;
};
