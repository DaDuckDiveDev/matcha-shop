import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLang } from '../lib/LangContext.jsx';
import Page from '../components/Page.jsx';
import Footer from '../components/Footer.jsx';
import { A } from '../lib/go.jsx';
import { IconArrow } from '../components/Icons.jsx';
import { API, postJson } from '../lib/api.js';

// The founding list. The QR codes on the window poster and the flyers open
// this page (machiko.rs/join). Sign-ups go to the shop's own API
// (VITE_API_URL), which stores them with the consent given and sends an
// email to confirm. The links in that email come back here with
// ?confirmed=1 or ?unsubscribed=1. Without the API it posts to the Brevo
// form in VITE_JOIN_ENDPOINT; with neither it says it is not connected.
// Two separate, unticked boxes: one for email, one for SMS (Serbian
// e-commerce law needs prior consent).
const ENDPOINT = import.meta.env.VITE_JOIN_ENDPOINT || '';

export default function Join() {
  const { t, lang } = useLang();
  const [params] = useSearchParams();
  const source = useMemo(() => (params.get('src') || 'website').slice(0, 30), [params]);
  // idle | sending | done (check your inbox) | confirmed | already | expired | left | error
  const [state, setState] = useState(() => {
    if (params.get('confirmed') === '1') return 'confirmed';
    if (params.get('confirmed') === '0') return 'expired';
    if (params.get('unsubscribed')) return 'left';
    return 'idle';
  });
  const [problem, setProblem] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', okEmail: false, okSms: false, trap: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setProblem('');
    if (!form.okEmail) { setProblem(t('join.needEmailConsent')); return; }
    if (form.okSms && form.phone.replace(/\D/g, '').length < 8) { setProblem(t('join.needPhone')); return; }
    if (form.trap) { setState('done'); return; }
    if (API) {
      setState('sending');
      try {
        const r = await postJson('/api/join', { email: form.email.trim(), firstName: form.name.trim(), phone: form.phone.trim(), okEmail: form.okEmail, okSms: form.okSms, lang, source, trap: form.trap });
        // confirm_sent: an email is on its way. recorded: stored, no email set up on the server yet.
        if (r.ok) { setState(r.status === 'already' ? 'already' : r.status === 'confirm_sent' ? 'done' : 'confirmed'); return; }
        setState('idle');
        setProblem({ email: t('join.badEmail'), consent: t('join.needEmailConsent'), phone: t('join.needPhone'), too_many: t('join.tooMany') }[r.error] || t('join.error'));
      } catch { setState('error'); }
      return;
    }
    if (!ENDPOINT) { setProblem(t('join.notConnected')); return; }
    setState('sending');
    const body = new URLSearchParams({
      EMAIL: form.email.trim(),
      FIRSTNAME: form.name.trim(),
      SMS: form.okSms ? form.phone.trim() : '',
      OPT_IN: '1',
      SMS_OPT_IN: form.okSms ? '1' : '0',
      LANG: lang,
      SOURCE: source,
      email_address_check: '',
      locale: lang
    });
    try {
      await fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', body });
      setState('done');
    } catch {
      setState('error');
    }
  };

  const outcome = { done: t('join.done'), confirmed: t('join.confirmed'), already: t('join.already'), left: t('join.left') }[state];

  return (
    <Page title={t('join.eyebrow')}>
      <div className="wrap">
        <div className="page-head join" style={{ paddingBottom: 'clamp(56px, 9vw, 112px)' }}>
          <div className="join__intro">
            <h1 className="d1">{t('join.title')}</h1>
            <p className="lede">{t('join.lede')}</p>
            <ul className="perks">
              {t('join.perks').map((p, i) => <li key={p}><span className="jp" aria-hidden="true">{['一', '二', '三'][i]}</span>{p}</li>)}
            </ul>
          </div>

          <div className="card-form">
            {outcome ? (
              <div className="form__done" role="status">
                <span className="jp" aria-hidden="true">{state === 'left' ? '了' : '受'}</span>
                <p className="d3 serif">{outcome}</p>
                {state === 'left' && <button type="button" className="link small" onClick={() => setState('idle')}>{t('join.submit')}</button>}
              </div>
            ) : (
              <form className="form" onSubmit={submit}>
                <label className="field">
                  <span className="field__label">{t('join.name')}</span>
                  <input type="text" name="FIRSTNAME" autoComplete="given-name" value={form.name} onChange={set('name')} />
                </label>
                <label className="field">
                  <span className="field__label">{t('join.email')}</span>
                  <input type="email" name="EMAIL" autoComplete="email" required value={form.email} onChange={set('email')} />
                </label>
                <label className="field">
                  <span className="field__label">{t('join.phone')}</span>
                  <input type="tel" name="SMS" autoComplete="tel" inputMode="tel" placeholder="+381 6_ ___ ____" value={form.phone} onChange={set('phone')} />
                  <span className="field__hint">{t('join.phoneHint')}</span>
                </label>
                <label className="check">
                  <input type="checkbox" checked={form.okEmail} onChange={set('okEmail')} />
                  <span>{t('join.consentEmail')}</span>
                </label>
                <label className="check">
                  <input type="checkbox" checked={form.okSms} onChange={set('okSms')} />
                  <span>{t('join.consentSms')}</span>
                </label>
                <input className="sr-only" tabIndex={-1} autoComplete="off" aria-hidden="true" name="email_address_check" value={form.trap} onChange={set('trap')} />
                {(problem || state === 'error' || state === 'expired') && <p className="form__problem" role="alert">{problem || (state === 'expired' ? t('join.expired') : t('join.error'))}</p>}
                <button type="submit" className="btn btn--solid btn--block" disabled={state === 'sending'}>
                  {state === 'sending' ? t('join.sending') : t('join.submit')}
                </button>
                <A to="/privacy" className="link small" style={{ width: 'fit-content' }}>{t('join.privacy')}<IconArrow /></A>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </Page>
  );
}
