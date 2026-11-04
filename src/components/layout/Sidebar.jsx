import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/dashboard', icon: 'fa-book-open', label: 'Ledger' },
  { to: '/clients', icon: 'fa-users', label: 'Clients' },
  { to: '/projects', icon: 'fa-diagram-project', label: 'Projects' },
  { to: '/invoices', icon: 'fa-file-invoice-dollar', label: 'Invoices' },
  { to: '/reports', icon: 'fa-chart-column', label: 'Reports' },
  { to: '/settings', icon: 'fa-gear', label: 'Settings' }
];

const item =
  'flex items-center gap-3 rounded-md p-2.5 text-left transition-colors hover:bg-ink-2 max-md:flex-col max-md:gap-0.5 max-md:px-1 max-md:py-1.5 max-md:text-[0.65rem]';

export default function Sidebar() {
  const { logout } = useAuth();
  return (
    <aside className="fixed inset-x-0 bottom-0 z-20 flex bg-ink p-1.5 text-white/85 md:sticky md:top-0 md:h-screen md:flex-col md:gap-6 md:px-3.5 md:py-6 print:hidden">
      <Link to="/" className="hidden items-center gap-2.5 px-2.5 font-display text-2xl font-extrabold text-white md:flex">
        <i className="fa-solid fa-book-bookmark text-gold" />
        Khata
      </Link>
      <nav className="flex flex-1 justify-around md:flex-col md:justify-start md:gap-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            aria-label={l.label}
            className={({ isActive }) => `${item} ${isActive ? 'bg-paper font-semibold text-strong hover:bg-paper' : ''}`}
          >
            <i className={`fa-solid ${l.icon} w-5 text-center`} />
            <span className="max-[400px]:hidden">{l.label}</span>
          </NavLink>
        ))}
      </nav>
      <button onClick={logout} className={item} aria-label="Log out">
        <i className="fa-solid fa-right-from-bracket w-5 text-center" />
        <span className="max-[400px]:hidden">Log out</span>
      </button>
    </aside>
  );
}
