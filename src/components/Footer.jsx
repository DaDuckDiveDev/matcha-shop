import { Link } from 'react-router-dom';
import { useLang } from '../lib/LangContext.jsx';
import { LangToggle } from './TopBar.jsx';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="foot on-green" id="visit">
      <div className="foot__inner">
        <div className="eyebrow"><span className="jp">訪問</span><span>— {t('home.visitEyebrow')}</span></div>
        <h2 className="h2">{t('home.visitTitle')}</h2>
        <div className="foot__lines">
          <div>{t('common.address')}</div>
          <div>{t('common.openDaily')}</div>
          <div className="tnum">{t('common.phone')}</div>
          <div>{t('common.instagram')}</div>
          <div style={{ marginTop: 10 }}><Link to="/visit" className="textlink">{t('nav.visit')} →</Link></div>
        </div>
        <div className="foot__row">
          <span>{t('common.copyright')}</span>
          <span style={{ display: 'inline-flex', gap: 18, alignItems: 'center' }}>
            <Link to="/app">{t('nav.app')}</Link>
            <LangToggle />
          </span>
        </div>
      </div>
    </footer>
  );
}
