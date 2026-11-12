import { useEffect, useRef, useState } from 'react';
import { createBowl } from '../gl/bowl.js';

// The bowl at the top of the home page. The tea in it is a live fluid
// simulation (see gl/bowl.js): it whisks itself once when the page opens,
// then it is the guest's to whisk, with a finger or the cursor. Where WebGL
// is not available a still bowl drawn in CSS stays in its place.
const R_LIQ = 0.8;

function Chasen() {
  // a bamboo whisk seen from above: two rings of tines around the knot
  const ring = (n, r, size, fill) => Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return <circle key={`${r}-${i}`} cx={50 + r * Math.cos(a)} cy={50 + r * Math.sin(a)} r={size} fill={fill} />;
  });
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="rgba(226, 204, 150, 0.16)" />
      {ring(36, 43, 2.5, '#E2CC96')}
      {ring(22, 27, 2.3, '#D4BB80')}
      <circle cx="50" cy="50" r="15" fill="#C9AE72" />
      <circle cx="50" cy="50" r="15" fill="none" stroke="#1D1F1A" strokeWidth="3.5" />
      <circle cx="50" cy="50" r="6" fill="#B79A5E" />
    </svg>
  );
}

export default function Bowl({ label, ready = true, onWhisked }) {
  const wrap = useRef(null);
  const canvas = useRef(null);
  const whisk = useRef(null);
  const api = useRef(null);
  const [live, setLive] = useState(false);
  const told = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.matchMedia('(max-width: 720px)').matches;
    const bowl = createBowl(canvas.current, {
      reduced,
      dye: small ? 320 : 448,
      onWork: (w) => { if (!told.current && w > 0.9) { told.current = true; onWhisked?.(); } }
    });
    api.current = bowl;
    setLive(Boolean(bowl));
    if (!bowl) return undefined;

    // the page moving under the bowl sets the tea rocking a little
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY; const dy = y - lastY; lastY = y;
      if (y < window.innerHeight && Math.abs(dy) > 2) bowl.slosh(Math.max(-60, Math.min(60, dy)) / 60);
    };
    if (!reduced) window.addEventListener('scroll', onScroll, { passive: true });

    // the whisk follows the cursor, a breath behind it
    const el = wrap.current; const tool = whisk.current;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0, on = false;
    const tick = () => {
      x += (tx - x) * 0.3; y += (ty - y) * 0.3;
      tool.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = on || Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = el.getBoundingClientRect();
      tx = e.clientX - r.left; ty = e.clientY - r.top;
      const d = Math.hypot(tx / r.width - 0.5, ty / r.height - 0.5) * 2;
      const inside = d < R_LIQ * 0.99;
      if (inside && !on) { x = tx; y = ty; }
      on = inside;
      el.classList.toggle('has-whisk', inside);
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const leave = () => { on = false; el.classList.remove('has-whisk'); };
    el.addEventListener('pointermove', move, { passive: true });
    el.addEventListener('pointerleave', leave, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(raf);
      bowl.destroy();
      api.current = null;
    };
  }, []);

  useEffect(() => { if (ready && live) api.current?.start(); }, [ready, live]);

  return (
    <div ref={wrap} className="bowl">
      <div className="bowl__still" aria-hidden="true" style={{ opacity: live ? 0 : 1 }} />
      <canvas ref={canvas} role="img" aria-label={label} />
      <div ref={whisk} className="bowl__chasen"><Chasen /></div>
    </div>
  );
}
