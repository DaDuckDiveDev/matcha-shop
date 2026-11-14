// 二十四節気 — the 24 solar terms. The menu's seasonal special follows them.
// m/d are the usual start dates; currentSekki() computes the real ones.
// Order starts at Risshun, the first term of the traditional year.
export const SEKKI = [
  { n: 1, kanji: '立春', romaji: 'Risshun', en: 'Start of Spring', sr: 'Početak proleća', m: 2, d: 4 },
  { n: 2, kanji: '雨水', romaji: 'Usui', en: 'Rain Water', sr: 'Kišnica', m: 2, d: 19 },
  { n: 3, kanji: '啓蟄', romaji: 'Keichitsu', en: 'Insects Awaken', sr: 'Buđenje insekata', m: 3, d: 5 },
  { n: 4, kanji: '春分', romaji: 'Shunbun', en: 'Spring Equinox', sr: 'Prolećna ravnodnevica', m: 3, d: 20 },
  { n: 5, kanji: '清明', romaji: 'Seimei', en: 'Pure Brightness', sr: 'Čista vedrina', m: 4, d: 4 },
  { n: 6, kanji: '穀雨', romaji: 'Kokuu', en: 'Grain Rain', sr: 'Žitna kiša', m: 4, d: 20 },
  { n: 7, kanji: '立夏', romaji: 'Rikka', en: 'Start of Summer', sr: 'Početak leta', m: 5, d: 5 },
  { n: 8, kanji: '小満', romaji: 'Shōman', en: 'Grain Fills', sr: 'Puno zrno', m: 5, d: 21 },
  { n: 9, kanji: '芒種', romaji: 'Bōshu', en: 'Grain in Ear', sr: 'Zrno u klasu', m: 6, d: 5 },
  { n: 10, kanji: '夏至', romaji: 'Geshi', en: 'Summer Solstice', sr: 'Letnji solsticij', m: 6, d: 21 },
  { n: 11, kanji: '小暑', romaji: 'Shōsho', en: 'Minor Heat', sr: 'Mala vrućina', m: 7, d: 7 },
  { n: 12, kanji: '大暑', romaji: 'Taisho', en: 'Major Heat', sr: 'Velika vrućina', m: 7, d: 22 },
  { n: 13, kanji: '立秋', romaji: 'Risshū', en: 'Start of Autumn', sr: 'Početak jeseni', m: 8, d: 7 },
  { n: 14, kanji: '処暑', romaji: 'Shosho', en: 'End of Heat', sr: 'Kraj vrućine', m: 8, d: 23 },
  { n: 15, kanji: '白露', romaji: 'Hakuro', en: 'White Dew', sr: 'Bela rosa', m: 9, d: 7 },
  { n: 16, kanji: '秋分', romaji: 'Shūbun', en: 'Autumn Equinox', sr: 'Jesenja ravnodnevica', m: 9, d: 22 },
  { n: 17, kanji: '寒露', romaji: 'Kanro', en: 'Cold Dew', sr: 'Hladna rosa', m: 10, d: 8 },
  { n: 18, kanji: '霜降', romaji: 'Sōkō', en: 'Frost Descent', sr: 'Prvi mraz', m: 10, d: 23 },
  { n: 19, kanji: '立冬', romaji: 'Rittō', en: 'Start of Winter', sr: 'Početak zime', m: 11, d: 7 },
  { n: 20, kanji: '小雪', romaji: 'Shōsetsu', en: 'Minor Snow', sr: 'Mali sneg', m: 11, d: 22 },
  { n: 21, kanji: '大雪', romaji: 'Taisetsu', en: 'Major Snow', sr: 'Veliki sneg', m: 12, d: 7 },
  { n: 22, kanji: '冬至', romaji: 'Tōji', en: 'Winter Solstice', sr: 'Zimski solsticij', m: 12, d: 21 },
  { n: 23, kanji: '小寒', romaji: 'Shōkan', en: 'Minor Cold', sr: 'Mala hladnoća', m: 1, d: 5 },
  { n: 24, kanji: '大寒', romaji: 'Daikan', en: 'Major Cold', sr: 'Velika hladnoća', m: 1, d: 20 }
];

