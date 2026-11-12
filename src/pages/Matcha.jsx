import { useLang } from '../lib/LangContext.jsx';
import { A } from '../lib/go.jsx';
import Page from '../components/Page.jsx';
import Photo from '../components/Photo.jsx';
import Ink from '../components/Ink.jsx';
import WayGallery from '../components/WayGallery.jsx';
import Footer from '../components/Footer.jsx';
import { IconArrow } from '../components/Icons.jsx';

export default function Matcha() {
  const { t } = useLang();
  const specs = Object.values(t('matcha.specs'));
  return (
    <Page title={t('matcha.eyebrow')}>
      <div className="wrap">
        <header className="page-head page-head--split">
          <div className="page-head__text">
            <h1 className="d1">{t('matcha.title')}</h1>
            <p className="lede">{t('matcha.lede')}</p>
          </div>
          <Photo k="bowlTop" className="page-hero" target priority sizes="(min-width: 900px) 42vw, 92vw" />
        </header>

        <section className="section section--tight split" id="tin">
          <Ink className="d2">{t('matcha.specsTitle')}</Ink>
          <dl className="specs">
            {specs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </section>
      </div>

      <WayGallery />

      <div className="wrap">
        <section className="section section--tight split">
          <Ink className="d2">{t('matcha.howTitle')}</Ink>
          <ol className="steps">
            {t('matcha.steps').map(([k, v]) => <li key={k}><h3>{k}</h3><p>{v}</p></li>)}
          </ol>
        </section>

        <section className="section section--tight split">
          <Ink className="d2">{t('matcha.faqTitle')}</Ink>
          <div className="faq">
            {t('matcha.faq').map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
          </div>
        </section>

        <A to="/menu#matcha" className="next" style={{ marginBottom: 8 }}>
          <span className="small faint">{t('nav.menu')}</span>
          <span className="d2 serif" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>{t('common.seeMenu')}<IconArrow /></span>
        </A>
      </div>
      <Footer />
    </Page>
  );
}
