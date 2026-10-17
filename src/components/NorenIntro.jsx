import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Mark } from './Logo.jsx';

// The noren: two cloth panels you walk through. Plays once per session,
// parts to the sides, and gets out of the way. Skipped when motion is reduced.
const KEY = 'mochiko.noren';

export default function NorenIntro() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(() => {
    if (reduce) return false;
    try { return !sessionStorage.getItem(KEY); } catch { return true; }
  });

  useEffect(() => {
    if (!show) return;
    try { sessionStorage.setItem(KEY, '1'); } catch {}
    const t = setTimeout(() => setShow(false), 1250);
    return () => clearTimeout(t);
  }, [show]);

  const ease = [0.7, 0, 0.2, 1];
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="noren-intro" aria-hidden="true" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.75 } }}>
          <div className="noren-intro__rod" />
          <motion.div className="noren-intro__panel" exit={{ x: '-100%', rotate: -2, transition: { duration: 0.95, ease } }}>
            <Mark cream className="noren-intro__mark" size={160} />
          </motion.div>
          <motion.div className="noren-intro__panel" exit={{ x: '100%', rotate: 2, transition: { duration: 0.95, ease } }}>
            <span className="vert">もちこ</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
