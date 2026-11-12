// Everything the server needs to know comes from the environment
// (see .env.example). Nothing secret lives in the code.
export function loadConfig(env = process.env) {
  const list = (v) => String(v || '').split(',').map((s) => s.trim()).filter(Boolean);
  return {
    port: Number(env.PORT) || 3000,
    db: env.DATABASE_URL || {
      host: env.DB_HOST || '127.0.0.1',
      port: Number(env.DB_PORT) || 3306,
      database: env.DB_NAME || 'machiko',
      user: env.DB_USER || 'machiko',
      password: env.DB_PASSWORD || ''
    },
    adminToken: env.ADMIN_TOKEN || '',
    tokenSecret: env.TOKEN_SECRET || '',
    siteUrl: (env.SITE_URL || 'https://machiko.rs').replace(/\/$/, ''),
    origins: list(env.ALLOWED_ORIGINS || 'https://machiko.rs,https://www.machiko.rs'),
    smtp: env.SMTP_HOST ? { host: env.SMTP_HOST, port: Number(env.SMTP_PORT) || 465, user: env.SMTP_USER || '', password: env.SMTP_PASSWORD || '' } : null,
    mailFrom: env.MAIL_FROM || 'Machiko <hello@machiko.rs>',
    notifyTo: env.NOTIFY_TO || '',
    brevo: env.BREVO_API_KEY ? { key: env.BREVO_API_KEY, listId: Number(env.BREVO_LIST_ID) || 0 } : null,
    logFile: env.LOG_FILE || 'logs/app.log',
    // The wording of the consent boxes on machiko.rs/join. Change the text
    // on the site, change this label too: every consent is stored with it.
    consentVersion: env.CONSENT_VERSION || '2026-11'
  };
}
