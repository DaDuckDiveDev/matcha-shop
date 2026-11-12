# Social pictures and film

The pre-launch Instagram cards and the launch reel, drawn with the website's own
typefaces, colours and bowl, so the feed and machiko.rs look like one place.

```
npm run social              # every card and the reel, into social/prelaunch
node social/cards.mjs usui  # only the cards whose name contains "usui"
node social/reel.mjs test   # a few still frames of the reel, to look at before a full render
```

It needs Playwright with Chromium (`npm i --no-save playwright`, then `npx playwright install chromium`)
and, for the reel, ffmpeg. Run `npm install` first: the fonts come from `node_modules`.

| File | What it is |
|---|---|
| `cards.mjs` | The six cards, 1080 × 1440, in Serbian and English. Words, dates and layouts are all in this file. |
| `reel.mjs`, `reel.html`, `reel-entry.js` | Reel 1: the home page's tea simulation (`src/gl/bowl.js`) stepped one frame at a time and filmed, 12 s at 30 frames a second. |
| `lib.mjs` | Opens the browser page and serves the fonts from disk. |
| `prelaunch/` | The finished files, with a readme that says when each one is posted and gives the alt text. |

A new season card is one more `season({...})` entry in `cards.mjs`: the kanji, its reading,
its number among the 24, the name and the dates in both languages. The dates for any
year come from `currentSekki()` in `src/data/sekki.js`.

The captions and the week-by-week plan are in the Machiko Launch Kit, tab "Pre-launch social".
