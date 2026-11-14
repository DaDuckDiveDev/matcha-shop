import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../lib/LangContext.jsx';
import { API } from '../lib/api.js';
import { useStore } from '../lib/store.js';
import { SHOP } from '../data/shop.js';
import { standing } from '../data/loyalty.js';
import { Mark } from '../components/Logo.jsx';
import { LangToggle } from '../components/Nav.jsx';

// The owners' dashboard. With the customer database switched on (VITE_API_URL
// at build time) it asks for the admin token and shows the real numbers from
// /api/admin/stats. Until then it shows sample numbers and says so, so the
// page can be looked at and discussed. Not linked from the site, not indexed.

const TARGET = 400;                      // sign-ups wanted by 10 March 2027
const PACE = 50;                         // a week, from 15 January

const SAMPLE = {
  totals: { signups: 137, confirmed: 104, waiting: 26, left_list: 7, sms: 41 },
  bySource: [{ source: 'instagram', n: 58 }, { source: 'story', n: 27 }, { source: 'site', n: 24 }, { source: 'tiktok', n: 16 }, { source: 'facebook', n: 12 }],
  byLang: [{ lang: 'sr', n: 96 }, { lang: 'en', n: 41 }],
  byWeek: [{ week: '2027-W05', n: 46 }, { week: '2027-W04', n: 52 }, { week: '2027-W03', n: 39 }],
  reservations: []
};

// What exists and in what state. Kept by hand: change a line when it changes.
const FEATURES = [
  ['Website, machiko.rs', 'live', { en: 'Deployed from GitHub on every push', sr: 'Objavljuje se sa GitHub-a pri svakoj izmeni' }],
  ['The bowl (WebGL fluid)', 'live', { en: 'Still bowl without graphics acceleration', sr: 'Mirna činija bez grafičkog ubrzanja' }],
  ['Founding-list form', 'waiting', { en: 'Needs the customer database switched on', sr: 'Čeka uključenje baze gostiju' }],
  ['Guest app: order ahead', 'preview', { en: 'Opens with the shop, 20 March 2027', sr: 'Otvara se kad i radnja, 20. marta 2027.' }],
  ['Guest app: stamps', 'preview', { en: 'Kept on the phone', sr: 'Čuva se na telefonu' }],
  ['Guest app: points, tiers, rewards', 'preview', { en: 'Kept on the phone; numbers are illustrative', sr: 'Čuva se na telefonu; brojevi su okvirni' }],
  ['Guest app: reservations', 'preview', { en: 'Reaches the shop once the database is on', sr: 'Stiže u radnju kad se baza uključi' }],
  ['Customer database and /admin', 'built', { en: 'Node.js and MySQL, eight steps in SiteGround', sr: 'Node.js i MySQL, osam koraka u SiteGround-u' }],
  ['Points across phones', 'planned', { en: 'Needs accounts and the database', sr: 'Traži naloge i bazu' }],
  ['WooCommerce shop', 'built', { en: 'Theme and set-up script, not yet run', sr: 'Tema i skripta, još nije pokrenuto' }],
  ['Card payments, POS', 'planned', { en: 'Bank contract and POS decision', sr: 'Ugovor sa bankom i izbor kase' }],
  ['Apps in the App Store and Google Play', 'planned', { en: 'After the web app has run a month', sr: 'Kad veb aplikacija odradi mesec dana' }]
];
const STATE = {
  live: { en: 'Live', sr: 'Radi' }, preview: { en: 'Preview', sr: 'Probno' }, waiting: { en: 'Waiting', sr: 'Čeka' },
  built: { en: 'Built, not on', sr: 'Napravljeno' }, planned: { en: 'Planned', sr: 'U planu' }
};

const TOKEN_KEY = 'machiko.admin';

