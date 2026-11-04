import { Link, useParams } from 'react-router-dom';
import { errorMessage, fmtDate, money } from '../utils/format';
import PageHeader from '../components/ui/PageHeader';
import StatusBadge from '../components/ui/StatusBadge';
import CountUp from '../components/ui/CountUp';
import TableSkeleton from '../components/ui/TableSkeleton';
import Alert from '../components/ui/Alert';
import { useClientOverview } from '../hooks/queries';

const fmt = (n) => money(Math.round(n));
const h2 = 'mb-3 font-display text-xl font-semibold tracking-tight';
const row = 'grid animate-rise items-center gap-3 border-b border-rule py-3.5';

export default function ClientDetail() {
  const { id } = useParams();
  const { data, error } = useClientOverview(id);

  const back = (
    <Link to="/clients" className="mb-4 inline-block text-muted hover:text-strong">
      <i className="fa-solid fa-arrow-left mr-1.5" />
      Clients
    </Link>
  );

  if (error) return <>{back}<Alert>{errorMessage(error)}</Alert></>;
  if (!data) return <>{back}<TableSkeleton rows={4} /></>;

  const { client, projects, invoices, totals } = data;
  const stats = [
    { label: 'Billed', value: totals.billed },
    { label: 'Paid', value: totals.paid },
    { label: 'Still owed', value: totals.owed }
  ];

  return (
    <>
      {back}
      <PageHeader title={client.name} subtitle={client.company} />

      <div className="mb-8 grid gap-6 border-t-2 border-strong pt-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-sm text-muted">{s.label}</p>
            <p className={`font-display text-3xl font-extrabold tracking-tight ${s.label === 'Still owed' && s.value > 0 ? 'text-margin' : ''}`}>
              <CountUp value={s.value} format={fmt} />
            </p>
          </div>
        ))}
      </div>

      <section className="mb-9">
        <h2 className={h2}>Contact</h2>
        <div className="border-t-2 border-strong">
          <div className={`${row} grid-cols-[24px_1fr]`}>
            <i className="fa-solid fa-envelope text-muted" />
            {client.email ? <a href={`mailto:${client.email}`} className="hover:underline">{client.email}</a> : <span className="text-muted">No email</span>}
          </div>
          <div className={`${row} grid-cols-[24px_1fr]`}>
            <i className="fa-solid fa-phone text-muted" />
            {client.phone ? <a href={`tel:${client.phone}`} className="hover:underline">{client.phone}</a> : <span className="text-muted">No phone</span>}
          </div>
          {client.notes && (
            <div className={`${row} grid-cols-[24px_1fr] items-start`}>
              <i className="fa-solid fa-note-sticky pt-1 text-muted" />
              <p className="whitespace-pre-line">{client.notes}</p>
            </div>
          )}
        </div>
      </section>

      <div className="grid gap-10 md:grid-cols-2">
        <section>
          <h2 className={h2}>Projects ({projects.length})</h2>
          <div className="border-t-2 border-strong">
            {projects.length === 0 && <p className="py-6 text-muted">No projects yet.</p>}
            {projects.map((p, i) => (
              <div key={p._id} className={`${row} grid-cols-[1fr_auto]`} style={{ animationDelay: `${i * 60}ms` }}>
                <span>
                  {p.title}
                  <small className="block text-sm text-muted">{money(p.budget)}, deadline {fmtDate(p.deadline)}</small>
                </span>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className={h2}>Invoices ({invoices.length})</h2>
          <div className="border-t-2 border-strong">
            {invoices.length === 0 && <p className="py-6 text-muted">No invoices yet.</p>}
            {invoices.map((inv, i) => (
              <Link
                key={inv._id}
                to={`/invoices/${inv._id}`}
                className={`${row} grid-cols-[1fr_auto] transition-colors hover:bg-card/60`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span>
                  {inv.invoiceNumber}
                  <small className="block text-sm text-muted">Due {fmtDate(inv.dueDate)}</small>
                </span>
                <span className="flex items-center gap-3">
                  <StatusBadge status={inv.status} />
                  <b className="font-display font-semibold">{money(inv.amount)}</b>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}