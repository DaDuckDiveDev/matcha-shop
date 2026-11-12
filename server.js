// Machiko API — the shop's own customer database.
// Starts the web server, makes sure the tables exist, and says in the log
// (logs/app.log) what is and is not configured.
import { appendFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { loadConfig } from './src/config.js';
import { createPool, migrate } from './src/db.js';
import { createMailer } from './src/mail.js';
import { createBrevo } from './src/brevo.js';
import { createApp } from './src/app.js';

try { process.loadEnvFile?.('.env'); } catch { /* no .env file: the platform provides the variables */ }

const config = loadConfig();
await mkdir(dirname(config.logFile), { recursive: true }).catch(() => {});
const log = (line) => {
  const text = `${new Date().toISOString()} ${line}`;
  console.log(text);
  appendFile(config.logFile, `${text}\n`).catch(() => {});
};

const pool = createPool(config.db);
const app = createApp({ pool, config, mailer: createMailer(config), brevo: createBrevo(config), log });

async function prepare(attempt = 1) {
  try { await migrate(pool); log('database ready'); }
  catch (e) {
    log(`database not reachable (attempt ${attempt}): ${e.code || e.message}`);
    setTimeout(() => prepare(attempt + 1), Math.min(30000, 2000 * attempt)).unref();
  }
}

app.listen(config.port, () => {
  log(`listening on ${config.port}; email ${config.smtp ? 'on' : 'OFF'}; brevo ${config.brevo ? 'on' : 'off'}; admin ${config.adminToken ? 'on' : 'OFF (set ADMIN_TOKEN)'}`);
  if (!config.tokenSecret) log('TOKEN_SECRET is not set: unsubscribe links are not safe until it is');
  prepare();
});
