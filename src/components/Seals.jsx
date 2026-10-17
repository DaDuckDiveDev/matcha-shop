import { useLang } from '../lib/LangContext.jsx';

// Hanko: the four claims we are willing to stamp.
const SEALS = [
  { kanji: '宇治', key: 'home.seals.uji' },
  { kanji: '初摘', key: 'home.seals.first' },
  { kanji: '石臼', key: 'home.seals.stone' },
  { kanji: '点前', key: 'home.seals.whisk' }
];

export default function Seals() {
  const { t } = useLang();
  return (
    <div className="seals">
      {SEALS.map((s) => (
        <div className="seal" key={s.kanji}>
          <div className="seal__mark"><span className="seal__kanji" aria-hidden="true">{[...s.kanji].map((ch, i) => <span key={i}>{ch}</span>)}</span></div>
          <div className="seal__caption">{t(s.key)}</div>
        </div>
      ))}
    </div>
  );
}