// The special served during each term. Fill these in with the kitchen; a term
// without an entry falls back to the generic line.
export const SPECIALS = {
  15: { en: 'Cold-brew matcha over Serbian pear', sr: 'Hladno spravljena matcha preko srpske kruške', itemId: 'matcha-tonic' },
  16: { en: 'Kuri (chestnut) daifuku, pounded at dawn', sr: 'Kuri (kesten) daifuku, umućen u zoru', itemId: 'daifuku' },
  17: { en: 'Hojicha latte with roasted Serbian chestnut', sr: 'Hojicha late sa pečenim srpskim kestenom', itemId: 'kuri-hojicha' },
  18: { en: 'Hojicha latte with roasted Serbian chestnut', sr: 'Hojicha late sa pečenim srpskim kestenom', itemId: 'kuri-hojicha' },
  19: { en: 'Yuzu and ginger koicha, served warm', sr: 'Koicha sa juzuom i đumbirom, topla', itemId: 'koicha' },
  20: { en: 'Ogura toast with brown-butter azuki', sr: 'Ogura tost sa azukijem na zapečenom maslacu', itemId: 'ogura-toast' },
  21: { en: 'Matcha shiruko: sweet azuki soup with grilled mochi', sr: 'Matcha shiruko: slatka azuki supa sa pečenim mochijem', itemId: 'daifuku' },
  22: { en: 'Yuzu daifuku for the longest night', sr: 'Juzu daifuku za najdužu noć', itemId: 'daifuku' },
  23: { en: 'Nel drip with a square of matcha chocolate', sr: 'Nel drip sa kockom matcha čokolade', itemId: 'nel-drip' },
  24: { en: 'Koicha, the thick way, for the coldest fortnight', sr: 'Koicha, na gust način, za najhladnije dve nedelje', itemId: 'koicha' },
  1: { en: 'Sakura-salt usucha', sr: 'Usucha sa soli od sakure', itemId: 'usucha' },
  2: { en: 'Ichigo daifuku: a whole strawberry inside', sr: 'Ichigo daifuku: cela jagoda unutra', itemId: 'daifuku' },
  3: { en: 'Warabi mochi with the first kinako of the year', sr: 'Warabi mochi sa prvim kinakom godine', itemId: 'warabi-mochi' },
  4: { en: 'Sakura matcha latte', sr: 'Sakura matcha late', itemId: 'matcha-latte' },
  5: { en: 'Kusa mochi with yomogi, beside your usucha', sr: 'Kusa mochi sa jomogijem, uz tvoju usuchu', itemId: 'usucha' },
  6: { en: 'Iced usucha with yuzu peel, for the first warm afternoons', sr: 'Ledena usucha sa korom juzua, za prva topla popodneva', itemId: 'matcha-tonic' },
  7: { en: 'Shincha: the year\'s first sencha, two weeks only', sr: 'Shincha: prva sencha godine, samo dve nedelje', itemId: 'usucha' },
  8: { en: 'Matcha tonic, the long way', sr: 'Matcha tonik, na dug način', itemId: 'matcha-tonic' },
  9: { en: 'Shin-matcha: the new harvest, whisked as usucha', sr: 'Shin-matcha: nova berba, umućena kao usucha', itemId: 'usucha' },
  10: { en: 'Matcha kakigōri with condensed milk', sr: 'Matcha kakigōri sa kondenzovanim mlekom', itemId: 'matcha-latte' },
  11: { en: 'Slow-drip cold brew, eight hours, with an iced hojicha latte beside it', sr: 'Hladno spravljena kafa, osam sati, i ledena hojicha late', itemId: 'cold-brew' },
  12: { en: 'Warabi mochi, ice-cold, with kuromitsu', sr: 'Warabi mochi, ledeno hladan, sa kuromitsuom', itemId: 'warabi-mochi' },
  13: { en: 'Iced matcha latte with coconut', sr: 'Ledena matcha late sa kokosom', itemId: 'matcha-latte' },
  14: { en: 'Nashi pear matcha tonic', sr: 'Matcha tonik sa nashi kruškom', itemId: 'matcha-tonic' }
};

