// QA for the site, in a real browser.
//
//   QA_URL=https://machiko.rs node scripts/qa.mjs        (the live site; default)
//   QA_URL=http://localhost:4173 node scripts/qa.mjs     (a local `npm run preview`)
//
// It needs Playwright and axe-core (the QA workflow installs both):
//   npm i --no-save playwright axe-core && npx playwright install chromium
//
// What it checks: the server (redirects, file types, caching, private files),
// every page on a phone and on a desktop (script errors, failed requests,
// broken images, sideways scrolling, one h1, a title, alt text, links that
// lead nowhere), accessibility (axe-core, WCAG 2 A and AA), and the things
// people do: change language, open the menu, tap a card, sign up, use the app.
// Screenshots go to qa-out/. Exit code 1 if anything failed.
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
let axeSource = '';
try { axeSource = require('axe-core').source; } catch { axeSource = ''; }

const BASE = (process.env.QA_URL || 'https://machiko.rs').replace(/\/$/, '');
const HOST = new URL(BASE).host;
const LIVE = !/localhost|127\.0\.0\.1/.test(HOST);
const OUT = process.env.QA_OUT || 'qa-out';
mkdirSync(OUT, { recursive: true });

const rows = [];
const add = (level, area, what, detail = '') => { rows.push({ level, area, what, detail }); console.log(`${level.padEnd(4)} ${area.padEnd(14)} ${what}${detail ? ` — ${detail}` : ''}`); };
const pass = (a, w, d) => add('PASS', a, w, d);
const warn = (a, w, d) => add('WARN', a, w, d);
const fail = (a, w, d) => add('FAIL', a, w, d);
const check = (cond, a, w, d) => (cond ? pass(a, w, d) : fail(a, w, d));

const STORIES = ['twenty-days-in-the-shade', 'usucha-and-koicha', 'a-menu-of-twenty-four-seasons', 'how-to-whisk-a-bowl-at-home'];
const PAGES = ['/', '/menu', '/matcha', '/visit', '/journal', ...STORIES.map((s) => `/journal/${s}`), '/join', '/privacy'];
const KNOWN = new Set([...PAGES, '/app', '/app/', '/app/order', '/app/stamps', '/app/reserve', '/app/cart']);

