// Optional: keep a Brevo list in step with the database, so campaigns can be
// sent from Brevo without importing files. Only confirmed sign-ups are sent.
// Failures are logged and never stop a sign-up: the database is the record.
const API = 'https://api.brevo.com/v3';

export function createBrevo(config, fetchImpl = fetch) {
  if (!config.brevo) return null;
  const call = (path, method, body) => fetchImpl(`${API}${path}`, {
    method, headers: { 'api-key': config.brevo.key, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(body), signal: AbortSignal.timeout(10000)
  });
  return {
    async upsert(c) {
      const attributes = { FIRSTNAME: c.first_name, LANG: c.lang, SOURCE: c.source, OPT_IN: true, SMS_OPT_IN: Boolean(c.sms_opt_in) };
      if (c.sms_opt_in && c.phone) attributes.SMS = c.phone;
      const res = await call('/contacts', 'POST', { email: c.email, attributes, listIds: config.brevo.listId ? [config.brevo.listId] : undefined, updateEnabled: true, emailBlacklisted: false });
      if (!res.ok) throw new Error(`Brevo ${res.status}`);
    },
    async unsubscribe(email) {
      const res = await call(`/contacts/${encodeURIComponent(email)}`, 'PUT', { emailBlacklisted: true, smsBlacklisted: true });
      if (!res.ok && res.status !== 404) throw new Error(`Brevo ${res.status}`);
    }
  };
}
