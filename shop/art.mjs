// Product pictures for the shop, drawn in the brand's flat style until the real
// things are photographed. Writes theme/machiko-shop/assets/products/<slug>.png (1200 x 1200).
//   node shop/art.mjs        (needs Playwright, like the social renderer)
import fs from 'node:fs';
import path from 'node:path';
import { open, HERE as SOCIAL } from '../social/lib.mjs';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const OUT = `${HERE}/theme/machiko-shop/assets/products`;
fs.mkdirSync(OUT, { recursive: true });
const UJI = '#3E5A33', DEEP = '#263D21', LEAF = '#7FA052', CREAM = '#F4F0E4', PANEL = '#F2F0E8', INK = '#161915', BAMBOO = '#DCCDA6', BAMBOO2 = '#B9A777', COTTON = '#F1EADA', COTTON2 = '#DDD3BB';
const MARK = 'M47 12 C68 9 91 27 90 50 C89 72 74 86 50 86 C26 86 10 73 10.5 50 C11 28 27 14 47 12 Z';
const GLEAM = 'M27 44 C28 33 36 25 47 23';
const mark = (x, y, s, fill = UJI, gleam = CREAM) => `<g transform="translate(${x} ${y}) scale(${s / 100})"><path d="${MARK}" fill="${fill}"/><path d="${GLEAM}" fill="none" stroke="${gleam}" stroke-width="4.4" stroke-linecap="round"/></g>`;
const shadow = (cx, cy, rx, ry = rx * 0.16) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${INK}" opacity=".09"/>`;
const serif = (x, y, size, text, fill = INK, extra = '') => `<text x="${x}" y="${y}" font-family="'Hina Mincho',serif" font-size="${size}" fill="${fill}" text-anchor="middle" ${extra}>${text}</text>`;

const tin = (body, lid, jp) => `${shadow(300, 452, 120)}<rect x="212" y="196" width="176" height="252" rx="14" fill="${body}"/><rect x="205" y="172" width="190" height="50" rx="13" fill="${lid}"/><rect x="234" y="262" width="132" height="132" rx="8" fill="${CREAM}"/>${mark(279, 272, 42)}${serif(300, 345, 25, 'Machiko')}${serif(300, 376, 17, jp, '#4A5046')}`;
const chasen = () => { let tines = ''; for (let i = 0; i <= 14; i++) { const k = i / 14; tines += `<path d="M${272 + k * 56} 326 C${258 + k * 84} 280 ${226 + k * 148} 240 ${222 + k * 156} ${190 - Math.sin(k * Math.PI) * 26}" fill="none" stroke="${BAMBOO2}" stroke-width="1.6"/>`; }
  return `${shadow(300, 458, 70)}<path d="M270 330 C250 284 212 246 220 184 Q300 146 380 184 C388 246 350 284 330 330 Z" fill="${BAMBOO}"/>${tines}<rect x="270" y="326" width="60" height="128" rx="10" fill="${BAMBOO}"/><rect x="266" y="318" width="68" height="15" rx="4" fill="${DEEP}"/>`; };
