// Clean screenshots of a running build, for a portfolio or a press kit.
//   npm run build && npx vite preview --port 4173 &
//   SHOTS_URL=http://localhost:4173 node scripts/shots.mjs
// Needs: npm i --no-save playwright && npx playwright install chromium
// Motion is switched off so every picture shows the finished state; the home
// page is opened with ?live so the bowl is drawn even without a graphics card.
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';

const { chromium } = createRequire(import.meta.url)('playwright');
const BASE = (process.env.SHOTS_URL || 'http://localhost:4173').replace(/\/$/, '');
const OUT = process.env.SHOTS_OUT || 'shots';
mkdirSync(OUT, { recursive: true });

const PAGES = [
  ['home', '/?live'], ['menu', '/menu'], ['matcha', '/matcha'], ['visit', '/visit'],
  ['journal', '/journal'], ['story', '/journal/twenty-days-in-the-shade'], ['join', '/join']
];
const APP = [['app-today', '/app'], ['app-order', '/app/order'], ['app-stamps', '/app/stamps'], ['app-reserve', '/app/reserve']];

async function settle(page) {
  await page.waitForLoadState('networkidle').catch(() => {});
  // walk down once so every photograph loads, then come back up
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 600) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(120); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(1500);
}

const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const base = { reducedMotion: 'reduce', locale: 'en-US', colorScheme: 'light' };
const sets = [
  ['desktop', { ...base, viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }, PAGES],
  ['wide', { ...base, viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }, PAGES.slice(0, 3)],
  ['phone', { ...base, viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true }, [...PAGES, ...APP]]
];
for (const [name, options, list] of sets) {
  const ctx = await browser.newContext(options);
  await ctx.addInitScript(() => { try { sessionStorage.setItem('machiko.preview', '1'); } catch { /* private mode */ } });
  const page = await ctx.newPage();
  for (const [key, path] of list) {
    await page.goto(BASE + path, { waitUntil: 'domcontentloaded' });
    await settle(page);
    if (name === 'wide') await page.screenshot({ path: `${OUT}/full-${key}.jpg`, type: 'jpeg', quality: 90, fullPage: true });
    else await page.screenshot({ path: `${OUT}/${name}-${key}.jpg`, type: 'jpeg', quality: 93 });
    console.log(name, key);
  }
  if (name === 'desktop') {   // two more of the home page, further down
    await page.goto(`${BASE}/?live`, { waitUntil: 'domcontentloaded' }); await settle(page);
    for (const [key, sel] of [['home-offers', '.offers, [class*="offer"]'], ['home-calm', '.calm']]) {
      const el = page.locator(sel).first();
      if (await el.count()) { await el.scrollIntoViewIfNeeded(); await page.evaluate(() => window.scrollBy(0, -90)); await page.waitForTimeout(700); await page.screenshot({ path: `${OUT}/desktop-${key}.jpg`, type: 'jpeg', quality: 93 }); console.log(name, key); }
    }
  }
  await ctx.close();
}
await browser.close();
