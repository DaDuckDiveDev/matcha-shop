import { useParams } from 'react-router-dom';
import { useLang } from '../lib/LangContext.jsx';
import { A } from '../lib/go.jsx';
import { findStory, nextStory, toBlocks } from '../data/journal.js';
import Page from '../components/Page.jsx';
import Photo from '../components/Photo.jsx';
import Footer from '../components/Footer.jsx';
import NotFound from './NotFound.jsx';
import { IconArrow, IconBack } from '../components/Icons.jsx';

function Block({ b }) {
  if (b.type === 'h') return <h2>{b.text}</h2>;
  if (b.type === 'quote') return <blockquote>{b.text}</blockquote>;
  if (b.type === 'ul') return <ul>{b.items.map((x) => <li key={x}>{x}</li>)}</ul>;
  if (b.type === 'ol') return <ol>{b.items.map((x) => <li key={x}>{x}</li>)}</ol>;
  return <p>{b.text}</p>;
}

export default function Story() {
  const { slug } = useParams();
  const { t, pick, lang } = useLang();
  const story = findStory(slug);
  if (!story) return <NotFound />;
  const next = nextStory(slug);
  const date = story.date ? new Date(story.date).toLocaleDateString(lang === 'sr' ? 'sr-Latn-RS' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  return (
    <Page title={pick(story.title)}>
      <article className="wrap">
        <header className="article-head">
          <A to="/journal" className="link small" style={{ width: 'fit-content' }}><IconBack />{t('journal.all')}</A>
          <p className="small faint">{pick(story.kicker)} · {t('journal.minRead', story.minutes)}{date && ` · ${date}`}</p>
          <h1 className="d1">{pick(story.title)}</h1>
          <p className="lede">{pick(story.excerpt)}</p>
        </header>
        <Photo k={story.photo} className="article-hero" target priority sizes="(min-width: 1400px) 1280px, 92vw" />
        <div className="prose">
          {toBlocks(pick(story.body)).map((b, i) => <Block key={i} b={b} />)}
        </div>
        {next && next.slug !== story.slug && (
          <div className="section section--tight">
            <A to={`/journal/${next.slug}`} className="next">
              <span className="small faint">{t('journal.next')}</span>
              <span className="d2 serif" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>{pick(next.title)}<IconArrow /></span>
            </A>
          </div>
        )}
      </article>
      <Footer />
    </Page>
  );
}
