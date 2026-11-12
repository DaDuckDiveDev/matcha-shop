// Uploads the built site (dist/) to the web host over SFTP.
//
// Used by .github/workflows/deploy-siteground.yml; it can also be run by hand:
//   SFTP_HOST=… SFTP_PORT=18765 SFTP_USER=… SFTP_KEY_FILE=~/.ssh/key \
//   REMOTE_DIR=/machiko.rs/machiko.rs/public_html node scripts/deploy-sftp.mjs
//
// What it does, in order:
//   1. Finds the site's folder. If REMOTE_DIR is not there it looks for
//      /<any site>/<DOMAIN>/public_html and, if there is exactly one, uses it.
//   2. Refuses to go on if the folder holds a WordPress site
//      (set ALLOW_REPLACE=1 to upload anyway).
//   3. Keeps a copy of an .htaccess it did not write (.htaccess.before-machiko).
//   4. Uploads every file. Photographs already on the server at the same size
//      are skipped. index.html and the service worker go last, so the new
//      page only appears once everything it needs is in place.
// It never deletes anything on the server.
import { spawnSync } from 'node:child_process';
import { readdirSync, statSync, existsSync, readFileSync, mkdtempSync } from 'node:fs';
import { join, dirname, posix } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(root, 'dist');
const { SFTP_HOST, SFTP_PORT = '22', SFTP_USER, SFTP_KEY_FILE, SFTP_LOCAL_SERVER } = process.env;
const DOMAIN = process.env.DOMAIN || 'machiko.rs';
const TOP = (process.env.SFTP_ROOT || '').replace(/\/+$/, '');   // where the account's site folders are; normally the root
let remote = (process.env.REMOTE_DIR || `/${DOMAIN}/${DOMAIN}/public_html`).replace(/\/+$/, '');
const allowReplace = process.env.ALLOW_REPLACE === '1';
const MARK = 'Machiko';                       // our .htaccess carries this word
const SKIP_IF_SAME_SIZE = ['photos'];         // folders whose files do not change once uploaded

const fail = (msg) => { console.error(`::error::${msg}`); process.exit(1); };
if (!existsSync(join(DIST, 'index.html'))) fail('dist/index.html is missing: run the build first');
if (!SFTP_LOCAL_SERVER && (!SFTP_HOST || !SFTP_USER || !SFTP_KEY_FILE)) fail('SFTP_HOST, SFTP_USER and SFTP_KEY_FILE must be set');

