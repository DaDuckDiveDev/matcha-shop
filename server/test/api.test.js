// End-to-end tests against a real MySQL or MariaDB.
//   TEST_DATABASE_URL=mysql://user:pass@127.0.0.1:3306/machiko_test npm test
// Every test starts from empty tables. Email goes to an in-memory outbox.
import { test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import nodemailer from 'nodemailer';
import { loadConfig } from '../src/config.js';
import { createPool, migrate } from '../src/db.js';
import { createMailer } from '../src/mail.js';
import { createApp, normalisePhone } from '../src/app.js';

const URL_DB = process.env.TEST_DATABASE_URL || 'mysql://machiko:machiko@127.0.0.1:3306/machiko_test';
const config = loadConfig({ DATABASE_URL: URL_DB, ADMIN_TOKEN: 'admin-secret-for-tests', TOKEN_SECRET: 'token-secret-for-tests', SITE_URL: 'https://machiko.rs', ALLOWED_ORIGINS: 'https://machiko.rs', NOTIFY_TO: 'hello@machiko.rs' });
const outbox = [];
const brevoCalls = [];
let pool; let server; let base;

const post = (path, body, headers = {}) => fetch(base + path, { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) });
const get = (path, headers = {}) => fetch(base + path, { headers, redirect: 'manual' });
const auth = { authorization: 'Bearer admin-secret-for-tests' };
const ip = (n) => ({ 'x-forwarded-for': `10.0.0.${n}` });
const link = (msg, word) => msg.text.split(/\s+/).find((w) => w.includes(word));

