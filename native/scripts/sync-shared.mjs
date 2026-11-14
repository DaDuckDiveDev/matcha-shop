// The native app and the website share their facts: the menu, the points
// rules, the solar terms, the stories, the opening date. They are written
// once, in ../src/data, and copied here. Run `npm run sync` after changing
// any of them (it also runs before `npm start`).
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const from = join(here, '../../src/data');
const to = join(here, '../src/shared');
mkdirSync(to, { recursive: true });
for (const f of ['loyalty.js', 'menu.js', 'sekki.js', 'journal.js', 'shop.js']) copyFileSync(join(from, f), join(to, f));
console.log('shared: copied the menu, points, seasons, stories and shop facts from the website');
