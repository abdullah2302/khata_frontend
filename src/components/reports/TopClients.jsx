import { money } from '../../utils/format';
import BarRow from './BarRow';

export default function TopClients({ items }) {
  const max = Math.max(...items.map((i) => i.total), 1);
  return (
    <section>
      <h2 className="mb-3 font-display text-xl font-semibold tracking-tight">Top clients by revenue</h2>
      {items.length === 0 ? (
        <p className="py-6 text-muted">Paid invoices will show your best clients here.</p>
      ) : (
        <div className="border-t-2 border-strong">
          {items.map((c, i) => (
            <BarRow key={c.clientId} label={c.clientName} value={money(c.total)} pct={(c.total / max) * 100} delay={i * 90} />
          ))}
        </div>
      )}
    </section>
  );
}
