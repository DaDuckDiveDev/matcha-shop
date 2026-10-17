import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import View from './View.jsx';
import { useLang } from '../lib/LangContext.jsx';
import { store, useStore } from '../lib/store.js';
import { findItem, fmtRsd, unitPrice } from '../data/menu.js';
import { alt, src } from '../data/images.js';

function pickupSlots() {
  const now = new Date();
  const slot = (mins) => {
    const d = new Date(now.getTime() + mins * 60000);
    d.setMinutes(Math.ceil(d.getMinutes() / 5) * 5, 0, 0);
    return d.toTimeString().slice(0, 5);
  };
  return [{ id: 'now', label: null }, { id: 't15', label: slot(15) }, { id: 't30', label: slot(30) }];
}

export default function Cart() {
  const { t, lang, pick } = useLang();
  const { cart, name } = useStore();
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('now');
  const [guest, setGuest] = useState(name);
  const slots = pickupSlots();
  const lines = cart.map((c) => ({ ...c, item: findItem(c.itemId) })).filter((c) => c.item);
  const total = lines.reduce((n, l) => n + unitPrice(l.item, l.choice) * l.qty, 0);

  const describe = (l) =>
    Object.entries(l.choice || {})
      .map(([g, v]) => { const o = (l.item.options?.[g] || []).find((x) => x.id === v); return o ? (o[lang] ?? o.en) : null; })
      .filter(Boolean)
      .join(' · ');

  const confirm = () => {
    const id = 'M' + String(Math.floor(100 + Math.random() * 900));
    const slot = slots.find((s) => s.id === pickup);
    store.setName(guest.trim());
    store.placeOrder({ id, items: lines.map(({ itemId, choice, qty }) => ({ itemId, choice, qty })), total, at: Date.now(), pickup: slot?.label || 'now' });
    navigate(`/app/status/${id}`);
  };

  return (
    <View title={t('app.cart')}>
      <div className="app-head">
        <div>
          <h1 className="app-head__title">{t('app.cart')}</h1>
        </div>
      </div>

      {lines.length === 0 ? (
        <section className="glass card" style={{ alignItems: 'flex-start' }}>
          <p className="body">{t('app.empty')}</p>
          <Link to="/app/order" className="btn btn--primary">{t('app.browse')}</Link>
        </section>
      ) : (
        <>
          <section className="glass card" style={{ paddingTop: 6, paddingBottom: 6 }}>
            <div className="lines-list">
              <AnimatePresence initial={false}>
                {lines.map((l) => (
                  <motion.div key={l.key} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }} className="card--row" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0' }}>
                    <img className="card__img" src={src(l.item.img, 240)} alt={alt(l.item.img)} />
                    <div className="card__body">
                      <div className="card__title">{l.qty > 1 ? `${l.qty} × ` : ''}{pick(l.item.name)}</div>
                      {describe(l) && <div className="card__meta">{describe(l)}</div>}
                      <button type="button" className="textlink" style={{ minHeight: 32, fontSize: 10 }} onClick={() => store.removeFromCart(l.key)}>{t('app.remove')}</button>
                    </div>
                    <div className="row__price tnum">{fmtRsd(unitPrice(l.item, l.choice) * l.qty)}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          <section className="stack" style={{ gap: 8 }}>
            <div className="card__kicker">{t('app.pickup')}</div>
            <div className="pills pills--3" role="radiogroup">
              {slots.map((s) => (
                <button key={s.id} type="button" role="radio" aria-checked={pickup === s.id} className={`pill ${pickup === s.id ? 'is-on' : ''}`} onClick={() => setPickup(s.id)}>
                  {pickup === s.id && <motion.span layoutId="pill-pickup" className="pill__bg" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
                  <span className="pill__label tnum">{s.label ?? t('app.pickupNow')}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="field">
            <label htmlFor="guest-name">{t('app.name')}</label>
            <input id="guest-name" value={guest} onChange={(e) => setGuest(e.target.value)} placeholder={t('app.namePlaceholder')} autoComplete="given-name" />
          </section>

          <div className="sticky-cta glass glass--sm">
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 6px' }}>
              <span className="card__kicker">{t('app.total')}</span>
              <span className="price tnum" style={{ fontSize: 20 }}>{fmtRsd(total)} RSD</span>
            </div>
            <motion.button type="button" className="btn btn--primary btn--block" whileTap={{ scale: 0.98 }} onClick={confirm}>
              <span>{t('app.confirm')}</span><span className="price">→</span>
            </motion.button>
            <div className="caption" style={{ textAlign: 'center', textTransform: 'none', letterSpacing: '0.04em' }}>{t('app.payNote')}</div>
          </div>
        </>
      )}
    </View>
  );
}
