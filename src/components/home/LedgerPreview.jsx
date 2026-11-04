import { money } from '../../utils/format';
import CountUp from '../ui/CountUp';

const rows = [
  { label: 'Received', count: 3, total: 2400, icon: 'fa-circle-check', tone: 'text-emerald-700' },
  { label: 'Waiting to be paid', count: 2, total: 1150, icon: 'fa-clock', tone: 'text-gold' },
  { label: 'Overdue', count: 1, total: 300, icon: 'fa-triangle-exclamation', tone: 'text-margin' }
];

const owing = [
  { name: 'Ayesha Textiles', total: 850, due: '15 Nov' },
  { name: 'Northwind Studio', total: 600, due: '28 Nov' }
];

const line = 'grid animate-rise grid-cols-[24px_1fr_auto] items-center gap-3 border-b border-rule py-3';
const fmt = (n) => money(Math.round(n));

export default function LedgerPreview() {
  return (
    <div
      role="img"
      aria-label="Sample ledger page showing received, pending and overdue totals and who still owes money"
      className="relative rounded-sm bg-paper py-8 pr-7 pl-16 shadow-[0_1px_0_var(--color-rule),0_18px_40px_-20px_color-mix(in_oklab,var(--color-ink)_55%,transparent)] before:absolute before:inset-y-0 before:left-10 before:w-0.5 before:bg-margin/70 before:content-[''] max-md:pl-14 md:rotate-[1.2deg]"
    >
      <p className="mb-3 text-sm text-muted">Sample ledger</p>
      <div className="border-t-2 border-strong">
        {rows.map((r, i) => (
          <div key={r.label} className={line} style={{ animationDelay: `${300 + i * 120}ms` }}>
            <i className={`fa-solid ${r.icon} ${r.tone}`} />
            <span>
              {r.label}
              <small className="block text-sm text-muted">{r.count} invoices</small>
            </span>
            <b className={`font-display text-xl font-semibold ${r.label === 'Overdue' ? 'text-margin' : ''}`}>
              <CountUp value={r.total} format={fmt} />
            </b>
          </div>
        ))}
      </div>
      <h3 className="mt-6 mb-1 animate-rise font-display text-lg font-semibold" style={{ animationDelay: '700ms' }}>
        Who still owes you
      </h3>
      {owing.map((o, i) => (
        <div key={o.name} className={line} style={{ animationDelay: `${800 + i * 120}ms` }}>
          <i className="fa-solid fa-hand-holding-dollar text-muted" />
          <span>
            {o.name}
            <small className="block text-sm text-muted">Next due {o.due}</small>
          </span>
          <b className="font-display text-xl font-semibold"><CountUp value={o.total} format={fmt} /></b>
        </div>
      ))}
    </div>
  );
}
