import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { useLang } from '../lib/LangContext.jsx';
import { scrollToTarget, scrollToTop } from '../lib/smooth.js';
import { Mark } from './Logo.jsx';

// The section rail: a bamboo stalk on the right edge with a node for every
// section of the page (any element with data-rail). It fills with matcha as
// you scroll, a small bowl marks where you are, and the label of each node
// takes you there. On phones it becomes a thin line under the top bar.
const ROW = 30;
const pad = (n) => String(n).padStart(2, '0');

function collect() {
  return [...document.querySelectorAll('main [data-rail]')].map((el) => ({
    el,
    key: el.dataset.rail,
    label: el.dataset.railLabel || el.dataset.rail,
    jp: el.dataset.railJp || ''
  }));
}

export default function SectionRail() {
  const { t, lang } = useLang();
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  const [sections, setSections] = useState([]);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const ticking = useRef(false);

  // Find the sections once the page has rendered, and again if it changes.
  useEffect(() => {
    let timer;
    const refresh = () => { clearTimeout(timer); timer = setTimeout(() => setSections(collect()), 120); };
    refresh();
    const main = document.querySelector('#root');
    const mo = new MutationObserver(refresh);
    if (main) mo.observe(main, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-rail-label'] });
    return () => { clearTimeout(timer); mo.disconnect(); };
  }, [pathname, lang]);

  useEffect(() => {
    const measure = () => {
      ticking.current = false;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      setProgress(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0);
      setScrolled(y > 480);
      const line = vh * 0.4;
      let idx = 0;
      sections.forEach((s, i) => { if (s.el.getBoundingClientRect().top <= line) idx = i; });
      if (max > 0 && y >= max - 4) idx = sections.length - 1; // the last section may be short
      setActive(idx);
    };
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [sections]);

  if (sections.length < 3) return null;
  const current = sections[Math.min(active, sections.length - 1)];

  return (
    <>
      <div className="progress-line" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>
      <nav className="rail" aria-label={t('rail.label')}>
        <div className="rail__count" aria-hidden="true">
          <b>{pad(active)}</b><span> / {pad(sections.length - 1)}</span>
          {current?.jp && <span className="rail__jp jp">{current.jp}</span>}
        </div>
        <div className="rail__track" style={{ height: sections.length * ROW }}>
          <span className="rail__stalk" aria-hidden="true" />
          <span className="rail__fill" aria-hidden="true" style={{ transform: `scaleY(${progress})` }} />
          <ol>
            {sections.map((s, i) => (
              <li key={`${s.key}-${i}`} className={i === active ? 'is-active' : i < active ? 'is-past' : ''}>
                <button type="button" onClick={() => scrollToTarget(s.el)} aria-current={i === active ? 'true' : undefined}>
                  <span className="rail__num" aria-hidden="true">{pad(i)}</span>
                  <span className="rail__label">{s.label}</span>
                  <span className="rail__node" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ol>
          <motion.span
            className="rail__bowl"
            aria-hidden="true"
            initial={false}
            animate={{ y: active * ROW }}
            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 28 }}
          >
            <Mark size={16} />
          </motion.span>
        </div>
        <button type="button" className={`rail__top ${scrolled ? 'is-on' : ''}`} onClick={() => scrollToTop()} aria-label={t('rail.top')} tabIndex={scrolled ? 0 : -1}>
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </nav>
    </>
  );
}
