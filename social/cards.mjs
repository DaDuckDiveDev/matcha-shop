// Pre-launch cards for Instagram, 1080 × 1440, in the look of machiko.rs.
// usage: node social/cards.mjs [filter]
import fs from 'node:fs';
import { open, HERE, OUT } from './lib.mjs';

const MARK = 'M47 12 C68 9 91 27 90 50 C89 72 74 86 50 86 C26 86 10 73 10.5 50 C11 28 27 14 47 12 Z';
const GLEAM = 'M27 44 C28 33 36 25 47 23';
const mark = (fill, gleam, extra = '') => `<svg viewBox="0 0 100 100" ${extra}><path d="${MARK}" fill="${fill}"/><path d="${GLEAM}" fill="none" stroke="${gleam}" stroke-width="4.4" stroke-linecap="round"/></svg>`;

const CSS = `
:root { --paper:#FBFAF6; --panel:#F2F0E8; --ink:#161915; --ink2:#4A5046; --ink3:#646A5F; --line:#E3E0D6; --uji:#3E5A33; --deep:#263D21; --leaf:#7FA052; --foam:#E9EED8; }
* { box-sizing: border-box; }
html, body { margin: 0; }
body { width: 1080px; height: 1440px; overflow: hidden; position: relative; background: var(--paper); color: var(--ink);
  font-family: 'Hanken Grotesk Variable', sans-serif; -webkit-font-smoothing: antialiased; }
.mincho { font-family: 'Hina Mincho', serif; }
.brand { position: absolute; left: 92px; top: 86px; display: flex; align-items: center; gap: 16px; font-family: 'Hina Mincho', serif; font-size: 46px; line-height: 1; }
.brand svg { width: 46px; height: 46px; }
.tate { position: absolute; right: 96px; top: 92px; writing-mode: vertical-rl; font-family: 'Hina Mincho', serif; font-size: 36px; letter-spacing: 0.3em; color: var(--ink3); }
.foot { position: absolute; left: 92px; right: 92px; bottom: 82px; display: flex; justify-content: space-between; align-items: baseline; font-size: 30px; color: var(--ink3); }

/* season note */
.season .kanji { position: absolute; right: 78px; top: 196px; writing-mode: vertical-rl; font-family: 'Hina Mincho', serif; font-size: 408px; line-height: 1; color: var(--uji); }
.season .name { position: absolute; left: 92px; top: 742px; }
.season .count { font-size: 30px; color: var(--ink3); }
.season .romaji { font-family: 'Hina Mincho', serif; font-size: 132px; line-height: 1; margin-top: 18px; letter-spacing: -0.01em; }
.season .means { position: absolute; left: 92px; top: 1058px; font-family: 'Hina Mincho', serif; font-size: 58px; line-height: 1.15; }
.season .dates { position: absolute; left: 92px; top: 1140px; font-size: 34px; color: var(--ink2); }
.season .dots { position: absolute; left: 92px; right: 92px; bottom: 164px; display: flex; justify-content: space-between; }
.season .dots i { width: 14px; height: 14px; border-radius: 50%; background: var(--line); }
.season .dots i.on { background: var(--leaf); box-shadow: 0 0 0 8px rgba(127,160,82,0.18); }
.season .pill { position: absolute; right: 92px; top: 1126px; padding: 20px 36px 22px; border-radius: 999px; background: var(--uji); color: var(--paper); font-size: 34px; font-weight: 500; }

.night { background: var(--deep); color: var(--paper); }
.night .kanji { color: var(--foam); }
.night .count, .night .foot { color: rgba(251,250,246,0.66); }
.night .dates { color: rgba(251,250,246,0.82); }
.night .dots i { background: rgba(251,250,246,0.16); }

.thaw { background: var(--foam); }
.thaw .kanji { color: var(--deep); }
.thaw .dots i { background: rgba(38,61,33,0.14); }
.thaw .count, .thaw .foot { color: #4F5A48; }

/* forty grams */
.mill h1 { position: absolute; left: 92px; top: 214px; width: 900px; white-space: nowrap; margin: 0; font-family: 'Hina Mincho', serif; font-weight: 400; font-size: 82px; line-height: 1.12; letter-spacing: -0.01em; }
.mill .bowls { position: absolute; left: 92px; top: 560px; display: grid; grid-template-columns: repeat(5, 118px); gap: 30px 36px; }
.mill .bowls svg { width: 118px; height: 118px; }
.mill .sub { position: absolute; left: 92px; top: 1166px; font-family: 'Hina Mincho', serif; font-size: 58px; line-height: 1.1; }

/* and coffee */
.coffee .cup { position: absolute; right: 70px; top: 232px; width: 560px; height: 560px; }
.coffee h1 { position: absolute; left: 86px; top: 800px; margin: 0; font-family: 'Hina Mincho', serif; font-weight: 400; font-size: 196px; line-height: 1; letter-spacing: -0.02em; }
.coffee p { position: absolute; left: 92px; top: 1040px; width: 800px; margin: 0; font-size: 42px; line-height: 1.34; color: var(--ink2); }
.coffee .spec { position: absolute; left: 92px; top: 1196px; font-size: 32px; color: var(--ink3); }

/* four words */
.words h1 { position: absolute; left: 92px; top: 212px; width: 800px; white-space: nowrap; margin: 0; font-family: 'Hina Mincho', serif; font-weight: 400; font-size: 82px; line-height: 1.12; letter-spacing: -0.01em; }
.words .rows { position: absolute; left: 92px; right: 92px; top: 476px; }
.words .row { display: grid; grid-template-columns: 256px 268px 1fr; align-items: center; height: 178px; border-top: 2px solid var(--line); }
.words .row:last-child { border-bottom: 2px solid var(--line); }
.words .k { font-family: 'Hina Mincho', serif; font-size: 100px; line-height: 1; color: var(--uji); }
.words .r { font-family: 'Hina Mincho', serif; font-size: 62px; line-height: 1; }
.words .m { font-size: 33px; line-height: 1.25; color: var(--ink2); }
`;

