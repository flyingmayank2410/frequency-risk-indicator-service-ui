import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react()],
  root: '.', // Make sure root is set correctly
  publicDir: 'public', // This is the default, but you can be explicit
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './public/index.html', // 👈 This line is important
    },
  },
});
