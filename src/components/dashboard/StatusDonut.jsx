import { money } from '../../utils/format';
import CountUp from '../ui/CountUp';

const R = 52;
const C = 2 * Math.PI * R;
const parts = [
  { key: 'paid', label: 'Received', color: '#047857' },
  { key: 'pending', label: 'Waiting', color: 'var(--color-gold)' },
  { key: 'overdue', label: 'Overdue', color: 'var(--color-margin)' }
];
const fmt = (n) => money(Math.round(n));

// Donut of invoice amounts by status. Segments animate when the data arrives.
export default function StatusDonut({ summary }) {
  const by = (k) => summary.find((s) => s._id === k)?.total || 0;
  const total = parts.reduce((sum, p) => sum + by(p.key), 0);

  let acc = 0;
  const segs = parts.map((p) => {
    const value = by(p.key);
    const len = total ? (value / total) * C : 0;
    const seg = { ...p, value, len, offset: -acc };
    acc += len;
    return seg;
  });

  return (
    <section>
      <h2 className="mb-3 font-display text-xl font-semibold tracking-tight">Invoices by status</h2>
      <div className="relative mx-auto size-44">
        <svg viewBox="0 0 140 140" className="size-full -rotate-90" role="img" aria-label="Invoice amounts by status">
          <circle cx="70" cy="70" r={R} fill="none" strokeWidth="18" className="stroke-desk" />
          {segs.map((s) => (
            <circle
              key={s.key}
              cx="70"
              cy="70"
              r={R}
              fill="none"
              strokeWidth="18"
              strokeDasharray={`${s.len} ${C - s.len}`}
              strokeDashoffset={s.offset}
              style={{ stroke: s.color }}
              className="transition-[stroke-dasharray] duration-1000 ease-out motion-reduce:transition-none"
            />
          ))}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-xs text-muted">Total billed</p>
            <b className="font-display text-xl font-semibold"><CountUp value={total} format={fmt} /></b>
          </div>
        </div>
      </div>
      <div className="mt-4 border-t-2 border-strong">
        {segs.map((s) => (
          <div key={s.key} className="grid grid-cols-[14px_1fr_auto] items-center gap-3 border-b border-rule py-2.5">
            <i className="size-3 rounded-sm" style={{ background: s.color }} />
            <span>{s.label}</span>
            <span className="text-sm">
              <b className="font-display font-semibold">{money(s.value)}</b>
              <span className="ml-2 text-muted">{total ? Math.round((s.value / total) * 100) : 0}%</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
