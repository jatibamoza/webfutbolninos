/**
 * Formateo de tiempo para el Mundial. Siempre en español, hora local del
 * navegador (no del servidor) para que el padre en Madrid no vea kickoffs
 * en UTC y el peque en CDMX vea hora de México sin esfuerzo.
 *
 * En el servidor (SSR/SSG) `new Date()` es UTC del runner — para componentes
 * server-rendered, formatear con `Date.toLocaleString('es-ES', { timeZone })`
 * pasando una zona explícita si quieres pinarla. Los islands client-side
 * usan zona local automáticamente.
 */

/** "20:00" — hora local del usuario. */
export function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

/** "vie 12 jun · 20:00" — fecha + hora local. */
export function fmtDateTime(iso: string | Date): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  const fecha = d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }).replace('.', '');
  const hora = d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  return `${fecha} · ${hora}`;
}

/** "11 jun 2026" — solo día. */
export function fmtDate(d: Date): string {
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).replace('.', '');
}

/**
 * Cuenta atrás humana hasta un instante futuro.
 * - >24h → "en 3d 4h"
 * - >1h  → "en 2h 15m"
 * - <1h  → "en 25 min"
 * - pasado → `null` (el caller decide qué mostrar: "EN VIVO" / "FINAL")
 */
export function fmtCountdown(iso: string | Date): string | null {
  const target = typeof iso === 'string' ? new Date(iso) : iso;
  const ms = target.getTime() - Date.now();
  if (ms < 0) return null;
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  if (h > 24) return `en ${Math.floor(h / 24)}d ${h % 24}h`;
  if (h > 0) return `en ${h}h ${m}m`;
  return `en ${m} min`;
}
