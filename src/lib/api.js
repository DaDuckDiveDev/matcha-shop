// The shop's own API (the server/ folder, running as a Node.js project on
// SiteGround). Empty until VITE_API_URL is set at build time; the site then
// falls back to what it did before (a Brevo form, or saying so honestly).
export const API = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export async function postJson(path, body) {
  const res = await fetch(`${API}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok && data.ok !== false, status: res.status, ...data };
}
