import { money } from '../../utils/format';
import { MONTHS } from './EarningsChart';

// Grouped bars: what you invoiced each month next to what you actually received.
export default function BilledVsPaid({ data, year }) {
  const max = Math.max(...data.flatMap((d) => [d.billed, d.paid]), 1);
  const bar = 'w-full origin-bottom animate-grow rounded-t-[3px] min-h-[3px]';
  return (
    <section>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-xl font-semibold tracking-tight">Invoiced vs received in {year}</h2>
        <div className="flex gap-4 text-sm text-muted">
          <span className="flex items-center gap-1.5"><i className="size-2.5 rounded-sm bg-accent/30" />Invoiced</span>
          <span className="flex items-center gap-1.5"><i className="size-2.5 rounded-sm bg-accent" />Received</span>
        </div>
      </div>
      <div className="flex h-52 gap-2 border-b-2 border-strong">
        {MONTHS.map((m, i) => {
          const d = data.find((x) => x.month === i + 1) || { billed: 0, paid: 0 };
          return (
            <div
              key={`${year}-${m}`}
              className="flex h-full flex-1 items-end gap-0.5"
              title={`${m}: invoiced ${money(d.billed)}, received ${money(d.paid)}`}
            >
              <span className={`${bar} bg-accent/30`} style={{ height: `${(d.billed / max) * 100}%`, animationDelay: `${i * 40}ms` }} />
              <span className={`${bar} bg-accent`} style={{ height: `${(d.paid / max) * 100}%`, animationDelay: `${i * 40 + 60}ms` }} />
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 flex gap-2 text-xs text-muted">
        {MONTHS.map((m) => <span key={m} className="flex-1 text-center">{m}</span>)}
      </div>
    </section>
  );
}
