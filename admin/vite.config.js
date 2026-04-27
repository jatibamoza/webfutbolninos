import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

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

function articulosApiMiddleware() {
  return {
    name: 'articulos-api',
    configureServer(server) {
      server.middlewares.use('/api/articulos', (req, res, next) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        const url = new URL(req.url, 'http://localhost');
        const slugParam = url.pathname.replace(/^\//, '');

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
              // Re-serializa: gray-matter stringify reconstruye YAML + cuerpo
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
