import { Link } from 'react-router-dom';
import { useLang } from '../lib/LangContext.jsx';
import Page from '../components/Page.jsx';
import NorenIntro from '../components/NorenIntro.jsx';
import PhotoBand from '../components/PhotoBand.jsx';
import SeasonStrip from '../components/SeasonStrip.jsx';
import MenuRow from '../components/MenuRow.jsx';
import Seals from '../components/Seals.jsx';
import Reveal from '../components/Reveal.jsx';
import Rule from '../components/Rule.jsx';
import Footer from '../components/Footer.jsx';
import { findItem } from '../data/menu.js';
import { alt, src } from '../data/images.js';
import { IconArrow } from '../components/Icons.jsx';

export default function Home() {
  const { t } = useLang();
  const ways = ['usucha', 'koicha', 'matcha-latte'].map(findItem);

  return (
    <Page title={null}>
      <NorenIntro />

      {/* Hero: the whisk, the curtain, the card */}
      <PhotoBand
        image="heroWhisk"
        className="hero"
        priority
        light
        overlay={(
          <div className="hero__noren" aria-hidden="true">
            <span>もちこ</span>
            <span>抹茶と珈琲</span>
          </div>
        )}
      >
        <Reveal className="glass hero__card" delay={0.1}>
          <div className="eyebrow"><span className="jp">抹茶</span><span>— {t('home.eyebrow')}</span></div>
          <h1 className="display">{t('home.title')}</h1>
          <p className="lede">{t('home.lede')}</p>
          <div className="btn-row">
            <Link to="/menu" className="btn btn--primary">{t('common.seeMenu')}</Link>
            <Link to="/app/order" className="btn btn--ghost">{t('common.orderAhead')}</Link>
          </div>
        </Reveal>
      </PhotoBand>

      <div className="wrap inner" style={{ marginTop: 18 }}>
        <Reveal><SeasonStrip to="/menu" /></Reveal>
      </div>

      {/* Three ways of matcha */}
      <section className="section wrap inner">
        <Reveal className="stack" style={{ gap: 10 }}>
          <div className="eyebrow"><span className="jp">抹茶</span><span>— {t('home.waysEyebrow')}</span></div>
          <h2 className="h2">{t('home.waysTitle')}</h2>
        </Reveal>
        <Reveal delay={0.1} className="rows" style={{ marginTop: 22 }}>
          {ways.map((item) => <MenuRow key={item.id} item={item} to={`/app/order/${item.id}`} />)}
        </Reveal>
        <Link to="/menu" className="textlink" style={{ marginTop: 10 }}>{t('common.fullMenu')} <IconArrow /></Link>
      </section>

      {/* The shade, over the tea fields */}
      <PhotoBand image="teaMist" className="section" style={{ padding: '72px 0', marginTop: 64 }}>
        <div className="wrap inner">
          <Reveal className="glass glass--green on-green" style={{ padding: '28px 24px 26px', maxWidth: 640 }}>
            <div className="stack" style={{ gap: 16 }}>
              <div className="eyebrow"><span className="jp">蔭</span><span>— {t('home.shadeEyebrow')}</span></div>
              <h2 className="h2">{t('home.shadeTitle')}</h2>
              <p className="body">{t('home.shadeBody')}</p>
              <Rule seed={3} color="#F4F0E4" />
              <Seals />
            </div>
          </Reveal>
        </div>
      </PhotoBand>

      {/* Mochi */}
      <section className="section wrap inner section--two">
        <Reveal className="glass tile" style={{ padding: 0 }}>
          <img className="tile__img" src={src('mochiHands', 1200)} alt={alt('mochiHands')} loading="lazy" decoding="async" style={{ aspectRatio: '4 / 5' }} />
        </Reveal>
        <Reveal delay={0.1} className="stack" style={{ gap: 16, paddingTop: 24 }}>
          <div className="eyebrow"><span className="jp">餅</span><span>— {t('home.mochiEyebrow')}</span></div>
          <h2 className="h2">{t('home.mochiTitle')}</h2>
          <p className="body">{t('home.mochiBody')}</p>
          <Link to="/menu#kitchen" className="textlink">{t('home.kitchenTitle')} <IconArrow /></Link>
        </Reveal>
      </section>

      {/* Coffee · kitchen · take home */}
      <section className="section wrap inner">
        <div className="tiles">
          {[
            { img: 'nelDrip', jp: '珈琲', title: 'home.coffeeTitle', body: 'home.coffeeBody', to: '/menu#coffee' },
            { img: 'onigiriBoard', jp: '台所', title: 'home.kitchenTitle', body: 'home.kitchenBody', to: '/menu#kitchen' },
            { img: 'powderSpoon', jp: '売店', title: 'home.shopTitle', body: 'home.shopBody', to: '/menu#shop' }
          ].map((c, i) => (
            <Reveal key={c.img} delay={i * 0.08}>
              <Link to={c.to} className="glass tile">
                <img className="tile__img" src={src(c.img, 900)} alt={alt(c.img)} loading="lazy" decoding="async" />
                <div className="tile__body">
                  <div className="eyebrow"><span className="jp">{c.jp}</span></div>
                  <div className="h3">{t(c.title)}</div>
                  <div className="row__note">{t(c.body)}</div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Guest app */}
      <PhotoBand image="bambooKyoto" style={{ padding: '72px 0', marginTop: 72 }}>
        <div className="wrap inner">
          <Reveal className="glass" style={{ padding: '28px 24px 26px', maxWidth: 560 }}>
            <div className="stack" style={{ gap: 14 }}>
              <div className="eyebrow"><span className="jp">注文</span><span>— {t('home.appEyebrow')}</span></div>
              <h2 className="h2">{t('home.appTitle')}</h2>
              <p className="body">{t('home.appBody')}</p>
              <div className="btn-row" style={{ marginTop: 6 }}>
                <Link to="/app" className="btn btn--primary">{t('home.openApp')}</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </PhotoBand>

      <Footer />
    </Page>
  );
}
