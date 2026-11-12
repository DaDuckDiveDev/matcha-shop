import { useLang } from '../lib/LangContext.jsx';
import { currentSekki, fmtRange } from '../data/sekki.js';

// Kyoto keeps a calendar of twenty-four seasons, each about two weeks long.
// The counter follows it. This is today's, worked out from the sun.
export function useSeason() {
  const { lang, t } = useLang();
  const s = currentSekki();
  return {
    kanji: s.kanji,
    romaji: s.romaji,
    name: lang === 'sr' ? s.sr : s.en,
    range: fmtRange(s.start, s.end, lang),
    special: s.special ? (lang === 'sr' ? s.special.sr : s.special.en) : t('season.fallback')
  };
}

export default function SeasonLine() {
  const { t } = useLang();
  const s = useSeason();
  return (
    <section className="today" aria-label={t('home.todayLabel')}>
      <div className="wrap today__in">
        <div className="today__kanji jp" aria-hidden="true">{s.kanji}</div>
        <div className="today__name">{t('home.todayLabel')}: {s.romaji}, {s.name.toLowerCase()}, {s.range}</div>
        <div className="today__special">{t('home.onCounter')}: {s.special.charAt(0).toLowerCase() + s.special.slice(1)}</div>
      </div>
    </section>
  );
}
