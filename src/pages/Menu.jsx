import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../lib/LangContext.jsx';
import Page from '../components/Page.jsx';
import MenuRow from '../components/MenuRow.jsx';
import Reveal from '../components/Reveal.jsx';
import SeasonStrip from '../components/SeasonStrip.jsx';
import Footer from '../components/Footer.jsx';
import PhotoBand from '../components/PhotoBand.jsx';
import { CATEGORIES, byCategory } from '../data/menu.js';
import { currentSekki } from '../data/sekki.js';

export default function Menu() {
  const { t, pick } = useLang();
  const { hash } = useLocation();
  const [active, setActive] = useState('matcha');
  const sekki = currentSekki();
  const seasonalId = sekki.special?.itemId;

  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350);
  }, [hash]);

  useEffect(() => {
    const ids = CATEGORIES.map((c) => c.id);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <Page title={t('menu.eyebrow')}>
      <PhotoBand image="powderTray" style={{ padding: '56px 0 40px' }} light>
        <div className="wrap inner">
          <Reveal className="glass" style={{ padding: '26px 24px', maxWidth: 620 }}>
            <div className="stack" style={{ gap: 12 }}>
              <div className="eyebrow"><span className="jp">献立</span><span>— {t('menu.eyebrow')}</span></div>
              <h1 className="display" style={{ fontSize: 'clamp(36px, 8vw, 56px)' }}>{t('menu.title')}</h1>
              <p className="lede">{t('menu.lede')}</p>
            </div>
          </Reveal>
        </div>
      </PhotoBand>

      <div className="wrap inner">
        <nav className="chips chips--sticky" aria-label="Menu sections">
          {CATEGORIES.map((c) => (
            <a key={c.id} href={`#${c.id}`} className="chip" aria-current={active === c.id ? 'true' : undefined} onClick={(e) => { e.preventDefault(); document.getElementById(c.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>
              <span className="jp" style={{ letterSpacing: '0.1em', textTransform: 'none' }}>{c.kanji}</span>{pick({ en: c.en, sr: c.sr })}
            </a>
          ))}
        </nav>

        <div style={{ marginTop: 16 }}><SeasonStrip /></div>

        {CATEGORIES.map((c) => (
          <section key={c.id} id={c.id} className="section--tight" style={{ scrollMarginTop: 130 }}>
            <Reveal className="section-head">
              <h2>{pick({ en: c.en, sr: c.sr })}<span className="jp">{c.kanji}</span></h2>
              <span className="caption">{pick(c.tag)}</span>
            </Reveal>
            <div className="rows rows--2" style={{ borderTop: 0 }}>
              {byCategory(c.id).map((item) => (
                <MenuRow key={item.id} item={item} to={`/app/order/${item.id}`} seasonal={item.id === seasonalId} />
              ))}
            </div>
          </section>
        ))}

        <div className="stack" style={{ gap: 14, marginTop: 28 }}>
          <div className="caption" style={{ textTransform: 'none', letterSpacing: '0.04em', fontSize: 12, lineHeight: 1.5 }}>{t('menu.footnote')}</div>
          <Link to="/app/order" className="btn btn--primary">{t('menu.orderInApp')}</Link>
        </div>
      </div>
      <Footer />
    </Page>
  );
}
