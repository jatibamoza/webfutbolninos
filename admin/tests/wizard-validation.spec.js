import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.context().addInitScript(() => localStorage.clear());
  await page.goto('/nuevo');
});

test('step 1: botón Continuar deshabilitado hasta seleccionar categoría', async ({ page }) => {
  const continuar = page.getByRole('button', { name: 'Continuar' });

  await expect(continuar).toBeDisabled();

  await page.getByRole('button', { name: 'Iniciación' }).click();
  await expect(continuar).not.toBeDisabled();
});

test('step 2: Continuar deshabilitado si description < 120 chars', async ({ page }) => {
  // Llegar al step 2
  await page.getByRole('button', { name: 'Ejercicios' }).click();
  await page.getByRole('button', { name: 'Continuar' }).click();
  await expect(page.getByRole('heading', { name: 'Keyword y título' })).toBeVisible();

  const continuar = page.getByRole('button', { name: 'Continuar' });

  // Rellenar lo mínimo excepto una description válida
  await page.getByPlaceholder('ejercicios fútbol niños en casa').fill('test keyword');
  await page.getByLabel('Título (H1)').fill('Título de prueba para validación step dos');
  await page.getByLabel('Alt de la imagen cover').fill('Imagen de prueba alt text aquí');

  // Description corta → form inválido
  await page.getByLabel('Meta description').fill('Demasiado corta.');
  await expect(continuar).toBeDisabled();

  // Description en rango → form válido
  const validDesc =
    'Esta es una descripción de prueba para el artículo de fútbol infantil que tiene entre 120 y 160 caracteres para validar.';
  await page.getByLabel('Meta description').fill(validDesc);
  await expect(continuar).not.toBeDisabled({ timeout: 3000 });
});

test('step 3: Continuar deshabilitado con menos de 3 encabezados', async ({ page }) => {
  // Pasar steps 1 y 2
  await page.getByRole('button', { name: 'Juegos' }).click();
  await page.getByRole('button', { name: 'Continuar' }).click();

  await page.getByPlaceholder('ejercicios fútbol niños en casa').fill('test keyword validacion');
  await page.getByLabel('Título (H1)').fill('Título de prueba para validación paso tres');
  await page.getByLabel('Meta description').fill(
    'Descripción de prueba con el mínimo de caracteres necesarios para superar la validación del formulario del paso dos.',
  );
  await page.getByLabel('Alt de la imagen cover').fill('Imagen de prueba alt');
  await expect(page.getByRole('button', { name: 'Continuar' })).not.toBeDisabled({ timeout: 3000 });
  await page.getByRole('button', { name: 'Continuar' }).click();

  await expect(page.getByRole('heading', { name: 'Estructura del artículo' })).toBeVisible();

  const continuar = page.getByRole('button', { name: 'Continuar' });
  await expect(continuar).toBeDisabled();

  // Añadir 2 H2 — sigue sin llegar a 3
  await page.getByRole('button', { name: '+ Añadir H2' }).click();
  await page.getByPlaceholder('Sección principal…').nth(0).fill('Sección 1');
  await page.getByRole('button', { name: '+ Añadir H2' }).click();
  await page.getByPlaceholder('Sección principal…').nth(1).fill('Sección 2');
  await expect(continuar).toBeDisabled();

  // Añadir el 3º encabezado (H3 cuenta también para el mínimo)
  await page.getByRole('button', { name: '+ Añadir H3' }).click();
  await page.getByPlaceholder('Subsección…').nth(0).fill('Subsección A');
  await expect(continuar).not.toBeDisabled({ timeout: 3000 });
});

test('contadores title/description cambian de color al exceder el límite', async ({ page }) => {
  // Llegar al step 2
  await page.getByRole('button', { name: 'Recursos' }).click();
  await page.getByRole('button', { name: 'Continuar' }).click();
  await expect(page.getByRole('heading', { name: 'Keyword y título' })).toBeVisible();

  // El contador del título está junto al label; lo identificamos por su contenido "/ 70"
  // Cuando el texto tiene más de 60 chars el color pasa a --color-accent (warn).
  // Cuando supera 70 chars pasa a --color-energy (error).
  const titleInput = page.getByLabel('Título (H1)');

  // Texto de 71 caracteres: supera el límite
  await titleInput.fill('X'.repeat(71));

  // El span del contador muestra "71 / 70" con color de error inline
  const counterSpan = page.locator('label', { hasText: 'Título (H1)' }).locator('span[style*="color"]');
  await expect(counterSpan).toContainText('71 / 70');
  // El color inline es var(--color-energy) — verificamos que NO sea el color neutro
  const style = await counterSpan.getAttribute('style');
  expect(style).toContain('color-energy');

  // El contador de description muestra warn cuando está fuera del rango 120-160
  const descTextarea = page.getByLabel('Meta description');
  await descTextarea.fill('Corta');
  const descCounter = page.locator('label', { hasText: 'Meta description' }).locator('span[style*="color"]');
  await expect(descCounter).toContainText('5 / 160');
  const descStyle = await descCounter.getAttribute('style');
  // < 120 chars → warn (--color-accent)
  expect(descStyle).toContain('color-accent');
});
