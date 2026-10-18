import { Link, useParams } from 'react-router-dom';
import { useLang } from '../lib/LangContext.jsx';
import Page from '../components/Page.jsx';
import PhotoBand from '../components/PhotoBand.jsx';
import Reveal from '../components/Reveal.jsx';
import StoryCard from '../components/StoryCard.jsx';
import Footer from '../components/Footer.jsx';
import NotFound from './NotFound.jsx';
import { findStory, nextStory, toBlocks } from '../data/journal.js';
import { IconArrow } from '../components/Icons.jsx';

const MONTHS = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  sr: ['januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar']
};

function fmtDate(iso, lang) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return lang === 'sr' ? `${d}. ${MONTHS.sr[m - 1]} ${y}.` : `${d} ${MONTHS.en[m - 1]} ${y}`;
}

const short = (s) => (s.length > 22 ? `${s.slice(0, 21).trimEnd()}…` : s);

export default function Story() {
  const { slug } = useParams();
  const { t, pick, lang } = useLang();
  const story = findStory(slug);
  if (!story) return <NotFound />;
  const blocks = toBlocks(story.body[lang] || story.body.en);
  const next = nextStory(slug);

  return (
    <Page title={pick(story.title)}>
      <PhotoBand image={story.photo} className="story-hero" light>
        <div className="wrap inner">
          <Reveal className="glass story-hero__card" data-rail="top" data-rail-label={short(pick(story.kicker))} data-rail-jp={story.jp}>
            <div className="eyebrow"><span className="jp">{story.jp}</span><span>— {pick(story.kicker)}</span></div>
            <h1 className="display story-hero__title">{pick(story.title)}</h1>
            <p className="lede">{pick(story.excerpt)}</p>
            <div className="caption">{fmtDate(story.date, lang)} · {t('journal.minRead', story.minutes)}</div>
          </Reveal>
        </div>
      </PhotoBand>

      <article className="story wrap">
        <div className="story__body">
          {blocks.map((b, i) => {
            if (b.type === 'h') return <h2 key={i} className="story__h" data-rail={`h${i}`} data-rail-label={short(b.text)} data-rail-jp={story.jp}>{b.text}</h2>;
            if (b.type === 'quote') return <blockquote key={i} className="story__quote"><p>{b.text}</p></blockquote>;
            if (b.type === 'ul') return <ul key={i} className="story__list">{b.items.map((it) => <li key={it}>{it}</li>)}</ul>;
            if (b.type === 'ol') return <ol key={i} className="story__steps">{b.items.map((it) => <li key={it}>{it}</li>)}</ol>;
            return <p key={i} className={i === 0 ? 'story__lead' : undefined}>{b.text}</p>;
          })}
        </div>
      </article>

      {next && (
        <section className="section wrap inner story__next" data-rail="next" data-rail-label={t('journal.next')} data-rail-jp="次">
          <div className="section-head"><h2>{t('journal.next')}</h2><Link to="/journal" className="textlink">{t('journal.all')} <IconArrow /></Link></div>
          <div style={{ marginTop: 20 }}><StoryCard story={next} size="lg" /></div>
        </section>
      )}
      <Footer />
    </Page>
  );
}
