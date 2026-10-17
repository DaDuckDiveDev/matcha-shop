// 二十四節気 — the 24 solar terms. The menu's seasonal special follows them.
// Start dates are the usual ones (they shift by a day in some years).
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
  5: { en: 'Shincha: the new harvest, as usucha', sr: 'Shincha: nova berba, kao usucha', itemId: 'usucha' },
  6: { en: 'Shincha koicha, two weeks only', sr: 'Shincha koicha, samo dve nedelje', itemId: 'koicha' },
  7: { en: 'Iced usucha with yuzu peel', sr: 'Ledena usucha sa korom juzua', itemId: 'matcha-tonic' },
  8: { en: 'Matcha tonic, the long way', sr: 'Matcha tonik, na dug način', itemId: 'matcha-tonic' },
  9: { en: 'Slow-drip cold brew, eight hours', sr: 'Hladno spravljena kafa, osam sati', itemId: 'cold-brew' },
  10: { en: 'Matcha kakigōri with condensed milk', sr: 'Matcha kakigōri sa kondenzovanim mlekom', itemId: 'matcha-latte' },
  11: { en: 'Iced hojicha latte', sr: 'Ledena hojicha late', itemId: 'kuri-hojicha' },
  12: { en: 'Warabi mochi, ice-cold, with kuromitsu', sr: 'Warabi mochi, ledeno hladan, sa kuromitsuom', itemId: 'warabi-mochi' },
  13: { en: 'Iced matcha latte with coconut', sr: 'Ledena matcha late sa kokosom', itemId: 'matcha-latte' },
  14: { en: 'Nashi pear matcha tonic', sr: 'Matcha tonik sa nashi kruškom', itemId: 'matcha-tonic' }
};

function termIndexFor(date) {
  const y = date.getFullYear();
  // Build the boundaries for this calendar year, in order of date.
  const marks = SEKKI.map((t) => ({ t, when: new Date(y, t.m - 1, t.d) })).sort((a, b) => a.when - b.when);
  let current = marks[marks.length - 1].t; // before Jan 5 we are still in Tōji (Dec 21)
  for (const m of marks) {
    if (date >= m.when) current = m.t;
  }
  return current;
}

export function currentSekki(date = new Date()) {
  const t = termIndexFor(date);
  const next = SEKKI[t.n % 24];
  const y = date.getFullYear();
  const start = new Date(y, t.m - 1, t.d);
  const endYear = next.m < t.m ? y + 1 : y;
  const end = new Date(endYear, next.m - 1, next.d - 1);
  return { ...t, start, end, next, special: SPECIALS[t.n] };
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
