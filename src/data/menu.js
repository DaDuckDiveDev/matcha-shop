// The menu. Prices in RSD (illustrative until the kitchen sets them).
// `note` is one tasting sentence; `spec` is the real recipe line.
// `options` drive the order-ahead customiser in the app.

export const MILK = [
  { id: 'oat', en: 'Oat', sr: 'Ovseno', add: 0 },
  { id: 'whole', en: 'Whole', sr: 'Punomasno', add: 0 },
  { id: 'coconut', en: 'Coconut', sr: 'Kokosovo', add: 40 }
];
export const TEMP = [
  { id: 'hot', en: 'Hot', sr: 'Toplo', add: 0 },
  { id: 'iced', en: 'Iced', sr: 'Sa ledom', add: 0 }
];
export const SIZE = [
  { id: 'regular', en: 'Regular · 180 ml', sr: 'Obična · 180 ml', add: 0 },
  { id: 'large', en: 'Large · 240 ml', sr: 'Velika · 240 ml', add: 60 }
];
export const STRENGTH = [
  { id: 'usucha', en: 'Usucha · 2 g', sr: 'Usucha · 2 g', add: 0 },
  { id: 'koicha', en: 'Koicha-strength · 4 g', sr: 'Koicha jačina · 4 g', add: 120 }
];

export const CATEGORIES = [
  { id: 'matcha', kanji: '抹茶', en: 'Matcha', sr: 'Matcha', tag: { en: 'Uji · ceremonial', sr: 'Uji · ceremonijalna' } },
  { id: 'coffee', kanji: '珈琲', en: 'Coffee', sr: 'Kafa', tag: { en: 'Slow bar', sr: 'Spori bar' } },
  { id: 'kitchen', kanji: '台所', en: 'Kitchen', sr: 'Kuhinja', tag: { en: 'All day', sr: 'Ceo dan' } },
  { id: 'shop', kanji: '売店', en: 'Take home', sr: 'Za poneti', tag: { en: 'Retail corner', sr: 'Prodajni kutak' } }
];

