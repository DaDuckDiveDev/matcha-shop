import { useState } from 'react';
import { motion } from 'motion/react';
import View from './View.jsx';
import { useLang } from '../lib/LangContext.jsx';
import { sendReservation, store, useStore } from '../lib/store.js';

export default function Reserve() {
  const { t } = useLang();
  const { name } = useStore();
  const workshops = t('visit.workshops');
  const [form, setForm] = useState({ kind: 'table', date: '', time: '10:00', guests: 4, name, note: '' });
  const [state, setState] = useState('idle'); // idle | sending | sent | local
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setState('sending');
    const payload = { ...form, at: new Date().toISOString(), source: 'mochiko-app' };
    const { sent } = await sendReservation(payload);
    store.setName(form.name.trim());
    store.addReservation({ ...payload, sent });
    setState(sent ? 'sent' : 'local');
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <View title={t('app.reserveTitle')}>
      <div className="app-head">
        <div>
          <h1 className="app-head__title">{t('app.reserveTitle')}</h1>
          <div className="app-head__meta">{t('app.reserveLede')}</div>
        </div>
      </div>

      {state === 'sent' || state === 'local' ? (
        <motion.section className="glass card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="jp" style={{ fontSize: 28, color: 'var(--uji)' }}>予約</div>
          <p className="body">{state === 'sent' ? t('app.reserveSent') : t('app.reserveLocal')}</p>
          <button type="button" className="btn btn--ghost" onClick={() => setState('idle')}>{t('common.back')}</button>
        </motion.section>
      ) : (
        <form className="glass card" onSubmit={submit}>
          <div className="field">
            <label htmlFor="r-kind">{t('app.seatOrWorkshop')}</label>
            <select id="r-kind" value={form.kind} onChange={set('kind')}>
              <option value="table">{t('app.table')}</option>
              {workshops.map(([w]) => <option key={w} value={w}>{t('app.workshop')}: {w}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="field">
              <label htmlFor="r-date">{t('app.date')}</label>
              <input id="r-date" type="date" min={today} value={form.date} onChange={set('date')} required />
            </div>
            <div className="field">
              <label htmlFor="r-time">{t('app.time')}</label>
              <input id="r-time" type="time" min="08:00" max="19:30" step="900" value={form.time} onChange={set('time')} required />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10 }}>
            <div className="field">
              <label htmlFor="r-guests">{t('app.guests')}</label>
              <input id="r-guests" type="number" min="1" max="12" value={form.guests} onChange={set('guests')} required />
            </div>
            <div className="field">
              <label htmlFor="r-name">{t('app.name')}</label>
              <input id="r-name" value={form.name} onChange={set('name')} placeholder={t('app.namePlaceholder')} required autoComplete="name" />
            </div>
          </div>
          <div className="field">
            <label htmlFor="r-note">{t('app.note')}</label>
            <textarea id="r-note" value={form.note} onChange={set('note')} />
          </div>
          <motion.button type="submit" className="btn btn--primary btn--block" whileTap={{ scale: 0.98 }} disabled={state === 'sending'}>{t('app.send')}</motion.button>
        </form>
      )}
    </View>
  );
}
