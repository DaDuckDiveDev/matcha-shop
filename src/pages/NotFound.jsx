import { Link } from 'react-router-dom';
import Page from '../components/Page.jsx';
import Footer from '../components/Footer.jsx';
import { Mark } from '../components/Logo.jsx';

export default function NotFound() {
  return (
    <Page title="404">
      <section className="section wrap inner stack" style={{ gap: 18, alignItems: 'flex-start', minHeight: '50vh' }}>
        <Mark size={64} />
        <h1 className="h2">This cup is empty.</h1>
        <p className="body">The page you asked for is not on the menu.</p>
        <Link to="/" className="btn btn--primary">Home</Link>
      </section>
      <Footer />
    </Page>
  );
}
