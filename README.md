# Machiko まちこ — matcha house, Belgrade

The website and guest web app for a premium matcha and wellness house.
Washi white, one green, large photographs, and a bowl of matcha at the top of
the home page that you can whisk. One Vite + React build serves both the site
and the installable guest app under `/app`.

## What is in here

| Route | What |
| --- | --- |
| `/` | Home: the live bowl, today's season, six offer cards, the matcha, why matcha, the room, the journal, the founding list |
| `/menu` | The menu in four parts, with sticky tabs and the seasonal item marked; prices in RSD |
| `/matcha` | The tin (origin, cultivars, shading, milling), six steps from field to bowl, how usucha is made, questions |
| `/visit` | Opening dates, hours, where we are, good to know, workshops, Kyoto photographs |
| `/journal`, `/journal/:slug` | Stories about matcha in English and Serbian; "Our story" shows as coming soon |
| `/join` | The founding list: the page the poster and flyer QR codes open |
| `/privacy` | Privacy notice for the founding list (draft, to be checked against the ZZPL) |
| `/app` | Guest app (PWA): Today, Order ahead, customise, cart, live status, Stamps, Reserve |

Languages: English and Serbian (Latin), switched in the navigation and the
footer and remembered on the device. Every string is in `src/data/i18n.js`;
menu items carry their own copy in `src/data/menu.js`.

## How it is built

- [Vite 5](https://vitejs.dev) and React 18, one plain stylesheet (`src/styles/site.css`, tokens at the top).
- **The bowl** (`src/gl/bowl.js`, `src/components/Bowl.jsx`): a fluid simulation on the GPU (WebGL2). It whisks itself once when the page opens, then answers the cursor or a finger; scrolling rocks it a little. The ceramic, the light and the foam are drawn in a shader, so there is no image to load. It rests after six quiet seconds and when it is off screen. Without WebGL2 a still bowl drawn in CSS takes its place; with "reduce motion" switched on it shows the finished bowl without the performance.
- **Moving between pages** (`src/lib/go.jsx`): the View Transitions API. The old page fades as the new one arrives, and a photograph you tap (an offer card, a story) grows into the next page's main picture. Use `<A to="...">` for links inside the site.
- **Scrolling**: [Lenis](https://lenis.darkroom.engineering) smooths the wheel on desktop. Photographs drift inside their frames and statements take ink as they come up the page, with CSS scroll timelines (`animation-timeline: view()`), so nothing runs on a timer. Browsers without scroll timelines show the page still.
- **Type**: Hina Mincho (headings and Japanese) and Hanken Grotesk (text), both served from the site. Hina Mincho's Japanese set is 1.4 MB, so `scripts/prepare.mjs` cuts a font with only the kana and kanji that appear in `src/` (about 25 KB). It runs before every `dev` and `build`.
- **Photographs** (`src/components/Photo.jsx`, `scripts/photos.mjs`): `npm run photos` downloads every Pexels photo in `src/data/images.js`, writes AVIF and JPEG copies at four widths into `public/photos`, and records a tiny blurred preview of each. The site then serves its own copies in the right size for each screen. A photo that has not been prepared is loaded from Pexels, so the site works either way. The GitHub workflow runs this step for the preview.
- [Motion](https://motion.dev) for the pinned gallery on `/matcha` and the guest app's small animations.
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app) (Workbox): manifest, offline shell, photographs cached as they are seen.
- State is on the phone (`localStorage`): language, cart, stamps, order history, reservation requests.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run photos     # optional: prepare local copies of the photographs
npm run build      # dist/
npm run preview    # serve dist/ on your network, to test on a phone
```

## Deploy (SiteGround or any Apache host)

1. `npm run photos`, then `npm run build`
2. Upload the contents of `dist/` to the document root (`public_html/`). The included `.htaccess` rewrites every path to `index.html` and sets cache headers.
3. Serve it over HTTPS: the service worker and the install prompt need it.

For a subfolder, build with `VITE_BASE=/subfolder/`.

## Preview on GitHub Pages

Every push to `main` runs `.github/workflows/deploy-pages.yml`, which prepares the photographs, builds with `VITE_BASE=/matcha-shop/` and publishes to https://daduckdivedev.github.io/matcha-shop/. It is a preview; the real site goes on your own domain.

## Editing content

- **The shop's facts** (opening date, address, map link, phone, email, Instagram): `src/data/shop.js`. The address is empty until the lease is signed; fill it in and it appears in the footer, the menu sheet and on `/visit`. Before the opening date the main button is "Join the founding list"; from that day it becomes "Order ahead".
- **Menu and prices**: `src/data/menu.js`. Prices are placeholders; `options` on an item drive the customiser in the app.
- **Seasonal specials**: `src/data/sekki.js`. The site works out the current solar term from the sun's position in Belgrade time; change the `SPECIALS` lines with the kitchen.
- **Photographs**: `src/data/images.js` maps a key to a Pexels photo id. To use your own, put a JPEG at `photos-src/<key>.jpg` (for example `photos-src/bowlTop.jpg`) and run `npm run photos`.
- **Journal**: `src/data/journal.js`, in English and Serbian. Body lines are plain strings: `## ` starts a heading, `> ` a pull quote, `- ` a bullet, `1. ` a numbered step, anything else a paragraph. "Our story" is a draft (`draft: true`) with prompts for John and Katarina.
- **Brand**: `public/brand/` (mark, lockups, alternates, email images, OG image), `public/icons/` (PWA icons). The mark is also drawn by `src/components/Logo.jsx`; keep the path identical.

## Founding list (Brevo)

`/join` posts to the Brevo form whose action URL you put in `VITE_JOIN_ENDPOINT` (in `.env.production`, then rebuild). Without it the page is a preview and sends nothing. In Brevo, build a form with double opt-in and these fields: `FIRSTNAME`, `EMAIL`, `SMS`, `OPT_IN` (email consent), plus contact attributes `SMS_OPT_IN` (boolean), `LANG` and `SOURCE`. The page adds `SOURCE` from `?src=`, so use `machiko.rs/join?src=instagram` in the bio and plain `/join` on the QR codes (recorded as `website`). Email and SMS consent are two separate, unticked boxes.

## Reservations webhook

Copy `.env.example` to `.env` and set `VITE_RESERVE_WEBHOOK` to a URL that accepts a JSON POST (a Make.com webhook that writes to a Google Sheet works). Without it, requests are kept on the phone and the app says so.

## Next steps

- Take our own photographs once the room is built, and replace the Pexels ones (shot list in the Launch Kit).
- Write "Our story" in `src/data/journal.js` and remove `draft: true`.
- Put the Brevo form address in `VITE_JOIN_ENDPOINT` so `/join` collects sign-ups.
- Have a native speaker proofread the Serbian.
- Serbian pages rendered at build time for search engines; today the Serbian copy is applied in the browser.
- Point-of-sale integration so order status and stamps are real, and payment at checkout.
- Privacy-friendly analytics (Plausible or similar).