// ---------------------------------------------------------------------------
// When each term really starts. A term begins when the sun's apparent
// longitude reaches a multiple of 15° (Risshun 315°, Shunbun 0°, Seimei 15°…).
// We compute that moment (Meeus, low precision: well under an hour) and take
// its date in Belgrade, so the strip turns on the right day every year, e.g.
// Shunbun on 20 March 2027 and Seimei on 5 April 2027. The fixed m/d above
// are only the fallback.
const DAY = 86400000;
const rad = (d) => (d * Math.PI) / 180;

function sunLongitude(ms) {
  const T = (ms / DAY + 2440587.5 - 2451545.0) / 36525;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = rad(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M)
    + (0.019993 - 0.000101 * T) * Math.sin(2 * M) + 0.000289 * Math.sin(3 * M);
  const omega = rad(125.04 - 1934.136 * T);
  const lon = L0 + C - 0.00569 - 0.00478 * Math.sin(omega);
  return ((lon % 360) + 360) % 360;
}

// Signed distance from the target longitude, in (-180, 180].
const off = (ms, target) => ((sunLongitude(ms) - target + 540) % 360) - 180;

function termMoment(year, t) {
  const target = (315 + 15 * (t.n - 1)) % 360;
  let a = Date.UTC(year, t.m - 1, t.d) - 4 * DAY;
  let fa = off(a, target);
  for (let i = 0; i < 40 && fa >= 0; i++) { a -= DAY; fa = off(a, target); }
  let b = a;
  for (let i = 0; i < 80; i++) { // step 6 h until the longitude passes the target
    b = a + DAY / 4;
    if (off(b, target) >= 0) break;
    a = b;
  }
  for (let i = 0; i < 30; i++) {
    const mid = (a + b) / 2;
    if (off(mid, target) < 0) a = mid; else b = mid;
  }
  return b;
}

let belgradeFmt;
function belgradeDate(ms) {
  try {
    belgradeFmt = belgradeFmt || new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Belgrade', year: 'numeric', month: '2-digit', day: '2-digit' });
    const [y, m, d] = belgradeFmt.format(new Date(ms)).split('-').map(Number);
    return new Date(y, m - 1, d);
  } catch {
    const d = new Date(ms + 3600000); // CET without the timezone database
    return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  }
}

const cache = new Map();
function startsFor(year) {
  if (!cache.has(year)) {
    cache.set(year, SEKKI.map((t) => {
      let when;
      try { when = belgradeDate(termMoment(year, t)); } catch { when = new Date(year, t.m - 1, t.d); }
      return { t, when };
    }));
  }
  return cache.get(year);
}

// Every term start from the year before to the year after, in date order.
function timeline(date) {
  const y = date.getFullYear();
  return [...startsFor(y - 1), ...startsFor(y), ...startsFor(y + 1)].sort((a, b) => a.when - b.when);
}

export function currentSekki(date = new Date()) {
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const marks = timeline(date);
  let i = 0;
  for (let k = 0; k < marks.length; k++) if (marks[k].when <= today) i = k;
  const { t, when: start } = marks[i];
  const nextMark = marks[i + 1];
  const end = new Date(nextMark.when.getFullYear(), nextMark.when.getMonth(), nextMark.when.getDate() - 1);
  return { ...t, start, end, next: nextMark.t, nextStart: nextMark.when, special: SPECIALS[t.n] };
}

// The start date of a given term in a given year (Belgrade date).
export function sekkiStart(n, year) {
  return startsFor(year).find((s) => s.t.n === n)?.when;
}

export function fmtRange(start, end, lang = 'en') {
  const sameMonth = start.getMonth() === end.getMonth();
  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthsSr = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'avg', 'sep', 'okt', 'nov', 'dec'];
  const M = lang === 'sr' ? monthsSr : monthsEn;
  if (lang === 'sr') {
    return sameMonth
      ? `${start.getDate()}–${end.getDate()}. ${M[end.getMonth()]}`
      : `${start.getDate()}. ${M[start.getMonth()]} – ${end.getDate()}. ${M[end.getMonth()]}`;
  }
  return sameMonth
    ? `${start.getDate()}–${end.getDate()} ${M[end.getMonth()]}`
    : `${start.getDate()} ${M[start.getMonth()]} – ${end.getDate()} ${M[end.getMonth()]}`;
}
