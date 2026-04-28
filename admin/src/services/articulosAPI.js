const BASE = '/api/articulos';

export async function fetchArticulos() {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error(`Error ${res.status} al cargar artículos`);
  return res.json();
}

export async function fetchArticulo(slug) {
  const res = await fetch(`${BASE}/${slug}`);
  if (!res.ok) throw new Error(`Error ${res.status} al cargar artículo "${slug}"`);
  return res.json();
}

export async function saveArticulo(slug, { frontmatter, body }) {
  const res = await fetch(`${BASE}/${slug}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ frontmatter, body }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Error ${res.status} al guardar`);
  }
  return res.json();
}

export async function deleteArticulo(slug) {
  const res = await fetch(`${BASE}/${slug}`, { method: 'DELETE' });
  const data = await res.json().catch(() => ({ ok: false, error: `Error ${res.status}` }));
  if (!res.ok || data.ok === false) {
    throw new Error(data.error || `Error ${res.status} al eliminar`);
  }
  return data;
}
