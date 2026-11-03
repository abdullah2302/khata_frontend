import { money, fmtDate } from '../../utils/format';

export default function OwingList({ items }) {
  return (
    <section>
      <h2 className="mb-3 font-display text-xl font-semibold tracking-tight">Who still owes you</h2>
      {items.length === 0 ? (
        <p className="py-6 text-muted">Nobody owes you anything. Add an invoice to start tracking.</p>
      ) : (
        items.map((o, i) => (
          <div
            key={o.clientId}
            className="grid animate-rise grid-cols-[24px_1fr_auto] items-center gap-3 border-b border-rule py-3.5"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <i className="fa-solid fa-hand-holding-dollar text-muted" />
            <span>
              {o.clientName}
              <small className="block text-sm text-muted">{o.invoices} unpaid, next due {fmtDate(o.nextDue)}</small>
            </span>
            <b className="font-display text-xl font-semibold">{money(o.totalPending)}</b>
          </div>
        ))
      )}
    </section>
  );
}
