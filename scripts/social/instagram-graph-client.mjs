/**
 * instagram-graph-client.mjs
 *
 * Cliente directo de Instagram Graph API (Meta) para publicar contenido
 * (foto, carrusel, reel) desde el scheduler. Reemplaza a Publer.
 *
 * Auth: Long-lived User Access Token (60 días) o System User Token (sin expiración).
 * Docs: https://developers.facebook.com/docs/instagram-platform/content-publishing
 *
 * REQUISITOS:
 *   1. Cuenta IG Business o Creator vinculada a una Página de Facebook.
 *   2. App de Meta con producto "Instagram" añadido.
 *   3. Token con permisos: instagram_basic, instagram_content_publish,
 *      pages_show_list, pages_read_engagement.
 *   4. IG Business Account ID (no es el username ni el ID de la página FB).
 *
 * FLUJOS:
 *   - Foto:       1) crear container con image_url   2) publicar
 *   - Reel/Video: 1) crear container REELS + video_url
 *                 2) polling status_code hasta FINISHED
 *                 3) publicar
 *   - Carrusel:   1) crear N child containers (is_carousel_item=true)
 *                 2) crear container CAROUSEL con children=ids
 *                 3) publicar
 *
 * ERRORES:
 *   Graph API devuelve siempre { error: { message, type, code, error_subcode, fbtrace_id } }.
 *   Esto se mantiene en InstagramGraphError para que el scheduler logee
 *   info útil (a diferencia del 500 genérico de Publer).
 */

const GRAPH = 'https://graph.facebook.com/v21.0';

class InstagramGraphError extends Error {
  constructor(message, { status, code, subcode, type, fbtraceId, body } = {}) {
    super(message);
    this.name = 'InstagramGraphError';
    this.status = status;
    this.code = code;
    this.subcode = subcode;
    this.type = type;
    this.fbtraceId = fbtraceId;
    this.body = body;
  }
  /** Formato compacto para loggear en una línea. */
  toLogString() {
    const parts = [
      this.message,
      this.code != null ? `code=${this.code}` : null,
      this.subcode != null ? `subcode=${this.subcode}` : null,
      this.type ? `type=${this.type}` : null,
      this.fbtraceId ? `fbtrace=${this.fbtraceId}` : null,
    ].filter(Boolean);
    return parts.join(' · ');
  }
}

