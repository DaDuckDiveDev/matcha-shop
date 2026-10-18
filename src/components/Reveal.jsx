import { motion, useReducedMotion } from 'motion/react';

// Fade-and-rise on scroll. Content is visible at rest if motion is reduced.
// Extra props (data-rail and friends) pass through to the element.
export default function Reveal({ children, delay = 0, y = 18, className, as = 'div', once = true, style, ...rest }) {
  const reduce = useReducedMotion();
  const Tag = motion[as] || motion.div;
  if (reduce) return <Tag className={className} style={style} {...rest}>{children}</Tag>;
  return (
    <Tag
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-10% 0px -10% 0px' }}
      transition={{ duration: 0.8, delay, ease: [0.2, 0.7, 0.2, 1] }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
