import { useState } from 'react';
import { Link } from 'react-router-dom';
import View from './View.jsx';
import MenuRow from '../components/MenuRow.jsx';
import { useLang } from '../lib/LangContext.jsx';
import { useStore } from '../lib/store.js';
import { CATEGORIES, byCategory, findItem, fmtRsd, unitPrice } from '../data/menu.js';
import { currentSekki } from '../data/sekki.js';

export default function Order() {
  const { t, pick } = useLang();
  const { cart } = useStore();
  const [cat, setCat] = useState('matcha');
  const seasonalId = currentSekki().special?.itemId;
  const count = cart.reduce((n, c) => n + c.qty, 0);
  const total = cart.reduce((n, c) => n + unitPrice(findItem(c.itemId), c.choice) * c.qty, 0);

  return (
    <View title={t('app.menuTitle')}>
      <div className="app-head">
        <div>
          <h1 className="app-head__title">{t('app.menuTitle')}</h1>
          <div className="app-head__meta">{t('app.menuLede')}</div>
        </div>
      </div>
      <div className="chips" role="tablist" aria-label="Categories">
        {CATEGORIES.filter((c) => c.id !== 'shop').map((c) => (
          <button key={c.id} type="button" role="tab" aria-selected={cat === c.id} className={`chip ${cat === c.id ? 'is-active' : ''}`} onClick={() => setCat(c.id)}>
            <span className="jp" style={{ letterSpacing: '0.1em', textTransform: 'none' }}>{c.kanji}</span>{pick({ en: c.en, sr: c.sr })}
          </button>
        ))}
      </div>
      <section className="glass card" style={{ paddingTop: 4, paddingBottom: 4 }}>
        <div className="rows" style={{ borderTop: 0 }}>
          {byCategory(cat).map((item) => (
            <MenuRow key={item.id} item={item} to={`/app/order/${item.id}`} seasonal={item.id === seasonalId} />
          ))}
        </div>
      </section>
      {count > 0 && (
        <div className="sticky-cta glass glass--sm">
          <Link to="/app/cart" className="btn btn--primary btn--block"><span>{t('app.viewOrder')} · {count}</span><span className="price">{fmtRsd(total)} RSD</span></Link>
        </div>
      )}
    </View>
  );
}
