import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { useLang } from '../lib/LangContext.jsx';
import { useStore } from '../lib/store.js';
import { Mark } from '../components/Logo.jsx';
import { LangToggle } from '../components/TopBar.jsx';
import { IconCalendar, IconCup, IconStamp, IconSun } from '../components/Icons.jsx';
import { alt, src } from '../data/images.js';

// The guest app shell: a blurred photograph behind, frosted glass in front,
// four tabs. Everything inside is a view, so the PWA opens straight here.
export default function AppShell() {
  const { t } = useLang();
  const { cart, stamps } = useStore();
  const location = useLocation();
  const count = cart.reduce((n, c) => n + c.qty, 0);

  useEffect(() => {
    document.body.classList.add('app');
    document.body.classList.remove('site');
    return () => { document.body.classList.remove('app'); document.body.classList.add('site'); };
  }, []);

  return (
    <div className="app-shell">
      <div className="app-bg" aria-hidden="true">
        <img src={src('tatamiShoji', 1200)} alt={alt('tatamiShoji')} />
      </div>
      <div className="app-main">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" className="wordmark" aria-label="Machiko website"><Mark size={24} /><span className="wordmark__latin" style={{ fontSize: 15 }}>MACHIKO</span></Link>
          <LangToggle />
        </div>
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </div>
      <nav className="app-nav" aria-label="Guest app">
        <NavLink to="/app" end><IconSun />{t('app.today')}</NavLink>
        <NavLink to="/app/order">
          <IconCup />{t('app.order')}
          {count > 0 && <span className="app-nav__badge">{count}</span>}
        </NavLink>
        <NavLink to="/app/stamps">
          <IconStamp />{t('app.stamps')}
          {stamps >= 10 && <span className="app-nav__dot" />}
        </NavLink>
        <NavLink to="/app/reserve"><IconCalendar />{t('app.reserve')}</NavLink>
      </nav>
    </div>
  );
}
