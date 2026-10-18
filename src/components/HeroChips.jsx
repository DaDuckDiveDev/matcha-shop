import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useLang } from '../lib/LangContext.jsx';
import { currentSekki } from '../data/sekki.js';

// Small live details around the hero: the time in Belgrade and in Kyoto,
// glass chips with today's season and the days to opening, and the proof
// row under the buttons. Everything here is true today; nothing is staged.
export const OPENING = new Date(2027, 2, 20); // Saturday 20 March 2027, the spring equinox

export function useNow(every = 30000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), every);
    return () => clearInterval(id);
  }, [every]);
  return now;
}

function timeIn(zone, now) {
  try {
    return new Intl.DateTimeFormat('en-GB', { timeZone: zone, hour: '2-digit', minute: '2-digit', hour12: false }).format(now);
  } catch {
    return '';
  }
}

export function Clocks({ className = '' }) {
  const { t } = useLang();
  const now = useNow();
  const bg = timeIn('Europe/Belgrade', now);
  const ky = timeIn('Asia/Tokyo', now);
  if (!bg || !ky) return null;
  return (
    <div className={`clocks ${className}`}>
      <span>{t('hero.clockBg')} <b className="tnum">{bg}</b></span>
      <span className="clocks__sep" aria-hidden="true">·</span>
      <span>{t('hero.clockKy')} <b className="tnum">{ky}</b></span>
    </div>
  );
}

function daysToOpening(now) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((OPENING - today) / 86400000);
}

export function OpeningChip({ className = '' }) {
  const { t } = useLang();
  const now = useNow(60000);
  const days = daysToOpening(now);
  const text = days > 0 ? t('hero.chipOpening', days) : days === 0 ? t('hero.chipOpenToday') : t('hero.chipOpen');
  return (
    <div className={`chip-float glass glass--sm ${className}`}>
      <span className="chip-float__dot" aria-hidden="true" />
      <span className="chip-float__text">{text}</span>
    </div>
  );
}

function Float({ children, delay = 0, drift = 6, className = '' }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: [0, -drift, 0] }}
      transition={{ opacity: { duration: 0.8, delay: 1.1 + delay }, y: { duration: 7 + delay * 2, repeat: Infinity, ease: 'easeInOut', delay: 1.1 + delay } }}
    >
      {children}
    </motion.div>
  );
}

export default function HeroChips() {
  const { t, lang } = useLang();
  const s = currentSekki();
  const special = s.special ? (lang === 'sr' ? s.special.sr : s.special.en) : t('season.fallback');
  return (
    <div className="hero-chips" aria-hidden="true">
      <Float className="hero-chip hero-chip--season" delay={0}>
        <div className="chip-float glass glass--sm">
          <span className="chip-float__kanji jp">{s.kanji}</span>
          <span className="chip-float__stack">
            <b>{s.romaji} · {t('hero.chipSeason')}</b>
            <span>{special}</span>
          </span>
        </div>
      </Float>
      <Float className="hero-chip hero-chip--opening" delay={0.35} drift={5}>
        <OpeningChip />
      </Float>
      <Float className="hero-chip hero-chip--usucha" delay={0.7} drift={7}>
        <div className="chip-float glass glass--sm">
          <span className="chip-float__kanji jp">薄</span>
          <span className="chip-float__text tnum">{t('hero.chipUsucha')}</span>
        </div>
      </Float>
      <Float className="hero-chip hero-chip--origin" delay={1.05} drift={4}>
        <div className="chip-float glass glass--sm">
          <span className="chip-float__kanji jp">宇治</span>
          <span className="chip-float__text">{t('hero.chipOrigin')}</span>
        </div>
      </Float>
    </div>
  );
}

export function Proof() {
  const { t } = useLang();
  return (
    <ul className="proof">
      {t('hero.proof').map(([jp, label]) => (
        <li key={jp}><span className="jp">{jp}</span>{label}</li>
      ))}
    </ul>
  );
}
