import { useEffect, useState } from 'react';
import { useLang } from '../lib/LangContext.jsx';
import { A } from '../lib/go.jsx';
import { isOpen } from '../data/shop.js';
import { PUBLISHED } from '../data/journal.js';
import Page from '../components/Page.jsx';
import Bowl from '../components/Bowl.jsx';
import Photo from '../components/Photo.jsx';
import Ink from '../components/Ink.jsx';
import SeasonLine from '../components/SeasonLine.jsx';
import StoryCard from '../components/StoryCard.jsx';
import Footer from '../components/Footer.jsx';
import { MARK_PATH } from '../components/Logo.jsx';
import { IconArrow, IconUpRight } from '../components/Icons.jsx';

// What is on the counter: photo, where it leads, and how big it is on a phone.
const OFFERS = [
  ['bowlTop', '/matcha'],
  ['icedPour', '/menu#matcha'],
  ['pourOver', '/menu#coffee'],
  ['wagashiCeremony', '/menu#kitchen'],
  ['utensilsFlat', '/menu#shop'],
  ['whiskSoft', '/visit#workshops']
];

export default function Home() {
  const { t } = useLang();
  const opened = isOpen();
  const [ready, setReady] = useState(false);
  const [whisked, setWhisked] = useState(false);
  const [touch, setTouch] = useState(false);

  // Raise the curtain once the headline's typeface is in, so nothing jumps.
  useEffect(() => {
    let done = false;
    const go = () => { if (!done) { done = true; setReady(true); } };
    const fonts = document.fonts?.ready;
    if (fonts) fonts.then(() => requestAnimationFrame(go)); else go();
    const fallback = setTimeout(go, 900);
    setTouch(window.matchMedia('(hover: none)').matches);
    return () => { done = true; clearTimeout(fallback); };
  }, []);

  return (
    <Page>
      <section className={`hero ${ready ? 'is-in' : ''}`}>
        <span className="vert hero__side hero__fade" lang="ja" aria-hidden="true">まちこ　抹茶と珈琲</span>
        <div className="hero__stage">
          <div className="hero__bowl"><Bowl label={t('home.bowlAlt')} ready={ready} onWhisked={() => setWhisked(true)} /></div>
          <p className="hero__hint hero__fade" aria-live="polite">{whisked ? t('home.whisked') : touch ? t('home.hintTouch') : t('home.hint')}</p>
        </div>
        <div className="hero__text">
          <h1 className="d1">{t('home.title').map((line) => <span className="line" key={line}><span>{line}</span></span>)}</h1>
          <p className="lede hero__fade">{t('home.lede')}</p>
          <div className="hero__cta hero__fade">
            {opened
              ? <a className="btn btn--solid" href={`${import.meta.env.BASE_URL}app/order`}>{t('home.ctaOrder')}</a>
              : <A className="btn btn--solid" to="/join">{t('home.ctaJoin')}</A>}
            <A className="link" to="/menu">{t('home.ctaMenu')}<IconArrow /></A>
          </div>
          <p className="hero__meta hero__fade">{opened ? t('home.openNow') : t('home.opening')}</p>
        </div>
      </section>

      <SeasonLine />

      <section className="section wrap">
        <div className="section__head">
          <h2 className="d2">{t('home.offersTitle')}</h2>
          <A className="link small" to="/menu">{t('common.fullMenu')}<IconArrow /></A>
        </div>
        <div className="offers">
          {OFFERS.map(([photo, to], i) => {
            const [title, body] = t('home.offers')[i];
            return (
              <A key={to} to={to} morph={!to.includes('#workshops')} className="offer">
                <Photo k={photo} morph sizes={i % 3 === 0 ? '(min-width: 900px) 33vw, 92vw' : '(min-width: 900px) 33vw, 46vw'} priority={i === 0} />
                <span className="offer__go" aria-hidden="true"><IconUpRight /></span>
                <span className="offer__text">
                  <span className="offer__title">{title}</span>
                  <span className="offer__body">{body}</span>
                </span>
              </A>
            );
          })}
        </div>
      </section>

      <section className="section wrap chapter chapter--inset">
        <div className="chapter__body">
          <div className="chapter__head">
            <span className="vert chapter__kanji" aria-hidden="true">抹茶</span>
            <Ink className="d2">{t('home.matchaTitle')}</Ink>
          </div>
          <div className="chapter__text">
            <p className="copy">{t('home.matchaBody')}</p>
            <dl className="facts">
              {t('home.facts').map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </dl>
            <A className="link" to="/matcha">{t('home.matchaLink')}<IconArrow /></A>
          </div>
        </div>
        <div className="chapter__media">
          <Photo k="teaLeaves" className="photo--main" drift unveil sizes="(min-width: 900px) 40vw, 92vw" />
          <Photo k="foamBowl" className="photo--inset" sizes="(min-width: 900px) 18vw, 40vw" />
        </div>
      </section>

      <section className="section wrap calm">
        <div className="calm__head">
          <Ink className="d2">{t('home.calmTitle')}</Ink>
          <p className="micro faint" style={{ maxWidth: '30em' }}>{t('home.calmNote')}</p>
        </div>
        <dl className="calm__list">
          {t('home.calm').map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
        </dl>
      </section>

      <section className="section wrap chapter chapter--flip">
        <div className="chapter__body">
          <div className="chapter__head">
            <span className="vert chapter__kanji" aria-hidden="true">間</span>
            <Ink className="d2">{t('home.roomTitle')}</Ink>
          </div>
          <div className="chapter__text">
            <p className="copy">{t('home.roomBody')}</p>
            <A className="link" to="/visit">{t('home.roomLink')}<IconArrow /></A>
          </div>
        </div>
        <div className="chapter__media">
          <div className="trio">
            <Photo k="tatamiCeremony" drift sizes="(min-width: 900px) 34vw, 62vw" />
            <Photo k="mossPath" drift sizes="(min-width: 900px) 17vw, 31vw" />
            <Photo k="teaRoomBowl" drift sizes="(min-width: 900px) 38vw, 70vw" />
          </div>
          <p className="caption">{t('home.roomCaption')}</p>
        </div>
      </section>

      <section className="section section--tight wrap">
        <div className="section__head">
          <h2 className="d2">{t('home.journalTitle')}</h2>
          <A className="link small" to="/journal">{t('home.journalAll')}<IconArrow /></A>
        </div>
        <div className="stories">
          {PUBLISHED.slice(0, 3).map((s) => <StoryCard key={s.slug} story={s} />)}
        </div>
      </section>

      {!opened && (
        <section className="wrap">
          <div className="band on-dark">
            <div className="band__main">
              <h2 className="d2">{t('home.joinTitle')}</h2>
              <p className="lede">{t('home.joinBody')}</p>
              <A className="btn btn--paper" to="/join">{t('home.ctaJoin')}</A>
            </div>
            <div className="band__dates">
              {t('visit.opening').map(([k, v]) => <span key={k}>{k}: {v}</span>)}
            </div>
            <svg className="band__mark" viewBox="0 0 100 100" aria-hidden="true"><path d={MARK_PATH} /></svg>
          </div>
        </section>
      )}

      <Footer />
    </Page>
  );
}
