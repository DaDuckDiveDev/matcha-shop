import express from 'express';
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { confirmMessage, reservationMessage } from './mail.js';

const here = dirname(fileURLToPath(import.meta.url));
const ADMIN_PAGE = readFileSync(join(here, '..', 'public', 'admin.html'), 'utf8');

const sha = (s) => createHash('sha256').update(String(s)).digest('hex');
const EMAIL = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[a-z0-9-]{2,}$/i;

// A phone number as Brevo and SMS gateways want it: +381…, digits only.
export function normalisePhone(raw) {
  let p = String(raw || '').replace(/[^\d+]/g, '');
  if (!p) return '';
  if (p.startsWith('00')) p = `+${p.slice(2)}`;
  else if (p.startsWith('0')) p = `+381${p.slice(1)}`;
  else if (!p.startsWith('+')) p = `+${p}`;
  return /^\+\d{8,15}$/.test(p) ? p : '';
}

// A small in-memory limiter: enough to stop a script hammering the form.
function limiter(max, windowMs) {
  const hits = new Map();
  return (key) => {
    const now = Date.now();
    const list = (hits.get(key) || []).filter((t) => now - t < windowMs);
    list.push(now); hits.set(key, list);
    if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
    return list.length <= max;
  };
}

export function createApp({ pool, config, mailer = null, brevo = null, log = () => {} }) {
  const app = express();
  app.set('trust proxy', true);
  app.disable('x-powered-by');
  app.use(express.json({ limit: '10kb' }));

  const sign = (id, purpose) => `${id}.${createHmac('sha256', config.tokenSecret || 'unset').update(`${purpose}:${id}`).digest('hex').slice(0, 32)}`;
  const verify = (token, purpose) => {
    const [id, mac] = String(token || '').split('.');
    if (!/^\d+$/.test(id || '') || !mac) return 0;
    const good = sign(id, purpose).split('.')[1];
    return mac.length === good.length && timingSafeEqual(Buffer.from(mac), Buffer.from(good)) ? Number(id) : 0;
  };
  const ipHash = (req) => sha(`${config.tokenSecret}:${req.ip || ''}`);
  const joinLimit = limiter(8, 60 * 60 * 1000);
  const bookLimit = limiter(12, 60 * 60 * 1000);
  const adminLimit = limiter(30, 15 * 60 * 1000);

  // every answer: no caching, no sniffing, and only our own sites may call from a browser
  app.use((req, res, next) => {
    res.set({ 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'X-Frame-Options': 'DENY' });
    const origin = req.get('origin');
    if (origin && config.origins.includes(origin)) {
      res.set({ 'Access-Control-Allow-Origin': origin, Vary: 'Origin', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Max-Age': '600' });
    }
    if (req.method === 'OPTIONS') return res.status(204).end();
    return next();
  });

  app.get('/', (_req, res) => res.type('text/plain').send('Machiko API'));

  app.get('/api/health', async (_req, res) => {
    let db = false;
    try { await pool.query('SELECT 1'); db = true; } catch { db = false; }
    res.status(db ? 200 : 503).json({ ok: db, database: db, email: Boolean(mailer), brevo: Boolean(brevo), admin: Boolean(config.adminToken), secret: Boolean(config.tokenSecret) });
  });

  const consent = (conn, id, channel, action, c, req) => conn.query(
    'INSERT INTO consent_log (customer_id, channel, action, wording_version, lang, source, ip_hash) VALUES (?,?,?,?,?,?,?)',
    [id, channel, action, config.consentVersion, c.lang, c.source, req ? ipHash(req) : '']
  );

  // ---- the founding list -------------------------------------------------
  app.post('/api/join', async (req, res) => {
    const b = req.body || {};
    if (b.trap) return res.json({ ok: true, status: 'recorded' });            // a bot filled the hidden field
    if (!joinLimit(req.ip)) return res.status(429).json({ ok: false, error: 'too_many' });
    const email = String(b.email || '').trim().toLowerCase();
    const firstName = String(b.firstName || '').trim().slice(0, 80);
    const lang = b.lang === 'en' ? 'en' : 'sr';
    const source = String(b.source || 'website').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 30) || 'website';
    const okSms = b.okSms === true;
    const phone = okSms ? normalisePhone(b.phone) : '';
    if (!EMAIL.test(email) || email.length > 254) return res.status(400).json({ ok: false, error: 'email' });
    if (b.okEmail !== true) return res.status(400).json({ ok: false, error: 'consent' });
    if (okSms && !phone) return res.status(400).json({ ok: false, error: 'phone' });

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [[found]] = await conn.query('SELECT * FROM customers WHERE email = ? FOR UPDATE', [email]);
      const c = { lang, source };
      let id; let status; let token = '';
      if (found && found.confirmed_at && !found.unsubscribed_at) {
        // already on the list: keep what they have, add what is new
        id = found.id; status = 'already';
        await conn.query('UPDATE customers SET first_name = IF(? <> "", ?, first_name), lang = ?, phone = IF(?, ?, phone), sms_opt_in = GREATEST(sms_opt_in, ?) WHERE id = ?', [firstName, firstName, lang, okSms ? 1 : 0, phone, okSms ? 1 : 0, id]);
        if (okSms && !found.sms_opt_in) await consent(conn, id, 'sms', 'granted', c, req);
      } else {
        const recent = found?.confirm_sent_at && Date.now() - new Date(`${found.confirm_sent_at}Z`).getTime() < 2 * 60 * 1000;
        token = randomBytes(32).toString('hex');
        if (found) {
          id = found.id;
          await conn.query('UPDATE customers SET first_name = ?, phone = ?, lang = ?, source = ?, email_opt_in = 1, sms_opt_in = ?, confirm_hash = IF(?, confirm_hash, ?), confirm_sent_at = IF(?, confirm_sent_at, UTC_TIMESTAMP()) WHERE id = ?',
            [firstName || found.first_name, phone, lang, found.source, okSms ? 1 : 0, recent ? 1 : 0, sha(token), recent ? 1 : 0, id]);
          if (recent) token = '';                                               // a message went out moments ago: do not send another
        } else {
          const [r] = await conn.query('INSERT INTO customers (email, first_name, phone, lang, source, email_opt_in, sms_opt_in, confirm_hash, confirm_sent_at) VALUES (?,?,?,?,?,1,?,?,UTC_TIMESTAMP())', [email, firstName, phone, lang, source, okSms ? 1 : 0, sha(token)]);
          id = r.insertId;
        }
        await consent(conn, id, 'email', 'granted', c, req);
        if (okSms) await consent(conn, id, 'sms', 'granted', c, req);
        status = mailer ? 'confirm_sent' : 'recorded';
      }
      await conn.commit();
      if (token && mailer) {
        const msg = confirmMessage({ to: email, name: firstName, lang, confirmUrl: `${req.protocol}://${req.get('host')}/api/confirm?token=${token}`, unsubscribeUrl: `${req.protocol}://${req.get('host')}/api/unsubscribe?c=${sign(id, 'unsub')}` });
        try { await mailer.send(msg); } catch (e) { log(`confirm mail failed for customer ${id}: ${e.message}`); status = 'recorded'; }
      }
      log(`join ${status} customer ${id} source ${source} lang ${lang}`);
      return res.json({ ok: true, status });
    } catch (e) {
      await conn.rollback().catch(() => {});
      log(`join error: ${e.message}`);
      return res.status(500).json({ ok: false, error: 'server' });
    } finally { conn.release(); }
  });

  app.get('/api/confirm', async (req, res) => {
    const token = String(req.query.token || '');
    const back = (ok) => res.redirect(302, `${config.siteUrl}/join?confirmed=${ok ? 1 : 0}`);
    if (!/^[a-f0-9]{64}$/.test(token)) return back(false);
    try {
      const [[c]] = await pool.query('SELECT * FROM customers WHERE confirm_hash = ?', [sha(token)]);
      if (!c) return back(false);
      await pool.query('UPDATE customers SET confirmed_at = UTC_TIMESTAMP(), unsubscribed_at = NULL, confirm_hash = NULL WHERE id = ?', [c.id]);
      await consent(pool, c.id, 'email', 'confirmed', c, req);
      if (brevo) brevo.upsert(c).then(() => pool.query('UPDATE customers SET brevo_synced_at = UTC_TIMESTAMP() WHERE id = ?', [c.id])).catch((e) => log(`brevo upsert failed for customer ${c.id}: ${e.message}`));
      log(`confirmed customer ${c.id}`);
      return back(true);
    } catch (e) { log(`confirm error: ${e.message}`); return back(false); }
  });

  app.get('/api/unsubscribe', async (req, res) => {
    const id = verify(req.query.c, 'unsub');
    const back = (ok) => res.redirect(302, `${config.siteUrl}/join?unsubscribed=${ok ? 1 : 0}`);
    if (!id) return back(false);
    try {
      const [[c]] = await pool.query('SELECT * FROM customers WHERE id = ?', [id]);
      if (!c) return back(true);
      await pool.query('UPDATE customers SET unsubscribed_at = UTC_TIMESTAMP(), email_opt_in = 0, sms_opt_in = 0, confirm_hash = NULL WHERE id = ?', [id]);
      await consent(pool, id, 'email', 'withdrawn', c, req);
      if (c.sms_opt_in) await consent(pool, id, 'sms', 'withdrawn', c, req);
      if (brevo) brevo.unsubscribe(c.email).catch((e) => log(`brevo unsubscribe failed for customer ${id}: ${e.message}`));
      log(`unsubscribed customer ${id}`);
      return back(true);
    } catch (e) { log(`unsubscribe error: ${e.message}`); return back(false); }
  });

  // ---- reservations ------------------------------------------------------
  app.post('/api/reservations', async (req, res) => {
    const b = req.body || {};
    if (b.trap) return res.json({ ok: true });
    if (!bookLimit(req.ip)) return res.status(429).json({ ok: false, error: 'too_many' });
    const r = {
      kind: String(b.kind || 'table').replace(/[^a-z0-9_-]/gi, '').slice(0, 20) || 'table',
      on_date: String(b.date || ''), at_time: String(b.time || ''),
      guests: Math.min(12, Math.max(1, parseInt(b.guests, 10) || 0)),
      name: String(b.name || '').trim().slice(0, 80), contact: String(b.contact || '').trim().slice(0, 120),
      note: String(b.note || '').trim().slice(0, 500), lang: b.lang === 'en' ? 'en' : 'sr'
    };
    const today = new Date().toISOString().slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(r.on_date) || Number.isNaN(Date.parse(r.on_date)) || r.on_date < today) return res.status(400).json({ ok: false, error: 'date' });
    if (!/^\d{2}:\d{2}$/.test(r.at_time)) return res.status(400).json({ ok: false, error: 'time' });
    if (!r.name) return res.status(400).json({ ok: false, error: 'name' });
    if (!r.contact) return res.status(400).json({ ok: false, error: 'contact' });
    try {
      const [ins] = await pool.query('INSERT INTO reservations (kind, on_date, at_time, guests, name, contact, note, lang) VALUES (?,?,?,?,?,?,?,?)', [r.kind, r.on_date, r.at_time, r.guests, r.name, r.contact, r.note, r.lang]);
      if (mailer && config.notifyTo) mailer.send(reservationMessage({ to: config.notifyTo, r })).catch((e) => log(`reservation mail failed: ${e.message}`));
      log(`reservation ${ins.insertId} ${r.kind} ${r.on_date} ${r.at_time}`);
      return res.json({ ok: true, id: ins.insertId });
    } catch (e) { log(`reservation error: ${e.message}`); return res.status(500).json({ ok: false, error: 'server' }); }
  });

  // ---- for the owners: numbers, exports, erasure -------------------------
  const admin = (req, res, next) => {
    if (!adminLimit(req.ip)) return res.status(429).json({ ok: false, error: 'too_many' });
    const given = Buffer.from(String(req.get('authorization') || '').replace(/^Bearer\s+/i, ''));
    const want = Buffer.from(config.adminToken || '');
    if (!want.length || given.length !== want.length || !timingSafeEqual(given, want)) return res.status(401).json({ ok: false, error: 'unauthorised' });
    return next();
  };
  // CSV for spreadsheets and for Brevo. A cell that a spreadsheet would run
  // as a formula gets a leading apostrophe; phone numbers (+381…) are left alone.
  const BOM = String.fromCharCode(0xfeff);   // tells Excel the file is UTF-8
  const cellText = (v) => {
    const s = String(v ?? '');
    const safe = /^[=+\-@\t\r]/.test(s) && !/^\+\d{8,15}$/.test(s) ? `'${s}` : s;
    return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
  };
  const csv = (rows, cols) => [cols.join(','), ...rows.map((r) => cols.map((c) => cellText(r[c])).join(','))].join('\n') + '\n';

  app.get('/admin', (_req, res) => res.set('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; form-action 'none'").type('html').send(ADMIN_PAGE));

  app.get('/api/admin/stats', admin, async (_req, res) => {
    const one = async (sql) => (await pool.query(sql))[0];
    const [[totals]] = await pool.query(`SELECT COUNT(*) AS signups,
      SUM(confirmed_at IS NOT NULL AND unsubscribed_at IS NULL) AS confirmed,
      SUM(confirmed_at IS NULL AND unsubscribed_at IS NULL) AS waiting,
      SUM(unsubscribed_at IS NOT NULL) AS left_list,
      SUM(sms_opt_in = 1 AND unsubscribed_at IS NULL) AS sms FROM customers`);
    res.json({
      ok: true,
      totals: Object.fromEntries(Object.entries(totals).map(([k, v]) => [k, Number(v) || 0])),
      bySource: await one('SELECT source, COUNT(*) AS n, SUM(confirmed_at IS NOT NULL) AS confirmed FROM customers GROUP BY source ORDER BY n DESC'),
      byLang: await one('SELECT lang, COUNT(*) AS n FROM customers GROUP BY lang ORDER BY n DESC'),
      byWeek: await one("SELECT DATE_FORMAT(created_at, '%x-W%v') AS week, COUNT(*) AS n FROM customers GROUP BY week ORDER BY week DESC LIMIT 16"),
      latest: await one("SELECT first_name, CONCAT(LEFT(email, 2), '…@', SUBSTRING_INDEX(email, '@', -1)) AS email, lang, source, confirmed_at IS NOT NULL AS confirmed, created_at FROM customers ORDER BY id DESC LIMIT 12"),
      reservations: await one('SELECT id, kind, on_date, at_time, guests, name, contact, note, status, created_at FROM reservations WHERE on_date >= CURDATE() ORDER BY on_date, at_time LIMIT 50')
    });
  });

  // The file Brevo imports as it is: confirmed, still-subscribed people only.
  app.get('/api/admin/customers.csv', admin, async (req, res) => {
    const all = req.query.all === '1';
    const [rows] = await pool.query(`SELECT email AS EMAIL, first_name AS FIRSTNAME, IF(sms_opt_in = 1, phone, '') AS SMS, UPPER(lang) AS LANG, source AS SOURCE,
      IF(email_opt_in = 1, 'true', 'false') AS OPT_IN, IF(sms_opt_in = 1, 'true', 'false') AS SMS_OPT_IN, created_at AS SIGNED_UP, IFNULL(confirmed_at, '') AS CONFIRMED, IFNULL(unsubscribed_at, '') AS UNSUBSCRIBED
      FROM customers ${all ? '' : 'WHERE confirmed_at IS NOT NULL AND unsubscribed_at IS NULL'} ORDER BY id`);
    res.set('Content-Disposition', `attachment; filename="machiko-${all ? 'everyone' : 'list'}-${new Date().toISOString().slice(0, 10)}.csv"`).type('text/csv').send(`${BOM}${csv(rows, ['EMAIL', 'FIRSTNAME', 'SMS', 'LANG', 'SOURCE', 'OPT_IN', 'SMS_OPT_IN', 'SIGNED_UP', 'CONFIRMED', 'UNSUBSCRIBED'])}`);
  });

  app.get('/api/admin/reservations.csv', admin, async (_req, res) => {
    const [rows] = await pool.query('SELECT id, kind, on_date, at_time, guests, name, contact, note, lang, status, created_at FROM reservations ORDER BY on_date, at_time');
    res.set('Content-Disposition', 'attachment; filename="machiko-reservations.csv"').type('text/csv').send(`${BOM}${csv(rows, ['id', 'kind', 'on_date', 'at_time', 'guests', 'name', 'contact', 'note', 'lang', 'status', 'created_at'])}`);
  });

  // Somebody asks what we hold about them, or asks us to delete it.
  app.get('/api/admin/person', admin, async (req, res) => {
    const email = String(req.query.email || '').trim().toLowerCase();
    const [[c]] = await pool.query('SELECT id, email, first_name, phone, lang, source, email_opt_in, sms_opt_in, created_at, confirmed_at, unsubscribed_at FROM customers WHERE email = ?', [email]);
    if (!c) return res.status(404).json({ ok: false, error: 'not_found' });
    const [history] = await pool.query('SELECT channel, action, wording_version, lang, source, created_at FROM consent_log WHERE customer_id = ? ORDER BY id', [c.id]);
    return res.json({ ok: true, person: c, consents: history });
  });
  app.post('/api/admin/erase', admin, async (req, res) => {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const [r] = await pool.query('DELETE FROM customers WHERE email = ?', [email]);
    if (r.affectedRows && brevo) brevo.unsubscribe(email).catch(() => {});
    log(`erase request: ${r.affectedRows ? 'one person removed' : 'nobody by that address'}`);
    res.json({ ok: true, removed: r.affectedRows });
  });

  app.use((_req, res) => res.status(404).json({ ok: false, error: 'not_found' }));
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => { log(`error: ${err.message}`); res.status(err.type === 'entity.parse.failed' ? 400 : 500).json({ ok: false, error: 'server' }); });
  return app;
}
