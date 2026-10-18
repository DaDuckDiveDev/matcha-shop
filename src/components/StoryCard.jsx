import { Link } from 'react-router-dom';
import { useLang } from '../lib/LangContext.jsx';
import { alt, src } from '../data/images.js';
import { IconArrow } from './Icons.jsx';

// A journal card: photograph, kicker, title, a line, and the reading time.
// A draft story shows as "coming soon" and does not link anywhere.
export default function StoryCard({ story, size = 'md' }) {
  const { t, pick } = useLang();
  const body = (
    <>
      <div className="story-card__media">
        <img src={src(story.photo, size === 'lg' ? 1400 : 900)} alt={alt(story.photo)} loading="lazy" decoding="async" />
        <span className="story-card__seal jp" aria-hidden="true">{story.jp}</span>
      </div>
      <div className="story-card__body">
        <div className="eyebrow"><span>{story.draft ? t('journal.comingSoon') : pick(story.kicker)}</span></div>
        <h3 className="story-card__title">{story.draft ? t('journal.ourStoryTitle') : pick(story.title)}</h3>
        <p className="story-card__excerpt">{story.draft ? t('journal.ourStoryBody') : pick(story.excerpt)}</p>
        {!story.draft && (
          <span className="story-card__more">
            <span className="caption">{t('journal.minRead', story.minutes)}</span>
            <span className="textlink" aria-hidden="true">{t('journal.read')} <IconArrow /></span>
          </span>
        )}
      </div>
    </>
  );
  const cls = `story-card story-card--${size} glass ${story.draft ? 'story-card--draft' : ''}`;
  return story.draft
    ? <div className={cls}>{body}</div>
    : <Link to={`/journal/${story.slug}`} className={cls}>{body}</Link>;
}
