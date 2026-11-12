import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTarget } from '../lib/smooth.js';

// Every page: sets the tab title, and if the address carries a #section
// (a link from outside, or a reload) goes to it once the page is laid out.
export default function Page({ title, children, className = '' }) {
  const { hash } = useLocation();
  useEffect(() => { document.title = title ? `${title} — Machiko` : 'Machiko — matcha house, Belgrade'; }, [title]);
  useEffect(() => {
    if (!hash) return undefined;
    const id = setTimeout(() => { const el = document.getElementById(hash.slice(1)); if (el) scrollToTarget(el, { immediate: true }); }, 60);
    return () => clearTimeout(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <main id="main" className={className}>{children}</main>;
}
