import { useLang } from '../lib/LangContext.jsx';
import { A } from '../lib/go.jsx';
import { SHOP, isOpen } from '../data/shop.js';
import Page from '../components/Page.jsx';
import Photo from '../components/Photo.jsx';
import Ink from '../components/Ink.jsx';
import Footer from '../components/Footer.jsx';
import { IconArrow } from '../components/Icons.jsx';

export default function Visit() {
  const { t } = useLang();
  const opened = isOpen();
  return (
    <Page title={t('nav.visit')}>
      <div className="wrap">
        <header className="page-head page-head--split">
          <div className="page-head__text">
            <h1 className="d1">{t('visit.title')}</h1>
            <p className="lede">{t('visit.lede')}</p>
            {!opened && <div><A className="btn btn--solid" to="/join">{t('home.ctaJoin')}</A></div>}
          </div>
          <Photo k="norenTwilight" className="page-hero" target priority sizes="(min-width: 900px) 42vw, 92vw" />
        </header>

        <section className="section section--tight info">
          {!opened && (
            <div>
              <h2>{t('visit.openingTitle')}</h2>
              <dl>{t('visit.opening').map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            </div>
          )}
          <div>
            <h2>{t('visit.hoursTitle')}</h2>
            <p>{t('visit.hours')}</p>
          </div>
          <div>
            <h2>{t('visit.findTitle')}</h2>
            <div className="stack" style={{ gap: 12, alignItems: 'flex-start' }}>
              <p>{SHOP.address || t('visit.find')}</p>
              {SHOP.mapsUrl && <a className="link small" href={SHOP.mapsUrl} target="_blank" rel="noreferrer">{t('visit.openMap')}<IconArrow /></a>}
              <a className="link small" href={`mailto:${SHOP.email}`}>{SHOP.email}</a>
            </div>
          </div>
          <div className="plain">
            <h2>{t('visit.goodTitle')}</h2>
            <ul>{t('visit.good').map((g) => <li key={g}>{g}</li>)}</ul>
          </div>
          <div id="workshops" style={{ scrollMarginTop: 120 }}>
            <h2>{t('visit.workshopsTitle')}</h2>
            <div className="stack" style={{ gap: 18, alignItems: 'flex-start' }}>
              <dl>
                {t('visit.workshops').map(([k, v]) => <div key={k}><dd>{k}</dd><dt style={{ fontSize: '1rem', maxWidth: '34em' }}>{v}</dt></div>)}
              </dl>
              {opened && <a className="link small" href={`${import.meta.env.BASE_URL}app/reserve`}>{t('visit.reserve')}<IconArrow /></a>}
            </div>
          </div>
        </section>

        <section className="section section--tight">
          <div className="section__head" style={{ alignItems: 'start', flexDirection: 'column', gap: 14 }}>
            <Ink className="d2">{t('visit.kyotoTitle')}</Ink>
            <p className="copy">{t('visit.kyotoBody')}</p>
          </div>
          <div className="mosaic">
            <Photo k="higashiyama" drift sizes="(min-width: 900px) 56vw, 92vw" />
            <Photo k="mossCheck" drift sizes="(min-width: 900px) 40vw, 46vw" />
            <Photo k="kyotoAlley" drift sizes="(min-width: 900px) 32vw, 46vw" />
            <Photo k="zenRaked" drift sizes="(min-width: 900px) 64vw, 92vw" />
          </div>
        </section>
      </div>
      <Footer />
    </Page>
  );
}
