import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useLang } from '../lib/LangContext.jsx';
import { Mark } from './Logo.jsx';
import { IconClose, IconMenu } from './Icons.jsx';
import { holdScroll } from '../lib/smooth.js';

export function LangToggle({ className = 'lang' }) {
  const { lang, setLang } = useLang();
  const next = lang === 'en' ? 'sr' : 'en';
  return (
    <button type="button" className={className} onClick={() => setLang(next)} aria-label={lang === 'en' ? 'Prebaci na srpski' : 'Switch to English'}>
      {lang === 'en' ? <><b>EN</b> · SR</> : <>EN · <b>SR</b></>}
    </button>
  );
}

const links = [
  { to: '/menu', key: 'nav.menu', jp: '献立' },
  { to: '/matcha', key: 'nav.matcha', jp: '抹茶' },
  { to: '/journal', key: 'nav.journal', jp: '物語' },
  { to: '/visit', key: 'nav.visit', jp: '訪問' },
  { to: '/app', key: 'nav.app', jp: '注文' }
];

export default function TopBar({ overHero = false }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const location = useLocation();

  useEffect(() => { setOpen(false); }, [location.pathname]);
  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    holdScroll(open);
    return () => { document.body.style.overflow = ''; holdScroll(false); };
  }, [open]);

  const over = overHero && atTop;

  return (
    <>
      <header className={`topbar ${over ? 'topbar--over' : ''}`}>
        <Link to="/" className="wordmark" aria-label="Machiko home">
          <Mark size={26} cream={over} />
          <span className="wordmark__latin">MACHIKO</span>
        </Link>
        <nav className="nav-desktop" aria-label="Primary">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to}>{t(l.key)}</NavLink>
          ))}
        </nav>
        <div className="topbar__right">
          <LangToggle />
          <button type="button" className="icon-btn menu-button" aria-label={open ? t('common.close') : 'Open menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="drawer"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: [0.2, 0.7, 0.2, 1] }}
            role="dialog"
            aria-modal="true"
          >
            <div className="drawer__top">
              <Link to="/" className="wordmark"><Mark size={26} cream /><span className="wordmark__latin">MACHIKO</span></Link>
              <button type="button" className="icon-btn" aria-label={t('common.close')} onClick={() => setOpen(false)}><IconClose /></button>
            </div>
            <ul className="drawer__list">
              {[{ to: '/', key: 'nav.home', jp: '家' }, ...links, { to: '/join', key: 'nav.join', jp: '暖簾' }].map((l, i) => (
                <motion.li key={l.to} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + i * 0.05 }}>
                  <Link to={l.to}>{t(l.key)}<span className="jp">{l.jp}</span></Link>
                </motion.li>
              ))}
            </ul>
            <div className="drawer__foot">
              <span>{t('common.openDaily')}</span>
              <LangToggle className="lang on-green" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
