import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/conversations': {
        target: 'http://15.207.173.143',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/conversations/, '/conversations'  ),  
      },
      '/audio': {
        target: 'http://15.207.173.143',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/audio/, '/audio'),
      },
      
    }
  }
})