// One sftp session running a list of commands. A command that fails stops
// the session, unless it starts with "-".
function sftp(commands) {
  const args = SFTP_LOCAL_SERVER
    ? ['-D', SFTP_LOCAL_SERVER, '-b', '-']    // tests: talk to a local sftp-server, no network
    : ['-i', SFTP_KEY_FILE, '-P', String(SFTP_PORT), '-o', 'BatchMode=yes', '-o', 'IdentitiesOnly=yes', '-o', 'StrictHostKeyChecking=yes', '-o', 'ConnectTimeout=30', '-b', '-', `${SFTP_USER}@${SFTP_HOST}`];
  const r = spawnSync('sftp', args, { input: commands.join('\n') + '\n', encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const lines = (r.stdout || '').split('\n').filter((l) => l && !l.startsWith('sftp> '));
  return { ok: r.status === 0, lines, err: (r.stderr || '').trim() };
}
const q = (p) => `"${p.replace(/(["\\])/g, '\\$1')}"`;
const names = (dir) => { const r = sftp([`cd ${q(dir)}`, 'ls -1a']); return r.ok ? r.lines.map((l) => l.trim()).filter((n) => n && n !== '.' && n !== '..') : null; };

// 0. can we sign in at all?
const hello = sftp(['pwd']);
if (!hello.ok) {
  const why = hello.err.split('\n').filter(Boolean).slice(-3).join(' | ');
  console.error(`sftp said: ${why || '(nothing)'}`);
  fail(/permission denied/i.test(why)
    ? `The server refused the key for ${SFTP_USER}. The SFTP_KEY secret is not the private key of that SFTP user (each Multisite SFTP key has its own username: compare it with SFTP_USER in the workflow).`
    : `Could not connect to ${SFTP_HOST}: ${why}`);
}

// 1. the folder
let here = names(remote);
if (!here) {
  const sites = (names(TOP || '/') || []).filter((s) => !s.startsWith('.'));
  const found = sites.map((s) => `${TOP}/${s}/${DOMAIN}/public_html`).filter((p) => names(p));
  if (found.length === 1) {
    console.log(`::notice::${remote} was not found; using ${found[0]} instead. Set REMOTE_DIR in the workflow to that path.`);
    remote = found[0];
    here = names(remote);
  } else {
    console.error(`Folders this SFTP account can see: ${sites.join(', ') || '(none)'}`);
    fail(found.length > 1
      ? `More than one folder holds ${DOMAIN}: ${found.join(', ')}. Set REMOTE_DIR in the workflow to the right one.`
      : `No folder for ${DOMAIN} on this SFTP account. In SiteGround, add the website ${DOMAIN} and give this SFTP key access to it, or set REMOTE_DIR in the workflow.`);
  }
}
console.log(`Uploading to ${remote} (${here.length} items there now)`);

// 2. somebody else's site?
const wordpress = here.filter((n) => ['wp-config.php', 'wp-admin', 'wp-content', 'wp-includes'].includes(n));
if (wordpress.length && !allowReplace) {
  fail(`${remote} holds a WordPress site (${wordpress.join(', ')}). Nothing was uploaded. Move or remove it in SiteGround first, or run this workflow by hand with "Upload even if the folder holds a WordPress site" ticked.`);
}

// 3. an .htaccess we did not write
if (here.includes('.htaccess') && !here.includes('.htaccess.before-machiko')) {
  const tmp = join(mkdtempSync(join(tmpdir(), 'machiko-')), 'htaccess');
  const got = sftp([`get ${q(`${remote}/.htaccess`)} ${q(tmp)}`]);
  if (got.ok && existsSync(tmp) && !readFileSync(tmp, 'utf8').includes(MARK)) {
    const kept = sftp([`put ${q(tmp)} ${q(`${remote}/.htaccess.before-machiko`)}`]);
    console.log(kept.ok ? 'Kept the existing .htaccess as .htaccess.before-machiko' : `::warning::Could not keep a copy of the existing .htaccess: ${kept.err}`);
  }
}

// 4. what to send
const dirs = []; const files = [];
(function walk(rel) {
  for (const name of readdirSync(join(DIST, rel)).sort()) {
    const r = rel ? `${rel}/${name}` : name;
    const st = statSync(join(DIST, r));
    if (st.isDirectory()) { dirs.push(r); walk(r); } else files.push({ rel: r, size: st.size });
  }
})('');

// sizes of what is already there, for the folders that never change
const have = new Map();
for (const dir of SKIP_IF_SAME_SIZE) {
  const r = sftp([`cd ${q(`${remote}/${dir}`)}`, 'ls -l']);
  if (!r.ok) continue;
  for (const line of r.lines) {
    const m = line.match(/^-\S+\s+\S+\s+\S+\s+\S+\s+(\d+)\s+\S+\s+\S+\s+\S+\s+(.+)$/);
    if (m) have.set(`${dir}/${m[2].trim()}`, Number(m[1]));
  }
}

const LAST = ['manifest.webmanifest', 'sw.js', 'index.html'];
const rank = (f) => (LAST.includes(f.rel) ? 2 + LAST.indexOf(f.rel) : f.rel.includes('/') ? 0 : 1);
const send = files.filter((f) => have.get(f.rel) !== f.size).sort((a, b) => rank(a) - rank(b) || a.rel.localeCompare(b.rel));
const skipped = files.length - send.length;

const batch = [
  ...dirs.map((d) => `-mkdir ${q(posix.join(remote, d))}`),
  ...send.map((f) => `put ${q(join(DIST, f.rel))} ${q(posix.join(remote, f.rel))}`),
  `ls -l ${q(`${remote}/index.html`)}`
];
const up = sftp(batch);
if (!up.ok) {
  console.error(up.lines.slice(-15).join('\n'));
  // "mkdir … Failure" for folders that already exist is expected; show the rest
  console.error(up.err.split('\n').filter((l) => !/mkdir|Couldn't create directory|remote mkdir/i.test(l)).slice(-15).join('\n'));
  fail('The upload stopped before it finished. The site may be half updated: run the workflow again.');
}
const mb = (send.reduce((n, f) => n + f.size, 0) / 1048576).toFixed(1);
console.log(`Uploaded ${send.length} files (${mb} MB)${skipped ? `, skipped ${skipped} photographs already there` : ''}.`);
console.log(up.lines.slice(-1)[0] || '');
