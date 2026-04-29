import { useCallback, useEffect, useState } from 'react';
import { deleteArticulo, fetchArticulo, fetchArticulos, saveArticulo } from '../services/articulosAPI.js';
import { toast } from '../services/toast.js';

export function useArticulosList() {
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(() => {
    setLoading(true);
    return fetchArticulos()
      .then((data) => {
        setArticulos(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const remove = useCallback(
    async (slug) => {
      try {
        const result = await deleteArticulo(slug);
        toast(`Artículo "${slug}" eliminado${result.coverDeleted ? ' (con cover)' : ''}`, 'success');
        await refetch();
      } catch (err) {
        toast(err.message, 'error');
      }
    },
    [refetch],
  );

  return { articulos, loading, error, refetch, remove };
}

export function useArticulo(slug) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchArticulo(slug)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const save = useCallback(
    async (frontmatter, body) => {
      setSaving(true);
      try {
        await saveArticulo(slug, { frontmatter, body });
        toast('Artículo guardado correctamente', 'success');
        setData((prev) => ({ ...prev, frontmatter, body }));
      } catch (err) {
        toast(err.message, 'error');
      } finally {
        setSaving(false);
      }
    },
    [slug],
  );

  return { data, loading, error, saving, save };
}
