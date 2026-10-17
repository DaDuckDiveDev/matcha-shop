import { useLang } from '../lib/LangContext.jsx';

// The three things we are comfortable saying about matcha and wellbeing.
// Plain language, no claims a tea house should not make.
export default function CalmPoints() {
  const { t } = useLang();
  const points = t('home.calm');
  const kanji = ['茶', '葉', '間'];
  return (
    <ol className="steps" style={{ listStyle: 'none' }}>
      {points.map(([title, body], i) => (
        <li key={title}>
          <span className="step__n">{kanji[i]}</span>
          <span className="step__body"><b>{title}</b><span>{body}</span></span>
        </li>
      ))}
    </ol>
  );
}
