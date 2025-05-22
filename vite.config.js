import { defineConfig } from 'vite';

export default defineConfig({
  root: '.', // Set root to current directory
  base: './', // Ensures relative paths (good for deployment in subfolders like GitHub Pages)
  build: {
    outDir: 'dist', // Output directory
    emptyOutDir: true, // Clean before build
  },
  server: {
    open: true, // Opens browser on dev server start
  }
});
