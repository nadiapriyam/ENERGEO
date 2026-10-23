import { defineConfig } from 'vite';

// Relative base so the same build works on GitHub Pages (/ENERGEO/) and as a standalone preview.
export default defineConfig({
  base: './',
  server: { fs: { allow: ['.'] } },
  build: { target: 'es2022', chunkSizeWarningLimit: 900 },
});
