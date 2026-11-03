const tones = {
  paid: 'bg-emerald-100 text-emerald-800',
  completed: 'bg-emerald-100 text-emerald-800',
  pending: 'bg-amber-100 text-amber-900',
  lead: 'bg-amber-100 text-amber-900',
  'in-progress': 'bg-sky-100 text-sky-900',
  overdue: 'bg-red-100 text-red-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function StatusBadge({ status }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-sm font-semibold ${tones[status] || 'bg-desk'}`}>{status}</span>
  );
}
