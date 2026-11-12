import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { appendFileSync, writeFileSync } from 'node:fs';

// Machiko — site + guest app in one Vite build.
// The PWA manifest installs the guest app (start_url /app/); the marketing
// site is served from the same bundle and the same service worker.
//
// VITE_BASE sets the public path: '/' on your own domain (SiteGround),
// '/matcha-shop/' for the GitHub Pages preview (see .github/workflows).
const base = process.env.VITE_BASE || '/';

// Search engines. On the real domain the build writes sitemap.xml and points
// robots.txt at it. Anywhere else (the GitHub Pages preview) every page asks
// not to be indexed, so the preview never competes with the real site.
function searchFiles() {
  const site = (process.env.VITE_SITE_URL || '').replace(/\/$/, '');
  const real = base === '/' && site;
  return {
    name: 'machiko-search-files',
    apply: 'build',
    transformIndexHtml(html) {
      // What the page may load and talk to: itself, the photographs that are
      // still on Pexels, and the two places the forms post to.
      const origin = (u) => { try { return new URL(u).origin; } catch { return ''; } };
      const connect = ["'self'", origin(process.env.VITE_API_URL), origin(process.env.VITE_JOIN_ENDPOINT), origin(process.env.VITE_RESERVE_WEBHOOK)].filter(Boolean).join(' ');
      const csp = `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://images.pexels.com; font-src 'self' data:; connect-src ${connect} https://images.pexels.com; manifest-src 'self'; worker-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'`;
      const extra = [`<meta http-equiv="Content-Security-Policy" content="${csp}" />`];
      if (base !== '/') extra.push('<meta name="robots" content="noindex" />');
      return html.replace('</title>', `</title>\n    ${extra.join('\n    ')}`);
    },
    async closeBundle() {
      if (!real) return;
      const { PUBLISHED } = await import('./src/data/journal.js');
      const paths = ['', 'menu', 'matcha', 'visit', 'journal', ...PUBLISHED.map((s) => `journal/${s.slug}`), 'join', 'privacy'];
      const urls = paths.map((p) => `  <url><loc>${site}/${p}</loc></url>`).join('\n');
      writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
      appendFileSync('dist/robots.txt', `\nSitemap: ${site}/sitemap.xml\n`);
    }
  };
}

export default defineConfig({
  base,
  plugins: [
    react(),
    searchFiles(),
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
