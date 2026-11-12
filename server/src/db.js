import mysql from 'mysql2/promise';

// The tables. Run at every start; each statement is safe to repeat.
const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS customers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(254) NOT NULL,
    first_name VARCHAR(80) NOT NULL DEFAULT '',
    phone VARCHAR(24) NOT NULL DEFAULT '',
    lang CHAR(2) NOT NULL DEFAULT 'sr',
    source VARCHAR(30) NOT NULL DEFAULT 'website',
    email_opt_in TINYINT(1) NOT NULL DEFAULT 0,
    sms_opt_in TINYINT(1) NOT NULL DEFAULT 0,
    confirm_hash CHAR(64) NULL,
    confirm_sent_at DATETIME NULL,
    confirmed_at DATETIME NULL,
    unsubscribed_at DATETIME NULL,
    brevo_synced_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_email (email),
    KEY idx_confirm (confirm_hash)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  // One line for every time somebody gave, confirmed or withdrew a consent:
  // the record you show if anyone asks "when did I agree to this?".
  `CREATE TABLE IF NOT EXISTS consent_log (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT UNSIGNED NOT NULL,
    channel ENUM('email','sms') NOT NULL,
    action ENUM('granted','confirmed','withdrawn') NOT NULL,
    wording_version VARCHAR(16) NOT NULL,
    lang CHAR(2) NOT NULL,
    source VARCHAR(30) NOT NULL,
    ip_hash CHAR(64) NOT NULL DEFAULT '',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_customer (customer_id),
    CONSTRAINT fk_consent_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS reservations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    kind VARCHAR(20) NOT NULL,
    on_date DATE NOT NULL,
    at_time TIME NOT NULL,
    guests TINYINT UNSIGNED NOT NULL,
    name VARCHAR(80) NOT NULL,
    contact VARCHAR(120) NOT NULL DEFAULT '',
    note VARCHAR(500) NOT NULL DEFAULT '',
    lang CHAR(2) NOT NULL DEFAULT 'sr',
    status ENUM('new','confirmed','declined','cancelled') NOT NULL DEFAULT 'new',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_date (on_date)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
];

export function createPool(db) {
  const common = { waitForConnections: true, connectionLimit: 5, charset: 'utf8mb4', timezone: 'Z', dateStrings: true };
  return typeof db === 'string' ? mysql.createPool({ uri: db, ...common }) : mysql.createPool({ ...db, ...common });
}

export async function migrate(pool) {
  for (const sql of SCHEMA) await pool.query(sql);
}