export const ITEMS = [
  // ---- Matcha
  {
    id: 'usucha', cat: 'matcha', jp: '薄茶', price: 520, img: 'bowlRustic',
    name: { en: 'Usucha', sr: 'Usucha' },
    note: { en: 'Thin tea, whisked to a fine foam. Bright, grassy, a long sweet finish.', sr: 'Tanak čaj, umućen do fine pene. Svetao, travnat, dug sladak završetak.' },
    spec: '2 g · 70 ml · 70 °C',
    options: { temp: TEMP }
  },
  {
    id: 'koicha', cat: 'matcha', jp: '濃茶', price: 690, img: 'powderTray',
    name: { en: 'Koicha', sr: 'Koicha' },
    note: { en: 'Thick tea, kneaded not whisked. Dense, full of umami, for the committed.', sr: 'Gust čaj, mesi se umesto da se muti. Gust, pun umamija, za posvećene.' },
    spec: '4 g · 35 ml · 70 °C'
  },
  {
    id: 'matcha-latte', cat: 'matcha', jp: '抹茶ラテ', price: 560, img: 'latteCup',
    name: { en: 'Matcha latte', sr: 'Matcha late' },
    note: { en: 'Usucha poured over oat or whole milk, hot or iced. No syrup unless you ask.', sr: 'Usucha prelivena ovsenim ili punomasnim mlekom, topla ili sa ledom. Bez sirupa, osim ako ne tražiš.' },
    spec: '2 g · 180 ml',
    options: { temp: TEMP, milk: MILK, size: SIZE, strength: STRENGTH }
  },
  {
    id: 'matcha-tonic', cat: 'matcha', jp: '抹茶トニック', price: 540, img: 'icedMatcha',
    name: { en: 'Matcha tonic', sr: 'Matcha tonik' },
    note: { en: 'Usucha over tonic and ice, a twist of yuzu peel. Bitter, bright, cold.', sr: 'Usucha preko tonika i leda, uvijena kora juzua. Gorak, svetao, hladan.' },
    spec: '2 g · 200 ml · iced',
    options: { size: SIZE }
  },
  {
    id: 'kuri-hojicha', cat: 'matcha', jp: '栗ほうじ茶ラテ', price: 560, img: 'latteBooks', seasonal: true,
    name: { en: 'Kuri hojicha latte', sr: 'Kuri hojicha late' },
    note: { en: 'Roasted tea with a paste of Serbian chestnut. Toasty, caramel, almost no caffeine.', sr: 'Pečeni čaj sa pastom od srpskog kestena. Zapečen, karamel, skoro bez kofeina.' },
    spec: '180 ml · hot or iced',
    options: { temp: TEMP, milk: MILK, size: SIZE }
  },
  // ---- Coffee
  {
    id: 'nel-drip', cat: 'coffee', jp: 'ネルドリップ', price: 420, img: 'nelDrip',
    name: { en: 'Nel drip', sr: 'Nel drip' },
    note: { en: "Flannel-filtered, the way Kyoto's kissaten have brewed since the 1930s. Deep, clean, no paper.", sr: 'Filtriran kroz flanel, kako kjotski kissateni kuvaju od tridesetih. Dubok, čist, bez papira.' },
    spec: '18 g · 150 ml · 4 min'
  },
  {
    id: 'v60', cat: 'coffee', jp: '', price: 380, img: 'pourOverHand',
    name: { en: 'V60 pour-over', sr: 'V60 pour-over' },
    note: { en: "This term's single origin, roasted in Belgrade. Ask what is in the grinder.", sr: 'Kafa jednog porekla ovog solarnog perioda, pržena u Beogradu. Pitaj šta je u mlinu.' },
    spec: '15 g · 250 ml · 93 °C'
  },
  {
    id: 'espresso', cat: 'coffee', jp: '', price: 250, img: 'pourOverScale',
    name: { en: 'Espresso', sr: 'Espresso' },
    note: { en: 'House blend, pulled short.', sr: 'Kućna mešavina, kratak.' },
    spec: '18 g · 36 ml'
  },
  {
    id: 'flat-white', cat: 'coffee', jp: '', price: 380, img: 'latteArt',
    name: { en: 'Flat white', sr: 'Flat white' },
    note: { en: 'Double espresso, whole or oat milk, no foam to speak of.', sr: 'Dupli espresso, punomasno ili ovseno mleko, skoro bez pene.' },
    spec: '36 ml · 160 ml',
    options: { milk: MILK }
  },
  {
    id: 'cold-brew', cat: 'coffee', jp: '水出し', price: 400, img: 'pourOver',
    name: { en: 'Slow-drip cold brew', sr: 'Hladno spravljena kafa' },
    note: { en: 'Eight hours through the glass tower, one drop a second. Sweet and tea-like.', sr: 'Osam sati kroz stakleni toranj, kap po kap. Slatka, nalik čaju.' },
    spec: '200 ml · over ice'
  },
  // ---- Kitchen
  {
    id: 'daifuku', cat: 'kitchen', jp: '大福', price: 290, img: 'mochiPlate', each: true,
    name: { en: 'Daifuku', sr: 'Daifuku' },
    note: { en: 'Soft mochi around sweet azuki, pounded this morning. Plain or matcha.', sr: 'Mek mochi oko slatkog azukija, umućen jutros. Običan ili matcha.' },
    spec: ''
  },
  {
    id: 'warabi-mochi', cat: 'kitchen', jp: 'わらび餅', price: 390, img: 'mochiGreen',
    name: { en: 'Warabi mochi', sr: 'Warabi mochi' },
    note: { en: 'Bracken-starch mochi, kinako and kuromitsu. Made this morning.', sr: 'Mochi od skroba paprati, kinako i kuromitsu. Napravljen jutros.' },
    spec: ''
  },
  {
    id: 'tamago-sando', cat: 'kitchen', jp: '玉子サンド', price: 540, img: 'onigiriThree',
    name: { en: 'Tamago sando', sr: 'Tamago sendvič' },
    note: { en: 'Soft-scrambled egg between slices of shokupan milk bread, crusts off.', sr: 'Meko umućena jaja između kriški shokupan mlečnog hleba, bez kore.' },
    spec: ''
  },
  {
    id: 'onigiri', cat: 'kitchen', jp: 'おにぎり', price: 320, img: 'onigiriBoard', each: true,
    name: { en: 'Onigiri', sr: 'Onigiri' },
    note: { en: 'Salted salmon, umeboshi, or kombu. Pressed to order, wrapped in nori.', sr: 'Slani losos, umeboshi ili kombu. Oblikovan po porudžbini, umotan u nori.' },
    spec: ''
  },
  {
    id: 'ogura-toast', cat: 'kitchen', jp: '小倉トースト', price: 460, img: 'mochiWhite',
    name: { en: 'Ogura toast', sr: 'Ogura tost' },
    note: { en: "Thick-cut shokupan, azuki bean paste, salted butter. Nagoya's breakfast.", sr: 'Debela kriška shokupana, pasta od azuki pasulja, slani maslac. Nagojin doručak.' },
    spec: ''
  },
  // ---- Take home
  {
    id: 'tin', cat: 'shop', jp: '抹茶 缶', price: 2900, img: 'powderSpoon',
    name: { en: 'Machiko ceremonial blend, 30 g', sr: 'Machiko ceremonijalna mešavina, 30 g' },
    note: { en: 'The tin we whisk from. Samidori and Okumidori, first harvest, stone-milled in Uji.', sr: 'Limenka iz koje mutimo. Samidori i Okumidori, prva berba, mleveno na kamenom mlinu u Udžiju.' },
    spec: ''
  },
  {
    id: 'chasen', cat: 'shop', jp: '茶筅', price: 3400, img: 'handsWhisk',
    name: { en: 'Chasen, 80 tines', sr: 'Chasen, 80 zubaca' },
    note: { en: 'Hand-cut from one piece of bamboo in Takayama, Nara, where every chasen in Japan comes from.', sr: 'Ručno isečen iz jednog komada bambusa u Takajami, Nara, odakle dolazi svaki chasen u Japanu.' },
    spec: ''
  },
  {
    id: 'chawan', cat: 'shop', jp: '茶碗', price: 4800, img: 'scoop',
    name: { en: 'Chawan', sr: 'Chawan' },
    note: { en: 'Thrown by a Belgrade potter to our shape. Each one different.', sr: 'Izradio beogradski grnčar po našem obliku. Svaki drugačiji.' },
    spec: ''
  }
];

export const byCategory = (cat) => ITEMS.filter((i) => i.cat === cat);
export const findItem = (id) => ITEMS.find((i) => i.id === id);

export function unitPrice(item, choice = {}) {
  let p = item.price;
  const opts = item.options || {};
  for (const [group, list] of Object.entries(opts)) {
    const sel = list.find((o) => o.id === choice[group]);
    if (sel) p += sel.add;
  }
  return p;
}

export function defaultChoice(item) {
  const c = {};
  for (const [group, list] of Object.entries(item.options || {})) c[group] = list[0].id;
  return c;
}

export const fmtRsd = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
