import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import matter from 'gray-matter';

const execFileAsync = promisify(execFile);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTICULOS_DIR = path.join(__dirname, '..', 'src', 'content', 'articulos');

function readArticulosRecursive(dir, baseDir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...readArticulosRecursive(fullPath, baseDir));
    } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
      const relativePath = path.relative(baseDir, fullPath);
      const parts = relativePath.split(path.sep);
      const categoria = parts.length > 1 ? parts[0] : 'sin-categoria';
      const slug = path.basename(entry.name, path.extname(entry.name));
      const raw = fs.readFileSync(fullPath, 'utf-8');
      const { data: frontmatter, content: body } = matter(raw);
      results.push({ slug, categoria, frontmatter, body, filePath: fullPath });
    }
  }
  return results;
}

const VALID_CATEGORIES = ['ejercicios', 'juegos', 'equipamiento', 'iniciacion', 'recursos', 'mundial-2026'];

function articulosApiMiddleware() {
  return {
    name: 'articulos-api',
    configureServer(server) {
      server.middlewares.use('/api/articulos', (req, res, next) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        const url = new URL(req.url, 'http://localhost');
        const pathParts = url.pathname.split('/').filter(Boolean);

        // POST /api/articulos/cover
        if (req.method === 'POST' && pathParts[0] === 'cover') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', async () => {
            try {
              const { slug, categoria, title } = JSON.parse(body);

              if (!slug || !slug.trim()) {
                res.statusCode = 400;
                res.end(JSON.stringify({ ok: false, error: 'slug es requerido' }));
                return;
              }
              if (!categoria || !categoria.trim()) {
                res.statusCode = 400;
                res.end(JSON.stringify({ ok: false, error: 'categoria es requerida' }));
                return;
              }
              if (!title || !title.trim()) {
                res.statusCode = 400;
                res.end(JSON.stringify({ ok: false, error: 'title es requerido' }));
                return;
              }

              if (!VALID_CATEGORIES.includes(categoria)) {
                res.statusCode = 400;
                res.end(JSON.stringify({ ok: false, error: `categoria inválida. Válidas: ${VALID_CATEGORIES.join(', ')}` }));
                return;
              }

              const { generateCover } = await import('../scripts/generate-article-cover.mjs');
              const { path, sizeKB } = await generateCover({ slug, categoria, title });
              res.end(JSON.stringify({ ok: true, path, sizeKB }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ ok: false, error: err.message }));
            }
          });
          return;
        }

        // POST /api/articulos/crear
        if (req.method === 'POST' && pathParts[0] === 'crear') {
          let rawBody = '';
          req.on('data', (chunk) => { rawBody += chunk; });
          req.on('end', async () => {
            try {
              const {
                categoria, slug, title, description, keyword, coverAlt,
                edadMin, edadMax, nivel, tags = [], outline = [],
              } = JSON.parse(rawBody);

              // --- validaciones 400 ---
              const required = { categoria, slug, title, description, keyword, coverAlt };
              for (const [field, val] of Object.entries(required)) {
                if (!val || !String(val).trim()) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ ok: false, error: `${field} es requerido` }));
                  return;
                }
              }
              if (edadMin == null || edadMax == null) {
                res.statusCode = 400;
                res.end(JSON.stringify({ ok: false, error: 'edadMin y edadMax son requeridos' }));
                return;
              }
              if (!VALID_CATEGORIES.includes(categoria)) {
                res.statusCode = 400;
                res.end(JSON.stringify({ ok: false, error: `categoria inválida. Válidas: ${VALID_CATEGORIES.join(', ')}` }));
                return;
              }
              if (!['facil', 'media', 'reto'].includes(nivel)) {
                res.statusCode = 400;
                res.end(JSON.stringify({ ok: false, error: "nivel debe ser 'facil', 'media' o 'reto'" }));
                return;
              }
              if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
                res.statusCode = 400;
                res.end(JSON.stringify({ ok: false, error: 'slug inválido (kebab-case sin tildes, ej. mi-articulo)' }));
                return;
              }
              if (title.length > 70) {
                res.statusCode = 400;
                res.end(JSON.stringify({ ok: false, error: 'title excede 70 caracteres' }));
                return;
              }
              if (description.length < 120 || description.length > 160) {
                res.statusCode = 400;
                res.end(JSON.stringify({ ok: false, error: 'description debe tener entre 120 y 160 caracteres' }));
                return;
              }
              if (edadMin < 0 || edadMax > 18 || edadMin > edadMax) {
                res.statusCode = 400;
                res.end(JSON.stringify({ ok: false, error: 'edadMin/edadMax inválidos (0–18, min ≤ max)' }));
                return;
              }
              if (!Array.isArray(outline)) {
                res.statusCode = 400;
                res.end(JSON.stringify({ ok: false, error: 'outline debe ser un array' }));
                return;
              }
              for (const item of outline) {
                if (![2, 3].includes(item.level) || !item.text || !String(item.text).trim()) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ ok: false, error: 'cada item de outline requiere level (2|3) y text no vacío' }));
                  return;
                }
              }

              // --- conflicto 409 ---
              const mdxPath = path.join(ARTICULOS_DIR, categoria, `${slug}.mdx`);
              if (fs.existsSync(mdxPath)) {
                res.statusCode = 409;
                res.end(JSON.stringify({ ok: false, error: 'Artículo ya existe' }));
                return;
              }

              // --- lógica feliz ---
              const { generateCover } = await import('../scripts/generate-article-cover.mjs');
              await generateCover({ slug, categoria, title });

              const today = new Date().toISOString().slice(0, 10);
              // Mínimo 5 min; cada sección del outline aporta ~1.5 min de lectura
              const tiempoLectura = Math.max(5, Math.round(outline.length * 1.5));

              const frontmatter = {
                title,
                description,
                keyword,
                categoria,
                autor: 'javier-tibamoza',
                pubDate: today,
                cover: `../../../assets/articulos/${categoria}/${slug}.jpg`,
                coverAlt,
                edadMin,
                edadMax,
                nivel,
                tags: Array.isArray(tags) ? tags : [],
                draft: true,
                tiempoLectura,
                tieneAfiliados: false,
                featured: false,
              };

              const mdxBody = outline
                .map((item) => {
                  const heading = '#'.repeat(item.level);
                  const placeholder = item.level === 2
                    ? '(Contenido pendiente — completar en el editor MDX.)'
                    : '(Contenido pendiente.)';
                  return `${heading} ${item.text}\n\n${placeholder}`;
                })
                .join('\n\n');

              const fileContent = matter.stringify(mdxBody, frontmatter);
              fs.mkdirSync(path.dirname(mdxPath), { recursive: true });
              fs.writeFileSync(mdxPath, fileContent, 'utf-8');

              const repoRoot = path.join(__dirname, '..');
              res.end(JSON.stringify({
                ok: true,
                filePath: path.relative(repoRoot, mdxPath).replace(/\\/g, '/'),
                coverPath: `src/assets/articulos/${categoria}/${slug}.jpg`,
                slug,
                categoria,
              }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ ok: false, error: err.message }));
            }
          });
          return;
        }

        // POST /api/articulos/pr
        if (req.method === 'POST' && pathParts[0] === 'pr') {
          let rawBody = '';
          req.on('data', (chunk) => { rawBody += chunk; });
          req.on('end', async () => {
            const repoRoot = path.join(__dirname, '..');
            const worktreePath = path.join(repoRoot, '..', 'mg-pr-tmp');
            let worktreeCreated = false;
            let branchCreated = false;
            let branchName = '';

            try {
              const { slug, categoria, title, filePath, coverPath } = JSON.parse(rawBody);

              // --- validaciones 400 ---
              const requiredFields = { slug, categoria, title, filePath, coverPath };
              for (const [field, val] of Object.entries(requiredFields)) {
                if (!val || !String(val).trim()) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ ok: false, error: `${field} es requerido` }));
                  return;
                }
              }
              if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
                res.statusCode = 400;
                res.end(JSON.stringify({ ok: false, error: 'slug inválido (kebab-case sin tildes)' }));
                return;
              }

              // --- verificar gh autenticado ---
              try {
                await execFileAsync('gh', ['auth', 'status'], { cwd: repoRoot });
              } catch {
                res.statusCode = 503;
                res.end(JSON.stringify({ ok: false, error: 'gh CLI no autenticado, ejecuta: gh auth login' }));
                return;
              }

              // --- verificar que los archivos existen en disco ---
              const absFilePath = path.join(repoRoot, filePath);
              const absCoverPath = path.join(repoRoot, coverPath);
              if (!fs.existsSync(absFilePath)) {
                res.statusCode = 404;
                res.end(JSON.stringify({ ok: false, error: `filePath no encontrado: ${filePath}` }));
                return;
              }
              if (!fs.existsSync(absCoverPath)) {
                res.statusCode = 404;
                res.end(JSON.stringify({ ok: false, error: `coverPath no encontrado: ${coverPath}` }));
                return;
              }

              branchName = `content/${slug}`;

              // --- verificar que la branch no existe ya (local o remoto) ---
              try {
                await execFileAsync('git', ['rev-parse', '--verify', branchName], { cwd: repoRoot });
                // Si no lanza, la rama local existe
                res.statusCode = 409;
                res.end(JSON.stringify({ ok: false, error: `Branch ya existe: ${branchName}` }));
                return;
              } catch {
                // branch local no existe — continuar
              }
              try {
                await execFileAsync('git', ['ls-remote', '--exit-code', '--heads', 'origin', branchName], { cwd: repoRoot });
                // Si no lanza, la rama remota existe
                res.statusCode = 409;
                res.end(JSON.stringify({ ok: false, error: `Branch ya existe en origin: ${branchName}` }));
                return;
              } catch {
                // branch remota no existe — continuar
              }

              // --- limpiar worktree temporal si quedó de una ejecución anterior ---
              if (fs.existsSync(worktreePath)) {
                await execFileAsync('git', ['worktree', 'remove', worktreePath, '--force'], { cwd: repoRoot });
              }

              // --- crear worktree desde main (checkout limpio, sin contaminar working tree) ---
              await execFileAsync('git', ['fetch', 'origin', 'main'], { cwd: repoRoot });
              await execFileAsync('git', ['worktree', 'add', '--no-checkout', worktreePath, 'origin/main'], { cwd: repoRoot });
              worktreeCreated = true;

              // Crear la branch en la worktree y hacer checkout
              await execFileAsync('git', ['checkout', '-b', branchName], { cwd: worktreePath });
              branchCreated = true;

              // Copiar los dos archivos del repo principal a la worktree
              const destFilePath = path.join(worktreePath, filePath);
              const destCoverPath = path.join(worktreePath, coverPath);
              await fsp.mkdir(path.dirname(destFilePath), { recursive: true });
              await fsp.mkdir(path.dirname(destCoverPath), { recursive: true });
              await fsp.copyFile(absFilePath, destFilePath);
              await fsp.copyFile(absCoverPath, destCoverPath);

              // Commit con solo esos dos archivos
              await execFileAsync('git', ['add', filePath, coverPath], { cwd: worktreePath });
              const shortTitle = title.length > 50 ? title.slice(0, 47) + '…' : title;
              const commitMsg = `content: añadir ${shortTitle}`;
              await execFileAsync('git', ['commit', '-m', commitMsg], { cwd: worktreePath });

              // Push de la branch al remoto
              await execFileAsync('git', ['push', '-u', 'origin', branchName], { cwd: worktreePath });

              // Crear el PR como draft en GitHub
              const prBody = [
                '## Nuevo artículo',
                '',
                `- **Slug:** \`${slug}\``,
                `- **Categoría:** ${categoria}`,
                '- **Estado:** draft (frontmatter `draft: true`)',
                `- **Título:** ${title}`,
                '',
                'Generado desde el Content Manager (admin/) con el wizard del Sprint 9.',
                '',
                'El cuerpo MDX está en blanco con el outline como esqueleto. Completar antes de quitar `draft: true` y mergear.',
                '',
                '---',
                '',
                '🤖 Auto-PR vía MiniGol Content Manager',
              ].join('\n');

              const { stdout: prOut } = await execFileAsync(
                'gh',
                ['pr', 'create', '--base', 'main', '--head', branchName, '--title', commitMsg, '--body', prBody, '--draft'],
                { cwd: worktreePath },
              );

              const prUrl = prOut.trim();
              const prNumberMatch = prUrl.match(/\/pull\/(\d+)$/);
              const prNumber = prNumberMatch ? parseInt(prNumberMatch[1], 10) : null;

              // Limpiar worktree (la branch ya está en el remoto, no necesitamos la local de worktree)
              await execFileAsync('git', ['worktree', 'remove', worktreePath, '--force'], { cwd: repoRoot });

              res.end(JSON.stringify({ ok: true, branch: branchName, prUrl, prNumber }));
            } catch (err) {
              // Cleanup garantizado en error: primero worktree, luego branch local si quedó
              if (worktreeCreated && fs.existsSync(worktreePath)) {
                try {
                  await execFileAsync('git', ['worktree', 'remove', worktreePath, '--force'], { cwd: repoRoot });
                } catch { /* ignorar error de cleanup */ }
              }
              if (branchCreated && branchName) {
                try {
                  await execFileAsync('git', ['branch', '-D', branchName], { cwd: repoRoot });
                } catch { /* la branch puede no existir localmente en el repo principal */ }
              }
              res.statusCode = 500;
              res.end(JSON.stringify({ ok: false, error: err.message }));
            }
          });
          return;
        }

        // POST /api/articulos/:slug/publicar → worktree desde origin/main, commit solo el MDX+cover, PR draft
        if (req.method === 'POST' && pathParts[1] === 'publicar') {
          const slug = pathParts[0];
          const repoRoot = path.join(__dirname, '..');
          const worktreePath = path.join(repoRoot, '..', 'mg-pr-tmp');
          let worktreeCreated = false;
          let branchCreated = false;
          let branchName = '';

          try {
            const articulos = readArticulosRecursive(ARTICULOS_DIR, ARTICULOS_DIR);
            const found = articulos.find((a) => a.slug === slug);
            if (!found) {
              res.statusCode = 404;
              res.end(JSON.stringify({ ok: false, error: 'Artículo no encontrado' }));
              return;
            }

            const { categoria, filePath: articleFilePath, frontmatter } = found;
            const relFilePath = `src/content/articulos/${categoria}/${slug}.mdx`;
            const coverFilePath = path.join(repoRoot, 'src', 'assets', 'articulos', categoria, `${slug}.jpg`);
            const relCoverPath = `src/assets/articulos/${categoria}/${slug}.jpg`;
            const hasCover = fs.existsSync(coverFilePath);

            branchName = `content/${slug}`;
            const commitMsg = `content: añadir ${(frontmatter.title || slug).slice(0, 45)}`;

            // Verificar que la branch no existe ya
            try {
              await execFileAsync('git', ['rev-parse', '--verify', branchName], { cwd: repoRoot });
              res.statusCode = 409;
              res.end(JSON.stringify({ ok: false, error: `Branch ya existe: ${branchName}` }));
              return;
            } catch { /* no existe — OK */ }
            try {
              await execFileAsync('git', ['ls-remote', '--exit-code', '--heads', 'origin', branchName], { cwd: repoRoot });
              res.statusCode = 409;
              res.end(JSON.stringify({ ok: false, error: `Branch ya existe en origin: ${branchName}` }));
              return;
            } catch { /* no existe — OK */ }

            // Limpiar worktree si quedó de antes
            if (fs.existsSync(worktreePath)) {
              await execFileAsync('git', ['worktree', 'remove', worktreePath, '--force'], { cwd: repoRoot });
            }

            // Worktree desde origin/main actualizado
            await execFileAsync('git', ['fetch', 'origin', 'main'], { cwd: repoRoot });
            await execFileAsync('git', ['worktree', 'add', '--no-checkout', worktreePath, 'origin/main'], { cwd: repoRoot });
            worktreeCreated = true;

            await execFileAsync('git', ['checkout', '-b', branchName], { cwd: worktreePath });
            branchCreated = true;

            // Copiar solo los archivos del artículo al worktree
            const destMdx = path.join(worktreePath, relFilePath);
            await fsp.mkdir(path.dirname(destMdx), { recursive: true });
            await fsp.copyFile(articleFilePath, destMdx);

            const filesToAdd = [relFilePath];
            if (hasCover) {
              const destCover = path.join(worktreePath, relCoverPath);
              await fsp.mkdir(path.dirname(destCover), { recursive: true });
              await fsp.copyFile(coverFilePath, destCover);
              filesToAdd.push(relCoverPath);
            }

            await execFileAsync('git', ['add', ...filesToAdd], { cwd: worktreePath });
            await execFileAsync('git', ['commit', '-m', commitMsg], { cwd: worktreePath });
            await execFileAsync('git', ['push', '-u', 'origin', branchName], { cwd: worktreePath });

            const prBody = [
              `## Artículo: ${frontmatter.title || slug}`,
              '',
              `- **Categoría:** ${categoria}`,
              `- **Keyword:** ${frontmatter.keyword || '—'}`,
              `- **Edad:** ${frontmatter.edadMin}–${frontmatter.edadMax} años`,
              `- **Nivel:** ${frontmatter.nivel || '—'}`,
              '',
              'Publicado desde el Content Manager (admin/) vía botón Publicar.',
            ].join('\n');

            const { stdout: prOut } = await execFileAsync(
              'gh',
              ['pr', 'create', '--base', 'main', '--head', branchName, '--title', commitMsg, '--body', prBody, '--draft'],
              { cwd: worktreePath },
            );

            const prUrl = prOut.trim();
            const prNumber = prUrl.match(/\/pull\/(\d+)$/)?.[1];

            await execFileAsync('git', ['worktree', 'remove', worktreePath, '--force'], { cwd: repoRoot });
            res.end(JSON.stringify({ ok: true, branch: branchName, prUrl, prNumber: prNumber ? parseInt(prNumber, 10) : null }));
          } catch (err) {
            if (worktreeCreated && fs.existsSync(worktreePath)) {
              try { await execFileAsync('git', ['worktree', 'remove', worktreePath, '--force'], { cwd: repoRoot }); } catch { /* ignore */ }
            }
            if (branchCreated && branchName) {
              try { await execFileAsync('git', ['branch', '-D', branchName], { cwd: repoRoot }); } catch { /* ignore */ }
            }
            res.statusCode = 500;
            res.end(JSON.stringify({ ok: false, error: err.message }));
          }
          return;
        }

        const slugParam = pathParts[0] || '';

        // GET /api/articulos → lista completa
        if (req.method === 'GET' && !slugParam) {
          try {
            const articulos = readArticulosRecursive(ARTICULOS_DIR, ARTICULOS_DIR);
            const list = articulos.map(({ slug, categoria, frontmatter }) => ({
              slug,
              categoria,
              frontmatter,
            }));
            res.end(JSON.stringify(list));
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        // GET /api/articulos/:slug
        if (req.method === 'GET' && slugParam) {
          try {
            const articulos = readArticulosRecursive(ARTICULOS_DIR, ARTICULOS_DIR);
            const found = articulos.find((a) => a.slug === slugParam);
            if (!found) {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Artículo no encontrado' }));
              return;
            }
            res.end(JSON.stringify({ frontmatter: found.frontmatter, body: found.body, categoria: found.categoria }));
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        // PUT /api/articulos/:slug
        if (req.method === 'PUT' && slugParam) {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const { frontmatter, body: mdxBody } = JSON.parse(body);
              const articulos = readArticulosRecursive(ARTICULOS_DIR, ARTICULOS_DIR);
              const found = articulos.find((a) => a.slug === slugParam);
              if (!found) {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Artículo no encontrado' }));
                return;
              }
              const updated = matter.stringify(mdxBody || '', frontmatter);
              fs.writeFileSync(found.filePath, updated, 'utf-8');
              res.end(JSON.stringify({ ok: true }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        // DELETE /api/articulos/:slug → borra .mdx + cover en src/assets si existe
        if (req.method === 'DELETE' && slugParam) {
          try {
            const articulos = readArticulosRecursive(ARTICULOS_DIR, ARTICULOS_DIR);
            const found = articulos.find((a) => a.slug === slugParam);
            if (!found) {
              res.statusCode = 404;
              res.end(JSON.stringify({ ok: false, error: 'Artículo no encontrado' }));
              return;
            }
            fs.unlinkSync(found.filePath);
            const coverCandidate = path.join(__dirname, '..', 'src', 'assets', 'articulos', found.categoria, `${slugParam}.jpg`);
            const coverDeleted = fs.existsSync(coverCandidate);
            if (coverDeleted) fs.unlinkSync(coverCandidate);
            res.end(JSON.stringify({ ok: true, coverDeleted }));
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ ok: false, error: err.message }));
          }
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), articulosApiMiddleware()],
  server: {
    port: 4322,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
