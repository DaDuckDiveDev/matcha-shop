import { useEffect, useState } from 'react';
import { useLang } from '../lib/LangContext.jsx';
import { A } from '../lib/go.jsx';
import { isOpen } from '../data/shop.js';
import { CATEGORIES, byCategory } from '../data/menu.js';
import { currentSekki } from '../data/sekki.js';
import { scrollToTarget } from '../lib/smooth.js';
import Page from '../components/Page.jsx';
import Photo from '../components/Photo.jsx';
import MenuRow from '../components/MenuRow.jsx';
import Footer from '../components/Footer.jsx';
import { useSeason } from '../components/SeasonLine.jsx';

const PHOTOS = { matcha: 'bowlRustic', coffee: 'nelDrip', kitchen: 'mochiPlate', shop: 'ceremonySet' };

export default function Menu() {
  const { t, pick } = useLang();
  const season = useSeason();
  const seasonalId = currentSekki().special?.itemId;
  const [active, setActive] = useState(CATEGORIES[0].id);
  const opened = isOpen();

  // the tab of the section you are reading is the dark one
  useEffect(() => {
    const els = CATEGORIES.map((c) => document.getElementById(c.id)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      const seen = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (seen[0]) setActive(seen[0].target.id);
    }, { rootMargin: '-30% 0px -55% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <Page title={t('menu.title')}>
      <div className="wrap">
        <header className="page-head">
          <h1 className="d1">{t('menu.title')}</h1>
          <p className="lede">{t('menu.lede')}</p>
          <p className="season-line"><span className="jp" aria-hidden="true">{season.kanji}</span><span>{t('menu.seasonNow')}: {season.special.charAt(0).toLowerCase() + season.special.slice(1)}</span></p>
        </header>

        <nav className="tabs" aria-label={t('menu.title')}>
          {CATEGORIES.map((c) => (
            <a key={c.id} href={`#${c.id}`} className={active === c.id ? 'is-on' : ''} aria-current={active === c.id ? 'true' : undefined}
              onClick={(e) => { e.preventDefault(); scrollToTarget(`#${c.id}`); }}>
              {pick(c)}<span className="jp" aria-hidden="true">{c.kanji}</span>
            </a>
          ))}
        </nav>

        {CATEGORIES.map((c, i) => (
          <section key={c.id} id={c.id} className="cat">
            <div className="cat__head">
              <div className="cat__title"><h2 className="d2">{pick(c)}</h2><span className="jp" lang="ja">{c.kanji}</span></div>
              <p className="muted">{pick(c.tag)}</p>
              <Photo k={PHOTOS[c.id]} drift target={i === 0} sizes="(min-width: 900px) 34vw, 92vw" priority={i === 0} />
            </div>
            <div className="rows">
              {byCategory(c.id).map((item) => <MenuRow key={item.id} item={item} showImage={false} seasonal={item.id === seasonalId} />)}
            </div>
          </section>
        ))}

        <div className="section section--tight stack" style={{ gap: 22, alignItems: 'flex-start' }}>
          <p className="footnote">{t('menu.footnote')} {!opened && t('menu.guide')}</p>
          {opened
            ? <a className="btn btn--solid" href={`${import.meta.env.BASE_URL}app/order`}>{t('menu.orderInApp')}</a>
            : <A className="btn btn--solid" to="/join">{t('home.ctaJoin')}</A>}
        </div>
      </div>
      <Footer />
    </Page>
  );
}
