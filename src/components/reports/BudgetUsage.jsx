import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBudgetUsage } from '../../api/statsApi';
import StatusBadge from '../ui/StatusBadge';
import BudgetBar from '../projects/BudgetBar';

// Budget vs invoiced for the projects with the biggest budgets.
export default function BudgetUsage() {
  const [items, setItems] = useState([]);
  useEffect(() => { getBudgetUsage().then((d) => setItems(d.items)).catch(() => {}); }, []);

  return (
    <section>
      <h2 className="mb-3 font-display text-xl font-semibold tracking-tight">Budget vs invoiced by project</h2>
      {items.length === 0 ? (
        <p className="py-6 text-muted">Add a budget to a project to see how much of it has been invoiced.</p>
      ) : (
        <div className="border-t-2 border-ink">
          {items.map((i, n) => (
            <Link
              key={i.projectId}
              to={`/projects/${i.projectId}`}
              className="block animate-rise border-b border-rule py-3.5 transition-colors hover:bg-white/60"
              style={{ animationDelay: `${n * 60}ms` }}
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="min-w-0 font-semibold">
                  {i.title}
                  <span className="ml-2 font-normal text-muted">{i.clientName}</span>
                </span>
                <StatusBadge status={i.status} />
              </div>
              <BudgetBar finance={i} />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