// ---------------------------------------------------------------- server
async function head(url, opts = {}) {
  try { const r = await fetch(url, { redirect: 'manual', ...opts }); return { status: r.status, h: r.headers, text: opts.body === false ? '' : await r.text().catch(() => '') }; }
  catch (e) { return { status: 0, h: new Headers(), text: '', err: String(e.cause?.code || e.message) }; }
}
async function server() {
  const A = 'server';
  if (LIVE) {
    const plain = await head(`http://${HOST}/`);
    check([301, 302, 307, 308].includes(plain.status) && (plain.h.get('location') || '').startsWith('https://'), A, 'http:// goes to https://', `${plain.status} ${plain.h.get('location') || plain.err || ''}`);
    const www = await head(`https://www.${HOST}/`);
    if (www.status === 0) warn(A, 'www address does not answer', www.err);
    else if ([301, 302, 307, 308].includes(www.status)) pass(A, 'www goes to the main address', www.h.get('location') || '');
    else warn(A, 'www answers with its own copy instead of redirecting', `status ${www.status}`);
  }
  const home = await head(`${BASE}/`);
  check(home.status === 200 && /text\/html/.test(home.h.get('content-type') || ''), A, 'home page answers', `${home.status} ${home.h.get('content-type')}`);
  if (LIVE) {
    (/no-cache|max-age=0|no-store/.test(home.h.get('cache-control') || '') ? pass : warn)(A, 'the page itself is not cached for long', home.h.get('cache-control') || 'no cache-control header');
    (home.h.get('strict-transport-security') ? pass : warn)(A, 'HSTS header', home.h.get('strict-transport-security') || 'missing');
    (home.h.get('x-content-type-options') ? pass : warn)(A, 'X-Content-Type-Options header', home.h.get('x-content-type-options') || 'missing');
  }
  for (const p of ['/menu', '/journal/usucha-and-koicha', '/app/order']) {
    const r = await head(`${BASE}${p}`);
    check(r.status === 200 && r.text.includes('<div id="root">'), A, `deep link ${p} opens the app`, `status ${r.status}`);
  }
  const js = (home.text.match(/\/assets\/index-[^"]+\.js/) || [])[0];
  const css = (home.text.match(/\/assets\/index-[^"]+\.css/) || [])[0];
  check(Boolean(js && css), A, 'page references its script and stylesheet', `${js} ${css}`);
  const files = [
    ['/robots.txt', /text\/plain/, (t) => /Sitemap:/.test(t) || !LIVE, 'robots.txt names the sitemap'],
    ['/sitemap.xml', /xml/, (t) => t.includes(`${BASE}/menu`) || !LIVE, 'sitemap.xml lists the pages'],
    ['/manifest.webmanifest', /manifest\+json|application\/json/, (t) => t.includes('"start_url"'), 'app manifest'],
    ['/sw.js', /javascript/, () => true, 'service worker'],
    ['/favicon.svg', /svg/, () => true, 'favicon'],
    ['/brand/og-image.jpg', /image\/jpeg/, () => true, 'share image'],
    ['/icons/apple-touch-icon.png', /image\/png/, () => true, 'home-screen icon']
  ];
  for (const [p, type, test, label] of files) {
    const r = await head(`${BASE}${p}`);
    check(r.status === 200 && type.test(r.h.get('content-type') || '') && test(r.text), A, label, `${p} → ${r.status} ${r.h.get('content-type') || r.err || ''}`);
  }
  if (js) {
    const r = await head(`${BASE}${js}`, { headers: { 'accept-encoding': 'br, gzip' } });
    check(r.status === 200, A, 'script file loads', `${r.status}`);
    if (LIVE) {
      (/(br|gzip)/.test(r.h.get('content-encoding') || '') ? pass : warn)(A, 'script is compressed', r.h.get('content-encoding') || 'not compressed');
      (/max-age=(\d{6,})/.test(r.h.get('cache-control') || '') ? pass : warn)(A, 'script is cached for a long time', r.h.get('cache-control') || 'no cache-control');
    }
  }
  if (LIVE) {
    const sw = await head(`${BASE}/sw.js`);
    (!/max-age=(\d{5,})/.test(sw.h.get('cache-control') || '') ? pass : warn)(A, 'service worker is not cached for long', sw.h.get('cache-control') || 'no cache-control');
    for (const p of ['/.htaccess', '/.htaccess.before-machiko', '/.git/config', '/.env', '/package.json']) {
      const r = await head(`${BASE}${p}`);
      const leaked = r.status === 200 && !r.text.includes('<div id="root">');
      check(!leaked, A, `private file ${p} is not served`, `status ${r.status}`);
    }
  }
}

// ---------------------------------------------------------------- pages
const NOISE = /GL Driver|GroupMarker|WebGL|swiftshader|Automatic fallback to software/i;
const EXTERNAL = /images\.pexels\.com/;   // photographs not yet prepared load from Pexels; a sandbox may block that
function watch(page, bucket) {
  page.on('pageerror', (e) => bucket.errors.push(String(e.message || e).slice(0, 200)));
  page.on('console', (m) => { if (m.type() === 'error' && !NOISE.test(m.text()) && !/Failed to load resource/.test(m.text())) bucket.errors.push(m.text().slice(0, 200)); });
  page.on('requestfailed', (r) => { if (!LIVE && EXTERNAL.test(r.url())) return; if (!/favicon|google|doubleclick/.test(r.url()) && r.failure()?.errorText !== 'net::ERR_ABORTED') bucket.failed.push(`${r.failure()?.errorText} ${r.url().replace(BASE, '')}`.slice(0, 160)); });
  page.on('response', (r) => { if (r.status() >= 400) bucket.failed.push(`${r.status()} ${r.url().replace(BASE, '')}`.slice(0, 160)); });
}
async function walkDown(page) {
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = page.viewportSize().height;
  for (let y = 0; y < total; y += step) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(120); }
  await page.waitForTimeout(500);
}
async function pages(browser) {
  const sizes = [['phone', { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 }], ['desktop', { viewport: { width: 1440, height: 900 } }]];
  const titles = new Map(); const links = new Set(); const axeSeen = new Map();
  for (const [size, opts] of sizes) {
    const ctx = await browser.newContext({ ...opts, serviceWorkers: 'block', locale: 'en-GB' });
    for (const path of PAGES) {
      const A = `${size} ${path}`.slice(0, 14);
      const page = await ctx.newPage();
      const seen = { errors: [], failed: [] };
      watch(page, seen);
      try {
        await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 45000 });
        await page.waitForTimeout(path === '/' ? 1800 : 500);
        await walkDown(page);
        const d = await page.evaluate((live) => ({
          title: document.title, h1: document.querySelectorAll('h1').length, lang: document.documentElement.lang,
          desc: document.querySelector('meta[name="description"]')?.content || '',
          overflow: document.documentElement.scrollWidth - window.innerWidth,
          broken: [...document.images].filter((i) => !(i.complete && i.naturalWidth > 0)).map((i) => i.currentSrc || i.src).filter((u) => live || !/images\.pexels\.com/.test(u)).map((u) => u.split('/').pop()).slice(0, 5),
          noAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).length,
          images: document.images.length,
          links: [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')),
          emptyLinks: [...document.querySelectorAll('a')].filter((a) => !a.textContent.trim() && !a.getAttribute('aria-label')).length
        }), LIVE);
        const where = `${size} ${path}`;
        check(seen.errors.length === 0, 'page', `${where}: no script errors`, seen.errors.slice(0, 2).join(' | '));
        check(seen.failed.length === 0, 'page', `${where}: every request succeeds`, [...new Set(seen.failed)].slice(0, 3).join(' | '));
        check(d.overflow <= 1, 'page', `${where}: no sideways scrolling`, d.overflow > 1 ? `${d.overflow}px too wide` : '');
        check(d.broken.length === 0, 'page', `${where}: ${d.images} images load`, d.broken.join(', '));
        check(d.h1 === 1, 'page', `${where}: one main heading`, `${d.h1} h1`);
        check(d.noAlt === 0 && d.emptyLinks === 0, 'page', `${where}: images described, links named`, `${d.noAlt} images without alt, ${d.emptyLinks} unnamed links`);
        if (size === 'phone') {
          check(Boolean(d.title) && Boolean(d.lang), 'page', `${where}: has a title and a language`, d.title);
          if (titles.has(d.title)) warn('page', `${path} has the same title as ${titles.get(d.title)}`, d.title); else titles.set(d.title, path);
          for (const h of d.links) if (h && h.startsWith('/') && !h.startsWith('//')) links.add(h.split('#')[0].replace(/\/$/, '') || '/');
        }
        if (axeSource) {
          await page.evaluate(() => window.scrollTo(0, 0));
          // headings fade in as they are scrolled to; measure them as they are read
          await page.addStyleTag({ content: '.ink > span, .unveil, .foot__word { animation: none !important; }' });
          await page.addScriptTag({ content: axeSource });
          const res = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })).violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, at: v.nodes[0].target.join(' '), why: (v.nodes[0].failureSummary || '').split('\n').slice(1, 2).join(' ').trim() })));
          const fresh = res.filter((v) => !axeSeen.has(`${v.id}|${v.at}`));
          for (const v of res) axeSeen.set(`${v.id}|${v.at}`, true);
          if (!res.length) pass('accessibility', `${where}: no WCAG A/AA problems found`);
          for (const v of fresh) (v.impact === 'critical' || v.impact === 'serious' ? fail : warn)('accessibility', `${where}: ${v.id} (${v.impact}, ${v.n}×)`, `${v.at} — ${v.why}`.slice(0, 220));
        }
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(300);
        await page.screenshot({ path: `${OUT}/${size}${path === '/' ? '-home' : path.replace(/\//g, '-')}.png` });
      } catch (e) { fail('page', `${size} ${path}: could not be checked`, String(e.message).split('\n')[0]); }
      await page.close();
    }
    await ctx.close();
  }
  const dead = [...links].filter((l) => !KNOWN.has(l) && !l.startsWith('/brand') && !l.startsWith('/app'));
  check(dead.length === 0, 'links', `${links.size} internal links all lead to a page`, dead.join(', '));
}

