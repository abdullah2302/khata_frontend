import { Link } from 'react-router-dom';

export default function AuthLayout({ title, children, footer }) {
  return (
    <div className="grid min-h-screen md:grid-cols-[1.1fr_1fr]">
      <div className="grid place-items-center bg-ink p-6 md:p-8">
        <div className="max-w-sm border-2 border-gold p-12 text-center text-amber-100 shadow-[0_0_0_6px_var(--color-ink),0_0_0_7px_var(--color-gold)] max-md:p-6">
          <i className="fa-solid fa-book-bookmark text-3xl text-gold" />
          <h1 className="my-2 font-display text-7xl font-extrabold tracking-tight text-white max-md:text-5xl">Khata</h1>
          <p className="opacity-85">Clients, projects and who still owes you.</p>
        </div>
      </div>
      <div className="relative grid content-center gap-4 bg-paper px-[min(10vw,96px)] py-12 before:absolute before:inset-y-0 before:left-[min(5vw,48px)] before:w-0.5 before:bg-margin/70 before:content-['']">
        <Link to="/" className="text-sm text-muted hover:text-ink">
          <i className="fa-solid fa-arrow-left mr-1.5" />
          Back to home
        </Link>
        <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
        {children}
        <p className="text-muted">{footer}</p>
      </div>
    </div>
  );
}
