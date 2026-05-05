const BASE = '/api/social';

export async function fetchSocialCalendar() {
  const res = await fetch(`${BASE}/calendar`);
  const data = await res.json().catch(() => ({ ok: false, error: `Error ${res.status}` }));
  if (!res.ok || data.ok === false) {
    throw new Error(data.error || `Error ${res.status} al cargar calendar`);
  }
  return data;
}

/** Convierte `public/social/<rest>` → `/assets/social/<rest>` para servir desde el dev server. */
export function socialAssetUrl(repoRelativePath) {
  if (!repoRelativePath) return null;
  return '/assets/social/' + repoRelativePath.replace(/^public\/social\//, '');
}

export async function patchPost(id, patch) {
  const res = await fetch(`${BASE}/calendar/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  const data = await res.json().catch(() => ({ ok: false, error: `Error ${res.status}` }));
  if (!res.ok || data.ok === false) {
    throw new Error(data.error || `Error ${res.status} al actualizar el post`);
  }
  return data;
}

export const setPostStatus = (id, status) => patchPost(id, { status });
export const setPostScheduledAt = (id, scheduled_at) => patchPost(id, { scheduled_at });

export async function fetchCalendarDiff() {
  const res = await fetch(`${BASE}/calendar/diff`);
  const data = await res.json().catch(() => ({ ok: false, error: `Error ${res.status}` }));
  if (!res.ok || data.ok === false) {
    throw new Error(data.error || `Error ${res.status} al consultar diff`);
  }
  return data;
}

export async function commitCalendar(message) {
  const res = await fetch(`${BASE}/calendar/commit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message ? { message } : {}),
  });
  const data = await res.json().catch(() => ({ ok: false, error: `Error ${res.status}` }));
  if (!res.ok || data.ok === false) {
    throw new Error(data.error || `Error ${res.status} al commitear`);
  }
  return data;
}
