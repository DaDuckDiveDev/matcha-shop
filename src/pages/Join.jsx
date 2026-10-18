import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLang } from '../lib/LangContext.jsx';
import Page from '../components/Page.jsx';
import PhotoBand from '../components/PhotoBand.jsx';
import Reveal from '../components/Reveal.jsx';
import Footer from '../components/Footer.jsx';
import { OpeningChip } from '../components/HeroChips.jsx';

// The founding list. The QR codes on the window poster and the flyers open
// this page (machiko.rs/join). It posts to the Brevo form set in
// VITE_JOIN_ENDPOINT, with double opt-in switched on in Brevo; without it
// the page is a preview and sends nothing. Two separate, unticked boxes:
// one for email, one for SMS (Serbian e-commerce law needs prior consent).
const ENDPOINT = import.meta.env.VITE_JOIN_ENDPOINT || '';

export default function Join() {
  const { t, lang } = useLang();
  const [params] = useSearchParams();
  const source = useMemo(() => (params.get('src') || 'website').slice(0, 30), [params]);
  const [state, setState] = useState('idle'); // idle | sending | done | error
  const [problem, setProblem] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', okEmail: false, okSms: false, trap: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setProblem('');
    if (!form.okEmail) { setProblem(t('join.needEmailConsent')); return; }
    if (form.okSms && form.phone.replace(/\D/g, '').length < 8) { setProblem(t('join.needPhone')); return; }
    if (form.trap) { setState('done'); return; }
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

  return (
    <Page title={t('join.eyebrow')}>
      <PhotoBand image="norenKyoto" className="join" light>
        <div className="wrap inner join__grid">
          <Reveal className="glass join__intro">
            <div className="eyebrow"><span className="jp">暖簾</span><span>— {t('join.eyebrow')}</span></div>
            <h1 className="display join__title">{t('join.title')}</h1>
            <p className="lede">{t('join.lede')}</p>
            <ul className="join__perks">
              {t('join.perks').map((p, i) => <li key={p}><span className="jp" aria-hidden="true">{['一', '二', '三'][i]}</span>{p}</li>)}
            </ul>
            <OpeningChip className="join__chip" />
          </Reveal>

          <Reveal delay={0.1} className="glass glass--strong join__card">
            {state === 'done' ? (
              <div className="join__done" role="status">
                <span className="jp join__done-mark" aria-hidden="true">受</span>
                <p className="lede">{t('join.done')}</p>
              </div>
            ) : (
              <form className="form" onSubmit={submit} noValidate={false}>
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
                {(problem || state === 'error') && <p className="form__problem" role="alert">{problem || t('join.error')}</p>}
                <button type="submit" className="btn btn--primary btn--block" disabled={state === 'sending'}>
                  {state === 'sending' ? t('join.sending') : t('join.submit')}
                </button>
                <Link to="/privacy" className="textlink form__privacy">{t('join.privacy')} →</Link>
                {!ENDPOINT && <p className="form__note">{t('join.notConnected')}</p>}
              </form>
            )}
          </Reveal>
        </div>
      </PhotoBand>
      <Footer />
    </Page>
  );
}
