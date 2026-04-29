import { test, expect } from '@playwright/test';

// Descripción suficientemente larga para pasar Zod (120-160 chars)
const VALID_DESC =
  'Aprende a entrenar con el balón en casa con estos ejercicios de fútbol para niños de 6 a 12 años. Diversión garantizada sin salir del salón.';

test.beforeEach(async ({ page }) => {
  await page.context().addInitScript(() => localStorage.clear());
});

test('happy path completo: 4 pasos hasta el preview sin pantalla en blanco', async ({ page }) => {
  await page.goto('/nuevo');

  // ── Step 1: seleccionar categoría "Ejercicios" ──────────────────────────────
  // Las categorías son botones con aria-pressed; buscamos por texto visible.
  await page.getByRole('button', { name: 'Ejercicios' }).click();
  await expect(page.getByRole('button', { name: 'Ejercicios' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Continuar' }).click();

  // ── Step 2: keyword y metadatos ─────────────────────────────────────────────
  await expect(page.getByRole('heading', { name: 'Keyword y título' })).toBeVisible();

  await page.getByPlaceholder('ejercicios fútbol niños en casa').fill('playwright test wizard');

  // El slug se auto-genera desde la keyword; esperamos a que aparezca
  await expect(page.locator('input[style*="font-mono"]')).toHaveValue('playwright-test-wizard', { timeout: 3000 });

  // Usamos el label para localizar los campos (react-hook-form no añade id automático)
  await page.getByLabel('Título (H1)').fill('Ejercicios con Playwright para niños');
  await page.getByLabel('Meta description').fill(VALID_DESC);
  await page.getByLabel('Alt de la imagen cover').fill('Niño practicando ejercicios de fútbol en el salón');

  // Edad mín/máx y nivel
  await page.getByLabel('Edad mínima').fill('6');
  await page.getByLabel('Edad máxima').fill('12');
  await page.getByLabel('Nivel').selectOption('facil');

  // El botón Continuar se habilita cuando el formulario es válido
  await expect(page.getByRole('button', { name: 'Continuar' })).not.toBeDisabled({ timeout: 3000 });
  await page.getByRole('button', { name: 'Continuar' }).click();

  // ── Step 3: outline con dnd-kit ─────────────────────────────────────────────
  // No intentamos drag & drop (flaky en headless). Usamos los botones "+ Añadir H2/H3"
  // y rellenamos los inputs de texto de cada fila.
  await expect(page.getByRole('heading', { name: 'Estructura del artículo' })).toBeVisible();

  await page.getByRole('button', { name: '+ Añadir H2' }).click();
  await page.getByRole('button', { name: '+ Añadir H2' }).click();
  await page.getByRole('button', { name: '+ Añadir H3' }).click();

  // Los inputs de las filas del outline no tienen label accesible; usamos placeholder.
  const h2Inputs = page.getByPlaceholder('Sección principal…');
  const h3Inputs = page.getByPlaceholder('Subsección…');

  await h2Inputs.nth(0).fill('Introducción a los ejercicios');
  await h2Inputs.nth(1).fill('Ejercicios avanzados');
  await h3Inputs.nth(0).fill('Variante con conos');

  await expect(page.getByRole('button', { name: 'Continuar' })).not.toBeDisabled({ timeout: 3000 });
  await page.getByRole('button', { name: 'Continuar' }).click();

  // ── Step 4: el preview NO está en blanco (regression ZodEffects.merge) ───────
  await expect(page.getByRole('heading', { name: 'Vista previa y publicación' })).toBeVisible();

  // El título que escribimos debe aparecer en la zona de preview
  await expect(page.getByText('Ejercicios con Playwright para niños')).toBeVisible();

  // La PR card amarilla (fondo --color-marker) tiene texto fijo
  await expect(page.getByText('Pull Request a abrir')).toBeVisible();
  await expect(page.getByText(/content: añadir/)).toBeVisible();
});
