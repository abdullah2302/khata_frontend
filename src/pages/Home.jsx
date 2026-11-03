import { useAuth } from '../context/AuthContext';
import LinkButton from '../components/ui/LinkButton';
import LedgerPreview from '../components/home/LedgerPreview';
import Problem from '../components/home/Problem';
import Features from '../components/home/Features';
import DashboardPreview from '../components/home/DashboardPreview';
import Audience from '../components/home/Audience';
import HowItWorks from '../components/home/HowItWorks';
import FaqTeaser from '../components/home/FaqTeaser';
import CallToAction from '../components/home/CallToAction';

const rise = (ms) => ({ animationDelay: `${ms}ms` });
const points = [
  'Clients, projects and invoices in one place',
  'Printable invoices and CSV export',
  'Overdue invoices flagged automatically'
];

export default function Home() {
  const { user } = useAuth();
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-14 md:grid-cols-[1.05fr_1fr] md:py-24">
        <div>
          <h1 className="animate-rise font-display text-5xl leading-[1.05] font-extrabold tracking-tight md:text-6xl">
            Know who owes you before they forget.
          </h1>
          <p className="mt-5 max-w-md animate-rise text-lg text-muted" style={rise(120)}>
            Khata keeps your clients, projects and invoices in one ledger, so you always know what has been paid and
            what is still due.
          </p>
          <div className="mt-8 flex animate-rise flex-wrap gap-3" style={rise(240)}>
            {user ? (
              <LinkButton to="/dashboard" icon="fa-book-open">Open your ledger</LinkButton>
            ) : (
              <LinkButton to="/register">Create an account</LinkButton>
            )}
            <LinkButton href="#how" variant="ghost">See how it works</LinkButton>
          </div>
          <ul className="mt-7 grid animate-rise gap-1.5 text-sm text-muted" style={rise(360)}>
            {points.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <i className="fa-solid fa-check text-emerald-700" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <LedgerPreview />
      </section>

      <Problem />
      <Features />
      <DashboardPreview />
      <Audience />
      <HowItWorks />
      <FaqTeaser />
      <CallToAction />
    </>
  );
}
