// One headless browser page that serves this folder and the site's fonts from disk.
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'node:fs';
import path from 'node:path';

export const HERE = path.dirname(new URL(import.meta.url).pathname);
export const REPO = path.resolve(HERE, '..');
export const OUT = process.env.SOCIAL_OUT ? path.resolve(process.env.SOCIAL_OUT) : `${HERE}/prelaunch`;
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(`${HERE}/.build/cards`, { recursive: true });
const MAP = { '/hina/': `${REPO}/node_modules/@fontsource/hina-mincho/`, '/hanken/': `${REPO}/node_modules/@fontsource-variable/hanken-grotesk/`, '/app/': `${HERE}/` };
const TYPES = { '.css': 'text/css', '.js': 'text/javascript', '.html': 'text/html', '.woff2': 'font/woff2', '.woff': 'font/woff', '.png': 'image/png', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg' };
export async function open(file, width, height) {
  const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.route('http://machiko.local/**', async (route) => {
    const u = new URL(route.request().url());
    for (const [prefix, dir] of Object.entries(MAP)) {
      if (u.pathname.startsWith(prefix)) {
        const f = path.join(dir, decodeURIComponent(u.pathname.slice(prefix.length)));
        if (fs.existsSync(f)) return route.fulfill({ body: fs.readFileSync(f), contentType: TYPES[path.extname(f)] || 'application/octet-stream' });
      }
    }
    return route.fulfill({ status: 404, body: 'no' });
  });
  page.on('pageerror', (e) => console.log('PAGE ERROR', e.message));
  await page.goto(`http://machiko.local/app/${file}`);
  await page.evaluate(() => document.fonts.ready);
  return { browser, page };
}
