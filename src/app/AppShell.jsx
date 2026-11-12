import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { useLang } from '../lib/LangContext.jsx';
import { useStore } from '../lib/store.js';
import { Mark } from '../components/Logo.jsx';
import { LangToggle } from '../components/Nav.jsx';
import { IconCalendar, IconCup, IconStamp, IconSun } from '../components/Icons.jsx';
import { isOpen } from '../data/shop.js';

// Before opening day the app takes no orders: it says when it opens and
// points to the founding list. "Look around the preview" lets us (and anyone
// curious) try it; a banner then says nothing is sent to the shop.
const PREVIEW = 'machiko.preview';
export const inPreview = () => { try { return !isOpen() && sessionStorage.getItem(PREVIEW) === '1'; } catch { return false; } };

// The guest app shell: paper, white cards and four tabs in a floating bar. Everything inside is a view, so the PWA opens straight here.
export default function AppShell() {
  const { t } = useLang();
  const { cart, stamps } = useStore();
  const location = useLocation();
  const count = cart.reduce((n, c) => n + c.qty, 0);
  const opened = isOpen();
  const [preview, setPreview] = useState(inPreview);
  const startPreview = () => { try { sessionStorage.setItem(PREVIEW, '1'); } catch { /* private mode */ } setPreview(true); };

  useEffect(() => {
    document.body.classList.add('app');
    document.body.classList.remove('site');
    return () => { document.body.classList.remove('app'); document.body.classList.add('site'); };
  }, []);

  const top = (
    <div className="app-top">
      <Link to="/" className="brand" aria-label="Machiko"><Mark size={24} /><span>Machiko</span></Link>
      <LangToggle />
    </div>
  );

  if (!opened && !preview) {
    return (
      <div className="app-shell">
        <main className="app-main" data-app-closed>
          {top}
          <div className="app-closed">
            <span className="jp" lang="ja" aria-hidden="true">準備中</span>
            <h1 className="d2">{t('app.closedTitle')}</h1>
            <p className="lede">{t('app.closedBody')}</p>
            <Link className="btn btn--solid" to="/join">{t('home.ctaJoin')}</Link>
            <button type="button" className="link" data-app-preview onClick={startPreview}>{t('app.closedPreview')}</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <main className="app-main">
        {top}
        {!opened && <p className="app-preview" role="note">{t('app.previewNote')}</p>}
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </main>
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
