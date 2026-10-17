import { NavLink } from 'react-router-dom';
import { useLang } from '../lib/LangContext.jsx';
import { IconCup, IconList, IconPin, IconStamp } from './Icons.jsx';

export default function BottomBar() {
  const { t } = useLang();
  return (
    <nav className="bottombar" aria-label="Primary, mobile">
      <NavLink to="/menu"><IconList />{t('nav.menu')}</NavLink>
      <NavLink to="/app/order"><IconCup />{t('nav.order')}</NavLink>
      <NavLink to="/app/stamps"><IconStamp />{t('nav.stamps')}</NavLink>
      <NavLink to="/visit"><IconPin />{t('nav.visit')}</NavLink>
    </nav>
  );
}
