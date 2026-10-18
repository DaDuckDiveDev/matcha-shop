import { Link } from 'react-router-dom';
import { useLang } from '../lib/LangContext.jsx';
import Page from '../components/Page.jsx';
import PhotoBand from '../components/PhotoBand.jsx';
import Reveal from '../components/Reveal.jsx';
import Seals from '../components/Seals.jsx';
import Rule from '../components/Rule.jsx';
import Footer from '../components/Footer.jsx';
import { alt, src } from '../data/images.js';
import CalmPoints from '../components/CalmPoints.jsx';

export default function Matcha() {
  const { t } = useLang();
  const specs = t('matcha.specs');
  const steps = t('matcha.steps');
  const faq = t('matcha.faq');
  const rail = (key, label, jp) => ({ 'data-rail': key, 'data-rail-label': label, 'data-rail-jp': jp });

  return (
    <Page title={t('matcha.eyebrow')}>
      <PhotoBand image="whiskClose" style={{ padding: '72px 0 48px' }} light {...rail('top', t('nav.matcha'), '抹茶')}>
        <div className="wrap inner">
          <Reveal className="glass" style={{ padding: '26px 24px', maxWidth: 620 }}>
            <div className="stack" style={{ gap: 12 }}>
              <div className="eyebrow"><span className="jp">抹茶</span><span>— {t('matcha.eyebrow')}</span></div>
              <h1 className="display" style={{ fontSize: 'clamp(36px, 8vw, 56px)' }}>{t('matcha.title')}</h1>
              <p className="lede">{t('matcha.lede')}</p>
            </div>
          </Reveal>
        </div>
      </PhotoBand>

      <section className="section wrap inner two-col">
        <Reveal className="glass sticky" style={{ padding: '22px 20px' }} {...rail('specs', t('rail.specs'), '缶')}>
          <div className="stack" style={{ gap: 12 }}>
            <div className="eyebrow"><span className="jp">缶</span><span>— {t('matcha.specsTitle')}</span></div>
            <table className="spec-table">
              <tbody>
                {Object.values(specs).map(([k, v]) => (
                  <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>
                ))}
              </tbody>
            </table>
            <Seals />
          </div>
        </Reveal>
        <div className="stack" style={{ gap: 44 }}>
          <Reveal className="stack" style={{ gap: 14 }} {...rail('shade', t('rail.shade'), '蔭')}>
            <div className="eyebrow"><span className="jp">蔭</span><span>— {t('home.shadeEyebrow')}</span></div>
            <h2 className="h2">{t('home.shadeTitle')}</h2>
            <p className="body">{t('home.shadeBody')}</p>
            <Rule seed={7} />
          </Reveal>
          <Reveal className="stack" style={{ gap: 14 }} {...rail('how', t('rail.how'), '点前')}>
            <div className="eyebrow"><span className="jp">点前</span><span>— {t('matcha.howTitle')}</span></div>
            <ol className="steps">
              {steps.map(([title, body], i) => (
                <li key={title}>
                  <span className="step__n">{['一', '二', '三', '四'][i]}</span>
                  <span className="step__body"><b>{title}</b><span>{body}</span></span>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal className="photo-strip">
            {['whiskCeremony', 'steamBowl', 'hishaku'].map((k) => (
              <figure key={k} className="glass tile photo-strip__item">
                <img className="tile__img" src={src(k, 900)} alt={alt(k)} loading="lazy" decoding="async" />
              </figure>
            ))}
          </Reveal>
          <Reveal className="stack" style={{ gap: 14 }} {...rail('calm', t('rail.calm'), '静')}>
            <div className="eyebrow"><span className="jp">静</span><span>— {t('home.calmEyebrow')}</span></div>
            <h2 className="h2">{t('home.calmTitle')}</h2>
            <p className="body">{t('home.calmBody')}</p>
            <CalmPoints />
            <div className="caption" style={{ textTransform: 'none', letterSpacing: '0.04em', fontSize: 12, lineHeight: 1.5 }}>{t('home.calmNote')}</div>
          </Reveal>
          <Reveal className="stack" style={{ gap: 14 }} {...rail('faq', t('rail.faq'), '質問')}>
            <div className="eyebrow"><span className="jp">質問</span><span>— {t('matcha.faqTitle')}</span></div>
            <div className="faq">
              {faq.map(([q, a]) => (
                <details key={q}><summary>{q}</summary><p>{a}</p></details>
              ))}
            </div>
          </Reveal>
          <div className="btn-row">
            <Link to="/app/order/usucha" className="btn btn--primary">{t('common.orderAhead')}</Link>
            <Link to="/menu#shop" className="btn btn--ghost">{t('home.shopTitle')}</Link>
          </div>
        </div>
      </section>
      <Footer />
    </Page>
  );
}
