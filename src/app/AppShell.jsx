import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { useLang } from '../lib/LangContext.jsx';
import { useStore } from '../lib/store.js';
import { Mark } from '../components/Logo.jsx';
import { LangToggle } from '../components/Nav.jsx';
import { IconCalendar, IconCup, IconStamp, IconSun } from '../components/Icons.jsx';

// The guest app shell: paper, white cards and four tabs in a floating bar. Everything inside is a view, so the PWA opens straight here.
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
      <div className="app-main">
        <div className="app-top">
          <Link to="/" className="brand" aria-label="Machiko"><Mark size={24} /><span>Machiko</span></Link>
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
