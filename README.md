# Mochiko もちこ — matcha & coffee, Belgrade

Mobile-first website and guest web app for a premium matcha and specialty
coffee shop. Kyoto restraint, cream and matcha green, wabi-sabi glass over
real photography. One Vite + React build serves both the marketing site and
the installable guest app under `/app`.

## What is in here

| Route | What |
| --- | --- |
| `/` | Home: noren intro, hero, season strip (24 solar terms), three ways of matcha, the shade, mochi, slow bar / kitchen / take-home, guest-app band |
| `/menu` | Full menu with sticky category chips, seasonal row, prices in RSD |
| `/matcha` | The tin: origin, cultivars, shading, milling; how usucha is made; FAQ |
| `/visit` | Hours, address, map placeholder, workshops, reservation CTA |
| `/app` | Guest app (PWA): Today, Order ahead → customise → cart → live status, Stamps (hanko loyalty card), Reserve |

Languages: English and Serbian (Latin), toggled in the header and footer,
remembered on the device. Every string lives in `src/data/i18n.js`; menu items
carry their own EN/SR copy in `src/data/menu.js`.

## Stack

- [Vite 5](https://vitejs.dev) + React 18, plain CSS (`src/styles/mochiko.css`, tokens at the top)
- [Motion](https://motion.dev) (`motion/react`) for the noren intro, page transitions, scroll reveals, option pills, the stamp thump and the price tween
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

## Reservations webhook

Copy `.env.example` to `.env` and set `VITE_RESERVE_WEBHOOK` to a URL that accepts a JSON POST (a Make.com webhook that writes to a Google Sheet works). Without it, requests are kept on the phone and the app says so.

## Next steps

- Serbian static pages (`/sr/...`) rendered at build time for SEO; today the SR copy is applied client-side.
- Point-of-sale integration so order status and stamps are real (the status screen simulates received → whisking → ready from the order time).
- Online payment at checkout; currently pay at pickup.
- Replace the map placeholder with the Google Maps embed once the address is final.
- Analytics and a cookie-free consent-free setup (Plausible or similar).

## Design

The design canvas (Claude Design) holds the mobile home and menu boards, the app screens, the logo board and the design-system tile. Palette and type are documented there and mirrored in the `:root` tokens of `mochiko.css`.
