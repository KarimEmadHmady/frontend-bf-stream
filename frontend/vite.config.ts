import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'src', // Adjust this if necessary
  build: {
    outDir: '../dist', // Adjust if your output directory should be different
    rollupOptions: {
      input: {
        main: 'src/main.jsx', // Ensure this path is correct
      },
    },
    assetsDir: 'assets',
    base: '/', // Ensure this is correct for your deployment context
  },
});
