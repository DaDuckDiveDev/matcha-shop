import { Link } from 'react-router-dom';
import { useLang } from '../lib/LangContext.jsx';
import Page from '../components/Page.jsx';
import PhotoBand from '../components/PhotoBand.jsx';
import Reveal from '../components/Reveal.jsx';
import Footer from '../components/Footer.jsx';
import { alt, src } from '../data/images.js';

export default function Visit() {
  const { t } = useLang();
  const workshops = t('visit.workshops');
  return (
    <Page title={t('visit.eyebrow')}>
      <PhotoBand image="kyotoStreet" style={{ padding: '72px 0 48px' }} light>
        <div className="wrap inner">
          <Reveal className="glass" style={{ padding: '26px 24px', maxWidth: 620 }}>
            <div className="stack" style={{ gap: 12 }}>
              <div className="eyebrow"><span className="jp">訪問</span><span>— {t('visit.eyebrow')}</span></div>
              <h1 className="display" style={{ fontSize: 'clamp(36px, 8vw, 56px)' }}>{t('visit.title')}</h1>
              <p className="lede">{t('visit.lede')}</p>
            </div>
          </Reveal>
        </div>
      </PhotoBand>

      <section className="section wrap inner">
        <Reveal className="stack" style={{ gap: 10, marginBottom: 22 }}>
          <div className="eyebrow"><span className="jp">間</span><span>— {t('visit.galleryEyebrow')}</span></div>
          <h2 className="h2">{t('visit.galleryTitle')}</h2>
        </Reveal>
        <div className="tiles">
          {['cafeMinimal', 'tatamiShoji', 'cafeGreen'].map((k, i) => (
            <Reveal key={k} delay={i * 0.08} className="glass tile" style={{ padding: 0 }}>
              <img className="tile__img" src={src(k, 900)} alt={alt(k)} loading="lazy" decoding="async" />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section wrap inner section--two" style={{ alignItems: 'start' }}>
        <div className="stack" style={{ gap: 28 }}>
          <Reveal className="glass" style={{ padding: '22px 20px' }}>
            <div className="stack" style={{ gap: 10 }}>
              <div className="eyebrow"><span className="jp">時間</span><span>— {t('visit.hoursTitle')}</span></div>
              <div className="h3">{t('common.openDaily')}</div>
              <div className="caption" style={{ textTransform: 'none', letterSpacing: '0.04em', fontSize: 13 }}>{t('common.address')}</div>
              <div className="caption" style={{ textTransform: 'none', letterSpacing: '0.04em', fontSize: 13 }}>{t('common.phone')} · {t('common.instagram')}</div>
            </div>
          </Reveal>
          <Reveal className="stack" style={{ gap: 12 }}>
            <div className="eyebrow"><span className="jp">道</span><span>— {t('visit.findTitle')}</span></div>
            <p className="body">{t('visit.directions')}</p>
            <div className="map-stub"><span className="caption">{t('visit.mapNote')}</span></div>
            <a className="textlink" href="https://www.google.com/maps/search/?api=1&query=Dor%C4%87ol%2C+Beograd" target="_blank" rel="noreferrer">{t('visit.openMap')} →</a>
          </Reveal>
        </div>
        <div className="stack" style={{ gap: 28 }}>
          <Reveal className="glass tile" style={{ padding: 0 }}>
            <img className="tile__img" src={src('kyotoPatio', 1200)} alt={alt('kyotoPatio')} loading="lazy" decoding="async" style={{ aspectRatio: '4 / 5' }} />
          </Reveal>
          <Reveal className="stack" style={{ gap: 12 }}>
            <div className="eyebrow"><span className="jp">席</span><span>— {t('visit.reserveTitle')}</span></div>
            <p className="body">{t('visit.reserveBody')}</p>
            <Link to="/app/reserve" className="btn btn--primary" style={{ alignSelf: 'flex-start' }}>{t('app.reserve')}</Link>
          </Reveal>
          <Reveal className="stack" style={{ gap: 12 }}>
            <div className="eyebrow"><span className="jp">稽古</span><span>— {t('visit.workshopsTitle')}</span></div>
            <ol className="steps" style={{ listStyle: 'none' }}>
              {workshops.map(([title, body], i) => (
                <li key={title}><span className="step__n">{['一', '二'][i]}</span><span className="step__body"><b>{title}</b><span>{body}</span></span></li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>
      <Footer />
    </Page>
  );
}
