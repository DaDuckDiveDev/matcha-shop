import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useLang } from '../lib/LangContext.jsx';
import Photo from './Photo.jsx';

// 道 From field to bowl: six photographs in a row. On a wide screen the page
// holds still while the row slides past; on a phone it is a row you swipe.
const PHOTOS = ['teaRows', 'teaMist', 'powderTray', 'scoop', 'whiskClose', 'steamBowl'];

function useWide() {
  const q = '(min-width: 1024px)';
  const [on, setOn] = useState(() => (typeof window !== 'undefined' ? window.matchMedia(q).matches : false));
  useEffect(() => {
    const m = window.matchMedia(q);
    const f = () => setOn(m.matches);
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  return on;
}

function Panel({ step, i, pinned }) {
  const [jp, , title, body] = step;
  return (
    <article className="way__panel">
      <Photo k={PHOTOS[i]} sizes={pinned ? '30vw' : '80vw'} />
      <div className="stack" style={{ gap: 6 }}>
        <span className="way__num">{i + 1} / 6</span>
        <h3 className="way__step"><span className="jp" lang="ja" aria-hidden="true">{jp}</span>{title}</h3>
        <p className="way__body">{body}</p>
      </div>
    </article>
  );
}

export default function WayGallery() {
  const { t } = useLang();
  const steps = t('way.steps');
  const wide = useWide();
  const reduce = useReducedMotion();
  const section = useRef(null);
  const track = useRef(null);
  const distance = useRef(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, (v) => -v * distance.current);

  useLayoutEffect(() => {
    if (!wide) return undefined;
    const measure = () => { if (track.current) distance.current = Math.max(0, track.current.scrollWidth - window.innerWidth); };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [wide, steps.length]);

  if (!wide || reduce) {
    return (
      <section ref={section} className="way way--swipe section section--tight">
        <div className="wrap way__head"><h2 className="d2">{t('way.title')}</h2></div>
        <div className="way__track" tabIndex={0} role="group" aria-label={t('way.title')}>
          {steps.map((s, i) => <Panel key={s[0]} step={s} i={i} />)}
        </div>
      </section>
    );
  }
  return (
    <section ref={section} className="way way--pinned" style={{ height: `${steps.length * 55 + 60}vh` }}>
      <div className="way__sticky">
        <div className="wrap way__head">
          <h2 className="d2" style={{ maxWidth: '16em' }}>{t('way.title')}</h2>
          <div className="way__bar" aria-hidden="true"><motion.span style={{ scaleX: scrollYProgress }} /></div>
        </div>
        <motion.div ref={track} className="way__track" style={{ x }}>
          {steps.map((s, i) => <Panel key={s[0]} step={s} i={i} pinned />)}
        </motion.div>
      </div>
    </section>
  );
}
