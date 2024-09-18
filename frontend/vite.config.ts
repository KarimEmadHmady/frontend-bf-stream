import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'src',
  build: {
    outDir: '../dist', // Ensure this is correct
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'src/main.jsx', // Path to your entry file
      },
    },
    base: '/', // This should be correct for deployment
  },
});
