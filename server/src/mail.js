import nodemailer from 'nodemailer';

// Email. Two messages: the one that asks a new sign-up to confirm, and the
// note the shop receives when somebody asks for a table or a workshop seat.
export function createMailer(config, transport) {
  const tx = transport || (config.smtp ? nodemailer.createTransport({
    host: config.smtp.host, port: config.smtp.port, secure: config.smtp.port === 465,
    auth: config.smtp.user ? { user: config.smtp.user, pass: config.smtp.password } : undefined
  }) : null);
  if (!tx) return null;
  return { send: (msg) => tx.sendMail({ from: config.mailFrom, ...msg }) };
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const COPY = {
  en: {
    subject: 'Confirm your place on the Machiko founding list',
    hello: (n) => (n ? `Hello ${n},` : 'Hello,'),
    body: 'One tap and you are on the founding list: an invitation to the soft opening, 11–17 March 2027, before the doors open to everyone.',
    button: 'Confirm my place',
    ignore: 'If you did not ask for this, ignore this message and nothing happens.',
    unsub: 'Changed your mind? Leave the list',
    sign: 'Machiko — matcha house, Dorćol, Belgrade'
  },
  sr: {
    subject: 'Potvrdi mesto na Machiko listi prvih gostiju',
    hello: (n) => (n ? `Zdravo ${n},` : 'Zdravo,'),
    body: 'Jedan dodir i na listi si prvih gostiju: poziv na probno otvaranje, 11–17. marta 2027, pre nego što se vrata otvore za sve.',
    button: 'Potvrdi moje mesto',
    ignore: 'Ako ovo nisi tražio/la, zanemari poruku i ništa se neće desiti.',
    unsub: 'Predomislio/la si se? Odjavi se sa liste',
    sign: 'Machiko — čajdžinica, Dorćol, Beograd'
  }
};

export function confirmMessage({ to, name, lang, confirmUrl, unsubscribeUrl }) {
  const c = COPY[lang] || COPY.sr;
  const text = `${c.hello(name)}\n\n${c.body}\n\n${c.button}: ${confirmUrl}\n\n${c.ignore}\n${c.unsub}: ${unsubscribeUrl}\n\n${c.sign}`;
  const html = `<!doctype html><html lang="${lang}"><body style="margin:0;background:#FBFAF6;font-family:Georgia,'Times New Roman',serif;color:#161915">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px">
<tr><td style="font-size:22px;letter-spacing:.01em;padding-bottom:28px">Machiko <span style="color:#646A5F;font-size:14px">まちこ</span></td></tr>
<tr><td style="font-size:17px;line-height:1.6;font-family:Helvetica,Arial,sans-serif;color:#4A5046">${esc(c.hello(name))}<br><br>${esc(c.body)}</td></tr>
<tr><td style="padding:28px 0"><a href="${esc(confirmUrl)}" style="display:inline-block;background:#3E5A33;color:#F6F4EC;text-decoration:none;font-family:Helvetica,Arial,sans-serif;font-size:16px;padding:16px 28px;border-radius:999px">${esc(c.button)}</a></td></tr>
<tr><td style="font-size:13px;line-height:1.6;font-family:Helvetica,Arial,sans-serif;color:#646A5F">${esc(c.ignore)}<br><a href="${esc(unsubscribeUrl)}" style="color:#646A5F">${esc(c.unsub)}</a><br><br>${esc(c.sign)}</td></tr>
</table></td></tr></table></body></html>`;
  return { to, subject: c.subject, text, html, headers: { 'List-Unsubscribe': `<${unsubscribeUrl}>` } };
}

export function reservationMessage({ to, r }) {
  const lines = [`${r.kind}`, `${r.on_date} at ${r.at_time}`, `${r.guests} guest(s)`, `Name: ${r.name}`, `Contact: ${r.contact || '(none given)'}`, r.note ? `Note: ${r.note}` : ''].filter(Boolean);
  return { to, subject: `Reservation request: ${r.name}, ${r.on_date} ${r.at_time}`, text: lines.join('\n') };
}
