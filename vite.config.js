import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import prerender from 'vite-plugin-prerender';
// import { prerenderRoutes } from './src/prerenderRoutes.js';

export default defineConfig({
  base: '/', 
  plugins: [
    react(),
    // prerender({
    //   staticDir: 'dist',
    //   routes: prerenderRoutes,
    //   rendererOptions: {
    //     renderAfterDocumentEvent: 'render-event'
    //   }
    // })
  ],
  server: {
    port: 3000,
    hmr: { overlay: true }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});
