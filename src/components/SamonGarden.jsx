import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { GLEAM_PATH, MARK_PATH } from './Logo.jsx';

// 砂紋 samon: the raked gravel of a Kyoto stone garden. Parallel lines drift
// slowly like water and part around three stones. The largest stone is the
// Machiko bowl seen from above; the others are a pebble of mochi and a
// mossy rock. Purely decorative: the words sit on top of it.
function useWide() {
  const q = '(min-width: 900px)';
  const [wide, setWide] = useState(() => (typeof window !== 'undefined' ? window.matchMedia(q).matches : true));
  useEffect(() => {
    const m = window.matchMedia(q);
    const on = () => setWide(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return wide;
}

const LAYOUTS = {
  wide: { w: 1440, h: 560, gap: 17, amp: 3.6, wave: 260, stones: [
    { kind: 'bowl', x: 1060, y: 290, r: 78 },
    { kind: 'mochi', x: 1268, y: 446, r: 30 },
    { kind: 'moss', x: 846, y: 126, r: 21 }
  ] },
  narrow: { w: 420, h: 330, gap: 13, amp: 2.6, wave: 150, stones: [
    { kind: 'bowl', x: 268, y: 168, r: 52 },
    { kind: 'mochi', x: 362, y: 262, r: 20 },
    { kind: 'moss', x: 110, y: 74, r: 14 }
  ] }
};

function linePath(y0, i, L) {
  const pts = [];
  for (let x = -L.wave; x <= L.w + L.wave; x += 10) {
    const y = y0 + L.amp * Math.sin((2 * Math.PI * x) / L.wave + i * 0.55);
    pts.push(`${x === -L.wave ? 'M' : 'L'}${x} ${y.toFixed(1)}`);
  }
  return pts.join('');
}

function Stone({ s, y }) {
  const shadow = <ellipse cx={s.x + s.r * 0.18} cy={s.y + s.r * 0.86} rx={s.r * 0.92} ry={s.r * 0.26} fill="rgba(30,42,29,0.16)" filter="url(#samon-soft)" />;
  if (s.kind === 'bowl') {
    const k = (s.r * 2) / 100;
    return (
      <motion.g style={{ y }}>
        {shadow}
        <g className="samon__float">
          <g transform={`translate(${s.x - s.r} ${s.y - s.r}) scale(${k})`}>
            <path d={MARK_PATH} fill="#3E5A33" />
            <path d={GLEAM_PATH} fill="none" stroke="#F4F0E4" strokeWidth={4.4} strokeLinecap="round" className="samon__gleam" />
          </g>
        </g>
      </motion.g>
    );
  }
  if (s.kind === 'mochi') {
    return (
      <motion.g style={{ y }}>
        {shadow}
        <g className="samon__float samon__float--slow">
          <circle cx={s.x} cy={s.y} r={s.r} fill="url(#samon-mochi)" />
          {[[-0.3, -0.35], [0.12, -0.5], [0.38, -0.12], [-0.42, 0.1], [0.05, 0.08]].map(([dx, dy], i) => (
            <circle key={i} cx={s.x + dx * s.r} cy={s.y + dy * s.r} r={s.r * 0.035} fill="rgba(85,96,81,0.35)" />
          ))}
        </g>
      </motion.g>
    );
  }
  const k = (s.r * 2) / 100;
  return (
    <motion.g style={{ y }}>
      {shadow}
      <g className="samon__float samon__float--late">
        <g transform={`translate(${s.x - s.r} ${s.y - s.r}) rotate(140 ${s.r} ${s.r}) scale(${k})`}>
          <path d={MARK_PATH} fill="#7FA052" />
          <path d={MARK_PATH} fill="url(#samon-moss)" />
        </g>
      </g>
    </motion.g>
  );
}

export default function SamonGarden({ className = '' }) {
  const wide = useWide();
  const reduce = useReducedMotion();
  const L = wide ? LAYOUTS.wide : LAYOUTS.narrow;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [18, -18]);
  const y2 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [34, -34]);
  const y3 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [10, -10]);
  const ys = [y1, y2, y3];

  const lines = useMemo(() => {
    const out = [];
    for (let i = 0, y = L.gap / 2; y < L.h + L.gap; i++, y += L.gap) out.push(linePath(y, i, L));
    return out;
  }, [L]);

  return (
    <div ref={ref} className={`samon ${className}`} aria-hidden="true">
      <svg viewBox={`0 0 ${L.w} ${L.h}`} preserveAspectRatio="xMidYMid slice" className="samon__svg">
        <defs>
          <filter id="samon-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" /></filter>
          <radialGradient id="samon-mochi" cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#FBF9F2" />
            <stop offset="70%" stopColor="#EFEADB" />
            <stop offset="100%" stopColor="#DAD3C0" />
          </radialGradient>
          <radialGradient id="samon-moss" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="rgba(244,240,228,0.28)" />
            <stop offset="60%" stopColor="rgba(62,90,51,0)" />
            <stop offset="100%" stopColor="rgba(47,74,42,0.55)" />
          </radialGradient>
          <mask id="samon-mask">
            <rect x="0" y="0" width={L.w} height={L.h} fill="white" />
            {L.stones.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r + s.r * 0.25 + 40} fill="black" />)}
          </mask>
        </defs>
        <g mask="url(#samon-mask)">
          <g className={reduce ? '' : 'samon__drift'} style={{ '--wave': `${L.wave}px` }}>
            {lines.map((d, i) => <path key={i} d={d} className="samon__line" />)}
          </g>
        </g>
        {L.stones.map((s, i) => (
          <g key={i} className={reduce ? '' : 'samon__rings'} style={{ transformOrigin: `${s.x}px ${s.y}px` }}>
            {[12, 24, 36].map((d, j) => (
              <ellipse key={j} cx={s.x} cy={s.y} rx={s.r + s.r * 0.25 + d - 6} ry={(s.r + s.r * 0.25 + d - 6) * 0.965} className="samon__line" />
            ))}
          </g>
        ))}
        {L.stones.map((s, i) => <Stone key={i} s={s} y={ys[i]} />)}
      </svg>
    </div>
  );
}
