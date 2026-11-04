import { useAuth } from '../../context/AuthContext';
import LinkButton from '../ui/LinkButton';
import Reveal from '../ui/Reveal';

export default function CallToAction() {
  const { user } = useAuth();
  return (
    <section className="bg-ink text-white">
      <Reveal className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-5 py-14">
        <div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight">Ready to open your ledger?</h2>
          <p className="mt-1.5 text-white/75">Add your first client in under a minute.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {user ? (
            <LinkButton to="/dashboard" variant="light" icon="fa-book-open">Open ledger</LinkButton>
          ) : (
            <>
              <LinkButton to="/register" variant="light">Create an account</LinkButton>
              <LinkButton to="/login" variant="outlineLight">Log in</LinkButton>
            </>
          )}
        </div>
      </Reveal>
    </section>
  );
}
