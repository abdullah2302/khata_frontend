import { Link } from 'react-router-dom';
import { money, fmtDate, fromNow } from '../../utils/format';

export default function DueSoon({ items }) {
  return (
    <section className="mt-10">
      <h2 className="mb-3 font-display text-xl font-semibold tracking-tight">Due in the next two weeks</h2>
      {items.length === 0 ? (
        <p className="py-6 text-muted">No pending invoices are due soon.</p>
      ) : (
        <div className="border-t-2 border-strong">
          {items.map((i, n) => (
            <Link
              key={i._id}
              to={`/invoices/${i._id}`}
              className="grid animate-rise grid-cols-[24px_1fr_auto] items-center gap-3 border-b border-rule py-3.5 transition-colors hover:bg-card/60"
              style={{ animationDelay: `${n * 70}ms` }}
            >
              <i className="fa-solid fa-calendar-day text-gold" />
              <span>
                {i.invoiceNumber} for {i.client?.name}
                <small className="block text-sm text-muted">Due {fromNow(i.dueDate)}, {fmtDate(i.dueDate)}</small>
              </span>
              <b className="font-display text-xl font-semibold">{money(i.amount)}</b>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
