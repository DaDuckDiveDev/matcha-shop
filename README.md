# Machiko まちこ — matcha & coffee, Belgrade

Mobile-first website and guest web app for a premium matcha and wellness
house. Kyoto restraint, cream and matcha green, wabi-sabi glass over real
photography of tea rooms, gardens and the café itself. One Vite + React build serves both the marketing site and
the installable guest app under `/app`.

## What is in here

| Route | What |
| --- | --- |
| `/` | Home: noren intro; Kyoto tea-room hero with live clocks (Beograd · Kyoto), floating glass chips and the opening countdown; season strip; the stone garden (砂紋 samon, "one bowl"); three ways of matcha; the room; the shade; the way from field to bowl (pinned horizontal gallery on desktop, swipe on phones); tea-word marquee; why matcha; kitchen; journal; guest app |
| `/menu` | Full menu with sticky category chips, seasonal row, prices in RSD |
| `/matcha` | The tin: origin, cultivars, shading, milling; how usucha is made; FAQ |
| `/visit` | Hours, address, map placeholder, a Kyoto photo mosaic, workshops, reservation CTA |
| `/journal` | Stories about matcha (EN/SR) and a "coming soon" card for our story |
| `/journal/:slug` | One story: photo hero, drop cap, headings that become rail stops, next story |
| `/join` | The founding list: the page the window poster and flyer QR codes open |
| `/privacy` | Privacy notice for the founding list (draft, to be checked against the ZZPL) |
| `/app` | Guest app (PWA): Today, Order ahead → customise → cart → live status, Stamps (hanko loyalty card), Reserve |

Languages: English and Serbian (Latin), toggled in the header and footer,
remembered on the device. Every string lives in `src/data/i18n.js`; menu items
carry their own EN/SR copy in `src/data/menu.js`.

## Stack

- [Vite 5](https://vitejs.dev) + React 18, plain CSS (`src/styles/machiko.css`, tokens at the top)
- [Motion](https://motion.dev) (`motion/react`) for the noren intro, page transitions, scroll reveals, option pills, the stamp thump, the price tween, the floating chips and the pinned gallery
- [Lenis](https://lenis.darkroom.engineering) for smooth wheel scrolling on the site (not in the app); off when the system asks for reduced motion
- `react-router-dom` for routes; `vite-plugin-pwa` for the manifest and service worker
- Fonts from Google Fonts: EB Garamond (display and body), Hanken Grotesk (UI), Zen Old Mincho (Japanese)
- No backend yet: cart, stamps, orders and reservations live in `localStorage` (`src/lib/store.js`)

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/
npm run preview    # serve dist/ locally
```

## Deploy (SiteGround or any Apache host)

1. `npm run build`
2. Upload the contents of `dist/` to the document root (`public_html/`). The included `.htaccess` rewrites every path to `index.html` (SPA routing) and sets cache headers.
3. The site must be served over HTTPS for the PWA install prompt and the service worker.

For a subfolder deployment, build with `VITE_BASE=/subfolder/`; the manifest, router and service worker follow it.

## Preview on GitHub Pages

Every push to `main` runs `.github/workflows/deploy-pages.yml`, which builds with `VITE_BASE=/matcha-shop/` and publishes to https://daduckdivedev.github.io/matcha-shop/ (Settings → Pages → Source must be "GitHub Actions"). It is a preview; the real site goes on your own domain.

## Editing content

- **Menu and prices**: `src/data/menu.js`. Prices are illustrative placeholders; `options` on an item drive the customiser in the app.
- **Seasonal specials**: `src/data/sekki.js`. The site works out the current solar term from the date; add or change the `SPECIALS` lines with the kitchen.
- **Address, hours, phone, Instagram**: `src/data/i18n.js` → `common`.
- **Photos**: `src/data/images.js` maps a key to a Pexels photo id. Replace ids with your own photos when you have them. To stop hotlinking: `npm run images:fetch`, then build with `VITE_PHOTOS_LOCAL=1`. Pexels photos are free to use; a credit line is shown on each band.
- **Brand**: `public/brand/` (SVG mark, horizontal and stacked lockups, cream variants, OG image), `public/icons/` (PWA icons). The mark is also drawn inline by `src/components/Logo.jsx`; keep the path identical.

## The experience layer

`src/styles/experience.css` and these components, all on the site only:

- **Section rail** (`SectionRail.jsx`): a bamboo stalk on the right edge from 1360 px, with a node for every element on the page that has `data-rail` (plus `data-rail-label` and `data-rail-jp`). It fills with matcha as you scroll, a small bowl marks the current section, a click scrolls there, and the button at the foot goes back to the top. Labels open on hover, and stay open from 1640 px. Below 1360 px it becomes a thin progress line under the top bar. To add a stop, put the three attributes on any section.
- **Stone garden** (`SamonGarden.jsx`): raked lines that drift and part in rings around three stones: the Machiko bowl, a pebble of mochi and a mossy rock.
- **Hero chips** (`HeroChips.jsx`): the time in Belgrade and Kyoto, this fortnight's solar term and special, the days to opening (20 March 2027), the usucha numbers and the origin. Before opening day the main button is "Join the founding list"; from 20 March it becomes "Order ahead".
- **The way** (`WayGallery.jsx`), **marquee** (`Marquee.jsx`) and **journal** (`StoryCard.jsx`, `src/data/journal.js`).
- **Solar terms**: `src/data/sekki.js` now works out when each term really starts from the sun's position, in Belgrade time (Shunbun 20 March 2027, Seimei 5 April 2027), instead of using fixed dates.

## Journal

Stories live in `src/data/journal.js`, in English and Serbian. Body lines are plain strings: `## ` starts a heading (and a rail stop), `> ` a pull quote, `- ` a bullet, `1. ` a numbered step, anything else a paragraph. "Our story" is a draft (`draft: true`) with bracketed prompts for John and Katarina; it shows as "coming soon" until the flag is removed.

## Founding list (Brevo)

`/join` posts to the Brevo form whose action URL you put in `VITE_JOIN_ENDPOINT` (in `.env.production`, then rebuild). Without it the page is a preview and sends nothing. In Brevo, build a form with double opt-in and these fields: `FIRSTNAME`, `EMAIL`, `SMS`, `OPT_IN` (email consent), plus contact attributes `SMS_OPT_IN` (boolean), `LANG` and `SOURCE`. The page adds `SOURCE` from `?src=`, so use `machiko.rs/join?src=instagram` in the bio and plain `/join` on the QR codes (recorded as `website`). Email and SMS consent are two separate, unticked boxes.

## Reservations webhook

Copy `.env.example` to `.env` and set `VITE_RESERVE_WEBHOOK` to a URL that accepts a JSON POST (a Make.com webhook that writes to a Google Sheet works). Without it, requests are kept on the phone and the app says so.

## Next steps

- Serbian static pages (`/sr/...`) rendered at build time for SEO; today the SR copy is applied client-side.
- Point-of-sale integration so order status and stamps are real (the status screen simulates received → whisking → ready from the order time).
- Online payment at checkout; currently pay at pickup.
- Replace the map placeholder with the Google Maps embed once the address is final.
- Write "Our story" in `src/data/journal.js` and remove `draft: true`.
- Swap the Pexels photos for John's own once the room is finished (shot list in the Launch Kit).
- Analytics and a cookie-free consent-free setup (Plausible or similar).

## Design

The design canvas (Claude Design) holds the mobile home and menu boards, the app screens, the logo board and the design-system tile. Palette and type are documented there and mirrored in the `:root` tokens of `machiko.css`.
