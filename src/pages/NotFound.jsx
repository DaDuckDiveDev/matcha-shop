import { useLang } from '../lib/LangContext.jsx';
import { A } from '../lib/go.jsx';
import Page from '../components/Page.jsx';

export default function NotFound() {
  const { lang, t } = useLang();
  return (
    <Page title="404">
      <div className="wrap lost">
        <p className="jp d3 faint" lang="ja" aria-hidden="true">迷子</p>
        <h1 className="d1">{lang === 'sr' ? 'Ova stranica ne postoji.' : 'This page does not exist.'}</h1>
        <p className="lede">{lang === 'sr' ? 'Adresa je pogrešna ili je stranica premeštena. Meni i činija su i dalje tamo gde su bili.' : 'The address is wrong or the page has moved. The menu and the bowl are where they were.'}</p>
        <div className="hero__cta">
          <A className="btn btn--solid" to="/">{t('nav.home')}</A>
          <A className="link" to="/menu">{t('common.seeMenu')}</A>
        </div>
      </div>
    </Page>
  );
}
