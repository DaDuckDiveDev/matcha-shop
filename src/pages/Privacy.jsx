import { useLang } from '../lib/LangContext.jsx';
import Page from '../components/Page.jsx';
import Reveal from '../components/Reveal.jsx';
import Footer from '../components/Footer.jsx';

export default function Privacy() {
  const { t } = useLang();
  return (
    <Page title={t('privacy.eyebrow')}>
      <section className="section wrap inner privacy">
        <Reveal className="stack" style={{ gap: 12, maxWidth: 680 }}>
          <div className="eyebrow"><span className="jp">個人情報</span><span>— {t('privacy.eyebrow')}</span></div>
          <h1 className="display" style={{ fontSize: 'clamp(36px, 8vw, 56px)' }}>{t('privacy.title')}</h1>
          <p className="lede">{t('privacy.lede')}</p>
        </Reveal>
        <div className="privacy__list">
          {t('privacy.sections').map(([h, body]) => (
            <Reveal key={h} className="privacy__item">
              <h2 className="h3">{h}</h2>
              <p className="body">{body}</p>
            </Reveal>
          ))}
        </div>
        <p className="caption privacy__note">{t('privacy.note')}</p>
      </section>
      <Footer />
    </Page>
  );
}
