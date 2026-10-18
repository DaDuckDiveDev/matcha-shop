import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { alt, photos, src, srcSet } from '../data/images.js';

// A full-bleed photograph with a soft tint and a gentle parallax; glass
// content sits on top. `light` keeps the top of the image brighter for
// dark text in a cream glass card.
export default function PhotoBand({ image, children, overlay = null, className = '', style, light = false, priority = false, credit = true, ...rest }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);
  const p = photos[image];
  return (
    <section ref={ref} className={`band ${className}`} style={style} {...rest}>
      <motion.img
        className="band__img"
        src={src(image, 1600)}
        srcSet={srcSet(image)}
        sizes="100vw"
        alt={alt(image)}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        style={reduce ? undefined : { y }}
      />
      <div className={`band__tint ${light ? 'band__tint--light' : ''}`} aria-hidden="true" />
      {overlay}
      <div className="band__content">{children}</div>
      {credit && p && <span className="band__credit">photo · {p.by} · pexels</span>}
    </section>
  );
}
