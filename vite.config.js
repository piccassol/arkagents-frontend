import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  envPrefix: 'VITE_', // Ensures VITE_* vars are loaded
  server: {
    proxy: {
      '/api': 'https://api.arktechnologies.ai' // Backend proxy
    }
  }
});