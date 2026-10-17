import { Link } from 'react-router-dom';
import { useLang } from '../lib/LangContext.jsx';
import { alt, src } from '../data/images.js';
import { fmtRsd } from '../data/menu.js';

export default function MenuRow({ item, to, seasonal = false, showImage = true }) {
  const { pick, t } = useLang();
  const inner = (
    <>
      {showImage && <img className="row__img" src={src(item.img, 320)} alt={alt(item.img)} loading="lazy" decoding="async" />}
      <div className="row__body">
        {seasonal && <div className="row__tag"><span className="jp">旬</span> · {t('menu.thisFortnight')}</div>}
        <div className="row__name"><b>{pick(item.name)}</b>{item.jp && <span className="jp">{item.jp}</span>}</div>
        <div className="row__note">{pick(item.note)}</div>
        {item.spec && <div className="row__spec">{item.spec}</div>}
      </div>
      <div className="row__price">{fmtRsd(item.price)}{item.each && <small>{t('common.each')}</small>}</div>
    </>
  );
  const cls = `row ${showImage ? '' : 'row--plain'} ${seasonal ? 'row--season' : ''} ${to ? 'row--link' : ''}`;
  return to ? <Link to={to} className={cls}>{inner}</Link> : <div className={cls}>{inner}</div>;
}
