// Lighthouse on a phone profile for the pages that matter most.
//   QA_URL=https://machiko.rs node scripts/lighthouse.mjs
// Needs: npm i --no-save lighthouse playwright && npx playwright install chromium
// Scores and the audits that did not pass are printed; full reports go to qa-out/.
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const BASE = (process.env.QA_URL || 'https://machiko.rs').replace(/\/$/, '');
const OUT = process.env.QA_OUT || 'qa-out';
const PAGES = (process.env.LH_PAGES || '/,/menu,/join').split(',');
mkdirSync(OUT, { recursive: true });
const chrome = process.env.CHROME_PATH || require('playwright').chromium.executablePath();
const lines = [];
const say = (s) => { console.log(s); lines.push(s); };

for (const path of PAGES) {
  const file = `${OUT}/lighthouse${path === '/' ? '-home' : path.replace(/\//g, '-')}.json`;
  try {
    execFileSync('npx', ['lighthouse', BASE + path, '--quiet', '--output=json', `--output-path=${file}`,
      '--only-categories=performance,accessibility,best-practices,seo',
      '--chrome-flags=--headless=new --no-sandbox --enable-unsafe-swiftshader --ignore-gpu-blocklist'],
    { env: { ...process.env, CHROME_PATH: chrome }, stdio: ['ignore', 'ignore', 'pipe'], timeout: 240000 });
  } catch (e) { say(`LIGHTHOUSE ${path}: did not finish (${String(e.message).split('\n')[0].slice(0, 120)})`); continue; }
  const r = JSON.parse(readFileSync(file, 'utf8'));
  const score = (k) => Math.round((r.categories[k]?.score ?? 0) * 100);
  const m = (id) => r.audits[id]?.displayValue || '?';
  say(`LIGHTHOUSE ${path}: performance ${score('performance')}, accessibility ${score('accessibility')}, best practices ${score('best-practices')}, SEO ${score('seo')}`);
  say(`  first paint ${m('first-contentful-paint')}, largest paint ${m('largest-contentful-paint')}, blocking ${m('total-blocking-time')}, layout shift ${m('cumulative-layout-shift')}, page weight ${m('total-byte-weight')}`);
  for (const cat of ['accessibility', 'best-practices', 'seo']) {
    const bad = r.categories[cat].auditRefs.map((a) => r.audits[a.id]).filter((a) => a.score !== null && a.score < 1 && a.scoreDisplayMode !== 'informative' && a.scoreDisplayMode !== 'manual');
    for (const a of bad) {
      say(`  ${cat}: ${a.title}${a.displayValue ? ` (${a.displayValue})` : ''}`);
      for (const it of (a.details?.items || []).slice(0, 3)) if (it.node?.selector) say(`      at ${it.node.selector}`);
    }
  }
  const slow = Object.values(r.audits).filter((a) => a.details?.type === 'opportunity' && (a.details.overallSavingsMs || 0) > 150).sort((a, b) => b.details.overallSavingsMs - a.details.overallSavingsMs).slice(0, 4);
  for (const a of slow) say(`  speed: ${a.title} (about ${Math.round(a.details.overallSavingsMs)} ms)`);
}
writeFileSync(`${OUT}/lighthouse.txt`, lines.join('\n') + '\n');
