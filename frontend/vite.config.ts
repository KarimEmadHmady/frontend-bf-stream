import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'src',
  build: {
    outDir: '../dist', // Ensure this matches your Netlify publish directory
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'src/main.jsx',
      },
    },
    base: '/', // Ensure this is correct for your deployment context
  },
});