const T = {
  sr: { foot: 'Otvaramo 20. marta 2027.', count: (n) => `${n}. od 24 doba` },
  en: { foot: 'Opening 20 March 2027', count: (n) => `Season ${n} of 24` }
};

const page = (cls, lang, inner, { cream = false, tate = '' } = {}) => `<!doctype html><html lang="${lang}"><head><meta charset="utf-8">
<link rel="stylesheet" href="/hina/index.css"><link rel="stylesheet" href="/hanken/index.css"><style>${CSS}</style></head>
<body class="${cls}">
<div class="brand">${mark(cream ? '#F4F0E4' : '#3E5A33', cream ? '#3E5A33' : '#F4F0E4')}<span>Machiko</span></div>
${tate ? `<div class="tate" lang="ja">${tate}</div>` : ''}
${inner}
<div class="foot"><span>machiko.rs/join</span><span>${T[lang].foot}</span></div>
</body></html>`;

const dots = (n) => `<div class="dots">${Array.from({ length: 24 }, (_, i) => `<i${i + 1 === n ? ' class="on"' : ''}></i>`).join('')}</div>`;

function season({ cls = '', kanji, romaji, n, means, dates, pill, cream }) {
  return (lang) => page(`season ${cls}`, lang, `
<div class="kanji" lang="ja">${kanji}</div>
<div class="name"><div class="count">${T[lang].count(n)}</div><div class="romaji">${romaji}</div></div>
<div class="means">${means[lang]}</div>
<div class="dates">${dates[lang]}</div>
${pill ? `<div class="pill">${pill[lang]}</div>` : ''}
${dots(n)}`, { cream });
}

// small, fixed turns so the twenty bowls look set down by hand
const TURN = [-7, 4, -2, 9, -5, 3, -9, 6, 0, -4, 8, -6, 2, -3, 7, -8, 5, -1, 4, -6];

