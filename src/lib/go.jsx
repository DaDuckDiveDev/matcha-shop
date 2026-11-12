import { useCallback } from 'react';
import { flushSync } from 'react-dom';
import { useHref, useLocation, useNavigate } from 'react-router-dom';
import { scrollToTarget, scrollToTop } from './smooth.js';

// Moving between pages. Where the browser supports view transitions the old
// page fades as the new one arrives, and a photograph you tapped can grow
// into the next page's main picture (pass `morph`). Everywhere else, and for
// people who ask for less motion, the page simply changes.
const calm = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// After the page has changed: go to the #section asked for, or to the top.
export function settle(hash) {
  const el = hash ? document.getElementById(hash.replace('#', '')) : null;
  if (el) scrollToTarget(el, { immediate: true });
  else scrollToTop({ immediate: true });
}

export function useGo() {
  const navigate = useNavigate();
  return useCallback((to, { morph = null, replace = false } = {}) => {
    const at = String(to).indexOf('#');
    const hash = at >= 0 ? String(to).slice(at) : '';
    const commit = () => { flushSync(() => navigate(to, { replace })); settle(hash); };
    if (!document.startViewTransition || calm()) { commit(); return; }
    if (morph) morph.style.viewTransitionName = 'media';
    const vt = document.startViewTransition(() => {
      commit();
      if (morph) document.documentElement.dataset.morph = '1';
    });
    vt.finished.finally(() => {
      delete document.documentElement.dataset.morph;
      if (morph?.isConnected) morph.style.viewTransitionName = '';
    });
  }, [navigate]);
}

// A link inside the site. Same markup as any <a>, so it can be opened in a
// new tab, copied or read by a screen reader like any other.
export function A({ to, morph = false, onClick, children, ...rest }) {
  const href = useHref(to);
  const go = useGo();
  const { pathname } = useLocation();
  const click = (e) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const [path, hash] = String(to).split('#');
    if (path === pathname || path === '') {
      if (hash) scrollToTarget(`#${hash}`); else scrollToTop();
      return;
    }
    go(to, { morph: morph ? e.currentTarget.querySelector('[data-morph]') : null });
  };
  return <a href={href} onClick={click} {...rest}>{children}</a>;
}

export const isHere = (pathname, to) => (to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`));
