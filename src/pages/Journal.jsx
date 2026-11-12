import { useLang } from '../lib/LangContext.jsx';
import { STORIES } from '../data/journal.js';
import Page from '../components/Page.jsx';
import StoryCard from '../components/StoryCard.jsx';
import Footer from '../components/Footer.jsx';

export default function Journal() {
  const { t } = useLang();
  return (
    <Page title={t('nav.journal')}>
      <div className="wrap">
        <header className="page-head">
          <h1 className="d1">{t('nav.journal')}</h1>
          <p className="lede">{t('journal.lede')}</p>
        </header>
        <section className="stories stories--all" style={{ paddingBottom: 'clamp(56px, 9vw, 112px)' }}>
          {STORIES.map((s, i) => <StoryCard key={s.slug} story={s} excerpt sizes={i === 0 ? '(min-width: 900px) 56vw, 92vw' : '(min-width: 900px) 46vw, 92vw'} />)}
        </section>
      </div>
      <Footer />
    </Page>
  );
}
