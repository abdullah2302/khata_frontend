import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LinkButton from '../ui/LinkButton';
import ThemePicker from '../ui/ThemePicker';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' }
];

const linkClass = ({ isActive }) =>
  `border-b-2 py-1 transition-colors ${
    isActive ? 'border-gold font-semibold text-ink' : 'border-transparent text-muted hover:text-ink'
  }`;

export default function Navbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const actions = user ? (
    <LinkButton to="/dashboard" icon="fa-book-open" onClick={close}>Open ledger</LinkButton>
  ) : (
    <>
      <Link to="/login" onClick={close} className="font-semibold text-ink hover:underline">Log in</Link>
      <LinkButton to="/register" onClick={close}>Create account</LinkButton>
    </>
  );

  return (
    <header className="sticky top-0 z-20 border-b-2 border-ink bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link to="/" onClick={close} className="flex items-center gap-2.5 font-display text-2xl font-extrabold tracking-tight text-ink">
          <i className="fa-solid fa-book-bookmark text-gold" />
          Khata
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>{l.label}</NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <ThemePicker compact />
          {actions}
        </div>

        <button
          className="cursor-pointer text-xl text-ink md:hidden"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <i className={`fa-solid ${open ? 'fa-xmark' : 'fa-bars'}`} />
        </button>
      </div>

      {open && (
        <div className="grid animate-fade gap-4 border-t border-rule px-5 pt-3 pb-5 md:hidden">
          <nav className="grid gap-1" aria-label="Mobile">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} onClick={close} className="rounded-md px-2 py-2 hover:bg-desk">
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center justify-between px-2">
            <span className="text-sm text-muted">Theme</span>
            <ThemePicker compact />
          </div>
          <div className="grid gap-3 [&>a]:text-center">{actions}</div>
        </div>
      )}
    </header>
  );
}
