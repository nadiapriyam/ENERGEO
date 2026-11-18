import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

// Relative base so the same build works on GitHub Pages (/ENERGEO/) and as a standalone preview.
// Four pages: the app (index.html), the read-only research progress preview (research-preview/index.html), Nadia's
// Inventions Notebook (notebook/index.html, docs/notebook_spec.md) and try/index.html, which now opens the notebook.
export default defineConfig({
  base: './',
  server: { fs: { allow: ['.'] } },
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 900,
    rollupOptions: { input: { main: resolve(here, 'index.html'), preview: resolve(here, 'research-preview/index.html'), try: resolve(here, 'try/index.html'), notebook: resolve(here, 'notebook/index.html') } },
  },
});
