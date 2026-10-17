import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from 'motion/react';
import View from './View.jsx';
import { useLang } from '../lib/LangContext.jsx';
import { store, useStore } from '../lib/store.js';
import { defaultChoice, findItem, fmtRsd, unitPrice } from '../data/menu.js';
import { alt, src } from '../data/images.js';
import { IconBack } from '../components/Icons.jsx';

function Pills({ group, options, value, onChange, lang }) {
  const cols = options.length >= 3 ? 'pills--3' : 'pills--2';
  return (
    <div className={`pills ${cols}`} role="radiogroup">
      {options.map((o) => {
        const on = o.id === value;
        return (
          <button key={o.id} type="button" role="radio" aria-checked={on} className={`pill ${on ? 'is-on' : ''}`} onClick={() => onChange(o.id)}>
            {on && <motion.span layoutId={`pill-${group}`} className="pill__bg" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
            <span className="pill__label">{o[lang] ?? o.en}{o.add ? ` +${o.add}` : ''}</span>
          </button>
        );
      })}
    </div>
  );
}

function Price({ value }) {
  const mv = useMotionValue(value);
  const [shown, setShown] = useState(value);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) { setShown(value); return; }
    const c = animate(mv, value, { duration: 0.45, ease: [0.2, 0.7, 0.2, 1], onUpdate: (v) => setShown(Math.round(v)) });
    return () => c.stop();
  }, [value, mv, reduce]);
  return <span className="price tnum">{fmtRsd(shown)} RSD</span>;
}

export default function Customize() {
  const { id } = useParams();
  const { t, lang, pick } = useLang();
  const { cart } = useStore();
  const navigate = useNavigate();
  const item = findItem(id);
  const [choice, setChoice] = useState(() => (item ? defaultChoice(item) : {}));
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(0);

  if (!item) {
    return (
      <View title={t('app.menuTitle')}>
        <p className="body">{t('app.empty')}</p>
        <Link to="/app/order" className="btn btn--primary">{t('app.browse')}</Link>
      </View>
    );
  }

  const options = item.options || {};
  const total = unitPrice(item, choice) * qty;
  const count = cart.reduce((n, c) => n + c.qty, 0);
  const labels = { temp: t('app.temp'), milk: t('app.milk'), size: t('app.size'), strength: t('app.strength') };

  const add = () => {
    store.addToCart(item.id, choice, qty);
    setAdded((n) => n + qty);
  };

  return (
    <View title={pick(item.name)}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button type="button" className="icon-btn" aria-label={t('common.back')} onClick={() => navigate(-1)}><IconBack /></button>
        <span className="card__kicker">{t('app.customise')}</span>
        <span style={{ width: 44 }} />
      </div>

      <section className="glass card" style={{ padding: 0, overflow: 'hidden' }}>
        <img src={src(item.img, 1000)} alt={alt(item.img)} style={{ width: '100%', aspectRatio: '16 / 10', objectFit: 'cover', filter: 'saturate(0.9)' }} />
        <div className="stack" style={{ padding: '16px 18px 18px', gap: 6 }}>
          <div className="row__name"><b style={{ fontSize: 26 }}>{pick(item.name)}</b>{item.jp && <span className="jp">{item.jp}</span>}</div>
          <div className="row__note">{pick(item.note)}</div>
          {item.spec && <div className="row__spec">{item.spec}</div>}
        </div>
      </section>

      {Object.entries(options).map(([group, list]) => (
        <section key={group} className="stack" style={{ gap: 8 }}>
          <div className="card__kicker">{labels[group] ?? group}</div>
          <Pills group={group} options={list} value={choice[group]} onChange={(v) => setChoice((c) => ({ ...c, [group]: v }))} lang={lang} />
        </section>
      ))}

      <section style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="card__kicker">{t('app.quantity')}</div>
        <div className="stepper">
          <button type="button" aria-label="−" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
          <span>{qty}</span>
          <button type="button" aria-label="+" onClick={() => setQty((q) => Math.min(9, q + 1))}>+</button>
        </div>
      </section>

      <AnimatePresence>
        {added > 0 && (
          <motion.div className="glass glass--sm notice" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ background: 'rgba(227, 231, 207, 0.75)' }}>
            {t('app.added')} {t('app.inYourOrder', count)} <Link to="/app/cart" style={{ fontWeight: 500 }}>{t('app.viewOrder')} →</Link>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="sticky-cta glass glass--sm">
        <motion.button type="button" className="btn btn--primary btn--block" whileTap={{ scale: 0.98 }} onClick={add}>
          <span>{t('app.addToOrder')}</span>
          <Price value={total} />
        </motion.button>
        <div className="caption" style={{ textAlign: 'center', textTransform: 'none', letterSpacing: '0.04em' }}>{t('app.payNote')}</div>
      </div>
    </View>
  );
}
