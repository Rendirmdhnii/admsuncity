import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logocpt.png', 'icon-192x192.png', 'icon-512x512.png'],
      manifest: {
        name: 'Manajemen Properti - Sistem Administrasi Digital',
        short_name: 'Manajemen Properti',
        description: 'Sistem Administrasi Digital Pembuat Surat & Invoice Properti',
        theme_color: '#0f172a',
        background_color: '#f8fafc',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})
