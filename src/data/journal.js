// The journal: short stories about matcha, and (soon) about us.
// Each story has English and Serbian text. Body lines are plain strings:
//   '## Heading'   a section heading (also a stop on the section rail)
//   '> Quote'      a pull quote
//   '- Item'       a bullet (consecutive lines form one list)
//   '1. Item'      a numbered step (consecutive lines form one list)
//   anything else  a paragraph
// `draft: true` keeps a story off the site until it is written.

export const STORIES = [
  {
    slug: 'twenty-days-in-the-shade',
    jp: '蔭',
    photo: 'teaMist',
    date: '2026-10-18',
    minutes: 3,
    kicker: { en: 'How matcha is grown', sr: 'Kako se gaji matcha' },
    title: { en: 'Twenty days in the shade', sr: 'Dvadeset dana u hladu' },
    excerpt: {
      en: 'Why good matcha is so green, so sweet and so rare: it starts with taking the sun away.',
      sr: 'Zašto je dobra matcha toliko zelena, slatka i retka: sve počinje oduzimanjem sunca.'
    },
    body: {
      en: [
        'Most tea grows in full sun. The leaves that become matcha do not. About twenty days before the first harvest in May, the growers of Uji cover their bushes, once with reed and straw laid over a frame, now more often with black cloth, and the field goes dim.',
        'The plant answers the way any plant in shade does. It makes more chlorophyll to catch what light is left, which is where the deep green comes from. And it keeps more of its L-theanine, an amino acid that in sunlight slowly turns into catechins, the compounds that make green tea bitter. Less sun means more colour, more sweetness and more of the savoury taste the Japanese call umami.',
        '## From leaf to tencha',
        'Only the young, tender leaves of the first flush are picked. Within hours they are steamed, so they do not oxidise, and then dried flat instead of being rolled like sencha. Stems and veins are taken out. What is left is tencha: a light, papery tea made only to be ground.',
        '## Ground on stone',
        'Tencha is ground between granite millstones that turn slowly, about thirty grams an hour. A faster mill heats the powder and dulls the taste. One of our thirty-gram tins is roughly an hour of one mill\'s work.',
        '> Shade, first flush, stone mill: three reasons matcha costs what it does, and tastes the way it does.',
        'Matcha fades quickly once it meets air and light. That is why we open a new tin every two weeks and keep the open one cool and dark. Ask at the counter and we will show you the date.'
      ],
      sr: [
        'Većina čaja raste na punom suncu. Listovi od kojih nastaje matcha ne rastu tako. Dvadesetak dana pre prve berbe u maju, uzgajivači u Udžiju prekrivaju žbunove, nekada trskom i slamom položenim preko rama, danas češće crnim platnom, i polje utone u polumrak.',
        'Biljka odgovara kao svaka biljka u hladu. Pravi više hlorofila da uhvati ono malo svetla, i odatle dolazi duboka zelena boja. I zadržava više L-teanina, aminokiseline koja se na suncu polako pretvara u katehine, materije zbog kojih je zeleni čaj gorak. Manje sunca znači više boje, više slasti i više onog punog, slanastog ukusa koji Japanci zovu umami.',
        '## Od lista do tenche',
        'Beru se samo mladi, nežni listovi prve berbe. Za nekoliko sati se pare, da ne oksidišu, a zatim suše ravno, umesto da se uvijaju kao sencha. Peteljke i žilice se uklanjaju. Ono što ostane je tencha: lagan čaj nalik papiru, napravljen samo da bi se samleo.',
        '## Mleveno na kamenu',
        'Tencha se melje između granitnih žrvnjeva koji se okreću polako, tridesetak grama na sat. Brži mlin zagreje prah i otupi ukus. Jedna naša limenka od trideset grama je otprilike sat rada jednog mlina.',
        '> Hlad, prva berba, kameni mlin: tri razloga zašto matcha košta koliko košta, i ima ukus kakav ima.',
        'Matcha brzo bledi kada je dotaknu vazduh i svetlost. Zato otvaramo novu limenku na svake dve nedelje, a otvorenu čuvamo na hladnom i tamnom. Pitaj na šanku i pokazaćemo ti datum.'
      ]
    }
  },
  {
    slug: 'usucha-and-koicha',
    jp: '薄濃',
    photo: 'foamBowl',
    date: '2026-10-18',
    minutes: 3,
    kicker: { en: 'Two ways to whisk', sr: 'Dva načina mućenja' },
    title: { en: 'Usucha and koicha: thin tea, thick tea', sr: 'Usucha i koicha: tanak i gust čaj' },
    excerpt: {
      en: 'The same powder makes two very different drinks. Here is what changes, in grams and degrees.',
      sr: 'Isti prah daje dva sasvim različita napitka. Evo šta se menja, u gramima i stepenima.'
    },
    body: {
      en: [
        'In a Japanese tea room, matcha comes two ways. Usucha, thin tea, is the one most people know: a light, foamy bowl you finish in a few sips. Koicha, thick tea, is something else entirely, closer to warm green velvet than to a drink.',
        '## Usucha, 薄茶',
        'Two grams of matcha, about seventy millilitres of water at seventy to eighty degrees, and fifteen seconds of quick strokes with the bamboo chasen, back and forth from the wrist. The aim is a fine, even foam with no large bubbles. It is bright, a little bitter at the edges and sweet underneath.',
        '## Koicha, 濃茶',
        'Twice the matcha, about four grams, and less than half the water, thirty to forty millilitres. Koicha is not whisked but kneaded: the chasen moves slowly in a circle until the tea is glossy and thick enough to coat the bowl. There is no foam. With nothing to hide behind, koicha needs the best first-harvest matcha, which is why tea schools keep it for the most formal part of a gathering, when one bowl is passed from guest to guest.',
        '- Usucha: 2 g · 70 ml · 70–80 °C · whisked to a foam',
        '- Koicha: 4 g · 30–40 ml · 70–80 °C · kneaded, no foam',
        '> Usucha is the bowl you drink every day. Koicha is the one you remember.',
        'At Machiko every matcha drink starts as usucha. Koicha is on the menu too, from the same tin, for anyone who wants to taste matcha with nothing in the way.'
      ],
      sr: [
        'U japanskoj čajnoj sobi matcha se služi na dva načina. Usucha, tanak čaj, je onaj koji većina zna: lagana, penušava činija koja se popije u nekoliko gutljaja. Koicha, gust čaj, nešto je sasvim drugo, bliže toplom zelenom somotu nego napitku.',
        '## Usucha, 薄茶',
        'Dva grama matche, sedamdesetak mililitara vode na sedamdeset do osamdeset stepeni i petnaest sekundi brzih pokreta bambusovim chasenom, napred-nazad iz zgloba. Cilj je fina, ujednačena pena bez krupnih mehurića. Svetla je, malo gorka po ivicama, a slatka ispod.',
        '## Koicha, 濃茶',
        'Dvostruko više matche, oko četiri grama, i manje od pola vode, trideset do četrdeset mililitara. Koicha se ne muti nego mesi: chasen se polako kreće u krug dok čaj ne postane sjajan i dovoljno gust da obloži činiju. Pene nema. Pošto u njoj ništa ne može da se sakrije, za koichu treba najbolja matcha prve berbe, i zato je škole čaja čuvaju za najsvečaniji deo susreta, kada jedna činija ide od gosta do gosta.',
        '- Usucha: 2 g · 70 ml · 70–80 °C · umućena u penu',
        '- Koicha: 4 g · 30–40 ml · 70–80 °C · umešena, bez pene',
        '> Usuchu piješ svaki dan. Koichu pamtiš.',
        'U Machiku svaki matcha napitak počinje kao usucha. Koicha je takođe na meniju, iz iste limenke, za svakoga ko želi da proba matchu bez ičega između.'
      ]
    }
  },
  {
    slug: 'a-menu-of-twenty-four-seasons',
    jp: '節気',
    photo: 'kyotoAutumn',
    date: '2026-10-18',
    minutes: 3,
    kicker: { en: 'Why our menu changes', sr: 'Zašto se naš meni menja' },
    title: { en: 'A menu of twenty-four seasons', sr: 'Meni od dvadeset četiri doba' },
    excerpt: {
      en: 'The old calendar Japan still lives by splits the year into twenty-four short seasons. So does our menu.',
      sr: 'Stari kalendar po kome Japan i danas živi deli godinu na dvadeset četiri kratka doba. I naš meni.'
    },
    body: {
      en: [
        'Spring, summer, autumn, winter: four seasons are a blunt way to describe a year. The old East Asian calendar, which reached Japan from China more than a thousand years ago, uses twenty-four. Each one, a sekki, lasts about fifteen days and begins when the sun has moved another fifteen degrees along its path.',
        'Their names read like notes in a farmer\'s diary: Insects Awaken, Pure Brightness, Grain Rain, White Dew, Frost Descent. In Japan they still mark what to plant, what to eat and what to wear, and each is split again into three micro-seasons of about five days, seventy-two in all.',
        '## How we use them',
        'Every term brings a new special to the counter, something that belongs to that fortnight. We open on 春分, Shunbun, the spring equinox, with a sakura matcha latte. Two weeks later comes 清明, Seimei, pure brightness, and kusa mochi made with yomogi, a spring herb. In the heat of 大暑, Taisho, warabi mochi is served ice-cold; in 霜降, Sōkō, when the first frost falls, hojicha meets roasted Serbian chestnut.',
        '> The calendar gives us a reason to change, and you a reason to come back in two weeks.',
        'The strip at the top of our menu always shows the season we are in, its dates in Belgrade and what is on the counter. The dates are worked out from the sun every year, the way the calendar intends.'
      ],
      sr: [
        'Proleće, leto, jesen, zima: četiri doba su grub način da se opiše godina. Stari istočnoazijski kalendar, koji je u Japan stigao iz Kine pre više od hiljadu godina, ima ih dvadeset četiri. Svako, sekki, traje petnaestak dana i počinje kada sunce pređe još petnaest stepeni svoje putanje.',
        'Njihova imena zvuče kao beleške iz seljačkog dnevnika: Buđenje insekata, Čista vedrina, Žitna kiša, Bela rosa, Prvi mraz. U Japanu i danas govore šta sejati, šta jesti i šta obući, a svako se deli na još tri mikro-doba od po pet dana, ukupno sedamdeset dva.',
        '## Kako ih koristimo',
        'Svako doba donosi na šank novu sezonsku ponudu, nešto što pripada baš tim nedeljama. Otvaramo na 春分, Šunbun, prolećnu ravnodnevicu, uz sakura matcha late. Dve nedelje kasnije stiže 清明, Seimei, čista vedrina, i kusa mochi sa jomogijem, prolećnom biljkom. U vrelini 大暑, Taisho, warabi mochi se služi ledeno hladan; u 霜降, Sōkō, kada padne prvi mraz, hojicha se sreće sa pečenim srpskim kestenom.',
        '> Kalendar nama daje razlog da menjamo, a tebi razlog da se vratiš za dve nedelje.',
        'Traka na vrhu našeg menija uvek pokazuje doba u kome smo, njegove datume u Beogradu i šta je na šanku. Datumi se svake godine računaju prema suncu, kako kalendar i nalaže.'
      ]
    }
  },
  {
    slug: 'how-to-whisk-a-bowl-at-home',
    jp: '点前',
    photo: 'handsWhisk',
    date: '2026-10-18',
    minutes: 4,
    kicker: { en: 'At home', sr: 'Kod kuće' },
    title: { en: 'How to whisk a bowl at home', sr: 'Kako da umutiš činiju kod kuće' },
    excerpt: {
      en: 'You need a bowl, a bamboo whisk, a sieve and two minutes. Here is the whole method.',
      sr: 'Trebaju ti činija, bambusova metlica, sito i dva minuta. Evo celog postupka.'
    },
    body: {
      en: [
        'Usucha at home is easier than it looks, and the things that matter are few: fresh matcha, water that is not too hot, and a whisk with enough tines to make a fine foam.',
        '## You need',
        '- A wide bowl: a chawan, or any bowl you can whisk in',
        '- A bamboo chasen with 80 to 100 tines',
        '- A small, fine sieve',
        '- 2 g of matcha: a heaped bamboo scoop, or a level teaspoon',
        '- 70 ml of water at 70–80 °C',
        '## The method',
        '1. Soak the chasen in warm water for a minute. The tines soften and are less likely to snap.',
        '2. Warm the bowl with hot water, pour it away and wipe it dry.',
        '3. Sift the matcha into the bowl. This is the step people skip, and the reason their foam has lumps.',
        '4. Pour in about 20 ml of the water and work the powder into a smooth paste with the chasen.',
        '5. Add the rest of the water and whisk fast from the wrist, in a W or M shape, for about fifteen seconds, with the tines just off the bottom.',
        '6. When the foam is fine and even, slow down, draw one small circle and lift the whisk out from the centre.',
        '> Big bubbles? Whisk a few seconds longer near the surface. No foam at all? The water was too hot, or the matcha too old.',
        'Afterwards, rinse the chasen in warm water with no soap and let it dry on a ceramic whisk holder, or standing on its handle; never in a closed box. A good chasen lasts for months.',
        'We sell the same thirty-gram tins we whisk from, and chasen from Takayama in Nara, where they have been made by hand for about five hundred years.'
      ],
      sr: [
        'Usucha kod kuće je lakša nego što izgleda, a stvari koje su važne su malobrojne: sveža matcha, voda koja nije prevruća i metlica sa dovoljno zubaca za finu penu.',
        '## Treba ti',
        '- Široka činija: chawan, ili bilo koja činija u kojoj možeš da mutiš',
        '- Bambusov chasen sa 80 do 100 zubaca',
        '- Malo, fino sito',
        '- 2 g matche: puna bambusova kašičica, ili ravna kafena kašičica',
        '- 70 ml vode na 70–80 °C',
        '## Postupak',
        '1. Potopi chasen u toplu vodu na minut. Zupci omekšaju i teže pucaju.',
        '2. Zagrej činiju vrelom vodom, prospi je i obriši.',
        '3. Prosej matchu u činiju. Ovaj korak ljudi preskaču, i zato im pena ima grudvice.',
        '4. Sipaj oko 20 ml vode i chasenom razmuti prah u glatku pastu.',
        '5. Dodaj ostatak vode i muti brzo iz zgloba, u obliku slova W ili M, petnaestak sekundi, sa zupcima tik iznad dna.',
        '6. Kada je pena fina i ujednačena, uspori, opiši jedan mali krug i izvuci metlicu iz sredine.',
        '> Krupni mehurići? Muti još nekoliko sekundi blizu površine. Nema pene? Voda je bila prevruća, ili matcha prestara.',
        'Posle ispiraj chasen u toploj vodi, bez deterdženta, i ostavi ga da se osuši na keramičkom držaču ili uspravno na dršci; nikad u zatvorenoj kutiji. Dobar chasen traje mesecima.',
        'Prodajemo iste limenke od trideset grama iz kojih mutimo, i chasen iz Takajame u Nari, gde se ručno prave oko pet stotina godina.'
      ]
    }
  },
  {
    slug: 'our-story',
    jp: '物語',
    photo: 'norenKyoto',
    date: null,
    minutes: 4,
    draft: true,
    kicker: { en: 'About us', sr: 'O nama' },
    title: { en: 'Our story', sr: 'Naša priča' },
    excerpt: {
      en: 'How Machiko began, and why in Dorćol. We are writing it now.',
      sr: 'Kako je nastao Machiko, i zašto baš na Dorćolu. Upravo je pišemo.'
    },
    // To write together. Replace each line, then remove `draft: true`.
    body: {
      en: [
        '[John: the first bowl of matcha that mattered, and where you drank it]',
        '## Why Belgrade, why Dorćol',
        '[Katarina: the neighbourhood, the street, what it is missing]',
        '## The name',
        '[Machiko, まちこ: the ま of 間, the pause between things, and why it stuck]',
        '## The room we wanted',
        '[What you hope people feel when they come through the noren]'
      ],
      sr: [
        '[John: prva činija matche koja je bila važna, i gde]',
        '## Zašto Beograd, zašto Dorćol',
        '[Katarina: kraj, ulica, šta mu nedostaje]',
        '## Ime',
        '[Machiko, まちこ: ま iz reči 間, pauza između stvari, i zašto je ostalo]',
        '## Prostor koji smo želeli',
        '[Šta želite da ljudi osete kada prođu kroz noren]'
      ]
    }
  }
];

export const PUBLISHED = STORIES.filter((s) => !s.draft);

export function findStory(slug) {
  return PUBLISHED.find((s) => s.slug === slug);
}

export function nextStory(slug) {
  const i = PUBLISHED.findIndex((s) => s.slug === slug);
  return i < 0 ? null : PUBLISHED[(i + 1) % PUBLISHED.length];
}

// Turn the body lines into blocks: paragraphs, headings, quotes and lists.
export function toBlocks(lines) {
  const out = [];
  for (const line of lines) {
    if (line.startsWith('## ')) out.push({ type: 'h', text: line.slice(3) });
    else if (line.startsWith('> ')) out.push({ type: 'quote', text: line.slice(2) });
    else if (line.startsWith('- ')) {
      const last = out[out.length - 1];
      if (last && last.type === 'ul') last.items.push(line.slice(2));
      else out.push({ type: 'ul', items: [line.slice(2)] });
    } else if (/^\d+\. /.test(line)) {
      const last = out[out.length - 1];
      const text = line.replace(/^\d+\. /, '');
      if (last && last.type === 'ol') last.items.push(text);
      else out.push({ type: 'ol', items: [text] });
    } else out.push({ type: 'p', text: line });
  }
  return out;
}
