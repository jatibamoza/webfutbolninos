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

export async function setPostStatus(id, status) {
  const res = await fetch(`${BASE}/calendar/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const data = await res.json().catch(() => ({ ok: false, error: `Error ${res.status}` }));
  if (!res.ok || data.ok === false) {
    throw new Error(data.error || `Error ${res.status} al cambiar status`);
  }
  return data;
}
