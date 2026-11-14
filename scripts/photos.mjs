// Downloads the site's photographs and prepares them for the web.
//
// Every photo in src/data/images.js is a Pexels photo. This script fetches
// each one once, writes AVIF and JPEG copies at four widths to
// public/photos, and records them in src/data/photos.manifest.json together
// with a tiny blurred preview that shows while the real photo loads.
// The site then serves its own copies; a photo the script could not fetch
// simply stays on the Pexels address.
//
//   npm run photos            fetch what is missing
//   npm run photos -- --force rebuild everything
//
// To use your own photograph, drop a JPEG at photos-src/<key>.jpg (the key
// from images.js, for example photos-src/bowlTop.jpg) and run it again.
// A picture made for Machiko is listed in src/data/generated.json instead.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, 'public/photos');
const MANIFEST = join(root, 'src/data/photos.manifest.json');
const WIDTHS = [480, 800, 1200, 1800];
const ORIGIN = process.env.PHOTOS_ORIGIN || 'https://images.pexels.com';
const force = process.argv.includes('--force');

const source = readFileSync(join(root, 'src/data/images.js'), 'utf8');
// `fallback` is the Pexels photo to use for a made picture that has no Pexels number of its own.
const photos = [...source.matchAll(/^\s*(\w+):\s*\{\s*id:\s*(\d+)(?:,\s*fallback:\s*(\d+))?/gm)].map((m) => ({ key: m[1], id: m[2], pexels: m[3] || m[2] }));

let sharp;
try { sharp = (await import('sharp')).default; } catch { sharp = null; }
if (!sharp) { console.warn('photos: sharp is not installed, skipping'); process.exit(0); }

let manifest = {};
try { manifest = JSON.parse(readFileSync(MANIFEST, 'utf8')); } catch { manifest = {}; }
mkdirSync(OUT, { recursive: true });

// Pictures made for Machiko (src/data/generated.json: key -> address). One of
// these comes before the Pexels photo of the same key; if its address ever
// stops answering, the Pexels photo is used again, so the site never shows a gap.
let generated = {};
try { generated = JSON.parse(readFileSync(join(root, 'src/data/generated.json'), 'utf8')); } catch { generated = {}; }

// The picture to prepare and the name its copies are saved under. A made
// picture gets its own name (the Pexels number, "-m" and a few characters
// from its address), because the upload never replaces a photograph that is
// already on the server under the same name.
async function original({ key, id, pexels }) {
  const own = join(root, 'photos-src', `${key}.jpg`);
  if (existsSync(own)) return { input: readFileSync(own), stem: id };
  if (generated[key]) {
    try {
      const made = await fetch(generated[key], { signal: AbortSignal.timeout(45000) });
      if (made.ok) return { input: Buffer.from(await made.arrayBuffer()), stem: `${id}-m${createHash('sha1').update(generated[key]).digest('hex').slice(0, 6)}` };
      console.warn(`photos: ${key} made picture answered ${made.status}, using the Pexels photo`);
    } catch (err) { console.warn(`photos: ${key} made picture not fetched (${err.message}), using the Pexels photo`); }
  }
  const url = `${ORIGIN}/photos/${pexels}/pexels-photo-${pexels}.jpeg?auto=compress&cs=tinysrgb&w=2400`;
  const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return { input: Buffer.from(await res.arrayBuffer()), stem: id };
}

async function prepare(photo) {
  const done = manifest[photo.id];
  if (!force && done && done.w.every((w) => existsSync(join(OUT, `${done.f || photo.id}-${w}.avif`)))) return 'kept';
  const { input, stem } = await original(photo);
  const meta = await sharp(input).metadata();
  const widths = WIDTHS.filter((w) => w <= meta.width);
  if (!widths.length) widths.push(meta.width);
  for (const w of widths) {
    const pipe = sharp(input).rotate().resize({ width: w, withoutEnlargement: true });
    await pipe.clone().avif({ quality: 52, effort: 4 }).toFile(join(OUT, `${stem}-${w}.avif`));
    await pipe.clone().jpeg({ quality: 78, mozjpeg: true }).toFile(join(OUT, `${stem}-${w}.jpg`));
  }
  const preview = await sharp(input).rotate().resize({ width: 24 }).blur(1.2).webp({ quality: 40 }).toBuffer();
  const { dominant } = await sharp(input).stats();
  const hex = '#' + [dominant.r, dominant.g, dominant.b].map((v) => v.toString(16).padStart(2, '0')).join('');
  manifest[photo.id] = { w: widths, ar: +(meta.width / meta.height).toFixed(4), ph: `data:image/webp;base64,${preview.toString('base64')}`, c: hex, ...(stem !== photo.id ? { f: stem } : {}) };
  return 'made';
}

const count = { made: 0, kept: 0, failed: 0 };
const queue = [...photos];
async function worker() {
  for (let p = queue.shift(); p; p = queue.shift()) {
    try { count[await prepare(p)] += 1; }
    catch (err) { count.failed += 1; delete manifest[p.id]; console.warn(`photos: ${p.key} (${p.id}) not fetched: ${err.message}`); }
  }
}
await Promise.all(Array.from({ length: 6 }, worker));
writeFileSync(MANIFEST, JSON.stringify(manifest) + '\n');
console.log(`photos: ${count.made} prepared, ${count.kept} already there, ${count.failed} left on Pexels`);
