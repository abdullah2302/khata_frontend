import { money } from '../../utils/format';

// How much of a project's budget is paid, invoiced but unpaid, and still free to invoice.
export default function BudgetBar({ finance: f, compact = false }) {
  if (!f.budget) {
    return (
      <span className="text-sm text-muted">
        {f.invoiced ? `${money(f.invoiced)} invoiced, no budget set` : 'No budget set'}
      </span>
    );
  }
  const pct = (n) => Math.min((n / f.budget) * 100, 100);
  const paid = pct(f.paid);
  const unpaid = Math.min(pct(f.outstanding), 100 - paid);
  const over = f.invoiced > f.budget;

  return (
    <div className={compact ? 'min-w-40' : ''}>
      <div
        className="flex h-2.5 overflow-hidden rounded-full bg-desk"
        role="img"
        aria-label={`${f.percentInvoiced}% of the budget invoiced, ${money(f.paid)} paid`}
      >
        <span className="h-full origin-left animate-growx bg-emerald-600" style={{ width: `${paid}%` }} />
        <span
          className={`h-full origin-left animate-growx ${over ? 'bg-margin' : 'bg-gold'}`}
          style={{ width: `${unpaid}%`, animationDelay: '150ms' }}
        />
      </div>
      <p className="mt-1 text-xs text-muted">
        {money(f.invoiced)} of {money(f.budget)} invoiced{over ? ' (over budget)' : ''}
      </p>
    </div>
  );
}
