import { useEffect, useState } from 'react';
import { getClients } from '../../api/clientApi';
import { getProjects } from '../../api/projectApi';
import { money, round2 } from '../../utils/format';
import { Input, Select } from '../ui/Fields';
import FormActions from '../ui/FormActions';
import Alert from '../ui/Alert';

export const INVOICE_STATUSES = ['pending', 'paid', 'overdue'];
const SHARES = [25, 50, 100];

export default function InvoiceForm({ initial = {}, onSubmit, onCancel, error }) {
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [v, setV] = useState({
    client: initial.client?._id || '',
    project: initial.project?._id || '',
    amount: initial.amount ?? '',
    status: initial.status || 'pending',
    dueDate: initial.dueDate ? initial.dueDate.slice(0, 10) : ''
  });
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });

  useEffect(() => { getClients({ limit: 100 }).then((d) => setClients(d.items)); }, []);

  // Only show projects of the chosen client (each one comes with its budget figures)
  useEffect(() => {
    if (!v.client) return setProjects([]);
    getProjects({ client: v.client, limit: 100 }).then((d) => setProjects(d.items));
  }, [v.client]);

  // Budget maths. When editing an invoice, its own old amount is already counted as "invoiced",
  // so it is added back to what is available.
  const selected = projects.find((p) => p._id === v.project);
  const f = selected?.finance;
  const hasBudget = f?.budget > 0;
  const own = initial._id && initial.project?._id === v.project ? Number(initial.amount) || 0 : 0;
  const available = hasBudget ? round2(f.remaining + own) : null;
  const amount = Number(v.amount);
  const over = hasBudget && amount > available + 0.001;

  // Choosing a project with a budget fills in the price: the budget that is still free to invoice.
  const chooseProject = (e) => {
    const project = projects.find((p) => p._id === e.target.value);
    const free = project?.finance?.budget > 0 ? project.finance.remaining : null;
    setV({ ...v, project: e.target.value, amount: free > 0 ? free : v.amount });
  };

  const submit = (e) => {
    e.preventDefault();
    const payload = { client: v.client, amount: amount, status: v.status, dueDate: v.dueDate };
    if (v.project) payload.project = v.project;
    onSubmit(payload);
  };

  return (
    <form onSubmit={submit} className="grid gap-3.5">
      {initial.invoiceNumber ? (
        <Input label="Invoice number" value={initial.invoiceNumber} disabled readOnly />
      ) : (
        <p className="rounded-md bg-desk px-3 py-2 text-sm text-muted">
          <i className="fa-solid fa-hashtag mr-2" />
          The invoice number (like INV-0001) is created automatically when you save.
        </p>
      )}

      <Select label="Client" value={v.client} onChange={(e) => setV({ ...v, client: e.target.value, project: '' })} required>
        <option value="">Choose a client</option>
        {clients.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
      </Select>

      <Select label="Project (optional)" value={v.project} onChange={chooseProject} disabled={!v.client}>
        <option value="">None</option>
        {projects.map((p) => (
          <option key={p._id} value={p._id}>
            {p.title}{p.finance.budget > 0 ? ` (${money(p.finance.remaining)} left)` : ''}
          </option>
        ))}
      </Select>

      {selected && hasBudget && (
        <div className="rounded-md bg-desk px-3.5 py-3 text-sm">
          <div className="flex justify-between gap-3"><span className="text-muted">Project budget</span><b>{money(f.budget)}</b></div>
          <div className="flex justify-between gap-3"><span className="text-muted">Already invoiced</span><b>{money(round2(f.invoiced - own))}</b></div>
          <div className="flex justify-between gap-3"><span className="text-muted">Available for this invoice</span><b>{money(available)}</b></div>
          {available > 0 && (
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <span className="text-muted">Bill</span>
              {SHARES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setV({ ...v, amount: round2((available * s) / 100) })}
                  className="cursor-pointer rounded-full border border-ink/25 bg-white px-3 py-0.5 font-semibold transition-colors hover:bg-ink hover:text-white"
                >
                  {s === 100 ? 'All' : `${s}%`}
                </button>
              ))}
              <span className="text-muted">of what is left</span>
            </div>
          )}
        </div>
      )}
      {selected && !hasBudget && (
        <p className="rounded-md bg-desk px-3 py-2 text-sm text-muted">This project has no budget, so any amount is accepted.</p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input label="Amount" type="number" min="0.01" step="any" value={v.amount} onChange={set('amount')} required />
        <Input label="Due date" type="date" value={v.dueDate} onChange={set('dueDate')} required />
      </div>

      {over && (
        <Alert>
          That is {money(round2(amount - available))} over the project budget ({money(available)} available). Lower the
          amount, or raise the budget on the project first.
        </Alert>
      )}
      {hasBudget && available <= 0 && !over && (
        <Alert>This project&apos;s budget is fully invoiced. Raise the budget before adding another invoice.</Alert>
      )}

      <Select label="Status" value={v.status} onChange={set('status')}>
        {INVOICE_STATUSES.map((s) => <option key={s}>{s}</option>)}
      </Select>
      {error && <Alert>{error}</Alert>}
      <FormActions onCancel={onCancel} label="Save invoice" disabled={Boolean(over) || (hasBudget && available <= 0)} />
    </form>
  );
}
