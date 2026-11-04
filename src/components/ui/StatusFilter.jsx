export default function StatusFilter({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Filter by status"
      className="rounded-md border border-rule bg-card px-3 py-2"
    >
      <option value="">All statuses</option>
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
}
