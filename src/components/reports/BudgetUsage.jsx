import { Link } from 'react-router-dom';
import { useBudgetUsage } from '../../hooks/useStats';
import StatusBadge from '../ui/StatusBadge';
import BudgetBar from '../projects/BudgetBar';

// Budget vs invoiced for the projects with the biggest budgets.
export default function BudgetUsage() {
  const items = useBudgetUsage().data?.items ?? [];

  return (
    <section>
      <h2 className="mb-3 font-display text-xl font-semibold tracking-tight">Budget vs invoiced by project</h2>
      {items.length === 0 ? (
        <p className="py-6 text-muted">Add a budget to a project to see how much of it has been invoiced.</p>
      ) : (
        <div className="border-t-2 border-strong">
          {items.map((i, n) => (
            <Link
              key={i.projectId}
              to={`/projects/${i.projectId}`}
              className="block animate-rise border-b border-rule py-3.5 transition-colors hover:bg-card/60"
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