import { Link } from 'react-router-dom';
import { useLang } from '../lib/LangContext.jsx';
import { currentSekki, fmtRange } from '../data/sekki.js';

// The 24 solar terms set the pace of the specials. Today's term, its dates,
// and what the kitchen is doing with it.
export default function SeasonStrip({ green = false, to, className = '' }) {
  const { lang, t } = useLang();
  const s = currentSekki();
  const name = lang === 'sr' ? s.sr : s.en;
  const special = s.special ? (lang === 'sr' ? s.special.sr : s.special.en) : t('season.fallback');
  const body = (
    <>
      <div className="season__kanji" aria-hidden="true">{s.kanji}</div>
      <div className="season__meta">
        <div className="caption">{name} · {s.romaji} · {s.n}. {t('season.term')} · {fmtRange(s.start, s.end, lang)}</div>
        <div className="season__special">{t('season.fortnight')}: {special}</div>
      </div>
    </>
  );
  const cls = `season glass glass--sm ${green ? 'glass--green season--green' : ''} ${className}`;
  return to ? <Link to={to} className={cls} style={{ textDecoration: 'none', color: 'inherit' }}>{body}</Link> : <div className={cls}>{body}</div>;
}