const CARDS = {
  'W1-daikan': season({ cls: 'night', cream: true, kanji: '大寒', romaji: 'Daikan', n: 24,
    means: { sr: 'Velika hladnoća', en: 'Major Cold' },
    dates: { sr: '20. januar – 3. februar', en: '20 January – 3 February' } }),
  'W2-40-grams': (lang) => page('mill', lang, `
<h1>${{ sr: 'Kameni mlin samelje<br>40 grama matche na sat.', en: 'A stone mill grinds<br>40 grams of matcha an hour.' }[lang]}</h1>
<div class="bowls">${TURN.map((d) => mark('#3E5A33', '#F4F0E4', `style="transform: rotate(${d}deg)"`)).join('')}</div>
<div class="sub">${{ sr: 'To je dvadeset činija.', en: 'That is twenty bowls.' }[lang]}</div>`, { tate: '石臼' }),
  'W3-risshun': season({ kanji: '立春', romaji: 'Risshun', n: 1,
    means: { sr: 'Početak proleća', en: 'Start of Spring' },
    dates: { sr: '4–17. februar', en: '4–17 February' } }),
  'W4-coffee': (lang) => page('coffee', lang, `
${mark('#3A2A21', '#F4F0E4', 'class="cup"')}
<h1>${{ sr: 'I kafa.', en: 'And coffee.' }[lang]}</h1>
<p>${{ sr: 'Nel drip: filter od flanela, voda u tankom mlazu, četiri minuta strpljenja.', en: 'Nel drip: a flannel filter, a thin stream of water, four minutes of patience.' }[lang]}</p>
<div class="spec">18 g · 150 ml · 4 min</div>`, { tate: '珈琲' }),
  'W4-four-words': (lang) => page('words', lang, `
<h1>${{ sr: 'Četiri reči<br>pre prve činije', en: 'Four words before<br>your first bowl' }[lang]}</h1>
<div class="rows">${[
    ['茶筅', 'chasen', { sr: 'metlica isečena iz jednog komada bambusa', en: 'a whisk cut from one piece of bamboo' }],
    ['茶碗', 'chawan', { sr: 'činija koja se drži obema rukama', en: 'the bowl, held in both hands' }],
    ['薄茶', 'usucha', { sr: 'tanak čaj, penast i lagan', en: 'thin tea, light and foamy' }],
    ['濃茶', 'koicha', { sr: 'gust čaj, za sporije dane', en: 'thick tea, for slower days' }]
  ].map(([k, r, m]) => `<div class="row"><span class="k" lang="ja">${k}</span><span class="r">${r}</span><span class="m">${m[lang]}</span></div>`).join('')}</div>`, { tate: '言葉' }),
  'W5-usui': season({ cls: 'thaw', kanji: '雨水', romaji: 'Usui', n: 2,
    means: { sr: 'Kišnica', en: 'Rain Water' },
    dates: { sr: '18. februar – 4. mart', en: '18 February – 4 March' },
    pill: { sr: '30 dana do otvaranja', en: '30 days to opening' } })
};

const filter = process.argv[2] || '';
const { browser, page: pg } = await open('blank.html', 1080, 1440);
for (const [name, make] of Object.entries(CARDS)) {
  if (filter && !name.includes(filter)) continue;
  for (const lang of ['sr', 'en']) {
    fs.writeFileSync(`${HERE}/.build/cards/${name}-${lang}.html`, make(lang));
    await pg.goto(`http://machiko.local/app/.build/cards/${name}-${lang}.html`);
    await pg.evaluate(async () => {
      await document.fonts.ready;
      const fams = ['"Hina Mincho"', '"Hanken Grotesk Variable"'];
      const text = document.body.innerText;
      await Promise.all(fams.map((f) => document.fonts.load(`40px ${f}`, text)));
      await document.fonts.ready;
    });
    // anything running off the card is a layout bug: report it
    const over = await pg.evaluate(() => [...document.querySelectorAll('body *')].filter((el) => { const r = el.getBoundingClientRect(); return r.width && (r.right > 1081 || r.bottom > 1441 || r.left < -1); }).map((el) => el.className || el.tagName).slice(0, 5));
    if (over.length) console.log('OVERFLOW', name, lang, over);
    await pg.screenshot({ path: `${OUT}/${name}-${lang}.png` });
    console.log('ok', name, lang);
  }
}
await browser.close();
