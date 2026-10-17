// Photography. Every image is a Pexels photo (free licence, attribution
// appreciated but not required). Swap any id for your own photo when you
// have one; `npm run images:fetch` downloads them to public/photos for
// self-hosting (see scripts/fetch-images.sh).
//
// Each entry: id, alt text, photographer (Pexels handle).
// Set VITE_PHOTOS_LOCAL=1 (after `npm run images:fetch`) to serve the
// downloaded copies from /photos instead of hotlinking Pexels.
const LOCAL = import.meta.env.VITE_PHOTOS_LOCAL === '1';
const LOCAL_SIZES = [800, 1600];
const PEXELS = (id, w = 1600) => {
  if (LOCAL) {
    const size = LOCAL_SIZES.find((s) => s >= w) || 1600;
    return `/photos/${id}-${size}.jpg`;
  }
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
};

export const photos = {
  heroWhisk: { id: 8474184, alt: 'A hand whisking matcha with a bamboo chasen', by: 'cup-of-couple' },
  handsWhisk: { id: 8004576, alt: 'Hands preparing matcha with a whisk and a ceramic cup', by: 'darina-belonogova' },
  bowlRustic: { id: 38275684, alt: 'Vivid green matcha in a rustic ceramic bowl with a bamboo whisk', by: 'julias-torten-und-tortchen' },
  powderTray: { id: 38987827, alt: 'Matcha powder in a bowl with a bamboo whisk on a tray', by: 'charles-chen' },
  powderSpoon: { id: 8952815, alt: 'A hand holding a spoon of matcha powder', by: 'ivan-s' },
  scoop: { id: 8329633, alt: 'A bamboo scoop of matcha over a traditional tea set', by: 'anna-pou' },
  latteCup: { id: 38737533, alt: 'A matcha latte in a pale blue ceramic cup on a wooden table', by: 'alyona-nagel' },
  latteBooks: { id: 8330286, alt: 'A matcha latte on a table next to books', by: 'anna-pou' },
  latteArt: { id: 17366784, alt: 'A matcha latte with latte art in a café', by: 'connorscottmcmanus' },
  icedMatcha: { id: 8004558, alt: 'A chasen and a glass of iced matcha latte', by: 'darina-belonogova' },
  matchaShop: { id: 39415489, alt: 'A green matcha tea shop front on a street in Japan', by: 'reyhanalioglu' },
  pourOver: { id: 36970901, alt: 'A pour-over coffee being brewed, close up', by: 'masudriguez' },
  pourOverHand: { id: 8937270, alt: 'Hot water poured over coffee grounds in a filter', by: 'thirdman' },
  nelDrip: { id: 29507967, alt: 'A coffee cup and a cloth filter, seen from above', by: 'israyosoy' },
  pourOverScale: { id: 9784908, alt: 'Pour-over coffee brewing with a kettle and a scale', by: 'cihanyuce' },
  mochiPlate: { id: 31297741, alt: 'Traditional Japanese mochi on a black plate', by: 'julio-ribeiro' },
  mochiHands: { id: 33493385, alt: 'Hands holding a green mochi over a black plate', by: 'nadin-sh' },
  mochiWhite: { id: 29821271, alt: 'Three mochi on a white surface', by: 'eden-fc' },
  mochiGreen: { id: 8963453, alt: 'Green tea mochi on a white plate', by: 'rdne' },
  onigiriBoard: { id: 30874708, alt: 'An onigiri rice ball wrapped in nori on a wooden board', by: 'airamdphoto' },
  onigiriThree: { id: 30874703, alt: 'Three onigiri on a wooden board', by: 'airamdphoto' },
  teaRows: { id: 6136356, alt: 'Rows of tea shrubs at sundown', by: 'quang-nguyen-vinh' },
  teaMist: { id: 33464395, alt: 'Tea plantations on rolling hills under morning mist', by: 'duc-nguyen' },
  teaFog: { id: 3848200, alt: 'A green hillside in fog', by: 'harsh-chikhalia' },
  teaLeaves: { id: 8692691, alt: 'Tea leaves covering a hillside', by: 'lena-goncharova' },
  bambooKyoto: { id: 7924749, alt: 'A bamboo forest in Kyoto', by: 'jess-ho' },
  bambooLight: { id: 20793642, alt: 'Sunlight filtering through a bamboo grove', by: 'justguryan' },
  bambooDense: { id: 38279066, alt: 'Dense bamboo forest', by: 'magda-ehlers' },
  bambooStalks: { id: 13156791, alt: 'Green bamboo stalks close up', by: 'laura-paredis' },
  mossPath: { id: 37735407, alt: 'A mossy stone path in a Japanese garden', by: 'kamilas-pariestis' },
  mossGarden: { id: 36937664, alt: 'A Japanese garden in Komoro, Nagano', by: 'hiropon9228923' },
  mossKyoto: { id: 31418378, alt: 'Moss-covered statues at a Kyoto temple', by: 'daniel-gubo' },
  teaHouseGarden: { id: 38658903, alt: 'A traditional Japanese tea house in a garden', by: 'technobulka' },
  teaRoomKyoto: { id: 36352180, alt: 'A tea room in Kyoto', by: 'ekrulila' },
  tatamiCeremony: { id: 35680926, alt: 'A tea ceremony in a tatami room', by: 'ekrulila' },
  tatamiShoji: { id: 35680939, alt: 'A tatami room with shoji screens', by: 'ekrulila' },
  kyotoPatio: { id: 10274613, alt: 'A sunlit patio with sliding doors, Kyoto', by: 'satoshi' },
  kyotoStreet: { id: 33116164, alt: 'A traditional street in Kyoto with wooden houses', by: 'faruktokluoglu' },
  kyotoAutumn: { id: 35119552, alt: 'Autumn in a historic Kyoto neighbourhood', by: 'eugeniofr' },
  kyotoRiver: { id: 29570368, alt: 'A riverside path in Kyoto with traditional houses', by: 'mistermacri' },
  zenRaked: { id: 37309550, alt: 'A Japanese zen garden with raked sand', by: 'wal_' },
  mossCheck: { id: 27666769, alt: 'A checkerboard of moss and stone in a Japanese garden', by: 'hugosykes' },
  zenAutumn: { id: 34977548, alt: 'Autumn leaves on gravel in a zen garden, Nara', by: 'chris-zhou' },
  cafeMinimal: { id: 29458907, alt: 'A bright, minimal café interior', by: 'oyeyogi' },
  cafeSunlit: { id: 34839408, alt: 'A sunlit café with wooden chairs and tables', by: 'stephanie-hooben' },
  cafeGreen: { id: 18721982, alt: 'A café interior with wooden chairs and greenery', by: 'arda-kaykisiz' },
  cafeWhite: { id: 7934522, alt: 'A spacious café with round white tables', by: 'larissa-farber' },
  whiskClose: { id: 8951773, alt: 'A hand whisking matcha in a bowl', by: 'ivan-s' },
  whiskCeremony: { id: 8951771, alt: 'Hands preparing matcha in a tea ceremony', by: 'ivan-s' },
  mossClose: { id: 32667141, alt: 'Moss on a forest floor, close up', by: 'magda-ehlers' }
};

export function src(key, w = 1600) {
  const p = photos[key];
  return p ? PEXELS(p.id, w) : '';
}

export function srcSet(key) {
  const p = photos[key];
  if (!p) return '';
  const widths = LOCAL ? LOCAL_SIZES : [640, 960, 1280, 1600, 2000];
  return widths.map((w) => `${PEXELS(p.id, w)} ${w}w`).join(', ');
}

export function alt(key) {
  return photos[key]?.alt ?? '';
}
