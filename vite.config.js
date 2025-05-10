import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './', // Si tu sitio está en un subdirectorio, ajusta la ruta
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor' // Separa las dependencias en un archivo aparte
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000 // Ajusta el límite según lo necesario
  }
})
