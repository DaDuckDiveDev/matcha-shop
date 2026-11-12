// Runs before `npm run dev` and `npm run build`.
//
// 1. Makes sure the photo manifest exists (empty until `npm run photos` has
//    run; the site then loads photographs from Pexels directly).
// 2. Builds one small Japanese font. Hina Mincho's Japanese set is 1.4 MB;
//    the site uses about a hundred kana and kanji. This reads every source
//    file, collects the Japanese characters it finds and cuts a font with
//    only those (about 25 KB). Add a kanji anywhere in src/ and the next
//    build includes it.
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const OUT = join(root, 'src/assets/fonts/hina-mincho-jp.woff2');
const MANIFEST = join(root, 'src/data/photos.manifest.json');
if (!existsSync(MANIFEST)) writeFileSync(MANIFEST, '{}\n');
const JP = /[\u3000-\u303f\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uff00-\uffef]/g;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (['.js', '.jsx', '.css', '.html', '.json', '.md'].includes(extname(p))) out.push(p);
  }
  return out;
}

const chars = new Set('まちこ抹茶');
for (const file of [...walk(join(root, 'src')), join(root, 'index.html')]) {
  for (const c of readFileSync(file, 'utf8').match(JP) || []) chars.add(c);
}
const text = [...chars].sort().join('');

try {
  const { default: subsetFont } = await import('subset-font');
  const src = readFileSync(require.resolve('@fontsource/hina-mincho/files/hina-mincho-japanese-400-normal.woff2'));
  const font = await subsetFont(src, text, { targetFormat: 'woff2' });
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, font);
  console.log(`fonts: ${chars.size} Japanese characters, ${(font.length / 1024).toFixed(1)} KB`);
} catch (err) {
  // Keep the committed font if the tools are missing; the build must not fail over this.
  console.warn(`fonts: skipped (${err.message})${existsSync(OUT) ? ', using the existing file' : ''}`);
}
