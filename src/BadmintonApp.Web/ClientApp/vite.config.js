import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../wwwroot/js',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/main.jsx')
      }
    }
  },
  server: {
    proxy: {
      '/api': 'https://localhost:5001'
    }
  }
})
