/**
 * publer-client.mjs
 *
 * Cliente mínimo de la API de Publer v1 para programar posts a redes sociales.
 *
 * Auth: Bearer-Api token + Workspace ID en cabeceras.
 * Docs: https://app.publer.io/api-docs (requiere cuenta business).
 *
 * Uso:
 *   import { createPublerClient } from './publer-client.mjs';
 *   const client = createPublerClient({ apiKey, workspaceId, accountIds });
 *   const { jobId } = await client.schedulePost({...});
 *   const { state, posts } = await client.getJobStatus(jobId);
 *
 * Diseño: stateless, sin caché, sin retries. La capa que lo invoca
 * (scheduler.mjs) decide cómo manejar errores y rate limits.
 */

const BASE = 'https://app.publer.io/api/v1';

class PublerError extends Error {
  constructor(message, { status, body } = {}) {
    super(message);
    this.name = 'PublerError';
    this.status = status;
    this.body = body;
  }
}

export function createPublerClient({ apiKey, workspaceId, accountIds }) {
  if (!apiKey) throw new Error('publer: apiKey requerido');
  if (!workspaceId) throw new Error('publer: workspaceId requerido');
  if (!accountIds || typeof accountIds !== 'object') {
    throw new Error('publer: accountIds debe ser objeto { instagram: "...", tiktok: "..." }');
  }

  const headers = {
    'Authorization': `Bearer-Api ${apiKey}`,
    'Publer-Workspace-Id': workspaceId,
    'Content-Type': 'application/json',
  };

  async function request(path, init = {}) {
    const res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: { ...headers, ...(init.headers ?? {}) },
    });
    const text = await res.text();
    let body;
    try { body = text ? JSON.parse(text) : null; } catch { body = text; }
    if (!res.ok) {
      throw new PublerError(`Publer ${init.method ?? 'GET'} ${path} → ${res.status}`, {
        status: res.status,
        body,
      });
    }
    return body;
  }

  /**
   * Mapea las plataformas del calendar a los account IDs configurados.
   * Devuelve un array de account IDs de Publer.
   */
  function resolveAccountIds(platforms) {
    const ids = [];
    for (const p of platforms) {
      const id = accountIds[p];
      if (!id) throw new Error(`publer: account ID no configurado para "${p}"`);
      ids.push(id);
    }
    return ids;
  }

  /**
   * Programa un post en Publer.
   *
   * Publer trabaja con "jobs" — agruparlo así permite multiplataforma en
   * una sola llamada y un job_id que sirve para polling de estado.
   *
   * @param {Object} input
   * @param {string[]} input.platforms - ['instagram', 'tiktok', ...]
   * @param {string}   input.text - caption + hashtags ya unidos
   * @param {string}   input.scheduledAt - ISO datetime
   * @param {Array<{type:'image'|'video', url:string, alt?:string}>} input.media
   * @returns {Promise<{ jobId: string }>}
   */
  async function schedulePost({ platforms, text, scheduledAt, media }) {
    const accounts = resolveAccountIds(platforms);
    const payload = {
      bulk: {
        state: 'scheduled',
        accounts,
        type: media[0]?.type === 'video' ? 'video' : 'photo',
        scheduled_at: scheduledAt,
      },
      posts: [
        {
          networks: {},
          accounts,
          text,
          media: media.map((m) => ({
            type: m.type,
            url: m.url,
            ...(m.alt ? { alt_text: m.alt } : {}),
          })),
          scheduled_at: scheduledAt,
        },
      ],
    };

    const data = await request('/posts/schedule/publish', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    // Publer responde { job_id } o { jobs: [{ id }] } según versión
    const jobId = data?.job_id ?? data?.jobs?.[0]?.id ?? data?.id ?? null;
    if (!jobId) throw new PublerError('Publer schedulePost: no jobId en respuesta', { body: data });
    return { jobId };
  }

  /**
   * Consulta el estado de un job. Útil para verificar que Publer
   * aceptó el envío (no garantiza publicación final — eso depende de
   * cada red social y se ve en el dashboard de Publer).
   */
  async function getJobStatus(jobId) {
    const data = await request(`/job_status/${encodeURIComponent(jobId)}`);
    return {
      state: data?.status ?? 'unknown',
      posts: data?.payload ?? [],
      raw: data,
    };
  }

  /**
   * Lista cuentas conectadas en el workspace. Útil para descubrir
   * los account IDs la primera vez (correr `pnpm social:accounts`).
   */
  async function listAccounts() {
    return request('/accounts');
  }

  return {
    schedulePost,
    getJobStatus,
    listAccounts,
  };
}

export { PublerError };
