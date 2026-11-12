import { useLang } from '../lib/LangContext.jsx';
import Photo from './Photo.jsx';

// 道 From field to bowl: six photographs in a row. On a phone it is a row you
// swipe. On a wide screen, in browsers with scroll timelines, the page holds
// still while the row slides past: the stylesheet does that on its own
// (see ".way" there), so there is no script here at all.
const PHOTOS = ['teaRows', 'teaMist', 'powderTray', 'scoop', 'whiskClose', 'steamBowl'];

export default function WayGallery() {
  const { t } = useLang();
  const steps = t('way.steps');
  return (
    <section className="way" style={{ '--steps': steps.length }}>
      <div className="way__sticky">
        <div className="wrap way__head">
          <h2 className="d2">{t('way.title')}</h2>
          <div className="way__bar" aria-hidden="true"><span /></div>
        </div>
        <div className="way__track" tabIndex={0} role="group" aria-label={t('way.title')}>
          {steps.map(([jp, , title, body], i) => (
            <article className="way__panel" key={jp}>
              <Photo k={PHOTOS[i]} sizes="(min-width: 1024px) 30vw, 80vw" />
              <div className="stack" style={{ gap: 6 }}>
                <span className="way__num">{i + 1} / {steps.length}</span>
                <h3 className="way__step"><span className="jp" lang="ja" aria-hidden="true">{jp}</span>{title}</h3>
                <p className="way__body">{body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
