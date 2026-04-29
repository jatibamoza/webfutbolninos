const BASE = '/api/articulos';

export async function crearArticulo(data) {
  const res = await fetch(`${BASE}/crear`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await res.json().catch(() => ({ ok: false, error: `Error ${res.status}` }));

  if (!res.ok || json.ok === false) {
    throw new Error(json.error || `Error ${res.status} al crear artículo`);
  }

  return json;
}

export async function crearPR({ slug, categoria, title, filePath, coverPath }) {
  const res = await fetch(`${BASE}/pr`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, categoria, title, filePath, coverPath }),
  });

  const json = await res.json().catch(() => ({ ok: false, error: `Error ${res.status}` }));

  if (!res.ok || json.ok === false) {
    throw new Error(json.error || `Error ${res.status} al crear PR`);
  }

  return json;
}

export async function checkSlugDisponible(slug) {
  try {
    const res = await fetch(BASE);
    if (!res.ok) return true; // si el endpoint no está disponible, asumir que está libre
    const articulos = await res.json();
    return !articulos.some((a) => a.slug === slug);
  } catch {
    return true;
  }
}
