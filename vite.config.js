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
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          icons: ['react-icons'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    allowedHosts: [
      '91eabca5-9690-42c5-b018-e4a300e404e7-00-37imt1874rpo6.worf.replit.dev',
      '.replit.dev',
      'localhost'
    ]
  }
})
