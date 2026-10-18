// UI copy in English and Serbian (Latin). Keys are dotted paths; `t()` in
// LangContext resolves them. Keep sentences short; the menu items carry
// their own translations in menu.js.
export const STRINGS = {
  en: {
    nav: { menu: 'Menu', matcha: 'Matcha', visit: 'Visit', order: 'Order', stamps: 'Stamps', app: 'Guest app', home: 'Home', journal: 'Journal', join: 'Founding list' },
    common: {
      seeMenu: 'See the menu', orderAhead: 'Order ahead', fullMenu: 'Full menu', back: 'Back', close: 'Close',
      rsd: 'RSD', each: 'each', openDaily: 'Daily 08:00–20:00', address: '[Street & number], Dorćol, 11000 Beograd',
      phone: '+381 [phone]', instagram: '@machiko.beograd', copyright: 'Machiko まちこ · matcha & coffee · 2026',
      photoCredit: 'Photography from Pexels; replace with your own shots when you have them.'
    },
    season: { term: 'solar term', fortnight: 'This fortnight', until: 'until', fallback: 'Ask what is in season.' },
    rail: {
      label: 'Sections on this page', top: 'Back to top',
      enter: 'Enter', bowl: 'One bowl', matcha: 'Matcha', room: 'The room', shade: 'The shade', way: 'The way',
      calm: 'Calm', kitchen: 'Kitchen', journal: 'Journal', visit: 'Visit',
      specs: 'The tin', how: 'How we whisk', faq: 'Questions', space: 'The space', hours: 'Hours', find: 'Find us', workshops: 'Workshops'
    },
    hero: {
      clockBg: 'Beograd', clockKy: 'Kyoto',
      chipSeason: 'this fortnight', chipUsucha: 'Usucha · 2 g · 70 ml · 70 °C · 15 s', chipOrigin: 'Uji, Kyoto · first flush · stone-milled',
      chipOpening: (n) => `Opening 20.03.2027 · ${n} ${n === 1 ? 'day' : 'days'} to go`, chipOpenToday: 'We open today, on the equinox', chipOpen: 'Open daily · 08:00–20:00',
      chipStamps: 'Ten stamps, one usucha on us',
      proof: [['宇治', 'Uji'], ['一番茶', 'First flush'], ['石臼', 'Stone-milled'], ['春分', 'Opens on the equinox']]
    },
    garden: {
      eyebrow: 'Ichigo ichie · one time, one meeting',
      title: 'Every bowl is whisked once, for you.',
      body: 'Japanese tea masters have a phrase for it: this meeting will not come again. So the water is measured, the matcha sifted and the bowl warmed for one person at a time. Sit down; we will bring it to you.',
      cta: 'How we make it'
    },
    marquee: [
      ['一期一会', 'ichigo ichie', 'one time, one meeting'],
      ['和敬清寂', 'wa kei sei jaku', 'harmony, respect, purity, tranquillity'],
      ['侘寂', 'wabi-sabi', 'beauty in the imperfect'],
      ['間', 'ma', 'the pause between things'],
      ['旬', 'shun', 'a food at its best'],
      ['一服', 'ippuku', 'one bowl, one breath']
    ],
    way: {
      eyebrow: 'The way · from field to bowl', title: 'Six steps between a hill in Uji and your table.',
      hint: 'Scroll', steps: [
        ['畑', 'hatake', 'The field', 'The hills of Uji, south of Kyoto, where tea has been grown for centuries. The first flush is picked in May.'],
        ['蔭', 'kage', 'The shade', 'Twenty days before picking, the bushes go under cover. Less sun, more chlorophyll and L-theanine: a deeper green, a softer taste.'],
        ['碾', 'hiki', 'The mill', 'The leaves are steamed, dried flat and ground between granite stones, about thirty grams an hour, so the powder never heats up.'],
        ['篩', 'furui', 'The sieve', 'Two grams go through a fine sieve into a warm bowl. Sifting is what makes the foam fine.'],
        ['点', 'ten', 'The whisk', 'Seventy millilitres at seventy degrees, and fifteen seconds of quick strokes with the bamboo chasen.'],
        ['一服', 'ippuku', 'The bowl', 'Served at once, its front turned towards you. Drink it while the foam is alive.']
      ]
    },
    journal: {
      eyebrow: 'Journal', title: 'Stories about matcha, and about us.',
      lede: 'Short reads from the counter: how matcha is grown and made, the seasons our menu follows, and how to whisk a bowl at home.',
      read: 'Read the story', minRead: (n) => `${n} min read`, comingSoon: 'Coming soon',
      ourStoryTitle: 'Our story', ourStoryBody: 'How Machiko began, and why in Dorćol. We are writing it now.',
      all: 'All stories', next: 'Next story', homeTitle: 'From the journal', published: 'Published'
    },
    join: {
      eyebrow: 'Founding list', title: 'Be first through the noren.',
      lede: 'Leave your name and email and we will invite you to the soft opening, 11–17 March 2027, before the doors open to everyone on the spring equinox.',
      perks: ['Your first bowl is on us during the soft opening', 'An invitation before anyone else, 11–17 March', 'The seasonal menu, every two weeks'],
      name: 'First name', email: 'Email', phone: 'Mobile (optional)', phoneHint: 'Only if you would like a text the day before. Serbian numbers start with +381.',
      consentEmail: 'Yes, email me about the opening and the seasonal menu: about two emails a month, unsubscribe in one click.',
      consentSms: 'Yes, text me as well: at most three messages around the opening.',
      privacy: 'How we use your details', submit: 'Join the founding list', sending: 'Sending…',
      done: 'Almost there. Check your inbox and confirm your email; then you are on the list.',
      error: 'Something went wrong. Please try again, or write to hello@machiko.rs.',
      needEmailConsent: 'Tick the email box so we can send your invitation.',
      needPhone: 'Add your mobile number for the text, or untick the box.',
      notConnected: 'Preview: this form is not connected to the mailing list yet.'
    },
    privacy: {
      eyebrow: 'Privacy', title: 'What we keep, and why.',
      lede: 'What we collect when you join the founding list or use the guest app, and what we do with it.',
      sections: [
        ['Who we are', 'Machiko, [company name] DOO, [street and number], Belgrade, PIB [number]. Write to hello@machiko.rs about anything on this page.'],
        ['What we collect', 'Your first name and email address and, if you give it, your mobile number; when and how you agreed to hear from us; and your language. The guest app keeps your stamps and orders on your own phone.'],
        ['Why', 'To send you the emails and texts you asked for, and nothing else. We do not sell your details or share them for advertising. Our email and SMS providers process them on our behalf, under contract.'],
        ['For how long', 'Until you unsubscribe or ask us to delete them. Every email has an unsubscribe link, and every text tells you how to stop them.'],
        ['Your rights', 'You can ask to see, correct or delete your details at any time by writing to hello@machiko.rs. If you think we have handled them badly, you can complain to the Commissioner for Information of Public Importance and Personal Data Protection.']
      ],
      note: 'Draft, to be checked against the Law on Personal Data Protection before the list opens.'
    },
    foot: { journal: 'Journal', join: 'Founding list', privacy: 'Privacy' },
    home: {
      eyebrow: 'Matcha · wellness · Dorćol, Beograd',
      title: 'An hour of Kyoto, in Belgrade.',
      lede: 'Ceremonial matcha from Uji, whisked to order with a bamboo chasen. Slow coffee, a small Japanese kitchen, and a room made for slowing down.',
      roomEyebrow: 'The room', roomTitle: 'Twenty seats and a lot of quiet.',
      roomBody: 'Shoji light, raw wood, a counter you can watch from and a retail corner by the window. No music louder than the kettle. Phones welcome, laptops until noon.',
      calmEyebrow: 'Why matcha', calmTitle: 'Calm, not a jolt.',
      calmBody: 'Matcha is the whole leaf, ground and whisked, so you drink what the plant made in the shade.',
      calm: [
        ['L-theanine', 'Shaded leaves are rich in it. Paired with matcha\'s gentle caffeine it is associated with alert calm rather than a spike and a crash.'],
        ['Catechins', 'Whole-leaf tea keeps its catechins, EGCG among them, the polyphenols green tea is studied for.'],
        ['Fifteen seconds', 'Sifting, pouring, whisking. The ritual is short, and it is the point: a pause you can feel before the first sip.']
      ],
      calmNote: 'We are a tea house, not a clinic: enjoy matcha for how it tastes and how it makes you feel, and ask a doctor about the rest.',
      waysEyebrow: 'Matcha', waysTitle: 'Three ways to drink it.',
      shadeEyebrow: 'The shade', shadeTitle: 'Twenty days in the shade.',
      shadeBody: 'Three weeks before the May harvest, the tea fields of Uji are covered. Starved of sun, the leaves hold on to their chlorophyll and L-theanine: the colour deepens, the bitterness falls away, the umami builds. That shade is where the flavour comes from. Every tin we open is first-harvest tencha, ground on a stone mill at thirty grams an hour, and finished within two weeks of opening.',
      seals: { uji: 'Uji, Kyoto', first: 'First harvest', stone: 'Stone-milled', whisk: 'Whisked to order' },
      mochiEyebrow: 'The kitchen', mochiTitle: 'Pounded this morning.',
      mochiBody: 'Glutinous rice is steamed, pounded and shaped every morning while the first matcha is whisked. Daifuku around sweet azuki, warabi mochi with kinako, tamago sando on shokupan, and whatever the season puts on the counter.',
      coffeeTitle: 'Slow bar', coffeeBody: 'Nel drip, V60 and espresso. One seasonal single origin, roasted in Belgrade, changed with the solar term.',
      kitchenTitle: 'Small kitchen', kitchenBody: 'Daifuku and warabi mochi pounded each morning, tamago sando on shokupan, salmon and umeboshi onigiri, ogura toast.',
      shopTitle: 'Take it home', shopBody: 'Our ceremonial blend in 30 g tins, chasen from Takayama, chawan and chashaku. We show you how.',
      visitEyebrow: 'Visit', visitTitle: 'Dorćol, Beograd.',
      appEyebrow: 'Guest app', appTitle: 'Order ahead, collect stamps, reserve a seat.',
      appBody: 'Add Machiko to your home screen. Every drink earns a stamp; ten stamps are an usucha on the house.',
      openApp: 'Open the guest app'
    },
    menu: {
      eyebrow: 'Menu', title: 'Made to order, one cup at a time.',
      lede: 'Matcha is whisked by hand. Coffee is brewed one cup at a time. The season changes the menu; the hours do not.',
      footnote: 'Prices in dinars, service included. Allergens and milk options on request. Any latte can be made koicha-strength.',
      orderInApp: 'Order ahead in the app', thisFortnight: 'this fortnight'
    },
    matcha: {
      eyebrow: 'Our matcha', title: 'What is in the tin.',
      lede: 'One blend, two cultivars, one grade. We would rather do one matcha properly than carry six.',
      specsTitle: 'The tin', specs: {
        origin: ['Origin', 'Uji, Kyoto Prefecture'], cultivar: ['Cultivars', 'Samidori · Okumidori'], harvest: ['Harvest', 'First flush, May (ichibancha)'],
        shade: ['Shading', '20 days under tana cloth'], mill: ['Milling', 'Granite stone mill, ~30 g per hour'], grade: ['Grade', 'Ceremonial'], open: ['Freshness', 'A new tin every two weeks; ask to see the date']
      },
      howTitle: 'How we make usucha', steps: [
        ['Sift', 'Two grams through a fine sieve into a warmed chawan. Clumps are the enemy of foam.'],
        ['Water', 'Seventy millilitres at seventy degrees. Hotter burns the sweetness out.'],
        ['Whisk', 'Fifteen seconds of fast W-strokes with the chasen, then a slow circle to settle the foam.'],
        ['Serve', 'Immediately. Usucha is at its best for about a minute.']
      ],
      faqTitle: 'Questions we get',
      faq: [
        ['Why does matcha taste different here?', 'Grade and freshness. Ceremonial matcha from shaded first-harvest leaves is naturally sweet; most café matcha is a later harvest, unshaded, ground months ago. We open a new tin every two weeks and whisk every cup by hand.'],
        ['Hot or iced, milk or not?', 'Usucha and koicha are made with water only. Lattes are usucha poured over oat or whole milk; coconut on request. Iced versions are built over ice, never with ice cream.'],
        ['How much caffeine is in a cup?', 'An usucha has about 60–70 mg, roughly a flat white. Hojicha is roasted and has very little.'],
        ['Can I buy the tin?', 'Yes. Thirty grams, the same blend we whisk from, with a sheet on how to prepare it and a chasen if you need one.']
      ]
    },
    visit: {
      eyebrow: 'Visit', title: 'A quiet room in Dorćol.', galleryEyebrow: 'The space', galleryTitle: 'What you walk into.',
      kyotoEyebrow: 'Kyoto', kyotoTitle: 'Where the idea comes from.',
      lede: 'Twenty seats, a counter you can watch from, and a retail corner by the window. Children and dogs welcome; laptops welcome until noon.',
      hoursTitle: 'Hours', findTitle: 'Find us', reserveTitle: 'Reserve a seat', reserveBody: 'Walk-ins first. For four or more, or for a workshop seat, reserve in the guest app.',
      directions: 'Two minutes from Skadarlija, five from Trg Republike. Street parking is scarce; the tram stops around the corner.',
      mapNote: 'Map placeholder: add the Google Maps embed or link once the address is final.', openMap: 'Open in Google Maps',
      workshopsTitle: 'Workshops', workshops: [
        ['Usucha basics', '60 minutes, four seats. Sift, whisk, taste, and take home what you make. Saturdays at 10:00.'],
        ['Koicha, the thick way', '45 minutes, four seats. For people who already whisk at home. First Sunday of the month.']
      ]
    },
    app: {
      today: 'Today', order: 'Order', stamps: 'Stamps', reserve: 'Reserve',
      greeting: { morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening' },
      openUntil: 'open until 20:00', closedNow: 'closed now · opens 08:00', quiet: 'quiet right now',
      stampCard: 'Stamp card', of: 'of', stampsLeft: (n) => `${n} more and the next usucha is on the house.`, stampsFull: 'Your next usucha is on the house. Show this at the counter.',
      showAtCounter: 'Show the card at the counter; we stamp it.', yourUsual: 'Your usual', reorder: 'Reorder', lastTime: 'Last time',
      installTitle: 'Add Machiko to your home screen', installBody: 'One tap to order, your stamps always with you.', install: 'Add', installed: 'Installed',
      workshop: 'Workshop', seatsLeft: (n) => `${n} of 4 seats left`,
      menuTitle: 'Order ahead', menuLede: 'Pick up at the counter. We start whisking when you confirm.',
      customise: 'Make it yours', temp: 'Temperature', milk: 'Milk', size: 'Size', strength: 'Strength', quantity: 'Quantity',
      addToOrder: 'Add to order', added: 'Added.', inYourOrder: (n) => `${n} ${n === 1 ? 'item' : 'items'} in your order.`,
      viewOrder: 'View order', cart: 'Your order', empty: 'Nothing here yet.', browse: 'Browse the menu',
      pickup: 'Pick up', pickupNow: 'Now · ~8 min', total: 'Total', confirm: 'Confirm order', payNote: 'Pay at pickup or in the app. A stamp is added automatically.',
      name: 'Your name', namePlaceholder: 'So we can call you',
      status: { received: 'Received', whisking: 'Whisking', ready: 'Ready' },
      statusJp: { received: '受付', whisking: '点前', ready: '完成' },
      statusBody: { received: 'We have your order. The water is on.', whisking: 'The chasen is moving. About four minutes.', ready: 'On the counter. Show this screen.' },
      orderNumber: 'Order', newOrder: 'New order', remove: 'Remove',
      reserveTitle: 'Reserve', reserveLede: 'A table for four or more, or a seat in a workshop.',
      date: 'Date', time: 'Time', guests: 'Guests', seatOrWorkshop: 'What for', table: 'A table', note: 'Anything we should know', send: 'Send request',
      reserveSent: 'Request sent. We confirm by message within the hour.', reserveLocal: 'Saved on this phone. Connect the reservation webhook to send it to the shop.',
      profileLang: 'Language', demoStamp: 'Demo: add a stamp'
    }
  },
  sr: {
    nav: { menu: 'Meni', matcha: 'Matcha', visit: 'Poseta', order: 'Naruči', stamps: 'Pečati', app: 'Aplikacija', home: 'Početna', journal: 'Priče', join: 'Lista prvih' },
    common: {
      seeMenu: 'Pogledaj meni', orderAhead: 'Naruči unapred', fullMenu: 'Ceo meni', back: 'Nazad', close: 'Zatvori',
      rsd: 'RSD', each: 'kom', openDaily: 'Svakog dana 08:00–20:00', address: '[Ulica i broj], Dorćol, 11000 Beograd',
      phone: '+381 [telefon]', instagram: '@machiko.beograd', copyright: 'Machiko まちこ · matcha i kafa · 2026',
      photoCredit: 'Fotografije sa Pexelsa; zameni svojim kada ih budeš imao.'
    },
    season: { term: 'solarni period', fortnight: 'Ove dve nedelje', until: 'do', fallback: 'Pitaj šta je u sezoni.' },
    rail: {
      label: 'Delovi ove stranice', top: 'Nazad na vrh',
      enter: 'Ulaz', bowl: 'Jedna činija', matcha: 'Matcha', room: 'Prostor', shade: 'Hlad', way: 'Put',
      calm: 'Mir', kitchen: 'Kuhinja', journal: 'Priče', visit: 'Poseta',
      specs: 'Limenka', how: 'Kako mutimo', faq: 'Pitanja', space: 'Prostor', hours: 'Radno vreme', find: 'Gde smo', workshops: 'Radionice'
    },
    hero: {
      clockBg: 'Beograd', clockKy: 'Kjoto',
      chipSeason: 'ove dve nedelje', chipUsucha: 'Usucha · 2 g · 70 ml · 70 °C · 15 s', chipOrigin: 'Udži, Kjoto · prva berba · kameni mlin',
      chipOpening: (n) => `Otvaramo 20.03.2027. · još ${n} ${n % 10 === 1 && n % 100 !== 11 ? 'dan' : 'dana'}`, chipOpenToday: 'Danas otvaramo, na ravnodnevicu', chipOpen: 'Svakog dana · 08:00–20:00',
      chipStamps: 'Deset pečata, usucha na račun kuće',
      proof: [['宇治', 'Udži'], ['一番茶', 'Prva berba'], ['石臼', 'Kameni mlin'], ['春分', 'Otvaramo na ravnodnevicu']]
    },
    garden: {
      eyebrow: 'Ichigo ichie · jedan put, jedan susret',
      title: 'Svaka činija se muti jednom, za tebe.',
      body: 'Japanski majstori čaja imaju izraz za to: ovaj susret se neće ponoviti. Zato se voda meri, matcha proseje i činija zagreje za jednu osobu. Sedi; doneti ćemo ti je.',
      cta: 'Kako je pravimo'
    },
    marquee: [
      ['一期一会', 'ichigo ichie', 'jedan put, jedan susret'],
      ['和敬清寂', 'wa kei sei jaku', 'sklad, poštovanje, čistota, mir'],
      ['侘寂', 'wabi-sabi', 'lepota nesavršenog'],
      ['間', 'ma', 'pauza između stvari'],
      ['旬', 'shun', 'namirnica u najboljem trenutku'],
      ['一服', 'ippuku', 'jedna činija, jedan predah']
    ],
    way: {
      eyebrow: 'Put · od polja do činije', title: 'Šest koraka između brda u Udžiju i tvog stola.',
      hint: 'Skroluj', steps: [
        ['畑', 'hatake', 'Polje', 'Brda Udžija, južno od Kjota, gde se čaj gaji vekovima. Prva berba se bere u maju.'],
        ['蔭', 'kage', 'Hlad', 'Dvadeset dana pre berbe žbunovi idu pod pokrivač. Manje sunca, više hlorofila i L-teanina: dublja zelena, mekši ukus.'],
        ['碾', 'hiki', 'Mlin', 'Listovi se pare, suše ravno i melju između granitnog kamenja, tridesetak grama na sat, da se prah nikad ne zagreje.'],
        ['篩', 'furui', 'Sito', 'Dva grama kroz fino sito u toplu činiju. Od prosejavanja zavisi fina pena.'],
        ['点', 'ten', 'Metlica', 'Sedamdeset mililitara na sedamdeset stepeni i petnaest sekundi brzih pokreta bambusovim chasenom.'],
        ['一服', 'ippuku', 'Činija', 'Služi se odmah, okrenuta prednjom stranom ka tebi. Popij je dok je pena živa.']
      ]
    },
    journal: {
      eyebrow: 'Priče', title: 'Priče o matchi, i o nama.',
      lede: 'Kratka čitanja sa šanka: kako se matcha gaji i pravi, doba koja naš meni prati i kako da umutiš činiju kod kuće.',
      read: 'Pročitaj priču', minRead: (n) => `${n} min čitanja`, comingSoon: 'Uskoro',
      ourStoryTitle: 'Naša priča', ourStoryBody: 'Kako je nastao Machiko, i zašto baš na Dorćolu. Upravo je pišemo.',
      all: 'Sve priče', next: 'Sledeća priča', homeTitle: 'Iz naših priča', published: 'Objavljeno'
    },
    join: {
      eyebrow: 'Lista prvih gostiju', title: 'Budi prvi kroz noren.',
      lede: 'Ostavi ime i email i pozvaćemo te na probno otvaranje, 11–17. marta 2027, pre nego što se vrata otvore za sve na prolećnu ravnodnevicu.',
      perks: ['Prva činija je na nas tokom probnog otvaranja', 'Poziv pre svih, 11–17. marta', 'Sezonski meni, na svake dve nedelje'],
      name: 'Ime', email: 'Email', phone: 'Mobilni (nije obavezno)', phoneHint: 'Samo ako želiš poruku dan ranije. Srpski brojevi počinju sa +381.',
      consentEmail: 'Da, šaljite mi email o otvaranju i sezonskom meniju: oko dva emaila mesečno, odjava jednim klikom.',
      consentSms: 'Da, pošaljite mi i SMS: najviše tri poruke oko otvaranja.',
      privacy: 'Kako koristimo tvoje podatke', submit: 'Prijavi se na listu', sending: 'Šaljem…',
      done: 'Skoro gotovo. Proveri inbox i potvrdi email; onda si na listi.',
      error: 'Nešto nije u redu. Pokušaj ponovo ili piši na hello@machiko.rs.',
      needEmailConsent: 'Označi polje za email da bismo mogli da ti pošaljemo pozivnicu.',
      needPhone: 'Upiši broj mobilnog za SMS, ili skini oznaku.',
      notConnected: 'Pregled: forma još nije povezana sa listom.'
    },
    privacy: {
      eyebrow: 'Privatnost', title: 'Šta čuvamo i zašto.',
      lede: 'Šta prikupljamo kada se prijaviš na listu prvih gostiju ili koristiš aplikaciju za goste, i šta s tim radimo.',
      sections: [
        ['Ko smo', 'Machiko, [naziv firme] DOO, [ulica i broj], Beograd, PIB [broj]. Za sve sa ove stranice piši na hello@machiko.rs.'],
        ['Šta prikupljamo', 'Tvoje ime i email adresu i, ako ga ostaviš, broj mobilnog; kada i kako si pristao/la da ti se javljamo; i tvoj jezik. Aplikacija za goste čuva tvoje pečate i porudžbine na tvom telefonu.'],
        ['Zašto', 'Da ti šaljemo emailove i poruke koje si tražio/la, i ništa drugo. Ne prodajemo tvoje podatke i ne delimo ih za oglašavanje. Naši dobavljači za email i SMS ih obrađuju u naše ime, po ugovoru.'],
        ['Koliko dugo', 'Dok se ne odjaviš ili ne zatražiš brisanje. Svaki email ima link za odjavu, a svaka poruka kaže kako da ih zaustaviš.'],
        ['Tvoja prava', 'U svakom trenutku možeš da tražiš uvid, ispravku ili brisanje svojih podataka pišući na hello@machiko.rs. Ako misliš da smo s njima postupili loše, možeš se žaliti Povereniku za informacije od javnog značaja i zaštitu podataka o ličnosti.']
      ],
      note: 'Nacrt, za proveru prema Zakonu o zaštiti podataka o ličnosti pre otvaranja liste.'
    },
    foot: { journal: 'Priče', join: 'Lista prvih gostiju', privacy: 'Privatnost' },
    home: {
      eyebrow: 'Matcha · wellness · Dorćol, Beograd',
      title: 'Sat vremena Kjota, u Beogradu.',
      lede: 'Ceremonijalna matcha iz Udžija, umućena po porudžbini bambusovim chasenom. Spora kafa, mala japanska kuhinja i prostor napravljen za usporavanje.',
      roomEyebrow: 'Prostor', roomTitle: 'Dvadeset mesta i mnogo tišine.',
      roomBody: 'Svetlo kroz shoji, sirovo drvo, šank sa kog se sve vidi i prodajni kutak kod prozora. Muzika nikad glasnija od čajnika. Telefoni dobrodošli, laptopovi do podneva.',
      calmEyebrow: 'Zašto matcha', calmTitle: 'Mir, a ne trzaj.',
      calmBody: 'Matcha je ceo list, samleven i umućen, pa piješ ono što je biljka stvorila u hladu.',
      calm: [
        ['L-teanin', 'Zasenjeni listovi su bogati njime. U paru sa blagim kofeinom matche povezuje se sa budnim mirom, a ne sa skokom i padom.'],
        ['Katehini', 'Čaj od celog lista zadržava katehine, među njima EGCG, polifenole zbog kojih se zeleni čaj proučava.'],
        ['Petnaest sekundi', 'Prosejavanje, sipanje, mućenje. Ritual je kratak i u tome je poenta: pauza koju osetiš pre prvog gutljaja.']
      ],
      calmNote: 'Mi smo čajdžinica, ne klinika: uživaj u matchi zbog ukusa i osećaja, a za ostalo pitaj lekara.',
      waysEyebrow: 'Matcha', waysTitle: 'Tri načina da se pije.',
      shadeEyebrow: 'Hlad', shadeTitle: 'Dvadeset dana u hladu.',
      shadeBody: 'Tri nedelje pre majske berbe, čajna polja Udžija se prekrivaju. Bez sunca, listovi zadržavaju hlorofil i L-teanin: boja postaje dublja, gorčina nestaje, umami raste. Iz tog hlada dolazi ukus. Svaka limenka koju otvorimo je tencha prve berbe, mlevena na kamenom mlinu brzinom od trideset grama na sat, i potrošena u roku od dve nedelje od otvaranja.',
      seals: { uji: 'Uji, Kjoto', first: 'Prva berba', stone: 'Kameni mlin', whisk: 'Mućeno po porudžbini' },
      mochiEyebrow: 'Kuhinja', mochiTitle: 'Tucano jutros.',
      mochiBody: 'Lepljivi pirinač se kuva na pari, tuca i oblikuje svakog jutra dok se muti prva matcha. Daifuku oko slatkog azukija, warabi mochi sa kinakom, tamago sendvič na shokupanu i šta god sezona stavi na pult.',
      coffeeTitle: 'Spori bar', coffeeBody: 'Nel drip, V60 i espresso. Jedna sezonska kafa jednog porekla, pržena u Beogradu, menja se sa solarnim periodom.',
      kitchenTitle: 'Mala kuhinja', kitchenBody: 'Daifuku i warabi mochi tucani svakog jutra, tamago sendvič na shokupanu, onigiri sa lososom i umebošijem, ogura tost.',
      shopTitle: 'Ponesi kući', shopBody: 'Naša ceremonijalna mešavina u limenkama od 30 g, chasen iz Takajame, chawan i chashaku. Pokazaćemo ti kako.',
      visitEyebrow: 'Poseta', visitTitle: 'Dorćol, Beograd.',
      appEyebrow: 'Aplikacija', appTitle: 'Naruči unapred, skupljaj pečate, rezerviši mesto.',
      appBody: 'Dodaj Machiko na početni ekran. Svako piće donosi pečat; deset pečata je usucha na račun kuće.',
      openApp: 'Otvori aplikaciju'
    },
    menu: {
      eyebrow: 'Meni', title: 'Po porudžbini, šolja po šolja.',
      lede: 'Matcha se muti ručno. Kafa se kuva šolja po šolja. Sezona menja meni; radno vreme ne.',
      footnote: 'Cene u dinarima, usluga uračunata. Alergeni i vrste mleka na upit. Svaki late može biti koicha jačine.',
      orderInApp: 'Naruči unapred u aplikaciji', thisFortnight: 'ove dve nedelje'
    },
    matcha: {
      eyebrow: 'Naša matcha', title: 'Šta je u limenci.',
      lede: 'Jedna mešavina, dve sorte, jedan kvalitet. Radije radimo jednu matchu kako treba nego da držimo šest.',
      specsTitle: 'Limenka', specs: {
        origin: ['Poreklo', 'Uji, prefektura Kjoto'], cultivar: ['Sorte', 'Samidori · Okumidori'], harvest: ['Berba', 'Prva berba, maj (ichibancha)'],
        shade: ['Zasenjivanje', '20 dana pod tana platnom'], mill: ['Mlevenje', 'Granitni kameni mlin, ~30 g na sat'], grade: ['Kvalitet', 'Ceremonijalna'], open: ['Svežina', 'Nova limenka svake dve nedelje; traži da vidiš datum']
      },
      howTitle: 'Kako pravimo usuchu', steps: [
        ['Prosej', 'Dva grama kroz fino sito u zagrejan chawan. Grudvice su neprijatelj pene.'],
        ['Voda', 'Sedamdeset mililitara na sedamdeset stepeni. Toplija spaljuje slatkoću.'],
        ['Umuti', 'Petnaest sekundi brzih W-pokreta chasenom, pa spor krug da se pena smiri.'],
        ['Posluži', 'Odmah. Usucha je najbolja otprilike minut.']
      ],
      faqTitle: 'Pitanja koja dobijamo',
      faq: [
        ['Zašto matcha ovde ima drugačiji ukus?', 'Kvalitet i svežina. Ceremonijalna matcha od zasenjenih listova prve berbe prirodno je slatka; većina matche po kafićima je kasnija berba, bez zasenjivanja, mlevena pre više meseci. Mi otvaramo novu limenku svake dve nedelje i mutimo svaku šolju ručno.'],
        ['Toplo ili sa ledom, sa mlekom ili bez?', 'Usucha i koicha se prave samo sa vodom. Late je usucha prelivena ovsenim ili punomasnim mlekom; kokosovo na upit. Ledene verzije se prave preko leda, nikad sa sladoledom.'],
        ['Koliko kofeina ima u šolji?', 'Usucha ima oko 60–70 mg, otprilike kao flat white. Hojicha je pečena i ima vrlo malo.'],
        ['Mogu li da kupim limenku?', 'Da. Trideset grama, ista mešavina iz koje mutimo, sa uputstvom za pripremu i chasenom ako ti treba.']
      ]
    },
    visit: {
      eyebrow: 'Poseta', title: 'Mirna soba na Dorćolu.', galleryEyebrow: 'Prostor', galleryTitle: 'U šta ulaziš.',
      kyotoEyebrow: 'Kjoto', kyotoTitle: 'Odakle dolazi ideja.',
      lede: 'Dvadeset mesta, šank sa kog se sve vidi, i prodajni kutak kod prozora. Deca i psi dobrodošli; laptopovi do podneva.',
      hoursTitle: 'Radno vreme', findTitle: 'Gde smo', reserveTitle: 'Rezerviši mesto', reserveBody: 'Prvo ko dođe. Za četvoro ili više, ili za mesto na radionici, rezerviši u aplikaciji.',
      directions: 'Dva minuta od Skadarlije, pet od Trga Republike. Parkinga na ulici je malo; tramvaj staje iza ugla.',
      mapNote: 'Mesto za mapu: dodaj Google Maps embed ili link kada adresa bude konačna.', openMap: 'Otvori u Google mapama',
      workshopsTitle: 'Radionice', workshops: [
        ['Osnove usuche', '60 minuta, četiri mesta. Prosej, umuti, probaj, i ponesi kući šta si napravio. Subotom u 10:00.'],
        ['Koicha, na gust način', '45 minuta, četiri mesta. Za one koji već mute kod kuće. Prve nedelje u mesecu.']
      ]
    },
    app: {
      today: 'Danas', order: 'Naruči', stamps: 'Pečati', reserve: 'Rezerviši',
      greeting: { morning: 'Dobro jutro', afternoon: 'Dobar dan', evening: 'Dobro veče' },
      openUntil: 'otvoreno do 20:00', closedNow: 'zatvoreno · otvara u 08:00', quiet: 'trenutno mirno',
      stampCard: 'Kartica pečata', of: 'od', stampsLeft: (n) => `Još ${n} i sledeća usucha je na račun kuće.`, stampsFull: 'Sledeća usucha je na račun kuće. Pokaži ovo na šanku.',
      showAtCounter: 'Pokaži karticu na šanku; mi udaramo pečat.', yourUsual: 'Tvoje uobičajeno', reorder: 'Ponovi', lastTime: 'Prošli put',
      installTitle: 'Dodaj Machiko na početni ekran', installBody: 'Jedan dodir za porudžbinu, pečati uvek uz tebe.', install: 'Dodaj', installed: 'Instalirano',
      workshop: 'Radionica', seatsLeft: (n) => `još ${n} od 4 mesta`,
      menuTitle: 'Naruči unapred', menuLede: 'Preuzmi na šanku. Počinjemo da mutimo kad potvrdiš.',
      customise: 'Po tvojoj meri', temp: 'Temperatura', milk: 'Mleko', size: 'Veličina', strength: 'Jačina', quantity: 'Količina',
      addToOrder: 'Dodaj u porudžbinu', added: 'Dodato.', inYourOrder: (n) => `${n} ${n === 1 ? 'stavka' : n < 5 ? 'stavke' : 'stavki'} u porudžbini.`,
      viewOrder: 'Pogledaj porudžbinu', cart: 'Tvoja porudžbina', empty: 'Još ništa.', browse: 'Pogledaj meni',
      pickup: 'Preuzimanje', pickupNow: 'Sada · ~8 min', total: 'Ukupno', confirm: 'Potvrdi porudžbinu', payNote: 'Plati pri preuzimanju ili u aplikaciji. Pečat se dodaje automatski.',
      name: 'Tvoje ime', namePlaceholder: 'Da znamo koga da zovemo',
      status: { received: 'Primljeno', whisking: 'Muti se', ready: 'Spremno' },
      statusJp: { received: '受付', whisking: '点前', ready: '完成' },
      statusBody: { received: 'Imamo tvoju porudžbinu. Voda se greje.', whisking: 'Chasen radi. Oko četiri minuta.', ready: 'Na šanku je. Pokaži ovaj ekran.' },
      orderNumber: 'Porudžbina', newOrder: 'Nova porudžbina', remove: 'Ukloni',
      reserveTitle: 'Rezervacija', reserveLede: 'Sto za četvoro ili više, ili mesto na radionici.',
      date: 'Datum', time: 'Vreme', guests: 'Gosti', seatOrWorkshop: 'Za šta', table: 'Sto', note: 'Nešto što treba da znamo', send: 'Pošalji zahtev',
      reserveSent: 'Zahtev poslat. Potvrđujemo porukom u roku od sat vremena.', reserveLocal: 'Sačuvano na ovom telefonu. Poveži webhook za rezervacije da bi stiglo do lokala.',
      profileLang: 'Jezik', demoStamp: 'Demo: dodaj pečat'
    }
  }
};
