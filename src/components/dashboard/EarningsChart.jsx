import { money } from '../../utils/format';

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function EarningsChart({ data, year }) {
  const series = MONTHS.map((m, i) => ({ m, total: data.find((d) => d.month === i + 1)?.total || 0 }));
  const max = Math.max(...series.map((s) => s.total), 1);
  return (
    <section>
      <h2 className="mb-3 font-display text-xl font-semibold tracking-tight">Earned each month in {year}</h2>
      <div className="flex h-48 gap-1.5 border-b-2 border-ink">
        {series.map((s, i) => (
          <div key={`${year}-${s.m}`} className="flex h-full flex-1 items-end" title={`${s.m}: ${money(s.total)}`}>
            <span
              className="min-h-[3px] w-full origin-bottom animate-grow rounded-t-[3px] bg-ink"
              style={{ height: `${(s.total / max) * 100}%`, animationDelay: `${i * 45}ms` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex gap-1.5 text-xs text-muted">
        {MONTHS.map((m) => <span key={m} className="flex-1 text-center">{m}</span>)}
      </div>
    </section>
  );
}
