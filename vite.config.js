import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [
    basicSsl()
  ],
  server: {
    // Espone il server sulla rete locale
    host: true,
    // Porta predefinita di Vite
    port: 5173,
    // Forza l'uso di HTTPS (necessario per Service Worker e Notifiche)
    https: true
  },
  build: {
    // Assicura che i file vengano copiati correttamente per GitHub Pages
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  }
});
