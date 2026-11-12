import { useLang } from '../lib/LangContext.jsx';
import { A } from '../lib/go.jsx';
import Photo from './Photo.jsx';

export default function StoryCard({ story, sizes = '(min-width: 900px) 32vw, 78vw', excerpt = false }) {
  const { pick, t } = useLang();
  const body = (
    <>
      <Photo k={story.photo} sizes={sizes} morph={!story.draft} />
      <div className="story-card__text">
        <div className="story-card__meta">{story.draft ? t('journal.comingSoon') : `${pick(story.kicker)} · ${t('journal.minRead', story.minutes)}`}</div>
        <h3 className="story-card__title">{pick(story.title)}</h3>
        {excerpt && <p className="story-card__excerpt">{story.draft ? t('journal.ourStoryBody') : pick(story.excerpt)}</p>}
      </div>
    </>
  );
  if (story.draft) return <div className="story-card story-card--soon">{body}</div>;
  return <A to={`/journal/${story.slug}`} morph className="story-card">{body}</A>;
}
