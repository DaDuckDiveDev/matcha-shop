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

// How far below the top of the screen a section should land: under the
// floating navigation, or further if the section asks for it in CSS
// (scroll-margin-top), as the menu's sections do to clear their tabs.
function offsetFor(el) {
  const own = el ? parseFloat(getComputedStyle(el).scrollMarginTop) || 0 : 0;
  if (own) return own;
  const pill = document.querySelector('.nav__pill');
  return (pill ? pill.getBoundingClientRect().bottom : 70) + 20;
}

// Scroll to an element, a selector or a pixel position.
export function scrollToTarget(target, { immediate = false } = {}) {
  if (typeof window === 'undefined') return;
  const el = typeof target === 'string' ? document.querySelector(target) : typeof target === 'number' ? null : target;
  if (typeof target !== 'number' && !el) return;
  if (lenis) {
    lenis.scrollTo(el || target, { offset: el ? -offsetFor(el) : 0, immediate, force: true });
    return;
  }
  const top = el ? el.getBoundingClientRect().top + window.scrollY - offsetFor(el) : target;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top, behavior: immediate || reduce ? 'auto' : 'smooth' });
}

export function scrollToTop({ immediate = false } = {}) {
  if (lenis) lenis.scrollTo(0, { immediate, force: true });
  else window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' });
}
