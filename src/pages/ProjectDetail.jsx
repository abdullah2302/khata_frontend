import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProject, updateProject, setProjectStatus } from '../api/projectApi';
import { createInvoice } from '../api/invoiceApi';
import { useToast } from '../context/ToastContext';
import { errorMessage, fmtDate, money } from '../utils/format';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Alert from '../components/ui/Alert';
import StatusBadge from '../components/ui/StatusBadge';
import TableSkeleton from '../components/ui/TableSkeleton';
import BudgetSummary from '../components/projects/BudgetSummary';
import DeadlineBadge from '../components/projects/DeadlineBadge';
import TaskList from '../components/projects/TaskList';
import InvoiceForm from '../components/forms/InvoiceForm';
import ProjectForm, { PROJECT_STATUSES } from '../components/forms/ProjectForm';

export default function ProjectDetail() {
  const { id } = useParams();
  const toast = useToast();
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null); // 'invoice' | 'edit' | null
  const [formError, setFormError] = useState('');

  const load = useCallback(() => getProject(id).then(setProject).catch((e) => setError(errorMessage(e))), [id]);
  useEffect(() => { load(); }, [load]);

  const open = (name) => { setFormError(''); setModal(name); };

  const back = (
    <Link to="/projects" className="mb-4 inline-block text-muted hover:text-ink">
      <i className="fa-solid fa-arrow-left mr-1.5" />
      Projects
    </Link>
  );

  if (error) return <>{back}<Alert>{error}</Alert></>;
  if (!project) return <>{back}<TableSkeleton rows={4} /></>;

  const f = project.finance;
  const fullyInvoiced = f.budget > 0 && f.remaining <= 0;
  // The new invoice starts with the price set to what is still free in the budget
  const invoiceDefaults = { client: project.client, project: { _id: project._id }, amount: f.remaining > 0 ? f.remaining : '' };

  const saveInvoice = async (values) => {
    try {
      const created = await createInvoice(values);
      toast.success(`${created.invoiceNumber} created`);
      setModal(null);
      load();
    } catch (e) { setFormError(errorMessage(e)); }
  };

  const saveProject = async (values) => {
    try {
      await updateProject(id, values);
      toast.success('Project updated');
      setModal(null);
      load();
    } catch (e) { setFormError(errorMessage(e)); }
  };

  const changeStatus = async (status) => {
    try { await setProjectStatus(id, status); toast.success('Status updated'); load(); }
    catch (e) { toast.error(errorMessage(e)); }
  };

  return (
    <>
      {back}
      <PageHeader
        title={project.title}
        subtitle={project.client ? <Link to={`/clients/${project.client._id}`} className="hover:underline">{project.client.name}</Link> : null}
        action={
          <div className="flex flex-wrap gap-2.5">
            <Button variant="ghost" icon="fa-pen" onClick={() => open('edit')}>Edit</Button>
            <Button icon="fa-file-invoice-dollar" onClick={() => open('invoice')} disabled={fullyInvoiced} title={fullyInvoiced ? 'The budget is fully invoiced' : undefined}>
              New invoice
            </Button>
          </div>
        }
      />

      <div className="mb-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
        <label className="flex items-center gap-2">
          <span className="text-muted">Status</span>
          <select value={project.status} onChange={(e) => changeStatus(e.target.value)} className="rounded-md border border-rule bg-white px-2 py-1.5">
            {PROJECT_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <span className="flex items-center gap-2"><span className="text-muted">Deadline</span><DeadlineBadge date={project.deadline} status={project.status} /></span>
        <StatusBadge status={project.status} />
      </div>

      {project.description && <p className="mb-8 max-w-2xl whitespace-pre-line text-muted">{project.description}</p>}

      <BudgetSummary finance={f} />

      <div className="grid gap-10 lg:grid-cols-2">
        <TaskList projectId={project._id} tasks={project.tasks || []} onChange={(tasks) => setProject((p) => ({ ...p, tasks }))} />

        <section>
          <h2 className="mb-3 font-display text-xl font-semibold tracking-tight">Invoices ({project.invoices.length})</h2>
          <div className="border-t-2 border-ink">
            {project.invoices.length === 0 && <p className="py-5 text-muted">No invoices yet. Use New invoice to bill this project.</p>}
            {project.invoices.map((inv, i) => (
              <Link
                key={inv._id}
                to={`/invoices/${inv._id}`}
                className="flex animate-rise items-center justify-between gap-3 border-b border-rule py-3.5 transition-colors hover:bg-white/60"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="min-w-0">
                  <span className="font-semibold">{inv.invoiceNumber}</span>
                  <small className="block text-sm text-muted">Due {fmtDate(inv.dueDate)}</small>
                </span>
                <span className="flex shrink-0 items-center gap-3">
                  <StatusBadge status={inv.status} />
                  <b className="font-display font-semibold">{money(inv.amount)}</b>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {modal === 'invoice' && (
        <Modal title="New invoice" onClose={() => setModal(null)}>
          <InvoiceForm initial={invoiceDefaults} onSubmit={saveInvoice} onCancel={() => setModal(null)} error={formError} />
        </Modal>
      )}
      {modal === 'edit' && (
        <Modal title="Edit project" onClose={() => setModal(null)}>
          <ProjectForm initial={project} onSubmit={saveProject} onCancel={() => setModal(null)} error={formError} />
        </Modal>
      )}
    </>
  );
}
