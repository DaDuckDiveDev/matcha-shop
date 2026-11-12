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
| `/app` | Guest app (PWA): Today, Order ahead, customise, cart, live status, Stamps, Reserve. Closed until opening day, with a labelled preview |

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

## Deploy to machiko.rs (SiteGround)

Every push to `main` runs `.github/workflows/deploy-siteground.yml`. It prepares the photographs, builds for `https://machiko.rs` and uploads `dist/` over SFTP to `/machiko.rs/machiko.rs/public_html`, with the same SiteGround SFTP key the gymfit repo deploys with.

One-time setup, in this repository on GitHub (Settings → Secrets and variables → Actions):

1. Secret `SFTP_KEY`: the private key. Secret `SFTP_KEY_PASSPHRASE`: its password (leave it out if the key has none).
2. Optional variable `JOIN_ENDPOINT`: the Brevo form address, so `/join` collects sign-ups.
3. In SiteGround: the website machiko.rs exists, the SFTP key has access to it, SSL is installed and HTTPS Enforce is on (Site Tools → Security).

Until `SFTP_KEY` is set the workflow runs and skips the upload. To deploy by hand: Actions → Deploy to SiteGround → Run workflow.

What the upload does (`scripts/deploy-sftp.mjs`): it finds the site's folder (and says so if it is somewhere else), refuses to touch a folder that holds a WordPress site, keeps a copy of any `.htaccess` it did not write, skips photographs that are already on the server, and sends `index.html` last. It never deletes anything on the server, so old build files stay in `assets/`; clear that folder by hand once in a while if you like.

To build and upload yourself instead: `npm run photos`, `npm run build`, then put the contents of `dist/` in `public_html/`. The included `.htaccess` sends every address to `index.html` and sets cache headers. For a subfolder, build with `VITE_BASE=/subfolder/`.

## Preview on GitHub Pages

Every push to `main` also runs `.github/workflows/deploy-pages.yml`, which builds with `VITE_BASE=/matcha-shop/` and publishes to https://daduckdivedev.github.io/matcha-shop/. The preview asks search engines not to index it; the real site is machiko.rs.

## Editing content

- **The shop's facts** (opening date, address, map link, phone, email, Instagram): `src/data/shop.js`. The address is empty until the lease is signed; fill it in and it appears in the footer, the menu sheet and on `/visit`. Before the opening date the main button is "Join the founding list"; from that day it becomes "Order ahead".
- **Menu and prices**: `src/data/menu.js`. Prices are placeholders; `options` on an item drive the customiser in the app.
- **Seasonal specials**: `src/data/sekki.js`. The site works out the current solar term from the sun's position in Belgrade time; change the `SPECIALS` lines with the kitchen.
- **Photographs**: `src/data/images.js` maps a key to a Pexels photo id. To use your own, put a JPEG at `photos-src/<key>.jpg` (for example `photos-src/bowlTop.jpg`) and run `npm run photos`.
- **Journal**: `src/data/journal.js`, in English and Serbian. Body lines are plain strings: `## ` starts a heading, `> ` a pull quote, `- ` a bullet, `1. ` a numbered step, anything else a paragraph. "Our story" is a draft (`draft: true`) with prompts for John and Katarina.
- **Brand**: `public/brand/` (mark, lockups, alternates, email images, OG image), `public/icons/` (PWA icons). The mark is also drawn by `src/components/Logo.jsx`; keep the path identical.

## The customer database (`server/`)

`server/` is a Node.js and MySQL API that runs as a Node.js project on SiteGround: the founding list with a record of every consent, reservation requests, an owner's page with the numbers, and the CSV export for email and SMS. Setting it up is eight steps in `server/README.md`. When the repository variable `API_URL` holds its address, `/join` and the app's Reserve screen send to it; pushes that touch `server/` are tested against MariaDB and published to the `api` branch, which SiteGround deploys.

Without the API, `/join` can post straight to a Brevo form instead: put the form's action URL in the repository variable `JOIN_ENDPOINT`. With neither, the form says it is not connected. Email and SMS consent are two separate, unticked boxes; `?src=` on the link is stored as the source (`machiko.rs/join?src=instagram`).

## Reservations webhook

Reservations go to the API when `API_URL` is set. Without it, set `VITE_RESERVE_WEBHOOK` to a URL that accepts a JSON POST (a Make.com webhook that writes to a Google Sheet works); with neither, requests are kept on the phone and the app says so.

## QA

`scripts/qa.mjs` checks the live site in a real browser: the server (redirects, file types, private files), every page on a phone and a desktop (errors, failed requests, broken images, sideways scrolling, headings, alt text, links), accessibility with axe-core, and the things people do (language, menu, cards, sign-up, the app). `scripts/lighthouse.mjs` adds Lighthouse scores. The workflow "QA" runs both after every deploy to SiteGround and attaches the report and screenshots to the run; run it by hand from the Actions tab at any time.

## Next steps

- Take our own photographs once the room is built, and replace the Pexels ones (shot list in the Launch Kit).
- Write "Our story" in `src/data/journal.js` and remove `draft: true`.
- Set up the API on SiteGround (`server/README.md`) so `/join` collects sign-ups.
- Have a native speaker proofread the Serbian.
- Serbian pages rendered at build time for search engines; today the Serbian copy is applied in the browser.
- Point-of-sale integration so order status and stamps are real, and payment at checkout.
- Privacy-friendly analytics (Plausible or similar).
