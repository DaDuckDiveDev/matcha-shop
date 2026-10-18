import Lenis from 'lenis';

// Smooth scrolling for the site (not the guest app). Lenis eases wheel and
// trackpad scrolling; touch scrolling stays native. Off for people who ask
// their system for less motion.
let lenis = null;
let frame = 0;

export function startSmooth() {
  if (lenis || typeof window === 'undefined') return lenis;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.9
  });
  const raf = (time) => {
    lenis?.raf(time);
    frame = requestAnimationFrame(raf);
  };
  frame = requestAnimationFrame(raf);
  return lenis;
}

export function stopSmooth() {
  cancelAnimationFrame(frame);
  lenis?.destroy();
  lenis = null;
}

export const getLenis = () => lenis;

// Pause and resume, e.g. while the menu drawer is open.
export function holdScroll(hold) {
  if (!lenis) return;
  if (hold) lenis.stop(); else lenis.start();
}

function topbarOffset() {
  const bar = document.querySelector('.topbar');
  return (bar ? bar.getBoundingClientRect().height : 60) + 12;
}

// Scroll to an element, a selector or a pixel position, under the top bar.
export function scrollToTarget(target, { immediate = false } = {}) {
  if (typeof window === 'undefined') return;
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (lenis) {
    lenis.scrollTo(typeof target === 'number' ? target : el, { offset: typeof target === 'number' ? 0 : -topbarOffset(), immediate });
    return;
  }
  const top = typeof target === 'number' ? target : (el ? el.getBoundingClientRect().top + window.scrollY - topbarOffset() : 0);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top, behavior: immediate || reduce ? 'auto' : 'smooth' });
}

export function scrollToTop({ immediate = false } = {}) {
  if (lenis) lenis.scrollTo(0, { immediate, force: true });
  else window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' });
}
