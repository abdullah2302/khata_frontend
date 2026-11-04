export default function BarRow({ label, value, pct, color = 'bg-accent', delay = 0 }) {
  return (
    <div className="border-b border-rule py-3">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span>{label}</span>
        <b className="font-display font-semibold">{value}</b>
      </div>
      <div className="h-2.5 rounded-sm bg-desk">
        <div
          className={`h-full origin-left animate-growx rounded-sm ${color}`}
          style={{ width: `${pct}%`, animationDelay: `${delay}ms` }}
        />
      </div>
    </div>
  );
}
