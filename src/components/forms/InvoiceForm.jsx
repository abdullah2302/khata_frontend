import { useEffect, useState } from 'react';
import { getClients } from '../../api/clientApi';
import { getProjects } from '../../api/projectApi';
import { Input, Select } from '../ui/Fields';
import FormActions from '../ui/FormActions';
import Alert from '../ui/Alert';

export const INVOICE_STATUSES = ['pending', 'paid', 'overdue'];

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

  // Only show projects that belong to the chosen client
  useEffect(() => {
    if (!v.client) return setProjects([]);
    getProjects({ client: v.client, limit: 100 }).then((d) => setProjects(d.items));
  }, [v.client]);

  const submit = (e) => {
    e.preventDefault();
    const payload = { client: v.client, amount: Number(v.amount), status: v.status, dueDate: v.dueDate };
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
      <Select label="Project (optional)" value={v.project} onChange={set('project')} disabled={!v.client}>
        <option value="">None</option>
        {projects.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
      </Select>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Amount" type="number" min="0" step="any" value={v.amount} onChange={set('amount')} required />
        <Input label="Due date" type="date" value={v.dueDate} onChange={set('dueDate')} required />
      </div>
      <Select label="Status" value={v.status} onChange={set('status')}>
        {INVOICE_STATUSES.map((s) => <option key={s}>{s}</option>)}
      </Select>
      {error && <Alert>{error}</Alert>}
      <FormActions onCancel={onCancel} label="Save invoice" />
    </form>
  );
}
