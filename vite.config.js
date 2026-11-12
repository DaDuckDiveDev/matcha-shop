import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Machiko — site + guest app in one Vite build.
// The PWA manifest installs the guest app (start_url /app/); the marketing
// site is served from the same bundle and the same service worker.
//
// VITE_BASE sets the public path: '/' on your own domain (SiteGround),
// '/matcha-shop/' for the GitHub Pages preview (see .github/workflows).
const base = process.env.VITE_BASE || '/';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Machiko — matcha house',
        short_name: 'Machiko',
        description: 'Order ahead, collect stamps and reserve a seat at Machiko, Belgrade.',
        lang: 'en',
        start_url: `${base}app/`,
        scope: base,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#FBFAF6',
        theme_color: '#FBFAF6',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        navigateFallback: `${base}index.html`,
        // The shell, the two text fonts and the icons are kept for offline use;
        // photographs are cached as they are seen.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        globIgnores: ['photos/**', 'brand/**', '**/*cyrillic*', '**/*vietnamese*'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.includes('/photos/') || url.hostname === 'images.pexels.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'photos',
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }
    })
  ],
  server: { port: 5173 },
  build: { target: 'es2020' }
});
