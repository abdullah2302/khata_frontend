import { Link } from 'react-router-dom';

const rise = (ms) => ({ animationDelay: `${ms}ms` });

// Floating "slips": small previews of what the app tracks.
// They sit in their own area BELOW the headline, so they can never cover the text.
// On short screens (under 780px tall) they are hidden to keep the panel tidy.
function Slips() {
  return (
    <div className="relative mt-10 h-72 w-full max-w-sm [@media(max-height:780px)]:hidden">
      <div className="absolute top-0 left-0 w-52 animate-float rounded-md bg-paper p-4 text-body shadow-2xl" style={{ '--r': '-3deg' }}>
        <p className="text-xs text-muted">INV-0042</p>
        <p className="font-display text-2xl font-extrabold">$1,200</p>
        <span className="mt-1 inline-block -rotate-6 rounded border-2 border-emerald-700 px-2 text-sm font-extrabold text-emerald-700">PAID</span>
      </div>

      <div className="absolute top-12 right-0 w-48 animate-float rounded-md bg-paper p-4 text-body shadow-2xl" style={{ '--r': '3deg', animationDelay: '-2s' }}>
        <p className="flex items-center gap-2 text-sm text-muted"><i className="fa-solid fa-clock text-gold" />Due in 3 days</p>
        <p className="font-display text-2xl font-extrabold">$850</p>
        <p className="text-sm text-muted">Northwind Studio</p>
      </div>

      <div className="absolute bottom-0 left-10 w-56 animate-float rounded-md bg-paper p-4 text-body shadow-2xl" style={{ '--r': '2deg', animationDelay: '-4s' }}>
        <p className="mb-2 text-xs text-muted">Earned this year</p>
        <div className="flex h-14 items-end gap-1.5">
          {[30, 55, 40, 75, 60, 95].map((h, i) => (
            <span key={i} className="w-full origin-bottom animate-grow rounded-t bg-ink" style={{ height: `${h}%`, animationDelay: `${600 + i * 90}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Small screens: a compact brand bar instead of the big panel */}
      <header className="flex items-center justify-between bg-ink px-5 py-4 text-white lg:hidden">
        <Link to="/" className="flex items-center gap-2.5 font-display text-2xl font-extrabold">
          <i className="fa-solid fa-book-bookmark text-gold" />
          Khata
        </Link>
        <Link to="/" className="text-sm text-white/75 hover:text-white">Back to home</Link>
      </header>

      {/* Large screens: animated ledger panel */}
      <aside className="relative hidden overflow-hidden bg-ink text-white lg:block" aria-hidden="true">
        <div
          className="absolute inset-0 animate-drift opacity-25"
          style={{
            backgroundImage: 'linear-gradient(to bottom, transparent 39px, rgba(255,255,255,0.4) 39px)',
            backgroundSize: '100% 40px'
          }}
        />
        <div className="absolute inset-y-0 left-20 w-0.5 bg-margin/80" />

        <div className="relative flex min-h-screen flex-col p-12 pl-28">
          <div className="flex items-center gap-2.5 font-display text-2xl font-extrabold">
            <i className="fa-solid fa-book-bookmark text-gold" />
            Khata
          </div>

          <div className="my-auto py-10">
            <p className="animate-rise font-display text-5xl leading-[1.05] font-extrabold tracking-tight xl:text-6xl">
              Know who owes you.
            </p>
            <p className="mt-4 max-w-sm animate-rise text-lg text-white/75" style={rise(150)}>
              Clients, projects and invoices in one ledger.
            </p>
            <Slips />
          </div>

          <p className="text-sm text-white/60">Your clients and invoices stay private to you.</p>
        </div>
      </aside>

      <main className="relative grid content-center bg-paper px-6 py-10 sm:px-12 lg:px-[min(8vw,96px)]">
        <div className="absolute inset-y-0 left-[min(5vw,40px)] hidden w-0.5 bg-margin/70 sm:block" />
        <div className="mx-auto w-full max-w-md">
          <Link to="/" className="mb-6 hidden animate-rise text-sm text-muted hover:text-ink lg:inline-block">
            <i className="fa-solid fa-arrow-left mr-1.5" />
            Back to home
          </Link>
          <h1 className="animate-rise font-display text-4xl font-extrabold tracking-tight" style={rise(60)}>{title}</h1>
          <p className="mt-2 animate-rise text-muted" style={rise(120)}>{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-6 animate-rise text-muted" style={rise(520)}>{footer}</p>
        </div>
      </main>
    </div>
  );
}