import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  //server: {
  //  historyApiFallback: true, // React Router
  //},
  server: {
    proxy: {
      '/api': {
        target: 'https://libreria-backend-products-production.up.railway.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/rentals': {
      target: 'https://libreria-backend-rented-production.up.railway.app',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/rentals/, ''),
    },
    },
  },
})
