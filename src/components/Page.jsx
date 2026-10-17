import { useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';

// Page wrapper: sets the title, scrolls to the top, and fades the page in.
export default function Page({ title, children, className = '' }) {
  const reduce = useReducedMotion();
  useEffect(() => {
    document.title = title ? `${title} — Machiko` : 'Machiko — Matcha & Coffee in Belgrade';
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, [title]);
  return (
    <motion.main
      className={className}
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, y: -6 }}
      transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.main>
  );
}
