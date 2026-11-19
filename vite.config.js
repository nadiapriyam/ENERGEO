import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

// Relative base so the same build works on GitHub Pages (/ENERGEO/) and as a standalone preview.
// The app (index.html), the read-only research progress preview (research-preview/index.html), and the two levels on
// one page at try/ (docs/levels_spec.md): Level 1, the violin, then Level 2, the MRI scanner. try/level-2/ and notebook/
// forward to try/.
export default defineConfig({
  base: './',
  server: { fs: { allow: ['.'] } },
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 900,
    rollupOptions: { input: { main: resolve(here, 'index.html'), preview: resolve(here, 'research-preview/index.html'), try: resolve(here, 'try/index.html'), level2: resolve(here, 'try/level-2/index.html'), notebook: resolve(here, 'notebook/index.html') } },
  },
});
