import { useLang } from '../lib/LangContext.jsx';

// A slow ribbon of tea-room words: kanji, reading, meaning. Pauses on hover;
// stands still for people who prefer less motion.
export default function Marquee() {
  const { t } = useLang();
  const words = t('marquee');
  const row = (hidden) => (
    <ul className="marquee__row" aria-hidden={hidden || undefined}>
      {words.map(([jp, romaji, meaning]) => (
        <li key={jp}>
          <span className="marquee__jp jp">{jp}</span>
          <span className="marquee__romaji">{romaji}</span>
          <span className="marquee__meaning">{meaning}</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee" role="group" aria-roledescription="marquee">
      <div className="marquee__track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
