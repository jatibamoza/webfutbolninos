import { test, expect } from '@playwright/test';

// Artículo de prueba que el mock de GET /api/articulos devuelve
const MOCK_ARTICULO = {
  slug: 'articulo-prueba-e2e',
  categoria: 'ejercicios',
  frontmatter: {
    title: 'Artículo de prueba E2E',
    description: 'Descripción de prueba',
    nivel: 'facil',
    edadMin: 6,
    edadMax: 10,
    pubDate: '2026-04-27',
    draft: false,
  },
};

test.beforeEach(async ({ page }) => {
  await page.context().addInitScript(() => localStorage.clear());

  // Interceptamos GET /api/articulos para devolver nuestro artículo de prueba
  // sin tocar el sistema de archivos real.
  await page.route('/api/articulos', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([MOCK_ARTICULO]),
      });
    } else {
      await route.continue();
    }
  });
});

test('aparece la fila del artículo mockeado con su botón Trash', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Artículo de prueba E2E')).toBeVisible();
  // El botón Trash tiene title="Eliminar"
  await expect(page.getByTitle('Eliminar')).toBeVisible();
});

test('Cancel en window.confirm NO llama a DELETE', async ({ page }) => {
  const deleteRequests = [];

  // Capturamos las peticiones DELETE antes de que vayan al servidor
  await page.route('/api/articulos/**', async (route) => {
    if (route.request().method() === 'DELETE') {
      deleteRequests.push(route.request().url());
      await route.fulfill({ status: 200, body: JSON.stringify({ ok: true, coverDeleted: false }) });
    } else {
      await route.continue();
    }
  });

  // Dialogo de confirmación → cancelar
  page.on('dialog', (dialog) => dialog.dismiss());

  await page.goto('/');
  await page.getByTitle('Eliminar').click();

  // Damos tiempo a que pudiera dispararse la petición (no debería)
  await page.waitForTimeout(300);
  expect(deleteRequests).toHaveLength(0);
});

test('OK en window.confirm llama a DELETE y el artículo desaparece', async ({ page }) => {
  const deleteRequests = [];

  // Mock del DELETE que responde con éxito
  await page.route('/api/articulos/articulo-prueba-e2e', async (route) => {
    if (route.request().method() === 'DELETE') {
      deleteRequests.push(route.request().url());
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, coverDeleted: false }),
      });
    } else {
      await route.continue();
    }
  });

  // Tras el DELETE el refetch de GET devuelve lista vacía
  let deleteHappened = false;
  await page.route('/api/articulos', async (route) => {
    if (route.request().method() === 'GET') {
      const body = deleteHappened ? [] : [MOCK_ARTICULO];
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    } else {
      await route.continue();
    }
  });

  page.on('dialog', async (dialog) => {
    deleteHappened = true;
    await dialog.accept();
  });

  await page.goto('/');
  await expect(page.getByText('Artículo de prueba E2E')).toBeVisible();

  await page.getByTitle('Eliminar').click();

  // El DELETE debe haberse llamado
  await expect.poll(() => deleteRequests.length, { timeout: 5000 }).toBe(1);
  expect(deleteRequests[0]).toContain('articulo-prueba-e2e');

  // Tras el refetch, la tabla debe estar vacía
  await expect(page.getByText('No hay artículos con esos filtros')).toBeVisible({ timeout: 5000 });
});
