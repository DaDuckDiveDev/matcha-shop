import { useState } from 'react';
import View from './View.jsx';
import StampCard from './StampCard.jsx';
import TierRing from './TierRing.jsx';
import { useLang } from '../lib/LangContext.jsx';
import { store, useStore } from '../lib/store.js';
import { REWARDS, RSD_PER_POINT, standing } from '../data/loyalty.js';
import { fmtRsd } from '../data/menu.js';
import { inPreview } from './AppShell.jsx';

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

const fmt = (n, lang) => n.toLocaleString(lang === 'sr' ? 'sr-Latn-RS' : 'en-GB');

export default function Stamps() {
  const { t, lang, pick } = useLang();
  const { stamps, name, points, lifetime, ledger } = useStore();
  const [claimed, setClaimed] = useState(null);
  const { tier, next, progress, toNext } = standing(lifetime);
  const demo = import.meta.env.DEV || inPreview();
  const when = (at) => new Date(at).toLocaleDateString(lang === 'sr' ? 'sr-Latn-RS' : 'en-GB', { day: 'numeric', month: 'short' });
  const rewardName = (id) => { const r = REWARDS.find((x) => x.id === id); return r ? pick(r.name) : id; };

  const redeem = (r) => { store.redeemReward(r); setClaimed(r); };

  return (
    <View title={t('app.stamps')}>
      <div className="app-head">
        <div>
          <h1 className="app-head__title">{pick({ en: 'Stamps and points', sr: 'Pečati i poeni' })}</h1>
          <div className="app-head__meta">{pick({ en: `Every drink earns a stamp. Every ${RSD_PER_POINT} RSD earns a point.`, sr: `Svako piće donosi pečat. Svakih ${RSD_PER_POINT} RSD donosi poen.` })}</div>
        </div>
      </div>

      <section className="glass glass--green card tier" data-points={points}>
        <TierRing progress={progress} kanji={tier.jp} label={pick({ en: `${pick(tier.name)} tier, ${Math.round(progress * 100)}% of the way to the next`, sr: `Nivo ${pick(tier.name)}, ${Math.round(progress * 100)}% do sledećeg` })} />
        <div className="tier__body">
          <div className="tier__kicker">{pick({ en: 'Your points', sr: 'Tvoji poeni' })}</div>
          <div className="tier__points tnum">{fmt(points, lang)}</div>
          <div className="tier__meta">
            {pick(tier.name)} <span className="jp" lang="ja">{tier.jp}</span>
            {next ? ` · ${pick({ en: `${fmt(toNext, lang)} to ${pick(next.name)}`, sr: `još ${fmt(toNext, lang)} do nivoa ${pick(next.name)}` })}` : ` · ${pick({ en: 'the highest tier', sr: 'najviši nivo' })}`}
          </div>
        </div>
      </section>

      <section className="glass card">
        <StampCard stamps={stamps} />
      </section>

      <section className="glass card ticket">
        <div className="card__kicker">{t('app.showAtCounter')}</div>
        <div className="ticket__num" style={{ fontSize: 40 }}>{guestCode(name)}</div>
        {stamps >= 10 ? (
          <button type="button" className="btn btn--primary" onClick={() => store.redeem()}>薄茶 · usucha</button>
        ) : demo && (
          <div className="demo-row">
            <button type="button" className="textlink" onClick={() => store.addStamp()}>{t('app.demoStamp')}</button>
            <button type="button" className="textlink" data-demo-purchase onClick={() => store.demoPurchase()}>{pick({ en: `Demo: add an order of ${fmtRsd(1040)} RSD`, sr: `Demo: dodaj porudžbinu od ${fmtRsd(1040)} RSD` })}</button>
          </div>
        )}
      </section>

      <section className="glass card">
        <div className="card__title">{pick({ en: 'Rewards', sr: 'Nagrade' })} <span className="jp" lang="ja" style={{ fontSize: 14, color: 'var(--uji)', marginLeft: 4 }}>御礼</span></div>
        {claimed && (
          <p className="app-preview" role="status">{pick({ en: `${pick(claimed.name)}: show this screen at the counter.`, sr: `${pick(claimed.name)}: pokaži ovaj ekran na šanku.` })}</p>
        )}
        <ul className="rewards">
          {REWARDS.map((r) => {
            const can = points >= r.cost;
            return (
              <li key={r.id} className="reward">
                <div className="reward__body">
                  <div className="reward__name">{pick(r.name)}</div>
                  <div className="card__meta">{fmt(r.cost, lang)} {pick({ en: 'points', sr: 'poena' })}</div>
                </div>
                {can
                  ? <button type="button" className="btn btn--ghost btn--sm" data-redeem={r.id} onClick={() => redeem(r)}>{pick({ en: 'Use', sr: 'Iskoristi' })}</button>
                  : <span className="card__kicker tnum">{pick({ en: `${fmt(r.cost - points, lang)} to go`, sr: `još ${fmt(r.cost - points, lang)}` })}</span>}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="glass card">
        <div className="card__title">{pick({ en: 'Activity', sr: 'Aktivnost' })}</div>
        {ledger.length === 0 ? (
          <p className="card__meta">{pick({ en: 'Your first order starts the list.', sr: 'Prva porudžbina otvara listu.' })}</p>
        ) : (
          <ul className="ledger">
            {ledger.slice(0, 12).map((e) => (
              <li key={e.id}>
                <span className="card__kicker tnum">{when(e.at)}</span>
                <span className="ledger__what">{e.kind === 'reward' ? rewardName(e.ref) : e.ref === 'demo' ? pick({ en: 'Demo order', sr: 'Demo porudžbina' }) : `${t('app.orderNumber')} ${e.ref}`}</span>
                <span className={`ledger__pts tnum ${e.pts < 0 ? 'is-spent' : ''}`}>{e.pts > 0 ? '+' : '−'}{fmt(Math.abs(e.pts), lang)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </View>
  );
}
