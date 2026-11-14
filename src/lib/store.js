// Guest state, kept on the phone. Cart, stamps, points, order history and the
// reservation requests live here until a backend exists. Everything is
// wrapped in try/catch so a blocked localStorage never breaks the UI.
import { useCallback, useEffect, useState } from 'react';
import { pointsFor } from '../data/loyalty.js';

const KEY = 'machiko.guest.v1';

const initial = {
  name: '',
  stamps: 6,
  points: 0,      // what can be spent
  lifetime: 0,    // everything ever earned; sets the tier
  ledger: [],     // [{ id, at, kind: 'order' | 'reward', pts, ref }]
  cart: [], // [{ key, itemId, choice, qty }]
  orders: [], // [{ id, items, total, at, pickup }]
  reservations: [],
  lastOrder: null
};

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    return { ...initial, ...JSON.parse(raw) };
  } catch {
    return initial;
  }
}

function save(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

const listeners = new Set();
let state = load();

function setState(patch) {
  state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) };
  save(state);
  listeners.forEach((l) => l(state));
}

export function useStore() {
  const [s, setS] = useState(state);
  useEffect(() => {
    listeners.add(setS);
    return () => listeners.delete(setS);
  }, []);
  return s;
}

export const store = {
  setName: (name) => setState({ name }),
  addToCart: (itemId, choice, qty = 1) =>
    setState((s) => {
      const key = itemId + ':' + JSON.stringify(choice);
      const found = s.cart.find((c) => c.key === key);
      const cart = found
        ? s.cart.map((c) => (c.key === key ? { ...c, qty: c.qty + qty } : c))
        : [...s.cart, { key, itemId, choice, qty }];
      return { cart };
    }),
  removeFromCart: (key) => setState((s) => ({ cart: s.cart.filter((c) => c.key !== key) })),
  clearCart: () => setState({ cart: [] }),
  placeOrder: (order) =>
    setState((s) => {
      const pts = pointsFor(order.total);
      return {
        cart: [],
        orders: [{ ...order, pts }, ...s.orders].slice(0, 20),
        lastOrder: order,
        stamps: Math.min(10, s.stamps + order.items.reduce((n, i) => n + i.qty, 0)),
        points: s.points + pts,
        lifetime: s.lifetime + pts,
        ledger: [{ id: `o-${order.id}-${order.at}`, at: order.at, kind: 'order', pts, ref: order.id }, ...s.ledger].slice(0, 60)
      };
    }),
  // Spend points on a reward. Returns nothing; the view reads the new balance.
  redeemReward: (reward) =>
    setState((s) => {
      if (s.points < reward.cost) return {};
      const at = Date.now();
      return { points: s.points - reward.cost, ledger: [{ id: `r-${reward.id}-${at}`, at, kind: 'reward', pts: -reward.cost, ref: reward.id }, ...s.ledger].slice(0, 60) };
    }),
  // Preview only: a pretend purchase, so the points can be tried before opening day.
  demoPurchase: (total = 1040) =>
    setState((s) => {
      const at = Date.now();
      const pts = pointsFor(total);
      return { points: s.points + pts, lifetime: s.lifetime + pts, ledger: [{ id: `d-${at}`, at, kind: 'order', pts, ref: 'demo' }, ...s.ledger].slice(0, 60) };
    }),
  addStamp: () => setState((s) => ({ stamps: Math.min(10, s.stamps + 1) })),
  redeem: () => setState((s) => ({ stamps: s.stamps >= 10 ? 0 : s.stamps })),
  addReservation: (r) => setState((s) => ({ reservations: [r, ...s.reservations].slice(0, 20) }))
};

// Optional: forward reservation requests to a webhook (Make.com, a Google
// Sheet, your own API). Set VITE_RESERVE_WEBHOOK in .env to enable.
// A reservation request goes to the shop's API when there is one, otherwise
// to the webhook in VITE_RESERVE_WEBHOOK, otherwise it stays on the phone.
export async function sendReservation(payload) {
  const api = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  const url = api ? `${api}/api/reservations` : import.meta.env.VITE_RESERVE_WEBHOOK;
  if (!url) return { sent: false };
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    return { sent: res.ok };
  } catch {
    return { sent: false };
  }
}

export const useInstallPrompt = () => {
  const [evt, setEvt] = useState(null);
  const [installed, setInstalled] = useState(() => window.matchMedia?.('(display-mode: standalone)').matches ?? false);
  useEffect(() => {
    const onPrompt = (e) => { e.preventDefault(); setEvt(e); };
    const onInstalled = () => { setInstalled(true); setEvt(null); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);
  const install = useCallback(async () => {
    if (!evt) return;
    evt.prompt();
    await evt.userChoice;
    setEvt(null);
  }, [evt]);
  return { canInstall: !!evt, installed, install };
};
