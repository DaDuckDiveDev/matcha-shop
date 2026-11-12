// Photography. Every image is a Pexels photo (free licence, attribution
// appreciated but not required). Swap any id for another Pexels photo, or
// drop your own shot at photos-src/<key>.jpg; `npm run photos` then prepares
// AVIF and JPEG copies in four sizes and the site serves those (see
// scripts/photos.mjs). A photo that has not been prepared is loaded from
// Pexels directly, so the site works either way.
//
// Each entry: id, alt text, photographer (Pexels handle).
import manifest from './photos.manifest.json';

const BASE = import.meta.env.BASE_URL || '/';
const REMOTE_WIDTHS = [480, 800, 1200, 1800];
const remote = (id, w) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
const local = (id, w, ext) => `${BASE}photos/${id}-${w}.${ext}`;

export const photos = {
  heroWhisk: { id: 8474184, alt: 'A hand whisking matcha with a bamboo chasen', by: 'cup-of-couple' },
  handsWhisk: { id: 8004576, alt: 'Hands preparing matcha with a whisk and a ceramic cup', by: 'darina-belonogova' },
  bowlRustic: { id: 38275684, alt: 'Vivid green matcha in a rustic ceramic bowl with a bamboo whisk', by: 'julias-torten-und-tortchen' },
  powderTray: { id: 38987827, alt: 'Matcha powder in a bowl with a bamboo whisk on a tray', by: 'charles-chen' },
  scoop: { id: 8329633, alt: 'A bamboo scoop of matcha over a traditional tea set', by: 'anna-pou' },
  latteCup: { id: 38737533, alt: 'A matcha latte in a pale blue ceramic cup on a wooden table', by: 'alyona-nagel' },
  latteArt: { id: 17366784, alt: 'A matcha latte with latte art in a café', by: 'connorscottmcmanus' },
  icedMatcha: { id: 8004558, alt: 'A chasen and a glass of iced matcha latte', by: 'darina-belonogova' },
  matchaShop: { id: 39415489, alt: 'A green matcha tea shop front on a street in Japan', by: 'reyhanalioglu' },
  pourOver: { id: 36970901, alt: 'A pour-over coffee being brewed, close up', by: 'masudriguez' },
  nelDrip: { id: 29507967, alt: 'A coffee cup and a cloth filter, seen from above', by: 'israyosoy' },
  pourOverScale: { id: 9784908, alt: 'Pour-over coffee brewing with a kettle and a scale', by: 'cihanyuce' },
  mochiPlate: { id: 31297741, alt: 'Traditional Japanese mochi on a black plate', by: 'julio-ribeiro' },
  mochiHands: { id: 33493385, alt: 'Hands holding a green mochi over a black plate', by: 'nadin-sh' },
  mochiWhite: { id: 29821271, alt: 'Three mochi on a white surface', by: 'eden-fc' },
  onigiriBoard: { id: 30874708, alt: 'An onigiri rice ball wrapped in nori on a wooden board', by: 'airamdphoto' },
  onigiriThree: { id: 30874703, alt: 'Three onigiri on a wooden board', by: 'airamdphoto' },
  teaRows: { id: 6136356, alt: 'Rows of tea shrubs at sundown', by: 'quang-nguyen-vinh' },
  teaMist: { id: 33464395, alt: 'Tea plantations on rolling hills under morning mist', by: 'duc-nguyen' },
  teaLeaves: { id: 8692691, alt: 'Tea leaves covering a hillside', by: 'lena-goncharova' },
  bambooKyoto: { id: 7924749, alt: 'A bamboo forest in Kyoto', by: 'jess-ho' },
  mossPath: { id: 37735407, alt: 'A mossy stone path in a Japanese garden', by: 'kamilas-pariestis' },
  teaRoomKyoto: { id: 36352180, alt: 'A tea room in Kyoto', by: 'ekrulila' },
  tatamiCeremony: { id: 35680926, alt: 'A tea ceremony in a tatami room', by: 'ekrulila' },
  tatamiShoji: { id: 35680939, alt: 'A tatami room with shoji screens', by: 'ekrulila' },
  kyotoAutumn: { id: 35119552, alt: 'Autumn in a historic Kyoto neighbourhood', by: 'eugeniofr' },
  zenRaked: { id: 37309550, alt: 'A Japanese zen garden with raked sand', by: 'wal_' },
  mossCheck: { id: 27666769, alt: 'A checkerboard of moss and stone in a Japanese garden', by: 'hugosykes' },
  whiskClose: { id: 8951773, alt: 'A hand whisking matcha in a bowl', by: 'ivan-s' },
  mossClose: { id: 32667141, alt: 'Moss on a forest floor, close up', by: 'magda-ehlers' },

  norenKyoto: { id: 8780831, alt: 'Looking through a noren curtain in Kyoto, with green leaves beyond', by: 'satoshi' },
  norenTwilight: { id: 35132879, alt: 'The entrance of a Japanese house with a noren at twilight', by: 'muharrem-alper' },
  teaRoomBowl: { id: 7537519, alt: 'A tea room in Kyoto with a clay bowl on a tatami mat', by: 'daisuke-fujita' },
  hishaku: { id: 6249726, alt: 'A wooden ladle pouring hot water into a tea bowl on tatami', by: 'ryutaro' },
  steamBowl: { id: 31199969, alt: 'Steam rising from a bowl of matcha as it is prepared', by: 'silviopelegrin' },
  utensilsFlat: { id: 8474084, alt: 'Matcha things from above: a bamboo whisk, bowls and green powder', by: 'cup-of-couple' },
  ceremonySet: { id: 7113832, alt: 'A quiet tea set with ceramic bowls and a bamboo whisk, from above', by: 'ekaterina-bolovtsova' },
  bowlTop: { id: 15712200, alt: 'Bright green matcha in a rustic ceramic bowl with a bamboo whisk, from above', by: 'andrii-zholobovych' },
  foamBowl: { id: 29574692, alt: 'Frothy matcha in a ceramic bowl with a bamboo whisk', by: 'anna-androshuk' },
  whiskSoft: { id: 8474186, alt: 'A bamboo whisk in a hand, mixing matcha', by: 'cup-of-couple' },
  chasenShadow: { id: 8474098, alt: 'A bamboo whisk casting a long shadow on white', by: 'cup-of-couple' },
  wagashiTatami: { id: 32330102, alt: 'A bowl of matcha and a Japanese sweet on a tatami mat', by: 'viridianaor' },
  wagashiCeremony: { id: 29518256, alt: 'Matcha and wagashi set out for a tea ceremony', by: 'g-n' },
  wagashiPine: { id: 24186411, alt: 'A wagashi sweet on fresh pine needles in a wooden box', by: 'change-c-c' },
  latteCraft: { id: 17190058, alt: 'A barista pouring milk into a matcha latte', by: 'masudriguez' },
  icedPour: { id: 32972520, alt: 'Iced matcha latte poured from a small jug into a tall glass', by: 'dickydikiw' },
  kiyomizu: { id: 30947495, alt: 'Kiyomizu-dera in Kyoto among green trees', by: 'jp-pasku' },
  higashiyama: { id: 5745821, alt: 'Old wooden houses and a street lamp on a lane in Higashiyama, Kyoto', by: 'ryutaro' },
  kyotoDusk: { id: 34215917, alt: 'A traditional street in Kyoto at dusk', by: 'talharesitoglu' },
  kyotoAlley: { id: 2641279, alt: 'A narrow Kyoto lane with paper lanterns', by: 'satoshi' }
};

// Everything a <Photo> needs for one image.
export function picture(key) {
  const p = photos[key];
  if (!p) return null;
  const m = manifest[p.id];
  if (m) {
    const set = (ext) => m.w.map((w) => `${local(p.id, w, ext)} ${w}w`).join(', ');
    return { alt: p.alt, avif: set('avif'), jpg: set('jpg'), src: local(p.id, m.w[Math.min(1, m.w.length - 1)], 'jpg'), preview: m.ph, colour: m.c };
  }
  return { alt: p.alt, avif: '', jpg: REMOTE_WIDTHS.map((w) => `${remote(p.id, w)} ${w}w`).join(', '), src: remote(p.id, 800), preview: '', colour: '' };
}

// One address at about the width asked for (the guest app's thumbnails).
export function src(key, w = 1200) {
  const p = photos[key];
  if (!p) return '';
  const m = manifest[p.id];
  if (m) return local(p.id, m.w.find((x) => x >= w) || m.w[m.w.length - 1], 'jpg');
  return remote(p.id, w);
}

export function alt(key) {
  return photos[key]?.alt ?? '';
}
