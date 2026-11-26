import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/HAN-LAB-by-NOVA/', // Имя репозитория на GitHub
  devtools: {
    // Remove this `apply` property to enable devtools for build as well
    apply: 'serve',
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Хань-Лаб by Nova',
        short_name: 'Хань-Лаб',
        description: 'Универсальный тренажёр китайского языка',
        theme_color: '#F6F1E7',
        background_color: '#F6F1E7',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/HAN-LAB-by-NOVA/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/HAN-LAB-by-NOVA/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/HAN-LAB-by-NOVA/icon-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
})
