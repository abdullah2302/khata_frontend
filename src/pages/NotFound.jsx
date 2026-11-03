import LinkButton from '../components/ui/LinkButton';

export default function NotFound() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 text-center">
      <p className="font-display text-8xl font-extrabold tracking-tight text-margin">404</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">This page is not in the ledger.</h1>
      <p className="mt-2 mb-6 text-muted">The link may be broken, or the page may have moved.</p>
      <LinkButton to="/" icon="fa-house">Back to home</LinkButton>
    </section>
  );
}