const scoop = () => `${shadow(300, 440, 150, 16)}<g transform="rotate(-28 300 300)"><path d="M112 292 H416 Q462 290 480 262 Q490 300 430 310 H112 Q104 301 112 292 Z" fill="${BAMBOO}"/><circle cx="262" cy="301" r="5.5" fill="${BAMBOO2}"/></g><ellipse cx="458" cy="196" rx="34" ry="13" fill="${LEAF}"/>`;
const stand = () => `${shadow(300, 440, 86)}<path d="M236 436 H364 Q372 398 344 368 Q386 336 376 274 Q364 200 300 200 Q236 200 224 274 Q214 336 256 368 Q228 398 236 436 Z" fill="${LEAF}"/><path d="M252 262 Q262 226 296 220" fill="none" stroke="${CREAM}" stroke-width="7" stroke-linecap="round" opacity=".8"/>`;
const bowl = (cx = 300, cy = 300, r = 168) => `<ellipse cx="${cx + 8}" cy="${cy + r * 0.2}" rx="${r}" ry="${r * 0.96}" fill="${INK}" opacity=".1"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#20211E"/><circle cx="${cx}" cy="${cy}" r="${r * 0.8}" fill="${LEAF}"/><path d="M${cx - r * 0.5} ${cy - r * 0.12} C${cx - r * 0.48} ${cy - r * 0.38} ${cx - r * 0.28} ${cy - r * 0.56} ${cx - r * 0.02} ${cy - r * 0.6}" fill="none" stroke="${CREAM}" stroke-width="${r * 0.06}" stroke-linecap="round" opacity=".85"/>`;
const tote = () => `${shadow(300, 506, 150)}<path d="M236 236 C236 124 364 124 364 236" fill="none" stroke="${COTTON2}" stroke-width="17" stroke-linecap="round"/><rect x="176" y="228" width="248" height="274" rx="10" fill="${COTTON}" stroke="${COTTON2}" stroke-width="2"/>${mark(238, 300, 124)}`;
const tee = () => `${shadow(300, 484, 170)}<path d="M214 168 L166 196 L122 272 L178 304 L204 270 L204 474 L396 474 L396 270 L422 304 L478 272 L434 196 L386 168 C368 198 232 198 214 168 Z" fill="${CREAM}" stroke="${COTTON2}" stroke-width="2" stroke-linejoin="round"/>${['ま', 'ち', 'こ'].map((c, i) => serif(300, 262 + i * 42, 34, c, UJI)).join('')}`;
const cloth = () => `<defs><pattern id="p" width="64" height="64" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)">${mark(8, 8, 30)}${mark(40, 38, 20, LEAF)}</pattern></defs>${shadow(300, 452, 190, 18)}<g transform="rotate(-8 300 300)"><rect x="128" y="196" width="344" height="216" rx="6" fill="${CREAM}"/><rect x="128" y="196" width="344" height="216" rx="6" fill="url(#p)"/><rect x="128" y="300" width="344" height="112" fill="${INK}" opacity=".05"/><path d="M128 300 H472" stroke="${COTTON2}" stroke-width="2"/></g>`;
const pin = () => `${shadow(304, 438, 110)}<g transform="translate(160 150) scale(2.8)"><path d="${MARK}" fill="${UJI}" stroke="${BAMBOO2}" stroke-width="3.4"/><path d="${GLEAM}" fill="none" stroke="${CREAM}" stroke-width="4.4" stroke-linecap="round"/></g>`;
const stickers = () => `${shadow(300, 500, 150)}<rect x="170" y="130" width="260" height="364" rx="14" fill="#FFFFFF" stroke="${COTTON2}" stroke-width="2"/>${mark(198, 162, 92)}${mark(310, 162, 92, LEAF)}<circle cx="244" cy="320" r="46" fill="${DEEP}"/>${serif(244, 334, 40, 'ま', CREAM)}<circle cx="356" cy="320" r="46" fill="${CREAM}" stroke="${COTTON2}" stroke-width="2"/>${serif(356, 334, 36, '春分', UJI)}<rect x="198" y="396" width="204" height="62" rx="31" fill="${UJI}"/>${serif(300, 438, 32, 'Machiko', CREAM)}`;
const set = () => `<g transform="translate(-52 96) scale(.72)">${tin(UJI, DEEP, '抹茶 30 g')}</g><g transform="translate(180 -40) scale(.62)">${chasen()}</g>${bowl(392, 396, 118)}<g transform="translate(-40 190) scale(.62)">${scoop()}</g>`;

const ART = {
  'ceremonial-matcha-30g': tin(UJI, DEEP, '抹茶 30 g'), 'hojicha-powder-50g': tin('#6B4A32', '#4A3222', '焙じ茶 50 g'), chasen: chasen(), chashaku: scoop(), 'whisk-stand': stand(),
  'chawan-black': bowl(), 'first-bowl-set': set(), 'tote-bag': tote(), 't-shirt': tee(), tenugui: cloth(), 'enamel-pin': pin(), 'sticker-sheet': stickers()
};
fs.mkdirSync(`${SOCIAL}/.build`, { recursive: true });
const { browser, page } = await open('blank.html', 1200, 1200);
for (const [slug, inner] of Object.entries(ART)) {
  fs.writeFileSync(`${SOCIAL}/.build/art.html`, `<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="/hina/index.css"><style>html,body{margin:0;background:${PANEL}}svg{display:block}</style><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="1200" height="1200"><rect width="600" height="600" fill="${PANEL}"/>${inner}</svg>`);
  await page.goto('http://machiko.local/app/.build/art.html');
  await page.evaluate(async () => { await document.fonts.load('30px "Hina Mincho"', 'Machiko まちこ抹茶焙じ春分'); await document.fonts.ready; });
  await page.screenshot({ path: `${OUT}/${slug}.png` });
  console.log('drawn', slug);
}
await browser.close();
