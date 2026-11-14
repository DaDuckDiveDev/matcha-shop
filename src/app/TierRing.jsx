// The tier as a ring: how far along to the next one. Drawn in SVG, no script.
export default function TierRing({ progress = 0, kanji, size = 104, label }) {
  const r = 44;
  const c = 2 * Math.PI * r;
  return (
    <svg className="tier-ring" width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={label}>
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(246, 244, 236, 0.2)" strokeWidth="3" />
      <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${Math.max(0.001, progress) * c} ${c}`} transform="rotate(-90 50 50)" className="tier-ring__arc" />
      <text x="50" y="52" textAnchor="middle" dominantBaseline="middle" className="tier-ring__kanji" lang="ja">{kanji}</text>
    </svg>
  );
}
