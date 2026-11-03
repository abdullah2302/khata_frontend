import StatusBadge from '../ui/StatusBadge';
import BarRow from './BarRow';

const colors = {
  lead: 'bg-amber-400',
  'in-progress': 'bg-sky-500',
  completed: 'bg-emerald-600',
  cancelled: 'bg-red-400'
};

export default function ProjectStatusBars({ items }) {
  const max = Math.max(...items.map((i) => i.count), 1);
  return (
    <section>
      <h2 className="mb-3 font-display text-xl font-semibold tracking-tight">Projects by status</h2>
      {items.length === 0 ? (
        <p className="py-6 text-muted">Create a project to see the split here.</p>
      ) : (
        <div className="border-t-2 border-ink">
          {items.map((s, i) => (
            <BarRow
              key={s._id}
              label={<StatusBadge status={s._id} />}
              value={`${s.count} ${s.count === 1 ? 'project' : 'projects'}`}
              pct={(s.count / max) * 100}
              color={colors[s._id]}
              delay={i * 90}
            />
          ))}
        </div>
      )}
    </section>
  );
}
