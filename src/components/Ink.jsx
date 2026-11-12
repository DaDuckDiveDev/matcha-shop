// A statement whose words take ink as they come up the page (CSS does the
// work; see ".ink" in the stylesheet). Screen readers get the plain sentence.
export default function Ink({ as: Tag = 'h2', className = '', children }) {
  const text = String(children);
  return (
    <Tag className={`ink ${className}`} aria-label={text}>
      {text.split(' ').map((w, i) => <span key={i} aria-hidden="true">{w}{' '}</span>)}
    </Tag>
  );
}
