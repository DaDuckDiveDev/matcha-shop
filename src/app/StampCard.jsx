import { motion, useReducedMotion } from 'motion/react';
import { Mark } from '../components/Logo.jsx';
import { useLang } from '../lib/LangContext.jsx';

// Ten hanko stamps; each one lands with a little thump.
export default function StampCard({ stamps, compact = false }) {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const rot = [-3, 2, -1, 4, -2, 1, 3, -2, 2, -1];
  return (
    <div className="stack" style={{ gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div className="card__title">{t('app.stampCard')} <span className="jp" style={{ fontSize: 14, color: 'var(--uji)', marginLeft: 4 }}>判子</span></div>
        <div className="card__kicker tnum">{Math.min(stamps, 10)} {t('app.of')} 10</div>
      </div>
      <div className="stamps">
        {Array.from({ length: 10 }).map((_, i) => {
          const on = i < stamps;
          const last = i === 9;
          return on ? (
            <motion.div
              key={i}
              className="stamp stamp--on"
              style={{ rotate: rot[i] }}
              initial={reduce ? false : { scale: 1.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 420, damping: 22, delay: i * 0.04 }}
            >
              <Mark cream size={30} />
            </motion.div>
          ) : (
            <div key={i} className={`stamp ${last ? 'stamp--free' : ''}`}>{last && <span className="jp">薄茶</span>}</div>
          );
        })}
      </div>
      {!compact && (
        <p className="row__note">{stamps >= 10 ? t('app.stampsFull') : t('app.stampsLeft', 10 - stamps)} {stamps < 10 && t('app.showAtCounter')}</p>
      )}
    </div>
  );
}
