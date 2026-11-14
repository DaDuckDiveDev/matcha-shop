// Points, tiers and rewards. Like the prices, the numbers here are
// illustrative until the shop sets them: change them in this one file.
//
// A guest earns one point for every 10 RSD on an order. Stamps stay as they
// are (ten drinks, one usucha); points sit beside them and buy the rewards
// below. The tier follows everything a guest has ever earned, so spending
// points never moves anyone down.
export const RSD_PER_POINT = 10;
export const pointsFor = (totalRsd) => Math.max(0, Math.floor(totalRsd / RSD_PER_POINT));

export const TIERS = [
  { id: 'usucha', jp: '薄茶', from: 0, name: { en: 'Usucha', sr: 'Usucha' }, perk: { en: 'A stamp and points with every order.', sr: 'Pečat i poeni uz svaku porudžbinu.' } },
  { id: 'koicha', jp: '濃茶', from: 2000, name: { en: 'Koicha', sr: 'Koicha' }, perk: { en: 'The first bowls from each new tin, a day before the menu.', sr: 'Prve činije iz svake nove limenke, dan pre menija.' } },
  { id: 'chajin', jp: '茶人', from: 6000, name: { en: 'Chajin', sr: 'Chajin' }, perk: { en: 'A workshop seat held for you until the day before.', sr: 'Mesto na radionici čuvamo za tebe do dan ranije.' } }
];

export const REWARDS = [
  { id: 'upgrade', cost: 150, name: { en: 'A larger cup or coconut milk', sr: 'Veća šolja ili kokosovo mleko' } },
  { id: 'mochi', cost: 400, name: { en: 'Mochi of the morning', sr: 'Jutarnji moči' } },
  { id: 'usucha', cost: 600, name: { en: 'A bowl of usucha', sr: 'Činija usuche' } },
  { id: 'workshop', cost: 3000, name: { en: 'A seat at a workshop', sr: 'Mesto na radionici' } },
  { id: 'tin', cost: 4500, name: { en: 'A 40 g tin of ceremonial matcha', sr: 'Limenka ceremonijalne matche, 40 g' } }
];

// Where a guest stands: the tier, the next one, and how far along (0 to 1).
export function standing(lifetime = 0) {
  let i = 0;
  TIERS.forEach((t, n) => { if (lifetime >= t.from) i = n; });
  const tier = TIERS[i];
  const next = TIERS[i + 1] || null;
  const progress = next ? Math.min(1, (lifetime - tier.from) / (next.from - tier.from)) : 1;
  return { tier, next, progress, toNext: next ? next.from - lifetime : 0 };
}
