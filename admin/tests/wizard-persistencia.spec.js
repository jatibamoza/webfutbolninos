import { test, expect } from '@playwright/test';

const VALID_DESC =
  'Descripción de prueba con caracteres suficientes para la validación del formulario paso dos entre 120 y 160 caracteres.';

test.beforeEach(async ({ page }) => {
  await page.context().addInitScript(() => localStorage.clear());
});

test('el draft se restaura desde localStorage tras recargar', async ({ page }) => {
  await page.goto('/nuevo');

  // Step 1
  await page.getByRole('button', { name: 'Equipamiento' }).click();
  await page.getByRole('button', { name: 'Continuar' }).click();

  // Step 2 — rellenar campos mínimos para que el debounce guarde el state
  await page.getByPlaceholder('ejercicios fútbol niños en casa').fill('botas fútbol niño persistencia');
  await page.getByLabel('Título (H1)').fill('Las mejores botas para niño persistencia test');
  await page.getByLabel('Meta description').fill(VALID_DESC);
  await page.getByLabel('Alt de la imagen cover').fill('Niño probando botas de fútbol en tienda');

  // Esperamos a que el debounce de 500ms escriba en localStorage
  await page.waitForTimeout(700);

  // Verificamos que el draft ya está guardado antes de recargar
  const draftBefore = await page.evaluate(() => localStorage.getItem('mg.admin.wizard.draft'));
  expect(draftBefore).not.toBeNull();

  const parsed = JSON.parse(draftBefore);
  expect(parsed.state.categoria).toBe('equipamiento');
  expect(parsed.state.keyword).toContain('persistencia');

  // Recargar
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Nuevo artículo' })).toBeVisible();

  // El wizard debe restaurar el step guardado: categoría seleccionada = equipamiento
  // Como el draft tiene categoria='equipamiento', al entrar en step 1 debería
  // estar ya en step 2 (el state se restaura en EMPTY_STATE ?? draft.state)
  // Comprobación pragmática: el label "Keyword y título" aparece (step 2)
  // si la categoría ya estaba guardada y el código restaura el step.
  // Nota: NuevoArticuloPage inicia step=1 siempre, pero el state se restaura del draft.
  // El usuario puede continuar desde donde estaba.

  // La categoría Equipamiento está seleccionada (aria-pressed=true) en step 1
  const catBtn = page.getByRole('button', { name: 'Equipamiento' });
  await expect(catBtn).toHaveAttribute('aria-pressed', 'true');

  // Al avanzar al step 2, los campos deben estar precargados
  await page.getByRole('button', { name: 'Continuar' }).click();
  await expect(page.getByLabel('Título (H1)')).toHaveValue('Las mejores botas para niño persistencia test');
  await expect(page.getByPlaceholder('ejercicios fútbol niños en casa')).toHaveValue(
    'botas fútbol niño persistencia',
  );
});

test('Empezar de nuevo borra el draft y vuelve al paso 1 vacío', async ({ page }) => {
  // Sembrar un draft directamente en localStorage para no tener que rellenar el form
  await page.goto('/nuevo');
  await page.evaluate(() => {
    localStorage.setItem(
      'mg.admin.wizard.draft',
      JSON.stringify({
        state: {
          categoria: 'juegos',
          keyword: 'juegos fútbol jardín',
          title: 'Título de prueba empezar de nuevo',
          description: 'Desc'.repeat(35), // ~140 chars
          slug: 'juegos-futbol-jardin',
          coverAlt: 'Niños jugando',
          edadMin: 5,
          edadMax: 10,
          nivel: 'media',
          tags: [],
          outline: [],
        },
        savedAt: Date.now(),
      }),
    );
  });

  await page.reload();

  // La categoría "Juegos" debe estar seleccionada
  await expect(page.getByRole('button', { name: 'Juegos' })).toHaveAttribute('aria-pressed', 'true');

  // Click "Empezar de nuevo"
  await page.getByRole('button', { name: 'Empezar de nuevo' }).click();

  // Ninguna categoría seleccionada
  for (const label of ['Iniciación', 'Ejercicios', 'Juegos', 'Equipamiento', 'Recursos', 'Mundial 2026']) {
    await expect(page.getByRole('button', { name: label })).toHaveAttribute('aria-pressed', 'false');
  }

  // El draft en localStorage debe haber desaparecido
  const draftAfter = await page.evaluate(() => localStorage.getItem('mg.admin.wizard.draft'));
  expect(draftAfter).toBeNull();

  // El botón Continuar está deshabilitado (step 1 vacío)
  await expect(page.getByRole('button', { name: 'Continuar' })).toBeDisabled();
});
