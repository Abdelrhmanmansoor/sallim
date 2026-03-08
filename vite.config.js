import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    allowedHosts: [
      '91eabca5-9690-42c5-b018-e4a300e404e7-00-37imt1874rpo6.worf.replit.dev',
      '.replit.dev',
      'localhost'
    ]
  }
})
