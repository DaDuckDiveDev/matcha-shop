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
import CalmPoints from '../components/CalmPoints.jsx';
import SamonGarden from '../components/SamonGarden.jsx';
import WayGallery from '../components/WayGallery.jsx';
import Marquee from '../components/Marquee.jsx';
import StoryCard from '../components/StoryCard.jsx';
import HeroChips, { Clocks, OPENING, OpeningChip, Proof } from '../components/HeroChips.jsx';
import { findItem } from '../data/menu.js';
import { PUBLISHED } from '../data/journal.js';
import { alt, src } from '../data/images.js';
import { IconArrow } from '../components/Icons.jsx';

export default function Home() {
  const { t } = useLang();
  const ways = ['usucha', 'koicha', 'matcha-latte'].map(findItem);
  const stories = PUBLISHED.slice(0, 3);
  const preOpening = new Date() < OPENING;
  // Every section the rail on the right can take you to.
  const rail = (key, jp) => ({ 'data-rail': key, 'data-rail-label': t(`rail.${key}`), 'data-rail-jp': jp });

  return (
    <Page title={null}>
      <NorenIntro />

      {/* 00 · Enter: a tea room in Kyoto, the curtain, the card */}
      <PhotoBand
        image="teaRoomKyoto"
        className="hero"
        priority
        light
        {...rail('enter', '入')}
        overlay={(
          <>
            <div className="hero__noren" aria-hidden="true">
              <span>まちこ</span>
              <span>抹茶と珈琲</span>
            </div>
            <Clocks className="hero__clocks" />
            <HeroChips />
          </>
        )}
      >
        <div className="hero__stack">
          <Reveal className="glass hero__card" delay={0.1}>
            <div className="eyebrow"><span className="jp">抹茶</span><span>— {t('home.eyebrow')}</span></div>
            <h1 className="display">{t('home.title')}</h1>
            <p className="lede">{t('home.lede')}</p>
            <div className="btn-row">
              {preOpening
                ? <Link to="/join" className="btn btn--primary">{t('join.submit')}</Link>
                : <Link to="/app/order" className="btn btn--primary">{t('common.orderAhead')}</Link>}
              <Link to="/menu" className="btn btn--ghost">{t('common.seeMenu')}</Link>
            </div>
            <OpeningChip className="hero__chip-inline" />
            <Proof />
          </Reveal>
        </div>
      </PhotoBand>

      <div className="wrap inner" style={{ marginTop: 18 }}>
        <Reveal><SeasonStrip to="/menu" /></Reveal>
      </div>

      {/* 01 · One bowl: the stone garden */}
      <section className="garden" {...rail('bowl', '一服')}>
        <SamonGarden />
        <div className="wrap inner garden__inner">
          <Reveal className="garden__text">
            <div className="eyebrow"><span className="jp">一期一会</span><span>— {t('garden.eyebrow')}</span></div>
            <h2 className="garden__title">{t('garden.title')}</h2>
            <p className="lede">{t('garden.body')}</p>
            <Link to="/matcha" className="textlink">{t('garden.cta')} <IconArrow /></Link>
          </Reveal>
        </div>
      </section>

      {/* 02 · Three ways of matcha */}
      <section className="section wrap inner" {...rail('matcha', '抹茶')}>
        <Reveal className="stack" style={{ gap: 10 }}>
          <div className="eyebrow"><span className="jp">抹茶</span><span>— {t('home.waysEyebrow')}</span></div>
          <h2 className="h2">{t('home.waysTitle')}</h2>
        </Reveal>
        <Reveal delay={0.1} className="rows" style={{ marginTop: 22 }}>
          {ways.map((item) => <MenuRow key={item.id} item={item} to={`/app/order/${item.id}`} />)}
        </Reveal>
        <Link to="/menu" className="textlink" style={{ marginTop: 10 }}>{t('common.fullMenu')} <IconArrow /></Link>
      </section>

      {/* 03 · The room */}
      <PhotoBand image="cafeSunlit" style={{ padding: '72px 0', marginTop: 64 }} light {...rail('room', '間')}>
        <div className="wrap inner">
          <Reveal className="glass" style={{ padding: '28px 24px 26px', maxWidth: 560 }}>
            <div className="stack" style={{ gap: 14 }}>
              <div className="eyebrow"><span className="jp">間</span><span>— {t('home.roomEyebrow')}</span></div>
              <h2 className="h2">{t('home.roomTitle')}</h2>
              <p className="body">{t('home.roomBody')}</p>
              <Link to="/visit" className="textlink">{t('nav.visit')} <IconArrow /></Link>
            </div>
          </Reveal>
        </div>
      </PhotoBand>

      {/* 04 · The shade, over the tea fields */}
      <PhotoBand image="teaMist" style={{ padding: '72px 0' }} {...rail('shade', '蔭')}>
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

      {/* 05 · The way, from field to bowl */}
      <WayGallery />

      <Marquee />

      {/* 06 · Why matcha: calm, over a raked garden */}
      <PhotoBand image="zenRaked" style={{ padding: '72px 0' }} light {...rail('calm', '静')}>
        <div className="wrap inner">
          <Reveal className="glass" style={{ padding: '28px 24px 26px', maxWidth: 680 }}>
            <div className="stack" style={{ gap: 16 }}>
              <div className="eyebrow"><span className="jp">静</span><span>— {t('home.calmEyebrow')}</span></div>
              <h2 className="h2">{t('home.calmTitle')}</h2>
              <p className="body">{t('home.calmBody')}</p>
              <CalmPoints />
              <div className="caption" style={{ textTransform: 'none', letterSpacing: '0.04em', fontSize: 12, lineHeight: 1.5 }}>{t('home.calmNote')}</div>
            </div>
          </Reveal>
        </div>
      </PhotoBand>

      {/* 07 · The kitchen: mochi, coffee, take-home */}
      <section className="section wrap inner section--two" {...rail('kitchen', '餅')}>
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

      <section className="section wrap inner">
        <div className="tiles">
          {[
            { img: 'nelDrip', jp: '珈琲', title: 'home.coffeeTitle', body: 'home.coffeeBody', to: '/menu#coffee' },
            { img: 'onigiriBoard', jp: '台所', title: 'home.kitchenTitle', body: 'home.kitchenBody', to: '/menu#kitchen' },
            { img: 'utensilsFlat', jp: '売店', title: 'home.shopTitle', body: 'home.shopBody', to: '/menu#shop' }
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

      {/* 08 · From the journal */}
      <section className="section wrap inner" {...rail('journal', '物語')}>
        <Reveal className="section-head">
          <h2>{t('journal.homeTitle')} <span className="jp">物語</span></h2>
          <Link to="/journal" className="textlink">{t('journal.all')} <IconArrow /></Link>
        </Reveal>
        <div className="story-row">
          {stories.map((s, i) => <Reveal key={s.slug} delay={i * 0.08}><StoryCard story={s} /></Reveal>)}
        </div>
      </section>

      {/* 09 · Visit: the guest app over a Kyoto riverside, then the footer */}
      <PhotoBand image="kyotoRiver" style={{ padding: '72px 0', marginTop: 72 }} {...rail('visit', '訪問')}>
        <div className="wrap inner">
          <Reveal className="glass" style={{ padding: '28px 24px 26px', maxWidth: 560 }}>
            <div className="stack" style={{ gap: 14 }}>
              <div className="eyebrow"><span className="jp">注文</span><span>— {t('home.appEyebrow')}</span></div>
              <h2 className="h2">{t('home.appTitle')}</h2>
              <p className="body">{t('home.appBody')}</p>
              <div className="btn-row" style={{ marginTop: 6 }}>
                <Link to="/app" className="btn btn--primary">{t('home.openApp')}</Link>
                {preOpening && <Link to="/join" className="btn btn--ghost">{t('nav.join')}</Link>}
              </div>
            </div>
          </Reveal>
        </div>
      </PhotoBand>

      <Footer />
    </Page>
  );
}
