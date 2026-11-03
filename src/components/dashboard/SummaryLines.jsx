import { money } from '../../utils/format';
import CountUp from '../ui/CountUp';

const rows = [
  { key: 'paid', label: 'Received', icon: 'fa-circle-check', tone: 'text-emerald-700' },
  { key: 'pending', label: 'Waiting to be paid', icon: 'fa-clock', tone: 'text-gold' },
  { key: 'overdue', label: 'Overdue', icon: 'fa-triangle-exclamation', tone: 'text-margin' }
];
const fmt = (n) => money(Math.round(n));

export default function SummaryLines({ summary }) {
  const by = (k) => summary.find((s) => s._id === k) || { total: 0, count: 0 };
  return (
    <section className="mb-9 border-t-2 border-ink">
      {rows.map((r) => (
        <div key={r.key} className="grid grid-cols-[24px_1fr_auto] items-center gap-3 border-b border-rule py-3.5">
          <i className={`fa-solid ${r.icon} ${r.tone}`} />
          <span>
            {r.label}
            <small className="block text-sm text-muted">{by(r.key).count} invoices</small>
          </span>
          <b className={`font-display text-xl font-semibold ${r.key === 'overdue' ? 'text-margin' : ''}`}>
            <CountUp value={by(r.key).total} format={fmt} />
          </b>
        </div>
      ))}
    </section>
  );
}
