// A hand-drawn hairline. Deliberately not straight: wabi-sabi lives in the
// small irregularities. Each rule gets its own wobble from a seed.
export default function Rule({ seed = 1, color = 'currentColor', opacity = 0.35 }) {
  const pts = [];
  let y = 5;
  for (let x = 0; x <= 300; x += 12) {
    y = 5 + Math.sin((x + seed * 37) / 23) * 1.4 + Math.cos((x * 1.7 + seed * 11) / 31) * 0.8;
    pts.push(`${x} ${y.toFixed(2)}`);
  }
  return (
    <svg className="rule" viewBox="0 0 300 10" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="1" strokeOpacity={opacity} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
