import { Link, useNavigate } from 'react-router-dom';
import View from './View.jsx';
import StampCard from './StampCard.jsx';
import { useLang } from '../lib/LangContext.jsx';
import { store, useInstallPrompt, useStore } from '../lib/store.js';
import { currentSekki, fmtRange } from '../data/sekki.js';
import { defaultChoice, findItem, fmtRsd, unitPrice } from '../data/menu.js';
import { alt, src } from '../data/images.js';
import { IconArrow } from '../components/Icons.jsx';

function greetingKey(h) {
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}

export default function Today() {
  const { t, lang, pick } = useLang();
  const { name, stamps, lastOrder } = useStore();
  const { canInstall, installed, install } = useInstallPrompt();
  const navigate = useNavigate();
  const now = new Date();
  const h = now.getHours();
  const open = h >= 8 && h < 20;
  const sekki = currentSekki(now);
  const special = sekki.special;
  const specialItem = special ? findItem(special.itemId) : null;
  const usual = lastOrder?.items?.[0] ? { item: findItem(lastOrder.items[0].itemId), choice: lastOrder.items[0].choice } : { item: findItem('matcha-latte'), choice: defaultChoice(findItem('matcha-latte')) };
  const dateStr = now.toLocaleDateString(lang === 'sr' ? 'sr-Latn-RS' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  const reorder = () => {
    store.addToCart(usual.item.id, usual.choice, 1);
    navigate('/app/cart');
  };

  return (
    <View title={t('app.today')}>
      <div className="app-head">
        <div>
          <div className="app-head__date">{dateStr}</div>
          <h1 className="app-head__title">{t(`app.greeting.${greetingKey(h)}`)}{name ? `, ${name}` : ''}.</h1>
          <div className="app-head__meta"><span className="jp" style={{ color: 'var(--uji)' }}>{sekki.kanji}</span> {lang === 'sr' ? sekki.sr : sekki.en} · {open ? t('app.openUntil') : t('app.closedNow')}{open ? ` · ${t('app.quiet')}` : ''}</div>
        </div>
      </div>

      <section className="glass card">
        <StampCard stamps={stamps} />
      </section>

      <section className="glass card card--row">
        <img className="card__img" src={src(usual.item.img, 240)} alt={alt(usual.item.img)} />
        <div className="card__body">
          <div className="card__kicker">{t('app.yourUsual')}</div>
          <div className="card__title">{pick(usual.item.name)}</div>
          <div className="card__meta">{lastOrder ? `${t('app.lastTime')} · ` : ''}{fmtRsd(unitPrice(usual.item, usual.choice))} RSD</div>
        </div>
        <button type="button" className="btn btn--primary" style={{ height: 44, padding: '0 16px' }} onClick={reorder}>{t('app.reorder')}</button>
      </section>

      <Link to={specialItem ? `/app/order/${specialItem.id}` : '/app/order'} className="glass glass--sm card card--row" style={{ textDecoration: 'none', color: 'inherit', background: 'rgba(227, 231, 207, 0.7)' }}>
        <div className="jp" style={{ fontSize: 28, fontWeight: 700, color: 'var(--uji)', lineHeight: 1 }}>{sekki.kanji}</div>
        <div className="card__body">
          <div className="card__kicker">{t('season.fortnight')} · {fmtRange(sekki.start, sekki.end, lang)}</div>
          <div className="card__title" style={{ fontSize: 17 }}>{special ? (lang === 'sr' ? special.sr : special.en) : t('season.fallback')}</div>
        </div>
        <span className="icon-btn" aria-hidden="true" style={{ color: 'var(--uji)' }}><IconArrow /></span>
      </Link>

      <Link to="/app/reserve" className="glass card card--row" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="card__body">
          <div className="card__kicker">{t('app.workshop')} · <span className="jp">点前</span></div>
          <div className="card__title">{t('visit.workshops')[0][0]}</div>
          <div className="card__meta">{t('app.seatsLeft', 2)}</div>
        </div>
        <span className="btn btn--ghost" style={{ height: 44, padding: '0 16px' }}>{t('app.reserve')}</span>
      </Link>

      {!installed && (
        <section className="glass glass--sm card card--row" style={{ padding: '12px 16px' }}>
          <div className="card__body">
            <div className="card__title" style={{ fontSize: 16 }}>{t('app.installTitle')}</div>
            <div className="card__meta">{t('app.installBody')}</div>
          </div>
          {canInstall ? (
            <button type="button" className="btn btn--ghost" style={{ height: 44, padding: '0 16px' }} onClick={install}>{t('app.install')}</button>
          ) : (
            <span className="card__kicker" style={{ textAlign: 'right', maxWidth: 110 }}>Share → Add to Home Screen</span>
          )}
        </section>
      )}
    </View>
  );
}
