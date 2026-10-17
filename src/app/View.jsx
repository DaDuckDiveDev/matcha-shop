import { useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export default function View({ title, children }) {
  const reduce = useReducedMotion();
  useEffect(() => {
    document.title = `${title} — Machiko`;
    window.scrollTo(0, 0);
  }, [title]);
  return (
    <motion.div
      className="stack"
      style={{ gap: 14 }}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, y: -6 }}
      transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
