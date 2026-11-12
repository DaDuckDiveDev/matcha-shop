// The film of the website's bowl. It runs the same simulation as the home page,
// one frame at a time, so the reel and the site show the same tea.
import { createBowl } from '../src/gl/bowl.js';

const canvas = document.getElementById('bowl');
const bowl = createBowl(canvas, { dye: 448, force: true });
window.hasBowl = !!bowl;

const $ = (id) => document.getElementById(id);
const ease = (x) => { x = Math.max(0, Math.min(1, x)); return 1 - Math.pow(1 - x, 3); };
function show(el, t, at, dur = 0.8, rise = 26) {
  const k = ease((t - at) / dur);
  el.style.opacity = String(k);
  el.style.transform = `translateY(${((1 - k) * rise).toFixed(2)}px)`;
}

let started = false;
let prev = null;
// One frame of film: t is the time on screen, in seconds.
window.tick = (t) => {
  if (!started && t >= 0.7) { bowl.start(); started = true; }
  // a last slow circle, so the tea is still moving while the words stand
  if (t >= 7.2 && t <= 9.0) {
    const k = (t - 7.2) / 1.8;
    const a = Math.PI * 0.5 - k * Math.PI * 2;
    const p = [0.5 + 0.2 * Math.cos(a), 0.5 + 0.2 * Math.sin(a)];
    if (prev) bowl.stroke(p[0], p[1], p[0] - prev[0], p[1] - prev[1], 0.3);
    prev = p;
  } else prev = null;
  bowl.advance(1 / 30);
  show($('name'), t, 4.3);
  show($('line'), t, 5.0);
  show($('pill'), t, 5.7);
};
