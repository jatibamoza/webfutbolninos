import { boardSchema, type Board } from './types';

// Serialización del Board para URL hash (compartir).
//
// Reemplaza el patrón obsoleto del mockup `btoa(unescape(encodeURIComponent(...)))`
// — `unescape` está deprecated y `+`/`/`/`=` rompen URLs al copiar/pegar — por
// base64-url-safe (RFC 4648 §5) sobre UTF-8 codificado con TextEncoder.
//
// Errores:
// - serializeBoard nunca lanza: si algo falla devuelve cadena vacía.
// - deserializeBoard devuelve `null` si el formato es inválido o el schema no
//   valida. Validación con Zod, no se asume nada del input.

const utf8ToBase64Url = (input: string): string => {
  const bytes = new TextEncoder().encode(input);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  // btoa devuelve base64 estándar; lo convertimos a URL-safe sin padding.
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const base64UrlToUtf8 = (input: string): string => {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/');
  const padding = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
  const binary = atob(padded + padding);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
};

export function serializeBoard(board: Board): string {
  try {
    return utf8ToBase64Url(JSON.stringify(board));
  } catch {
    return '';
  }
}

export function deserializeBoard(encoded: string): Board | null {
  if (!encoded) return null;
  try {
    const json = base64UrlToUtf8(encoded);
    const parsed: unknown = JSON.parse(json);
    const result = boardSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

// Helpers de URL hash. El protocolo es `#pz=<base64url>`.
const HASH_PREFIX = 'pz=';

export function readBoardFromHash(hash: string): Board | null {
  const trimmed = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!trimmed.startsWith(HASH_PREFIX)) return null;
  return deserializeBoard(trimmed.slice(HASH_PREFIX.length));
}

export function buildHashForBoard(board: Board): string {
  const payload = serializeBoard(board);
  return payload ? `#${HASH_PREFIX}${payload}` : '';
}
