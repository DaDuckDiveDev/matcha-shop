import View from './View.jsx';
import StampCard from './StampCard.jsx';
import { useLang } from '../lib/LangContext.jsx';
import { store, useStore } from '../lib/store.js';

function guestCode(name) {
  // Stable per-phone code the counter can type in; not a security feature.
  let h = 0;
  const seed = (name || 'guest') + (localStorageSeed());
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return 'M-' + String(h % 10000).padStart(4, '0');
}
function localStorageSeed() {
  try {
    let s = localStorage.getItem('machiko.seed');
    if (!s) { s = String(Math.floor(Math.random() * 1e9)); localStorage.setItem('machiko.seed', s); }
    return s;
  } catch { return 'x'; }
}

export default function Stamps() {
  const { t } = useLang();
  const { stamps, name } = useStore();
  return (
    <View title={t('app.stamps')}>
      <div className="app-head">
        <div>
          <h1 className="app-head__title">{t('app.stamps')}</h1>
          <div className="app-head__meta">{t('home.appBody')}</div>
        </div>
      </div>
      <section className="glass card">
        <StampCard stamps={stamps} />
      </section>
      <section className="glass card ticket">
        <div className="card__kicker">{t('app.showAtCounter')}</div>
        <div className="ticket__num" style={{ fontSize: 40 }}>{guestCode(name)}</div>
        {stamps >= 10 ? (
          <button type="button" className="btn btn--primary" onClick={() => store.redeem()}>薄茶 · usucha</button>
        ) : (
          <button type="button" className="textlink" style={{ justifyContent: 'center' }} onClick={() => store.addStamp()}>{t('app.demoStamp')}</button>
        )}
      </section>
    </View>
  );
}
