import { useLang } from '../lib/LangContext.jsx';
import Page from '../components/Page.jsx';
import Footer from '../components/Footer.jsx';

export default function Privacy() {
  const { t } = useLang();
  return (
    <Page title={t('privacy.eyebrow')}>
      <div className="wrap">
        <header className="page-head">
          <h1 className="d1">{t('privacy.title')}</h1>
          <p className="lede">{t('privacy.lede')}</p>
        </header>
        <section className="legal">
          {t('privacy.sections').map(([h, p]) => <div key={h}><h2>{h}</h2><p>{p}</p></div>)}
        </section>
        <p className="micro faint" style={{ padding: '20px 0 clamp(56px, 9vw, 112px)' }}>{t('privacy.note')}</p>
      </div>
      <Footer />
    </Page>
  );
}
