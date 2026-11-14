import { useRef } from 'react';
import TierRing from '../app/TierRing.jsx';
import { MARK_PATH } from './Logo.jsx';

// The guest's card as it looks in the app, shown on the home page. It leans
// toward the cursor and a soft light follows it; still under reduced motion
// and on touch screens.
export default function PassCard({ points, tier, jp, stamps = 6, labels }) {
  const el = useRef(null);
  const move = (e) => {
    const node = el.current;
    if (!node || e.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = node.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    node.style.setProperty('--rx', `${(0.5 - y) * 9}deg`);
    node.style.setProperty('--ry', `${(x - 0.5) * 11}deg`);
    node.style.setProperty('--lx', `${x * 100}%`);
    node.style.setProperty('--ly', `${y * 100}%`);
  };
  const rest = () => {
    const node = el.current;
    if (!node) return;
    ['--rx', '--ry'].forEach((p) => node.style.setProperty(p, '0deg'));
  };
  return (
    <div className="pass-stage" onPointerMove={move} onPointerLeave={rest}>
      <div className="pass on-dark" ref={el} role="img" aria-label={labels.alt}>
        <div className="pass__top">
          <span className="pass__brand">Machiko <span lang="ja">まちこ</span></span>
          <span className="pass__tier">{tier} <span lang="ja">{jp}</span></span>
        </div>
        <div className="pass__mid">
          <TierRing progress={0.62} kanji={jp} size={88} />
          <div>
            <div className="pass__points tnum">{points}</div>
            <div className="pass__label">{labels.word}</div>
          </div>
        </div>
        <div className="pass__stamps" aria-hidden="true">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className={i < stamps ? 'is-on' : ''}>
              {i < stamps && <svg viewBox="0 0 100 100"><path d={MARK_PATH} /></svg>}
            </span>
          ))}
        </div>
        <div className="pass__foot">{labels.stamps}</div>
      </div>
    </div>
  );
}
