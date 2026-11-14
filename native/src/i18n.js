import { useStore } from './store';

// pick({ en, sr }) gives the guest's language, as on the website.
export function useLang() {
  const { lang } = useStore();
  const pick = (o) => (o && typeof o === 'object' ? o[lang] ?? o.en ?? '' : o);
  const locale = lang === 'sr' ? 'sr-Latn-RS' : 'en-GB';
  const n = (v) => { try { return Number(v || 0).toLocaleString(locale); } catch { return String(v); } };
  const day = (at, opts = { day: 'numeric', month: 'short' }) => { try { return new Date(at).toLocaleDateString(locale, opts); } catch { return new Date(at).toDateString(); } };
  return { lang, pick, n, day };
}
