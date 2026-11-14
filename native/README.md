# Machiko, the native app (a start)

The guest app for the App Store and Google Play, in the same paper, ink and green as machiko.rs. Expo SDK 58, React Native 0.88, plain JavaScript.

## What is here

Four tabs in a floating bar, each named by a kanji and a word.

| Tab | What it does |
| --- | --- |
| 今 Today | Greeting, the current solar term and its special, the stamp card, the points line, three stories from the journal |
| 注 Order | Order ahead: the menu by category, a cart, a pick-up time, a ticket with the order number |
| 判 Card | Points and the tier ring, ten stamps, rewards, the activity list |
| 私 You | Name, language (English or Serbian), totals, the three tiers, past orders |

The menu, the points rules, the solar terms, the stories and the opening date are **not written twice**. `npm run sync` copies them from the website's `../src/data` into `src/shared` (it runs before every `npm start`). Change a price or a reward on the website and the app follows.

Everything a guest does is kept on the phone (AsyncStorage), in the same shape as the web app's store. Before 20 March 2027 the Order tab says that nothing is sent to the shop.

## Run it

```bash
cd native
npm install
npm start        # then scan the code with Expo Go, or press i / a for a simulator
npm run web      # the same screens in a browser
npm run check    # bundles for iOS and Android without a device
```

## How far it was tested

- It bundles for iOS and Android (`expo export`, Hermes).
- The four screens were opened in a browser through React Native for Web at 390 x 844 and an order was placed end to end (1 640 RSD, 164 points, three stamps).
- **It has not been run on a phone or a simulator.** Fonts, safe areas and the keyboard need a look on real devices first.

## Before the stores

1. **The server.** Orders, points and stamps have to live in the shop's database, not on one phone: accounts (email link or phone number), `POST /api/orders`, `GET /api/me`, and a counter screen that marks an order ready. This is the Node.js API in `../server`, extended. Without it the stores will see an app that does nothing a website cannot.
2. **Push notifications** (`expo-notifications`): "your order is ready", the new season every fortnight. Needs the server and, for iOS, an Apple push key.
3. **Payments.** Apple and Google allow a card processor of your own for food and drink collected in person; the bank contract comes first.
4. **Accounts.** Apple Developer Program (99 USD a year) and Google Play Console (25 USD once). On Google Play, a personal account created after 13 November 2023 must run a closed test with at least 12 testers opted in for 14 days in a row before it can ask for production access; an organisation account (which needs a D-U-N-S number) does not.
5. **Builds.** `npx eas-cli build --platform all` (an Expo account), then `eas submit`. Bundle id and package: `rs.machiko.app`.
6. **Store listing.** Screenshots, a privacy policy address (machiko.rs/privacy, once checked against the ZZPL), the data-safety forms, an age rating.
7. **Smaller things.** The customiser (milk, size, strength) from the web app, photographs in the menu, a subset of the Japanese font (the full file is 6.4 MB), haptics on a stamp.
