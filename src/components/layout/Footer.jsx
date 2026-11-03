import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SocialLinks from './SocialLinks';

const link = 'text-white/75 transition-colors hover:text-white hover:underline';

function Column({ title, children }) {
  return (
    <div>
      <h3 className="mb-3 font-display text-lg font-semibold text-white">{title}</h3>
      <ul className="grid gap-2 text-sm">{children}</ul>
    </div>
  );
}

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer className="bg-ink text-white/75">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-2.5 font-display text-2xl font-extrabold text-white">
            <i className="fa-solid fa-book-bookmark text-gold" />
            Khata
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed">
            A simple ledger for freelancers. Track clients, projects and invoices, and always know who still owes you.
          </p>
          <p className="mt-5 mb-3 text-sm font-semibold text-white">Follow along</p>
          <SocialLinks />
        </div>

        <Column title="Product">
          <li><a href="/#features" className={link}>Features</a></li>
          <li><a href="/#how" className={link}>How it works</a></li>
          <li><Link to="/faq" className={link}>Questions</Link></li>
          <li><Link to="/about" className={link}>About Khata</Link></li>
        </Column>

        <Column title="Support">
          <li><Link to="/contact" className={link}>Contact us</Link></li>
          <li><Link to="/faq" className={link}>Help and FAQ</Link></li>
          <li><Link to="/contact" className={link}>Report a bug</Link></li>
          <li><Link to="/contact" className={link}>Suggest a feature</Link></li>
        </Column>

        <Column title={user ? 'Your ledger' : 'Get started'}>
          {user ? (
            <>
              <li><Link to="/dashboard" className={link}>Ledger</Link></li>
              <li><Link to="/clients" className={link}>Clients</Link></li>
              <li><Link to="/invoices" className={link}>Invoices</Link></li>
              <li><Link to="/settings" className={link}>Settings</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/register" className={link}>Create an account</Link></li>
              <li><Link to="/login" className={link}>Log in</Link></li>
            </>
          )}
        </Column>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs">
          <p>&copy; {new Date().getFullYear()} Khata. Built with React, Node.js, Express and MongoDB.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="cursor-pointer text-white/75 hover:text-white"
          >
            Back to top <i className="fa-solid fa-arrow-up ml-1" />
          </button>
        </div>
      </div>
    </footer>
  );
}
