import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useLang } from './lib/LangContext.jsx';
import Nav from './components/Nav.jsx';
import Home from './pages/Home.jsx';
import Menu from './pages/Menu.jsx';
import Matcha from './pages/Matcha.jsx';
import Visit from './pages/Visit.jsx';
import NotFound from './pages/NotFound.jsx';
import Journal from './pages/Journal.jsx';
import Story from './pages/Story.jsx';
import Join from './pages/Join.jsx';
import Privacy from './pages/Privacy.jsx';
import { startSmooth, stopSmooth } from './lib/smooth.js';
import AppShell from './app/AppShell.jsx';
import Today from './app/Today.jsx';
import Order from './app/Order.jsx';
import Customize from './app/Customize.jsx';
import Cart from './app/Cart.jsx';
import Status from './app/Status.jsx';
import Stamps from './app/Stamps.jsx';
import Reserve from './app/Reserve.jsx';

function Site() {
  const location = useLocation();
  const { t } = useLang();
  useEffect(() => {
    document.body.classList.add('site');
    startSmooth();
    return () => { stopSmooth(); document.body.classList.remove('site'); };
  }, []);
  return (
    <>
      <a className="skip" href="#main">{t('nav.skip')}</a>
      <Nav />
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/matcha" element={<Matcha />} />
        <Route path="/visit" element={<Visit />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/journal/:slug" element={<Story />} />
        <Route path="/join" element={<Join />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default function App() {
  const location = useLocation();
  if (location.pathname.startsWith('/app')) {
    return (
      <Routes>
        <Route path="/app" element={<AppShell />}>
          <Route index element={<Today />} />
          <Route path="order" element={<Order />} />
          <Route path="order/:id" element={<Customize />} />
          <Route path="cart" element={<Cart />} />
          <Route path="status/:id" element={<Status />} />
          <Route path="stamps" element={<Stamps />} />
          <Route path="reserve" element={<Reserve />} />
        </Route>
      </Routes>
    );
  }
  return <Site />;
}
