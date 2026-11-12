import { useLang } from '../lib/LangContext.jsx';
import { A } from '../lib/go.jsx';
import { SHOP, isOpen } from '../data/shop.js';
import { LangToggle } from './Nav.jsx';

export default function Footer() {
  const { t } = useLang();
  const opened = isOpen();
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot__cols">
          <div className="foot__col">
            <p className="d3 serif" style={{ maxWidth: '14em' }}>{t('home.title').join(' ')}</p>
          </div>
          <div className="foot__col">
            <h2>{t('foot.visit')}</h2>
            <span>{SHOP.address || t('foot.address')}</span>
            {!SHOP.address && <span className="muted">{t('foot.addressSoon')}</span>}
            <span>{t('foot.hours')}</span>
            {!opened && <span className="muted">{t('foot.from')}</span>}
          </div>
          <div className="foot__col">
            <h2>{t('foot.explore')}</h2>
            <A to="/menu">{t('nav.menu')}</A>
            <A to="/matcha">{t('nav.matcha')}</A>
            <A to="/journal">{t('nav.journal')}</A>
            <A to="/visit">{t('nav.visit')}</A>
            <A to="/join">{t('home.ctaJoin')}</A>
          </div>
          <div className="foot__col">
            <h2>{t('foot.follow')}</h2>
            <a href={`https://www.instagram.com/${SHOP.instagram}/`} target="_blank" rel="noreferrer">Instagram</a>
            <a href={`mailto:${SHOP.email}`}>{SHOP.email}</a>
            {SHOP.phone && <a href={`tel:${SHOP.phone.replace(/\s/g, '')}`}>{SHOP.phone}</a>}
            {opened && <a href={`${import.meta.env.BASE_URL}app/`}>{t('foot.app')}</a>}
          </div>
        </div>
        <div className="foot__word" aria-hidden="true">Machiko<span className="vert">まちこ</span></div>
        <div className="foot__base">
          <span>{t('foot.rights')} · <A to="/privacy">{t('foot.privacy')}</A></span>
          <span>{t('foot.photos')}</span>
          <LangToggle />
        </div>
      </div>
    </footer>
  );
}
