import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useLang } from '../lib/LangContext.jsx';
import { alt, src, srcSet } from '../data/images.js';

// 道 The way, from field to bowl: six photographs in a row. On a desktop the
// page holds still and the row slides sideways as you scroll; on a phone it
// is a row you swipe.
const PHOTOS = ['teaRows', 'teaMist', 'powderSpoon', 'scoop', 'whiskClose', 'foamBowl'];
const pad = (n) => String(n).padStart(2, '0');

function useDesktop() {
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

function Panel({ step, i, total }) {
  const [jp, romaji, title, body] = step;
  const key = PHOTOS[i];
  return (
    <article className="way__panel">
      <img className="way__img" src={src(key, 1200)} srcSet={srcSet(key)} sizes="(min-width: 1024px) 34vw, 82vw" alt={alt(key)} loading="lazy" decoding="async" />
      <div className="way__card glass glass--sm">
        <div className="way__meta">
          <span className="way__num tnum">{pad(i + 1)} / {pad(total)}</span>
          <span className="way__romaji">{romaji}</span>
        </div>
        <div className="way__title"><span className="way__kanji jp">{jp}</span><h3 className="h3">{title}</h3></div>
        <p className="way__body">{body}</p>
      </div>
    </article>
  );
}

function Head({ t, children }) {
  return (
    <div className="way__head">
      <div className="eyebrow"><span className="jp">道</span><span>— {t('way.eyebrow')}</span></div>
      <h2 className="h2">{t('way.title')}</h2>
      {children}
    </div>
  );
}

export default function WayGallery() {
  const { t } = useLang();
  const steps = t('way.steps');
  const desktop = useDesktop();
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const distance = useRef(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, (v) => -v * distance.current);
  const bar = useTransform(scrollYProgress, [0, 1], [0.04, 1]);
  const [step, setStep] = useState(1);

  useLayoutEffect(() => {
    if (!desktop) return undefined;
    const measure = () => {
      const tr = trackRef.current;
      if (!tr) return;
      distance.current = Math.max(0, tr.scrollWidth - window.innerWidth);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [desktop, steps.length]);

  useEffect(() => scrollYProgress.on('change', (v) => setStep(Math.min(steps.length, Math.floor(v * steps.length) + 1))), [scrollYProgress, steps.length]);

  const rail = { 'data-rail': 'way', 'data-rail-label': t('rail.way'), 'data-rail-jp': '道' };

  if (!desktop || reduce) {
    return (
      <section ref={sectionRef} className="way way--swipe section" {...rail}>
        <div className="wrap inner"><Head t={t} /></div>
        <div className="way__swipe" tabIndex={0} aria-label={t('way.eyebrow')}>
          {steps.map((s, i) => <Panel key={s[0]} step={s} i={i} total={steps.length} />)}
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="way way--pinned" style={{ height: `${steps.length * 60 + 60}vh` }} {...rail}>
      <div className="way__sticky">
        <div className="way__top">
          <Head t={t}>
            <div className="way__progress" aria-hidden="true">
              <span className="tnum">{pad(step)}</span>
              <span className="way__bar"><motion.span style={{ scaleX: bar }} /></span>
              <span className="tnum">{pad(steps.length)}</span>
            </div>
          </Head>
        </div>
        <motion.div ref={trackRef} className="way__track" style={{ x }}>
          {steps.map((s, i) => <Panel key={s[0]} step={s} i={i} total={steps.length} />)}
        </motion.div>
      </div>
    </section>
  );
}
