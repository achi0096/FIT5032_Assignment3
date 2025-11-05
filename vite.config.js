import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: { globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}'] },
      manifest: {
        name: 'Youth Mental Health & Wellbeing',
        short_name: 'YMHW',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0d6efd',
        icons: [
          { src: '/logo-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/logo-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