function WeekBars({ weeks, label, paceLabel, locale }) {
  const [at, setAt] = useState(weeks.length - 1);
  // Drawn at the size it is shown, so the labels stay readable on a phone.
  const [narrow, setNarrow] = useState(() => window.matchMedia('(max-width: 699px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 699px)');
    const on = () => setNarrow(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  const W = narrow ? 340 : 640, H = narrow ? 210 : 230, L = 30, R = 8, T = 26, B = 30;
  const max = Math.max(PACE, ...weeks.map((w) => w.n)) * 1.18 || 1;
  const band = (W - L - R) / Math.max(weeks.length, 1);
  const bw = Math.min(44, band - 2);
  const y = (v) => T + (H - T - B) * (1 - v / max);
  const ticks = [0, Math.round(max / 2 / 10) * 10, Math.round(max / 10) * 10].filter((v, i, a) => a.indexOf(v) === i && v <= max);
  return (
    <figure className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
        {ticks.map((v) => (
          <g key={v}><line x1={L} x2={W - R} y1={y(v)} y2={y(v)} className="chart__grid" /><text x={L - 8} y={y(v)} className="chart__tick" textAnchor="end" dominantBaseline="middle">{v}</text></g>
        ))}
        <line x1={L} x2={W - R} y1={y(PACE)} y2={y(PACE)} className="chart__pace" />
        <text x={W - R} y={y(PACE) - 7} className="chart__tick" textAnchor="end">{paceLabel}</text>
        {weeks.map((w, i) => {
          const x = L + band * i + (band - bw) / 2;
          const h = Math.max(1, y(0) - y(w.n));
          const r = Math.min(4, h, bw / 2);
          return (
            <g key={w.week} onMouseEnter={() => setAt(i)} onFocus={() => setAt(i)} tabIndex={0} role="listitem" aria-label={`${w.week}: ${w.n}`} className="chart__col">
              <rect x={L + band * i} y={T} width={band} height={H - T - B} fill="transparent" />
              <path d={`M${x} ${y(0)} V${y(w.n) + r} Q${x} ${y(w.n)} ${x + r} ${y(w.n)} H${x + bw - r} Q${x + bw} ${y(w.n)} ${x + bw} ${y(w.n) + r} V${y(0)} Z`} className={`chart__bar ${i === at ? 'is-at' : ''}`} />
              {i === at && <text x={x + bw / 2} y={y(w.n) - 8} textAnchor="middle" className="chart__value">{w.n.toLocaleString(locale)}</text>}
              <text x={x + bw / 2} y={H - 10} textAnchor="middle" className="chart__tick">{w.week.replace(/^\d{4}-W0?/, 'W')}</text>
            </g>
          );
        })}
        <line x1={L} x2={W - R} y1={y(0)} y2={y(0)} className="chart__axis" />
      </svg>
    </figure>
  );
}

export default function Dashboard() {
  const { lang, pick } = useLang();
  const guest = useStore();
  const locale = lang === 'sr' ? 'sr-Latn-RS' : 'en-GB';
  const n = (v) => Number(v || 0).toLocaleString(locale);
  const [token, setToken] = useState(() => { try { return sessionStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; } });
  const [typed, setTyped] = useState('');
  const [live, setLive] = useState(null);
  const [state, setState] = useState(API ? 'locked' : 'sample');   // sample | locked | loading | live | refused | unreachable

  useEffect(() => {
    document.title = 'Dashboard — Machiko';
    document.body.classList.add('app');
    document.body.classList.remove('site');
    const meta = document.createElement('meta');
    meta.name = 'robots'; meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => { document.body.classList.remove('app'); meta.remove(); };
  }, []);

  useEffect(() => {
    if (!API || !token) return;
    let off = false;
    setState('loading');
    fetch(`${API}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        if (off) return;
        if (res.status === 401) { setState('refused'); try { sessionStorage.removeItem(TOKEN_KEY); } catch { /* private mode */ } return; }
        const data = await res.json();
        if (!res.ok || !data.ok) { setState('unreachable'); return; }
        setLive(data); setState('live');
      })
      .catch(() => { if (!off) setState('unreachable'); });
    return () => { off = true; };
  }, [token]);

  const unlock = (e) => {
    e.preventDefault();
    const v = typed.trim();
    if (!v) return;
    try { sessionStorage.setItem(TOKEN_KEY, v); } catch { /* private mode */ }
    setTyped(''); setToken(v);
  };

  const real = state === 'live';
  const data = real ? live : SAMPLE;
  const weeks = useMemo(() => [...(data.byWeek || [])].reverse().map((w) => ({ week: String(w.week), n: Number(w.n) || 0 })), [data]);
  const sources = (data.bySource || []).map((s) => ({ source: s.source || '—', n: Number(s.n) || 0 }));
  const topSource = Math.max(1, ...sources.map((s) => s.n));
  const total = Number(data.totals?.signups) || 0;
  const daysToOpen = Math.max(0, Math.ceil((SHOP.opening - new Date()) / 86400000));
  const { tier } = standing(guest.lifetime);
  const spent = guest.lifetime - guest.points;

  const tiles = [
    [n(total), pick({ en: 'On the founding list', sr: 'Na listi prvih gostiju' }), pick({ en: `${Math.round((total / TARGET) * 100)}% of ${TARGET} by 10 March`, sr: `${Math.round((total / TARGET) * 100)}% od ${TARGET} do 10. marta` })],
    [n(data.totals?.confirmed), pick({ en: 'Confirmed by email', sr: 'Potvrdilo emailom' }), total ? pick({ en: `${Math.round((data.totals.confirmed / total) * 100)}% of sign-ups`, sr: `${Math.round((data.totals.confirmed / total) * 100)}% prijava` }) : ''],
    [n(data.totals?.sms), pick({ en: 'Agreed to SMS', sr: 'Pristalo na SMS' }), pick({ en: `${n(data.totals?.waiting)} still to confirm`, sr: `${n(data.totals?.waiting)} još nije potvrdilo` })],
    [n(daysToOpen), pick({ en: 'Days to opening', sr: 'Dana do otvaranja' }), pick({ en: 'Saturday 20 March 2027', sr: 'subota, 20. mart 2027.' })]
  ];

  return (
    <div className="dash">
      <header className="dash__top">
        <Link to="/" className="brand" aria-label="Machiko"><Mark size={24} /><span>Machiko</span></Link>
        <LangToggle />
      </header>

      <div className="dash__head">
        <h1 className="d3">{pick({ en: 'Dashboard', sr: 'Pregled' })}</h1>
        <p className="small muted">{pick({ en: 'The founding list, the guest app and what is switched on.', sr: 'Lista prvih gostiju, aplikacija i šta je uključeno.' })}</p>
      </div>

      {!real && (
        <p className="dash__note" role="note" data-dash-state={state}>
          <strong>{pick({ en: 'Sample numbers.', sr: 'Primer brojeva.' })}</strong>{' '}
          {state === 'sample' && pick({ en: 'The customer database is not switched on, so nothing in the first two rows is real yet. They become real once the API runs on SiteGround and API_URL is set in GitHub.', sr: 'Baza gostiju nije uključena, pa prva dva reda još nisu stvarna. Postaju stvarna kad API proradi na SiteGround-u i API_URL bude postavljen u GitHub-u.' })}
          {state === 'locked' && pick({ en: 'Enter the admin token to see the real ones.', sr: 'Unesi admin token da vidiš prave.' })}
          {state === 'loading' && pick({ en: 'Asking the database…', sr: 'Pitam bazu…' })}
          {state === 'refused' && pick({ en: 'That token was not accepted.', sr: 'Taj token nije prihvaćen.' })}
          {state === 'unreachable' && <>{pick({ en: 'The database did not answer from this page. Its own page works either way: ', sr: 'Baza nije odgovorila sa ove strane. Njena strana radi u svakom slučaju: ' })}<a href={`${API}/admin`}>{API}/admin</a></>}
        </p>
      )}

      {API && !real && state !== 'loading' && (
        <form className="dash__unlock" onSubmit={unlock}>
          <label className="field"><span className="field__label">{pick({ en: 'Admin token', sr: 'Admin token' })}</span>
            <input type="password" autoComplete="off" value={typed} onChange={(e) => setTyped(e.target.value)} /></label>
          <button className="btn btn--solid" type="submit">{pick({ en: 'Open', sr: 'Otvori' })}</button>
        </form>
      )}

      <dl className="tiles tiles--4">
        {tiles.map(([v, k, sub]) => <div key={k} className="glass tile"><dd className="tnum">{v}</dd><dt>{k}</dt>{sub && <span className="tile__sub">{sub}</span>}</div>)}
      </dl>

      <div className="dash__grid">
        <section className="glass card">
          <h2 className="card__title">{pick({ en: 'Sign-ups by week', sr: 'Prijave po nedeljama' })}</h2>
          {weeks.length ? (
            <>
              <WeekBars weeks={weeks} locale={locale} label={pick({ en: 'Sign-ups to the founding list, by week', sr: 'Prijave na listu, po nedeljama' })} paceLabel={pick({ en: `pace ${PACE} a week`, sr: `tempo ${PACE} nedeljno` })} />
              <details className="dash__table">
                <summary>{pick({ en: 'As a table', sr: 'Kao tabela' })}</summary>
                <table><thead><tr><th>{pick({ en: 'Week', sr: 'Nedelja' })}</th><th>{pick({ en: 'Sign-ups', sr: 'Prijave' })}</th></tr></thead>
                  <tbody>{weeks.map((w) => <tr key={w.week}><td>{w.week}</td><td className="tnum">{n(w.n)}</td></tr>)}</tbody></table>
              </details>
            </>
          ) : <p className="card__meta">{pick({ en: 'No sign-ups yet.', sr: 'Još nema prijava.' })}</p>}
        </section>

        <section className="glass card">
          <h2 className="card__title">{pick({ en: 'Where they came from', sr: 'Odakle dolaze' })}</h2>
          <ul className="hbars">
            {sources.map((s) => (
              <li key={s.source}>
                <span className="hbars__name">{s.source}</span>
                <span className="hbars__track"><span className="hbars__bar" style={{ width: `${(s.n / topSource) * 100}%` }} /></span>
                <span className="hbars__n tnum">{n(s.n)}</span>
              </li>
            ))}
          </ul>
          <p className="card__meta">{(data.byLang || []).map((l) => `${String(l.lang).toUpperCase()} ${n(l.n)}`).join(' · ')}</p>
        </section>

        <section className="glass card">
          <h2 className="card__title">{pick({ en: 'Guest app on this device', sr: 'Aplikacija na ovom uređaju' })}</h2>
          <p className="card__meta">{pick({ en: 'Real, but only this browser: orders, stamps and points live on each phone until guests have accounts.', sr: 'Stvarno, ali samo ovaj pregledač: porudžbine, pečati i poeni su na svakom telefonu dok gosti ne dobiju naloge.' })}</p>
          <dl className="pairs">
            <div><dt>{pick({ en: 'Orders placed', sr: 'Porudžbina' })}</dt><dd className="tnum">{n(guest.orders.length)}</dd></div>
            <div><dt>{pick({ en: 'Points earned', sr: 'Zarađeno poena' })}</dt><dd className="tnum">{n(guest.lifetime)}</dd></div>
            <div><dt>{pick({ en: 'Points used', sr: 'Iskorišćeno poena' })}</dt><dd className="tnum">{n(spent)}</dd></div>
            <div><dt>{pick({ en: 'Stamps', sr: 'Pečata' })}</dt><dd className="tnum">{Math.min(guest.stamps, 10)}/10</dd></div>
            <div><dt>{pick({ en: 'Tier', sr: 'Nivo' })}</dt><dd>{pick(tier.name)} <span className="jp" lang="ja">{tier.jp}</span></dd></div>
            <div><dt>{pick({ en: 'Reservation requests', sr: 'Zahteva za rezervaciju' })}</dt><dd className="tnum">{n(guest.reservations.length)}</dd></div>
          </dl>
          <a className="link small" href={`${import.meta.env.BASE_URL}app/stamps`}>{pick({ en: 'Open the guest app', sr: 'Otvori aplikaciju' })}</a>
        </section>

        <section className="glass card">
          <h2 className="card__title">{pick({ en: 'Reservations ahead', sr: 'Predstojeće rezervacije' })}</h2>
          {(data.reservations || []).length ? (
            <ul className="ledger">
              {data.reservations.slice(0, 8).map((r) => (
                <li key={r.id}><span className="card__kicker tnum">{String(r.on_date).slice(0, 10)}</span><span className="ledger__what">{String(r.at_time).slice(0, 5)} · {r.name} · {r.guests}</span><span className="card__kicker">{r.kind}</span></li>
              ))}
            </ul>
          ) : <p className="card__meta">{pick({ en: 'None yet. Requests from the app arrive here once the database is on.', sr: 'Još nema. Zahtevi iz aplikacije stižu ovde kad se baza uključi.' })}</p>}
        </section>

        <section className="glass card dash__wide">
          <h2 className="card__title">{pick({ en: 'What is switched on', sr: 'Šta je uključeno' })}</h2>
          <ul className="features">
            {FEATURES.map(([name, st, note]) => (
              <li key={name}>
                <span className="features__name">{name}</span>
                <span className={`state state--${st}`}>{pick(STATE[st])}</span>
                <span className="card__meta">{pick(note)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
