import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],server: {
    proxy: {
      '/api': 'https://ruda-backend-ny14.onrender.com'  // or whatever your Express port is
    }
  }
})
