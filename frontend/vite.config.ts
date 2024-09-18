import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'src',
  build: {
    outDir: '../dist', // Output directory for built files
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'src/main.jsx', // Entry point for your app
      },
    },
    base: '/', // Base URL for the deployment
  },
});
