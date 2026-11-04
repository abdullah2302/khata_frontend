import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, setProjectStatus } from '../../api/projectApi';
import { useToast } from '../../context/ToastContext';
import useDebounce from '../../hooks/useDebounce';
import { errorMessage } from '../../utils/format';
import BudgetBar from './BudgetBar';
import DeadlineBadge from './DeadlineBadge';
import TableSkeleton from '../ui/TableSkeleton';
import Alert from '../ui/Alert';

const columns = [
  { id: 'lead', label: 'Leads', icon: 'fa-seedling', bar: 'border-amber-400' },
  { id: 'in-progress', label: 'In progress', icon: 'fa-hammer', bar: 'border-sky-500' },
  { id: 'completed', label: 'Completed', icon: 'fa-circle-check', bar: 'border-emerald-600' },
  { id: 'cancelled', label: 'Cancelled', icon: 'fa-ban', bar: 'border-red-400' }
];

// Kanban view: drag a card to another column to change its status.
// Every card also has a dropdown, so touch screens and keyboards work too.
export default function ProjectBoard({ search }) {
  const toast = useToast();
  const query = useDebounce(search);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [over, setOver] = useState('');

  useEffect(() => {
    setLoading(true);
    getProjects({ limit: 100, search: query || undefined })
      .then((d) => { setProjects(d.items); setError(''); })
      .catch(() => setError('Could not load projects.'))
      .finally(() => setLoading(false));
  }, [query]);

  const move = async (project, status) => {
    if (project.status === status) return;
    const previous = projects;
    setProjects((list) => list.map((p) => (p._id === project._id ? { ...p, status } : p)));
    try {
      await setProjectStatus(project._id, status);
      toast.success(`${project.title} moved to ${columns.find((c) => c.id === status).label.toLowerCase()}`);
    } catch (e) {
      setProjects(previous);
      toast.error(errorMessage(e));
    }
  };

  const drop = (e, status) => {
    e.preventDefault();
    setOver('');
    const project = projects.find((p) => p._id === e.dataTransfer.getData('text/plain'));
    if (project) move(project, status);
  };

  if (loading && !projects.length) return <TableSkeleton />;

  return (
    <>
      {error && <Alert>{error}</Alert>}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((col) => {
          const items = projects.filter((p) => p.status === col.id);
          return (
            <section
              key={col.id}
              onDragOver={(e) => { e.preventDefault(); setOver(col.id); }}
              onDragLeave={() => setOver((o) => (o === col.id ? '' : o))}
              onDrop={(e) => drop(e, col.id)}
              aria-label={col.label}
              className={`rounded-md border-t-4 bg-desk/60 p-3 transition-shadow ${col.bar} ${over === col.id ? 'ring-2 ring-gold' : ''}`}
            >
              <h3 className="mb-3 flex items-center gap-2 font-display font-semibold">
                <i className={`fa-solid ${col.icon} text-muted`} />
                {col.label}
                <span className="ml-auto rounded-full bg-card/70 px-2 text-sm text-muted">{items.length}</span>
              </h3>

              <div className="grid gap-3">
                {items.length === 0 && <p className="rounded-md border border-dashed border-rule p-4 text-center text-sm text-muted">Drop projects here</p>}
                {items.map((p) => (
                  <article
                    key={p._id}
                    draggable
                    onDragStart={(e) => { e.dataTransfer.setData('text/plain', p._id); e.dataTransfer.effectAllowed = 'move'; }}
                    className="animate-pop cursor-grab rounded-md border border-rule bg-card p-3.5 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing"
                  >
                    <Link to={`/projects/${p._id}`} className="font-semibold hover:underline">{p.title}</Link>
                    <p className="text-sm text-muted">{p.client?.name}</p>
                    <div className="mt-2.5"><BudgetBar finance={p.finance} compact /></div>
                    {p.progress !== null && (
                      <div className="mt-2.5">
                        <div className="h-1.5 overflow-hidden rounded-full bg-desk">
                          <div className="h-full rounded-full bg-sky-500 transition-all duration-500" style={{ width: `${p.progress}%` }} />
                        </div>
                        <p className="mt-1 text-xs text-muted">{p.progress}% of tasks done</p>
                      </div>
                    )}
                    <div className="mt-3 flex items-end justify-between gap-2 text-sm">
                      <DeadlineBadge date={p.deadline} status={p.status} />
                      <select
                        value={p.status}
                        onChange={(e) => move(p, e.target.value)}
                        aria-label={`Move ${p.title}`}
                        className="rounded-md border border-rule bg-card px-1.5 py-1 text-xs"
                      >
                        {columns.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                      </select>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
