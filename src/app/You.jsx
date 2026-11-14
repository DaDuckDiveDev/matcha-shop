import { useNavigate } from 'react-router-dom';
import View from './View.jsx';
import { useLang } from '../lib/LangContext.jsx';
import { store, useStore } from '../lib/store.js';
import { TIERS, standing } from '../data/loyalty.js';
import { findItem, fmtRsd } from '../data/menu.js';

// The guest's own page: who they are here, where they stand, what they ordered.
// All of it is read from the phone; nothing is fetched.
export default function You() {
  const { lang, pick } = useLang();
  const { name, stamps, points, lifetime, orders, reservations } = useStore();
  const navigate = useNavigate();
  const { tier } = standing(lifetime);
  const locale = lang === 'sr' ? 'sr-Latn-RS' : 'en-GB';
  const n = (v) => v.toLocaleString(locale);
  const day = (at) => new Date(at).toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  const drinks = orders.reduce((sum, o) => sum + o.items.reduce((k, i) => k + i.qty, 0), 0);

  const again = (o) => {
    o.items.forEach((i) => { if (findItem(i.itemId)) store.addToCart(i.itemId, i.choice, i.qty); });
    navigate('/app/cart');
  };

  const tiles = [
    [n(points), pick({ en: 'Points to use', sr: 'Poena za korišćenje' })],
    [n(lifetime), pick({ en: 'Points earned', sr: 'Ukupno zarađeno' })],
    [`${Math.min(stamps, 10)}/10`, pick({ en: 'Stamps', sr: 'Pečata' })],
    [n(drinks), pick({ en: 'Items ordered here', sr: 'Naručeno ovde' })]
  ];

  return (
    <View title={pick({ en: 'You', sr: 'Ti' })}>
      <div className="app-head">
        <div>
          <h1 className="app-head__title">{name || pick({ en: 'You', sr: 'Ti' })}</h1>
          <div className="app-head__meta">{pick(tier.name)} <span className="jp" lang="ja" style={{ color: 'var(--uji)' }}>{tier.jp}</span> · {pick({ en: 'kept on this phone', sr: 'čuva se na ovom telefonu' })}</div>
        </div>
      </div>

      <section className="glass card">
        <label className="field">
          <span className="card__kicker">{pick({ en: 'The name we call at the counter', sr: 'Ime koje prozivamo na šanku' })}</span>
          <input className="input" type="text" autoComplete="given-name" maxLength={40} value={name} onChange={(e) => store.setName(e.target.value)} />
        </label>
      </section>

      <dl className="tiles">
        {tiles.map(([v, k]) => <div key={k} className="glass tile"><dd className="tnum">{v}</dd><dt>{k}</dt></div>)}
      </dl>

      <section className="glass card">
        <div className="card__title">{pick({ en: 'Tiers', sr: 'Nivoi' })}</div>
        <ol className="tiers">
          {TIERS.map((x) => {
            const reached = lifetime >= x.from;
            return (
              <li key={x.id} className={`tiers__row ${x.id === tier.id ? 'is-now' : ''} ${reached ? 'is-reached' : ''}`}>
                <span className="tiers__mark jp" lang="ja" aria-hidden="true">{x.jp}</span>
                <span className="tiers__body">
                  <span className="tiers__name">{pick(x.name)}{x.id === tier.id ? ` · ${pick({ en: 'you are here', sr: 'ovde si' })}` : ''}</span>
                  <span className="card__meta">{pick(x.perk)}</span>
                </span>
                <span className="card__kicker tnum">{x.from === 0 ? pick({ en: 'from the start', sr: 'od početka' }) : n(x.from)}</span>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="glass card">
        <div className="card__title">{pick({ en: 'Orders', sr: 'Porudžbine' })}</div>
        {orders.length === 0 ? (
          <p className="card__meta">{pick({ en: 'Nothing ordered from this phone yet.', sr: 'Sa ovog telefona još ništa nije naručeno.' })}</p>
        ) : (
          <ul className="ledger">
            {orders.slice(0, 6).map((o) => (
              <li key={`${o.id}-${o.at}`}>
                <span className="card__kicker tnum">{day(o.at)}</span>
                <span className="ledger__what">{o.items.map((i) => { const it = findItem(i.itemId); return `${i.qty > 1 ? `${i.qty} × ` : ''}${it ? pick(it.name) : i.itemId}`; }).join(', ')}<span className="card__meta"> · {fmtRsd(o.total)} RSD</span></span>
                <button type="button" className="textlink small" onClick={() => again(o)}>{pick({ en: 'Again', sr: 'Ponovi' })}</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {reservations.length > 0 && (
        <section className="glass card">
          <div className="card__title">{pick({ en: 'Reservations', sr: 'Rezervacije' })}</div>
          <ul className="ledger">
            {reservations.slice(0, 5).map((r, i) => (
              <li key={i}>
                <span className="card__kicker tnum">{r.date || ''}</span>
                <span className="ledger__what">{r.time || ''}{r.guests ? ` · ${r.guests}` : ''}</span>
                <span />
              </li>
            ))}
          </ul>
        </section>
      )}
    </View>
  );
}