before(async () => {
  pool = createPool(config.db);
  await migrate(pool);
  const transport = nodemailer.createTransport({ jsonTransport: true });
  const mailer = createMailer(config, { sendMail: async (m) => { outbox.push(m); return transport.sendMail(m); } });
  const brevo = { upsert: async (c) => { brevoCalls.push(['upsert', c.email]); }, unsubscribe: async (e) => { brevoCalls.push(['unsubscribe', e]); } };
  server = createApp({ pool, config, mailer, brevo }).listen(0);
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => { server.close(); await pool.end(); });
beforeEach(async () => {
  outbox.length = 0; brevoCalls.length = 0;
  await pool.query('DELETE FROM consent_log'); await pool.query('DELETE FROM customers'); await pool.query('DELETE FROM reservations');
});

test('health reports the database', async () => {
  const d = await (await get('/api/health')).json();
  assert.deepEqual([d.ok, d.database, d.email], [true, true, true]);
});

test('phone numbers are put in international form', () => {
  assert.equal(normalisePhone('064 123 4567'), '+381641234567');
  assert.equal(normalisePhone('+381 64 123-4567'), '+381641234567');
  assert.equal(normalisePhone('00381641234567'), '+381641234567');
  assert.equal(normalisePhone('12'), '');
});

test('join → confirmation email → confirmed, with every consent on record', async () => {
  const res = await post('/api/join', { email: ' Ana@Example.com ', firstName: 'Ana', phone: '064 123 4567', okEmail: true, okSms: true, lang: 'sr', source: 'instagram' }, ip(1));
  assert.deepEqual(await res.json(), { ok: true, status: 'confirm_sent' });
  assert.equal(outbox.length, 1);
  assert.equal(outbox[0].to, 'ana@example.com');
  assert.match(outbox[0].subject, /Potvrdi/);
  let [[c]] = await pool.query('SELECT * FROM customers');
  assert.deepEqual([c.email, c.phone, c.source, c.sms_opt_in, c.confirmed_at], ['ana@example.com', '+381641234567', 'instagram', 1, null]);

  const url = new URL(link(outbox[0], '/api/confirm'));
  const back = await get(url.pathname + url.search);
  assert.equal(back.status, 302);
  assert.equal(back.headers.get('location'), 'https://machiko.rs/join?confirmed=1');
  [[c]] = await pool.query('SELECT * FROM customers');
  assert.ok(c.confirmed_at); assert.equal(c.confirm_hash, null);
  const [logs] = await pool.query('SELECT channel, action, wording_version FROM consent_log ORDER BY id');
  assert.deepEqual(logs.map((l) => `${l.channel}:${l.action}`), ['email:granted', 'sms:granted', 'email:confirmed']);
  assert.equal(logs[0].wording_version, config.consentVersion);
  assert.deepEqual(brevoCalls, [['upsert', 'ana@example.com']]);

  // the same link cannot be used twice
  assert.equal((await get(url.pathname + url.search)).headers.get('location'), 'https://machiko.rs/join?confirmed=0');
});

test('joining again when already on the list sends nothing and keeps the record', async () => {
  await post('/api/join', { email: 'ana@example.com', okEmail: true }, ip(2));
  const url = new URL(link(outbox[0], '/api/confirm')); await get(url.pathname + url.search);
  const res = await post('/api/join', { email: 'ANA@example.com', firstName: 'Ana', okEmail: true, lang: 'en' }, ip(2));
  assert.equal((await res.json()).status, 'already');
  assert.equal(outbox.length, 1);
  const [[n]] = await pool.query('SELECT COUNT(*) AS n, MAX(first_name) AS name FROM customers');
  assert.deepEqual([Number(n.n), n.name], [1, 'Ana']);
});

test('a second sign-up within two minutes does not send a second email', async () => {
  await post('/api/join', { email: 'bo@example.com', okEmail: true }, ip(3));
  await post('/api/join', { email: 'bo@example.com', okEmail: true }, ip(3));
  assert.equal(outbox.length, 1);
  const url = new URL(link(outbox[0], '/api/confirm'));
  assert.equal((await get(url.pathname + url.search)).headers.get('location'), 'https://machiko.rs/join?confirmed=1');
});

test('what is refused: no consent, bad email, SMS consent without a phone', async () => {
  assert.equal((await post('/api/join', { email: 'a@example.com' }, ip(4))).status, 400);
  assert.equal((await (await post('/api/join', { email: 'a@example.com', okEmail: 'yes' }, ip(4))).json()).error, 'consent');
  assert.equal((await (await post('/api/join', { email: 'not-an-email', okEmail: true }, ip(4))).json()).error, 'email');
  assert.equal((await (await post('/api/join', { email: 'a@example.com', okEmail: true, okSms: true, phone: '12' }, ip(4))).json()).error, 'phone');
  assert.equal((await fetch(`${base}/api/join`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{broken' })).status, 400);
  const [[n]] = await pool.query('SELECT COUNT(*) AS n FROM customers');
  assert.equal(Number(n.n), 0);
});

test('a phone number without SMS consent is not kept', async () => {
  await post('/api/join', { email: 'c@example.com', okEmail: true, okSms: false, phone: '0641234567' }, ip(5));
  const [[c]] = await pool.query('SELECT phone, sms_opt_in FROM customers');
  assert.deepEqual([c.phone, c.sms_opt_in], ['', 0]);
});

test('a bot that fills the hidden field is told "ok" and nothing is stored', async () => {
  const res = await post('/api/join', { email: 'bot@example.com', okEmail: true, trap: 'http://spam' }, ip(6));
  assert.equal((await res.json()).ok, true);
  const [[n]] = await pool.query('SELECT COUNT(*) AS n FROM customers');
  assert.equal(Number(n.n), 0); assert.equal(outbox.length, 0);
});

test('unsubscribe link works, is recorded, and a forged one does nothing', async () => {
  await post('/api/join', { email: 'd@example.com', okEmail: true, okSms: true, phone: '0641234567' }, ip(7));
  const confirm = new URL(link(outbox[0], '/api/confirm')); await get(confirm.pathname + confirm.search);
  const unsub = new URL(link(outbox[0], '/api/unsubscribe'));
  assert.equal((await get('/api/unsubscribe?c=1.0000000000000000')).headers.get('location'), 'https://machiko.rs/join?unsubscribed=0');
  let [[c]] = await pool.query('SELECT unsubscribed_at FROM customers'); assert.equal(c.unsubscribed_at, null);
  assert.equal((await get(unsub.pathname + unsub.search)).headers.get('location'), 'https://machiko.rs/join?unsubscribed=1');
  [[c]] = await pool.query('SELECT unsubscribed_at, email_opt_in, sms_opt_in FROM customers');
  assert.ok(c.unsubscribed_at); assert.deepEqual([c.email_opt_in, c.sms_opt_in], [0, 0]);
  const [logs] = await pool.query("SELECT COUNT(*) AS n FROM consent_log WHERE action = 'withdrawn'");
  assert.equal(Number(logs[0].n), 2);
  assert.deepEqual(brevoCalls.at(-1), ['unsubscribe', 'd@example.com']);
  // they may come back, with a fresh confirmation
  assert.equal((await (await post('/api/join', { email: 'd@example.com', okEmail: true }, ip(8))).json()).status, 'confirm_sent');
});

test('the form is rate-limited per address', async () => {
  let last;
  for (let i = 0; i < 9; i++) last = await post('/api/join', { email: `r${i}@example.com`, okEmail: true }, ip(9));
  assert.equal(last.status, 429);
});

test('reservations are stored, the shop is told, bad ones are refused', async () => {
  const date = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
  const ok = await post('/api/reservations', { kind: 'usucha', date, time: '10:00', guests: 2, name: 'Mila', contact: '+381641234567', note: 'window seat', lang: 'sr' }, ip(10));
  assert.equal((await ok.json()).ok, true);
  await new Promise((r) => setTimeout(r, 50));
  assert.equal(outbox.length, 1); assert.equal(outbox[0].to, 'hello@machiko.rs'); assert.match(outbox[0].text, /Mila/);
  assert.equal((await (await post('/api/reservations', { date: '2020-01-01', time: '10:00', guests: 2, name: 'x', contact: 'y' }, ip(10))).json()).error, 'date');
  assert.equal((await (await post('/api/reservations', { date, time: '10:00', guests: 2, name: 'x' }, ip(10))).json()).error, 'contact');
  const [[n]] = await pool.query('SELECT COUNT(*) AS n FROM reservations'); assert.equal(Number(n.n), 1);
});

test('admin: locked without the password; numbers, export and erasure with it', async () => {
  assert.equal((await get('/api/admin/stats')).status, 401);
  assert.equal((await get('/api/admin/customers.csv', { authorization: 'Bearer wrong' })).status, 401);
  await post('/api/join', { email: 'e@example.com', firstName: '=cmd()', okEmail: true, source: 'poster' }, ip(11));
  await post('/api/join', { email: 'f@example.com', firstName: 'Filip, "Fića"', okEmail: true, okSms: true, phone: '0641234567', source: 'poster' }, ip(12));
  const f = new URL(link(outbox[1], '/api/confirm')); await get(f.pathname + f.search);
  const stats = await (await get('/api/admin/stats', auth)).json();
  assert.deepEqual([stats.totals.signups, stats.totals.confirmed, stats.totals.waiting, stats.totals.sms], [2, 1, 1, 1]);
  assert.equal(stats.bySource[0].source, 'poster');
  assert.ok(!JSON.stringify(stats.latest).includes('f@example.com'), 'the dashboard masks addresses');
  const list = await (await get('/api/admin/customers.csv', auth)).text();
  assert.match(list, /^EMAIL,FIRSTNAME,SMS,LANG,SOURCE,OPT_IN,SMS_OPT_IN/);   // fetch drops the UTF-8 mark at the start
  assert.ok(list.includes('f@example.com,"Filip, ""Fića""",+381641234567,SR,poster,true,true'));
  assert.ok(!list.includes('e@example.com'), 'unconfirmed people are not in the list');
  const everyone = await (await get('/api/admin/customers.csv?all=1', auth)).text();
  assert.ok(everyone.includes("e@example.com,'=cmd()"), 'spreadsheet formulas are defused');
  const person = await (await get('/api/admin/person?email=f@example.com', auth)).json();
  assert.equal(person.consents.length, 3);
  assert.equal((await (await post('/api/admin/erase', { email: 'f@example.com' }, auth)).json()).removed, 1);
  const [[n]] = await pool.query('SELECT (SELECT COUNT(*) FROM customers) AS c, (SELECT COUNT(*) FROM consent_log) AS l');
  assert.deepEqual([Number(n.c), Number(n.l)], [1, 1]);
});

test('browsers: only our own sites may call, and the admin page is served', async () => {
  const mine = await get('/api/health', { origin: 'https://machiko.rs' });
  assert.equal(mine.headers.get('access-control-allow-origin'), 'https://machiko.rs');
  const other = await get('/api/health', { origin: 'https://evil.example' });
  assert.equal(other.headers.get('access-control-allow-origin'), null);
  const pre = await fetch(`${base}/api/join`, { method: 'OPTIONS', headers: { origin: 'https://machiko.rs', 'access-control-request-method': 'POST' } });
  assert.equal(pre.status, 204);
  const page = await get('/admin');
  assert.equal(page.status, 200); assert.match(await page.text(), /Machiko — the list/);
  assert.equal((await get('/api/nothing')).status, 404);
});