export function createInstagramGraphClient({ accessToken, igBusinessAccountId, fetchImpl = fetch }) {
  if (!accessToken) throw new Error('instagram-graph: accessToken requerido');
  if (!igBusinessAccountId) throw new Error('instagram-graph: igBusinessAccountId requerido');

  async function request(path, { method = 'GET', body } = {}) {
    const url = `${GRAPH}${path}`;
    const init = {
      method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    };
    const res = await fetchImpl(url, init);
    const text = await res.text();
    let json;
    try { json = text ? JSON.parse(text) : null; } catch { json = text; }
    if (!res.ok) {
      const e = json?.error ?? {};
      throw new InstagramGraphError(
        e.message ?? `Graph API ${method} ${path} → ${res.status}`,
        {
          status: res.status,
          code: e.code,
          subcode: e.error_subcode,
          type: e.type,
          fbtraceId: e.fbtrace_id,
          body: json,
        },
      );
    }
    return json;
  }

  /**
   * Crea un container de medio (paso 1 de cualquier publicación).
   * Params según docs Meta:
   *   - foto:     { image_url, caption?, is_carousel_item? }
   *   - reel:     { media_type: 'REELS', video_url, caption?, share_to_feed? }
   *   - vídeo c.: { media_type: 'VIDEO', video_url, is_carousel_item: true }
   *   - carrusel: { media_type: 'CAROUSEL', children: 'id1,id2,...', caption? }
   */
  async function createContainer(params) {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v != null) qs.set(k, String(v));
    }
    const data = await request(`/${igBusinessAccountId}/media?${qs}`, { method: 'POST' });
    if (!data?.id) {
      throw new InstagramGraphError('createContainer: sin id en respuesta', { body: data });
    }
    return data.id;
  }

  async function getContainerStatus(containerId) {
    const data = await request(
      `/${containerId}?fields=status_code,status,error_message`,
    );
    return {
      statusCode: data?.status_code,
      status: data?.status,
      errorMessage: data?.error_message,
      raw: data,
    };
  }

  /**
   * Para video/reels: el container empieza IN_PROGRESS (encoding) y pasa a
   * FINISHED, ERROR o EXPIRED. Hay que esperar a FINISHED antes de publicar.
   */
  async function waitForContainerReady(containerId, { maxWaitMs = 5 * 60 * 1000, intervalMs = 5000 } = {}) {
    const deadline = Date.now() + maxWaitMs;
    while (Date.now() < deadline) {
      const { statusCode, errorMessage } = await getContainerStatus(containerId);
      if (statusCode === 'FINISHED') return;
      if (statusCode === 'ERROR' || statusCode === 'EXPIRED') {
        throw new InstagramGraphError(
          `Container ${containerId} status=${statusCode}: ${errorMessage ?? 'sin detalle'}`,
        );
      }
      await new Promise((r) => setTimeout(r, intervalMs));
    }
    throw new InstagramGraphError(
      `Container ${containerId} no llegó a FINISHED en ${maxWaitMs}ms (timeout encoding)`,
    );
  }

  async function publishContainer(containerId) {
    const data = await request(
      `/${igBusinessAccountId}/media_publish?creation_id=${containerId}`,
      { method: 'POST' },
    );
    if (!data?.id) {
      throw new InstagramGraphError('publishContainer: sin id en respuesta', { body: data });
    }
    return data.id; // media_id en IG
  }

  /** Publica una foto de feed. */
  async function publishImage({ imageUrl, caption }) {
    const containerId = await createContainer({ image_url: imageUrl, caption });
    return publishContainer(containerId);
  }

  /**
   * Publica un Reel. Espera a que el encoding termine.
   * share_to_feed=true para que también aparezca en el feed (no solo Reels tab).
   */
  async function publishReel({ videoUrl, caption, shareToFeed = true }) {
    const containerId = await createContainer({
      media_type: 'REELS',
      video_url: videoUrl,
      caption,
      share_to_feed: shareToFeed,
    });
    await waitForContainerReady(containerId);
    return publishContainer(containerId);
  }

  /**
   * Publica un carrusel (2-10 items mixtos foto/vídeo).
   * Crea N child containers, espera vídeos si los hay, luego container
   * carrusel y publica.
   */
  async function publishCarousel({ items, caption }) {
    if (!Array.isArray(items) || items.length < 2 || items.length > 10) {
      throw new InstagramGraphError(
        `Carrusel requiere 2-10 items, recibidos ${items?.length ?? 0}`,
      );
    }
    const childIds = [];
    for (const item of items) {
      const params = item.type === 'video'
        ? { media_type: 'VIDEO', video_url: item.url, is_carousel_item: true }
        : { image_url: item.url, is_carousel_item: true };
      const id = await createContainer(params);
      if (item.type === 'video') await waitForContainerReady(id);
      childIds.push(id);
    }
    const carouselId = await createContainer({
      media_type: 'CAROUSEL',
      children: childIds.join(','),
      caption,
    });
    return publishContainer(carouselId);
  }

  /** Info de la cuenta IG (verificación rápida del setup). */
  async function getAccount() {
    return request(
      `/${igBusinessAccountId}?fields=id,username,name,profile_picture_url,followers_count,media_count`,
    );
  }

  return {
    publishImage,
    publishReel,
    publishCarousel,
    getAccount,
    // expuestos por si el scheduler quiere debug paso a paso:
    createContainer,
    getContainerStatus,
    waitForContainerReady,
    publishContainer,
  };
}

export { InstagramGraphError };
