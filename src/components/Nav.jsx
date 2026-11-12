import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLang } from '../lib/LangContext.jsx';
import { A, isHere } from '../lib/go.jsx';
import { holdScroll } from '../lib/smooth.js';
import { SHOP, isOpen } from '../data/shop.js';
import { Mark } from './Logo.jsx';

export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="lang" role="group" aria-label="Language / Jezik">
      <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
      <button type="button" aria-pressed={lang === 'sr'} onClick={() => setLang('sr')}>SR</button>
    </div>
  );
}

const LINKS = [
  ['/menu', 'nav.menu', '品書'],
  ['/matcha', 'nav.matcha', '抹茶'],
  ['/journal', 'nav.journal', '物語'],
  ['/visit', 'nav.visit', '案内']
];

// One floating pill: the name, four places to go, and the thing we would
// most like you to do. On a phone the four places open as a full page.
export default function Nav() {
  const { t } = useLang();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const opened = isOpen();

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    holdScroll(open);
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (!open) return undefined;
    const esc = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const cta = opened
    ? <a className="btn btn--solid btn--sm" href={`${import.meta.env.BASE_URL}app/order`}>{t('nav.order')}</a>
    : <A className="btn btn--solid btn--sm" to="/join">{t('nav.join')}</A>;

  return (
    <>
      <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
        <div className="nav__pill">
          <A to="/" className="brand" aria-label="Machiko"><Mark size={26} /><span>Machiko</span></A>
          <nav className="nav__links" aria-label="Machiko">
            {LINKS.map(([to, key]) => <A key={to} to={to} aria-current={isHere(pathname, to) ? 'page' : undefined}>{t(key)}</A>)}
          </nav>
          <div className="nav__right">
            <LangToggle />
            {cta}
            <button type="button" className="burger" aria-expanded={open} aria-controls="sheet" aria-label={open ? t('nav.close') : t('nav.open')} onClick={() => setOpen((v) => !v)}>
              <span /><span />
            </button>
          </div>
        </div>
      </header>
      <div id="sheet" className={`sheet ${open ? 'is-open' : ''}`} aria-hidden={!open} inert={open ? undefined : ''}>
        <nav className="sheet__links" aria-label="Machiko">
          {LINKS.map(([to, key, jp], i) => (
            <A key={to} to={to} style={{ '--i': i }} aria-current={isHere(pathname, to) ? 'page' : undefined} onClick={() => setOpen(false)}>
              {t(key)}<span className="jp" aria-hidden="true">{jp}</span>
            </A>
          ))}
        </nav>
        <div className="sheet__foot">
          <div className="sheet__meta">
            <span>{opened ? t('home.openNow') : t('home.opening')}</span>
            <span>{SHOP.address || t('common.address')}</span>
            <a href={`https://www.instagram.com/${SHOP.instagram}/`} target="_blank" rel="noreferrer">@{SHOP.instagram}</a>
          </div>
          <LangToggle />
        </div>
      </div>
    </>
  );
}
