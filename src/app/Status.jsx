import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import View from './View.jsx';
import { useLang } from '../lib/LangContext.jsx';
import { useStore } from '../lib/store.js';
import { findItem, fmtRsd } from '../data/menu.js';

// Order status: received → whisking → ready. Timing is simulated from the
// order time until a point-of-sale system drives it.
const STAGES = ['received', 'whisking', 'ready'];
const AT = [0, 20, 60]; // seconds after ordering

function Chasen({ active }) {
  const reduce = useReducedMotion();
  return (
    <motion.svg className="chasen" viewBox="0 0 120 120" aria-hidden="true" animate={active && !reduce ? { rotate: [0, -8, 8, -6, 6, 0] } : { rotate: 0 }} transition={{ duration: 1.6, repeat: active ? Infinity : 0, ease: 'easeInOut' }} style={{ transformOrigin: '60px 14px' }}>
      <rect x="55" y="6" width="10" height="34" rx="4" fill="#3E5A33" />
      {Array.from({ length: 13 }).map((_, i) => {
        const x = 60 + (i - 6) * 7;
        const bend = (i - 6) * 2.2;
        return <path key={i} d={`M60 40 C ${60 + bend} 60, ${x} 80, ${x} 108`} fill="none" stroke="#3E5A33" strokeWidth="2" strokeLinecap="round" />;
      })}
      <ellipse cx="60" cy="110" rx="46" ry="6" fill="none" stroke="#7FA052" strokeWidth="1.5" />
    </motion.svg>
  );
}

export default function Status() {
  const { id } = useParams();
  const { t, pick } = useLang();
  const { orders } = useStore();
  const order = orders.find((o) => o.id === id) || orders[0];
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!order) return;
    const tick = () => setElapsed((Date.now() - order.at) / 1000);
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, [order]);

  if (!order) {
    return (
      <View title={t('app.order')}>
        <p className="body">{t('app.empty')}</p>
        <Link to="/app/order" className="btn btn--primary">{t('app.browse')}</Link>
      </View>
    );
  }

  const stage = elapsed >= AT[2] ? 2 : elapsed >= AT[1] ? 1 : 0;

  return (
    <View title={`${t('app.orderNumber')} ${order.id}`}>
      <section className="glass card ticket">
        <div className="card__kicker">{t('app.orderNumber')}</div>
        <div className="ticket__num">{order.id}</div>
        <div className="card__meta">{order.items.map((i) => `${i.qty} × ${pick(findItem(i.itemId)?.name)}`).join(' · ')} · {fmtRsd(order.total)} RSD</div>
        <Chasen active={stage === 1} />
        <div className="jp" style={{ fontSize: 22, color: 'var(--uji)' }}>{t(`app.statusJp.${STAGES[stage]}`)}</div>
      </section>

      <section className="glass card">
        <div className="status-steps">
          {STAGES.map((s, i) => (
            <div key={s} className={`status-step ${i < stage ? 'is-done' : ''} ${i === stage ? 'is-now' : ''}`}>
              <div className="status-step__dot">{i < stage ? '✓' : t(`app.statusJp.${s}`)}</div>
              <div>
                <div className="status-step__title">{t(`app.status.${s}`)}</div>
                <div className="status-step__body">{t(`app.statusBody.${s}`)}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Link to="/app/order" className="btn btn--ghost">{t('app.newOrder')}</Link>
    </View>
  );
}
