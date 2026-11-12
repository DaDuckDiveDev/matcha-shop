import { useCallback, useState } from 'react';
import { picture } from '../data/images.js';

// One photograph in a rounded frame. It shows a soft preview of itself until
// the real file arrives, picks the right size for the screen (AVIF where the
// browser reads it), and can drift a little inside its frame as you scroll.
//   k        the photo's key in data/images.js
//   ratio    the frame's shape, e.g. "4 / 5" (or leave it to CSS)
//   drift    move inside the frame with the scroll
//   unveil   open up as it enters the screen
//   morph    this picture grows into the next page's picture when tapped
//   target   this is the picture a tapped one grows into
export default function Photo({ k, ratio, sizes = '100vw', priority = false, drift = false, unveil = false, morph = false, target = false, className = '', style, children }) {
  const p = picture(k);
  const [shown, setShown] = useState(false);
  const ref = useCallback((el) => { if (el && el.complete && el.naturalWidth > 0) setShown(true); }, []);
  if (!p) return null;
  const cls = ['photo', drift && 'photo--drift', unveil && 'unveil', target && 'morph-target', className].filter(Boolean).join(' ');
  return (
    <figure
      className={cls}
      data-morph={morph ? '' : undefined}
      style={{ aspectRatio: ratio, backgroundColor: p.colour || undefined, backgroundImage: p.preview ? `url(${p.preview})` : undefined, ...style }}
    >
      <picture>
        {p.avif && <source type="image/avif" srcSet={p.avif} sizes={sizes} />}
        <img
          ref={ref}
          className={shown ? 'is-in' : ''}
          src={p.src}
          srcSet={p.jpg}
          sizes={sizes}
          alt={p.alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          {...(priority ? { fetchpriority: 'high' } : {})}
          onLoad={() => setShown(true)}
          onError={() => setShown(true)}
        />
      </picture>
      {children}
    </figure>
  );
}
