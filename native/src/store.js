// Guest state, kept on the phone with AsyncStorage: the same shape as the web
// app's store, so the two can meet in one account later.
import { useSyncExternalStore } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { pointsFor } from './shared/loyalty';
import { findItem, defaultChoice, unitPrice } from './shared/menu';

const KEY = 'machiko.guest.v1';
const initial = { ready: false, lang: 'en', name: '', stamps: 0, points: 0, lifetime: 0, ledger: [], cart: [], orders: [], lastOrder: null };

let state = initial;
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());

function set(patch) {
  state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) };
  const { ready, ...keep } = state;
  AsyncStorage.setItem(KEY, JSON.stringify(keep)).catch(() => {});
  emit();
}

export async function hydrate() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    state = { ...initial, ...(raw ? JSON.parse(raw) : {}), ready: true };
  } catch {
    state = { ...initial, ready: true };
  }
  emit();
}

export function useStore() {
  return useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => state, () => state);
}

export const cartLines = (cart) => cart.map((c) => ({ ...c, item: findItem(c.itemId) })).filter((l) => l.item);
export const cartTotal = (cart) => cartLines(cart).reduce((n, l) => n + unitPrice(l.item, l.choice) * l.qty, 0);

export const store = {
  setLang: (lang) => set({ lang }),
  setName: (name) => set({ name }),
  add: (itemId) => set((s) => {
    const item = findItem(itemId);
    if (!item) return {};
    const found = s.cart.find((c) => c.itemId === itemId);
    return { cart: found ? s.cart.map((c) => (c.itemId === itemId ? { ...c, qty: c.qty + 1 } : c)) : [...s.cart, { itemId, choice: defaultChoice(item), qty: 1 }] };
  }),
  remove: (itemId) => set((s) => ({ cart: s.cart.flatMap((c) => (c.itemId !== itemId ? [c] : c.qty > 1 ? [{ ...c, qty: c.qty - 1 }] : [])) })),
  placeOrder: (pickup) => {
    const total = cartTotal(state.cart);
    if (!total) return null;
    const at = Date.now();
    const order = { id: 'M' + String(Math.floor(100 + Math.random() * 900)), items: state.cart, total, at, pickup, pts: pointsFor(total) };
    set((s) => ({
      cart: [], lastOrder: order, orders: [order, ...s.orders].slice(0, 20),
      stamps: Math.min(10, s.stamps + order.items.reduce((n, i) => n + i.qty, 0)),
      points: s.points + order.pts, lifetime: s.lifetime + order.pts,
      ledger: [{ id: `o-${order.id}-${at}`, at, kind: 'order', pts: order.pts, ref: order.id }, ...s.ledger].slice(0, 60)
    }));
    return order;
  },
  redeemReward: (reward) => set((s) => {
    if (s.points < reward.cost) return {};
    const at = Date.now();
    return { points: s.points - reward.cost, ledger: [{ id: `r-${reward.id}-${at}`, at, kind: 'reward', pts: -reward.cost, ref: reward.id }, ...s.ledger].slice(0, 60) };
  }),
  redeemStamps: () => set((s) => ({ stamps: s.stamps >= 10 ? 0 : s.stamps }))
};
