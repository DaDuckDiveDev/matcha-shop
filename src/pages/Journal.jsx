import { useLang } from '../lib/LangContext.jsx';
import Page from '../components/Page.jsx';
import PhotoBand from '../components/PhotoBand.jsx';
import Reveal from '../components/Reveal.jsx';
import StoryCard from '../components/StoryCard.jsx';
import Footer from '../components/Footer.jsx';
import { STORIES } from '../data/journal.js';

export default function Journal() {
  const { t } = useLang();
  const [first, ...rest] = STORIES;
  return (
    <Page title={t('journal.eyebrow')}>
      <PhotoBand image="norenGreen" style={{ padding: '72px 0 48px' }} light>
        <div className="wrap inner">
          <Reveal className="glass" style={{ padding: '26px 24px', maxWidth: 640 }}>
            <div className="stack" style={{ gap: 12 }}>
              <div className="eyebrow"><span className="jp">物語</span><span>— {t('journal.eyebrow')}</span></div>
              <h1 className="display" style={{ fontSize: 'clamp(36px, 8vw, 56px)' }}>{t('journal.title')}</h1>
              <p className="lede">{t('journal.lede')}</p>
            </div>
          </Reveal>
        </div>
      </PhotoBand>

      <section className="section wrap inner">
        <div className="journal-grid">
          <Reveal className="journal-grid__lead"><StoryCard story={first} size="lg" /></Reveal>
          {rest.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 2) * 0.08}><StoryCard story={s} /></Reveal>
          ))}
        </div>
      </section>
      <Footer />
    </Page>
  );
}