// ---------------------------------------------------------------- what people do
async function flows(browser) {
  const A = 'flow';
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, serviceWorkers: 'block', locale: 'en-GB' });
  const page = await ctx.newPage();
  const seen = { errors: [], failed: [] }; watch(page, seen);
  const step = async (name, fn) => { try { const r = await fn(); if (r !== undefined && r !== true) fail(A, name, String(r)); else pass(A, name); } catch (e) { fail(A, name, String(e.message).split('\n')[0].slice(0, 180)); } };

  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' }); await page.waitForTimeout(2500);
  await step('the bowl is drawn live (WebGL)', async () => (await page.evaluate(() => getComputedStyle(document.querySelector('.bowl__still')).opacity === '0')) || 'the still fallback is showing');
  await step('hero text is visible', async () => (await page.evaluate(() => getComputedStyle(document.querySelector('.hero h1 .line > span')).transform)) !== undefined && (await page.locator('.hero h1').isVisible()));
  await step('menu sheet opens and closes', async () => {
    await page.click('.burger'); await page.waitForTimeout(500);
    if (!(await page.locator('.sheet.is-open').count())) return 'sheet did not open';
    await page.keyboard.press('Escape'); await page.waitForTimeout(400);
    return (await page.locator('.sheet.is-open').count()) === 0 || 'Escape did not close it';
  });
  await step('language switches to Serbian and is remembered', async () => {
    await page.click('.burger'); await page.waitForTimeout(400);
    await page.click('.sheet .lang button:has-text("SR")'); await page.waitForTimeout(400);
    const sr = await page.locator('.hero h1').innerText();
    if (!/Beogradu/.test(sr)) return `headline is "${sr}"`;
    await page.reload({ waitUntil: 'networkidle' }); await page.waitForTimeout(800);
    const again = await page.locator('.hero h1').innerText();
    const lang = await page.evaluate(() => document.documentElement.lang);
    if (!/Beogradu/.test(again)) return 'not remembered after a reload';
    if (lang !== 'sr') return `html lang is "${lang}" while the page is in Serbian`;
    await page.click('.burger'); await page.waitForTimeout(300);
    await page.click('.sheet .lang button:has-text("EN")'); await page.waitForTimeout(300);
    await page.keyboard.press('Escape'); await page.waitForTimeout(300);
    return true;
  });
  await step('tapping an offer card opens its page at the top', async () => {
    await page.locator('.offer').first().scrollIntoViewIfNeeded(); await page.waitForTimeout(300);
    await page.locator('.offer').first().click(); await page.waitForTimeout(1500);
    const y = await page.evaluate(() => window.scrollY);
    return (page.url().endsWith('/matcha') && y < 5) || `at ${page.url()} scroll ${y}`;
  });
  await step('browser Back returns to the home page', async () => { await page.goBack(); await page.waitForTimeout(900); return new URL(page.url()).pathname === '/' || page.url(); });
  await step('menu tab jumps to its section', async () => {
    await page.goto(`${BASE}/menu`, { waitUntil: 'networkidle' }); await page.waitForTimeout(500);
    await page.click('.tabs a[href="#kitchen"]'); await page.waitForTimeout(1800);
    const top = await page.evaluate(() => Math.round(document.getElementById('kitchen').getBoundingClientRect().top));
    return (top > 40 && top < 260) || `section top is at ${top}px`;
  });
  await step('link straight to a menu section lands on it', async () => {
    await page.goto(`${BASE}/menu#coffee`, { waitUntil: 'networkidle' }); await page.waitForTimeout(1200);
    const top = await page.evaluate(() => Math.round(document.getElementById('coffee').getBoundingClientRect().top));
    return (top > 40 && top < 260) || `section top is at ${top}px`;
  });
  await step('unknown address shows the not-found page', async () => { await page.goto(`${BASE}/no-such-page`, { waitUntil: 'networkidle' }); await page.waitForTimeout(400); return /does not exist/.test(await page.locator('h1').innerText()); });

  // the founding list
  await page.goto(`${BASE}/join`, { waitUntil: 'networkidle' }); await page.waitForTimeout(500);
  await step('join: an empty form is not sent', async () => { await page.click('button[type="submit"]'); await page.waitForTimeout(300); return (await page.evaluate(() => !document.querySelector('form').checkValidity())) || 'the form accepted an empty email'; });
  await step('join: email without consent is refused', async () => {
    await page.fill('input[name="EMAIL"]', 'qa-check@example.com'); await page.click('button[type="submit"]'); await page.waitForTimeout(400);
    return (await page.locator('.form__problem').count()) === 1 || 'no message about consent';
  });
  if (process.env.QA_SUBMIT === '1') {
    await step('join: a full sign-up is accepted', async () => {
      await page.fill('input[name="FIRSTNAME"]', 'QA'); await page.check('.check input >> nth=0'); await page.click('button[type="submit"]'); await page.waitForTimeout(3000);
      return (await page.locator('.form__done').count()) === 1 || `message: ${await page.locator('.form__problem').innerText().catch(() => 'none')}`;
    });
  } else {
    await page.check('.check input >> nth=0'); await page.click('button[type="submit"]'); await page.waitForTimeout(1500);
    const msg = await page.locator('.form__problem').innerText().catch(() => '');
    const done = await page.locator('.form__done').count();
    if (done) pass(A, 'join: sign-up goes through');
    else if (/not connected|nije povezan/i.test(msg)) warn(A, 'join: the form is not connected to a list yet', msg.slice(0, 120));
    else fail(A, 'join: sign-up', msg.slice(0, 160) || 'no confirmation and no message');
  }

  // keyboard
  await step('keyboard: first Tab reaches "skip to the page"', async () => {
    const p2 = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' })).newPage();
    await p2.goto(`${BASE}/`, { waitUntil: 'networkidle' }); await p2.keyboard.press('Tab');
    const first = await p2.evaluate(() => document.activeElement?.className || document.activeElement?.tagName);
    await p2.keyboard.press('Tab'); await p2.keyboard.press('Tab');
    const ring = await p2.evaluate(() => { const s = getComputedStyle(document.activeElement); return s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0; });
    await p2.context().close();
    if (first !== 'skip') return `first focus is ${first}`;
    return ring || 'no visible focus ring on links';
  });
  await step('reduced motion: page shows without animation', async () => {
    const c2 = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
    const p2 = await c2.newPage(); const s2 = { errors: [], failed: [] }; watch(p2, s2);
    await p2.goto(`${BASE}/`, { waitUntil: 'networkidle' }); await p2.waitForTimeout(1500);
    const op = await p2.evaluate(() => getComputedStyle(document.querySelector('.hero__bowl')).opacity);
    await c2.close();
    return (op === '1' && !s2.errors.length) || `bowl opacity ${op}, errors ${s2.errors.length}`;
  });
  await step('no WebGL: a still bowl takes its place', async () => {
    const c2 = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
    await c2.addInitScript(() => { HTMLCanvasElement.prototype.getContext = () => null; });
    const p2 = await c2.newPage(); const s2 = { errors: [], failed: [] }; watch(p2, s2);
    await p2.goto(`${BASE}/`, { waitUntil: 'networkidle' }); await p2.waitForTimeout(1200);
    const op = await p2.evaluate(() => getComputedStyle(document.querySelector('.bowl__still')).opacity);
    await c2.close();
    return (op === '1' && !s2.errors.length) || `still bowl opacity ${op}, errors ${s2.errors.join('|')}`;
  });

  // the guest app
  await step('app: opens', async () => { await page.goto(`${BASE}/app`, { waitUntil: 'networkidle' }); await page.waitForTimeout(900); return (await page.locator('.app-shell').count()) === 1 || 'no app shell'; });
  const gated = await page.locator('[data-app-closed]').count();
  if (gated) {
    pass(A, 'app: says it opens with the shop and takes no orders yet');
    await step('app: preview mode can be entered', async () => { await page.click('[data-app-preview]'); await page.waitForTimeout(700); return (await page.locator('.app-nav').count()) === 1 || 'preview did not open'; });
  } else if (LIVE) {
    warn(A, 'app: takes orders although the shop is not open', 'orders stay on the phone and reach nobody');
  }
  await step('app: order ahead, from menu to ticket', async () => {
    await page.goto(`${BASE}/app/order`, { waitUntil: 'networkidle' }); await page.waitForTimeout(700);
    if (await page.locator('[data-app-preview]').count()) { await page.click('[data-app-preview]'); await page.waitForTimeout(500); await page.goto(`${BASE}/app/order`, { waitUntil: 'networkidle' }); await page.waitForTimeout(500); }
    await page.locator('a.row').first().click(); await page.waitForTimeout(900);
    await page.click('button:has-text("Add to order")'); await page.waitForTimeout(600);
    await page.click('a:has-text("View order")'); await page.waitForTimeout(800);
    await page.fill('#guest-name', 'QA'); await page.click('button:has-text("Confirm order")'); await page.waitForTimeout(1200);
    return (/\/app\/status\//.test(page.url()) && (await page.locator('.ticket__num').count()) === 1) || `ended at ${page.url()}`;
  });
  await step('app: reserve form sends', async () => {
    await page.goto(`${BASE}/app/reserve`, { waitUntil: 'networkidle' }); await page.waitForTimeout(600);
    const d = new Date(Date.now() + 200 * 86400000).toISOString().slice(0, 10);
    await page.fill('#r-date', d); await page.fill('#r-time', '10:00'); await page.fill('#r-name', 'QA');
    await page.click('button[type="submit"]'); await page.waitForTimeout(1500);
    return (await page.locator('form').count()) === 0 || 'the form is still showing';
  });
  check(seen.errors.length === 0, A, 'no script errors during these steps', [...new Set(seen.errors)].slice(0, 3).join(' | '));
  await ctx.close();
}

// ---------------------------------------------------------------- run
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
try { await server(); await pages(browser); await flows(browser); }
catch (e) { fail('qa', 'the checks stopped early', String(e.message).split('\n')[0]); }
await browser.close();

const count = (l) => rows.filter((r) => r.level === l).length;
const summary = `\n${count('PASS')} passed, ${count('WARN')} to look at, ${count('FAIL')} failed — ${BASE}`;
console.log(summary);
writeFileSync(`${OUT}/report.json`, JSON.stringify({ base: BASE, at: new Date().toISOString(), rows }, null, 1));
writeFileSync(`${OUT}/report.md`, `# QA — ${BASE}\n\n${summary.trim()}\n\n| | Area | Check | Detail |\n| --- | --- | --- | --- |\n${rows.filter((r) => r.level !== 'PASS').map((r) => `| ${r.level} | ${r.area} | ${r.what} | ${r.detail.replace(/\|/g, '/')} |`).join('\n')}\n`);
process.exit(count('FAIL') ? 1 : 0);
