import { useRef } from 'react';
import { useStore } from '../lib/store.js';
import { useLang } from '../lib/LangContext.jsx';
import { standing } from '../data/loyalty.js';
import TierRing from '../app/TierRing.jsx';
import { MARK_PATH } from './Logo.jsx';

// The guest's card as it looks in the app, shown on the home page. It leans
// toward the cursor and a soft light follows it; still under reduced motion
// and on touch screens.
export default function PassCard({ labels }) {
  const el = useRef(null);
  // Someone who has already used the guest app in this browser sees their own
  // card here; everyone else sees an example, and the caption says which.
  const guest = useStore();
  const { lang, pick } = useLang();
  const mine = guest.lifetime > 0 || guest.orders.length > 0;
  const at = standing(mine ? guest.lifetime : 2480);
  const n = (v) => v.toLocaleString(lang === 'sr' ? 'sr-Latn-RS' : 'en-GB');
  const points = n(mine ? guest.points : 2480);
  const stamps = Math.min(mine ? guest.stamps : 6, 10);
  const tier = pick(at.tier.name);
  const jp = at.tier.jp;
  const left = 10 - stamps;
  const foot = left > 0 ? labels.stampsLeft(stamps, left) : labels.stampsFull;
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
      <div className="pass on-dark" ref={el} role="img" aria-label={labels.alt(points, tier, stamps)} data-pass={mine ? 'mine' : 'example'}>
        <div className="pass__top">
          <span className="pass__brand">Machiko <span lang="ja">まちこ</span></span>
          <span className="pass__tier">{tier} <span lang="ja">{jp}</span></span>
        </div>
        <div className="pass__mid">
          <TierRing progress={at.progress} kanji={jp} size={88} />
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
        <div className="pass__foot">{foot}</div>
      </div>
      <p className="caption pass__caption">{mine ? labels.mine : labels.example}</p>
    </div>
  );
}
