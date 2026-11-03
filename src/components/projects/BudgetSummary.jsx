import { money } from '../../utils/format';
import CountUp from '../ui/CountUp';
import BudgetBar from './BudgetBar';

const fmt = (n) => money(Math.round(n));

export default function BudgetSummary({ finance: f }) {
  const hasBudget = f.budget > 0;
  const stats = hasBudget
    ? [
        ['Budget', f.budget],
        ['Invoiced', f.invoiced],
        ['Paid', f.paid],
        ['Still to invoice', Math.max(f.remaining, 0)]
      ]
    : [
        ['Invoiced', f.invoiced],
        ['Paid', f.paid],
        ['Waiting for payment', f.outstanding]
      ];

  return (
    <section className="mb-9">
      <div className={`grid gap-6 border-t-2 border-ink pt-4 ${hasBudget ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3'}`}>
        {stats.map(([label, value]) => (
          <div key={label}>
            <p className="text-sm text-muted">{label}</p>
            <p className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              <CountUp value={value} format={fmt} />
            </p>
          </div>
        ))}
      </div>

      {hasBudget && (
        <div className="mt-5">
          <BudgetBar finance={f} />
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
            <span className="flex items-center gap-1.5"><i className="size-2.5 rounded-sm bg-emerald-600" />Paid</span>
            <span className="flex items-center gap-1.5"><i className="size-2.5 rounded-sm bg-gold" />Invoiced, not paid yet</span>
            <span className="flex items-center gap-1.5"><i className="size-2.5 rounded-sm bg-desk ring-1 ring-rule" />Not invoiced yet</span>
          </div>
        </div>
      )}

      <p className="mt-4 max-w-2xl text-sm text-muted">
        {!hasBudget
          ? 'This project has no budget, so invoices can be any amount. Add a budget to track how much is left to invoice.'
          : f.remaining > 0
            ? `Every invoice on this project counts against the budget. You can invoice up to ${money(f.remaining)} more.`
            : 'The budget is fully invoiced. Raise the budget if there is more work to bill.'}
      </p>
    </section>
  );
}
