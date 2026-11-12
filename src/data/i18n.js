// UI copy in English and Serbian (Latin). Keys are dotted paths; `t()` in
// LangContext resolves them. Keep sentences short; the menu items carry
// their own translations in menu.js.
export const STRINGS = {
  en: {
    nav: { menu: 'Menu', matcha: 'Matcha', journal: 'Journal', visit: 'Visit', join: 'Join the list', order: 'Order ahead', app: 'Guest app', home: 'Home', open: 'Open the menu', close: 'Close the menu', stamps: 'Stamps', skip: 'Skip to the page' },
    common: {
      seeMenu: 'See the menu', orderAhead: 'Order ahead', fullMenu: 'Full menu', back: 'Back', close: 'Close',
      rsd: 'RSD', each: 'each', openDaily: 'Daily 08:00–20:00', address: 'Dorćol, Belgrade'
    },
    season: { term: 'solar term', fortnight: 'This fortnight', until: 'until', fallback: 'Ask what is in season.' },
    way: {
      title: 'Six steps between a hill in Uji and your table.', steps: [
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
    home: {
      title: ['An hour of Kyoto,', 'in Belgrade.'],
      lede: 'Ceremonial matcha from Uji, whisked by hand for every bowl. Slow coffee and a small Japanese kitchen, in Dorćol.',
      opening: 'Opens Saturday 20 March 2027', openNow: 'Open every day, 08:00–20:00',
      ctaJoin: 'Join the founding list', ctaMenu: 'See the menu', ctaOrder: 'Order ahead',
      bowlAlt: 'A bowl of matcha seen from above. Move across the tea to whisk it.',
      hint: 'Whisk it.', hintTouch: 'Whisk it with your finger.', whisked: 'Fifteen seconds of this, by hand, for every bowl.',
      todayLabel: 'Today in the tea calendar', onCounter: 'On the counter',
      offersTitle: 'On the counter',
      offers: [
        ['Ceremonial matcha', 'Usucha and koicha from first-harvest Uji leaves, whisked to order.'],
        ['Matcha lattes', 'Usucha over oat or whole milk, hot or over ice.'],
        ['Slow coffee', 'Nel drip, V60 and espresso. One single origin, roasted in Belgrade.'],
        ['The kitchen', 'Daifuku and warabi mochi made every morning. Tamago sando, onigiri.'],
        ['Take it home', 'Our blend in 30 g tins, a chasen from Takayama, bowls.'],
        ['Workshops', 'Learn to whisk in an hour. Four seats, Saturdays at ten.']
      ],
      matchaTitle: 'One matcha, done properly.',
      matchaBody: 'Three weeks before the May harvest, the tea fields of Uji go under shade. Starved of sun, the leaves keep their chlorophyll and L-theanine: the colour deepens and the bitterness falls away. We buy that first harvest, stone-milled, and open a new tin every two weeks.',
      facts: [['Origin', 'Uji, Kyoto'], ['Harvest', 'First flush, May'], ['Shade', 'Twenty days'], ['Mill', 'Granite, 30 g an hour']],
      matchaLink: 'What is in the tin',
      calmTitle: 'Calm, not a jolt.',
      calm: [
        ['L-theanine', 'Shaded leaves are rich in it. Paired with matcha\'s gentle caffeine it is associated with alert calm rather than a spike and a crash.'],
        ['Catechins', 'Whole-leaf tea keeps its catechins, EGCG among them, the polyphenols green tea is studied for.'],
        ['Fifteen seconds', 'Sifting, pouring, whisking. The ritual is short, and it is the point: a pause you can feel before the first sip.']
      ],
      calmNote: 'We are a tea house, not a clinic: enjoy matcha for how it tastes and how it makes you feel, and ask a doctor about the rest.',
      roomTitle: 'A room for slowing down.',
      roomBody: 'Twenty seats, raw wood and light through paper. No music louder than the kettle. We are building it in Dorćol now; these are the rooms in Kyoto it borrows from.',
      roomLink: 'Plan your visit', roomCaption: 'Kyoto, where the idea comes from.',
      journalTitle: 'From the journal', journalAll: 'All stories',
      joinTitle: 'Be first through the noren.',
      joinBody: 'The founding list is invited to the soft opening, 11–17 March 2027, before the doors open to everyone.'
    },
    foot: {
      visit: 'Visit', explore: 'Explore', follow: 'Follow', address: 'Dorćol, Belgrade', addressSoon: 'Street address announced before we open',
      hours: 'Every day, 08:00–20:00', from: 'from 20 March 2027', privacy: 'Privacy', app: 'Guest app', rights: '© 2026 Machiko',
      photos: 'Photographs: Pexels, until ours are taken.', top: 'Back to the top'
    },
    menu: {
      title: 'Menu', guide: 'Prices are a guide until we open.', seasonNow: 'In season now',
      lede: 'Matcha is whisked by hand. Coffee is brewed one cup at a time. The season changes the menu; the hours do not.',
      footnote: 'Prices in dinars, service included. Allergens and milk options on request. Any latte can be made koicha-strength.',
      orderInApp: 'Order ahead in the app', thisFortnight: 'this fortnight'
    },
    matcha: {
      eyebrow: 'Our matcha', title: 'What is in the tin.',
      lede: 'One blend, two cultivars, one grade. We would rather do one matcha properly than carry six.',
      specsTitle: 'The tin', specs: {
        origin: ['Origin', 'Uji, Kyoto Prefecture'], cultivar: ['Cultivars', 'Samidori and Okumidori'], harvest: ['Harvest', 'First flush, May (ichibancha)'],
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
      title: 'Dorćol, Belgrade.',
      lede: 'We open on Saturday 20 March 2027, the spring equinox. Twenty seats, a counter you can watch from, and a shelf of tins and whisks by the window.',
      openingTitle: 'Opening', opening: [['Soft opening', '11–17 March 2027, for the founding list'], ['Opening day', 'Saturday 20 March 2027']],
      hoursTitle: 'Hours', hours: 'Every day, 08:00–20:00',
      findTitle: 'Find us', find: 'Dorćol, Belgrade. The street address goes here as soon as the lease is signed.', openMap: 'Open in Google Maps',
      goodTitle: 'Good to know', good: ['Walk-ins first. Reserve for four or more, or for a workshop seat.', 'Children and dogs are welcome.', 'Laptops are welcome until noon.', 'Oat, whole and coconut milk. Ask us about allergens.'],
      workshopsTitle: 'Workshops', workshops: [
        ['Usucha basics', '60 minutes, four seats. Sift, whisk, taste, and take home what you make. Saturdays at 10:00.'],
        ['Koicha, the thick way', '45 minutes, four seats. For people who already whisk at home. First Sunday of the month.']
      ],
      reserve: 'Reserve in the guest app',
      kyotoTitle: 'Where the idea comes from.', kyotoBody: 'Kyoto keeps its tea rooms small and its gardens raked. We are borrowing both habits.'
    },
    app: {
      today: 'Today', order: 'Order', stamps: 'Stamps', reserve: 'Reserve',
      stampsLede: 'Every drink earns a stamp. Ten stamps are an usucha on the house.',
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
    nav: { menu: 'Meni', matcha: 'Matcha', journal: 'Priče', visit: 'Poseta', join: 'Prijavi se', order: 'Naruči unapred', app: 'Aplikacija', home: 'Početna', open: 'Otvori meni', close: 'Zatvori meni', stamps: 'Pečati', skip: 'Preskoči na sadržaj' },
    common: {
      seeMenu: 'Pogledaj meni', orderAhead: 'Naruči unapred', fullMenu: 'Ceo meni', back: 'Nazad', close: 'Zatvori',
      rsd: 'RSD', each: 'kom', openDaily: 'Svakog dana 08:00–20:00', address: 'Dorćol, Beograd'
    },
    season: { term: 'solarni period', fortnight: 'Ove dve nedelje', until: 'do', fallback: 'Pitaj šta je u sezoni.' },
    way: {
      title: 'Šest koraka između brda u Udžiju i tvog stola.', steps: [
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
    home: {
      title: ['Sat vremena Kjota,', 'u Beogradu.'],
      lede: 'Ceremonijalna matcha iz Udžija, umućena ručno za svaku činiju. Spora kafa i mala japanska kuhinja, na Dorćolu.',
      opening: 'Otvaramo u subotu, 20. marta 2027.', openNow: 'Otvoreno svakog dana, 08:00–20:00',
      ctaJoin: 'Prijavi se na listu', ctaMenu: 'Pogledaj meni', ctaOrder: 'Naruči unapred',
      bowlAlt: 'Činija matche, viđena odozgo. Pređi preko čaja da ga umutiš.',
      hint: 'Umuti je.', hintTouch: 'Umuti je prstom.', whisked: 'Petnaest sekundi ovoga, ručno, za svaku činiju.',
      todayLabel: 'Danas u kalendaru čaja', onCounter: 'Na šanku',
      offersTitle: 'Na šanku',
      offers: [
        ['Ceremonijalna matcha', 'Usucha i koicha od listova prve berbe iz Udžija, umućene po porudžbini.'],
        ['Matcha late', 'Usucha preko ovsenog ili punomasnog mleka, topla ili sa ledom.'],
        ['Spora kafa', 'Nel drip, V60 i espresso. Jedna kafa jednog porekla, pržena u Beogradu.'],
        ['Kuhinja', 'Daifuku i warabi mochi svakog jutra. Tamago sendvič, onigiri.'],
        ['Ponesi kući', 'Naša mešavina u limenkama od 30 g, chasen iz Takajame, činije.'],
        ['Radionice', 'Nauči da mutiš za sat vremena. Četiri mesta, subotom u deset.']
      ],
      matchaTitle: 'Jedna matcha, kako treba.',
      matchaBody: 'Tri nedelje pre majske berbe, čajna polja Udžija idu pod hlad. Bez sunca, listovi zadržavaju hlorofil i L-teanin: boja postaje dublja, a gorčina nestaje. Kupujemo tu prvu berbu, mlevenu na kamenu, i otvaramo novu limenku svake dve nedelje.',
      facts: [['Poreklo', 'Udži, Kjoto'], ['Berba', 'Prva berba, maj'], ['Hlad', 'Dvadeset dana'], ['Mlin', 'Granit, 30 g na sat']],
      matchaLink: 'Šta je u limenci',
      calmTitle: 'Mir, a ne trzaj.',
      calm: [
        ['L-teanin', 'Zasenjeni listovi su bogati njime. U paru sa blagim kofeinom matche povezuje se sa budnim mirom, a ne sa skokom i padom.'],
        ['Katehini', 'Čaj od celog lista zadržava katehine, među njima EGCG, polifenole zbog kojih se zeleni čaj proučava.'],
        ['Petnaest sekundi', 'Prosejavanje, sipanje, mućenje. Ritual je kratak i u tome je poenta: pauza koju osetiš pre prvog gutljaja.']
      ],
      calmNote: 'Mi smo čajdžinica, ne klinika: uživaj u matchi zbog ukusa i osećaja, a za ostalo pitaj lekara.',
      roomTitle: 'Prostor za usporavanje.',
      roomBody: 'Dvadeset mesta, sirovo drvo i svetlo kroz papir. Muzika nikad glasnija od čajnika. Upravo ga gradimo na Dorćolu; ovo su sobe u Kjotu na koje se ugleda.',
      roomLink: 'Isplaniraj posetu', roomCaption: 'Kjoto, odakle dolazi ideja.',
      journalTitle: 'Iz naših priča', journalAll: 'Sve priče',
      joinTitle: 'Budi prvi kroz noren.',
      joinBody: 'Lista prvih gostiju dobija poziv na probno otvaranje, 11–17. marta 2027, pre nego što se vrata otvore za sve.'
    },
    foot: {
      visit: 'Poseta', explore: 'Istraži', follow: 'Prati nas', address: 'Dorćol, Beograd', addressSoon: 'Adresu objavljujemo pre otvaranja',
      hours: 'Svakog dana, 08:00–20:00', from: 'od 20. marta 2027.', privacy: 'Privatnost', app: 'Aplikacija za goste', rights: '© 2026 Machiko',
      photos: 'Fotografije: Pexels, dok ne snimimo svoje.', top: 'Nazad na vrh'
    },
    menu: {
      title: 'Meni', guide: 'Cene su okvirne dok ne otvorimo.', seasonNow: 'Sada u sezoni',
      lede: 'Matcha se muti ručno. Kafa se kuva šolja po šolja. Sezona menja meni; radno vreme ne.',
      footnote: 'Cene u dinarima, usluga uračunata. Alergeni i vrste mleka na upit. Svaki late može biti koicha jačine.',
      orderInApp: 'Naruči unapred u aplikaciji', thisFortnight: 'ove dve nedelje'
    },
    matcha: {
      eyebrow: 'Naša matcha', title: 'Šta je u limenci.',
      lede: 'Jedna mešavina, dve sorte, jedan kvalitet. Radije radimo jednu matchu kako treba nego da držimo šest.',
      specsTitle: 'Limenka', specs: {
        origin: ['Poreklo', 'Udži, prefektura Kjoto'], cultivar: ['Sorte', 'Samidori i Okumidori'], harvest: ['Berba', 'Prva berba, maj (ichibancha)'],
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
      title: 'Dorćol, Beograd.',
      lede: 'Otvaramo u subotu, 20. marta 2027, na prolećnu ravnodnevicu. Dvadeset mesta, šank sa kog se sve vidi i polica sa limenkama i metlicama kod prozora.',
      openingTitle: 'Otvaranje', opening: [['Probno otvaranje', '11–17. mart 2027, za listu prvih gostiju'], ['Dan otvaranja', 'Subota, 20. mart 2027.']],
      hoursTitle: 'Radno vreme', hours: 'Svakog dana, 08:00–20:00',
      findTitle: 'Gde smo', find: 'Dorćol, Beograd. Tačna adresa stiže ovde čim potpišemo zakup.', openMap: 'Otvori u Google mapama',
      goodTitle: 'Dobro je znati', good: ['Prvo ko dođe. Rezerviši za četvoro ili više, ili za mesto na radionici.', 'Deca i psi su dobrodošli.', 'Laptopovi su dobrodošli do podneva.', 'Ovseno, punomasno i kokosovo mleko. Pitaj nas za alergene.'],
      workshopsTitle: 'Radionice', workshops: [
        ['Osnove usuche', '60 minuta, četiri mesta. Prosej, umuti, probaj, i ponesi kući šta si napravio. Subotom u 10:00.'],
        ['Koicha, na gust način', '45 minuta, četiri mesta. Za one koji već mute kod kuće. Prve nedelje u mesecu.']
      ],
      reserve: 'Rezerviši u aplikaciji',
      kyotoTitle: 'Odakle dolazi ideja.', kyotoBody: 'Kjoto čuva svoje čajne sobe malim, a vrtove izgrabuljanim. Pozajmljujemo obe navike.'
    },
    app: {
      today: 'Danas', order: 'Naruči', stamps: 'Pečati', reserve: 'Rezerviši',
      stampsLede: 'Svako piće donosi pečat. Deset pečata je usucha na račun kuće.',
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
