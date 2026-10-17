// The Mochiko mark: one soft, slightly settled round with a single gleam.
// Keep the path identical to public/brand/logo-mark.svg.
export const MARK_PATH = 'M47 12 C68 9 91 27 90 50 C89 72 74 86 50 86 C26 86 10 73 10.5 50 C11 28 27 14 47 12 Z';
export const GLEAM_PATH = 'M27 44 C28 33 36 25 47 23';

export function Mark({ size = 28, cream = false, className = '', title }) {
  const fill = cream ? '#F4F0E4' : '#3E5A33';
  const gleam = cream ? '#3E5A33' : '#F4F0E4';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : 'true'}
      aria-label={title}
    >
      <path d={MARK_PATH} fill={fill} />
      <path d={GLEAM_PATH} fill="none" stroke={gleam} strokeWidth={size < 24 ? 6 : 4.4} strokeLinecap="round" />
    </svg>
  );
}

export function Wordmark({ cream = false, size = 19 }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <Mark size={size + 7} cream={cream} />
      <span className="wordmark__latin" style={{ fontSize: size }}>MOCHIKO</span>
    </span>
  );
}
